# Content model — миграция www → CMS (эпик E)

Карта захардкоженного контента `ncottage-www` и план переноса в CMS. Составлена
параллельным разбором (57 сырых сущностей) + сверкой со [SPEC прил. A](./SPEC.md).
Свёрнуто в ~28 управляемых CMS-сущностей. Источник правды для E1–E5.

## Принципы модели
- **Singletons** (nav/footer/contacts/legal-реквизиты) → таблица `Setting { key @unique, value Json }`, по одной записи на ключ. Редактор — одна типизированная форма (без сырого JSON), zod-валидация на входе API.
- **Collections** (блог, услуги, отзывы и т.д.) → выделенная таблица + DataTable + форма с repeater-полями. Глубоко вложенные редкие массивы допустимо хранить структурированным JSON с zod (прагматизм, D5).
- **Pages with sections** (главная, about, финансовые лендинги) → `Page { key @unique, title, seo… }` + `PageSection { pageId, type, order, data Json }`; на каждый тип секции — своя типизированная форма (не block-builder).
- Медиа-ссылки — через `Media`/`MediaPicker`; SEO — поля на сущности/странице (эпик F). После мутаций — revalidate по тегам (E0).

## E1 — Settings (singletons) · низкий объём, высокая отдача
| Сущность | Источник | Ключ Setting | Форма |
|---|---|---|---|
| Навигация | `src/content/site.ts` `NAV_ITEMS` | `nav` | repeater пунктов с под-пунктами (label, href, badge?) |
| Футер | `src/content/site.ts` `FOOTER` | `footer` | tagline, меню(repeater), офисы(repeater), соцсети, legal, нижние ссылки, copyright/disclaimer |
| Контакты | `src/content/contacts.ts` | `contacts` | города, телефоны(spb/msk), email, адреса(4), соцсети(4), часы, legal(ogrn/inn/kpp) |

www: `getSettings(key)` с `next.tags=["settings","settings:<key>"]`; футер/шапка/контакты читают из API.

## E2 — Главная (page-sections) · самая объёмная
`Page key="home"` + 13 типизированных секций (`src/content/home.ts`):
hero, picker, catalog, advantages, quote, works, stages, geography, reviews, featured, guarantees, faq, contact. Каждая — `PageSection.data` со своей zod-схемой и формой. Дробить по секциям. Медиа: hero image, reviews image/videoUrl.

## E3 — Блог
`Article` (collection): slug, title, description, category, date, readTime, heroNote, highlights[], sections[]{title, body[], list?}, checklist[], relatedSlugs[]. 7 статей. Форма: repeater секций (body — repeater абзацев), highlights/checklist repeaters, related — picker. + Blog hero/CTA → `Setting key="blog_page"`.

## E4 — Услуги + SEO · самая сложная (~3000 строк)
- `Service` (collection, 9 шт., `app/services/services.ts`): slug, title, shortTitle, description, eyebrow, lead, summary, image + ~12 строковых массивов (highlights, scopes, stages, advantages, fitFor, includes, notIncluded, priceFactors, deliverables, quickFacts), detail* поля, relatedSlugs[], scenarioSlugs[]. Объёмные массивы — структурированный JSON + zod.
- `ServiceSeoContent` (по slug, `[slug]/seoContent.ts`): priceNote, timing[]{label,value,description}, examples[]{title,description,result}, faq[]{q,a}.
- `ServiceScenario` (6 шт.): slug, title, description, pain/promise/outcome, *ServiceSlugs[]. `BuildRouteStep` (7). Навигатор-копи (квиз, scenario-профили) → `Setting key="services_ui"`.

## E5 — Прочие коллекции + страницы + legal
Collections: **Promos**(2), **Reviews**(8; +метрики), **Vacancies**(2; requirements/conditions repeaters), **FaqItem**(плоско, поле `group`; 3 группы×4), **BuiltObjects**(12, уже в `src/data` — перенести в таблицу), **Certificates**(7 строк +checks 3), **Partners**(12: name/href?/category +principles 3), **ProjectSelections**(6 групп — пропущено в прил. A, найдено критиком: `app/project-selections/selections.ts`).
Pages-sections: **About**(facts/team/timeline), **Production**(hero/features/steps/standards), **Finance landings ×4**(mortgage/credit/maternity/payment — общий `FinanceLanding`: stats/conditions/steps/banks/note/form; параметризованные `Page`), **Contacts page**(offices/productions — найдено критиком), **Works page**(hero/visit-form вокруг BuiltObjects).
Legal (низкий приоритет, D5): privacy, offer, requisites, personal-data → `Page` с секциями {title, items[]}/таблицами реквизитов; обновляемая дата. Можно оставить в коде, если по остаточному принципу.

## Кросс-сущностные заметки
- Дубли метрик «320+ домов / 95% / с 2007»: about facts, reviews metrics, home geography/hero trust — свести к одному источнику (`Setting key="company_stats"`), переиспользовать.
- Контакты (телефоны/адреса/legal) тянут footer, contact-секции, legal-страницы — единый `Setting key="contacts"`.
- Иконки секций (guarantee icon, service icons) — символьные ключи enum, не медиа.
- Даты отзывов в разных форматах — нормализовать при импорте.

## Порядок
E0 ✔ → **E1** (settings) → E3 (blog) / E5 collections (параллелизуемы) → E2 (home) → E4 (services) → E5 pages/legal → F (SEO, аудиты, финальный PR). Каждая фаза: backend (+e2e, сид-импорт из текущих `*.ts/json`) → admin → www (+ISR).
