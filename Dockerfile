# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm ci --only=production

# Copy backend source code
COPY backend/ ./backend/

# Create uploads directory
RUN mkdir -p ./backend/uploads/documents

# Expose port
EXPOSE 3003

# Set environment to production
ENV NODE_ENV=production

# Start the backend server
CMD ["npm", "start", "--prefix", "backend"]
