# @forge/ncottage-api

Backend ncottage: приём заявок и CMS контента. NestJS + Fastify + Prisma (PostgreSQL).

## Локальный запуск

```bash
# 1. Поднять Postgres
docker compose -f apps/ncottage-api/docker-compose.yml up -d

# 2. Завести .env (по образцу .env.example)
cp apps/ncottage-api/.env.example apps/ncottage-api/.env

# 3. Сгенерировать Prisma-клиент и применить миграции
pnpm --filter @forge/ncottage-api prisma:generate
pnpm --filter @forge/ncottage-api db:migrate

# 4. Запустить сервис
pnpm dev:ncottage-api
```

Проверка: `curl http://localhost:3002/health`.

## Сборка

`pnpm build:ncottage-api` (nest build) или `pnpm --filter @forge/ncottage-api bundle` (esbuild → `bundle/main.js`).
