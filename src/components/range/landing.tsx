'use client';

import React from 'react';
import Link from 'next/link';
import { profile } from '@/data/portfolio';
import { normaliseName, type Player } from './player';
import s from './landing.module.css';

const greeting = (h: number) =>
  h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';

export default function Landing({
  player,
  onEnter,
  leaving,
}: {
  player: Player | null;
  onEnter: (name: string | null) => void;
  leaving: boolean;
}) {
  const [now, setNow] = React.useState<Date | null>(null);
  const [name, setName] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // The clock renders only on the client so the static HTML never disagrees
  // with the visitor's local time.
  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (player) setName(player.name);
  }, [player]);

  React.useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normaliseName(name);
    if (!clean) {
      inputRef.current?.focus();
      return;
    }
    onEnter(clean);
  };

  const time = now
    ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    : ' ';

  return (
    <section
      className={`${s.landing} ${leaving ? s.leaving : ''}`}
      aria-labelledby="landing-greeting"
    >
      <div className={s.center}>
        <p className={s.clock} aria-hidden="true">
          {time}
        </p>
        <h1 id="landing-greeting" className={s.greeting}>
          {now ? greeting(now.getHours()) : 'Hello'}
          {player ? `, ${player.name}` : ''}.
        </h1>
        <p className={s.intro}>
          {player ? (
            <>Welcome back to the range. Five bots, one clock — beat your best.</>
          ) : (
            <>
              Hi there, I&apos;m {profile.shortName}, a{' '}
              {profile.role.toLowerCase()} in {profile.location}. Thanks for
              stopping by! My portfolio is a shooting range: take down a bot to
              open a section.
            </>
          )}
        </p>

        <form className={s.form} onSubmit={submit}>
          <label htmlFor="landing-name" className={s.question}>
            {player ? 'Still you?' : "What's your name?"}
          </label>
          <input
            ref={inputRef}
            id="landing-name"
            className={s.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoComplete="nickname"
            spellCheck={false}
            enterKeyHint="go"
          />
          <p className={s.hint}>
            Press <kbd>Enter</kbd> to step onto the range · your name goes on
            the leaderboard
          </p>
        </form>
      </div>

      <nav className={s.footer}>
        <button type="button" className={s.linkBtn} onClick={() => onEnter(null)}>
          Skip, just look around
        </button>
        <span aria-hidden="true">·</span>
        <Link href="/classic">Prefer a plain page? Classic view</Link>
      </nav>
    </section>
  );
}
