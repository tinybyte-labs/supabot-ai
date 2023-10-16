import { GetStaticProps } from "next";
import React from "react";
import { privacyPage, PrivacyPage } from "contentlayer/generated";
import { NextPageWithLayout } from "@/types/next";
import { useMDXComponent } from "next-contentlayer/hooks";
import MarketingLayout from "@/layouts/MarketingLayout";

type Props = {
  privacyPage: PrivacyPage;
};

const Privacy: NextPageWithLayout<Props> = ({ privacyPage }) => {
  const MDXContent = useMDXComponent(privacyPage.body.code);

  return (
    <div className="prose dark:prose-invert mx-auto my-16">
      <MDXContent />
      <p>Last updated {new Date(privacyPage.updatedAt).toLocaleDateString()}</p>
    </div>
  );
};

Privacy.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;
export default Privacy;

export const getStaticProps: GetStaticProps<Props> = () => {
  return {
    props: {
      privacyPage,
    },
  };
};
