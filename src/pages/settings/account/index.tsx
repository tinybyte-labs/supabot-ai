import PageHeader from "@/components/PageHeader";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { UserProfile } from "@clerk/nextjs";

const AccountSettingsPage: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader title="Account" />
      <div className="mx-auto w-fit py-16">
        <UserProfile />
      </div>
    </>
  );
};

AccountSettingsPage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default AccountSettingsPage;
