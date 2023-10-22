import PageHeader from "@/components/PageHeader";
import ContactForm from "./ContactForm";
import { Metadata } from "next";
import { APP_NAME, SUPPORT_EMAIL } from "@/utils/constants";
import Link from "next/link";
import CopyButton from "./CopyButton";

export const metadata: Metadata = {
  title: `Contact - ${APP_NAME}`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Get in touch" />
      <main className="container flex items-start justify-between gap-8 py-16">
        <ContactForm />

        <div className="w-80">
          <div>
            <p className="text-muted-foreground text-sm">Get help</p>
            <div className="flex items-center gap-1">
              <Link
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium hover:underline"
              >
                {SUPPORT_EMAIL}
              </Link>
              <CopyButton text={SUPPORT_EMAIL} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
