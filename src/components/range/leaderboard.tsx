'use client';

import React from 'react';
import { formatTime, type Run } from './engine';
import { normaliseName, type Player } from './player';
import type { Entry, Standing } from '@/lib/leaderboard';
import s from './range.module.css';

export type Submission =
  | { state: 'idle' }
  | { state: 'posting' }
  | { state: 'posted'; improved: boolean; previousBestMs: number | null; me: Standing | null }
  | { state: 'error'; message: string };

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : '–');

export async function submitRun(player: Player, run: Run): Promise<Submission> {
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: player.id,
        name: player.name,
        timeMs: Math.round(run.elapsedMs),
        shots: run.shots,
        hits: run.hits,
        hs: run.hs,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        res.status === 503
          ? 'The leaderboard is offline right now.'
          : res.status === 429
            ? 'Too many runs posted from here. Try again in a few minutes.'
            : "Couldn't post this run.";
      return { state: 'error', message: data.error && res.status === 400 ? `${message} (${data.error})` : message };
    }
    return { state: 'posted', ...data };
  } catch {
    return { state: 'error', message: "Couldn't reach the leaderboard." };
  }
}

/* ---------- shared panel shell ---------- */
function Panel({
  eyebrow,
  title,
  meta,
  children,
  footer,
  labelId,
}: {
  eyebrow: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  labelId: string;
}) {
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    ref.current
      ?.querySelector<HTMLElement>('[data-autofocus]')
      ?.focus({ preventScroll: true });
  }, []);
  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const f = [
      ...ref.current!.querySelectorAll<HTMLElement>(
        'button, a[href], input, [tabindex]:not([tabindex="-1"])',
      ),
    ];
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) {
      e.preventDefault();
      f[f.length - 1].focus();
    } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
      e.preventDefault();
      f[0].focus();
    }
  };
  return (
    <aside
      ref={ref}
      className={s.dossier}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      onKeyDown={trapFocus}
    >
      <header className={s.dHead}>
        <p className={s.eyebrow}>{eyebrow}</p>
        <h2 id={labelId}>{title}</h2>
        {meta && <div className={s.meta}>{meta}</div>}
      </header>
      <div className={s.dBody}>{children}</div>
      <footer className={s.dFoot}>{footer}</footer>
    </aside>
  );
}

/* ---------- results card ---------- */
export function Results({
  run,
  player,
  submission,
  onSetName,
  onAgain,
  onBoard,
}: {
  run: Run;
  player: Player | null;
  submission: Submission;
  onSetName: (name: string) => void;
  onAgain: () => void;
  onBoard: () => void;
}) {
  const [name, setName] = React.useState('');
  let status: React.ReactNode;
  if (run.assisted) {
    status = (
      <p>
        <strong>Assisted run.</strong> Keyboard and button flicks aim for you,
        so this time isn&apos;t ranked. Clear all five by aiming yourself to
        post a time.
      </p>
    );
  } else if (!player) {
    status = (
      <form
        className={s.nameForm}
        onSubmit={(e) => {
          e.preventDefault();
          const clean = normaliseName(name);
          if (clean) onSetName(clean);
        }}
      >
        <label htmlFor="results-name">Add a name to post this time</label>
        <div>
          <input
            id="results-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoComplete="nickname"
            data-autofocus
          />
          <button className={s.btnCopy} type="submit">
            Post
          </button>
        </div>
      </form>
    );
  } else if (submission.state === 'posting' || submission.state === 'idle') {
    status = <p className={s.note}>Posting to the leaderboard…</p>;
  } else if (submission.state === 'error') {
    status = <p className={s.note}>{submission.message}</p>;
  } else {
    const me = submission.me;
    status = (
      <p>
        {submission.improved ? (
          <strong>
            {submission.previousBestMs == null ? 'First time on the board!' : 'New personal best!'}
          </strong>
        ) : (
          <>
            Your best is still{' '}
            <strong>{formatTime(me?.best?.timeMs ?? submission.previousBestMs ?? 0)}s</strong>.
          </>
        )}{' '}
        {me && (
          <>
            You&apos;re <strong>#{me.rank}</strong> of {me.total} on the leaderboard
            {player ? `, ${player.name}` : ''}.
          </>
        )}
      </p>
    );
  }

  return (
    <Panel
      eyebrow="Run complete · all 5 bots down"
      labelId="results-title"
      title={
        <>
          {formatTime(run.elapsedMs)}
          <span className={s.unit}>s</span>
        </>
      }
      meta={
        <>
          <span className={s.chip}>Acc {pct(run.hits, run.shots)}</span>
          <span className={s.chip}>HS {pct(run.hs, run.hits)}</span>
          <span className={s.chip}>{run.shots} shots</span>
          {run.assisted && <span className={`${s.chip} ${s.chipHot}`}>Assisted</span>}
        </>
      }
      footer={
        <>
          <button className={s.btnClose} onClick={onAgain} data-autofocus={player || run.assisted ? true : undefined}>
            Run it back
          </button>
          <button className={s.btnGhost} onClick={onBoard}>
            Leaderboard
          </button>
        </>
      }
    >
      <p className={s.lede}>
        The clock ran while you were on the range and paused while you read
        each section.
      </p>
      {status}
    </Panel>
  );
}

