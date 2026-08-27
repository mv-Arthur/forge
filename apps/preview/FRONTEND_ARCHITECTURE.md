# Preview Frontend Architecture

Adapted from Playground frontend architecture. Ownership model only — this
app has no admin/stands split, no React Query, and no external UI kit.

See [`README.md`](./README.md) for the product scope.

## Scope

Frontend implementation:

- `src/app/**` — route shells
- `src/actions/catalog/**`, `src/actions/hero/**`, `src/actions/leads/**`
- `src/widgets/**`
- `src/ui/**` — local primitives (Container, Icons)
- `src/lib/**` — pure frontend helpers
- `src/types/**`

Backend-adjacent (not walked as widgets):

- `src/server/**` — fixture catalog + hero payload
- `data/fixtures/**`

**What FA is about:** widgets (smart container + dumb markup). Route shells
stay thin. Server actions are the UI↔data seam. `src/server/**` is not a
widget.

## Preview exceptions (intentional)

- **No React Query.** Reads are fixture-backed and happen in RSC pages.
  Pages call server actions, pass data as props. Containers own UI state
  only (filters, sliders, forms, menus). No `.keys.ts` until a widget
  actually has a query.
- **No `@pavelignatev/lib-ui`.** Primitives live in `src/ui/**`.
- **BEM `__` client islands** may carry `'use client'` and hooks (gallery
  index, image `onError`, carousel chrome). They must not import React
  Query, `fetch`, `@/actions/*`, or `.container`.

No other frontend drift is accepted.

## 1. Frontend Ownership

### `src/app/` — route shell

Allowed: `layout.tsx`, `page.tsx`, metadata, `notFound()`, composition of
widget containers (and dumb widgets).

Not allowed: business rules, `@/server/*`, fixture JSON, reusable UI
markup, `'use client'`.

### `src/actions/` — UI data boundary

- entrypoint files carry `'use server'` and import `server-only`
- expected failures return `ActionResult<T>` from `@/types/action`
- DTOs live in sibling `*.types.ts`
- actions call `@/server/*`; they do not import widgets, app routes, or React
- `src/app` does not import `@/server/*`

### `src/widgets/` — feature UI

Widget files:

- `<widget>.container.tsx` — smart client container (when the feature has
  UI state)
- `<widget>.tsx` and `__element/<widget>__element.tsx` — dumb markup
- `<widget>.types.ts`, `lib/*.ts` — local types and pure helpers

### `src/lib/` — shared pure helpers

- `.ts` only, no JSX, no actions, no network, no raw fixtures
- Promote here only when used by two or more owners

### `src/ui/` — primitives

Dumb building blocks (Container, Icons). No data fetching, no actions.

## 2. Widget Anatomy

### Container

Owns `'use client'`, local UI state, handlers, loading/error interpretation
for the widget. Passes data and callbacks into a dumb root. Does not render
another container. Cross-widget composition happens in route files.

### Dumb components

- no `'use client'` (except BEM `__` client islands)
- no React hooks (same island exception)
- no `fetch`, no `@/actions/*`, no `.container`
- receive all data and callbacks through props

## 3. BEM Structure Naming

```text
widgets/project-detail/
  project-detail.tsx
  project-detail.types.ts
  __gallery/
    project-detail__gallery.tsx
```

Do not chain `__` in file names. Folder nesting shows hierarchy.

## 4. Data Path

1. RSC page calls a server action
2. action returns `ActionResult<T>`
3. page unwraps `success` (or throws on unexpected failure)
4. widget container / dumb tree receives props

Writes (lead form): container calls `submitLead`. Expected failures return
`{ success: false, error }`. Persistence is out of scope (fake success).

## 5. Enforcement

```bash
npm run arch:check
```

runs `node ./scripts/check-frontend-architecture.mjs`. `npm run assert:demo`
includes the guard.
