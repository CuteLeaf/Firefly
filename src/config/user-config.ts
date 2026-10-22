// 用户配置覆盖层（User Config Overlay）
//
// 这是「Firefly 管理后台」与站点配置之间共享的唯一数据通道：
// - 后台把用户通过图形界面修改的个性化设置写入 ./user-config.json（只保存与默认值不同的字段）；
// - 每个 config/*.ts 模块导出前都会经过 mergeUserConfig() 合并覆盖层；
// - 合并采用「形状守卫的深合并」：只覆盖与默认值同类型/同形状的叶子字段，
//   数组整体替换、对象递归合并、未知字段被忽略，因此手改 JSON 也不会把站点搞崩。
//
// 想要重置某个配置模块：删除 user-config.json 中对应的顶层键（后台也有「恢复默认」按钮）。

import userConfigJson from "./user-config.json";

/** 覆盖层原始内容（JSON 导入，后台会直接改写这个文件） */
export const userConfigOverlay: Record<string, unknown> =
	userConfigJson as Record<string, unknown>;

/** 判断是否为普通对象（非数组、非 null） */
function isPlainObject(value: unknown): value is Record<string, unknown> {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		!(value instanceof Date)
	);
}

/** 类型兼容判断：null 只能覆盖 null；其余按 typeof 对齐 */
function isTypeCompatible(
	defaultValue: unknown,
	overlayValue: unknown,
): boolean {
	if (defaultValue === null || defaultValue === undefined) {
		return overlayValue === null || overlayValue === undefined;
	}
	if (overlayValue === null || overlayValue === undefined) return false;
	return typeof defaultValue === typeof overlayValue;
}

/**
 * 形状守卫的深合并：返回类型与 defaults 一致。
 * - overlay 中不存在 defaults 的键会被忽略（防止旧模板 / 手改 JSON 引入未知字段）
 * - 对象递归合并；数组与原始值在类型匹配时整体替换
 */
function mergeInto(defaults: unknown, overlay: unknown): unknown {
	if (isPlainObject(defaults) && isPlainObject(overlay)) {
		const result: Record<string, unknown> = { ...defaults };
		for (const [key, overlayValue] of Object.entries(overlay)) {
			if (!(key in result)) continue; // 未知字段：忽略
			result[key] = mergeInto(result[key], overlayValue);
		}
		return result;
	}
	if (Array.isArray(defaults) && Array.isArray(overlay)) {
		return [...overlay]; // 数组整体替换
	}
	if (isTypeCompatible(defaults, overlay)) {
		return overlay;
	}
	return defaults; // 类型不匹配：保持默认值
}

/**
 * 将 user-config.json 中指定分区的覆盖值合并到默认配置上。
 * 配置模块用法：
 *   const siteConfigDefaults: SiteConfig = { ... };
 *   export const siteConfig: SiteConfig = mergeUserConfig("site", siteConfigDefaults);
 * 注意：分区根既可以是对象，也可以是数组（如友链列表、书签导航）。
 */
export function mergeUserConfig<T>(section: string, defaults: T): T {
	const overlay = userConfigOverlay[section];
	if (overlay === undefined || overlay === null) return defaults;
	if (Array.isArray(defaults) && Array.isArray(overlay)) {
		return [...overlay] as T; // 数组根：整体替换
	}
	if (!isPlainObject(overlay)) return defaults;
	return mergeInto(defaults, overlay) as T;
}
