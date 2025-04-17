# Stage 1: Build
FROM node:22.14-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Production
FROM node:22.14-alpine AS runner

WORKDIR /app

# Only copy necessary files from build stage
COPY --from=builder /app/.output .output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
