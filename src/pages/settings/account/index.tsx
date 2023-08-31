import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/next";
import { UserProfile } from "@clerk/nextjs";

const AccountSettingsPage: NextPageWithLayout = () => {
  return (
    <div className="mx-auto w-fit py-16">
      <UserProfile />
    </div>
  );
};

AccountSettingsPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default AccountSettingsPage;
