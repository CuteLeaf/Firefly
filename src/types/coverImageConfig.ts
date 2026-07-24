export type CoverImageConfig = {
	enableInPost: boolean; // 是否在文章详情页显示封面图
	enableInPostOverlay?: boolean; // 是否使用标题和元数据叠加在封面上的布局
	showLoading?: boolean; // 是否显示加载动画
	randomCoverImage: {
		enable: boolean; // 是否启用随机图功能
		apis: string[]; // 随机图API列表
		fallback?: string; // API失败时的回退图片路径（相对于src目录或以/开头的public目录路径）
	};
};
