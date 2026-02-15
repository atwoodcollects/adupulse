"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const PUBLIC_FEATURES = [
  "Consistency tracker across 25+ communities",
  "Provision-by-provision ordinance analysis",
  "AG disapproval decision summaries",
  "State law references & citations",
  "Permit data for tracked towns",
  "Quadrant rankings & town grades",
];

const PRO_FEATURES = [
  "Everything in Public, plus:",
  "Email alerts for bylaw changes & AG decisions",
  "Quarterly consistency re-reviews",
  "Downloadable PDF reports per community",
  "Custom audit requests",
];

const MUNICIPAL_FEATURES = [
  "Everything in Pro, plus:",
  "API access to consistency data",
  "Bulk CSV/JSON exports",
  "Embeddable widgets for your site",
  "White-label reports",
  "Multi-seat team access",
];

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  function toggleInterest(value: string) {
    setInterest((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Wire to backend (e.g. POST /api/notify or Supabase insert)
    console.log("Notify signup:", { email, interest: Array.from(interest) });
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-12 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Free While We Build
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            ADU Pulse is the only platform tracking whether local ADU rules are
            consistent with Massachusetts state law. Full access is free during
            early access.
          </p>
        </div>

        {/* Early access banner */}
        <div className="flex justify-center mb-12">
          <span className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Early Access — Free for Everyone
          </span>
        </div>

        {/* Tier cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {/* Public */}
          <div className="rounded-2xl border-2 border-emerald-500 bg-gray-800 p-6 sm:p-8 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Available Now
              </span>
            </div>
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                Public
              </h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">Free</span>
                <span className="text-gray-500">— always</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Full consistency analysis for every tracked community.
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {PUBLIC_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm text-gray-300"
                >
                  <svg
                    className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="/compliance"
              className="w-full py-3 px-4 rounded-lg bg-emerald-600 text-white font-medium text-center hover:bg-emerald-500 transition-colors block"
            >
              Explore the Tracker
            </a>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 sm:p-8 flex flex-col opacity-75">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Pro
              </h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-400">TBD</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Coming 2026</p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {PRO_FEATURES.map((f, i) => (
                <li
                  key={f}
                  className={`flex items-start gap-2.5 text-sm ${
                    i === 0 ? "text-gray-500 font-medium" : "text-gray-500"
                  }`}
                >
                  {i > 0 && (
                    <svg
                      className="w-4 h-4 text-gray-600 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {f}
                </li>
              ))}
            </ul>
            <div className="w-full py-3 px-4 rounded-lg border border-gray-700 text-gray-500 font-medium text-center">
              Coming Soon
            </div>
          </div>

          {/* Municipal / API */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 sm:p-8 flex flex-col opacity-75">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Municipal / API
              </h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-400">Custom</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Coming 2026</p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {MUNICIPAL_FEATURES.map((f, i) => (
                <li
                  key={f}
                  className={`flex items-start gap-2.5 text-sm ${
                    i === 0 ? "text-gray-500 font-medium" : "text-gray-500"
                  }`}
                >
                  {i > 0 && (
                    <svg
                      className="w-4 h-4 text-gray-600 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {f}
                </li>
              ))}
            </ul>
            <div className="w-full py-3 px-4 rounded-lg border border-gray-700 text-gray-500 font-medium text-center">
              Coming Soon
            </div>
          </div>
        </div>

        {/* Email capture */}
        <div className="max-w-xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2 text-center">
              Get Notified When Pro Launches
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              We&apos;ll email you once — no spam.
            </p>

            {submitted ? (
              <div className="text-center py-4">
                <p className="text-emerald-400 font-medium">
                  You&apos;re on the list. We&apos;ll be in touch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNotify} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                />
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "pro", label: "Pro" },
                    { value: "municipal", label: "Municipal / API" },
                    { value: "both", label: "Both" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={interest.has(opt.value)}
                        onChange={() => toggleInterest(opt.value)}
                        className="rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
