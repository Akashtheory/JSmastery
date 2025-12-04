// Simple piano logic
const keys = document.querySelectorAll(".key");

// Map keyboard letters to notes
const keyMap = {
  a: "C4",
  s: "D4",
  d: "E4",
  f: "F4",
  g: "G4",
  h: "A4",
  j: "B4"
};

// Add click listeners
keys.forEach(key => {
  key.addEventListener("click", () => playNote(key.dataset.note, key));
});

function playNote(note, keyEl) {
  const audio = new Audio(`audio/${note}.mp3`);
  audio.currentTime = 0;
  audio.play();
  keyEl.classList.add("active");
  audio.addEventListener("ended", () => keyEl.classList.remove("active"));
}

// Keyboard support
window.addEventListener("keydown", e => {
  const note = keyMap[e.key];
  if (note) {
    const keyEl = document.querySelector(`.key[data-note="${note}"]`);
    if (keyEl) playNote(note, keyEl);
  }
});
