# Use an official Node.js 18 image as the base image
FROM node:18-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the app source code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Set up a simple HTTP server to serve the built app
FROM nginx:alpine

# Copy the build folder from the build image to the nginx folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
