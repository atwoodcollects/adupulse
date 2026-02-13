# ADU Pulse — Product Blueprint

## Core Positioning

ADU Pulse scores how ADU-friendly each Massachusetts town actually is in practice — not just by permits, but also through bylaw analysis.

Most ADU data sources stop at permit counts. We go deeper: reading local bylaws line by line and flagging where towns contradict Massachusetts Chapter 150 and 760 CMR 71.00. The result is a two-dimensional picture of each town that separates what the numbers say from what the rules actually allow.

## The Two-Dimensional Scoring Matrix

Every town sits on two axes:

```
                        BYLAWS
              Clean                Messy
         ┌──────────────┬──────────────────┐
   High  │  GREEN LIGHT │  PAPER TIGER     │
Permits  │  High volume, │  Permits flowing  │
         │  clean rules  │  despite illegal  │
         │              │  restrictions     │
         ├──────────────┼──────────────────┤
   Low   │  UNTAPPED    │  WALLED OFF      │
Permits  │  Rules are    │  Bad rules,      │
         │  fine — demand│  low activity,   │
         │  hasn't hit   │  legal risk      │
         └──────────────┴──────────────────┘
```

### How We Score Each Axis

**Rules Friction** (bylaws — scored 0–100):
- By-right permitting status (40 pts if enabled)
- Approval rate as proxy for administrative friction (up to 40 pts)
- Denial rate penalty (up to 20 pts)

**Operational Friction** (permits — scored 0–100):
- Pending application ratio (≤10% = 30 pts)
- Median review timeline (≤30 days = 40 pts)
- Permit volume as signal of department experience (≥15 apps = 30 pts)

Combined into a letter grade: A (80+), B (65+), C (50+), D (35+), F (<35).

### Real Examples from the Data

| Quadrant | Town | What's Happening |
|----------|------|-----------------|
| **Green Light** | New Bedford | 0 inconsistent provisions, 3 under review, 7 compliant. Clean rules, active market. |
| **Paper Tiger** | Plymouth | 42 applications, 81% approval — but 3 provisions directly violate state law and 2 more are legal gray areas. Volume masks rule problems. |
| **Untapped** | Canton | Only 1 inconsistent provision, 1 under review, 5 compliant. Rules are mostly clean but permit volume is low. |
| **Walled Off** | Leicester | 3 AG disapprovals for blanket dimensional noncompliance. Rules actively block what state law requires towns to allow. |

## The Competitive Moat: Gray Areas

Our defensible advantage lives in the space between state law and local practice. This is where the "review" status matters most.

### What "Review" Means

Massachusetts Chapter 150 mandates by-right ADU permitting statewide. But towns interpret "reasonable" restrictions differently, creating legal gray areas that aren't clearly compliant or clearly illegal — they're untested.

Examples from our compliance data:

- **Design review as de facto denial** — Plymouth requires design standards that are "ambiguous" and "could increase costs or delay permits if applied subjectively." Legal until challenged.
- **Historic district gatekeeping** — Brookline's HDC has denial authority over ADUs in historic districts. This could function as a de facto special permit, which Chapter 150 prohibits. Unclear if it survives a challenge.
- **Setback stacking** — Plymouth requires 10-foot minimum from the principal dwelling, which may exceed state limits on narrow lots. "May be permissible as 'reasonable' or may be challenged."
- **Impervious surface caps** — Canton's cap may function as a de facto size restriction on small lots. Has not been formally challenged.
- **Site plan review as special permit** — Hanson requires site plan review that functions like a special permit process. One AG disapproval already issued.
- **STR restrictions on ADUs** — Nantucket and New Bedford restrict short-term rentals specifically for ADUs. Towns can regulate STRs generally, but ADU-specific restrictions may violate legislative intent.

### Why This Is Hard to Replicate

1. **Manual bylaw reading** — No API for local bylaws. Each town's regulations must be read, interpreted, and mapped against state law provision by provision.
2. **Legal judgment calls** — Categorizing a provision as "inconsistent" vs "review" vs "compliant" requires understanding both the statute and how building departments actually apply rules.
3. **AG disapproval tracking** — Attorney General disapprovals of local bylaws are public but scattered. We track them per town and link them to specific provisions.
4. **Ongoing maintenance** — Towns update bylaws. State guidance evolves. The compliance picture changes quarterly.

Permit data is commoditizable. Bylaw analysis is not.

