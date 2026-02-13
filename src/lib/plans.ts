export const PLANS = {
  free: {
    name: "Explorer",
    price: 0,
    priceId: "",
    permitRows: 5,
    townCompareLimit: 2,
    canExport: false,
    complianceDetail: false,
    marketScoresLimit: 5,
  },
  pro_monthly: {
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_MONTHLY!,
    price: 49,
    interval: "month" as const,
    permitRows: Infinity,
    townCompareLimit: Infinity,
    canExport: true,
    complianceDetail: true,
    marketScoresLimit: Infinity,
  },
  pro_annual: {
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_ANNUAL!,
    price: 39,
    interval: "year" as const,
    permitRows: Infinity,
    townCompareLimit: Infinity,
    canExport: true,
    complianceDetail: true,
    marketScoresLimit: Infinity,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
export type Plan = (typeof PLANS)[PlanKey];
