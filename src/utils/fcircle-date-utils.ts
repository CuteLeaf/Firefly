export interface FcircleDatePresentation {
	dateKey: string;
	displayDate: string;
	subLabel: string;
	relativeDays: number;
}

interface ZonedDateParts {
	year: number;
	month: number;
	day: number;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();
const timeFormatterCache = new Map<string, Intl.DateTimeFormat>();
const weekdayFormatterCache = new Map<string, Intl.DateTimeFormat>();
const monthDayFormatterCache = new Map<string, Intl.DateTimeFormat>();
const relativeTimeFormatterCache = new Map<string, Intl.RelativeTimeFormat>();

function asDate(dateInput: Date | string): Date {
	return dateInput instanceof Date ? dateInput : new Date(dateInput);
}

function getDateFormatter(timeZone: string): Intl.DateTimeFormat {
	let formatter = dateFormatterCache.get(timeZone);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat("en-CA", {
			timeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
		dateFormatterCache.set(timeZone, formatter);
	}
	return formatter;
}

export function getTimeFormatter(timeZone: string): Intl.DateTimeFormat {
	let formatter = timeFormatterCache.get(timeZone);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat("zh-CN", {
			timeZone,
			hour: "2-digit",
			minute: "2-digit",
			hourCycle: "h23",
		});
		timeFormatterCache.set(timeZone, formatter);
	}
	return formatter;
}

function getZonedDateParts(
	dateInput: Date | string,
	timeZone: string,
): ZonedDateParts {
	const date = asDate(dateInput);
	const parts = getDateFormatter(timeZone).formatToParts(date);
	const get = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((part) => part.type === type)?.value;

	const year = Number(get("year"));
	const month = Number(get("month"));
	const day = Number(get("day"));

	if (!year || !month || !day) {
		throw new RangeError(`Unable to format date in time zone "${timeZone}"`);
	}

	return { year, month, day };
}

function dateSerial(parts: ZonedDateParts): number {
	return Date.UTC(parts.year, parts.month - 1, parts.day);
}

export function getFcircleDateKey(
	dateInput: Date | string,
	timeZone: string,
): string {
	const { year, month, day } = getZonedDateParts(dateInput, timeZone);
	return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getFcircleRelativeDays(
	dateInput: Date | string,
	referenceInput: Date | string,
	timeZone: string,
): number {
	const itemParts = getZonedDateParts(dateInput, timeZone);
	const referenceParts = getZonedDateParts(referenceInput, timeZone);
	return Math.round(
		(dateSerial(referenceParts) - dateSerial(itemParts)) / ONE_DAY_MS,
	);
}

function normalizeLocale(lang = "zh-CN"): string {
	return (lang || "zh-CN").replace(/_/g, "-");
}

function getWeekdayString(
	date: Date,
	timeZone: string,
	lang = "zh-CN",
): string {
	const normalized = normalizeLocale(lang);
	const cacheKey = `${normalized}_${timeZone}`;
	let formatter = weekdayFormatterCache.get(cacheKey);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat(normalized, {
			weekday: "short",
			timeZone,
		});
		weekdayFormatterCache.set(cacheKey, formatter);
	}
	return formatter.format(date);
}

function getMonthDayString(
	date: Date,
	timeZone: string,
	lang = "zh-CN",
): string {
	const normalized = normalizeLocale(lang);
	const cacheKey = `${normalized}_${timeZone}`;
	let formatter = monthDayFormatterCache.get(cacheKey);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat(normalized, {
			month: "numeric",
			day: "numeric",
			timeZone,
		});
		monthDayFormatterCache.set(cacheKey, formatter);
	}
	return formatter.format(date);
}

function getRelativeTimeFormatter(
	normalizedLang: string,
): Intl.RelativeTimeFormat {
	let formatter = relativeTimeFormatterCache.get(normalizedLang);
	if (!formatter) {
		formatter = new Intl.RelativeTimeFormat(normalizedLang, {
			numeric: "auto",
		});
		relativeTimeFormatterCache.set(normalizedLang, formatter);
	}
	return formatter;
}

export function getFcircleDatePresentation(
	dateInput: Date | string,
	referenceInput: Date | string,
	timeZone: string,
	lang = "zh-CN",
): FcircleDatePresentation {
	const date = asDate(dateInput);
	const itemParts = getZonedDateParts(dateInput, timeZone);
	const referenceParts = getZonedDateParts(referenceInput, timeZone);
	const relativeDays = Math.round(
		(dateSerial(referenceParts) - dateSerial(itemParts)) / ONE_DAY_MS,
	);
	const dateKey = `${itemParts.year}-${String(itemParts.month).padStart(2, "0")}-${String(itemParts.day).padStart(2, "0")}`;
	const weekDayStr = getWeekdayString(date, timeZone, lang);
	const monthDayStr = getMonthDayString(date, timeZone, lang);

	if (relativeDays >= 0 && relativeDays <= 2) {
		const normalized = normalizeLocale(lang);
		const rtf = getRelativeTimeFormatter(normalized);
		const rawRelative = rtf.format(-relativeDays, "day");
		const displayDate =
			rawRelative.charAt(0).toUpperCase() + rawRelative.slice(1);
		return {
			dateKey,
			displayDate,
			subLabel: `${monthDayStr} · ${weekDayStr}`,
			relativeDays,
		};
	}

	return {
		dateKey,
		displayDate:
			itemParts.year === referenceParts.year
				? monthDayStr
				: `${itemParts.year} / ${monthDayStr}`,
		subLabel: weekDayStr,
		relativeDays,
	};
}

export function formatFcircleDate(
	dateInput: Date | string,
	timeZone: string,
	lang = "zh-CN",
): string {
	const date = asDate(dateInput);
	return new Intl.DateTimeFormat(normalizeLocale(lang), {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		timeZone,
	}).format(date);
}

export function formatFcircleTime(
	dateInput: Date | string,
	timeZone: string,
): string {
	const date = asDate(dateInput);
	return getTimeFormatter(timeZone).format(date);
}
