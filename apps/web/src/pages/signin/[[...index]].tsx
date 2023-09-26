import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import { SignIn } from "@clerk/nextjs";
import { buildClerkProps } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import Head from "next/head";

const SignInPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`Sign In - ${APP_NAME}`}</title>
      </Head>

      <div className="mx-auto w-fit py-16">
        <SignIn />
      </div>
    </>
  );
};

SignInPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default SignInPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: { ...buildClerkProps(ctx.req) } };
};
