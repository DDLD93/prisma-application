# Admin API Implementation

API for managing application sessions, applications, admissions, payments, and analytics. All admin endpoints require authentication via the **`X-Admin-API-Key`** header (value must match `ADMIN_API_KEY` environment variable).

**Base path:** `/api/admin`

**Interactive docs:** `GET /api/admin/docs` (Swagger UI)  
**OpenAPI spec:** `GET /api/admin/openapi.json`

---

## Authentication

| Header | Description |
|--------|-------------|
| `X-Admin-API-Key` | Admin API key. Required for all admin endpoints. |

**Unauthorized response (401):**

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing X-Admin-API-Key"
}
```

Implementation: `lib/admin-auth.ts` → `validateAdminRequest(request)`.

---

## 1. Sessions

Application windows (year, open/close dates, fee, status).

### List sessions

**`GET /api/admin/sessions`**

**Response:** `200` — Array of session objects.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Session ID |
| `year` | integer | Session year |
| `openAt` | string (date-time) | Open date |
| `closeAt` | string (date-time) | Close date |
| `amount` | number | Application fee |
| `availableClasses` | string[] | Allowed classes |
| `status` | string | `ACTIVE` \| `INACTIVE` \| `CONCLUDED` |

**Implementation:** `app/api/admin/sessions/route.ts` (GET)

---

### Create session

**`POST /api/admin/sessions`**

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `year` | integer | Yes | Session year |
| `openAt` | string (date-time) | Yes | Open date |
| `closeAt` | string (date-time) | Yes | Close date |
| `amount` | number | Yes | Application fee |
| `availableClasses` | string[] | No | Default: `[]` |
| `status` | string | No | `ACTIVE` \| `INACTIVE` \| `CONCLUDED`; default: `ACTIVE` |

**Response:** `200` — Created session object (same shape as list).

**Errors:** `400` — Invalid JSON or missing required fields.

**Implementation:** `app/api/admin/sessions/route.ts` (POST)

---

### Update session

**`PATCH /api/admin/sessions/:id`**

**Body:** All fields optional (partial update).

| Field | Type |
|-------|------|
| `year` | integer |
| `openAt` | string (date-time) |
| `closeAt` | string (date-time) |
| `amount` | number |
| `availableClasses` | string[] |
| `status` | `ACTIVE` \| `INACTIVE` \| `CONCLUDED` |

**Response:** `200` — Updated session object.

**Errors:** `400` Invalid JSON; `404` Session not found.

**Implementation:** `app/api/admin/sessions/[id]/route.ts` (PATCH)

---

## 2. Applications

### List applications (paginated)

**`GET /api/admin/applications`**

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | `SUBMITTED` \| `PAID` \| `COMPLETED` |
| `sessionId` | string | Filter by session |
| `class` | string | Filter by class |
| `dateFrom` | string (date) | Created ≥ |
| `dateTo` | string (date) | Created ≤ |
| `page` | integer | Default: 1 |
| `limit` | integer | 1–100; default: 20 |
| `sort` | string | `createdAt` \| `updatedAt`; default: `createdAt` |
| `order` | string | `asc` \| `desc`; default: `desc` |

**Response:** `200`

```json
{
  "data": [ /* Application[] */ ],
  "total": 0,
  "page": 1,
  "limit": 20
}
```

Application object includes: `id`, `userId`, `wardName`, `wardDob`, `wardGender`, `class`, `sessionId`, `sessionYear`, `status`, `payments` (array of `{ id, amount, status, verifiedBy }`), `createdAt`.

**Implementation:** `app/api/admin/applications/route.ts` (GET)

---

### Get application by ID

**`GET /api/admin/applications/:id`**

**Response:** `200` — Application with `session`, `payments`, and optional `admission` (`id`, `status`, `class`).

**Errors:** `404` Not found.

**Implementation:** `app/api/admin/applications/[id]/route.ts` (GET)

---

### Application form PDF

**`GET /api/admin/applications/:id/form`**

**Response:** `200` — PDF binary (`Content-Type: application/pdf`, `Content-Disposition: attachment; filename="application-{id}.pdf"`).

**Errors:** `404` Not found; `500` PDF generation failed.

**Implementation:** `app/api/admin/applications/[id]/form/route.ts` (GET). Uses `lib/generate-application-pdf.ts`.

---

### Admission letter PDF

**`GET /api/admin/applications/:id/admission-letter`**

**Response:** `200` — PDF binary (`Content-Type: application/pdf`, `Content-Disposition: attachment; filename="admission-letter-{id}.pdf"`).

**Errors:** `404` Application not found; `403` No admission record; `500` PDF generation failed.

**Implementation:** `app/api/admin/applications/[id]/admission-letter/route.ts` (GET). Uses `lib/generate-admission-letter-pdf.ts`.

---

### Export applications (CSV)

**`GET /api/admin/applications/export`**

**Response:** `200` — CSV file (`Content-Type: text/csv`, `Content-Disposition: attachment; filename=applications.csv`). Columns: `id`, `wardName`, `wardDob`, `wardGender`, `class`, `sessionYear`, `status`, `createdAt`.

**Implementation:** `app/api/admin/applications/export/route.ts` (GET)

---

## 3. Admissions

Admission records linked to applications (placement, status).

### List admissions (paginated)

**`GET /api/admin/admissions`**

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `sessionId` | string | Filter by application session |
| `status` | string | `PENDING` \| `OFFERED` \| `ACCEPTED` \| `DECLINED` |
| `page` | integer | Default: 1 |
| `limit` | integer | 1–100; default: 20 |

**Response:** `200`

```json
{
  "data": [ /* Admission[] */ ],
  "total": 0,
  "page": 1,
  "limit": 20
}
```

Admission object: `id`, `applicationId`, `class`, `status`, `createdAt`, `updatedAt`, and optional `application` (`id`, `wardName`, `sessionId`, `sessionYear`).

**Implementation:** `app/api/admin/admissions/route.ts` (GET)

---

### Create admission

**`POST /api/admin/admissions`**

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `applicationId` | string | Yes | Application ID |
| `class` | string \| null | No | Class placement |
| `status` | string | No | `PENDING` \| `OFFERED` \| `ACCEPTED` \| `DECLINED`; default: `PENDING` |

**Response:** `200` — Created admission (with `application` when included).

**Errors:** `400` Missing `applicationId`, invalid JSON, or application already has admission; `404` Application not found.

**Implementation:** `app/api/admin/admissions/route.ts` (POST)

---

### Get admission by ID

**`GET /api/admin/admissions/:id`**

**Response:** `200` — Admission with `application` (id, wardName, sessionId, sessionYear).

**Errors:** `404` Admission not found.

**Implementation:** `app/api/admin/admissions/[id]/route.ts` (GET)

---

### Update admission

**`PATCH /api/admin/admissions/:id`**

**Body:** Optional.

| Field | Type |
|-------|------|
| `class` | string \| null |
| `status` | `PENDING` \| `OFFERED` \| `ACCEPTED` \| `DECLINED` |

**Response:** `200` — Updated admission.

**Errors:** `400` Invalid JSON; `404` Admission not found.

**Implementation:** `app/api/admin/admissions/[id]/route.ts` (PATCH)

---

### Delete admission

**`DELETE /api/admin/admissions/:id`**

**Response:** `200` — `{ "ok": true }`.

**Errors:** `404` Admission not found.

**Implementation:** `app/api/admin/admissions/[id]/route.ts` (DELETE)

---

### Bulk create admissions

**`POST /api/admin/admissions/bulk`**

**Body:**

```json
{
  "admissions": [
    { "applicationId": "clx...", "class": "Primary 1", "status": "OFFERED" },
    { "applicationId": "cly...", "status": "PENDING" }
  ]
}
```

Applications that already have an admission are skipped. Each item may include optional `class` and `status` (default `PENDING`).

**Response:** `200`

```json
{
  "created": [ { "id": "...", "applicationId": "..." } ],
  "errors": [ { "applicationId": "...", "error": "..." } ]
}
```

**Errors:** `400` — Body must contain array `admissions`.

**Implementation:** `app/api/admin/admissions/bulk/route.ts` (POST)

---

### Admission resource (aggregate stats)

**`GET /api/admin/admissions/resource`**

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `sessionId` | string | Optional. When set, counts are for that session only. When omitted, response includes `bySession`. |

**Response:** `200`

```json
{
  "total": 0,
  "byStatus": { "PENDING": 0, "OFFERED": 0, "ACCEPTED": 0, "DECLINED": 0 },
  "byClass": { "Primary 1": 0, "(none)": 0 },
  "bySession": [
    { "sessionId": "...", "year": 2025, "count": 0 }
  ]
}
```

`bySession` is present only when `sessionId` is not provided.

**Implementation:** `app/api/admin/admissions/resource/route.ts` (GET)

---

## 4. Payments

### List payments

**`GET /api/admin/payments`**

**Response:** `200` — Array of payment objects: `id`, `applicationId`, `wardName`, `sessionYear`, `amount`, `status`, `verifiedBy`, `reference`, `createdAt`. Ordered by `createdAt` desc.

**Implementation:** `app/api/admin/payments/route.ts` (GET)

---

### Verify payment

**`PATCH /api/admin/payments/:id/verify`**

Marks payment as completed and sets application status to `PAID` in a single transaction.

**Body:**

| Field | Type | Description |
|-------|------|-------------|
| `verifiedBy` | string | `API_OVERRIDE` \| `SYSTEM`; default: `API_OVERRIDE` |

**Response:** `200` — `{ "ok": true }`.

**Errors:** `400` Invalid JSON or invalid `verifiedBy`; `404` Payment not found.

**Implementation:** `app/api/admin/payments/[id]/verify/route.ts` (PATCH)

---

## 5. Analytics

### Enrollment analytics

**`GET /api/admin/analytics/enrollment`**

**Response:** `200`

```json
{
  "ageBuckets": [ { "bucket": "0-5", "count": 0 }, ... ],
  "gender": [ { "gender": "...", "count": 0 } ],
  "conversion": {
    "submitted": 0,
    "paid": 0,
    "conversionRatePercent": 0
  }
}
```

Age buckets: `0-5`, `6-10`, `11-15`, `16+`. Implemented in `lib/analytics.ts` → `getEnrollmentAnalytics()`.

**Implementation:** `app/api/admin/analytics/enrollment/route.ts` (GET)

---

### Financial analytics

**`GET /api/admin/analytics/financial`**

**Response:** `200`

```json
{
  "sessions": [
    {
      "sessionId": "...",
      "year": 2025,
      "total": 0,
      "verifiedBySystem": 0,
      "verifiedByApiOverride": 0
    }
  ]
}
```

Only completed payments are included. Implemented in `lib/analytics.ts` → `getFinancialAnalytics()`.

**Implementation:** `app/api/admin/analytics/financial/route.ts` (GET)

---

## 6. Documentation endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/docs` | Swagger UI HTML (no auth required for docs page). |
| GET | `/api/admin/openapi.json` | OpenAPI 3.0 JSON spec. Servers may be rewritten from request origin / `NEXT_PUBLIC_APP_URL`. |

