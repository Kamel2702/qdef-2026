import { useState } from 'react';

const QA = [
  { q: "Comment ajouter un speaker ?", a: "Allez dans Speakers dans le menu, puis cliquez sur '+ Add Speaker'. Remplissez le nom, titre, organisation, bio et uploadez une photo." },
  { q: "Comment modifier une inscription ?", a: "Allez dans Registrations, trouvez l'inscription via la recherche, puis cliquez sur 'Edit'. Modifiez les champs et sauvegardez." },
  { q: "Comment masquer une page du menu ?", a: "Allez dans Settings, scrollez jusqu'a 'Page Visibility'. Desactivez le toggle de la page souhaitee (ex: Programme, Speakers). La page disparaitra du menu et affichera 'Coming Soon'." },
  { q: "Comment masquer une section de la homepage ?", a: "Allez dans Settings, scrollez jusqu'a 'Homepage Sections'. Desactivez le toggle de la section (ex: Stats Bar, Partners, CTA Banner)." },
  { q: "Comment changer les couleurs du site ?", a: "Allez dans Design. Choisissez un preset de couleurs en 1 clic, ou personnalisez chaque couleur avec les color pickers. N'oubliez pas de cliquer 'Save Changes'." },
  { q: "Comment changer la police du site ?", a: "Allez dans Design > Typography. Selectionnez une police dans le dropdown 'Body Font' ou 'Heading Font'. Vous pouvez aussi coller une URL Google Fonts pour une police custom." },
  { q: "Comment mettre un logo image ?", a: "Allez dans Settings, scrollez jusqu'a 'Logo & Branding'. Uploadez votre image dans 'Site Logo'. Elle remplacera le texte 'Q-DEF 2026' dans le header et le footer." },
  { q: "Comment changer l'image de fond du hero ?", a: "Allez dans Settings, scrollez jusqu'a 'Hero Section'. Uploadez une image dans 'Background Image' ou collez une URL." },
  { q: "Comment ajouter une session au programme ?", a: "Allez dans Programme, cliquez sur '+ Add Session'. Remplissez le titre, description, type, horaires, speakers et tags." },
  { q: "Comment reordonner les sessions ?", a: "Dans Programme, glissez-deposez les lignes du tableau pour changer l'ordre des sessions." },
  { q: "Comment publier un article ?", a: "Allez dans News & Blog, cliquez sur '+ Add Article'. Remplissez le titre, contenu, image. Utilisez le toggle pour publier ou garder en brouillon." },
  { q: "Comment exporter les inscriptions ?", a: "Allez dans Registrations, cliquez sur le bouton 'Export CSV' en haut a droite. Le fichier sera telecharge automatiquement." },
  { q: "Comment exporter la newsletter ?", a: "Allez dans Newsletter, cliquez sur 'Export CSV'. La liste des abonnes sera telechargee en CSV." },
  { q: "Comment ajouter un admin ?", a: "Allez dans Admins, cliquez sur '+ Add Admin'. Entrez l'email, le mot de passe et le nom. Tous les admins ont les memes droits." },
  { q: "Comment changer mon mot de passe admin ?", a: "Allez dans Admins, trouvez votre compte et cliquez sur 'Edit'. Entrez un nouveau mot de passe. Laissez vide pour garder l'ancien." },
  { q: "Comment ajouter un sponsor ?", a: "Allez dans Sponsors, cliquez sur '+ Add Sponsor'. Remplissez le nom, tier (Gold, Silver...), uploadez un logo, ajoutez le site web et une description." },
  { q: "Comment ajouter un stand d'exposition ?", a: "Allez dans Exhibitions, cliquez sur '+ Add Exhibition'. Les stands apparaissent automatiquement sur la homepage." },
  { q: "Comment modifier le footer ?", a: "Allez dans Settings, scrollez tout en bas jusqu'a la section 'Footer'. Vous pouvez modifier le tagline, description, email, telephone, adresse et copyright." },
  { q: "Comment changer les textes des boutons ?", a: "Allez dans Settings. Chaque section (Hero, About, CTA...) a des champs pour les textes de boutons. Modifiez-les et sauvegardez." },
  { q: "Comment modifier les stats (300+ attendees...) ?", a: "Allez dans Settings > 'Stats Bar'. Modifiez chaque chiffre : Attendees, Speakers, Sessions, Tracks, Nations." },
  { q: "Comment changer la liste des partenaires ?", a: "Allez dans Settings > 'Partners'. Modifiez le champ 'Partner Names' avec les noms separes par des virgules." },
  { q: "Comment changer les cartes Key Themes ?", a: "Allez dans Settings > 'Key Themes - Card 1/2/3'. Pour chaque carte, changez l'image, le titre et la description." },
  { q: "Comment modifier le contenu de la page About ?", a: "Allez dans Page Content, selectionnez 'About Page'. Modifiez les champs en mode Visual ou Raw JSON." },
  { q: "Comment gerer les messages de contact ?", a: "Allez dans Contacts. Cliquez sur une ligne pour voir le message. Utilisez 'Edit' pour changer le statut (New, Read, Replied, Archived) ou modifier le contenu." },
  { q: "Comment supprimer un speaker ?", a: "Allez dans Speakers, trouvez le speaker dans le tableau et cliquez sur 'Delete'. Confirmez la suppression." },
  { q: "Comment changer le border radius des boutons ?", a: "Allez dans Design > 'Layout & Shape'. Selectionnez le border radius souhaite dans 'Button Border Radius' (sharp, small, medium, pill...)." },
  { q: "Les modifications ne s'affichent pas", a: "Verifiez que vous avez clique 'Save Changes'. Puis faites un hard refresh dans le navigateur : Ctrl+Shift+R." },
  { q: "La suppression ne fonctionne pas", a: "Vous devez configurer la cle SUPABASE_SERVICE_KEY dans le fichier server/.env. Trouvez-la dans votre dashboard Supabase > Project Settings > API > service_role key." },
  { q: "Comment ajouter du CSS custom ?", a: "Allez dans Design, scrollez jusqu'a 'Custom CSS'. Tapez votre CSS dans la zone de texte. Exemple : .hero__title { font-size: 4rem; }" },
];

