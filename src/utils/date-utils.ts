import { siteConfig } from "../config";

/**
 * 判断日期是否为纯日期输入（如 YAML 中仅填写 YYYY-MM-DD，解析为 UTC 午夜）。
 * 对于此类纯日历日期，应保留原日期，避免在 UTC 以西时区（如美西/美东）转换后倒退一天。
 */
export function isDateOnly(dateInput: Date | string): boolean {
	if (typeof dateInput === "string") {
		return /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim());
	}
	return (
		dateInput.getUTCHours() === 0 &&
		dateInput.getUTCMinutes() === 0 &&
		dateInput.getUTCSeconds() === 0 &&
		dateInput.getUTCMilliseconds() === 0
	);
}

export function formatDateToYYYYMMDD(dateInput: Date | string): string {
	if (!dateInput) return "";

	if (typeof dateInput === "string") {
		const trimmed = dateInput.trim();
		if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
			return trimmed;
		}
	}

	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	if (Number.isNaN(date.getTime())) return "";

	// 纯日期输入保留原日历日期，避免在 UTC 以西时区倒退一天
	if (isDateOnly(date)) {
		return date.toISOString().substring(0, 10);
	}

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	};

	if (siteConfig.timezone) {
		options.timeZone = siteConfig.timezone;
	}

	const parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(date);
	const get = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((p) => p.type === type)?.value || "";

	return `${get("year")}-${get("month")}-${get("day")}`;
}

// 国际化日期格式化函数
export function formatDateI18n(
	dateInput: Date | string,
	includeTime?: boolean,
): string {
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	const lang = siteConfig.lang || "en";

	// 根据语言设置不同的日期格式
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	if (includeTime) {
		options.hour = "2-digit";
		options.minute = "2-digit";
		options.second = "2-digit";
	}

	// 如果配置了时区，则将其用于格式化（IANA 时区字符串）
	if (siteConfig.timezone) {
		(options as Intl.DateTimeFormatOptions).timeZone = siteConfig.timezone;
	}

	// 语言代码映射
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

	const locale = localeMap[lang] || "en-US";
	return includeTime
		? date.toLocaleString(locale, options)
		: date.toLocaleDateString(locale, options);
}

// 国际化日期时间格式化函数（带时分秒）
export function formatDateI18nWithTime(dateInput: Date | string): string {
	return formatDateI18n(dateInput, true);
}

export function formatDynamicDate(dateInput: Date | string): string {
	if (!dateInput) return "";

	if (typeof dateInput === "string") {
		const trimmed = dateInput.trim();
		if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
			return `${trimmed} 00:00:00`;
		}
	}

	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	if (Number.isNaN(date.getTime())) return "";

	// 纯日期输入保留原日历日期，避免在 UTC 以西时区倒退一天
	if (isDateOnly(date)) {
		return `${date.toISOString().substring(0, 10)} 00:00:00`;
	}

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23",
		timeZone: siteConfig.timezone || "UTC",
	};

	const parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(date);
	const get = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((part) => part.type === type)?.value || "";
	return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

export function formatTimezoneOffset(
	timezone: string,
	dateInput: Date | string,
): string {
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	const timezoneName = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		timeZoneName: "longOffset",
	})
		.formatToParts(date)
		.find((part) => part.type === "timeZoneName")?.value;

	if (!timezoneName || timezoneName === "GMT") return "UTC";

	return timezoneName
		.replace("GMT", "UTC")
		.replace(/([+-])0(\d)/, "$1$2")
		.replace(":00", "");
}

// 统一格式为 YYYY-MM-DD HH:mm，支持站点时区
export function formatDateTimeToYYYYMMDDHHmm(dateInput: Date | string): string {
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	};

	if (siteConfig.timezone) {
		options.timeZone = siteConfig.timezone;
	}

	const parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(date);
	const get = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((p) => p.type === type)?.value || "";

	return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}
