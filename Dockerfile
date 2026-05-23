# Use a lightweight Nginx image
FROM nginx:alpine

# Copy all website files into the Nginx public folder
COPY . /usr/share/nginx/html/

# Expose port 80 for web traffic
EXPOSE 80
