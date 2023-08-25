import { Button } from "@/components/ui/button";
import { OrganizationProfile } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function OrganizationPage() {
  return (
    <>
      <header className="flex items-center justify-between p-8">
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ChevronLeft className="-ml-1 mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </header>
      <div className="mx-auto w-fit py-8">
        <OrganizationProfile />
      </div>
    </>
  );
}
