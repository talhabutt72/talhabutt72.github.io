// ==========================================================================
// Footer year
// ==========================================================================
document.getElementById("year").textContent = new Date().getFullYear();

// ==========================================================================
// Mobile nav toggle
// ==========================================================================
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ==========================================================================
// Hero "attention map" canvas
// A small network of tokens connected by lines whose opacity pulses,
// echoing the attention weights behind the transformer work in the bio.
// ==========================================================================
const canvas = document.getElementById("attentionCanvas");
const ctx = canvas.getContext("2d");

const TOKENS = ["data", "model", "train", "infer", "embed", "learn", "predict", "query", "vector", "rank"];

let nodes = [];
let width, height;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resize() {
  width = canvas.width = canvas.offsetWidth * devicePixelRatio;
  height = canvas.height = canvas.offsetHeight * devicePixelRatio;
}

function initNodes() {
  nodes = TOKENS.map((label, i) => {
    const angle = (i / TOKENS.length) * Math.PI * 2;
    const radiusX = width * 0.32;
    const radiusY = height * 0.28;
    return {
      label,
      baseX: width * 0.62 + Math.cos(angle) * radiusX,
      baseY: height * 0.5 + Math.sin(angle) * radiusY,
      x: 0,
      y: 0,
      phase: Math.random() * Math.PI * 2,
    };
  });
}

function draw(time) {
  ctx.clearRect(0, 0, width, height);

  const t = time * 0.0004;

  nodes.forEach((n) => {
    n.x = n.baseX + Math.sin(t + n.phase) * 10;
    n.y = n.baseY + Math.cos(t * 0.8 + n.phase) * 10;
  });

  // connections with pulsing "attention weight" opacity
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const weight = (Math.sin(t * 1.3 + i * 1.7 + j * 0.6) + 1) / 2; // 0..1
      if (weight < 0.55) continue; // sparse attention, not fully connected

      ctx.strokeStyle = `rgba(91, 141, 239, ${weight * 0.22})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  // nodes
  nodes.forEach((n, i) => {
    const pulse = (Math.sin(t * 1.5 + n.phase) + 1) / 2;
    const r = (2.2 + pulse * 1.6) * devicePixelRatio;

    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fillStyle = i % 3 === 0
      ? "rgba(242, 166, 90, 0.85)"
      : "rgba(91, 141, 239, 0.85)";
    ctx.fill();

    ctx.font = `${11 * devicePixelRatio}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "rgba(138, 147, 166, 0.55)";
    ctx.fillText(n.label, n.x + 8 * devicePixelRatio, n.y + 3 * devicePixelRatio);
  });

  if (!reduceMotion) requestAnimationFrame(draw);
}

function setup() {
  resize();
  initNodes();
  draw(0);
}

window.addEventListener("resize", () => {
  resize();
  initNodes();
  if (reduceMotion) draw(0);
});

setup();
