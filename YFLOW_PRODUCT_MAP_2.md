# YFLOW_PRODUCT_MAP_2.md

## 1. Краткий обзор архитектуры

YFlow - это open-source платформа автоматизации с монорепозиторием на TypeScript. Архитектура построена на микросервисном подходе с frontend на React/Vite, backend на Fastify/Node, execution engine, и поддержкой PostgreSQL + Redis. Платформа спроектирована как white-label решение с возможностью кастомизации брендинга, тарифных планов и интеграций. Основная особенность - extensible pieces framework, который позволяет создавать интеграции с различными сервисами и автоматически публиковать их как MCP серверы для LLM.

## 2. Ключевые файлы

| Категория | Путь | Назначение | Можно менять (ДА/ОСТОРОЖНО/НЕТ) | YFlow action (1-строка) |
|-----------|------|-----------|----------------------------------|-------------------------|
| **Брендинг и тема** | packages/server/api/src/app/flags/theme.ts | Генерация темы и брендинга | ДА | Заменить URL на yflow.ru, обновить primaryColor |
| | packages/react-ui/src/components/theme-provider.tsx | Провайдер темы для React | ДА | Обновить логику загрузки favicon |
| | assets/ap-logo.PNG | Логотип платформы | ДА | Заменить на YFlow логотип |
| | docs/resources/logo/ | SVG логотипы для документации | ДА | Заменить на YFlow логотипы |
| **Конфигурация** | .env.example | Шаблон переменных окружения | ДА | Обновить AP_FRONTEND_URL на app.yflow.ru |
| | yflow.env | YFlow конфигурация | ДА | Настроить YooKassa параметры |
| | docker-compose.yml | Docker конфигурация | ОСТОРОЖНО | Обновить образы и env файлы |
| **Аутентификация** | packages/react-ui/src/features/authentication/components/sign-in-form.tsx | Форма входа | ДА | Обновить стили и текст |
| | packages/react-ui/src/features/authentication/components/sign-up-form.tsx | Форма регистрации | ДА | Обновить валидацию и текст |
| | packages/server/api/src/app/authentication/ | Модули аутентификации | ОСТОРОЖНО | Добавить SSO для YFlow |
| **База данных** | packages/server/api/src/app/platform/platform.entity.ts | Сущность платформы | ОСТОРОЖНО | Добавить поля для YFlow |
| | packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts | Тарифные планы | ОСТОРОЧНО | Добавить YooKassa поля |
| | packages/server/api/src/app/database/redis-connections.ts | Redis подключения | НЕТ | Только конфигурация |
| **Платежи** | packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts | Stripe вебхуки | ОСТОРОЖНО | Добавить YooKassa вебхуки |
| | packages/server/api/src/app/ee/platform/platform-plan/stripe-helper.ts | Stripe хелперы | ОСТОРОЧНО | Создать yookassa-helper.ts |
| **Локализация** | packages/react-ui/public/locales/ru/translation.json | Русский перевод | ДА | Обновить тексты для YFlow |
| | packages/react-ui/public/locales/en/translation.json | Английский перевод | ДА | Обновить тексты для YFlow |
| **Frontend routing** | packages/react-ui/src/app/routes/authenticate/index.tsx | Страница аутентификации | ДА | Обновить редиректы |
| **Docker и Deploy** | Dockerfile | Сборка образа | ОСТОРОЧНО | Обновить base image |
| | docker-entrypoint.sh | Скрипт запуска | ДА | Обновить для YFlow |
| **Workers и очереди** | packages/server/api/src/app/workers/queue/queue-manager.ts | Менеджер очередей | НЕТ | Core функционал |
| | packages/server/api/src/app/database/redis-connections.ts | Redis коннекты | НЕТ | Core функционал |

## 3. User lifecycle (пошагово)

**Лендинг → signup → login → setup → home → payment → access → AI**

1. **Лендинг**: `/` - packages/react-ui/src/app/routes/
   - Frontend: Главный маршрут приложения
   - Backend: platform.controller.ts для получения брендинга
   - Что менять: Обновить логотипы, цвета, ссылки на yflow.ru

