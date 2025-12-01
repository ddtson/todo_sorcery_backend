import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).prefault("production"),

	HOST: z.string().min(1).prefault("localhost"),

	PORT: z.coerce.number().int().positive().prefault(8080),

	CORS_ORIGIN: z.url().prefault("http://localhost:8080"),

	COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().prefault(1000),

	COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().prefault(1000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("❌ Invalid environment variables:", z.treeifyError(parsedEnv.error));
	throw new Error("Invalid environment variables");
}

export const env = {
	...parsedEnv.data,
	isDevelopment: parsedEnv.data.NODE_ENV === "development",
	isProduction: parsedEnv.data.NODE_ENV === "production",
	isTest: parsedEnv.data.NODE_ENV === "test",
};
