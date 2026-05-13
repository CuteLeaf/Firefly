import type { CoverImageConfig } from "../types/config";

//  随机封面图使用说明：
//  1. 在文章的 Frontmatter 中添加 image: "api" 即可使用随机图功能
//  2. 系统会依次尝试所有配置的 API，全部失败后使用备用图片
//  // 文章 Frontmatter 示例：
//  ---
//  image: "api"
//  ---

export const coverImageConfig: CoverImageConfig = {
	enableInPost: true,
	randomCoverImage: {
		enable: false,
		apis: [
			"https://t.alcy.cc/pc",
			"https://www.dmoe.cc/random.php",
			"https://uapis.cn/api/v1/random/image?category=acg&type=pc",
		],
		fallback: "assets/images/cover.avif",
		showLoading: false,
	},
};
