import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/home", "/pricing", "/about", "/blog(.*)"],
  beforeAuth: (req) => {
    if (req.nextUrl.pathname === "/home") {
      return NextResponse.rewrite(new URL("/", req.url));
    }
  },
  afterAuth: (auth, req) => {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId && req.nextUrl.pathname === "/") {
      const dashboard = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboard);
    }

    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/create-org") {
      const orgSelection = new URL("/create-org", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
