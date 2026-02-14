"use client";

import { useUser } from "@clerk/nextjs";
import { PLANS } from "./plans";

export type SubscriptionTier = "free" | "pro";

interface SubscriptionInfo {
  tier: SubscriptionTier;
  plan: (typeof PLANS)["free"] | (typeof PLANS)["pro_monthly"];
  isLoaded: boolean;
  isPro: boolean;
  permitRowLimit: number;
  townCompareLimit: number;
  canExport: boolean;
  complianceDetail: boolean;
  marketScoresLimit: number;
}

export function useSubscription(): SubscriptionInfo {
  const { user, isLoaded } = useUser();
  const tier =
    (user?.publicMetadata?.subscriptionTier as SubscriptionTier) || "free";
  // TEMP: bypass paywall — revert this line to re-enable
  const isPro = true; // tier === "pro";
  const plan = isPro ? PLANS.pro_monthly : PLANS.free;

  return {
    tier,
    plan,
    isLoaded,
    isPro,
    permitRowLimit: plan.permitRows,
    townCompareLimit: plan.townCompareLimit,
    canExport: plan.canExport,
    complianceDetail: plan.complianceDetail,
    marketScoresLimit: plan.marketScoresLimit,
  };
}
