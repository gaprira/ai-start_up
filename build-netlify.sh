#!/bin/bash
# Build script for Netlify - switches to PostgreSQL for production

# Replace SQLite with PostgreSQL in schema
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
sed -i 's|url      = env("DATABASE_URL")|url      = env("DATABASE_URL")\n  relationMode = "prisma"|' prisma/schema.prisma

# Generate Prisma client
npx prisma generate

# Build Next.js
npx next build
