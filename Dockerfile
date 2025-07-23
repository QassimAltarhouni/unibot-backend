#FROM node:18-alpine as builder
#RUN mkdir /usr/app
#COPY . /usr/app
#WORKDIR /usr/app
##ENV NODE_ENV=production
#RUN npm install prettier -g
#RUN npm install
#RUN npm run build
#CMD ["node" , "build/app.js"]

FROM node:18-alpine
# RUN mkdir /usr/app
WORKDIR /usr/app
COPY package.json .
RUN npm install typescript -g && npm install
COPY . .
#ENV NODE_ENV=production
EXPOSE 3000
RUN tsc
CMD ["node", "-r ts-node/register/transpile-only -r tsconfig-paths/register build/src/app.js"]
