# Gorpro

GOR FASHION HOUSE — Lovable Build Prompt

Store type: Printed T-shirt DTC e-commerce

Style: Bold & Urgent (sale-driven, countdown-heavy, IG-ad funnel structure)

Stack: Lovable (React + Tailwind + Supabase)

Paste everything below into Lovable as your build prompt. It's written as one continuous brief so the agent has full context in a single pass.

1. BRAND

Name: Gor Fashion House

Product: Printed t-shirts (graphic tees)

Positioning: "Wear it loud" — bold graphic tees for people who want to stand out, not blend in. Confident, street-adjacent, unapologetic.

Tone of voice: Punchy, short sentences, high energy. Never corporate. Think "drop," "grab yours," "limited," not "explore our collection."

2. COLOUR SYSTEM

Built for urgency without looking like a clearance bin.

Code

Harmony: near-monochrome (black/white) + one hot accent (red) + one warning accent (amber). This is deliberate — a bold red on a black/white base reads as urgent, not messy, because it's the only saturated colour on the page.

Contrast: TEXT-PRIMARY on BASE-WHITE = 19.6:1 (AAA). TEXT-ON-DARK on BASE-BLACK = 17.9:1 (AAA). BRAND-RED buttons always carry white text (not black) — check 4.5:1 minimum.

Never let two "urgency" colours (red + amber) touch on the same element — one flags scarcity (amber = "3 left"), the other flags price/action (red = "buy now, sale ends").

3. TYPOGRAPHY

Code

Type scale (mobile-first, scale up ~1.15x for desktop):

Code

Google Fonts embed:

Code

4. SITE STRUCTURE

Pages

Home — hero, flash sale banner, best sellers grid, trust strip, testimonials, urgency footer CTA

Shop / Collection — filterable grid (size, price, category), sort, sticky filter bar on scroll

Product Detail Page (PDP) — image gallery, size selector, urgency stack, sticky add-to-cart on mobile

Cart — slide-out drawer, not a separate page

Checkout — single-page, minimal fields, trust badges near payment button

About — brand story, short and punchy, not corporate

Contact / Track Order

5. HOME PAGE — SECTION BY SECTION

A. Announcement bar (top, sticky)

Black background, white text, scrolling or rotating messages:

🔥 FLASH SALE — 40% OFF ENDS IN [live countdown] / Free shipping over ₹999 / New drop just landed

B. Hero

Full-bleed lifestyle photo (person wearing the tee, high contrast). Overlaid:

Eyebrow label: "NEW DROP" (amber badge)

H1: bold 2-line headline in Archivo Black

Subtext: one line, no fluff

Two CTAs: primary (red, filled) "Shop Now" + ghost (white outline) "View Collection"

Small countdown timer under CTAs if hero ties to a sale

C. Flash Sale Strip

Full-width red band. Live countdown (days:hours:min:sec) + "SHOP THE SALE" button. This is the single loudest visual moment on the page — everything else stays calmer so this doesn't have to compete.

D. Best Sellers Grid

4-col desktop / 2-col mobile. Each card:

Product image (hover = second image, garment detail)

"🔥 Bestseller" or "Only 4 left" badge (amber) — only show real, not decorative, scarcity

Name, price with strikethrough MRP if discounted

Quick-add button appears on hover (desktop) / always visible (mobile)

E. Trust Strip

Icon row: Free Shipping / 7-Day Returns / Secure Payment / COD Available (if applicable in India). Keep icons thin-stroke, single colour, don't compete with product photography.

F. Social Proof

Customer photo grid ("tag us @gorfashionhouse") + 2-3 short review snippets with star ratings (amber stars).

G. Urgency Footer CTA

Black band, white text: "Drop ends soon. Don't wait." + red button.

6. PRODUCT DETAIL PAGE (PDP)

Gallery: vertical thumbnail strip (desktop) / swipeable carousel (mobile), pinch-zoom on tap

Urgency stack directly under price, top to bottom:

Price with strikethrough MRP + "SAVE ₹XXX" red badge

Stock urgency: "Only 3 left in your size" (amber, only if genuinely low — never fake this)

Countdown: "Sale ends in [timer]" if applicable

Social proof line: "★★★★★ 4.8 (312 reviews)"

Size selector: pill buttons, sold-out sizes shown greyed with strikethrough (never hidden — builds trust)

Size guide link: opens modal, doesn't navigate away

Add to Cart: full-width red button, becomes sticky at bottom of viewport on scroll (mobile especially — this is the single highest-leverage urgency element on the page)

Description: fabric, fit, print method, wash care — collapsible accordion

Reviews: below fold, with photo reviews prioritized above text-only

7. MICRO-INTERACTIONS

Code

8. ANIMATION RULES

Philosophy: fast and confident, not decorative. Nothing lingers past 300ms except the countdown itself.

Entrance: fade + 16px translateY, 400ms ease-out, stagger 60ms across grid cards

Hover on product cards: scale 1 → 1.03, 200ms, plus image crossfade to second photo

Only animate transform and opacity — never animate width/height/box-shadow directly (use a pre-rendered shadow layer that fades in instead)

Countdown digits: use a flip/roll transition, not a plain re-render — this is the signature motion moment of the whole store

9. WHAT TO AVOID (failure modes for this category)

Generic Shopify-template look: centered logo, thin serif headings, pastel colours — this brand is bold, not boutique

Overusing red — if everything is urgent, nothing is. Reserve red strictly for price/CTA/sale; amber strictly for scarcity/rating

Fake countdowns that reset on refresh — if you can't wire a real end-time, don't fake urgency the user can catch

Cluttered PDP — one primary CTA per screen, urgency stack in one place, not scattered

10. BUILD ORDER FOR LOVABLE

Set up Tailwind config with the colour tokens and font imports above

Build layout shell: announcement bar, header/nav, footer

Build Home page sections in order (A→G above), static first

Build Shop/Collection grid + filters

Build PDP with urgency stack and sticky mobile ATC

Build cart drawer + checkout flow

Wire Supabase: products table, inventory count (for real stock badges), orders table

Add animations pass (entrance → hover → sticky/scroll behaviors)

Add live countdown logic (store sale end-time in Supabase, not hardcoded)

Mobile QA pass — sticky ATC bar, swipeable gallery, tap targets ≥44px

Contrast check every text/background pair

Final polish — remove any badge or element that isn't doing real work

11. SAMPLE COPY (adapt freely)

Hero H1: "Loud Tees.\nLouder Attitude."

Sale banner: "FLASH DROP — UP TO 40% OFF"

CTA: "Grab Yours Before It's Gone"

Scarcity: "Only 3 left — restock not guaranteed"

About teaser: "Gor Fashion House isn't for blending in. Every print's a statement."

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c252e268-52cc-4e86-bd7c-76df241d34a3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
