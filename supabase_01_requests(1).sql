-- À exécuter dans Supabase > SQL Editor (une seule fois)
-- Table des besoins déposés depuis la landing page (flux : besoin -> mise en relation).
-- Sécurité : le public peut INSÉRER un besoin, mais personne ne peut le LIRE via l'API publique.
-- Tu lis les besoins depuis le dashboard Supabase (Table Editor) : c'est ton "back-office" MVP.

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  category text not null check (category in ('portrait-corporate','evenementiel','contenu','mariage-naissance','autre')),
  city text not null check (char_length(city) between 2 and 100),
  timing text not null check (timing in ('urgent','ce-mois-ci','prochains-mois','non-defini')),
  budget text check (budget in ('lt-200','200-500','500-1000','gt-1000','non-defini')),
  description text not null check (char_length(description) between 10 and 2000),

  contact_name text not null check (char_length(contact_name) between 2 and 100),
  contact_email text not null check (char_length(contact_email) <= 200 and contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  contact_phone text check (char_length(contact_phone) <= 30),

  consent boolean not null check (consent = true),
  consent_at timestamptz not null default now(),

  -- Origine du trafic (paramètres ?utm_source=... dans les liens Instagram/Pinterest/pubs)
  utm_source text check (char_length(utm_source) <= 100),
  utm_medium text check (char_length(utm_medium) <= 100),
  utm_campaign text check (char_length(utm_campaign) <= 100),

  -- Suivi interne (rempli par toi uniquement, depuis le dashboard)
  status text not null default 'nouvelle' check (status in ('nouvelle','en-cours','mise-en-relation','realisee','perdue')),
  notes_internes text
);

create index if not exists requests_created_at_idx on public.requests (created_at desc);
create index if not exists requests_status_idx on public.requests (status);

alter table public.requests enable row level security;

-- Droits au niveau table : insertion seule pour le public
revoke all on public.requests from anon, authenticated;
grant insert on public.requests to anon, authenticated;

-- Policy d'insertion (PostgreSQL ne supporte pas "create policy if not exists" -> drop puis create)
drop policy if exists "Depot public de besoin" on public.requests;
create policy "Depot public de besoin"
  on public.requests for insert
  to anon, authenticated
  with check (status = 'nouvelle' and notes_internes is null and consent = true);

-- Aucune policy select/update/delete = personne ne lit via l'API publique.

-- ===== KPI (à lancer dans le SQL Editor quand tu veux) =====
-- Besoins par statut :
--   select status, count(*) from public.requests group by 1 order by 2 desc;
-- Besoins par source de trafic :
--   select coalesce(utm_source,'direct') as source, count(*) from public.requests group by 1 order by 2 desc;
-- Taux de mise en relation :
--   select count(*) filter (where status in ('mise-en-relation','realisee'))::float / nullif(count(*),0) from public.requests;