**Implementation:** `app/api/admin/docs/route.ts`, `app/api/admin/openapi.json/route.ts`. Spec: `lib/swagger-spec.ts`; paths: `lib/swagger-paths/`.

---

## File reference

| Area | Files |
|------|--------|
| Auth | `lib/admin-auth.ts` |
| Spec | `lib/swagger-spec.ts`, `lib/swagger-paths/*.ts` |
| Sessions | `app/api/admin/sessions/route.ts`, `app/api/admin/sessions/[id]/route.ts` |
| Applications | `app/api/admin/applications/route.ts`, `app/api/admin/applications/[id]/route.ts`, `app/api/admin/applications/[id]/form/route.ts`, `app/api/admin/applications/[id]/admission-letter/route.ts`, `app/api/admin/applications/export/route.ts` |
| Admissions | `app/api/admin/admissions/route.ts`, `app/api/admin/admissions/[id]/route.ts`, `app/api/admin/admissions/bulk/route.ts`, `app/api/admin/admissions/resource/route.ts` |
| Payments | `app/api/admin/payments/route.ts`, `app/api/admin/payments/[id]/verify/route.ts` |
| Analytics | `lib/analytics.ts`, `app/api/admin/analytics/enrollment/route.ts`, `app/api/admin/analytics/financial/route.ts` |
| Docs | `app/api/admin/docs/route.ts`, `app/api/admin/openapi.json/route.ts` |
