# YFLOW_PLAN_1 — White Label Yflow→ YFlow (пошагово для новичка)

## 0) Что ты получишь в конце (критерий успеха)

Если ты сделаешь все шаги по этому плану:

- **[UI]** Ты **нигде** не увидишь слова/логотипы/ссылки `yflow`.
- **[Оплата]** Пользователь **нигде в интерфейсе** не увидит `Stripe`.
- **[Оплата]** Оплатить можно **только российскими методами**: **YooKassa + СБП**.
- **[Архитектура]** Проект будет работать как **самостоятельный SaaS** (не зависит от YflowCloud), на твоих доменах и твоей БД.

Важно: в репозитории есть **два разных “Stripe”**:

- **[Stripe как интеграция]** `packages/pieces/community/stripe/...` — это “кусок-интеграция” для пользовательских сценариев (как Zapier/n8n ноды).
- **[Stripe как биллинг SaaS]** `packages/server/api/src/app/ee/platform/platform-plan/...` + `packages/react-ui/src/features/billing/...` — это оплата подписки самой платформы.

В этом проекте по требованию:

- **[Stripe-интеграция]** можно оставить (она не про оплату YFlow).
- **[Stripe-биллинг]** остается в коде, но **UI должен перестать его показывать** и основным провайдером оплаты станет **YooKassa**.

---

## 1) Минимальные понятия (без лишней теории)

### Что такое frontend и backend (очень просто)

- **[Frontend]** это “лицо” продукта: страницы, кнопки, формы. Здесь это React-приложение.
- **[Backend]** это “мозг”: API, логика пользователей, проекты, биллинг, безопасность.
- **[Engine]** отдельный сервис, который исполняет “флоу” (автоматизации) на сервере.

### Как устроен монорепозиторий Yflow(реальная структура)

Основные пакеты в этом репо:

- **[Frontend]** `packages/react-ui/`
- **[Backend API]** `packages/server/api/`
  - точка входа сборки/запуска: `packages/server/api/src/main.ts` (указано в `packages/server/api/project.json`)
  - основной модуль приложения (регистрация модулей/роутов): `packages/server/api/src/app/app.ts`
- **[Engine]** `packages/engine/`
- **[Pieces (интеграции)]** `packages/pieces/` (community/custom)
- **[Shared модели/типы]** `packages/shared/` и `packages/ee/shared/`

Как запускают локально (из `package.json` в корне):

- **[Frontend]** `npm run serve:frontend` (это `nx serve react-ui`)
- **[Backend]** `npm run serve:backend` (это `nx serve server-api`)
- **[Engine]** `npm run serve:engine` (это `nx serve engine`)
- **[Все вместе]** `npm run dev`

---

## 2) Главные “точки правды”, которые нельзя перепутать

### Где задаются домены и URL

- **[Ключевой ENV]** `AP_FRONTEND_URL` — используется для редиректов и вебхуков.
  - Документация: `docs/install/configuration/environment-variables.mdx`
  - В backend логах он явно используется (подсказка): `packages/server/api/src/app/app.ts` (в `appPostBoot` говорится про `AP_FRONTEND_URL`).

### Где сейчас “зашит” YflowCloud (и почему это важно для white label)

В backend есть **жестко заданные ссылки на cloud.yflow.com**:

- **[OpenAPI/Swagger servers]** `packages/server/api/src/app/app.ts`
  - `url: 'https://cloud.yflow.com/api'`
  - `info.title: 'YflowDocumentation'`
  - `externalDocs.url: 'https://www.yflow.com/docs'`

Это нужно будет заменить на домены YFlow, иначе:

- в swagger/openapi будут ссылки на yflow
- часть документации/переходов будет вести “не туда”

---

# ЭТАП 1 — Понимание проекта (1 неделя)

Цель недели: ты понимаешь “что где лежит” и умеешь безопасно вносить изменения, не ломая систему.

## 1.1. Карта сервисов (что запускается)

- **[Frontend]** `packages/react-ui/`
- **[Backend API]** `packages/server/api/`
- **[Engine]** `packages/engine/`

### Чек-лист

