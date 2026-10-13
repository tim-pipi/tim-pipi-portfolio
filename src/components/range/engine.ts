// Canvas engine for the range homepage: a pseudo-3D practice range with five
// target bots. React owns the HUD and dossier; this module owns the canvas,
// pointer input, firing, hit-testing and sound, and reports back via callbacks.

export type BotId = 'about' | 'experience' | 'projects' | 'loadout' | 'contact';
export type HitPart = 'head' | 'body' | 'leg';
export type KillMeta = { part: HitPart; dist: number; shot: number };

export type Hud = {
  shots: number;
  hits: number;
  hs: number;
  ammo: number;
  down: BotId[];
};

// A time-trial run: starts on the first shot, ends once all five bots have
// been taken down. The clock pauses while a section is open.
export type Run = {
  status: 'idle' | 'running' | 'finished';
  elapsedMs: number;
  cleared: BotId[];
  shots: number;
  hits: number;
  hs: number;
  // Keyboard / button flicks auto-aim, so runs that use them aren't ranked.
  assisted: boolean;
};

export const emptyRun = (): Run => ({
  status: 'idle',
  elapsedMs: 0,
  cleared: [],
  shots: 0,
  hits: 0,
  hs: 0,
  assisted: false,
});

export const formatTime = (ms: number) => (ms / 1000).toFixed(2);

export type Crosshair = {
  color: string;
  len: number;
  gap: number;
  thick: number;
  dot: boolean;
  outline: boolean;
};

export const MAG = 25;
export const XCOLORS = ['#3cf0c8', '#ffffff', '#f5e64b', '#7dff5a', '#ff6ad5'];
export const XDEF: Crosshair = {
  color: '#3cf0c8',
  len: 5,
  gap: 3,
  thick: 2,
  dot: false,
  outline: true,
};

export const BOT_DEFS: { id: BotId; label: string; key: string }[] = [
  { id: 'about', label: 'About', key: '1' },
  { id: 'experience', label: 'Experience', key: '2' },
  { id: 'projects', label: 'Projects', key: '3' },
  { id: 'loadout', label: 'Loadout', key: '4' },
  { id: 'contact', label: 'Contact', key: '5' },
];

type Options = {
  reloadBar: HTMLElement;
  timerEl: HTMLElement;
  onRun: (run: Run) => void;
  onHud: (hud: Hud) => void;
  onKill: (id: BotId, meta: KillMeta) => void;
  getCrosshair: () => Crosshair;
  isSfxOn: () => boolean;
};

export type RangeController = {
  flickTo: (id: BotId) => void;
  startReload: () => void;
  // Opens a section without a shot (deep links); returns the meta to show.
  knockDown: (id: BotId) => KillMeta;
  // Respawns the bot whose section was open and re-enables firing.
  close: () => void;
  // While inactive (e.g. behind the landing page) the range can't be shot.
  setActive: (active: boolean) => void;
  resetRun: () => void;
  playSfx: (kind: SfxKind) => void;
  destroy: () => void;
};

type SfxKind = 'shot' | 'head' | 'body' | 'empty';
type Vec3 = [number, number, number];
type Bot = (typeof BOT_DEFS)[number] & {
  u: number; // screen lane, -1..1
  z: number; // distance in metres
  P: number; // platform height
  amp: number;
  spd: number;
  ph: number;
  alive: boolean;
  k: number; // 1 = standing, 0 = folded down
  anim: { type: 'fall' | 'rise'; t: number } | null;
};

const CAM = 1.6;
const WALLZ = 42;
const SIDE = 14;
const CEIL = 8;
const NZ = 1.2;

const LAYOUT: Record<BotId, Pick<Bot, 'u' | 'z' | 'P' | 'amp' | 'spd' | 'ph'>> = {
  about: { u: -0.72, z: 11, P: 0, amp: 0.07, spd: 0.55, ph: 0 },
  experience: { u: 0.72, z: 13, P: 0, amp: 0.07, spd: 0.45, ph: 3.0 },
  projects: { u: 0, z: 18, P: 0, amp: 0.09, spd: 0.4, ph: 1.3 },
  loadout: { u: -0.36, z: 25, P: 1.4, amp: 0.07, spd: 0.5, ph: 2.2 },
  contact: { u: 0.36, z: 29, P: 1.4, amp: 0.07, spd: 0.6, ph: 0.4 },
};

