import { openApiPaths } from "./swagger-paths";

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
      UpdateSessionBody: {
        type: "object",
        description: "All fields optional for partial update.",
        properties: {
          year: { type: "integer" },
          openAt: { type: "string", format: "date-time" },
          closeAt: { type: "string", format: "date-time" },
          amount: { type: "number" },
          availableClasses: { type: "array", items: { type: "string" } },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE", "CONCLUDED"] },
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
      Admission: {
        type: "object",
        properties: {
          id: { type: "string" },
          applicationId: { type: "string" },
          class: { type: "string", nullable: true },
          status: { type: "string", enum: ["PENDING", "OFFERED", "ACCEPTED", "DECLINED"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          application: {
            type: "object",
            properties: {
              id: { type: "string" },
              wardName: { type: "string" },
              sessionId: { type: "string" },
              sessionYear: { type: "integer" },
            },
          },
        },
      },
      CreateAdmissionBody: {
        type: "object",
        required: ["applicationId"],
        properties: {
          applicationId: { type: "string" },
          class: { type: "string", nullable: true, description: "Optional class placement" },
          status: { type: "string", enum: ["PENDING", "OFFERED", "ACCEPTED", "DECLINED"], description: "Optional. Default: PENDING" },
        },
      },
      UpdateAdmissionBody: {
        type: "object",
        properties: {
          class: { type: "string", nullable: true },
          status: { type: "string", enum: ["PENDING", "OFFERED", "ACCEPTED", "DECLINED"] },
        },
      },
      BulkAdmissionsBody: {
        type: "object",
        required: ["admissions"],
        properties: {
          admissions: {
            type: "array",
            items: { $ref: "#/components/schemas/CreateAdmissionBody" },
            description: "List of admissions to create. Skips applications that already have an admission.",
          },
        },
        example: {
          admissions: [
            { applicationId: "clx...", class: "Primary 1", status: "OFFERED" },
            { applicationId: "cly...", status: "PENDING" },
          ],
        },
      },
      BulkAdmissionsResponse: {
        type: "object",
        properties: {
          created: {
            type: "array",
            items: { type: "object", properties: { id: { type: "string" }, applicationId: { type: "string" } } },
          },
          errors: {
            type: "array",
            nullable: true,
            items: { type: "object", properties: { applicationId: { type: "string" }, error: { type: "string" } } },
          },
        },
      },
      PaginatedAdmissions: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Admission" } },
          total: { type: "integer" },
          page: { type: "integer" },
          limit: { type: "integer" },
        },
      },
      AdmissionResource: {
        type: "object",
        description: "Aggregate admission counts. When sessionId is omitted, includes bySession; when provided, counts are for that session only.",
        properties: {
          total: { type: "integer" },
          byStatus: { type: "object", additionalProperties: { type: "integer" } },
          byClass: { type: "object", additionalProperties: { type: "integer" } },
          bySession: {
            type: "array",
            items: {
              type: "object",
              properties: {
                sessionId: { type: "string" },
                year: { type: "integer" },
                count: { type: "integer" },
              },
            },
            description: "Present only when sessionId query param is not set (overall stats).",
          },
        },
      },
      PaginatedApplications: {
        type: "object",
        properties: {
          data: { type: "array", items: { $ref: "#/components/schemas/Application" } },
          total: { type: "integer" },
          page: { type: "integer" },
          limit: { type: "integer" },
        },
      },
    },
  },
  paths: openApiPaths,
};
