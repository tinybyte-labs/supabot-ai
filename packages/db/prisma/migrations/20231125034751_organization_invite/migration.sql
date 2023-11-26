-- CreateTable
CREATE TABLE "OrganizationInvite" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationInvite_email_organizationId_key" ON "OrganizationInvite"("email", "organizationId");

-- AddForeignKey
ALTER TABLE "OrganizationInvite" ADD CONSTRAINT "OrganizationInvite_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
