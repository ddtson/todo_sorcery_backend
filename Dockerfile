# Base stage with pnpm setup
FROM cgr.dev/chainguard/node:latest-dev AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

USER root

RUN apk update && apk add nodejs \
    cairo-dev libjpeg-turbo-dev pango-dev giflib-dev \
    librsvg-dev glib-dev harfbuzz-dev fribidi-dev expat-dev libxft-dev

# Set up pnpm environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack (built-in pnpm support in recent node versions)
RUN corepack enable

WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
# Use Docker cache mounts for faster subsequent builds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code and build the application
COPY . .
RUN pnpm run build

# Final stage - combine production dependencies and build output
FROM cgr.dev/chainguard/wolfi-base:latest AS runner

WORKDIR /app
# Optional: Add tini as a proper init process for signal handling
# RUN apk update && apk add tini # This requires the -dev image or installing apk tools

# Copy only production dependencies and compiled code from the build stage
COPY --from=build /app/package.json ./package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist

# Expose port 8080
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]
