// middleware.ts — place at project root
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Routes that require authentication (not necessarily Pro subscription)
const isProtectedRoute = createRouteMatcher([
  "/api/checkout(.*)",
  "/api/portal(.*)",
  "/account(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  // Town pages, pricing, and public pages are accessible to everyone.
  // Gating of premium CONTENT within town pages is handled client-side
  // by the <PaywallGate> component checking subscription status.
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
