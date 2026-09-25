-- À exécuter dans Supabase > SQL Editor
-- Objectif : remplacer le mot de passe en dur de PremiumPage.jsx par un vrai statut membre,
-- et poser la base du programme "Membres Fondateurs" (tes 95 premiers abonnés Instagram).

-- 1. Ajout des colonnes de statut sur la table profiles (adapte le nom de table si le tien diffère)
alter table profiles
  add column if not exists is_founder boolean default false,
  add column if not exists is_pro boolean default false,
  add column if not exists founder_number integer; -- ex: 1 à 100, pour afficher "Fondateur #12"

-- 2. Activer la Row Level Security si ce n'est pas déjà fait
alter table profiles enable row level security;

-- 3. Policy : tout le monde peut LIRE les profils publics (annuaire CreatifsPage)
create policy if not exists "Profils publics lisibles par tous"
  on profiles for select
  using (true);

-- 4. Policy : un utilisateur ne peut modifier QUE son propre profil,
--    et ne peut PAS s'auto-attribuer is_founder / is_pro (ces colonnes sont réservées à l'admin)
create policy if not exists "Un utilisateur modifie uniquement son propre profil"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
-- ⚠️ Cette policy protège la lecture/écriture générale, mais PostgreSQL RLS ne restreint pas
-- colonne par colonne par défaut. Pour empêcher un utilisateur de passer is_founder à true
-- lui-même via l'API, il faut soit :
--   a) gérer is_founder/is_pro uniquement depuis le dashboard Supabase (SQL manuel), OU
--   b) créer une fonction Postgres SECURITY DEFINER dédiée, appelée uniquement par toi (admin).
-- Recommandation MVP : option (a), le plus simple et le plus sûr tant que le volume est faible (95 abonnés).

-- 5. Pour activer manuellement un Fondateur (à faire toi-même, un par un, au début) :
-- update profiles set is_founder = true, founder_number = 1 where id = 'uuid-du-user';
