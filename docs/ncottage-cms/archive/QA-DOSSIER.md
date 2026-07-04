# Досье QA-аудита ncottage CMS

> **АУДИТ ЗАКРЫТ (2026-06-29).** Тела находок ниже написаны в настоящем времени,
> но описывают ИСХОДНЫЕ дефекты — код уже исправлен (см. блок «Статус починки»:
> все critical/high/medium + 35 из 42 low). Документ — исторический аудит-трейл,
> не список задач. Осознанно оставлены владельцем только F036-остатки, F039-clamp, F048.

Сквозной аудит www + admin + api на живой инфраструктуре (Playwright на брейкпоинтах
390/768/1280/1440, axe-core WCAG 2.1 AA, Lighthouse на prod-сборке, curl против API).
Эталон — самосогласованность (Figma нет), требования — `SPEC.md`/`CONTENT-MODEL.md`.
Каждая находка репродуцирована состязательно (skeptic, `isReal=false` по умолчанию);
14 первичных находок опровергнуты при проверке и вынесены в приложение, 8 дублей слиты.

**Итог: 87 подтверждённых находок** — 2 critical, 9 high, 34 medium, 42 low.

## Статус починки (обновлено 2026-06-29)

Ветка `feat/ncottage-cms`, зелёная (typecheck 0, lint 0 ошибок). 34 фикс-коммита.

**Починено и проверено (все critical + high + почти весь medium fix-now):**
- `16d2fa5` — F099 JWT, F100 SVG, F101/F104 throttler, F088/F103 GET /leads toDomain, F084/F093 slug→409, F086 нормализация ошибок, F085 zod strict, F046 phones.min(1)
- `f440011` — F095 валидация soft-ссылок, F094 неизменяемый slug
- `9f9b716` — F008/F019/F020/F040 lead-формы, F021/F057 labels, F041/F089/F102 consent, F101 XFF
- `96ae6ea` — F050/F051/F052/F053/F054/F055/F042/F002/F038/F037 a11y+токены, F107 next/image, F001 плюрализация, F046 guard
- `b73a0f4` — F068 очистка опц. полей
- `fd012a2` — F077 чистый ре-логин на 401
- `181adfd` — F096 поле `order`+tiebreaker [order,id] у reviews/partners/certificates/faq/vacancies (схема+API+admin NumberField/nextOrder+www fallback)
- `a89ec58` — F011 Certificate imageUrl/fileUrl (clearable; admin MediaField; www превью+ссылка на документ)
- `a2428f2` — F061 Article image (соц-картинка) + og:image/twitter + article:published_time; buildPageMetadata получил twitter+publishedTime
- `6c8029e` — F105 приватный медиа-бакет для не-картинок + стабильный `/media/raw?key=` → presigned 302 (dep `@aws-sdk/s3-request-presigner`)
- `f9d5615` — F071 маркеры обязательности (из zod-схемы), F069 правка alt существующих медиа (PATCH /media/:id), F070 footer external-чекбокс, F082 objectId→SelectField из built-objects, F080 unsaved-guard редактора страниц (dirty+beforeunload)
- `b12f60d` — F010 пустая метка отзыва, F012 кликабельность works-карточек, F058 валидные/уникальные blog-якоря (закрывает F004)
- `47f7662` — F049 санитизация name/comment лида, F060 дефолтный seo.ogImageUrl
- `315d5f5` — F009 empty-states на 7 листингах (общий EmptyState)
- `469ddac` — F108 скелет-грид каталога (резерв высоты → CLS)
- `d3cec85` — F025 группировка банковских реквизитов, F024 динамический workHours на /contacts
- `2e225f6` — F030 удалён мёртвый `ui/Button` (закрывает F005/F031)
- `1d3dd5d` — F015 вынос chrome листингов в Setting `listing_pages` (метрики /reviews, чек-лист /certificates, принципы /partners): shared+api zod+seed+admin-карточка+www fallback; seed==fallback parity; roundtrip+strict 400+401 проверены
- `cba6ca2` — F023 вынос chrome `FinanceLanding` в Setting `finance_ui` (CTA-подписи, блок «единый сценарий», eyebrow-ы; общий на 4 финансовых лендинга): полный вертикальный срез; seed==fallback parity; www рендерит идентично (01/02/03+eyebrow-ы)

**Отложенные medium доделаны (2026-06-29):** F015 и F023 вынесены в CMS (выше).

