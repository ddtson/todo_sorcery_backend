# Base stage with pnpm setup
FROM cgr.dev/chainguard/node:latest-dev AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

USER root

RUN apk update && apk add nodejs \
    cairo-dev libjpeg-turbo-dev pango-dev giflib-dev \
    librsvg-dev glib-dev harfbuzz-dev fribidi-dev expat-dev libxft-dev

WORKDIR /app

# Production dependencies stage
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --ignore-scripts

# Build stage - install all dependencies and build
FROM base AS build
COPY package.json pnpm-lock.yaml ./
# Install all dependencies (including dev dependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm run build

# Final stage - combine production dependencies and build output
FROM cgr.dev/chainguard/wolfi-base:latest AS runner

RUN apk update && apk add nodejs \
    cairo-dev libjpeg-turbo-dev pango-dev giflib-dev \
    librsvg-dev glib-dev harfbuzz-dev fribidi-dev expat-dev libxft-dev


WORKDIR /app
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

# Expose port 8080
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]
