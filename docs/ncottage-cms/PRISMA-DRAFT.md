# Черновик схемы БД под редизайн (Project / BuiltObject)

> **Роль (для агента):** КАНОНИЧЕСКИЙ док по prisma-схеме редизайна — точные типы, `@default`, миграции
> expand→backfill→contract, byte-identity, материал-варианты (§1.10), Setting/Quiz/SlugRedirect (§1.11). Реализуя
> модель/миграции — источник ЗДЕСЬ. Человеческий обзор (поля↔контролы, зачем) — REDESIGN-TZ §1; задачи —
> BUILD-BACKLOG WP0. Реальные `schema.prisma`/`@forge/shared`/сиды тут НЕ меняются (это описание изменений).

Черновик по REDESIGN-TZ.md §1 (модель) и §1.6 (prisma-дельта). Реальные `schema.prisma`,
`@forge/shared`, сиды **не меняются** — здесь только описание изменений.

Опорные факты по текущему коду:
- Паттерн миграций в проекте: expand -> backfill (`prisma/migrate-*.ts`) -> contract
  (см. `20260621182408_expand_projects` + `migrate-projects.ts` + `20260621183500_contract_projects`).
- `BuiltObject.technology/objectType` уже добавлены как nullable `TEXT`
  (`20260629151401_add_built_object_labels`), в схеме — `String?`.
- Сериализация ответов идёт через явные whitelist-мапперы `toDomain`
  (`projects.service.ts:38`, `built-objects.service.ts:9`) с omit-when-empty. Это ключ к
  byte-identity (раздел 6): новая колонка не попадает в ответ, пока маппер её не читает.

Обозначения: `+` — добавить, `~` — изменить существующее, `nested` — вложенная сущность
с `@relation`, `@@index`, `onDelete: Cascade` по образцу текущих детей `Project`.

---

## 1. Дифф по моделям (prisma-сниппеты)

### 1.1 `Project` (+поля, +обратная связь)

```prisma
model Project {
    // ... существующие поля без изменений ...

    // + идентификация и тизер
    code     String? // + СП-2/КД-2; бейдж на карточке
    subtitle String? // + «Одноэтажный дом из клееного бруса…»

    // + цена/акция
    oldPrice          Int?      // + зачёркнутая старая цена, ₽
    priceValidAt      DateTime? // + мягкая срочность
    discountLabel     String?   // + метка акции (лучше из связи с Promo)
    mortgageAvailable Boolean   @default(false) // + бейдж; ставка — в Setting

    // + площади/геометрия
    livingArea    Int?    // + жилая площадь, м²
    builtUpArea   Int?    // + площадь застройки, м²
    ceilingHeight Float?  // + высота потолков, м
    beamSection   String? // + сечение бруса/блока (дерево/комбо)

    // + контент
    warranty          String? // + сейчас хардкод «7 лет» в JSX
    facadeFinish      String? // + rich: PNZ/Osmo, штукатурка/кирпич
    videoReviewUrl    String? // + embed RuTube/VK/YouTube
    videoTimelapseUrl String? // +
    tour3dUrl         String? // + опция (не P0, §Д п.4)

    // + крючки планировки
    planEditable    Boolean @default(false) // + «меняется бесплатно»
    floorPlanMirror Boolean @default(false) // + зеркальное отражение

    // + обратная связь (закрывает разрыв relatedObjectIds)
    builtObjects BuiltObject[] // + N объектов, построенных по этому проекту

    // + новые nested
    planningVariants ProjectPlanningVariant[]
    engineering      ProjectEngineering[]
    stages           ProjectStage[]
    roomCounts       ProjectRoomCount[]
}
```

Все новые скалярные поля — `?` (nullable) или `Boolean @default(false)`. NOT NULL без
дефолта не вводится (см. раздел 3), поэтому backfill по `Project` не нужен.

**Исключение — `Project.floors` (существующее поле, меняет тип `Int → String`).** Домен этажности
редизайна — закрытый набор `"1" | "1.5" | "2" | "mansard"` (значения 1.5/мансарда не влезают в `Int`).
Реализация — `String` + const-набор в shared (паттерн §1.10 «фиксированные наборы + const», НЕ
Prisma-enum: член enum не может начинаться с цифры). Это единственная смена типа существующей
NOT NULL-колонки → отдельное contract-окно с backfill (§3 шаг v), не expand.

### 1.2 Изменения существующих nested `Project`

```prisma
model ProjectFloorPlan {
    // ...
    dimensions String? // + габариты Д×Ш плана
}

model ProjectRelation {
    // ...
    kind String @default("similar") // + similar | other-material
}
```

`ProjectRelation.kind` берёт `@default("similar")` — все текущие строки backfill'ятся дефолтом
на уровне БД, отдельный скрипт не нужен.

### 1.3 Новые nested-модели `Project`

```prisma
// Варианты планировки (типовой/со вторым светом/с гаражом).
model ProjectPlanningVariant {
    id        String  @id @default(cuid())
    projectId String
    name      String
    mediaId   String? // ссылка на Media (картинка варианта)
    note      String?
    order     Int
    project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

    @@index([projectId])
}

// Инженерка с числом точек (электрика от 55, канализация от 7 и т.п.).
model ProjectEngineering {
    id        String  @id @default(cuid())
    projectId String
    system    String  // select: electrical|sewage|heating|water|…
    points    Int?    // число точек/механизмов
    note      String?
    order     Int
    project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

    @@index([projectId])
}

// Понедельный таймлайн стройки (Проект 5-6 нед, Фундамент 6-9 …).
model ProjectStage {
    id        String  @id @default(cuid())
    projectId String
    name      String
    weeksFrom Int?
    weeksTo   Int?
    order     Int
    project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

    @@index([projectId])
}

// Счётчики помещений (гардероб/терраса/балкон/постирочная); type — slug из PROJECT_ROOM_TYPES.
model ProjectRoomCount {
    id        String  @id @default(cuid())
    projectId String
    type      String
    count     Int
    order     Int
    project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

    @@index([projectId])
}
```

Примечание по §Д п.1: `ProjectPackage` остаётся **гибким 1..N** (не хардкодить 3 пакета —
это стандарт legacy, а не gwd/aps). Модель уже такова, менять не нужно.

### 1.4 `BuiltObject` (обогащение)

