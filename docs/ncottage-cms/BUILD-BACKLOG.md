# BUILD-BACKLOG: редизайн «Готовые проекты» и «Построенные объекты»

Нарезка §5 REDESIGN-TZ.md на атомарные задачи. Каждая задача — один коммит по своему WP. Покрыты все дельты §1.6, все P0 §3.4 и §4.1, аналитика §4.3.

**Приоритеты (порядок выполнения; всё — к реализации, ничего не откладывается «на потом»):**
- **P0** — сценарий + модель + конверсия: WP0–WP8. Без этого сайт не выполняет главную цель.
- **P1** — редакторский UX: WP9 (черновик/публикация + предпросмотр), WP10 (онбординг CMS: тур/подсказки/чек-лист).
- **P2** — расширенные фичи: WP11 (индивидуальный лендинг, ЛК-эпик, YandexProvider, смена-URL). Модель под них закладывается в P0 (не противоречить).

Приоритет задаёт **порядок**; агент идёт по приоритету и зависимостям (§3) до завершения **всех** задач — без гейта по времени.

**Полномочия (владелец, standing-согласие):** **полный контроль по зависимостям и мутирующим операциям у агента** — нужно поставить пакет, ставь без спроса; аппрув по AGENTS.md считать выданным заранее, отдельного процесса согласования НЕТ. Трекинг зависимостей = `package.json` + lockfile в гите (версионируется, этого достаточно). **Карта — старт на Leaflet+OSM.**

Область: `apps/ncottage-api` (+`prisma/`), `packages/shared`, `apps/ncottage-admin`, `apps/ncottage-www`.

## 1. Легенда

- **Размер (относительный объём, НЕ время):** S — малый, M — средний, L — крупный.
- **Канонический док темы (сверяться перед реализацией WP):** карта «тема→док» — в README. Кратко: схема/prisma → `PRISMA-DRAFT`, фильтры/квиз → `PODBOR-DESIGN`, экраны → `WIREFRAMES`, обзор-модель/решения по фичам → `REDESIGN-TZ`. Задача даёт **что** делать, канонический док — **как точно**.
- **DoD (общий для всех задач):** зелёные `pnpm -r typecheck`, `pnpm lint`, `pnpm -r build` + специфичный критерий приёмки в колонке DoD. Ветка держится зелёной после каждого коммита.
- **[CONTENT]** — задача блокируется контентом заказчика (цены под ключ, фото, фотохроники, сканы, ID Метрики, 8-800, ссылки мессенджеров/агрегаторов). Код-каркас делается заранее; наполнение — отдельным треком (WP7) с деградацией на пустое состояние, чтобы сборка не падала без данных.
- **Зависит-от** — id задач, которые должны быть смёржены раньше (внутри одного рабочего дерева).
- Паттерн миграции модели: **expand** (nullable/`@default` поля и новые модели) → **backfill** (`prisma/migrate-*.ts`, идемпотентно) → **contract** (снять nullable/дефолты там, где нужно NOT NULL, отдельной поздней миграцией). NOT NULL без дефолта в первой миграции не вводить — только expand.

---

## Порядок фаз (важно)

**Планирование (сейчас) → согласование «на бумаге» ОК → Фаза S (статик-превью для заказчика) →
согласование дизайна → реализация (WP0+).** Реализацию не начинаем, пока план не утверждён.

