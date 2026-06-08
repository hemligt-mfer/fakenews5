# Fakenews5 — Claude Code Reference

## Project
Swedish news website built with Next.js 16, React 19, TypeScript, Tailwind CSS v4.
School project at Lexicon GR18. Team repo: https://github.com/hemligt-mfer/fakenews5

## Key rules
- **Never push directly to `main`** — always work on a branch, push the branch, open a PR
- **After pulling, always run `pnpm prisma db push && pnpm prisma generate`** — ⚠️ `prisma migrate deploy` does NOT work (migration history is broken, see Database section below)
- **Clear `.next` only when the dev server is stopped** — never while it is running
- `package.json` dev script has a local-only fix (`MallocNanoZone=0 next dev --no-turbopack`) — do not commit it
- `prisma/schema.prisma` must NOT have `role` in the `UserInfo` model — the migration dropped it but the team forgot to update the schema. Re-remove it after every pull if it reappears.

## Local dev setup
- **Database:** PostgreSQL 17 in Docker, container `postgres_sv`, port `5434`, password `Merkava`
- **Start DB:** Docker Desktop must be running; only `postgres_sv` needs to be running
- **Run:** `cd /Users/petedw/Documents/GR18-Lexicon/Project_2_News/fakenews5 && pnpm dev`
- **URL:** http://localhost:3000
- **.env location:** `fakenews5/.env` (gitignored, never commit)

## .env contents (local)
```
DATABASE_URL=postgresql://postgres:Merkava@localhost:5434/fakenews5
BETTER_AUTH_SECRET=He4vgL7QHDYaOJbAvqRWEGnW8lmtLLfg
BETTER_AUTH_URL=http://localhost:3000
ALPHAVANTAGE_API_KEY=MMAU1SBG9AA15UFB
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT="587"
SMTP_USER="charlie.oconner42@ethereal.email"
SMTP_PASS="weT4wHztKm2nYrBVTy"
```

## Tech stack
| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.6, App Router, Turbopack |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL 17 (Docker) |
| ORM | Prisma v7 with `@prisma/adapter-pg` |
| Auth | Better Auth v1 (email/password, admin plugin) |
| UI components | shadcn/ui + Radix UI |
| Forms | TanStack Form + Zod v4 |
| Email (dev) | Nodemailer → Ethereal (fake inbox) |
| Package manager | pnpm |