const MANUAL_SECTIONS = [
  { title: "Connexion", content: "Allez sur votre-site/admin/login. Entrez votre email et mot de passe." },
  { title: "Dashboard", content: "Vue d'ensemble avec les compteurs de toutes vos donnees : inscriptions, speakers, sessions, sponsors, articles, messages, newsletter, exhibitions." },
  { title: "Programme", content: "Ajoutez, modifiez, supprimez et reordonnez les sessions. Glissez-deposez pour changer l'ordre. Chaque session a un titre, description, type, horaires, speakers et tags." },
  { title: "Speakers", content: "Gerez les intervenants : nom, titre, organisation, bio et photo. Upload par drag & drop ou URL." },
  { title: "Registrations", content: "Voir, chercher, modifier et supprimer les inscriptions. Export CSV disponible." },
  { title: "Sponsors", content: "Gerez les sponsors avec tier (Gold, Silver...), logo, site web et description." },
  { title: "Exhibitions", content: "Les stands d'exposition affiches sur la homepage. Gerez nom, description, image, tag et ordre." },
  { title: "News & Blog", content: "Creez des articles avec titre, contenu et image. Toggle publier/brouillon." },
  { title: "Contacts", content: "Messages du formulaire de contact. Modifiez le statut : New, Read, Replied, Archived." },
  { title: "Newsletter", content: "Liste des abonnes. Modifier, supprimer et exporter en CSV." },
  { title: "Page Visibility", content: "Dans Settings > 'Page Visibility' : masquez des pages entieres du menu. Les pages masquees affichent 'Coming Soon'." },
  { title: "Homepage Sections", content: "Dans Settings > 'Homepage Sections' : masquez des sections individuelles de la homepage avec des toggles ON/OFF." },
  { title: "Logo & Branding", content: "Dans Settings > 'Logo & Branding' : uploadez un logo image pour remplacer le texte. Definissez le texte de fallback." },
  { title: "Design", content: "Editeur de design complet : 7 presets de couleurs, 11 couleurs custom, polices (13 options + Google Fonts), tailles, border radius, espacement, CSS custom. Preview en direct." },
  { title: "Admins", content: "Gerez les comptes administrateurs. Ajoutez, modifiez, supprimez. Protection contre l'auto-suppression." },
  { title: "Page Content", content: "Editeur de contenu pour Home, About et Venue. Mode Visual ou Raw JSON." },
];

