FROM node:20-alpine

WORKDIR /monorepo

COPY package.json package-lock.json ./

COPY apps/bank_webhook_handler/package.json ./apps/bank_webhook_handler/
COPY packages/eslint-config/ ./packages/eslint-config/
COPY packages/typescript-config/ ./packages/typescript-config/
COPY packages/redis/ ./packages/redis/
COPY packages/db/ ./packages/db/

RUN npm install --workspace=apps/bank_webhook_handler
RUN npm run db:generate
# RUN npm run db:seed

WORKDIR /monorepo/apps/bank_webhook_handler
COPY apps/bank_webhook_handler/tsconfig.json ./
COPY apps/bank_webhook_handler/src ./src/

ENV BANK_WEBHOOK_SECRET="capybara"
ENV MOCK_BANK_URL="http://mock-bank:3004"
ENV DATABASE_URL="postgresql://postgres:randompassword@host.docker.internal:5430/postgres"
ENV REDIS_URL="redis://host.docker.internal:6379"
RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3003
CMD ["npm", "run", "start"]