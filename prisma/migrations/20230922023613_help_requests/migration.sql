-- CreateTable
CREATE TABLE "help_requests" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "subject" TEXT,
    "message" TEXT,

    CONSTRAINT "help_requests_pkey" PRIMARY KEY ("id")
);
