import Key from "../i18nKey";
import type { Translation } from "../translation";

export const ja: Translation = {
	[Key.home]: "ホーム",
	[Key.about]: "について",
	[Key.archive]: "アーカイブ",
	[Key.search]: "検索",
	[Key.searchNoResults]: "結果が見つかりません。",
	[Key.searchTypeSomething]: "検索キーワードを入力してください。",
	[Key.searchLoading]: "検索中...",
	[Key.searchSummary]: "摘要",
	[Key.searchContent]: "内容",
	[Key.searchViewMore]: "さらに結果を表示 ({count} 件)",
	[Key.other]: "その他",
	[Key.all]: "すべて",

	[Key.tags]: "タグ",
	[Key.categories]: "カテゴリ",
	[Key.recentPosts]: "最近の投稿",
	[Key.postList]: "投稿リスト",
	[Key.tableOfContents]: "目次",
	[Key.music]: "音楽",
	[Key.musicNoPlaying]: "再生中なし",
	[Key.musicLyrics]: "歌詞",
	[Key.musicVolume]: "音量",
	[Key.musicPlayMode]: "再生モードを切り替え",
	[Key.musicPrev]: "前の曲",
	[Key.musicNext]: "次の曲",
	[Key.musicPlaylist]: "プレイリスト",
	[Key.musicNoLyrics]: "歌詞なし",
	[Key.musicLoadingLyrics]: "歌詞を読み込み中...",
	[Key.musicFailedLyrics]: "歌詞の読み込みに失敗しました",
	[Key.musicNoSongs]: "曲なし",
	[Key.musicError]: "プレーヤーエラー",
	[Key.musicPlay]: "再生",
	[Key.musicPause]: "一時停止",
	[Key.musicProgress]: "再生の進捗",
	[Key.musicCover]: "カバー",
	[Key.musicNoCover]: "カバーなし",
	[Key.musicAudioPlayer]: "オーディオプレーヤー",

	// お知らせ
	[Key.announcement]: "お知らせ",
	[Key.announcementClose]: "閉じる",

	[Key.comments]: "コメント",
	[Key.commentSection]: "コメント欄",
	[Key.commentSubtitle]: "あなたの考えを共有し、みんなと議論しましょう",
	[Key.commentNotConfigured]: "コメントシステムが設定されていません",
	[Key.guestbookCommentHint]:
		"設定ファイルでコメントシステムをまだ有効にしていません。有効にすると、訪問者がここにメッセージを残せるようになります",
	[Key.friends]: "友達",
	[Key.friendsDescription]:
		"ここは私の友達です、お互いに訪問して交流することを歓迎します",
	[Key.guestbook]: "ゲストブック",
	[Key.guestbookDescription]:
		"ここに足跡を残して、あなたの考えや提案を共有してください",
	[Key.untitled]: "無題",
	[Key.uncategorized]: "未分類",
	[Key.noTags]: "タグなし",

	[Key.wordCount]: "語",
	[Key.wordsCount]: "語",
	[Key.minuteCount]: "分",
	[Key.minutesCount]: "分",
	[Key.postCount]: "投稿",
	[Key.postsCount]: "投稿",

	[Key.themeColor]: "テーマカラー",

	[Key.lightMode]: "ライト",
	[Key.darkMode]: "ダーク",
	[Key.systemMode]: "システム",

	[Key.more]: "もっと",

	[Key.author]: "著者",
	[Key.publishedAt]: "公開日",
	[Key.updatedAt]: "更新日",
	[Key.readTime]: "読了時間",
	[Key.license]: "ライセンス",
	[Key.bangumi]: "バングミ",

	// バングミフィルターと状態文本
	[Key.bangumiTitle]: "私のバングミ",
	[Key.bangumiSubtitle]: "私の二次元の旅を記録する",
	[Key.bangumiFilterAll]: "すべて",
	[Key.bangumiFilterWatched]: "見た",
	[Key.bangumiFilterWatching]: "視聴中",
	[Key.bangumiFilterWish]: "見たい",
	[Key.bangumiFilterOnHold]: "保留",
	[Key.bangumiFilterDropped]: "中断",
	[Key.bangumiFilterGamePlayed]: "プレイ済み",
	[Key.bangumiFilterGamePlaying]: "プレイ中",
	[Key.bangumiFilterGameWish]: "プレイしたい",
	[Key.bangumiFilterBookRead]: "読んだ",
	[Key.bangumiFilterBookReading]: "読んでいる",
	[Key.bangumiFilterBookWish]: "読みたい",
	[Key.bangumiFilterMusicListened]: "聴いた",
	[Key.bangumiFilterMusicListening]: "聴いている",
	[Key.bangumiFilterMusicWish]: "聴きたい",
	[Key.bangumiStatusWish]: "見たい",
	[Key.bangumiStatusWatched]: "見た",
	[Key.bangumiStatusWatching]: "視聴中",
	[Key.bangumiStatusOnHold]: "保留",
	[Key.bangumiStatusDropped]: "中断",
	[Key.bangumiStatusGameWish]: "プレイしたい",
	[Key.bangumiStatusGamePlayed]: "プレイ済み",
	[Key.bangumiStatusGamePlaying]: "プレイ中",
	[Key.bangumiStatusBookWish]: "読みたい",
	[Key.bangumiStatusBookRead]: "読んだ",
	[Key.bangumiStatusBookReading]: "読んでいる",
	[Key.bangumiStatusMusicWish]: "聴きたい",
	[Key.bangumiStatusMusicListened]: "聴いた",
	[Key.bangumiStatusMusicListening]: "聴いている",
	[Key.bangumiStatusUnknown]: "不明",
	[Key.bangumiNoData]: "データなし",
	[Key.bangumiNoDataDescription]: "このカテゴリに項目がありません",
	[Key.bangumiEmpty]: "データなし",
	[Key.bangumiEmptyReason]:
		"考えられる理由：ユーザー名が存在しない、ネットワーク接続の問題、またはAPI制限",
	[Key.bangumiUsername]: "ユーザー名",
	[Key.bangumiApi]: "API",
	[Key.bangumiConfigTip]:
		"ヒント：ページ設定で正しいBangumiユーザー名を設定してください",
	[Key.bangumiPrevPage]: "前へ",
	[Key.bangumiNextPage]: "次へ",
	[Key.bangumiCurrentPage]: "ページ",
	[Key.bangumiTotalPages]: "の",
	[Key.bangumiPage]: "ページ",

	// バングミカテゴリ
	[Key.bangumiCategoryBook]: "本",
	[Key.bangumiCategoryAnime]: "アニメ",
	[Key.bangumiCategoryMusic]: "音楽",
	[Key.bangumiCategoryGame]: "ゲーム",
	[Key.bangumiCategoryReal]: "実写",

	// バングミデータ更新
	[Key.bangumiLastUpdated]: "データ更新",
	[Key.bangumiUpdatedAt]: "ビルド時間",
	[Key.bangumiDataStatic]: "静的データ",

	// ページネーション
	[Key.paginationFirst]: "最初",
	[Key.paginationPrev]: "前へ",
	[Key.paginationNext]: "次へ",
	[Key.paginationLast]: "最後",
	[Key.paginationPage]: "",
	[Key.paginationOf]: "ページ、全",
	[Key.paginationTotal]: "ページ、合計",
	[Key.paginationRecords]: "件",

	// 404ページ
	[Key.notFound]: "404",
	[Key.notFoundTitle]: "ページが見つかりません",
	[Key.notFoundDescription]:
		"申し訳ありませんが、アクセスしたページは存在しないか、移動されています。",
	[Key.backToHome]: "ホームに戻る",

	// RSSページ
	[Key.rss]: "RSSフィード",
	[Key.rssDescription]: "最新の更新を購読する",
	[Key.rssSubtitle]: "RSSで購読して、最新の記事と更新を第一时间で取得する",
	[Key.rssLink]: "RSSリンク",
	[Key.rssCopyToReader]: "RSSリンクをリーダーにコピー",
	[Key.rssCopyLink]: "リンクをコピー",
	[Key.rssLatestPosts]: "最新の投稿",
	[Key.rssWhatIsRSS]: "RSSとは？",
	[Key.rssWhatIsRSSDescription]:
		"RSS（Really Simple Syndication）は、頻繁に更新されるコンテンツを公開するための標準形式です。RSSを使用すると：",
	[Key.rssBenefit1]:
		"手動で訪問することなく、最新のウェブサイトコンテンツを及时に取得",
	[Key.rssBenefit2]: "1か所で複数のウェブサイトの購読を管理",
	[Key.rssBenefit3]: "重要な更新や記事を見逃すことを回避",
	[Key.rssBenefit4]: "広告なしのクリーンな読書体験を楽しむ",
	[Key.rssHowToUse]:
		"Feedly、Inoreaderまたは他のRSSリーダーを使用してこのサイトを購読することを推奨します。",
	[Key.rssCopied]: "RSSリンクがクリップボードにコピーされました！",
	[Key.rssCopyFailed]: "コピーに失敗しました。手動でリンクをコピーしてください",

	// 最終更新時間カード
	[Key.lastModifiedPrefix]: "最終更新日：",
	[Key.lastModifiedOutdated]: "一部の内容が古くなっている可能性があります",
	[Key.lastModifiedDaysAgo]: "{days}日前",
	[Key.year]: "年",
	[Key.month]: "月",
	[Key.day]: "日",
	[Key.hour]: "時",
	[Key.minute]: "分",
	[Key.second]: "秒",

	// ページビュー統計
	[Key.pageViews]: "閲覧数",
	[Key.pageViewsLoading]: "読み込み中...",
	[Key.pageViewsError]: "統計利用不可",

	// ピン留め
	[Key.pinned]: "ピン留め",

	// 壁紙モード
	[Key.wallpaperMode]: "壁紙モード",
	[Key.wallpaperBannerMode]: "バナー壁紙",
	[Key.wallpaperOverlayMode]: "透明",
	[Key.wallpaperNoneMode]: "単色背景",

	// バナー設定
	[Key.bannerSettings]: "バナー設定",
	[Key.bannerTitle]: "ホームバナータイトル",
	[Key.wavesAnimation]: "波アニメーション",

	// 投稿リストレイアウト
	[Key.postListLayout]: "投稿リストレイアウト",
	[Key.postListLayoutList]: "リスト",
	[Key.postListLayoutGrid]: "グリッド",

	// スポンサーページ
	[Key.sponsor]: "スポンサー",
	[Key.sponsorTitle]: "サポート",
	[Key.sponsorDescription]:
		"私のコンテンツがあなたの役に立ったなら、以下の方法で私をスポンサーしてください。あなたのサポートは私の継続的な創作の原動力です！",
	[Key.sponsorMethods]: "支払い方法",
	[Key.sponsorList]: "スポンサーリスト",
	[Key.sponsorEmpty]: "スポンサー記録なし",
	[Key.sponsorAmount]: "金額",
	[Key.sponsorDate]: "日付",
	[Key.sponsorMessage]: "メッセージ",
	[Key.sponsorAnonymous]: "匿名",
	[Key.scanToSponsor]: "スキャンしてスポンサー",
	[Key.sponsorGoTo]: "スポンサーへ",
	[Key.sponsorButton]: "サポートと共有",
	[Key.sponsorButtonText]:
		"この記事が役に立ったなら、共有またはサポートをお願いします！",

	[Key.shareOnSocial]: "記事を共有",
	[Key.shareOnSocialDescription]:
		"この記事が役に立ったなら、ぜひ他の人と共有してください！",

	// サイト統計
	[Key.siteStats]: "サイト統計",
	[Key.siteStatsPostCount]: "記事",
	[Key.siteStatsCategoryCount]: "カテゴリー",
	[Key.siteStatsTagCount]: "タグ",
	[Key.siteStatsTotalWords]: "総文字数",
	[Key.siteStatsRunningDays]: "運用日数",
	[Key.siteStatsLastUpdate]: "最終活動",
	[Key.siteStatsDaysAgo]: "{days} 日前",
	[Key.siteStatsDays]: "{days} 日",
	[Key.today]: "今日",

	// カレンダーコンポーネント
	[Key.calendarSunday]: "日",
	[Key.calendarMonday]: "月",
	[Key.calendarTuesday]: "火",
	[Key.calendarWednesday]: "水",
	[Key.calendarThursday]: "木",
	[Key.calendarFriday]: "金",
	[Key.calendarSaturday]: "土",
	[Key.calendarJanuary]: "1月",
	[Key.calendarFebruary]: "2月",
	[Key.calendarMarch]: "3月",
	[Key.calendarApril]: "4月",
	[Key.calendarMay]: "5月",
	[Key.calendarJune]: "6月",
	[Key.calendarJuly]: "7月",
	[Key.calendarAugust]: "8月",
	[Key.calendarSeptember]: "9月",
	[Key.calendarOctober]: "10月",
	[Key.calendarNovember]: "11月",
	[Key.calendarDecember]: "12月",

	[Key.shareArticle]: "共有",
	[Key.generatingPoster]: "ポスター生成中...",
	[Key.copied]: "コピーしました",
	[Key.copyLink]: "リンクをコピー",
	[Key.savePoster]: "ポスターを保存",
	[Key.scanToRead]: "QRコードで読む",

	// コードブロック折りたたみ設定
	[Key.codeCollapsibleShowMore]: "もっと表示",
	[Key.codeCollapsibleShowLess]: "少なく表示",
	[Key.codeCollapsibleExpanded]: "コードブロックが展開されました",
	[Key.codeCollapsibleCollapsed]: "コードブロックが折りたたまれました",
};
