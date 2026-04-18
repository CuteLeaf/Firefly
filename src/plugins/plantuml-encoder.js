import pako from "pako";

/**
 * PlantUML 编码字母表：`0-9A-Za-z-_`。
 * 与标准 base64 不同，PlantUML 使用自定义映射以便放入 URL path 段。
 * @see https://plantuml.com/text-encoding
 */
const PLANTUML_ALPHABET =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

/**
 * 将 0-63 的 6-bit 数值映射到 PlantUML 字母表字符。
 *
 * @param {number} value 取值范围 [0, 63]
 * @returns {string} 单字符的编码
 */
function encode6bit(value) {
	return PLANTUML_ALPHABET.charAt(value & 0x3f);
}

/**
 * 把 3 字节打包为 4 个 PlantUML 编码字符。
 * 不足 3 字节时调用方需用 0 补齐（与原始 PlantUML 算法一致）。
 *
 * @param {number} b1 第 1 字节（0-255）
 * @param {number} b2 第 2 字节（0-255）
 * @param {number} b3 第 3 字节（0-255）
 * @returns {string} 长度为 4 的编码串
 */
function append3bytes(b1, b2, b3) {
	const c1 = b1 >> 2;
	const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
	const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
	const c4 = b3 & 0x3f;
	return encode6bit(c1) + encode6bit(c2) + encode6bit(c3) + encode6bit(c4);
}

/**
 * 使用 PlantUML 自定义 base64 字母表对字节数组进行编码。
 * 与标准 base64 相比：字母表不同（PlantUML 使用 `0-9A-Za-z-_`）、
 * 末尾不追加 `=` 填充。
 *
 * @param {Uint8Array} bytes 待编码的字节数组
 * @returns {string} PlantUML 编码后的字符串
 */
function encode64(bytes) {
	let result = "";
	const length = bytes.length;
	for (let i = 0; i < length; i += 3) {
		if (i + 2 === length) {
			result += append3bytes(bytes[i], bytes[i + 1], 0);
		} else if (i + 1 === length) {
			result += append3bytes(bytes[i], 0, 0);
		} else {
			result += append3bytes(bytes[i], bytes[i + 1], bytes[i + 2]);
		}
	}
	return result;
}

/**
 * 对 PlantUML 源码进行 PlantUML 专用编码：
 *   1. 将源码按 UTF-8 编码为字节数组
 *   2. 对字节进行 raw DEFLATE 压缩（无 zlib 头）
 *   3. 用 PlantUML base64 字母表（`0-9A-Za-z-_`）将压缩结果编码为字符串
 * 该结果可直接拼接到 PlantUML 服务器的 `/svg/`、`/png/` 等路径之后。
 *
 * @param {string} source 原始 PlantUML 源码（包含或不包含 `@startuml/@enduml` 均可）
 * @returns {string} 可用于 URL 的编码串
 * @throws {TypeError} 当 `source` 不是字符串时抛出
 */
export function encodePlantUML(source) {
	if (typeof source !== "string") {
		throw new TypeError(
			`encodePlantUML expects a string, got ${typeof source}`,
		);
	}
	const utf8Bytes = new TextEncoder().encode(source);
	const deflated = pako.deflateRaw(utf8Bytes, { level: 9 });
	return encode64(deflated);
}

/**
 * 判断源码是否已经包含主题/背景色相关的显式指令。
 * 用于避免在作者显式指定主题时进行二次注入。
 *
 * @param {string} source PlantUML 源码
 * @returns {boolean} true 表示源码已包含 `!theme` 或 `skinparam backgroundColor`
 */
function hasExplicitTheme(source) {
	return (
		/^\s*!theme\s+\S+/m.test(source) ||
		/^\s*skinparam\s+backgroundColor\b/im.test(source)
	);
}

/**
 * 在 PlantUML 源码头部注入 `!theme <themeName>` 指令。
 *
 * 注入规则：
 *   - `themeName` 为空串或仅空白时：原样返回
 *   - 源码已包含 `!theme` 或 `skinparam backgroundColor` 时：原样返回（尊重作者显式设置）
 *   - 源码首行为 `@startuml[...]` 时：在该行之后插入主题指令
 *   - 源码未显式声明 `@startuml` 时：在源码最前面插入主题指令
 *
 * @param {string} source 原始 PlantUML 源码
 * @param {string} themeName PlantUML 主题名（例如 "cyborg"、"materia"）
 * @returns {string} 可能已注入 `!theme` 的源码
 */
export function injectTheme(source, themeName) {
	if (typeof source !== "string") {
		throw new TypeError(
			`injectTheme expects a string source, got ${typeof source}`,
		);
	}
	if (!themeName?.trim()) {
		return source;
	}
	if (hasExplicitTheme(source)) {
		return source;
	}
	const themeDirective = `!theme ${themeName.trim()}`;
	const startumlMatch = source.match(/^[^\S\r\n]*@startuml[^\r\n]*\r?\n?/);
	if (startumlMatch) {
		const insertAt = startumlMatch.index + startumlMatch[0].length;
		return `${source.slice(0, insertAt)}${themeDirective}\n${source.slice(insertAt)}`;
	}
	return `${themeDirective}\n${source}`;
}

/**
 * 拼接 PlantUML 服务器地址与编码串生成可直接访问的 SVG URL。
 * 自动去除 `server` 尾部的斜杠，避免出现 `//svg/`。
 *
 * @param {string} server PlantUML 服务器根地址，例如 `https://www.plantuml.com/plantuml`
 * @param {string} encoded 经 {@link encodePlantUML} 产生的编码串
 * @returns {string} 形如 `<server>/svg/<encoded>` 的完整 URL
 */
export function buildUrl(server, encoded) {
	if (typeof server !== "string" || !server.trim()) {
		throw new TypeError("buildUrl expects a non-empty server string");
	}
	if (typeof encoded !== "string" || !encoded.trim()) {
		throw new TypeError("buildUrl expects a non-empty encoded string");
	}
	const normalizedServer = server.replace(/\/+$/, "");
	return `${normalizedServer}/svg/${encoded}`;
}
