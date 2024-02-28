FROM node:18-alpine AS node
ENV NODE_OPTIONS --unhandled-rejections=strict --enable-source-maps

RUN mkdir -p /srv/app
WORKDIR /srv/app
EXPOSE 44001

COPY package.json package-lock.json ./

# Stage: Development NPM install - - - - - - - - - - - - - - - - - - - - - -
#
FROM node AS npm-dev
RUN npm ci

# Stage: Development environment - - - - - - - - - - - - - - - - - - - - - - -
#
FROM node AS dev
ENV NODE_ENV=development

COPY tsconfig.json .
COPY --from=npm-dev /srv/app .
COPY scripts/ scripts/

CMD ["sh", "./scripts/start-dev.sh"]

