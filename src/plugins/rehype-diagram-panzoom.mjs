import { h } from "hastscript";
import clientScript from "./diagram-panzoom-script.js?raw";

/** 已注入脚本的 tree 集合，避免同一 tree 多次注入 */
const injectedTrees = new WeakSet();

/**
 * 共享图表交互 rehype 插件
 *
 * 为 .diagram-container 注入 pan-zoom、全屏控制等客户端交互脚本，
 * 以及控制栏/全屏 overlay 的共享 CSS。
 *
 * Mermaid 和 PlantUML 的 rehype 插件各自负责渲染内容，
 * 本插件只负责为它们统一添加交互能力。
 */
export function rehypeDiagramPanZoom() {
	return (tree) => {
		if (injectedTrees.has(tree)) return;
		injectedTrees.add(tree);

		// 注入共享 CSS
		const style = h("style", { type: "text/css" }, SHARED_CSS);
		// 注入客户端交互脚本
		const script = h("script", { type: "text/javascript" }, clientScript);
		tree.children = [...(tree.children || []), style, script];
	};
}

// ─── 共享 CSS ───────────────────────────────────────────────────────────────
const SHARED_CSS = `
/* diagram pan-zoom shared styles */
.diagram-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  z-index: 10;
}
.diagram-controls:hover { opacity: 1; }

.diagram-ctrl-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: var(--btn-regular-bg);
  color: var(--btn-content);
  font-size: 14px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  backdrop-filter: blur(8px);
}
.diagram-ctrl-btn:hover {
  background: var(--btn-regular-bg-hover);
  transform: translateY(-1px);
}
.diagram-ctrl-btn:active {
  background: var(--btn-regular-bg-active);
  transform: translateY(0);
}

.diagram-fullscreen-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.diagram-fs-content {
  width: 90vw; height: 85vh;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: none;
}
.diagram-fs-content:active { cursor: grabbing; }
.diagram-fs-content svg,
.diagram-fs-content img {
  max-width: 100%; max-height: 100%;
  user-select: none;
  -webkit-user-drag: none;
  will-change: transform;
}
.diagram-fs-controls {
  position: fixed;
  top: 16px; right: 16px;
  display: flex; gap: 6px;
  z-index: 10000;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  padding: 6px;
  border-radius: 10px;
}
.diagram-fs-controls .diagram-ctrl-btn {
  width: 36px; height: 36px;
  font-size: 18px; border-radius: 8px;
  background: rgba(255,255,255,0.15);
  color: #fff;
}
.diagram-fs-controls .diagram-ctrl-btn:hover {
  background: rgba(255,255,255,0.3);
}
.diagram-fs-controls .diagram-ctrl-btn:active {
  background: rgba(255,255,255,0.2);
}

@media (max-width: 768px) {
  .diagram-controls { opacity: 0.8; }
  .diagram-ctrl-btn { width: 32px; height: 32px; font-size: 16px; }
}

`;
