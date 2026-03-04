# YFLOW_yflow_PRODUCT_MAP_2.md

## 1. Краткий обзор архитектуры (2-3 абзаца)
Yflow— монорепозиторий с тремя основными слоями: **React UI** (packages/react-ui), **Backend API** на Fastify (packages/server/api) и **Execution/Workers** (engine/worker пакеты). UI обращается к API через общий axios-слой и получает флаги/брендинг от backend. База данных — PostgreSQL через TypeORM, кэш/очереди — Redis. Архитектура поддерживает multi‑tenant платформы (Platform), где каждый владелец при регистрации получает собственный tenant и проект.

Для white‑label YFlow допустимы изменения в слоях UI/branding/URLs/конфиге, но ядро (engine, execution pipeline, pieces/*, OAuth для pieces, Stripe‑контур) трогать нельзя. Критичные точки: базовые домены, брендинг, платежные планы, инициализация платформы при sign‑up, и deployment‑конфиги (Docker/Helm/Pulumi). Также необходимо перевести UI по умолчанию на RU и локализовать внешние ссылки.

## 2. Ключевые файлы (таблица)
| Категория | Путь | Назначение | Можно менять (ДА/ОСТОРОЖНО/НЕТ) | YFlow action (1-строка) |
|---|---|---|---|---|
| **Брендинг и домены** | packages/shared/src/lib/feedback-url.ts | URL формы обратной связи | ДА | Заменить на feedback.yflow.ru |
| **Брендинг и домены** | packages/shared/src/lib/support-url.ts | URL сообщества/поддержки | ДА | Заменить на community.yflow.ru |
| **Брендинг и домены** | docker-entrypoint.sh | AP_APP_TITLE и AP_FAVICON_URL | ДА | Установить YFlow branding |
| **Брендинг и домены** | .env.example | AP_FRONTEND_URL и AP_TEMPLATES_SOURCE_URL | ДА | Заменить на app.yflow.ru |
| **Брендинг и домены** | docs/docs.json | Навигация и ссылки documentation | ДА | Заменить yflow.com → yflow.ru |
| **UI и локализация** | packages/react-ui/src/i18n.ts | Конфигурация i18next | ОСТОРОЖНО | Сменить fallbackLng на 'ru' |
| **UI и локализация** | packages/react-ui/public/locales/ru/translation.json | Русские переводы UI | ДА | Дополнить YFlow-терминологией |
| **UI и локализация** | packages/react-ui/src/components/show-powered-by.tsx | Компонент "Powered by" | ДА | Заменить на YFlow branding |
| **UI и локализация** | packages/react-ui/src/app/app.tsx | Главный компонент приложения | ОСТОРОЖНО | Добавить YFlow telemetry |
| **Аутентификация** | packages/server/api/src/app/authentication/authentication.controller.ts | sign-up/sign-in endpoints | ДА | Обновить platformId логику |
| **Аутентификация** | packages/server/api/src/app/authentication/authentication.service.ts | Логика аутентификации | ОСТОРОЖНО | Добавить YFlow домены в whitelist |
| **Платформа и пользователи** | packages/server/api/src/app/platform/platform.entity.ts | Сущность Platform | ДА | Добавить YFlow-поля branding |
| **Платформа и пользователи** | packages/server/api/src/app/user/user-entity.ts | Сущность User | ОСТОРОЖНО | Добавить YFlow externalId mapping |
| **Платформа и пользователи** | packages/shared/src/lib/platform/platform.model.ts | Модели Platform и PlatformPlan | ДА | Расширить для YFlow тарифов |
| **Платформа и пользователи** | packages/shared/src/lib/user/user.ts | Модели User и PlatformRole | ОСТОРОЖНО | Добавить YFlow-специфичные роли |
| **База данных** | packages/server/api/src/app/database/database-connection.ts | TypeORM connection и entities | ОСТОРОЖНО | Добавить YFlow миграции |
| **База данных** | packages/server/api/src/app/database/database-common.ts | Общие схемы БД | ОСТОРОЖНО | Расширить для YFlow полей |
| **Redis и очереди** | packages/server/api/src/app/database/redis-connections.ts | Redis connection factory | ОСТОРОЖНО | Настроить YFlow Redis |
| **Платежи и подписки** | packages/shared/src/lib/platform/platform.model.ts | Stripe поля в PlatformPlan | ДА | Добавить YKassa поля |
| **Платежи и подписки** | packages/ee/shared/src (если есть) | Enterprise billing logic | ОСТОРОЖНО | Добавить YKassa provider |
| **Docker и Deploy** | Dockerfile | Многостадийный билд | ОСТОРОЖНО | Обновить branding variables |
| **Docker и Deploy** | docker-compose.yml | Локальные сервисы | ДА | Заменить образы и env |
| **Docker и Deploy** | nginx.react.conf | Nginx конфигурация | ДА | Обновить для app.yflow.ru |
| **Docker и Deploy** | deploy/yflow-helm/ | Helm charts для Kubernetes | ДА | Кастомизировать для YFlow |
| **Docker и Deploy** | deploy/pulumi/ | Pulumi инфраструктура | ДА | Обновить stack names |
| **Engine и исполнение** | packages/engine/src/main.ts | Entry point engine | НЕТ | Не трогать |
| **Engine и исполнение** | packages/server/api/src/app/workers/ | Worker контроллеры | НЕТ | Не трогать |
| **Pieces и интеграции** | packages/pieces/ | Все готовые интеграции | НЕТ | Не трогать OAuth |
| **Pieces и интеграции** | packages/server/api/src/app/pieces/ | Piece metadata和管理 | ОСТОРОЖНО | Можно добавлять RU pieces |
| **AI и credits** | packages/server/api/src/app/ai/ | AI провайдеры и кредиты | ДА | Добавить YFlow AI billing |
| **Analytics и телеметрия** | packages/server/api/src/app/analytics/ | Platform analytics | ОСТОРОЖНО | Обновить для YFlow |
| **API и вебхуки** | packages/server/api/src/app/webhooks/webhook-controller.ts | Вебхук эндпоинты | ОСТОРОЖНО | Обновить домены |
| **Templates и проекты** | packages/server/api/src/app/template/ | Управление шаблонами | ДА | Заменить source URL |
| **Security и OTP** | packages/ee/authentication/otp/ | OTP логика | ОСТОРОЖНО | Обновить для YFlow доменов |
| **Custom domains** | packages/ee/custom-domains/ | Custom domain logic | ДА | Настроить для yflow.ru |
| **Audit logs** | packages/ee/audit-logs/ | Логирование действий | ОСТОРОЖНО | Обновить для YFlow |
| **API Keys** | packages/ee/api-keys/ | Управление API ключами | ОСТОРОЖНО | Обновить для YFlow |
| **SSO и федерация** | packages/shared/src/lib/federated-authn/ | SSO конфигурация | ДА | Добавить YFlow SSO |
| **Миграции БД** | migrations.json | Конфигурация миграций | ОСТОРОЖНО | Добавить YFlow миграции |
| **Environment variables** | tools/scripts/setup-dev.js | Development setup | ДА | Обновить defaults |
| **Package scripts** | package.json | npm scripts и зависимости | ОСТОРОЖНО | Можно добавлять YFlow скрипты |
| **TypeScript конфиг** | tsconfig.base.json | Общая TS конфигурация | НЕТ | Не трогать |
| **Testing** | packages/tests-e2e/ | E2E тесты | ДА | Обновить для YFlow URLs |
| **CI/CD** | .github/workflows/ | GitHub Actions | ДА | Обновить для YFlow deployment |

## 3. User lifecycle (пошагово)
**Лендинг → Signup → Login → Setup → Home → Payment → Access → AI**

1. **Лендинг** 
   - Frontend: `/` (packages/react-ui/src/app/guards/)
   - Backend: `/api/` root
   - Что менять: Заменить все ссылки на yflow.com → yflow.ru, обновить meta и branding

2. **Signup/Регистрация**
   - Frontend: `/sign-up` (authentication forms)
   - Backend: `/api/sign-up` (authentication.controller.ts)
   - Что менять: Обновить platformId логику, добавить YFlow branding в email templates

3. **Login/Вход**
   - Frontend: `/sign-in` (authentication forms)
   - Backend: `/api/sign-in` (authentication.controller.ts)
   - Что менять: Добавить YFlow домен в whitelist, обновить redirect URLs

4. **Setup владельца платформы**
   - Frontend: `/setup` (platform setup)
   - Backend: `/api/platform` (platform.controller.ts)
   - Что менять: Установить YFlow defaults (цвета, логотипы, тарифы)

5. **Home/Дашборд**
   - Frontend: `/` после логина (app.tsx routing)
   - Backend: `/api/projects` (project-controller.ts)
   - Что менять: Обновить branding, telemetry, defaults

6. **Payment/Оплата**
   - Frontend: `/billing` (billing components)
   - Backend: `/api/platform-plan` (platform plan endpoints)
   - Что менять: Добавить YKassa как второй провайдер, обновить вебхуки

7. **Access/Доступ после оплаты**
   - Frontend: Проверка флагов в hooks/flags-hooks.ts
   - Backend: Middleware проверки PlatformPlan
   - Что менять: Обновить логику проверки для YFlow тарифов

8. **AI Builder**
   - Frontend: AI компоненты в features/ai/
   - Backend: `/api/ai` (ai-provider-controller.ts)
   - Что менять: Обновить credit billing для YFlow

## 4. Links map (all occurrences)
- **packages/shared/src/lib/feedback-url.ts:1** — "https://feedback.yflow.com" → заменить на "https://feedback.yflow.ru" (риск: LOW)
- **packages/shared/src/lib/support-url.ts:1** — "https://community.yflow.com" → заменить на "https://community.yflow.ru" (риск: LOW)
- **.env.example:28** — "AP_TEMPLATES_SOURCE_URL="https://cloud.yflow.com/api/v1/flow-templates"" → заменить на "https://app.yflow.ru/api/v1/flow-templates" (риск: MEDIUM)
- **docker-entrypoint.sh:5** — "AP_FAVICON_URL="${AP_FAVICON_URL:-https://cdn.yflow.com/brand/favicon.ico}"" → заменить на YFlow CDN (риск: LOW)
- **docs/docs.json:14,18,24** — GitHub и Pieces ссылки → обновить на YFlow репозитории (риск: MEDIUM)
- **nginx.react.conf:14** — "server_name localhost" → заменить на "app.yflow.ru" для production (риск: MEDIUM)

## 5. DB & Entities
**Файлы подключения:**
- `packages/server/api/src/app/database/database-connection.ts` — TypeORM DataSource с env переменными
- `packages/server/api/src/app/database/database-common.ts` — BaseColumnSchemaPart и общие схемы

**Сущности:**
- **User** (`packages/shared/src/lib/user/user.ts`): platformRole, status, identityId, externalId, platformId
- **Platform** (`packages/shared/src/lib/platform/platform.model.ts`): name, primaryColor, logoIconUrl, fullLogoUrl, favIconUrl, filteredPieceNames
- **PlatformPlan** (`packages/shared/src/lib/platform/platform.model.ts`): plan, includedAiCredits, stripeCustomerId, stripeSubscriptionId, limits (projectsLimit, activeFlowsLimit)
- **UserIdentity** — аутентификационные данные
- **Project** — проекты внутри платформы

**YFlow поля для добавления:**
- Platform: yflowDomain, yflowBrandingConfig
- PlatformPlan: ykassaCustomerId, ykassaSubscriptionId, yflowPlanType
- User: yflowExternalId, yflowRole

## 6. Payments & Subscriptions (flow)
**Где принимаются вебхуки:**
- Stripe вебхуки: `/api/stripe/webhooks` (нужно найти в ee пакетах)
- YKassa вебхуки: потребуется создать `/api/ykassa/webhooks`

**Где update статусов:**
- PlatformPlanService: обновление stripeSubscriptionStatus
- Требуется YKassaService для обновления ykassaSubscriptionStatus

**Как открыть доступ после оплаты:**
1. Вебхук обновляет PlatformPlan.stripeSubscriptionStatus = 'active'
2. Middleware проверяет PlatformPlan.limits и фичи
3. Frontend запрашивает флаги через flags-hooks.ts
4. Доступ открывается на основе PlatformPlan.enabledFeatures

## 7. AI Builder & Credits
**Backend endpoints:**
- `/api/ai/providers` — управление AI провайдерами
- `/api/ai/credits` — проверка и списание кредитов

**Frontend views:**
- `features/ai/` — AI компоненты в UI
- `hooks/flags-hooks.ts` — проверка доступности AI

**Where to check credits:**
- PlatformPlan.includedAiCredits и aiCreditsRemaining
- Middleware в AI endpoints проверяет кредиты перед выполнением

## 8. Docker & Deploy recommendations
**Environment variables:**
```bash
AP_FRONTEND_URL=https://app.yflow.ru
AP_APP_TITLE=YFlow
AP_FAVICON_URL=https://cdn.yflow.ru/favicon.ico
AP_TEMPLATES_SOURCE_URL=https://app.yflow.ru/api/v1/flow-templates
AP_DEFAULT_LOCALE=ru
```

**Compose changes:**
- Заменить image: yflow/yflow:latest → yflow/yflow:latest
- Обновить ports для SSL termination
- Добавить SSL volumes и nginx config

**Nginx recommendation:**
- Обновить server_name на app.yflow.ru
- Добавить SSL сертификаты через certbot
- Настроить proxy headers для YFlow доменов

**Volumes и ports:**
- postgres_data и redis_data оставить без изменений
- Добавить volumes для SSL сертификатов
- Открыть порты 80/443 для nginx

## 9. Docs to read (from docs/), top-list
- `docs/overview/welcome.mdx` — основное введение в продукт
- `docs/install/docker.mdx` — установка через Docker
- `docs/admin-guide/overview.mdx` — руководство администратора
- `docs/admin-guide/guides/sso.mdx` — настройка SSO
- `docs/build-pieces/building-pieces/overview.mdx` — создание интеграций
- `docs/embedding/embed-builder.mdx` — встраивание builder
- `docs/about/i18n.mdx` — интернационализация

## 10. Safe zones & Forbidden zones
**Где писать:**
- `packages/server/api/src/app/` — новые контроллеры и сервисы
- `packages/react-ui/src/features/` — новые UI компоненты
- `packages/shared/src/lib/` — общие модели и утилиты
- `packages/ee/` — enterprise фичи (если лицензия позволяет)
- Миграции БД в `packages/server/api/src/app/database/`

**Чего не трогать:**
- `packages/engine/` — ядро исполнения
- `packages/pieces/` — готовые интеграции и OAuth
- `packages/server/api/src/app/workers/` — worker логика
- TypeORM entity базовые поля в database-common.ts

## 11. Next steps (concrete checklist for devs / noobs)
1. **Клонировать и настроить:** `git clone <repo> && cd Yflow&& cp .env.example .env`
2. **Обновить environment:** Изменить AP_FRONTEND_URL, AP_APP_TITLE, AP_FAVICON_URL в .env
3. **Запустить локально:** `docker-compose up -d` для проверки базовой функциональности
4. **Заменить ссылки:** Обновить feedback-url.ts и support-url.ts на YFlow домены
5. **Обновить брендинг:** Изменить docker-entrypoint.sh для YFlow branding
6. **Добавить миграции:** Создать миграции для YFlow полей в Platform и PlatformPlan
7. **Настроить nginx:** Обновить nginx.react.conf для app.yflow.ru
8. **Тестирование:** Запустить E2E тесты с новыми URL: `npm run test:e2e`
9. **Собрать образ:** `docker build -t yflow/yflow:latest .`
10. **Deploy:** Обновить Helm/Pulumi конфиги для production deployment в YFlow инфраструктуру

## 12. Добавление российских сервисов (CRM, Яндекс, ВК)
**Механика добавления новых интеграций:**
1. **Создание piece:** Использовать CLI `npm run create-piece` для генерации шаблона
2. **Структура piece:** 
   - `src/index.ts` — основной экспорт piece
   - `src/lib/auth.ts` — аутентификация (OAuth2, API Key, etc)
   - `src/lib/triggers/` — триггеры (webhooks, polling)
   - `src/lib/actions/` — действия (API вызовы)
3. **Регистрация:** Добавить в `packages/pieces/` и опубликовать через `npm run publish-piece`
4. **OAuth для российских сервисов:**
   - Яндекс.Disk: OAuth2 через yandex.ru
   - ВКонтакте: OAuth2 через vk.com
   - МойСклад: API Key аутентификация
   - Битрикс24: OAuth2 через bitrix24.ru

**Что нужно для российских сервисов:**
- API документация сервиса
- OAuth приложение (если требуется) в соответствующем сервисе
- Тестовый аккаунт для разработки
- Локализация интерфейсов на русский язык
- Обработка специфичных ошибок российских API

**Пример добавления Яндекс.Disk:**
```bash
npm run create-piece yandex-disk
# Редактировать src/index.ts, src/lib/auth.ts, src/lib/actions/
npm run build-piece
npm run publish-piece-to-api
```
|---|---|---|---|---|
| Branding | packages/server/api/src/app/flags/theme.ts | Дефолтная тема и бренд (название, цвета, логотипы) | ДА | Заменить defaultTheme на брендинг YFlow | 
| Branding | packages/server/api/src/app/ee/helper/appearance-helper.ts | Применение брендинга из платформы | ДА | Проверить, что данные из Platform используются для YFlow | 
| Branding | packages/server/api/src/app/platform/platform.entity.ts | Поля бренда в БД (name, logos, colors) | ДА | Заполнить данными YFlow в БД/seed | 
| Branding | packages/server/api/src/app/platform/platform.service.ts | Создание платформы с дефолтами | ДА | Переопределить дефолты (только данные) | 
| Branding | packages/server/api/src/app/platform/platform.controller.ts | Загрузка бренд‑ассетов | ДА | Использовать для загрузки логотипов YFlow | 
| Branding (UI) | packages/react-ui/src/components/theme-provider.tsx | Применяет тему/заголовок/иконку | ДА | Проверить, что заголовки YFlow корректны | 
| Branding (UI) | packages/react-ui/src/components/ui/full-logo.tsx | UI логотип | ДА | Логотипы YFlow через branding | 
| Branding (UI) | packages/react-ui/src/app/routes/platform/setup/branding/appearance-section.tsx | UI настройки бренда | ДА | Использовать как админ‑панель YFlow | 
| URLs | packages/react-ui/src/lib/api.ts | API_BASE_URL (cloud vs local) | ДА | Заменить cloud URL на app.yflow.ru | 
| URLs | packages/server/shared/src/lib/ap-axios.ts | baseURL https://api.yflow.com | ДА | Перенаправить на YFlow API | 
| URLs | packages/shared/src/lib/support-url.ts | community url | ДА | Заменить на support.yflow.ru | 
| URLs | packages/shared/src/lib/feedback-url.ts | feedback url | ДА | Заменить на feedback.yflow.ru | 
| Auth | packages/react-ui/src/lib/authentication-api.ts | Sign‑up/sign‑in/reset endpoints | ДА | Убедиться, что API_URL указывает на YFlow | 
| Auth | packages/react-ui/src/features/authentication/components/sign-up-form.tsx | UI регистрации | ДА | Тексты/бренд, но без изменения логики | 
| Auth | packages/react-ui/src/features/authentication/components/sign-in-form.tsx | UI входа | ДА | Тексты/бренд, без изменения логики | 
| Auth | packages/server/api/src/app/authentication/authentication.controller.ts | REST маршруты auth | ОСТОРОЖНО | Не ломать; только брендинг/URL | 
| Auth | packages/server/api/src/app/authentication/authentication.service.ts | Создание User/Platform/Project | ОСТОРОЖНО | Сохранять логику, менять дефолты | 
| DB | packages/server/api/src/app/database/postgres-connection.ts | Подключение Postgres + миграции | НЕТ | Только конфиг через env | 
| DB | packages/server/api/src/app/database/redis-connections.ts | Redis коннекты/локи | НЕТ | Только конфиг через env | 
| DB | packages/server/api/src/app/user/user-entity.ts | User entity | ОСТОРОЖНО | Не менять поля без миграций | 
| DB | packages/server/api/src/app/project/project-entity.ts | Project entity | ОСТОРОЖНО | Использовать как есть | 
| DB | packages/server/api/src/app/platform/platform.entity.ts | Platform entity | ОСТОРОЖНО | Поля бренда можно заполнять | 
| DB | packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts | PlatformPlan (подписка) | ОСТОРОЖНО | Добавлять поля для YooKassa как addon | 
| Billing | packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts | Webhook Stripe | ОСТОРОЖНО | Оставить, добавить доп. webhook | 
| Billing | packages/server/api/src/app/ee/platform/platform-plan/stripe-helper.ts | Stripe checkout/portal | ОСТОРОЖНО | Менять только URL домена | 
| Billing | packages/server/api/src/app/ee/platform/platform-plan/platform-plan.service.ts | Обновление лимитов/usage | ОСТОРОЖНО | Тарифы YFlow через план | 
| AI | packages/server/api/src/app/ai/ai-provider-controller.ts | API AI провайдеров | ДА | Использовать для YFlow | 
| AI | packages/server/api/src/app/ai/ai-provider-service.ts | Логика AI | ОСТОРОЖНО | Использовать кредиты YFlow | 
| AI | packages/react-ui/src/app/routes/platform/setup/ai/index.tsx | UI AI setup | ДА | Перевести/бренд | 
| AI | packages/react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx | AI UI, CDN иконки | ДА | Заменить CDN на YFlow | 
| i18n | packages/react-ui/src/i18n.ts | Конфиг i18next | ДА | default язык ru | 
| i18n | packages/shared/src/lib/common/locale.ts | Список локалей | ДА | Убедиться, что ru включен | 
| i18n | packages/react-ui/public/locales/ru/translation.json | Русские переводы | ДА | Обновить тексты YFlow | 
| Docker | Dockerfile | Сборка контейнера | ОСТОРОЖНО | Менять env/домены без логики | 
| Docker | docker-compose.yml | Сервисы app/postgres/redis | ОСТОРОЖНО | Настроить env/ports/volumes | 
| Docker | docker-entrypoint.sh | Миграции/старт | НЕТ | Не менять | 
| Docker | nginx.react.conf | Reverse proxy + cache | ОСТОРОЖНО | Привязать домены/SSL | 
| Deploy | deploy/yflow-helm/values.yaml | Helm values | ОСТОРОЖНО | Указать домены/URL | 
| Deploy | deploy/pulumi/* | Инфра‑скрипты | ОСТОРОЖНО | Изменить домены/секреты | 
| Docs | docs/install/overview.mdx | Установка (overview) | ДА | Для FAQ YFlow | 
| Docs | docs/install/configuration/environment-variables.mdx | Все env vars | ДА | База для YFlow env | 
| Docs | docs/deployment/deployment.mdx | Deploy инструкция | ДА | Переписать под YFlow | 
| Docs | docs/docker/docker.mdx | Docker инструкция | ДА | Переписать под YFlow | 
| Docs | docs/stripe/payment.mdx | Stripe биллинг | ДА | Указать Stripe + YooKassa | 
| Docs | docs/postgres/postgres.mdx | Postgres | ДА | Ссылка для YFlow ops | 
| Docs | docs/redis/redis.mdx | Redis | ДА | Описать обязательность | 
| Docs | docs/about/i18n.mdx | i18n инфо | ДА | Обновить ссылки | 
| Docs | docs/admin-console/appearance.mdx | Настройки бренда | ДА | Использовать для YFlow admin | 
| Docs | docs/admin-console/custom-domain.mdx | Custom domain | ДА | Обновить под YFlow домены | 
| Docs | docs/developers/building-pieces/overview.mdx | Как делать pieces | ДА | Важно для интеграций РФ | 
| Docs | docs/developers/building-pieces/start-building.mdx | Туториал pieces | ДА | База для русских интеграций | 
| Docs | docs/developers/misc/create-new-ai-provider.mdx | Создание AI провайдера | ДА | Включить в YFlow FAQ | 
| Docs | docs/openapi.json | OpenAPI сервера | ОСТОРОЖНО | Обновить server.url на YFlow | 

## 3. User lifecycle (пошагово)
1) **Лендинг**: yflow.ru (маркетинг) → кнопка «Попробовать».
   - Frontend path: внешний сайт (НЕ в репо)
   - Backend: N/A
   - Что менять: домены и CTA на app.yflow.ru
2) **Регистрация**: app.yflow.ru/sign-up
   - Frontend: packages/react-ui/src/features/authentication/components/sign-up-form.tsx
   - Backend: packages/server/api/src/app/authentication/authentication.controller.ts → authentication.service.ts
   - Что менять: branding/тексты, API_BASE_URL
3) **Вход**: app.yflow.ru/sign-in
   - Frontend: packages/react-ui/src/features/authentication/components/sign-in-form.tsx
   - Backend: authentication.controller.ts
   - Что менять: branding/URL
4) **Setup owner** (первая настройка платформы): /platform/setup/*
   - Frontend: packages/react-ui/src/app/routes/platform/setup/branding/appearance-section.tsx, .../setup/ai/index.tsx
   - Backend: platform.controller.ts (обновление платформы), ai-provider-controller.ts
   - Что менять: бренд‑дефолты и ограничения
5) **Home/Builder**: /flows, /templates
   - Frontend: routes в react‑ui (НЕ ПОДТВЕРЖДЕНО точные файлы)
   - Backend: flows controllers (НЕ ПОДТВЕРЖДЕНО точные файлы)
6) **Payment**: переход в billing
   - Frontend: UI (НЕ ПОДТВЕРЖДЕНО конкретный файл)
   - Backend: stripe-helper.ts → создание checkout session
   - Что менять: домены в FRONTEND_URL и тексты
7) **Access**: доступ определяется PlatformPlan
   - Backend: platform-plan.service.ts + platform-plan.entity.ts
   - Что менять: лимиты и тарифы YFlow
8) **AI**: доступ к агентам/AI
   - Frontend: ai-actions-list.tsx (gating), setup/ai
   - Backend: ai-provider-service.ts + platform-plan поля

## 4. Links map (all occurrences)
⚠️ Полный список в коде очень большой (860+ совпадений). Ниже — ключевые хабы. Полный список требует отдельной выгрузки: **НЕ ПОДТВЕРЖДЕНО**.

**Ключевые хабы (подтверждено):**
- packages/react-ui/src/lib/api.ts:15 — "https://cloud.yflow.com" → заменить на https://app.yflow.ru (риск: Средне) @packages/react-ui/src/lib/api.ts#13-17
- packages/server/shared/src/lib/ap-axios.ts:7 — "https://api.yflow.com" → https://api.yflow.ru (риск: Средне) @packages/server/shared/src/lib/ap-axios.ts#6-9
- packages/shared/src/lib/support-url.ts:1 — "https://community.yflow.com" → https://community.yflow.ru (риск: Легко) @packages/shared/src/lib/support-url.ts#1-1
- packages/shared/src/lib/feedback-url.ts:1 — "https://feedback.yflow.com" → https://feedback.yflow.ru (риск: Легко) @packages/shared/src/lib/feedback-url.ts#1-1
- packages/server/api/src/app/flags/theme.ts:69-71 — CDN urls → заменить на cdn.yflow.ru (риск: Легко) @packages/server/api/src/app/flags/theme.ts#66-71
- packages/react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx:32-38 — cdn.yflow.com → cdn.yflow.ru (риск: Легко) @packages/react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx#31-38
- docs/install/overview.mdx:101 — cloud.yflow.com → app.yflow.ru (риск: Легко) @docs/install/overview.mdx#98-102
- docs/install/configuration/environment-variables.mdx:63 — templates source URL → yflow templates (риск: Средне) @docs/install/configuration/environment-variables.mdx#63-64
- docs/openapi.json:21978 — server.url cloud.yflow.com/api → api.yflow.ru (риск: Средне)
- README.md:5, 27, 31, 35, 94, 101, 105, 118, 134, 138 — активные ссылки yflow.com → заменить на YFlow docs (риск: Легко) @README.md#5-38

**Не подтверждено (нужно полное сканирование):**
- packages/pieces/** (много ссылок в примерах)
- docs/embedding/** (cloud.yflow.com)
- docs/developers/** (cloud.yflow.com)
- packages/react-ui/public/locales/*/translation.json (yflow.com в переводах)

## 5. DB & Entities
**Файлы подключения (подтверждено):**
- packages/server/api/src/app/database/postgres-connection.ts — Postgres connection + migrations.
- packages/server/api/src/app/database/redis-connections.ts — Redis connections + distributed lock/store.

**Сущности (ключевые поля для YFlow):**
- User: packages/server/api/src/app/user/user-entity.ts — identityId, platformId, platformRole, status.
- Platform: packages/server/api/src/app/platform/platform.entity.ts — name, primaryColor, logoIconUrl, fullLogoUrl, favIconUrl, plan.
- PlatformPlan: packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts — stripeCustomerId, stripeSubscriptionId, stripeSubscriptionStatus, activeFlowsLimit, includedAiCredits, aiCreditsOverageLimit и др.
- Project: packages/server/api/src/app/project/project-entity.ts — ownerId, platformId.

**Env vars (подтверждено):**
- AP_POSTGRES_* (host, port, database, username, password, ssl) — docs/install/configuration/environment-variables.mdx
- AP_REDIS_* (host, port, url, type, sentinel) — docs/install/configuration/environment-variables.mdx

## 6. Payments & Subscriptions (flow)
**Где принимаются вебхуки:**
- Stripe webhook: packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts

**Где update статусов:**
- stripe-billing.controller.ts → обновляет platform_plan
- platform-plan.service.ts → хранит лимиты и usage

**Как открыть доступ после оплаты (пошагово):**
1) Клиент оплачивает через Stripe checkout (stripe-helper.ts).
2) Stripe присылает webhook (subscription.created/updated/deleted).
3) controller обновляет platform_plan (status, limits, dates).
4) UI/Backend проверяют platform.plan.* → включают/отключают функции.

