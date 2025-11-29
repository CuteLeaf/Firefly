import Key from "../i18nKey";
import type { Translation } from "../translation";

export const en: Translation = {
	[Key.home]: "Home",
	[Key.about]: "About",
	[Key.archive]: "Archive",
	[Key.search]: "Search",
	[Key.other]: "Other",

	[Key.tags]: "Tags",
	[Key.categories]: "Categories",
	[Key.recentPosts]: "Recent Posts",
	[Key.postList]: "Post List",
	[Key.tableOfContents]: "Table of Contents",

	// Announcement
	[Key.announcement]: "Announcement",
	[Key.announcementClose]: "Close",

	[Key.comments]: "Comments",
	[Key.commentSection]: "Comments",
	[Key.commentSubtitle]: "Share your thoughts and discuss with everyone",
	[Key.commentNotConfigured]: "Comment system not configured",
	[Key.guestbookCommentHint]:
		"You have not enabled the comment system in the configuration file yet. After enabling it, visitors will be able to leave messages here",
	[Key.friends]: "Friends",
	[Key.friendsDescription]:
		"Here are my friends, welcome to visit and communicate with each other",
	[Key.guestbook]: "Guestbook",
	[Key.guestbookDescription]:
		"Welcome to leave your mark here, share your thoughts and suggestions",
	[Key.untitled]: "Untitled",
	[Key.uncategorized]: "Uncategorized",
	[Key.noTags]: "No Tags",

	[Key.wordCount]: "word",
	[Key.wordsCount]: "words",
	[Key.minuteCount]: "minute",
	[Key.minutesCount]: "minutes",
	[Key.postCount]: "post",
	[Key.postsCount]: "posts",

	[Key.themeColor]: "Theme Color",

	[Key.lightMode]: "Light",
	[Key.darkMode]: "Dark",
	[Key.systemMode]: "System",

	[Key.more]: "More",

	[Key.author]: "Author",
	[Key.publishedAt]: "Published at",
	[Key.license]: "License",
	[Key.bangumi]: "Bangumi",

	// Bangumi Filter and Status Text
	[Key.bangumiTitle]: "My Bangumi",
	[Key.bangumiSubtitle]: "Record my ACG journey",
	[Key.bangumiFilterAll]: "All",
	[Key.bangumiFilterWatched]: "Watched",
	[Key.bangumiFilterWatching]: "Watching",
	[Key.bangumiFilterWish]: "Wish",
	[Key.bangumiFilterOnHold]: "On Hold",
	[Key.bangumiFilterDropped]: "Dropped",
	[Key.bangumiStatusWish]: "Wish",
	[Key.bangumiStatusWatched]: "Watched",
	[Key.bangumiStatusWatching]: "Watching",
	[Key.bangumiStatusOnHold]: "On Hold",
	[Key.bangumiStatusDropped]: "Dropped",
	[Key.bangumiStatusUnknown]: "Unknown",
	[Key.bangumiNoData]: "No Data",
	[Key.bangumiNoDataDescription]: "No items in this category",
	[Key.bangumiEmpty]: "No Data",
	[Key.bangumiEmptyReason]:
		"Possible reasons: username does not exist, network connection issue, or API limit",
	[Key.bangumiUsername]: "Username",
	[Key.bangumiApi]: "API",
	[Key.bangumiConfigTip]:
		"Tip: Please set the correct Bangumi username in the page configuration",
	[Key.bangumiPrevPage]: "Previous",
	[Key.bangumiNextPage]: "Next",
	[Key.bangumiCurrentPage]: "Page",
	[Key.bangumiTotalPages]: "of",
	[Key.bangumiPage]: "page",

	// Bangumi Categories
	[Key.bangumiCategoryBook]: "Book",
	[Key.bangumiCategoryAnime]: "Anime",
	[Key.bangumiCategoryMusic]: "Music",
	[Key.bangumiCategoryGame]: "Game",
	[Key.bangumiCategoryReal]: "Real",

	// Bangumi Data Update
	[Key.bangumiLastUpdated]: "Data updated at",
	[Key.bangumiUpdatedAt]: "Build time",
	[Key.bangumiDataStatic]: "Static data",

	// Pagination
	[Key.paginationFirst]: "First",
	[Key.paginationPrev]: "Previous",
	[Key.paginationNext]: "Next",
	[Key.paginationLast]: "Last",
	[Key.paginationPage]: "Page",
	[Key.paginationOf]: "of",
	[Key.paginationTotal]: ", Total",
	[Key.paginationRecords]: " records",

	// 404 Page
	[Key.notFound]: "404",
	[Key.notFoundTitle]: "Page Not Found",
	[Key.notFoundDescription]:
		"Sorry, the page you visited does not exist or has been moved.",
	[Key.backToHome]: "Back to Home",

	// RSS Page
	[Key.rss]: "RSS Feed",
	[Key.rssDescription]: "Subscribe to get latest updates",
	[Key.rssSubtitle]:
		"Subscribe via RSS to get the latest articles and updates imediately",
	[Key.rssLink]: "RSS Link",
	[Key.rssCopyToReader]: "Copy link to your RSS reader",
	[Key.rssCopyLink]: "Copy Link",
	[Key.rssLatestPosts]: "Latest Posts",
	[Key.rssWhatIsRSS]: "What is RSS?",
	[Key.rssWhatIsRSSDescription]:
		"RSS (Really Simple Syndication) is a standard format for publishing frequently updated content. With RSS, you can:",
	[Key.rssBenefit1]:
		"Get the latest website content in time without manually visiting",
	[Key.rssBenefit2]: "Manage subscriptions to multiple websites in one place",
	[Key.rssBenefit3]: "Avoid missing important updates and articles",
	[Key.rssBenefit4]: "Enjoy an ad-free, clean reading experience",
	[Key.rssHowToUse]:
		"It is recommended to use Feedly, Inoreader or other RSS readers to subscribe to this site.",
	[Key.rssCopied]: "RSS link copied to clipboard!",
	[Key.rssCopyFailed]: "Copy failed, please copy the link manually",

	// Last Modified Time Card
	[Key.lastModifiedPrefix]: "Last updated on ",
	[Key.lastModifiedOutdated]: "Some content may be outdated",
	[Key.lastModifiedDaysAgo]: "{days} days ago",
	[Key.year]: "year",
	[Key.month]: "month",
	[Key.day]: "day",
	[Key.hour]: "hour",
	[Key.minute]: "minute",
	[Key.second]: "second",

	// Page Views Statistics
	[Key.pageViews]: "Views",
	[Key.pageViewsLoading]: "Loading...",
	[Key.pageViewsError]: "Stats unavailable",

	// Pinned
	[Key.pinned]: "Pinned",

	// Wallpaper Mode
	[Key.wallpaperMode]: "Wallpaper Mode",
	[Key.wallpaperBannerMode]: "Banner Wallpaper",
	[Key.wallpaperOverlayMode]: "Full Screen Wallpaper",
	[Key.wallpaperNoneMode]: "Solid Color Background",

	// Sponsor Page
	[Key.sponsor]: "Sponsor",
	[Key.sponsorTitle]: "Support Me",
	[Key.sponsorDescription]:
		"If my content has been helpful to you, welcome to sponsor me through the following methods. Your support is the driving force for my continued creation!",
	[Key.sponsorMethods]: "Payment Methods",
	[Key.sponsorList]: "Sponsors",
	[Key.sponsorEmpty]: "No sponsors yet",
	[Key.sponsorAmount]: "Amount",
	[Key.sponsorDate]: "Date",
	[Key.sponsorMessage]: "Message",
	[Key.sponsorAnonymous]: "Anonymous",
	[Key.scanToSponsor]: "Scan to Sponsor",
	[Key.sponsorGoTo]: "Go to Sponsor",
	[Key.sponsorButton]: "Support",
	[Key.sponsorButtonText]: "If this article helped you, welcome to support!",

	// Site Statistics
	[Key.siteStats]: "Site Statistics",
	[Key.siteStatsPostCount]: "Posts",
	[Key.siteStatsCategoryCount]: "Categories",
	[Key.siteStatsTagCount]: "Tags",
	[Key.siteStatsTotalWords]: "Total Words",
	[Key.siteStatsRunningDays]: "Running Days",
	[Key.siteStatsLastUpdate]: "Last Activity",
	[Key.siteStatsDaysAgo]: "{days} days ago",
	[Key.siteStatsDays]: "{days} days",

	// Calendar Component
	[Key.calendarSunday]: "Sun",
	[Key.calendarMonday]: "Mon",
	[Key.calendarTuesday]: "Tue",
	[Key.calendarWednesday]: "Wed",
	[Key.calendarThursday]: "Thu",
	[Key.calendarFriday]: "Fri",
	[Key.calendarSaturday]: "Sat",
	[Key.calendarJanuary]: "Jan",
	[Key.calendarFebruary]: "Feb",
	[Key.calendarMarch]: "Mar",
	[Key.calendarApril]: "Apr",
	[Key.calendarMay]: "May",
	[Key.calendarJune]: "Jun",
	[Key.calendarJuly]: "Jul",
	[Key.calendarAugust]: "Aug",
	[Key.calendarSeptember]: "Sep",
	[Key.calendarOctober]: "Oct",
	[Key.calendarNovember]: "Nov",
	[Key.calendarDecember]: "Dec",
};
