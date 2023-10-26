import { APP_NAME, BASE_URL } from "@/utils/constants";
import Link from "next/link";

const ChatboxWatermark = () => {
  return (
    <div className="bg-card flex items-center justify-center border-t p-2">
      <p className="text-muted-foreground text-sm">
        Powered by{" "}
        <Link
          href={BASE_URL}
          target="_blank"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          {APP_NAME}
        </Link>
      </p>
    </div>
  );
};

export default ChatboxWatermark;
