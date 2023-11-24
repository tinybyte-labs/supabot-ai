import AccountSettingsLayout from "@/layouts/AccountSettingsLayout";
import { NextPageWithLayout } from "@/types/next";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/modals/useModal";
import DeleteUserConfirmModal from "@/components/modals/DeleteUserConfirmModal";

const AdvancedPage: NextPageWithLayout = () => {
  return <DeleteChatbotCard />;
};

AdvancedPage.getLayout = (page) => (
  <AccountSettingsLayout>{page}</AccountSettingsLayout>
);

export default AdvancedPage;

const DeleteChatbotCard = () => {
  const [Modal, { openModal }] = useModal(DeleteUserConfirmModal);

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          If you want to permanently delete your account and all of its data,
          you can do so below. Make sure, if you are an owner of any
          organization then transfer them to others or delete them.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="destructive" onClick={openModal}>
          Delete Account
        </Button>
        <Modal />
      </CardFooter>
    </Card>
  );
};
