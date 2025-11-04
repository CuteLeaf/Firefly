import Key from "../i18nKey";
import type { Translation } from "../translation";

export const zh_TW: Translation = {
  [Key.home]: "首頁",
  [Key.about]: "關於我",
  [Key.archive]: "歸檔",
  [Key.search]: "搜尋",
  [Key.other]: "其他",

  [Key.tags]: "標籤",
  [Key.categories]: "分類",
  [Key.recentPosts]: "最新文章",
  [Key.postList]: "文章列表",
  [Key.tableOfContents]: "目錄",

  // 公告欄
  [Key.announcement]: "公告",
  [Key.announcementClose]: "關閉",

  [Key.comments]: "評論",
  [Key.commentSection]: "評論區",
  [Key.commentSubtitle]: "分享你的想法，與大家交流討論",
  [Key.commentNotConfigured]: "評論系統暫未配置",
  [Key.guestbookCommentHint]: "您還未在配置文件中啟用評論系統，啟用後訪客才可在此留言",
  [Key.friends]: "友鏈",
  [Key.guestbook]: "留言",
  [Key.untitled]: "無標題",
  [Key.uncategorized]: "未分類",
  [Key.noTags]: "無標籤",

  [Key.wordCount]: "字",
  [Key.wordsCount]: "字",
  [Key.minuteCount]: "分鐘",
  [Key.minutesCount]: "分鐘",
  [Key.postCount]: "篇文章",
  [Key.postsCount]: "篇文章",

  [Key.themeColor]: "主題色",

  [Key.lightMode]: "亮色",
  [Key.darkMode]: "暗色",
  [Key.systemMode]: "跟隨系統",

  [Key.more]: "更多",

  [Key.author]: "作者",
  [Key.publishedAt]: "發布於",
  [Key.license]: "許可協議",
  [Key.anime]: "追番",

  // 番劇頁面
  [Key.animeTitle]: "我的追番記錄",
  [Key.animeSubtitle]: "記錄我的二次元之旅",
  [Key.animeList]: "追番列表",
  [Key.animeTotal]: "總數",
  [Key.animeWatching]: "追番中",
  [Key.animeCompleted]: "已追完",
  [Key.animeAvgRating]: "平均評分",
  [Key.animeStatusWatching]: "追番中",
  [Key.animeStatusCompleted]: "已追完",
  [Key.animeStatusPlanned]: "計劃中",
  [Key.animeYear]: "年份",
  [Key.animeStudio]: "製作",
  [Key.animeEmpty]: "暫無追番數據",
  [Key.animeEmptyBangumi]: "請檢查 Bangumi 配置或網絡連接",
  
  // 動漫狀態
  [Key.animeStatusAll]: "全部",
  [Key.animeStatusWish]: "想看",
  [Key.animeStatusDone]: "看過",
  [Key.animeStatusDoing]: "在看",
  [Key.animeStatusOnhold]: "擱置",
  [Key.animeStatusDropped]: "拋棄",
  
  // 動漫頁面文本
  [Key.animeLoading]: "正在加載追番數據...",
  [Key.animeLoadingDescription]: "請稍候，正在從 Bangumi 獲取您的收藏信息",
  [Key.animeError]: "數據加載失敗",
  [Key.animeErrorDescription]: "無法連接到 Bangumi API，請檢查網絡連接或稍後重試",
  [Key.animeRetry]: "重新加載",
  [Key.animeEmptyData]: "暫無數據",
  [Key.animeEmptyDescription]: "該分類下暫時沒有找到相關的動漫作品",
  [Key.animeEmptySuggestion]: "試試切換到其他分類查看",
  [Key.animeConfigDescription]: "請在 src/config/siteConfig.ts 文件中設置你的 Bangumi 用戶ID",
  [Key.animeRefreshNote]: "由於一些限制，可能需要F5刷新一次頁面才會加載追番數據，目前還沒有很好的解決方法",
  
  // 動漫信息
  [Key.animeEpisodes]: "集數",
  [Key.animeRank]: "排名",
  [Key.animeUnknown]: "未知",
  [Key.animeLoadFailed]: "加載失敗",

  // 分頁
  [Key.paginationFirst]: "首頁",
  [Key.paginationPrev]: "上一頁",
  [Key.paginationNext]: "下一頁",
  [Key.paginationLast]: "末頁",
  [Key.paginationPage]: "第",
  [Key.paginationOf]: "頁，共",
  [Key.paginationTotal]: "頁，總計",
  [Key.paginationRecords]: "條記錄",

  // 404頁面
  [Key.notFound]: "404",
  [Key.notFoundTitle]: "頁面未找到",
  [Key.notFoundDescription]: "抱歉，您訪問的頁面不存在或已被移動。",
  [Key.backToHome]: "返回首頁",

  // RSS頁面
  [Key.rss]: "RSS 訂閱",
  [Key.rssDescription]: "訂閱獲取最新更新",
  [Key.rssSubtitle]: "通過 RSS 訂閱，第一時間獲取最新文章和動態",
  [Key.rssLink]: "RSS 鏈接",
  [Key.rssCopyToReader]: "複製鏈接到你的 RSS 閱讀器",
  [Key.rssCopyLink]: "複製鏈接",
  [Key.rssLatestPosts]: "最新文章",
  [Key.rssWhatIsRSS]: "什麼是 RSS？",
  [Key.rssWhatIsRSSDescription]:
    "RSS（Really Simple Syndication）是一種用於發布經常更新內容的標準格式。通過 RSS，你可以：",
  [Key.rssBenefit1]: "及時獲取網站最新內容，無需手動訪問",
  [Key.rssBenefit2]: "在一個地方管理多個網站的訂閱",
  [Key.rssBenefit3]: "避免錯過重要更新和文章",
  [Key.rssBenefit4]: "享受無廣告的純淨閱讀體驗",
  [Key.rssHowToUse]: "推薦使用 Feedly、Inoreader 或其他 RSS 閱讀器來訂閱本站。",
  [Key.rssCopied]: "RSS 鏈接已複製到剪貼板！",
  [Key.rssCopyFailed]: "複製失敗，請手動複製鏈接",



  //最後編輯時間卡片
  [Key.lastModifiedPrefix]: "最後更新於 ",
  [Key.lastModifiedOutdated]: "部分內容可能已過時",
  [Key.lastModifiedDaysAgo]: "距今已過 {days} 天",
  [Key.year]: "年",
  [Key.month]: "月",
  [Key.day]: "日",
  [Key.hour]: "時",
  [Key.minute]: "分",
  [Key.second]: "秒",

  // 訪問量統計
  [Key.pageViews]: "瀏覽量",
  [Key.pageViewsLoading]: "載入中...",
  [Key.pageViewsError]: "統計不可用",

  // 置頂
  [Key.pinned]: "置頂",

  // 壁紙模式
  [Key.wallpaperMode]: "壁紙模式",
  [Key.wallpaperBannerMode]: "橫幅壁紙",
  [Key.wallpaperOverlayMode]: "全屏壁紙",
  [Key.wallpaperNoneMode]: "純色背景",

  // 贊助頁面
  [Key.sponsor]: "贊助",
  [Key.sponsorTitle]: "贊助支持",
  [Key.sponsorDescription]: "如果我的內容對你有幫助，歡迎通過以下方式贊助我，你的支持是我持續創作的動力！",
  [Key.sponsorMethods]: "贊助方式",
  [Key.sponsorList]: "贊助列表",
  [Key.sponsorEmpty]: "暫無贊助記錄",
  [Key.sponsorAmount]: "金額",
  [Key.sponsorDate]: "日期",
  [Key.sponsorMessage]: "留言",
  [Key.sponsorAnonymous]: "匿名",
  [Key.scanToSponsor]: "掃碼贊助",
  [Key.sponsorGoTo]: "前往贊助",
  [Key.sponsorButton]: "贊助支持",
  [Key.sponsorButtonText]: "如果這篇文章對你有幫助，歡迎贊助支持！",
};
