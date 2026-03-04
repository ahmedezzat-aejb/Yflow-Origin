# YFLOW_PLAN_1.md - Полный план White Label Yflow→ YFlow

## 🎯 ЦЕЛЬ ПРОЕКТА

Этот документ создан для **абсолютного новичка** (0 знаний в программировании), чтобы за **3-4 недели** полностью переделать Yflowв White Label продукт **YFlow** с заменой всех доменов, бренда, платежей и созданием российских интеграций.

---

## 📚 ЧТО НУЖНО ЗНАТЬ (МИНИМУМ ДЛЯ НАЧАЛА)

### Что такое Frontend и Backend простыми словами
- **Frontend** = то что видит пользователь в браузере (кнопки, меню, цвета)
- **Backend** = то что работает на сервере (база данных, логика, API)
- **API** = как frontend общается с backend

### Что такое SaaS и Multi-tenant
- **SaaS** = программа в интернете, которую используют много клиентов
- **Multi-tenant** = каждый клиент имеет свою изолированную область (платформу)

### Что такое монорепозиторий
- **Монорепозиторий** = одна папка с несколькими проектами (frontend, backend, shared)

---

## 🏗️ АРХИТЕКТУРА Yflow(КАК ЭТО УСТРОЕНО)

```
yflow/
├── packages/
│   ├── react-ui/          # Frontend (React)
│   ├── server/api/         # Backend (Fastify)
│   ├── shared/            # Общие типы и модели
│   ├── engine/            # Исполнение потоков (НЕ ТРОГАТЬ)
│   └── pieces/           # Интеграции (OAuth, API)
├── docs/                # Документация
└── deploy/              # Деплоймент (Docker, Helm)
```

### Как это работает вместе
1. **Frontend** отправляет запросы к **Backend API**
2. **Backend** работает с **PostgreSQL** и **Redis**
3. **Engine** выполняет автоматизации
4. **Pieces** предоставляют интеграции с внешними сервисами

---

## 🗂️ ФАЙЛЫ ДЛЯ РАБОТЫ (ПОЛНЫЙ СПИСОК)

### 1. Брендинг и внешний вид
```
packages/server/api/src/app/flags/theme.ts                    # Дефолтный бренд
packages/server/api/src/app/ee/helper/appearance-helper.ts  # Применение бренда из БД
packages/server/api/src/app/platform/platform.entity.ts         # Поля бренда в БД
packages/server/api/src/app/platform/platform.service.ts       # Создание платформы
packages/react-ui/src/components/theme-provider.tsx           # Применение темы в UI
packages/react-ui/src/components/ui/full-logo.tsx             # Логотип
packages/react-ui/src/app/routes/platform/setup/branding/   # Настройка бренда
```

### 2. URL и домены
```
packages/react-ui/src/lib/api.ts                           # API_BASE_URL
packages/server/shared/src/lib/ap-axios.ts                  # API URL
packages/shared/src/lib/support-url.ts                       # Ссылка на сообщество
packages/shared/src/lib/feedback-url.ts                     # Ссылка на обратную связь
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
packages/server/api/src/app/database/postgres-connection.ts   # Подключение PostgreSQL
packages/server/api/src/app/database/redis-connections.ts    # Подключение Redis
packages/server/api/src/app/user/user-entity.ts             # Пользователь
packages/server/api/src/app/platform/platform.entity.ts       # Платформа (tenant)
packages/server/api/src/app/project/project-entity.ts         # Проект
packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts # Тарифы
```

### 5. Оплаты и тарифы
```
packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts # Stripe webhook
packages/server/api/src/app/ee/platform/platform-plan/stripe-helper.ts          # Stripe helper
packages/server/api/src/app/ee/platform/platform-plan/platform-plan.service.ts  # Управление тарифами
packages/react-ui/src/app/routes/platform/billing/index.tsx                   # UI биллинга
packages/react-ui/src/features/billing/lib/api.ts                        # API биллинга
```

