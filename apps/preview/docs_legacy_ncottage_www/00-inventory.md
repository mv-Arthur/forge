# 00 — Beget host inventory

Live listing 2026-08-20 via `ssh ncottaxz@ncottaxz.beget.tech` (see `inventories/host-layout.txt`).

## Account

| Field | Value |
|---|---|
| SSH | `ncottaxz@ncottaxz.beget.tech` |
| Home | `/home/n/ncottaxz` |
| Primary site | `/home/n/ncottaxz/ncottage.ru` |
| Web root | `ncottage.ru/public_html` (Bedrock `extra.wordpress-install-dir` = `public_html/wp`) |
| wp-cli | `path: public_html/wp`, `docroot: public_html` |

## Vhosts (home top-level only)

| Path | Role in this atlas |
|---|---|
| `ncottage.ru/` | In scope — live ncottage.ru |
| `ncottaxz.beget.tech/` | Sibling — one-pager in `11-sibling-sites.md` |
| `novyykottedzh.rf/` | Sibling — one-pager |
| `proektpro100.ru/` | Sibling — one-pager |
| `stroypro100.ru/` | Sibling — one-pager |
| `test.ncottaxz.beget.tech/` | Sibling — one-pager |

## Paths under `ncottage.ru/`

| Path | Notes |
|---|---|
| `public_html/` | Live docroot |
| `public_html/app/` | Bedrock `wp-content` equivalent (`themes`, `plugins`, `mu-plugins`, `uploads`) |
| `public_html/wp/` | WordPress core (`roots/wordpress` 5.2.3) |
| `public_html_old/` | Out of scope (full audit) |
| `config/` | Bedrock config — **do not copy** (secrets) |
| `.env` | **do not copy** |
| `composer.json` / `composer.lock` / `vendor/` | Bedrock Composer |
| `.git/` | Remote git present |
| `ncottage.ru.access.log*` | Not parsed (PII / bot-skew); URL space from sitemap |

## Docroot extras (not copied)

- `public_html/wp-config.php`
- `public_html/db.sql` (~59MB)
- `public_html/varvara.php`, `x.php`, `antibot/`, `antibot8.zip`
- `public_html/robots.txt`, `sitemap.xml`, `.htaccess`

## Explicitly excluded from this artifact

- `/home/n/ncottaxz/_live.ncottaxz.ncottage.ru.1files.2897869.tar.gz` (~11GB, Oct 2024)
- `/home/n/ncottaxz/dump.sql.gz`
- `public_html/app/uploads/**`
- `public_html_old` recursive tree
- Sibling vhost source trees beyond one-pager
