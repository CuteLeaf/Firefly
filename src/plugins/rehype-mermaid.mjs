import { renderMermaidSVG, THEMES } from "beautiful-mermaid";
import { h } from "hastscript";
import { visit } from "unist-util-visit";
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
				// 渲染失败时显示错误提示 + 原始代码
				node.properties = {
					class: "diagram-container mermaid-diagram-container",
				};
				node.children = [
					h("div", { class: "mermaid-error" }, [
						h("p", {}, `Mermaid 渲染失败: ${e.message || "不支持的图表类型"}`),
						h("pre", { class: "mermaid-fallback-code" }, mermaidCode),
					]),
				];
				return;
			}

			// 替换为静态 SVG（浅色 + 深色双版本，CSS 控制显示）
			node.properties = {
				class: "diagram-container mermaid-diagram-container",
			};
			node.children = [
				h("div", { class: "diagram-wrapper mermaid-wrapper" }, [
					h("div", { class: "mermaid-svg mermaid-svg-light" }, [
						{ type: "raw", value: lightSvg },
					]),
					h("div", { class: "mermaid-svg mermaid-svg-dark" }, [
						{ type: "raw", value: darkSvg },
					]),
				]),
			];
		});
	};
}
