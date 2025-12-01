import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { timestamps } from "./common";

export const rolesEnum = t.pgEnum("roles", ["guest", "user", "admin"]);

export const users = pgTable(
	"users",
	{
		id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
		first_name: t.varchar("first_name", { length: 256 }),
		last_name: t.varchar("last_name", { length: 256 }),
		email: t.varchar("email"),
		password_hash: t.varchar("password_hash"),
		role: rolesEnum().default("guest"),
		...timestamps,
	},
	(table) => [t.uniqueIndex("email_idx").on(table.email)],
);
