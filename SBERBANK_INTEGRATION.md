# Sberbank Integration for YFlow (Russia)

تم إضافة دعم سبير بنك الروسي للمدفوعات في YFlow.

## الملفات التي تم إنشاؤها

### 1. Sberbank Helper
`packages/server/api/src/app/ee/platform/platform-plan/sberbank-helper.ts`
- دوال للتعامل مع Sberbank API
- إنشاء العملاء والجلسات
- التحقق من تواقيع Webhook

### 2. Sberbank Controller
`packages/server/api/src/app/ee/platform/platform-plan/sberbank-billing.controller.ts`
- استقبال webhooks من Sberbank
- إنشاء جلسات الدفع والاشتراك
- تحديث حالات الاشتراكات

### 3. تحديثات قاعدة البيانات
تمت إضافة الحقول التالية إلى `platform-plan.entity.ts` و `platform.model.ts`:
- `sberbankCustomerId` - معرف العميل في Sberbank
- `sberbankSubscriptionId` - معرف الاشتراك
- `sberbankSubscriptionStatus` - حالة الاشتراك
- `sberbankSubscriptionStartDate` - تاريخ البدء
- `sberbankSubscriptionEndDate` - تاريخ الانتهاء
- `sberbankSubscriptionCancelDate` - تاريخ الإلغاء

## متغيرات البيئة

أضيفت المتغيرات التالية إلى `.env.example`:
```bash
AP_SBERBANK_API_KEY=
AP_SBERBANK_MERCHANT_ID=
AP_SBERBANK_WEBHOOK_SECRET=
AP_SBERBANK_BASE_URL=https://api.sberbank.ru/v1
```

## API Endpoints

### Webhook Endpoint
```
POST /api/v1/platform/plans/sberbank/webhook
```
- استقبال إشعارات الدفع من Sberbank
- تحديث حالات الاشتراكات تلقائياً

### Create Payment Session
```
POST /api/v1/platform/plans/sberbank/create-payment-session
```
- إنشاء جلسة دفع لمرة واحدة
- يدعم الروبل الروسي

### Create Subscription Session
```
POST /api/v1/platform/plans/sberbank/create-subscription-session
```
- إنشاء جلسة اشتراك شهري أو سنوي
- دعم التجديد التلقائي

## خطوات التثبيت

### 1. إضافة متغيرات البيئة
```bash
# في ملف .env
AP_SBERBANK_API_KEY=your_api_key_here
AP_SBERBANK_MERCHANT_ID=your_merchant_id_here
AP_SBERBANK_WEBHOOK_SECRET=your_webhook_secret_here
AP_SBERBANK_BASE_URL=https://api.sberbank.ru/v1
```

### 2. تشغيل Migration
```bash
# إنشاء migration للحقول الجديدة
npm run migration:generate -- AddSberbankFieldsToPlatformPlan
npm run migration:run
```

### 3. تسجيل الـ Controller
أضف إلى الـ application main module:
```typescript
import { sberbankBillingController } from './ee/platform/platform-plan/sberbank-billing.controller'

await app.register(sberbankBillingController)
```

### 4. إعداد Webhook
في لوحة تحكم Sberbank:
- أضف webhook URL: `https://your-domain.com/api/v1/platform/plans/sberbank/webhook`
- استخدم الـ webhook secret من متغيرات البيئة

## الاستخدام

### إنشاء جلسة دفع
```typescript
const response = await fetch('/api/v1/platform/plans/sberbank/create-payment-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        platformId: 'platform-123',
        amountInRub: 2990,
        description: 'AI Credits Purchase'
    })
})

const { paymentUrl } = await response.json()
window.location.href = paymentUrl
```

### إنشاء اشتراك
```typescript
const response = await fetch('/api/v1/platform/plans/sberbank/create-subscription-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        platformId: 'platform-123',
        planId: 'pro-plan',
        amountInRub: 2990,
        interval: 'month'
    })
})

const { subscriptionUrl } = await response.json()
window.location.href = subscriptionUrl
```

## المميزات

- ✅ دعم الروبل الروسي
- ✅ دفعات لمرة واحدة
- ✅ اشتراكات شهرية وسنوية
- ✅ تجديد تلقائي
- ✅ webhooks للتحديثات الفورية
- ✅ تواقيع آمنة للـ webhooks
- ✅ متوافق مع هيكلة YFlow الحالية

## أسعار الصرف

- الروبل الروسي إلى دولار أمريكي: 1 RUB ≈ 0.011 USD
- يجب استخدام معدل صرف حقيقي في الإنتاج

## ملاحظات هامة

1. **الأمان**: جميع الطلبات موقعة ومشفرة
2. **الاختبار**: استخدم بيئة الاختبار من Sberbank قبل الإنتاج
3. **النسخ الاحتياطي**: يعمل جنباً إلى جنب مع Stripe و YooKassa و SPIBank
4. **الامتثال**: متوافق مع معايير البنك المركزي الروسي

## الخطوات التالية

1. اختبار Integration مع بيئة Sberbank
2. إضافة واجهة frontend لإدارة المدفوعات
3. إعداد تقارير و analytics
4. تحسين أسعار الصرف الديناميكية
5. إضافة دعم العملات الروسية الأخرى

## دعم العملاء

للمساعدة الفنية مع Sberbank:
- البريد الإلكتروني: support@sberbank.ru
- الهاتف: +7 495 500-55-50
- الوثائق: https://developer.sberbank.ru