**Как добавить YooKassa (ADD‑ON, не заменяя Stripe):**
- Добавить YooKassa webhook controller (например yookassa-billing.controller.ts), отдельные env vars (YFLOW_YOOKASSA_*).
- В platform_plan добавить поля yookassaCustomerId, yookassaSubscriptionId, yookassaStatus (через миграции) — не трогать Stripe поля.
- В service добавить метод applyYooKassaSubscriptionUpdate() и общий switch по провайдеру.
- Создать UI Billing toggle (НЕ ПОДТВЕРЖДЕНО, файл в react-ui).

## 7. AI Builder & Credits
- Backend: packages/server/api/src/app/ai/ai-provider-controller.ts + ai-provider-service.ts.
- Frontend: packages/react-ui/src/app/routes/platform/setup/ai/index.tsx, builder AI list: packages/react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx.
- Где проверяются кредиты: platform_plan (includedAiCredits, aiCreditsOverageLimit), gating через flags/hooks. @packages/react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx#50-52

## 8. Docker & Deploy recommendations
**Файлы:**
- Dockerfile, docker-compose.yml, docker-entrypoint.sh, nginx.react.conf
- deploy/yflow-helm/values.yaml, deploy/pulumi/*

**Ключевые env vars (см. docs/install/configuration/environment-variables.mdx):**
- AP_FRONTEND_URL = https://app.yflow.ru
- AP_INTERNAL_URL = https://api.yflow.ru (если используется SSO)
- AP_POSTGRES_* + AP_REDIS_*
- AP_TEMPLATES_SOURCE_URL (шаблоны) → yflow templates
- AP_SMTP_* (брендированные email)

**Псевдо‑snippets (для понимания, без исполнения):**
```env
AP_FRONTEND_URL=https://app.yflow.ru
AP_INTERNAL_URL=https://api.yflow.ru
AP_TEMPLATES_SOURCE_URL=https://app.yflow.ru/api/v1/flow-templates
AP_POSTGRES_HOST=postgres
AP_REDIS_HOST=redis
```
Зачем: корректные webhook URLs, домены UI, источники шаблонов, стабильные подключения DB/Redis.

## 9. Docs to read (from docs/), top-list
- docs/install/overview.mdx — варианты установки (Docker/Compose/Helm).
- docs/install/configuration/environment-variables.mdx — список всех env.
- docs/deployment/deployment.mdx — как деплоить.
- docs/docker/docker.mdx — Docker‑инструкция.
- docs/stripe/payment.mdx — Stripe биллинг.
- docs/redis/redis.mdx — Redis конфигурация.
- docs/postgres/postgres.mdx — Postgres конфигурация.
- docs/admin-console/appearance.mdx — брендирование UI.
- docs/admin-console/custom-domain.mdx — кастом домены.
- docs/developers/building-pieces/overview.mdx — как добавлять pieces (интеграции).
- docs/developers/building-pieces/start-building.mdx — туториал создания pieces.

## 10. Safe zones & Forbidden zones
**Safe zones:**
- packages/react-ui/** (UI/бренд/переводы)
- packages/server/api/src/app/platform/** (бренд/платформа)
- packages/server/api/src/app/ee/platform/platform-plan/** (планы/лимиты)
- docs/** (документация)

**Forbidden zones:**
- packages/engine/** (execution pipeline)
- packages/pieces/** (интеграции и OAuth)
- packages/server/api/src/app/ee/engine/** (если есть)
- Stripe контур (замена на YooKassa запрещена)

## 11. Next steps (concrete checklist for devs / noobs)
1) Установить Node.js + bun (см. package.json scripts).
2) Скопировать .env из шаблона (НЕ ПОДТВЕРЖДЕНО путь) и заполнить AP_*.
3) Запустить docker-compose (postgres + redis).
4) Запустить `npm run dev`.
5) Открыть http://localhost:4200 (React UI).
6) Зайти в /platform/setup/branding и загрузить логотипы.
7) Установить AP_FRONTEND_URL=https://app.yflow.ru.
8) Подключить SMTP (AP_SMTP_*).
9) Проверить Stripe webhook endpoint в prod.
10) Добавить YooKassa webhook как отдельный endpoint (ADD‑ON).

## 12. Как добавлять новые интеграции (Pieces)
- Интеграции реализованы в packages/pieces/** (НЕ ТРОГАТЬ для white‑label, но можно добавлять новые).
- Документация: docs/developers/building-pieces/overview.mdx и start-building.mdx.
- Процесс: создать piece → action/trigger → auth → опубликовать через npm/CLI.
- Для российских сервисов (CRM, Яндекс, VK): добавить новый piece, определить auth (OAuth/API key), добавить triggers/actions и тесты.

---

**Примечание:** Если нужно «полное» покрытие ссылок yflow.com, выполнить отдельный скан/экспорт (НЕ ПОДТВЕРЖДЕНО в текущем документе).
