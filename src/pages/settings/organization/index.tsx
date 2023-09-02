import PageHeader from "@/components/PageHeader";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NextPageWithLayout } from "@/types/next";
import { OrganizationProfile } from "@clerk/nextjs";

const OrganizationSettingsPage: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader title="Organization" />
      <div className="mx-auto w-fit py-16">
        <OrganizationProfile />
      </div>
    </>
  );
};

OrganizationSettingsPage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default OrganizationSettingsPage;
