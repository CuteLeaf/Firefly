import { h } from "hastscript";
import { visit } from "unist-util-visit";

// 来自霞葉： https://kasuha.com/posts/fuwari-enhance-ep1/

/**
 * 加密 mailto 链接以保护邮箱地址免受爬虫抓取的 rehype 插件
 *
 * @param {Object} options - 插件选项
 * @param {string} [options.method='base64'] - 编码方式: 'base64' or 'rot13'
 * @returns {Function} A transformer function for the rehype plugin
 */
export default function rehypeEmailProtection(options = {}) {
	const { method = "base64" } = options;

	// Base64 编码函数
	const base64Encode = (str) => {
		return btoa(str);
	};

	// ROT13 编码函数
	const rot13Encode = (str) => {
		return str.replace(/[a-zA-Z]/g, (char) => {
			const start = char <= "Z" ? 65 : 97;
			return String.fromCharCode(
				((char.charCodeAt(0) - start + 13) % 26) + start,
			);
		});
	};

	// 根据选择的方法进行编码
	const encode = (str) => {
		return method === "rot13" ? rot13Encode(str) : base64Encode(str);
	};

	// 生成解码 JavaScript 代码
	const generateDecodeScript = () => {
		if (method === "rot13") {
			return `
        function decodeRot13(str) {
          return str.replace(/[a-zA-Z]/g, function(char) {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
          });
        }
        const decodedEmail = decodeRot13(encodedEmail);
      `;
		}
		return `
      const decodedEmail = atob(encodedEmail);
    `;
	};

	return (tree) => {
		let hasEmailLinks = false;

		visit(tree, "element", (node, index, parent) => {
			// 只处理 a 元素
			if (node.tagName !== "a") {
				return;
			}

			// 检查是否是 mailto 链接
			const href = node.properties?.href;
			if (!href?.startsWith("mailto:")) {
				return;
			}

			hasEmailLinks = true;

			// 提取邮箱地址
			const email = href.replace("mailto:", "");
			const encodedEmail = encode(email);

			// 创建加密的链接元素（移除原始的 href 属性，避免重复定义）
			const otherProperties = { ...node.properties };
			delete otherProperties.href;
			const protectedLink = h(
				"a",
				{
					...otherProperties,
					href: "#",
					"data-encoded-email": encodedEmail,
					onclick: `
          (function() {
            const encodedEmail = this.getAttribute('data-encoded-email');
            ${generateDecodeScript()}
            this.href = 'mailto:' + decodedEmail;
            this.removeAttribute('data-encoded-email');
            this.removeAttribute('onclick');
            this.click();
            return false;
          }).call(this);
        `
						.replace(/\s+/g, " ")
						.trim(),
				},
				node.children,
			);

			// 替换当前的 a 节点
			if (parent && typeof index === "number") {
				parent.children[index] = protectedLink;
			}
		});

		// 如果页面中有邮箱链接，添加样式
		if (hasEmailLinks) {
			visit(tree, "element", (node) => {
				if (node.tagName === "head") {
					const style = h(
						"style",
						`
            a[data-encoded-email] {
              cursor: pointer;
              text-decoration: underline;
              color: inherit;
            }
            a[data-encoded-email]:hover {
              text-decoration: underline;
            }
          `.trim(),
					);
					node.children.push(style);
				}
			});
		}
	};
}
