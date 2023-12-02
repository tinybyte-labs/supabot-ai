import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@acme/trpc/src/constants";
import SignInButtons from "./SignInButtons";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@acme/auth";
import EmailSignInForm from "./EmailSignInForm";

export const metadata: Metadata = {
  title: `Sign In - ${APP_NAME}`,
};

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="container my-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>to continue to {APP_NAME}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <EmailSignInForm />
          <div className="my-4 flex items-center gap-4">
            <div className="bg-border h-px flex-1"></div>
            <p className="text-muted-foreground text-sm">OR</p>
            <div className="bg-border h-px flex-1"></div>
          </div>
          <SignInButtons />
        </CardContent>
      </Card>
    </div>
  );
}
