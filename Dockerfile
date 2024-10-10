FROM node:16
# Changed from node: 14 -> 16

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install sequelize pg pg-hstore --save
RUN apt-get update && apt-get install -y postgresql-client && apt-get clean


COPY . .

RUN npm run build

EXPOSE 3000

# Wait Script for DB Init.
COPY wait-for-db.sh /usr/local/bin/wait-for-db
RUN chmod +x /usr/local/bin/wait-for-db

CMD ["wait-for-db", "db", "--", "npm", "start"]