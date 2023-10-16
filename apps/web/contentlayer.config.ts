import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const BlogPost = defineDocumentType(() => ({
  name: "BlogPost",
  filePathPattern: `blog/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    seoTitle: { type: "string" },
    publishedAt: { type: "date", required: true },
    description: { type: "string", required: true },
    seoDescription: { type: "string" },
    image: { type: "string", required: true },
    imageAlt: { type: "string" },
    author: { type: "string", required: true },
    categories: {
      type: "list",
      of: {
        type: "enum",
        options: ["company", "education", "customer-stories"],
        default: "company",
      },
      required: true,
    },
    related: { type: "list", of: { type: "string" } },
    draft: { type: "boolean", default: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (blogPost) => blogPost._raw.flattenedPath.replace(/blog\/?/, ""),
    },
  },
}));

const Author = defineDocumentType(() => ({
  name: "Author",
  filePathPattern: `authors/*.mdx`,
  contentType: "mdx",
  fields: {
    name: { type: "string", required: true },
    image: { type: "string", required: true },
    imageAlt: { type: "string" },
  },
  computedFields: {
    username: {
      type: "string",
      resolve: (author) => author._raw.flattenedPath.replace(/authors\/?/, ""),
    },
  },
}));

export const PrivacyPage = defineDocumentType(() => ({
  name: "PrivacyPage",
  isSingleton: true,
  contentType: "mdx",
  filePathPattern: "legal/privacy.mdx",
  fields: {
    createdAt: { type: "date", required: true },
    updatedAt: { type: "date", required: true },
  },
}));

export const TermsPage = defineDocumentType(() => ({
  name: "TermsPage",
  isSingleton: true,
  contentType: "mdx",
  filePathPattern: "legal/terms.mdx",
  fields: {
    createdAt: { type: "date", required: true },
    updatedAt: { type: "date", required: true },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [BlogPost, Author, PrivacyPage, TermsPage],
});
