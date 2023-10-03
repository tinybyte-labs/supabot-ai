import { Button } from "@/components/ui/button";
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

      <div className="mx-auto w-fit py-16">
        <Button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>
          Sign in with Google
        </Button>
        <Button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>
          Sign in with Github
        </Button>
      </div>
    </>
  );
};

SignInPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default SignInPage;
