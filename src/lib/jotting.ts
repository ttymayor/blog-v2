import { getCollection } from "astro:content";

export async function getJottings() {
  const jottings = await getCollection("jotting");

  return jottings
    .filter((jotting) => !jotting.data.draft || import.meta.env.DEV)
    .sort((a, b) => b.data.pubDate.localeCompare(a.data.pubDate));
}
