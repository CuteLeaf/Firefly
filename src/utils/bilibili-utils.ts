import type { StandardizedAnime } from "@/types/bilibili";

export interface BilibiliItem {
	media_id: number;
	title: string;
	cover?: string;
	season_type?: number;
	season_type_name?: string;
	rating?: { score?: number };
	evaluate?: string;
	brief?: string;
	season_id: number;
	new_ep?: { index_show?: string };
}

const BILIBILI_API = "https://api.bilibili.com/x/space/bangumi/follow/list";
const PAGE_SIZE = 30;

/** 获取指定类型的全部追番数据 */
async function fetchBilibiliByType(
	uid: string,
	type: number,
): Promise<BilibiliItem[]> {
	const items: BilibiliItem[] = [];
	// 第一页，获取 total
	const firstRes = await fetch(
		`${BILIBILI_API}?type=${type}&vmid=${uid}&pn=1&ps=${PAGE_SIZE}`,
	);
	const firstJson = await firstRes.json();
	if (firstJson.code !== 0 || !firstJson.data?.list?.length) return items;

	items.push(...firstJson.data.list);
	const total = firstJson.data.total || items.length;
	const totalPages = Math.ceil(total / PAGE_SIZE);

	// 并发请求剩余页
	if (totalPages > 1) {
		const promises: Promise<BilibiliItem[]>[] = [];
		for (let pn = 2; pn <= totalPages; pn++) {
			promises.push(
				fetch(
					`${BILIBILI_API}?type=${type}&vmid=${uid}&pn=${pn}&ps=${PAGE_SIZE}`,
				)
					.then((r) => r.json())
					.then((j) => j.data?.list || []),
			);
		}
		const remaining = await Promise.all(promises);
		for (const batch of remaining) {
			items.push(...batch);
		}
	}
	return items;
}

/** 获取 Bilibili 追番（type=1）+ 追剧（type=2）并标准化 */
export async function fetchBilibiliList(
	uid: string,
): Promise<StandardizedAnime[]> {
	const [animeItems, dramaItems] = await Promise.all([
		fetchBilibiliByType(uid, 1),
		fetchBilibiliByType(uid, 2),
	]);
	console.log(
		`[Bilibili] Fetched ${animeItems.length + dramaItems.length} items (anime: ${animeItems.length}, drama: ${dramaItems.length}).`,
	);

	return [...animeItems, ...dramaItems].map((item) => ({
		id: item.media_id,
		title: item.title,
		originalTitle: item.title,
		poster: item.cover ? item.cover.replace("http://", "https://") : null,
		// season_type: 1=番剧, 2=电影, 3=纪录片, 4=国创, 5=电视剧
		type: item.season_type === 2 ? ("movie" as const) : ("tv" as const),
		season_type: item.season_type || 1,
		rating: item.rating?.score || 0,
		date: "",
		overview: item.evaluate || item.brief || "",
		link: `https://www.bilibili.com/bangumi/play/ss${item.season_id}`,
		epStatus: item.new_ep?.index_show || "",
	}));
}
