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
const invalidPrefixes = ["mailto:", "javascript:"];

const getAllUrlsFromWebpage = async (pageUrl: URL) => {
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
    const urls: string[] = [];

    for (const anchor of anchorTags) {
      const href = $(anchor).attr("href");
      if (typeof href !== "string" || href.trim() === "") {
        continue;
      }
      const url = new URL(href, pageUrl.origin);
      if (
        url.origin === pageUrl.origin &&
        !urls.includes(url.pathname) &&
        invalidPrefixes.findIndex((prefix) => url.href.startsWith(prefix)) ===
          -1 &&
        invalidSuffixes.findIndex((suffix) => url.href.endsWith(suffix)) === -1
      ) {
        urls.push(url.pathname);
      }
    }
    return [...new Set(urls)];
  } catch (error) {
    return [];
  }
};

export const fetchUrlsFromWebsite = async (url: string) => {
  const paths = await getAllUrlsFromWebpage(new URL(url));
  return paths.map((path) => new URL(path, url).href);
};
