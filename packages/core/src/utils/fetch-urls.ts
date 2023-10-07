import GetSitemapLinks from "get-sitemap-links";
import * as cheerio from "cheerio";

export const fetchUrlsFromSitemap = async (url: string) => {
  const urls = await GetSitemapLinks(url);
  return urls;
};

const invalidSuffixes = [
  "./",
  ".xml",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".tiff",
  ".psd",
  ".eps",
  ".ai",
  ".indd",
  ".raw",
  ".svg",
  ".json",
];
const invalidPrefixes = ["#", "mailto:", "javascript:"];

const getAllUrlsFromWebpage = async (pageUrl: URL) => {
  console.log(pageUrl.pathname);
  try {
    const res = await fetch(pageUrl, {
      headers: {
        Accept: "text/html; charset=utf-8",
      },
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const html = await res.text();
    const $ = cheerio.load(html, { baseURI: pageUrl.origin });
    const anchorTags = $("a");
    const paths = [];

    for (const anchor of anchorTags) {
      const href = $(anchor).attr("href");
      if (typeof href !== "string" || href.trim() === "") {
        continue;
      }
      const url = new URL(href, pageUrl.origin);
      if (
        url.origin === pageUrl.origin &&
        invalidPrefixes.findIndex((prefix) =>
          url.pathname.startsWith(prefix),
        ) === -1 &&
        invalidSuffixes.findIndex((suffix) => url.pathname.endsWith(suffix)) ===
          -1 &&
        url.pathname !== pageUrl.pathname &&
        url.pathname.startsWith(pageUrl.pathname)
      ) {
        paths.push(url.pathname);
      }
    }

    return [...new Set(paths)];
  } catch (error) {
    console.log("Failed to fetch", pageUrl.href);
    return null;
  }
};

export const fetchUrlsFromWebsite = async (url: string) => {
  const visitedPaths: string[] = [];
  const fetchPathnames = async (pageUrl: URL): Promise<string[]> => {
    if (visitedPaths.length >= 100) {
      return [];
    }
    visitedPaths.push(pageUrl.pathname);
    const paths = await getAllUrlsFromWebpage(pageUrl);
    if (paths === null) {
      return [];
    }
    const uniquePaths = paths.filter((path) => !visitedPaths.includes(path));

    const pathsList = await Promise.allSettled(
      uniquePaths.map((path) => fetchPathnames(new URL(path, pageUrl))),
    );
    const newPaths: string[] = [
      pageUrl.pathname,
      ...pathsList.flatMap((g) => (g.status === "fulfilled" ? g.value : [])),
    ];
    return [...new Set(newPaths)];
  };

  let pathnames = await fetchPathnames(new URL(url));
  const urls = pathnames.map((path) => new URL(path, url).href);
  return urls.sort((a, b) => a.localeCompare(b));
};
