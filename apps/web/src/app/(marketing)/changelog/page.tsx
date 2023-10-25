import PageHeader from "@/components/PageHeader";
import { APP_NAME } from "@/utils/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Changelog - ${APP_NAME}`,
};

export default function ChangelogPage() {
  return (
    <>
      <PageHeader title="Changelog" subtitle="Comming soon" />
    </>
  );
}
