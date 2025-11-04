import Key from "../i18nKey";
import type { Translation } from "../translation";

export const ja: Translation = {
  [Key.home]: "ホーム",
  [Key.about]: "について",
  [Key.archive]: "アーカイブ",
  [Key.search]: "検索",
  [Key.other]: "その他",

  [Key.tags]: "タグ",
  [Key.categories]: "カテゴリ",
  [Key.recentPosts]: "最近の投稿",
  [Key.postList]: "投稿リスト",
  [Key.tableOfContents]: "目次",

  // お知らせ
  [Key.announcement]: "お知らせ",
  [Key.announcementClose]: "閉じる",

  [Key.comments]: "コメント",
  [Key.commentSection]: "コメント欄",
  [Key.commentSubtitle]: "あなたの考えを共有し、みんなと議論しましょう",
  [Key.commentNotConfigured]: "コメントシステムが設定されていません",
  [Key.guestbookCommentHint]: "設定ファイルでコメントシステムをまだ有効にしていません。有効にすると、訪問者がここにメッセージを残せるようになります",
  [Key.friends]: "友達",
  [Key.guestbook]: "ゲストブック",
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
  [Key.license]: "ライセンス",
  [Key.anime]: "アニメ",

  // アニメページ
  [Key.animeTitle]: "私のアニメリスト",
  [Key.animeSubtitle]: "私の二次元の旅を記録する",
  [Key.animeList]: "アニメリスト",
  [Key.animeTotal]: "合計",
  [Key.animeWatching]: "視聴中",
  [Key.animeCompleted]: "完了",
  [Key.animeAvgRating]: "平均評価",
  [Key.animeStatusWatching]: "視聴中",
  [Key.animeStatusCompleted]: "完了",
  [Key.animeStatusPlanned]: "予定",
  [Key.animeYear]: "年",
  [Key.animeStudio]: "スタジオ",
  [Key.animeEmpty]: "アニメデータなし",
  [Key.animeEmptyBangumi]:
    "Bangumiの設定またはネットワーク接続を確認してください",
  
  // アニメ状態
  [Key.animeStatusAll]: "すべて",
  [Key.animeStatusWish]: "見たい",
  [Key.animeStatusDone]: "見た",
  [Key.animeStatusDoing]: "視聴中",
  [Key.animeStatusOnhold]: "保留",
  [Key.animeStatusDropped]: "中断",
  
  // アニメページテキスト
  [Key.animeLoading]: "アニメデータを読み込み中...",
  [Key.animeLoadingDescription]: "お待ちください、Bangumiからコレクション情報を取得しています",
  [Key.animeError]: "データ読み込み失敗",
  [Key.animeErrorDescription]: "Bangumi APIに接続できません。ネットワーク接続を確認するか、後で再試行してください",
  [Key.animeRetry]: "再読み込み",
  [Key.animeEmptyData]: "データなし",
  [Key.animeEmptyDescription]: "このカテゴリには関連するアニメ作品が見つかりませんでした",
  [Key.animeEmptySuggestion]: "他のカテゴリに切り替えてみてください",
  [Key.animeConfigDescription]: "src/config/siteConfig.tsファイルでBangumiユーザーIDを設定してください",
  [Key.animeRefreshNote]: "一部の制限により、アニメデータを読み込むためにページを一度更新する必要があるかもしれません。現在、良い解決方法はありません",
  
  // アニメ情報
  [Key.animeEpisodes]: "エピソード",
  [Key.animeRank]: "ランク",
  [Key.animeUnknown]: "不明",
  [Key.animeLoadFailed]: "読み込み失敗",

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
  [Key.wallpaperOverlayMode]: "全画面壁紙",
  [Key.wallpaperNoneMode]: "単色背景",

  // スポンサーページ
  [Key.sponsor]: "スポンサー",
  [Key.sponsorTitle]: "サポート",
  [Key.sponsorDescription]: "私のコンテンツがあなたの役に立ったなら、以下の方法で私をスポンサーしてください。あなたのサポートは私の継続的な創作の原動力です！",
  [Key.sponsorMethods]: "支払い方法",
  [Key.sponsorList]: "スポンサーリスト",
  [Key.sponsorEmpty]: "スポンサー記録なし",
  [Key.sponsorAmount]: "金額",
  [Key.sponsorDate]: "日付",
  [Key.sponsorMessage]: "メッセージ",
  [Key.sponsorAnonymous]: "匿名",
  [Key.scanToSponsor]: "スキャンしてスポンサー",
  [Key.sponsorGoTo]: "スポンサーへ",
  [Key.sponsorButton]: "サポート",
  [Key.sponsorButtonText]: "この記事が役に立ったなら、サポートをお願いします！",
};
