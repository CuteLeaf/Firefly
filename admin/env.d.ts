/**
 * 管理后台类型环境补充。
 * 后台服务通过 tsx 在 Node 中运行并静态导入 src/config 下的模块，
 * 这些模块引用了 import.meta.env（在 Astro/Vite 构建中有值，Node 中为 undefined，
 * 工具函数内部已做 try/catch 回退处理），这里补上类型声明。
 */
interface ImportMetaEnv {
	readonly [key: string]: unknown;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