```prisma
model BuiltObject {
    id         String   @id @default(cuid())
    slug       String   @unique
    title      String
    // ~ image -> heroMediaId (миграция 12 объектов, раздел 3.ii)
    // ~ href -> nullable; для внутренних строится из slug (/works/[slug])
    href       String?
    heroMediaId String? // + обложка через Media (уход от хотлинка ncottage.ru)

    area       Int?
    location   String?
    coordsLat  Float?
    coordsLng  Float?

    // technology/objectType/style/workType — slug → Taxonomy (kind=…), §1.10 (не enum/const)
    objectType String? // slug → Taxonomy(kind=objectType)
    technology String? // slug → Taxonomy(kind=technology)

    // + классификация/фильтры
    status   String  @default("built") // built | in-progress (BUILT_OBJECT_STATUSES) — поведенческий const
    workType String? // slug → Taxonomy(kind=workType); табы-фильтр /works
    style    String? // slug → Taxonomy(kind=style)
    bedrooms Int?
    bathrooms Int?
    floors   String? // закрытый набор "1"|"1.5"|"2"|"mansard" (String+const; 1.5/мансарда не влезают в Int)
    residenceMode String?

    // + даты стройки (buildDuration — авто из дат на витрине)
    contractDate   DateTime?
    buildStartDate DateTime?
    moveInDate     DateTime?

    // + цена/экономика
    price       Int?
    showPrice   Boolean @default(false)
    utilityCost String? // «отопление 3-5 тыс ₽/мес»

    // + кейс клиента (сверх-legacy, §Д п.6)
    ownerName         String?
    familyComposition String?
    story             String? // rich лонгрид

    // + медиа/иммерсив
    videoUrl        String?
    tour3dUrl       String? // опция (§Д п.4)
    onlineCameraUrl String? // только для in-progress

    // + связи
    baseProjectId String?
    baseProject   Project?     @relation(fields: [baseProjectId], references: [id], onDelete: SetNull)
    reviewId      String?
    review        Review?      @relation(fields: [reviewId], references: [id], onDelete: SetNull)

    // + витрина/SEO
    featured       Boolean @default(false)
    seoTitle       String?
    seoDescription String?

    // + nested
    photos     BuiltObjectPhoto[]
    milestones BuiltObjectMilestone[]

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@index([status])
    @@index([featured])
    @@index([baseProjectId])
    @@index([technology])
    @@index([objectType])
}
```

Замечания:
- `technology/objectType/style/workType` — `String`-slug → `Taxonomy` (§1.10), НЕ enum и НЕ const в
  коде (подписи с сервера, редактор администрирует набор). `status` остаётся `String`+const
  (поведенческое поле). Историческая enum-форма (`objectType BuiltObjectType?`,
  `technology Technology?`, …) в §2.1 **отменена** решением §1.10 (Taxonomy) — оставлена ниже лишь как
  контекст сравнения enum-vs-String; для реализации ориентироваться на §1.10.
- `@@index([technology])`/`@@index([objectType])`/`@@index([status])` валидны для обоих
  вариантов (Postgres индексирует и `TEXT`, и enum-колонку).
- FK-связи используют `onDelete: SetNull` (а не `Cascade`), потому что удаление проекта/отзыва
  не должно удалять объект — только обнулять ссылку. Это отличается от nested-детей.
- `reviewId -> Review` даёт обратную сторону `Review.builtObjects[]` (см. §1.6); отдельного
  `Review.builtObjectId` не заводим.
- `baseProjectId` — наш FK сверх legacy (§Д п.5): двунаправленная связь + секция «Посмотреть
  вживую» на карточке проекта. Заменяет `relatedObjectIds`-строки из JSON-сида.

### 1.5 Новые nested/связанные модели объекта

```prisma
// Фотохроника объекта (сейчас 1 фото; этапы стройки).
model BuiltObjectPhoto {
    id            String      @id @default(cuid())
    builtObjectId String
    mediaId       String
    caption       String?
    stage         String? // foundation|walls|roof|facade|engineering|interior|exterior|production
    order         Int
    builtObject   BuiltObject @relation(fields: [builtObjectId], references: [id], onDelete: Cascade)

    @@index([builtObjectId])
}

// Вехи «договор -> начало -> заселение» (опц.).
model BuiltObjectMilestone {
    id            String      @id @default(cuid())
    builtObjectId String
    label         String
    date          DateTime?
    note          String?
    order         Int
    builtObject   BuiltObject @relation(fields: [builtObjectId], references: [id], onDelete: Cascade)

    @@index([builtObjectId])
}
```

### 1.6 `Review` (+FK вместо текста)

```prisma
model Review {
    // ... существующие поля ...
    projectSlug  String?       // + врезка-отзыв на карточке проекта (мягкая ссылка на slug)
    builtObjects BuiltObject[] // обратная сторона BuiltObject.reviewId (см. 1.4)

    @@index([projectSlug])
}
```

Замечание: единственная ось связи Review<->BuiltObject — FK `BuiltObject.reviewId -> Review`
(задан в §1.4). Его обратная сторона в `Review` — массив `builtObjects BuiltObject[]` (Prisma
требует обе стороны именованной relation). Скалярное поле `builtObjectId String?` в самом
`Review`, которого требует §1.6 ТЗ, **не добавляем**: оно завело бы вторую конкурирующую ось
связи (либо дубль relation, потребовав второго именованного `@relation` в обе стороны, либо —
без своего `@relation` — висячую колонку без связи). Принадлежность «этот отзыв про конкретный
объект» уже выражается через `BuiltObject.reviewId`. Итог: в `Review` только `projectSlug String?`
+ обратный массив `builtObjects BuiltObject[]`. Ниже в разделе 4 (shared) отражено как
`reviewSlug?: string` на `BuiltObject` и `projectSlug?`/врезка на `Review`. См. также раздел
«Замечания к REDESIGN-TZ.md» в конце — строка §1.6 ТЗ про `Review.builtObjectId` требует правки.

### 1.7 `Lead` / `LeadSource`

```prisma
enum LeadSource {
    contacts
    callback
    project
    works
    built_object // + (доменное значение 'built-object')
    quiz         // +
    promo        // +
    subscribe    // +
    individual   // + (WP11: лендинг индивидуального проектирования; доменное 'individual')
}

model Lead {
    // ...
    consent Boolean // ~ было Boolean? — устранить историческую nullable-колонку
    // ...
}
```

Prisma-enum не допускает дефис в идентификаторе, поэтому член enum — `built_object`, а
доменное строковое значение в `@forge/shared` остаётся `"built-object"`. Маппинг — в DTO/сервисе
Lead (значение приходит kebab-case, в БД пишется `built_object`). См. раздел 6 про byte-identity
существующих значений.

`consent`: `Boolean?` -> `Boolean` — это NOT NULL без дефолта на существующей колонке, требует
backfill (раздел 3.iii). Уточнение атрибуции: API-контракт **уже** жёсткий —
`create-lead.dto.ts:56` объявляет `@Equals(true) consent!: boolean`, то есть все входящие через API
лиды обязаны слать `consent=true`. Nullable в БД был лишь исторической слабиной init-миграции
(`"consent" BOOLEAN` без дефолта); ужесточение схемы только устраняет её, поведение приёма валидных
лидов не меняется. «Hardcoded `true`» относится не к API, а к www-формам: 7 форм передают литерал
`consent: true` (`ContactRequestForm`, `WorksVisitForm`, `PromoLeadForm`, `FinanceLeadForm`,
`ContactSection`, `ProjectLeadForm`, `GuaranteeClaimForm`). Их правка на реальный чекбокс — задача
www-фронта, от миграции схемы не зависит.

### 1.8 `Certificate` (наполнение, не структура)

Структура уже готова: `imageUrl String?`, `fileUrl String?` (`20260629121447_add_certificate_file`).
Изменения схемы **не требуются**. Задача — seed/backfill: залить сканы 7 пустых сертификатов в
Media и проставить `imageUrl/fileUrl`. Отмечено как **seed/backfill**, не миграция DDL.

---

### 1.9 `published` (черновик/публикация) — под WP9

Для сценария «создаём объект → он черновик → публикуем по желанию» + предпросмотр
(BUILD-BACKLOG WP9). Добавить на обе основные сущности:

```prisma
model Project {
    // ...
    published Boolean @default(false) // + черновик по умолчанию; публика видит только true
}

model BuiltObject {
    // ...
    published Boolean @default(false) // +
}
```

