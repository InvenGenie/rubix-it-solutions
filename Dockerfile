# Use a lightweight base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package*.json to the working directory
COPY package*.json ./package.json

# Install dependencies
RUN npm install

# Copy your website files
COPY . .

# Expose the port your website will run on
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
