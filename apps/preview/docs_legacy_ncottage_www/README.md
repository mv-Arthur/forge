# Legacy ncottage.ru atlas

Текстовый атлас **исходников и схемы** live-сайта на Beget (WordPress Bedrock + Sage 9 + WooCommerce). Это не live CMS и не порт в Next.

Источник: SSH `ncottaxz@ncottaxz.beget.tech` + SELECT через туннель `3307` + локальные фикстуры `--parity-only`.

Как повторить: [SOURCE.md](./SOURCE.md).

## Docs

- [00-inventory.md](./00-inventory.md) — host, vhosts, excluded dumps
- [01-stack.md](./01-stack.md) — Bedrock, `roots/wordpress` 5.2.3, Sage 9, plugins
- [02-routing.md](./02-routing.md) — robots, sitemap, permalinks, Elementor count
- [03-templates.md](./03-templates.md) — Blade Template Name + Woo overrides + PHP hooks
- [04-catalog.md](./04-catalog.md) — products 329, `PARITY_OK`, ACF/meta
- [05-built-objects.md](./05-built-objects.md) — parent 459, 90 objects
- [06-content-types.md](./06-content-types.md) — post types, top-level pages
- [07-forms-leads.md](./07-forms-leads.md) — CF7 (50 forms)
- [08-integrations.md](./08-integrations.md) — jetpack, ihaf, rocket, yoast
- [09-db-schema.md](./09-db-schema.md) — 102 table names
- [10-ops.md](./10-ops.md) — cron, cache, odd docroot files
- [11-sibling-sites.md](./11-sibling-sites.md) — other vhosts one-pager
- [12-parity-vs-www.md](./12-parity-vs-www.md) — vs `apps/ncottage-www` routes

## Inventories

`inventories/` — plugins, blade-views, php-files, php-hooks, live-paths, post-types.json, page-templates.json, acf-meta-keys, acf-field-groups, cf7-forms.json, www-routes.txt, completeness.json.
