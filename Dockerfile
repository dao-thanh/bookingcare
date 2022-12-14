FROM node:12-alpine
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json .

COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
EXPOSE 8080

CMD ["npm", "start"]