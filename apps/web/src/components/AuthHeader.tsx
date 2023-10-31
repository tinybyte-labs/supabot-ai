"use client";

import { Button } from "./ui/button";
import { ChevronLeftIcon } from "lucide-react";
import LoggedInUser from "./LoggedInUser";
import Link from "next/link";
import { useSession } from "next-auth/react";

const AuthHeader = () => {
  const { status } = useSession();

  if (status === "loading") {
    return <div className="h-24" />;
  }

  return (
    <header className="flex h-24 items-center justify-between px-8">
      <Button asChild variant="outline">
        <Link href={status === "authenticated" ? "/dashboard" : "/home"}>
          <ChevronLeftIcon className="-ml-1 mr-2 h-4 w-4" />
          Back to {status === "authenticated" ? "Dashboard" : "Home"}
        </Link>
      </Button>
      <div className="flex-1"></div>
      {status === "authenticated" && <LoggedInUser />}
    </header>
  );
};

export default AuthHeader;
