import PageHeader from "@/components/PageHeader";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import { GetStaticProps } from "next";
import Head from "next/head";
import {
  allAuthors,
  allBlogPosts,
  Author,
  BlogPost,
} from "contentlayer/generated";
import { compareDesc, parseISO } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

type Props = {
  posts: (Omit<BlogPost, "author"> & { author: Author | undefined })[];
};

const BlogPage: NextPageWithLayout<Props> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>{`Blog - ${APP_NAME}`}</title>
      </Head>
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
                <p className="mt-1 text-muted-foreground">{post.description}</p>

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
                    className="inline text-sm text-muted-foreground"
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
};

BlogPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default BlogPage;

export const getStaticProps: GetStaticProps<Props> = () => {
  const blogPosts = allBlogPosts
    .sort((a, b) =>
      compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
    )
    .map((post) => ({
      ...post,
      author: allAuthors.find((author) => post.author === author.username),
    }));

  return {
    props: {
      posts: blogPosts,
    },
  };
};
