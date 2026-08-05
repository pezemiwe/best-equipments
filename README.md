# Best Equipments

Online store for **Best Qualities Industrial Equipment Nig Ltd** — genuine vehicle parts and accessories with WhatsApp ordering, an admin portal, and naira pricing.

Built with Next.js (pages router), Chakra UI, React Query, and Neon Postgres (falls back to a local JSON store in development).

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). The admin portal is at `/admin` (default dev password: `best-equipments-admin` — override with `ADMIN_PASSWORD`).

## Environment variables

Copy `.env.local.example` to `.env.local`:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (**REQUIRED in production**). Unset = local JSON file store (dev only). Tables are created automatically. |
| `SEED_DEMO_DATA` | Set to `true` to populate the catalog with demo products on first launch. In production, this should be unset or `false` to start with an empty catalog. |
| `ADMIN_PASSWORD` | Admin portal password (**REQUIRED in production**, min 12 chars). |
| `ADMIN_SECRET` | Secret for signing admin session tokens (**REQUIRED in production**). |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used for SEO tags and the sitemap (e.g. `https://bestqualities.ng`) |
| `ADMIN_EMAIL` | Admin email address for receiving order notifications. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE` | SMTP configuration for sending order confirmation emails. |

## Deploying to Netlify

1. Push this repository to GitHub.
2. Import it at [app.netlify.com/start](https://app.netlify.com/start). Build settings come from netlify.toml.
3. Add the four environment variables above.
4. Deploy. The first request creates and seeds the database.

After launch: submit `/sitemap.xml` in Google Search Console and replace the demo catalog via the admin portal.
