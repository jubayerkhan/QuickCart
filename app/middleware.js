import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isSellerRoute = createRouteMatcher(['/seller(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, redirectToSignIn } = await auth();

  const userId = sessionClaims?.sub;
  const role = sessionClaims?.publicMetadata?.role;

  // 🔐 Seller routes (seller + admin)
  if (isSellerRoute(req)) {
    if (!userId) return redirectToSignIn();

    if (role !== "seller" && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // 🔐 Admin routes (only admin)
  if (isAdminRoute(req)) {
    if (!userId) return redirectToSignIn();

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};