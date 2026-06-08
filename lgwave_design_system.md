# LG Wave — Design System
> Fichier de référence pour Claude Code. Respecter strictement ces règles sur tous les composants et pages du projet.

---

## 1. IDENTITÉ DE MARQUE

**Nom** : LG Wave
**Tagline** : La vague digitale qui transforme votre business
**Positionnement** : Premium, pro, rassurant — entre Pennylane et Alan
**Cible** : Commerçants, artisans, PME locales (Dijon et région)
**Ton** : Direct, sans jargon, concret. Phrases courtes. Bénéfices avant fonctionnalités.

---

## 2. LOGO

### Règles d'utilisation
- **LG** → toujours en Georgia serif, bold 700
- **Wave** → toujours en Helvetica Neue / system sans-serif, light 300
- La **vague** → tracé SVG cubic bezier, couleur `--blue-ocean`, positionnée sous "Wave" uniquement
- Ne jamais déformer, recolorer ou séparer les éléments du logo
- Espace minimum autour du logo : 24px de chaque côté

### SVG Logo (référence)
```svg
<!-- Fond clair -->
<svg width="300" height="82" viewBox="0 0 300 82" fill="none">
  <text x="0" y="54" font-family="Georgia,'Times New Roman',serif"
    font-weight="700" font-size="54" letter-spacing="-1" fill="#05122b">LG</text>
  <text x="116" y="54" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif"
    font-weight="300" font-size="52" letter-spacing="-1" fill="#1a5fa8">Wave</text>
  <path d="M116 70 C155 50 195 90 234 70"
    stroke="#1a5fa8" stroke-width="3.5" stroke-linecap="round" fill="none"/>
</svg>

<!-- Fond sombre -->
<svg width="300" height="82" viewBox="0 0 300 82" fill="none">
  <text x="0" y="54" font-family="Georgia,'Times New Roman',serif"
    font-weight="700" font-size="54" letter-spacing="-1" fill="#ffffff">LG</text>
  <text x="116" y="54" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif"
    font-weight="300" font-size="52" letter-spacing="-1" fill="#5b9de8">Wave</text>
  <path d="M116 70 C155 50 195 90 234 70"
    stroke="#5b9de8" stroke-width="3.5" stroke-linecap="round" fill="none"/>
</svg>
```

---

## 3. COULEURS

```css
:root {
  /* Primaires */
  --marine:        #05122b;   /* LG, fonds sombres, texte fort */
  --blue-ocean:    #1a5fa8;   /* Wave, vague, accents, CTA */
  --blue-sky:      #5b9de8;   /* Variante fond sombre, hover */

  /* Neutres */
  --white:         #ffffff;   /* Fond principal */
  --black:         #0a0a0a;   /* Texte corps */
  --gray-100:      #f5f5f3;   /* Fond sections alternées */
  --gray-200:      #e8eef6;   /* Fond sections bleutées claires */
  --gray-400:      #9a9a96;   /* Texte secondaire, labels */
  --gray-600:      #555550;   /* Texte corps secondaire */
  --border:        #e5e5e5;   /* Bordures légères */

  /* Sémantiques */
  --success:       #3B6D11;
  --error:         #A32D2D;
}
```

### Règles d'usage couleurs
- **Fond principal** → `--white`
- **Fond sections alternées** → `--gray-100` ou `--gray-200`
- **Fond hero / header / footer** → `--marine`
- **Texte principal** → `--black`
- **Texte secondaire** → `--gray-600`
- **Accents / CTA / liens** → `--blue-ocean`
- **Hover sur accent** → `--blue-sky`
- **Jamais** : gradients purple/violet, fond coloré autre que marine ou bleu

---

## 4. TYPOGRAPHIE

