# YFlow → YflowProduct Map (White‑label)

## 1. Обзор архитектуры (простыми словами)
- **Frontend**: React UI (packages/react-ui). Использует flags/branding для темы и логотипов, обращается к API `/api` через axios. Локализация через i18next.
- **Backend API**: Fastify (packages/server/api). Управляет авторизацией, платформами (multi-tenant), планами и биллингом (Stripe), AI‑провайдерами.
- **Engine**: отдельные пакеты и воркеры (не трогаем).
- **DB**: PostgreSQL через TypeORM. Подключение и миграции в `packages/server/api/src/app/database/postgres-connection.ts`.
- **Redis**: централизованное подключение в `packages/server/api/src/app/database/redis-connections.ts`.

## 2. Карта файлов (таблица)
| Путь | Назначение | Можно ли менять | Для чего в YFlow |
|---|---|---|---|
| `packages/server/api/src/app/flags/theme.ts` | Дефолтный бренд: имя, цвета, логотипы, favicon, CDN‑ссылки | ✅ Да (через платформу/флаги) | Базовые дефолты YFlow вместо Yflow| 
| `packages/server/api/src/app/ee/helper/appearance-helper.ts` | Превращает поля платформы в тему (websiteName, logo, color) | ✅ Да (через данные платформы) | Источник бренд‑данных из БД | 
| `packages/react-ui/src/components/theme-provider.tsx` | Применяет branding (цвета, favicon, title) в UI | ✅ Да (косвенно через flags/THEME) | Отображение бренда YFlow на фронте | 
| `packages/react-ui/src/components/ui/full-logo.tsx` | UI‑компонент логотипа | ✅ Да (через branding) | Логотип YFlow на страницах | 
| `packages/react-ui/src/app/routes/platform/setup/branding/appearance-section.tsx` | Админ‑форма для загрузки логотипов/цвета/названия | ✅ Да | UI для настройки бренда YFlow | 
| `packages/server/api/src/app/platform/platform.entity.ts` | БД‑поля бренда: name, colors, logos | ✅ Да (данные в БД) | Основной storage бренда | 
| `packages/server/api/src/app/platform/platform.service.ts` | Создание платформы с дефолтами бренда | ✅ Да | Стартовые значения бренда YFlow | 
| `packages/server/api/src/app/platform/platform.controller.ts` | Загрузка бренд‑ассетов в файл‑хранилище | ✅ Да | Приём файлов бренда YFlow | 
| `packages/react-ui/src/lib/api.ts` | API base URL и редирект на sign‑in | ✅ Да (для доменов YFlow) | Переключить base URL для app.yflow.ru | 
| `packages/react-ui/src/lib/authentication-api.ts` | Endpoints sign‑up/sign‑in/reset | ✅ Да (URL остаются) | Подтверждение, что регистрация идёт в ваш backend | 
| `packages/server/api/src/app/authentication/authentication.controller.ts` | REST endpoints /v1/authentication/sign-up/sign-in | ✅ Да (логика) | Основной вход в регистрацию/логин | 
| `packages/server/api/src/app/authentication/authentication.service.ts` | Создание пользователя + новой платформы + проекта | ✅ Да (данные) | Формирование tenant для YFlow | 
| `packages/server/api/src/app/database/postgres-connection.ts` | Подключение PostgreSQL + миграции | ❌ Не ломать | Основная БД | 
| `packages/server/api/src/app/database/redis-connections.ts` | Подключение Redis | ❌ Не ломать | Очереди/кэш/локи | 
| `packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts` | Таблица plan + Stripe поля | ✅ Да (данные) | Ключевые поля подписки | 
| `packages/server/api/src/app/ee/platform/platform-plan/platform-plan.service.ts` | Создание плана/usage/лимитов | ✅ Да (данные) | Управление доступом | 
| `packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts` | Stripe webhook → обновление плана | ✅ Да (данные) | Доступ после оплаты | 
| `packages/server/api/src/app/ee/platform/platform-plan/stripe-helper.ts` | Stripe checkout/portal URLs | ✅ Да (заменить URL домена) | Переходы на billing в YFlow | 
| `packages/server/api/src/app/ai/ai-provider-controller.ts` | API для AI‑провайдеров | ✅ Да | Управление AI | 
| `packages/server/api/src/app/ai/ai-provider-service.ts` | Бизнес‑логика AI + кредиты | ✅ Да | Будущая монетизация AI | 
| `packages/react-ui/src/app/routes/platform/setup/ai/index.tsx` | UI для настройки AI‑провайдеров | ✅ Да | Точка управления AI | 
| `packages/react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx` | UI AI/Agents actions | ✅ Да | UI‑точка для платной функции | 
| `packages/react-ui/src/app/components/account-settings/language-toggle.tsx` | UI переключения языка | ✅ Да | Основной язык Русский | 
| `packages/react-ui/src/i18n.ts` | i18n config (fallbackLng, supportedLngs) | ✅ Да | Русский по умолчанию | 
| `packages/shared/src/lib/common/locale.ts` | Список доступных языков | ✅ Да | Добавить/включить ru | 

