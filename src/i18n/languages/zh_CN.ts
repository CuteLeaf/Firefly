import Key from "../i18nKey";
import type { Translation } from "../translation";

export const zh_CN: Translation = {
  [Key.home]: "主页",
  [Key.about]: "关于我",
  [Key.archive]: "归档",
  [Key.search]: "搜索",
  [Key.other]: "其他",

  [Key.tags]: "标签",
  [Key.categories]: "分类",
  [Key.recentPosts]: "最新文章",
  [Key.postList]: "文章列表",
  [Key.tableOfContents]: "目录",

  // 公告栏
  [Key.announcement]: "公告",
  [Key.announcementClose]: "关闭",

  [Key.comments]: "评论",
  [Key.commentSection]: "评论区",
  [Key.commentSubtitle]: "分享你的想法，与大家交流讨论",
  [Key.commentNotConfigured]: "评论系统暂未配置",
  [Key.guestbookCommentHint]: "您还未在配置文件中启用评论系统，启用后访客才可在此留言",
  [Key.friends]: "友链",
  [Key.guestbook]: "留言",
  [Key.untitled]: "无标题",
  [Key.uncategorized]: "未分类",
  [Key.noTags]: "无标签",

  [Key.wordCount]: "字",
  [Key.wordsCount]: "字",
  [Key.minuteCount]: "分钟",
  [Key.minutesCount]: "分钟",
  [Key.postCount]: "篇文章",
  [Key.postsCount]: "篇文章",

  [Key.themeColor]: "主题色",

  [Key.lightMode]: "亮色",
  [Key.darkMode]: "暗色",
  [Key.systemMode]: "跟随系统",

  [Key.more]: "更多",

  [Key.author]: "作者",
  [Key.publishedAt]: "发布于",
  [Key.license]: "许可协议",
  [Key.anime]: "追番",

  // 番剧页面
  [Key.animeTitle]: "我的追番记录",
  [Key.animeSubtitle]: "记录我的二次元之旅",
  [Key.animeList]: "追番列表",
  [Key.animeTotal]: "总数",
  [Key.animeWatching]: "追番中",
  [Key.animeCompleted]: "已追完",
  [Key.animeAvgRating]: "平均评分",
  [Key.animeStatusWatching]: "追番中",
  [Key.animeStatusCompleted]: "已追完",
  [Key.animeStatusPlanned]: "计划中",
  [Key.animeStudio]: "制作",
  [Key.animeEmpty]: "暂无追番数据",
  [Key.animeEmptyBangumi]: "请检查 Bangumi 配置或网络连接",
  
  // 动漫状态
  [Key.animeStatusAll]: "全部",
  [Key.animeStatusWish]: "想看",
  [Key.animeStatusDone]: "看过",
  [Key.animeStatusDoing]: "在看",
  [Key.animeStatusOnhold]: "搁置",
  [Key.animeStatusDropped]: "抛弃",
  
  // 动漫页面文本
  [Key.animeLoading]: "正在加载追番数据...",
  [Key.animeLoadingDescription]: "请稍候，正在从 Bangumi 获取您的收藏信息",
  [Key.animeError]: "数据加载失败",
  [Key.animeErrorDescription]: "无法连接到 Bangumi API，请检查网络连接或稍后重试",
  [Key.animeRetry]: "重新加载",
  [Key.animeEmptyData]: "暂无数据",
  [Key.animeEmptyDescription]: "该分类下暂时没有找到相关的动漫作品",
  [Key.animeEmptySuggestion]: "试试切换到其他分类查看",
  [Key.animeConfigDescription]: "请在 src/config/siteConfig.ts 文件中设置你的 Bangumi 用户ID",
  [Key.animeRefreshNote]: "由于一些限制，可能需要F5刷新一次页面才会加载追番数据，目前还没有很好的解决方法",
  
  // 动漫信息
  [Key.animeYear]: "年份",
  [Key.animeEpisodes]: "集数",
  [Key.animeRank]: "排名",
  [Key.animeUnknown]: "未知",
  [Key.animeLoadFailed]: "加载失败",

  // 分页
  [Key.paginationFirst]: "首页",
  [Key.paginationPrev]: "上一页",
  [Key.paginationNext]: "下一页",
  [Key.paginationLast]: "末页",
  [Key.paginationPage]: "第",
  [Key.paginationOf]: "页，共",
  [Key.paginationTotal]: "页，总计",
  [Key.paginationRecords]: "条记录",

  // 404页面
  [Key.notFound]: "404",
  [Key.notFoundTitle]: "页面未找到",
  [Key.notFoundDescription]: "抱歉，您访问的页面不存在或已被移动。",
  [Key.backToHome]: "返回首页",

  // RSS页面
  [Key.rss]: "RSS 订阅",
  [Key.rssDescription]: "订阅获取最新更新",
  [Key.rssSubtitle]: "通过 RSS 订阅，第一时间获取最新文章和动态",
  [Key.rssLink]: "RSS 链接",
  [Key.rssCopyToReader]: "复制链接到你的 RSS 阅读器",
  [Key.rssCopyLink]: "复制链接",
  [Key.rssLatestPosts]: "最新文章",
  [Key.rssWhatIsRSS]: "什么是 RSS？",
  [Key.rssWhatIsRSSDescription]:
    "RSS（Really Simple Syndication）是一种用于发布经常更新内容的标准格式。通过 RSS，你可以：",
  [Key.rssBenefit1]: "及时获取网站最新内容，无需手动访问",
  [Key.rssBenefit2]: "在一个地方管理多个网站的订阅",
  [Key.rssBenefit3]: "避免错过重要更新和文章",
  [Key.rssBenefit4]: "享受无广告的纯净阅读体验",
  [Key.rssHowToUse]: "推荐使用 Feedly、Inoreader 或其他 RSS 阅读器来订阅本站。",
  [Key.rssCopied]: "RSS 链接已复制到剪贴板！",
  [Key.rssCopyFailed]: "复制失败，请手动复制链接",



  //最后编辑时间卡片
  [Key.lastModifiedPrefix]: "最后更新于 ",
  [Key.lastModifiedOutdated]: "部分内容可能已过时",
  [Key.lastModifiedDaysAgo]: "距今已过 {days} 天",
  [Key.year]: "年",
  [Key.month]: "月",
  [Key.day]: "日",
  [Key.hour]: "时",
  [Key.minute]: "分",
  [Key.second]: "秒",

  // 访问量统计
  [Key.pageViews]: "浏览量",
  [Key.pageViewsLoading]: "加载中...",
  [Key.pageViewsError]: "统计不可用",

  // 置顶
  [Key.pinned]: "置顶",

  // 壁纸模式
  [Key.wallpaperMode]: "壁纸模式",
  [Key.wallpaperBannerMode]: "横幅壁纸",
  [Key.wallpaperOverlayMode]: "全屏壁纸",
  [Key.wallpaperNoneMode]: "纯色背景",

  // 赞助页面
  [Key.sponsor]: "赞助",
  [Key.sponsorTitle]: "赞助支持",
  [Key.sponsorDescription]: "如果我的内容对你有帮助，欢迎通过以下方式赞助我，你的支持是我持续创作的动力！",
  [Key.sponsorMethods]: "赞助方式",
  [Key.sponsorList]: "赞助列表",
  [Key.sponsorEmpty]: "暂无赞助记录",
  [Key.sponsorAmount]: "金额",
  [Key.sponsorDate]: "日期",
  [Key.sponsorMessage]: "留言",
  [Key.sponsorAnonymous]: "匿名",
  [Key.scanToSponsor]: "扫码赞助",
  [Key.sponsorGoTo]: "前往赞助",
  [Key.sponsorButton]: "赞助支持",
  [Key.sponsorButtonText]: "如果这篇文章对你有帮助，欢迎赞助支持！",
};
