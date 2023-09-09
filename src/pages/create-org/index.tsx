import { CreateOrganization, useAuth } from "@clerk/nextjs";
import Head from "next/head";
import { APP_NAME } from "@/utils/constants";
import { NextPageWithLayout } from "@/types/next";
import AuthLayout from "@/layouts/AuthLayout";

const CreateOrgPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{`Create Org - ${APP_NAME}`}</title>
      </Head>

      <div className="mx-auto w-fit py-16">
        <CreateOrganization />
      </div>
    </>
  );
};

CreateOrgPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default CreateOrgPage;
