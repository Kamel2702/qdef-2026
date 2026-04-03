# Manuel d'utilisation — Q-DEF Admin

## Connexion

1. Aller sur **votre-site.netlify.app/admin/login**
2. Email : `admin@qdef.lu`
3. Mot de passe : `admin123`

---

## Dashboard

Vue d'ensemble avec les compteurs : inscriptions, speakers, sessions, sponsors, articles, messages, newsletter, exhibitions.

---

## Gestion du contenu

### Programme (`/admin/programme`)

- **Ajouter une session** : cliquer sur "+ Add Session"
- **Modifier** : cliquer sur "Edit" dans la ligne
- **Supprimer** : cliquer sur "Delete"
- **Réordonner** : glisser-déposer les lignes pour changer l'ordre
- Champs : titre, description, type (keynote, panel, workshop, fireside, break), horaires, speakers, tags, lieu

### Speakers (`/admin/speakers`)

- **Ajouter** : "+ Add Speaker"
- **Modifier / Supprimer** : boutons dans le tableau
- Champs : nom, titre/poste, organisation, bio, photo (upload ou URL)
- Navigation par flèches sur la page publique

### Registrations (`/admin/registrations`)

- **Voir** toutes les inscriptions avec recherche
- **Modifier** : cliquer sur "Edit" pour changer les infos
- **Supprimer** : cliquer sur "Delete"
- **Exporter** : "Export CSV" pour télécharger la liste
- Champs : prénom, nom, organisation, poste, email, pays, régime alimentaire, accessibilité

### Sponsors (`/admin/sponsors`)

- CRUD complet : ajouter, modifier, supprimer
- Champs : nom, tier (Gold, Silver, Platinum...), logo (upload), site web, description, ordre

### Exhibitions (`/admin/exhibitions`)

- Les stands d'exposition affichés sur la homepage
- Champs : nom, description, image, tag, site web, ordre
- Remplacent la liste codée en dur sur la homepage

### News & Blog (`/admin/news`)

- Créer des articles avec titre, contenu, image de couverture et slug
- **Publier / Dépublier** : toggle pour mettre en ligne ou en brouillon

### Contacts (`/admin/contacts`)

- Messages reçus via le formulaire de contact
- **Modifier** : changer tous les champs (nom, email, sujet, message) et le statut
- Statuts disponibles : New, Read, Replied, Archived
- Cliquer sur une ligne pour voir le message complet

### Newsletter (`/admin/newsletter`)

- Liste des abonnés à la newsletter
- **Modifier** : changer l'email ou la source
- **Exporter** : "Export CSV"

### Galerie Photos (`/admin/gallery`)

- **Ajouter** : "+ Ajouter une photo" — upload ou URL
- Chaque photo a : image, légende, catégorie (general, conference, networking, speakers, venue, exhibition), ordre
- **Publier / Masquer** : toggle dans le tableau
- La page publique `/gallery` affiche les photos avec filtres par catégorie et lightbox plein écran

### Pages Personnalisées (`/admin/custom-pages`)

- **Créer** : "+ Nouvelle page" avec titre, URL automatique
- **Contenu par blocs** : ajoutez des blocs Texte (titre + paragraphe), Image (upload + légende), ou Bouton CTA (texte + lien)
- **Réordonner** les blocs : flèches ↑↓
- **Menu** : cochez "Afficher dans le menu" + définissez l'ordre
- **Publier / Brouillon** : cliquez sur le badge dans le tableau
- URL publique : `/p/votre-slug`
- Les pages apparaissent automatiquement dans le menu de navigation

---

## Inscription / Billetterie

Par défaut, un formulaire d'inscription interne est utilisé. Pour rediriger vers un service externe (Weezevent, Eventbrite, etc.) :

1. Aller dans **Settings > Contact & Social**
2. Remplir le champ **"Ticket URL"** avec votre lien (ex: `https://www.weezevent.com/qdef-2026`)
3. Sauvegarder

Tous les boutons "Get Tickets", "Attend the Event", "Register Now" etc. redirigeront automatiquement vers ce lien dans un nouvel onglet.

---

## Visibilité des pages et sections

### Masquer une page entière

Dans **Settings > Page Visibility**, désactivez le toggle :

- Programme, Speakers, About, Venue, Register, Contact, Agenda, Gallery

Effet : la page disparaît du menu + affiche "Coming Soon" si accès direct. Le bouton "Get Tickets" disparaît aussi si Register est masqué.

### Masquer une section de la homepage

