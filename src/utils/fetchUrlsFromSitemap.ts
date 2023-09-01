import GetSitemapLinks from "get-sitemap-links";

export default async function fetchUrlsFromSitemap(url: string) {
  const urls = await GetSitemapLinks(url);
  return urls;
}
