import path from "node:path";
import cors from "cors";
import { Eta } from "eta";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";

const logger = pino({ name: "server start" });
const app: Express = express();
const eta = new Eta({
	views: path.join(__dirname, "views"),
	cache: true,
});

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(
	helmet({
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
	}),
);
if (process.env.NODE_ENV !== "development") {
	app.use(rateLimiter);
}

// settings
app.use(express.static("public", {}));

// Request logging
app.use(requestLogger);

// Routes
app.get("/", (_req, res) => {
	const renderedTemplate = eta.render("index", { message: "Yummy" });
	res.status(200).send(renderedTemplate);
});
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
