-- À exécuter dans Supabase  SQL Editor
-- Objectif  Créer la table des créatifs avec modération (statut 'pending' par défaut)
-- pour que les inscriptions nécessitent ta validation avant d'apparaître publiquement.

create table if not exists public.creatifs (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'text, now()) not null,
    name text not null,
    role text not null,
    city text not null,
    specialty text,
    equipment text,
    status text not null default 'pending' -- 'pending' (en attente) ou 'approved' (validé par l'admin)
);

-- Active la sécurité au niveau des lignes (RLS)
alter table public.creatifs enable row level security;

-- Nettoyage des anciennes politiques si elles existent
drop policy if exists Lecture publique des créatifs approuvés on public.creatifs;
drop policy if exists Insertion publique des créatifs on public.creatifs;

-- 1. Politique de lecture  Le public ne voit QUE les créatifs dont le statut est 'approved'
create policy Lecture publique des créatifs approuvés
    on public.creatifs for select
    using (status = 'approved');

-- 2. Politique d'insertion  N'importe quel visiteur peut soumettre son profil (qui arrive en 'pending')
create policy Insertion publique des créatifs
    on public.creatifs for insert
    with check (true);

-- ===== COMMENT VALIDER UN CRÉATIF (Rappel Admin) =====
-- Pour valider un profil depuis ton dashboard Supabase (Table Editor  creatifs) 
-- update public.creatifs set status = 'approved' where id = 'uuid-du-creatif';