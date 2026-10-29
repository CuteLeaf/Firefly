import fs from "node:fs/promises";
import path from "node:path";
import { Ajv, type ValidateFunction } from "ajv";
import { ADMIN_DIR } from "./paths";

/**
 * 配置模块 Schema 片段的加载与校验。
 * 片段位于 admin/schemas/fragments/<key>.schema.json，结构：
 * { "key": string, "title": string, "description": string, "schema": <JSON Schema> }
 */

export interface ConfigFragment {
	key: string;
	title: string;
	description: string;
	schema: Record<string, unknown>;
}

const ajv = new Ajv({ strict: false, allErrors: true, allowUnionTypes: true });

const fragmentCache = new Map<string, ConfigFragment>();
const validatorCache = new Map<string, ValidateFunction>();

/** 加载某个配置模块的 Schema 片段 */
export async function loadFragment(
	key: string,
): Promise<ConfigFragment | null> {
	if (fragmentCache.has(key)) return fragmentCache.get(key) ?? null;
	const file = path.join(
		ADMIN_DIR,
		"schemas",
		"fragments",
		`${key}.schema.json`,
	);
	try {
		const raw = await fs.readFile(file, "utf-8");
		const parsed = JSON.parse(raw) as ConfigFragment;
		fragmentCache.set(key, parsed);
		return parsed;
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
		throw new Error(
			`Schema 片段 ${key}.schema.json 解析失败：${(err as Error).message}`,
		);
	}
}

function validatorFor(fragment: ConfigFragment): ValidateFunction {
	const cached = validatorCache.get(fragment.key);
	if (cached) return cached;
	const validate = ajv.compile(fragment.schema);
	validatorCache.set(fragment.key, validate);
	return validate;
}

/** 常见校验错误的简单中文化 */
function localizeError(message: string): string {
	const table: Array<[string, string]> = [
		["must be string", "必须是字符串"],
		["must be number", "必须是数字"],
		["must be integer", "必须是整数"],
		["must be boolean", "必须是布尔值"],
		["must be array", "必须是数组"],
		["must be object", "必须是对象"],
		["must be null", "必须是空值"],
		["must be equal to one of the allowed values", "必须是允许的取值之一"],
		["must have required property", "缺少必填字段"],
		["must NOT have fewer than", "数量不能少于"],
		["must NOT have more than", "数量不能多于"],
		["must be >= ", "不能小于 "],
		["must be <= ", "不能大于 "],
		["must match pattern", "格式不符合要求"],
		["must match format", "格式不符合要求"],
	];
	for (const [en, zh] of table) {
		if (message.includes(en)) return message.replace(en, zh);
	}
	return message;
}

export interface ValidationResult {
	ok: boolean;
	errors: string[];
}

/** 校验用户提交的配置值 */
export async function validateConfigValue(
	key: string,
	value: unknown,
): Promise<ValidationResult> {
	const fragment = await loadFragment(key);
	if (!fragment) {
		return { ok: false, errors: [`缺少配置模块 ${key} 的 Schema 定义`] };
	}
	const validate = validatorFor(fragment);
	const ok = validate(value);
	if (ok) return { ok: true, errors: [] };
	const errors = (validate.errors ?? []).map(
		(err) =>
			`${err.instancePath || "(根)"} ${localizeError(err.message ?? "校验失败")}`,
	);
	return { ok: false, errors };
}
