import { GetStaticProps } from "next";
import React from "react";
import { termsPage, TermsPage } from "contentlayer/generated";
import { NextPageWithLayout } from "@/types/next";
import { useMDXComponent } from "next-contentlayer/hooks";
import MarketingLayout from "@/layouts/MarketingLayout";

type Props = {
  termsPage: TermsPage;
};

const Privacy: NextPageWithLayout<Props> = ({ termsPage }) => {
  const MDXContent = useMDXComponent(termsPage.body.code);

  return (
    <div className="prose dark:prose-invert mx-auto my-16">
      <MDXContent />
      <p>Last updated {new Date(termsPage.updatedAt).toLocaleDateString()}</p>
    </div>
  );
};

Privacy.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;
export default Privacy;

export const getStaticProps: GetStaticProps<Props> = () => {
  return {
    props: {
      termsPage,
    },
  };
};
