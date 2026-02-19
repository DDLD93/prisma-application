export const admissionPaths = ({
  "/admissions": {
    get: {
      summary: "List admissions",
      description: "Returns admissions with optional filters and pagination. Includes application and session summary.",
      tags: ["Admissions"],
      parameters: [
        { name: "sessionId", in: "query", schema: { type: "string" }, description: "Filter by session ID" },
        { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "OFFERED", "ACCEPTED", "DECLINED"] }, description: "Filter by admission status" },
        { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number (1-based)" },
        { name: "limit", in: "query", schema: { type: "integer", default: 20 }, description: "Items per page (max 100)" },
      ],
      responses: {
        "200": {
          description: "Paginated list of admissions",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaginatedAdmissions" },
            },
          },
        },
        "401": { description: "Invalid or missing X-Admin-API-Key", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
    post: {
      summary: "Create admission",
      description: "Create an admission for an application. Application must exist and must not already have an admission.",
      tags: ["Admissions"],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateAdmissionBody" },
            example: { applicationId: "clx...", class: "Primary 1", status: "OFFERED" },
          },
        },
      },
      responses: {
        "200": {
          description: "Created admission",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Admission" },
            },
          },
        },
        "400": { description: "Missing applicationId, application not found, or already has admission", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        "401": { description: "Invalid or missing X-Admin-API-Key", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        "404": { description: "Application not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
  },
  "/admissions/bulk": {
    post: {
      summary: "Bulk create admissions",
      description: "Create multiple admissions. Each item must have applicationId. Applications that already have an admission are skipped and reported in errors.",
      tags: ["Admissions"],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/BulkAdmissionsBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Created admissions and any errors",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BulkAdmissionsResponse" },
            },
          },
        },
        "400": { description: "Body must contain array 'admissions'", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        "401": { description: "Invalid or missing X-Admin-API-Key", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
  },
  "/admissions/resource": {
    get: {
      summary: "Admission resource (stats)",
      description: "Aggregate admission counts: total, by status, by class. Optional query sessionId filters by session; when omitted, returns overall stats and includes bySession breakdown.",
      tags: ["Admissions"],
      parameters: [
        { name: "sessionId", in: "query", schema: { type: "string" }, description: "Optional. Filter stats by session; when omitted, returns overall stats with bySession." },
      ],
      responses: {
        "200": {
          description: "Admission resource counts",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AdmissionResource" },
            },
          },
        },
        "401": { description: "Invalid or missing X-Admin-API-Key", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
  },
  "/admissions/{id}": {
    get: {
      summary: "Get admission by ID",
      description: "Returns a single admission with application and session summary.",
      tags: ["Admissions"],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "Admission details",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Admission" },
            },
          },
        },
        "401": { description: "Invalid or missing X-Admin-API-Key", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        "404": { description: "Admission not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
    patch: {
      summary: "Update admission",
      description: "Update admission class and/or status.",
      tags: ["Admissions"],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateAdmissionBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Updated admission",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Admission" },
            },
          },
        },
        "400": { description: "Invalid JSON", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        "401": { description: "Invalid or missing X-Admin-API-Key", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        "404": { description: "Admission not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
    delete: {
      summary: "Delete admission",
      description: "Deletes the admission record.",
      tags: ["Admissions"],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "Deleted",
          content: {
            "application/json": {
              schema: { type: "object", properties: { ok: { type: "boolean", example: true } } },
            },
          },
        },
        "401": { description: "Invalid or missing X-Admin-API-Key", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        "404": { description: "Admission not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
      },
    },
  },
});
