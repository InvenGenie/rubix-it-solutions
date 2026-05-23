# Use a lightweight base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy your website files 
COPY . .

# Expose the port your website will run on
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
