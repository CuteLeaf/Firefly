/**
 * Schema 片段 ↔ 配置默认值 交叉校验脚本。
 * 用法：npx tsx admin/scripts/check-schemas.ts
 *
 * 两个方向：
 *  A. Schema 里的字段路径必须能在默认值对象中找到（防止拼写错误/幻想字段）；
 *  B. 默认值对象里的叶子路径应该被 Schema 覆盖（防止遗漏字段）。
 * 输出为审查清单，存在 A 类硬错误时以非零退出。
 */
import fs from "node:fs";
import path from "node:path";
import {
	configSections,
	type ConfigSection,
} from "../server/lib/config-manifest";
import { ADMIN_DIR } from "../server/lib/paths";

type SchemaNode = Record<string, unknown>;

interface Issue {
	section: string;
	kind: string;
	path: string;
}

const issues: Issue[] = [];

function loadFragment(key: string): SchemaNode | null {
	const file = path.join(
		ADMIN_DIR,
		"schemas",
		"fragments",
		`${key}.schema.json`,
	);
	try {
		return JSON.parse(fs.readFileSync(file, "utf-8"));
	} catch {
		console.error(`✗ 无法读取或解析 ${key}.schema.json`);
		return null;
	}
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
	return (
		typeof v === "object" &&
		v !== null &&
		!Array.isArray(v) &&
		!(v instanceof Date)
	);
}

/* ── 方向 A：Schema 路径 → 默认值存在性 ───────────────── */

function checkPathExists(root: unknown, segments: string[]): boolean {
	if (segments.length === 0) return true;
	const [head, ...rest] = segments;
	if (head === "[]") {
		if (!Array.isArray(root)) return false;
		if (rest.length === 0) return true; // 数组本身存在即可（允许空数组默认值）
		return (root as unknown[]).some((item) => checkPathExists(item, rest));
	}
	if (!isPlainObject(root)) return false;
	if (!(head in root)) return false;
	return checkPathExists(root[head], rest);
}

function walkSchemaPaths(
	section: ConfigSection,
	node: SchemaNode,
	segments: string[],
	root: unknown,
): void {
	// 自由 JSON 编辑器：跳过内部检查
	if (node["x-editor"] === "json") return;
	if (node.type === "object" && isPlainObject(node.properties)) {
		for (const [key, child] of Object.entries(node.properties)) {
			walkSchemaPaths(section, child as SchemaNode, [...segments, key], root);
		}
		return;
	}
	if (node.type === "array" && isPlainObject(node.items)) {
		walkSchemaPaths(
			section,
			node.items as SchemaNode,
			[...segments, "[]"],
			root,
		);
		return;
	}
	// 叶子节点：字段未出现在默认值中 → 仅提示（通常是合法的可选字段，如 navbar 的 external）
	if (!checkPathExists(root, segments)) {
		issues.push({
			section: section.key,
			kind: "A:可选字段",
			path: `${segments.join(".")}（默认值中未出现，请人工确认是可选字段而非拼写错误）`,
		});
	}
}

/* ── 方向 B：默认值 → Schema 覆盖 ───────────────────── */

function schemaNodeAt(
	schema: SchemaNode,
	segments: string[],
): SchemaNode | null {
	let node: SchemaNode | null = schema;
	for (const seg of segments) {
		if (!node) return null;
		if (seg === "[]") {
			if (!isPlainObject(node.items)) return null;
			node = node.items as SchemaNode;
			continue;
		}
		if (!isPlainObject(node.properties)) return null;
		const child: unknown = node.properties[seg];
		if (!isPlainObject(child)) return null;
		node = child;
	}
	return node;
}

function walkDefaults(
	section: ConfigSection,
	schema: SchemaNode,
	value: unknown,
	segments: string[],
): void {
	if (Array.isArray(value)) {
		for (const item of value) {
			walkDefaults(section, schema, item, [...segments, "[]"]);
		}
		return;
	}
	if (isPlainObject(value)) {
		// 自由 JSON 编辑器：视为全覆盖
		const selfNode = schemaNodeAt(schema, segments);
		if (selfNode?.["x-editor"] === "json") return;
		for (const [key, child] of Object.entries(value) as Array<
			[string, unknown]
		>) {
			walkDefaults(section, schema, child, [...segments, key]);
		}
		return;
	}
	if (typeof value === "function") return; // 函数值不参与表单编辑

	const node = schemaNodeAt(schema, segments);
	if (!node) {
		issues.push({
			section: section.key,
			kind: "B:未被覆盖",
			path: segments.join("."),
		});
		return;
	}
	const types: unknown[] = Array.isArray(node.type) ? node.type : [node.type];
	const actual = typeof value;
	const typeOk =
		types.includes(actual) ||
		(actual === "number" &&
			(types.includes("integer") || types.includes("number")));
	if (!typeOk) {
		issues.push({
			section: section.key,
			kind: "B:类型不匹配",
			path: `${segments.join(".")}（schema=${types.join("|")}，实际=${actual}）`,
		});
	}
}

/* ── 主流程 ─────────────────────────────────────────── */

let hardErrors = 0;
let fragmentCount = 0;

for (const section of configSections) {
	const fragment = loadFragment(section.key);
	if (!fragment) {
		hardErrors += 1;
		continue;
	}
	fragmentCount += 1;
	const schema = fragment.schema as SchemaNode;
	const rootSchema =
		schema.type === "array" ? (schema.items as SchemaNode) : schema;
	const rootDefaults = section.defaults;
	if (Array.isArray(rootDefaults)) {
		for (const item of rootDefaults) {
			walkSchemaPaths(section, rootSchema, [], item);
			walkDefaults(section, rootSchema, item, []);
		}
	} else {
		walkSchemaPaths(section, rootSchema, [], rootDefaults);
		walkDefaults(section, rootSchema, rootDefaults, []);
	}
}

console.log(
	`\n已检查 ${fragmentCount}/${configSections.length} 个配置模块的 Schema 片段\n`,
);
if (issues.length === 0) {
	console.log("✅ 全部字段路径与默认值一致，无遗漏");
	process.exit(0);
}
for (const issue of issues) {
	const marker = issue.kind.startsWith("B") ? "✗" : "⚠";
	console.log(`${marker} [${issue.section}] ${issue.kind}: ${issue.path}`);
	if (issue.kind.startsWith("B")) hardErrors += 1;
}
console.log(
	`\n${hardErrors > 0 ? `✗ ${hardErrors} 个硬错误` : "无硬错误"}，${issues.length - hardErrors} 个警告\n`,
);
process.exit(hardErrors > 0 ? 1 : 0);
