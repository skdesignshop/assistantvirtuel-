# LE DESIGNER — Telegram Mini App

Application complète : Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase + Telegram WebApp API.

## ✅ Ce qui est réellement fonctionnel dans ce code

- **Auth Telegram côté serveur** : vérification HMAC-SHA256 de `initData` (`lib/telegram-auth.ts`) — aucune donnée utilisateur n'est jamais acceptée sans cette vérification.
- **Création/mise à jour automatique du profil** en base à chaque ouverture (`app/api/auth/telegram/route.ts`).
- **Système de fidélité** avec fonction Postgres atomique (`redeem_loyalty_code` dans `supabase/schema.sql`) qui empêche la double-utilisation d'un même code, même en cas de requêtes simultanées.
- **Génération de codes sécurisée**, réservée aux Telegram ID listés dans `ADMIN_TELEGRAM_IDS`.
- **Espace admin protégé côté serveur** (`lib/require-admin.ts`) : même si quelqu'un accède à `/admin/*` dans le navigateur, aucune route API n'accepte ses requêtes s'il n'est pas admin.
- **Assistant IA connecté à un vrai fournisseur** (Anthropic par défaut), historique de conversation stocké et rechargé depuis Supabase, prompt système externalisé et modifiable sans redéploiement (`lib/ai-provider.ts`).
- **Globe 3D interactif** (React Three Fiber) avec marqueurs de villes cliquables, positions calculées depuis lat/lng réelles.
- **Statistiques admin** calculées en direct depuis Supabase (utilisateurs, activité, fidélité, villes, avis) avec graphique.
- **CRUD complet villes et avis** depuis l'admin.
- **Analytics** : tous les événements listés dans le prompt (`app_open`, `assistant_open`, `loyalty_code_success`, etc.) sont enregistrés en base.

## ⚠️ Ce qui reste à brancher (informations que tu dois fournir)

| Élément | Où | Action |
|---|---|---|
| Projet Supabase | `.env.local` | Créer un projet sur supabase.com, exécuter `supabase/schema.sql` dans le SQL Editor, copier l'URL + la clé `service_role` |
| Bot Telegram | `.env.local` | Créer un bot via [@BotFather](https://t.me/BotFather), copier le token, configurer le bouton Mini App avec l'URL de ton déploiement |
| Ton Telegram ID (admin) | `.env.local` | Récupérer ton ID via [@userinfobot](https://t.me/userinfobot), le mettre dans `ADMIN_TELEGRAM_IDS` |
| Clé IA | `.env.local` | Clé API Anthropic (ou autre fournisseur — voir `lib/ai-provider.ts` pour en ajouter un) |
| System prompt de l'assistant | `.env.local` (`ASSISTANT_SYSTEM_PROMPT`) ou `lib/ai-provider.ts` | Coller tes services, tarifs, règles une fois que tu me les donnes |
| Modèle 3D du personnage | `public/assets/character/character.glb` | Un avatar 2D placeholder (masque + maillot vert) est utilisé en attendant ; voir `components/character/Character.tsx` pour l'instruction de bascule |
| Villes définitives, logos, avis | Espace admin (`/admin/villes`, `/admin/avis`) | Tout est gérable sans toucher au code une fois déployé |

## 🚀 Déploiement

```bash
# 1. Installer les dépendances
npm install

# 2. Copier et remplir les variables d'environnement
cp .env.example .env.local
# → éditer .env.local avec tes vraies valeurs

# 3. Lancer le schéma Supabase
# Copier/coller le contenu de supabase/schema.sql dans
# Supabase Dashboard > SQL Editor > New query > Run

# 4. Lancer en local
npm run dev

# 5. Déployer (Vercel recommandé avec Next.js)
# - Push ce repo sur GitHub
# - Importer le projet sur vercel.com
# - Renseigner les mêmes variables d'environnement dans Vercel
# - Récupérer l'URL de déploiement (https://ton-projet.vercel.app)

# 6. Configurer le bouton Mini App dans @BotFather
# /mybots > ton bot > Bot Settings > Menu Button > coller l'URL Vercel
```

## 📁 Architecture

```
app/
  (app)/accueil, assistant, villes, fidelite   → pages utilisateur
  (admin)/admin/*                              → espace admin (protégé)
  api/auth, loyalty, admin, assistant,
      cities, testimonials, analytics          → routes serveur sécurisées
components/
  character/    → personnage 3D (remplaçable)
  globe/        → globe 3D des villes
  loyalty/      → carte de fidélité
  admin/        → garde-fou + navigation admin
  navigation/   → nav mobile
lib/
  telegram-auth.ts      → vérification HMAC initData (sécurité critique)
  telegram-client.ts    → SDK Telegram côté client
  require-admin.ts      → garde-fou serveur pour les routes admin
  supabase-server.ts    → client Supabase (service_role, serveur uniquement)
  ai-provider.ts        → abstraction fournisseur IA
supabase/
  schema.sql            → tables, RLS, fonction atomique de fidélité
types/
  index.ts              → types partagés
```

## 🔒 Sécurité — points clés

- La clé `service_role` Supabase et la clé IA ne sont **jamais** exposées au frontend : elles ne sont lues que dans des fichiers serveur (`route.ts`, jamais `"use client"`).
- Le statut admin est recalculé côté serveur à **chaque** authentification à partir de `ADMIN_TELEGRAM_IDS` — un utilisateur ne peut jamais se l'auto-attribuer.
- L'utilisation d'un code de fidélité passe par une fonction Postgres avec verrou de ligne (`for update`), donc deux requêtes simultanées avec le même code ne peuvent pas toutes les deux réussir.
- RLS est activé sur toutes les tables ; aucune écriture n'est possible depuis le frontend, même avec la clé publique `anon`.

## Prochaines infos à me donner pour continuer

1. Les villes exactes (avec logos/images)
2. Les avis clients réels
3. Les tarifs, services et règles pour le system prompt de l'assistant
4. Le modèle 3D définitif du personnage (fichier `.glb`) ou des images de référence supplémentaires
5. Le choix définitif du fournisseur IA si ce n'est pas Anthropic
