import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/next";
import { OrganizationProfile } from "@clerk/nextjs";

const OrganizationSettingsPage: NextPageWithLayout = () => {
  return (
    <div className="mx-auto w-fit py-16">
      <OrganizationProfile />
    </div>
  );
};

OrganizationSettingsPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default OrganizationSettingsPage;
