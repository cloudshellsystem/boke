# Rendre le paiement réel — ce qu'il reste à faire

Je n'ai pas codé de solution "clé en main" ici, volontairement : un vrai paiement Stripe
nécessite ta clé secrète Stripe et un backend (une Edge Function Supabase), que je ne peux
pas configurer à ta place sans savoir si tu as déjà un compte Stripe. Voici le plan exact.

## Architecture recommandée (MVP, la plus rapide à mettre en place)

1. **Créer un compte Stripe** (si pas déjà fait) → mode Test d'abord.
2. **Créer une Supabase Edge Function** `create-checkout-session` qui :
   - reçoit l'id de la photo + son prix,
   - appelle l'API Stripe (`stripe.checkout.sessions.create`) avec ta clé secrète
     (stockée en variable d'environnement Supabase, jamais côté client),
   - renvoie l'URL de paiement Stripe Checkout.
3. **Dans `Gallery.jsx`**, remplacer le bloc `paymentStep === "stripe"` actuel
   (le faux formulaire de carte simulé) par un simple bouton qui appelle cette
   Edge Function puis redirige (`window.location.href = url`) vers la vraie page
   Stripe Checkout — hébergée par Stripe, donc PCI-DSS géré par eux, zéro donnée
   carte qui transite par ton code.
4. **Webhook Stripe** → Edge Function `stripe-webhook` qui écoute l'évènement
   `checkout.session.completed` et débloque le lien HD / marque la vente en base.

## Pourquoi pas PayPal en plus, pour le MVP ?

Un seul moyen de paiement (Stripe Checkout) suffit pour valider le concept.
Ajouter PayPal double la charge d'intégration pour un gain de conversion
marginal à ce stade — à ajouter uniquement si des clients le demandent explicitement.

## Ce que je peux faire ensuite

Si tu confirmes que tu as (ou vas créer) un compte Stripe, je te rédige le code complet
de l'Edge Function + le patch de `Gallery.jsx` prêt à déployer.
