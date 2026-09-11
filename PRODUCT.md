# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who find Expenses or AURA on Instagram and tap the bio link to install the app. Secondary: store reviewers and invitees who land on policy, support, and group-invite URLs.

## Product Purpose

gLitCh Labs is a small studio shipping focused, privacy-minded software. This repository is the public studio site and store-facing assets on GitHub Pages. Expenses is the live product: local-first personal and shared expense tracking, with optional sign-in to sync. AURA is Vedic astrology — charts, predictions, Porutham, and Tamil calendar.

Success for an Instagram bio page: a visitor understands which product this is and reaches a live store tap in one gesture.

## Positioning

A private pocket ledger that stays out of the way — local-first first, sync optional. Not a hype-driven finance social app.

## Operating Context

Studio and product pages ship as static HTML on GitHub Pages (`acoaria4.github.io/gLitCh-Labs-Releases`). Instagram in-app browser is the primary viewport for `expenses/get/` and `aura/get/`. Store consoles point at stable policy/support/deletion/invite paths under `expenses/` and `aura/privacy.html`.

## Capabilities and Constraints

- Expenses Android: Google Play listing `com.glitchlabs.expenses` (beta).
- Expenses iOS: TestFlight join URL `https://testflight.apple.com/join/HnCTs7QU` (beta). There is no `apps.apple.com` listing in this repo.
- AURA iOS: TestFlight join URL `https://testflight.apple.com/join/xzZr5UCK` (beta). There is no `apps.apple.com` listing in this repo.
- AURA Android: Play Open testing is not unlocked; the bio page’s Play control stays blocked until a listing URL exists.
- Deep links: `com.glitchlabs.expenses://invite/…` via `expenses/invite.html`.
- Stack is already static HTML/CSS/JS; no build step.
- Instagram landings must not be linked from the studio or product marketing pages.
- Do not rename store-linked paths (`privacy`, `support`, `delete-account`, `invite`).

## Brand Commitments

- Studio name: `gLitCh Labs` (exact casing).
- Product names: Expenses, AURA.
- Voice: calm, precise, unhurried — product-first, not hype. Prefer “local-first”, “optional”, “calm”.
- Assets: `assets/expenses-icon.png`, `assets/expenses-wordmark.png`, `assets/glitchlabs-icon.png`, `assets/aura-icon.png`, `aura/get/aura-mark.png`.
- Visual system already lives in `DESIGN.md` / `css/styles.css`; product bios may retint tokens from the product (AURA: ink `#05060f`, gold `#d4af37`, Cinzel wordmark).

## Evidence on Hand

- Product copy on `expenses/index.html`, `aura/index.html`, and `index.html`.
- Live store URLs on `expenses/index.html` and `aura/get/` (AURA TestFlight).
- Marks in `assets/` and `aura/get/aura-mark.png`. No testimonials, ratings, or download counts — do not invent them.

## Product Principles

- Marks lead; headlines support.
- One job per surface.
- Claims stay uninventable; beta status stays visible.
- Privacy and local-first are product facts, not slogans.
