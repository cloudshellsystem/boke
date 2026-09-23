-- À exécuter dans Supabase : Project > SQL Editor > New query > Run
-- (utilisez le projet Supabase de Boké One, pas celui de NikahCircle)

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  photographe text not null,
  titre text not null,
  description text,
  prix numeric,
  image_url text not null,
  publiee boolean default true
);

alter table photos enable row level security;

create policy "Photos publiées visibles par tous"
  on photos for select
  using (publiee = true);

create policy "Chacun peut déposer une photo"
  on photos for insert
  with check (true);

-- Bucket de stockage pour les fichiers image eux-mêmes.
-- Ceci ne peut PAS être fait en SQL classique : voir l'étape manuelle
-- ci-dessous, à faire dans l'interface Supabase (Storage), pas ici.
--
-- 1. Menu de gauche > Storage > "New bucket"
-- 2. Nom du bucket : photos
-- 3. Cocher "Public bucket" (pour que les photos soient visibles sans
--    authentification une fois déposées)
-- 4. Create bucket
