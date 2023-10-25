import { privacyPage } from "contentlayer/generated";
import { Mdx } from "@/components/Mdx";
import { Metadata } from "next";
import { APP_NAME } from "@/utils/constants";

export const metadata: Metadata = {
  title: `Privacy Policy - ${APP_NAME}`,
};

export default function Privacy() {
  return (
    <div className="prose dark:prose-invert mx-auto my-16">
      <Mdx code={privacyPage.body.code} />
      <p>Last updated {new Date(privacyPage.updatedAt).toLocaleDateString()}</p>
    </div>
  );
}
