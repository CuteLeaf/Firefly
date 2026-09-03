/**
 * 递归提取 HAST 节点树中的所有文本内容
 *
 * @param {import('hast').Node} node HAST 节点
 * @returns {string} 拼接后的文本
 */
export function extractText(node) {
	if (node.type === "text") return node.value || "";
	if (node.children) return node.children.map(extractText).join("");
	return "";
}
