FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.16.1 --activate && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 8080
CMD ["pnpm", "start"]
