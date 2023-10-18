import type { MetadataRoute } from "next";
import { allBlogPosts } from "contentlayer/generated";
import { BASE_DOMAIN } from "@/utils/constants";

const addPathToBaseURL = (path: string) => `${BASE_DOMAIN}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = allBlogPosts.map((post) => ({
    url: addPathToBaseURL(`/blog/${post.slug}`),
    lastModified: post.publishedAt,
  }));

  const routes = [
    "/",
    "/help",
    "/pricing",
    "/contact",
    "/changelog",
    "/blog",
    "/signin",
    "/legal/privacy",
    "/legal/terms",
  ].map((route) => ({
    url: addPathToBaseURL(route),
    lastModified: new Date(),
  }));

  return [...routes, ...blogs];
}
