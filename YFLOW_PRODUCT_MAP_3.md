# YFLOW_PRODUCT_MAP_3.md - Updated with Sberbank Integration

## 1. Краткий обзор архитектуры

YFlow - это open-source платформа автоматизации с монорепозиторием на TypeScript. Архитектура построена на микросервисном подходе с frontend на React/Vite, backend на Fastify/Node, execution engine, и поддержкой PostgreSQL + Redis. Платформа спроектирована как white-label решение с возможностью кастомизации брендинга, тарифных планов и интеграций. Основная особенность - extensible pieces framework, который позволяет создавать интеграции с различными сервисами и автоматически публиковать их как MCP серверы для LLM.

**Обновление**: Добавлена поддержка Sberbank (Россия) для платежной системы.

## 2. Ключевые файлы (Обновлено)

| Категория | Путь | Назначение | Можно менять (ДА/ОСТОРОЖНО/НЕТ) | YFlow action (1-строка) |
|-----------|------|-----------|----------------------------------|-------------------------|
| **Брендинг и тема** | packages/server/api/src/app/flags/theme.ts | Генерация темы и брендинга | ДА | Заменить URL на yflow.ru, обновить primaryColor |
| | packages/react-ui/src/components/theme-provider.tsx | Провайдер темы для React | ДА | Обновить логику загрузки favicon |
| | assets/ap-logo.PNG | Логотип платформы | ДА | Заменить на YFlow логотип |
| **Конфигурация** | .env.example | Шаблон переменных окружения | ДА | Обновить AP_FRONTEND_URL на app.yflow.ru |
| | yflow.env | YFlow конфигурация | ДА | Настроить YooKassa и Sberbank параметры |
| | docker-compose.yml | Docker конфигурация | ОСТОРОЖНО | Обновить образы и env файлы |
| **Аутентификация** | packages/react-ui/src/features/authentication/components/sign-in-form.tsx | Форма входа | ДА | Обновить стили и текст |
| | packages/react-ui/src/features/authentication/components/sign-up-form.tsx | Форма регистрации | ДА | Обновить валидацию и текст |
| **База данных** | packages/server/api/src/app/platform/platform.entity.ts | Сущность платформы | ОСТОРОЖНО | Добавить поля для YFlow |
| | packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts | Тарифные планы | ОСТОРОЖНО | Добавить Sberbank поля |
| **Платежи - Stripe** | packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts | Stripe вебхуки | ОСТОРОЖНО | Оставить как есть |
| | packages/server/api/src/app/ee/platform/platform-plan/stripe-helper.ts | Stripe хелперы | ОСТОРОЧНО | Оставить как есть |
| **Платежи - YooKassa** | packages/server/api/src/app/ee/platform/platform-plan/yookassa-billing.controller.ts | YooKassa вебхуки | ДА | Создать по аналогии с Stripe |
| | packages/server/api/src/app/ee/platform/platform-plan/yookassa-helper.ts | YooKassa хелперы | ДА | Создать по аналогии с Stripe |
| **Платежи - Sberbank** | packages/server/api/src/app/ee/platform/platform-plan/sberbank-billing.controller.ts | Sberbank вебхуки | ДА | ✅ Создан |
| | packages/server/api/src/app/ee/platform/platform-plan/sberbank-helper.ts | Sberbank хелперы | ДА | ✅ Создан |
| | packages/server/api/src/app/ee/platform/platform-plan/sberbank-billing.module.ts | Sberbank модуль | ДА | ✅ Создан |
| **Локализация** | packages/react-ui/public/locales/ru/translation.json | Русский перевод | ДА | Обновить тексты для YFlow |
| | packages/react-ui/public/locales/en/translation.json | Английский перевод | ДА | Обновить тексты для YFlow |
| **Frontend routing** | packages/react-ui/src/app/routes/authenticate/index.tsx | Страница аутентификации | ДА | Обновить редиректы |

## 3. User lifecycle (пошагово) - Обновлено

**Лендинг → signup → login → setup → home → payment → access → AI**

