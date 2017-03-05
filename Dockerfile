FROM node:boron

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

EXPOSE 6789

CMD [ "npm", "start" ]