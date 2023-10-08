import DashboardPageHeader from "@/components/DashboardPageHeader";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import React from "react";

const MembersPage: NextPageWithLayout = () => {
  return (
    <>
      <DashboardPageHeader title="Members" subtitle="Comming soon" />
    </>
  );
};

MembersPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MembersPage;
