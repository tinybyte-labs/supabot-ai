import AuthHeader from "@/components/AuthHeader";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthHeader />
      {children}
    </>
  );
};

export default AuthLayout;
