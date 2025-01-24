# Use a lightweight Nginx image
FROM nginx:alpine

# Set working directory inside the container
WORKDIR /usr/share/nginx/html

# Remove any existing files in the directory (to avoid conflicts)
RUN rm -rf ./*

# Copy the Vite `build` output into the container
COPY ./build .

# Expose port 80 for the Nginx server
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]