```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

:root {
  /* Display — LG dans le logo, titres hero */
  --font-display: 'Cormorant Garamond', Georgia, serif;

  /* Body — tout le reste */
  --font-body: 'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;

  /* Mono — code, emails, données techniques */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

> Note Claude Code : Cormorant Garamond remplace Georgia pour le web (même esprit serif élégant, meilleur rendu écran). DM Sans remplace Helvetica Neue (même famille géométrique, disponible sur le web).

### Échelle typographique

```css
/* Tailles */
--text-xs:   11px;
--text-sm:   13px;
--text-base: 15px;
--text-md:   17px;
--text-lg:   20px;
--text-xl:   24px;
--text-2xl:  32px;
--text-3xl:  44px;
--text-4xl:  58px;
--text-5xl:  76px;

/* Graisse */
--weight-light:   300;
--weight-regular: 400;
--weight-medium:  500;
--weight-bold:    700;

/* Line height */
--leading-tight:  1.1;
--leading-snug:   1.3;
--leading-normal: 1.6;
--leading-loose:  1.8;

/* Letter spacing */
--tracking-tight:  -0.03em;
--tracking-normal:  0;
--tracking-wide:    0.08em;
--tracking-wider:   0.14em;
```

### Hiérarchie typographique

| Élément       | Font          | Taille  | Graisse | Espacement     |
|---------------|---------------|---------|---------|----------------|
| H1 hero       | display       | 5xl–4xl | 700     | tracking-tight |
| H2 section    | display       | 3xl     | 700     | tracking-tight |
| H3 card       | body          | xl      | 500     | normal         |
| Tagline       | body          | lg      | 300     | tracking-wide  |
| Body          | body          | base    | 400     | normal         |
| Label / meta  | body          | sm      | 500     | tracking-wider |
| CTA button    | body          | sm      | 500     | tracking-wide  |

---

## 5. ESPACEMENTS

```css
:root {
  --space-1:   4px;
  --space-2:   8px;
  --space-3:   12px;
  --space-4:   16px;
  --space-5:   24px;
  --space-6:   32px;
  --space-7:   48px;
  --space-8:   64px;
  --space-9:   96px;
  --space-10: 128px;
  --space-11: 160px;
}

/* Sections */
--section-padding-y: var(--space-10);   /* 128px desktop */
--section-padding-x: var(--space-7);    /* 48px desktop */

/* Container */
--container-max: 1160px;
--container-padding: var(--space-6);    /* 32px */
```

---

## 6. LAYOUT & GRILLE

```css
/* Container centré */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* Grilles principales */
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-5); }

/* Responsive breakpoints */
--bp-sm:  640px;
--bp-md:  768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
```

### Règles layout
- Sections en pleine largeur, contenu dans `.container`
- Sections alternent fond blanc / fond `--gray-100` / fond `--marine`
- Hero toujours sur fond `--marine`
- Pas de sidebar — tout en flow vertical
- Asymétrie bienvenue : grille 60/40 ou 55/45 sur certaines sections

---

## 7. BORDER RADIUS

```css
--radius-sm:   4px;    /* badges, tags */
--radius-md:   8px;    /* boutons, inputs */
--radius-lg:  12px;    /* cards */
--radius-xl:  20px;    /* cards larges, sections */
--radius-full: 999px;  /* pills, avatars */
```

---

## 8. OMBRES

```css
/* Minimalistes — pas d'ombres dramatiques */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
--shadow-md: 0 4px 16px rgba(0,0,0,0.08);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.10);

/* Glow bleu pour hover sur CTA */
--shadow-blue: 0 4px 24px rgba(26,95,168,0.25);
```

---

## 9. COMPOSANTS

### 9.1 Boutons

```css
/* Primaire — fond bleu */
.btn-primary {
  background: var(--blue-ocean);
  color: var(--white);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  padding: 14px 28px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
}
.btn-primary:hover {
  background: var(--blue-sky);
  box-shadow: var(--shadow-blue);
  transform: translateY(-1px);
}

/* Secondaire — outline blanc (sur fond sombre) */
.btn-secondary {
  background: transparent;
  color: var(--white);
  border: 1px solid rgba(255,255,255,0.3);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  padding: 14px 28px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.btn-secondary:hover {
  border-color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.06);
}

