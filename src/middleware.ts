import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/home",
    "/pricing",
    "/changelog(.*)",
    "/help(.*)",
    "/blog(.*)",
    "/widgets(.*)",
    "/api(.*)",
  ],
  ignoredRoutes: ["/api/widget(.*)"],
  beforeAuth: (req) => {
    if (req.nextUrl.pathname === "/home") {
      return NextResponse.rewrite(new URL("/", req.url));
    }
  },
  afterAuth: (auth, req) => {
    const path = req.nextUrl.pathname.split("?")[0];

    if (auth.userId && path === "/") {
      const dashboard = new URL("/chatbots", req.url);
      return NextResponse.redirect(dashboard);
    }

    if (!auth.isPublicRoute && !auth.userId) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (!auth.isPublicRoute && !auth.orgId && path !== "/create-org") {
      const url = new URL("/create-org", req.url);
      return NextResponse.redirect(url);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
