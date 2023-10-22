"use client";

import GoogleIcon from "@/components/GoogleIcon";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignInButtons() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        <GoogleIcon className="mr-2 h-5 w-5" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      >
        <GithubIcon className="mr-2 h-5 w-5" />
        Continue with Github
      </Button>
    </>
  );
}
