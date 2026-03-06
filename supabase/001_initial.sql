-- ============================================================
-- FormJet — Initial Database Migration
-- Supabase SQL Editor'da BU DOSYANIN TAMAMINI çalıştır
-- ============================================================


-- ============================================================
-- 1. TABLES
-- ============================================================

-- profiles: auth.users ile 1-1 ilişki, trigger ile otomatik oluşur
create table if not exists public.profiles (
  id                uuid        not null references auth.users(id) on delete cascade,
  name              text        not null default '',
  email             text        not null default '',
  notification_email text,
  telegram_chat_id  text,
  created_at        timestamptz not null default now(),
  constraint profiles_pkey primary key (id)
);

comment on table public.profiles is
  'User profile data — extends auth.users with notification preferences';

-- forms: kullanıcıların oluşturduğu formlar
create table if not exists public.forms (
  id                    uuid        not null default gen_random_uuid(),
  user_id               uuid        not null references auth.users(id) on delete cascade,
  name                  text        not null,
  slug                  text        not null,
  description           text,
  fields                jsonb       not null default '[]'::jsonb,
  settings              jsonb       not null default '{}'::jsonb,
  notification_channels jsonb       not null default '[]'::jsonb,
  is_active             boolean     not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint forms_pkey         primary key (id),
  constraint forms_slug_unique  unique (slug)
);

comment on column public.forms.fields is
  'Array of FormField objects: [{id, type, label, placeholder, required, options}]';
comment on column public.forms.settings is
  'FormSettings: {theme, primaryColor, backgroundColor, fontFamily, buttonText, successMessage, showBranding}';
comment on column public.forms.notification_channels is
  'Array: [{type:"email",to:""}, {type:"telegram",chatId:""}, {type:"webhook",url:""}]';

-- submissions: form yanıtları
create table if not exists public.submissions (
  id         uuid        not null default gen_random_uuid(),
  form_id    uuid        not null references public.forms(id) on delete cascade,
  data       jsonb       not null default '{}'::jsonb,
  metadata   jsonb       not null default '{}'::jsonb,
  is_read    boolean     not null default false,
  created_at timestamptz not null default now(),
  constraint submissions_pkey primary key (id)
);

comment on column public.submissions.data is
  'Field values keyed by field id: {"field_abc123": "value"}';
comment on column public.submissions.metadata is
  'Request context: {ip, userAgent, referrer}';


-- ============================================================
-- 2. INDEXES
-- ============================================================

-- Forms: sıkça user_id ile filtrelenir
create index if not exists idx_forms_user_id
  on public.forms(user_id);

-- Forms: public form sayfası slug ile bulur
create index if not exists idx_forms_slug
  on public.forms(slug);

-- Forms: aktif formları hızlı bul
create index if not exists idx_forms_is_active
  on public.forms(is_active)
  where is_active = true;

-- Submissions: form_id ile filtreleme
create index if not exists idx_submissions_form_id
  on public.submissions(form_id);

-- Submissions: dashboard'da en yeni önce sıralama
create index if not exists idx_submissions_created_at
  on public.submissions(created_at desc);

-- Submissions: okunmamışları hızlı say
create index if not exists idx_submissions_is_read
  on public.submissions(form_id, is_read)
  where is_read = false;


-- ============================================================
-- 3. FUNCTIONS & TRIGGERS
-- ============================================================

-- Trigger fonksiyonu: yeni kullanıcı kayıt olunca profiles satırını otomatik oluştur.
-- WHY security definer: trigger auth.users tablosuna erişmesi gerekiyor,
-- bu yüzden fonksiyon tanımlayanın (postgres süper kullanıcı) haklarıyla çalışır.
-- WHY ON CONFLICT DO NOTHING: register akışında client tarafı da upsert yapabilir,
-- ikinci deneme sessizce geçişir.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, notification_email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)   -- fallback: email prefix
    ),
    new.email,
    new.email                         -- varsayılan bildirim maili = kayıt maili
  )
  on conflict (id) do nothing;        -- idempotent: çift çalışırsa sorun çıkmaz
  return new;
end;
$$;

-- Trigger'ı her defasında sıfırdan kur (migration yeniden çalışsa da güvenli)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- forms.updated_at otomatik güncelleme
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_forms_updated_at on public.forms;
create trigger trg_forms_updated_at
  before update on public.forms
  for each row
  execute function public.set_updated_at();


-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- RLS'i aktif et — bu olmadan tüm veriler herkese açık olur
alter table public.profiles   enable row level security;
alter table public.forms      enable row level security;
alter table public.submissions enable row level security;


-- ---------- PROFILES ----------

-- Kullanıcı kendi profilini okuyabilir
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Kullanıcı kendi profilini güncelleyebilir
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- INSERT: trigger security definer ile yapılır, RLS bypass eder.
-- Client tarafı insert'e ihtiyaç yoktur — trigger halleder.


-- ---------- FORMS ----------

-- Kullanıcı kendi formlarını okur (dashboard)
create policy "forms_select_own"
  on public.forms
  for select
  using (auth.uid() = user_id);

-- Aktif formlar herkese açık — /f/[slug] sayfası için gerekli
-- WHY ayrı policy: Supabase'de aynı action için birden fazla policy OR mantığıyla çalışır.
-- Kullanıcı kendi deaktif formlarını da görebilir (ilk policy'den),
-- anonim kullanıcı sadece is_active=true olanları görür (bu policy'den).
create policy "forms_select_active_anon"
  on public.forms
  for select
  using (is_active = true);

-- Form oluşturma: sadece kendi user_id'si ile
create policy "forms_insert_own"
  on public.forms
  for insert
  with check (auth.uid() = user_id);

-- Form güncelleme
create policy "forms_update_own"
  on public.forms
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Form silme
create policy "forms_delete_own"
  on public.forms
  for delete
  using (auth.uid() = user_id);


-- ---------- SUBMISSIONS ----------

-- Kullanıcı kendi formlarına gelen yanıtları okur
create policy "submissions_select_own_forms"
  on public.submissions
  for select
  using (
    exists (
      select 1
      from public.forms
      where forms.id = submissions.form_id
        and forms.user_id = auth.uid()
    )
  );

-- is_read güncelleme (okundu/okunmadı toggle)
create policy "submissions_update_own_forms"
  on public.submissions
  for update
  using (
    exists (
      select 1
      from public.forms
      where forms.id = submissions.form_id
        and forms.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.forms
      where forms.id = submissions.form_id
        and forms.user_id = auth.uid()
    )
  );

-- INSERT: Service role key ile yapılır (/api/submit/[slug] route'u).
-- Service role RLS'i bypass eder, ayrı policy gerekmez.
-- WHY: Anonim kullanıcıların doğrudan DB'ye yazmasına izin vermek güvensiz.
-- Tüm validasyon ve rate limiting API route'unda yapılır, sonra service role ile insert.


-- ============================================================
-- 5. REALTIME
-- ============================================================

-- Submissions tablosunu realtime publication'a ekle.
-- Dashboard'daki SubmissionsTable bileşeni buna subscribe olur.
-- WHY sadece submissions: forms tablosunda realtime'a gerek yok.
alter publication supabase_realtime add table public.submissions;


-- ============================================================
-- 6. TEST DATA (opsiyonel — silmek istersen comment out et)
-- ============================================================

-- Migration başarılı mı? Kontrol sorguları:
-- select * from public.profiles;
-- select * from public.forms;
-- select * from public.submissions;
-- select * from information_schema.tables where table_schema = 'public';
