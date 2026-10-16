/**
 * Real-time User Presence & Mode Store
 *
 * Lightweight in-memory store tracking active users and their active learning mode
 * (Simple Mode vs Technical Mode), active path, and language.
 * Automatically evicts stale entries after 10 minutes of inactivity.
 */

export interface PresenceRecord {
  sessionId: string;
  userId?: string | null;
  name: string;
  email?: string | null;
  role: string;
  mode: 'simple' | 'technical';
  page: string;
  language: string;
  lastSeen: number; // Epoch ms
  firstSeen: number;
}

export interface PresenceEvent {
  id: string;
  timestamp: number;
  sessionId: string;
  userId?: string | null;
  name: string;
  email?: string | null;
  role: string;
  mode: 'simple' | 'technical';
  page: string;
  language: string;
  type: 'joined' | 'mode_switch' | 'navigated' | 'heartbeat';
  details?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __quanbit_presence_store__: Map<string, PresenceRecord> | undefined;
  // eslint-disable-next-line no-var
  var __quanbit_presence_events__: PresenceEvent[] | undefined;
}

const presenceStore: Map<string, PresenceRecord> =
  globalThis.__quanbit_presence_store__ ?? new Map<string, PresenceRecord>();

// Ring buffer of historical events, capped at 250 items to prevent memory bloat
const MAX_HISTORY_EVENTS = 250;
const presenceEventLog: PresenceEvent[] =
  globalThis.__quanbit_presence_events__ ?? [];

if (process.env.NODE_ENV !== 'production') {
  globalThis.__quanbit_presence_store__ = presenceStore;
  globalThis.__quanbit_presence_events__ = presenceEventLog;
}

// 15 minutes maximum age for keeping a live presence record
const EVICTION_TTL_MS = 15 * 60 * 1000;
// 3 minutes for considering a user "Online Right Now" (matches 120s heartbeat interval + jitter)
const ONLINE_THRESHOLD_MS = 3 * 60 * 1000;

export function recordPresence(data: {
  sessionId: string;
  userId?: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  mode: 'simple' | 'technical';
  page: string;
  language: string;
}): void {
  const now = Date.now();
  const existing = presenceStore.get(data.sessionId);

  const record: PresenceRecord = {
    sessionId: data.sessionId,
    userId: data.userId || existing?.userId || null,
    name: data.name || existing?.name || (data.userId ? 'Student' : `Guest ${data.sessionId.slice(-4)}`),
    email: data.email || existing?.email || null,
    role: data.role || existing?.role || (data.userId ? 'STUDENT' : 'GUEST'),
    mode: data.mode === 'technical' ? 'technical' : 'simple',
    page: data.page || '/',
    language: data.language || 'en',
    lastSeen: now,
    firstSeen: existing?.firstSeen || now,
  };

  presenceStore.set(data.sessionId, record);

  // Append to history log (latest first)
  let eventType: PresenceEvent['type'] = 'heartbeat';
  let details = '';

  if (!existing) {
    eventType = 'joined';
    details = `Session started on ${record.page} (${record.mode} mode, ${record.language.toUpperCase()})`;
  } else if (existing.mode !== record.mode) {
    eventType = 'mode_switch';
    details = `Switched from ${existing.mode} mode to ${record.mode} mode`;
  } else if (existing.page !== record.page) {
    eventType = 'navigated';
    details = `Navigated from ${existing.page} to ${record.page}`;
  } else {
    // Only log periodic heartbeat if at least 2 minutes have passed since last log for this session
    const lastSessionEvent = presenceEventLog.find((e) => e.sessionId === data.sessionId);
    if (!lastSessionEvent || now - lastSessionEvent.timestamp > 120_000) {
      eventType = 'heartbeat';
      details = `Active on ${record.page} in ${record.mode} mode`;
    } else {
      eventType = null as any;
    }
  }

  if (eventType) {
    const newEvent: PresenceEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: now,
      sessionId: record.sessionId,
      userId: record.userId,
      name: record.name,
      email: record.email,
      role: record.role,
      mode: record.mode,
      page: record.page,
      language: record.language,
      type: eventType,
      details,
    };

    // Unshift to put latest event on top
    presenceEventLog.unshift(newEvent);

    // Keep ring buffer capped
    if (presenceEventLog.length > MAX_HISTORY_EVENTS) {
      presenceEventLog.length = MAX_HISTORY_EVENTS;
    }
  }

  // Periodic eviction of expired sessions
  if (Math.random() < 0.1) {
    pruneStalePresence();
  }
}

export function pruneStalePresence(): void {
  const now = Date.now();
  presenceStore.forEach((record, key) => {
    if (now - record.lastSeen > EVICTION_TTL_MS) {
      presenceStore.delete(key);
    }
  });
}

export function getPresenceStats() {
  pruneStalePresence();
  const now = Date.now();
  const allRecords = Array.from(presenceStore.values()).sort((a, b) => b.lastSeen - a.lastSeen);

  const onlineRecords = allRecords.filter((r) => now - r.lastSeen <= ONLINE_THRESHOLD_MS);

  let simpleCount = 0;
  let technicalCount = 0;
  const pageDistribution: Record<string, number> = {};
  const languageDistribution: Record<string, number> = {};

  for (const r of onlineRecords) {
    if (r.mode === 'technical') {
      technicalCount++;
    } else {
      simpleCount++;
    }

    pageDistribution[r.page] = (pageDistribution[r.page] || 0) + 1;
    languageDistribution[r.language] = (languageDistribution[r.language] || 0) + 1;
  }

  return {
    totalActiveNow: onlineRecords.length,
    totalRecentUsers: allRecords.length,
    simpleModeCount: simpleCount,
    technicalModeCount: technicalCount,
    pageDistribution,
    languageDistribution,
    users: allRecords.slice(0, 50), // Top 50 most recently active users
    historyLogs: presenceEventLog.slice(0, 100), // Top 100 latest history events (latest on top)
  };
}