Deux méthodes :
1. Dans **Settings > Homepage Sections** : toggles ON/OFF groupés
2. Directement dans chaque section de configuration : toggle vert/rouge "Visible/Masqué" dans le header de chaque section

---

## Logo & Branding

Dans **Settings > Logo & Branding** :

- **Site Logo** : uploadez une image (PNG, SVG recommandé) — remplace le texte "Q-DEF 2026" dans le header et le footer
- **Logo Text** : texte de fallback si pas d'image
- **Logo Year** : année affichée à côté

---

## Images

Toutes les images peuvent être ajoutées par **drag & drop** ou en collant une **URL**.
Les images sont stockées sur **Supabase Storage** (cloud) — elles fonctionnent sur Netlify.
Formats acceptés : JPG, PNG, GIF, WebP, SVG — max 5 MB.

---

## Configurer les sections de la homepage

Dans **Settings**, chaque section est entièrement configurable :

- **Hero** : image de fond, badge date, titre, sous-titre, textes boutons
- **Stats Bar** : chaque chiffre (Attendees, Speakers, Sessions, Tracks, Nations)
- **About & Speakers** : label, titre, description, theme pills, textes boutons
- **Exhibition Stands** : titre, sous-titre (les stands viennent de la DB)
- **Programme Preview** : titre, sous-titre (les sessions viennent de la DB)
- **CTA Banner** : titre, sous-titre, texte du bouton
- **Key Themes** : 3 cartes avec image, titre, description chacune
- **Final CTA** : image de fond, titre, sous-titre, texte du bouton
- **Partners** : titre + liste de noms (séparés par virgules)
- **Footer** : logo, tagline, description, email, téléphone, adresse, copyright

---

## Design (`/admin/design`)

### Presets de couleurs

7 thèmes en 1 clic : Default (Teal), Midnight Blue, Purple Elegance, Military Green, Dark Mode, Warm Corporate, Rose. Le preset est **sauvegardé automatiquement**.

### Couleurs personnalisées

11 couleurs avec color picker : Accent, Hover, Background, Background Alt, Background Dark, Surface, Texte, Titres, Rouge, Succès, Warning.

### Typographie

- **Police du corps** : 13 polices (Inter, Poppins, Montserrat, DM Sans, Space Grotesk...)
- **Police des titres** : peut être différente du corps
- **Taille de base** : 14px à 20px
- **Graisse des titres** : Normal à Black (400-900)
- **Google Fonts** : collez une URL Google Fonts pour charger n'importe quelle police

### Layout & Formes

- **Border radius** boutons et cartes : de sharp (0px) à pill (arrondi)
- **Largeur max contenu** : 960px à 1600px
- **Espacement sections** : compact à spacious

### CSS personnalisé

Zone de texte pour du CSS libre avancé.

### Preview

Aperçu en direct de vos changements.

**N'oubliez pas de cliquer "Save Changes" !**

---

## Admins (`/admin/admins`)

- **Ajouter** : "+ Add Admin" avec email, mot de passe, nom
- **Modifier** : changer email, nom, mot de passe (laisser vide = garder l'ancien)
- **Supprimer** : possible sauf pour votre propre compte

---

## Agenda (`/agenda`)

Page publique avec vue interactive des sessions :
- **Vue Timeline** : chronologie verticale avec code couleur par type
- **Vue Grid** : grille de cartes
- Cliquer sur une session pour voir les détails (description, speakers, lieu)
- Les sessions se gèrent dans **Programme**

---

## Aide (`/admin/help`)

- **Recherche Q&A** : tapez votre question, les réponses apparaissent en temps réel
- **Tags cliquables** : speaker, masquer, couleur, logo, export, programme, design, password, footer, partenaires
- **Manuel complet** : section dépliable avec tous les chapitres
- **FAQ** : 31 questions en accordéon cliquable
- **Télécharger en Word** : bouton "Télécharger le manuel (Word)" en haut à droite

---

## Raccourcis utiles

| Action | Comment |
|--------|---------|
| Sauvegarder | Cliquer sur **"Save Changes"** |
| Chercher | Barre de recherche dans Registrations / Newsletter |
| Exporter | Bouton **"Export CSV"** |
| Upload image | Drag & drop ou cliquer pour parcourir (max 5 MB) |
| Retour au site | Lien **"Back to Site"** en bas du menu |
| Preset couleur | Cliquer un preset dans Design (sauvegarde auto) |

---

## En cas de problème

- **Page blanche** : Ctrl+Shift+R (hard refresh)
- **Modifications non visibles** : vérifier "Save Changes"
- **Upload échoue** : vérifier que SUPABASE_SERVICE_KEY est configurée sur Netlify
