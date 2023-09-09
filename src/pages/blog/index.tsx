import PageHeader from "@/components/PageHeader";
import MarketingLayout from "@/layouts/MarketingLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const BlogPage: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>{`Blog - ${APP_NAME}`}</title>
      </Head>
      <main>
        <PageHeader title="Blog" subtitle="Comming soon" />
      </main>
    </div>
  );
};

BlogPage.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default BlogPage;