- **Миграция (безопасно, но с backfill):** `@default(false)` добавляется в expand-окне (WP0), однако
  **существующие 8 проектов и 12 объектов backfill'ить в `true`** (они уже «живые») — иначе редизайн
  спрячет текущий каталог. Backfill — в `migrate-*.ts` (`UPDATE ... SET published = true`).
- **Seed:** мигрированный/демо-контент = `published: true`; харвест-импорт 163 домов
  (archive/HARVEST-REPORT.md) заливается `published: false` (публикуются вручную по подтверждению цен/фото).
- **API:** публичные `list`/`getBySlug` фильтруют `where: { published: true }`; админ-список и
  www-preview видят всё через общий `x-preview-secret` (env `PREVIEW_SECRET`) или валидный admin-JWT.
- **shared:** `published?: boolean` на `Project`/`BuiltObject` (опц. — старые сериализованные объекты
  остаются валидны).
- **byte-identity:** новое поле аддитивно; но публичный фильтр `published:true` **меняет состав
  выдачи** (черновики исчезают). Для существующих 8+12 (backfill → true) выдача не меняется; эффект
  проявляется только на новых черновиках — это и есть цель фичи, не регресс.
- Не путать с `BuiltObject.status` (стадия стройки built/in-progress, §1.4) — это отдельная ось.

---

### 1.10 Таксономия-справочники (CMS) + материал-варианты

Два уточнения модели по итогам планирования.

**(1) Справочные поля — администрируются из CMS, не хардкодятся.** `technology`, `style`, `features`,
`objectType`, `workType` — это теги для классификации/фильтра/подписи; код на конкретных значениях
НЕ ветвится → редактор управляет набором сам. Модель — единый справочник:

```prisma
model Taxonomy {
    id    String @id @default(cuid())
    kind  String // technology | style | feature | objectType | workType
    slug  String // латиница, стабильный ключ (фильтры/URL)
    label String // русская подпись — ЖИВЁТ ЗДЕСЬ (не в labels.ts, не в бандле)
    order Int    @default(0)

    @@unique([kind, slug])
    @@index([kind])
}
```

- `Project.technology/style` = `String` slug → term; `Project.features` = `String[]` slug'ов;
  `BuiltObject.technology/objectType/workType/style` — так же. Валидация записи — по актуальному набору
  term'ов (не по коду).
- Подписи (`label`) приходят **с сервера** (Taxonomy) → витрина рендерит их server-side (ISR/SSR), в
  клиентский бандл не запекаются. Редактор поменял подпись → изменилось везде без деплоя.
- **Сид словаря** — из legacy-таксономии §Г ТЗ (15 технологий / 14 стилей / 21 особенность — у нас есть).
- **Ссылочная целостность:** нельзя удалить term, который используют проекты/объекты (или переназначить);
  нет дубль-slug; переименование `label` безопасно, смена `slug` — с бэкофиллом ссылок.

**Поведенческие поля остаются `String` + const в коде** (см. §2): `BuiltObject.status`
(built/in-progress — управляет вкладками/онлайн-камерой), `BuiltObjectPhoto.stage` (код группирует фото
по этапам), `ProjectRelation.kind` (similar/other-material — разные блоки на странице), `Project.livingType`.
Их редактор не администрирует — под них написана логика; `labels.ts` в коде остаётся **только** для них.

**(2) Материал-варианты.** Один дом = один `Project`; материалы
(газобетон/кирпич/СИП) — вложенные варианты, у каждого своя цена и свои пакеты:

```prisma
model ProjectMaterialVariant {
    id           String           @id @default(cuid())
    projectId    String
    technology   String           // slug term (kind=technology)
    priceFrom    Int              // «под ключ от», ₽ (маркетинговая)
    mortgageFrom Int?             // ₽/мес
    order        Int              @default(0)
    project      Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)
    packages     ProjectPackage[] // Базовая/Стандарт/Комфорт — ПОД вариантом (у каждого материала свои)

    @@index([projectId])
}
```

- `ProjectPackage` **переезжает** с `Project` на `ProjectMaterialVariant` (харвест подтверждает: у
  каждого материала свой состав/цены — archive/HARVEST-REPORT.md). `Project.price` становится денормализованным
  «от» (min по вариантам) для карточки/сортировки; источник — варианты.
- Единообразие: даже одноматериальный дом имеет один `ProjectMaterialVariant`. Миграция существующих:
  на каждый проект создать дефолт-вариант, перенести его текущие `packages`/`price` под него (это и есть
  «переструктура пакетов», цена этой модели).
- Каталог = 163 карточки; на детальной переключатель материала меняет цену/пакеты (заменяет альтернативу с
  314 near-дублями). Харвест `research/.corpus/projects.normalized.json` уже сгруппирован домами с
  `variants[]` → ложится на модель напрямую.

---

### 1.11 `Setting` (обогащение) + `Quiz`/`QuizStep` (админимый подбор)

**Setting** — уже существует частично; обогащается редактируемыми из CMS полями (одна строка-синглтон):

```prisma
model Setting {
    // ... существующие поля ...
    phone         String?
    phone8800     String?
    telegramUrl   String?
    whatsappUrl   String?
    mortgageRate  Float?  // ставка ипотеки, %
    warranty      String? // бывший хардкод «7 лет» (уходит с Project)
    yearsOnMarket Int?
    productionM2  Int?
    recommendPct  Int?
    metrikaId     String?
    mapProvider   String? @default("leaflet") // leaflet | yandex (F4 MapProvider)
    mapApiKey     String?
}
```

**Quiz/QuizStep** — структура квиза «Подбор» администрируется из CMS (PODBOR-DESIGN §5; НЕ хардкод, НЕ
Setting-строка). Матчинг ответов = тот же `SelectionFilter`, что у фильтров каталога (один движок):

```prisma
model Quiz {
    id        String     @id @default(cuid())
    slug      String     @unique @default("podbor")
    title     String?
    steps     QuizStep[]
    updatedAt DateTime   @updatedAt
}

model QuizStep {
    id        String  @id @default(cuid())
    quizId    String
    criterion String  // ключ словаря критериев: purpose|area|budget|floors|bedrooms|material|style
    label     String
    options   Json    // [{ label, value }] — value маппится в SelectionFilter
    required  Boolean @default(false)
    order     Int
    quiz      Quiz    @relation(fields: [quizId], references: [id], onDelete: Cascade)

    @@index([quizId])
}
```

**`SlugRedirect`** (P2) — 301-редиректы при осознанной смене URL опубликованной записи (§1.1 «Правило
slug»). На MVP НЕ заводится (URL опубликованного заморожен, менять нельзя); добавляется вместе с кнопкой
«Изменить адрес» (WP11-T4):

```prisma
model SlugRedirect {
    id        String   @id @default(cuid())
    entity    String   // "project" | "builtObject"
    oldSlug   String
    entityId  String   // → Project.id / BuiltObject.id (для резолва текущего slug записи)
    createdAt DateTime @default(now())

    @@unique([entity, oldSlug])
    @@index([entityId])
}
```

Резолв `GET /projects|works/{slug}`: (1) живой `slug` (published=true) → 200; (2) иначе `SlugRedirect.oldSlug`
→ 301 на текущий slug записи по `entityId`; (3) иначе 404. Живой slug приоритетнее редиректа (шаг 1 до шага 2).

