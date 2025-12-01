import { defineConfig } from "drizzle-kit";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/common/utils/envConfig";

export default defineConfig({
	dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
	schema: "./src/db/schema.ts",
});

export const db = drizzle({
	connection: {
		connectionString: env.DATABASE_URL,
		ssl: true,
	},
});

export const result = await db.execute("SELECT 1");
