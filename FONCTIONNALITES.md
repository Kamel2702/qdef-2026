# Q-DEF 2026 — Résumé des fonctionnalités

## Site public

- **Homepage** dynamique avec 9 sections configurables (masquables)
- **Programme** avec filtres par type (keynote, panel, workshop...)
- **Agenda** interactif avec vue timeline + vue grille, code couleur par type
- **Speakers** avec navigation par flèches + grille complète
- **About** avec mission, objectifs, thèmes, profils cibles
- **Venue** avec carte Google Maps, infos transport, hôtels
- **Gallery** avec grille photo, filtres par catégorie, lightbox plein écran
- **Registration** via formulaire interne OU redirection Weezevent/Eventbrite
- **Contact** avec formulaire + envoi de messages
- **Newsletter** inscription depuis le site
- **Pages personnalisées** illimitées avec éditeur par blocs
- **Page "Coming Soon"** pour les pages masquées
- **Design responsive** (mobile, tablette, desktop)
- **Countdown** en temps réel vers la date de l'événement
- **Design dynamique** : couleurs, polices, layout chargés depuis la config

## Panel d'administration

### Gestion de contenu (CRUD complet)

| Entité | Créer | Lire | Modifier | Supprimer |
|--------|-------|------|----------|-----------|
| Sessions/Programme | X | X | X | X |
| Speakers | X | X | X | X |
| Sponsors | X | X | X | X |
| Exhibitions | X | X | X | X |
| News/Blog | X | X | X | X |
| Gallery | X | X | X | X |
| Pages personnalisées | X | X | X | X |
| Registrations | - | X | X | X |
| Contacts | - | X | X | X |
| Newsletter | - | X | X | X |
| Admins | X | X | X | X |
| Pages (Home, About, Venue) | - | X | X | - |
| Config/Settings | - | X | X | - |

### Visibilité

- **Pages** : masquer/afficher 8 pages du menu (Programme, Speakers, About, Venue, Register, Contact, Agenda, Gallery)
- **Sections homepage** : 9 toggles ON/OFF (Hero, Stats, About, Exhibitions, Programme, CTA, Themes, Final CTA, Partners)
- **Toggles inline** : chaque section a un toggle Visible/Masqué directement dans son header de config

### Billetterie externe

- Champ "Ticket URL" dans Settings
- Si configuré, tous les boutons Register/Tickets redirigent vers le lien externe (Weezevent, Eventbrite...)
- Ouvre dans un nouvel onglet

### Éditeur de design

- **7 presets de couleurs** en 1 clic avec sauvegarde automatique
- **11 couleurs personnalisables** avec color picker
- **Typographie** : 13 polices + Google Fonts custom + taille + graisse
- **Layout** : border radius boutons/cartes, largeur max, espacement
- **CSS custom** avancé
- **Preview en direct**

### Contenu configurable

- Logo (image uploadée ou texte fallback)
- Images de fond (hero, CTA sections, cartes thématiques)
- Tous les titres, sous-titres, descriptions de chaque section
- Stats (attendees, speakers, sessions, tracks, nations)
- Theme pills, liste de partenaires, textes de boutons
- Footer complet (tagline, description, contact, copyright, réseaux sociaux)

### Pages personnalisées

- Créer des pages illimitées avec titre, URL, image hero
- Éditeur de contenu par blocs : Texte, Image, Bouton CTA
- Blocs réordonnables (↑↓) et supprimables
- Toggle affichage dans le menu de navigation
- Ordre dans le menu configurable
- Publication / Brouillon

### Galerie photos

- Upload de photos avec drag & drop ou URL
- Catégories : general, conference, networking, speakers, venue, exhibition
- Légendes, ordre d'affichage, publier/masquer
- Page publique avec filtres et lightbox

### Agenda interactif

- Vue timeline verticale avec code couleur par type de session
- Vue grille avec cartes
- Détails extensibles (description, speakers, lieu)

### Upload d'images

- **Supabase Storage** (cloud CDN) — fonctionne sur Netlify
- Drag & drop ou URL
- JPG, PNG, GIF, WebP, SVG — max 5 MB
- Utilisé partout : speakers, sponsors, news, exhibitions, gallery, logo, backgrounds

### Aide intégrée

- Page `/admin/help` avec recherche Q&A (31 questions/réponses)
- Manuel complet consultable en ligne (19 chapitres)
- Téléchargement Word du manuel
- Tags de recherche rapide

### Fonctionnalités additionnelles

- **Export CSV** des inscriptions et newsletter
- **Drag & drop** pour réordonner les sessions du programme
- **Publication/brouillon** pour articles et pages
- **Statuts de contact** (New, Read, Replied, Archived)
- **Protection auto-suppression** admin
- **Authentification JWT** sécurisée (24h)
- **ConfigContext partagé** (1 seul fetch config pour tout le site)
- **Responsive** complet (mobile, tablette, desktop)

## Stack technique

- **Frontend** : React 18 + Vite + React Router
- **Backend** : Express.js + Supabase (PostgreSQL)
- **Storage** : Supabase Storage (CDN cloud)
- **Auth** : JWT (24h)
- **Hébergement** : Netlify (serverless functions)
- **Design** : CSS custom properties (tokens dynamiques)
