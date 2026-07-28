# Отчёт: мёртвый код, неиспользуемые зависимости, гигиена артефактов

> **ВЫПОЛНЕНО (2026-07-04).** Все `[SAFE-DELETE]` и механические `[REVIEW]` применены
> (коммиты чистки `a808522..24488cd`): удалены мёртвые файлы/символы, подрезаны re-export'ы,
> дедуп типов, убраны `PlusIcon` (каскадная сирота), `ts-node` (api/citadel),
> `@forge/shared`/`fastify` (citadel); гигиена (`.gitignore` + `AGENTS`) применена;
> доки разнесены по `archive/`. `pnpm -r typecheck` зелёный по всем 8 проектам.
> **Отложено:** дедуп `formatArea` (ru-RU группировка — нужна сверка эквивалентности).
> **iron-solver сознательно НЕ тронут** — проект заброшен.

Аудит монорепо `~/Documents/forge`.

## Метод и легенда

- Инструменты: `knip` (монорепо-режим, Next/Nest-плагины), `depcheck` (по каждому пакету), `ts-prune` — прогнаны как baseline; каждая находка **перепроверена grep'ом** на reachability от точек входа по всему репо (импорты, JSX, барели, динамические импорты, string-registry, `package.json` scripts, `.github/workflows`, `*.stories.tsx`, seed-JSON, CSS side-effect).
- Все SAFE-DELETE-кандидаты прошли **адверсариальную проверку** (отдельный агент пытался опровергнуть, найдя пропущенную ссылку) — ни один не опровергнут.
- Исключено из обхода: `node_modules`, `.next`, `dist`, `.git`, `research/`.

Уровни:

- **[SAFE-DELETE]** — 0 ссылок, высокая уверенность, есть доказательство.
- **[REVIEW]** — вероятно мёртвое, но есть неоднозначность (решение за человеком).
- **[KEEP]** — выглядит мёртвым (флагнуто инструментом), но живо по конвенции/строке/структуре — **не трогать**.

**Важная поправка к постановке.** Гипотеза «`ncottage-www/src/domain/*` — осиротевшие локальные копии `@forge/shared`» **инвертирована**: эти файлы — тонкие **re-export-шимы** (`export type {...} from "@forge/shared"`), намеренная архитектура (стабильный путь `@/domain/*`). Мёртвыми оказываются только **отдельные неиспользуемые имена в строке re-export** — их надо убрать из барреля, а сами файлы и `@forge/shared` оставить.

**Второе замечание по охвату.** `packages/shared/src/template.ts` потребляется из `packages/iron-solver` — то есть за пределами `apps/`+`infrastructure/`. Любой аудит «мёртвых» shared-экспортов должен смотреть и на `packages/*`, иначе `renderTemplate` ложно попадёт в мёртвые.

## Сводка

| Уровень | Файлов | Экспортов/значений | Зависимостей | Доков |
|---|---|---|---|---|
| SAFE-DELETE | 12 | ~40 (в осн. re-export-имена) | 1 | 0 |
| REVIEW | 1 (script) | ~25 | 4 | 7 |
| KEEP (значимые FP) | — | ~130 | ~10 | 6 |

Репозиторий в целом **чистый**: 0 настоящих TODO/FIXME/HACK, 0 закомментированного кода, 0 пустых файлов, 0 мёртвых фиче-флагов, 0 осиротевших ассетов.

---

## [SAFE-DELETE]

### Файлы целиком

