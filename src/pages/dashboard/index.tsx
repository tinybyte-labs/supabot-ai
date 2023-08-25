import PageHeader from "@/components/PageHeader";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { buildClerkProps } from "@clerk/nextjs/server";
import { GetServerSideProps } from "next";

const Page: NextPageWithLayout = (props) => {
  return (
    <>
      <PageHeader title="Chatbots" />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: { ...buildClerkProps(ctx.req) } };
};
