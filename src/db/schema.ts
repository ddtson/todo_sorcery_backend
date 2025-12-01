import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/common/utils/envConfig";

export { users } from "./users";

export const db = drizzle({
	connection: {
		connectionString: env.DATABASE_URL,
		ssl: true,
	},
});