**Гигиена гита:** база — `main` (`feat/ncottage-cms` влит как PR #111). Сборку вести на **новой ветке
от `main`** (одна фича-ветка → один PR в конце). **Никаких `push`/PR/реализации без явного «да»
владельца** (AGENTS.md); мерж — вручную владельцем.

---

## Фаза S — Статик-превью для заказчика (ПЕРЕД WP0; ещё не «боевая» реализация)

Цель: собрать **задизайненные страницы как статику** (по `WIREFRAMES.md`) с **дамми-контентом**, без
логики/API/CMS/БД — кликабельный превью, чтобы **согласовать дизайн и UX с заказчиком ДО написания
логики**. Де-риск: заказчик видит и утверждает вид/поток раньше, чем мы вложились в бэкенд; правки по
дизайну здесь дёшевы (только вёрстка).

- **Что входит:** статические Next-страницы сценария (каталог, карточка, деталь проекта с inline-
  переключателем материала, `/works` с картой-заглушкой, деталь объекта, главная) + вёрстка/стили/адаптив
  по вайрфреймам; дамми-данные хардкодом (фикстуры). Задеплоить как превью-ссылку заказчику.
- **Чего НЕ входит:** реальные данные, лид-формы, квиз-логика, движок карты, аналитика, CMS/Prisma/Setting/
  Taxonomy — всё заглушки (кнопки без действия / «превью»).
- **Приёмка:** заказчик прошёлся по превью и подтвердил дизайн/состав блоков/потоки.
- **Только после подтверждения** → WP0 (модель → API → CMS → логика).

*Не путать с WP9 «Draft & Preview» — то предпросмотр черновиков в CMS для редактора, другое.*

---

## WP0 — Prisma-дельта: модель, миграция, shared-контракты, seed-заглушки

Тип: модель. Зависит: —. Фундамент для WP1/WP2/WP4/WP5/WP6. Вся дельта `schema.prisma` (поля/модели Project+BuiltObject+nested, enum `LeadSource`, Promo) — **только здесь**, одна expand-миграция (T11). Всё expand-фазой (nullable/`@default`/`ADD VALUE`), чтобы не сломать существующие 8 проектов и 12 объектов. Здесь же — модель `Taxonomy` (CMS-справочник technology/style/features/objectType/workType — slug-ссылки, НЕ enum/const в коде; сид из §Г) и `ProjectMaterialVariant` (один Project = N материал-вариантов, у каждого своя `priceFrom` и свои `packages`; `ProjectPackage` переезжает ПОД вариант; `Project.price` = денорм min по вариантам); каноническая модель — PRISMA-DRAFT §1.10.

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP0-T1 | Расширить `PROJECT_STYLES` (+barn, wright, scandi, panoramic) и `PROJECT_FEATURES` (+mansard-windows, panoramic-glazing); добавить `PROJECT_ROOM_TYPES`, `PROJECT_ENGINEERING_SYSTEMS`, `PROJECT_RELATION_KINDS` (только `'similar'` — `'other-material'` не заводить, материал = переключатель WP4-T9) константы. **NB:** technology/style/features/objectType/workType — slug-ссылки на Taxonomy (WP2-T8), НЕ enum/const; const остаются только под поведенческие поля | `packages/shared/src/project.ts` | — | S | Новые слаги в юнионах; `PROJECT_RELATION_KINDS` = [similar]; `dist` пересобран; downstream-импорты компилируются | |
| WP0-T2 | Дополнить интерфейсы shared: `Project` (+code, subtitle, oldPrice?, priceValidAt?, discountLabel?, mortgageAvailable, warranty?, livingArea?, builtUpArea?, ceilingHeight?, beamSection?, facadeFinish?, videoReviewUrl?, videoTimelapseUrl?, tour3dUrl?, planEditable, floorPlanMirror?, `roomCounts?: { type: ProjectRoomType; count: number }[]` (ProjectRoomType из PROJECT_ROOM_TYPES, WP0-T1), planningVariants?, engineering?, stages?, `materialVariants?` (`{ technology; priceFrom; mortgageFrom?; packages }[]` — пакеты под вариантом; `price` = денорм min по вариантам)); `ProjectFloorPlan +dimensions?`; `ProjectRelation`-тип с `kind` (only `'similar'`); новые интерфейсы `ProjectPlanningVariant`, `ProjectEngineering`, `ProjectStage`, `ProjectMaterialVariant` | `packages/shared/src/project.ts` | WP0-T1 | M | Типы отражают §1.1–1.2 + §1.10; `roomCounts` типизирован через ProjectRoomType; `materialVariants` несёт пакеты; экспортированы из `index.ts` | |
| WP0-T3 | Переработать интерфейс `BuiltObject` в shared: полный набор §1.3 (slug, title, heroImage, gallery?, baseProjectSlug?, floors?, bedrooms?, bathrooms?, style?, status, workType?, residenceMode?, даты?, price?, showPrice, utilityCost?, ownerName?, familyComposition?, story?, videoUrl?, tour3dUrl?, onlineCameraUrl?, reviewId?, featured, seo?); интерфейсы `BuiltObjectPhoto` (+stage-enum), `BuiltObjectMilestone`; константы `BUILT_OBJECT_STATUSES`, `BUILT_OBJECT_TYPES`, `BUILT_OBJECT_WORK_TYPES`, `BUILT_OBJECT_PHOTO_STAGES` | `packages/shared/src/project.ts` (или новый `built-object.ts` + реэкспорт в `index.ts`) | WP0-T1 | M | Тип покрывает §1.3/§В; `type→objectType`, `coords→coordsLat/Lng`; экспорт из `index.ts` | |
| WP0-T4 | Расширить `SelectionFilter`: `areaMin?, floorsIn?: string[], technologyIn?: Technology[], priceMax?, bedroomsMin?, bathroomsMin?`; обновить `matchesSelection` (диапазоны/мультивыбор/«от») с сохранением обратной совместимости старых полей | `packages/shared/src/project-selection.ts` | WP0-T1 | M | Новые критерии учтены в `matchesSelection`; старые селекты (8 шт.) продолжают матчиться | |
| WP0-T5 | Расширить `LeadSource` в shared: `+ "built-object", "quiz", "promo", "subscribe", "individual"` (individual — под лендинг WP11); синхронизировать `LEAD_SOURCES`; синхронно расширить DTO/валидатор leads в api под новые значения | `packages/shared/src/lead.ts`, `apps/ncottage-api/src/leads/*` (dto/validation) | — | S | Юнион и массив содержат 9 источников; `isValidLead` и leads-DTO пропускают новые | |
| WP0-T5a | Postgres-enum `LeadSource` расширить SQL: `ALTER TYPE "LeadSource" ADD VALUE 'built-object'` \| `'quiz'` \| `'promo'` \| `'subscribe'` \| `'individual'` (Prisma-модель `Lead.source` — enum, а не String). Отдельными стейтментами, вне транзакции, где значение уже используется (Prisma генерирует корректно) — включить в единую expand-миграцию T11 | `apps/ncottage-api/prisma/schema.prisma` (enum `LeadSource`) | WP0-T5 | S | В `schema.prisma` enum `LeadSource` = 9 значений; SQL-`ADD VALUE` попадает в каталог миграции T11 | |
| WP0-T6 | Prisma expand `Project`: `+code, subtitle, oldPrice Int?, priceValidAt DateTime?, discountLabel, mortgageAvailable Boolean @default(false), warranty, livingArea Int?, builtUpArea Int?, ceilingHeight Float?, beamSection, facadeFinish, videoReviewUrl, videoTimelapseUrl, tour3dUrl, planEditable Boolean @default(false), floorPlanMirror Boolean @default(false)` (строковые — `String?`); `ProjectFloorPlan +dimensions String?`; `ProjectRelation +kind String @default("similar")`; обратная связь `builtObjects BuiltObject[]` | `apps/ncottage-api/prisma/schema.prisma` | WP0-T2 | M | Все поля §1.6-Project nullable/дефолтны; `prisma validate` ок | |
| WP0-T7 | Prisma новые модели проекта: `ProjectPlanningVariant{projectId FK, name, mediaId?, note?, order}`, `ProjectEngineering{projectId FK, system, points Int?, note?, order}`, `ProjectStage{projectId FK, name, weeksFrom Int?, weeksTo Int?, order}`; добавить `roomCounts` (repeater — nested-модель `ProjectRoomCount{projectId FK, type, count, order}`); relation-массивы в `Project` | `apps/ncottage-api/prisma/schema.prisma` | WP0-T6 | M | Модели §1.2/§1.6 с FK-каскадом и `@@index([projectId])` | |
| WP0-T7a | **Материал-варианты (PRISMA-DRAFT §1.10):** модель `ProjectMaterialVariant{projectId FK, technology (slug), priceFrom Int, mortgageFrom Int?, order}` + relation-массив `materialVariants` в `Project`; перенести `ProjectPackage` (+`Include`) с `Project` под `ProjectMaterialVariant` (FK `variantId`); `Project.price` = денорм min `priceFrom` по вариантам (источник — варианты). Backfill в T12: каждому существующему проекту завести один дефолт-вариант и перенести его текущие `packages`/`price` под него | `apps/ncottage-api/prisma/schema.prisma` | WP0-T6 | L | `ProjectPackage.variantId` заменяет `projectId`; каждый проект имеет ≥1 вариант; `Project.price` = min по вариантам; `prisma validate` ок | |
| WP0-T8 | Prisma expand `BuiltObject`: `+baseProjectId String?` + relation `baseProject`, `heroMediaId, status String @default("built"), workType, style, bedrooms Int?, bathrooms Int?, floors, residenceMode, contractDate/buildStartDate/moveInDate DateTime?, price Int?, showPrice Boolean @default(false), utilityCost, ownerName, familyComposition, story, videoUrl, tour3dUrl, onlineCameraUrl, reviewId + relation, featured Boolean @default(false), seoTitle, seoDescription`; сделать `href String?` nullable | `apps/ncottage-api/prisma/schema.prisma` | WP0-T3 | M | Все поля §1.6-BuiltObject nullable/дефолтны; `href` nullable | |
| WP0-T9 | Prisma новые модели объекта: `BuiltObjectPhoto{builtObjectId FK, mediaId, caption?, stage?, order}`, `BuiltObjectMilestone{builtObjectId FK, label, date?, note?, order}`; массивы `photos/milestones` в `BuiltObject` | `apps/ncottage-api/prisma/schema.prisma` | WP0-T8 | M | Модели §1.6 с FK-каскадом/индексами | |
| WP0-T10 | Prisma `Review +projectSlug String?` + обратный массив `builtObjects BuiltObject[]` (обратная сторона FK `BuiltObject.reviewId`, WP0-T8). Скаляр `Review.builtObjectId` НЕ заводить — связь Review↔BuiltObject только через `BuiltObject.reviewId` (PRISMA-DRAFT §1.6) | `apps/ncottage-api/prisma/schema.prisma` | WP0-T8 | S | В `Review` только `projectSlug` + обратный массив; второй оси связи нет; relation двусторонняя по `reviewId` | |
| WP0-T10a | Prisma expand `Promo`: `+deadline DateTime?, badge String?` (дельта §1.6-Promo — schema.prisma только WP0-агент, в единую миграцию T11). Логика countdown/CTA и связь с проектом — в WP6-T6 | `apps/ncottage-api/prisma/schema.prisma` | WP0-T6 | S | Оба поля nullable; `prisma validate` ок; попадает в expand-миграцию T11 | |
| WP0-T10b | Prisma expand под TG-уведомления стройки (WP6-T11): привязка `chat_id ↔ BuiltObject` — модель `BuiltObjectSubscription{builtObjectId FK, chatId, createdAt}` (или nullable-поле, по дизайну) в единую миграцию T11. Только модель; логика бота/`sendMessage` — в WP6-T11 | `apps/ncottage-api/prisma/schema.prisma` | WP0-T8 | S | Модель привязки chat_id есть; `prisma validate` ок; попадает в expand-миграцию T11 | |
| WP0-T11 | Сгенерировать SQL-миграцию (expand) под все дельты T5a, T6–T10, T10a (Promo), T10b (TG-привязка) и T7a (`ProjectMaterialVariant`+перенос packages) в один каталог; проверить `prisma migrate` в dev (генерация файла, не прод) | `apps/ncottage-api/prisma/migrations/<ts>_redesign_expand/` | WP0-T5a,T7,T7a,T9,T10,T10a,T10b | M | Миграция применяется на чистой БД без потери данных; только ADD COLUMN/CREATE TABLE/ADD VALUE, ни одного NOT NULL без дефолта; enum `LeadSource` содержит 9 значений; Promo несёт `deadline`/`badge`; есть `ProjectMaterialVariant` и модель TG-привязки | |
| WP0-T12 | Backfill-скрипт (идемпотентный): `href` из `slug` → `/works/[slug]`; `objectType`/`technology` строк → канонические слаги Taxonomy (снять эвристику www); `code`-заглушки; проставить `status="built"`; **`Project.floors` Int→String** (перелить int в строку `'1'`/`'2'`; contract-окно снятия старой Int-колонки, PRISMA §3.v); **перенос под материал-варианты:** каждому существующему проекту завести один дефолт-`ProjectMaterialVariant` и перенести его текущие `packages`/`price` под вариант, проставить `Project.price` = min по вариантам | `apps/ncottage-api/prisma/migrate-builtobjects.ts`, `migrate-projects.ts` | WP0-T11 | M | Повторный запуск не дублирует; после — нет `href` на `/our-works`, все `objectType` в слагах Taxonomy; у каждого проекта ≥1 материал-вариант с перенесёнными пакетами | |
| WP0-T13 | Обновить seed-контракты и DTO/сервисы api под новые поля (мапперы Prisma↔shared в projects/built-objects сервисах, включая `ProjectRoomCount`↔`Project.roomCounts`), чтобы `pnpm -r build` был зелёным | `apps/ncottage-api/src/projects/*`, `apps/ncottage-api/src/built-objects/*` | WP0-T11 | L | Сервисы читают/пишут новые поля; маппер `ProjectRoomCount`↔shared `roomCounts` работает; ответ byte-identity для существующих полей сохранён | |
| WP0-T14 | Seed-заглушки: дополнить `projects.json`/`built-objects.json` новыми полями значениями по умолчанию (null/false/пусто), чтобы `seed.ts` проходил на расширенной схеме; `reviews.json` +projectSlug null (`builtObjectId` НЕ добавлять — скаляра нет, связь через `BuiltObject.reviewId`) | `apps/ncottage-api/prisma/seed-data/{projects,built-objects,reviews}.json`, `seed.ts` | WP0-T13 | M | `seed.ts` заполняет БД без ошибок; существующие 8+12 записей на месте; в reviews.json нет `builtObjectId` | |

---

## WP1 — Медиа-фикс P0: MediaField во все формы, запрет строк-URL, миграция legacy-URL в MinIO

Тип: CMS. Зависит: WP0. Закрывает §3.2 и P0.1/P0.2 §3.4. Механизм `MediaField/GalleryField→MediaPicker/UploadDropzone→uploadMediaAction→POST /media→MinIO` готов — переиспользуется.

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP1-T1 | Встроить `UploadDropzone` в `MediaField` как основной путь (drag-n-drop на месте), «Выбрать из медиатеки» — вторая кнопка; единый паттерн для всех форм | `apps/ncottage-admin/src/components/media/media-field.tsx`, `upload-dropzone.tsx` | WP0 | M | Файл перетаскивается прямо в поле → грузится в MinIO → превью; медиатека доступна кнопкой | |
| WP1-T2 | Заменить сырые TextField-URL картинок на `MediaField`/`GalleryField` в built-objects (image→heroMedia), reviews (image), services (image), service-scenarios (plan.image), projects floorPlans[].image; ни одного строкового поля картинки | `apps/ncottage-admin/src/app/built-objects/BuiltObjectForm.tsx`, `reviews/*Form.tsx`, `services/*Form.tsx`, `service-scenarios/*Form.tsx`, `projects/ProjectForm.tsx` | WP1-T1 | L | Во всех перечисленных формах картинка редактируется через MediaField; поиск строковых image-полей пуст | |
| WP1-T2b | og:image → `MediaField` в SeoForm (content/seo) и ArticleForm (blog); лейбл «Картинка для соцсетей» (§3.1) вместо сырого URL-поля | `apps/ncottage-admin/src/app/content/seo/SeoForm.tsx`, `apps/ncottage-admin/src/app/blog/ArticleForm.tsx` | WP1-T1 | S | og:image в обеих формах редактируется через MediaField с русским лейблом; строковых og:image-полей нет | |
| WP1-T3 | Валидатор «только url нашего хранилища» вместо `z.string().min(1)` для полей-картинок (нельзя сохранить «абвгд»/битый путь/хотлинк), включая og:image | `apps/ncottage-admin/src/lib/validators.ts`, `project-schema.ts`, `built-object-schema.ts`, `review-schema.ts`, `service-schema.ts`, `service-scenario-schema.ts`, `seo-schema.ts`, `article-schema.ts` (blog) | WP1-T2, WP1-T2b | M | Сохранение внешнего/`public` url отклоняется с русской ошибкой; url MinIO проходит; og:image покрыт валидатором | |
| WP1-T4 | Идемпотентный скрипт миграции legacy-URL: скачать `ncottage.ru/app/uploads/*` (built-objects, reviews) и `/public` (projects, services) → залить через MediaService → переписать поле на наш url + проставить `mediaId`/`heroMediaId` | `apps/ncottage-api/prisma/migrate-media.ts` | WP0-T12, WP1-T3 | L | После прогона в БД нет внешних/`public` ссылок; повторный запуск не дублирует загрузки | [CONTENT] |
| WP1-T5 | Пустое состояние «Файл не найден» при недоступной картинке в `MediaThumb`; первое фото галереи = обложка (drag-сортировка уже есть), размеры не спрашивать | `apps/ncottage-admin/src/components/media/media-thumb.tsx`, `gallery-field.tsx` | WP1-T1 | S | Битый url показывает явный placeholder; обложка = первый элемент галереи | |
| WP1-T6 | Заполнить `Certificate.imageUrl/fileUrl` (0/7) через MediaField в форме сертификатов + миграция сканов, если предоставлены | `apps/ncottage-admin/src/app/certificates/*Form.tsx`, `certificate-schema.ts`, `apps/ncottage-api/prisma/migrate-media.ts` | WP1-T4 | M | Форма принимает файл сертификата; при наличии сканов 7/7 заполнены | [CONTENT] |

---

## WP2 — CMS-юзабилити P0: лейбл-мапы, slug-автотранслит, useUnsavedGuard, русские ошибки

Тип: CMS. Зависит: WP0. Закрывает P0.3/P0.4/P0.5/P0.6 §3.4 и §3.1/§3.3.

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP2-T1 | Русские подписи в дропдаунах/таблицах. **Справочные** поля (технология/стиль/особенности/objectType/workType) — подписи из `Taxonomy.label` (с сервера, WP2-T8), НЕ хардкод. **Поведенческие** (status/photo-stage/relation-kind/livingType/engineering-system) — маленький `lib/labels.ts` в коде. Ни одного англо-кода в UI | `apps/ncottage-admin/src/lib/labels.ts` (только поведенческие), `project-schema.ts`, `built-object-schema.ts`, `selection-schema.ts`, `ProjectsTable.tsx`, `BuiltObjectsTable.tsx` | WP0-T1,T3, WP2-T8 | M | Справочные подписи тянутся из Taxonomy; поведенческие — из labels.ts; сырых слагов в UI нет | |
| WP2-T2 | Slug/id-автотранслит из названия (вживую) + русская коллизия «Такой адрес уже занят» в project/built-object/selection формах; переименовать лейбл в «Адрес страницы (латиницей)» | `apps/ncottage-admin/src/lib/slugify.ts` (или переиспользовать), `ProjectForm.tsx`, `BuiltObjectForm.tsx`, selection form | WP0 | M | Ввод названия генерирует slug транслитом; занятый slug подсвечивается до сохранения | |
| WP2-T3 | `useUnsavedGuard` во все формы сущностей + подтверждение «Отмена» (project, built-object, selection, review, service, service-scenario, promo, certificate) | `apps/ncottage-admin/src/lib/use-unsaved-guard.ts`, все `*Form.tsx` | WP0 | M | Уход со страницы с несохранёнными правками перехватывается; «Отмена» просит подтверждение | |
| WP2-T4 | Русские ошибки вместо сырых английских бэка; маппинг ошибок валидации/API к рядом-с-полем сообщениям на русском | `apps/ncottage-admin/src/lib/api.ts`, `validators.ts`, форм-обвязка `components/form/fields.tsx` | WP0 | M | Нет английских toast'ов от бэка; ошибки по-русски у поля | |
| WP2-T5 | Бросать `ConflictException` (409) на коллизию slug в api вместо P2002/500; фронт показывает «Такой адрес уже занят» | `apps/ncottage-api/src/projects/*`, `apps/ncottage-api/src/built-objects/*`, `apps/ncottage-api/src/project-selections/*` | WP0-T13 | M | Дубль slug возвращает 409, не 500; сообщение по-русски на клиенте | |
| WP2-T6 | «Место в списке» (order) — предзаполнение «в конец»; лейбл-переименование `order→«Место в списке»` во всех формах-коллекциях | `apps/ncottage-admin/src/components/form/fields.tsx`, `*Form.tsx` | WP0 | S | Новая запись получает order=max+1 по умолчанию; технический термин скрыт | |
| WP2-T7 | `CoordsField`: клик на мини-карте (Leaflet+OSM, тот же слой/пакет, что WP5-T1; аппрув выдан) для `coordsLat/Lng` в `BuiltObjectForm` вместо сырых TextField; деградация на ручной ввод координат при недоступности карты (§3.3/§3.4-P1) | `apps/ncottage-admin/src/components/form/coords-field.tsx` (новый), `apps/ncottage-admin/src/app/built-objects/BuiltObjectForm.tsx` | WP0-T8 | M | Клик по мини-карте проставляет coordsLat/Lng; при недоступности карты — ручной ввод; сырые TextField-координаты убраны | |
| WP2-T8 | **Справочники (Taxonomy) — раздел админки:** CRUD технологий/стилей/особенностей/типов объектов/типов работ (slug+русская подпись+порядок); API `/taxonomy?kind=` (публичный GET для фильтров витрины) + мутации под auth; защита целостности (нельзя удалить used term, нет дубль-slug); сид из §Г. Выпадашки проекта/объекта и фильтры витрины читают отсюда | `apps/ncottage-api/src/taxonomy/*`, `apps/ncottage-admin/src/app/taxonomy/*`, `packages/shared/src/taxonomy.ts`, seed | WP0 (модель Taxonomy) | L | Редактор добавляет/правит термин → появляется в выпадашках и фильтрах без кода; used term не удаляется | |

---

## WP3 — Аналитика P0: Метрика + dataLayer в layout, lib/analytics, события воронки в useLeadForm

Тип: конверсия. Зависит: —. Закрывает P0.1/P0.2 §4.1 и §4.3. Не зависит от WP0 (кроме WP3-T4, где нужен LeadSource).

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP3-T1 | Единый `lib/analytics.trackEvent(name, payload)` + инициализация `dataLayer`; вынести из `ServiceCtaLink`/`FloatingContact` события, уходящие «в никуда» | `apps/ncottage-www/src/lib/analytics.ts` (новый) | — | M | `trackEvent` — единственная точка; типизированные имена событий §4.3 | |
| WP3-T2 | Подключить Яндекс.Метрику + `dataLayer` в `layout.tsx` через `next/script` (ID счётчика из Setting; при пустом ID — no-op, сборка не падает) | `apps/ncottage-www/src/app/layout.tsx`, `apps/ncottage-www/src/data/settings.ts` | WP3-T1 | M | Скрипт Метрики рендерится при заданном ID; без ID — тихо пропускается | [CONTENT] |
| WP3-T3 | Событийная разметка воронки в `useLeadForm`: `lead_form_view/_start/lead_submit/lead_success/_error` с `{source, project, placement}` — одна точка на все 6 форм | `apps/ncottage-www/src/lib/useLeadForm.ts` | WP3-T1 | M | Все 6 форм эмитят события через одну обёртку; payload содержит source/project/placement | |
| WP3-T4 | Разметка вспомогательных событий: `cta_click, messenger_open, floating_contact_open, sticky_cta_click, callback_modal_open/submit, promo_banner_view/cta_click, phone_number_click, visit_request_submit, scroll_depth` (подключаются в WP5/WP6) | `apps/ncottage-www/src/lib/analytics.ts`, `components/shared/FloatingContact`, `CallbackModal`, `CallbackButton`, `widgets/TopBar` | WP3-T1, WP0-T5 | M | События §4.3 доступны как хелперы и вызваны в ключевых CTA | |

---

## WP4 — Каталог: карточка + детальная проекта

Тип: витрина. Зависит: WP0. Закрывает §2.2/§2.3 и §4.1-P0.4 (крупная цена/пакеты/ипотека). Каркас деградирует на пустые данные (описан в рисках).

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP4-T1 | Карточка проекта: фото-слайдер по `images[]` с hover-перелистыванием; при 1 фото — статичная обложка (без слайдера) | `apps/ncottage-www/src/components/features/projects-catalog/ProjectsCatalog.tsx` (+ карточка), новый `ProjectCard` при необходимости | WP0 | M | Карточка листает `images[]`; на 1 фото не ломается | |
| WP4-T2 | Карточка: код серии (бейдж `code`), подзаголовок `subtitle`, крупная цена «под ключ от N ₽» (= `Project.price`, денорм min `priceFrom` по вариантам, WP0-T7a) + `oldPrice` зачёркнуто + бейдж `discountLabel` + `priceValidAt`; триггер ипотеки «от X ₽/мес»; **соц-доказательство** = бейджи «построен N раз» (из `builtObjects`) и «Хит»/`featured`; **лайков нет** (сортировка «по популярности» = по числу построенных, не по лайкам) | тот же файл карточки | WP4-T1, WP0-T6, WP0-T7a | M | Все бейджи/цена отображаются при наличии данных; ценовой блок скрывается при `price=0`/отсутствии варианта (деградация на пустое — формальный критерий); нет лайк-счётчика; отсутствующие поля скрыты | [CONTENT] |
| WP4-T3 | Фильтры каталога (состав **РЕШЁН** — PODBOR-DESIGN §3-4): **Primary видимые (~6)** — технология-мультивыбор (slug из Taxonomy), площадь (areaMin/areaMax слайдер), цена (priceMax), этажность-мультивыбор (floorsIn), спальни «от», стиль; **Secondary под «Ещё фильтры»** — санузлы «от», назначение (ПМЖ/дачный), особенности (терраса/гараж/балкон); сортировка вкл. «по популярности» (построен N раз); счётчик результата всегда виден. Фильтры и квиз (WP6-T1) берут из общего словаря критериев «Подбор» | `apps/ncottage-www/src/components/features/projects-catalog/{FilterSidebar,useProjectsFilter,RangeSlider}.tsx` | WP0-T4 | L | Primary-оси видимы, Secondary под «ещё»; работают против `matchesSelection`/локального фильтра; счётчик обновляется; состав по PODBOR-DESIGN §3-4 | |
| WP4-T4 | Деталь: галерея карусель+лайтбокс (вместо 4 миниатюр-обрубка) по `images[]` | `apps/ncottage-www/src/components/features/project-detail/ProjectGallery.tsx` | WP0 | M | Карусель + полноэкранный лайтбокс; работает на любой длине галереи | |
| WP4-T5 | Деталь: варианты планировки (`planningVariants`) в табах этажей + пометка «меняется бесплатно» (`planEditable`) | `apps/ncottage-www/src/components/features/project-detail/ProjectFloorPlans.tsx` | WP0-T7 | M | Варианты рендерятся при наличии; флаг planEditable показывает крючок | |
| WP4-T6 | Деталь: инженерка (`ProjectEngineering`, число точек по системам) — новый блок | `apps/ncottage-www/src/components/features/project-detail/ProjectEngineering.tsx` (новый) + `index.ts` | WP0-T7 | M | Блок выводит систему+points+note; скрыт при пустых данных | |
| WP4-T7 | Деталь: таймлайн стройки по неделям (`ProjectStage`, weeksFrom/weeksTo) — новый блок | `apps/ncottage-www/src/components/features/project-detail/ProjectStages.tsx` (новый) + `index.ts` | WP0-T7 | M | Понедельная шкала §Б; скрыт при пустых данных | |
| WP4-T8 | Деталь: ипотека слайдерами (сумма/ставка/срок) вместо фикс. 14%; ставка-дефолт из Setting | `apps/ncottage-www/src/components/features/project-detail/ProjectMortgage.tsx`, `apps/ncottage-www/src/data/settings.ts` | WP0 | M | Три слайдера пересчитывают ₽/мес; дефолтная ставка из Setting, не хардкод | |
| WP4-T9 | Деталь: inline-переключатель материала «построить из» (`ProjectMaterialVariant`) — смена варианта пересчитывает цену/пакеты калькулятора; комплектации до брендов (`ProjectPackageInclude.value` rich) + калькулятор пакет+опции с префиллом заявки. Блок «тот же дом в другом материале» и `ProjectRelation.kind='other-material'` НЕ делать — материал = переключатель на той же карточке; `SimilarProjects` показывает только `kind='similar'` | `apps/ncottage-www/src/components/features/project-detail/{ProjectCalculator,SimilarProjects}.tsx` | WP0-T7a | L | Переключатель материала меняет цену/пакеты без перехода; калькулятор считает пакет+опции и префиллит форму; `SimilarProjects` = только similar | |
| WP4-T10 | Деталь: sticky-aside с ценой/CTA/трастами из Setting (не JSX); блок «Посмотреть вживую» — построенные по проекту объекты (обратная связь `builtObjects`) | `apps/ncottage-www/src/components/features/project-detail/{ProjectStickyAside,ProjectShowroom}.tsx` | WP0-T6, WP0-T8 | M | Трасты читаются из Setting; блок показывает объекты по `baseProjectSlug` | |

---

## WP5 — Построенные объекты: карта, фильтры, /works/[slug], связки, снос WordPress-ссылок

Тип: витрина. Зависит: WP0, WP1. Закрывает §2.4/§2.5 и §Д.5. **Leaflet+OSM** (аппрув выдан, см. «Полномочия»); слой карты абстрагировать интерфейсом `MapProvider`.

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP5-T1 | Реальная интерактивная карта за интерфейсом `MapProvider` (старт — `LeafletProvider`+OSM; `YandexProvider` — P2, WP11-T3), провайдер выбирается конфигом `MAP_PROVIDER` + ключ из Setting/env: кликабельные пины по `coordsLat/Lng`, попап (фото/площадь/технология/тип/ссылка), кластеры, фильтр `status` (Все/Строящиеся/Построенные); убрать фейковую CSS-схему | `apps/ncottage-www/src/components/features/works/map/{MapProvider,LeafletProvider}.tsx` (новые), `WorksMap.tsx`, `app/works/page.tsx` | WP0-T8 | L | Карта рендерит пины из БД, кластеры, попапы; CSS-макет удалён; фильтр статуса работает; провайдер за интерфейсом, свап конфигом `MAP_PROVIDER` | |
| WP5-T2 | Сетка объектов с фильтрами (workType/technology/objectType/площадь/status) + сортировка + KPI; карточка ведёт на свою `/works/[slug]` | `apps/ncottage-www/src/app/works/page.tsx`, новый `components/features/works/WorksGrid.tsx` | WP0-T8 | M | Фильтры §2.4 работают; карточка ведёт на внутренний маршрут, не WordPress | |
| WP5-T3 | Новый маршрут `/works/[slug]`: SSG по `slug`; галерея-фотохроника по этапам (`BuiltObjectPhoto.stage`); гибкий блок «Параметры» (лейбл→значение, §В — неровный ACF-набор) | `apps/ncottage-www/src/app/works/[slug]/page.tsx` (новый), `WorksGallery.tsx` | WP0-T8, WP0-T9 | L | Маршрут открывается по slug; хроника группирует фото по stage; параметры выводятся гибко | |
| WP5-T4 | Деталь объекта: история клиента (`story`, `ownerName`, `familyComposition`); врезка-отзыв владельца (`reviewId`→Review); кнопка «Хочу такой дом» → `baseProject` (каталог); видео/3D/онлайн-камера (камера только для in-progress) | `apps/ncottage-www/src/app/works/[slug]/page.tsx` | WP0-T8, WP0-T10 | M | Все блоки скрыты при пустых данных; CTA ведёт на `baseProjectSlug`; врезка-отзыв по FK | |
| WP5-T5 | Форма записи на просмотр (выбор даты) с `source="built-object"`; префилл контекста объекта; событие `visit_request_submit` | `apps/ncottage-www/src/app/works/WorksVisitForm.tsx`, `lib/useLeadForm.ts` | WP0-T5, WP3-T3 | M | Форма шлёт лид с source=built-object и датой; событие эмитится | |
| WP5-T6 | Снос WordPress-наследия: убрать хотлинк ncottage.ru (heroImage через mediaId), починить битые `/our-works` ссылки (href из slug); секция OurWorks на главной ведёт на `/works/[slug]` | `apps/ncottage-www/src/components/sections/OurWorksSection/OurWorksSection.tsx`, `data/built-objects.ts` | WP0-T12, WP1-T4 | M | Ни одной ссылки на `/our-works`/ncottage.ru; карточки OurWorks ведут внутрь | |

---

## WP6 — Конверсия P0/P1: квиз-калькулятор, 8-800+мессенджеры, trust-счётчики, sticky-CTA, Promo-дедлайн

Тип: конверсия. Зависит: WP0, WP3. Закрывает P0.3/P0.5/P0.6 и P1 §4.1.

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP6-T1 | Квиз «Подбор» (**подбор-гибрид**) — **АДМИНИМЫЙ из CMS**: структура (шаги/варианты/маппинг ответов на фильтр каталога) редактируется в кабинете БЕЗ хардкода и релизов (данные-структура, не константы в бандле; читается server-side). Не привязан к проекту; прогресс-бар, на финале — **3-5 подходящих проектов + вилка цены** (из `ProjectMaterialVariant.priceFrom` подобранных) + захват лида (`source="quiz"`) с префиллом. Квиз и фильтры каталога (WP4-T3) берут из **общего словаря критериев «Подбор»** (методология и состав — PODBOR-DESIGN §4-5; РЕШЕНО: подбор-гибрид, смета-квиз по конструктиву отвергнут); движок матчинга — тот же `SelectionFilter`. Требует CMS-редактор структуры квиза (сущность `Quiz{steps[]{criterion,label,options[],required}}`, PRISMA-DRAFT §1.11 — а не Setting-строка) | `apps/ncottage-www/src/components/features/quiz/QuizCalculator.tsx` (новый) + маршрут/секция; редактор квиза в `apps/ncottage-admin` | WP0-T5, WP3-T3 | L | Редактор меняет шаги/варианты/маппинг в CMS → квиз обновляется без деплоя; квиз проходит шаги, показывает 3-5 проектов + вилку цены, шлёт лид source=quiz; события `quiz_step_view/_complete/_to_lead`; состав критериев по PODBOR-DESIGN (не TBD) | [CONTENT] |
| WP6-T2 | CTA «Рассчитать стоимость» на главной, в шапке (`TopBar`/`SiteHeader`), в каталоге → открывают квиз | `apps/ncottage-www/src/components/widgets/{TopBar,SiteHeader}/*.tsx`, `app/page.tsx`, каталог | WP6-T1 | M | Кнопка присутствует в 3 местах и открывает квиз; событие cta_click | |
| WP6-T3 | Мессенджер-first: кнопки Telegram/WhatsApp + 8-800 в `TopBar` наравне с телефоном; deep-link с префиллом («Интересует проект X»); контакты из Setting; событие `messenger_open` | `apps/ncottage-www/src/components/widgets/TopBar/TopBar.tsx`, `lib/callback.tsx`, `data/settings.ts` | WP3-T4 | M | TG/WA/8-800 в TopBar; deep-link несёт префилл; значения из Setting | [CONTENT] |
| WP6-T4 | Trust-счётчики из Setting: «построено N домов» (из `builtObjects`), лет на рынке, м² производства, % рекомендуют — на главную и в trust-слой карточки; **гарантия** → редактируемое поле в `Setting` (убрать хардкод «7 лет»), захардкоженные «0₽/гарантия» тоже в Setting; + нарратив-блок «сопровождаем от чертежа до заселения» (позиционирование §6.5) в trust-слой главной | `apps/ncottage-www/src/components/sections/AdvantagesSection/*`, `data/settings.ts`, `features/project-detail/ProjectStickyAside.tsx` | WP0-T8 | M | Счётчики и срок гарантии читаются из Setting/агрегата; в JSX не осталось хардкод-цифр и «7 лет» | [CONTENT] |
| WP6-T5 | Глобальный sticky-CTA на всех страницах (сейчас только карточка проекта); событие `sticky_cta_click` | `apps/ncottage-www/src/app/layout.tsx`, новый `components/shared/StickyCta/*` | WP3-T4 | M | Sticky-CTA виден на всех маршрутах; событие эмитится | |
| WP6-T6 | Promo с дедлайном и таймером из CMS (deadline/badge уже в схеме — WP0-T10a): `promo-schema.ts` в админке под новые поля, countdown-компонент + CTA «Зафиксировать цену»; связать `discountLabel/oldPrice` проекта с активной акцией; события `promo_banner_view/cta_click`. Schema.prisma НЕ трогать | `apps/ncottage-admin/src/lib/promo-schema.ts`, `apps/ncottage-www/src/components/.../Promo*` | WP0-T10a, WP3-T4 | M | Countdown тикает от deadline; CTA работает; проект подтягивает акцию; ни одной правки schema.prisma в этом WP | [CONTENT] |
| WP6-T7 | Явный чекбокс `consent` во всех формах (заменить hardcoded true); лид не отправляется без согласия | `apps/ncottage-www/src/lib/useLeadForm.ts`, все лид-формы, `apps/ncottage-api/src/leads/*` | WP0-T5 | M | Чекбокс обязателен во всех 6+ формах; `isValidLead` уже требует consent=true | |
| WP6-T8 | Форма «Оставить отзыв» на витрине: `Review` + `Lead` одним сабмитом (создаёт черновик отзыва на модерацию + лид с контактом); модерация/публикация отзыва — в CMS (`published`/статус, переиспользовать WP9-паттерн) | `apps/ncottage-www/src/components/.../ReviewForm.tsx` (новый), `apps/ncottage-api/src/reviews/*`, `apps/ncottage-admin/src/app/reviews/*` | WP0-T5, WP3-T3 | M | Один сабмит заводит отзыв-черновик + лид; отзыв не виден до модерации; в CMS есть очередь на публикацию | |
| WP6-T9 | Анонимное избранное/сравнение на `localStorage` (без аккаунта/гейта авторизацией): «в избранное»/«к сравнению» на карточке+детали, страница избранного и сравнения; ЛК-синхронизация — P2 | `apps/ncottage-www/src/lib/favorites.ts` (новый), `components/features/projects-catalog/*`, `app/favorites/*`, `app/compare/*` | WP0 | M | Избранное/сравнение работают без входа, переживают перезагрузку; нет требования авторизации | |
| WP6-T10 | Success-хук лид-формы: после успешной отправки — оффер завести ЛК (заглушка → P2) + Telegram deep-link на бота с префиллом; событие после `lead_success` | `apps/ncottage-www/src/lib/useLeadForm.ts`, `components/shared/LeadSuccess/*` (новый), `data/settings.ts` | WP3-T3, WP6-T3 | S | На успехе показывается оффер ЛК + кнопка Telegram deep-link; ссылка/токен бота из Setting | |
| WP6-T11 | **Ранний слайс (~½ дня): Telegram-уведомления стройки.** TG-бот (webhook/polling), связка `chat_id ↔ BuiltObject` (поле/таблица привязки), `sendMessage` при смене `BuiltObjectPhoto.stage` или статуса объекта; токен бота из Setting/env | `apps/ncottage-api/src/telegram/*` (новый), `apps/ncottage-api/src/built-objects/*` (хук на смену stage/статуса), `schema.prisma` (привязка chat_id — в WP0-миграцию, правило «вся дельта schema.prisma только WP0-агент») | WP0-T8, WP0-T9 | L | Бот привязывает chat_id к объекту; смена stage/статуса шлёт сообщение подписчику | |

---

## WP7 — Контент (отдельный трек)

Тип: контент. Зависит: WP1 (медиатека готова). Частично заказчик / миграция legacy. Каркас (WP4/WP5/WP6) деградирует на пустое, поэтому WP7 не блокирует сборку — только полноту витрины. Масштаб: **8 демо сейчас → импорт 163 домов из legacy ЧЕРНОВИКАМИ** (archive/HARVEST-REPORT.md), публикация по проверке цен/фото; витрина = опубликованные (WP9). См. раскладку §4.

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP7-T1 | Импорт 163 домов черновиками (`published:false`) + пакеты по мигрированным: на каждый импортированный дом ≥1 `ProjectMaterialVariant` со своими `ProjectPackage`+`Include` (гибко 1..N, §Д.1); карточки без пакета деградируют на «Рассчитать через квиз». Публикация — по мере проверки цен/фото (WP9) | `apps/ncottage-api/prisma/seed-data/projects.json`, `seed.ts` | WP1-T4 | L | 163 дома импортированы черновиками; у опубликованных ≥1 вариант с пакетом; калькулятор рендерится на них | [CONTENT] |
| WP7-T2 | Галереи + планы проектов из **контейнерного ре-харвеста** (`research/harvest-images.cjs` → `images.json` → `normalized.json`): рендеры-галерея **98%** (160/163, всего 730), планы этажей **63%** (102/163, всего 178) — забор из своего `.product-page__gallery-slider`, карусель «похожие» не берётся, контаминация 0. Задача — скачать URL'ы в MinIO (демо сейчас длиной 1). **Планы у ~37% домов на legacy отсутствуют (ни картинки, ни PDF, проверено) → дослать из проектных файлов заказчика; legacy = веб-размер, оригиналы качественнее** | `apps/ncottage-api/prisma/seed-data/projects.json`, `migrate-media.ts` | WP1-T4 | L | Слайдер+лайтбокс наполнены (≥98% домов); планы где есть в источнике; недостающие ~60 планов — от заказчика | [CONTENT] |
| WP7-T3 | Построенные объекты: фотохроники из ре-харвеста (**100%**, 40/40, ~66 фото/объект, всего 2645 — забор `.built-houses-item-page__content-gallery_slider-carousel`) → `BuiltObjectPhoto` по stage; параметры, `baseProjectSlug`, координаты, статусы. Скачать URL'ы в MinIO (объём большой — ~2.6к фото) | `apps/ncottage-api/prisma/seed-data/built-objects.json`, `migrate-media.ts` | WP1-T4, WP5-T3 | L | Объекты имеют галерею/параметры/связь с проектом; карта наполнена; хроники залиты | [CONTENT] |
| WP7-T4 | Сертификаты реальными файлами (0/7), свежие отзывы + ссылки на Яндекс/2ГИС, освежить Promo через админку | `apps/ncottage-api/prisma/seed-data/{certificates,reviews,promos}.json` | WP1-T6 | M | 7/7 сертификатов с файлами; отзывы со ссылками на агрегаторы | [CONTENT] |

---

## WP9 — Draft & Preview (черновик/публикация + предпросмотр)

Тип: редакторский UX (CMS + витрина). Зависит: WP0. **Не** конверсионный P0 — это безопасность
редактора и уверенность непрофи (§3.1 принцип 7 «всегда виден результат»): создаём объект → он
черновик → публикуем по желанию, с предпросмотром «как на сайте». Пара с харвест-импортом: 163 дома
с legacy заливаются **черновиками** и публикуются по мере подтверждения цен/фото (archive/HARVEST-REPORT.md).
Нумерация — пакет сверх исходных WP0-8; финальный аудит WP8 гейтит и на WP9. Новых зависимостей нет
(Next Draft Mode встроен в Next 15).

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP9-T0 | Колонка `published Boolean @default(false)` на Project+BuiltObject — **кладётся в WP0-миграцию** (правило «вся дельта schema.prisma только WP0-агент»); backfill существующих 8+12 → `true`; seed мигрированного контента = `true` | `apps/ncottage-api/prisma/schema.prisma` (в WP0-T6/T8), `prisma/migrate-*.ts`, `seed-data` | WP0-T11 | S | Поле есть; старые записи опубликованы; новые — черновик по умолчанию |
| WP9-T1 | shared: `published?: boolean` на контрактах Project/BuiltObject | `packages/shared/src/project.ts` | WP0-T2,T3 | S | Тип отражает поле; экспорт из `index.ts` |
| WP9-T2 | API: публичные `GET /projects[/:slug]`, `/built-objects[/:id]` фильтруют `published:true`; админ-список и preview видят всё через общий заголовок `x-preview-secret` (env `PREVIEW_SECRET`) или валидный admin-JWT (optional-auth) | `projects.controller/service`, `built-objects.controller/service`, `auth/*` | WP0-T13 | M | Неаутентифицированный запрос НИКОГДА не отдаёт черновик; админ/preview видят всё |
| WP9-T3 | API: публикация `PATCH /projects/:slug/publish\|unpublish`, `/built-objects/:id/publish\|unpublish` (@UseGuards Jwt) + ISR-revalidate | те же сервисы + `RevalidateService` | WP9-T2 | S | Публикация/снятие меняют флаг и ревалидируют витрину |
| WP9-T4 | admin: бейдж «Черновик/Опубликовано» в `ProjectsTable`/`BuiltObjectsTable`, кнопка «Опубликовать/Снять с публикации», фильтр по статусу; новые записи создаются черновиком | `ProjectsTable.tsx`, `BuiltObjectsTable.tsx`, формы, `lib/api.ts` | WP9-T2,T3 | M | Статус виден и переключается; фильтр работает; create → draft |
| WP9-T5 | www: **Next Draft Mode** — роуты `/api/preview` (валидирует `PREVIEW_SECRET`, `draftMode().enable()`, редирект на страницу) и `/api/preview/exit`; draft-aware фетч (`cache:"no-store"` + `x-preview-secret`) в `data/projects.ts`/`data/built-objects.ts`; бар «Вы в режиме предпросмотра» + выход | `app/api/preview/*`, `data/*.ts`, `app/layout.tsx` | WP9-T2 | L | Предпросмотр рендерит РЕАЛЬНУЮ страницу витрины для черновика; публика его не видит |
| WP9-T6 | admin: кнопка «Предпросмотр» на формах проекта/объекта → открывает `${WWW_PUBLIC_URL}/api/preview?secret&type&slug` в новой вкладке | `ProjectForm.tsx`, `BuiltObjectForm.tsx` | WP9-T5 | S | Кнопка открывает предпросмотр текущего черновика |
| WP9-T7 | env: `PREVIEW_SECRET` (api/www/admin) + `WWW_PUBLIC_URL` (admin) в `.env.example` | `.env.example` ×3 | — | S | Шаблоны env содержат новые ключи |

**Оговорки.** (1) Не путать с `BuiltObject.status` (стадия стройки built/in-progress, §1.3) — это отдельное
поле публикации. (2) Полная версия = draft/publish + Draft-Mode превью; **минимум (~60% ценности за ~30%
работы)** = `published`+фильтр+кнопка без live-preview (WP9-T0..T4,T7), а preview (T5,T6) — вторым шагом.
(3) Параллелится плохо в ядре: T0-T3 (модель+API) — последовательный фундамент; T4 (admin) ∥ T5 (www) —
после него.

---

## WP10 — Онбординг и подсказки в админке (admin onboarding)

Тип: редакторский UX. Зависит: WP2 (юзабилити-база), опц. WP9. **Не** конверсионный P0. «Как во
взрослых сервисах»: пошаговый тур + контекстные подсказки + чек-лист старта, чтобы непрофи без
инструкции понял, что делать. Делать **поздним треком** — тур по пустой/недоделанной админке
бесполезен, нужен после того как CMS работает (WP1/WP2) и появился контент (харвест-черновики WP9).

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP10-T1 | Пошаговый тур (spotlight/coachmarks) при первом входе: сайдбар-разделы → «Создать» → медиатека (drag-n-drop) → публикация/предпросмотр (WP9) → настройки/Метрика. Состояние «тур пройден» в `Setting`/localStorage, повтор из меню помощи | `apps/ncottage-admin/src/components/onboarding/Tour.tsx` (новый), `app-shell.tsx` | WP2, WP9 | M | Тур проходится по 5-6 шагам; после дизмисса не мешает; можно перезапустить | [DEP] |
| WP10-T2 | Контекстные подсказки: tooltip-«?» + текст под нетривиальными полями (slug/«место в списке»/картинка для соцсетей/технология/координаты/пакеты/публикация) — расширение §3.1 п.6; переиспользовать shadcn `Tooltip` | `components/form/*`, `*Form.tsx` | WP2 | M | У каждого нетривиального поля — подсказка с примером и куда попадёт на сайте |
| WP10-T3 | Чек-лист старта на дашборде «Настройте сайт»: контакты → первый проект+фото → 8-800/мессенджеры → ID Метрики → первая публикация; прогресс по РЕАЛЬНОМУ состоянию (есть ли contacts/projects/metrika), дизмисс | `apps/ncottage-admin/src/app/(dashboard)/OnboardingChecklist.tsx` (новый) | WP2, WP9 | M | Пункты отмечаются по факту заполнения; исчезает по завершении/дизмиссу |
| WP10-T4 | Умные пустые состояния: в каждом разделе при 0 записей — «Создайте первый …» + кнопка + мини-гайд (переиспользовать `EmptyState`). Баннер для импортных черновиков: «163 дома импортированы черновиками — проверьте и опубликуйте» (WP9) | `components/EmptyState`, разделы, `ProjectsTable` | WP2, WP9 | S | Ни одного «голого» пустого списка; баннер импорта ведёт к публикации |
| WP10-T5 | (опц.) «Что нового»/спотлайты новых фич — маленький бейдж/поповер на новых разделах (публикация, квиз), дизмисс. Низкий приоритет | `components/onboarding/Whatsnew.tsx` | WP10-T1 | S | Новые фичи подсвечиваются один раз, дизмиссятся |

**Оговорки.** (1) **Библиотека тура** (аппрув выдан): рекомендую `driver.js`
(~5 КБ, без зависимостей, простой API) либо свой лёгкий overlay без пакета; `react-joyride`/`shepherd.js`
тяжелее. (2) Пара с **визуальным рескином админки** (см. предложенный `ADMIN-UX.md` — пока не в бэклоге):
онбординг и «красивый вид» — один admin-UX трек (P1), отдельный от основного конверсионного (P0).
(3) Часть уже частично есть: `EmptyState` (из QA), поле-подсказки §3.1 п.6 — WP10 их доводит до системы.

---

## WP11 — Расширенные фичи (P2, после основного трека; модель заложена заранее)

Тип: расширенные фичи, **приоритет P2** — реализуются после основного трека (P0/P1). Модель/данные под них закладываются заранее (в P0), чтобы легли без переделки. Здесь фиксируются решения владельца, чтобы код P0/P1 им не противоречил.

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP11-T1 | **Индивидуальный лендинг** — отдельная страница-лендинг под индивидуальные проекты. НЕ карточка каталога и НЕ `projectType`: не заводить бейдж «Индивидуальный», второй лейаут карточки или таб в каталоге. Сейчас — только не противоречить (никакого `projectType` в модели/UI) | — (планшет) | — | — | В каталоге нет сущности/бейджа/таба «Индивидуальный»; лендинг — отдельный трек | P2 |
| WP11-T2 | **ЛК-эпик:** passwordless-вход, трекинг стройки, чат; синхронизация анонимного избранного/сравнения (WP6-T9) при входе; success-хук лид-формы (WP6-T10) ведёт в этот ЛК. Сейчас — заглушки-офферы, данных под ЛК не строим | — (планшет) | WP6-T9, WP6-T10 | — | Анонимные фичи не требуют аккаунта; ЛК-оффер — заглушка; синк отложен | P2 |
| WP11-T3 | **YandexProvider** для карты: карта за интерфейсом `MapProvider`, старт — `LeafletProvider`, `YandexProvider` — вторым провайдером; выбор через конфиг `MAP_PROVIDER` + ключ из Setting/env. Сейчас — только абстракция интерфейса в WP5-T1, второй провайдер не пишем | `apps/ncottage-www/src/components/features/works/map/*` (интерфейс — в WP5-T1) | WP5-T1 | — | Есть интерфейс `MapProvider` и конфиг `MAP_PROVIDER`; YandexProvider не реализован | P2 |
| WP11-T4 | **Смена URL опубликованного + 301:** модель `SlugRedirect` (PRISMA §1.11) + кнопка «Изменить адрес» в CMS (пишет редирект old→new, меняет slug) + резолв-fallback в www-роутах `/projects/[slug]`,`/works/[slug]` (живой slug → 301 из `SlugRedirect` → 404). Сейчас НЕ строим: slug авто-из-name при создании, замораживается при публикации, менять URL опубликованного нельзя (кнопки нет) | `apps/ncottage-api/prisma/schema.prisma`, www-роуты `/projects`,`/works`, `apps/ncottage-admin` | WP0, WP9 | — | Кнопка «Изменить адрес» пишет `SlugRedirect` и меняет slug; старый URL 301'ится на новый; живой slug приоритетнее редиректа; на MVP — заморозка без смены | P2 |

**Оговорка.** Settlement/посёлки — **убраны** (заказчик подтвердил: продаж с участком и своих коттеджных посёлков нет). Сущность и FK не заводим.

---

## WP8 — Сквозные аудиты + финальный PR

Тип: QA. Зависит: все.

| id | Задача | Целевые файлы | Зависит | Размер | DoD | Флаг |
|---|---|---|---|---|---|---|
| WP8-T1 | Сквозной прогон `pnpm -r typecheck`, `pnpm lint`, `pnpm -r build`; починка остаточных ошибок | — (весь репозиторий) | WP0–WP10 | M | Все три команды зелёные на итоговом дереве | |
| WP8-T2 | Визуальный аудит ключевых маршрутов (каталог/деталь проекта/works/works-slug/квиз/главная): пустые состояния, deep-link, аналитические события | — | WP8-T1 | M | Нет визуальных регрессий; события уходят в dataLayer; deep-link префиллит | |
| WP8-T3 | Финальный PR (мержит владелец): conventional-заголовок, тело с чек-листом WP, отметка [CONTENT]-хвостов | — | WP8-T2 | S | PR открыт, CI зелёный; мерж вручную владельцем | |

---

## 3. Граф зависимостей и порядок

**Зависимости (что от чего). `A → B` = B нужен A.**
- **WP0** (модель + shared + seed) — **фундамент**; от него зависят WP1, WP2, WP4, WP5, WP6.
- **WP3** (аналитика/события) — стартует **параллельно WP0** (нужен WP0 лишь точечно: WP3-T4 ← WP0-T5).
- **WP1** (медиа) → нужен для WP5 (works/карта) и WP7 (контент).
- **WP4** (каталог), **WP5** (works + карта) ← WP0 (+ WP5 ещё ← WP1).
- **WP6** (конверсия) ← WP0 и WP3.
- **WP7** (контент) — отдельный трек ← WP1.
- **WP8** (сквозной аудит + финальный PR) — **последний, гейтит всё**.

**Самая длинная цепочка зависимостей (задаёт порядок реализации):**
`WP0-T2/T3 (shared-типы) → WP0-T6..T11 (prisma expand+миграция) → WP0-T13 (api-мапперы) → WP1-T2..T4 (медиа во формы + миграция legacy) → WP5-T1..T4 (карта + /works/[slug]) → WP7-T3 (наполнение объектов) → WP8`.

Это самая длинная цепочка: модель обязана застыть первой (её ждут все витринные и CMS-треки), а `/works/[slug]` — самая тяжёлая новая витринная поверхность и одновременно потребитель и медиа-миграции (WP1), и связок (WP0-T8..T10). WP4 (каталог) и WP6 (конверсия) тяжёлые, но короче: их можно параллелить после застывания WP0. WP7-контент идёт хвостом и деградирует, поэтому в порядок реализации кода входит только той частью, что нужна для рендера (пакеты по мигрированным домам для калькулятора — WP7-T1).

**Узкое горлышко:** WP0 — единая точка сериализации. Пока schema не смёржена, витринные агенты работают против типов shared (WP0-T1..T5), но не против БД. Значит T1..T5 (shared) закрыть первыми, максимально быстро.

---

## 4. Порядок реализации (волны по зависимостям, не по времени)

Волны задают **порядок** (что после чего может стартовать), а не расписание. Внутри волны — параллельно;
между волнами — по зависимостям §3. Агент проходит все волны до конца, ничего не откладывая и не гейтя по времени.

**Волна 1 — застыть модель + стартовать аналитику (блокирует всех):**
- **Последовательно (блокирует всех):** WP0-T1 → T2, T3, T4, T5 (shared-контракты). Как только shared собран в `dist` — разблокирует витрину/CMS в части типов.
- **Параллельно с shared:** WP3-T1..T4 (аналитика — почти независима от WP0, кроме T4←T5).
- **Следом, последовательно по prisma:** WP0-T5a (enum LeadSource), T6 → T7 → T8 → T9 → T10 → T10a (Promo) → T11 (schema expand + одна миграция под всё).

**Волна 2 — api-обвязка + разъезд треков:**
- **Последовательно:** WP0-T12 (backfill built-objects) → WP0-T13 (api-мапперы) → WP0-T14 (seed-заглушки). После T13/T14 БД и api зелёные — открываются все зависимые треки.
- **Параллельно стартуют (после T13):**
  - CMS-агент: WP1-T1 → T2 → T3 (медиа во формы + валидатор), затем WP2-T1..T6 (юзабилити).
  - Каталог-агент: WP4-T1..T3 (карточка+фильтры), затем WP4-T4..T10 (деталь).
  - Works-агент: WP5-T1, T2 (карта+сетка) — на реальных типах, данные позже.
  - Конверсия-агент: WP6-T7 (consent) + WP6-T4/T5 (trust/sticky) — не ждут WP1.

**Волна 3 — тяжёлые новые поверхности:**
- **Параллельно:**
  - Works: WP5-T3 → T4 → T5 (`/works/[slug]`, связки, форма записи) — зависит от WP1-T4 (медиа-миграция), поэтому WP1-T4 закрыть первым.
  - Конверсия: WP6-T1 (квиз) → T2, T3 (CTA/мессенджеры), T6 (Promo-дедлайн).
  - Каталог: добить WP4-T9/T10 (калькулятор/showroom), если не закрыто.
  - CMS: WP1-T4 (миграция legacy-URL) → T5, T6; WP2 хвосты.

**Волна 4 — контент + снос legacy + аудит:**
- **Последовательно/параллельно:** WP5-T6 (снос WordPress-ссылок) после WP1-T4.
- **Трек WP7 (контент):** WP7-T1 (импорт 163 черновиками + пакеты по мигрированным) первым — без пакета калькулятор не рендерится на карточке; WP7-T2/T3/T4 — по мере поступления контента.
- **Замыкание:** WP8-T1 (сквозной typecheck/lint/build) → WP8-T2 (визуал) → WP8-T3 (PR).

### Трек WP7 — контент (что мигрируется из legacy, что на заказчике)

| Пункт | Источник | Кто |
|---|---|---|
| Галереи проектов 10-20 фото | дешёвое — миграция из `ncottage.ru` (`migrate-media.ts`); недостающее — заказчик | миграция + заказчик |
| Пакеты по мигрированным домам (состав до брендов) | структура из legacy-корпуса (§Б, БАЗ/СТД/КОМФ), у каждого материал-варианта свои; **цены под ключ** | заказчик |
| Фото/данные построенных объектов, фотохроники | фото — миграция из legacy (десятки–130 фото/объект); параметры/связи/статусы | миграция + заказчик |
| Сертификаты (0/7) | сканы | заказчик |
| ID счётчика Метрики, 8-800, ссылки TG/WA/агрегаторов | — | заказчик |
| Отзывы + ссылки Яндекс/2ГИС | тексты — legacy/освежить; ссылки | заказчик |

**Пометка:** до поступления контента [CONTENT]-задачи оставляют каркас с пустым состоянием — сборка зелёная, витрина неполная. Ни одна [CONTENT]-задача не в основной цепочке реализации кода, кроме WP7-T1 (packages) для рендера калькулятора.

---

## 5. Риски (где сборка может встать)

1. **Миграция NOT NULL / enum.** Прямой ввод NOT NULL-полей или `enum` вместо `String` на непустой таблице (8 проектов, 12 объектов) уронит `prisma migrate`. Митигация: строго expand-фаза (nullable/`@default`), backfill идемпотентным скриптом, contract — поздней отдельной миграцией и только после наполнения. `technology/objectType` держать `String` со слаг-значениями enum (валидация в shared/DTO), а не Postgres-enum, пока не забэкфилен весь набор — иначе миграция упрётся в несуществующее значение.

2. **Пакеты не у всех домов → калькулятор не рендерится.** `ProjectCalculator` требует `packages[]` (теперь под `ProjectMaterialVariant`); у демо/части импортированных домов их нет → блок пустой/битый. Митигация: WP4-T9 обязан рендерить пустое состояние («Рассчитать через квиз») при отсутствии packages у варианта; глобальный квиз-«Подбор» (WP6-T1) — фолбэк-лид-магнит, не требующий packages; WP7-T1 (пакеты по мигрированным) закрывает по контенту, публикуются только дома с проверенными ценами (WP9). Без этого «конверсия №1» не работает на части каталога.

3. **Byte-identity API.** Существующие потребители (www SSG, admin) читают текущую форму ответа projects/built-objects. Расширение мапперов (WP0-T13) не должно менять сериализацию существующих полей (`type`→`objectType`, `coords`→`coordsLat/Lng`, `href` nullable) без обновления обоих концов. Митигация: новые поля — аддитивно; переименования (`type/coords/relatedObjectIds`) провести синхронно в shared+api+www в одной цепочке WP0-T3/T13 + WP5-T6, с временной обратной совместимостью на чтении.

4. **Зависимости (Leaflet, tour-либа).** Аппрув **выдан заранее** (владелец, standing — см. «Полномочия» вверху), блокировки на согласовании НЕТ. Карта — **Leaflet+OSM** в двух местах: витрина (WP5-T1) и CMS-пикер координат (WP2-T7), один пакет на оба. Слой карты абстрагировать интерфейсом `MapProvider` (свап на Я.Карты тривиален, YandexProvider — P2). Деградации (список+статичные пины / ручной ввод координат) остаются фолбэком на рантайм-недоступность карты, не на аппрув.

5. **Медиа-миграция legacy-URL (WP1-T4) — сетевой I/O к ncottage.ru.** Скрипт качает внешние файлы; часть может быть 404/недоступна. Риск: частичная миграция, битые превью. Митигация: идемпотентность + логирование недостающих (уже есть `_missing_*` в корпусе как ориентир), пустое состояние «Файл не найден» (WP1-T5); отсутствующий файл не валит билд.

6. **Сериализация shared → dist.** Витринные/CMS-агенты импортируют `@forge/shared` из собранного `dist`. Если shared не пересобран после WP0-T1..T5, downstream `pnpm -r build` покажет старые типы. Митигация: shared-задачи закрывать первыми и пересобирать `dist` до старта зависимых треков (узкое горлышко §3).

7. **Параллельная запись в одно дерево.** 5 агентов пишут одновременно; коллизии по общим файлам (`layout.tsx`, `settings.ts`, `TopBar.tsx`, `useLeadForm.ts`, `schema.prisma`, `index.ts` shared). Митигация: **вся дельта `schema.prisma` — только WP0-агент** (включая enum `LeadSource` WP0-T5a и Promo `deadline/badge` WP0-T10a; конверсионные WP6-T6/WP6-T1 схему не трогают, работают на застывшей модели) и shared/index.ts; `layout.tsx`/`settings.ts`/`useLeadForm.ts` затрагиваются несколькими WP (WP3/WP4/WP6) — сериализовать через порядок коммитов (аналитика WP3 → sticky WP6 в layout; useLeadForm: события WP3-T3 до consent WP6-T7).
