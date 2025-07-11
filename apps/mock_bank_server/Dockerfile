FROM node:20-alpine

WORKDIR /monorepo

COPY package.json package-lock.json ./

COPY apps/mock_bank_server/package.json ./apps/mock_bank_server/
COPY packages/eslint-config/ ./packages/eslint-config/
COPY packages/typescript-config/ ./packages/typescript-config/
COPY packages/redis/ ./packages/redis/

RUN npm install --workspace=apps/mock_bank_server

WORKDIR /monorepo/apps/mock_bank_server
COPY apps/mock_bank_server/tsconfig.json ./
COPY apps/mock_bank_server/src ./src/

ENV BANK_WEBHOOK_SECRET="capybara"
ENV REDIS_URL="redis://host.docker.internal:6379"
RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3004
CMD ["npm", "run", "start"]