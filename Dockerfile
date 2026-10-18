# Stage 1: Build the Vite React PWA
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies cleanly
RUN npm install

# Copy source code and assets
COPY . .

# Build production assets (including PWA service worker and manifest)
RUN npm run build

# Stage 2: Ultra-lightweight production web server
FROM nginx:alpine

# Copy custom Nginx configuration optimized for SPA & PWA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Port exposed by the container
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
