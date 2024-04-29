FROM node:22-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
COPY ./package.json /app/package.json
COPY ./.nvmrc /app/.nvmrc
COPY ./public /app/public
COPY ./src /app/src
COPY ./.prettierrc /app/.prettierrc
COPY ./postcss.config.cjs /app/postcss.config.cjs
COPY ./.eslintrc /app/.eslintrc
COPY ./tailwind.config.js /app/tailwind.config.js
COPY ./tsconfig.json /app/tsconfig.json
COPY ./tsconfig.node.json /app/tsconfig.node.json
COPY ./vite.config.ts /app/vite.config.ts
COPY ./index.html /app/index.html

WORKDIR /app

FROM base as prod-deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM --platform=$BUILDPLATFORM base as build

COPY . /app

ARG BUILD_NUMBER
ENV REACT_APP_BUILD_NUMBER=${BUILD_NUMBER}

ARG PUBLIC_URL
ENV PUBLIC_URL=${PUBLIC_URL}

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN sed -i "s@PUBLIC_URL@${PUBLIC_URL}@g" /app/dist/index.html

FROM nginx:alpine

ARG BUILD_NUMBER
ENV REACT_APP_BUILD_NUMBER=${BUILD_NUMBER}

ARG PUBLIC_URL
ENV PUBLIC_URL=${PUBLIC_URL}
ENV DOLLAR='$'

RUN apk update && apk upgrade && apk add bash

COPY ./nginx/default.template /nginx.template
RUN envsubst < /nginx.template > /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx-entrypoint.sh nginx-entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "bash", "/nginx-entrypoint.sh" ]