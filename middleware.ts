import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/account",
  "/orders",
  "/wishlist",
  "/addresses",
  "/notifications",

  "/dashboard",
  "/products",
  "/seller/orders",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) return NextResponse.next();

  // ✓ Read cookies ONLY
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  // Not logged in
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Customer-only routes
  if (pathname.startsWith("/account") && role !== "customer") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Vendor-only routes
  if (pathname.startsWith("/dashboard") && role !== "vendor") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/addresses/:path*",
    "/notifications/:path*",

    "/dashboard/:path*",
    "/products/:path*",
    "/seller/orders/:path*",
  ],
};
