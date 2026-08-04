create extension if not exists pgcrypto;

create table if not exists public.admin_settings (
  id int primary key,
  password_hash text
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  name text not null default '',
  category text not null default ''
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null default '',
  description text not null default '',
  href text not null default '#projects',
  stack jsonb not null default '[]'::jsonb
);

create table if not exists public.blog_cards (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null default '',
  href text not null default '#',
  cover_image_url text not null default '',
  size_class text not null default 'h-72'
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null default '',
  description text not null default '',
  image_url text not null default '',
  date text not null default ''
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null default '',
  issuer text not null default '',
  date_text text not null default '',
  description text not null default '',
  certificate_url text not null default '' ,
  created_at timestamptz not null default now()
);

alter table public.admin_settings enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.blog_cards enable row level security;
alter table public.events enable row level security;
alter table public.certificates enable row level security;

drop policy if exists "Public can read skills" on public.skills;
create policy "Public can read skills"
  on public.skills for select
  using (true);

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
  on public.projects for select
  using (true);

drop policy if exists "Public can read blog cards" on public.blog_cards;
create policy "Public can read blog cards"
  on public.blog_cards for select
  using (true);

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
  on public.events for select
  using (true);

drop policy if exists "Public can read certificates" on public.certificates;
create policy "Public can read certificates"
  on public.certificates for select
  using (true);

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = excluded.public;
