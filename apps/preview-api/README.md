# preview-api

Картинки превью: метаданные в Postgres, файлы в `apps/preview/data/fixtures/media`.

```bash
docker compose up -d
cp .env.example .env
pnpm prisma:generate
pnpm prisma:deploy
pnpm dev
```

API: http://localhost:4010  
Postgres: localhost:5433, база `preview`.

Первый пользователь: `POST /auth/setup` (только пока таблица `User` пустая). Дальше вход: `POST /auth/login`.
