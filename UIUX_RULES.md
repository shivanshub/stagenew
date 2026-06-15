# UI/UX BUILD RULES — Agent Specification

> **You are an AI coding agent building a website or web app. This file is a binding specification.**
> Follow it exactly. These rules encode professional UI/UX craft so the output is correct, accessible, and does not look AI-generated. Attach this file to the project context. When you finish, you MUST pass the Pre-Flight Checklist at the end before declaring the work done.

---

## 0. HOW TO USE THIS FILE (READ FIRST)

**Two inputs govern every build:**
1. **THE USER BRIEF** — the project-specific instructions the user gives you (purpose, brand, content, structure, page list, "vibe", any brand colors/fonts/logos, features).
2. **THIS FILE** — the universal UI/UX rules.

**PRECEDENCE (resolve conflicts in this order):**
1. **Accessibility & usability rules in this file are NON-NEGOTIABLE.** They override the brief. If the brief asks for something that breaks them (e.g. light-gray text on white, tap targets smaller than 44px, removing focus outlines), implement the accessible version and add a one-line note explaining the override.
2. **The user brief owns identity & content:** brand colors, fonts, logo, tone, copy, page structure, features, and overall vibe. Honor these exactly.
3. **This file owns craft & system:** how you turn the brand into a *system* (color ramps, type scale, spacing rhythm, component states, hierarchy, responsiveness, motion, anti-slop). Apply it on top of the brief.
4. If the brief is silent on something, use the DEFAULT TOKENS in Section 2.

**Operating rules:**
- Do not ask the user to configure anything. Read the brief, apply this file, build.
- If a required detail is genuinely missing AND has no sensible default, make the professional choice and state your assumption in one line. Do not stall.
- Use real, semantic HTML. Use a token system, not hard-coded magic numbers.
- Ship every state of every interactive element, not just the happy path.

---

## 1. THE TEN NON-NEGOTIABLES (NEVER VIOLATE)

1. **Contrast:** body text ≥ **4.5:1**; large text (≥24px, or ≥19px bold) and UI/icons ≥ **3:1**. Verify every text/background pair.
2. **Tap/click targets:** interactive elements ≥ **44×44px** (mobile) / **24×24px CSS min with spacing** (pointer). Never smaller.
3. **Keyboard:** every interactive element is reachable by Tab, operable by Enter/Space, in logical order, with a **visible focus ring**. Never `outline: none` without a replacement focus style.
4. **Semantic HTML:** real `<button>`, `<a>`, `<nav>`, `<main>`, `<header>`, `<h1>`–`<h3>` in order, `<label>` on every input. No `<div onclick>` for buttons.
5. **One primary action per view.** Exactly one visually dominant CTA. Everything else is secondary/tertiary.
6. **Meaning is never carried by color alone.** Errors/success/status also use icon + text.
7. **Body text ≥ 16px.** Never smaller for reading content.
8. **All states exist:** default, hover, focus, active, disabled, loading, empty, error — for every component that has them.
9. **Responsive from 320px up.** No horizontal scroll. No fixed widths that overflow small screens.
10. **Respect `prefers-reduced-motion`.** Provide a no-motion path. Never autoplay motion that can't be stopped; never flash > 3×/sec.

If a non-negotiable conflicts with the brief, the non-negotiable wins.

---

## 2. DEFAULT DESIGN TOKENS (use unless the brief overrides)

