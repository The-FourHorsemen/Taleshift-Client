import type { Config } from "drizzle-kit";

const url = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5433/taleshift";
console.error("USING URL:", url);

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
} satisfies Config;