**LOW-backlog доделан (2026-06-29, +13 коммитов f25067f..e56b769):**
- API: `f25067f` F087 (GET /projects enum-валидация technology/livingType→400), F090 (featured только true/false).
- Admin: `7dec112` F072 (lead-енумы реэкспортом из @forge/shared); `b67c5e7` F074 (валидатор path-or-URL для review/built-object/promo ссылок), F075 (пояснения к датам Article/Review); `d8c6f9a` F073 (формы Users→RHF/zod).
- www: `bf34889` F003 (logo intrinsic 772×317); `f62a645` F016 (warnApiFallback в catch всех data-слоёв); `fb6a644` F045 (город в localStorage); `b47b2c6` F014 (счётчик/темы FAQ из групп), F017 (ключи по slug/index), F022 (ссылка на политику в FinanceLeadForm), F026 (hero обязателен → 404); `e2ca19f` F059 (JSON-LD Organization+WebSite/Article/Product/FAQPage/Review через JsonLd+structured-data), F064 (slugify кириллических якорей FAQ); `5038ef5` F062 (lastmod в sitemap), F063 (HTML-карта без favourites/compare), F065 (canonical/sitemap без trailing-slash у корня).
- Design-system: `ad7a26f` F032 (Breadcrumbs→токены), F033 (удалён мёртвый legacy-alias-блок), частично F039 (font-size→--text-sm в Breadcrumbs); `f8fc936` F034 (radius-токены 6/10/16/999px byte-identical), F035 (--section-padding в PullQuote byte-identical).
- Design-system финальные свипы (byte-identical, 2026-06-29): `beed6f1` F029 (10 `--color-*-rgb` триплетов; 461 `rgba(R,G,B,α)`→`rgb(var(--…-rgb)/α)` в 42 файлах — только RGB, точно совпадающий с токеном; 41 non-token остаток 0,0,0/off-token оставлен), `edaf91f` F028 (шкала `--space-*`: 21 токен 4px-сетка+2/6/10; 1345 значений gap/padding/margin→`var(--space-N)` в 79 файлах; self-check де-токенизации 0 ошибок; 368 off-grid оставлены сырыми).
- www-turnkey: `e56b769` F013 (BuiltObject type/technology редактируемыми: миграция+DTO+admin+www, эвристика как clearable-фолбэк).

**Финальные 5 находок переразобраны (2026-06-29, после верификации):**
- F028 (шкала `--space-*`) и F029 (rgba→hex-токены) — СДЕЛАНЫ byte-identical (`edaf91f`/`beed6f1` выше). Округление off-grid отступов (14/18/22/30/90px) владелец отклонил — оставлены сырыми (как radius F034: токенизируем только 1:1, off-scale не трогаем).
- F036 (консолидация иконок) — находка УСТАРЕЛА: 6 названных файлов уже на каноне (Select/CitySelector/MobileMenu/MainNav импортируют `ui/icons`; FaqSection — CSS-каретка). Реальных остаточных дублей с иной геометрией 3 (project-detail CheckIcon/ChevronIcon stroke2/16px, projects-catalog CloseIcon 18×18) — намеренно «жирнее» канона под контент-контекст; владелец оставил, F036 помечена решённой.
- F039-clamp (SectionHeading.title `clamp(2rem,4vw,3.25rem)`→`--text-4xl`) — владелец оставил clamp: замена меняла бы размер заголовков на 33 экранах (768px 32→48px +50%, desktop 52→48px), clamp — намеренный fluid-type. (Breadcrumbs-часть F039 сделана ранее в F032/`ad7a26f`.)
- F048 (no-JS моб.навигация) — владелец оставил JS-зависимым: nav-ссылки и так в SSR через MainNav (SEO ок), польза для no-JS-мобильных мала, риск гидрации реален.
- F043 (FOUC бейджей) — уже смягчён существующим CSS-переходом `.action`; F109 — закрыт ранее F107 (все картинки на next/image).

Итог LOW: из 42 — закрыто 35 (F028/F029 byte-identical свипы + ранее F004/F005/F010/F012/F031/F037/F038/F049/F058+F107 + 22 находки + смягчённые F043/F109); F036 устарела/решена; осознанно оставлены по решению владельца 3 (F036-остатки, F039-clamp, F048).

**Согласованные решения (применены):** consent === true форсится; @nestjs/throttler стоит; SVG-загрузка запрещена; F105 — приватный бакет + signed URL; F030 — удаление мёртвого примитива одобрено; clearable-override для опц. полей; `order` через NumberField (консистентно с Service), tiebreaker `id`.

Колонка «Триаж» ниже отражает исходный триаж (`fix-now`); фактический статус — в блоке выше.