Define these as CSS custom properties (or the framework's token system) at the root. Never scatter raw hex/px values through components — reference tokens.

```css
:root {
  /* ---- NEUTRALS (the workhorse — ~90% of the UI) ---- */
  --bg:        #ffffff;
  --surface:   #f7f7f8;   /* cards, raised areas */
  --surface-2: #efefef;
  --border:    #e4e4e7;   /* dividers, input borders */
  --text:      #18181b;   /* primary text (near-black, NOT #000) */
  --text-muted:#52525b;   /* secondary text (passes 4.5:1 on white) */
  --text-subtle:#71717a;  /* tertiary; use only on large/non-essential text */

  /* ---- BRAND (replace with brief's brand color; keep ONE primary) ---- */
  --primary:        #2563eb;   /* main actions, links */
  --primary-hover:  #1d4ed8;
  --primary-active: #1e40af;
  --primary-weak:   #eff6ff;   /* tinted backgrounds */
  --on-primary:     #ffffff;   /* text on primary; MUST pass 4.5:1 */

  /* ---- SEMANTIC (fixed meanings; do not reuse for brand) ---- */
  --success: #15803d;  --success-weak:#f0fdf4;
  --warning: #b45309;  --warning-weak:#fffbeb;
  --danger:  #b91c1c;  --danger-weak: #fef2f2;
  --info:    #1d4ed8;  --info-weak:   #eff6ff;

  /* ---- SPACING (8pt system; 4 is the half-step) ---- */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --space-9: 96px;

  /* ---- TYPE SCALE (~1.25 ratio) ---- */
  --text-xs: 12px; --text-sm: 14px; --text-base: 16px; --text-lg: 18px;
  --text-xl: 20px; --text-2xl: 24px; --text-3xl: 30px; --text-4xl: 36px;
  --text-5xl: 48px; --text-6xl: 60px;

  --leading-tight: 1.15;  /* headings */
  --leading-normal: 1.5;  /* body */
  --leading-relaxed: 1.65;

  --weight-regular: 400; --weight-medium: 500;
  --weight-semibold: 600; --weight-bold: 700;

  /* ---- RADII ---- */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-full: 9999px;

  /* ---- ELEVATION (tint shadow to the background hue; never pure black) ---- */
  --shadow-sm: 0 1px 2px rgba(24,24,27,.06), 0 1px 1px rgba(24,24,27,.04);
  --shadow-md: 0 4px 12px rgba(24,24,27,.08), 0 2px 4px rgba(24,24,27,.05);
  --shadow-lg: 0 12px 32px rgba(24,24,27,.12), 0 4px 8px rgba(24,24,27,.06);

  /* ---- MOTION ---- */
  --dur-fast: 150ms; --dur-base: 250ms; --dur-slow: 400ms;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);   /* standard ease-out */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ---- LAYOUT ---- */
  --container: 1200px;   /* max content width; center it */
  --measure: 70ch;       /* max line length for reading text */
}
```

**Dark mode (if requested):** invert neutrals (bg → near-black `#0d0d12`, not `#000`), keep the same token names under `@media (prefers-color-scheme: dark)` or a `.dark` class. Re-verify contrast in dark mode separately.

**Generating a brand ramp:** if the brief gives one brand color, derive hover/active by adjusting lightness AND nudging saturation/hue (don't just darken). Verify `--on-primary` text passes 4.5:1; if the brand color is light, use dark text on it.

---

## 3. TYPOGRAPHY RULES

- **Type choice:** use the brief's brand font if given. Otherwise pick ONE intentional family with multiple weights. Good defaults: *Geist, Söhne, General Sans, Outfit, IBM Plex Sans, or system-ui.* Do **not** reach for Inter as an unconsidered default — choose deliberately. Load via `<link>` with `display=swap`.
- **Pair by contrast, not similarity.** If pairing, use serif heading + sans body (or vice versa). Never pair two near-identical sans faces.
- **Max 2 typefaces per project.** More reads as a mistake.
- **Hierarchy via the scale:** headings use `--text-3xl`+ with `--leading-tight` and `--weight-semibold/bold` and slightly tighter letter-spacing; body uses `--text-base/lg` with `--leading-normal`.
- **Max 3–4 distinct text levels visible on one screen.**
- **Line length:** clamp reading text to `--measure` (45–75 chars). Never full-width paragraphs on desktop.
- **Body line height ≥ 1.5.** Headings 1.1–1.2.
- **Never:** body < 16px; ultra-thin weights (100–200) for UI text; ALL-CAPS for long text (only short labels, with +tracking); justified text; pure `#000` on pure `#fff` (use `--text`).
- **Responsive type:** shrink display/headings on mobile (e.g. a 60px hero → ~32–36px). Use `clamp()`:
  `font-size: clamp(2rem, 5vw + 1rem, 3.75rem);`

---

## 4. COLOR RULES

- **Most of the UI is neutral.** Build structure with the gray ramp; color is for attention and meaning, not decoration.
- **One primary/brand color**, used sparingly (CTAs, links, key brand moments). Accent saturation generally < 80%.
- **Semantic colors are fixed:** success=green, warning=amber, danger=red, info=blue. Never repurpose them for branding.
- **Design the layout in grayscale first;** add color last. If hierarchy only works because of color, the hierarchy is broken — fix it.
- **Every color pair must pass contrast** (Section 1). Tinted backgrounds (`*-weak`) pair with the strong variant for text.
- **Never:** more than ~3 hues total (excluding the neutral ramp); gradients behind body text; oversaturated neon; "AI purple/blue glow"; color-only status.

---

## 5. SPACING & LAYOUT RULES

- **Use ONLY the spacing scale** (multiples of 4/8). No arbitrary values like 13px or 27px.
- **Relational spacing:** more space *between* groups than *within* them. Tight gap (`--space-2`) between a label and its field; large gap (`--space-6/7`) between sections. This rhythm IS the structure.
- **Whitespace is a tool, not waste.** When something feels cramped, add space and remove elements. "Premium" = generous spacing.
- **Grid, not flex-math.** Use CSS Grid for layout; never `width: calc(33% - 1rem)` hacks.
- **Cap content width** at `--container` and center it; cap reading columns at `--measure`. Never let content stretch edge-to-edge on wide screens.
- **Alignment is free polish.** Snap everything to shared edges. Most "off" designs are just misaligned by a few pixels.
- **Cards only when elevation communicates grouping/hierarchy.** Don't box everything. Dividers (`border-t`, `divide-y`) or whitespace often beat cards.

---

## 6. VISUAL HIERARCHY RULES

- Decide the **#1 element** of each screen and make it dominant (size + weight + contrast + position + isolation). Everything else steps down.
- **De-emphasize secondary content** (smaller, muted gray) rather than shouting louder with the primary. Hierarchy is relative.
- **Reading patterns:** front-load key info top-left (F-pattern for content; Z-pattern for landing pages). Put the primary CTA where the eye terminates.
- One emphasis level per screen. If everything is bold, nothing is.
- Headings must be scannable and descriptive (users skim headings, not paragraphs).

---

## 7. RESPONSIVE RULES

Mobile-first. Design the smallest screen first; enhance upward.

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | < 640px | single column, full-width, `--space-4` side padding, primary actions in thumb reach (bottom) |
| Tablet | 640–1024px | 2-column where it helps |
| Desktop | 1024–1440px | full grid (up to 12 col), content capped at `--container` |
| Wide | > 1440px | content stays capped + centered; don't stretch |

- **Any asymmetric/multi-column layout MUST collapse to a clean single column on mobile.**
- Test at **320px** — no horizontal scroll, nothing clipped.
- Never fix the overflow by hiding it (`overflow-x:hidden` on body) — fix the offending element.
- Use `min-height: 100svh` (not `100vh`) for full-height sections to handle mobile browser chrome.

---

## 8. COMPONENT SPECS (ship every state)

**Button**
- Variants: primary (filled brand), secondary (outline/subtle), tertiary (text/ghost), destructive (danger).
- States — primary example:
  - default: `--primary` bg, `--on-primary` text, `--radius-md`, padding `--space-3 --space-5`, `--weight-semibold`.
  - hover: `--primary-hover`. focus-visible: 2px ring offset 2px in `--primary`. active: `--primary-active` + `transform: scale(.98)` or `translateY(1px)`.
  - disabled: reduced opacity (~.5), `cursor: not-allowed`, no hover; if disabled for a reason, explain why nearby.
  - loading: inline spinner + keep label or "Saving…"; keep width stable; disable re-submit.
- Min height 44px. One primary per view.

**Text input / form field**
- Always a visible `<label>` (never placeholder-as-label). Placeholder is an example, not the label.
- States: default, focus (visible ring + border color shift), filled, disabled, error (danger border + icon + message below + `aria-invalid` + `aria-describedby`), success.
- Validate inline on blur/submit with specific, kind messages ("Enter a valid email like name@example.com"), not "Invalid input".
- Group related fields; one column for forms; show progress in multi-step flows.

**Card**
- Consistent internal padding (`--space-4/5`), one radius, one elevation level per group. Hover elevation only if interactive (then the whole card is a single link/button).

**Navigation**
- Logo links home. Current page indicated (not color alone). Mobile: accessible menu (proper button + `aria-expanded`, focus trap when open, Esc to close). Keep primary nav ≤ ~7 items (chunk the rest).

**Modal/Dialog**
- Trap focus, return focus on close, Esc closes, click-outside closes (unless destructive), `role="dialog"` + `aria-modal` + labelled title. Scrim behind. Never stack modals.

**Feedback**
- Toasts for transient confirmation; inline messages for contextual errors. Destructive actions require confirmation and are reversible (undo) where possible.

---

## 9. ACCESSIBILITY (WCAG 2.1 AA — enforce, don't bolt on)

- Semantic structure: one `<h1>` per page; headings in order; landmarks (`<header> <nav> <main> <footer>`).
- Every image: meaningful `alt`; decorative images get `alt=""`.
- Every form control: associated `<label>`; errors linked via `aria-describedby`; `aria-invalid` on error.
- Focus visible everywhere; logical tab order; no keyboard traps; skip-to-content link.
- Don't rely on hover to reveal essential actions (fails on touch/keyboard).
- Respect `prefers-reduced-motion`; provide pause/stop for any moving content.
- Use ARIA only when native HTML can't express it; prefer native elements.
- Target contrast AA on text, icons, and focus indicators — including in dark mode.

---

## 10. MOTION RULES

- **Motion explains, it doesn't decorate.** Use it to show state change, causality, and continuity (what happened, what's happening, what's next).
- Animate **only `transform` and `opacity`** for performance. Never animate `width/height/top/left`.
- Durations: micro-interactions `--dur-fast`; transitions `--dur-base`; larger reveals `--dur-slow`. Ease with `--ease`; springy accents with `--ease-spring`.
- Provide **active/press feedback** on every interactive element (`scale(.98)` / `translateY(1px)`).
- Loading = **skeleton loaders shaped like the content**, not generic spinners, for async data.
- Staggered reveals: cap the cascade (`delay = index * 60–80ms`), and gate behind `prefers-reduced-motion`.
- Keep `z-index` to a named system (base, dropdown, sticky, overlay, modal, toast) — no random `z-50`.

---

## 11. ANTI-SLOP RULES (kill the AI-generated look)

These are the patterns that make a site look auto-generated. **Forbidden:**

**Visual**
- ❌ `#000000` or `#ffffff` as the only neutrals — use the tinted ramp.
- ❌ Purple/blue "AI glow", neon outer glows, glowing gradient borders.
- ❌ Gradient text on large headings.
- ❌ Oversaturated accent colors; more than one accent.
- ❌ Generic `box-shadow` that's untinted and identical everywhere.
- ❌ Emoji used as UI icons or decoration in production markup (use a real icon set, e.g. Lucide).
- ❌ Custom JS mouse cursors.

**Layout**
- ❌ Three equal cards in a row as the feature section. Use a 2-col zig-zag, an asymmetric bento grid, or a list with varied emphasis instead.
- ❌ Everything centered. Default to intentional, often asymmetric, alignment (split hero, left content / right asset). Center only when it's the right choice.
- ❌ Identical card grids repeated for every section — give each section its own layout treatment.
- ❌ Pure symmetry everywhere with no focal point.

**Content realism ("don't ship placeholder-brain")**
- ❌ "Lorem ipsum" in the final build — write plausible real copy.
- ❌ Generic names ("John Doe", "Jane Smith") — use varied, realistic names.
- ❌ Round fake numbers ("99.99%", "10,000+ users", "50%") — use organic, specific figures ("47.3% faster", "8,412 teams").
- ❌ Generic brand/company names ("Acme", "Nexus", "SmartFlow") — invent contextual ones from the brief.
- ❌ AI cliché copy: "Elevate", "Seamless", "Unleash", "Supercharge", "Next-gen", "Empower", "Revolutionize", "Game-changing". Use concrete, specific verbs and claims.
- ❌ Broken/hotlinked stock images — use a reliable placeholder (`https://picsum.photos/seed/{keyword}/800/600`) or clean inline SVG, and label them as placeholders.

---

## 12. SECTION PATTERNS (apply when building these)

**Landing page rhythm:** hero → social proof → value/features (varied layouts) → how it works → testimonial/proof → pricing (if any) → final CTA → footer. Each section gets a *distinct* layout. Remove nav links that leak attention from the single conversion goal where appropriate.

**Hero:** clear value proposition (what / who / why care) in the first viewport, one dominant visual, sparse copy, one primary CTA. Avoid centered text floating over a dark photo.

**Dashboard / data:** lead with the one metric that matters; right chart for the question (don't pie-chart everything); give every number context (vs. last period / goal); `font-mono` for figures; status color-coded *and* labeled; skeletons on async; high information density done with dividers, not boxes.

**E-commerce / checkout:** strong product imagery, scannable specs, transparent total price + shipping, trust signals (reviews, returns, secure-payment), **guest checkout enabled**, minimal required fields, visible progress in multi-step flows.

**Forms:** single column, logical grouping, smart defaults, inline validation, clear primary submit, never block on optional fields.

---

## 13. PRE-FLIGHT CHECKLIST (MUST PASS before delivery)

Do not declare the work finished until every box is true. State that you verified them.

**Fundamentals**
- [ ] Exactly one dominant primary action per view.
- [ ] ≤ 3–4 text levels per screen; body ≥ 16px; reading width ≤ ~70ch.
- [ ] Spacing uses only the 4/8 scale; groups separated by larger gaps than internals.
- [ ] Everything aligned to shared edges/grid.

**Color & contrast**
- [ ] Layout reads correctly even in grayscale.
- [ ] Every text/bg pair passes 4.5:1 (3:1 for large text/icons) — in light AND dark mode if dark exists.
- [ ] One brand accent; semantic colors reserved; no meaning by color alone.

**Interaction & states**
- [ ] default / hover / focus-visible / active / disabled / loading / empty / error all implemented where applicable.
- [ ] Skeleton loaders (not spinners) for async data; helpful empty and error states.
- [ ] Destructive actions confirmed and/or reversible.

**Accessibility**
- [ ] Semantic HTML; one ordered heading outline; labels on all inputs; alt on all images.
- [ ] Fully keyboard operable; visible focus ring; logical tab order; skip link.
- [ ] Touch targets ≥ 44px; `prefers-reduced-motion` honored.

**Responsive**
- [ ] Works 320px → wide with no horizontal scroll; asymmetric layouts collapse to single column on mobile; content capped + centered on wide screens.

**Anti-slop**
- [ ] No #000/#fff-only neutrals, no AI-purple glow, no gradient heading text, no emoji-as-icons.
- [ ] No 3-equal-card feature row; sections have varied layouts; not everything centered.
- [ ] No lorem ipsum, no generic names/round fake numbers, no cliché copy ("seamless", "elevate", "unleash"), no broken images.

**System**
- [ ] Colors/spacing/type reference tokens, not scattered magic values.
- [ ] The user brief's brand, content, structure, and vibe are honored; any accessibility override is noted in one line.

---

## 14. ONE-LINE SUMMARY FOR THE AGENT

> Build mobile-first with a token system. Most of the UI is a tinted neutral gray ramp + one brand accent used sparingly. Establish a clear single focal point per screen using a strict type scale and 8pt spacing rhythm. Ship every interaction state with skeleton loaders. Meet WCAG AA and full keyboard access without exception. Use real, specific content. Avoid every AI-generated cliché. Pass the Pre-Flight Checklist before finishing. The user's brief defines *what and how it looks*; this file defines *how to make that craft-perfect*.

*End of specification.*
