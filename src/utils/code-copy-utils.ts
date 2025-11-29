/**
 * 代码复制工具函数
 */

/**
 * 从代码块中提取代码文本
 * @param codeElement 代码元素
 * @returns 提取的代码文本
 */
export function extractCodeText(codeElement: Element): string {
	// 获取所有代码行元素
	const lineElements = codeElement.querySelectorAll("span.line");
	if (lineElements.length > 0) {
		// 对于有行结构的代码块，精确处理每一行
		const lines: string[] = [];
		for (let i = 0; i < lineElements.length; i++) {
			const lineElement = lineElements[i];
			// 直接获取文本内容，不添加额外处理
			const lineText = lineElement.textContent || "";
			lines.push(lineText);
		}
		// 重要：使用 \n 连接行，而不是 \n\n 或其他方式
		return lines.join("\n");
	}
	// 对于没有行结构的代码块
	const codeElements = codeElement.querySelectorAll(".code:not(summary *)");
	if (codeElements.length > 0) {
		const lines: string[] = [];
		for (let i = 0; i < codeElements.length; i++) {
			const el = codeElements[i];
			const lineText = el.textContent || "";
			lines.push(lineText);
		}
		return lines.join("\n");
	}
	// 最后回退到直接使用整个code元素的文本内容
	return codeElement.textContent || "";
}

/**
 * 处理连续空行
 * @param code 原始代码文本
 * @returns 处理后的代码文本
 */
export function processEmptyLines(code: string): string {
	return code.replace(/\n\n\n+/g, (match) => {
		// 计算连续换行符的数量
		const newlineCount = match.length;
		// 计算空行数量（换行符数量减1）
		const emptyLineCount = newlineCount - 1;

		// 偶数空行：除以2
		// 奇数空行：(空行数+1)/2 向下取整
		let resultEmptyLines: number;
		if (emptyLineCount % 2 === 0) {
			// 偶数
			resultEmptyLines = emptyLineCount / 2;
		} else {
			// 奇数
			resultEmptyLines = Math.floor((emptyLineCount + 1) / 2);
		}

		// 至少保留一个空行
		if (resultEmptyLines < 1) resultEmptyLines = 1;

		// 返回对应数量的换行符
		return "\n".repeat(resultEmptyLines + 1);
	});
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 复制是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		// 优先使用 Clipboard API
		await navigator.clipboard.writeText(text);
		return true;
	} catch (clipboardErr) {
		console.warn("Clipboard API 失败，尝试备用方案:", clipboardErr);

		// 备用方案：使用 document.execCommand
		const textArea = document.createElement("textarea");
		textArea.value = text;
		textArea.style.position = "fixed";
		textArea.style.left = "-999999px";
		textArea.style.top = "-999999px";
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			const successful = document.execCommand("copy");
			if (!successful) {
				throw new Error("execCommand 返回 false");
			}
			return true;
		} catch (execErr) {
			console.error("execCommand 也失败了:", execErr);
			throw new Error("所有复制方法都失败了");
		} finally {
			document.body.removeChild(textArea);
		}
	}
}

/**
 * 处理代码复制按钮点击事件
 * @param target 点击的按钮元素
 */
export async function handleCodeCopy(target: Element): Promise<void> {
	const preEle = target.closest("pre");
	const codeEle = preEle?.querySelector("code");

	if (!codeEle) {
		console.warn("未找到代码元素");
		return;
	}

	// 提取代码文本
	let code = extractCodeText(codeEle);

	// 处理连续空行
	code = processEmptyLines(code);

	try {
		// 复制到剪贴板
		await copyToClipboard(code);

		// 处理成功状态
		const timeoutId = target.getAttribute("data-timeout-id");
		if (timeoutId) {
			clearTimeout(Number.parseInt(timeoutId, 10));
		}

		target.classList.add("success");

		// 设置新的timeout并保存ID到按钮的自定义属性中
		const newTimeoutId = setTimeout(() => {
			target.classList.remove("success");
		}, 1000);

		target.setAttribute("data-timeout-id", newTimeoutId.toString());
	} catch (err) {
		console.error("复制失败:", err);
		// 可以在这里添加用户提示
	}
}
