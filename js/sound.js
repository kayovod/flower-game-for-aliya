import { gameState } from './state.js';

let audioCtx = null;
let rainSource = null;
let musicTimer = null;
let currentAmbient = 'none';

function getCtx() {
  if (!gameState.soundEnabled) return null;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioCtx = new AudioCtx();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/** Мягкий клик для любых кнопок и вкладок */
export function playClickSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.04);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {}
}

/** Нежный звон дверного колокольчика */
export function playBellSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [880, 1174].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.22, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.52);
    });
  } catch (e) {}
}

/** Щелчок затвора камеры */
export function playShutterSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  } catch (e) {}
}

/** Шелест бумаги и стеблей */
export function playPaperSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const bufferSize = Math.floor(ctx.sampleRate * 0.11);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1700;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  } catch (e) {}
}

/** Звон монеток при продаже */
export function playCoinSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    [987, 1318, 1567].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);
      gain.gain.setValueAtTime(0.22, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.32);
    });
  } catch (e) {}
}

/** Настоящее мягкое кошачье мурлыканье (вдох-выдох с вибрацией 26 Гц) */
export function playPurrSound() {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    [0, 0.72].forEach((offset) => {
      const carrier = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const mainGain = ctx.createGain();

      carrier.type = 'sawtooth';
      carrier.frequency.setValueAtTime(64, now + offset);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(26, now + offset);
      lfoGain.gain.setValueAtTime(0.18, now + offset);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now + offset);

      mainGain.gain.setValueAtTime(0.001, now + offset);
      mainGain.gain.linearRampToValueAtTime(0.32, now + offset + 0.18);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.62);

      lfo.connect(lfoGain);
      lfoGain.connect(mainGain.gain);
      carrier.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(ctx.destination);

      carrier.start(now + offset);
      lfo.start(now + offset);
      carrier.stop(now + offset + 0.65);
      lfo.stop(now + offset + 0.65);
    });
  } catch (e) {}
}

/** Остановка всех фоновых звуков */
export function stopAmbient() {
  if (rainSource) {
    try { rainSource.stop(); } catch (e) {}
    rainSource = null;
  }
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
  currentAmbient = 'none';
}

/** Запуск выбранного фонового режима: 'none' | 'rain' | 'music' */
export function setAmbientMode(mode) {
  stopAmbient();
  if (!gameState.soundEnabled || mode === 'none') {
    return;
  }

  const ctx = getCtx();
  if (!ctx) return;
  currentAmbient = mode;

  if (mode === 'rain') {
    startRainLoop(ctx);
  } else if (mode === 'music') {
    startCozyMusicLoop(ctx);
  }
}

function startRainLoop(ctx) {
  try {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.03 * white) / 1.03;
      lastOut = data[i];
    }

    rainSource = ctx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 720;

    const gain = ctx.createGain();
    gain.gain.value = 0.16;

    rainSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    rainSource.start();
  } catch (e) {}
}

function startCozyMusicLoop(ctx) {
  // Тёплые пастельные аккорды (Cmaj7 -> Am7 -> Fmaj7 -> G6)
  const chords = [
    [261.63, 329.63, 392.0, 493.88],
    [220.0, 261.63, 329.63, 392.0],
    [174.61, 220.0, 261.63, 329.63],
    [196.0, 246.94, 293.66, 329.63]
  ];
  let step = 0;

  const playStep = () => {
    if (!gameState.soundEnabled || currentAmbient !== 'music') {
      stopAmbient();
      return;
    }
    const chordIdx = Math.floor(step / 4) % chords.length;
    const noteIdx = step % 4;
    const freq = chords[chordIdx][noteIdx];

    playSoftPianoNote(ctx, freq, 1.8, 0.09);
    if (noteIdx === 0) {
      playSoftPianoNote(ctx, chords[chordIdx][0] / 2, 2.8, 0.07);
    }
    step += 1;
  };

  playStep();
  musicTimer = setInterval(playStep, 750);
}

function playSoftPianoNote(ctx, freq, duration, volume) {
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch (e) {}
}