### 6. AI и кредиты
```
packages/server/api/src/app/ai/ai-provider-controller.ts  # API AI провайдеров
packages/server/api/src/app/ai/ai-provider-service.ts   # Логика AI
packages/react-ui/src/app/routes/platform/setup/ai/index.tsx # UI настройки AI
packages/react-ui/src/app/builder/pieces-selector/ai-tab-content/ai-actions-list.tsx # AI в билдере
```

### 7. Локализация
```
packages/react-ui/src/i18n.ts                    # Конфигурация языков
packages/shared/src/lib/common/locale.ts           # Список языков
packages/react-ui/public/locales/ru/translation.json # Русские переводы
```

### 8. Docker и Deploy
```
Dockerfile                                       # Сборка контейнера
docker-compose.yml                               # Сервисы
nginx.react.conf                                # Reverse proxy
deploy/yflow-helm/values.yaml              # Helm конфиг
deploy/pulumi/*                                 # Pulumi скрипты
```

---

# 🚀 ЭТАП 1 — ПОНИМАНИЕ ПРОЕКТА (1 неделя)

## День 1-2: Изучение архитектуры и терминологии

### Что изучить
1. **Структуру monorepo** - понять где frontend/backend
2. **Как работает React** - компоненты, state, props
3. **Как работает Node.js** - сервер, API, базы данных
4. **TypeScript основы** - типы, интерфейсы

### Практические задания
```bash
# 1. Изучить структуру папок
ls -la packages/

# 2. Посмотреть на package.json
cat package.json | grep "scripts"

# 3. Запустить проект в dev режиме
npm run dev
```

### Что должно получиться
- Понимать где находится frontend код
- Понимать где находится backend код
- Знать основные папки и файлы

## День 3-4: Настройка окружения

### Установка инструментов
```bash
# 1. Установить Node.js (версия из package.json)
node --version

# 2. Установить зависимости
npm install

# 3. Настроить .env файл
cp .env.example .env
```

### Настройка .env
```env
# Базовые настройки
AP_ENVIRONMENT=dev
AP_FRONTEND_URL=http://localhost:4200
AP_EXECUTION_MODE=UNSANDBOXED

# База данных
AP_POSTGRES_HOST=localhost
AP_POSTGRES_PORT=5432
AP_POSTGRES_DATABASE=yflow
AP_POSTGRES_USERNAME=postgres
AP_POSTGRES_PASSWORD=your_password

# Redis
AP_REDIS_HOST=localhost
AP_REDIS_PORT=6379

# Ключи (сгенерировать)
AP_ENCRYPTION_KEY=your_32_char_hex_key
AP_JWT_SECRET=your_32_char_hex_key
```

### Запуск проекта
```bash
# Запустить PostgreSQL и Redis
docker-compose up -d postgres redis

# Запустить весь проект
npm run dev
```

## День 5-7: Изучение кодовой базы

### Frontend изучение
```bash
# 1. Изучить структуру React UI
cd packages/react-ui/src
find . -name "*.tsx" | head -10

# 2. Посмотреть на основные компоненты
cat app/app.tsx
cat components/theme-provider.tsx
```

### Backend изучение
```bash
# 1. Изучить структуру API
cd packages/server/api/src
find . -name "*.ts" | head -10

# 2. Посмотреть на основные контроллеры
cat app/authentication/authentication.controller.ts
cat app/platform/platform.controller.ts
```

### База данных изучение
```bash
# 1. Посмотреть на entity файлы
cat packages/server/api/src/app/platform/platform.entity.ts
cat packages/server/api/src/app/ee/platform/platform-plan/platform-plan.entity.ts
```

---

# 🎨 ЭТАП 2 — FRONTEND WHITE LABEL (1 неделя)

## День 8-10: Замена бренда и цветов

### Шаг 1: Изменение дефолтной темы
**Файл:** `packages/server/api/src/app/flags/theme.ts`

**Что менять:**
```typescript
export const defaultTheme = generateTheme({
    primaryColor: '#3B82F6',        // Синий цвет YFlow
    websiteName: 'YFlow',             // Название
    fullLogoUrl: 'https://cdn.yflow.ru/logo-full.svg',
    favIconUrl: 'https://cdn.yflow.ru/favicon.ico',
    logoIconUrl: 'https://cdn.yflow.ru/logo-icon.svg',
})
```

