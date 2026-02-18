export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "SEP Admin API",
    version: "1.0.0",
    description: "Admin API for sessions, applications, payments, and analytics. Authenticate with the X-Admin-API-Key header.",
  },
  servers: [{ url: "/api/admin", description: "Admin API" }],
  security: [{ AdminApiKey: [] }],
  components: {
    securitySchemes: {
      AdminApiKey: {
        type: "apiKey",
        in: "header",
        name: "X-Admin-API-Key",
        description: "Admin API key. Set in request header for all requests.",
      },
    },
    schemas: {
      Session: {
        type: "object",
        properties: {
          id: { type: "string" },
          year: { type: "integer" },
          openAt: { type: "string", format: "date-time" },
          closeAt: { type: "string", format: "date-time" },
          amount: { type: "number" },
          availableClasses: { type: "array", items: { type: "string" } },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE", "CONCLUDED"] },
        },
      },
      CreateSessionBody: {
        type: "object",
        required: ["year", "openAt", "closeAt", "amount"],
        properties: {
          year: { type: "integer" },
          openAt: { type: "string", format: "date-time" },
          closeAt: { type: "string", format: "date-time" },
          amount: { type: "number" },
          availableClasses: {
            type: "array",
            items: { type: "string" },
            description: "Optional. Default: []",
          },
          status: {
            type: "string",
            enum: ["ACTIVE", "INACTIVE", "CONCLUDED"],
            description: "Optional. Default: ACTIVE",
          },
        },
      },
      PaymentSummary: {
        type: "object",
        properties: {
          id: { type: "string" },
          amount: { type: "number" },
          status: { type: "string" },
          verifiedBy: { type: "string", nullable: true },
        },
      },
      Application: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          wardName: { type: "string" },
          wardDob: { type: "string", format: "date" },
          wardGender: { type: "string" },
          class: { type: "string", nullable: true },
          sessionId: { type: "string" },
          sessionYear: { type: "integer" },
          status: { type: "string", enum: ["SUBMITTED", "PAID", "COMPLETED"] },
          payments: { type: "array", items: { $ref: "#/components/schemas/PaymentSummary" } },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ApplicationWithAdmission: {
        allOf: [
          { $ref: "#/components/schemas/Application" },
          {
            type: "object",
            properties: {
              admission: {
                type: "object",
                nullable: true,
                properties: {
                  id: { type: "string" },
                  status: { type: "string" },
                  class: { type: "string", nullable: true },
                },
              },
            },
          },
        ],
      },
      Payment: {
        type: "object",
        properties: {
          id: { type: "string" },
          applicationId: { type: "string" },
          wardName: { type: "string" },
          sessionYear: { type: "integer" },
          amount: { type: "number" },
          status: { type: "string" },
          verifiedBy: { type: "string", nullable: true },
          reference: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      VerifyPaymentBody: {
        type: "object",
        properties: {
          verifiedBy: {
            type: "string",
            enum: ["API_OVERRIDE", "SYSTEM"],
            description: "Optional. Default: API_OVERRIDE",
          },
        },
      },
      VerifyPaymentResponse: {
        type: "object",
        properties: { ok: { type: "boolean", example: true } },
      },
      EnrollmentAnalytics: {
        type: "object",
        properties: {
          ageBuckets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                bucket: { type: "string" },
                count: { type: "integer" },
              },
            },
          },
          gender: {
            type: "array",
            items: {
              type: "object",
              properties: {
                gender: { type: "string" },
                count: { type: "integer" },
              },
            },
          },
          conversion: {
            type: "object",
            properties: {
              submitted: { type: "integer" },
              paid: { type: "integer" },
              conversionRatePercent: { type: "integer" },
            },
          },
        },
      },
      FinancialSessionSummary: {
        type: "object",
        properties: {
          sessionId: { type: "string" },
          year: { type: "integer" },
          total: { type: "number" },
          verifiedBySystem: { type: "number" },
          verifiedByApiOverride: { type: "number" },
        },
      },
      FinancialAnalytics: {
        type: "object",
        properties: {
          sessions: {
            type: "array",
            items: { $ref: "#/components/schemas/FinancialSessionSummary" },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/sessions": {
      get: {
        summary: "List application sessions",
        description: "Returns all application sessions ordered by year descending.",
        tags: ["Sessions"],
        responses: {
          "200": {
            description: "List of sessions",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Session" },
                },
              },
            },
          },
          "401": {
            description: "Invalid or missing X-Admin-API-Key",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
      post: {
        summary: "Create application session",
        description: "Creates a new application session with opening and closing dates and fee.",
        tags: ["Sessions"],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateSessionBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "Created session",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Session" },
              },
            },
          },
          "400": {
            description: "Missing year, openAt, closeAt, or amount; or invalid JSON",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "401": {
            description: "Invalid or missing X-Admin-API-Key",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/applications": {
      get: {
        summary: "List applications",
        description: "Returns applications with optional filters by status and session.",
        tags: ["Applications"],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["SUBMITTED", "PAID", "COMPLETED"] },
            description: "Filter by application status",
          },
          {
            name: "sessionId",
            in: "query",
            schema: { type: "string" },
            description: "Filter by session ID",
          },
        ],
        responses: {
          "200": {
            description: "List of applications with session and payments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Application" },
                },
              },
            },
          },
          "401": {
            description: "Invalid or missing X-Admin-API-Key",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/applications/export": {
      get: {
        summary: "Export applications as CSV",
        description: "Downloads all applications as a CSV file. Columns: id, wardName, wardDob, wardGender, class, sessionYear, status, createdAt.",
        tags: ["Applications"],
        responses: {
          "200": {
            description: "CSV file",
            content: {
              "text/csv": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
          "401": {
            description: "Invalid or missing X-Admin-API-Key",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/applications/{id}": {
      get: {
        summary: "Get application by ID",
        description: "Returns a single application with session, payments, and admission (if any).",
        tags: ["Applications"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Application details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApplicationWithAdmission" },
              },
            },
          },
          "401": {
            description: "Invalid or missing X-Admin-API-Key",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "404": {
            description: "Application not found",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/applications/{id}/form": {
      get: {
        summary: "Get application form PDF",
        description: "Returns the application form as a PDF file for download.",
        tags: ["Applications"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "PDF file",
            content: {
              "application/pdf": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
          "401": {
            description: "Invalid or missing X-Admin-API-Key",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "404": {
            description: "Application not found",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "500": {
            description: "PDF generation failed",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/payments": {
      get: {
        summary: "List payments",
        description: "Returns all payments with application and session info, ordered by creation date descending.",
        tags: ["Payments"],
        responses: {
          "200": {
            description: "List of payments",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Payment" },
                },
              },
            },
          },
          "401": {
            description: "Invalid or missing X-Admin-API-Key",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/payments/{id}/verify": {
      patch: {
        summary: "Verify payment",
        description: "Marks the payment as completed and updates the related application status to PAID.",
        tags: ["Payments"],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VerifyPaymentBody" },
            },
          },
        },
        responses: {
          "200": {
            description: "Payment verified",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VerifyPaymentResponse" },
              },
            },
          },
          "400": {
            description: "Invalid verifiedBy or invalid JSON",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "401": {
            description: "Invalid or missing X-Admin-API-Key",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
          "404": {
            description: "Payment not found",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/analytics/enrollment": {
      get: {
        summary: "Enrollment analytics",
        description: "Returns age buckets, gender distribution, and conversion (submitted/paid) metrics.",
        tags: ["Analytics"],
        responses: {
          "200": {
            description: "Enrollment analytics",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EnrollmentAnalytics" },
              },
            },
          },
          "401": {
            description: "Invalid or missing X-Admin-API-Key",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
    "/analytics/financial": {
      get: {
        summary: "Financial analytics",
        description: "Returns per-session totals and breakdown by verifiedBy (SYSTEM vs API_OVERRIDE).",
        tags: ["Analytics"],
        responses: {
          "200": {
            description: "Financial analytics",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FinancialAnalytics" },
              },
            },
          },
          "401": {
            description: "Invalid or missing X-Admin-API-Key",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Error" } },
            },
          },
        },
      },
    },
  },
};
