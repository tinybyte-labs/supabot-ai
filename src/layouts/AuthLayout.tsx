import AuthHeader from "@/components/AuthHeader";
import DevWarningBar from "@/components/DevWarningBar";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider enableSystem attribute="class">
      <DevWarningBar />
      <AuthHeader />
      {children}
    </ThemeProvider>
  );
};

export default AuthLayout;