| Severity | A (www UX/адаптив) | B (perf/SEO/a11y) | C (admin UX) | D (api/данные) | Σ |
|---|---|---|---|---|---|
| critical | 2 | 0 | 0 | 0 | 2 |
| high | 3 | 2 | 1 | 3 | 9 |
| medium | 11 | 7 | 5 | 11 | 34 |
| low | 27 | 9 | 5 | 1 | 42 |
| **Σ** | **43** | **18** | **11** | **15** | **87** |

Трудозатраты: S — 46, M — 38, L — 3.

---

## CRITICAL

### [F008] Формы заявок на акциях не отправляют лиды · A/bug · S
- **Где:** `app/promos/page.tsx:181`, `app/promos/[slug]/page.tsx:143`.
- **Что не так:** обе формы — нативный `<form action="/promos…">` без `method` (=GET), без `onSubmit`/`useLeadForm`, не клиентские. Сабмит перезагружает страницу с параметрами в URL: лид не создаётся, доставки в Telegram/email нет, состояний успеха/ошибки нет, имя+телефон утекают в URL/историю/логи.
- **Доказательство:** код + curl `/promos` и `/promos/frame-houses-special-price` — `<form action=…>` без method; GET-сабмит не порождает запись в `/leads`.
- **Рекомендация:** перевести на тот же путь, что у рабочих форм (`ContactRequestForm`/`useLeadForm` → POST `/api/leads`), добавить состояния успех/ошибка/pending.
- **Триаж:** —

### [F019] Форма заявки на финансовых лендингах не отправляет лиды · A/bug · M
- **Где:** `app/mortgage/FinanceLanding.tsx:222-246` — рендерится на `/mortgage`, `/credit`, `/maternity-capital`, `/payment`.
- **Что не так:** тот же дефект, что F008, на 4 самых конверсионных страницах: `<form action={canonicalPath}>` (GET), серверный компонент, без обработчика. Каждая заявка теряется, PII попадает в URL/Referer.
- **Доказательство:** код + curl всех 4 роутов; форма везде GET-нативная.
- **Рекомендация:** один фикс в `FinanceLanding` (общий на 4 страницы) — подключить рабочий lead-pipeline.
- **Триаж:** —

---

## HIGH

### [F040] Главная показывает фейковый «Заявка отправлена», ничего не отправив · A/bug · M
- **Где:** `components/sections/ContactSection/ContactSection.tsx:37-42` (рендер на главной `app/page.tsx:91`).
- **Что не так:** `handleSubmit` делает `preventDefault → console.log → setSubmitted(true)` — никогда не вызывает `useLeadForm`/`fetch`. Пользователь на самой посещаемой странице видит баннер успеха, но лид не уходит. Хуже мёртвых форм: активно вводит в заблуждение.
- **Доказательство:** чтение обработчика + Playwright (заполнил телефон, сабмит → баннер «Заявка отправлена», 0 запросов к `/api/leads`).
- **Рекомендация:** подключить реальную отправку; баннер показывать только по факту успешного ответа.
- **Триаж:** —

### [F020] Форма гарантийной заявки не отправляется · A/bug · S
- **Где:** `app/guarantee/page.tsx:168-205`.
- **Что не так:** `<form>` без `action` и `onSubmit`, серверный компонент. Сабмит — no-op reload, заявка (договор/имя/телефон/проблема) теряется без обратной связи.
- **Доказательство:** код + curl `/guarantee`.
- **Рекомендация:** подключить lead-pipeline (тот же фикс, что F008/F019/F040).
- **Триаж:** —

> F008, F019, F040, F020 — один класс дефекта (незаведённый lead-pipeline). Только `ContactRequestForm` (контакты), `WorksVisitForm` (работы), `ProjectLeadForm` (проект) реально отправляют. Стоит вынести общий хук/компонент формы и переключить все точки на него.

### [F092] PATCH проекта с частичным вложенным массивом молча удаляет остальные элементы · D/bug · M
- **Где:** `apps/ncottage-api/src/projects/projects.service.ts:252-279`.
- **Что не так:** на update `images/relations/floorPlans/packages/options` делается `deleteMany({}) + recreate` по присланному массиву. Частичный PATCH с одним элементом массива безвозвратно удаляет остальные. Нет merge/upsert, нет предупреждения.
- **Доказательство:** репродуцировано на throwaway-проекте: создан с 2 пакетами, PATCH с 1 пакетом → GET показал 1, второй пакет исчез навсегда (throwaway удалён).
- **Рекомендация:** трактовать вложенные массивы как полную замену осознанно (валидировать «полный массив») либо перейти на upsert по стабильным id; как минимум — задокументировать контракт и защитить админ-форму от частичной отправки.
- **Триаж:** —

