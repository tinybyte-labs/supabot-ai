import { Button } from "@/components/ui/button";
import { SignIn, useAuth } from "@clerk/nextjs";
import { buildClerkProps } from "@clerk/nextjs/server";
import { ChevronLeft } from "lucide-react";
import { GetServerSideProps } from "next";
import Link from "next/link";

const SignInPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
      <header className="flex items-center justify-between p-8">
        <Button asChild variant="outline">
          <Link href={isSignedIn ? "/dashboard" : "/home"}>
            <ChevronLeft className="w-4 h-4 mr-2 -ml-1" />
            Back to {isSignedIn ? "Dashboard" : "Home"}
          </Link>
        </Button>
      </header>

      <div className="w-fit mx-auto py-8">
        <SignIn />
      </div>
    </>
  );
};

export default SignInPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: { ...buildClerkProps(ctx.req) } };
};
