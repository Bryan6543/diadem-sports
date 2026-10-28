-- Diadem Sri Lanka showcase — initial schema.
-- Row-level security is ON for every table with NO public policies:
-- only the server (service-role key) can read or write.

create extension if not exists pgcrypto;

-- Products ------------------------------------------------------------------
create table if not exists public.products (
  id                text primary key,
  slug              text not null unique,
  name              text not null,
  category          text not null,
  type              text not null default '',
  sport             text not null default 'all',
  short_description text not null default '',
  description       jsonb not null default '[]'::jsonb,
  features          jsonb not null default '[]'::jsonb,
  specs             jsonb not null default '[]'::jsonb,
  included          jsonb not null default '[]'::jsonb,
  ideal_for         jsonb not null default '[]'::jsonb,
  technologies      text[] not null default '{}',
  price             numeric(12,2) not null default 0,
  compare_at_price  numeric(12,2),
  in_stock          boolean not null default true,
  variants          jsonb not null default '[]'::jsonb,
  images            jsonb not null default '[]'::jsonb,
  retailer_handle   text not null default '',
  retailer_url      text not null default '',
  featured          boolean not null default false,
  featured_rank     integer,
  spotlight         boolean not null default false,
  published         boolean not null default true,
  tags              text[] not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_published_idx on public.products (published);
alter table public.products enable row level security;

-- Newsletter subscribers ----------------------------------------------------
create table if not exists public.subscribers (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null,
  name               text,
  source             text not null default 'footer',
  status             text not null default 'active' check (status in ('active', 'unsubscribed')),
  unsubscribe_token  uuid not null default gen_random_uuid(),
  resend_contact_id  text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create unique index if not exists subscribers_email_key on public.subscribers (lower(email));
create unique index if not exists subscribers_token_key on public.subscribers (unsubscribe_token);
alter table public.subscribers enable row level security;

-- Site image overrides (missing row = bundled default) ----------------------
create table if not exists public.site_images (
  key        text primary key,
  src        text not null default '',
  alt        text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.site_images enable row level security;

-- Rate limiting shared across serverless instances --------------------------
create table if not exists public.rate_limits (
  key          text primary key,
  count        integer not null default 0,
  window_start timestamptz not null default now()
);
alter table public.rate_limits enable row level security;

create or replace function public.hit_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.rate_limits as r (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set count = case when r.window_start < now() - make_interval(secs => p_window_seconds) then 1 else r.count + 1 end,
        window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds) then now() else r.window_start end
  returning count into v_count;
  return v_count <= p_limit;
end;
$$;
revoke all on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, integer, integer) to service_role;

-- Public storage buckets for photos (uploads happen server-side only) -------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true), ('site-images', 'site-images', true)
on conflict (id) do nothing;
