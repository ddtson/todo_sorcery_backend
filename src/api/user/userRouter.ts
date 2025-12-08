import type { FastifyPluginAsync } from "fastify";
import { userController } from "./userController";

export const userRouterPlugin: FastifyPluginAsync = async (fastify, _options) => {
	fastify.get("/", userController.getUsers);
	fastify.get("/:id", userController.getUser);
};