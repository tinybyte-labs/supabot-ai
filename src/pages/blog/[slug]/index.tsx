import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import {
  Author,
  BlogPost,
  allAuthors,
  allBlogPosts,
} from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { GetStaticPaths, GetStaticProps } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const components = {
  a: ({ children, href, ...rest }: any) => (
    <Link href={href as string} {...rest}>
      {children}
    </Link>
  ),
  // eslint-disable-next-line jsx-a11y/alt-text
  Image: (props: any) => <Image {...props} />,
};

type Props = {
  blogPost: BlogPost;
  author: Author;
  relatedPosts: BlogPost[];
};
const BlogPostPage: NextPageWithLayout<Props> = ({
  blogPost,
  author,
  relatedPosts,
}) => {
  const MDXContent = useMDXComponent(blogPost.body.code);

  return (
    <main className="my-16">
      <Head>
        <title>{`${blogPost.seoTitle || blogPost.title} - ${APP_NAME}`}</title>
        <meta
          name="description"
          content={blogPost.seoDescription || blogPost.description}
        />
      </Head>
      <div className="container flex gap-8 max-lg:flex-col lg:items-start">
        <div className="flex-1">
          <div>
            <p className="mb-4 font-medium text-muted-foreground">
              <time dateTime={blogPost.publishedAt}>
                {format(parseISO(blogPost.publishedAt), "LLL d, yyyy")}
              </time>
            </p>
            <h1 className="line-clamp-1 text-4xl font-bold">
              {blogPost.title}
            </h1>
            <p className="mt-2 line-clamp-2 text-lg font-medium text-muted-foreground">
              {blogPost.description}
            </p>
          </div>
          <Image
            src={blogPost.image}
            alt={blogPost.imageAlt || ""}
            width={1920}
            height={1080}
            className="my-8 aspect-video rounded-xl border object-cover"
          />
          <article className="prose prose-lg prose-zinc my-16 min-w-0 max-w-full overflow-hidden dark:prose-invert">
            <MDXContent components={components} />
          </article>
        </div>
        <div className="top-24 w-full space-y-8 lg:sticky lg:mt-80 lg:w-80">
          <div>
            <p className="mb-4 text-muted-foreground">Written By</p>
            <Link
              href={`https://twitter.com/${author.username}`}
              className="flex items-center gap-4"
              target="_blank"
            >
              <Image
                src={author.image}
                width={512}
                height={512}
                alt={author?.imageAlt || ""}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-semibold">{author.name}</p>
                <p className="truncate font-medium leading-4 text-muted-foreground">
                  @{author.username}
                </p>
              </div>
            </Link>
          </div>
          {relatedPosts && relatedPosts.length > 0 && (
            <>
              <hr className="h-px bg-border" />
              <div>
                <p className="mb-4 text-muted-foreground">Read more</p>
                <div className="grid gap-4">
                  {relatedPosts.map((post) => (
                    <Link
                      href={`/blog/${post.slug}`}
                      key={post._id}
                      className="group"
                    >
                      <h3 className="line-clamp-2 text-lg font-semibold underline-offset-4 group-hover:underline">
                        {post.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-muted-foreground">
                        {post.description}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        By @{post.author} •{" "}
                        <time dateTime={post.publishedAt} className="">
                          {format(parseISO(post.publishedAt), "LLL d, yyyy")}
                        </time>
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

BlogPostPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default BlogPostPage;

export const getStaticPaths: GetStaticPaths = () => {
  const posts = allBlogPosts;
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = (ctx) => {
  let blogPost = allBlogPosts.find((post) => post.slug === ctx.params?.slug);

  if (!blogPost) {
    return {
      notFound: true,
    };
  }

  const author = allAuthors.find(
    (author) => author.username === blogPost?.author,
  )!;

  const relatedPosts = allBlogPosts.filter(
    (post) => blogPost?.related?.includes(post.slug),
  );

  return {
    props: {
      blogPost,
      author,
      relatedPosts,
    },
  };
};
