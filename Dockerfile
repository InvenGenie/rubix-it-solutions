# Use a lightweight Nginx image
FROM nginx:alpine

# Copy files to Nginx public folder
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80
git add Dockerfile
git commit -m "fix: change base image from node to php-apache"
git push origin main
