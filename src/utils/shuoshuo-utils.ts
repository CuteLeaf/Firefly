import { getCollection } from "astro:content";

export async function getSortedShuoshuo() {
	const all = await getCollection("shuoshuo", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	return all.sort((a, b) => {
		const dateA = a.data.published.getTime();
		const dateB = b.data.published.getTime();
		return dateB - dateA;
	});
}
