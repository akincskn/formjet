-- FormJet — Supabase schema
-- Run this entire file in Supabase Dashboard > SQL Editor

-- ─────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────

create table if not exists public.profiles (
  id                 uuid        primary key references auth.users on delete cascade,
  name               text        not null default '',
  email              text        not null default '',
  notification_email text,
  telegram_chat_id   text,
  created_at         timestamptz not null default now()
);

create table if not exists public.forms (
  id                    uuid        primary key default gen_random_uuid(),
  user_id               uuid        not null references auth.users on delete cascade,
  name                  text        not null,
  slug                  text        not null unique,
  description           text,
  fields                jsonb       not null default '[]',
  settings              jsonb       not null default '{}',
  notification_channels jsonb       not null default '[]',
  is_active             boolean     not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table if not exists public.submissions (
  id         uuid        primary key default gen_random_uuid(),
  form_id    uuid        not null references public.forms on delete cascade,
  data       jsonb       not null default '{}',
  metadata   jsonb       not null default '{}',
  is_read    boolean     not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────

create index if not exists forms_user_id_idx       on public.forms (user_id);
create index if not exists forms_slug_idx          on public.forms (slug);
create index if not exists submissions_form_id_idx on public.submissions (form_id);
create index if not exists submissions_created_idx on public.submissions (created_at desc);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

alter table public.profiles   enable row level security;
alter table public.forms      enable row level security;
alter table public.submissions enable row level security;

-- profiles: users manage only their own row
create policy "profiles: own row"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- forms: users manage only their own forms
create policy "forms: own forms"
  on public.forms for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- forms: anyone can SELECT active forms (needed for public form page)
create policy "forms: public read active"
  on public.forms for select
  using (is_active = true);

-- submissions: users can read/update submissions for their forms
create policy "submissions: owner access"
  on public.submissions for all
  using (
    exists (
      select 1 from public.forms
      where id = form_id and user_id = auth.uid()
    )
  );

-- NOTE: Submission INSERT is done via the service_role key in the API route,
-- which bypasses RLS entirely. No anon INSERT policy is needed.

-- ─────────────────────────────────────────────
-- TRIGGER: auto-create profile on signup
-- ─────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
