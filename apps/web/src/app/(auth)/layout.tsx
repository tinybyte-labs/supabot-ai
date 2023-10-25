import AuthHeader from "@/components/AuthHeader";
import DevWarningBar from "@/components/DevWarningBar";
import { ReactNode } from "react";
import AuthProviders from "./providers";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProviders>
      <DevWarningBar />
      <AuthHeader />
      {children}
    </AuthProviders>
  );
}
