# Stage 1: Build Stage
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the source code
COPY . .

# Increase the memory allocation for Node.js during build
RUN node --max-old-space-size=4096 node_modules/.bin/react-scripts build

# Stage 2: Serve Stage (Optional)
# Using a lighter image to serve the build output
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the build artifacts from the build stage
COPY --from=build /usr/src/app/build /usr/src/app/build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application (with a memory limit increase if needed)
CMD ["npm", "start"]