Вся дельта `schema.prisma` (включая `ProjectRoomCount`, `Setting`-обогащение, `Quiz`/`QuizStep`; `SlugRedirect` —
P2, не WP0) заводится в WP0 — правило «схема — только WP0-агент».

---

## 2. Enum vs String — решение и обоснование

> **Обновление (см. §1.10):** `technology/style/features/objectType/workType` переведены на
> CMS-справочник `Taxonomy` (не enum и не const-в-коде). Раздел ниже про enum-vs-String теперь касается
> ТОЛЬКО поведенческих полей `status/stage/kind/livingType` — по ним решение прежнее: **`String` + const**.

Ключевое ограничение: `Project.technology` и `Project.style` **сейчас `String`** и читаются
мапперами как `row.technology as Project["technology"]`. Перевод их в Prisma-enum:
- потребовал бы конверсии существующих 8 строк -> enum-члены (небезопасный шаг);
- жёстко связал бы набор значений с миграцией БД (добавление стиля = DDL), тогда как shared уже
  держит `PROJECT_STYLES`/`TECHNOLOGIES` как источник правды для UI-лейблов и фильтров;
- рискует byte-identity: Postgres-enum сериализуется тем же строковым литералом, но любая
  опечатка/несовпадение члена -> ошибка вставки на сидах, которых сейчас нет.

**Решение (смешанное, по осям):**

| Ось | Тип в Prisma | Обоснование |
|---|---|---|
| `Project.technology` | оставить `String` | не ломать byte-identity 8 проектов; значения валидируются shared-константой `TECHNOLOGIES` в DTO |
| `Project.style` | оставить `String` | то же; расширяем `PROJECT_STYLES` в shared, не в БД |
| `Project.features` | оставить `String[]` | массив тегов, валидируется `PROJECT_FEATURES` в DTO |
| `BuiltObject.technology` | `String` -> `Technology` enum | значения сейчас = 0 заполнено (nullable, только что добавлено), конверсия дешёвая; ТЗ §1.6 требует «перевести на общий enum» |
| `BuiltObject.objectType` | `String` -> `BuiltObjectType` enum | замкнутый список (house/bath/foundation/reconstruction/guesthouse), фильтр /works |
| `BuiltObject.status` | `BuiltObjectStatus` enum | новое поле, замкнутый список built/in-progress |
| `BuiltObject.style` | `ProjectStyle` enum (опц.) | новое nullable-поле; можно и `String` для симметрии с `Project.style` — см. ниже |

**Компромисс по `BuiltObject.style`/`Technology`:** чтобы не держать один и тот же словарь в
двух местах (Prisma-enum + shared-константа), допустимо оба варианта:
- (A) Prisma-enum `Technology`/`BuiltObjectType`/`BuiltObjectStatus` — строгая БД-валидация, но
  дублирует shared и добавляет DDL при расширении. `BuiltObject.style` тогда лучше **тоже**
  `String` (симметрия с `Project.style`, единый источник `PROJECT_STYLES`).
- (B) все три — `String` + валидация shared-константой в DTO (как `Project.technology`).
  Единообразие с `Project`, ноль DDL при расширении словаря, byte-identity тривиальна.

**Рекомендация:** вариант (B) — `BuiltObject.technology/objectType/status/style` как `String`
с валидацией shared-константами. Причины: (1) `Project.technology/style` уже `String` — вариант
(A) создаёт асимметрию «объект строгий enum, проект слабый string» на одном и том же словаре
`Technology`; (2) расширение таксономии (barn/wright/scandi/panoramic и др. из §Д/§Г) не требует
миграции; (3) byte-identity выходной строки гарантирована тождественно (значение как хранили, так
и отдаём). Тогда конверсия 3.i превращается в чистый backfill строковых значений без смены типа
колонки (безопаснее). Ниже enum-предложения даю в двух видах: как Prisma-enum и как
расширение shared-констант (**рекомендуемое** — String+const).

### 2.1 Предложения значений (словари)

```prisma
// Prisma-enum-форма (историческое). Значения — латиница как в коде/фильтрах.
enum BuiltObjectType {
    house
    bath
    foundation
    reconstruction
    guesthouse
}

enum BuiltObjectStatus {
    built
    in_progress // доменное 'in-progress' (дефис нельзя в enum-члене)
}

// Technology/ProjectStyle как enum — дублируют shared; при варианте B не создаются.
enum Technology {
    gas_concrete // 'gas-concrete'
    brick
    frame
    sip
    fachwerk
    foam_block   // 'foam-block'
    modular
    combined
}
```

Расширение shared-констант (**рекомендуемое, String+const** — раздел 4):
- `PROJECT_STYLES` += `barn`, `wright`, `scandi`, `panoramic`.
- `PROJECT_FEATURES` += `mansard-windows`, `panoramic-glazing`.
- `BUILT_OBJECT_TYPES` (новая): `house | bath | foundation | reconstruction | guesthouse`.
- `BUILT_OBJECT_STATUSES` (новая): `built | in-progress`.
- `Technology` (существующая) переиспользуется для `BuiltObject.technology`.

При варианте B в Prisma остаются только `BuiltObjectStatus`/`BuiltObjectType` как **String с
дефолтом** (`status String @default("built")`) — либо не как enum вовсе; `Technology`/`ProjectStyle`
на `BuiltObject` — `String?`. Тогда byte-identity строк тривиальна, DDL-enum не заводится.

---

## 3. План миграции (expand -> backfill -> contract)

Порядок применения — по образцу `expand_projects`/`migrate-projects.ts`/`contract_projects`.
Разделяю на безопасные (одношаговые) и небезопасные (три окна).

### Безопасные шаги (одна миграция, backfill не нужен)

Все новые скаляры `Project`/`BuiltObject` — nullable или `@default`. Не требуют backfill:

- `Project`: `code, subtitle, oldPrice, priceValidAt, discountLabel, livingArea, builtUpArea,
  ceilingHeight, beamSection, warranty, facadeFinish, videoReviewUrl, videoTimelapseUrl,
  tour3dUrl` — `NULL` по умолчанию.
- `Project`: `mortgageAvailable, planEditable, floorPlanMirror` — `@default(false)`.
- `ProjectFloorPlan.dimensions` — nullable.
- `ProjectRelation.kind` — `@default("similar")` (БД проставит существующим строкам).
- `BuiltObject`: `heroMediaId, workType, style, bedrooms, bathrooms, floors, residenceMode,
  contractDate, buildStartDate, moveInDate, price, utilityCost, ownerName, familyComposition,
  story, videoUrl, tour3dUrl, onlineCameraUrl, seoTitle, seoDescription, baseProjectId,
  reviewId` — nullable.
- `BuiltObject`: `status @default("built"/built)`, `showPrice @default(false)`,
  `featured @default(false)`.
- Новые таблицы `ProjectPlanningVariant/ProjectEngineering/ProjectStage/BuiltObjectPhoto/
  BuiltObjectMilestone` — создаются пустыми, backfill не требуется.
- FK `baseProjectId/reviewId` — nullable, `ON DELETE SET NULL`. Добавление
  constraint на пустых/NULL-значениях безопасно (шаг iv).

SQL-набросок (expand, безопасная часть):

