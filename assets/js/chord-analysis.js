
const NOTE_INDEX = {
  C: 0, "B#": 0,
  "C#": 1, Db: 1,
  D: 2,
  "D#": 3, Eb: 3,
  E: 4, Fb: 4,
  F: 5, "E#": 5,
  "F#": 6, Gb: 6,
  G: 7,
  "G#": 8, Ab: 8,
  A: 9,
  "A#": 10, Bb: 10,
  B: 11, Cb: 11
};

const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const QUALITIES = [
  { pattern: /^maj13$/i, quality: "maj13", label: "大十三和弦", formula: ["1", "3", "5", "7", "9", "13"], semitones: [0, 4, 7, 11, 14, 21] },
  { pattern: /^maj9$/i, quality: "maj9", label: "大九和弦", formula: ["1", "3", "5", "7", "9"], semitones: [0, 4, 7, 11, 14] },
  { pattern: /^maj7$/i, quality: "maj7", label: "大七和弦", formula: ["1", "3", "5", "7"], semitones: [0, 4, 7, 11] },
  { pattern: /^mmaj7$/i, quality: "mMaj7", label: "小大七和弦", formula: ["1", "b3", "5", "7"], semitones: [0, 3, 7, 11] },
  { pattern: /^m7b5$/i, quality: "m7b5", label: "半减七和弦", formula: ["1", "b3", "b5", "b7"], semitones: [0, 3, 6, 10] },
  { pattern: /^dim7$/i, quality: "dim7", label: "减七和弦", formula: ["1", "b3", "b5", "bb7"], semitones: [0, 3, 6, 9] },
  { pattern: /^dim$/i, quality: "dim", label: "减三和弦", formula: ["1", "b3", "b5"], semitones: [0, 3, 6] },
  { pattern: /^aug$/i, quality: "aug", label: "增三和弦", formula: ["1", "3", "#5"], semitones: [0, 4, 8] },
  { pattern: /^\+$/i, quality: "aug", label: "增三和弦", formula: ["1", "3", "#5"], semitones: [0, 4, 8] },
  { pattern: /^sus2$/i, quality: "sus2", label: "挂二和弦", formula: ["1", "2", "5"], semitones: [0, 2, 7] },
  { pattern: /^sus4$/i, quality: "sus4", label: "挂四和弦", formula: ["1", "4", "5"], semitones: [0, 5, 7] },
  { pattern: /^add9$/i, quality: "add9", label: "加九和弦", formula: ["1", "3", "5", "9"], semitones: [0, 4, 7, 14] },
  { pattern: /^6\/9$/i, quality: "6/9", label: "六九和弦", formula: ["1", "3", "5", "6", "9"], semitones: [0, 4, 7, 9, 14] },
  { pattern: /^69$/i, quality: "6/9", label: "六九和弦", formula: ["1", "3", "5", "6", "9"], semitones: [0, 4, 7, 9, 14] },
  { pattern: /^m9$/i, quality: "m9", label: "小九和弦", formula: ["1", "b3", "5", "b7", "9"], semitones: [0, 3, 7, 10, 14] },
  { pattern: /^9$/i, quality: "9", label: "属九和弦", formula: ["1", "3", "5", "b7", "9"], semitones: [0, 4, 7, 10, 14] },
  { pattern: /^m7$/i, quality: "m7", label: "小七和弦", formula: ["1", "b3", "5", "b7"], semitones: [0, 3, 7, 10] },
  { pattern: /^7$/i, quality: "7", label: "属七和弦", formula: ["1", "3", "5", "b7"], semitones: [0, 4, 7, 10] },
  { pattern: /^m6$/i, quality: "m6", label: "小六和弦", formula: ["1", "b3", "5", "6"], semitones: [0, 3, 7, 9] },
  { pattern: /^6$/i, quality: "6", label: "六和弦", formula: ["1", "3", "5", "6"], semitones: [0, 4, 7, 9] },
  { pattern: /^m$/i, quality: "m", label: "小三和弦", formula: ["1", "b3", "5"], semitones: [0, 3, 7] },
  { pattern: /^min$/i, quality: "m", label: "小三和弦", formula: ["1", "b3", "5"], semitones: [0, 3, 7] },
  { pattern: /^$/i, quality: "maj", label: "大三和弦", formula: ["1", "3", "5"], semitones: [0, 4, 7] }
];

const INTERVAL_LABELS = {
  0: "纯一度",
  1: "小二度",
  2: "大二度",
  3: "小三度",
  4: "大三度",
  5: "纯四度",
  6: "增四度 / 减五度",
  7: "纯五度",
  8: "小六度",
  9: "大六度",
  10: "小七度",
  11: "大七度",
  12: "纯八度",
  13: "小九度",
  14: "大九度",
  15: "增九度",
  16: "大十度",
  17: "纯十一度",
  18: "#11 / b12",
  19: "纯十二度",
  20: "小十三度",
  21: "大十三度"
};

const ALIAS_MAP = {
  maj: ["major", "M"],
  m: ["minor", "min", "-"],
  "7": ["dominant 7"],
  maj7: ["M7", "△7"],
  m7: ["min7", "-7"],
  dim: ["o", "mb5"],
  dim7: ["o7"],
  "m7b5": ["ø7", "half-diminished"],
  aug: ["+", "+5"],
  sus2: ["add2(no3)"],
  sus4: ["sus"],
  add9: ["add2"],
  "6/9": ["69"],
  mMaj7: ["m(maj7)"]
};

