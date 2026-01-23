# ADU Pulse

**Real-time ADU permit tracking for Massachusetts**

Live at: [adupulse.com](https://adupulse.com)

## What is this?

A public dashboard tracking ADU (Accessory Dwelling Unit) permit activity across Massachusetts towns since the statewide ADU law took effect on February 2, 2025.

**Free tier:** Statewide stats, town leaderboard, permit map
**Pro tier:** Time-to-permit data, velocity trends, export, alerts

## Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS, TypeScript
- **Database:** Supabase (Postgres)
- **Hosting:** Vercel
- **Maps:** Mapbox GL JS

## Local Development

```bash
# Clone
git clone https://github.com/[your-username]/adupulse.git
cd adupulse

# Install
npm install

# Environment variables
cp .env.example .env.local
# Add your Supabase and Mapbox keys

# Run
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token (optional)
```

## Database Setup

Run the schema in Supabase SQL Editor:

```bash
# Copy contents of supabase/schema.sql into Supabase SQL Editor
```

## Data Collection

Data is collected via:
1. **Public records requests** — Monthly FOIA to priority towns
2. **State survey data** — EOHLC publishes semi-annual aggregates
3. **Manual entry** — For towns with public permit portals

See `docs/FOIA_TEMPLATE.md` for the request template.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main dashboard
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Styles
│   ├── lib/
│   │   └── supabase.ts       # Database client + queries
│   └── components/           # Reusable components
├── supabase/
│   └── schema.sql            # Database schema
├── docs/
│   └── FOIA_TEMPLATE.md      # Public records request template
└── public/                   # Static assets
```

## Roadmap

- [x] Database schema
- [x] Basic dashboard UI
- [ ] Mapbox integration
- [ ] Town detail pages
- [ ] Email alerts for subscribers
- [ ] API endpoints for pro users
- [ ] Data ingestion pipeline

## License

MIT

---

Built by [Nick Uliano](https://twitter.com/nickuliano)
