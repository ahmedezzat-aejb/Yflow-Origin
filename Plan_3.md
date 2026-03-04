# План реализации YFlow White-Label на базе yflow

## 🎯 Общая цель
Создать white-Label версию Yflowпод брендом YFlow с сохранением архитектуры, заменой брендинга, URL, добавлением поддержки YooKassa и полным переводом на русский язык.

---

## 📋 Ключевые принципы

### ✅ Что можно менять
- UI/брендинг (логотипы, цвета, названия)
- URL и домены (cloud → app.yflow.ru)
- Тарифы и лимиты в PlatformPlan
- Переводы и локализация
- Env переменные и конфигурация

### ⚠️ Что менять осторожно
- Entity поля (только через миграции)
- Auth логику (сохранять flow)
- Database connection (только env)

### 🚫 Что нельзя трогать
- Engine и execution pipeline
- OAuth для pieces
- Core инфраструктуру Redis
- Базовую архитектуру multi-tenant

---

## 🗂️ Файлы для работы (сгруппировано по задачам)

### 1. Брендинг и внешний вид
```
packages/server/api/src/app/flags/theme.ts
packages/server/api/src/app/ee/helper/appearance-helper.ts
packages/server/api/src/app/platform/platform.entity.ts
packages/server/api/src/app/platform/platform.service.ts
packages/server/api/src/app/platform/platform.controller.ts
packages/react-ui/src/components/theme-provider.tsx
packages/react-ui/src/components/ui/full-logo.tsx
packages/react-ui/src/app/routes/platform/setup/branding/appearance-section.tsx
```

### 2. URL и домены
```
packages/react-ui/src/lib/api.ts
packages/server/shared/src/lib/ap-axios.ts
packages/shared/src/lib/support-url.ts
packages/shared/src/lib/feedback-url.ts
packages/react-ui/src/lib/authentication-api.ts
```

### 3. Аутентификация
```
packages/react-ui/src/features/authentication/components/sign-up-form.tsx
packages/react-ui/src/features/authentication/components/sign-in-form.tsx
packages/server/api/src/app/authentication/authentication.controller.ts
packages/server/api/src/app/authentication/authentication.service.ts
```

### 4. База данных и сущности
```
packages/server/api/src/app/database/postgres-connection.ts
packages/server/api/src/app/database/redis-connections.ts
packages/server/api/src/app/user/user-entity.ts
packages/server/api/src/app/project/project-entity.ts
packages/server/api/src/app/platform/platform.entity.ts
packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts
```

### 5. Оплаты и тарифы
```
packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts
packages/server/api/src/app/ee/platform/platform-plan/stripe-helper.ts
packages/server/api/src/app/ee/platform/platform-plan/platform-plan.service.ts
```

### 6. AI и кредиты
```
packages/server/api/src/app/ai/ai-provider-controller.ts
packages/server/api/src/app/ai/ai-provider-service.ts
packages/react-ui/src/app/routes/platform/setup/ai/index.tsx
packages/react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx
```

### 7. Локализация
```
packages/react-ui/src/i18n.ts
packages/shared/src/lib/common/locale.ts
packages/react-ui/public/locales/ru/translation.json
```

### 8. Docker и Deploy
```
Dockerfile
docker-compose.yml
docker-entrypoint.sh
nginx.react.conf
deploy/yflow-helm/values.yaml
deploy/pulumi/*
```

---

## 🚀 Пошаговый план реализации

### Этап 1: Подготовка окружения (1-2 дня)

#### Шаг 1.1: Настройка development окружения
1. Установить Node.js + bun (согласно package.json)
2. Скопировать `.env.example` в `.env` и заполнить базовые переменные:
   ```env
   AP_FRONTEND_URL=https://app.yflow.ru
   AP_INTERNAL_URL=https://api.yflow.ru
   AP_POSTGRES_HOST=localhost
   AP_REDIS_HOST=localhost
   ```
3. Запустить `docker-compose up -d postgres redis`
4. Запустить `npm run dev` для проверки работоспособности

#### Шаг 1.2: Изучение архитектуры
1. Изучить структуру БД через pgAdmin
2. Понять flow регистрации пользователя
3. Разобраться с системой платформ (multi-tenant)

### Этап 2: Брендинг и базовая замена URL (3-4 дня)