2. **Signup**: `/sign-up` - packages/react-ui/src/features/authentication/components/sign-up-form.tsx
   - Frontend: Форма регистрации с валидацией
   - Backend: authentication.controller.ts POST /sign-up
   - Что менять: Обновить тексты, добавить доменную валидацию для @yflow.ru

3. **Login**: `/sign-in` - packages/react-ui/src/features/authentication/components/sign-in-form.tsx
   - Frontend: Форма входа
   - Backend: authentication.controller.ts POST /sign-in
   - Что менять: Обновить редирект на app.yflow.ru после входа

4. **Setup**: `/platform/setup` - Первичная настройка платформы
   - Frontend: Мастер настройки
   - Backend: platform.controller.ts
   - Что менять: Обновить шаги настройки для YFlow

5. **Home**: `/flows` - Главная страница с потоками
   - Frontend: Дашборд с потоками
   - Backend: flow.controller.ts
   - Что менять: Обновить branding и тему

6. **Payment**: `/platform/setup/billing` - Страница платежей
   - Frontend: Формы оплаты
   - Backend: stripe-billing.controller.ts + yookassa-controller.ts
   - Что менять: Добавить YooKassa как основной платежный метод

7. **Access**: Проверка прав доступа
   - Backend: authorization-middleware.ts
   - Что менять: Обновить проверки для YFlow тарифов

8. **AI**: `/ai` - AI функционал
   - Frontend: AI интерфейсы
   - Backend: ai-controller.ts
   - Что менять: Обновить промпты и branding

## 4. Links map (all occurrences)

- **packages/server/api/src/app/flags/theme.ts:66-72** - `"https://yflow.ru/brand/full-logo.png"` → заменить на `"https://yflow.ru/brand/full-logo.png"` (риск: LOW)
- **packages/server/api/src/app/flags/theme.ts:69** - `"https://yflow.ru/brand/favicon.ico"` → заменить на `"https://yflow.ru/brand/favicon.ico"` (риск: LOW)
- **packages/server/api/src/app/flags/theme.ts:70** - `"https://yflow.ru/brand/logo.svg"` → заменить на `"https://yflow.ru/brand/logo.svg"` (риск: LOW)
- **packages/server/api/src/app/ee/platform/platform-plan/stripe-helper.ts:42** - `"https://cloud.yflow.com/platform/billing"` → заменить на `"https://app.yflow.ru/platform/billing"` (риск: MEDIUM)
- **.env.example:15** - `"https://app.yflow.ru"` → оставить как есть (риск: LOW)
- **yflow.env:4** - `"https://app.yflow.ru"` → оставить как есть (риск: LOW)

## 5. DB & Entities

**Файлы подключения:**
- `packages/server/api/src/app/database/database-connection.ts` - основное подключение к Postgres
- `packages/server/api/src/app/database/redis-connections.ts` - Redis подключения

**Сущности:**
- **platform** (`packages/server/api/src/app/platform/platform.entity.ts`):
  - Поля для YFlow: name, primaryColor, logoIconUrl, fullLogoUrl, favIconUrl
  - Добавить: yflowDomain, yflowSettings

- **platform_plan** (`packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts`):
  - Поля платежей: stripeCustomerId, stripeSubscriptionId, stripeSubscriptionStatus
  - Добавить для YooKassa: yookassaCustomerId, yookassaPaymentId, yookassaSubscriptionId

- **user** - базовая сущность пользователя
- **flow** - сущность потоков автоматизации

## 6. Payments & Subscriptions (flow)

**Где принимаются вебхуки:**
- Stripe: `packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts:/stripe/webhook`
- YooKassa: нужно создать `yookassa-billing.controller.ts:/yookassa/webhook`

**Где update статусов:**
- `platform-plan.service.ts:update()` - обновление тарифа
- `stripe-helper.ts` - обработка Stripe событий
- Нужно создать `yookassa-helper.ts` для YooKassa

**Как открыть доступ после оплаты:**
1. Вебхук обновляет статус в platform_plan
2. Middleware проверяет plan.status при каждом запросе
3. Frontend запрашивает текущий план и показывает доступные функции

## 7. AI Builder & Credits

**Backend endpoints:**
- `/api/v1/ai-credits` - управление кредитами
- `/api/v1/ai/generate` - генерация кода

**Frontend views:**
- `/ai` - AI интерфейс
- `/platform/setup/billing` - покупка кредитов

