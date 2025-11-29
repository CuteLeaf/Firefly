// types/global.d.ts
// Global type declarations to reduce 'any' usage and declare common static assets
declare global {
	interface User {
		id: number;
		name: string;
		email?: string;
	}

	interface Window {
		__APP_GLOBALS__?: Record<string, unknown>;
	}
}

// Static asset module declarations
declare module "*.svg" {
	const content: string;
	export default content;
}
declare module "*.png" {
	const content: string;
	export default content;
}
declare module "*.jpg" {
	const content: string;
	export default content;
}
declare module "*.jpeg" {
	const content: string;
	export default content;
}
declare module "*.gif" {
	const content: string;
	export default content;
}
declare module "*.css" {
	const content: Record<string, string>;
	export default content;
}
declare module "*.scss" {
	const content: Record<string, string>;
	export default content;
}

export {};
