// subset-font 是纯 JS 包，既没自带类型声明，也没有 @types/subset-font。
// 这里按它的 README 和 index.js 的实参签名补一份最小声明。
// 参考：https://github.com/papandreou/subset-font#api

declare module "subset-font" {
	/** 可变字体单个轴的实例化配置：固定为某个值，或收窄取值范围 */
	type VariationAxis =
		| number
		| { min?: number; max?: number; default?: number };

	interface SubsetFontOptions {
		/** 输出格式，缺省时沿用原字体的格式 */
		targetFormat?: "sfnt" | "woff" | "woff2";
		/** 额外保留的 name 表记录 id —— harfbuzz 默认会丢掉大部分 */
		preserveNameIds?: number[];
		/** 可变字体的轴实例化配置，只对 variable font 生效 */
		variationAxes?: Record<string, VariationAxis>;
		/** 跳过 layout closure（不为字形替换规则补齐额外字形） */
		noLayoutClosure?: boolean;
	}

	/** 按 text 里出现的字符裁出字体子集，可顺带转换格式 */
	export default function subsetFont(
		originalFont: Buffer,
		text: string,
		options?: SubsetFontOptions,
	): Promise<Buffer>;
}