const hex = (h: string) => {
  h = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function createRange(cv: HTMLCanvasElement, o: Options): RangeController {
  const ctx = cv.getContext('2d')!;
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const css = getComputedStyle(cv);
  const tok = (n: string) => css.getPropertyValue(n).trim();
  const COL = {
    bg: tok('--bg'),
    wall: tok('--wall'),
    side: tok('--side'),
    ff: tok('--floor-far'),
    fn: tok('--floor-near'),
    line: tok('--line'),
    bone: tok('--bone'),
    muted: tok('--muted'),
    enemy: tok('--enemy'),
  };
  const F_DISP = tok('--f-display') || 'Impact,sans-serif';
  const F_MONO = tok('--f-mono') || 'ui-monospace,monospace';

  /* ---------- world ---------- */
  let W = 0;
  let H = 0;
  let f = 1;
  let hy = 0;
  let cx = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    hy = H * 0.4;
    f = Math.min(H * 1.9, W * 1.6);
    cx = W / 2;
  }
  const proj = (x: number, y: number, z: number): [number, number] => [
    cx + (x * f) / z,
    hy + ((CAM - y) * f) / z,
  ];

  const BOTS: Bot[] = BOT_DEFS.map((d) => ({
    ...d,
    ...LAYOUT[d.id],
    alive: true,
    k: 1,
    anim: null,
  }));
  const byId = (id: BotId) => BOTS.find((b) => b.id === id)!;
  const near2far = [...BOTS].sort((a, b) => a.z - b.z);
  const far2near = [...near2far].reverse();

  let t = 0;
  function geo(b: Bot) {
    const s = f / b.z;
    const hs = W * 0.4;
    const uu = b.u + (RM.matches ? 0 : b.amp * Math.sin(t * b.spd + b.ph));
    const x = (uu * hs * b.z) / f;
    const [gx, gy] = proj(x, b.P, b.z);
    return { s, x, gx, gy };
  }
  function hitTest(px: number, py: number): { bot: Bot; part: HitPart } | null {
    for (const b of near2far) {
      if (!b.alive || b.k < 0.95) continue;
      const { s, gx, gy } = geo(b);
      const dx = px - gx;
      const hdy = py - (gy - 1.64 * s);
      const hr = 0.165 * s;
      if (dx * dx + hdy * hdy < hr * hr) return { bot: b, part: 'head' };
      if (Math.abs(dx) < 0.3 * s && py > gy - 1.49 * s && py < gy - 0.55 * s)
        return { bot: b, part: 'body' };
      if (Math.abs(dx) < 0.06 * s && py >= gy - 0.55 * s && py < gy)
        return { bot: b, part: 'leg' };
    }
    return null;
  }

  /* ---------- sound ---------- */
  let actx: AudioContext | null = null;
  let noiseBuf: AudioBuffer | null = null;
  function sfx(kind: SfxKind) {
    if (!o.isSfxOn()) return;
    try {
      actx =
        actx ||
        new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      const now = actx.currentTime;
      const out = actx.destination;
      const env = (g: GainNode, a: number, d: number) => {
        g.gain.setValueAtTime(a, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + d);
      };
      if (kind === 'shot') {
        if (!noiseBuf) {
          noiseBuf = actx.createBuffer(1, actx.sampleRate * 0.2, actx.sampleRate);
          const d = noiseBuf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        }
        const n = actx.createBufferSource();
        n.buffer = noiseBuf;
        const lp = actx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(2600, now);
        lp.frequency.exponentialRampToValueAtTime(300, now + 0.12);
        const g = actx.createGain();
        env(g, 0.22, 0.13);
        n.connect(lp).connect(g).connect(out);
        n.start(now);
        n.stop(now + 0.2);
        const osc = actx.createOscillator();
        const g2 = actx.createGain();
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.1);
        env(g2, 0.3, 0.11);
        osc.connect(g2).connect(out);
        osc.start(now);
        osc.stop(now + 0.15);
      } else {
        const osc = actx.createOscillator();
        const g = actx.createGain();
        osc.type = kind === 'head' ? 'triangle' : 'square';
        osc.frequency.value = kind === 'head' ? 1650 : 1100;
        env(g, kind === 'head' ? 0.09 : 0.03, kind === 'head' ? 0.14 : 0.03);
        osc.connect(g).connect(out);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // audio is optional
    }
  }

  /* ---------- state ---------- */
  const aim = { x: window.innerWidth / 2, y: window.innerHeight * 0.5 };
  let mouseIn = false;
  let overUI = false;
  let tapShow = 0;
  let kbHold = 0;
  let bloom = 0;
  let shake = 0;
  let ammo = MAG;
  let reloadT = 0;
  let holding = false;
  let fireCD = 0;
  let flick: { b: Bot; sx: number; sy: number; t: number; dur: number } | null =
    null;
  let openId: BotId | null = null;
  let active = true;
  const stats = { shots: 0, hits: 0, hs: 0 };
  let run = emptyRun();
  const emitRun = () => o.onRun({ ...run, cleared: [...run.cleared] });
  const showTime = () => {
    o.timerEl.textContent = formatTime(run.elapsedMs);
  };
  const decals: { x: number; y: number; z: number; life: number }[] = [];
  const marks: { x: number; y: number; life: number; kill: boolean; miss: boolean }[] =
    [];
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const later = (fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  const emitHud = () =>
    o.onHud({
      ...stats,
      ammo,
      down: BOTS.filter((b) => !b.alive).map((b) => b.id),
    });

  function startReload() {
    if (reloadT > 0 || ammo === MAG || openId) return;
    reloadT = 1.1;
    o.reloadBar.dataset.on = 'true';
  }
  function addDecal(sx: number, sy: number) {
    const [, gyw] = proj(0, 0, WALLZ);
    let x: number;
    let y: number;
    let z: number;
    if (sy < gyw) {
      z = WALLZ;
      x = ((sx - cx) * z) / f;
      y = CAM - ((sy - hy) * z) / f;
      if (y > CEIL || Math.abs(x) > SIDE) return;
    } else {
      if (sy <= hy) return;
      z = (CAM * f) / (sy - hy);
      x = ((sx - cx) * z) / f;
      y = 0;
    }
    decals.push({ x, y, z, life: 6 });
    if (decals.length > 50) decals.shift();
  }

  function fire(px: number, py: number, forced?: Bot) {
    if (openId || reloadT > 0) return;
    if (ammo <= 0) {
      sfx('empty');
      startReload();
      return;
    }
    if (run.status !== 'running') {
      run = emptyRun();
      run.status = 'running';
      showTime();
      emitRun();
    }
    ammo--;
    stats.shots++;
    run.shots++;
    let sx = px;
    let sy = py;
    if (!forced && bloom > 1.5) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * bloom * 0.55;
      sx += Math.cos(a) * r;
      sy += Math.sin(a) * r;
    }
    bloom = Math.min(bloom + 7, 34);
    if (!RM.matches) shake = Math.min(shake + 2.2, 5);
    sfx('shot');
    const h = forced ? { bot: forced, part: 'head' as HitPart } : hitTest(sx, sy);
    if (h) {
      stats.hits++;
      run.hits++;
      if (h.part === 'head') {
        stats.hs++;
        run.hs++;
        sfx('head');
      } else sfx('body');
      marks.push({ x: sx, y: sy, life: 0.35, kill: true, miss: false });
      if (forced) run.assisted = true;
      kill(h.bot, h.part);
    } else {
      addDecal(sx, sy);
      marks.push({ x: sx, y: sy, life: 0.12, kill: false, miss: true });
    }
    emitHud();
    if (ammo === 0) later(startReload, 250);
  }

  function kill(b: Bot, part: HitPart) {
    const g = geo(b);
    b.alive = false;
    b.anim = { type: 'fall', t: 0 };
    holding = false;
    openId = b.id; // blocks firing until React closes the section
    if (run.status === 'running') {
      if (!run.cleared.includes(b.id)) run.cleared.push(b.id);
      if (run.cleared.length === BOTS.length) run.status = 'finished';
      showTime();
      emitRun();
    }
    const dist = Math.round(Math.hypot(g.x, b.z, b.P + 1.4 - CAM));
    const meta = { part, dist, shot: stats.shots };
    later(() => o.onKill(b.id, meta), RM.matches ? 0 : 320);
  }

  function flickTo(id: BotId) {
    const b = byId(id);
    if (!active || openId || flick || !b.alive || b.k < 0.95) return;
    flick = { b, sx: aim.x, sy: aim.y, t: 0, dur: RM.matches ? 0 : 0.22 };
  }

  /* ---------- input ---------- */
  const onMove = (e: PointerEvent) => {
    overUI = e.target !== cv;
    if (flick) return;
    aim.x = e.clientX;
    aim.y = e.clientY;
    mouseIn = e.pointerType === 'mouse' || mouseIn;
    kbHold = 0;
  };
  const onLeave = () => {
    mouseIn = false;
    holding = false;
  };
  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 || !active || flick || openId) return;
    aim.x = e.clientX;
    aim.y = e.clientY;
    overUI = false;
    if (e.pointerType === 'mouse') {
      mouseIn = true;
      holding = true;
      fireCD = 0.1;
    } else tapShow = 0.7;
    fire(aim.x, aim.y);
  };
  const stopHold = () => {
    holding = false;
  };
  window.addEventListener('pointermove', onMove);
  document.documentElement.addEventListener('mouseleave', onLeave);
  cv.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', stopHold);
  window.addEventListener('pointercancel', stopHold);
  window.addEventListener('blur', stopHold);
  window.addEventListener('resize', resize);

  /* ---------- drawing ---------- */
  function poly(pts: Vec3[], fill: string | CanvasGradient) {
    ctx.beginPath();
    pts.forEach(([x, y, z], i) => {
      const [sx, sy] = proj(x, y, z);
      if (i) ctx.lineTo(sx, sy);
      else ctx.moveTo(sx, sy);
    });
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }
  function seg(a: Vec3, b: Vec3, w: number, color: string) {
    const [x1, y1] = proj(...a);
    const [x2, y2] = proj(...b);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = w;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  function rr(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
  }
  const setSpacing = (px: string) => {
    if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = px;
  };

  function drawRoom() {
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, W, H);
    const [, gyw] = proj(0, 0, WALLZ);
    const fg = ctx.createLinearGradient(0, gyw, 0, H);
    fg.addColorStop(0, COL.ff);
    fg.addColorStop(1, COL.fn);
    poly([[-SIDE, 0, WALLZ], [SIDE, 0, WALLZ], [SIDE, 0, NZ], [-SIDE, 0, NZ]], fg);
    poly([[-SIDE, 0, WALLZ], [-SIDE, CEIL, WALLZ], [-SIDE, CEIL, NZ], [-SIDE, 0, NZ]], COL.side);
    poly([[SIDE, 0, WALLZ], [SIDE, CEIL, WALLZ], [SIDE, CEIL, NZ], [SIDE, 0, NZ]], COL.side);
    poly([[-SIDE, 0, WALLZ], [SIDE, 0, WALLZ], [SIDE, CEIL, WALLZ], [-SIDE, CEIL, WALLZ]], COL.wall);
    // baseboard
    poly([[-SIDE, 0, WALLZ], [SIDE, 0, WALLZ], [SIDE, 0.45, WALLZ], [-SIDE, 0.45, WALLZ]], 'rgba(0,0,0,.22)');
    ctx.globalAlpha = 0.5;
    for (let x = -SIDE + 3.5; x < SIDE; x += 3.5) seg([x, 0, WALLZ], [x, CEIL, WALLZ], 1, COL.line);
    for (let z = 6; z <= WALLZ; z += 6) {
      seg([-SIDE, 0, z], [-SIDE, CEIL, z], 1, COL.line);
      seg([SIDE, 0, z], [SIDE, CEIL, z], 1, COL.line);
    }
    ctx.globalAlpha = 1;
    // ceiling light strips
    for (const lx of [-5, 5]) {
      const g = ctx.createLinearGradient(0, proj(0, CEIL, NZ + 1)[1], 0, proj(0, CEIL, WALLZ)[1]);
      g.addColorStop(0, 'rgba(235,230,218,.28)');
      g.addColorStop(1, 'rgba(235,230,218,.05)');
      poly(
        [
          [lx - 0.22, CEIL - 0.02, 2.2],
          [lx + 0.22, CEIL - 0.02, 2.2],
          [lx + 0.22, CEIL - 0.02, WALLZ - 0.5],
          [lx - 0.22, CEIL - 0.02, WALLZ - 0.5],
        ],
        g,
      );
    }
    // floor lanes
    ctx.globalAlpha = 0.55;
    for (const lx of [-9, -4.5, 0, 4.5, 9]) seg([lx, 0, 7.4], [lx, 0, WALLZ], 1, COL.line);
    ctx.globalAlpha = 1;
    // distance stripes
    for (const z of [10, 20, 30]) {
      seg([-SIDE, 0, z], [SIDE, 0, z], Math.max(1, (0.05 * f) / z), 'rgba(235,230,218,.14)');
      const [lx, ly] = proj(-SIDE + 1.4, 0, z);
      const fs = clamp((0.55 * f) / z, 9, 15);
      ctx.font = `600 ${fs}px ${F_MONO}`;
      ctx.fillStyle = COL.muted;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`${z} M`, lx, ly - 3);
    }
    // firing line hazard stripe
    for (let x = -SIDE, i = 0; x < SIDE; x += 0.6, i++) {
      poly(
        [[x, 0, 7], [x + 0.6, 0, 7], [x + 0.6, 0, 7.35], [x, 0, 7.35]],
        i % 2 ? 'rgba(235,230,218,.22)' : 'rgba(0,0,0,.35)',
      );
    }
    // wall signage
    const s42 = f / WALLZ;
    const [sx, sy] = proj(0, 6.0, WALLZ);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = COL.bone;
    ctx.globalAlpha = 0.9;
    setSpacing(`${(0.08 * s42).toFixed(1)}px`);
    ctx.font = `900 ${2.6 * s42}px ${F_DISP}`;
    ctx.fillText('TIM', sx, sy);
    ctx.globalAlpha = 0.55;
    setSpacing(`${(0.12 * s42).toFixed(1)}px`);
    ctx.font = `600 ${clamp(0.42 * s42, 8, 18)}px ${F_MONO}`;
    ctx.fillText('SOFTWARE ENGINEER · SINGAPORE', sx, proj(0, 5.25, WALLZ)[1]);
    setSpacing('0px');
    ctx.globalAlpha = 1;
  }

  function drawDecals() {
    for (const d of decals) {
      const [x, y] = proj(d.x, d.y, d.z);
      const r = Math.max(1.3, (0.035 * f) / d.z);
      ctx.globalAlpha = Math.min(1, d.life / 1.5) * 0.85;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 7);
      ctx.fillStyle = '#0a0c0f';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, r * 1.9, 0, 7);
      ctx.strokeStyle = 'rgba(235,230,218,.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawPlatform(b: Bot) {
    const hs = W * 0.4;
    const z = b.z;
    const xa = ((b.u - b.amp - 0.06) * hs * z) / f - 0.5;
    const xb = ((b.u + b.amp + 0.06) * hs * z) / f + 0.5;
    const z0 = z - 0.8;
    const z1 = z + 0.8;
    const P = b.P;
    poly([[xa, P, z0], [xb, P, z0], [xb, P, z1], [xa, P, z1]], mix(COL.wall, COL.bone, 0.1));
    poly([[xa, 0, z0], [xb, 0, z0], [xb, P, z0], [xa, P, z0]], mix(COL.side, '#000000', 0.1));
    for (let x = xa, i = 0; x < xb - 0.01; x += 0.4, i++) {
      const x2 = Math.min(x + 0.4, xb);
      poly(
        [[x, P - 0.14, z0], [x2, P - 0.14, z0], [x2, P, z0], [x, P, z0]],
        i % 2 ? 'rgba(235,230,218,.35)' : 'rgba(0,0,0,.45)',
      );
    }
  }

  function drawBot(b: Bot, hovered: boolean) {
    const { s, gx, gy } = geo(b);
    const fog = clamp((b.z - 8) / 44, 0, 0.5);
    const body = mix('#d8d1c2', COL.wall, fog);
    const dark = mix('#9a958a', COL.wall, fog);
    const visor = mix('#2b3138', COL.wall, fog * 0.5);
    // shadow + stand
    ctx.beginPath();
    ctx.ellipse(gx, gy, 0.42 * s, 0.07 * s, 0, 0, 7);
    ctx.fillStyle = 'rgba(0,0,0,.35)';
    ctx.fill();
    ctx.fillStyle = dark;
    ctx.fillRect(gx - 0.3 * s, gy - 0.05 * s, 0.6 * s, 0.05 * s);
    ctx.fillRect(gx - 0.035 * s, gy - 0.56 * s, 0.07 * s, 0.52 * s);
    // upper body pivots at the hip so it can fold down
    ctx.save();
    ctx.translate(gx, gy - 0.55 * s);
    ctx.scale(1, Math.max(0.03, b.k));
    const path = new Path2D();
    const tw = 0.3 * s;
    if (path.roundRect) path.roundRect(-tw, -0.93 * s, tw * 2, 0.93 * s, 0.13 * s);
    else path.rect(-tw, -0.93 * s, tw * 2, 0.93 * s);
    path.moveTo(0.15 * s, -1.09 * s);
    path.arc(0, -1.09 * s, 0.15 * s, 0, Math.PI * 2);
    ctx.fillStyle = body;
    ctx.fill(path);
    ctx.fillStyle = dark;
    ctx.fillRect(-0.05 * s, -0.97 * s, 0.1 * s, 0.06 * s); // neck
    rr(-0.19 * s, -0.8 * s, 0.38 * s, 0.36 * s, 0.05 * s); // chest plate
    ctx.fillStyle = mix('#c4bdae', COL.wall, fog);
    ctx.fill();
    ctx.fillStyle = dark;
    ctx.fillRect(-tw, -0.28 * s, tw * 2, 0.05 * s); // belt
    ctx.fillStyle = visor;
    ctx.fillRect(-0.11 * s, -1.11 * s, 0.22 * s, 0.045 * s); // visor
    const alive = b.alive && b.k > 0.95;
    ctx.lineWidth = hovered ? 2.4 : 1.3;
    ctx.strokeStyle = COL.enemy;
    ctx.globalAlpha = alive ? (hovered ? 1 : 0.6) : 0.25;
    ctx.stroke(path);
    ctx.globalAlpha = 1;
    ctx.restore();

    if (!alive) return;
    // nameplate
    const fs = clamp(0.2 * s, 10, 15);
    ctx.font = `600 ${fs}px ${F_MONO}`;
    const label = b.label.toUpperCase();
    const lw = ctx.measureText(label).width;
    const kw = fs * 1.25;
    const pad = fs * 0.5;
    const w = kw + lw + pad * 2.4;
    const h = fs * 1.8;
    const x0 = Math.round(gx - w / 2);
    const y0 = Math.round(gy - 1.95 * s - h);
    ctx.fillStyle = 'rgba(10,13,17,.82)';
    ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = hovered ? COL.enemy : 'rgba(235,230,218,.12)';
    ctx.fillRect(x0, y0, kw, h);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = hovered ? '#160b08' : COL.muted;
    ctx.fillText(b.key, x0 + kw / 2, y0 + h / 2 + 1);
    ctx.textAlign = 'left';
    ctx.fillStyle = hovered ? COL.enemy : COL.bone;
    ctx.fillText(label, x0 + kw + pad * 1.2, y0 + h / 2 + 1);
  }

  function drawMarks() {
    for (const m of marks) {
      if (m.miss) continue;
      ctx.globalAlpha = clamp(m.life / 0.35, 0, 1);
      ctx.strokeStyle = m.kill ? COL.enemy : COL.bone;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        ctx.moveTo(m.x + dx * 5, m.y + dy * 5);
        ctx.lineTo(m.x + dx * 11, m.y + dy * 11);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawCrosshair(x: number, y: number) {
    const xc = o.getCrosshair();
    x = Math.round(x);
    y = Math.round(y);
    const T = xc.thick;
    const L = xc.len * 2;
    const G = xc.gap + Math.round(bloom * 0.45);
    const h = Math.floor(T / 2);
    const rects: [number, number, number, number][] = [];
    if (L > 0) {
      rects.push(
        [x + G + 1, y - h, L, T],
        [x - G - L, y - h, L, T],
        [x - h, y + G + 1, T, L],
        [x - h, y - G - L, T, L],
      );
    }
    if (xc.dot) rects.push([x - h, y - h, T, T]);
    if (xc.outline) {
      ctx.fillStyle = 'rgba(0,0,0,.85)';
      for (const [a, b, c, d] of rects) ctx.fillRect(a - 1, b - 1, c + 2, d + 2);
    }
    ctx.fillStyle = xc.color;
    for (const r of rects) ctx.fillRect(...r);
  }

  /* ---------- loop ---------- */
  const reloadFill = o.reloadBar.firstElementChild as HTMLElement | null;
  let raf = 0;
  let last = performance.now();
  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    // Real time (capped so a backgrounded tab doesn't count) for the run clock.
    if (run.status === 'running' && !openId) {
      run.elapsedMs += Math.min(250, now - last);
      showTime();
    }
    last = now;
    t += dt;

    for (const b of BOTS) {
      if (!b.anim) continue;
      b.anim.t += dt / (b.anim.type === 'fall' ? 0.28 : 0.35);
      const p = Math.min(1, RM.matches ? 1 : b.anim.t);
      const e = 1 - Math.pow(1 - p, 3);
      b.k = b.anim.type === 'fall' ? 1 - e : e;
      if (p >= 1) b.anim = null;
    }
    bloom = Math.max(0, bloom - dt * 55);
    shake = Math.max(0, shake - dt * 30);
    tapShow = Math.max(0, tapShow - dt);
    kbHold = Math.max(0, kbHold - dt);
    for (const d of decals) d.life -= dt;
    while (decals.length && decals[0].life <= 0) decals.shift();
    for (const m of marks) m.life -= dt;
    for (let i = marks.length - 1; i >= 0; i--) if (marks[i].life <= 0) marks.splice(i, 1);

    if (reloadT > 0) {
      reloadT -= dt;
      if (reloadFill) reloadFill.style.width = `${(1 - Math.max(0, reloadT) / 1.1) * 100}%`;
      if (reloadT <= 0) {
        reloadT = 0;
        ammo = MAG;
        delete o.reloadBar.dataset.on;
        emitHud();
      }
    }
    if (flick) {
      flick.t += dt;
      const g = geo(flick.b);
      const tx = g.gx;
      const ty = g.gy - 1.64 * g.s;
      const p = flick.dur ? Math.min(1, flick.t / flick.dur) : 1;
      const e = 1 - Math.pow(1 - p, 3);
      aim.x = lerp(flick.sx, tx, e);
      aim.y = lerp(flick.sy, ty, e);
      if (p >= 1) {
        const b = flick.b;
        flick = null;
        kbHold = 1.2;
        fire(aim.x, aim.y, b);
      }
    }
    if (holding && !openId && !flick) {
      fireCD -= dt;
      if (fireCD <= 0) {
        fireCD += 0.1;
        fire(aim.x, aim.y);
      }
    }

    const showX = active && !openId && (!!flick || kbHold > 0 || tapShow > 0 || (mouseIn && !overUI));
    const hov = showX ? hitTest(aim.x, aim.y) : null;

    ctx.save();
    if (shake > 0)
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake - shake * 0.4);
    drawRoom();
    drawDecals();
    for (const b of far2near) {
      if (b.P > 0) drawPlatform(b);
      drawBot(b, !!hov && hov.bot === b);
    }
    const vg = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.3, W / 2, H * 0.5, Math.max(W, H) * 0.8);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,.5)');
    ctx.fillStyle = vg;
    ctx.fillRect(-10, -10, W + 20, H + 20);
    ctx.restore();
    drawMarks();
    if (showX) drawCrosshair(aim.x, aim.y);

    raf = requestAnimationFrame(frame);
  }

  resize();
  emitHud();
  raf = requestAnimationFrame(frame);

  return {
    flickTo,
    startReload,
    knockDown(id) {
      const b = byId(id);
      b.alive = false;
      b.k = 0;
      b.anim = null;
      openId = id;
      emitHud();
      return { part: 'head', dist: Math.round(b.z), shot: 0 };
    },
    close() {
      if (!openId) return;
      const b = byId(openId);
      openId = null;
      b.alive = true;
      b.anim = { type: 'rise', t: 0 };
      emitHud();
    },
    setActive(on) {
      active = on;
      if (!on) holding = false;
    },
    resetRun() {
      run = emptyRun();
      showTime();
      emitRun();
    },
    playSfx: sfx,
    destroy() {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cv.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', stopHold);
      window.removeEventListener('pointercancel', stopHold);
      window.removeEventListener('blur', stopHold);
      window.removeEventListener('resize', resize);
      actx?.close().catch(() => {});
    },
  };
}
