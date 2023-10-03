import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import withAuth from "next-auth/middleware";

export default withAuth((req, ev) => {}, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});
