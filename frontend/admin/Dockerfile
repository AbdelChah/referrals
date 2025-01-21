# Use the official Nginx image
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy the prebuilt `build` folder to the Nginx default directory
COPY build/ .

# Expose the port Nginx will serve on
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