#### Шаг 2.1: Замена дефолтного бренда
1. **theme.ts**: Заменить `defaultTheme` на YFlow значения:
   ```typescript
   websiteName: "YFlow"
   primaryColor: "#3B82F6" // синий цвет YFlow
   fullLogoUrl: "https://cdn.yflow.ru/logo-full.svg"
   favIconUrl: "https://cdn.yflow.ru/favicon.ico"
   logoIconUrl: "https://cdn.yflow.ru/logo-icon.svg"
   ```

2. **platform.service.ts**: Обновить дефолтные значения при создании платформы

#### Шаг 2.2: Замена ключевых URL
1. **api.ts**: Заменить `https://cloud.yflow.com` → `https://app.yflow.ru`
2. **ap-axios.ts**: Заменить `https://api.yflow.com` → `https://api.yflow.ru`
3. **support-url.ts**: Заменить на `https://community.yflow.ru`
4. **feedback-url.ts**: Заменить на `https://feedback.yflow.ru`

#### Шаг 2.3: Обновление UI компонентов
1. **theme-provider.tsx**: Проверить применение бренда
2. **full-logo.tsx**: Убедиться что используется брендинг из темы
3. **appearance-section.tsx**: Проверить работу загрузки логотипов

### Этап 3: Аутентификация и регистрация (2-3 дня)

#### Шаг 3.1: Настройка flow регистрации
1. **authentication.service.ts**: Проверить логику создания User + Platform + Project
2. **authentication.controller.ts**: Убедиться в корректной работе endpoints
3. **sign-up-form.tsx**: Обновить тексты и брендинг (без изменения логики)

#### Шаг 3.2: Тестирование регистрации
1. Зарегистрировать тестового пользователя
2. Проверить создание платформы в БД
3. Убедиться что применяются дефолтные значения YFlow

### Этап 4: Тарифы и оплата (4-5 дней)

#### Шаг 4.1: Настройка тарифов YFlow
1. **platform-plan.entity.ts**: Изучить существующие поля
2. Создать миграцию для добавления YooKassa полей (если нужно):
   ```sql
   ALTER TABLE platform_plan ADD COLUMN yookassa_customer_id VARCHAR;
   ALTER TABLE platform_plan ADD COLUMN yookassa_subscription_id VARCHAR;
   ALTER TABLE platform_plan ADD COLUMN yookassa_status VARCHAR;
   ```

#### Шаг 4.2: Настройка Stripe (оставить как есть)
1. **stripe-billing.controller.ts**: Изучить webhook обработку
2. **stripe-helper.ts**: Заменить домены в success/cancel URL
3. **platform-plan.service.ts**: Настроить лимиты для тарифов YFlow

#### Шаг 4.3: Подготовка к YooKassa (ADD-ON)
1. Создать новый файл `yookassa-billing.controller.ts` по аналогии со Stripe
2. Добавить env переменные: `YFLOW_YOOKASSA_*`
3. В `platform-plan.service.ts` добавить метод `applyYooKassaSubscriptionUpdate()`

### Этап 5: AI и кредиты (2-3 дня)

#### Шаг 5.1: Настройка AI провайдеров
1. **ai-provider-service.ts**: Изучить логику кредитов
2. **ai-provider-controller.ts**: Проверить API endpoints
3. **setup/ai/index.tsx**: Обновить UI под бренд YFlow

#### Шаг 5.2: Интеграция AI с тарифами
1. **ai-actions-list.tsx**: Проверить gating по тарифам
2. Убедиться что `platform.plan.includedAiCredits` работает
3. Настроить `aiCreditsOverageLimit` для разных тарифов

### Этап 6: Локализация (2-3 дня)

#### Шаг 6.1: Настройка русского языка по умолчанию
1. **i18n.ts**: Изменить `fallbackLng: 'ru'`, `lng: 'ru'`
2. **locale.ts**: Убедиться что `ru` в списке поддерживаемых
3. **language-toggle.tsx**: Проверить работу переключателя

#### Шаг 6.2: Обновление переводов
1. **translation.json**: Обновить все тексты под YFlow
2. Заменить упоминания Yflowна YFlow
3. Добавить переводы для новых функций (YooKassa)

### Этап 7: Подготовка к продакшену (3-4 дня)

