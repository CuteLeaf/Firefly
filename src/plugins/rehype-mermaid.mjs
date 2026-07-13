import { renderMermaidSVG, THEMES } from "beautiful-mermaid";
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

/**
 * 在构建时将 Mermaid 源码渲染为浅色和深色两套静态 SVG
 *
 * @param {string} mermaidCode - Mermaid 图表源码
 * @param {object} themeConfig - { lightTheme, darkTheme } 主题名
 * @returns {{ lightSvg: string, darkSvg: string }}
 */
function buildMermaidSvgs(mermaidCode, themeConfig) {
	const lightTheme = THEMES[themeConfig.lightTheme] || THEMES["github-light"];
	const darkTheme = THEMES[themeConfig.darkTheme] || THEMES["github-dark"];

	const lightSvg = renderMermaidSVG(mermaidCode, {
		...lightTheme,
		padding: 20,
	});
	const darkSvg = renderMermaidSVG(mermaidCode, {
		...darkTheme,
		padding: 20,
	});

	return { lightSvg, darkSvg };
}

/**
 * @param {object} [options] - 配置选项
 * @param {string} [options.lightTheme] - 亮色主题名
 * @param {string} [options.darkTheme] - 暗色主题名
 */
export function rehypeMermaid(options = {}) {
	const themeConfig = {
		lightTheme: options.lightTheme || "github-light",
		darkTheme: options.darkTheme || "github-dark",
	};

	return (tree) => {
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
				({ lightSvg, darkSvg } = buildMermaidSvgs(mermaidCode, themeConfig));
			} catch (e) {
				const preview =
					mermaidCode.length > 200
						? `${mermaidCode.slice(0, 200)}…[truncated]`
						: mermaidCode;
				if (process.env.NODE_ENV === "development") {
					console.error("[rehype-mermaid] 渲染失败:", e, preview);
				} else {
					console.error("[rehype-mermaid] 渲染失败:", e.message);
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
