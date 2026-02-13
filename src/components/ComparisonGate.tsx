// components/ComparisonGate.tsx
//
// Drop this into your existing comparison tool to enforce the
// 2-town limit for free users.

"use client";

import { useSubscription } from "@/lib/subscription";
import { UpgradeBanner } from "@/components/UpgradeBanner";

interface ComparisonGateProps {
  selectedTowns: string[];
  onRemoveTown: (town: string) => void;
  children: React.ReactNode;
}

export function ComparisonGate({
  selectedTowns,
  onRemoveTown,
  children,
}: ComparisonGateProps) {
  const { townCompareLimit, isPro, isLoaded } = useSubscription();

  if (!isLoaded) return null;

  const atLimit = selectedTowns.length >= townCompareLimit;

  return (
    <>
      {children}

      {/* Show limit warning when free user hits 2 towns */}
      {!isPro && atLimit && (
        <div className="mt-4">
          <UpgradeBanner
            feature="unlimited town comparisons"
            isSignedIn={true}
          />
        </div>
      )}
    </>
  );
}

/**
 * Hook for your town selector component.
 * Returns whether the user can add another town.
 *
 * Usage:
 *   const { canAddTown, limit } = useComparisonLimit(selectedTowns.length);
 *   <button disabled={!canAddTown} onClick={addTown}>Add town</button>
 */
export function useComparisonLimit(currentCount: number) {
  const { townCompareLimit, isPro } = useSubscription();
  return {
    canAddTown: currentCount < townCompareLimit,
    limit: townCompareLimit,
    isPro,
    remaining: Math.max(0, townCompareLimit - currentCount),
  };
}
