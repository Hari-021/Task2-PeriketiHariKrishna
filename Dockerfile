# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Package Backend and Frontend Assets
FROM node:20-alpine
WORKDIR /app

# Copy backend package files and install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend codebase
COPY backend/ ./backend/

# Copy built frontend assets from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set runtime configurations
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Start server
CMD ["node", "backend/server.js"]