### Шаг 2: Обновление URL в frontend
**Файл:** `packages/react-ui/src/lib/api.ts`

**Что менять:**
```typescript
export const API_BASE_URL =
  import.meta.env.MODE === 'cloud'
    ? 'https://app.yflow.ru'    // Заменить домен
    : window.location.origin;
```

### Шаг 3: Замена логотипов в UI
**Файл:** `packages/react-ui/src/components/ui/full-logo.tsx`

**Что проверять:**
- Использует ли брендинг из theme
- Корректно ли отображаются логотипы

## День 11-12: Замена всех ссылок и URL

### Поиск и замена yflow.com
```bash
# Найти все упоминания
grep -r "yflow.com" packages/react-ui/src/

# Заменить основные URL
sed -i 's/cloud.yflow.com/app.yflow.ru/g' packages/react-ui/src/lib/api.ts
sed -i 's/community.yflow.com/community.yflow.ru/g' packages/shared/src/lib/support-url.ts
sed -i 's/feedback.yflow.com/feedback.yflow.ru/g' packages/shared/src/lib/feedback-url.ts
```

### Ключевые файлы для замены:
1. `packages/react-ui/src/lib/api.ts` - основной API URL
2. `packages/server/shared/src/lib/ap-axios.ts` - API URL для shared
3. `packages/shared/src/lib/support-url.ts` - ссылка на сообщество
4. `packages/shared/src/lib/feedback-url.ts` - обратная связь

## День 13-14: Настройка русского языка

### Шаг 1: Установка русского языка по умолчанию
**Файл:** `packages/react-ui/src/i18n.ts`

**Что менять:**
```typescript
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language, namespace) => {
    return import(`../public/locales/${language}/${namespace}.json`);
  }))
  .init({
    fallbackLng: 'ru',        // Русский по умолчанию
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });
```

### Шаг 2: Обновление переводов
**Файл:** `packages/react-ui/public/locales/ru/translation.json`

**Что добавить/изменить:**
```json
{
  "branding": {
    "yflow": "YFlow",
    "description": "Российская платформа автоматизации"
  },
  "billing": {
    "subscription": "Подписка",
    "payment": "Оплата"
  }
}
```

## День 15: Тестирование frontend изменений

### Чек-лист проверки
- [ ] Логотип YFlow отображается
- [ ] Цвета соответствуют бренду
- [ ] Все URL ведут на yflow.ru
- [ ] Русский язык по умолчанию
- [ ] Нет упоминаний yflow

---

# ⚙️ ЭТАП 3 — BACKEND, БД, БЕЗОПАСНОСТЬ (1 неделя)

## День 16-18: Настройка базы данных

### Шаг 1: Настройка PostgreSQL
**Файл:** `.env`

```env
AP_POSTGRES_HOST=your-postgres-host
AP_POSTGRES_PORT=5432
AP_POSTGRES_DATABASE=yflow_prod
AP_POSTGRES_USERNAME=yflow_user
AP_POSTGRES_PASSWORD=secure_password
AP_POSTGRES_USE_SSL=true
```

### Шаг 2: Настройка Redis
**Файл:** `.env`

```env
AP_REDIS_HOST=your-redis-host
AP_REDIS_PORT=6379
AP_REDIS_PASSWORD=redis_password
AP_REDIS_USE_SSL=true
```

### Шаг 3: Проверка миграций
**Файл:** `packages/server/api/src/app/database/postgres-connection.ts`

**Что проверять:**
- Правильные ли credentials
- Применяются ли миграции
- Нет ли ошибок подключения

## День 19-21: Настройка безопасности и env переменных

### Генерация ключей
```bash
# Генерация encryption key
openssl rand -hex 16

# Генерация JWT secret
openssl rand -hex 32
```

### Обновление .env
```env
AP_ENCRYPTION_KEY=your_32_char_encryption_key
AP_JWT_SECRET=your_64_char_jwt_secret
AP_FRONTEND_URL=https://app.yflow.ru
AP_INTERNAL_URL=https://api.yflow.ru
```

