import Key from "../i18nKey";
import type { Translation } from "../translation";

export const ru: Translation = {
	[Key.home]: "Главная",
	[Key.about]: "О нас",
	[Key.archive]: "Архив",
	[Key.search]: "Поиск",
	[Key.other]: "Прочее",

	[Key.tags]: "Теги",
	[Key.categories]: "Категории",
	[Key.recentPosts]: "Последние посты",
	[Key.postList]: "Список постов",
	[Key.tableOfContents]: "Содержание",

	// Объявление
	[Key.announcement]: "Объявление",
	[Key.announcementClose]: "Закрыть",

	[Key.comments]: "Комментарии",
	[Key.commentSection]: "Комментарии",
	[Key.commentSubtitle]: "Поделитесь своими мыслями и обсудите с остальными",
	[Key.commentNotConfigured]: "Система комментариев не настроена",
	[Key.guestbookCommentHint]:
		"Вы еще не включили систему комментариев в файле конфигурации. После включения посетители смогут оставлять сообщения здесь",
	[Key.friends]: "Ссылки",
	[Key.friendsDescription]:
		"Вот мои друзья, добро пожаловать посетить и общаться друг с другом",
	[Key.guestbook]: "Гостевая книга",
	[Key.guestbookDescription]:
		"Добро пожаловать, оставьте свой след здесь, поделитесь своими мыслями и предложениями",
	[Key.untitled]: "Без названия",
	[Key.uncategorized]: "Без категории",
	[Key.noTags]: "Нет тегов",

	[Key.wordCount]: "слово",
	[Key.wordsCount]: "слова",
	[Key.minuteCount]: "минута",
	[Key.minutesCount]: "минуты",
	[Key.postCount]: "пост",
	[Key.postsCount]: "постов",

	[Key.themeColor]: "Цвет темы",

	[Key.lightMode]: "Светлая",
	[Key.darkMode]: "Тёмная",
	[Key.systemMode]: "Система",

	[Key.more]: "Ещё",

	[Key.author]: "Автор",
	[Key.publishedAt]: "Опубликовано",
	[Key.license]: "Лицензия",
	[Key.bangumi]: "Бангуми",

	// Фильтр и статус Бангуми текст
	[Key.bangumiTitle]: "Мой план группы",
	[Key.bangumiSubtitle]: "Запись моего аниме путешествия",
	[Key.bangumiFilterAll]: "Все",
	[Key.bangumiFilterWatched]: "Просмотрено",
	[Key.bangumiFilterWatching]: "Смотрю",
	[Key.bangumiFilterWish]: "Хочу",
	[Key.bangumiFilterOnHold]: "Отложено",
	[Key.bangumiFilterDropped]: "Брошено",
	[Key.bangumiStatusWish]: "Хочу",
	[Key.bangumiStatusWatched]: "Просмотрено",
	[Key.bangumiStatusWatching]: "Смотрю",
	[Key.bangumiStatusOnHold]: "Отложено",
	[Key.bangumiStatusDropped]: "Брошено",
	[Key.bangumiStatusUnknown]: "Неизвестно",
	[Key.bangumiNoData]: "Нет данных",
	[Key.bangumiNoDataDescription]: "В этой категории нет элементов",
	[Key.bangumiEmpty]: "Нет данных",
	[Key.bangumiEmptyReason]:
		"Возможные причины: имя пользователя не существует, проблема с подключением к сети или ограничение API",
	[Key.bangumiUsername]: "Имя пользователя",
	[Key.bangumiApi]: "API",
	[Key.bangumiConfigTip]:
		"Подсказка: установите правильное имя пользователя Bangumi в конфигурации страницы",
	[Key.bangumiPrevPage]: "Предыдущая",
	[Key.bangumiNextPage]: "Следующая",
	[Key.bangumiCurrentPage]: "Страница",
	[Key.bangumiTotalPages]: "из",
	[Key.bangumiPage]: "страница",

	// Категории Бангуми
	[Key.bangumiCategoryBook]: "Книга",
	[Key.bangumiCategoryAnime]: "Аниме",
	[Key.bangumiCategoryMusic]: "Музыка",
	[Key.bangumiCategoryGame]: "Игра",
	[Key.bangumiCategoryReal]: "Реальный",

	// Обновление данных Бангуми
	[Key.bangumiLastUpdated]: "Данные обновлены",
	[Key.bangumiUpdatedAt]: "Время сборки",
	[Key.bangumiDataStatic]: "Статические данные",

	// Пагинация
	[Key.paginationFirst]: "Первая",
	[Key.paginationPrev]: "Предыдущая",
	[Key.paginationNext]: "Следующая",
	[Key.paginationLast]: "Последняя",
	[Key.paginationPage]: "Страница",
	[Key.paginationOf]: "из",
	[Key.paginationTotal]: ", всего",
	[Key.paginationRecords]: " записей",

	// 404 Страница
	[Key.notFound]: "404",
	[Key.notFoundTitle]: "Страница не найдена",
	[Key.notFoundDescription]:
		"Извините, страница, которую вы посетили, не существует или была перемещена.",
	[Key.backToHome]: "Вернуться на главную",

	// RSS Страница
	[Key.rss]: "RSS лента",
	[Key.rssDescription]: "Подпишитесь, чтобы получать последние обновления",
	[Key.rssSubtitle]:
		"Подписаться через RSS, чтобы сразу получать последние статьи и обновления",
	[Key.rssLink]: "RSS ссылка",
	[Key.rssCopyToReader]: "Скопировать ссылку в ваш RSS читатель",
	[Key.rssCopyLink]: "Скопировать ссылку",
	[Key.rssLatestPosts]: "Последние посты",
	[Key.rssWhatIsRSS]: "Что такое RSS?",
	[Key.rssWhatIsRSSDescription]:
		"RSS (Really Simple Syndication) — стандартный формат для публикации часто обновляемого контента. С RSS вы можете:",
	[Key.rssBenefit1]:
		"Получать последний контент сайта вовремя без ручного посещения",
	[Key.rssBenefit2]: "Управлять подписками на несколько сайтов в одном месте",
	[Key.rssBenefit3]: "Не пропускать важные обновления и статьи",
	[Key.rssBenefit4]: "Наслаждаться чистым чтением без рекламы",
	[Key.rssHowToUse]:
		"Рекомендуется использовать Feedly, Inoreader или другие RSS читатели для подписки на этот сайт.",
	[Key.rssCopied]: "RSS ссылка скопирована в буфер обмена!",
	[Key.rssCopyFailed]:
		"Ошибка копирования, пожалуйста, скопируйте ссылку вручную",

	// Последнее изменение
	[Key.lastModifiedPrefix]: "Последнее обновление: ",
	[Key.lastModifiedOutdated]: "Некоторый контент может быть устаревшим",
	[Key.lastModifiedDaysAgo]: "{days} дней назад",
	[Key.year]: "год",
	[Key.month]: "месяц",
	[Key.day]: "день",
	[Key.hour]: "час",
	[Key.minute]: "минута",
	[Key.second]: "секунда",

	// Статистика просмотров
	[Key.pageViews]: "Просмотры",
	[Key.pageViewsLoading]: "Загрузка...",
	[Key.pageViewsError]: "Статистика недоступна",

	// Закреплено
	[Key.pinned]: "Закреплено",

	// Режим обоев
	[Key.wallpaperMode]: "Режим обоев",
	[Key.wallpaperBannerMode]: "Баннер обои",
	[Key.wallpaperOverlayMode]: "Обои на весь экран",
	[Key.wallpaperNoneMode]: "Однотонный фон",

	// Страница спонсоров
	[Key.sponsor]: "Спонсор",
	[Key.sponsorTitle]: "Поддержать меня",
	[Key.sponsorDescription]:
		"Если мой контент был полезен для вас, добро пожаловать поддержать меня следующими способами. Ваша поддержка - это движущая сила моего постоянного творчества!",
	[Key.sponsorMethods]: "Способы оплаты",
	[Key.sponsorList]: "Спонсоры",
	[Key.sponsorEmpty]: "Пока нет спонсоров",
	[Key.sponsorAmount]: "Сумма",
	[Key.sponsorDate]: "Дата",
	[Key.sponsorMessage]: "Сообщение",
	[Key.sponsorAnonymous]: "Анонимно",
	[Key.scanToSponsor]: "Сканировать для поддержки",
	[Key.sponsorGoTo]: "Перейти к спонсору",
	[Key.sponsorButton]: "Поддержка",
	[Key.sponsorButtonText]:
		"Если эта статья вам помогла, добро пожаловать поддержать!",

	// Статистика сайта
	[Key.siteStats]: "Статистика сайта",
	[Key.siteStatsPostCount]: "Статьи",
	[Key.siteStatsCategoryCount]: "Категории",
	[Key.siteStatsTagCount]: "Теги",
	[Key.siteStatsTotalWords]: "Всего слов",
	[Key.siteStatsRunningDays]: "Дней работы",
	[Key.siteStatsLastUpdate]: "Последняя активность",
	[Key.siteStatsDaysAgo]: "{days} дней назад",
	[Key.siteStatsDays]: "{days} дней",

	// Компонент календаря
	[Key.calendarSunday]: "Вс",
	[Key.calendarMonday]: "Пн",
	[Key.calendarTuesday]: "Вт",
	[Key.calendarWednesday]: "Ср",
	[Key.calendarThursday]: "Чт",
	[Key.calendarFriday]: "Пт",
	[Key.calendarSaturday]: "Сб",
	[Key.calendarJanuary]: "Янв",
	[Key.calendarFebruary]: "Фев",
	[Key.calendarMarch]: "Мар",
	[Key.calendarApril]: "Апр",
	[Key.calendarMay]: "Май",
	[Key.calendarJune]: "Июн",
	[Key.calendarJuly]: "Июл",
	[Key.calendarAugust]: "Авг",
	[Key.calendarSeptember]: "Сен",
	[Key.calendarOctober]: "Окт",
	[Key.calendarNovember]: "Ноя",
	[Key.calendarDecember]: "Дек",
};
