import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import { PUBLIC_PATH_NAMES, REDIRECTS } from "./utils/constants";

export default withAuth(
  (req) => {
    const path = req.nextUrl.pathname.slice(1);
    if (REDIRECTS[path]) {
      return NextResponse.redirect(REDIRECTS[path]);
    }
    if (path === "home") {
      return NextResponse.rewrite(new URL("/", req.url));
    }
    const token = req.nextauth.token;
    if (token?.user) {
      if (path === "") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname.slice(1);
        if (
          path === "" ||
          [...PUBLIC_PATH_NAMES].find((item) => path.startsWith(item))
        ) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/signin",
    },
  },
);
