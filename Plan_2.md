# Plan_2.md — план внедрения white‑label YFlow (читабельно и безопасно)

> Опора: **YFLOW_yflow_PRODUCT_MAP.md** и **YFLOW_yflow_PRODUCT_MAP_2.md**. Цель — пошагово внедрить брендинг/домены/платежи/тарифы/доступы без ломания архитектуры.

## 0) Важные правила (не ломаем архитектуру)
- **Нельзя менять**: `packages/engine/**`, `packages/pieces/**`, OAuth logic для pieces, существующий Stripe‑контур.
- **Можно менять**: UI/брендинг/локализация, домены, тарифные лимиты, расширение биллинга (YooKassa как add‑on).
- **Любые новые поля БД** → только через миграции.

## 1) Карта участвующих файлов (без полного пути)
### Links & Branding
- `react-ui/src/lib/api.ts` — API_BASE_URL (cloud домен)
- `server/shared/src/lib/ap-axios.ts` — internal API base
- `shared/src/lib/support-url.ts`, `shared/src/lib/feedback-url.ts`
- `server/api/src/app/flags/theme.ts` — defaultTheme (логотипы/цвета)
- `react-ui/src/components/theme-provider.tsx`
- `react-ui/src/app/routes/platform/setup/branding/appearance-section.tsx`

### Auth / Registration / Lifecycle
- `react-ui/src/lib/authentication-api.ts`
- `react-ui/src/features/authentication/components/sign-up-form.tsx`
- `react-ui/src/features/authentication/components/sign-in-form.tsx`
- `server/api/src/app/authentication/authentication.controller.ts`
- `server/api/src/app/authentication/authentication.service.ts`

### DB / Entities / Redis
- `server/api/src/app/database/postgres-connection.ts`
- `server/api/src/app/database/redis-connections.ts`
- `server/api/src/app/user/user-entity.ts`
- `server/api/src/app/platform/platform.entity.ts`
- `server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts`
- `server/api/src/app/project/project-entity.ts`

### Payments / Billing / Plans
- `server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts`
- `server/api/src/app/ee/platform/platform-plan/stripe-helper.ts`
- `server/api/src/app/ee/platform/platform-plan/platform-plan.service.ts`
- `shared/src/lib/platform/platform.model.ts`

### AI / Credits
- `server/api/src/app/ai/ai-provider-controller.ts`
- `server/api/src/app/ai/ai-provider-service.ts`
- `react-ui/src/app/routes/platform/setup/ai/index.tsx`
- `react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx`

### Deploy
- `Dockerfile`, `docker-compose.yml`, `docker-entrypoint.sh`, `nginx.react.conf`
- `deploy/yflow-helm/values.yaml`, `deploy/pulumi/*`

---

## 2) Пошаговый план реализации (минимальный риск)

### Шаг 1 — Стабилизировать домены и ссылки (критично)
**Цель:** все ссылки/URL должны указывать на YFlow и не ломать запросы и webhooks.
1. Заменить cloud домен в `react-ui/src/lib/api.ts` → `https://app.yflow.ru`.
2. В `server/shared/src/lib/ap-axios.ts` заменить `https://api.yflow.com` → `https://api.yflow.ru`.
3. В `shared/src/lib/support-url.ts` и `feedback-url.ts` заменить ссылки на домены YFlow.
4. В `server/api/src/app/flags/theme.ts` заменить CDN URLs на YFlow CDN.
5. Проверить docs/ и README (для документации), но **не обязательно** для запуска.

**Логика взаимодействия:** UI → `API_BASE_URL` → Backend. Любая ошибка домена ломает auth, billing и webhooks.

### Шаг 2 — Брендинг (без влияния на логику)
**Цель:** чтобы пользователь видел YFlow, но логика не менялась.
1. В `flags/theme.ts` обновить `defaultTheme` (цвет, имя, логотипы).
2. В UI через `appearance-section.tsx` загрузить логотипы в админке.
3. Проверить отображение через `theme-provider.tsx`.

**Логика взаимодействия:** платформа хранит бренд в DB → theme provider применяет в UI.

### Шаг 3 — Проверка auth‑цепочки и регистрации
**Цель:** signup/signin пишут в вашу БД и корректно создают tenant.
1. Убедиться, что `authentication-api.ts` использует `API_URL` из `api.ts`.
2. Проверить `authentication.controller.ts` и `authentication.service.ts`:
   - При signup создаётся **User + Platform + Project**.
