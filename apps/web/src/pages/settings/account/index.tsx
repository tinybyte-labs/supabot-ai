import DashboardPageHeader from "@/components/DashboardPageHeader";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { UserProfile } from "@clerk/nextjs";

const AccountSettingsPage: NextPageWithLayout = () => {
  return (
    <>
      <DashboardPageHeader title="Account" />

      <div className="mx-auto w-fit">
        <UserProfile />
      </div>
    </>
  );
};

AccountSettingsPage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default AccountSettingsPage;
