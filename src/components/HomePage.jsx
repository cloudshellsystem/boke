import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const ACTUALITES_ITEMS = [
  {
    id: 1,
    date: "Novembre 2026",
    title: "Paris Photo Grand Palais — Accréditations Galerie & Presse",
    summary: "Rencontrez les galeristes, acheteurs d'art et éditeurs majeurs au Grand Palais.",
    fullContent: "Boké One organise un parcours réservé à ses membres lors du rendez-vous international de la photographie d'art au Grand Palais. Accès exclusif aux signatures, vernissages privés et rencontres avec les directeurs artistiques.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    alt: "Galerie de photographie d'art au Grand Palais",
  },
  {
    id: 2,
    date: "Décembre 2026",
    title: "Appel à Projets — Curation Nationale & Prix de la Jeune Création",
    summary: "Soumettez vos séries documentaires et portfolios pour la sélection officielle 2027.",
    fullContent: "Le comité d'évaluation Boké One ouvre les dépôts de dossiers pour la prochaine édition nationale. Les lauréats bénéficieront d'une exposition en galerie physique et de mandats auprès des partenaires de presse.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    alt: "Exposition et jury de sélection photographique",
  },
  {
    id: 3,
    date: "Janvier 2027",
    title: "Mise à jour des certifications nationales de l'audiovisuel",
    summary: "Renforcement des protocoles de sécurité pour les tournages en espace public et en milieu aquatique.",
    fullContent: "Dans le cadre de notre démarche d'élite, cette mise à jour intègre de nouvelles normes obligatoires pour tous les prestataires du réseau Boké One intervenant sur le domaine public.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    alt: "Équipe de tournage audiovisuel",
  },
];

const ANNONCES_ITEMS = [
  {
    id: 101,
    date: "OFFRE D'EMPLOI / CASTING",
    title: "Recherche Chef Opérateur & Pilote Drone S1-S3 (Série Docu)",
    summary: "🔒 Offre réservée aux adhérents Élite : Tournage 3 semaines en région PACA à partir de Novembre.",
    fullContent: "Tournage d'une série documentaire de 4 épisodes. Expérience exigée en drone FPV et caméras cinéma grand capteur.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
    alt: "Pilote de drone",
    restricted: true,
  },
  {
    id: 102,
    date: "MISSION PACKSHOT",
    title: "Photographe Studio Luxe — Campagne Horlogerie Paris 8e",
    summary: "🔒 Offre réservée aux adhérents : Shooting 2 jours en studio avec retouche haute définition.",
    fullContent: "Mandat confié par une grande maison horlogère parisienne. Maîtrise des éclairages studio exigée.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    alt: "Photographe packshot studio",
    restricted: true,
  },
];

// Galerie Planche Contact des Créatifs
const PLANCHE_CONTACT_ITEMS =