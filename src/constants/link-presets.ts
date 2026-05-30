import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";
//导航栏访问路径配置
export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
	[LinkPreset.Home]: {
		name: i18n(I18nKey.home),
		url: "/",
		icon: "material-symbols:home",
	},
	[LinkPreset.About]: {
		name: i18n(I18nKey.about),
		url: "/about/",
		icon: "material-symbols:person",
	},
	[LinkPreset.Archive]: {
		name: i18n(I18nKey.archive),
		url: "/archive/",
		icon: "material-symbols:archive",
	},
	[LinkPreset.Friends]: {
		name: i18n(I18nKey.friends),
		url: "/friends/",
		icon: "material-symbols:group",
	},
	[LinkPreset.Sponsor]: {
		name: i18n(I18nKey.sponsor),
		url: "/sponsor/",
		icon: "material-symbols:favorite",
	},
	[LinkPreset.Guestbook]: {
		name: i18n(I18nKey.guestbook),
		url: "/guestbook/",
		icon: "material-symbols:chat",
	},
	[LinkPreset.Bangumi]: {
		name: i18n(I18nKey.bangumi),
		url: "/bangumi/",
		icon: "material-symbols:movie",
	},
	[LinkPreset.Gallery]: {
		name: i18n(I18nKey.gallery),
		url: "/gallery/",
		icon: "material-symbols:photo-library",
	},
	[LinkPreset.Talk]: {
		name: i18n(I18nKey.talks),
		url: "/talks/",
		icon: "material-symbols:chat",
	},
	[LinkPreset.Categories]: {
		name: i18n(I18nKey.categories),
		url: "/categories/",
		icon: "material-symbols:folder-open",
	},
	[LinkPreset.Books]: {
		name: "书架",
		url: "/books/",
		icon: "material-symbols:book-5",
	},
	[LinkPreset.MoviesGames]: {
		name: "影视与游戏",
		url: "/movies-games/",
		icon: "material-symbols:movie",
	},
	[LinkPreset.MusicPage]: {
		name: i18n(I18nKey.music),
		url: "/music/",
		icon: "material-symbols:music-note",
	},
	[LinkPreset.Changelog]: {
		name: "更新日志",
		url: "/changelog/",
		icon: "material-symbols:history",
	},
};
