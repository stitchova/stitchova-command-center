# Stitchova Command Center

PROJECT: Stitchova Admin Dashboard — UI/UX Design

CONTEXT

I already have the Stitchova mobile app UI/UX designed in this same Lovable account. 

Before starting, review the existing Stitchova design system (colors, typography, 

spacing, iconography, component style) and carry it through consistently into this 

admin web dashboard. This is not a separate brand — it's the back-office control 

panel for the same product, so it should feel like a natural extension of the 

Stitchova identity, adapted for a data-dense desktop web interface.

Also use the skill installed from https://github.com/tenfoldmarc/website-builder-setup.git 

for the project setup and structure conventions.

REFERENCE

I'm uploading a reference image (a finance dashboard, "Finnova") purely for LAYOUT 

and INFORMATION ARCHITECTURE inspiration — not for colors or branding. Study its 

structure:

- Left/top navigation with clear section tabs

- Compact stat cards summarizing key metrics at a glance (icon, label, big number, 

  trend indicator)

- A two-column working layout: a scrollable list/table on the left, a detail panel 

  on the right that updates based on selection

- Filter bar above data tables (dropdowns + search)

- Status pills/badges (color-coded) for quick scanning

- Clean whitespace, rounded cards, soft shadows, minimal borders

Adapt this structure to Stitchova's brand colors and visual language — do not copy 

Finnova's color palette or copy.

GOAL

Design a clean, professional, data-clear admin dashboard for the Stitchova team 

(founders/ops) to monitor and manage the platform. This is an internal tool — 

prioritize clarity and speed of scanning information over decorative flourishes, 

but it should still feel premium and on-brand, not generic.

CORE PAGES TO DESIGN

1. Overview / Home

   - Stat cards: Total designers, Active this week, Total revenue (this month), 

     New signups (this month)

   - Simple line/bar chart: signups over time

   - Recent activity feed (new signups, new orders, payments)

2. Users

   - Tabbed or filterable list: Designers / Clients / Workers

   - Table columns: name, phone, plan, status, last active, signup date

   - Search + filter (status, plan)

   - Click a row → detail panel/page showing that user's profile, their 

     measurements/orders/payments (support view)

3. Revenue

   - Stat cards: total revenue, active paying subscribers, outstanding payments

   - Transaction table: user, amount, date, status

   - Simple revenue-over-time chart

4. Orders (platform-wide)

   - Table of all orders: client, designer, status (cutting/sewing/fitting/completed), 

     due date

   - Status filter, stuck-order flag (no update in X days)

5. Content Control

   - Simple form to edit pricing tiers (free vs paid features, price)

   - Announcement/banner composer (text + publish toggle) — this pushes live to 

     the mobile app

   - Featured designers toggle list (if applicable)

6. Support Tools

   - User lookup with quick actions: suspend account, reset password

   - Simple flagged-issue/complaint list

DESIGN DIRECTION

- Base the UI on Stitchova's existing design tokens (pull colors, type scale, 

  button/input styles directly from the mobile app design already in this account)

- Add subtle glassmorphism ONLY to: the top navigation bar, stat cards on the 

  Overview page, and the detail side-panel on the Users page — soft frosted-glass 

  backgrounds (light blur + translucency + thin light border), not applied to 

  dense data tables where it would hurt readability

- Keep data tables and forms flat, high-contrast, and highly legible — no 

  transparency there

- Status indicators: color-coded pills (paid/free, active/inactive, order stages)

- Responsive down to a standard laptop width (1280px) — this is a desktop-first 

  internal tool, mobile optimization is not a priority

DELIVERABLE

Build this as a working, navigable web app prototype with real component states 

(not just static screens) — sidebar/nav, at least the Overview and Users pages 

fully built out with sample data, other pages can be structural placeholders I'll 

flesh out next.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/861c60cb-58f2-4a1c-9488-ad0a4c526b19).

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
