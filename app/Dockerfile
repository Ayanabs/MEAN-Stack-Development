# Stage 1: Build
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app



# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the Angular app source code
COPY . .

# Debug: List files to verify if everything is copied correctly
RUN ls -alh

# Build the Angular app
RUN npm run build --prod
