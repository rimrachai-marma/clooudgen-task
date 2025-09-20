import { NextRequest, NextResponse } from "next/server";
import { User } from "./lib/types/auth";
import { getAuthToken, validateUser } from "./lib/actions/auth";

const protectedRoutes = ["/profile"];
const adminRoutes = ["/admin/dashboard", "/admin/products/create"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const authToken = await getAuthToken();

  // Early return for public routes when no auth token exists
  if (isPublicRoute && !authToken) {
    return NextResponse.next();
  }

  // Only validate user when necessary
  let user: User | null = null;
  if (
    authToken &&
    (isProtectedRoute || isAdminRoute || (isPublicRoute && authToken))
  ) {
    user = await validateUser(authToken);
  }

  // Handle protected routes
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Handle admin routes
  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (user.role !== "admin" && user.role !== "superadmin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  // Handle authenticated users on public routes (except home page)
  if (isPublicRoute && user && (path === "/login" || path === "/signup")) {
    if (user.role === "admin" || user.role === "superadmin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
    }

    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
