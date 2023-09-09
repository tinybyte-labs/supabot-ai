import AuthHeader from "@/components/AuthHeader";
import DevWarningBar from "@/components/DevWarningBar";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DevWarningBar />
      <AuthHeader />
      {children}
    </>
  );
};

export default AuthLayout;
