import path from "node:path";
import cors from "@fastify/cors";
import fastifyExpress from "@fastify/express";
import fastifyFormBody from "@fastify/formbody";
import helmet from "@fastify/helmet";
import fastifyStatic from "@fastify/static";
import { Eta } from "eta";
import fastify from "fastify";
import { pino } from "pino";
import { heatlthCheckPlugin } from "@/api/healthCheck/healthCheckRouter";
// import { userRouter } from "@/api/user/userRouter";
// import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { env } from "@/common/utils/envConfig";

const app = fastify({ logger: true, trustProxy: true });

const logger = pino({ name: "server start" });
const eta = new Eta({
	views: path.join(__dirname, "views"),
	cache: true,
});

// Middlewares
app.register(fastifyExpress, { expressHook: "preHandler" });
app.register(fastifyFormBody);
app.register(cors, {
	origin: env.CORS_ORIGIN,
	credentials: true,
});
app.register(helmet, {
	xContentTypeOptions: false,
	contentSecurityPolicy: {
		directives: {
			"script-src": [
				"cdn.jsdelivr.net",
				"unpkg.com",
				"'sha256-ZswfTY7H35rbv8WC7NXBoiC7WNu86vSzCDChNWwZZDM='",
				"'self'",
			],
			"style-src": ["pub-8df06e1133a54d06aa617e7bdeeb35b6.r2.dev", "cdn.hugeicons.com", "'self'"],
		},
	},
});

app.register(fastifyStatic, {
	root: path.join(__dirname, "public"),
	prefix: "/public/",
});

// Routes
app.get("/", (_req, res) => {
	const renderedTemplate = eta.render("index", { message: "Yummy" });
	res.status(200).send(renderedTemplate);
});
app.register(heatlthCheckPlugin, { prefix: "/health-check" });
// app.use("/users", userRouter);

// Swagger UI
// app.use(openAPIRouter);

// Error handlers
app.setErrorHandler((_err, _req, reply) => {
	reply.status(500).send({ ok: false })
});

app.register((app, _options, next) => {
	app.setErrorHandler((err, _req, _reply) => {
		throw err;
	});
	next();
});

export { app, logger };