- **[Запуск]** Ты можешь запустить `react-ui`, `server-api`, `engine`.
- **[Понимание]** Ты понимаешь, что UI ходит в backend по API, а engine исполняет флоу.

### Типичные ошибки новичков

- **[Ошибка]** Править “бренд” в одном месте и думать, что всё готово.
  - **[Почему]** в проекте есть тексты в UI, env, документации, и даже жестко заданные URL в backend.

## 1.2. Где белый лейбл делается реально

### Frontend файлы, которые почти всегда участвуют

- **[HTML вход]** `packages/react-ui/index.html`
- **[Сборка/ENV]** `packages/react-ui/vite.config.ts`
- **[Логотип-компонент]** `packages/react-ui/src/components/ui/full-logo.tsx`
- **[Переводы/тексты]** `packages/react-ui/public/locales/*/translation.json`

### Backend файлы, которые почти всегда участвуют

- **[Регистрация модулей и swagger/openapi]** `packages/server/api/src/app/app.ts`

### Документация (важная для ENV/деплоя)

- **[ENV переменные]** `docs/install/configuration/environment-variables.mdx`

---

# ЭТАП 2 — Frontend White Label (1 неделя)

Цель недели: пользователь видит только YFlow, ни одного yflow, ни одной ссылки на старые домены, и в UI нет Stripe.

## 2.1. Брендинг: название вкладки и favicon

В документации уже есть важные переменные:

- **[Название вкладки]** `AP_APP_TITLE` (в docs: `docs/install/configuration/environment-variables.mdx`) — дефолт `yflow`
- **[Favicon URL]** `AP_FAVICON_URL` (в docs: `docs/install/configuration/environment-variables.mdx`) — дефолт `https://cdn.yflow.com/brand/favicon.ico`

### Что сделать

- **[Сделать]** поменять `AP_APP_TITLE` на `YFlow`
- **[Сделать]** поменять `AP_FAVICON_URL` на твой YFlow favicon (можно временно на свой CDN/статический файл)

### Что нельзя делать

- **[Нельзя]** менять это “на глаз” только в UI-строках. Правильный путь — через ENV, чтобы при деплое работало стабильно.

## 2.2. Логотипы и графика

- **[Лого в UI]** `packages/react-ui/src/components/ui/full-logo.tsx`

### Что сделать

- **[Сделать]** заменить визуал (SVG/текст) на YFlow.

### Типичные ошибки новичков

- **[Ошибка]** заменить логотип только на одной странице.
  - **[Почему]** логотип часто используется в нескольких layout/хедерах.

## 2.3. Полное удаление Stripe из UI (но не из кода)

В UI есть отдельный модуль биллинга:

- **[UI Billing API]** `packages/react-ui/src/features/billing/lib/api.ts`
  - вызывает: `/v1/platform-billing/info`, `/portal`, `/create-checkout-session` и др.
- **[UI Billing Hooks]** `packages/react-ui/src/features/billing/lib/billing-hooks.ts`
  - открывает checkout URL в новом окне
- **[UI отображение суммы]** `packages/react-ui/src/features/billing/components/subscription-info.tsx`
  - сейчас показывает `$... /month`

### Что сделать (целевое поведение)

- **[Сделать]** UI должен показывать **только YooKassa/СБП**, рубли и твои тарифы.
- **[Сделать]** любые кнопки/страницы, которые ведут на Stripe checkout/portal — убрать из UI-роутинга или скрыть.
- **[Сделать]** даже если backend Stripe-эндпоинты остаются, UI **не должен их дергать**.

### Что нельзя делать

- **[Нельзя]** удалять Stripe-бэкенд код “в ноль” (по требованиям).

---

# ЭТАП 3 — Backend, БД, безопасность (1 неделя)

Цель недели: backend не тянет YflowCloud ссылки/зависимости, домены твои, миграции безопасные.

## 3.1. Главная точка входа backend

- **[App setup]** `packages/server/api/src/app/app.ts`

Что важно:

- **[Swagger/OpenAPI]** тут зашит `https://cloud.yflow.com/api` и `YflowDocumentation` — нужно заменить.
- **[Edition]** приложение работает в режимах: `cloud`, `ee`, `ce` (см. переключение по `ApEdition` в `app.ts`).

