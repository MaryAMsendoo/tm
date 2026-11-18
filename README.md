# TM Artisan website

Website and admin dashboard for TM Artisan Company Ltd, a furniture maker in Abuja.
Visitors browse the work and send requests on WhatsApp or email; the owner manages
the content and reviews requests at `/admin`.

## Stack

- **Next.js 16** (App Router, Cache Components), React 19, Tailwind CSS 4
- **Neon** (Postgres) through **Drizzle ORM**: all content, requests and admin accounts
- **Cloudinary**: every photo and video (only the logo ships in `public/`)
- No email is sent by the server, and there are no online payments. Negotiation happens on WhatsApp.

## Setup

1. `npm install`
2. Create `.env.local` (never commit it; `.gitignore` excludes `.env*`):

   ```
   DATABASE_URL=postgresql://...        # Neon, pooled connection string
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

   Local development uses the **live** database, so anything changed on localhost changes
   the real site. Optional, for safer testing: point `.env.local` at a Neon dev branch, add
   `KEEP_CLOUDINARY_FILES=1` to it, and keep the live connection in `.env.live` for the
   `:live` scripts below.

3. `npm run db:migrate` creates the tables.
4. `npm run db:seed` fills a **new, empty** database with the original site content.
   It refuses to run when content already exists (see below).
5. `npm run admin:create -- <username>` creates an admin account (asks for the password).
6. `npm run dev` and open http://localhost:3000 (dashboard at `/admin`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` / `lint` | Usual Next.js commands. `build` reads the database (pages are prerendered from it). |
| `npm run db:generate` | Create a migration after editing `db/schema.ts`. |
| `npm run db:migrate` | Apply migrations to the database in `DATABASE_URL`. |
| `npm run db:studio` | Browse the database in Drizzle Studio. |
| `npm run db:seed` | Fill an empty database from `scripts/seed-data.ts`. `-- --reset` **replaces all catalogue and site content** (keeps requests and admin accounts). |
| `npm run admin:create -- <username>` | New admin account. |
| `npm run admin:reset-password -- <username>` | New password; signs the admin out everywhere. There is no "forgot password" email by design: a developer runs this. |
| `npm run admin:reset-password:live -- <username>` | Only with a dev branch: the same on the live database (`.env.live`). Also `admin:create:live`. |
| `npm run db:migrate:live` | Only with a dev branch: apply migrations to the live database before deploying. |

Set `ADMIN_PASSWORD` in the environment to run the admin scripts without the prompt.

Why `KEEP_CLOUDINARY_FILES` (dev branch only): the dev branch and the live site share one Cloudinary
account, and a dev copy can't see which files the live site still uses. With it set,
deleting things locally leaves the files in Cloudinary (a few stray files cost nothing).

## How it fits together

```
app/(site)/        public pages: home, shop, portfolio, about, contact, custom designs
app/admin/         dashboard: login, then (panel)/ pages and server actions
app/api/enquiries  saves a visitor's request (name, phone, items, message)
db/                Drizzle schema, migrations and connection
lib/server/        server-only code: cached content reads, auth, rate limiting, admin helpers
lib/               shared code: Zod schemas, Cloudinary URL helpers, WhatsApp links, types
context/           client providers: site details, quote list, request dialog
scripts/           seed (with the original content) and admin account tools
proxy.ts           sends signed-out visitors from /admin to /admin/login
```

**Content and caching.** Public pages read the database through cached functions in
`lib/server/content.ts` (`"use cache"` + `cacheTag`). Admin actions call `updateTag`, so
changes appear on the next page load. If you edit the database directly (SQL, Drizzle
Studio), the cached pages won't know: save the item once in the dashboard, or redeploy.

**Requests.** Request buttons open a dialog for the visitor's name and phone, save the
request through `POST /api/enquiries` (rate-limited per visitor), then open WhatsApp or
the visitor's email app. Plain "chat with us" links open WhatsApp directly.

**Media.** The dashboard uploads files straight from the browser to Cloudinary with a
short-lived signature (`app/admin/upload-actions.ts`), so large videos never pass through
the server. The server only accepts files from this account's `tm-artisan/` folder.
A file is deleted from Cloudinary only when no content still uses it. Limits: photos
10 MB, videos 100 MB (Cloudinary free plan).

**Admin security.** Passwords are hashed with scrypt; sessions are random tokens in an
HttpOnly cookie, stored as SHA-256 hashes, valid for 7 days. Next.js renders layouts and
pages in parallel, so **every admin page and server action must call `requireAdmin()`
itself**: the layout's check alone does not protect page data.

## Deploying

Any Node.js host works (`npm run build` then `npm run start`); keep the app in or near
Frankfurt, where the database is. Set the four environment variables on the host
(not `KEEP_CLOUDINARY_FILES`). Link previews, `robots.txt` and `sitemap.xml` use Vercel's
production address; on another host or a custom domain, also set
`NEXT_PUBLIC_SITE_URL=https://your-domain`.
The app uses no host-specific services, so it can move between hosts.
Note: Vercel's free Hobby plan does not allow commercial use.
