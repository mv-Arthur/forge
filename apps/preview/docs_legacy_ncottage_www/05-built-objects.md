# 05 — Built objects

`OBJECT_PARENT=459` (`export-fixtures-from-db.mjs`).

Live SELECT: publish pages with `post_parent=459` → **90**.

`objects_parent_459_count: 90`

Parity: `OBJECTS_DB=90` / `OBJECTS_FIXTURE=90` / `PARITY_OK`.

Parent page:

| ID | slug | title | template |
|---|---|---|---|
| 459 | objects | Построенные и Строящиеся дома | `views/template-built-houses.blade.php` |

Children use `template-built-houses-item.blade.php` (card). Sitemap prefix `/objects/` — 41 locs (not every object is in sitemap).

ACF group: «Поля страницы “Построенные дома - Карточка реализованного проекта”» (`group_5e21afed40e3a`) and listing group `group_5dd66af0cbb66`.

Fixtures: `data/fixtures/built-objects.normalized.json` + `built-objects.extras.json` keyed by slug.
