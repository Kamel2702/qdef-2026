# Q-DEF 2026 — Résumé des fonctionnalités

## Site public

- **Homepage** dynamique avec 9 sections configurables
- **Programme** avec filtres par type (keynote, panel, workshop...)
- **Speakers** avec navigation par flèches + grille complète
- **About** avec mission, objectifs, thèmes, profils cibles
- **Venue** avec carte Google Maps, infos transport, hôtels
- **Registration** avec formulaire complet + email de confirmation
- **Contact** avec formulaire + envoi de messages
- **Newsletter** inscription depuis le site
- **Page "Coming Soon"** pour les pages masquées
- **Design responsive** (mobile, tablette, desktop)
- **Countdown** en temps réel vers la date de l'événement

## Panel d'administration

### Gestion de contenu (CRUD complet)

| Entité | Créer | Lire | Modifier | Supprimer |
|--------|-------|------|----------|-----------|
| Sessions/Programme | X | X | X | X |
| Speakers | X | X | X | X |
| Sponsors | X | X | X | X |
| Exhibitions | X | X | X | X |
| News/Blog | X | X | X | X |
| Registrations | - | X | X | X |
| Contacts | - | X | X | X |
| Newsletter | - | X | X | X |
| Admins | X | X | X | X |
| Pages (Home, About, Venue) | - | X | X | - |
| Config/Settings | - | X | X | - |

### Visibilité des pages

- Masquer/afficher chaque page du menu (Programme, Speakers, About, Venue, Register, Contact)
- Pages masquées = retirées du menu + affichent "Coming Soon"

### Visibilité des sections homepage

- 9 toggles ON/OFF : Hero, Stats, About, Exhibitions, Programme, CTA, Themes, Final CTA, Partners

### Éditeur de design (style Wix)

- **7 presets de couleurs** en 1 clic (Teal, Blue, Purple, Green, Dark, Corporate, Rose)
- **11 couleurs personnalisables** avec color picker
- **Typographie** : 13 polices + Google Fonts custom + taille + graisse
- **Layout** : border radius, largeur max, espacement
- **CSS custom** pour du code avancé
- **Preview live** des changements

### Contenu entièrement configurable

- Logo (image uploadée ou texte)
- Image de fond du hero
- Tous les titres, sous-titres, descriptions de chaque section
- Images des cartes thématiques
- Image de fond du CTA
- Liste des partenaires
- Stats (attendees, speakers, sessions, tracks, nations)
- Footer (tagline, description, contact, copyright, réseaux sociaux)
- Texte de tous les boutons

### Fonctionnalités supplémentaires

- **Upload d'images** drag & drop (ou URL) pour photos, logos, fonds
- **Export CSV** des inscriptions et newsletter
- **Recherche** dans les inscriptions et newsletter
- **Drag & drop** pour réordonner les sessions du programme
- **Publication/brouillon** pour les articles de blog
- **Statuts de contact** (New, Read, Replied, Archived)
- **Protection auto-suppression** admin
- **Authentification JWT** sécurisée

## Stack technique

- **Frontend** : React 18 + Vite + React Router
- **Backend** : Express.js + Supabase (PostgreSQL)
- **Auth** : JWT (24h)
- **Hébergement** : Netlify (serverless functions)
- **Design** : CSS custom properties (tokens dynamiques)
