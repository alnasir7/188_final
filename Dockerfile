FROM node:16

# Create app directory
WORKDIR /

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install


COPY . .

WORKDIR /chitchat
RUN npm install
RUN npm run-script build

WORKDIR /

EXPOSE 8080
CMD [ "node", "server.js" ]