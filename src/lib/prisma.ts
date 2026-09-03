/**
 * Prisma Client Singleton for Next.js
 *
 * In development, Next.js hot-reloads modules on every change, which would
 * create a new PrismaClient instance each time and exhaust the database
 * connection pool. This module stores the client on `globalThis` so the
 * same instance is reused across hot reloads.
 *
 * In production, a single PrismaClient is created and exported normally.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Ensure IPv4 routing to bypass mobile hotspot IPv6 carrier timeouts on port 5432
const rawUrl = process.env.DATABASE_URL || '';
const effectiveUrl = rawUrl.includes('ep-bitter-tooth-axdva9f0')
  ? 'postgresql://neondb_owner:npg_LAaIH17BiYWo@16.59.10.57/neondb?sslmode=require&options=endpoint%3Dep-bitter-tooth-axdva9f0'
  : rawUrl;

export const prisma =
  new PrismaClient({
    datasources: effectiveUrl ? { db: { url: effectiveUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
