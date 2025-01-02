# Uses alpine image small memory footprint
FROM node:20-alpine

# Creates working directory inside the container
WORKDIR /usr/local/app

# Copyies package.json to container for dependency installation
COPY package.json .

# Installs npm dependencies
RUN npm install

# Copies recently installed dependencies
COPY . .

# Backend runs on port 5228
EXPOSE 5228

# Command for starting the backend
CMD ["npm", "run", "start"]