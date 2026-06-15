# Fakenews5 — Session Status

> Read this at the start of every session: **"Read STATUS.md and continue."**
> Update ## In progress and ## Next up before ending each session.

---

## Last session

**Date:** 2026-06-15
**Branch:** `fix/author-must-be-registered` (PR #68 open, not yet merged)

---

## What's been built (merged to main)

### Peter's work

- ✅ Newspaper landing page layout (hero + side column + Latest News + Most Popular + sidebar)
- ✅ Live weather widget — Open-Meteo, Linköping, refreshes every 10 min
- ✅ Live markets widget — OMX Stockholm 30 (Nasdaq), EUR/SEK + USD/SEK (Frankfurter), Electricity SE3
- ✅ New components: HeroCard, NewsCard, SidebarCard, SectionHead, WeatherWidget, MarketsWidget, NewsSidebar
- ✅ API routes: `/(api)/weather`, `/(api)/markets`
- ✅ CLAUDE.md + STATUS.md added to repo
- ✅ Dark/light mode toggle with ripple animation + anti-flash `<head>` script
- ✅ Header + navbar sticky (z-50)
- ✅ Landing page aligned to shadcn design tokens
- ✅ Footer: auth-aware Register/My Page links, admin redirect, Privacy/ToS/Advertise links
- ✅ Privacy Policy page (`/legal/privacy`) + Terms of Service page (`/legal/tos`)
- ✅ Advertise page (`/advertise`) — audience stats, formats & rates table, contact CTA
- ✅ Article page: `next/image` dimensions fix (fill + relative container)
- ✅ Windows `pnpm dev` fix via `cross-env` (PR #56)
- ✅ Footer gap removed (PR #58)

### Team's work (merged to main)

- ✅ Auth: register, sign-in, forgot-password, email verification
- ✅ Article CRUD: create, view, edit, reactions, bookmarks, views, comments + replies
- ✅ Paywall: `auth.api.userHasPermission` check; non-subscribers redirected to `/preview`
- ✅ Admin dashboard: charts (line, bar, pie), user counts, top commenter, article stats
- ✅ User dashboard: account page, edit profile, change email/password
- ✅ Article table with editor's choice toggle + soft-delete (`removed-from-site`)
- ✅ User management table + per-user edit (includes Author alias field)
- ✅ Admin plans page (`/dashboard/admin/plans`) — create/edit/delete subscription plans
- ✅ Subscription system — user can subscribe, cancel, restore; history page
- ✅ Public subscriptions page (`/subscriptions`) listing active plans
- ✅ Search params update (PR #69)
- ✅ Auto-create Author on publish (PR #67) — **superseded by PR #68**

---

## In progress

### Branch: `fix/author-must-be-registered` — PR #68 (open)

- ✅ `add-article-action`: requires existing Author profile; returns clear error if none
- ✅ Co-authors typed in form only connected if already registered — no auto-create
- ✅ `/dashboard/admin/authors` — admin page to register/edit alias/remove authors
- ✅ `permissions.ts` — added `"author"` role (create + read + comment + like/dislike)
- ✅ Registering an author atomically sets `User.role = "author"`; removing reverts to `"user"`
- ✅ "Authors" link added to admin navbar

### Local uncommitted changes on `main` (need to be branched + PRed)

These files have local edits that were not committed — they should go on a new branch:
- `src/components/header.tsx` — `bg-[#2d2d2d]` → `bg-foreground` (design token fix)
- `src/app/about/page.tsx` — unknown team edit
- `src/app/contact/ContactForm.tsx` — unknown team edit
- `src/app/cookies/cookies.tsx` — unknown team edit
- `src/components/navbar/_components/login-register-buttons.tsx` — unknown team edit

---

## Next up

### Immediate
- [ ] Merge PR #68 (`fix/author-must-be-registered`)
- [ ] Branch + PR the local uncommitted changes above

### Bugs / gaps

- [ ] **`add-article` redirect after submit** — currently goes to `/` (home). Should go to `/article/${newId}`.
- [ ] **Author field in add-article form** — still a free-text input for co-authors. Could become a dropdown of registered authors.
- [ ] **Migration history broken (GitHub issue #44)** — `prisma migrate deploy` wants to wipe DB. Use `prisma db push` until fixed.

### Project requirements still to build

- [ ] **Stripe live integration** — `priceId` fields are in the schema; payment flow not wired
- [ ] **Cookie consent banner** — cookies page exists but no consent gate
- [ ] **AI functionality** — generate article drafts or images (OpenAI/Anthropic key needed)
- [ ] **Category pages** — nav links exist but category listing pages not built
- [ ] **Image upload** — articles take a URL; Uploadthing or Cloudinary for direct upload

### Nice to have

- [ ] `isMostPopular` badge on news cards
- [ ] Weather icon animations
- [ ] Markets widget sparkline chart (OMX)

---

## Known issues

| Issue | Status | Fix |
|---|---|---|
| `UserInfo.role` in schema crashes app | Recurring after each pull | Remove from schema, `pnpm prisma generate`, clear `.next` |
| `prisma migrate dev/deploy` wants to reset DB | Not fixed (issue #44) | Use `pnpm prisma db push` instead |
| `malloc: pointer being freed was not allocated` on M1 | Fixed locally | `"dev": "MallocNanoZone=0 next dev"` in `package.json` (local only) |
| OMX data only live during market hours | By design | Shows `–` outside trading hours |

---

## Git state

```
main                           ← up to date with origin/main (pulled 2026-06-15)
fix/author-must-be-registered  ← active branch, pushed, PR #68 open
```

## Local environment

- **Project path:** `/Users/petedw/Documents/GR18-Lexicon/Project 2 - News/fakenews5`
- **Docker container:** `postgres_sv` must be running (port 5434, password `Merkava`)
- **Run dev:** `pnpm dev` — uses `MallocNanoZone=0 next dev` (local fix in `package.json`, do not commit)
- **Browser for dev:** Firefox (Safari has localhost cookie issues)
- **Alpha Vantage key:** in `.env` as `ALPHAVANTAGE_API_KEY` (not currently used — OMX via Nasdaq instead)
