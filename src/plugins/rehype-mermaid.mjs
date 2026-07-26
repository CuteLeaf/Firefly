import { readFile } from "node:fs/promises";
import { assertSafeSvgForDom, initMerman, renderSvg } from "@mermanjs/web";
import { h } from "hastscript";
import { visit } from "unist-util-visit";
import {
	DIAGRAM_CONTAINER,
	DIAGRAM_WRAPPER,
	MERMAID_CONTAINER,
	MERMAID_ERROR,
	MERMAID_FALLBACK_CODE,
	MERMAID_SVG_DARK,
	MERMAID_SVG_LIGHT,
	MERMAID_WRAPPER,
} from "./utils/diagramConstants.js";
import { extractText } from "./utils/extractText.js";

const mermanWasmUrl = import.meta.resolve(
	"@mermanjs/web/pkg/merman_wasm_bg.wasm",
);
await initMerman({
	wasm: {
		module_or_path: await readFile(new URL(mermanWasmUrl)),
	},
});

/**
 * 在构建时将 Mermaid 源码渲染为浅色和深色两套静态 SVG
 *
 * @param {string} mermaidCode - Mermaid 图表源码
 * @param {object} themeConfig - { lightTheme, darkTheme } 主题名
 * @param {number} diagramIndex - 当前文档中的图表序号
 * @returns {{ lightSvg: string, darkSvg: string }}
 */
/**
 * 移除 SVG 内联 style 中的 max-width 限制，
 * 使图表能根据容器宽度自适应缩放
 */
function removeSvgMaxWidth(svg) {
	return svg.replace(/(<svg[^>]*style="[^"]*?)max-width:\s*[^;]+;?/, "$1");
}

function buildMermaidSvgs(mermaidCode, themeConfig, diagramIndex) {
	const lightSvg = renderSvg(mermaidCode, {
		host_theme: { preset: themeConfig.lightTheme },
		svg: {
			diagram_id: `mermaid-${diagramIndex}-light`,
			pipeline: "parity",
		},
	});
	const darkSvg = renderSvg(mermaidCode, {
		host_theme: { preset: themeConfig.darkTheme },
		svg: {
			diagram_id: `mermaid-${diagramIndex}-dark`,
			pipeline: "parity",
		},
	});

	assertSafeSvgForDom(lightSvg);
	assertSafeSvgForDom(darkSvg);

	return {
		lightSvg: removeSvgMaxWidth(lightSvg),
		darkSvg: removeSvgMaxWidth(darkSvg),
	};
}

/**
 * @param {object} [options] - 配置选项
 * @param {string} [options.lightTheme] - 亮色主题名
 * @param {string} [options.darkTheme] - 暗色主题名
 */
export function rehypeMermaid(options = {}) {
	const themeConfig = {
		lightTheme: options.lightTheme || "editor-light",
		darkTheme: options.darkTheme || "editor-dark",
	};

	return (tree) => {
		let diagramIndex = 0;

		visit(tree, "element", (node) => {
			if (
				node.tagName !== "div" ||
				!node.properties?.className?.includes("mermaid-container")
			) {
				return;
			}

			// 优先使用 data-mermaid-code 属性，为空时从子节点文本提取（MDX 兼容）
			let mermaidCode = node.properties["data-mermaid-code"] || "";
			if (!mermaidCode) {
				mermaidCode = extractText(node).trim();
			}

			let lightSvg;
			let darkSvg;
			try {
				({ lightSvg, darkSvg } = buildMermaidSvgs(
					mermaidCode,
					themeConfig,
					diagramIndex,
				));
				diagramIndex += 1;
			} catch (e) {
				const preview =
					mermaidCode.length > 200
						? `${mermaidCode.slice(0, 200)}…[truncated]`
						: mermaidCode;
				if (process.env.NODE_ENV === "development") {
					console.error("[rehype-mermaid] 渲染失败:", e, preview);
				} else {
					console.error(
						"[rehype-mermaid] 渲染失败:",
						e instanceof Error ? e.message : String(e),
					);
				}
				node.properties = {
					class: `${DIAGRAM_CONTAINER} ${MERMAID_CONTAINER}`,
				};
				node.children = [
					h("div", { class: MERMAID_ERROR }, [
						h("p", {}, "Mermaid 图表渲染失败，请检查图表语法是否正确"),
						h("pre", { class: MERMAID_FALLBACK_CODE }, mermaidCode),
					]),
				];
				return;
			}

			// 替换为静态 SVG（浅色 + 深色双版本，CSS 控制显示）
			node.properties = { class: `${DIAGRAM_CONTAINER} ${MERMAID_CONTAINER}` };
			node.children = [
				h("div", { class: `${DIAGRAM_WRAPPER} ${MERMAID_WRAPPER}` }, [
					h("div", { class: MERMAID_SVG_LIGHT }, [
						{ type: "raw", value: lightSvg },
					]),
					h("div", { class: MERMAID_SVG_DARK }, [
						{ type: "raw", value: darkSvg },
					]),
				]),
			];
		});
	};
}
