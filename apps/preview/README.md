# apps/preview — статик-превью (GWD-structure + preview palette)

Кликабельное превью сценария «Готовые проекты + Построенные объекты» с композицией, вдохновлённой [gwd.ru](https://www.gwd.ru/): порядок секций, photo-first карточки, lead-форма. **Цветовая схема preview сохранена** (terracotta `#9c4a2d`, ink-ramp, Inter) — не бренд Good Wood.

## Фокус
- `/` — home: hero → side-banner-slider → popular → lead (+ LOCAL_EXTRA trust/tech/built-stats)
- `/projects` + `/projects/[slug]` — каталог и детальная
- `/works` + `/works/[slug]` — построенные объекты

Секции помечены `data-section="…"`. Lead: `data-gwd-lead`. Структура кода: [`FRONTEND_ARCHITECTURE.md`](./FRONTEND_ARCHITECTURE.md).

## Три слоя match

| Слой | Источник |
|------|----------|
| Структура GWD | [`~/Documents/gwd-oneshot-spec/ONESHOT.md`](file:///Users/malakh-artur/Documents/gwd-oneshot-spec/ONESHOT.md) |
| Продукт Beget / legacy | [`docs_legacy_ncottage_www/`](./docs_legacy_ncottage_www/), [`data/fixtures/README.md`](./data/fixtures/README.md) |
| Карта наложения | [`docs/GWD_BEGET_MAP.md`](./docs/GWD_BEGET_MAP.md) |

Accent остаётся terracotta `#9c4a2d` — не Good Wood green.

## Данные

**Только fixture-backed truth.** Runtime (`src/server/catalog`) читает JSON из
[`data/fixtures/`](./data/fixtures/) — без live MySQL в `next dev/build`.

- **329 product-строк** → merge по design `slug`
- **~90 объектов** built-objects + extras
- Картинки — хотлинк на `ncottage.ru`

### Политика честности UI
- Только поля из фикстур + closed allowlist derived
- Отсутствующее = блок скрыт; GWD-only gaps → `data-stub="true"` / `STUB:`
- Нет fake pools (reviews/owner/milestones)

### Обновление фикстур

```
cd apps/preview
npm run export:fixtures
npm run assert:fixtures
```

См. [`data/fixtures/README.md`](./data/fixtures/README.md).

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
