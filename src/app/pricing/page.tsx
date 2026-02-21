"use client";

import { useState, useRef } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const FREE_FEATURES = [
  "Compliance tracker across 28+ communities",
  "Provision-by-provision bylaw analysis",
  "AG disapproval decision summaries",
  "State law references & citations",
  "Permit data for tracked towns",
  "3 AI-powered questions per month",
];

const PRO_FEATURES = [
  "Everything in Free, plus:",
  "Unlimited AI-powered compliance questions",
  "Check any town's bylaw consistency before you bid",
  "Track AG enforcement decisions as they happen",
  "Compare permitting friction across your service area",
  "Downloadable compliance briefs for client presentations",
];

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const waitlistRef = useRef<HTMLDivElement>(null);

  function scrollToWaitlist() {
    waitlistRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    console.log("Notify signup:", { email, interest: ["pro"] });
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-12 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            ADU compliance intelligence for Massachusetts
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Know what you&apos;re walking into before you pull a permit.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {/* Free */}
          <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 sm:p-8 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Available Now
              </span>
            </div>
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                Free
              </h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">Free</span>
                <span className="text-gray-500">&mdash; always</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Browse the compliance tracker and explore ADU permit data across
                Massachusetts.
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {FREE_FEATURES.map((f) => (
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
          <div className="rounded-2xl border-2 border-emerald-500 bg-gray-800 p-6 sm:p-8 flex flex-col relative">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                Pro
              </h2>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$75</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                For builders, lenders, and consultants who need town-level
                intelligence.
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {PRO_FEATURES.map((f, i) => (
                <li
                  key={f}
                  className={`flex items-start gap-2.5 text-sm ${
                    i === 0 ? "text-gray-400 font-medium" : "text-gray-300"
                  }`}
                >
                  {i > 0 && (
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
                  )}
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={scrollToWaitlist}
              className="w-full py-3 px-4 rounded-lg bg-emerald-600 text-white font-medium text-center hover:bg-emerald-500 transition-colors"
            >
              Join the Waitlist
            </button>
          </div>
        </div>

        {/* Social proof */}
        <p className="text-center text-sm text-gray-500 mb-20">
          Tracking bylaw consistency across 28 Massachusetts towns. 1,639 ADU
          applications filed statewide in year one.
        </p>

        {/* Email capture */}
        <div ref={waitlistRef} className="max-w-xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-2 text-center">
              Get Early Access to Pro
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              Founding members get 30 days free when we launch.
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
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
                >
                  Join the Waitlist
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
