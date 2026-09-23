# Boké One — MVP dépôt de photos

Application réelle (React + Supabase) : un photographe dépose une photo (fichier +
titre + prix optionnel), elle apparaît immédiatement dans la galerie publique.

## Installation

```
npm install
npm run dev
```

Sans configuration Supabase, l'app tourne avec une photo de démonstration à la place
d'une vraie galerie.

## Configurer Supabase (votre projet existant)

1. **Base de données** : SQL Editor → coller le contenu de `supabase-schema.sql` → Run.
   Cela crée la table `photos`.
2. **Stockage des fichiers** (obligatoire, ne se fait PAS en SQL) :
   - Menu de gauche → **Storage** → **New bucket**
   - Nom : `photos`
   - Cocher **Public bucket**
   - Create bucket
3. **Clés de connexion** : Project Settings → API → copier Project URL et la clé
   `anon public`.
4. Créer un fichier `.env` (copie de `.env.example`) avec ces deux valeurs.
5. Relancer `npm run dev`.

## Tester

Cliquez sur "+ Déposer une photo" dans l'app, remplissez le formulaire, envoyez un
fichier image. Elle doit apparaître dans la galerie juste en dessous, et dans
Supabase : Table Editor → `photos` (la ligne) + Storage → `photos` (le fichier).

## Ce qui manque avant un vrai lancement

- Authentification (actuellement n'importe qui peut déposer une photo sous n'importe
  quel nom — pas de compte réel).
- Paiement réel si vous voulez vendre les photos (le champ prix n'est qu'informatif
  pour l'instant, aucune intégration de paiement).
- Modération des dépôts avant publication.

## Déployer sur Vercel

Même procédure que pour NikahCircle : compte Vercel, connecter le dossier, ajouter
les deux variables d'environnement dans les réglages du projet, déployer.
