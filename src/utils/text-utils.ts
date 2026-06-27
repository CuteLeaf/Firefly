import { siteConfig } from "@/config";

const localeMap: Record<string, string> = {
	zh_CN: "zh-CN",
	zh_TW: "zh-TW",
	en: "en-US",
	ja: "ja-JP",
	ko: "ko-KR",
	es: "es-ES",
	th: "th-TH",
	vi: "vi-VN",
	tr: "tr-TR",
	id: "id-ID",
	fr: "fr-FR",
	de: "de-DE",
	ru: "ru-RU",
	ar: "ar-SA",
};

function getLocale(): string {
	const lang = siteConfig.lang || "en";
	return localeMap[lang] || "en-US";
}

export function countCjkAndEnglishWords(markdown: string): number {
	const text = markdown.replace(/\s+/g, " ").trim();
	const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
	const englishWords = text.match(/[a-zA-Z]+/g) || [];
	return chineseChars.length + englishWords.length;
}

export function markdownToPlainText(markdown: string): string {
	let text = markdown;

	text = text.replace(/```[\s\S]*?```/g, " ");
	text = text.replace(/!\[[^\]]*]\([^)]+\)/g, " ");
	text = text.replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
	text = text.replace(/`[^`]*`/g, " ");
	text = text
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/^>\s?/gm, "")
		.replace(/^\s*[-*+]\s+/gm, "")
		.replace(/^\s*\d+\.\s+/gm, "");
	text = text.replace(/[*_~]+/g, "");

	return text.replace(/\s+/g, " ").trim();
}

export function toDomId(prefix: string, raw: string): string {
	const safe = raw
		.replace(/[^a-zA-Z0-9_-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
	return `${prefix}-${safe || "item"}`;
}

export function formatRelativeTime(date: Date, now: Date = new Date()): string {
	const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
	const absSeconds = Math.abs(diffSeconds);
	const rtf = new Intl.RelativeTimeFormat(getLocale(), { numeric: "auto" });

	if (absSeconds < 60) return rtf.format(diffSeconds, "second");
	if (absSeconds < 60 * 60)
		return rtf.format(Math.round(diffSeconds / 60), "minute");
	if (absSeconds < 60 * 60 * 24)
		return rtf.format(Math.round(diffSeconds / (60 * 60)), "hour");
	if (absSeconds < 60 * 60 * 24 * 30)
		return rtf.format(Math.round(diffSeconds / (60 * 60 * 24)), "day");
	if (absSeconds < 60 * 60 * 24 * 365)
		return rtf.format(Math.round(diffSeconds / (60 * 60 * 24 * 30)), "month");
	return rtf.format(Math.round(diffSeconds / (60 * 60 * 24 * 365)), "year");
}
