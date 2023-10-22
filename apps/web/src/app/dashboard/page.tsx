import { db } from "@acme/db";
import { freePlan } from "@acme/plans";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  const org = await db.organizationMembership.findFirst({
    where: { userId: session.user.id },
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
    redirect("/create-org");
  }

  redirect(
    `/${org.organization.slug}${
      org.organization.plan === freePlan.id ? "/plan-billing#plans" : ""
    }`,
  );
}
