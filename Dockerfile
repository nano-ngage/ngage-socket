FROM node:boron
# Create app directory
RUN mkdir -p /usr/src/socket
WORKDIR /usr/src/socket
# Install app dependencies
COPY package.json /usr/src/socket/
RUN npm install
# Bundle app source
COPY . /usr/src/socket
EXPOSE 5500
CMD [ "npm", "start" ]