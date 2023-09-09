import { APP_NAME } from "@/utils/constants";
import Link from "next/link";

const DevWarningBar = () => {
  // if (process.env.NODE_ENV !== "production") {
  //   return null;
  // }
  return (
    <div className="flex items-center  justify-center bg-muted p-1.5 text-center text-muted-foreground">
      <p className="text-sm text-muted-foreground">
        🛠️ {APP_NAME} is under construction. Follow{" "}
        <Link
          href="https://twitter.com/SupaBotAI"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {APP_NAME}
        </Link>{" "}
        for regular updates.
      </p>
    </div>
  );
};

export default DevWarningBar;
