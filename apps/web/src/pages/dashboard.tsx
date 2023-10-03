import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  const org = await prisma.organizationMembership.findFirst({
    where: { userId: session.user?.id },
    select: {
      organization: {
        select: {
          slug: true,
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
      destination: `/${org.organization.slug}`,
      permanent: false,
    },
  };
};
