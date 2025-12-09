import path from 'node:path';
import cors from '@fastify/cors';
import fastifyExpress from '@fastify/express';
import fastifyFormBody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';
import { pino } from 'pino';
import { heatlthCheckPlugin } from '@/api/healthCheck/healthCheckRouter';
import { userRouterPlugin } from '@/api/user/userRouter';
import { env } from '@/common/utils/envConfig';

const app = fastify({ logger: true, trustProxy: true });

const logger = pino({ name: 'server start' });

// Middlewares
app.register(fastifyExpress, { expressHook: 'preHandler' });
app.register(fastifyFormBody);
app.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true,
});
app.register(helmet);

app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// Routes
app.register(heatlthCheckPlugin, { prefix: '/health-check' });
app.register(userRouterPlugin, { prefix: '/users' });

// Error handlers
app.setErrorHandler((_err, _req, reply) => {
  reply.status(500).send({ ok: false });
});

app.register((app, _options, next) => {
  app.setErrorHandler((err, _req, _reply) => {
    throw err;
  });
  next();
});

export { app, logger };
