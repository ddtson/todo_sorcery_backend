import fs from "node:fs";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import jsrender from "jsrender";
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

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

const templ = jsrender.templates(fs.readFileSync('./templates/index.html', 'utf-8'));

// Routes
app.get("/", (_req, res) => {
	const data = {
		title: "Hello world",
		message: "This is a server-rendered page using JSRender",
        name: 'Jim',
		items: [{
			label: 'Hello',
		}, {
			label: 'Rabbit',
		}, {
			label: 'This is Marry'
		}]
	};
    const html = templ.render(data)
	res.send(html)
});
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
