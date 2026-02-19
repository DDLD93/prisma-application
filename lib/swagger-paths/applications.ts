export const applicationPaths = {
  "/applications": {
    get: {
      summary: "List applications",
      description: "Returns applications with optional filters and pagination.",
      tags: ["Applications"],
      parameters: [
        { name: "status", in: "query", schema: { type: "string", enum: ["SUBMITTED", "PAID", "COMPLETED"] }, description: "Filter by application status" },
        { name: "sessionId", in: "query", schema: { type: "string" }, description: "Filter by session ID" },
        { name: "class", in: "query", schema: { type: "string" }, description: "Filter by application class" },
        { name: "dateFrom", in: "query", schema: { type: "string", format: "date-time" }, description: "Filter by createdAt >= dateFrom" },
        { name: "dateTo", in: "query", schema: { type: "string", format: "date-time" }, description: "Filter by createdAt <= dateTo" },
        { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Page number (1-based)" },
        { name: "limit", in: "query", schema: { type: "integer", default: 20 }, description: "Items per page (max 100)" },
        { name: "sort", in: "query", schema: { type: "string", enum: ["createdAt", "updatedAt"], default: "createdAt" }, description: "Sort field" },
        { name: "order", in: "query", schema: { type: "string", enum: ["asc", "desc"], default: "desc" }, description: "Sort order" },
      ],
      responses: {
        "200": {
          description: "Paginated list of applications with session and payments",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaginatedApplications" },
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
  "/applications/{id}/admission-letter": {
    get: {
      summary: "Download admission letter PDF",
      description: "Returns the admission letter as a PDF for the application. Requires an admission record to exist.",
      tags: ["Applications"],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Application ID" },
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
        "401": { description: "Invalid or missing X-Admin-API-Key", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        "403": { description: "No admission record for this application", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        "404": { description: "Application not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        "500": { description: "PDF generation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
    },
  },
};