```sql
ALTER TABLE "Project"
  ADD COLUMN "code" TEXT,
  ADD COLUMN "subtitle" TEXT,
  ADD COLUMN "oldPrice" INTEGER,
  ADD COLUMN "priceValidAt" TIMESTAMP(3),
  ADD COLUMN "discountLabel" TEXT,
  ADD COLUMN "mortgageAvailable" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "warranty" TEXT,
  ADD COLUMN "livingArea" INTEGER,
  ADD COLUMN "builtUpArea" INTEGER,
  ADD COLUMN "ceilingHeight" DOUBLE PRECISION,
  ADD COLUMN "beamSection" TEXT,
  ADD COLUMN "facadeFinish" TEXT,
  ADD COLUMN "videoReviewUrl" TEXT,
  ADD COLUMN "videoTimelapseUrl" TEXT,
  ADD COLUMN "tour3dUrl" TEXT,
  ADD COLUMN "planEditable" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "floorPlanMirror" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "ProjectFloorPlan" ADD COLUMN "dimensions" TEXT;
ALTER TABLE "ProjectRelation" ADD COLUMN "kind" TEXT NOT NULL DEFAULT 'similar';

ALTER TABLE "BuiltObject"
  ADD COLUMN "heroMediaId" TEXT,
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'built',
  ADD COLUMN "workType" TEXT,
  ADD COLUMN "style" TEXT,
  ADD COLUMN "bedrooms" INTEGER,
  ADD COLUMN "bathrooms" INTEGER,
  ADD COLUMN "floors" TEXT, -- закрытый набор "1"/"1.5"/"2"/"mansard" (String+const)
  ADD COLUMN "residenceMode" TEXT,
  ADD COLUMN "contractDate" TIMESTAMP(3),
  ADD COLUMN "buildStartDate" TIMESTAMP(3),
  ADD COLUMN "moveInDate" TIMESTAMP(3),
  ADD COLUMN "price" INTEGER,
  ADD COLUMN "showPrice" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "utilityCost" TEXT,
  ADD COLUMN "ownerName" TEXT,
  ADD COLUMN "familyComposition" TEXT,
  ADD COLUMN "story" TEXT,
  ADD COLUMN "videoUrl" TEXT,
  ADD COLUMN "tour3dUrl" TEXT,
  ADD COLUMN "onlineCameraUrl" TEXT,
  ADD COLUMN "baseProjectId" TEXT,
  ADD COLUMN "reviewId" TEXT,
  ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "seoDescription" TEXT;
-- + CREATE TABLE для 6 новых моделей + индексы + FK (генерит prisma migrate)
```

### (i) `BuiltObject.technology`/`objectType`: String -> enum (небезопасно)

Актуально **только при варианте A** (Prisma-enum). При рекомендованном варианте B колонки
остаются `String`, и это вырождается в чистый backfill без DDL типа.

Expand: добавить новые enum-колонки рядом со старыми строковыми.
```sql
CREATE TYPE "Technology" AS ENUM ('gas_concrete','brick','frame','sip','fachwerk','foam_block','modular','combined');
CREATE TYPE "BuiltObjectType" AS ENUM ('house','bath','foundation','reconstruction','guesthouse');
ALTER TABLE "BuiltObject"
  ADD COLUMN "technology_enum" "Technology",
  ADD COLUMN "objectType_enum" "BuiltObjectType";
```
Backfill (`prisma/migrate-built-objects.ts`, идемпотентный, по образцу `migrate-projects.ts`):
маппинг рус/legacy-эвристика -> enum-член. Источник значений — текущие 12 строк
(`technology`/`objectType` сейчас `NULL` у всех, так что backfill идёт из `title`-эвристики):
- title содержит «СИП»/«SIP» -> `sip`; «Каркасн» -> `frame`; «газобетон»/«газосиликат» ->
  `gas_concrete`; «кирпич»/«поризован» -> `brick`; «фахверк» -> `fachwerk`; иначе оставить NULL.
- `objectType`: «Баня» -> `bath`; «Дом» -> `house`; «Фундамент» -> `foundation`; иначе NULL.
```sql
-- пример строки backfill (реально — в TS-скрипте с маппингом словами)
UPDATE "BuiltObject" SET "technology_enum" = 'sip' WHERE "title" ILIKE '%СИП%';
UPDATE "BuiltObject" SET "objectType_enum" = 'bath' WHERE "title" ILIKE '%Баня%';
```
Contract: удалить строковые, переименовать enum-колонки.
```sql
ALTER TABLE "BuiltObject" DROP COLUMN "technology", DROP COLUMN "objectType";
ALTER TABLE "BuiltObject" RENAME COLUMN "technology_enum" TO "technology";
ALTER TABLE "BuiltObject" RENAME COLUMN "objectType_enum" TO "objectType";
```

**При варианте B (рекомендуемый):** шага (i) нет как DDL. Только опциональный seed-backfill —
проставить строковые `technology/objectType/style` 12 объектам той же эвристикой. Тип колонки
не меняется, byte-identity абсолютна (маппер отдаёт строку как есть).

### (ii) `image` -> `heroMediaId` (12 объектов, небезопасно)

Expand: `heroMediaId` уже добавлен в безопасном шаге; `image` пока остаётся (оба присутствуют).
Backfill (`prisma/migrate-built-objects.ts`): для каждого из 12 объектов взять хотлинк
`ncottage.ru/app/uploads/*` из `image` -> скачать файл -> залить через `MediaService.upload` в
MinIO -> получить `Media.id` -> проставить `heroMediaId`. Идемпотентность: пропускать объекты, у
которых `heroMediaId != null`, либо матчить по стабильному `Media.key` (детерминированный из
исходного URL), чтобы повторный прогон не плодил дубли в MinIO.
```
for row in BuiltObject where heroMediaId is null and image ~ '^https?://':
    media = MediaService.upload(fetch(row.image), key=hash(row.image))
    UPDATE "BuiltObject" SET "heroMediaId" = media.id WHERE id = row.id
```
Contract: после успешного backfill всех 12 — дропнуть `image` и сделать `href` nullable (см. ниже).
```sql
ALTER TABLE "BuiltObject" DROP COLUMN "image";
ALTER TABLE "BuiltObject" ALTER COLUMN "href" DROP NOT NULL;
```

**Атомарность contract-окна `image` (обязательно в одном коммите с `DROP COLUMN "image"`).**
После дропа колонки Prisma-клиент регенерируется по схеме без `image`, поэтому любой код,
пишущий/читающий `image` напрямую, перестанет компилироваться/исполняться. В том же коммите:
- **`seed.ts` / `seedBuiltObjects` (seed.ts:180-189):** убрать `image: item.image` из объекта
  `data` upsert (create/update), вместо него писать `heroMediaId` (значение из сида после
  MinIO-миграции). Иначе повторный `pnpm seed` упадёт: `image` в `data` ссылается на несуществующую
  колонку / Prisma-клиент отвергнет неизвестное поле.
- **`built-objects.service.ts` `toDomain` (built-objects.service.ts:13):** `image: row.image` ->
  разрешать URL обложки из `Media` по `heroMediaId` (не из `row.image`). Аналогично убрать
  `image` из `create`/`update` data (built-objects.service.ts:54,76) и DTO-маппинга.
- **`built-objects.json`:** убрать поле `image`, добавить `heroMediaId`.

Без этой атомарной правки сид и рантайм-маппер сломаются сразу после `DROP COLUMN "image"`.

