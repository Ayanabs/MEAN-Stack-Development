# Use the official Node.js image
FROM node:20-alpine AS server

# Set the working directory to the root of the backend code
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the port used by your backend (5000 in this case)
EXPOSE 5000

# Start the backend application
CMD ["node", "backend.js"]