import * as cheerio from "cheerio";

export default async function fetchUrlsFromWebsite(url: string) {
  let pathnames = await fetchPathnames(new URL(url));
  const urls = pathnames.map((path) => new URL(path, url).href);
  return urls.sort((a, b) => a.localeCompare(b));
}

const fetchPathnames = async (
  pageUrl: URL,
  collectedPathnames: string[] = [],
): Promise<string[]> => {
  let pathnames = [...new Set([pageUrl.pathname, ...collectedPathnames])];
  const pathsFromCurrentPage = await getAllUrlsFromWebpage(pageUrl);

  for (const path of pathsFromCurrentPage) {
    if (!pathnames.includes(path)) {
      try {
        pathnames.push(path);
        const newPathnames = await fetchPathnames(
          new URL(path, pageUrl),
          pathnames,
        );
        pathnames.push(...newPathnames);
      } catch (error) {}
    }
  }

  return [...new Set(pathnames)];
};

const getAllUrlsFromWebpage = async (pageUrl: URL) => {
  try {
    const res = await fetch(pageUrl);
    const $ = cheerio.load(await res.text());
    const anchorTags = $("a");
    const paths = [];

    for (const anchor of anchorTags) {
      const href = $(anchor).attr("href");
      if (typeof href !== "string") {
        continue;
      }
      const url = new URL(href, pageUrl);
      if (url.origin === pageUrl.origin) {
        if (url.pathname.includes(".")) {
          continue;
        }
        paths.push(url.pathname);
      }
    }

    return [...new Set(paths)];
  } catch (err) {
    return [];
  }
};