| # | Путь | Доказательство |
|---|---|---|
| 1 | `apps/ncottage-www/src/app/services/[slug]/ServiceDetailNav.tsx` | `grep -rn ServiceDetailNav apps/ncottage-www/src` → только внутри своего файла; `[slug]/page.tsx` импортирует лишь `Breadcrumbs/Container/getServiceBySlug/...`, не этот компонент. 0 внешних ссылок. |
| 2 | `apps/ncottage-www/src/app/services/[slug]/ServiceFinalCta.tsx` | То же: 0 внешних импортов, 0 JSX `<ServiceFinalCta`. |
| 3 | `apps/ncottage-www/src/app/services/[slug]/ServiceFinalCta.module.css` | Единственный импортёр — мёртвый `ServiceFinalCta.tsx` (#2). |
| 4 | `apps/ncottage-www/src/app/services/[slug]/ServiceSignature.tsx` | 0 внешних импортов/JSX. Свой импорт `./detail.module.css` остаётся жив через `page.tsx`/`ServiceDetailNav` — CSS не трогать. |
| 5 | `apps/ncottage-www/src/components/features/project-detail/ProjectPackages.tsx` (+ `ProjectPackages.module.css`) | Ссылки только из барреля `index.ts:9`; `project/[slug]/page.tsx` импортирует 16 других имён, `ProjectPackages` среди них нет. Удалить файл + строку барреля `index.ts:9`. |
| 6 | `apps/ncottage-www/src/components/features/project-detail/ProjectOptions.tsx` (+ `ProjectOptions.module.css`) | Аналогично #5: только `index.ts:10`, не импортится страницей. Удалить файл + `index.ts:10`. |
| 7 | `apps/ncottage-admin/src/components/empty-state.tsx` | `grep -rn 'EmptyState\|empty-state'` по apps+packages → только объявление. 15 `<EmptyState>` — это **другой** компонент `ncottage-www/.../ui/EmptyState`. 0 импортёров admin-версии. |
| 8–12 | `infrastructure/run_iron_solver/src/commands/{route,develop,review,qa,setupLabels}.ts` | **Проверено дважды.** `run.mjs` спавнит `dist/index.js`; `src/index.ts` импортирует только `./composition.js` и `./job.js` и диспетчеризует **инлайн-`switch (options.command)`**, вызывая `solver.route()/developIssue()/...` напрямую. `grep -rn "commands/" src run.mjs` (кроме самих файлов) → **NONE**. 0 динамических `import()`. npm-скрипты `route/develop/...` → `node run.mjs <cmd>` → `index.js`, не эти обёртки. Пять файлов дублируют инлайн-логику и не импортятся ничем. |

### Экспорты/значения (удалить символ)

| Путь | Имя | Доказательство |
|---|---|---|
| `apps/ncottage-www/src/app/services/services.ts:1275` | `SERVICE_MAP` | `grep -rn SERVICE_MAP src` → только определение; `data/services.ts` берёт `SERVICES/SERVICE_SCENARIOS/...`, но не `SERVICE_MAP`. Не ре-экспортится. |
| `apps/ncottage-admin/src/components/admin-context.tsx:20` | `useAdmin` | `grep -rn '\buseAdmin\b'` по apps+packages → 1 строка (определение). Соседние `useIsAdmin`/`AdminProvider` держат файл живым, но этот экспорт — 0 ссылок. |
| `apps/ncottage-admin/src/lib/settings-schema.ts:78` | `emptyNavValues` | 1 строка (определение). Фабрика `{ items: [] }`, не вызывается нигде. |
| `packages/iron-solver/src/labels.ts:100` (+ `index.ts:16`) | `commonLabels` | **Адверсариально подтверждено.** `git grep commonLabels` → определение + строка барреля. `getProjectLabels/getRoutingLabels` строят массивы сами. Единственный внешний потребитель пакета (`run_iron_solver`) его не импортит. Убрать экспорт + строку `index.ts:16`. |

### Мёртвые re-export-**имена** в барелях `ncottage-www/src/domain/*` (убрать имя из строки; `@forge/shared` НЕ трогать)

Каждое имя проверено `grep -rn '<name>' apps/ncottage-www/src` → встречается **только** в своей строке re-export; каноничный тип в `@forge/shared` потребляется `ncottage-api`/`ncottage-admin` и остаётся. Типы compile-time — динамически недостижимы, поэтому 0 ссылок = мёртвое имя с высокой уверенностью. Registry-guard пройден: секции рендерятся через generic `PageSectionDataMap[T]` (`data/pages.ts`), а не по именам типов; `SECTION_SCHEMAS/SECTION_FORMS/sectionRenderers` в `www/src` — 0 вхождений.

| Файл | Убрать имена |
|---|---|
| `domain/blog.ts:3` | `ArticleSection` (оставить `Article`, `BlogPage`) |
| `domain/lead.ts:10` | `LeadSource` (оставить `LeadRequest`) |
| `domain/page.ts:5,8,30` | `PageSection`, `CardItem`, и 21 тип: `AboutHeroData ProductionHeroData FinanceHeroData ContactsHeroData WorksHeroData GuaranteeHeroData LegalHeroData CardGridData ValueListData StringListData BulletSectionsData RequisitesTableData LeadFormData TeamData TimelineData CtaLinksData LocationCardsData WorksMapData SectionHeadingData ValueLabel PageLink`. **Оставить:** `Page, PageSectionType, PageSectionDataMap, ReviewsCarouselData, FaqListData, HomeContactData, LabelValue` (потребляются `data/pages/home.ts`, `app/requisites/page.tsx`). |
| `domain/project-selection.ts:5` | `SelectionFilter` (оставить `SelectionGroup`, `ProjectSelection`, `SELECTION_GROUPS`, `matchesSelection`) |
| `domain/project.ts:8` | `ProjectSpecs` |
| `domain/services.ts:5` | `ServiceDetailVariant, ServiceTimingItem, ServiceExample, ServiceSeoContent, ServicesUiQuiz` |
| `domain/services.ts:21` | локальный `export type ServiceScenarioSlug = string;` — удалить строку (union в `app/services/services.ts` не затрагивается) |
| `domain/settings.ts:5` | `NavItem, NavSubItem, FooterLink, FooterOffice, ContactPhone, ContactAddress, ContactSocial, SeoIndexKey, SeoIndexMeta` (оставить `Navigation, Footer, Contacts, ListingPages, FinanceUi, Seo`) |

Nav/Footer-типы, используемые приложением, приходят из **локального** `@/content/site.ts`, а не из этих re-export'ов — потому shared-имена и мёртвы.

### Зависимости

| Пакет | Зависимость | Доказательство |
|---|---|---|
| `ncottage-www` | `@axe-core/playwright` (devDep) | **Адверсариально подтверждено.** `grep -rniE 'axe-core\|AxeBuilder' src e2e playwright.config.ts` → 0. `e2e/smoke.spec.ts` тянет только `@playwright/test`. Единственные вхождения — сам `package.json` и упоминания в QA-доках. |

---

## [REVIEW]

### Избыточный `export` — символ ЖИВОЙ, тело не удалять (снять только `export`)

Инструменты флагуют «unused export», но символ используется **внутри своего файла**. Это не мёртвый код — просто над-экспорт. Снятие `export` гасит knip, ничего не ломая.

| Путь | Имя | Где используется внутри |
|---|---|---|
| `ncottage-www/src/lib/selection.tsx:18` | `COMPARE_LIMIT` | там же строки 99, 127 |
| `ncottage-admin/src/lib/validators.ts:6` | `isUrlOrPath` | внутренние `refine()` :21, :29 (`optionalUrlOrPath/requiredUrlOrPath`) |
| `ncottage-admin/src/lib/nav.ts:22` | локальный `NavItem` | `NavSection.items` (nav.ts:33). Это **не** shared-`NavItem`. |
| `ncottage-api/src/leads/dto/update-lead-status.dto.ts:3` | `LEAD_STATUSES` | `@IsIn(LEAD_STATUSES)` :7, тип `LeadStatusValue` :4. Admin держит свою копию, эту не импортит. |
| `ncottage-www/src/app/services/[slug]/seoContent.ts:3,9,15` | `ServiceTimingItem`, `ServiceExample`, `ServiceFaqItem` | поля `ServiceSeoContent`, бэкающего живой `SERVICE_SEO_CONTENT` |
| `ncottage-www/src/app/services/services.ts:12` | `ServiceScenarioSlug` (union) | `ServicePage.scenarioSlugs` :46, `ServiceScenario.slug` :52 |

### Неиспользуемые re-export-строки (не сам символ)

- `ncottage-www/src/domain/lead.ts:5-7` — `LEAD_SOURCES`, `MIN_PHONE_DIGITS`, `countPhoneDigits` ре-экспортятся, но ни один потребитель `@/domain/lead` их не берёт (нужны только `isValidLead`, `LeadRequest`). Источник — `@forge/shared`, не трогать.
- `ncottage-www/src/domain/project-selection.ts:2` — `SELECTION_GROUPS` (сосед `matchesSelection` используется).
- `ncottage-www/src/components/features/project-detail/index.ts:14` — строка `useProjectConfig`. Сам хук жив (`ProjectLeadForm.tsx`, `ProjectCalculator.tsx` импортят его из `./ProjectConfigContext`), но re-export через баррель не нужен.

Рекомендация: подрезать строки re-export, если хочется минимальной поверхности; риск нулевой в пределах app.

### Прочее мёртвое-с-оговоркой

| Путь | Что | Оговорка |
|---|---|---|
| `ncottage-api/prisma/migrate-projects.ts` | one-off миграция данных | Запускается вручную `tsx prisma/migrate-projects.ts` (idempotent expand-window: legacy JSON → нормализованные таблицы). **KEEP пока** миграция не выполнена во всех окружениях; удалить после закрытия окна. |
| `ncottage-api` devDep `ts-node` | тулинг | `nest-cli.json` builder = `swc`; seed/test/dev = `tsx`/`nest start`. Ни один скрипт не зовёт `ts-node`. Вероятно removable — проверить `prisma db seed`/`nest build`/dev перед удалением. |
| `packages/iron-solver/src/labels.ts:45` | `baseLabels` | Мёртв **транзитивно**: единственный потребитель — сам `commonLabels` (SAFE-DELETE). Удалять вместе с ним. |
| `packages/shared/src/page.ts:9,26` | `PAGE_KEYS` + `PageKey` | **Сильнейший кандидат в мёртвые в shared.** 0 потребителей во всех пакетах; `Page.key` типизирован как `string`, не `PageKey` — перечисление заброшено. Либо провязать `Page.key → PageKey`, либо выпилить обе из `index.ts`+`page.ts`. |
| `packages/shared/src/page.ts:28` | `PAGE_SECTION_TYPES` | Рантайм-массив без прямого потребителя, но он — единственный источник широко используемого типа `PageSectionType`. **Оставить в `page.ts`**; можно не экспортировать из `index.ts`, если нужна узкая публичная поверхность. |
| `apps/citadel` deps | `@forge/shared`, `fastify`, devDep `ts-node` | Citadel — незапровязанный скелет NestJS+Fastify (10 файлов, hello+/health). `@forge/shared` не импортится (0). `fastify` избыточен: `@nestjs/platform-fastify` тянет `fastify` как свою зависимость (не peer). `ts-node` — остаток шаблона Nest (используется swc). Все три removable, но решение за владельцем (скелет может пре-провязывать shared намеренно). |

### Документация (`docs/ncottage-cms/` + iron-solver)

> **РЕШЕНО (2026-07-04):** исторические доки (`SPEC`, `ROADMAP`, `CONTENT-MODEL`, `KICKOFF`, `QA-AUDIT`, `QA-DOSSIER`) перенесены в `docs/ncottage-cms/archive/`; активными остались `REDESIGN-TZ.md` и этот отчёт. Индекс — `docs/ncottage-cms/README.md`, пояснение к архиву — `archive/README.md`. На `QA-DOSSIER` добавлен баннер «аудит закрыт». Открытым остаётся только вопрос `transcript.ru.md` (см. таблицу).

Ни один док **не описывает удалённый код** — либо описывает **отгруженное** (поколение 1: SPEC/ROADMAP/CONTENT-MODEL/KICKOFF — сборка A–G/E/G выполнена, подтверждено по `prisma/schema.prisma` и git-логу), либо **точную будущую цель** (поколение 2: `REDESIGN-TZ.md` — новый живой бриф; его «+добавить»-пункты реально не построены). Поэтому SAFE-DELETE среди доков нет — только устаревание в направлении и дубли.

| Док | Вердикт | Причина |
|---|---|---|
| `REDESIGN-TZ.md` | **KEEP** | Актуальный авторитетный бриф (pivot). Claims сверены с кодом: нет `/works/[slug]`, у `BuiltObject` нет полей `baseProject/status/story`, хардкод «7 лет» подтверждён (`ProjectSpecsGrid.tsx:40`, `ProjectStickyAside.tsx:56`, `ProjectFaq.tsx:32`). |
| `QA-DOSSIER.md` | **KEEP** | Достоверный исторический QA-record (87 находок, статусы правок сверены с коммитами). Опц.: убрать в `archive/`. |
| `QA-AUDIT.md` | REVIEW | Kickoff-промт под аудит, который **уже проведён** (его результат — QA-DOSSIER). Спентый оперативный промт → в `prompts/`/`archive/` или удалить. |
| `KICKOFF.md` | REVIEW | Kickoff-промт под сборку A–G, которая **завершена**. Дублирует SPEC/ROADMAP (D1–D7). Спентый. |
| `SPEC.md` | REVIEW | Описывает отгруженную CMS; в **направлении** заменён `REDESIGN-TZ` (§Д — «коррекции к ТЗ v1»). Ещё соответствует коду → не удалять вслепую; повесить баннер «superseded» / в `archive/`. |
| `ROADMAP.md` | REVIEW | Завершённый план A–G/E; новый роадмап — `REDESIGN-TZ §5 (WP0–WP8)`. |
| `CONTENT-MODEL.md` | REVIEW | Карта миграции www→CMS (эпик E), миграция выполнена; пересекается со `SPEC` Приложение A — консолидировать. |
| `packages/iron-solver/transcript.ru.md`, `infrastructure/run_iron_solver/runner-setup/transcript.ru.md`, `.../projects/ncottage-www/transcript.ru.md` | REVIEW (дубликат) | Это **не** process-trace, а построчные RU-переводы соседних `README.md` (`diff` показывает: отличается только H1 «— русская версия»). Риск расхождения. Схлопнуть в один канонический (или `README.ru.md`), убрать «transcript»-двойник. |

READMEs (`iron-solver`, `run_iron_solver`, `runner-setup`, `workflow`, `projects/ncottage-www`) и `agents/*/prompt.md`, `prompt-templates/*.md` — **KEEP**, живые оперативные ассеты.

### Дубликаты

| Путь | Что | Рекомендация |
|---|---|---|
| `ncottage-www/src/app/services/[slug]/seoContent.ts:3,9,15,20` | `ServiceTimingItem/ServiceExample/ServiceFaqItem/ServiceSeoContent` — байт-в-байт копии `@forge/shared/service.ts` | Импортировать типы из `@forge/shared` (файл жив из-за `SERVICE_SEO_CONTENT` — fallback-данные). Комментарий в shared прямо помечает `seoContent.ts` как устаревший источник. |
| `ncottage-www/src/content/site.ts:3,5,63,74` | локальные `NavItem/NavSubItem/FooterLink/FooterOffice` повторяют формы `@forge/shared/settings.ts` | Импортировать `NavItem/NavSubItem/FooterLink` из shared. `FooterOffice` расходится (`phone:Phone` vs плоские поля) — оставить или согласовать. Данные `NAV_ITEMS/FOOTER` живые. |
| `ncottage-www/.../ProjectPicker/ProjectPicker.tsx:26` | локальный `formatArea` дублирует `lib/utils.ts:5` | Импортировать из `@/lib/utils`; сверить ru-RU-группировку перед заменой. |
| `ncottage-www/src/app/services/ServicesNavigator.tsx:51` и `[slug]/ServiceSignature.tsx:57` | два байт-идентичных `function cn(...)` | Вынести в `www/src/lib/utils.ts`, импортировать в обоих. |
| `ncottage-www/src/content/home.ts:19` | приватный `type SelectOption` дублирует `ui/Select` | Импортировать из `@/components/ui/Select`. Минорно. |
| `ncottage-www/src/domain/technology.ts:26` | локальный `const TECHNOLOGIES` пересекает slug-список `@forge/shared/project.ts` | Несёт UI-данные (label/image), но slug-набор дублируется (риск дрейфа). Выводить локальные slug из shared `Technology`, а не удалять. |

---

## [KEEP] — выглядит мёртвым, но используется (не трогать)

- **`ncottage-www`**: `@types/react-dom` (провязан через `tsconfig paths` + React 19); `*.stories.tsx` (`Footer/Container/SectionHeading`) — достижимы через glob `.storybook/main.ts`; типы `BreadcrumbItem`/`IconProps`/`SelectOption` используются в собственных props (мёртва максимум строка барреля, не тип).
- **`ncottage-admin`**: весь shadcn `ui/*` — барель-реэкспорты и cva (`buttonVariants/badgeVariants/tabsListVariants/useFormField`, `AlertDialog*/Avatar*/Dialog*/DropdownMenu*/Select*/Table*` и т.п.) используются внутри своих компонентов, удерживаются по конвенции дизайн-системы; `ui/separator.tsx`/`ui/switch.tsx`/`ui/tooltip.tsx` — цельные файлы кита без импортёров (REVIEW-по-желанию, не удалять как мёртвое); `PAGE_SECTION_LABELS` (бэкает `sectionLabel()` через строковый page-registry), `SectionFieldsProps`, `DataTableFacet` (used same-file); `LeadSource` re-export (намеренный «единый источник правды»); `postcss/tailwindcss/tw-animate-css/@tailwindcss/postcss` (config/CSS `@import`), `@types/node` (`process.env`/`Buffer`).
- **`ncottage-api`**: `@nestjs/schematics` (провязан `nest-cli.json → collection`); NestJS-провайдеры/контроллеры/DTO живут через `@Module`, а не импорты — не флагать; `findMissing/assertRefsExist/assertSlugImmutable` активно используются.
- **`iron-solver-infra`**: `JobCommand`/`ParsedJobArgs` (живут внутри `job.ts`, `parseJobArgs` зовёт `index.ts`); knip «unlisted binary `route`» — это npm-скрипт-энтрипоинт CI (`iron-solver.yml`), не бинарь.
- **`packages/shared`**: ~100 из 119 экспортов имеют потребителей; 11 `*Data`-типов (`HomeHeroData`, `ProjectPickerData`, `CatalogSectionData`, …) достижимы через строковый ключ `PageSectionDataMap[T]` (`section(page,"homeHero")`); `SectionHeading/HomeSectionHeading/SettingValues/TemplateValue/TemplateValues` — структурные базы/параметры потребляемых типов; модули `media/certificate/faq/partner/promo/review/vacancy/project-selection` — по 8–15 потребителей; `template.ts` (`renderTemplate`) потребляется `packages/iron-solver`.
- **`packages/iron-solver`**: ~30 экспортов используются внутри пакета или структурно образуют публичный контракт (`createIronSolver`/`IronSolver`/порты реализуются потребителем по форме без импорта имён); `prompt-templates/{develop,qa,review}.md` грузятся по имени файла (`readPromptTemplate`).
- **Ассеты**: все 10 картинок в `ncottage-www/public` (`logo.png`, `hero/banner.jpg`, 8× `projects/*.jpg`) — литеральные пути в TS-данных/CSS `url()`/seed-JSON/stories; динамической сборки `${slug}.jpg` нет. **0 осиротевших ассетов.**
- **Паттерны**: 0 настоящих TODO/FIXME/XXX/HACK, 0 закомментированного кода, 0 `if (false)`/`enabled:false`/`debugger`/пустых `catch`, 0 zero-byte-файлов (~40 «почти пустых» — легитимные баррели/`vite-env.d.ts`). Поле `NavItem.disabled` (admin) — дремлющее-но-провязанное (читается `sidebar-nav.tsx:33`), только комментарий стоит смягчить.
- **`nc_presentation`**: граф импортов полностью связен от `index.html → main.tsx → App.tsx`; `Slide`/`Icon` используются транзитивно слайдами; все CSS-модули и deps живые. Полностью чисто.

---

## Неиспользуемые зависимости (по пакетам)

| Пакет | Зависимость | Вердикт | Комментарий |
|---|---|---|---|
| `ncottage-www` | `@axe-core/playwright` (dev) | **SAFE-DELETE** | 0 ссылок в src/e2e/config |
| `ncottage-www` | `@types/react-dom` (dev) | KEEP | `tsconfig paths` + типы React 19 |
| `ncottage-admin` | `@tailwindcss/postcss`, `postcss`, `tailwindcss`, `tw-animate-css`, `@types/node` | KEEP | config/CSS `@import`/Node globals (FP depcheck) |
| `ncottage-api` | `ts-node` (dev) | REVIEW | не зовётся (swc/tsx) — вероятно removable |
| `ncottage-api` | `@nestjs/schematics` (dev) | KEEP | `nest-cli.json → collection` |
| `citadel` | `@forge/shared`, `fastify` | REVIEW | 0 импортов; `fastify` избыточен (тянет `platform-fastify`) |
| `citadel` | `ts-node`, `@nestjs/schematics`, `@types/node` (dev) | REVIEW / KEEP / KEEP | `ts-node` — остаток шаблона; schematics — CLI; node — globals |
| `nc_presentation`, `packages/shared`, `packages/iron-solver`, `run_iron_solver` | — | — | Неиспользуемых зависимостей не найдено |

`depcheck` по `citadel`/`ncottage-api` репортит «missing» eslint-плагины — это **шум**: плагины хостятся в корневых devDeps и резолвятся через `extends "../../.eslintrc.json"`. Не добавлять локальные копии.

---

## Гигиена артефактов сборки/аудита

### Текущее состояние (`.gitignore` vs реальность)

**Утечки сейчас нет.** `git status --porcelain` + `git ls-files --others --exclude-standard` → незаигнорены только `docs/ncottage-cms/QA-DOSSIER.md` и `REDESIGN-TZ.md` (намеренные новые доки). Все стандартные выходы **покрыты** и присутствуют на диске игнорируемыми:

| Выход | Присутствует | Покрыт |
|---|---|---|
| Next `.next/` (`www`, `admin`) | да | `.next/` (root) + `admin/.gitignore` |
| Nest/TS `dist/` (`citadel`, `api`, `run_iron_solver`, `iron-solver`, `shared`) | да | `dist/` (root) + `api/.gitignore` |
| `storybook-static/`, `playwright-report/`, `test-results/` (`www`) | да | root `.gitignore` |
| `*.tsbuildinfo` (5 файлов) | да | `*.tsbuildinfo` |
| `debug-storybook.log` (`www`) | да | `*.log` |
| Prisma client | генерится в `node_modules` (кастомного `output` нет) | `node_modules/` |
| `.env` (3 app), `.codex/`, `.iron-solver/`, `research/`, `*.code-workspace` | да | root `.gitignore` |

`.env.example` (3 шт.) корректно **трекается** (паттерн `.env` без wildcard их не ловит).

### Что стоит поправить

1. **Нет catch-all для временного.** Разовые дампы/аудиты/скриншоты агентов сейчас не покрыты общей строкой (есть только `e2e/screenshots/`, `.playwright-mcp/`, `test-results/`, `playwright-report/`). Ввести конвенцию единой папки `/.scratch/`.
2. **`.claude/settings.local.json`** сейчас игнорируется, судя по всему, глобальным `~/.gitignore` — не полагаться на него, добавить в репо-`.gitignore` явно.
3. **Несогласованность `next-env.d.ts`**: `apps/ncottage-admin/.gitignore` его игнорит, а у `ncottage-www` вложенного `.gitignore` нет. Next рекомендует **коммитить** `next-env.d.ts` — привести к единому решению (низкий приоритет).
4. **Дублирование вложенных `.gitignore`**: `api/.gitignore` (`dist/bundle/.env`) и `admin/.gitignore` (`.next/out/.env/next-env.d.ts`) повторяют корневые паттерны. Можно консолидировать в корень (низкий приоритет).
5. `infrastructure/run_iron_solver/dist/commands/*.js` — осиротевшие build-артефакты от мёртвых `src/commands/*.ts`; лежат в игнорируемом `dist/`, перестанут генериться после удаления исходников. Руками не трогать.

### Предлагаемый diff `.gitignore`

```diff
 # Temporary files
 *.tsbuildinfo
 .eslintcache
 tsconfig.tsbuildinfo
 .codex/
 .iron-solver/

+# Ephemeral scratch — единственная gitignored-папка под всё разовое
+# (дампы, аудиты, скриншоты, черновые скрипты). Одна строка ловит будущее.
+/.scratch/
+
+# Ad-hoc audit/QA скриншоты и дампы вне e2e/playwright
+audit-shots/
+screenshots/
+.qa-*/
+
+# Локальное состояние агента (не зависеть от глобального gitignore)
+.claude/settings.local.json
+
 # Debug
 .pnpm-debug.log

 # Competitor research tooling + scraped corpus (local only, not for PR)
 research/
```

### Правило для `AGENTS.md`

Добавить секцию (текст на английском — язык `AGENTS.md`):

```markdown
## Scratch & build artifacts

- Any ephemeral output — one-off dumps, audit reports, screenshots, scratch
  scripts — MUST be written under `/.scratch/` at the repo root. It is the only
  gitignored catch-all; a single `.gitignore` line covers everything future.
  Never scatter temp files elsewhere in the tree.
- Build outputs are already ignored (`dist`, `.next`, `storybook-static`,
  `coverage`, `playwright-report`, `test-results`, `*.tsbuildinfo`). Do not
  commit them and do not hand-edit generated `dist/`.
- `.env.example` is tracked as a template; real `.env*` stay local.
```

Опционально: `pnpm clean` уже есть (`pnpm -r clean && rm -rf node_modules`); можно добавить pre-commit guard, отклоняющий staged-файлы вне `/.scratch/`, совпавшие с `audit-shots|screenshots|\.qa-`.
