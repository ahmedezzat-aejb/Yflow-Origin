# AgFlow — Project Overview

Название: AgFlow
Домен: agflow.ru
Кратко: Fork Activepieces с полным ребрендингом, собственной системой биллинга и отдельной базой данных. UI сохраняется, цвета не меняются. 

Основные цели:
- Полная отвязка от Activepieces: убрать бренд, ссылки, CDN, и прочие упоминания.
- Внедрение собственной биллинговой системы: YooMoney + СБП + карты.
- Новая структура тарифов: бесплатный, профессионал, enterprise + доп. покупки (flows, credits).
- Сохранение архитектуры monorepo: frontend, backend, engine, worker.

Ключевые компоненты:
- Frontend: packages/react-ui (React + shadcn + Tailwind)
- Backend API: packages/server/api (Fastify)
- Worker: packages/server/worker (BullMQ)
- Shared: packages/shared, packages/engine, packages/pieces
- Billing: новый модуль packages/server/api/src/services/billing
- БД: PGLite (локально) или PostgreSQL (если мигрировать)
- Очередь: Redis
- CI/CD: GitHub Actions
- Запуск: Docker Compose на TimeWeb VDS

Требования к безопасности:
- Никогда не хранить платежные данные в логах.
- Токены платежных провайдеров — в безопасных секретах (GitHub Secrets / env).
- Подключить Sentry для продакшн ошибок.

Рамки ответственности TRAE Solo:
- Полная автоматизация задач, по правилам в docs/arch-rule.md и docs/requirements.md

PROJECT RULES for AgFlow (to be stored as project-rules.md in repo):

Project identity:
- Name: AgFlow
- Domain: agflow.ru
- Preserve UI styles: shadcn + Tailwind - colors unchanged.

Tech stack:
- Monorepo NX, TypeScript
- Frontend: React + shadcn UI + Tailwind
- Backend: Fastify
- DB: PGLite (default) or Postgres if explicitly migrated
- Queue: Redis + BullMQ
- Worker: server-worker package
- CI: GitHub Actions
- Container: Docker Compose
- Host: TimeWeb VDS / Docker

Key rules:
1. Branding: remove all 'Activepieces' assets, names and urls. Replace with AgFlow.
2. Keep `packages/ee` only if owner confirms; otherwise remove and remove imports.
3. Add `packages/server/api/src/services/billing/*` with YooMoney and SBP providers.
4. Implement FX service with external API + Redis cache.
5. All modifications must be typed (TypeScript) and include unit tests.
6. Database changes must be accompanied by migration script and rollback.
7. Backups: monthly full DB backup + rotation x3.
8. Deploy scripts: docker-compose.prod.yml + nginx conf + certbot integration.
9. Security: never log payment card data. Store only tokens.
10. Observability: Sentry + basic Prometheus metrics (optional).

Outputs for each task:
- Updated files + full content for changed files
- Test run logs
- Docker image tags and Docker Compose up command for deploy
- Step by step deploy checklist for TimeWeb
