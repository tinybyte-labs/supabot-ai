import { APP_NAME, HOME_DOMAIN } from "@/utils/constants";
import Link from "next/link";

const ChatboxWatermark = () => {
  return (
    <div className="flex items-center justify-center border-t bg-card p-2">
      <p className="text-sm text-muted-foreground">
        Powered by{" "}
        <Link
          href={HOME_DOMAIN}
          target="_blank"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {APP_NAME}
        </Link>
      </p>
    </div>
  );
};

export default ChatboxWatermark;
