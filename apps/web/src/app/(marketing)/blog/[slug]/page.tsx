import { Mdx } from "@/components/Mdx";
import { allAuthors, allBlogPosts } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostProps {
  params: {
    slug: string;
  };
}

async function getPostFromParams(params: PostProps["params"]) {
  const slug = params.slug;
  const post = allBlogPosts.find((post) => post.slug === slug);

  if (!post) {
    null;
  }

  return post;
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export async function generateStaticParams(): Promise<PostProps["params"][]> {
  return allBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostProps) {
  const blogPost = await getPostFromParams(params);
  if (!blogPost) {
    notFound();
  }

  const author = allAuthors.find(
    (author) => author.username === blogPost?.author,
  )!;

  const relatedPosts = allBlogPosts.filter(
    (post) => blogPost?.related?.includes(post.slug),
  );

  return (
    <main className="my-16">
      <div className="container flex gap-8 max-lg:flex-col lg:items-start">
        <div className="flex-1">
          <div>
            <p className="text-muted-foreground mb-4 font-medium">
              {blogPost.draft ? `Draft • ` : ``}
              <time dateTime={blogPost.publishedAt}>
                {format(parseISO(blogPost.publishedAt), "LLL d, yyyy")}
              </time>
            </p>
            <h1 className="line-clamp-1 text-4xl font-bold">
              {blogPost.title}
            </h1>
            <p className="text-muted-foreground mt-2 line-clamp-2 text-lg font-medium">
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
          <article className="prose prose-lg prose-zinc dark:prose-invert my-16 min-w-0 max-w-full overflow-hidden">
            <Mdx code={blogPost.body.code} />
          </article>
        </div>
        <div className="top-24 w-full space-y-8 lg:sticky lg:mt-80 lg:w-80">
          <div>
            <p className="text-muted-foreground mb-4">Written By</p>
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
                <p className="text-muted-foreground truncate font-medium leading-4">
                  @{author.username}
                </p>
              </div>
            </Link>
          </div>
          {relatedPosts && relatedPosts.length > 0 && (
            <>
              <hr className="bg-border h-px" />
              <div>
                <p className="text-muted-foreground mb-4">Read more</p>
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
                      <p className="text-muted-foreground mt-1 line-clamp-2">
                        {post.description}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
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
}
