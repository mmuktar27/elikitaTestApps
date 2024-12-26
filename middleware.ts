import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ROUTE_ACCESS = {
  "/admin": ["staff", "system admin"],
  "/receptionist": ["receptionist", "system admin", "healthcare admin"],
  "/healthcare": [
    "healthcare assistant",
    "doctor",
    "system admin",
    "healthcare admin",
  ],
  "/doctor": ["doctor", "remote doctor", "system admin", "healthcare admin"],
  "/remote-doctor": ["remote doctor", "system admin", "healthcare admin"],
};

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname;
    const userRoles = request.nextauth.token?.roles as string[] | undefined;
    console.log("userRoles", userRoles);

    for (const [route, allowedRoles] of Object.entries(ROUTE_ACCESS)) {
      if (pathname.startsWith(route)) {
        const hasAccess = userRoles?.some((role) =>
          allowedRoles.includes(role),
        );
        console.log("hasAccess", hasAccess);

        if (!hasAccess) {
          return NextResponse.rewrite(new URL("/denied", request.url));
        }
        break;
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/admin",
    "/admin/events",
    "/admin/users",
    "/admin/settings",
    "/admin/audits",
    "/admin/utilities",
    "/receptionist",
    "/healthcare",
    "/doctor",
    "/remote-doctor",
  ],
};
