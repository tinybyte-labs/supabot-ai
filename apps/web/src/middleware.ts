import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import { PUBLIC_PATH_NAMES, REDIRECTS } from "./utils/constants";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt|assets).*)",
  ],
};

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
      error: "/signin",
    },
  },
);
