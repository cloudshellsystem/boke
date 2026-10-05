-- À exécuter dans Supabase > SQL Editor
-- Remplace la version précédente (qui contenait une erreur de syntaxe et laissait
-- un utilisateur pouvoir s'attribuer lui-même le statut Fondateur).
-- Ici : table séparée, lecture de SA propre ligne uniquement, AUCUNE écriture possible via l'API.
-- Tu attribues les statuts toi-même depuis le SQL Editor.

create table if not exists public.member_status (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_founder boolean not null default false,
  is_pro boolean not null default false,
  founder_number integer unique
);

alter table public.member_status enable row level security;

revoke all on public.member_status from anon, authenticated;
grant select on public.member_status to authenticated;

drop policy if exists "Lecture de son propre statut" on public.member_status;
create policy "Lecture de son propre statut"
  on public.member_status for select
  to authenticated
  using (auth.uid() = user_id);

-- Attribuer le statut Fondateur à un membre (remplace l'e-mail) :
-- insert into public.member_status (user_id, is_founder, founder_number)
-- select id, true, 1 from auth.users where email = 'membre@exemple.com'
-- on conflict (user_id) do update set is_founder = true, founder_number = excluded.founder_number;
