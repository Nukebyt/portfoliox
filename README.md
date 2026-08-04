This repository is a personal portfolio webapp built with Next.js (App Router) + TypeScript + Tailwind.

What it does
- Public site: renders a hero, education, skills, projects, blog links, and contact sections. Content comes from Supabase when configured, with a local fallback for development.
- Admin UI: password-protected admin editor at `/admin` to update skills, projects, blog cards and upload images to Supabase storage. The public site does not show an admin button.
- Authentication: admin uses a hashed password stored in Supabase (`admin_settings` table). Sessions are short-lived HMAC-signed tokens stored in an HTTP-only cookie.
- Uploads: images are uploaded to a Supabase storage bucket and served by the public URL.

Important first step
- Before the app can use Supabase, run [`supabase/setup.sql`](supabase/setup.sql) once in the Supabase SQL editor.
- That file creates the required tables, enables row-level security, adds read policies, and creates the public `portfolio-images` storage bucket.
- Without that SQL run, the app will fall back to local content and the admin page will not be able to persist changes.

Getting started (development)
1. Copy `.env.example` to `.env.local` and fill values (see below).
2. Install dependencies:

```bash
cd /Users/priyanshukumarjha/Code/bhadwa/portfolio-app
npm install
```

3. Run dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

Environment variables
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key
- `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` — bucket name for public images
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-only, keep secret)
- `ADMIN_SESSION_SECRET` — 32+ char secret used to sign admin session tokens
- `ADMIN_COOKIE_NAME` — cookie name (optional)
- `ADMIN_COOKIE_MAX_AGE_SECONDS` — session lifetime
- `NEXT_PUBLIC_FORMSPREE_ACTION` — Formspree action URL for contact form
- `NEXT_PUBLIC_CONTACT_EMAIL` — contact target email

Database / Supabase schema (SQL)
The canonical bootstrap script is [`supabase/setup.sql`](supabase/setup.sql). Run it once in the Supabase SQL editor to initialize the project.

If you need to understand what it creates, the file includes the same essentials listed below.

Create admin settings (store password hash):

```sql
create table if not exists admin_settings (
	id int primary key,
	password_hash text not null
);

-- Insert a record with id=1 and a generated password_hash.
```

Create the content tables used by the admin API:

```sql
create table if not exists skills (
	id uuid primary key default gen_random_uuid(),
	sort_order int not null default 0,
	name text not null default '',
	category text not null default ''
);

create table if not exists projects (
	id uuid primary key default gen_random_uuid(),
	sort_order int not null default 0,
	title text not null default '',
	description text not null default '',
	href text not null default '#projects',
	stack jsonb not null default '[]'::jsonb
);

create table if not exists blog_cards (
	id uuid primary key default gen_random_uuid(),
	sort_order int not null default 0,
	title text not null default '',
	href text not null default '#',
	cover_image_url text not null default '',
	size_class text not null default 'h-72'
);

create table if not exists events (
	id uuid primary key default gen_random_uuid(),
	sort_order int not null default 0,
	title text not null default '',
	description text not null default '',
	image_url text not null default '',
	date text not null default ''
);
```

Create a public Supabase storage bucket matching `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` for uploaded images.

If you prefer to apply the schema manually, use the same table definitions from `supabase/setup.sql` and keep the bucket name aligned with `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`.

Create the admin password
1. Visit `/admin` after the Supabase env vars and `admin_settings` table are ready.
2. If no password hash exists yet, the page asks you to create the first admin password.
3. Later visits to `/admin` ask for that same password and verify it against the stored hash.

If the first-run flow does not work, it usually means `supabase/setup.sql` was not run or the `admin_settings` row was deleted.

Optional manual password hash
1. Use the included helper to generate a compatible hash:

```bash
cd /Users/priyanshukumarjha/Code/bhadwa/portfolio-app
npm run admin:hash
```

2. The script prints a `pbkdf2_sha256`-formatted hash. Insert it into `admin_settings` with `id=1` and column `password_hash` if you prefer to seed the password manually instead of using first-run setup.

Example SQL:

```sql
insert into admin_settings (id, password_hash) values (1, 'pbkdf2_sha256$310000$...')
on conflict (id) do update set password_hash = excluded.password_hash;
```

Security notes
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret and never commit `.env.local`.
- Use a strong `ADMIN_SESSION_SECRET` (32+ characters).
- First-run admin setup is intentionally available only while `admin_settings.id=1` has no `password_hash`; do not delete that row in production.
- Middleware enforces security headers across the app, including CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, and production HSTS.
- Admin login has in-process rate limiting and same-origin checks. For multi-instance production hosting, add platform-level rate limiting/WAF because in-memory counters are per runtime instance.
- Admin content saves validate collection names, item counts, URLs, text lengths, and size classes before replacing table rows.
- Admin uploads are restricted to the configured bucket, allowed image types, generated storage paths, and a 5 MB max file size.
- Dependency overrides pin transitive `postcss` and `sharp` versions to patched releases; keep them until the installed Next.js version no longer needs them.

Build & deploy

Use the included webpack build flag for macOS ARM stability:

```bash
npm run build
npm start
```

Where to edit content
- Admin UI: `/admin` (password protected). Use the editor to edit skills/projects and upload images.

Support
- If you need help setting up Supabase tables or inserting the admin password, open an issue describing your Supabase project and I can provide exact SQL and commands.
