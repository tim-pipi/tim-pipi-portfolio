// The visitor's identity on the range: a random id (one leaderboard entry per
// browser) plus the name they typed on the landing page.

export type Player = { id: string; name: string };

const KEY = 'range.player';

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

export function loadPlayer(): Player | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return v && typeof v.id === 'string' && typeof v.name === 'string' ? v : null;
  } catch {
    return null;
  }
}

export function savePlayer(name: string, existing: Player | null): Player {
  const player = { id: existing?.id ?? newId(), name };
  try {
    localStorage.setItem(KEY, JSON.stringify(player));
  } catch {
    // storage is a convenience; the name still applies for this visit
  }
  return player;
}

export function normaliseName(raw: string) {
  return raw.replace(/\s+/g, ' ').trim().slice(0, 20).trim();
}
