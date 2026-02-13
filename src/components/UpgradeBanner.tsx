// components/UpgradeBanner.tsx
"use client";

import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

interface UpgradeBannerProps {
  feature?: string;
  isSignedIn: boolean;
}

export function UpgradeBanner({
  feature = "this feature",
  isSignedIn,
}: UpgradeBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 my-6">
      {/* Decorative blur */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              Unlock {feature}
            </h3>
            <p className="text-gray-600 mt-1 text-sm leading-relaxed">
              ADU Pulse Pro gives you full permit tables, unlimited town
              comparisons, exportable reports, and detailed compliance
              breakdowns — everything you need to make data-driven ADU
              decisions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 ml-9">
          {isSignedIn ? (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Upgrade to Pro — $49/mo
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Sign up to unlock
                </button>
              </SignInButton>
              <span className="text-xs text-gray-500">
                Free account required, then upgrade for $49/mo
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline version for smaller placements (e.g., next to Export button)
 */
export function UpgradeInline({ feature }: { feature: string }) {
  return (
    <Link
      href="/pricing"
      className="inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-800 font-medium"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      Pro — unlock {feature}
    </Link>
  );
}
