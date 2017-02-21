FROM netczuk/node-yarn
# Create app directory
RUN mkdir -p /usr/src/socket
WORKDIR /usr/src/socket
# Install app dependencies
COPY package.json /usr/src/socket/
COPY yarn.lock /usr/src/socket/
RUN yarn
# Bundle app source
COPY . /usr/src/socket
EXPOSE 5500
CMD [ "yarn", "start" ]