#### Шаг 7.1: Docker конфигурация
1. **docker-compose.yml**: Настроить volumes и env
2. **Dockerfile**: Проверить сборку приложения
3. **nginx.react.conf**: Настроить reverse proxy для app.yflow.ru

#### Шаг 7.2: Deploy конфигурация
1. **values.yaml**: Обновить домены и URL
2. **pulumi/**: Настроить инфраструктуру под YFlow
3. Настроить SSL сертификаты для доменов

#### Шаг 7.3: Env переменные для продакшена
```env
AP_FRONTEND_URL=https://app.yflow.ru
AP_INTERNAL_URL=https://api.yflow.ru
AP_POSTGRES_HOST=postgres-prod
AP_REDIS_HOST=redis-prod
AP_TEMPLATES_SOURCE_URL=https://app.yflow.ru/api/v1/flow-templates
AP_SMTP_HOST=smtp.yflow.ru
AP_SMTP_FROM=noreply@yflow.ru
STRIPE_WEBHOOK_SECRET=your_stripe_secret
YFLOW_YOOKASSA_SECRET_KEY=your_yookassa_secret
```

---

## 🔗 Важные связи между файлами

### Flow регистрации пользователя
```
sign-up-form.tsx → authentication-api.ts → authentication.controller.ts → authentication.service.ts
```
**Критично:** Не нарушать создание User + Platform + Project

### Flow оплаты и доступа
```
stripe-helper.ts → Stripe → stripe-billing.controller.ts → platform-plan.service.ts → platform-plan.entity.ts
```
**Критично:** Webhook должен корректно обновлять статус подписки

### Flow применения бренда
```
theme.ts → appearance-helper.ts → theme-provider.tsx → UI компоненты
```
**Критично:** Дефолтные значения должны применяться при создании платформы

### Flow проверки доступа к AI
```
ai-actions-list.tsx → platform.plan.* → ai-provider-service.ts
```
**Критично:** Проверка кредитов и тарифов должна работать

---

## ⚠️ Риски и как их избежать

### Риск 1: Сломать регистрацию
**Решение:** Не менять логику в `authentication.service.ts`, только дефолтные значения

### Риск 2: Потерять доступ после оплаты
**Решение:** Тестировать webhook обработку, проверять обновление `platform_plan`

### Риск 3: Некорректные URL
**Решение:** Проверить все домены в env переменных и hardcoded URL

### Риск 4: Проблемы с БД
**Решение:** Все изменения entity только через миграции, тестировать на dev

---

## 🧪 Тестирование после каждого этапа

### После Этапа 2 (Брендинг)
- Проверить отображение логотипов и цветов
- Убедиться что все URL ведут на yflow.ru

### После Этапа 3 (Аутентификация)
- Зарегистрироваться и войти
- Проверить создание платформы в БД

### После Этапа 4 (Оплата)
- Создать тестовую подписку через Stripe
- Проверить что доступ открывается после оплаты

### После Этапа 6 (Локализация)
- Убедиться что русский язык по умолчанию
- Проверить все переводы в UI

---

## 📚 Документация для изучения

Обязательные документы из `docs/`:
- `docs/install/overview.mdx` - варианты установки
- `docs/install/configuration/environment-variables.mdx` - все env переменные
- `docs/deployment/deployment.mdx` - деплоймент
- `docs/stripe/payment.mdx` - Stripe биллинг
- `docs/admin-console/appearance.mdx` - брендирование
- `docs/developers/building-pieces/overview.mdx` - создание интеграций

---

## 🎯 Финальная проверка

Перед продакшеном проверить:
1. [ ] Все URL ведут на домены YFlow
2. [ ] Брендинг применяется корректно
3. [ ] Регистрация создает платформу с YFlow настройками
4. [ ] Оплата через Stripe открывает доступ
5. [ ] AI функции работают с кредитами
6. [ ] Русский язык по умолчанию
7. [ ] Webhook endpoints доступны извне
8. [ ] Бэкапы БД настроены

---

## 🔄 Поддержка и развитие

После основного релиза:
1. Добавить YooKassa как дополнительный платежный метод
2. Создать российские интеграции (pieces)
3. Настроить мониторинг и алерты
4. Добавить продвинутые тарифы YFlow

---

**Важно:** Этот план рассчитан на пошаговую реализацию с минимальным опытом. Каждый этап можно тестировать отдельно, что снижает риски и позволяет быстро находить проблемы.
