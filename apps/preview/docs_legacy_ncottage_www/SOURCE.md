# SOURCE — how to re-run this atlas

Do not put password values in this file. Names of env vars are OK.

## SSH

Host `ncottaxz.beget.tech`, user `ncottaxz`, key `~/.ssh/id_ed25519` (see `apps/preview/data/fixtures/README.md` SSH recipe).

```
ssh -4 -o BatchMode=yes -i ~/.ssh/id_ed25519 ncottaxz@ncottaxz.beget.tech 'echo SSH_OK'
```

Site root: `/home/n/ncottaxz/ncottage.ru/public_html`.

Inventories that were `ls`/`find`/`grep` from there:

- `app/plugins`, `app/themes/sage`, `app/mu-plugins`
- Blade `resources/views`
- grep hooks in `resources/functions.php`, `app/*.php`, `plugins/woocatbase/*.php`
- `robots.txt`, `sitemap.xml`
- `.htaccess`, `app/wp-rocket-config`
- sibling vhost top-level dirs

Not copied: `wp-config.php`, `.env`, `db.sql`, `app/uploads`, `config/`.

## MySQL tunnel

Local `3307` → remote `127.0.0.1:3306` (same README). Env file `apps/preview/.beget-db.env` (`BEGET_DB_HOST`, `BEGET_DB_PORT`, `BEGET_DB_USER`, `BEGET_DB_NAME`, `BEGET_DB_PASS`). chmod 600.

Parity (does not rewrite fixtures):

```
cd apps/preview
node scripts/export-fixtures-from-db.mjs --parity-only
```

Expect `PARITY_OK`.

SELECT-only for post types, page templates, CF7 titles, ACF groups, `SHOW TABLES`.

User must be `…@localhost` (not remote-IP).

## www routes

```
find apps/ncottage-www/src/app -name page.tsx
```
