import { extendZodWithOpenApi, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

extendZodWithOpenApi(z);

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { ServiceResponse } from "@/common/models/serviceResponse";

export const healthCheckRegistry = new OpenAPIRegistry();
export const heatlthCheckPlugin: FastifyPluginAsync = async (fastify, _options) => {
	fastify.get("/", (_req: FastifyRequest, res: FastifyReply) => {
		const serviceResponse = ServiceResponse.success("Service is healthy", null);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	});
};

healthCheckRegistry.registerPath({
	method: "get",
	path: "/health-check",
	tags: ["Health Check"],
	responses: createApiResponse(z.null(), "Success"),
});
