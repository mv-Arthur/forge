# 10 — Ops (cron, cache, docroot extras)

URL space is `inventories/live-paths.txt` from sitemap (item 2.2), not access.log.

## crontab

`crontab: empty` — host has no `crontab` binary (`command not found` on 2026-08-20 SSH). WP cron via HTTP likely.

## WP Rocket

- Plugin dir present; config `public_html/app/wp-rocket-config/` (`ncottage.ru.php`, dynamic-lists JSON)
- `.htaccess` starts with `# BEGIN WP Rocket`, `X-Powered-By: WP Rocket/3.16.4`
- Tables `wp_wpr_rocket_cache`, `wp_wpr_above_the_fold`, `wp_wpr_rucss_used_css`

## d-robots-checker.php

`app/themes/sage/resources/d-robots-checker.php` — helper `durIsDisallowed($url, $ua)` reads robots.txt for noindex meta. First 20 lines only; not executed.

## Odd docroot files (first 20 lines, not executed)

| File | First lines |
|---|---|
| `x.php` | `<?php phpinfo();` |
| `varvara.php` | PHP file-search tool (`maskfiles` php/htm/js, `minsearch` 2, `exectime` 180) |
| `antibot/` + `antibot8.zip` | present (not opened beyond listing) |
| `db.sql` | dump in docroot — **not copied** |
| `wp-config.php` | **not copied** |

## Logs

`ncottage.ru/ncottage.ru.access.log*` exist on the vhost dir — not parsed.
