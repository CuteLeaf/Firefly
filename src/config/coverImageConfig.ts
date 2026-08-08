import type { CoverImageConfig } from "../types/coverImageConfig";

/**
 * 文章封面图配置
 *
 * enableInPost - 是否在文章详情页显示封面图
 * enableInPostOverlay - 是否使用标题和元数据叠加在封面上的布局
 * showLoading - 是否显示封面图加载动画
 *
 * 随机封面图使用说明：
 * 1. 在文章的 Frontmatter 中添加 image: "api" 即可使用随机图功能
 * 2. 系统会依次尝试所有配置的 API，全部失败后保留 LQIP 并显示错误提示
 *
 * // 文章 Frontmatter 示例：
 * ---
 * title: 文章标题
 * image: "api"
 * ---
 */
export const coverImageConfig: CoverImageConfig = {
	// 是否在文章详情页显示封面图
	enableInPost: true,

	// 是否使用标题和元数据叠加在封面上的布局
	enableInPostOverlay: true,

	// 是否显示转圈圈加载动画，会替代掉LQIP
	showLoading: false,

	randomCoverImage: {
		// 随机封面图功能开关
		enable: false,
		// 封面图API列表
		apis: [
			"https://t.alcy.cc/pc",
			"https://www.dmoe.cc/random.php",
			"https://uapis.cn/api/v1/random/image?category=acg&type=pc",
		],
	},
};
