"use client";

import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useSubscription } from "@/lib/subscription";

const FEATURES_FREE = [
  "Town pages with summary stats across Massachusetts",
  "5 sample permit rows per town",
  "Compare up to 2 towns",
  "Consistency status badges",
  "Top 5 market opportunity scores",
  "Cost estimator & ADU quiz",
  "Buyers Club signup",
  "Blog & educational content",
];

const FEATURES_PRO = [
  "Everything in Explorer, plus:",
  "Full permit tables — every address, cost, sqft, contractor, type",
  "Unlimited town comparisons",
  "Detailed consistency breakdowns (bylaw vs. state law conflicts)",
  "Export town data as CSV or PDF",
  "All towns ranked by market opportunity score",
  "Email alerts for permit activity & bylaw changes",
  "Builder demand signals by town",
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const { isSignedIn } = useUser();
  const { isPro, isLoaded } = useSubscription();
  const [loading, setLoading] = useState(false);

  const monthlyPrice = 49;
  const annualMonthlyPrice = 39;
  const annualTotal = annualMonthlyPrice * 12;
  const savings = (monthlyPrice - annualMonthlyPrice) * 12;

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: annual ? "pro_annual" : "pro_monthly" }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      console.error("Portal error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#111827" }}>
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            The ADU data everyone can see.
            <br />
            <span className="text-amber-500">
              The intelligence only Pro unlocks.
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            ADU Pulse tracks permit data across Massachusetts towns.
            Explorer gets you started. Pro gives you the depth to make decisions.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-medium ${!annual ? "text-white" : "text-gray-500"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-amber-600" : "bg-gray-600"}`}
            aria-label="Toggle annual billing"
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${annual ? "translate-x-6" : ""}`} />
          </button>
          <span className={`text-sm font-medium ${annual ? "text-white" : "text-gray-500"}`}>Annual</span>
          {annual && (
            <span className="ml-2 text-xs font-semibold bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">
              Save ${savings}/yr
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Card */}
          <div className="rounded-2xl border border-gray-700 p-8 flex flex-col" style={{ backgroundColor: "#1f2937" }}>
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Explorer</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-500">/forever</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Browse ADU permit data across Massachusetts. No credit card required.
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {FEATURES_FREE.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <svg className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="w-full py-3 px-4 rounded-lg border border-gray-600 text-gray-300 font-medium hover:bg-gray-700 transition-colors">
                  Create free account
                </button>
              </SignInButton>
            ) : (
              <div className="w-full py-3 px-4 rounded-lg bg-gray-700 text-gray-400 font-medium text-center">
                Current plan
              </div>
            )}
          </div>

          {/* Pro Card */}
          <div className="rounded-2xl border-2 border-amber-500 p-8 flex flex-col relative" style={{ backgroundColor: "#1f2937" }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            </div>
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">Pro</h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  ${annual ? annualMonthlyPrice : monthlyPrice}
                </span>
                <span className="text-gray-500">/month</span>
              </div>
              {annual && (
                <p className="mt-1 text-sm text-gray-400">${annualTotal} billed annually</p>
              )}
              <p className="mt-2 text-sm text-gray-400">
                Full permit intelligence for builders, developers, and housing professionals.
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {FEATURES_PRO.map((f, i) => (
                <li key={f} className={`flex items-start gap-2.5 text-sm ${i === 0 ? "text-gray-400 font-medium" : "text-gray-300"}`}>
                  {i > 0 && (
                    <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {f}
                </li>
              ))}
            </ul>
            {!isLoaded ? (
              <div className="w-full py-3 px-4 rounded-lg bg-gray-700 animate-pulse h-12" />
            ) : isPro ? (
              <button onClick={handlePortal} disabled={loading} className="w-full py-3 px-4 rounded-lg bg-gray-200 text-gray-900 font-medium hover:bg-white transition-colors disabled:opacity-50">
                Manage subscription
              </button>
            ) : isSignedIn ? (
              <button onClick={handleCheckout} disabled={loading} className="w-full py-3 px-4 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-500 transition-colors disabled:opacity-50">
                {loading ? "Redirecting..." : "Get Pro"}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full py-3 px-4 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-500 transition-colors">
                  Sign up & get Pro
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 border border-gray-700 rounded-xl px-6 py-4" style={{ backgroundColor: "#1f2937" }}>
            <span className="text-2xl">🏛️</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Need institutional access?</p>
              <p className="text-xs text-gray-400">
                API access, custom dashboards, and data licensing for municipalities, lenders, and agencies.
              </p>
            </div>
            <a href="mailto:nick@adupulse.com?subject=Enterprise%20Access" className="ml-4 text-sm font-medium text-amber-500 hover:text-amber-400 whitespace-nowrap">
              Contact us →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
