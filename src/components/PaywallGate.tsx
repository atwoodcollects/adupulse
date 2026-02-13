// components/PaywallGate.tsx
"use client";

import { useSubscription } from "@/lib/subscription";
import { useUser, SignInButton } from "@clerk/nextjs";
import { UpgradeBanner } from "./UpgradeBanner";

interface PaywallGateProps {
  /** Content shown to Pro subscribers */
  children: React.ReactNode;
  /** What to show free users instead (optional — defaults to UpgradeBanner) */
  fallback?: React.ReactNode;
  /** Feature name for the upgrade CTA, e.g. "full permit table" */
  feature?: string;
  /**
   * For partial gating: show first N items to free users.
   * If provided, children should be a function receiving the limit.
   */
  freePreviewCount?: number;
}

export function PaywallGate({
  children,
  fallback,
  feature = "this feature",
  freePreviewCount,
}: PaywallGateProps) {
  const { isLoaded, isPro } = useSubscription();
  const { isSignedIn } = useUser();

  // Still loading auth state — show nothing to prevent flash
  if (!isLoaded) {
    return (
      <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />
    );
  }

  // Pro users see everything
  if (isPro) {
    return <>{children}</>;
  }

  // Free users (signed in or not) see the fallback
  const upgradeCTA = fallback || (
    <UpgradeBanner
      feature={feature}
      isSignedIn={isSignedIn ?? false}
    />
  );

  // If freePreviewCount is set, we still render children but expect
  // the parent to handle limiting. This component just adds the CTA below.
  if (freePreviewCount !== undefined) {
    return (
      <>
        {children}
        {upgradeCTA}
      </>
    );
  }

  return <>{upgradeCTA}</>;
}

/**
 * Simpler variant: just checks if Pro and returns boolean.
 * Use in conditional rendering when PaywallGate wrapper is overkill.
 *
 * Example:
 *   const canExport = useProFeature();
 *   <button disabled={!canExport}>Export CSV</button>
 */
export function useProFeature(): boolean {
  const { isPro, isLoaded } = useSubscription();
  return isLoaded && isPro;
}
