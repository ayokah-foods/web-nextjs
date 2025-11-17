import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useAuthStore } from "./store/useAuthStore";

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

  // get auth token
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // role-based protection
  if (pathname.startsWith("/account") && role !== "customer") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/dashboard") && role !== "vendor") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only on routes we care about
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
