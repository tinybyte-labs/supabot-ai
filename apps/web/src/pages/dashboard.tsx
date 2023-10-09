import { authOptions } from "@acme/auth";
import { db } from "@acme/db";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

const Dashboard = () => {
  return <>Loading...</>;
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const org = await db.organizationMembership.findFirst({
    where: { userId: session.user?.id },
    select: {
      organization: {
        select: {
          slug: true,
          plan: true,
        },
      },
    },
  });

  if (!org) {
    return {
      redirect: {
        destination: "/create-org",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination:
        org.organization.plan === "free"
          ? `/${org.organization.slug}/plan-billing#plans`
          : `/${org.organization.slug}`,
      permanent: false,
    },
  };
};
