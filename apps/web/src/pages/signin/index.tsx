import GithubIcon from "@/components/GithubIcon";
import GoogleIcon from "@/components/GoogleIcon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import { signIn } from "next-auth/react";
import Head from "next/head";

const SignInPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`Sign In - ${APP_NAME}`}</title>
      </Head>

      <div className="container my-16 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>to continue to {APP_NAME}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <GoogleIcon className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              <GithubIcon className="mr-2 h-5 w-5" />
              Continue with Github
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

SignInPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default SignInPage;
