import { NextResponse, type NextRequest } from "next/server";

/**
 * Quick check for the admin area: no session cookie, go to the login page.
 * This is only a fast path; every admin page and action still verifies the
 * session against the database (lib/server/auth.ts).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (!request.cookies.has("tm_admin_session")) {
    const url = new URL("/admin/login", request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
