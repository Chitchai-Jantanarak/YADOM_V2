FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies and tsx (TypeScript executor for ESM)
RUN npm ci && npm install -g tsx

# Copy all backend files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port 5000
EXPOSE 5000

# Start the server using tsx (which handles ESM TypeScript files)
# Added seeding step that runs conditionally based on SEED_DATABASE env var
CMD ["sh", "-c", "echo 'Waiting for MySQL...' && sleep 15 && npx prisma migrate deploy && if [ \"$SEED_DATABASE\" = \"true\" ]; then echo 'Seeding database...' && tsx prisma/seed.ts; fi && echo 'Starting server...' && tsx src/index.ts"]

# Note: The above command waits for MySQL to be ready, runs migrations, optionally seeds the database, and then starts the server.