## Target Customers

| Customer | What They Need | What We Provide |
|----------|---------------|-----------------|
| **Builders** | Know where demand is before marketing. Avoid towns with legal landmines. | Permit volume by town, approval rates, compliance status, clustered buyer groups for economies of scale. |
| **Attorneys** | Identify towns with challengeable restrictions. Build case law arguments. | Provision-level compliance analysis, AG disapproval history, specific bylaw-vs-statute conflicts. |
| **Developers** | Site selection based on both market demand and regulatory friction. | Two-axis scoring: high permits + clean bylaws = green light. Operational friction metrics. |
| **Town Officials** | Understand where their bylaws fall short before the AG sends a letter. | Compliance tracker showing exactly which provisions are inconsistent, with state law citations. |
| **Advocacy Groups** | Data to support policy arguments for ADU-friendly reform. | Statewide compliance statistics, town-by-town comparisons, inconsistency counts. |
| **Lenders** | Assess regulatory risk before financing ADU projects in specific towns. | Per-town compliance grades, approval rates, review timelines, bylaw consistency status. |

## Monetization

### Architecture

```
Clerk (auth) → user.publicMetadata.subscriptionTier → useSubscription() hook
Stripe (payments) → webhook → updates Clerk metadata → app reflects tier
```

- **Auth:** Clerk. Stores subscription tier in user metadata. No separate database needed.
- **Payments:** Stripe Checkout for purchase, Customer Portal for self-service management, Webhooks for sync.
- **Gating:** Client-side `<PaywallGate>` component + `useSubscription()` hook. Server-side middleware protects API routes.

### What's Free vs Pro

| Feature | Explorer (Free) | Pro ($49/mo or $39/mo annual) |
|---------|----------------|-------------------------------|
| Town pages (summary stats) | All towns | All towns |
| Permit table rows | 5 sample rows | Full table |
| Town comparison tool | 2 towns | Unlimited |
| Compliance tracker | Status badges only | Full bylaw vs state law breakdown |
| Market opportunity scores | Top 5 | All towns ranked |
| CSV/PDF export | No | Yes |
| Cost estimator | Full | Full |
| ADU quiz | Full | Full |
| Buyers Club signup | Free | Free |

### Gating Implementation

- `<PaywallGate>` wraps premium content blocks. Shows `<UpgradeBanner>` to free users.
- `<ComparisonGate>` enforces 2-town limit. Exposes `useComparisonLimit()` hook.
- `useProFeature()` returns a boolean for simple conditional rendering (e.g., disabling export buttons).
- Compliance detail rows check `isPro` inline — free users see "Unlock detailed compliance analysis with Pro" instead of the full state law vs local bylaw comparison.

## Strategic Priority: Bylaws Over Permits

**Permits tell you what happened. Bylaws tell you what will happen.**

A town with 50 approved permits and 4 illegal bylaw provisions is a ticking clock — one AG disapproval or court challenge reshuffles the entire local market. A town with 3 permits and clean bylaws is an untapped opportunity waiting for the first builder to show up.

### Why We Prioritize Bylaw Analysis

1. **Defensibility** — Permit data can be FOIA'd and scraped. Bylaw analysis requires legal interpretation that compounds over time as we build institutional knowledge.
2. **Predictive power** — Compliance status predicts regulatory change. Towns with AG disapprovals will be forced to update bylaws, creating new market openings before permit data reflects them.
3. **Customer value** — Every target customer segment cares more about forward-looking risk assessment than backward-looking permit counts. Builders need to know if a town's rules will survive challenge. Attorneys need to know which provisions to target. Officials need to know what to fix.
4. **Data moat** — We track 4 provision categories (Use & Occupancy, Dimensional & Parking, Building & Safety, Process & Administration) across a growing number of towns. Each new town added makes the dataset more valuable for statewide comparisons and trend analysis.

### Current Coverage

- **Permit data:** 293 towns via EOHLC survey + 11 portal-scraped towns with full permit-level detail (addresses, costs, sqft, type, status)
- **Bylaw analysis:** 7 towns with provision-level compliance tracking. 14 inconsistent provisions, 7 AG disapprovals, and 9 legal gray areas identified so far.
- **Next milestone:** Expand bylaw coverage to 25 towns, prioritizing towns with high permit volume and suspected noncompliance (the "Paper Tiger" quadrant).
