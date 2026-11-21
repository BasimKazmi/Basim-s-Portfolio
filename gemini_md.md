# GEMINI.md — CS554 Assignment 1 (Version A): Responsive Developer Portfolio

## 1. Project Overview & Persona
* **Course:** CS-554 Advanced Web Technologies (Fall 2026) — Instructor: Abdul Jamil
* **Assignment:** Assignment 1, Version A — Responsive Developer Portfolio
* **Objective:** Build a fast, accessible, mobile-first 3-page developer portfolio deployed on GitHub Pages that demonstrates core web fundamentals (Lectures 1–4) and achieves high Lighthouse and W3C Validator scores.
* **Academic Integrity & Viva Readiness:** Every line of code must be clean, idiomatic, well-commented where helpful, and easy to explain during an oral viva. Avoid overly clever or opaque one-liners.

---

## 2. Hard Constraints (Strictly Enforced)
* **Allowed Stack ONLY:** Semantic HTML5, hand-written CSS3, and vanilla JavaScript (ES6+).
* **Forbidden:** NO CSS frameworks or preprocessors (Bootstrap, Tailwind, Sass, etc.). NO JavaScript libraries or frameworks (React, jQuery, Alpine, etc.).
* **Security / DOM Rule:** **NEVER** use `.innerHTML` (or `insertAdjacentHTML`) to render data-driven content. Always use safe DOM APIs (`document.createElement`, `textContent`, `setAttribute`, `appendChild`).
* **Single Shared Stylesheet:** All three HTML pages must link to a single external CSS file (`css/style.css` or `styles.css`). No inline `style=""` attributes or `<style>` blocks unless strictly required for dynamic JS positioning.

---

## 3. File & Directory Structure
Keep the repository flat and clean for straightforward GitHub Pages deployment:
```text
/
├── index.html          # Home page (Hero, About Me, Skills, Footer)
├── projects.html       # Projects page (Search, Tech Filter, JS-rendered Grid, Bonus <dialog>)
├── contact.html        # Contact page (Validated form with accessible error states)
├── css/
│   └── styles.css      # Single shared stylesheet (reset, custom properties, themes, layout)
├── js/
│   ├── theme.js        # Shared dark-mode toggle + OS preference sync + localStorage persistence
│   ├── projects.js     # Project data array, safe DOM card rendering, search/filter, <dialog> modal
│   └── contact.js      # Custom JS form validation + per-field error rendering + success state
├── assets/
│   └── images/         # Optimized local images (profile photo, project thumbnails) with explicit dimensions
├── GEMINI.md           # Project specification & AI assistant instructions
└── README.md           # Live GitHub Pages URL, project overview, and desktop/mobile screenshots
```

---

