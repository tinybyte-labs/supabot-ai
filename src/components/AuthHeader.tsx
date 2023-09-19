import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import LoggedInUser from "./LoggedInUser";

const AuthHeader = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="h-24" />;
  }

  return (
    <header className="flex h-24 items-center justify-between px-8">
      <Button asChild variant="outline">
        <a href={isSignedIn ? "/chatbots" : "/home"}>
          <ChevronLeft className="-ml-1 mr-2 h-4 w-4" />
          Back to {isSignedIn ? "Dashboard" : "Home"}
        </a>
      </Button>
      <div className="flex-1"></div>
      {isSignedIn && <LoggedInUser />}
    </header>
  );
};

export default AuthHeader;
