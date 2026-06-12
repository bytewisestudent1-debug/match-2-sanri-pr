/**
 * Tiny Web Audio sound engine — generates all effects procedurally so the
 * game ships with zero audio asset files. A single AudioContext is created
 * lazily on first use (after a user gesture, which the browser requires).
 */

type SoundName = 'flip' | 'match' | 'mismatch' | 'win';

let ctx: AudioContext | null = null;
let muted = false;

const MUTE_KEY = 'sanrio-memory:muted';

// Restore the persisted mute preference up front.
try {
  muted = localStorage.getItem(MUTE_KEY) === 'true';
} catch {
  muted = false;
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  // Browsers may start the context suspended until a gesture resumes it.
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Play a single tone with a soft attack/decay envelope. */
function tone(freq: number, start: number, duration: number, type: OscillatorType, gain: number) {
  const audio = getCtx();
  if (!audio) return;
  const t0 = audio.currentTime + start;
  const osc = audio.createOscillator();
  const env = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(env).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function playSound(name: SoundName) {
  if (muted) return;
  switch (name) {
    case 'flip':
      tone(660, 0, 0.09, 'triangle', 0.12);
      break;
    case 'match':
      // Cheerful rising two-note chime.
      tone(784, 0, 0.16, 'sine', 0.18);   // G5
      tone(1175, 0.1, 0.22, 'sine', 0.16); // D6
      break;
    case 'mismatch':
      tone(196, 0, 0.18, 'sawtooth', 0.08); // soft low G3
      break;
    case 'win': {
      // Little arpeggio fanfare: C–E–G–C.
      const notes = [523, 659, 784, 1047];
      notes.forEach((f, i) => tone(f, i * 0.12, 0.4, 'sine', 0.16));
      break;
    }
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, String(value));
  } catch {
    /* ignore storage failures (private mode, etc.) */
  }
}
