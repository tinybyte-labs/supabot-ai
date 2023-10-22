import PageHeader from "@/components/PageHeader";
import { APP_NAME } from "@/utils/constants";
import { allAuthors, allBlogPosts } from "contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Blog - ${APP_NAME}`,
};

export default async function BlogPage() {
  const posts = allBlogPosts
    .filter((b) => !(process.env.NODE_ENV === "production" && b.draft))
    .sort((a, b) =>
      compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
    )
    .map((post) => ({
      ...post,
      author: allAuthors.find((author) => post.author === author.username),
    }));

  return (
    <>
      <PageHeader title="Blog" subtitle="Comming soon" />
      <main className="container py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post._id}
              className="overflow-hidden rounded-lg border transition-shadow hover:shadow-xl"
            >
              <Image
                src={post.image}
                alt={post.imageAlt || ""}
                width={1920}
                height={1080}
                className="aspect-video object-cover"
              />
              <div className="border-t p-6">
                <h1 className="text-xl font-bold">{post.title}</h1>
                <p className="text-muted-foreground mt-1">{post.description}</p>

                <div className="mt-4">
                  {post.author && (
                    <Image
                      src={post.author.image}
                      alt={post.author.imageAlt || ""}
                      width={1080}
                      height={1080}
                      className="mr-2 inline h-10 w-10 rounded-full object-cover"
                    />
                  )}
                  <time
                    dateTime={post.publishedAt}
                    className="text-muted-foreground inline text-sm"
                  >
                    {format(parseISO(post.publishedAt), "LLL d, yyyy")}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
