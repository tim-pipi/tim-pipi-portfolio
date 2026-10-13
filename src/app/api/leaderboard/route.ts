import { NextResponse, type NextRequest } from 'next/server';
import { getStore, type Entry } from '@/lib/leaderboard';

export const dynamic = 'force-dynamic';

const TOP_N = 20;
const MAX_SUBMISSIONS_PER_WINDOW = 20;
const PLAYER_ID = /^[a-zA-Z0-9-]{8,64}$/;

const unavailable = () =>
  NextResponse.json({ error: 'Leaderboard is not configured' }, { status: 503 });

function cleanName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const name = raw
    .normalize('NFKC')
    .replace(/[\p{C}<>]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 20)
    .trim();
  return name.length ? name : null;
}

const isInt = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;

// GET /api/leaderboard?player=<id> → top runs, plus that player's standing.
export async function GET(req: NextRequest) {
  const store = getStore();
  if (!store) return unavailable();
  const player = req.nextUrl.searchParams.get('player');
  try {
    const [top, me] = await Promise.all([
      store.top(TOP_N),
      player && PLAYER_ID.test(player) ? store.standing(player) : null,
    ]);
    return NextResponse.json({ top, me });
  } catch (err) {
    console.error('leaderboard GET', err);
    return NextResponse.json({ error: 'Leaderboard unavailable' }, { status: 502 });
  }
}

// POST /api/leaderboard → submit a finished, unassisted run.
// Validation keeps casual tampering out; it can't make a client-side game
// cheat-proof.
export async function POST(req: NextRequest) {
  const store = getStore();
  if (!store) return unavailable();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const { playerId, timeMs, shots, hits, hs } = body;
  const name = cleanName(body.name);
  if (
    typeof playerId !== 'string' ||
    !PLAYER_ID.test(playerId) ||
    !name ||
    !isInt(timeMs, 1000, 30 * 60 * 1000) ||
    !isInt(shots, 5, 5000) ||
    !isInt(hits, 5, shots) ||
    !isInt(hs, 0, hits)
  ) {
    return NextResponse.json({ error: 'Invalid run' }, { status: 400 });
  }

  const client =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  try {
    if ((await store.hit(client)) > MAX_SUBMISSIONS_PER_WINDOW) {
      return NextResponse.json({ error: 'Too many submissions' }, { status: 429 });
    }
    const prev = await store.bestTime(playerId);
    const improved = prev == null || timeMs < prev;
    if (improved) {
      const entry: Entry = { playerId, name, timeMs, shots, hits, hs, at: Date.now() };
      await store.saveBest(entry);
    } else {
      await store.rename(playerId, name);
    }
    const me = await store.standing(playerId);
    return NextResponse.json({ improved, previousBestMs: prev, me });
  } catch (err) {
    console.error('leaderboard POST', err);
    return NextResponse.json({ error: 'Leaderboard unavailable' }, { status: 502 });
  }
}
