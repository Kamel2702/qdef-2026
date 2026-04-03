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
- Champs : titre, description, type (keynote, panel, workshop...), horaires, speakers, tags, lieu

### Speakers (`/admin/speakers`)

- **Ajouter** : "+ Add Speaker"
- **Modifier / Supprimer** : boutons dans le tableau
- Champs : nom, titre/poste, organisation, bio, photo (upload ou URL)

### Registrations (`/admin/registrations`)

- **Voir** toutes les inscriptions avec recherche
- **Modifier** : cliquer sur "Edit" pour changer les infos d'un inscrit
- **Supprimer** : cliquer sur "Delete"
- **Exporter** : "Export CSV" pour télécharger la liste

### Sponsors (`/admin/sponsors`)

- CRUD complet : ajouter, modifier, supprimer
- Champs : nom, tier (Gold, Silver...), logo (upload), site web, description, ordre d'affichage

### Exhibitions (`/admin/exhibitions`)

- Les stands d'exposition affichés sur la homepage
- Champs : nom, description, image, tag, site web, ordre

### News & Blog (`/admin/news`)

- Créer des articles avec titre, contenu, image de couverture
- **Publier / Dépublier** : toggle pour mettre en ligne ou en brouillon

### Contacts (`/admin/contacts`)

- Messages reçus via le formulaire de contact
- **Modifier** : changer le nom, email, sujet, message, statut
- Statuts disponibles : New, Read, Replied, Archived
- Cliquer sur une ligne pour voir le message complet

### Newsletter (`/admin/newsletter`)

- Liste des abonnés à la newsletter
- **Modifier** : changer l'email ou la source
- **Exporter** : "Export CSV"

---

## Visibilité des pages et sections

### Dans Settings (`/admin/settings`)

#### Masquer une page entière

Scrollez jusqu'à **"Page Visibility"**. Désactivez le toggle d'une page :

| Toggle | Effet |
|--------|-------|
| Programme | Masque la page Programme du menu |
| Speakers | Masque la page Speakers du menu |
| About | Masque la page About du menu |
| Venue | Masque la page Venue du menu |
| Register | Masque la page Register + le bouton "Get Tickets" |
| Contact | Masque la page Contact du menu |

Une page masquée :
- **Disparaît du menu** de navigation
- Affiche **"Coming Soon"** si quelqu'un tape l'URL directement

#### Masquer une section de la homepage

Scrollez jusqu'à **"Homepage Sections"**. Désactivez le toggle d'une section :

- Hero Section, Stats Bar, About & Speakers, Exhibition Stands
- Programme Preview, CTA Banner, Key Themes, Final CTA, Partners

---

## Logo & Branding

Dans **Settings**, scrollez jusqu'à **"Logo & Branding"** :

- **Site Logo** : uploadez une image (PNG, SVG recommandé) — elle remplacera le texte "Q-DEF 2026" dans le header et le footer
- **Logo Text** : texte de fallback si pas d'image (ex: "Q-DEF")
- **Logo Year** : année affichée à côté (ex: "2026")

---

## Modifier les textes et images de chaque section

Toujours dans **Settings**, scrollez vers le bas. Chaque section de la homepage est configurable :

### Hero Section
- Image de fond (upload ou URL)
- Badge de date (ex: "Nov 25, 2026")
- Titre principal (supporte `<br>` et `<strong>`)
- Sous-titre
- Texte des boutons

### Stats Bar
- Chaque chiffre : Attendees, Speakers, Sessions, Tracks, Nations

### About & Speakers
- Label, titre, description
- Theme pills (liste séparée par des virgules)
- Texte des boutons

### Exhibition Stands
- Titre et sous-titre de la section
- Les stands eux-mêmes se gèrent dans **Exhibitions**

### Programme Preview
- Titre et sous-titre de la section
- Les sessions se gèrent dans **Programme**

### CTA Banner
- Titre, sous-titre, texte du bouton

### Key Themes (3 cartes)
- Pour chaque carte : image, titre, description

### Final CTA
- Image de fond, titre, sous-titre, texte du bouton

### Partners
- Titre de la section
- Liste des partenaires (noms séparés par des virgules)

### Footer
- Logo, tagline, description, email, téléphone, adresse, copyright

---

## Design (`/admin/design`)

### Presets de couleurs

Cliquez sur un preset pour appliquer un thème complet en 1 clic :
- Default (Teal), Midnight Blue, Purple Elegance, Military Green, Dark Mode, Warm Corporate, Rose

### Couleurs personnalisées

Modifiez chaque couleur individuellement avec le color picker :
- Accent (boutons, liens), Hover, Background, Surface, Texte, Titres, etc.

### Typographie

- **Police du corps** : choisir parmi 13 polices (Inter, Poppins, Montserrat...)
- **Police des titres** : peut être différente du corps
- **Taille de base** : 14px à 20px
- **Graisse des titres** : Normal à Black (400-900)
- **Google Fonts** : collez une URL Google Fonts pour charger n'importe quelle police

### Layout & Formes

- **Border radius boutons** : de sharp (0px) à pill (arrondi)
- **Border radius cartes** : idem
- **Largeur max contenu** : 960px à 1600px
- **Espacement sections** : compact à spacieux

### CSS personnalisé

Zone de texte pour ajouter du CSS avancé si besoin.

### Preview

Aperçu en direct de vos changements (titres, texte, boutons, cartes, section sombre).

**N'oubliez pas de cliquer "Save Changes" pour enregistrer !**

---

## Page Content (`/admin/pages`)

Éditeur de contenu pour les pages statiques : Home Page, About Page, Venue Page.

- Mode **Visual** : formulaire simple
- Mode **Raw JSON** : édition directe du JSON

---

## Admins (`/admin/admins`)

- **Ajouter un admin** : "+ Add Admin" avec email, mot de passe, nom
- **Modifier** : changer l'email, le nom, ou le mot de passe (laisser vide = garder l'ancien)
- **Supprimer** : possible sauf pour votre propre compte
- Tous les admins ont les mêmes droits

---

## Raccourcis utiles

| Action | Comment |
|--------|---------|
| Sauvegarder | Cliquer sur **"Save Changes"** (en haut à droite) |
| Chercher | Utiliser la barre de recherche dans Registrations / Newsletter |
| Exporter | Bouton **"Export CSV"** dans Registrations et Newsletter |
| Upload image | Glisser-déposer ou cliquer pour parcourir (max 5 MB) |
| Retour au site | Lien **"Back to Site"** en bas du menu |

---

## En cas de problème

- **Page blanche** : faire Ctrl+Shift+R (hard refresh)
- **Modifications non visibles** : vérifier que vous avez cliqué "Save Changes"
- **Suppression ne fonctionne pas** : vérifier la clé `SUPABASE_SERVICE_KEY` dans le fichier `server/.env`
