export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // 菜单项图标（iconify 图标名 或 URL）
	iconurl?: string; // 菜单项图标 URL（支持 http/https/相对路径）
	children?: NavBarLink[]; // 支持子菜单
	pageKey?: string;
};

export enum NavBarSearchMethod {
	PageFind = 0,
}

export type NavBarSearchConfig = {
	method: NavBarSearchMethod;
};

export type NavBarConfig = {
	links: NavBarLink[];
};
