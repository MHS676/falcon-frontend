# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies (we need devDependencies to build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port (Railway will set PORT env var)
EXPOSE $PORT

# Start the application using npm preview
CMD ["sh", "-c", "npm run preview:railway"]