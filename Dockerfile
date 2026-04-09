FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY nest-cli.json tsconfig*.json ./
COPY src ./src

RUN npx prisma generate && npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
