export const paymentPaths = {
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
};

export const analyticsPaths = {
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
};
