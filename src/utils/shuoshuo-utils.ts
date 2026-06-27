import { getCollection } from "astro:content";

export async function getSortedShuoshuo() {
	const all = await getCollection("shuoshuo", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	return all.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
}
