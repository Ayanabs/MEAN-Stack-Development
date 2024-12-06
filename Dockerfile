# Stage 1: Build Angular App
FROM node:16-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the Angular app source code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Stage 2: Serve the App
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/dist/<your-angular-app> /usr/share/nginx/html

# Expose the port for the Nginx server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
