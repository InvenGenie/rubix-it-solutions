# Use a lightweight base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package*.json to the working directory
COPY package*.json ./package.json

# Copy other files and directories
COPY . .

# Install dependencies
RUN npm install

# Expose the port your website will run on
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
