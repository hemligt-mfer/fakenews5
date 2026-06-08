# Fakenews5 — Session Status

> Read this at the start of every session: **"Read STATUS.md and continue."**
> Update ## In progress and ## Next up before ending each session.

---

## Last session

**Date:** 2026-06-08
**Branch:** `fix/article-page-and-paywall` (pushed, PR not yet created)

---

## What's been built (merged to main)

### Peter's work

- ✅ Newspaper landing page layout (hero + side column + Latest News + Most Popular + sidebar)
- ✅ Live weather widget — Open-Meteo, Linköping, refreshes every 10 min
- ✅ Live markets widget — OMX Stockholm 30 (Nasdaq), EUR/SEK + USD/SEK (Frankfurter),
  Electricity SE3 (Elprisetjustnu.se), all with % change vs previous period
- ✅ New components: HeroCard, NewsCard, SidebarCard, SectionHead, WeatherWidget, MarketsWidget, NewsSidebar
- ✅ API routes: `/(api)/weather`, `/(api)/markets`
- ✅ CLAUDE.md + STATUS.md added to repo
- ✅ Dark/light mode toggle with ripple (circle reveal) animation
- ✅ Anti-flash `<head>` script — prevents wrong theme on reload
- ✅ Header + navbar both sticky (z-50) — never scroll behind images
- ✅ Landing page aligned to shadcn design tokens — all hardcoded `#c8a84b` replaced with `text-primary`; raw `<input>`/`<button>` replaced with shadcn `Input`/`Button`; `<hr>` replaced with shadcn `Separator`

### Team's work (merged to main)

- ✅ Auth: register, sign-in, forgot-password, email verification
- ✅ Article CRUD: create, view, edit, reactions (like/dislike), bookmarks, views, comments + replies
- ✅ Admin dashboard: charts (line, bar, pie), user counts, top commenter, article stats (#36)
- ✅ User dashboard: account page (#35)
- ✅ Article table with editor's choice toggle
- ✅ User management table
- ✅ Nested comments + reply form (#37)
- ✅ Admin navbar moved into root layout (#41)
- ✅ Hydration fix (#40)
- ✅ Reactions bug fixed — users can now react to multiple articles
- ✅ Paywall infrastructure — `auth.api.userHasPermission` with `article: ["read"]` permission check in article page (redirect commented out until subscription system is live)

---

## In progress

### Branch: `fix/article-page-and-paywall` (not yet merged)

- ✅ Fixed blank article page for logged-in users (`getUserId()` returns `false`/`undefined` — both falsy; article now always rendered, user-specific code guarded by `typeof userId === "string"`)
- ✅ Integrated team's paywall infrastructure into article page (session + permission check)
- ✅ Restored dark mode + sticky header in `layout.tsx` after bad auto-merge overwrote it
- ✅ Fixed `CommentReaction` table missing `userInfoId` column — added via `prisma db push` (was causing "Couldn't find article" for all articles)
- ✅ CLAUDE.md updated: db push workaround, migration history warning, malloc fix
- ✅ GitHub issue #44 opened: broken migration history — `prisma migrate dev/deploy` will offer to wipe DB, use `prisma db push` instead
- ✅ Added `priority` to logo `<Image>` in header (fixes Next.js LCP warning)
- ✅ About page created (`src/app/about/page.tsx`)
- ✅ Article page refactored to fetch article + session in parallel (`Promise.all`); eliminated triple `getArticle` call (was causing crash on M1 Mac under Turbopack)
- ✅ `--no-turbopack` added to local dev script (fixes `malloc: pointer being freed was not allocated` crash on M1)

### Known schema issue (still not fixed in main)

- `UserInfo.role` field is still in `schema.prisma` but was dropped from the database by migration
- After every pull: check if `role Role @default(UNSUBSCRIBED)` is back in UserInfo — if so, remove it and run `pnpm prisma generate` + clear `.next`
- Fix is on branch `fix/remove-userinfo-role` — needs team to merge

---

## Next up

### Open PRs waiting for merge
- [ ] `fix/article-page-and-paywall` — create PR for this branch (covers all fixes above)
- [ ] `fix/remove-userinfo-role` — removes role from UserInfo schema

### Bugs to fix

- [ ] **`add-article` author field** — article is created with no author if the typed alias doesn't match exactly. Should show a dropdown of existing authors instead of a free-text input.
- [ ] **`add-article` redirect after submit** — currently redirects to `/` (home). Should redirect to the new article's page using `router.push(\`/article/${result.data}\`)`.
- [ ] **Migration history broken (GitHub issue #44)** — one team member needs to follow issue steps to recreate the baseline migration so `prisma migrate deploy` works again.

### Project requirements still to build

- [ ] **Subscription system** — "Subscribe Now" for unsubscribed users, credit card validation (Zod), Stripe integration (`stripe` CLI is installed at `~/.local/bin/stripe`)
- [ ] **My page / user profile** — edit profile, reset password, view subscriptions, personalised newsletter signup
- [ ] **Cookie consent / privacy page**
- [ ] **AI functionality** — generate article drafts or images (OpenAI/Anthropic key needed)
- [ ] **Category pages** — wire up nav links (Ekonomi, Inrikes, Väder, Utrikes, Sports subcategories)
- [ ] **Image upload** — currently articles take a URL; could add Uploadthing or Cloudinary for direct upload

### Nice to have

- [ ] Add `isMostPopular` badge on news cards
- [ ] Weather icon animations
- [ ] Markets widget: add OMX chart (sparkline)

---

## Known issues

| Issue | Status | Fix |
|---|---|---|
| `UserInfo.role` in schema crashes app | Recurring after each pull | Remove from schema, `pnpm prisma generate`, clear `.next` |
| `prisma migrate dev/deploy` wants to reset DB | Not fixed (issue #44) | Use `pnpm prisma db push` instead — preserves data |
| `malloc: pointer being freed was not allocated` on M1 | Fixed locally | `"dev": "MallocNanoZone=0 next dev --no-turbopack"` in `package.json` (local only) |
| OMX data only live during market hours | By design | Shows `–` outside trading hours |
| `commentary-section.tsx` TS error (missing `Role` enum) | Not fixed | Tied to `fix/remove-userinfo-role` PR |
| `calendar.tsx` TS error (`table` not in ClassNames) | Not fixed | shadcn/ui version mismatch — low priority |

---

## Git state

```
main                           ← fully up to date with origin/main
fix/article-page-and-paywall   ← active branch, pushed, PR not yet created
fix/remove-userinfo-role       ← pushed, PR open, not merged yet
feature/dark-mode-toggle       ← merged into main ✅ (PR #42)
feature/landing-page-cards     ← merged into main ✅
```

## Local environment

- **Project path:** `/Users/petedw/Documents/GR18-Lexicon/Project 2 - News/fakenews5`
- **Docker container:** `postgres_sv` must be running (port 5434, password `Merkava`)
- **Run dev:** `pnpm dev` — uses `MallocNanoZone=0 next dev --no-turbopack` (local fix in `package.json`, do not commit)
- **Browser for dev:** Firefox (Safari has localhost cookie issues)
- **Alpha Vantage key:** in `.env` as `ALPHAVANTAGE_API_KEY` (not currently used — OMX via Nasdaq instead)