### Критичные env переменные для YFlow
```env
# Брендинг
AP_APP_TITLE=YFlow
AP_FAVICON_URL=https://cdn.yflow.ru/favicon.ico

# Шаблоны
AP_TEMPLATES_SOURCE_URL=https://app.yflow.ru/api/v1/flow-templates

# Email
AP_SMTP_HOST=smtp.yflow.ru
AP_SMTP_SENDER_EMAIL=noreply@yflow.ru
AP_SMTP_SENDER_NAME=YFlow
```

## День 22: Удаление cloud зависимостей

### Поиск cloud ссылок в backend
```bash
grep -r "cloud.yflow.com" packages/server/api/src/
```

### Файлы для проверки:
1. `packages/server/api/src/app/ee/platform/platform-plan/stripe-helper.ts` - строка 42
2. `packages/server/api/src/app/helper/system-validator.ts`
3. `packages/server/api/src/app/platform/platform.service.ts`

### Замена URL
```typescript
// В stripe-helper.ts
return_url: 'https://app.yflow.ru/platform/billing',

// В других файлах
// Заменить все cloud.yflow.com на app.yflow.ru
```

---

# 💳 ЭТАП 4 — ОПЛАТА, ДОМЕНЫ, ПРОДАКШЕН (1 неделя)

## День 23-25: Настройка Stripe (СКРЫТЫЙ)

### Шаг 1: Скрытие Stripe из UI
**Файл:** `packages/react-ui/src/app/routes/platform/billing/index.tsx`

**Что делать:**
```typescript
// Скрыть кнопки Stripe для обычных пользователей
{isSubscriptionActive && edition === ApEdition.COMMUNITY && (
  <Button variant="outline" onClick={() => redirectToPortalSession()}>
    {t('Access Billing Portal')}
  </Button>
)}
```

### Шаг 2: Настройка Stripe webhook
**Файл:** `packages/server/api/src/app/ee/platform/platform-plan/stripe-billing.controller.ts`

**Что оставить:**
- Webhook обработчик
- Обновление статусов подписки
- Лимиты и функции

**Что изменить:**
```typescript
// Изменить URL возврата
success_url: `${frontendUrl}/platform/setup/billing/success?action=create`,
cancel_url: `${frontendUrl}/platform/setup/billing/error`,
```

## День 26-27: Добавление YooKassa (ОСНОВНОЙ)

### Шаг 1: Создание YooKassa контроллера
**Новый файл:** `packages/server/api/src/app/ee/platform/platform-plan/yookassa-billing.controller.ts`

```typescript
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { platformPlanService } from './platform-plan.service'

export const yookassaBillingController: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.post('/yookassa/webhook', {
        // Обработка webhook от YooKassa
    })
    
    fastify.post('/yookassa/create-payment', {
        // Создание платежа
    })
}
```

### Шаг 2: Создание YooKassa helper
**Новый файл:** `packages/server/api/src/app/ee/platform/platform-plan/yookassa-helper.ts`

```typescript
export const yookassaHelper = () => ({
    async createPayment(params: {
        amount: number,
        description: string,
        platformId: string
    }) {
        // Создание платежа через YooKassa API
    },
    
    async createSubscription(params: {
        planId: string,
        platformId: string
    }) {
        // Создание подписки
    }
})
```

### Шаг 3: Добавление YooKassa полей в БД
**Новая миграция:** `packages/server/api/src/app/database/migration/postgres/XXXXXXX-add-yookassa-fields.ts`

```sql
ALTER TABLE platform_plan ADD COLUMN yookassa_customer_id VARCHAR;
ALTER TABLE platform_plan ADD COLUMN yookassa_subscription_id VARCHAR;
ALTER TABLE platform_plan ADD COLUMN yookassa_status VARCHAR;
ALTER TABLE platform_plan ADD COLUMN yookassa_payment_method VARCHAR;
```

## День 28: Настройка тарифов в рублях

### Создание российских тарифов
**Файл:** `packages/server/api/src/app/ee/platform/platform-plan/platform-plan.service.ts`

