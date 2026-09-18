-- Portfolio schema for Supabase.
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  period text not null,
  description text not null default '',
  logo_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.solutions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  project_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  category text not null default '',
  read_time text not null default '5 min',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  full_name text not null default '',
  role_title text not null default '',
  hero_heading text not null default '',
  hero_subheading text not null default '',
  email text not null default '',
  github_url text not null default '',
  linkedin_url text,
  cv_url_es text,
  cv_url_en text
);

insert into public.site_settings
  (id, full_name, role_title, hero_heading, hero_subheading, email, github_url)
values (
  1,
  'Henry Santesteban',
  'Software Developer',
  E'Construyo Software\nCon Atención al Detalle',
  'Desarrollo aplicaciones web prolijas y mantenibles, del backend al pixel, enfocado en resolver problemas reales.',
  'henrysantesteban@gmail.com',
  'https://github.com'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public (anon) can read everything; only an authenticated user (the admin,
-- since this project has no public sign-up) can write.
-- ---------------------------------------------------------------------------

alter table public.companies enable row level security;
alter table public.solutions enable row level security;
alter table public.blog_posts enable row level security;
alter table public.site_settings enable row level security;

create policy "companies_public_read" on public.companies
  for select to anon, authenticated using (true);
create policy "companies_admin_write" on public.companies
  for all to authenticated using (true) with check (true);

create policy "solutions_public_read" on public.solutions
  for select to anon, authenticated using (true);
create policy "solutions_admin_write" on public.solutions
  for all to authenticated using (true) with check (true);

create policy "blog_posts_public_read" on public.blog_posts
  for select to anon, authenticated using (true);
create policy "blog_posts_admin_write" on public.blog_posts
  for all to authenticated using (true) with check (true);

create policy "site_settings_public_read" on public.site_settings
  for select to anon, authenticated using (true);
create policy "site_settings_admin_write" on public.site_settings
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Storage: a single public bucket for logos, project images, blog covers and CV.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "portfolio_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'portfolio');
create policy "portfolio_admin_write" on storage.objects
  for all to authenticated using (bucket_id = 'portfolio') with check (bucket_id = 'portfolio');
