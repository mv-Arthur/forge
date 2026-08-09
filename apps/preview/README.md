# apps/preview — статик-превью Фазы S (фокус на готовых проектах + построенных объектах)

Кликабельный превью редизайна сценария «Готовые проекты + Построенные объекты».

## Фокус превью
Только основные потоки:
- `/projects` + `/projects/[slug]` — каталог и детальная готовых проектов (фильтры, материал, sticky-CTA, ипотека и т.д.).
- `/works` + `/works/[slug]` — каталог и детальная построенных объектов (карта/грид, плоская фотогалерея).

Главная (`/`) — упрощённый вход с переходами в эти два раздела.

Квиз-подбор — модалка по кнопке «Подобрать за 2 минуты» на `/projects` (deep-link: `#quiz` или `?quiz=1`).

## Данные

**Только fixture-backed truth.** Runtime (`lib/data.ts`) читает JSON из
[`data/fixtures/`](./data/fixtures/) — без live MySQL в `next dev/build`.

Источник снимков — Beget MySQL (WordPress/WooCommerce ncottage):

- **329 product-строк** в `data/fixtures/projects.normalized.json` (по одной на
  published WC product). Runtime `mergeProjects` схлопывает материалы
  по design `slug` (~100 design-карточек).
- **90 объектов** — child pages `post_parent=459` в
  `built-objects.normalized.json` (+ `built-objects.extras.json`).
- Манифест: `data/fixtures/.export-manifest.json` (product IDs, object slugs, counts).
- Картинки — хотлинк на `ncottage.ru` через `next/image` remotePatterns.

### Политика честности UI

- Показываются только поля из фикстур и closed allowlist derived
  (`priceFrom` = min package price, `heroImage` = first render/gallery,
  `subtitle` из floors+tech, `hasTerrace` из features).
- Нет hash-pool invent (style/rooms/reviews/owner/foreman/milestones/stage buckets).
- Нет связи объект→проект без реального FK в фикстурах (UI без «построен N раз»).
- Отсутствующее поле = блок скрыт, не `0`/`""`/fake pool.

### Обновление фикстур из БД

Подключение (SSH-туннель, env, smoke-check): [`data/fixtures/README.md`](./data/fixtures/README.md).

```
# apps/preview/.beget-db.env  (BEGET_DB_*, chmod 600; в gitignore)
# mysql client: brew mysql-client → /opt/homebrew/opt/mysql-client/bin/mysql
# tunnel: ssh -L 3307:127.0.0.1:3306 ncottaxz@ncottaxz.beget.tech

cd apps/preview
npm run export:fixtures          # node scripts/export-fixtures-from-db.mjs
node scripts/export-fixtures-from-db.mjs --parity-only   # PARITY_OK / PRICE_SAMPLE_OK
npm run assert:fixtures
```

## Запуск

```
cd apps/preview
npm install         # ставится в apps/preview/node_modules
npm run dev         # http://localhost:4000
npm run build       # SSG-сборка (projects+works+static)
npm start           # прод-сервер на 4000
```

## Что НЕ реализовано (по постановке)

- Бэкенд/CMS/БД — статик, без API.
- Формы не отправляют заявки, показывают success-state.
- Карта — SVG-заглушка; пин только при известном fixture `location` в allowlist anchors.
- Онлайн-камера, 3D-туры — не в scope.
- Реальные фотохроники по этапам — в legacy плоская галерея; превью показывает
  плоский список реальных фото без выдуманных этапов.