### [F068] В админке нельзя очистить опциональное поле после заполнения · C/bug · M
- **Где:** паттерн `formValuesToX` (`lib/review-schema.ts:43-56` и др.) + сервисы API (`reviews.service.ts:60-66` и др.) — admin omit-when-empty, API merge.
- **Что не так:** при очистке поля админка не шлёт его (omit), API делает частичный merge → старое значение остаётся. Редактор не может убрать ранее заданное `Review.image/videoUrl/type`, `Service.detail*`, `Project.pdfUrl`, `Partner.href`.
- **Доказательство:** репродуцировано curl-roundtrip на throwaway-review: создан с `videoUrl`, отправлено тело без `videoUrl` (как шлёт форма при очистке) → GET показал старый `videoUrl` (throwaway удалён).
- **Рекомендация:** clearable-override (как уже сделано для SEO-полей в эпике F): админка всегда шлёт поле, API truthy-omit. Применить к остальным опциональным полям.
- **Триаж:** —

### [F050] Системный провал контраста: `--color-ink-subtle` (#9a9a96) не проходит WCAG AA · B/a11y · S
- **Где:** `globals.css:9`; потребители — SectionHeading eyebrow, Breadcrumbs, `aria-current` крошки, eyebrow-заголовки, TopBar cityLabel и т.д.
- **Что не так:** #9a9a96 на кремовом (#faf8f3)=2,66, на белом=2,82, на surface-alt=2,46 — везде ниже AA 4,5:1. axe (serious) на всех 6 проверенных роутах.
- **Доказательство:** axe color-contrast на `/`, `/faq`, `/reviews`, `/about`, `/services/design`, `/blog/<article>` + ручной расчёт ratio.
- **Рекомендация:** затемнить токен `--color-ink-subtle` до ~#6f6f6b (≥4,5:1 на кремовом) — единый фикс закрывает все роуты.
- **Триаж:** —

### [F107] Картинки каталога идут через CSS `background-image`, мимо next/image (каталог 3,2 МБ, LCP 11,9 с) · B/perf · M
- **Где:** `components/shared/ProductCard/ProductCard.tsx:67`; роуты `/projects/[category]` (напр. `/projects/all`), главная.
- **Что не так:** картинка карточки — `style={{backgroundImage:url(project.image)}}`, не `next/image`. Все картинки каталога отдаются сырыми `/images/projects/*.jpg` (200–400 КБ ×10+), без webp/avif, без responsive-размеров, без lazy. Логотип же идёт через `/_next/image` — конвейер есть, карточки его минуют.
- **Доказательство:** Lighthouse prod/mobile: `/projects/all` perf **57**, LCP **11,9 с**, 3,2 МБ/73 запроса; `/` perf 73, LCP 9,3 с, 2,7 МБ. curl показывает прямые `/images/projects/*.jpg`. JS-бандлы в норме (unused JS 0, SEO/best-practices 100).
- **Рекомендация:** рендерить картинку карточки через `next/image` (fill + `sizes` для грида + lazy; `priority` только на LCP-картинке) или хотя бы предоптимизировать исходники в webp/avif.
- **Триаж:** —

### [F099] Слабый JWT_SECRET без валидации стойкости + роль доверяется из токена · D/sec · M
- **Где:** `config/env.validation.ts:37-38` (`@IsString` only); `auth/jwt.strategy.ts:25-31`; `.env: JWT_SECRET=local-dev-secret-change-…`.
- **Что не так:** секрет принимается любой (нет `@MinLength`/энтропии), в `.env` лежит плейсхолдер; `validate()` возвращает `{id,email,role}` прямо из payload без сверки с БД; `JWT_EXPIRES_IN=12h` без refresh/ревокации. Знающий/угадавший секрет кует admin-токен. Не «пробитая» авторизация, но конфиг-уязвимость + отсутствие отзыва.
- **Доказательство:** чтение env.validation/jwt.strategy; в node скован валидный HS256 admin-токен на дефолтном секрете.
- **Рекомендация:** `@MinLength(32)` + отказ загрузки на известных плейсхолдерах; ротация секрета в проде; рассмотреть проверку существования/версии токена.
- **Триаж:** —

