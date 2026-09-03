/**
 * 邮箱链接 base64 加密工具，防止爬虫直接抓取邮箱地址。
 *
 * 用法（与 Profile / 横幅链接一致）：
 * - 渲染时：href 用 "#"，data-encoded-email 用 encodeMailto(url) 的返回值；
 * - 点击时：内联 onclick 执行 MAILTO_ONCLICK_SCRIPT 解码并跳转。
 */

// 加密邮箱（去掉 "mailto:" 前缀后 base64 编码，SSR 侧使用）
export function encodeMailto(url: string): string {
	return Buffer.from(url.replace("mailto:", "")).toString("base64");
}

// 邮箱链接的点击解密脚本（内联 onclick 使用，浏览器侧 atob 解码）
export const MAILTO_ONCLICK_SCRIPT =
	"(function(){var e=this.getAttribute('data-encoded-email');this.href='mailto:'+atob(e);this.removeAttribute('data-encoded-email');this.removeAttribute('onclick');this.click();return false;}).call(this);";
