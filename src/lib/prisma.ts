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

const rawUrl = process.env.DATABASE_URL || '';
const effectiveUrl = rawUrl;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: effectiveUrl ? { db: { url: effectiveUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Execute an operation with automatic retry on severed connection pool connections (e.g. E57P01, disconnects).
 */
export async function withPrismaRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      const isConnectionError =
        err?.code === 'P1001' ||
        err?.code === 'P1017' ||
        err?.message?.includes('ProcessInterrupts') ||
        err?.message?.includes('terminating connection') ||
        err?.message?.includes('closed') ||
        err?.message?.includes('Connection') ||
        err?.cause?.message?.includes('terminating connection');

      if (isConnectionError && attempt <= retries) {
        console.warn(`[Prisma] Serverless connection severed, reconnecting (attempt ${attempt}/${retries})...`);
        try {
          await prisma.$disconnect();
          await prisma.$connect();
        } catch {}
        // Wait 300ms before retry
        await new Promise((res) => setTimeout(res, 300));
        continue;
      }
      throw err;
    }
  }
}