1. **Лендинг**: `/` - packages/react-ui/src/app/routes/
2. **Signup**: `/sign-up` - packages/react-ui/src/features/authentication/components/sign-up-form.tsx
3. **Login**: `/sign-in` - packages/react-ui/src/features/authentication/components/sign-in-form.tsx
4. **Setup**: `/platform/setup` - Первичная настройка платформы
5. **Home**: `/flows` - Главная страница с потоками
6. **Payment**: `/platform/setup/billing` - Страница платежей
   - **НОВОЕ**: Поддержка 3 платежных систем:
     - Stripe (международные)
     - YooKassa (российские)
     - Sberbank (российские)
7. **Access**: Проверка прав доступа
8. **AI**: `/ai` - AI функционал

## 4. Links map (all occurrences) - Обновлено

- **packages/server/api/src/app/flags/theme.ts:66-72** - `"https://yflow.ru/brand/full-logo.png"` → заменить на `"https://yflow.ru/brand/full-logo.png"` (риск: LOW)
- **packages/server/api/src/app/flags/theme.ts:69** - `"https://yflow.ru/brand/favicon.ico"` → заменить на `"https://yflow.ru/brand/favicon.ico"` (риск: LOW)
- **packages/server/api/src/app/flags/theme.ts:70** - `"https://yflow.ru/brand/logo.svg"` → заменить на `"https://yflow.ru/brand/logo.svg"` (риск: LOW)
- **packages/server/api/src/app/ee/platform/platform-plan/stripe-helper.ts:42** - `"https://cloud.yflow.com/platform/billing"` → заменить на `"https://app.yflow.ru/platform/billing"` (риск: MEDIUM)
- **.env.example:15** - `"https://app.yflow.ru"` → оставить как есть (риск: LOW)
- **yflow.env:4** - `"https://app.yflow.ru"` → оставить как есть (риск: LOW)

## 5. DB & Entities - Обновлено

**Файлы подключения:**
- `packages/server/api/src/app/database/database-connection.ts` - основное подключение к Postgres
- `packages/server/api/src/app/database/redis-connections.ts` - Redis подключения

**Сущности:**
- **platform** (`packages/server/api/src/app/platform/platform.entity.ts`):
  - Поля для YFlow: name, primaryColor, logoIconUrl, fullLogoUrl, favIconUrl
  - Добавить: yflowDomain, yflowSettings

- **platform_plan** (`packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts`):
  - Поля платежей Stripe: stripeCustomerId, stripeSubscriptionId, stripeSubscriptionStatus
  - Поля платежей YooKassa: ykassaCustomerId, ykassaSubscriptionId, ykassaSubscriptionStatus
  - **НОВЫЕ** поля платежей Sberbank: sberbankCustomerId, sberbankSubscriptionId, sberbankSubscriptionStatus
  - **НОВЫЕ** поля SPIBank: spibankCustomerId, spibankSubscriptionId, spibankSubscriptionStatus

## 6. Payments & Subscriptions (flow) - Обновлено

**Где принимаются вебхуки:**
- Stripe: `packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts:/stripe/webhook`
- YooKassa: `packages/server/api/src/app/ee/platform/platform-plan/yookassa-billing.controller.ts:/yookassa/webhook` (создать)
- **НОВОЕ** Sberbank: `packages/server/api/src/app/ee/platform/platform-plan/sberbank-billing.controller.ts:/sberbank/webhook` ✅

**Где update статусов:**
- `platform-plan.service.ts:update()` - обновление тарифа
- `stripe-helper.ts` - обработка Stripe событий
- `yookassa-helper.ts` - обработка YooKassa событий (создать)
- **НОВОЕ** `sberbank-helper.ts` - обработка Sberbank событий ✅

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

## 8. Docker & Deploy recommendations - Обновлено