/* Ghost — sur fond clair */
.btn-ghost {
  background: transparent;
  color: var(--blue-ocean);
  border: 1px solid var(--blue-ocean);
  padding: 14px 28px;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  transition: background 0.2s, color 0.2s;
}
.btn-ghost:hover {
  background: var(--blue-ocean);
  color: var(--white);
}
```

### 9.2 Cards services

```css
.service-card {
  background: var(--white);
  border: 0.5px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-7) var(--space-6);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.service-card:hover {
  border-color: var(--blue-ocean);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Icône service */
.service-icon {
  width: 48px;
  height: 48px;
  background: var(--gray-200);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-5);
  color: var(--blue-ocean);
  font-size: 22px;
}

/* Tag "Ce qu'on livre" */
.service-tag {
  display: inline-block;
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--blue-ocean);
  background: var(--gray-200);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  margin-right: var(--space-1);
  margin-top: var(--space-2);
}
```

### 9.3 Navigation / Header

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--marine);
  padding: 0 var(--container-padding);
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.5px solid rgba(255,255,255,0.06);
}

.nav-links {
  display: flex;
  gap: var(--space-7);
  list-style: none;
}

.nav-link {
  font-size: var(--text-sm);
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  letter-spacing: var(--tracking-wide);
  transition: color 0.2s;
}
.nav-link:hover { color: var(--white); }
.nav-link.active { color: var(--white); }
```

### 9.4 Section Hero

```css
.hero {
  background: var(--marine);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 72px; /* hauteur navbar */
  position: relative;
  overflow: hidden;
}

/* Texture de fond subtile — motif de points ou lignes très discret */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(26,95,168,0.08) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: 700;
  color: var(--white);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-6);
}

/* "Wave" dans le titre en bleu */
.hero-title .accent {
  color: var(--blue-sky);
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--weight-light);
  color: rgba(255,255,255,0.65);
  line-height: var(--leading-normal);
  max-width: 540px;
  margin-bottom: var(--space-7);
}
```

### 9.5 Section label

```css
/* Petit label au-dessus des titres de section */
.section-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--blue-ocean);
  margin-bottom: var(--space-3);
  display: block;
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--black);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-snug);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-size: var(--text-md);
  color: var(--gray-600);
  font-weight: var(--weight-light);
  max-width: 560px;
  line-height: var(--leading-normal);
}
```

### 9.6 Inputs / Formulaire

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--black);
  letter-spacing: var(--tracking-wide);
}

.form-input,
.form-textarea {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--black);
  background: var(--white);
  border: 0.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.form-input:focus,
