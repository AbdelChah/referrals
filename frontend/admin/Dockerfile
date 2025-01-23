# Use a lightweight Nginx image
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy the prebuilt `build` folder from the repository
COPY ./build .

# Expose port 80 for the Nginx server
EXPOSE 80

# Run Nginx in the foreground as the main process
CMD ["nginx", "-g", "daemon off;"]