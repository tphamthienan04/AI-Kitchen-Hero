-- ================================================================
-- Kitchen Hero — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ================================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";

-- ── 1. Fridge Items ─────────────────────────────────────────────
create table if not exists fridge_items (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  category     text not null check (category in ('protein','vegetable','fruit','dairy','grain','condiment','beverage','other')),
  quantity     text not null default '1',
  unit         text,
  expiry_date  date,
  emoji        text not null default '📦',
  added_via    text not null default 'manual' check (added_via in ('manual','scan_fridge','scan_receipt')),
  created_at   timestamptz not null default now()
);

alter table fridge_items enable row level security;

create policy "Users can CRUD their own fridge items"
  on fridge_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index on fridge_items (user_id, expiry_date);

-- ── 2. Recipes ──────────────────────────────────────────────────
create table if not exists recipes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  description   text,
  ingredients   jsonb not null default '[]',
  steps         jsonb not null default '[]',
  cuisine       text,
  prep_time_min integer not null default 0,
  cook_time_min integer not null default 0,
  servings      integer not null default 2,
  difficulty    text not null default 'easy' check (difficulty in ('easy','medium','hard')),
  tags          text[] default '{}',
  image_url     text,
  ai_generated  boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table recipes enable row level security;

create policy "Users can CRUD their own recipes"
  on recipes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index on recipes (user_id, created_at desc);


-- ── 3. User profiles (auto-created on signup) ───────────────────
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  avatar_url   text,
  preferences  jsonb default '{}',
  created_at   timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read and update their own profile"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


------------------4. User activity Log──────────────────────────────────────────────
create table if not exists user_activities (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  action       text not null, -- ví dụ: 'SCAN_FRIDGE', 'ADD_MANUAL', 'GENERATE_RECIPE'
  metadata     jsonb default '{}',
  created_at   timestamptz not null default now()
);

alter table user_activities enable row level security;

create policy "Users can read their own activities"
  on user_activities for select
  using (auth.uid() = user_id);

-- Chỉ cho phép insert (không cho sửa/xóa log)
create policy "Users can insert their own activities"
  on user_activities for insert
  with check (auth.uid() = user_id);