## 3.2. Где проверяются ENV и безопасность

Найдено по поиску (нужно открыть и зафиксировать в плане):

- **[ENV validator]** `packages/server/api/src/app/helper/system-validator.ts`
- **[System props]** `packages/server/shared/src/lib/system-props.ts`

(Дальше в этом документе я перечислю конкретные переменные, которые влияют на домены, оплату, безопасность.)

## 3.3. База данных и миграции (как менять безопасно)

Миграции лежат в backend:

- **[Postgres migrations]** `packages/server/api/src/app/database/migration/postgres/`
- **[Sqlite migrations]** `packages/server/api/src/app/database/migration/sqlite/`

Команды для миграций уже есть в NX:

- **[Генерация миграции]** `nx db-migration server-api --name=<DESCRIPTIVE_NAME>`
  - см. `packages/server/api/project.json` (`db-migration`)
- **[Проверка что нет изменений без миграций]** `packages/server/api/project.json` (`check-migrations`)

### Правило безопасности

- **[Правило]** любые изменения схемы БД делай **только через миграции**, иначе CI/проверки будут ругаться и можно сломать прод.

---

# ЭТАП 4 — Оплата, домены, продакшен (1 неделя)

Цель недели: Stripe скрыт, YooKassa+СБП работает, тарифы в рублях, деплой на `app.yflow.ru`, лендинг на `yflow.ru`.

## 4.1. Где сейчас реализован Stripe-биллинг (backend)

Ключевые файлы Stripe-биллинга:

- **[Webhook]** `packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts`
  - endpoint: `POST /stripe/webhook`
  - использует `STRIPE_WEBHOOK_SECRET`
- **[Stripe helper]** `packages/server/api/src/app/ee/platform/platform-plan/stripe-helper.ts`
  - `return_url: 'https://cloud.yflow.com/platform/billing'` (надо заменить, если вообще останется portal)
  - `success_url/cancel_url` строятся от `FRONTEND_URL`
- **[Plan service / лимиты / расчет суммы]** `packages/server/api/src/app/ee/platform/platform-plan/platform-plan.service.ts`
- **[Price IDs map]** `packages/ee/shared/src/lib/billing/index.ts`
  - там **жестко зашиты** `price_...` для dev/prod

### Важно (для новичка)

- **[Смысл]** платный план и лимиты привязаны к `platformId`.
- **[Смысл]** ограничения типа `activeFlowsLimit` проверяются в backend (пример: `checkActiveFlowsExceededLimit` в `platform-plan.service.ts`).

## 4.2. Что именно нужно изменить под YooKassa + СБП

### Целевая архитектура (простыми словами)

Тебе нужно повторить “скелет” Stripe-биллинга, но для YooKassa:

- **[Создать]** контроллер для создания счета/платежа (аналог `/create-checkout-session`)
- **[Создать]** webhook обработчик статуса платежа
- **[Хранить]** тариф/подписку/лимиты в БД так же надежно, как сейчас делает Stripe логика

### Нельзя

- **[Нельзя]** сделать оплату “только на фронте”. Оплата всегда подтверждается сервером через webhook.

## 4.3. Домены и редиректы

Требуемая схема:

- **[Лендинг]** `https://yflow.ru`
- **[Приложение]** `https://app.yflow.ru`

ENV, который обязательно выставить правильно:

- **[Критично]** `AP_FRONTEND_URL=https://app.yflow.ru` (иначе webhooks/редиректы будут неверные)

---

## Список документов, которые точно понадобятся (на основе текущего аудита)

- **[ENV переменные]** `docs/install/configuration/environment-variables.mdx`

(Этот список будет расширен после полного чтения всех файлов в `docs/`.)

---

## Текущее состояние документа

Этот файл создан как “единый маршрут”. Я продолжаю:

- полный аудит `docs/` (все файлы)
- вычленение всех hardcoded доменов/URL/бренда
- точную карту UI-страниц биллинга и где скрывать Stripe
- план внедрения YooKassa+СБП с привязкой: тариф → лимит → feature → UI → backend → миграции