## 4. Page-by-Page HTML5 Requirements
Every HTML page (`index.html`, `projects.html`, `contact.html`) **must** include:
* `<!DOCTYPE html>` and `<html lang="en">`
* `<meta charset="UTF-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
* Unique `<title>` and unique `<meta name="description" content="...">` per page
* Semantic landmarks: `<header>` containing `<nav>`, exactly **one** `<main>` per page, `<section>` / `<article>`, and `<footer>`
* Heading hierarchy: Exactly **one** `<h1>` per page; no skipped heading levels (`h1` -> `h2` -> `h3`)
* Images: Every `<img>` must have meaningful `alt` text and explicit `width` and `height` attributes to prevent Cumulative Layout Shift (CLS)
* W3C HTML Validator target: **0 errors, 0 warnings**

### 4.1 `index.html` (Home)
* **Hero section:** Developer name, role/title, brief value proposition, and a primary Call-to-Action (CTA) button linking to `projects.html` (and secondary link to `contact.html`).
* **About Me section:** Concise, authentic developer bio.
* **Skills section:** Categorized technical skills (e.g., Frontend, Languages, Tools/ML) using semantic lists (`<ul>`/`<li>`).
* **Footer:** Navigation/social links (GitHub, LinkedIn, Email) and copyright.

### 4.2 `projects.html` (Projects)
* **Filter Controls:**
  * Text search `<input type="search">` (with `<label>`) filtering by project `title` or `tech` (case-insensitive).
  * Technology `<select>` dropdown (with `<label>`) populated dynamically or statically (e.g., "All Technologies", "HTML/CSS", "JavaScript", "Python", "C++", etc.).
* **Live Status Region:** An `aria-live="polite"` element displaying the live count of matching projects (e.g., `"Showing 6 of 6 projects"`).
* **Project Grid:** Container element populated entirely by JavaScript from an array of at least **6** project objects.
* **Empty State:** Display `"No projects found"` clearly when the combined search + filter yields 0 matches.
* **Bonus Feature (+2 marks, capped at 20):** Implement a `<dialog>` element for a "View Details" modal on each project card, supporting keyboard `Escape` close, backdrop click close, and focus restoration.

### 4.3 `contact.html` (Contact)
* **Form Elements (every input paired with an explicit `<label for="...">`):**
  1. **Name:** `<input type="text" required minlength="3">`
  2. **Email:** `<input type="email" required>`
  3. **Subject:** `<select required>` with relevant inquiry options
  4. **How did you hear about me?:** Radio button group wrapped in `<fieldset>` with a `<legend>`
  5. **Message:** `<textarea required minlength="20"></textarea>`
  6. **Consent checkbox:** `<input type="checkbox" required>` with `<label>`
  7. **Submit button:** `<button type="submit">`
* Retain native HTML5 validation attributes (`required`, `type="email"`, `minlength`) while enhancing with JS validation (`novalidate` on `<form>` handled cleanly in JS, or syncing custom validity) so errors render inline beneath each field.

---

## 5. Styling & CSS3 Requirements (`css/styles.css`)
* **Reset:** Start the stylesheet with:
  ```css
  *, *::before, *::after {
    box-sizing: border-box;
  }
  ```
* **Design Tokens (`:root`):** Define all colors, border radii, spacing scales, font sizes, and shadows as CSS custom properties (`--color-bg`, `--color-surface`, `--color-text`, `--color-primary`, `--space-md`, `--radius-md`, etc.).
* **Dark Mode Implementation:**
  * Support OS preference automatically via `@media (prefers-color-scheme: dark)` when no manual override is set.
  * Support manual toggle via `[data-theme="dark"]` and `[data-theme="light"]` attributes on `<html>`.
  * Ensure WCAG AA contrast ratios ($\ge 4.5:1$ for normal text) in both light and dark modes for Lighthouse Accessibility $\ge 95$.
* **Responsive Layout (Mobile-First):**
  * Zero horizontal scrolling across all viewports from `360px` up to `1440px`.
  * **Navbar:** Built with Flexbox (`display: flex`).
  * **Project Cards Grid:** Built with CSS Grid (`display: grid`):
    * Default (`< 640px`): `1fr` (1 column)
    * `@media (min-width: 640px)`: `repeat(2, 1fr)` (2 columns)
    * `@media (min-width: 1024px)`: `repeat(3, 1fr)` (3 columns)
* **Typography & Focus:**
  * Fluid heading sizes using `clamp()` (e.g., `font-size: clamp(1.75rem, 4vw, 2.75rem)`).
  * Distinct, high-contrast `:focus-visible` outlines on all interactive links, buttons, and form controls.
  * Respect `@media (prefers-reduced-motion: reduce)` for any transitions or bonus animations.

---

## 6. JavaScript Specifications

### 6.1 Theme Controller (`js/theme.js`)
* Loaded on all 3 pages (preferably in `<head>` with `defer` or tiny inline script to prevent Flash of Unstyled/Wrong Theme, while keeping main logic in `js/theme.js`).
* Reads `localStorage.getItem("theme")`. If absent, falls back to `window.matchMedia("(prefers-color-scheme: dark)")`.
* Sets `document.documentElement.setAttribute("data-theme", theme)`, updates toggle button `aria-pressed` / `aria-label`, and saves user selection to `localStorage`.

### 6.2 Projects Renderer & Filters (`js/projects.js`)
* Data structure (minimum 6 objects):
  ```javascript
  const projects = [
    {
      id: "project-1",
      title: "Project Title",
      description: "Concise summary of the problem solved and architecture.",
      tech: ["Python", "OpenCV", "Deep Learning"],
      year: 2026,
      link: "https://github.com/username/repo"
    }
    // ... at least 6 total projects
  ];
  ```
* Render cards using `document.createElement("article")`, `h2`/`h3`, `p`, `ul`/`li` for tech badges, and `a`/`button`—setting text strictly via `.textContent`.
* Combined filtering: Filter `projects` where `(matchesSearchTitle || matchesSearchTech) && matchesSelectedTech` (both conditions must hold simultaneously).
* Update `aria-live` status container and toggle `"No projects found"` message when filtered array length is `0`.

### 6.3 Contact Form Validation (`js/contact.js`)
* Attach `submit` listener to the form and call `event.preventDefault()`.
* Validate all fields:
  * **Name:** trimmed length $\ge 3$ characters
  * **Email:** non-empty and matches standard email format
  * **Subject:** valid option selected
  * **Referral Source (Radio):** one radio button checked
  * **Message:** trimmed length $\ge 20$ characters
  * **Consent:** checkbox checked
* On invalid fields: display clear, specific error text in a dedicated `<p class="error-message" id="...">` beneath each invalid field, link via `aria-describedby` and `aria-invalid="true"`, and focus the first invalid input.
* On valid submission: clear errors, reset the form, and display an accessible confirmation/success banner (`role="status"`).

---

## 7. Git Workflow, Deployment & Submission Checklist
* **Git Commits:** Minimum **6 meaningful commits** following Conventional Commits (`feat:`, `style:`, `fix:`, `docs:`, `refactor:`).
  1. `feat: scaffold semantic HTML structure for index, projects, and contact pages`
  2. `style: add CSS custom properties, mobile-first layout, and dark mode themes`
  3. `feat: implement persistent dark mode toggle with OS preference fallback`
  4. `feat: render project cards via safe DOM APIs with combined search and tech filter`
  5. `feat: add client-side contact form validation and accessible error states`
  6. `feat: add accessible project details modal using native dialog element`
  7. `docs: add README with live URL and application screenshots`
* **Quality Gates Before Submission:**
  * [ ] Deployed live on GitHub Pages and all relative links/assets load cleanly.
  * [ ] `README.md` includes live GitHub Pages URL and screenshot(s).
  * [ ] W3C Markup Validator passes with **0 errors** on `index.html`, `projects.html`, and `contact.html`.
  * [ ] Google Lighthouse (Mobile audit on `index.html`) scores **Performance $\ge 90$** and **Accessibility $\ge 95$**.
  * [ ] Tested manually at `360px`, `640px`, `1024px`, and `1440px` widths with zero horizontal overflow.
  * [ ] Submission PDF (max 2 pages) prepared with mobile Lighthouse screenshot + W3C validator screenshots for all 3 pages.