```typescript
export const YFLOW_PLANS = {
    STARTER: {
        name: 'STARTER',
        price: 990,      // 990 рублей
        currency: 'RUB',
        activeFlowsLimit: 10,
        includedAiCredits: 100,
    },
    PROFESSIONAL: {
        name: 'PROFESSIONAL',
        price: 2990,     // 2990 рублей
        currency: 'RUB',
        activeFlowsLimit: 50,
        includedAiCredits: 1000,
    },
    ENTERPRISE: {
        name: 'ENTERPRISE',
        price: 9990,     // 9990 рублей
        currency: 'RUB',
        activeFlowsLimit: -1,  // Безлимит
        includedAiCredits: 10000,
    }
}
```

## День 29-30: Настройка доменов и деплой

### Настройка доменов в .env
```env
AP_FRONTEND_URL=https://app.yflow.ru
AP_INTERNAL_URL=https://api.yflow.ru

# YooKassa
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key

# Stripe (скрытый)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Docker конфигурация
**Файл:** `docker-compose.yml`

```yaml
version: '3.8'
services:
  app:
    image: yflow:latest
    environment:
      - AP_FRONTEND_URL=https://app.yflow.ru
      - AP_POSTGRES_HOST=postgres
      - AP_REDIS_HOST=redis
    ports:
      - "80:3000"
    
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=yflow_prod
      - POSTGRES_USER=yflow_user
      - POSTGRES_PASSWORD=secure_password
    
  redis:
    image: redis:7
    command: redis-server --requirepass redis_password
```

## День 31: Финальное тестирование и запуск

### Чек-лист перед запуском
- [ ] Все домены указаны правильно
- [ ] YooKassa принимает платежи
- [ ] Tariffs работают в рублях
- [ ] UI показывает только YFlow
- [ ] Бэкапы настроены
- [ ] SSL сертификаты установлены

### Тестирование платежей
1. Создать тестового пользователя
2. Оформить подписку через YooKassa
3. Проверить что доступ открывается
4. Проверить webhook обработку

---

# 🔗 СВЯЗЬ ПЛАН → ФУНКЦИИ → UI → BACKEND

## Как работает доступ к функциям

### 1. Platform Plan (БД)
```typescript
// platform-plan.entity.ts
{
    agentsEnabled: Boolean,        // AI агенты
    customAppearanceEnabled: Boolean, // Кастомный брендинг
    managePiecesEnabled: Boolean,    // Управление интеграциями
    activeFlowsLimit: Number,      // Лимит активных потоков
    includedAiCredits: Number,       // Включенные AI кредиты
}
```

### 2. Backend Service
```typescript
// platform-plan.service.ts
async function updateLimits(platformId: string, plan: PlatformPlan) {
    // Обновление лимитов в БД
    // Включение/выключение функций
}
```

### 3. Frontend Guards
```typescript
// guards/index.tsx
const hasFeature = (feature: string) => {
    return platform.plan[feature] === true;
}

// Использование в компонентах
{hasFeature('agentsEnabled') && <AIComponent />}
```

### 4. UI Components
```typescript
// billing/index.tsx
{platform.plan.agentsEnabled && (
    <Card>
        <h3>AI Агенты</h3>
        <p>Доступно в вашем тарифе</p>
    </Card>
)}
```

---

# 🧩 ДОБАВЛЕНИЕ РОССИЙСКИХ ИНТЕГРАЦИЙ (PIECES)

## Как создавать новые интеграции

### 1. Структура Piece
```
packages/pieces/community/yandex/
├── src/
│   ├── index.ts           # Основной файл
│   ├── actions/          # Действия
│   ├── triggers/         # Триггеры
│   └── lib/            # Вспомогательные функции
├── package.json
└── README.md
```

### 2. Пример интеграции с Яндекс.Диск
**Файл:** `packages/pieces/community/yandex-disk/src/index.ts`

```typescript
import { createPiece } from '@yflow/pieces-framework'
import { PieceAuth } from '@yflow/shared'

