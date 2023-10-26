"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function NavigationEvents() {
  const pathname = usePathname();
  useEffect(() => {
    window.parent.postMessage(
      {
        source: "page-navigation",
        payload: {
          pathname,
        },
      },
      "*",
    );
  }, [pathname]);
  return null;
}