const PRESETS = ["C", "Cm", "Cmaj7", "G7", "Bbadd9", "Dsus4", "F#m7b5", "Eaug", "Am9", "G/B"];

function normalizeInput(value) {
  return value.trim().replace(/\s+/g, "");
}

function formatNote(index, prefersFlats) {
  return (prefersFlats ? FLAT_NAMES : SHARP_NAMES)[index];
}

function parseChord(rawInput) {
  const input = normalizeInput(rawInput);
  if (!input) {
    throw new Error("请输入和弦标记。");
  }

  const match = input.match(/^([A-Ga-g])([#b]?)(.*)$/);
  if (!match) {
    throw new Error("根音格式不正确，请使用 A-G 开头。");
  }

  const root = match[1].toUpperCase() + (match[2] || "");
  if (!(root in NOTE_INDEX)) {
    throw new Error("暂不支持该根音写法。");
  }

  const remainder = match[3] || "";
  const slashParts = remainder.split("/");
  if (slashParts.length > 2) {
    throw new Error("斜杠和弦只能包含一个低音。");
  }

  const qualityRaw = slashParts[0];
  const bassRaw = slashParts[1] || "";
  const descriptor = QUALITIES.find((item) => item.pattern.test(qualityRaw));
  if (!descriptor) {
    throw new Error("暂不支持这个和弦类型，请尝试 maj7、m7、add9、sus4 等常见写法。");
  }

  let bass = null;
  if (bassRaw) {
    bass = bassRaw.charAt(0).toUpperCase() + bassRaw.slice(1);
    if (!(bass in NOTE_INDEX)) {
      throw new Error("斜杠后的低音格式不正确。");
    }
  }

  const prefersFlats = root.includes("b") || (bass && bass.includes("b"));
  const rootIndex = NOTE_INDEX[root];
  const tones = descriptor.semitones.map((semi, index) => ({
    formula: descriptor.formula[index],
    semitone: semi,
    pitchClass: (rootIndex + semi) % 12,
    note: formatNote((rootIndex + semi) % 12, prefersFlats),
    intervalName: INTERVAL_LABELS[semi] || `${semi} 半音`
  }));

  const bassIndex = bass ? NOTE_INDEX[bass] : rootIndex;

  return {
    input,
    root,
    qualityLabel: descriptor.label,
    formula: descriptor.formula.join(" - "),
    tones,
    bass,
    aliases: ALIAS_MAP[descriptor.quality] || [],
    containsBass: tones.some((tone) => tone.pitchClass === bassIndex)
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderResult(data) {
  const root = document.getElementById("result-root");
  const bassText = data.bass ? ` / ${data.bass}` : "";
  const inversionText = data.bass
    ? (data.containsBass ? `低音为 ${data.bass}，属于转位或指定低音写法。` : `低音 ${data.bass} 不在当前和弦构成音内，属于外加低音写法。`)
    : "未指定低音，默认根音在低声部。";

  root.innerHTML = `
    <div class="hero-result">
      <div>
        <div class="chord-name">${escapeHtml(data.input)}</div>
        <div class="chord-subtitle">${escapeHtml(data.qualityLabel)}${bassText ? ` · ${escapeHtml(bassText)}` : ""}</div>
        <div class="chord-pills">
          <span class="pill pill-accent">根音 ${escapeHtml(data.root)}</span>
          <span class="pill">${escapeHtml(data.qualityLabel)}</span>
          <span class="pill">公式 ${escapeHtml(data.formula)}</span>
        </div>
      </div>
      <div class="muted" style="max-width:260px; font-size:.84rem; line-height:1.7;">${escapeHtml(inversionText)}</div>
    </div>

    <div class="divider"></div>

    <div class="grid">
      <div>
        <div class="section-title">组成音</div>
        <div class="tone-list">
          ${data.tones.map((tone) => `<span class="tone-chip"><strong>${escapeHtml(tone.note)}</strong> ${escapeHtml(tone.formula)}</span>`).join("")}
        </div>
      </div>
      <div>
        <div class="section-title">常见别名</div>
        <div class="alias-list">
          ${data.aliases.length ? data.aliases.map((alias) => `<span class="alias-chip">${escapeHtml(alias)}</span>`).join("") : `<span class="alias-chip muted">无常见别名</span>`}
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <div>
      <div class="section-title">度数与音程</div>
      <div class="degree-grid">
        ${data.tones.map((tone) => `
          <div class="degree-row">
            <div class="mono">${escapeHtml(tone.formula)}</div>
            <div>${escapeHtml(tone.note)}</div>
            <div class="muted">${escapeHtml(tone.intervalName)}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="divider"></div>

    <div>
      <div class="section-title">半音结构</div>
      <div class="interval-list">
        ${data.tones.map((tone) => `<span class="interval-chip">${escapeHtml(`${tone.semitone} st`)} · ${escapeHtml(tone.intervalName)}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderError(message) {
  document.getElementById("result-root").innerHTML = `<div class="error-state">${escapeHtml(message)}</div>`;
}

function runAnalysis() {
  try {
    const data = parseChord(document.getElementById("chord-input").value);
    renderResult(data);
  } catch (error) {
    renderError(error.message);
  }
}

function buildPresets() {
  const list = document.getElementById("preset-list");
  PRESETS.forEach((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset";
    button.textContent = preset;
    button.addEventListener("click", () => {
      document.getElementById("chord-input").value = preset;
      runAnalysis();
    });
    list.appendChild(button);
  });
}

document.getElementById("analyze-btn").addEventListener("click", runAnalysis);
document.getElementById("chord-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runAnalysis();
  }
});

buildPresets();
runAnalysis();

