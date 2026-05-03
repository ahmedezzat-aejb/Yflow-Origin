1. REQUIREMENTS FOR AGFLOW - OVERVIEW
2. Purpose: fully fork and rebrand Activepieces into AgFlow.
3. Domain: agflow.ru
4. Preserve UI styles: do not alter Tailwind color tokens.
5. Replace logos and textual brand mentions with AgFlow.
6. Create new billing module with YooMoney and SBP support.
7. Implement card payments via PSP provider (modular).
8. Provide slider-based purchases: Active Flows Usage and AI Credits.
9. Convert USD prices to RUB using FX API with caching.
10. Implement webhooks endpoints for payment providers.
11. Create plans model: Free, Professional, Enterprise.
12. Free plan: 200 credits one-time allocation.
13. Professional: 1290 ₽ / month.
14. Standard monthly: 490 ₽ / month.
15. Enterprise: custom pricing starting from 250000 ₽.
16. Additional plan options: usage-based flows and credits.
17. Integrate PGLite as default DB engine.
18. Provide scripts to create a fresh PGLite DB for AgFlow.
19. Ensure worker queue uses Redis + BullMQ.
20. Ensure backend framework remains Fastify.
21. All new code in TypeScript with strict typing.
22. Shared types live in packages/shared.
23. Structure: maintain NX monorepo layout.
24. Ensure EE package is removed unless explicitly kept.
25. If EE removed, remove all imports and feature flags.
26. BACKUP REQUIREMENTS
27. Full DB backup: monthly.
28. Retention: keep last 3 full backups.
29. Store backups in secure remote storage (S3 compatible).
30. Provide script `scripts/backup_db.sh`.
31. Provide restore script `scripts/restore_db.sh`.
32. Implement verification of backup integrity.
33. MIGRATION REQUIREMENTS
34. Provide migration scripts for initial DB schema.
35. Include rollback scripts for each migration.
36. Test migrations in staging before prod run.
37. If migrating from existing data, export and validate data.
38. SECURITY REQUIREMENTS
39. Do not log payment data or card PANs.
40. Store only payment tokens and reference IDs.
41. Protect webhooks with signatures and verify them.
42. Use environment secrets to store API credentials.
43. Limit admin endpoints to authenticated admins.
44. Implement basic rate limiting on public APIs.
45. Use HTTPS for any external endpoint.
46. MONITORING AND LOGGING
47. Integrate Sentry for runtime error monitoring.
48. Expose metrics endpoint for Prometheus if available.
49. Log critical billing events to audit table.
50. Setup alerting for payment failures and queue backlog.
51. CODE QUALITY
52. Follow ESLint rules configured in repository.
53. Add unit tests for payment flows and conversions.
54. Add integration test for webhook processing.
55. Maintain 80% coverage on critical billing modules.
56. Use conventional commits and clear messages.
57. CI REQUIREMENTS
58. CI pipeline must lint, build, run tests.
59. On main branch push: build docker images.
60. CI secrets stored in GitHub Secrets.
61. Release process describes docker tags and changelog.
62. DEPLOYMENT
63. Use Docker Compose for production deployment.
64. Provide `docker-compose.prod.yml`.
65. Provide Nginx configuration for reverse proxy and SSL.
66. Provide deploy script `scripts/deploy_prod.sh`.
67. TimeWeb VPS instructions included in docs.
68. Ensure zero-downtime deploy strategy if possible.
69. ROLLBACK
70. Provide step-by-step rollback instructions.
71. Include database migration rollback instructions.
72. BILLING ARCHITECTURE - OVERVIEW
73. Billing core lives in `packages/server/api/src/services/billing`.
74. Providers are modular classes implementing BillingProvider interface.
75. Implement YooMoneyProvider and SBPProvider.
76. PSP integration via adapter pattern.
77. Each provider has: createPayment, checkPayment, webhookHandler.
78. Payment model fields: id, user_id, provider, amount_rub, currency, status, meta.
79. Invoice model: id, user_id, total_amount_rub, due_date, status.
80. Subscription model: id, user_id, plan_id, status, next_billing_date, provider_subscription_id.
81. Payment statuses: pending, succeeded, failed, refunded.
82. All payment processing must be idempotent.
83. Payments must be recorded in audit logs.
84. FX CONVERSION
85. Use external FX provider endpoint (exchangerate.host or similar).
86. Implement `services/fxService.ts` with caching in Redis.
87. Cache TTL: 3600 seconds (configurable).
88. Provide fallback to previous cached value if FX API fails.
89. Provide endpoint `GET /api/billing/convert?amount=XX&from=USD&to=RUB`.
90. PRICING LOGIC
91. Base plan price defined in DB table plans.
92. Active Flows Usage: per-flow price defined in config.
93. AI Credits: price-per-credit defined in config.
94. When user moves slider, UI requests price preview endpoint.
95. Price preview uses FX conversion if base price in USD.
96. Ensure rounding rules: round to 2 decimals for money; final displayed price in RUB.
97. CURRENCY RULES
98. All displayed prices for Russian users in RUB.
99. Store amount_cents in DB as integer (RUB kopeks).
100. Avoid floating point for money calculations.
101. PAYMENT UX
102. Provide payment modal for QR (SBP) and card/YOOMONEY.
103. For SBP QR: generate invoice -> generate QR -> poll webhook or payment check.
104. For YooMoney: use provider SDK or redirect flow + webhook verification.
105. After payment success, credit user's account with purchased credits/flows.
106. SUBSCRIPTIONS
107. Provide endpoints to create, cancel, and view subscriptions.
108. For recurring payments create subscription on provider where possible.
109. If provider does not provide recurring, emulate with recurring invoices + card-on-file.
110. Implement subscription reconciliation job (daily) that checks provider statuses.
111. ADMIN PANEL REQUIREMENTS
112. Add billing admin views: invoices list, payments, subscriptions.
113. Add manual invoice creation for enterprise customers.
114. Add export functionality (CSV) for finance team.
115. Add ability to issue refunds and partial refunds.
116. USAGE TRACKING
117. Track flows-per-user usage in DB table usage_records.
118. Track AI credits usage in usage_records.
119. Add scheduled job to recalculate usage and apply limits.
120. When usage exceeds plan quota, block new starts and show upsell modal.
121. SEND NOTIFICATIONS
122. Implement notification emails for: payment succeeded, payment failed, invoice created, subscription expiring.
123. Use transactional email provider (SMTP / API).
124. Add in-app notification center for billing events.
125. UI IMPLEMENTATION NOTES
126. Keep Tailwind CSS & shadcn UI component library.
127. Add Billing pages under `/billing` and `/settings/billing`.
128. Preserve layout and color tokens.
129. Replace logos and name strings only.
130. Add "Buy Credits" modal and "Buy Flows" modal accessible from billing page.
131. Add price preview component with spinner during FX call.
132. Add "Payment history" UI in user account.
133. DATABASE SCHEMA (HIGH LEVEL)
134. Table: users (existing)
135. Table: plans (id, slug, name, price_rub, monthly, description, credits_included, flows_included)
136. Table: invoices (id, user_id, amount_cents, status, due_date, provider, provider_id)
137. Table: payments (id, invoice_id, provider, provider_payment_id, amount_cents, status, meta, created_at)
138. Table: subscriptions (id, user_id, plan_id, status, provider_subscription_id, next_billing_date)
139. Table: usage_records (id, user_id, type, amount, meta, created_at)
140. Table: audit_logs (id, entity, action, payload, created_by, created_at)
141. IMPLEMENTATION - BACKEND
142. Create service: BillingService with methods:
143. - createInvoice(userId, items)
144. - createPayment(invoiceId, provider, payload)
145. - handleWebhook(provider, payload)
146. - convertCurrency(amount, from, to)
147. - getPricePreview(planId, flows, credits)
148. Implement controllers routes under `/api/billing/*`.
149. Validate all inputs with schemas (zod / Joi).
150. Queue background tasks for reconciliation and notifications.
151. Implement ip-whitelisting / verification for webhooks (where provider supports).
152. IMPLEMENTATION - FRONTEND
153. Add pages: Billing Overview, Buy Credits, Buy Flows, Payment History.
154. Use fetch / SWR for price previews and balance updates.
155. Use optimistic UI updates for small actions with rollback on error.
156. LOCKING AND CONCURRENCY
157. When processing webhooks, use DB transactions to ensure idempotency.
158. Acquire locks when adjusting balances to avoid race conditions.
159. Use Redis locks for cross-instance synchronization.
160. TESTING
161. Unit tests for BillingService logic.
162. Integration tests simulating provider webhooks.
163. End-to-end test for full purchase flow (purchase -> webhook -> balance update).
164. Use testing DB and mock providers to validate flows.
165. OPERATIONS
166. Provide runbook `docs/deploy.md` with steps for TimeWeb.
167. Provide `docs/run-local.md` for dev environment setup.
168. Provide `docs/backup_and_restore.md`.
169. Provide `docs/payment_providers.md` with provider-specific notes.
170. Provide `docs/migrations.md` with migration steps and rollback.
171. SCALE & PERFORMANCE
172. For 1000 concurrent users, ensure Worker and Redis scale horizontally.
173. Monitor queue latency and increase worker count if backlog grows.
174. Implement caching for non-sensitive public data.
175. Ensure DB indices exist for queries on invoices, payments, usage.
176. ACCESS CONTROL
177. Admin API must reject non-admin roles.
178. Use JWT tokens for API auth; rotate secrets periodically.
179. Use role-based flags for billing admin operations.
180. LOGGING
181. Log payment lifecycle events with trace-id.
182. Correlate webhooks with invoices via provider ids.
183. Store raw webhook payload in secure table for forensic.
184. PRIVACY
185. Comply with Russian data laws; personal data stored encrypted where needed.
186. Do not export personal data in plain logs.
187. CONFIGURATION / ENV
188. Required env variables:
189. - AP_DB_TYPE
190. - DATABASE_URL
191. - REDIS_URL
192. - JWT_SECRET
193. - YOOMONEY_CLIENT_ID
194. - YOOMONEY_SECRET
195. - SBP_PROVIDER_KEY
196. - FX_API_KEY
197. - FX_API_URL
198. - SENTRY_DSN
199. - PAYMENT_CURRENCY
200. - DOMAIN (agflow.ru)
201. TASKS FOR TRAE SOLO AGENT
202. 1. Apply brand-wide replacements safely and create branch `chore/branding`.
203. 2. Implement BillingService and provider adapters in new branch `feat/billing`.
204. 3. Add FX service with cache and endpoint.
205. 4. Add UI pages and components for billing flows.
206. 5. Write tests for backend controllers and services.
207. 6. Create migration scripts and DB schema files.
208. 7. Add docker-compose.prod.yml and Nginx conf.
209. 8. Add backup scripts and cron example.
210. 9. Add CI job to build and run tests.
211. 10. Prepare deploy checklist for TimeWeb.
212. DOCUMENTATION DELIVERABLES
213. - docs/project-overview.md
214. - docs/arch-rule.md
215. - docs/requirements.md (this file)
216. - docs/run-local.md
217. - docs/deploy.md
218. - docs/payment_providers.md
219. - docs/backup_and_restore.md
220. - docs/migrations.md
221. OPERATIONS CHECKS BEFORE RELEASE
222. - Run `npm ci` and `pnpm nx build` or `npm run build`.
223. - Run unit and integration tests.
224. - Ensure environment variables are set in production.
225. - Ensure Sentry DSN configured.
226. - Ensure Redis and DB reachable from host.
227. - Ensure PSP webhooks registered and correct URLs set.
228. - Ensure HTTPS and valid SSL certs are working.
229. - Ensure backup storage configured.
230. DEPLOY CHECKLIST (SIMPLE)
231. - Pull latest main branch on VDS.
232. - Copy .env.prod to server (secure).
233. - docker-compose -f docker-compose.prod.yml pull
234. - docker-compose -f docker-compose.prod.yml up -d --build
235. - Run migration script: ./scripts/migrate_prod.sh
236. - Verify app health endpoints and Sentry.
237. - Verify payment webhooks by test payments.
238. - Verify backups schedule configured.
239. COMMON ISSUES & DEBUGGING
240. - Missing env -> app fails to start. Check logs.
241. - Redis unreachable -> workers stuck; check network and auth.
242. - Webhook signature mismatch -> verify secret.
243. - FX API failures -> fallback to cached rate.
244. - Large backlog -> scale workers.
245. SECURITY HARDENING CHECKS
246. - Ensure admin endpoints behind auth.
247. - Remove any leftover Activepieces cloud keys.
248. - Ensure CSP and security headers in Nginx.
249. - Ensure Docker images built from non-root user.
250. MAINTENANCE
251. - Monthly DB backup and verify restore.
252. - Rotate secrets every 90 days.
253. - Run dependency updates carefully and test.
254. - Monitor queue lengths daily.
255. EXTRA NOTES ON PGLITE
256. - PGLite is the project's embedded DB option; verify initialisation path.
257. - If PGLite stores files, keep data dir persistent in Docker volumes.
258. - Include script to create fresh PGLite DB for new install.
259. - If required to migrate to Postgres, provide conversion script.
260. INFRASTRUCTURE FOR TIMEWEB
261. - Use Docker Compose on VDS.
262. - Use Nginx container or host Nginx to reverse proxy to services.
263. - Use Docker volumes for persistent data (db, redis data, logs).
264. - Setup firewall rules to allow 80/443, 22.
265. DEV ENVIRONMENT
266. - Provide `dev.env` for local quickstart.
267. - Provide `docker-compose.dev.yml` for local development.
268. - Provide command `pnpm nx serve react-ui` for local frontend dev server.
269. MIGRATION AND DATA
270. - When creating new DB, ensure schema is applied with migration tool.
271. - Provide `scripts/init_db.sh` for new instance.
272. - Document how to import existing sqlite data if needed.
273. MAINTAINABILITY
274. - Keep billing code modular and provider-agnostic.
275. - Document provider adapter interface thoroughly.
276. - Keep unit tests simple and isolated.
277. USER MIGRATION (if needed)
278. - If migrating existing activepieces users, provide mapping plan.
279. - Notify users of new terms and billing changes.
280. - Provide data export and opt-out plan.
281. LEGAL & COMPLIANCE
282. - Provide terms of use and privacy policy pages.
283. - Ensure payment receipts comply with local regulations.
284. - For enterprise invoices, support PDF invoice generation.
285. LOCALISATION
286. - Ensure all billing text is Russian-first by default.
287. - Keep internationalization keys in `i18n` folder.
288. - Provide currency formatting for RUB with symbol ₽.
289. PERFORMANCE TUNING
290. - Add DB indices for invoice lookups by provider id.
291. - Add cache for price preview endpoint.
292. - Batch reconcile job to run during off-peak hours.
293. USAGE QUOTA ENFORCEMENT
294. - When quotas exceeded, block new flows creation.
295. - Provide clear UI messaging and upsell links.
296. - Provide admin override for quotas.
297. AUDIT AND REPORTING
298. - Provide monthly export for finance (CSV).
299. - Provide endpoint for revenue summary by date range.
300. - Provide per-user spend reports for enterprise.
301. SAMPLE ENV EXAMPLE
302. AP_DB_TYPE=PGLITE
303. DATABASE_URL=file:./data/agflow_pglite.db
304. REDIS_URL=redis://localhost:6379
305. JWT_SECRET=supersecret
306. YOOMONEY_CLIENT_ID=your
307. YOOMONEY_SECRET=secret
308. SBP_PROVIDER_KEY=sbp-key
309. FX_API_URL=https://api.exchangerate.host/latest
310. FX_API_KEY=
311. SENTRY_DSN=
312. PAYMENT_CURRENCY=RUB
313. DOMAIN=agflow.ru
314. DEPLOYMENT NOTES FOR TRAE SOLO
315. - Validate env variables before running containers.
316. - Run `npm ci` then `npm run build` before dockerizing.
317. - Use multi-stage Docker builds to reduce image size.
318. - Scan container images for vulnerabilities.
319. - Run smoke tests after deploy.
320. DOCUMENTS TO DELIVER
321. - run-local.md
322. - deploy.md
323. - payment_providers.md
324. - backup_and_restore.md
325. - migrations.md
326. - admin_guide.md
327. - api_reference.md (billing endpoints)
328. QA CHECKLIST
329. - Manual test: create invoice -> pay via YooMoney sandbox -> confirm webhook flows.
330. - Manual test: generate SBP QR -> scan & pay -> confirm.
331. - Test subscription creation and cancellation.
332. - Test price preview with FX conversion.
333. - Test usage quotas enforcement.
334. - Test admin refund process.
335. HIT LIST AFTER INITIAL FORK
336. - Remove ACTIVEPIECES references from README.
337. - Update README with AgFlow brand and quickstart.
338. - Update license file if necessary.
339. - Create support contact details and links to agflow.ru/docs.
340. LONG-TERM ROADMAP (brief)
341. - Phase 1: Branding + Billing + Deploy (MVP).
342. - Phase 2: Payment analytics + enterprise billing.
343. - Phase 3: Scaling, multi-region DB, advanced monitoring.
344. RESPONSIBILITIES (WHO DOES WHAT)
345. - TRAE Solo: code changes, tests, builds, deploy scripts and docs.
346. - Owner (you): provide secrets, confirm enterprise & legal terms, final release approval.
347. - Ops: setup TimeWeb VDS and DNS records.
348. CHANGE POLICY
349. - Any breaking change must be documented and migration script provided.
350. - Major dependency upgrades require smoke-tests and regression tests.
351. HANDOVER
352. - When complete, prepare release notes and handover doc.
353. - Provide runbook for day-to-day operations.
354. - Provide instructions for adding new PSP providers.
355. SUPPORT & MAINTENANCE
356. - Provide SLA for enterprise clients (negotiated).
357. - Provide email contact for billing issues.
358. - Keep support doc with common incident responses.
359. EXAMPLES (CODE SNIPPETS)
360. - Price preview route (pseudo):
361.   GET /api/billing/preview?plan=pro&flows=10&credits=500
362.   returns { price_rub: 1290, flows_price: 200, credits_price: 300, total_rub: 1790 }
363. - Webhook handler skeleton:
364.   POST /api/billing/webhook/yoomoney -> verify signature -> find invoice -> mark paid -> enqueue grantCreditsJob
365. - FX service pseudo:
366.   async getRate(from,to){ check redis cache; if miss -> fetch fx api; cache result; return rate }
367. SAMPLE DATABASE MIGRATION COMMANDS
368. - npm run migrate:dev
369. - npm run migrate:prod
370. - scripts/rollback_migration.sh <migration_id>
371. FINAL NOTES
372. - Keep all modifications tracked under a feature branch and PR.
373. - Maintain clear documentation for each change.
374. - Ensure secure handling of secrets at all times.
375. - Follow local legal rules for billing and receipts.
376. - Use sandbox/test credentials for integration tests.
377. - Keep payment provider adapters isolated and well-documented.
378. - Use strong typing and validation for all inputs.
379. - Always prefer safety over speed for billing changes.
380. - Prepare a staged rollout for payments to minimize risk.
381. - Keep a test account for finance team to validate flows.
382. - Keep admin tools to manually adjust balances when necessary.
383. - Provide logs and raw webhook storage for debugging.
384. - Ensure at least one backup test restore per quarter.
385. - Build modular code to add other payment providers later.
386. - Always mention AgFlow brand in README and docs.
387. - Keep a changelog with date and author for major changes.
388. - Use feature flags for risky features during rollout.
389. - Automate test scenarios for payments in CI.
390. - Monitor production for payment failure spikes.
391. - Keep customers informed during maintenance windows.
392. - Keep all financial data exports protected with access controls.
393. - Treat production migrations with a rollback plan and downtime window.
394. - Provide an emergency contact for payments incidents.
395. - Provide a small sandbox environment for QA with test PSP keys.
396. - Use deterministic rounding rules for currency operations.
397. - Keep asynchronous jobs idempotent and retryable.
398. - Finally: respect user's choice — AgFlow brand, preserve UI colors, and deliver stable billing.
399. End of requirements document.
