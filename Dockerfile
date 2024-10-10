# Use an appropriate Node version
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install sequelize pg pg-hstore --save
RUN apt-get update && apt-get install -y postgresql-client && apt-get clean


# Copy the application files
COPY . .

# Build the application (if needed)
RUN npm run build

# Expose the application port
EXPOSE 3000

# Copy the wait script
COPY wait-for-db.sh /usr/local/bin/wait-for-db
RUN chmod +x /usr/local/bin/wait-for-db

# Use the wait script to start the application
CMD ["wait-for-db", "db", "--", "npm", "start"]