**Замечание по `href` (атомарно с `href -> nullable`).** Сейчас `href` = `/our-works/...`
(битые WordPress-ссылки). После редизайна внутренние объекты строят путь из slug (`/works/[slug]`)
на витрине, поле нужно только для внешних ссылок -> делаем nullable. Значения `/our-works/*` в БД
чистит отдельный seed-скрипт (или проставляет NULL), не DDL. Одновременно с переводом `href` в
nullable **обязательно** перевести строку маппера `href: row.href` (built-objects.service.ts:13)
на omit-when-empty: `...(row.href ? { href: row.href } : {})`. Сейчас маппер отдаёт `href`
безусловно (в отличие от `area/location/type` под условным спредом). Если этого не сделать, то как
только сид обнулит `/our-works/*`, строка с `href = NULL` вернётся из API как `href: null`, а
доменный тип станет `href?: string` (опущенный ключ) -> расхождение БД-NULL / JSON-`null` /
omit-семантики. Для наличных 12 объектов (href заполнен) ответ не меняется; правка нужна ровно под
NULL-строки, которые создаёт чистка сида.

### (iii) Новый NOT NULL без дефолта: `Lead.consent` Boolean? -> Boolean

Единственный такой случай. Expand не нужен (колонка уже есть). Backfill + contract:
```sql
-- backfill: исторические лиды без явного согласия трактуем консервативно.
UPDATE "Lead" SET "consent" = false WHERE "consent" IS NULL;
-- contract:
ALTER TABLE "Lead" ALTER COLUMN "consent" SET NOT NULL;
```
Обоснование дефолта `false`: юридически безопаснее не приписывать согласие задним числом. На
приём новых лидов не влияет — API-DTO уже требует `@Equals(true) consent` (`create-lead.dto.ts:56`),
а `isValidLead` — `consent === true`. Backfill затрагивает только исторические строки с
`consent IS NULL`; `SET NOT NULL` лишь фиксирует уже де-факто обязательный контракт. Правка
www-форм (снятие литерала `consent: true`) — отдельно от этой миграции (см. §1.7).

Все прочие новые `BOOLEAN NOT NULL` берут `@default(false)` и потому backfill не требуют.

### (iv) FK `baseProjectId` (nullable, безопасно)

Добавляется в безопасном expand-шаге (nullable). Constraint на пустых значениях проходит без
проверок существующих строк. Аналогично `reviewId`. `ON DELETE SET NULL`.
```sql
ALTER TABLE "BuiltObject"
  ADD CONSTRAINT "BuiltObject_baseProjectId_fkey"
  FOREIGN KEY ("baseProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

### (v) `Project.floors`: `Int -> String` (небезопасно)

Единственная смена типа существующей NOT NULL-колонки. Домен редизайна — закрытый набор
`"1"|"1.5"|"2"|"mansard"` (1.5/мансарда не выражаются `Int`). expand → backfill → contract:
```sql
-- expand: новая строковая колонка рядом
ALTER TABLE "Project" ADD COLUMN "floors_str" TEXT;
-- backfill: перелить целые как строки ('1','2'); "1.5"/"mansard" проставляются при импорте/редактуре
UPDATE "Project" SET "floors_str" = "floors"::text WHERE "floors_str" IS NULL;
-- contract: снять старую, переименовать, вернуть NOT NULL
ALTER TABLE "Project" DROP COLUMN "floors";
ALTER TABLE "Project" RENAME COLUMN "floors_str" TO "floors";
ALTER TABLE "Project" ALTER COLUMN "floors" SET NOT NULL;
```
Backfill идемпотентен (`WHERE floors_str IS NULL`). shared: `Project.floors: number -> string`,
`SelectionFilter.floors/floorsIn -> string`/`string[]` (§4.4). Витринный рендер `${floors} эт.`
совместим со строкой; числовых сравнений по этажности нет (фильтр — чипы-мультивыбор).

### Сводка «нужен ли backfill»

| Шаг | Тип | Backfill |
|---|---|---|
| Новые nullable-скаляры Project/BuiltObject | безопасно | нет |
| Boolean-поля с `@default(false)` | безопасно | нет |
| `ProjectRelation.kind @default("similar")` | безопасно | нет (БД-дефолт) |
| Новые nested-таблицы | безопасно | нет |
| FK baseProjectId/reviewId (nullable, SET NULL) | безопасно | нет |
| (i) technology/objectType -> enum (историческое) | небезопасно | да (эвристика по title) |
| (i') technology/objectType/style строкой (принято) | безопасно (seed) | опц. seed-backfill |
| (ii) image -> heroMediaId | небезопасно | да (скачать 12 + MinIO) |
| (iii) Lead.consent NOT NULL | небезопасно | да (NULL -> false) |
| (v) Project.floors Int -> String | небезопасно | да (int -> text) |

---

## 4. Правки `@forge/shared` (описание, не применять)

### 4.1 Константы

```ts
// project.ts
export const PROJECT_STYLES = [
    "modern","finnish","german","loft","chalet","hi-tech","minimalism",
    "barn","wright","scandi","panoramic", // +
] as const;

export const PROJECT_FEATURES = [
    // ...существующие...
    "mansard-windows","panoramic-glazing", // +
] as const;

// новые:
export const BUILT_OBJECT_TYPES = [
    "house","bath","foundation","reconstruction","guesthouse",
] as const;
export type BuiltObjectType = (typeof BUILT_OBJECT_TYPES)[number];

export const BUILT_OBJECT_STATUSES = ["built","in-progress"] as const;
export type BuiltObjectStatus = (typeof BUILT_OBJECT_STATUSES)[number];
```

`PROJECT_STYLES` расширяется в конец — существующие индексы/значения не сдвигаются (byte-identity
UI-лейблов). То же для `PROJECT_FEATURES`.

### 4.2 Интерфейс `Project` (новые опц. поля)

```ts
export interface Project {
    // ...существующие...
    code?: string;
    subtitle?: string;
    oldPrice?: number;
    priceValidAt?: string; // ISO
    discountLabel?: string;
    mortgageAvailable?: boolean;
    warranty?: string;
    livingArea?: number;
    builtUpArea?: number;
    ceilingHeight?: number;
    beamSection?: string;
    facadeFinish?: string;
    videoReviewUrl?: string;
    videoTimelapseUrl?: string;
    tour3dUrl?: string;
    planEditable?: boolean;
    floorPlanMirror?: boolean;
    planningVariants?: { name: string; image?: string; note?: string }[];
    engineering?: { system: string; points?: number; note?: string }[];
    stages?: { name: string; weeksFrom?: number; weeksTo?: number }[];
    builtObjectSlugs?: string[]; // обратная связь: объекты, построенные по проекту
}

