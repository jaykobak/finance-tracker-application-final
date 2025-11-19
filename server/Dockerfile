# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer cache)
COPY package*.json ./
# Ensure Prisma schema is present before install (postinstall may run prisma generate)
COPY prisma ./prisma
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client for production
RUN npx prisma generate

# Optional build step (noop if no build script)
RUN npm run build || echo "no build step"

# Prune dev dependencies for production
RUN npm prune --omit=dev

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Change this if you prefer another port
ENV PORT=8080

# Copy installed node_modules and app files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

# Expose the app port
EXPOSE 8080

# Start the server (uses process.env.PORT inside src/server.js)
CMD ["node", "src/server.js"]