3. Убедиться, что домены корректны (редиректы `/sign-in`, `/sign-up`).

**Логика взаимодействия:** Frontend → `/v1/authentication/*` → creates User/Platform/Project → токен → UI.

### Шаг 4 — DB и Redis (без изменения схемы)
**Цель:** не поломать подключение и миграции.
1. Проверь env vars (AP_POSTGRES_*, AP_REDIS_*).
2. Не менять сущности без миграций.
3. Redis используется для locks/queues — не отключать.

**Логика взаимодействия:** API использует Postgres для данных и Redis для кэша/очередей.

### Шаг 5 — Платежи Stripe (сохранить как основное)
**Цель:** не ломать Stripe и правильно открыть доступ после оплаты.
1. В `stripe-helper.ts` убедиться, что `FRONTEND_URL` указывает на app.yflow.ru.
2. В `stripe-billing.controller.ts` webhook обновляет `platform_plan`.
3. В `platform-plan.service.ts` используются лимиты → доступ.

**Логика взаимодействия:** Stripe webhook → обновление `platform_plan` → доступ в UI/Backend.

### Шаг 6 — Добавление YooKassa как add‑on
**Цель:** подключить второй провайдер, не заменяя Stripe.
1. Создать новый controller (например `yookassa-billing.controller.ts`).
2. Добавить поля в `platform-plan.entity.ts` через миграцию:
   - `yookassaCustomerId`, `yookassaSubscriptionId`, `yookassaStatus`, `yookassaPeriodStart/End`.
3. Добавить сервис‑метод `applyYooKassaSubscriptionUpdate()` в `platform-plan.service.ts`.
4. В UI добавить выбор провайдера биллинга (НЕ ПОДТВЕРЖДЕНО точный файл UI).

**Логика взаимодействия:** YooKassa webhook → те же поля platform_plan → флаги доступа.

### Шаг 7 — Тарифы и доступы
**Цель:** правильно блокировать/разблокировать функции.
1. В `platform-plan.service.ts` настроить лимиты (activeFlowsLimit, aiCredits).
2. Проверить `platform.model.ts` — поля `customAppearanceEnabled`, `agentsEnabled`, `includedAiCredits`.
3. В UI убедиться, что gating по плану работает (AI, branding, pro функции).

**Логика взаимодействия:** platform_plan → shared модель → UI gating + backend ограничения.

### Шаг 8 — Локализация
**Цель:** дефолт русский язык.
1. В `react-ui/src/i18n.ts` поставить `fallbackLng = 'ru'`.
2. Проверить `locales/ru/translation.json`.

### Шаг 9 — Deploy/ENV
**Цель:** стабильный прод и рабочие вебхуки.
1. В `docker-compose.yml` убедиться, что env file содержит AP_FRONTEND_URL и AP_INTERNAL_URL.
2. В nginx/helm/pulumi настроить домены YFlow.
3. Проверить, что HTTPS используется для webhooks.

---

## 3) Критичные узлы и их взаимодействие (чтобы не сломать)
- **Auth цепочка:** sign‑up → authentication.service → User + Platform + Project → UI.
- **Billing:** Stripe/YooKassa webhook → platform_plan → доступ к фичам.
- **UI gating:** `platform_plan` → shared model → UI скрывает/открывает функции.
- **DB:** Postgres хранит все ключевые сущности; Redis обязателен для jobs/locks.

---

## 4) Минимальный checklist для новичка (безопасно)
1. Настроить домены (api.ts, ap-axios.ts, support/feedback URLs).
2. Обновить `defaultTheme` + загрузить логотипы через UI.
3. Убедиться, что signup создает платформу (auth service).
4. Поднять Postgres + Redis.
5. Проверить Stripe webhook → план → доступ.
6. Добавить YooKassa как отдельный webhook.
7. Настроить тарифы (platform-plan.service.ts).
8. Проверить AI gating.
9. Перевести UI на RU.
10. Проверить deploy/env.

---

## 5) Подсказки для одного разработчика
- Делай изменения **маленькими шагами** и проверяй после каждого.
- Не меняй core/engine/pieces.
- Сохраняй Stripe, добавляй YooKassa рядом.
- Всегда тестируй: signup → login → payment → доступ к фичам.