export interface ProjectFloorPlan {
    // ...
    dimensions?: string; // +
}
export interface ProjectRelation { // если экспонируется
    relatedSlug: string;
    kind?: "similar" | "other-material"; // +
}
```

Все — опциональны -> старые сериализованные объекты остаются валидны против нового интерфейса.

**Смена существующего поля:** `Project.floors: number -> string` (закрытый набор
`"1"|"1.5"|"2"|"mansard"`, §1.1/§3.v). Не byte-identity — 8 демо-проектов backfill'ятся из int в ту же
цифру-строку (`1 → "1"`); витринный рендер `${floors} эт.` совместим.

### 4.3 Интерфейс `BuiltObject` (обогащение)

```ts
export interface BuiltObject {
    id: string;
    title: string;
    image: string; // остаётся: маппер отдаёт url обложки (из Media по heroMediaId или legacy)
    href?: string; // ~ было обязательным; станет опц. (строится из slug на витрине)
    area?: number;
    location?: string;
    type?: string;
    technology?: string;
    coords?: { lat: number; lng: number };
    // + новые опц.:
    status?: BuiltObjectStatus;
    workType?: string;
    style?: ProjectStyle;
    bedrooms?: number;
    bathrooms?: number;
    floors?: string; // закрытый набор "1"|"1.5"|"2"|"mansard"
    residenceMode?: string;
    baseProjectSlug?: string;
    contractDate?: string;
    buildStartDate?: string;
    moveInDate?: string;
    price?: number;
    showPrice?: boolean;
    utilityCost?: string;
    ownerName?: string;
    familyComposition?: string;
    story?: string;
    videoUrl?: string;
    tour3dUrl?: string;
    onlineCameraUrl?: string;
    reviewSlug?: string; // связанный отзыв    featured?: boolean;
    gallery?: { image: string; caption?: string; stage?: string }[];
    milestones?: { label: string; date?: string; note?: string }[];
    seoTitle?: string;
    seoDescription?: string;
}
```

`href?` — единственное изменение существующего поля с обязательного на опциональное. На витрине
внутренние объекты получают путь из `id`/slug; поле опускается, если пусто. Совместимо со старыми
объектами (у них `href` заполнен). Смена типа на опциональный обязывает синхронно перевести
маппер на omit-when-empty: `...(row.href ? { href: row.href } : {})` (built-objects.service.ts:13
сейчас отдаёт `href: row.href` безусловно). Без этого NULL-`href` (появляется после чистки
`/our-works/*` в сиде, §3.ii) вернётся как `href: null` вместо опущенного ключа — расхождение с
`href?: string`.

### 4.4 `SelectionFilter` + `matchesSelection`

```ts
export interface SelectionFilter {
    mode: "all" | "match";
    matchAny?: boolean;
    livingType?: ProjectLivingType;
    floors?: string;
    floorsIn?: string[];      // + мультивыбор этажности (закрытый набор "1"|"1.5"|"2"|"mansard")
    areaMax?: number;
    areaMin?: number;         // + нижняя граница (диапазон)
    priceMax?: number;        // +
    bedroomsMin?: number;     // + «от»
    bathroomsMin?: number;    // + «от»
    technologyIn?: Technology[]; // + мультивыбор технологии
    style?: ProjectStyle;
    styleIn?: ProjectStyle[];
    featuresAll?: ProjectFeature[];
    descriptionIncludes?: string[];
}
```

Добавляемые ветки `matchesSelection` (в существующий набор `checks`):
```ts
if (filter.areaMin !== undefined) checks.push(project.area >= filter.areaMin);
if (filter.priceMax !== undefined) checks.push(project.price <= filter.priceMax);
if (filter.bedroomsMin !== undefined) checks.push(project.bedrooms >= filter.bedroomsMin);
if (filter.bathroomsMin !== undefined) checks.push(project.bathrooms >= filter.bathroomsMin);
if (filter.floorsIn && filter.floorsIn.length > 0)
    checks.push(filter.floorsIn.includes(project.floors));
if (filter.technologyIn && filter.technologyIn.length > 0)
    checks.push(filter.technologyIn.includes(project.technology));
```

Byte-identity `matchesSelection`: новые ветки срабатывают только когда соответствующее поле
фильтра задано (`!== undefined`). Все 25 существующих `ProjectSelection.filter` (JSON в БД) этих
ключей не содержат -> `checks` не меняется -> результат подборок идентичен. Расширение чисто
аддитивно.

### 4.5 `LeadSource` / `LeadRequest`

```ts
export type LeadSource =
    | "contacts" | "callback" | "project" | "works"
    | "built-object" | "quiz" | "promo" | "subscribe" | "individual"; // + (individual — WP11)

export const LEAD_SOURCES: LeadSource[] = [
    "contacts","callback","project","works",
    "built-object","quiz","promo","subscribe","individual", // +
];

export interface LeadRequest {
    // ...
    consent: boolean; // ~ было consent?: boolean — сделать обязательным (явный чекбокс)
}
```

Доменное значение `"built-object"` (kebab) <-> Prisma-enum `built_object` (underscore) — маппинг
в DTO/сервисе Lead. `isValidLead` уже проверяет `consent === true` и `LEAD_SOURCES.includes` — при
добавлении членов старые 4 источника продолжают проходить без изменений.

---

## 5. Заметки по сиду (`seed-data/*.json` + `seed.ts`)

Изменения сидов — отдельный трек (контент/бэкофилл), не DDL. Что досидить:

- **projects.json (packages 8/8):** сейчас `packages` только у 1 из 8 (`nord`). Без пакетов на 7
  карточках калькулятор не рендерится (WP4/WP6). Досидить хотя бы 1..3 комплектации каждому из
  оставшихся 7 (гибко, §Д п.1 — не форсировать ровно 3). Значения цен — из legacy-медиан
  (8.0/14.5 млн ₽) как заглушки до данных заказчика.
- **projects.json (галереи):** сейчас у всех 8 длина `images` = 1. Довести до 10-20
  (§1.1/§4.2). Реально — миграция фото из legacy `ncottage.ru` + заказчик; в сиде можно оставить
  плейсхолдеры + пометку контент-трека.
- **projects.json (новые поля):** можно оставить пустыми (все опц./дефолт). Точечно заполнить
  `subtitle`, `code`, `warranty` (перенос хардкода «7 лет»), `livingArea` где известно.
- **built-objects.json (фотохроники):** сейчас 12 объектов, 1 фото, хотлинк, `href=/our-works/*`.
  Расширить сид: `heroMediaId` (после MinIO-миграции 3.ii, вместо `image` — поле `image` из json
  убрать), `photos[]` (несколько фото/объект, опц. `stage`), `objectType`/`technology` строкой
  (эвристика по title), `status: "built"`, `reviewSlug` где отзыв про этот объект (FK
  `BuiltObject.reviewId`), `baseProjectSlug` где объект соответствует проекту из каталога,
  `location`/`coords` (уже есть). `href` -> убрать (строится из slug) или NULL.
- **Settlement — убрано:** заказчик подтвердил, что посёлков/участков нет; сущность и FK `settlementId` не заводим.
- **reviews.json:** проставить `projectSlug` (мягкая ссылка на slug проекта). Связь отзыва с
  объектом задаётся **не** в reviews.json, а со стороны объекта — `built-objects.json` проставляет
  `reviewSlug` (FK `BuiltObject.reviewId`). Скаляра `Review.builtObjectId` нет (§1.6), поэтому в
  reviews.json его не сидируем.
- **certificates.json:** 7 записей, 0 с файлами. Залить сканы в Media -> `imageUrl/fileUrl`
  (seed/backfill, блокер доверия §4.2/P2).
- **seed.ts:** расширить upsert-блоки built-objects/reviews новыми полями; порядок сидов не менять
  (built-objects должны сидиться до/независимо от reviews, FK `reviewId` — nullable, так что
  жёсткого порядка нет; `baseProjectId` требует, чтобы проекты были засижены раньше объектов —
  учесть в `seed.ts`). Отдельно (атомарно с contract-дропом `image`, §3.ii): в `seedBuiltObjects`
  (seed.ts:180-189) убрать `image: item.image` из объекта `data`, писать `heroMediaId`; иначе
  повторный `pnpm seed` после `DROP COLUMN "image"` упадёт на неизвестном колонке-поле.

---

## 6. Анализ byte-identity (доказательство неизменности API-ответов)

Тезис: добавление новых опциональных полей и enum-конверсия не меняют существующие ответы
`/projects`, `/projects/[slug]`, `/built-objects`, `/built-objects/[slug]` до тех пор, пока
мапперы `toDomain` не расширены под новые поля. Доказательство опирается на устройство мапперов.

**1. Ответ строится whitelist-маппером, а не сериализацией всей строки.**
`projects.service.ts:38` (`toDomain`) и `built-objects.service.ts:9` (`toDomain`) явно перечисляют
поля результата. Новая колонка в БД (`code`, `oldPrice`, `heroMediaId`, `status`, …) **не
появляется** в JSON, пока в маппер не добавлена строка её чтения. Значит, добавление колонок и
таблиц физически не может изменить текущий байт ответа. Расширение ответа — отдельное осознанное
изменение маппера (в рамках WP4/WP5), а не побочный эффект миграции.

Оговорка: аргумент строг для **добавляемых** колонок. Изменение **существующего** `href` с
обязательного на nullable под него не попадает: маппер отдаёт `href: row.href` **безусловно**
(built-objects.service.ts:13), а не под условным спредом (в отличие от `area/location/type`).
Для наличных 12 объектов (href заполнен) ответ не меняется, но как только сид обнулит `/our-works/*`
в NULL (§3.ii), безусловный маппер вернёт `href: null`, тогда как доменный тип станет `href?: string`
(опущенный ключ) -> расхождение БД-NULL / JSON-`null` / omit-семантики. Поэтому одновременно с
`href -> nullable` строку маппера переводим на omit-when-empty: `...(row.href ? { href: row.href } : {})`
(см. §3.ii, §4.3). Байт-идентичность наличных ответов сохраняется, для NULL-строк — соблюдается
omit-контракт.

**2. Omit-when-empty уже встроен — паттерн для новых полей задан.**
Существующие опц. поля добавляются условно:
- `built-objects.service.ts:15-21`: `...(row.area != null ? { area } : {})`, то же для
  `location/objectType/technology/coords`.
- `projects.service.ts:63-93`: пустые nested (`floorPlans/packages/options`) -> `undefined`;
  `pdfUrl/seoTitle/seoDescription` — по truthiness.
Новые поля мапятся по этому же паттерну (`...(row.code ? { code } : {})`), поэтому для записей без
значения (все текущие 8 проектов и 12 объектов) ключ вообще не сериализуется -> форма ответа для
старых данных не меняется, даже после расширения маппера.

**3. Nullable/дефолтные колонки не трогают существующие значения.**
Все новые скаляры — `NULL` или `@default(false)`. `ProjectRelation.kind @default("similar")`
проставляется существующим строкам как `"similar"`, но `relatedObjectIds`-выход маппера
(`projects.service.ts:90`) читает только `relatedSlug`, не `kind` -> ответ идентичен.

**4. Enum-конверсия сохраняет строковый вывод.**
- String-форма (принято): `BuiltObject.technology/objectType/style` остаются `String`.
  Маппер отдаёт `row.objectType` как есть (`built-objects.service.ts:17` -> `{ type: row.objectType }`).
  Тип колонки не меняется -> вывод байт-в-байт прежний. У 12 текущих объектов эти поля = `NULL`,
  значит и сейчас опускаются -> ответ уже пустой по этим ключам, конверсия его не меняет.
- Prisma-enum-форма (историческое): Postgres отдаёт enum как тот же строковый литерал, а Prisma-клиент —
  как строку-член. Ключевая тонкость: доменные значения с дефисом (`gas-concrete`, `foam-block`,
  `in-progress`) в enum-члене пишутся с подчёркиванием (`gas_concrete`, …). Чтобы сохранить
  byte-identity выходной строки, маппер должен транслировать `_`->`-` (или хранить lookup). Это —
  аргумент за String-словари: там строка хранится и отдаётся тождественно, транслятор не нужен.

**5. `Lead.consent` NOT NULL не меняет ответы.**
`Lead` не сериализуется в публичный витринный ответ (это входящая заявка). Backfill `NULL->false`
и `SET NOT NULL` затрагивают только приём/хранение. API-DTO уже требовал `@Equals(true) consent`
(`create-lead.dto.ts:56`), а `isValidLead` — `consent === true`, поэтому поведение приёма валидных
лидов не меняется; ужесточение схемы лишь устраняет историческую nullable-колонку. Снятие литерала
`consent: true` из 7 www-форм (§1.7) — задача фронта, к форме API-ответа отношения не имеет.

**6. `SelectionFilter`-расширение не трогает существующие подборки.**
Новые ветки `matchesSelection` активируются только при заданном поле фильтра
(`areaMin/priceMax/floorsIn/…`). Ни один из 25 сохранённых `ProjectSelection.filter` этих ключей
не содержит -> `checks` идентичен -> расчёт каталога для всех подборок байт-в-байт прежний.

**Вывод.** Миграция аддитивна и byte-safe при условии: (а) мапперы не расширяются в той же
итерации, что и DDL (WP0 = только модель+миграция+seed-заглушки; WP4/WP5 = чтение новых полей);
(б) выбраны String-словари (`technology/objectType/style` как `String`), что
устраняет риск транслитерации дефис/подчёркивание в enum. Единственный небезопасный по данным шаг
с обязательным backfill — `Lead.consent` (NULL->false) и `image`->`heroMediaId` (скачивание 12
файлов); оба выполняются в backfill-окне и не затрагивают публичные ответы.

---

## Замечания к REDESIGN-TZ.md (для трека C)

Пункты, где текст ТЗ описывает модель неоптимально/ошибочно. Сам ТЗ здесь не правится — это вход
для владельца документа (трек C).

### §1.6, строка 147 (Review): `Review.builtObjectId` как FK не нужен

ТЗ §1.6 формулирует: «Review: +projectSlug, builtObjectId (FK вместо текста)» — то есть требует
добавить в `Review` скалярное поле `builtObjectId` как FK.

Добавлять `Review.builtObjectId` избыточно и создаёт вторую, конкурирующую ось связи
Review<->BuiltObject. Связь «N объектов -> 1 отзыв» уже полностью выражается FK
`BuiltObject.reviewId` (+ обратный массив `Review.builtObjects[]`, §1.4). Отдельный
`Review.builtObjectId` потребовал бы **второго** именованного `@relation` в обе стороны, иначе
Prisma даёт ошибку «relation ... missing opposite» / неоднозначность; без своего `@relation` это
висячая колонка без связи.

Правильная модель: в `Review` только `projectSlug String?` + обратный массив
`builtObjects BuiltObject[]`; сам FK живёт на стороне `BuiltObject.reviewId` (§1.4). К тому же
выводу приходит и проза черновика §1.6. Рекомендация тексту ТЗ: строку §1.6 переписать как
«Review: +projectSlug; связь с объектом — через FK `BuiltObject.reviewId` (не поле в Review)».
