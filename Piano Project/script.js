/* Cozy 29-key pixel piano with audio indication */
/* Notes covered: C3 to E5 (chromatic). Provide matching audio files in /audio as <NOTE>.mp3 */

const NOTES = [
  "C3","C#3","D3","D#3","E3","F3","F#3","G3","G#3","A3","A#3","B3",
  "C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4",
  "C5","C#5","D5","D#5","E5"
];

// Choose your audio extension here if not mp3:
const AUDIO_EXT = ".mp3"; // change to ".wav" or ".ogg" if needed
const AUDIO_PATH = "audio/"; // place your files here

const pianoEl = document.getElementById("piano");
const currentNoteEl = document.getElementById("current-note");
const scope = document.getElementById("scope");
const ctx = scope.getContext("2d", { alpha: false });

let audioCtx;
let analyser;
let dataArray;
let mediaNodes = new Map(); // note -> { audioEl, sourceNode }

init();

function init() {
  renderKeys();
  setupAudioGraph();
  bindInteractions();
  drawScopeIdle();
}

/* Render keys: whites inline, blacks positioned above whites using pattern */
function renderKeys() {
  // Pattern to place black keys over whites (per octave)
  // Whites per octave: C D E F G A B  -> indices: 0..6
  // Black positions after whites: [C#, D#, F#, G#, A#] -> after C,D,F,G,A
  const whiteIndicesPattern = [0, 2, 4, 5, 7, 9, 11]; // relative semitone indices in octave
  const blackSet = new Set(["C#", "D#", "F#", "G#", "A#"]);

  // Build visual line of white keys and overlay blacks with positioning
  let whiteCount = 0;

  NOTES.forEach((note, idx) => {
    const isBlack = note.includes("#");
    if (!isBlack) {
      const key = createKey(note, "white");
      pianoEl.appendChild(key);
      whiteCount++;
    }
  });

  // Position black keys by mapping them to their preceding white key offset
  // We compute the X offset based on where the note falls relative to C in its octave.
  const whiteKeys = [...pianoEl.querySelectorAll(".key.white")];

  NOTES.forEach((note) => {
    if (note.includes("#")) {
      const [letter, octave] = parseNote(note);
      // Which white does this black sit between?
      // Black sits between its base white and the next white:
      // C# between C & D, D# between D & E, F# between F & G, G# between G & A, A# between A & B
      const baseWhiteLetter = note[0]; // C, D, F, G, A
      // Find index of base white key occurrence for this octave
      const baseWhiteNote = `${baseWhiteLetter}${octave}`;
      const baseIndex = whiteKeys.findIndex(k => k.dataset.note === baseWhiteNote);
      if (baseIndex !== -1) {
        const baseKey = whiteKeys[baseIndex];
        const blackKey = createKey(note, "black");

        // Put black key in the piano container and align horizontally over gap
        pianoEl.appendChild(blackKey);

        // Position black key relative to base white
        const rect = baseKey.getBoundingClientRect();
        const containerRect = pianoEl.getBoundingClientRect();
        const left = baseKey.offsetLeft + baseKey.offsetWidth; // approx gap center
        blackKey.style.left = `${left}px`;
        blackKey.style.top = `16px`;
      }
    }
  });
}

/* Create a key element */
function createKey(note, type) {
  const el = document.createElement("button");
  el.className = `key ${type}`;
  el.setAttribute("aria-label", `Key ${note}`);
  el.dataset.note = note;
  el.dataset.type = type;

  const label = document.createElement("span");
  label.className = "note-label";
  label.textContent = note;
  el.appendChild(label);

  // Prepare audio element
  const audioEl = new Audio(`${AUDIO_PATH}${note}${AUDIO_EXT}`);
  audioEl.preload = "auto";

  mediaNodes.set(note, { audioEl, sourceNode: null });

  // Pointer handlers
  el.addEventListener("pointerdown", () => playNote(note, el));
  el.addEventListener("pointerup", () => releaseNote(el));
  el.addEventListener("pointerleave", () => releaseNote(el));

  return el;
}

/* Audio graph with analyser for visual indication */
function setupAudioGraph() {
  // Lazily create audio context on first interaction (for browser policies)
  window.addEventListener("pointerdown", ensureAudioCtx, { once: true });
  window.addEventListener("keydown", ensureAudioCtx, { once: true });
}

function ensureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    drawScope();
  }
}

/* Play a note and show indicators */
function playNote(note, keyEl) {
  const media = mediaNodes.get(note);
  if (!media) return;

  // Restart audio from start for clear attack
  media.audioEl.currentTime = 0;
  media.audioEl.play().catch(() => { /* ignore autoplay blocks */ });

  // Connect to analyser if not connected
  if (audioCtx && !media.sourceNode) {
    const source = audioCtx.createMediaElementSource(media.audioEl);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    media.sourceNode = source;
  }

  // UI indicators
  keyEl.classList.add("active");
  currentNoteEl.textContent = note;
}

/* Release visual state */
function releaseNote(keyEl) {
  keyEl.classList.remove("active");
}

/* Simple pixel oscilloscope / meter */
function drawScope() {
  const W = scope.width;
  const H = scope.height;

  function loop() {
    requestAnimationFrame(loop);
    if (!analyser) return;

    analyser.getByteFrequencyData(dataArray);

    // Clear
    ctx.fillStyle = "#f7f2ec";
    ctx.fillRect(0, 0, W, H);

    // Grid lines for pixel feel
    ctx.fillStyle = "rgba(58,46,42,0.08)";
    for (let x = 0; x < W; x += 16) {
      ctx.fillRect(x, 0, 1, H);
    }
    for (let y = 0; y < H; y += 16) {
      ctx.fillRect(0, y, W, 1);
    }

    // Bars
    const barWidth = 6;
    const gap = 2;
    let x = 4;
    for (let i = 0; i < dataArray.length && x < W - barWidth; i++) {
      const v = dataArray[i];
      const barHeight = Math.floor((v / 255) * (H - 16));
      // Sakura-colored response
      ctx.fillStyle = i % 3 === 0 ? "#f6b7c1" : "#e48ea0";
      ctx.fillRect(x, H - barHeight - 4, barWidth, barHeight);
      x += barWidth + gap;
    }

    // Border
    ctx.strokeStyle = "#3a2e2a";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, W, H);
  }
  loop();
}

/* Idle drawing before audio context unlocks */
function drawScopeIdle() {
  const W = scope.width;
  const H = scope.height;
  ctx.fillStyle = "#f7f2ec";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(58,46,42,0.08)";
  for (let x = 0; x < W; x += 16) ctx.fillRect(x, 0, 1, H);
  for (let y = 0; y < H; y += 16) ctx.fillRect(0, y, W, 1);
  ctx.strokeStyle = "#3a2e2a";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, W, H);

  // Idle text
  ctx.fillStyle = "#4e6f7b";
  ctx.font = "12px monospace";
  ctx.fillText("Tap a key to unlock audio", 12, 22);
}

/* Optional: simple keyboard mapping (A/S/D... row) */
window.addEventListener("keydown", (e) => {
  // Map some keys to notes for quick test
  const map = {
    a: "C4", w: "C#4", s: "D4", e: "D#4", d: "E4", f: "F4",
    t: "F#4", g: "G4", y: "G#4", h: "A4", u: "A#4", j: "B4",
    k: "C5", o: "C#5", l: "D5", p: "D#5", ";": "E5"
  };
  const note = map[e.key.toLowerCase()];
  if (!note) return;

  const keyEl = pianoEl.querySelector(`.key[data-note="${note}"]`);
  if (keyEl) playNote(note, keyEl);
});

window.addEventListener("keyup", (e) => {
  const map = {
    a: "C4", w: "C#4", s: "D4", e: "D#4", d: "E4", f: "F4",
    t: "F#4", g: "G4", y: "G#4", h: "A4", u: "A#4", j: "B4",
    k: "C5", o: "C#5", l: "D5", p: "D#5", ";": "E5"
  };
  const note = map[e.key.toLowerCase()];
  if (!note) return;

  const keyEl = pianoEl.querySelector(`.key[data-note="${note}"]`);
  if (keyEl) releaseNote(keyEl);
});

/* Utilities */
function parseNote(note) {
  const letter = note.includes("#") ? note.slice(0, 2) : note[0];
  const octave = note.replace(letter, "");
  return [letter, octave];
}
<<<<<<< HEAD
=======

>>>>>>> 751f0f7f2ea4e2ee43f12ed09ea168e72f749511