/* ---------- leaderboard ---------- */
export function Leaderboard({
  player,
  onClose,
  refreshKey,
}: {
  player: Player | null;
  onClose: () => void;
  refreshKey: number;
}) {
  const [data, setData] = React.useState<
    { top: Entry[]; me: Standing | null } | { error: string } | null
  >(null);

  React.useEffect(() => {
    let live = true;
    const q = player ? `?player=${encodeURIComponent(player.id)}` : '';
    fetch(`/api/leaderboard${q}`, { cache: 'no-store' })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!live) return;
        if (!res.ok)
          setData({
            error:
              res.status === 503
                ? 'The leaderboard is offline right now.'
                : "Couldn't load the leaderboard.",
          });
        else setData(body);
      })
      .catch(() => live && setData({ error: "Couldn't reach the leaderboard." }));
    return () => {
      live = false;
    };
  }, [player, refreshKey]);

  const meInTop =
    data && 'top' in data && player
      ? data.top.some((e) => e.playerId === player.id)
      : false;

  const row = (e: Entry, rank: number) => (
    <tr key={e.playerId} className={player?.id === e.playerId ? s.you : undefined}>
      <td className={s.rank}>{rank}</td>
      <td className={s.who2}>
        {e.name}
        {player?.id === e.playerId && <span className={s.youTag}>you</span>}
      </td>
      <td className={s.num}>{formatTime(e.timeMs)}s</td>
      <td className={`${s.num} ${s.wideCol}`}>{pct(e.hits, e.shots)}</td>
      <td className={`${s.num} ${s.wideCol}`}>{pct(e.hs, e.hits)}</td>
    </tr>
  );

  return (
    <Panel
      eyebrow="Range records"
      labelId="lb-title"
      title="Leaderboard"
      meta={<span className={s.chip}>Clear-all time trial</span>}
      footer={
        <>
          <button className={s.btnClose} onClick={onClose} data-autofocus>
            Back to the range
          </button>
          <span className={s.esc}>
            <kbd>Esc</kbd> also works
          </span>
        </>
      }
    >
      <p className={s.note}>
        Take down all five bots as fast as you can. The clock starts on your
        first shot and pauses while a section is open. Keyboard and button
        flicks aim for you, so those runs aren&apos;t ranked.
      </p>
      {!data ? (
        <p className={s.note}>Loading…</p>
      ) : 'error' in data ? (
        <p className={s.note}>{data.error}</p>
      ) : data.top.length === 0 ? (
        <p>No times yet. Be the first on the board.</p>
      ) : (
        <table className={s.board}>
          <thead>
            <tr>
              <th className={s.rank}>#</th>
              <th>Name</th>
              <th className={s.num}>Time</th>
              <th className={`${s.num} ${s.wideCol}`}>Acc</th>
              <th className={`${s.num} ${s.wideCol}`}>HS</th>
            </tr>
          </thead>
          <tbody>
            {data.top.map((e, i) => row(e, i + 1))}
            {!meInTop && data.me?.best && (
              <>
                <tr className={s.gap} aria-hidden="true">
                  <td colSpan={5}>⋯</td>
                </tr>
                {row(data.me.best, data.me.rank)}
              </>
            )}
          </tbody>
        </table>
      )}
    </Panel>
  );
}
