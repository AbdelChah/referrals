# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps to resolve any conflicts
RUN npm install --legacy-peer-deps

# Copy the source code into the container
COPY . .

# Expose the port the React dev server will run on
EXPOSE 3000

# Command to start the React app in development mode
CMD ["npm", "start"]
