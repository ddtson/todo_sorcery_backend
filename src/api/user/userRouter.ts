import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { GetUserSchema, UserSchema } from "@/api/user/userModel";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouterPlugin: FastifyPluginAsync = async (fastify, _options) => {
	fastify.get("/", userController.getUsers);
	fastify.get("/:id", userController.getUser);
};

extendZodWithOpenApi(z);

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
	method: "get",
	path: "/users",
	tags: ["User"],
	responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRegistry.registerPath({
	method: "get",
	path: "/users/{id}",
	tags: ["User"],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});
