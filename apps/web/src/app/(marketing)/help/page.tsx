import HelpForm from "./HelpForm";
import { Metadata } from "next";
import { APP_NAME } from "@/utils/constants";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: `Help - ${APP_NAME}`,
};

export default function HelpPage() {
  return (
    <>
      <PageHeader title="Help" />
      <main className="container max-w-screen-sm py-16">
        <HelpForm />
      </main>
    </>
  );
}
