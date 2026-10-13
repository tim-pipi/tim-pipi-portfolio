// Leaderboard storage for the range's clear-all time trial.
//
// Production uses Upstash Redis over its REST API (no client package needed).
// The Vercel Marketplace integration injects either the KV_* or the UPSTASH_*
// variable names depending on how it was set up, so both are accepted. Without
// them, development falls back to an in-memory store and production reports
// the leaderboard as unavailable.

export type Entry = {
  playerId: string;
  name: string;
  timeMs: number;
  shots: number;
  hits: number;
  hs: number;
  at: number;
};

export type Standing = { rank: number; total: number; best: Entry | null };

interface Store {
  bestTime(playerId: string): Promise<number | null>;
  saveBest(entry: Entry): Promise<void>;
  rename(playerId: string, name: string): Promise<void>;
  top(n: number): Promise<Entry[]>;
  standing(playerId: string): Promise<Standing | null>;
  // Counts a submission from this client and returns the count in the window.
  hit(client: string): Promise<number>;
}

const BOARD = 'lb:time';
const playerKey = (id: string) => `lb:player:${id}`;
const RATE_WINDOW_S = 600;

type Cmd = (string | number)[];

function redisStore(url: string, token: string): Store {
  async function pipeline(cmds: Cmd[]): Promise<unknown[]> {
    const res = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(cmds),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Upstash ${res.status}`);
    const out = (await res.json()) as { result?: unknown; error?: string }[];
    return out.map((r) => {
      if (r.error) throw new Error(`Upstash: ${r.error}`);
      return r.result;
    });
  }
  const toEntry = (id: string, flat: unknown): Entry | null => {
    if (!Array.isArray(flat) || flat.length === 0) return null;
    const h: Record<string, string> = {};
    for (let i = 0; i < flat.length; i += 2) h[String(flat[i])] = String(flat[i + 1]);
    return {
      playerId: id,
      name: h.name ?? 'Unknown',
      timeMs: Number(h.timeMs),
      shots: Number(h.shots),
      hits: Number(h.hits),
      hs: Number(h.hs),
      at: Number(h.at),
    };
  };

  return {
    async bestTime(id) {
      const [score] = await pipeline([['ZSCORE', BOARD, id]]);
      return score == null ? null : Number(score);
    },
    async saveBest(e) {
      await pipeline([
        ['ZADD', BOARD, e.timeMs, e.playerId],
        [
          'HSET', playerKey(e.playerId),
          'name', e.name, 'timeMs', e.timeMs, 'shots', e.shots,
          'hits', e.hits, 'hs', e.hs, 'at', e.at,
        ],
      ]);
    },
    async rename(id, name) {
      await pipeline([['HSET', playerKey(id), 'name', name]]);
    },
    async top(n) {
      const [flat] = await pipeline([['ZRANGE', BOARD, 0, n - 1]]);
      const ids = (flat as string[]) ?? [];
      if (!ids.length) return [];
      const hashes = await pipeline(ids.map((id) => ['HGETALL', playerKey(id)]));
      return ids
        .map((id, i) => toEntry(id, hashes[i]))
        .filter((e): e is Entry => e !== null);
    },
    async standing(id) {
      const [rank, total, hash] = await pipeline([
        ['ZRANK', BOARD, id],
        ['ZCARD', BOARD],
        ['HGETALL', playerKey(id)],
      ]);
      if (rank == null) return null;
      return { rank: Number(rank) + 1, total: Number(total), best: toEntry(id, hash) };
    },
    async hit(client) {
      const key = `lb:rl:${client}`;
      const [count] = await pipeline([
        ['INCR', key],
        ['EXPIRE', key, RATE_WINDOW_S, 'NX'],
      ]);
      return Number(count);
    },
  };
}

function memoryStore(): Store {
  const entries = new Map<string, Entry>();
  const hits = new Map<string, { count: number; until: number }>();
  const sorted = () => [...entries.values()].sort((a, b) => a.timeMs - b.timeMs || a.at - b.at);
  return {
    async bestTime(id) {
      return entries.get(id)?.timeMs ?? null;
    },
    async saveBest(e) {
      entries.set(e.playerId, e);
    },
    async rename(id, name) {
      const e = entries.get(id);
      if (e) e.name = name;
    },
    async top(n) {
      return sorted().slice(0, n);
    },
    async standing(id) {
      const all = sorted();
      const i = all.findIndex((e) => e.playerId === id);
      return i < 0 ? null : { rank: i + 1, total: all.length, best: all[i] };
    },
    async hit(client) {
      const now = Date.now();
      const cur = hits.get(client);
      const next =
        cur && cur.until > now
          ? { ...cur, count: cur.count + 1 }
          : { count: 1, until: now + RATE_WINDOW_S * 1000 };
      hits.set(client, next);
      return next.count;
    },
  };
}

let cached: Store | null | undefined;
const globalMemory = globalThis as unknown as { __lbMemory?: Store };

export function getStore(): Store | null {
  if (cached !== undefined) return cached;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) cached = redisStore(url, token);
  else if (process.env.NODE_ENV !== 'production')
    cached = globalMemory.__lbMemory ??= memoryStore();
  else cached = null;
  return cached;
}