**Where to check credits:**
- `platform-ai-credits.service.ts:getCredits()` - получение баланса
- Frontend: `ai-credits-hooks.ts` - хуки для работы с кредитами

## 8. Docker & Deploy recommendations

**Env vars для YFlow:**
```bash
AP_FRONTEND_URL=https://app.yflow.ru
AP_POSTGRES_DATABASE=yflow
AP_POSTGRES_HOST=postgres
AP_POSTGRES_PORT=5432
AP_POSTGRES_USERNAME=postgres
AP_REDIS_HOST=redis
AP_REDIS_PORT=6379
AP_YOOKASSA_API_KEY=your_yookassa_api_key
AP_YOOKASSA_SHOP_ID=your_yookassa_shop_id
AP_YOOKASSA_WEBHOOK_SECRET=your_yookassa_webhook_secret
```

**Compose changes:**
- Обновить образ: `image: yflow/yflow:latest` → `image: yflow/yflow:latest`
- Добавить volumes для логов YFlow
- Настроить nginx для SSL на app.yflow.ru

**Nginx recommendation:**
```nginx
server {
    listen 443 ssl;
    server_name app.yflow.ru;
    
    location / {
        proxy_pass http://yflow:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 9. Docs to read (from docs/), top-list

- `docs/install/overview.mdx` - установка и настройка
- `docs/admin-guide/platform/platform-plans.mdx` - управление тарифами
- `docs/admin-guide/security/authentication.mdx` - аутентификация
- `docs/build-pieces/building-pieces/overview.mdx` - создание интеграций
- `docs/handbook/deployment/docker.mdx` - Docker развертывание
- `docs/endpoints/platform-plans.mdx` - API тарифных планов

## 10. Safe zones & Forbidden zones

**Где писать:**
- `packages/server/api/src/app/ee/platform/platform-plan/` - тарифы и платежи
- `packages/server/api/src/app/platform/` - управление платформой
- `packages/react-ui/src/features/platform-admin/` - админка YFlow
- `packages/react-ui/src/features/authentication/` - аутентификация
- `packages/server/api/src/migrations/` - миграции БД

**Чего не трогать:**
- `packages/engine/` - core execution engine
- `packages/pieces/` - интеграции (OAuth core)
- `packages/server/shared/` - shared библиотеки
- `packages/ee/` - enterprise features (кроме platform-plan)

## 11. Next steps (concrete checklist for devs / noobs)

1. **Настроить окружение:**
   ```bash
   cp .env.example .env
   # Обновить AP_FRONTEND_URL=https://app.yflow.ru
   docker compose up -d
   ```

2. **Обновить брендинг:**
   ```bash
   # Заменить логотипы в assets/
   # Обновить URL в theme.ts
   npm run dev
   ```

3. **Добавить YooKassa:**
   ```bash
   # Создать yookassa-billing.controller.ts
   # Добавить вебхук /yookassa/webhook
   # Обновить platform-plan.entity.ts
   ```

4. **Создать миграции:**
   ```bash
   # Добавить поля YooKassa в platform_plan
   npm run migration:generate -- AddYookassaFields
   npm run migration:run
   ```

5. **Обновить локализацию:**
   ```bash
   # Отредактировать ru/translation.json
   npm run i18n:extract
   ```

6. **Настроить Docker:**
   ```bash
   # Обновить docker-compose.yml
   # Добавить nginx конфигурацию
   docker compose -p yflow up -d
   ```

7. **Тестирование платежей:**
   ```bash
   # Настроить YooKassa тестовые ключи
   # Проверить вебхуки
   curl -X POST http://localhost:8080/api/v1/platform/plans/yookassa/webhook
   ```

8. **Развертывание:**
   ```bash
   # Собрать образы
   docker build -t yflow/yflow:latest .
   # Залить в registry
   docker push yflow/yflow:latest
   ```

9. **Мониторинг:**
   ```bash
   # Проверить логи
   docker compose logs -f yflow
   # Проверить Redis
   redis-cli -h redis -p 6379 ping
   ```

10. **Финальная проверка:**
    ```bash
    # Проверить все сервисы
    docker compose ps
    # Открыть https://app.yflow.ru
    # Пройти полный user flow
    ```
