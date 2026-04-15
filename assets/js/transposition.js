const NOTE_NAMES = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
const SOLFEGE = ['1', '2', '3', '4', '5', '6', '7'];
const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];
const KEYS = [
  { name: 'C', acc: 0, sym: '', rel: 'A' },
  { name: 'G', acc: 1, sym: '#', rel: 'E' },
  { name: 'D', acc: 2, sym: '#', rel: 'B' },
  { name: 'A', acc: 3, sym: '#', rel: 'F#' },
  { name: 'E', acc: 4, sym: '#', rel: 'C#' },
  { name: 'B', acc: 5, sym: '#', rel: 'G#' },
  { name: 'F#', acc: 6, sym: '#', rel: 'D#' },
  { name: 'C#', acc: 7, sym: '#', rel: 'A#' },
  { name: 'Ab', acc: 4, sym: 'b', rel: 'F' },
  { name: 'Eb', acc: 3, sym: 'b', rel: 'C' },
  { name: 'Bb', acc: 2, sym: 'b', rel: 'G' },
  { name: 'F', acc: 1, sym: 'b', rel: 'D' }
];

const canvas = document.getElementById('cv');
const ctx = canvas.getContext('2d');
const SIZE = 300;
const DPR = window.devicePixelRatio || 1;
canvas.width = SIZE * DPR;
canvas.height = SIZE * DPR;
canvas.style.width = SIZE + 'px';
canvas.style.height = SIZE + 'px';
ctx.scale(DPR, DPR);

const CX = SIZE / 2;
const CY = SIZE / 2;
const R_OUT = 138;
const R_IN = 100;
const R_MID = 72;
const R_CENTER = 44;

let outerAngle = 0;
let dragging = false;
let lastAngle = 0;

function getRootSemitone() {
  return ((Math.round(outerAngle / (Math.PI / 6)) % 12) + 12) % 12;
}

function getKeyByRoot(semitone) {
  const prefer = { 0: 'C', 2: 'D', 4: 'E', 5: 'F', 7: 'G', 9: 'A', 11: 'B', 6: 'F#', 1: 'C#', 8: 'Ab', 3: 'Eb', 10: 'Bb' };
  return KEYS.find((key) => key.name === prefer[semitone]) || KEYS[0];
}

function getAccDisplay(key) {
  if (key.acc === 0) {
    return '无升降号';
  }
  const order = key.sym === '#' ? ['F', 'C', 'G', 'D', 'A', 'E', 'B'] : ['B', 'E', 'A', 'D', 'G', 'C', 'F'];
  return order.slice(0, key.acc).map((name) => name + key.sym).join('  ');
}

function getScale(semitone) {
  return MAJOR_STEPS.map((step) => NOTE_NAMES[(semitone + step) % 12]);
}

function getCirclePos(semitone) {
  const positions = ['12 点（无升降）', '7 点（1#）', '2 点（2#）', '9 点（3#）', '4 点（4#）', '11 点（5#）', '6 点（6# / 6b）', '1 点（7#）', '8 点（4b）', '3 点（3b）', '10 点（2b）', '5 点（1b）'];
  const indexMap = { 0: 0, 7: 1, 2: 2, 9: 3, 4: 4, 11: 5, 6: 6, 1: 7, 8: 8, 3: 9, 10: 10, 5: 11 };
  return positions[indexMap[semitone] ?? 0];
}

function theme() {
  const styles = getComputedStyle(document.documentElement);
  return {
    ring1: styles.getPropertyValue('--surface2').trim(),
    ring2: styles.getPropertyValue('--surface').trim(),
    stroke: styles.getPropertyValue('--border-mid').trim(),
    textPri: styles.getPropertyValue('--text-pri').trim(),
    textSec: styles.getPropertyValue('--text-sec').trim(),
    accent: styles.getPropertyValue('--accent').trim(),
    accentBg: styles.getPropertyValue('--accent-bg').trim(),
    solfege: styles.getPropertyValue('--accent-3').trim(),
    solfegeBg: styles.getPropertyValue('--accent-bg').trim()
  };
}

function updateInfo(semitone, key) {
  document.getElementById('key-name').textContent = key.name + ' 大调';
  document.getElementById('acc-disp').textContent = getAccDisplay(key);
  document.getElementById('i-rel').textContent = key.rel + ' 小调';
  document.getElementById('i-tonic').textContent = key.name;
  document.getElementById('i-circle').textContent = getCirclePos(semitone);

  const scale = getScale(semitone);
  const container = document.getElementById('scale-notes');
  container.innerHTML = '';
  scale.forEach((note, index) => {
    const pill = document.createElement('span');
    pill.className = 'note-pill' + (index === 0 ? ' root' : '');
    pill.textContent = SOLFEGE[index] + ' ' + note;
    container.appendChild(pill);
  });
}