## 3. User lifecycle (цепочка)
1. **Лендинг**: внешний сайт YFlow (yflow.ru).
2. **Переход** на `app.yflow.ru/sign-up`.
3. **Frontend** отправляет `/v1/authentication/sign-up` через `authenticationApi.signUp` (axios) → backend. @packages/react-ui/src/lib/authentication-api.ts
4. **Backend** `authenticationController` вызывает `authenticationService.signUp`, создаёт:
   - `UserIdentity`
   - `User`
   - **новую Platform** (tenant) и **первый Project** (personal). @packages/server/api/src/app/authentication/authentication.service.ts
5. **Вход**: `/v1/authentication/sign-in` → выдача токена → редирект в app. @packages/server/api/src/app/authentication/authentication.controller.ts
6. **Подписка**: через Stripe checkout, webhook обновляет platform_plan. @packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts
7. **Доступ к функциям** определяется `platform.plan.*` (включая AI/Agents). @packages/shared/src/lib/platform/platform.model.ts

## 4. Payment → Subscription → Access flow
- **Главный источник прав**: **platform_plan** (tenant‑уровень). План + лимиты + Stripe‑поля. @packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts
- **Stripe webhook**:
  - `customer.subscription.created/updated/deleted` обновляет `platform_plan`.
  - При создании подписки выставляет лимиты и `stripeSubscriptionStatus`.
  - При удалении — сбрасывает лимиты до стандартных и очищает Stripe поля. @packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts
- **Что считается активной подпиской**: `stripeSubscriptionStatus` + даты `stripeSubscriptionStartDate/EndDate` в `platform_plan`.
- **Где проверяется доступ**: на уровне планов/фич (flags/features), например `customAppearanceEnabled`, `agentsEnabled`, `includedAiCredits`. @packages/shared/src/lib/platform/platform.model.ts
- **Куда встраивать ЮKassa позже**: отдельный billing‑контур, аналог `stripe-billing.controller.ts` и `stripe-helper.ts`, оставляя Stripe как существующий канал.

## 5. Чеклист white‑label
**Менять обязательно:**
- Дефолтные бренд‑значения (name/логотипы/цвета) и доменные URL. @packages/server/api/src/app/flags/theme.ts
- Бренд‑ассеты платформы (через UI Branding или seed в БД). @packages/react-ui/src/app/routes/platform/setup/branding/appearance-section.tsx
- API base URL/домены для app.yflow.ru. @packages/react-ui/src/lib/api.ts
- Публичные ссылки на yflow.com/docs/blog/community/support. (см. ниже)

**Менять нельзя:**
- Execution engine, Redis‑логика, CDN инфраструктура, OAuth pieces, Stripe‑контур.

**Трогать позже:**
- Планы/ограничения в `platform_plan` под тарифы YFlow.
- AI‑кредиты и доступ (завязать на подписку).

**Не трогать никогда:**
- Core infra, engine, очереди, execution pipeline.

---

# Доп. Анализ (обязательные пункты)

## 1.1 Брендинг
**Где хранится/как работает**
- Дефолтные значения темы/логотипов: `packages/server/api/src/app/flags/theme.ts` (defaultTheme). Тут хранятся `websiteName`, `primaryColor`, `fullLogoUrl`, `favIconUrl`, `logoIconUrl`.
- Применение бренда в UI: `packages/react-ui/src/components/theme-provider.tsx`.
- UI‑компонент логотипа: `packages/react-ui/src/components/ui/full-logo.tsx`.
- Бренд в БД: `packages/server/api/src/app/platform/platform.entity.ts` (name, colors, logo URLs).
- UI для редактирования бренда: `packages/react-ui/src/app/routes/platform/setup/branding/appearance-section.tsx`.

**Можно ли менять**: Да — через данные платформы или дефолтную тему.

**Как менять для YFlow**
1) В БД (platform.* поля) → немедленно отразится в UI. 
2) Дефолтные значения — сменить в `defaultTheme`. 
3) Загрузить логотипы через раздел Branding UI.

## 1.2 URLs и внешние ссылки
**Найденные ссылки yflow**
- `packages/react-ui/src/lib/api.ts` — base URL для cloud: `https://cloud.yflow.com`.
- `packages/server/shared/src/lib/ap-axios.ts` — `https://api.yflow.com`.
- `packages/shared/src/lib/support-url.ts` — `https://community.yflow.com`.
- `packages/shared/src/lib/feedback-url.ts` — `https://feedback.yflow.com`.
- `packages/react-ui/src/lib/request-trial-api.ts` — `https://sales.yflow.com/submit-inapp-contact-form`.
- `packages/react-ui/src/lib/steps-utils.tsx` и `packages/react-ui/src/app/builder/.../ai-actions-list.tsx` — CDN иконки/картинки `cdn.yflow.com`.
- `packages/react-ui/vite.config.ts` — default favicon URL `https://yflow.com/favicon.ico`.
- `tools/scripts/utils/piece-script-utils.ts` — `https://cloud.yflow.com/api/v1`.
- `README.md`, `SECURITY.md` — множество `yflow.com` ссылок.

