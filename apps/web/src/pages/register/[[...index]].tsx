import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/next";
import { APP_NAME } from "@/utils/constants";
import Head from "next/head";

const RegisterPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`Create your account - ${APP_NAME}`}</title>
      </Head>

      <div className="mx-auto w-fit py-16"></div>
    </>
  );
};

RegisterPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default RegisterPage;