function draw() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  const palette = theme();
  const root = getRootSemitone();

  [R_OUT, R_IN, R_CENTER].forEach((radius, index) => {
    ctx.beginPath();
    ctx.arc(CX, CY, radius, 0, Math.PI * 2);
    ctx.fillStyle = index === 1 ? palette.ring2 : palette.ring1;
    ctx.fill();
  });

  [R_OUT, R_IN, R_MID, R_CENTER].forEach((radius) => {
    ctx.beginPath();
    ctx.arc(CX, CY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = palette.stroke;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  });

  for (let index = 0; index < 12; index += 1) {
    const angle = index * Math.PI / 6 - Math.PI / 2;
    [[R_IN + 1, R_OUT - 1], [R_MID + 1, R_IN - 1]].forEach(([from, to]) => {
      ctx.beginPath();
      ctx.moveTo(CX + from * Math.cos(angle), CY + from * Math.sin(angle));
      ctx.lineTo(CX + to * Math.cos(angle), CY + to * Math.sin(angle));
      ctx.strokeStyle = palette.stroke;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });
  }

  for (let index = 0; index < 12; index += 1) {
    const angle = index * Math.PI / 6 - Math.PI / 2;
    const radius = (R_MID + R_IN) / 2;
    const x = CX + radius * Math.cos(angle);
    const y = CY + radius * Math.sin(angle);
    const note = NOTE_NAMES[index];
    const isRoot = index === root;
    const parts = note.split('/');

    if (isRoot) {
      ctx.beginPath();
      ctx.arc(x, y, 13, 0, Math.PI * 2);
      ctx.fillStyle = palette.accentBg;
      ctx.fill();
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (parts.length > 1) {
      ctx.fillStyle = isRoot ? palette.accent : palette.textPri;
      ctx.font = "500 11px 'IBM Plex Mono', monospace";
      ctx.fillText(parts[0], x, y - 5.5);
      ctx.fillStyle = isRoot ? palette.accent : palette.textSec;
      ctx.font = "400 9.5px 'IBM Plex Mono', monospace";
      ctx.fillText(parts[1], x, y + 5.5);
    } else {
      ctx.fillStyle = isRoot ? palette.accent : palette.textPri;
      ctx.font = `${isRoot ? '700' : '500'} 13px 'Noto Sans SC', sans-serif`;
      ctx.fillText(note, x, y);
    }
  }

  for (let index = 0; index < 7; index += 1) {
    const angle = outerAngle + MAJOR_STEPS[index] * Math.PI / 6 - Math.PI / 2;
    const radius = (R_IN + R_OUT) / 2;
    const x = CX + radius * Math.cos(angle);
    const y = CY + radius * Math.sin(angle);
    const isTonic = index === 0;

    if (isTonic) {
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fillStyle = palette.solfegeBg;
      ctx.fill();
    }

    ctx.fillStyle = isTonic ? palette.accent : palette.textPri;
    ctx.font = `${isTonic ? '700' : '500'} 14px 'Noto Sans SC', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(SOLFEGE[index], x, y);
  }

  const key = getKeyByRoot(root);
  ctx.fillStyle = palette.accent;
  ctx.font = "700 18px 'Noto Sans SC', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(key.name, CX, CY - 9);
  ctx.fillStyle = palette.textSec;
  ctx.font = "400 11px 'Noto Sans SC', sans-serif";
  ctx.fillText('大调', CX, CY + 10);
  updateInfo(root, key);
}

const wrap = document.getElementById('dial-wrap');

function clientXY(event) {
  return event.touches ? [event.touches[0].clientX, event.touches[0].clientY] : [event.clientX, event.clientY];
}

function angleOf(event) {
  const rect = wrap.getBoundingClientRect();
  const [px, py] = clientXY(event);
  return Math.atan2(py - rect.top - rect.height / 2, px - rect.left - rect.width / 2);
}

function isOuterRing(event) {
  const rect = wrap.getBoundingClientRect();
  const [px, py] = clientXY(event);
  const scale = rect.width / SIZE;
  const distance = Math.hypot(px - rect.left - rect.width / 2, py - rect.top - rect.height / 2);
  return distance > R_IN * scale && distance < (R_OUT + 16) * scale;
}

function snap() {
  outerAngle = Math.round(outerAngle / (Math.PI / 6)) * (Math.PI / 6);
  draw();
}

wrap.addEventListener('mousedown', (event) => {
  if (!isOuterRing(event)) {
    return;
  }
  dragging = true;
  lastAngle = angleOf(event);
  event.preventDefault();
});

wrap.addEventListener('touchstart', (event) => {
  if (!isOuterRing(event)) {
    return;
  }
  dragging = true;
  lastAngle = angleOf(event);
  event.preventDefault();
}, { passive: false });

window.addEventListener('mousemove', (event) => {
  if (!dragging) {
    return;
  }
  const angle = angleOf(event);
  const delta = Math.atan2(Math.sin(angle - lastAngle), Math.cos(angle - lastAngle));
  outerAngle += delta;
  lastAngle = angle;
  draw();
});

window.addEventListener('touchmove', (event) => {
  if (!dragging) {
    return;
  }
  const angle = angleOf(event);
  const delta = Math.atan2(Math.sin(angle - lastAngle), Math.cos(angle - lastAngle));
  outerAngle += delta;
  lastAngle = angle;
  draw();
  event.preventDefault();
}, { passive: false });

window.addEventListener('mouseup', () => {
  if (dragging) {
    dragging = false;
    snap();
  }
});

window.addEventListener('touchend', () => {
  if (dragging) {
    dragging = false;
    snap();
  }
});

wrap.addEventListener('wheel', (event) => {
  event.preventDefault();
  outerAngle += Math.sign(event.deltaY) * (Math.PI / 6);
  snap();
}, { passive: false });

window.addEventListener('storage', (event) => {
  if (event.key === 'mt.theme') {
    draw();
  }
});

new MutationObserver(draw).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
});

draw();
