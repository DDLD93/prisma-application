import "dotenv/config";
import { defineConfig } from "prisma/config";

// Fallback for prisma generate when DATABASE_URL is not set (e.g. CI)
const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://localhost:5432/sep?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});