function generateWordDoc() {
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>Manuel Admin Q-DEF</title>
    <style>
      body { font-family: Calibri, sans-serif; font-size: 11pt; color: #333; line-height: 1.6; }
      h1 { color: #0d9488; font-size: 24pt; border-bottom: 2px solid #0d9488; padding-bottom: 8px; }
      h2 { color: #1e293b; font-size: 16pt; margin-top: 24pt; }
      h3 { color: #334155; font-size: 13pt; }
      table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
      th, td { border: 1px solid #cbd5e1; padding: 6pt 10pt; text-align: left; }
      th { background: #f1f5f9; font-weight: bold; }
      .note { background: #f0fdfa; border-left: 4px solid #0d9488; padding: 8pt 12pt; margin: 12pt 0; }
    </style></head><body>
    <h1>Manuel d'utilisation - Q-DEF Admin</h1>
    <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
    <br/>
    <h2>Sommaire</h2>
    <ol>`;

  MANUAL_SECTIONS.forEach(s => { html += `<li>${s.title}</li>`; });
  html += `<li>Questions frequentes</li></ol><br/>`;

  MANUAL_SECTIONS.forEach((s, i) => {
    html += `<h2>${i + 1}. ${s.title}</h2><p>${s.content}</p>`;
  });

  html += `<h2>Questions frequentes</h2><table><tr><th>Question</th><th>Reponse</th></tr>`;
  QA.forEach(({ q, a }) => { html += `<tr><td><strong>${q}</strong></td><td>${a}</td></tr>`; });
  html += `</table>`;

  html += `<br/><h2>Resume des fonctionnalites</h2>
    <table>
      <tr><th>Module</th><th>Creer</th><th>Lire</th><th>Modifier</th><th>Supprimer</th></tr>
      <tr><td>Programme</td><td>Oui</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
      <tr><td>Speakers</td><td>Oui</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
      <tr><td>Sponsors</td><td>Oui</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
      <tr><td>Exhibitions</td><td>Oui</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
      <tr><td>News/Blog</td><td>Oui</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
      <tr><td>Registrations</td><td>-</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
      <tr><td>Contacts</td><td>-</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
      <tr><td>Newsletter</td><td>-</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
      <tr><td>Admins</td><td>Oui</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
    </table>
    <br/>
    <h3>Fonctionnalites cles</h3>
    <ul>
      <li>Editeur de design (couleurs, polices, layout, CSS custom)</li>
      <li>7 presets de couleurs en 1 clic</li>
      <li>Upload d'images drag & drop</li>
      <li>Logo image personnalise</li>
      <li>Visibilite des pages (masquer du menu + Coming Soon)</li>
      <li>Visibilite des sections homepage (9 toggles)</li>
      <li>Taglines et images configurables pour chaque section</li>
      <li>Export CSV (inscriptions, newsletter)</li>
      <li>Drag & drop pour reordonner le programme</li>
      <li>Systeme de publication brouillon/publie pour les articles</li>
      <li>Statuts de contact (New, Read, Replied, Archived)</li>
      <li>Google Fonts personnalisable</li>
      <li>CSS custom avance</li>
    </ul>
  </body></html>`;

  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Manuel-Admin-QDEF.doc';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

export default function ManageHelp() {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState([]);
  const [showManual, setShowManual] = useState(false);

  function handleSearch(value) {
    setQuestion(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const q = value.toLowerCase();
    const matched = QA.filter(item =>
      item.q.toLowerCase().includes(q) ||
      item.a.toLowerCase().includes(q)
    );
    setResults(matched.length > 0 ? matched : [{ q: 'Aucun resultat', a: `Essayez avec d'autres mots-cles. Exemples : "speaker", "couleur", "masquer", "logo", "export", "password"...` }]);
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Aide</h1>
          <p>Posez une question ou consultez le manuel d'utilisation.</p>
        </div>
        <button className="btn btn--primary" onClick={generateWordDoc}>
          Telecharger le manuel (Word)
        </button>
      </div>

      {/* Question input */}
      <div className="admin-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-table-header">
          <h2>Posez votre question</h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <input
            type="text"
            className="form-input"
            value={question}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Ex: Comment ajouter un speaker ? Comment changer les couleurs ?"
            style={{ fontSize: '1rem', padding: '0.85rem 1rem' }}
          />

          {results.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              {results.map((item, i) => (
                <div key={i} style={{
                  background: 'rgba(20, 184, 166, 0.06)',
                  border: '1px solid rgba(20, 184, 166, 0.15)',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  marginBottom: '0.75rem',
                }}>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                    {item.q}
                  </div>
                  <div style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.9rem' }}>
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!question && (
            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['speaker', 'masquer', 'couleur', 'logo', 'export', 'programme', 'design', 'password', 'footer', 'partenaires'].map(tag => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  style={{
                    padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: '0.8rem',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual toggle */}
      <div className="admin-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-table-header" style={{ cursor: 'pointer' }} onClick={() => setShowManual(!showManual)}>
          <h2>Manuel d'utilisation</h2>
          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{showManual ? 'Masquer' : 'Afficher'}</span>
        </div>
        {showManual && (
          <div style={{ padding: '1.5rem' }}>
            {MANUAL_SECTIONS.map((section, i) => (
              <div key={i} style={{
                marginBottom: '1rem', paddingBottom: '1rem',
                borderBottom: i < MANUAL_SECTIONS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <h3 style={{ color: '#e2e8f0', fontSize: '1rem', marginBottom: '0.35rem' }}>
                  {i + 1}. {section.title}
                </h3>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="admin-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-table-header">
          <h2>Toutes les questions ({QA.length})</h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {QA.map((item, i) => (
            <details key={i} style={{
              marginBottom: '0.5rem', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}>
              <summary style={{
                padding: '0.75rem 1rem', cursor: 'pointer',
                fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem',
                background: 'rgba(255,255,255,0.03)',
              }}>
                {item.q}
              </summary>
              <div style={{ padding: '0.75rem 1rem', color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, background: 'rgba(255,255,255,0.01)' }}>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