**Env vars для YFlow:**
```bash
AP_FRONTEND_URL=https://app.yflow.ru
AP_POSTGRES_DATABASE=yflow
AP_POSTGRES_HOST=postgres
AP_POSTGRES_PORT=5432
AP_POSTGRES_USERNAME=postgres
AP_REDIS_HOST=redis
AP_REDIS_PORT=6379

# Stripe (legacy)
AP_STRIPE_SECRET_KEY=your_stripe_secret_key
AP_STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# YooKassa
AP_YOOKASSA_API_KEY=your_yookassa_api_key
AP_YOOKASSA_SHOP_ID=your_yookassa_shop_id
AP_YOOKASSA_WEBHOOK_SECRET=your_yookassa_webhook_secret

# Sberbank (НОВОЕ)
AP_SBERBANK_API_KEY=your_sberbank_api_key
AP_SBERBANK_MERCHANT_ID=your_sberbank_merchant_id
AP_SBERBANK_WEBHOOK_SECRET=your_sberbank_webhook_secret
AP_SBERBANK_BASE_URL=https://api.sberbank.ru/v1
```

**Compose changes:**
- Обновить образ: `image: yflow/yflow:latest`
- Добавить volumes для логов YFlow
- Настроить nginx для SSL на app.yflow.ru

## 9. Docs to read (from docs/), top-list

- `docs/install/overview.mdx` - установка и настройка
- `docs/admin-guide/platform/platform-plans.mdx` - управление тарифами
- `docs/admin-guide/security/authentication.mdx` - аутентификация
- `docs/build-pieces/building-pieces/overview.mdx` - создание интеграций
- `docs/handbook/deployment/docker.mdx` - Docker развертывание
- `docs/endpoints/platform-plans.mdx` - API тарифных планов
- **НОВОЕ** `SBERBANK_INTEGRATION.md` - документация по интеграции Sberbank ✅

## 10. Safe zones & Forbidden zones - Обновлено

**Где писать:**
- `packages/server/api/src/app/ee/platform/platform-plan/` - тарифы и платежи ✅
- `packages/server/api/src/app/platform/` - управление платформой
- `packages/react-ui/src/features/platform-admin/` - админка YFlow
- `packages/react-ui/src/features/authentication/` - аутентификация
- `packages/server/api/src/migrations/` - миграции БД

**Чего не трогать:**
- `packages/engine/` - core execution engine
- `packages/pieces/` - интеграции (OAuth core)
- `packages/server/shared/` - shared библиотеки
- `packages/ee/` - enterprise features (кроме platform-plan)

## 11. Next steps (concrete checklist for devs / noobs) - Обновлено

1. **Настроить окружение:**
   ```bash
   cp .env.example .env
   # Обновить AP_FRONTEND_URL=https://app.yflow.ru
   # Добавить Sberbank переменные
   docker compose up -d
   ```

2. **Обновить брендинг:**
   ```bash
   # Заменить логотипы в assets/
   # Обновить URL в theme.ts
   npm run dev
   ```

3. **Добавить Sberbank:**
   ```bash
   # ✅ Создано: sberbank-billing.controller.ts
   # ✅ Создано: sberbank-helper.ts
   # ✅ Создано: sberbank-billing.module.ts
   # ✅ Добавлены поля в БД
   ```

4. **Создать миграции:**
   ```bash
   # ✅ Добавлены поля Sberbank в platform_plan
   npm run migration:generate -- AddSberbankFieldsToPlatformPlan
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
   # Настроить Sberbank тестовые ключи
   # Проверить вебхуки
   curl -X POST http://localhost:8080/api/v1/platform/plans/sberbank/webhook
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
    # Тестировать все 3 платежные системы
    ```

## 12. Payment Systems Summary

| Система | Валюта | Статус | Controller | Helper |
|---------|--------|--------|------------|--------|
| Stripe | USD/EUR | ✅ Работает | stripe-billing.controller.ts | stripe-helper.ts |
| YooKassa | RUB | 🔄 Нужно создать | yookassa-billing.controller.ts | yookassa-helper.ts |
| Sberbank | RUB | ✅ Создано | sberbank-billing.controller.ts | sberbank-helper.ts |
| SPIBank | SAR | ✅ Создано | spibank-billing.controller.ts | spibank-helper.ts |

## 13. Итог

YFlow теперь поддерживает 4 платежные системы:
1. **Stripe** - международные платежи
2. **YooKassa** - российские платежи (нужно реализовать)
3. **Sberbank** - российские платежи (реализовано ✅)
4. **SPIBank** - саудовские платежи (реализовано ✅)

Платформа готова к white-label развертыванию с поддержкой множественных платежных систем.
