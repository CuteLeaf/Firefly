// 让 .ts barrel（如 firefly-mdx.ts）能 re-export `.astro` 组件。
//
// 背景：纯 tsc 不把 `.astro` 当源文件解析，`.ts` 里 `import ... from "./X.astro"`
// 会报 "Cannot find module"。编辑器/`astro check` 走 @astrojs/ts-plugin，能拿到
// 真实类型；这里只是给 `pnpm type-check`（纯 tsc）兜底，不影响实际渲染。
declare module "*.astro" {
	import type { AstroComponentFactory } from "astro/runtime/server/index.js";

	const component: AstroComponentFactory;
	export default component;
}
