// app/towns/[slug]/page.example.tsx
//
// This shows HOW to integrate gating into your existing town pages.
// Don't replace your town page wholesale — wire these patterns into
// what you already have.

"use client";

import { PaywallGate, useProFeature } from "@/components/PaywallGate";
import { UpgradeInline } from "@/components/UpgradeBanner";
import { useSubscription } from "@/lib/subscription";

// Your existing town data type (adjust to match your actual schema)
interface Permit {
  address: string;
  cost: string;
  sqft: string;
  type: string;
  contractor: string;
  status: string;
}

interface TownData {
  name: string;
  county: string;
  totalPermits: number;
  approvalRate: number;
  complianceStatus: "compliant" | "partial" | "non-compliant";
  complianceDetails: string[]; // Detailed bylaw conflicts
  permits: Permit[];
}

export default function TownPageExample({ town }: { town: TownData }) {
  const { permitRowLimit, isPro } = useSubscription();
  const canExport = useProFeature();

  // ─── PATTERN 1: Partial permit table ───────────────────────
  // Show 5 rows free, full table for Pro
  const FREE_PREVIEW_COUNT = 5;
  const visiblePermits = isPro
    ? town.permits
    : town.permits.slice(0, FREE_PREVIEW_COUNT);

  // ─── PATTERN 2: Export button gating ───────────────────────
  // Button is visible but disabled/locked for free users

  // ─── PATTERN 3: Compliance detail gating ───────────────────
  // Badge is free, full breakdown is Pro

  return (
    <div>
      {/* ═══ SECTION: Town Header (always free) ═══ */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{town.name}</h1>
        <p className="text-gray-500">{town.county} County</p>
        <div className="flex gap-6 mt-4">
          <div>
            <span className="text-2xl font-bold">{town.totalPermits}</span>
            <span className="text-gray-500 text-sm ml-1">permits</span>
          </div>
          <div>
            <span className="text-2xl font-bold">{town.approvalRate}%</span>
            <span className="text-gray-500 text-sm ml-1">approval rate</span>
          </div>
        </div>
      </div>

      {/* ═══ SECTION: Compliance Status ═══ */}
      {/* Badge is always visible (free) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Compliance Status</h2>
        <ComplianceBadge status={town.complianceStatus} />

        {/* Detailed breakdown is gated */}
        <PaywallGate feature="full compliance breakdown">
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-sm mb-2">
              Bylaw vs. State Law Conflicts
            </h3>
            <ul className="space-y-2">
              {town.complianceDetails.map((detail, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">⚠</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </PaywallGate>
      </div>

      {/* ═══ SECTION: Permit Table ═══ */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">
            Permits ({town.totalPermits})
          </h2>

          {/* Export button — visible but gated */}
          {canExport ? (
            <button
              onClick={() => handleExport(town)}
              className="text-sm px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              Export CSV
            </button>
          ) : (
            <UpgradeInline feature="CSV export" />
          )}
        </div>

        {/* Permit table — shows limited rows for free */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-2 pr-4">Address</th>
                <th className="py-2 pr-4">Cost</th>
                <th className="py-2 pr-4">Sq Ft</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Contractor</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {visiblePermits.map((p, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2.5 pr-4">{p.address}</td>
                  <td className="py-2.5 pr-4">{p.cost}</td>
                  <td className="py-2.5 pr-4">{p.sqft}</td>
                  <td className="py-2.5 pr-4">{p.type}</td>
                  <td className="py-2.5 pr-4">{p.contractor}</td>
                  <td className="py-2.5">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show upgrade prompt if there are more permits than the free limit */}
        {!isPro && town.permits.length > FREE_PREVIEW_COUNT && (
          <PaywallGate
            feature={`all ${town.permits.length} permits`}
            freePreviewCount={FREE_PREVIEW_COUNT}
          >
            {/* This empty child is fine — the CTA comes from PaywallGate */}
            <></>
          </PaywallGate>
        )}
      </div>
    </div>
  );
}

// ─── Helper Components ──────────────────────────────────────

function ComplianceBadge({
  status,
}: {
  status: "compliant" | "partial" | "non-compliant";
}) {
  const styles = {
    compliant: "bg-green-100 text-green-700 border-green-200",
    partial: "bg-amber-100 text-amber-700 border-amber-200",
    "non-compliant": "bg-red-100 text-red-700 border-red-200",
  };
  const labels = {
    compliant: "✅ Compliant with state law",
    partial: "⚠️ Partially compliant",
    "non-compliant": "❌ Non-compliant",
  };
  return (
    <span
      className={`inline-block text-sm font-medium px-3 py-1 rounded-full border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function handleExport(town: TownData) {
  // Generate CSV from town.permits
  const headers = ["Address", "Cost", "Sq Ft", "Type", "Contractor", "Status"];
  const rows = town.permits.map((p) =>
    [p.address, p.cost, p.sqft, p.type, p.contractor, p.status].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${town.name.toLowerCase().replace(/\s+/g, "-")}-adu-permits.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
