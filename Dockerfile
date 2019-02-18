FROM node:10-slim

MAINTAINER cs91chris <cs91chris@voidbrain.me>

WORKDIR /opt/odata4

COPY . /opt/odata4

RUN npm install

EXPOSE 1338

ENTRYPOINT ["node"]

CMD ["serverMongo.js"]

