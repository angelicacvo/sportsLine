
# syntax=docker/dockerfile:1

FROM node:22-alpine
WORKDIR /app

# System deps for native modules like bcrypt
RUN apk add --no-cache python3 make g++

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 3000
# Run migrations first, then start app with ts-node ESM
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node --import ts-node/esm -r dotenv/config app.ts"]
