import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/account-management" || request.nextUrl.pathname === "/account-management/") {
    return NextResponse.redirect(new URL("/account-management-request", request.url), 307);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account-management", "/account-management/"],
};
