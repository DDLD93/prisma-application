export const sessionPaths = {
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
  "/sessions/{id}": {
    patch: {
      summary: "Update application session",
      description: "Partially update a session. All body fields are optional.",
      tags: ["Sessions"],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateSessionBody" },
          },
        },
      },
      responses: {
        "200": {
          description: "Updated session",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Session" },
            },
          },
        },
        "400": { description: "Invalid JSON", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        "401": { description: "Invalid or missing X-Admin-API-Key", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
        "404": { description: "Session not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
    },
  },
};
