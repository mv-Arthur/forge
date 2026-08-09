# data/fixtures — offline data + Beget connection

JSON-снимки publish-набора WordPress/WooCommerce (ncottage / Beget).  
Preview runtime (`lib/data.ts`) читает **только** эти файлы — без live MySQL в `next dev/build`.

## Файлы

| Файл | Содержание |
|------|------------|
| `projects.normalized.json` | 1 строка на published WC product (~329); `mergeProjects` схлопывает материалы по design `slug` |
| `built-objects.normalized.json` | child pages `post_parent=459` (~90 объектов) |
| `built-objects.extras.json` | extras по slug объектов |
| `.export-manifest.json` | product IDs, object slugs, counts (для parity) |

Обновление:

```bash
cd apps/preview
npm run export:fixtures
node scripts/export-fixtures-from-db.mjs --parity-only
npm run assert:fixtures
```

---

# Подключение к legacy MySQL (Beget)

Источник экспорта: аккаунт `ncottaxz`, БД `ncottaxz_db1`, сервер `ncottaxz.beget.tech`.

**Стабильный путь: SSH-туннель → MySQL на `localhost` сервера.**  
Remote MySQL по whitelist IP **не** используем — egress-IP (NAT) плавает.

Креды: `apps/preview/.beget-db.env` (`chmod 600`, в `.gitignore`).  
Пароли и ключи **не** коммитить.

## Предусловия

1. **SSH включён** в панели Beget (главная → «SSH-доступ»).
2. **Публичный ключ** Mac в `~/.ssh/authorized_keys` на сервере.

   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

   Добавить через веб-терминал Beget (плитка «Терминал») или файловый менеджер:

   ```bash
   mkdir -p ~/.ssh && chmod 711 ~/.ssh
   echo 'ssh-ed25519 AAAA... comment' >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **mysql client** на Mac:

   ```bash
   brew install mysql-client
   export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"
   ```

4. **`.beget-db.env`** — пароль **localhost / phpMyAdmin** (доступ `localhost` в MySQL),  
   **не** пароль remote-IP.

## 1. SSH-туннель

Локальный `3307` → MySQL на сервере `127.0.0.1:3306`:

```bash
ssh -4 -fN \
  -o BatchMode=yes \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -o ServerAliveCountMax=3 \
  -o IdentitiesOnly=yes \
  -i ~/.ssh/id_ed25519 \
  -L 3307:127.0.0.1:3306 \
  ncottaxz@ncottaxz.beget.tech
```

Проверки:

```bash
ssh -4 -o BatchMode=yes -i ~/.ssh/id_ed25519 \
  ncottaxz@ncottaxz.beget.tech 'echo SSH_OK'

lsof -nP -iTCP:3307 -sTCP:LISTEN
```

Остановить:

```bash
pkill -f 'ssh.*3307:127.0.0.1:3306.*ncottaxz' || true
```

| | |
|--|--|
| Host | `ncottaxz.beget.tech` |
| User | `ncottaxz` |
| Auth | pubkey `~/.ssh/id_ed25519` |
| Forward | local `3307` → remote `127.0.0.1:3306` |

## 2. Env

`apps/preview/.beget-db.env`:

```bash
# Beget MySQL via SSH tunnel (stable; no IP whitelist)
BEGET_DB_HOST=127.0.0.1
BEGET_DB_PORT=3307
BEGET_DB_USER=ncottaxz_db1
BEGET_DB_NAME=ncottaxz_db1
BEGET_DB_PASS='<localhost MySQL password>'
```

```bash
chmod 600 apps/preview/.beget-db.env
```

`scripts/export-fixtures-from-db.mjs` (`loadEnv`) strips one outer `'`/`"` pair on values — same contract as the bash smoke strip below.

## 3. Smoke MySQL

```bash
export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"
set -a && source apps/preview/.beget-db.env && set +a
PASS="${BEGET_DB_PASS#\'}"; PASS="${PASS%\'}"

mysql --connect-timeout=12 \
  -h "$BEGET_DB_HOST" -P "$BEGET_DB_PORT" \
  -u "$BEGET_DB_USER" -p"$PASS" \
  "$BEGET_DB_NAME" \
  -e "
SELECT 1 AS ok;
SELECT USER() AS u, DATABASE() AS db;
SELECT COUNT(*) AS products_publish
  FROM wp_posts WHERE post_type='product' AND post_status='publish';
SELECT COUNT(*) AS objects_pages
  FROM wp_posts WHERE post_type='page' AND post_status='publish' AND post_parent=459;
"
```

Ожидаемо: `ok=1`, `user@localhost`, products ≈ 329, objects ≈ 90.

## 4. Экспорт

Туннель поднят, env заполнен:

```bash
cd apps/preview
npm run export:fixtures
node scripts/export-fixtures-from-db.mjs --parity-only
```

Скрипт пишет в `data/fixtures/` (этот каталог).

## Почему не remote MySQL

| Способ | Стабильность |
|--------|----------------|
| Remote `:3306` + whitelist IP | Ломается при смене NAT |
| **SSH tunnel + localhost** | Не зависит от клиентского IP |
| «Единый доступ со всех IP» | Работает, MySQL торчит наружу |

## Типичные ошибки

| Симптом | Проверить |
|---------|-----------|
| `Permission denied (publickey)` | ключ в `authorized_keys`, `chmod 600` |
| `Connection refused` на `:3307` | туннель не поднят |
| `ERROR 1045` через туннель | пароль **localhost**, не remote-IP |
| `ERROR 2003` на `:3306` напрямую | не ходи напрямую — туннель |
| После сна Mac | перезапусти `ssh -fN … -L 3307:…` |

## Чеклист

```text
[ ] SSH green в панели Beget
[ ] pubkey в authorized_keys
[ ] ssh → SSH_OK
[ ] tunnel -L 3307:127.0.0.1:3306
[ ] .beget-db.env (127.0.0.1:3307, localhost pass)
[ ] mysql SELECT 1 → ok
[ ] npm run export:fixtures
```
