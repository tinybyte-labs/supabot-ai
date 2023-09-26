import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import { SignUp } from "@clerk/nextjs";
import { buildClerkProps } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";
import Head from "next/head";

const RegisterPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`Create your account - ${APP_NAME}`}</title>
      </Head>

      <div className="mx-auto w-fit py-16">
        <SignUp />
      </div>
    </>
  );
};

RegisterPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default RegisterPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: { ...buildClerkProps(ctx.req) } };
};
