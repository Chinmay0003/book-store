# 1. Install dependencies and build the app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build


# Expose port (Next.js default)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
