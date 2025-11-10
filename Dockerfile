# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose the port
EXPOSE $PORT

# Start the application
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "$PORT"]