## Database
- **Schema:** `prisma/schema.prisma`
- **Migrations:** `prisma/migrations/` — ⚠️ **history is broken** (the `init` migration was deleted in a merge). `prisma migrate deploy` and `prisma migrate dev` will fail with a drift error. Use `prisma db push` instead (see below).
- **Sync schema to DB:** `pnpm prisma db push` — safe, preserves data, works despite broken migration history
- **Regenerate client:** `pnpm prisma generate`
- **DO NOT use:** `pnpm prisma migrate deploy` or `pnpm prisma migrate dev` — these will report massive drift and offer to reset (wipe) the database
- **Known issue:** `UserInfo.role` was dropped by migration but team keeps adding it back to schema — always remove it and regenerate
- **Set user as admin:** `docker exec postgres_sv psql -U postgres -d fakenews5 -c "UPDATE \"user\" SET role = 'admin' WHERE email = 'your@email.com';"`
- **Fix needed (GitHub issue #44):** Migration history needs a baseline recreation so `migrate deploy` can work again — see the issue for instructions

## Folder structure
```
src/
  app/
    page.tsx                        ← Landing page (newspaper layout)
    layout.tsx                      ← Root layout (header, navbar, sidebar)
    (api)/(auth)/                   ← Auth routes (register, sign-in, verify, forgot-password)
    api/weather/route.ts            ← Live weather API (Open-Meteo, Linköping)
    api/markets/route.ts            ← Live markets API (OMX, EUR/SEK, USD/SEK, Electricity SE3)
    article/[articleID]/            ← Single article page
    article/[articleID]/edit/       ← Edit article page
    article/add-article/            ← Create article page
    dashboard/admin/                ← Admin dashboard (charts: line, bar, pie, user counts)
    dashboard/admin/_actions/       ← chart-actions.ts (data for charts)
    dashboard/admin/_components/charts/ ← bar-chart, line-chart, pie-chart, user-counts
    dashboard/user/                 ← User dashboard / account page
  components/
    hero-card.tsx                   ← Large featured article (Editor's Choice)
    news-card.tsx                   ← Multi-size card (hero/medium/small/text)
    sidebar-card.tsx                ← Stacked sidebar article card
    section-head.tsx                ← Gold-ruled section divider
    weather-widget.tsx              ← Live weather widget (client component)
    markets-widget.tsx              ← Live markets widget (client component)
    news-sidebar.tsx                ← Sidebar (weather + markets + most read + newsletter)
    header.tsx                      ← Site masthead
    navbar/                         ← Desktop navbar + mobile sidebar
  _actions/
    article-actions.ts              ← getArticles, getArticle, getEditorsChoiceArticles,
                                       getMostPopularArticles, reactions, bookmarks, views
    user-actions.ts                 ← getUserId, setUserInfo, isEmailAddressUsed
  lib/
    auth.ts                         ← Better Auth config (email/password, admin plugin)
    prisma.ts                       ← Prisma singleton client
    permissions.ts                  ← Role-based access control (admin/editor/user)
```

## Key patterns

### Permission check (protected pages)
```typescript
const session = await auth.api.getSession({ headers: await headers() });
if (!session) return redirect("/");
const hasPermission = await auth.api.userHasPermission({
    body: { userId: session.user.id, permissions: { article: ["create"] } },
});
if (!hasPermission.success) redirect("/");
```

### Server action pattern
```typescript
"use server";
export async function myAction(): Promise<Result<string>> {
    try {
        // ...
        return { success: true, data: "..." };
    } catch (err) {
        console.error("[myAction error]", err);
        return { success: false, error: `${err}` };
    }
}
```

### getUserId
Returns the `UserInfo.id` (NOT `User.id`) — used for all article/comment/bookmark queries.
Returns `false` if not logged in, `undefined` if logged in but no UserInfo record.

## Roles & permissions
| Role | Can do |
|---|---|
| UNSUBSCRIBED | Read articles only |
| SUBSCRIBER | Read + comment + like |
| AUTHOR | Create articles |
| EDITOR | Create + update + delete + editor's choice |
| ADMIN | Everything + user management |

Roles live on the `User.role` (Better Auth) field, NOT on `UserInfo` (that column was dropped).

## Active branches
| Branch | Purpose |
|---|---|
| `main` | Team's main branch — never push directly |
| `feature/landing-page-cards` | ✅ Merged into main |
| `fix/remove-userinfo-role` | Removes role from UserInfo schema — PR open, not merged |
| `comments` | Team branch, in progress |

## Common problems & fixes

| Problem | Fix |
|---|---|
| `column "role" does not exist` | Remove `role` from `UserInfo` in schema.prisma, run `pnpm prisma generate`, clear `.next` |
| Blank article page / "Couldn't find article" | Schema out of sync — run `pnpm prisma db push && pnpm prisma generate`, clear `.next` |
| `prisma migrate dev` wants to reset the database | ⚠️ Do NOT reset — migration history is broken. Use `pnpm prisma db push` instead |
| `prisma migrate deploy` reports drift | Same cause — use `pnpm prisma db push` until the migration history is fixed (see issue #44) |
| Turbopack workspace root warning | `next.config.ts` must have `turbopack: { root: __dirname }` |
| `MallocStackLogging` spam | `~/.zshrc` has `export MallocNanoZone=1` — open a new terminal |
| `malloc: pointer being freed was not allocated` crash (M1) | Turbopack native module heap corruption. Fix: `"dev": "MallocNanoZone=0 next dev --no-turbopack"` in `package.json` (local only, do not commit) |
| Computer slow / out of RAM | Quit Teams + DeepL; only run `postgres_sv` Docker container |
| `pnpm dev` won't start | Stop dev server first, then `rm -rf .next`, then restart |
| Hydration mismatch from ProtonPass / password manager | Add `suppressHydrationWarning` to the div wrapping the email input |
