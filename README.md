Boké One — L'Annuaire de Référence des Créatifs (MVP)

Boké One est la plateforme professionnelle de mise en relation et de vitrine dédiée aux créatifs de niche (photographes, plasticiens, artisans d'art, réplicateurs de toiles anciennes, etc.), combinant les forces d'un réseau professionnel, d'un portfolio interactif et d'un annuaire de référence. L'application repose sur une stack moderne et sécurisée : React (Vite), Supabase (PostgreSQL) et Vercel.
Philosophie & Vision (Zéro Hallucination)

    Intégrité de la marque : Pas de simulation de paiement ou de fausses fonctionnalités trompeuses pour préserver la confiance absolue de la communauté.

    Programme Early Adopters : Un accès bêta privé et des conditions privilégiées sur-mesure sont réservés aux 95 premiers abonnés fondateurs (badges exclusifs, avantages permanents sur les commissions).

Structure et Installation en Local

    Cloner le projet sur votre poste de travail.

    Installer les dépendances nécessaires via le terminal :
    Bash

    npm install

    Configurer le fichier d'environnement à la racine (.env) en y renseignant vos clés de connexion sécurisées (attention à ne jamais versionner ce fichier) :

        VITE_SUPABASE_URL

        VITE_SUPABASE_ANON_KEY

    Lancer l'environnement de développement en local :
    Bash

    npm run dev

Configuration et Migration Supabase

    Base de données : Rendez-vous dans le tableau de bord Supabase, ouvrez l'éditeur SQL (SQL Editor), puis collez et exécutez le script du schéma global (supabase-schema.sql) ainsi que la migration dédiée aux comptes fondateurs.

    Stockage des fichiers : Créez un nouveau bucket de stockage nommé photos en veillant à l'activer en mode Public bucket pour permettre l'affichage des portfolios.

    Sécurité (RLS) : Assurez-vous que les politiques de sécurité Row Level Security (RLS) sont actives sur l'ensemble des tables relationnelles de la base de données.

Architecture du Projet

    src/components/ : Contient les composants modulaires et les pages clés de l'application (ex. : Creatifspage.jsx, Uploadform.jsx, Premiumpage.jsx).

    src/pages/ : Vues et gabarits principaux de navigation.

    Fichiers de configuration racine : vite.config.js, vercel.json et le schéma de base de données supabase-schema.sql.

Déploiement en Production (Vercel)

    Connectez votre dépôt Git à la plateforme Vercel.

    Configurez les variables d'environnement de production (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY) dans les paramètres du projet.

    Validez le déploiement continu.