### [F100] Editor может загрузить SVG, отдаваемый публично inline — примитив stored XSS · D/sec · S
- **Где:** `media/media.controller.ts:21,44-74` (нет `@Roles` на upload), `media.service.ts` (`image/svg+xml`→`.svg`), `storage.service.ts:16` (public-read).
- **Что не так:** POST `/media` под `JwtAuthGuard` без роли (любой залогиненный, в т.ч. editor); `image/svg+xml` проходит проверку `startsWith('image/')`; бакет public-read; файл отдаётся inline. SVG со скриптом — XSS-примитив.
- **Доказательство:** чтение кода + загрузка тестового SVG editor-токеном, проверка отдачи (тестовый файл удалён). В dev исполняется только в origin MinIO (`localhost:9000`), отдельном от www/admin — реальный риск зависит от прод-домена медиа.
- **Рекомендация:** запретить `image/svg+xml` (или санитизировать), `Content-Disposition: attachment` + правильный `Content-Type` для не-картинок, ограничить upload ролью при необходимости.
- **Триаж:** —

### [F101] Публичный POST /leads без rate-limit/captcha/honeypot · D/sec · M
- **Где:** `leads/leads.controller.ts:19-23` (без guard/throttler); `main.ts` (нет `@nestjs/throttler`).
- **Что не так:** эндпоинт корректно публичен (контактная форма), но без любых средств от абьюза — флуд БД и канала доставки (Telegram/email) на скорости линии.
- **Доказательство:** 20 быстрых анонимных POST → 20×201, 0×429.
- **Рекомендация:** `@nestjs/throttler` на `/leads` (напр. N/мин на IP) + honeypot-поле; согласовать с consent (F041) и санитайзом (F049).
- **Триаж:** —

---

## MEDIUM (34)

### Лиды / формы
- **[F041]** `/api/leads` не требует `consent` — заявки принимаются с `consent:false`/без него (юр. риск; страницы `/privacy`,`/personal-data` есть). `api/leads/route.ts:39` + `shared/lead.ts isValidLead`. Решить контракт согласия и форсить `consent===true`. · sec · S · —
- **[F021]** Инпуты финансовой формы без `<label>`/`aria-label` (только placeholder). `FinanceLanding.tsx:223-240`. axe `label` формально проходит (placeholder=имя), но это usability/консистентность с другими формами. · a11y · S · —
- **[F057]** Инпуты формы на главной (`ContactSection.tsx:76-102`) — то же: только placeholder, нет label, расходится с `ContactRequestForm`/`ProjectLeadForm`. · a11y · S · —

