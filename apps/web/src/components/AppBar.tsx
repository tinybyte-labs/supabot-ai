import ToggleSidebarButton from "./ToggleSidebarButton";
import { Button } from "./ui/button";
import { MessageSquareIcon, SparklesIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import FeedbackForm from "./forms/FeedbackForm";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { freePlan } from "@acme/plans";
import { usePlan } from "@/hooks/usePlan";

const AppBar = () => {
  const [feedbackPopoverOpen, setFeedbackPopoverOpen] = useState(false);
  const plan = usePlan();
  const router = useRouter();

  return (
    <header className="bg-background text-foreground sticky top-0 z-30 border-b">
      <div className="flex h-14 items-center justify-end gap-2 px-4">
        <ToggleSidebarButton />
        <div className="flex-1"></div>
        {plan.id === freePlan.id && (
          <Button asChild>
            <Link href={`/${router.query.orgSlug}/plan-billing#plans`}>
              <SparklesIcon size={18} className="-ml-1 mr-2" />
              Upgrade
            </Link>
          </Button>
        )}
        <Popover
          open={feedbackPopoverOpen}
          onOpenChange={setFeedbackPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button variant="outline">
              <MessageSquareIcon size={20} className="-ml-1 mr-2" />
              Feedback
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <FeedbackForm onSuccess={() => setFeedbackPopoverOpen(false)} />
          </PopoverContent>
        </Popover>
        <Button asChild variant="ghost">
          <Link href="/help">Help</Link>
        </Button>
      </div>
    </header>
  );
};

export default AppBar;
