import SecondaryPageHeader from "@/components/SecondaryPageHeader";
import HelpForm from "./HelpForm";
import { Metadata } from "next";
import { APP_NAME } from "@/utils/constants";

export const metadata: Metadata = {
  title: `Help - ${APP_NAME}`,
};

export default function HelpPage() {
  return (
    <main>
      <div className="container my-16 max-w-screen-sm">
        <SecondaryPageHeader title="How can we help?" />
        <HelpForm />
      </div>
    </main>
  );
}
