# Use Node.js for building the Angular app
FROM node:20-alpine AS builder

# Install Angular CLI globally
RUN npm install -g @angular/cli@19.0.4

# Set the working directory
WORKDIR /src

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code and build the Angular app
COPY . .
RUN npm run build  --configuration=production

# Use Nginx to serve the built files
FROM nginx:alpine
COPY --from=builder src/dist/app-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