export const yandexDiskPiece = createPiece({
    displayName: 'Яндекс.Диск',
    description: 'Работа с файлами на Яндекс.Диске',
    auth: PieceAuth.OAuth2({
        authUrl: 'https://oauth.yandex.ru/authorize',
        tokenUrl: 'https://oauth.yandex.ru/token',
        scope: 'cloud_api:disk.read'
    }),
    actions: [
        // Список действий
    ],
    triggers: [
        // Список триггеров
    ]
})
```

### 3. Пример интеграции с AmoCRM
**Файл:** `packages/pieces/community/amocrm/src/index.ts`

```typescript
export const amoCrmPiece = createPiece({
    displayName: 'AmoCRM',
    description: 'Интеграция с AmoCRM',
    auth: PieceAuth.ApiKey({
        description: 'Введите API ключ из AmoCRM',
        required: true
    }),
    actions: [
        {
            name: 'create_lead',
            displayName: 'Создать сделку',
            description: 'Создание новой сделки в AmoCRM',
            props: {
                name: { type: Property.ShortText },
                phone: { type: Property.ShortText },
                email: { type: Property.ShortText }
            }
        }
    ]
})
```

---

# 📚 КРИТИЧНО ВАЖНЫЕ ДОКУМЕНТЫ

## Обязательные к изучению:
1. `docs/install/overview.mdx` - варианты установки
2. `docs/install/configuration/environment-variables.mdx` - все env переменные
3. `docs/deployment/deployment.mdx` - деплоймент
4. `docs/stripe/payment.mdx` - Stripe биллинг
5. `docs/admin-console/appearance.mdx` - брендирование

## Для создания интеграций:
1. `docs/developers/building-pieces/overview.mdx` - основы pieces
2. `docs/developers/building-pieces/start-building.mdx` - туториал

---

# ⚠️ РИСКИ И КАК ИХ ИЗБЕЖАТЬ

## Риск 1: Сломать регистрацию
**Проблема:** Неправильно изменить authentication.service.ts
**Решение:** Только дефолтные значения, не трогать логику

## Риск 2: Потерять доступ после оплаты
**Проблема:** Webhook не обрабатывается
**Решение:** Тестировать webhook с YooKassa sandbox

## Риск 3: Некорректные URL
**Проблема:** Остались yflow.com ссылки
**Решение:** Полный поиск и замена всех URL

## Риск 4: Проблемы с БД
**Проблема:** Неправильные миграции
**Решение:** Всегда тестировать на dev окружении

---

# ✅ ФИНАЛЬНЫЙ КРИТЕРИЙ УСПЕХА

После выполнения всех шагов:

## White Label = 100%
- [ ] Ни одного упоминания yflow
- [ ] Только YFlow брендинг
- [ ] Все домены yflow.ru

## Платежи = Только российские
- [ ] Stripe скрыт из UI
- [ ] YooKassa основной платеж
- [ ] Поддержка СБП
- [ ] Тарифы в рублях

## Функциональность = Полная
- [ ] Регистрация работает
- [ ] Оплаты открывают доступ
- [ ] AI функции работают
- [ ] Российские интеграции добавлены

## Продукт готов к продаже
- [ ] Деплойнут на свои серверы
- [ ] Бэкапы настроены
- [ ] Мониторинг работает
- [ ] Можно продавать в РФ

---

# 🆘 ПОМОЩЬ И ПОДДЕРЖКА

## Если что-то не работает:
1. Проверить .env переменные
2. Посмотреть логи в Docker
3. Проверить миграции БД
4. Сравнить с этим планом

## Полезные команды:
```bash
# Проверить статус
npm run dev

# Собрать проект
npm run build

# Проверить типы
npm run lint

# Запустить тесты
npm test
```

## Где искать помощь:
1. **Логи Docker:** `docker-compose logs -f`
2. **Документация:** папка `docs/`
3. **Примеры кода:** существующие pieces в `packages/pieces/`

---

**🎯 ГОТОВО!** Следуйте этому плану шаг за шагом, и у вас получится полностью рабочий White Label YFlow на базе Yflowза 3-4 недели даже без опыта программирования.
