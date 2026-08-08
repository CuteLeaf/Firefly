/**
 * 获取语言的显示名称
 * @param langCode 语言代码（配置文件格式或翻译服务格式）
 * @returns 语言的显示名称
 */
export function getLanguageDisplayName(langCode: string): string {
	const languageNames: Record<string, string> = {
		zh_CN: "简体中文",
		zh_TW: "繁體中文",
		en: "English",
		ja: "日本語",
		ko: "한국어",
		es: "Español",
		th: "ไทย",
		vi: "Tiếng Việt",
		tr: "Türkçe",
		id: "Bahasa Indonesia",
		fr: "Français",
		de: "Deutsch",
		ru: "Русский",
		ar: "العربية",
		// 翻译服务格式
		chinese_simplified: "简体中文",
		chinese_traditional: "繁體中文",
		english: "English",
		japanese: "日本語",
		korean: "한국어",
		spanish: "Español",
		thai: "ไทย",
		vietnamese: "Tiếng Việt",
		turkish: "Türkçe",
		indonesian: "Bahasa Indonesia",
		french: "Français",
		german: "Deutsch",
		russian: "Русский",
		arabic: "العربية",
	};

	return languageNames[langCode] || langCode;
}
