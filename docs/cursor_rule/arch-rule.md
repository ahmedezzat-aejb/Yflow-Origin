# Агpхитектурные правила (arch-rule.md)

1. Monorepo structure: не менять layout пакетов; добавлять новые модули внутри packages/server/api/src/services.
2. TypeScript strict: новые модули должны использовать `strict: true`.
3. Single source of truth: общие типы в packages/shared.
4. БД: ставим PGLite по умолчанию; если миграция на Postgres — must include migration + rollback script.
5. Worker: очереди задач только через BullMQ.
6. Payment flows: idempotent обработка webhooks; логика подтверждения платежа должна быть атомарной.
7. Logs: ошибки и события в Sentry; аудиторные логи в отдельной таблице (payments, invoices).
8. CI: при каждом PR — lint, build, unit tests. На main — build docker images.
9. Deploy: docker-compose.prod.yml + nginx reverse-proxy + SSL.
10. Backups: скрипт backup_db.sh; cron job для ежемесячного бэкапа; хранение 3 копий.
11. Secrets: использовать GitHub Secrets или env файлы вне репо; не коммитить секреты.
12. Rollback: все изменения в продакшн сопровождаются rollback инструкцией.
13. Testing: покрыть платежные пути unit+integration tests.
14. Performance: Redis должен использоваться для кеширования FX rates и rate limiting.
15. Rate limits: публичные API endpoints — rate limiting через Fastify plugin.
16. Observability: expose /metrics (Prometheus) optional.
17. Infrastructure as code: docker-compose, Ansible scripts optional.
18. Naming: все коммиты в conventional commits style.
19. Compatibility: не обновлять major версии ecosystem без explicit approval.
20. Migration window: если миграция БД — выполнить в maintenance window и notify.