.form-textarea:focus {
  border-color: var(--blue-ocean);
  box-shadow: 0 0 0 3px rgba(26,95,168,0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}
```

### 9.7 Badges / Pills réassurance

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--blue-ocean);
  background: var(--gray-200);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  border: 0.5px solid rgba(26,95,168,0.2);
}
```

### 9.8 Étapes processus

```css
.step-number {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 700;
  color: rgba(26,95,168,0.12);
  line-height: 1;
  margin-bottom: var(--space-3);
}

.step-title {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: var(--weight-medium);
  color: var(--black);
  margin-bottom: var(--space-3);
}

.step-body {
  font-size: var(--text-base);
  color: var(--gray-600);
  line-height: var(--leading-normal);
}
```

### 9.9 Footer

```css
.footer {
  background: var(--marine);
  padding: var(--space-9) 0 var(--space-6);
  border-top: 0.5px solid rgba(255,255,255,0.06);
}

.footer-divider {
  border: none;
  border-top: 0.5px solid rgba(255,255,255,0.08);
  margin: var(--space-6) 0;
}

.footer-copy {
  font-size: var(--text-xs);
  color: rgba(255,255,255,0.3);
  letter-spacing: var(--tracking-wide);
}
```

---

## 10. ANIMATIONS

```css
/* Apparition au scroll — classe ajoutée via IntersectionObserver */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delay pour les grilles */
.reveal:nth-child(1) { transition-delay: 0s; }
.reveal:nth-child(2) { transition-delay: 0.1s; }
.reveal:nth-child(3) { transition-delay: 0.2s; }
.reveal:nth-child(4) { transition-delay: 0.3s; }

/* Fade in page load */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-hero > * {
  animation: fadeUp 0.8s ease forwards;
}
.animate-hero > *:nth-child(2) { animation-delay: 0.15s; opacity: 0; }
.animate-hero > *:nth-child(3) { animation-delay: 0.3s;  opacity: 0; }
.animate-hero > *:nth-child(4) { animation-delay: 0.45s; opacity: 0; }
```

---

## 11. RESPONSIVE

```css
/* Mobile first — ces breakpoints overrident */
@media (max-width: 768px) {
  --text-5xl: 42px;
  --text-4xl: 34px;
  --text-3xl: 28px;
  --section-padding-y: 80px;

  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }

  .navbar { height: 60px; }
  .nav-links { display: none; } /* burger menu mobile */
}

@media (max-width: 480px) {
  --text-5xl: 34px;
  --container-padding: 20px;
}
```

---

## 12. STACK TECHNIQUE

```
Framework  : Vite + React (ou HTML/CSS/JS vanilla si page statique)
Style      : CSS variables natives (pas de Tailwind)
Fonts      : Google Fonts — Cormorant Garamond + DM Sans
Icons      : Lucide React ou SVG inline
Animations : CSS transitions + IntersectionObserver (pas de lib externe)
Formulaire : Fetch API → backend Supabase Edge Function ou Amazon SES
Hébergement: Vercel (recommandé) ou VPS OVH
Domaine    : lg-wave.fr
```

---

## 13. RÈGLES CLAUDE CODE

> Instructions directes pour générer dans cet univers.

1. **Toujours importer** Cormorant Garamond + DM Sans depuis Google Fonts
2. **Toujours utiliser** les CSS variables définies ci-dessus — jamais de valeurs hardcodées
3. **Hero** toujours sur fond `--marine` avec texture de points subtile
4. **Titres de section** → font-display (Cormorant Garamond) + section-label au-dessus
5. **CTA principal** → btn-primary bleu, CTA secondaire → btn-secondary outline blanc
6. **Cards** → fond blanc, bordure 0.5px, radius-xl, hover avec élévation légère
7. **Sections alternées** → blanc / gray-100 / marine (jamais deux marines de suite)
8. **Animations** → reveal au scroll sur toutes les sections hors hero
9. **Logo** → toujours SVG inline, jamais en img tag
10. **Pas de** : gradients colorés, ombres dramatiques, purples, Inter/Roboto, rounded partout
11. **Toujours** : beaucoup d'espace négatif, typographie lisible, hiérarchie claire
12. **Mobile** : tester chaque composant en 375px de large minimum

---

## 14. EXEMPLES D'ANTI-PATTERNS À ÉVITER

❌ Gradient purple/violet sur fond blanc
❌ Box-shadow trop prononcée sur les cards
❌ Texte centré sur tout le site
❌ Boutons avec border-radius: 999px sur les CTA principaux
❌ Inter ou Roboto comme police principale
❌ Sections toutes sur fond blanc sans alternance
❌ Micro-animations sur chaque élément (overdone)
❌ Icônes colorées en orange/vert/rouge sans raison sémantique
❌ Padding insuffisant (< 16px) dans les cards
❌ Texte trop petit (< 14px) pour du body copy

---

## 15. CHECKLIST AVANT LIVRAISON

- [ ] Fonts chargées depuis Google Fonts (Cormorant Garamond + DM Sans)
- [ ] CSS variables définies dans :root
- [ ] Logo SVG intégré en inline dans le header
- [ ] Hero sur fond marine avec texture subtile
- [ ] Animations reveal au scroll actives
- [ ] Responsive testé à 375px, 768px, 1280px
- [ ] Formulaire de contact fonctionnel
- [ ] Liens WhatsApp (wa.me/NUMERO) opérationnels
- [ ] Meta title + description SEO renseignés
- [ ] Favicon LG configuré
