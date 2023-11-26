import { ReactNode, useMemo } from "react";
import DashboardPageHeader from "@/components/DashboardPageHeader";
import LayoutWithNav from "./LayoutWithNav";
import DashboardLayout from "./DashboardLayout";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/modals/useModal";
import InvitePeopleModal from "@/components/modals/InvitePeopleModal";

const MembersLayout = ({ children }: { children: ReactNode }) => {
  const [Modal, { openModal }] = useModal(InvitePeopleModal);
  const router = useRouter();
  const menu = useMemo(
    () => [
      {
        href: `/${router.query.orgSlug}/members`,
        label: "Members",
        end: true,
      },
      {
        href: `/${router.query.orgSlug}/members/invitations`,
        label: "Invitations",
      },
    ],
    [router.query.orgSlug],
  );

  return (
    <DashboardLayout>
      <DashboardPageHeader
        title="Members"
        subtitle="Manage who has access to this organization"
      >
        <Button onClick={openModal}>Invite Teammate</Button>
      </DashboardPageHeader>
      <LayoutWithNav menu={menu}>{children}</LayoutWithNav>
      <Modal />
    </DashboardLayout>
  );
};

export default MembersLayout;
