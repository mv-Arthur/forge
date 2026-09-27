# Preview Frontend Architecture

Ownership model. Route shells stay thin. Widgets are smart container + dumb markup. Server actions are the UI↔data seam.

## Folders

| Path | Owns |
|------|------|
| `src/app/**` | route shells |
| `src/actions/**` | UI data boundary |
| `src/widgets/**` | feature UI |
| `src/ui/**` | primitives (Container, Icons) |
| `src/lib/**` | pure helpers |
| `src/fonts/**` | `fontManager` |
| `src/styles/**` | tokens, chrome, reset |
| `src/server/**` | fixtures / payload, not widgets |

No React Query. No external UI kit. Reads happen in RSC pages: page calls an action, passes props. Containers own UI state only (filters, sliders, forms, menus).

## `src/app/` — route shell

Allowed: `layout.tsx`, `page.tsx`, metadata, `notFound()`, compose widget containers (and dumb widgets).

Not allowed: `@/server/*`, fixture JSON, reusable markup, `'use client'`.

## `src/actions/` — UI data boundary

- `'use server'` + `server-only`
- expected failures return `ActionResult<T>` from `@/types/action`
- DTOs in sibling `*.types.ts`
- call `@/server/*`; no widgets, no app, no React
- `src/app` does not import `@/server/*`

## `src/widgets/` — feature UI

- `<widget>.container.tsx` — smart client container (UI state)
- `<widget>.tsx` and `__element/<widget>__element.tsx` — dumb markup
- `<widget>.types.ts`, `lib/*.ts` — local types and pure helpers

Container owns `'use client'`, local state, handlers. Passes data and callbacks into a dumb root. Does not render another container. Cross-widget composition happens in route files.

Dumb components: no `'use client'` (except BEM `__` client islands), no hooks (same exception), no `fetch`, no `@/actions/*`, no `.container`.

BEM `__` islands may have `'use client'` and hooks (gallery index, `onError`). They must not import actions, `fetch`, or `.container`.

```text
widgets/project-detail/
  project-detail.tsx
  project-detail.types.ts
  __gallery/
    project-detail__gallery.tsx
```

Do not chain `__` in file names. Folder nesting shows hierarchy.

## `src/lib/`

`.ts` only. No JSX, no actions, no network, no raw fixtures. Promote here when used by two or more owners.

## Data path

1. RSC page calls a server action
2. action returns `ActionResult<T>`
3. page unwraps `success` (or throws on unexpected failure)
4. widget container / dumb tree receives props

Writes (lead form): container calls `submitLead`. Expected failures return `{ success: false, error }`.