**Можно заменить?**
- Да: UI/тексты/landing/FAQ/brand‑URLs.
- **Риски**: сервисные URL (api, cloud) в runtime должны совпадать с реальным хостингом YFlow, иначе ломаются запросы и webhooks.

## 1.3 Регистрация / логин / reset password
**Frontend**
- Sign up: `packages/react-ui/src/features/authentication/components/sign-up-form.tsx` → `authenticationApi.signUp` → `/v1/authentication/sign-up`.
- Sign in: `packages/react-ui/src/features/authentication/components/sign-in-form.tsx` → `/v1/authentication/sign-in`.
- Reset password: `packages/react-ui/src/lib/authentication-api.ts` → `/v1/authn/local/reset-password`.
- Verify email: `/v1/authn/local/verify-email`.
- Global API base URL: `packages/react-ui/src/lib/api.ts`.

**Backend**
- Основной контроллер: `packages/server/api/src/app/authentication/authentication.controller.ts`.
- Логика создания пользователя/платформы: `packages/server/api/src/app/authentication/authentication.service.ts`.

**Целевая цепочка YFlow**
`yflow.ru` → `app.yflow.ru/sign-up` → `/v1/authentication/sign-up` → создаётся tenant (platform) в вашей БД.

## 1.4 База данных (PostgreSQL/Redis)
**PostgreSQL**
- Подключение: `packages/server/api/src/app/database/postgres-connection.ts`.
- Основные сущности:
  - User: `packages/server/api/src/app/user/user-entity.ts`
  - Platform (tenant): `packages/server/api/src/app/platform/platform.entity.ts`
  - Project: `packages/server/api/src/app/project/project-entity.ts`
  - PlatformPlan (подписка/лимиты): `packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts`

**Redis**
- Подключение: `packages/server/api/src/app/database/redis-connections.ts`.

**Как создаётся новая платформа**
- В `authentication.service.ts` при sign‑up без platformId: создаётся `User` + `Platform` + `Project`. @packages/server/api/src/app/authentication/authentication.service.ts

**Критичные данные для white‑label**
- `Platform.name`, `primaryColor`, `logoIconUrl`, `fullLogoUrl`, `favIconUrl`.
- `PlatformPlan` (лимиты, Stripe‑поля, AI‑кредиты, feature flags).

## 1.5 Stripe / подписки
**Где логика**
- `stripe-billing.controller.ts` — webhook (create/update/delete subscription).
- `stripe-helper.ts` — checkout/portal URLs, Stripe клиент.
- `platform-plan.service.ts` — запись лимитов и usage.

**Как после оплаты открывается доступ**
- Webhook обновляет `platform_plan` и включает лимиты/AI overage. @packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts

**Что считается активной подпиской**
- `stripeSubscriptionStatus`, `stripeSubscriptionStartDate`, `stripeSubscriptionEndDate` в `platform_plan`. @packages/shared/src/lib/platform/platform.model.ts

**Где проверяется доступ**
- На уровне `platform.plan.*` (например `customAppearanceEnabled`, `agentsEnabled`, `includedAiCredits`). @packages/shared/src/lib/platform/platform.model.ts

## 1.6 AI Builder / Chat Automation
**Backend**
- API: `packages/server/api/src/app/ai/ai-provider-controller.ts`
- Логика: `packages/server/api/src/app/ai/ai-provider-service.ts` (провайдеры, кредиты).

**Frontend**
- Настройка провайдеров: `packages/react-ui/src/app/routes/platform/setup/ai/index.tsx`
- AI/Agents действия в builder: `packages/react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx`
- Компоненты агента: `packages/react-ui/src/features/agents/...`

**Где проверяется доступ**
- Флаги и план (`AGENTS_CONFIGURED`, `platform.plan.*`), gated UI. @packages/react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx

**Лимиты/кредиты**
- `platform_plan.includedAiCredits`, `aiCreditsOverageLimit`, `aiCreditsOverageState`. @packages/shared/src/lib/platform/platform.model.ts

## 1.7 Локализация (i18n)
- Конфиг i18n: `packages/react-ui/src/i18n.ts` (fallbackLng = `en`).
- Список языков: `packages/shared/src/lib/common/locale.ts`.
- UI селектор языка: `packages/react-ui/src/app/components/account-settings/language-toggle.tsx`.
- Папка переводов UI: `packages/react-ui/public/locales/*/translation.json` (есть `ru`).

**Для YFlow**
- Сделать **default language = ru** в `i18n.ts`.
- Добавить `ru` в `LocalesEnum` и `localesMap`, если нужно в UI‑селекторе.

---

## Ключевые риски при white‑label
- Жёстко зашитые домены cloud/api/sales/support/docs — заменить на YFlow.
- Stripe URLs (billing success/cancel) используют `FRONTEND_URL`. Проверить env/домены.
- Логотипы/иконки/AI assets в CDN Yflow— заменить или зеркалировать.
