import DashboardPageHeader from "@/components/DashboardPageHeader";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { OrganizationProfile } from "@clerk/nextjs";

const OrganizationSettingsPage: NextPageWithLayout = () => {
  return (
    <>
      <DashboardPageHeader title="Organization" />
      <div className="mx-auto w-fit">
        <OrganizationProfile />
      </div>
    </>
  );
};

OrganizationSettingsPage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default OrganizationSettingsPage;
