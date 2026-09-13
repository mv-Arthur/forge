# apps/preview — статик-превью (GWD-structure + preview palette)

Кликабельное превью сценария «Готовые проекты + Построенные объекты» с композицией, вдохновлённой [gwd.ru](https://www.gwd.ru/): порядок секций, photo-first карточки, lead-форма. **Цветовая схема preview сохранена** (terracotta `#9c4a2d`, ink-ramp, Inter) — не бренд Good Wood.

## Фокус

- `/` — home: hero → popular (серийные / индивидуальные) → lead (+ LOCAL_EXTRA tech)
- `/catalog` — хаб «Наши проекты» (каркас gwd.ru/catalog/, данные фикстур)
- `/projects` + `/projects/[slug]` — листинг и детальная
- `/works` + `/works/[slug]` — построенные дома

Секции помечены `data-section="…"`. Lead: `data-gwd-lead`.

## Три слоя match

| Слой                   | Источник                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Структура GWD          | [`~/Documents/gwd-oneshot-spec/ONESHOT.md`](file:///Users/malakh-artur/Documents/gwd-oneshot-spec/ONESHOT.md)      |
| Продукт Beget / legacy | [`../ncottage-legacy-data`](../ncottage-legacy-data/README.md) |

Accent остаётся terracotta `#9c4a2d` — не Good Wood green.

## Данные

**Только fixture-backed truth.** Runtime (`src/server/catalog`) читает JSON из
[`../ncottage-legacy-data/fixtures`](../ncottage-legacy-data/fixtures) - без live MySQL в `next dev/build`.

- **329 product-строк** → merge по design `slug`
- **~90 объектов** built-objects + extras
- Картинки — хотлинк на `ncottage.ru`

### Политика честности UI

- Только поля из фикстур + closed allowlist derived
- Отсутствующее = блок скрыт; GWD-only gaps → `data-stub="true"` / `STUB:`
- Нет fake pools (reviews/owner/milestones)

### Обновление фикстур

```
cd apps/ncottage-legacy-data
npm run export
npm run assert
```

См. [`../ncottage-legacy-data/README.md`](../ncottage-legacy-data/README.md).

## Запуск

```
cd apps/preview
npm install
npm run dev         # http://localhost:4000
npm run build
npm start
```

## Что НЕ в scope

- Ребренд на GWD green / Manrope
- Бэкенд/CMS, реальная отправка лидов, Leaflet, 3D-туры
- Полный sitemap gwd.ru
