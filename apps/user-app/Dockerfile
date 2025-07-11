FROM node:20-alpine

WORKDIR /monorepo

COPY package.json package-lock.json ./

COPY apps/user-app/package.json ./apps/user-app/
COPY packages/ ./packages/

RUN npm install --workspace=apps/user-app
RUN npm run db:generate
ENV NODE_ENV="production"
ENV DATABASE_URL="postgresql://postgres:randompassword@host.docker.internal:5430/postgres"
# RUN npm run db:seed

WORKDIR /monorepo/packages/ui
RUN npm run build:styles
RUN npm run build:components

WORKDIR /monorepo/apps/user-app 
COPY apps/user-app/tsconfig.json ./
COPY apps/user-app/ ./ 


ENV NEXTAUTH_SECRET="randompasecret"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV GOOGLE_CLIENT_ID=""
ENV GOOGLE_CLIENT_SECRET=""
ENV GITHUB_ID=""
ENV GITHUB_SECRET=""
ENV NEXT_PUBLIC_API_URL="http://localhost:3000"
ENV NEXT_PUBLIC_MOCK_BANK_URL="http://host.docker.internal:3004"
ENV NEXT_PUBLIC_BANK_CALLBACK_URL="http://host.docker.internal:3003/bankWebhook"
ENV REDIS_URL="redis://host.docker.internal:6379"

RUN npm run build

RUN npm prune --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]