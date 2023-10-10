FROM node:18

COPY .docker_home/.aws/credentials /root/.aws/credentials
COPY .docker_home/.aws/config /root/.aws/config

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install

# Bundle app source
COPY . /usr/src/app

# Build minified app bundle
RUN yarn run build

CMD [ "yarn", "run", "start" ]


