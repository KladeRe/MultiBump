# Pull Node.js Docker image
FROM node:alpine

# Set working directory
WORKDIR /usr/local/client

# Copu package.json file
COPY package.json .

# Install dependencies
RUN npm install

# Expose port
EXPOSE 4367

# Command for starting the frontend
CMD ["npm", "run", "dev"]