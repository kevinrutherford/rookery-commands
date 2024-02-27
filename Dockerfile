FROM node:18-alpine AS node
ENV NODE_OPTIONS --unhandled-rejections=strict --enable-source-maps

RUN addgroup -g 17000 wiki \
  && adduser -u 17000 -G wiki -D wiki \
  && mkdir -p /var/opt/zk \
  && chown wiki /var/opt/zk \
  && chgrp wiki /var/opt/zk
USER wiki
RUN mkdir -p /home/wiki
WORKDIR /home/wiki
EXPOSE 8081
VOLUME /var/opt/zk

COPY package.json package-lock.json ./

# Stage: Development NPM install - - - - - - - - - - - - - - - - - - - - - -
#
FROM node AS npm-dev
RUN npm ci

# Stage: Development environment - - - - - - - - - - - - - - - - - - - - - - -
#
FROM node AS dev
ENV NODE_ENV=development

COPY .eslintignore \
  .eslintrc.js \
  tsconfig.json \
  tsconfig.lint.json \
  ./
COPY --from=npm-dev /home/wiki/ .
COPY scripts/ scripts/
COPY src/ src/

CMD ["sh", "./scripts/start-dev.sh"]

