'use client';

import React from 'react';
import Link from 'next/link';
import { profile } from '@/data/portfolio';
import DossierBody from './dossier-body';
import {
  BOT_DEFS,
  MAG,
  XCOLORS,
  XDEF,
  createRange,
  type BotId,
  type Crosshair,
  type Hud,
  type KillMeta,
  type RangeController,
} from './engine';
import s from './range.module.css';

const store = {
  get<T>(k: string, d: T): T {
    try {
      const v = localStorage.getItem(k);
      return v ? (JSON.parse(v) as T) : d;
    } catch {
      return d;
    }
  },
  set(k: string, v: unknown) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {
      // storage is a convenience only
    }
  },
};

const PART = { head: 'Headshot', body: 'Body shot', leg: 'Leg shot' };
const isBotId = (v: string): v is BotId => BOT_DEFS.some((b) => b.id === v);
const labelOf = (id: BotId) => BOT_DEFS.find((b) => b.id === id)!.label;

type FeedItem = { key: number; id: BotId; head: boolean };

export default function Range({ className = '' }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reloadRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const dossierRef = React.useRef<HTMLElement>(null);
  const ctrlRef = React.useRef<RangeController | null>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  const [hud, setHud] = React.useState<Hud>({
    shots: 0,
    hits: 0,
    hs: 0,
    ammo: MAG,
    down: [],
  });
  const [feed, setFeed] = React.useState<FeedItem[]>([]);
  const [open, setOpen] = React.useState<{ id: BotId; meta: KillMeta } | null>(
    null,
  );
  const [xOpen, setXOpen] = React.useState(false);
  const [xc, setXc] = React.useState<Crosshair>(XDEF);
  const [sfxOn, setSfxOn] = React.useState(false);
  const [coarse, setCoarse] = React.useState(false);
  const [hintGone, setHintGone] = React.useState(false);

  const xcRef = React.useRef(xc);
  const sfxRef = React.useRef(sfxOn);
  xcRef.current = xc;
  sfxRef.current = sfxOn;

  const openSection = React.useCallback((id: BotId, meta: KillMeta) => {
    setOpen({ id, meta });
    setXOpen(false);
    try {
      history.replaceState(null, '', `#${id}`);
    } catch {
      // ignore
    }
  }, []);

  // Engine lifecycle
  React.useEffect(() => {
    setXc({ ...XDEF, ...store.get<Partial<Crosshair>>('range.xhair', {}) });
    setSfxOn(store.get('range.sfx', false));
    setCoarse(matchMedia('(pointer: coarse)').matches);

    let feedKey = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const ctrl = createRange(canvasRef.current!, {
      reloadBar: reloadRef.current!,
      onHud: setHud,
      onKill: (id, meta) => {
        const key = ++feedKey;
        setFeed((f) => [{ key, id, head: meta.part === 'head' }, ...f].slice(0, 4));
        timers.push(
          setTimeout(() => setFeed((f) => f.filter((i) => i.key !== key)), 6200),
        );
        setHintGone(true);
        openSection(id, meta);
      },
      getCrosshair: () => xcRef.current,
      isSfxOn: () => sfxRef.current,
    });
    ctrlRef.current = ctrl;

    // Deep link: /#about, /#projects, …
    const start = location.hash.slice(1);
    if (isBotId(start)) {
      timers.push(
        setTimeout(() => {
          setHintGone(true);
          openSection(start, ctrl.knockDown(start));
        }, 200),
      );
    }

    return () => {
      timers.forEach(clearTimeout);
      ctrl.destroy();
      ctrlRef.current = null;
    };
  }, [openSection]);

  const updateXc = (patch: Partial<Crosshair>) => {
    setXc((cur) => {
      const next = { ...cur, ...patch };
      store.set('range.xhair', next);
      return next;
    });
  };

  const toggleSfx = () => {
    const next = !sfxOn;
    setSfxOn(next);
    sfxRef.current = next;
    store.set('range.sfx', next);
    if (next) ctrlRef.current?.playSfx('head');
  };

  const flickTo = React.useCallback((id: BotId, btn: HTMLElement | null) => {
    returnFocusRef.current = btn;
    setXOpen(false);
    ctrlRef.current?.flickTo(id);
  }, []);

  const closePanel = React.useCallback(() => {
    if (!open) return;
    ctrlRef.current?.close();
    setOpen(null);
    returnFocusRef.current?.focus({ preventScroll: true });
    returnFocusRef.current = null;
    try {
      history.replaceState(null, '', location.pathname + location.search);
    } catch {
      // ignore
    }
  }, [open]);

  // Keyboard: 1–5 flick, R reload, C crosshair, Esc close
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (xOpen) setXOpen(false);
        else closePanel();
        return;
      }
      if (open || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement).matches?.('input')) return;
      const bot = BOT_DEFS.find((b) => b.key === e.key);
      if (bot) {
        flickTo(bot.id, document.querySelector(`[data-bot="${bot.id}"]`));
      } else if (e.key === 'r' || e.key === 'R') ctrlRef.current?.startReload();
      else if (e.key === 'c' || e.key === 'C') setXOpen((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, xOpen, closePanel, flickTo]);

  // Close the crosshair panel when the player starts shooting again
  React.useEffect(() => {
    if (!xOpen) return;
    const cv = canvasRef.current!;
    const onDown = () => setXOpen(false);
    cv.addEventListener('pointerdown', onDown);
    return () => cv.removeEventListener('pointerdown', onDown);
  }, [xOpen]);

  React.useEffect(() => {
    if (open) closeRef.current?.focus({ preventScroll: true });
  }, [open]);

  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const f = [
      ...dossierRef.current!.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
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

  const acc = hud.shots ? `${Math.round((hud.hits / hud.shots) * 100)}%` : '–';
  const hs = hud.hits ? `${Math.round((hud.hs / hud.hits) * 100)}%` : '–';

  return (
    <div className={`${s.app} ${className}`}>
      <canvas
        ref={canvasRef}
        className={s.canvas}
        role="img"
        aria-label="A shooting range with five target bots. Each bot opens a section of Tim's portfolio. Use the section buttons at the bottom, or keys 1 to 5."
      />

      <div className={s.hud}>
        <div className={s.stats} aria-hidden="true">
          {[
            ['Shots', hud.shots],
            ['Hits', hud.hits],
            ['Acc', acc],
            ['HS', hs],
          ].map(([k, v]) => (
            <div className={s.stat} key={k}>
              <span className={s.statKey}>{k}</span>
              <span className={s.statVal}>{v}</span>
            </div>
          ))}
        </div>

        <div className={s.topright}>
          <div className={s.tools}>
            <Link className={s.tool} href="/classic">
              Classic<span className={s.wide}>&nbsp;view</span>
            </Link>
            <button className={s.tool} aria-pressed={sfxOn} onClick={toggleSfx}>
              {sfxOn ? 'Sound on' : 'Sound off'}
            </button>
            <button
              className={`${s.tool} ${s.toolXhair}`}
              aria-expanded={xOpen}
              aria-controls="range-xset"
              onClick={() => setXOpen((v) => !v)}
            >
              Crosshair <kbd>C</kbd>
            </button>
          </div>
          <ol className={s.feed} aria-live="polite">
            {feed.map((item) => (
              <li key={item.key}>
                <span className={s.who}>{profile.shortName}</span>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="5" />
                  <path d="M8 1v4M8 11v4M1 8h4M11 8h4" />
                </svg>
                {item.head && <span className={s.hs}>HS</span>}
                <span className={s.tgt}>{labelOf(item.id)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={s.xset} id="range-xset" hidden={!xOpen}>
          <h3>Crosshair</h3>
          <fieldset className={s.swatches}>
            <legend>Color</legend>
            {XCOLORS.map((c, i) => (
              <label key={c}>
                <input
                  type="radio"
                  name="xcolor"
                  value={c}
                  aria-label={`Color ${i + 1}`}
                  checked={xc.color === c}
                  onChange={() => updateXc({ color: c })}
                />
                <span style={{ background: c }} />
              </label>
            ))}
          </fieldset>
          {(
            [
              ['len', 'Inner line length', 0, 10],
              ['gap', 'Center gap', 0, 10],
              ['thick', 'Thickness', 1, 4],
            ] as const
          ).map(([k, label, min, max]) => (
            <div className={s.xrow} key={k}>
              <label htmlFor={`x-${k}`}>{label}</label>
              <input
                type="range"
                id={`x-${k}`}
                min={min}
                max={max}
                step={1}
                value={xc[k]}
                onChange={(e) => updateXc({ [k]: +e.target.value })}
              />
              <output htmlFor={`x-${k}`}>{xc[k]}</output>
            </div>
          ))}
          <div className={s.xchecks}>
            <label>
              <input
                type="checkbox"
                checked={xc.dot}
                onChange={(e) => updateXc({ dot: e.target.checked })}
              />{' '}
              Center dot
            </label>
            <label>
              <input
                type="checkbox"
                checked={xc.outline}
                onChange={(e) => updateXc({ outline: e.target.checked })}
              />{' '}
              Outline
            </label>
          </div>
        </div>

        <div className={s.player} aria-hidden="true">
          <div className={s.pName}>{profile.shortName.toUpperCase()}</div>
          <div className={s.pRole}>
            {profile.role} · {profile.company}
          </div>
          <div className={s.hp}>
            <span className={s.hpNum}>100</span>
            <span className={s.hpBar}>
              <i />
            </span>
          </div>
        </div>

        <p className={`${s.hint} ${hintGone ? s.hintGone : ''}`}>
          {coarse ? (
            'Tap a bot to open its section, or use the buttons below.'
          ) : (
            <>
              Aim at a bot and <b>click</b> to open its section ·{' '}
              <kbd>1</kbd>–<kbd>5</kbd> flick to a bot
            </>
          )}
        </p>

        <nav className={s.slots} aria-label="Portfolio sections">
          {BOT_DEFS.map((b) => (
            <button
              key={b.id}
              data-bot={b.id}
              className={`${s.slot} ${hud.down.includes(b.id) ? s.slotDown : ''}`}
              onClick={(e) => flickTo(b.id, e.currentTarget)}
            >
              <span className={s.slotKey}>{b.key}</span>
              <span className={s.slotName}>{b.label}</span>
            </button>
          ))}
        </nav>

        <div className={s.ammo} aria-hidden="true">
          <div className={s.mag}>
            <span className={`${s.magNum} ${hud.ammo <= 5 ? s.magLow : ''}`}>
              {hud.ammo}
            </span>
            <span className={s.res}>/ ∞</span>
          </div>
          <div className={s.reload} ref={reloadRef}>
            <i />
          </div>
          <div className={s.ammoHint}>
            <kbd>R</kbd> reload · hold to spray
          </div>
        </div>
      </div>

      {open && (
        <>
          <div className={s.scrim} onClick={closePanel} />
          <aside
            ref={dossierRef}
            className={s.dossier}
            role="dialog"
            aria-modal="true"
            aria-labelledby="range-d-title"
            onKeyDown={trapFocus}
          >
            <header className={s.dHead}>
              <p className={s.eyebrow}>Eliminated</p>
              <h2 id="range-d-title">{labelOf(open.id)}</h2>
              <div className={s.meta}>
                <span
                  className={`${s.chip} ${open.meta.part === 'head' ? s.chipHot : ''}`}
                >
                  {PART[open.meta.part]}
                </span>
                <span className={s.chip}>{open.meta.dist} m</span>
                <span className={s.chip}>Shot #{open.meta.shot}</span>
              </div>
            </header>
            <div className={s.dBody} key={open.id}>
              <DossierBody id={open.id} />
            </div>
            <footer className={s.dFoot}>
              <button ref={closeRef} className={s.btnClose} onClick={closePanel}>
                Respawn bot &amp; return
              </button>
              <span className={s.esc}>
                <kbd>Esc</kbd> also works
              </span>
            </footer>
          </aside>
        </>
      )}
    </div>
  );
}
