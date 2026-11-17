# Henry Santesteban — Portfolio

Next.js (App Router) + Tailwind CSS + Supabase. Public site with Hero, Trabajos, Soluciones and Blog sections, plus a password-protected `/admin` panel with CRUD for every section.

## Stack

- **Next.js 16** (App Router, Server Components) + TypeScript
- **Tailwind CSS v4** — dark, minimal theme (`#0A0A0A` background, `#262626` surfaces, `#FAFAFA` text)
- **Supabase** — Postgres (content), Auth (admin login), Storage (logos/images/CV)
- Deploy target: **Vercel**

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor** → **New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the `companies`, `solutions`, `blog_posts` and `site_settings` tables, sets up Row Level Security (public read, authenticated-only write), and creates a public `portfolio` storage bucket for images/CV.
3. Go to **Authentication → Users → Add user** and create yourself an admin user (email + password). This is the only account that will exist — there's no public sign-up, so anyone with those credentials can log into `/admin`. Use a strong password.
4. Go to **Project Settings → API** and copy the **Project URL** and **anon public** key.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from step 1.4:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` to log in with the user created in step 1.3.

## 4. Load your content

Everything is editable from `/admin`, no redeploy required:

- **Configuración** — your name, role, hero headline/subtitle, contact email, GitHub URL and CV (PDF upload).
- **Trabajos** — one entry per company, with logo, role, period and description. These show up as selectable logos on the homepage.
- **Soluciones** — your personal projects (e.g. the mail manager). Add a cover image, description and optional link.
- **Blog** — articles written in Markdown, with cover image, category, read time and a published/draft toggle.

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the same two environment variables from step 2 in the Vercel project settings.
4. Deploy. Then, in Supabase → **Authentication → URL Configuration**, add your Vercel domain to the allowed **Site URL** / **Redirect URLs**.

### Keep Supabase awake

Supabase's free tier pauses a project after 7 days without activity. `vercel.json` schedules a daily Vercel Cron job that calls `/api/heartbeat`, which runs a tiny read against `site_settings`. Optionally add a `CRON_SECRET` environment variable in Vercel (any long random string) to make that endpoint reject requests that don't come from the cron job. Check the runs in Vercel → **Settings → Cron Jobs**.

## Project structure

```
src/
  app/
    page.tsx                 Home (Hero, Trabajos, Soluciones, Blog)
    blog/[slug]/page.tsx      Blog post detail
    admin/login/page.tsx      Admin login
    admin/(dashboard)/        Protected admin CRUD (trabajos, soluciones, blog, settings)
  components/
    site/                     Public site components
    admin/                    Admin forms, tables and upload widget
  lib/
    supabase/                 Browser/server Supabase clients + middleware
    data.ts                   Server-side read helpers used by the public site
supabase/
  schema.sql                  Tables, RLS policies and storage bucket setup
```
