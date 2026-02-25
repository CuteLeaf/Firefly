import { visit } from "unist-util-visit";

export function remarkMermaid() {
	return (tree) => {
		visit(tree, "code", (node) => {
			if (node.lang === "mermaid") {
				const code = node.value;
				// 将 mermaid 代码块转换为自定义节点类型
				node.type = "mermaid";
				node.data = {
					hName: "div",
					hProperties: {
						className: ["mermaid-container"],
						"data-mermaid-code": code,
					},
					// MDX 兼容：将代码存为子节点，防止 MDX 编译器丢失 hProperties
					hChildren: [{ type: "text", value: code }],
				};
				// 清除 value，避免 remark-rehype 将其当作纯文本处理
				node.value = undefined;
			}
		});
	};
}