### Доступность (a11y)
- **[F042]** Мобильное меню не закрывается по Escape, нет `role="dialog"`/`aria-modal`/focus-trap. `MobileMenu.tsx`. · a11y · M · —
- **[F051]** Приглушённый текст футера `rgba(250,248,243,0.45)` на тёмном = 4,29:1 (<4,5). `Footer.module.css:134,168,180`. · a11y · S · —
- **[F052]** Мета отзыва (терракота #9c4a2d на тёмной карточке) = 2,84:1. `reviews/page.module.css:109`. · a11y · S · —
- **[F053]** Контент TopBar вне landmark (axe region на каждой странице) — нет `<header>`. `SiteHeader.tsx`/`TopBar.tsx:23`. · a11y · S · —
- **[F054]** Несколько `<nav>` без уникальных имён (axe landmark-unique на `/faq`,`/blog/<article>`). `MainNav.tsx:81` без `aria-label`. · a11y · S · —
- **[F055]** Заголовки футера `<h4>` после `<h2>` страницы — пропуск уровня (axe heading-order). · a11y · S · —

### Производительность
- **[F108]** CLS=0,375 на каталоге (>0,1). `/projects/all` (клиентский `ProjectsCatalog`). Резервировать место грида при гидрации, стабилизировать шрифт. · perf · M · —

### SEO
- **[F060]** Не задан дефолтный OG-image (`seo.ogImageUrl=""`) — у соц-превью главной/блога/листингов/legal нет картинки. `lib/seo.ts:36`. · turnkey · S · —
- **[F061]** У статьи блога нельзя задать OG/Twitter-картинку (в контракте `Article` нет поля image; `og:type=article` без `article:*`). · turnkey · M · —

### API / данные
- **[F084]** Коллизия slug → 500 вместо 409 (все контент-модули; Prisma P2002 не маппится). `faq.service.ts:43` и др. Глобальный exception-filter (P2002→409). · bug · M · —
- **[F085]** Разная строгость валидации: settings/pages PUT молча отбрасывают лишние ключи (zod strip), class-validator — отвергает (`forbidNonWhitelisted`). Сделать zod `.strict()` или задокументировать. · bug · S · —
- **[F088]** GET `/leads` отдаёт сырые Prisma-строки: внутренние `deliveryError/deliveryAttempts/deliveredAt` + полный PII любому залогиненному (вкл. editor). `leads.service.ts:35`. Маппить через toDomain, решить доступ editor к PII. · sec · S · —
- **[F094]** Переименование slug через PATCH проходит без каскадного обновления входящих soft-ссылок. `projects.service.ts:226,281-289`. Запретить смену slug или делать referential sweep + 301. · bug · M · —
- **[F095]** Битые soft-ссылки принимаются (200) и молча исчезают на www — нет проверки существования/FK/обратной связи. `projects.service.ts:256-261`. Валидировать на записи или подсвечивать в админке. · bug · M · —
- **[F096]** Коллекции faq/certificates/partners/vacancies/reviews без поля `order` и tiebreaker — редактор не может упорядочить; одинаковый `createdAt` → недетерминированный порядок. Добавить `order` + `id` вторым ключом. · turnkey · M · —
- **[F104]** Нет rate-limit на POST `/auth/login` (брутфорс). `auth.controller.ts:9`. `@nestjs/throttler` 5-10/15мин на IP+email. · sec · S · —
- **[F105]** Медиа-бакет world-readable для всех типов, вкл. PDF (`storage.service.ts:16`). Для не-картинок — приватный бакет + signed URL, либо задокументировать. · sec · M · —
- **[F086]** Четыре разных формы ответа об ошибке (class-validator / zod / Fastify / unhandled). Глобальный фильтр-нормализатор `{statusCode,error,message,fieldErrors?}`. · design-inconsistency · M · —

### Контент / turnkey / админка
- **[F046]** Удаление всех телефонов в админке роняет весь сайт. `settings.schemas.ts` `phones` без `.min(1)`; `SiteHeader.tsx:50` `cities[0]` и `MainNav/MobileMenu` `phones[activeCity]` без guard → каждая страница 500. Добавить `.min(1)` + guard. · bug · M · —
- **[F011]** В сертификатах нельзя показать сам документ (контракт `Certificate = {slug,title}`, нет файла/картинки). `certificates/page.tsx:91-108`. Добавить опц. `fileUrl/imageUrl` + поле в админке. · turnkey · M · —
- **[F015]** Контентные блоки захардкожены в JSX (метрики `/reviews` 320+/95%/с2007, чек-лист `/certificates`, принципы `/partners`) — редактор не может изменить. Вынести в CMS (settings/секция) или задокументировать как фиксированные. · turnkey · M · —
- **[F023]** В `FinanceLanding` блок «Единый сценарий», eyebrow-ы и подписи CTA захардкожены — не редактируются. `FinanceLanding.tsx:86-143,148,166,191,218`. · turnkey · M · —
- **[F024]** Карточки офисов на контактах хардкодят расписание «Будние дни с 10 до 19», расходится с динамическим `workHours` выше. `contacts/page.tsx:165-168`. · turnkey · S · —
- **[F069]** Alt-текст медиа нельзя задать; `alt/folder` не редактируются у существующих файлов. `media/upload-dropzone.tsx`, `MediaLibrary.tsx`. Добавить поле alt + PATCH `/media/[id]`. · turnkey · M · —
- **[F077]** Поддельный/протухший admin-cookie: middleware проверяет только наличие cookie → страница падает в голый `error.tsx` («GET /leads failed: 401»), цикл ретраев, нет ре-логина. `middleware.ts:6-13`, `lib/api.ts:10-18`. На 401 чистить cookie + redirect `/login`. · bug · M · —
- **[F080]** Редактор страниц: посекционное сохранение, нет «сохранить страницу», нет предупреждения о несохранённых изменениях (потеря при уходе). `pages/[key]/page.tsx`, `SectionCard.tsx:84-94`. Dirty-guard + `beforeunload`. · optimization · M · —
- **[F082]** `featuredProject.objectId` — свободный текст без пикера/валидации; битый id молча падает в `builtObjects[0]`. `page-sections.tsx:2100`. Заменить на SelectField из built-objects. · turnkey · M · —
- **[F009]** Ни на одной из 7 листинговых страниц нет пустого состояния — при пустой коллекции рендерится пустота между статичной chrome. `promos/reviews/vacancies/faq/certificates/partners/works`. Общий empty-state. · bug · M · —
- **[F001]** Сломана русская плюрализация бейджей подборок («1 проектов», «2 проектов», «4 подборок»). `project-selections/page.tsx:81,95,109,123`. Хелпер плюрализации (как в ProductCard). · bug · S · —
- **[F002]** Тач-таргеты 36–40px (<44px) у действий карточки и иконок шапки. `ProductCard.module.css:95-100` и др. WCAG 2.5.8 (24px) выполнен; это рекомендация 44px. · a11y · S · —
- **[F030]** Три реализации кнопки; off-system примитив `ui/Button` — мёртвый код, плюс остаточная дивергенция (52 vs 48px и т.п.). Удалить мёртвый примитив или привести к фактическому паттерну. · design-inconsistency · M · —
- **[F025]** Таблица банковских реквизитов перечисляет 2 банка плоско без группировки — подписи повторяются. `requisites/page.tsx:22-33`. Группировать по банку. · design-inconsistency · M · —

---

## LOW (42)

### www UX / контент
| ID | Находка | Где | Eff | Триаж |
|---|---|---|---|---|
| F003 | Логотип `<Image>` с неверным aspect (160×36 vs 772×317) — warning next/image на каждой странице | MainNav/MobileMenu/Footer | S | — |
| F004 | Дубль `id={article.category}` на карточках блога — ломает якоря при >1 статье в категории | blog/page.tsx:103 | S | — |
| F010 | Отзыв без `type` рендерит пустую метку (схлопнутый элемент, одинокая дата) | reviews/page.tsx:69-72 | S | — |
| F012 | Карточки работ не кликабельны — обязательный `BuiltObject.href` не рендерится (и ведёт на 404 `/our-works/*`) | works/page.tsx:210-248 | S | — |
| F013 | Тип/технология объектов выводятся эвристикой по заголовку — редактор не задаёт, возможны ошибки меток | works/page.tsx:37-49 | M | — |
| F014 | FAQ-панель: динамический счётчик групп противоречит захардкоженному списку тем | faq/page.tsx:48-55 | S | — |
| F016 | Деградация невидима: ошибки API молча отдают статичный seed вместо живого CMS | data/*.ts (catch→STATIC) | M | — |
| F017 | React-ключи списков по неуникальным строкам (vacancy.title, faq group.title и т.д.) | vacancies/faq/promos | S | — |
| F026 | Лёгкий notFound на about/production/contacts молча роняет недостающие секции | about/production/contacts | S | — |
| F043 | Бейджи избранного/сравнения мигают пустыми на первой отрисовке (FOUC) | selection.tsx:50-58 | S | — |
| F045 | Выбор города не сохраняется между перезагрузками (телефон сбрасывается на первый город) · preference | SiteHeader.tsx:50 | M | — |
| F048 | Мобильное меню/поиск JS-зависимы (ssr:false + matchMedia) — без JS только desktop-навигация | SiteHeader.tsx:14-24 | M | — |
| F049 | `/api/leads` не санитизирует name/comment (валидируется только phone+source) · sec | api/leads/route.ts:53 | M | — |
| F022 | В consent-строке финансовой формы нет ссылки на политику (есть в др. формах) | FinanceLanding.tsx:242 | S | — |

### Дизайн-система (самосогласованность)
| ID | Находка | Где | Eff | Триаж |
|---|---|---|---|---|
| F028 | Нет шкалы отступов (`--space-*`) — все gap/padding/margin сырыми px, непоследовательно | globals.css + 82 module.css | L | — |
| F029 | ~500 сырых `rgba()/rgb()` минуют hex-токены (полупрозрачные варианты вручную) | **/*.module.css | L | — |
| F031 | `ui/Button` на legacy `--color-green` и radius 4px (мимо токенов) | ui/Button/Button.module.css | S | — |
| F032 | `Breadcrumbs` — единственный ui-примитив целиком на legacy-палитре + хардкод font-size | ui/Breadcrumbs | S | — |
| F033 | Блок legacy-алиасов ~62% мёртв (8 алиасов можно удалить сразу) | globals.css:28-40 | S | — |
| F034 | Частичное принятие radius-токенов: 130 хардкод-px против 209 токенов | **/*.module.css | M | — |
| F035 | `--section-padding` принят лишь в 13 файлах; 2 крупнейших модуля задают ритм вручную | services/detail.module.css | M | — |
| F036 | Дублирование иконок: Close/Check/Chevron перерисованы локально с иной геометрией | ui/icons vs features/* | M | — |
| F037 | Устаревший комментарий: globals.css называет шрифт «Fraunces», грузится Playfair Display | globals.css:208 | S | — |
| F038 | Плейсхолдер картинки ProductCard хардкодит #2a2a2a мимо токенов | ProductCard.module.css:39 | S | — |
| F039 | Заголовок SectionHeading — ad-hoc `clamp()` вместо `--text-*` шкалы | SectionHeading.module.css:41 | S | — |
| F005 | Примитив `ui/Button` расходится со стилем CTA, но это мёртвый код · optimization | ui/Button | S | — |

### SEO
| ID | Находка | Где | Eff | Триаж |
|---|---|---|---|---|
| F059 | JSON-LD только на `/services/[slug]` — нет Organization/WebSite (главная), Article (блог), Product/Offer (проект), FAQPage (`/faq`), Review (`/reviews`) | app/** | L | — |
| F058 | Якорь категории в герое блога `#Технологии` — мёртвая ссылка (нет цели у featured) | blog/page.tsx:27,54,104 | S | — |
| F062 | В sitemap.xml нет `<lastmod>` ни у одного из 82 URL | sitemap.ts:53-75 | S | — |
| F063 | HTML-карта сайта ссылается на `/favourites`,`/compare`, запрещённые в robots.txt; дрейф с XML | sitemap/page.tsx vs robots | S | — |
| F064 | Якоря FAQ/блога — сырые кириллические id с пробелами (невалидный fragment/id) | faq/page.tsx:63,74; blog | S | — |
| F065 | Рассинхрон trailing-slash главной: canonical `…/ncottage.ru` vs sitemap `…/ncottage.ru/` | home meta vs sitemap.ts:64 | S | — |
| F109 | Тяжёлый image-payload detail/главной (1,5–2,7 МБ, LCP 4–9 с) · perf (частично решается F107) | `/`, `/project/nord` | M | — |

### Админка
| ID | Находка | Где | Eff | Триаж |
|---|---|---|---|---|
| F070 | Флаг `external` у footer bottomLinks есть в контракте/схеме, но недостижим в UI | content/footer/FooterForm.tsx | S | — |
| F071 | Нет индикаторов обязательных полей ни в одной форме (обязательность видна лишь на сабмите) | components/form/fields.tsx | M | — |
| F072 | Lead-енумы продублированы локально в админке вместо импорта из `@forge/shared` (дрейф) | admin/lib/types.ts:11-17 | S | — |
| F073 | Страница Users на нативном FormData вместо RHF/zod (иная UX валидации) · preference | users/UsersTable.tsx | M | — |
| F074 | URL/href/image-поля — простой текст без валидации формата · preference | reviews/built-object/promo | M | — |
| F075 | `Article.date` = input type=date, `Review.date` = свободный текст (рассинхрон ввода дат) | blog/ArticleForm vs reviews | S | — |

### API / данные
| ID | Находка | Где | Eff | Триаж |
|---|---|---|---|---|
| F087 | GET `/projects` `technology`/`livingType` минуют enum-валидацию (свободные строки в Prisma where), в отличие от create DTO | list-projects-query.dto.ts:4-12 | S | — |
| F090 | GET `/projects?featured` молча игнорирует любое значение кроме точного `true` | list-projects-query.dto.ts:13-16 | S | — |

---

## Приложение A. Проверено — не дефект (опровергнуто, 14)

F006 анимация geography (артефакт захвата, реальные счётчики 238/54/21/8) · F007 «example.com/English nav» (временная контаминация параллельных агентов) · F027 двойной источник ИНН/ОГРН (значения совпадают, латентный риск) · F044 cap сравнения (видимый disabled+tooltip, не молчит) · F056 H3 поиска перед H1 (панель `aria-hidden`+`visibility:hidden`, вне a11y-дерева) · F066 `toMetadataBase` (API валидирует `baseUrl` через `z.url()`, недостижимо) · F067 soft-404 (все битые slug дают честный 404) · F078 полнота редактора секций (ровно 31 тип = 31 форма, покрытие 1:1) · F079 индекс-матчинг лейблов секций (латентно, нет UI/API для дрейфа) · F081 footer social repeater (в схеме нет массива social — нечего рендерить) · F083 RBAC глазами editor (Users скрыт, `/users`→404, кнопки delete скрыты, сервер enforces) · F091 рассинхрон not-found сообщений · F097 ISR-теги (совпадают для detail-коллекций — не дефект) · F106 инъекция в `<head>` (Next экранирует, JSON-LD захардён).

## Приложение B. Слитые дубли (8)
F089,F102→F041 (consent) · F103→F088 (PII в GET /leads) · F076→F070 (footer external) · F047→F003 (aspect логотипа) · F093→F084 (slug-коллизия 500) · F098→F087 (enum query-параметров) · F018→F064 (кириллические id якорей).
