FROM node:16-alpine as deps
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN yarn add glob rimraf
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# production stage
FROM node:16-alpine as production
ENV NODE_ENV production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["node", "dist/src/main"]
