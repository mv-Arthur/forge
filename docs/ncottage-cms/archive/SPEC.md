# ТЗ: ncottage CMS «под ключ»

Статус: черновик к согласованию · Дата: 2026-06-21

Этот документ описывает целевое состояние backend (`ncottage-api`) и админки
(`ncottage-admin`) для ncottage — переход от текущего MVP к полноценной
CMS, через которую редактор управляет **всем** контентом сайта без правок кода.

Сопутствующий документ: [ROADMAP.md](./ROADMAP.md) — разбивка на этапы и PR.

---

## 1. Контекст и проблема

Что есть сейчас (MVP, смержен в `main`):

- `ncottage-api` (NestJS + Fastify + Prisma + Postgres): лиды, проекты, JWT-auth.
  Вложенные поля проекта (`specs`/`floorPlans`/`packages`/`options`) хранятся
  целиком в JSON-колонках. Доставка лида — `NoopLeadDelivery` (только запись в БД).
- `ncottage-admin` (Next 15, App Router): голый UI без дизайн-системы и Tailwind,
  ручные формы, вложенные структуры редактируются как **сырой JSON в `<textarea>`**.
  Покрыты только проекты и лиды.
- `ncottage-www`: из API приходят **только проекты**. Остальной контент (~22 типа
  сущностей, 150–200 элементов) захардкожен в `src/content`, `src/data` и в коде
  страниц — см. [приложение A](#приложение-a-инвентаризация-захардкоженного-контента).

Проблемы:

1. Админкой невозможно пользоваться неразработчику (JSON в textarea, нет валидации,
   нет навигации/таблиц/превью).
2. Модель проекта не нормализована — нельзя ни валидировать структуру вложенного,
   ни делать кросс-проектные запросы.
3. Нет управления медиа — пути к картинкам/PDF вбиваются руками строкой.
4. Лиды никуда не доставляются (нет уведомлений менеджеру).
5. 95% контента сайта правится только через деплой.

## 2. Цели и не-цели

**Цели:**

- Админка уровня готового продукта: дизайн-система, навигация, таблицы со
  списками/фильтрами, типизированные формы с валидацией, удобный редактор
  вложенных структур (без сырого JSON), медиа-библиотека с загрузкой.
- Нормализованная модель данных в backend; контракты в `@forge/shared`.
- Управление через CMS: проекты, медиа, лиды (+доставка), контент страниц и SEO.
- Сайт продолжает работать как статика + ISR; при изменении контента — ревалидация.

**Не-цели (на этот этап):**

- Не переходим на готовую CMS-платформу (Payload/Strapi/Directus) — оставляем свою
  (подтверждённое ранее решение).
- Не вводим многоязычность (контент только на русском; модель не закладывает i18n).
- Не вводим публичный личный кабинет/регистрацию пользователей сайта (RBAC из D6 —
  только для админки).
- Не строим универсальный «block-builder» в стиле Notion — секции страниц
  типизированы (см. §6.3).

## 3. Принятые решения

Согласовано 2026-06-21. Помечены `D#` для ссылок из ROADMAP.

- **D1. Хранилище медиа:** S3-совместимое. Локально — MinIO (docker-compose рядом
  с Postgres), в проде — Yandex Object Storage / S3. Загрузка через API.
- **D2. Доставка лидов:** Telegram-бот + email (SMTP), оба через `LeadDeliveryPort`.
  Синхронно при создании лида, с записью `deliveredAt`/`deliveryError` и ручной
  повторной отправкой из админки.
- **D3. UI-кит админки:** Tailwind CSS + shadcn/ui (Radix). Формы — react-hook-form
  + zod. Таблицы — TanStack Table.
- **D4. Нормализация проекта:** полная. Массивы вложенного (`floorPlans`, `packages`
  с `includes`, `options`, `images`) выносятся в отдельные таблицы; `specs`
  (5 фиксированных полей) — в колонки самого `Project`. Валидация на уровне БД,
  возможны кросс-проектные запросы.
- **D5. Объём контент-CMS:** мигрируем **весь** захардкоженный контент, поэтапно по
  приоритету (см. ROADMAP, эпик E) — включая низкочастотные юридические страницы.
- **D6. Доступ:** мультиюзер с ролями (RBAC). Минимум две роли — `admin` (полный
  доступ, в т.ч. удаление и управление пользователями) и `editor` (контент без
  удаления/управления пользователями). Управление пользователями — в админке.
- **D7. Ревалидация www:** on-demand ISR через секретный revalidate-эндпоинт в
  `ncottage-www`, который дёргает API после успешной мутации (по тегам/путям).

## 4. Целевая архитектура (обзор)

```
ncottage-admin (Next 15, Tailwind+shadcn)
   │  server actions / server-side fetch (Bearer из httpOnly cookie)
   ▼
ncottage-api (NestJS)
   ├── auth        JWT
   ├── projects    нормализованная модель
   ├── media       upload + метаданные ──▶ S3/MinIO
   ├── leads       CRUD + доставка (Telegram/email)
   ├── content     страницы, секции, коллекции (blog/services/…)
   └── revalidate  ──▶ ncottage-www /api/revalidate (on-demand ISR)
   ▼
Postgres (Prisma)

ncottage-www (статика + ISR) ── читает публичные GET API
```

Принципы:

- `@forge/shared` — единственный источник доменных типов и enum-словарей для всех
  трёх приложений.
- В `ncottage-api`/`@forge/shared` относительные импорты с `.js` (ESM); в Next-
  приложениях (`admin`/`www`) — **без** `.js` (ломает webpack-резолв).
- Публичные `GET` без авторизации; все мутации — под `JwtAuthGuard` + `RolesGuard`
  (RBAC, D6): удаление и управление пользователями — только `admin`, остальной
  контент — `editor`/`admin`.
- Админка не ходит в API из браузера: только server-side, токен из httpOnly cookie.

## 5. Backend (`ncottage-api`)

### 5.1 Модель данных (Prisma)

Нормализуем проект и добавляем медиа и контент. Ключевые сущности:

**Media** — единое хранилище ссылок на файлы:
```
Media { id, key, url, filename, mime, size, width?, height?, alt?, folder?, createdAt }
```
Проекты и контент ссылаются на `Media` по `id` (или хранят денормализованный `url`
для отдачи на фронт — решить в PR; см. ROADMAP C/B).

**Project** (нормализация, D4): скаляры + `specs`-поля прямо в таблице; вынести:
```
ProjectImage    { id, projectId, mediaId, order }
ProjectFloorPlan{ id, projectId, label, mediaId, area?, order }
  ProjectFloorPlanRoom { id, floorPlanId, name, area, order }
ProjectPackage  { id, projectId, name, price, tagline?, highlighted, order }
  ProjectPackageInclude { id, packageId, label, value, order }
ProjectOption   { id, projectId, label, price, note?, order }
ProjectRelation { projectId, relatedProjectId }   // вместо relatedObjectIds: string[]
```
`@@unique`/`order`-поля для стабильной сортировки. Каскадное удаление детей.

**Lead** — как есть + доставка (см. §5.4); добавить `deliveryAttempts`, индексы.

**Admin/User** (RBAC, D6): добавить `role` к существующей модели `Admin`
(`enum Role { admin, editor }`, default `editor`), опц. `name`, `createdAt`.
Первый суперюзер заводится сидом/env; дальнейшие — через админку.
```
Admin { id, email (unique), name?, passwordHash, role, createdAt }
```

**Content** — страницы и коллекции (см. §6):
```
Page        { id, key (unique), title, seo..., updatedAt }      // singleton-страницы
PageSection { id, pageId, type, order, data (Json|нормализ.) }  // секции главной и т.п.
Article     { id, slug, title, ..., sections, seo... }          // блог
Service     { id, slug, ..., seo... }  + дочерние таблицы полей
Promo, Review, Vacancy, FaqItem, BuiltObject, Certificate, Partner, NavItem, Setting
SeoMeta     { ownerType, ownerId, title, description, ogImageId } // или поля на сущностях
```
Точная нормализация каждой контент-сущности — в рамках своего PR (эпик E); часть
редкоменяемых вложенных полей допустимо оставить структурированным JSON с zod-
валидацией на входе (прагматичный компромисс, см. D5).

### 5.2 Модули и слои

Сохраняем текущую раскладку NestJS (`module`/`controller`/`service`/`dto`).
Добавляем модули: `media`, `content` (или по-доменно: `pages`, `blog`, `services`…),
`revalidate`, `users` (управление учётками/ролями, D6). `auth` расширяется
`RolesGuard` + декоратором `@Roles`. Сервисы инкапсулируют Prisma; контроллеры
тонкие; DTO с `class-validator`. Маппинг row→domain — в сервисе (как в
`ProjectsService`).

### 5.3 Media API

- `POST /media` (auth, multipart) — загрузка файла в S3, запись метаданных,
  опционально извлечение размеров изображения.
- `GET /media` (auth) — список с пагинацией/фильтром по папке/типу.
- `DELETE /media/:id` (auth) — удаление (с проверкой ссылок или soft-delete).
- Презайнед-URL для прямой загрузки крупных файлов — опционально.

### 5.4 Доставка лидов (D2)

- `LeadDeliveryPort` → `CompositeLeadDelivery` оркеструет провайдеры.
- `TelegramLeadDelivery` (Bot API, chat_id из env), `EmailLeadDelivery` (SMTP).
- На `POST /leads`: создать → доставить → записать `deliveredAt` или
  `deliveryError`+`deliveryAttempts`. Ошибка доставки **не** валит создание лида.
- `POST /leads/:id/redeliver` (auth) — ручная повторная отправка из админки.
- Конфиг провайдеров через env-валидацию (`config/env.validation.ts`).

### 5.5 Revalidate (D7)

- После успешной мутации контента/проекта API вызывает
  `ncottage-www` `/api/revalidate?secret=…` с тегами/путями.
- Альтернатива: админка сама дёргает revalidate после server action. Решить в PR.

## 6. Контент-модель сайта (эпик E)

Полная инвентаризация — [приложение A](#приложение-a-инвентаризация-захардкоженного-контента).
Сгруппировано по способу управления:

### 6.1 Настройки (singletons / key-value)

Навигация (`NAV_ITEMS`), футер, глобальные контакты (телефоны, адреса, соцсети,
реквизиты). Модель: `Setting`-записи по ключу или выделенные singleton-таблицы.
Редактор — одна форма на сущность.

### 6.2 Коллекции

Блог (Article), Услуги (Service + SEO), Акции (Promo), Отзывы (Review), Вакансии
(Vacancy), FAQ (FaqItem с группами), Построенные объекты (BuiltObject),
Сертификаты, Партнёры. Редактор — список (data-table) + форма создания/правки.

### 6.3 Страницы с секциями

Главная (`home.ts`, ~13 секций) и аналогичные лендинги (финансы, производство).
Подход: на странице фиксированный набор **типизированных** секций; каждая секция —
своя форма (hero, advantages, stages, geography, reviews, faq, contact …).
Не универсальный block-builder, а типобезопасные редакторы под известные секции.

### 6.4 SEO

На каждую публичную сущность/страницу — `title`, `description`, `ogImage`
(через медиа), опц. canonical/robots. Хранение — поля на сущности или общий
`SeoMeta`. Используется в `generateMetadata` страниц `ncottage-www`.

## 7. Админка (`ncottage-admin`)

### 7.1 Дизайн-система (D3)

- Tailwind CSS + shadcn/ui (Radix-примитивы): Button, Input, Select, Dialog,
  DropdownMenu, Toast/Sonner, Table, Tabs, Card, Form.
- react-hook-form + zod (resolver) — единый паттерн форм с инлайн-валидацией.
- TanStack Table — списки с сортировкой/фильтрами/пагинацией.
- Учесть `@types/react` dedupe (tsconfig paths react/react-dom) при добавлении
  зависимостей со styled-jsx-цепочкой.

### 7.2 Каркас

- Layout с боковой навигацией (Проекты, Медиа, Лиды, Контент → подразделы),
  топбар с текущим админом и выходом, хлебные крошки.
- Редизайн страницы логина.
- Унифицированные состояния: загрузка, пусто, ошибка, тост после действия.

### 7.3 Паттерн редакторов

- **Список:** data-table (поиск, фильтры по словарям из `@forge/shared`, пагинация,
  действия в строке: править/удалить/дублировать).
- **Форма:** секционная; вложенные массивы — **repeater** (`useFieldArray`):
  добавить/удалить/перетащить (dnd), валидация каждого элемента. Никакого сырого
  JSON для floorPlans/packages/options.
- **Медиа-поле:** `MediaPicker` — выбор из библиотеки или загрузка, превью,
  множественный выбор + сортировка для галерей.
- Server actions для мутаций; оптимистичные тосты; ревалидация списка.

### 7.4 Управление пользователями (RBAC, D6)

- Раздел «Пользователи» (виден только роли `admin`): список, создание/удаление
  учёток, смена роли (`admin`/`editor`), сброс пароля.
- В UI скрывать действия, недоступные текущей роли (удаление, управление
  пользователями), даже если backend их всё равно отклонит (`RolesGuard`).

## 8. Нефункциональные требования

- **Типобезопасность:** контракты в `@forge/shared`, `pnpm -r typecheck` зелёный.
- **Сборка:** `@forge/shared` собирается перед потребителями (топологически).
- **Валидация:** на входе API (`class-validator`/zod) и в формах (zod).
- **Безопасность:** мутации только под JWT; медиа-загрузка — проверка mime/размера;
  секреты (S3, SMTP, Telegram, revalidate) — только в env (gitignored).
- **Тесты:** e2e backend против живой БД (как уже заведено через docker-compose);
  smoke публичных GET. Критичные сервисы (доставка, нормализация) — unit.
- **Производительность фронта:** статика + ISR сохраняются; ревалидация по тегам.
- **Совместимость:** миграции Prisma обратимы; сид обновляется под новую модель.
- **DoD ncottage-www** соблюдается для всех изменений публичного сайта
  (см. правила forge workflow).

## 9. Миграция данных

- Текущие проекты в БД (JSON-поля) → нормализованные таблицы: миграция данных
  (Prisma migration + скрипт переноса JSON→строки).
- Захардкоженный контент www → сид/импорт-скрипты per-сущность (переиспользуем
  существующие `src/content`/`src/data`/`*.ts` как источник для разового импорта).
- Обновить `prisma/seed.ts` и `seed-data` под новую модель.
- Существующая учётка `admin@ncottage.local` мигрирует в роль `admin` (D6).

## 10. Риски

- Объём контент-CMS большой (~22 сущности) — строго фазировать (ROADMAP E1…E5),
  не блокировать ядро (проекты/медиа/лиды) контентом.
- Нормализация проекта затрагивает www-чтение и сид — нужен аккуратный PR с
  миграцией данных и обновлением `ProjectsService.toDomain`.
- Tailwind/shadcn в админке — следить за `@types/react` dedupe и styled-jsx.
- Доставка лидов зависит от внешних сервисов — обязательны таймауты и
  изоляция ошибок от создания лида.

---

## Приложение A. Инвентаризация захардкоженного контента

Источник — аудит `apps/ncottage-www`. Кандидаты на перенос в CMS:

| Сущность | Где сейчас | Объём | Тип в CMS |
|---|---|---|---|
| Навигация (меню) | `src/content/site.ts` | 12 пунктов + подменю | Setting/singleton |
| Футер | `src/content/site.ts` | 2 офиса, 10+ ссылок | Setting/singleton |
| Контакты (телефоны/адреса/соцсети/реквизиты) | `src/content/contacts.ts` | 2 города, 4 адреса, 5 соцсетей | Setting/singleton |
| Главная (13 секций: hero, picker, catalog, advantages, quote, works, stages, geography, reviews, featured, guarantees, faq, contact) | `src/content/home.ts` | ~50+ элементов | Page + Sections |
| О компании | `app/about/page.tsx` | 4 факта + 8 команда + 9 timeline | Page + Sections |
| Гарантия | `app/guarantee/page.tsx` | 4+3+4 | Page/Collection |
| FAQ (страница) | `app/faq/page.tsx` | 3 группы × 4 Q&A | Collection (FaqItem) |
| Отзывы | `app/reviews/page.tsx` + home | 8 отзывов + метрики | Collection (Review) |
| Вакансии | `app/vacancies/page.tsx` | 2 вакансии | Collection (Vacancy) |
| Акции | `app/promos/promos.ts` | 2 акции | Collection (Promo) |
| Услуги + SEO | `app/services/services.ts`, `[slug]/seoContent.ts` | 9 услуг × 30+ полей, 6 сценариев | Collection (Service) |
| Производство | `app/production/page.tsx` | 11 элементов | Page/Sections |
| Ипотека/Кредит/Маткапитал/Оплата | `app/{mortgage,credit,maternity-capital,payment}` | 4 × ~16 (FinanceLanding) | Page/Sections |
| Блог | `app/blog/articles.ts` | 8 статей (~31 КБ текста) | Collection (Article) |
| Построенные объекты | `src/data/built-objects.json` | 12+ объектов | Collection (BuiltObject) |
| Сертификаты | `app/certificates/page.tsx` | 7 | Collection |
| Партнёры | `app/partners/page.tsx` | 12 | Collection |
| Юр. страницы (privacy, offer, requisites, personal-data) | `app/*/page.tsx` | ~40+ | Page (низкий приоритет) |
| Проекты | API (`src/data/projects.ts`) | — | уже в API, нормализуем |
