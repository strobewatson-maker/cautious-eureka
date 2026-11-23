// src/engine/chords.ts
var DEFAULT_ANALYSIS = {
  chordSensitivity: "balanced",
  detectArpeggios: true,
  showInversions: true,
  romanNumerals: true,
  localKey: true,
  minChordHold: 0.6
};
var LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
var LETTER_PC = [0, 2, 4, 5, 7, 9, 11];
var NAT_PC_LETTER = [0, -1, 1, -1, 2, 3, -1, 4, -1, 5, -1, 6];
var SHARP_NAMES = ["C", "C\u266F", "D", "D\u266F", "E", "F", "F\u266F", "G", "G\u266F", "A", "A\u266F", "B"];
var FLAT_NAMES = ["C", "D\u266D", "D", "E\u266D", "E", "F", "G\u266D", "G", "A\u266D", "A", "B\u266D", "B"];
var KEY0_NAMES = ["C", "C\u266F", "D", "E\u266D", "E", "F", "F\u266F", "G", "A\u266D", "A", "B\u266D", "B"];
var MAJOR_SHARPS = [0, -5, 2, -3, 4, -1, 6, 1, -4, 3, -2, 5];
var accStr = (a) => a === 0 ? "" : a > 0 ? "\u266F".repeat(a) : "\u266D".repeat(-a);
var mod12 = (n) => (n % 12 + 12) % 12;
function pcName(pc, sharps) {
  pc = mod12(pc);
  return (sharps > 0 ? SHARP_NAMES : sharps < 0 ? FLAT_NAMES : KEY0_NAMES)[pc];
}
var DEG = {
  "1": [0, 0],
  b2: [1, 1],
  "2": [2, 1],
  "#2": [3, 1],
  b3: [3, 2],
  "3": [4, 2],
  "4": [5, 3],
  "#4": [6, 3],
  b5: [6, 4],
  "5": [7, 4],
  "#5": [8, 4],
  b6: [8, 5],
  "6": [9, 5],
  bb7: [9, 6],
  b7: [10, 6],
  "7": [11, 6],
  b9: [1, 1],
  "9": [2, 1],
  "#9": [3, 1],
  "11": [5, 3],
  "#11": [6, 3],
  b13: [8, 5],
  "13": [9, 5]
};
var T = [];
var def = (id, sym, words, tones, omit = "", prior = 0.7, fig) => T.push({ id, sym, words, tones: tones.split(" "), omit: omit ? omit.split(" ") : [], prior, fig });
def("maj", "", "major", "1 3 5", "", 1, "triad");
def("min", "m", "minor", "1 b3 5", "", 1, "triad");
def("dim", "\xB0", "diminished", "1 b3 b5", "", 0.85, "triad");
def("aug", "+", "augmented", "1 3 #5", "", 0.8, "triad");
def("sus2", "sus2", "suspended 2nd", "1 2 5", "", 0.78);
def("sus4", "sus4", "suspended 4th", "1 4 5", "", 0.8);
def("majb5", "(\u266D5)", "major \u266D5", "1 3 b5", "", 0.42);
def("6", "6", "major 6th", "1 3 5 6", "", 0.8);
def("m6", "m6", "minor 6th", "1 b3 5 6", "", 0.74);
def("69", "6/9", "6/9", "1 3 5 6 9", "5", 0.7);
def("m69", "m6/9", "minor 6/9", "1 b3 5 6 9", "5", 0.58);
def("maj7", "maj7", "major 7th", "1 3 5 7", "5", 0.92, "seventh");
def("7", "7", "dominant 7th", "1 3 5 b7", "5", 0.96, "seventh");
def("m7", "m7", "minor 7th", "1 b3 5 b7", "5", 0.92, "seventh");
def("mmaj7", "m(maj7)", "minor-major 7th", "1 b3 5 7", "5", 0.62, "seventh");
def("m7b5", "\xF87", "half-diminished 7th", "1 b3 b5 b7", "", 0.88, "seventh");
def("dim7", "\xB07", "diminished 7th", "1 b3 b5 bb7", "", 0.9, "seventh");
def("7s5", "7\u266F5", "augmented 7th", "1 3 #5 b7", "", 0.66);
def("maj7s5", "maj7\u266F5", "major 7th \u266F5", "1 3 #5 7", "", 0.52);
def("7b5", "7\u266D5", "dominant 7th \u266D5", "1 3 b5 b7", "", 0.62);
def("7sus4", "7sus4", "dominant 7th suspended 4th", "1 4 5 b7", "5", 0.72);
def("add9", "add9", "major add9", "1 3 5 9", "5", 0.78);
def("madd9", "m(add9)", "minor add9", "1 b3 5 9", "5", 0.7);
def("9", "9", "dominant 9th", "1 3 5 b7 9", "5", 0.8);
def("maj9", "maj9", "major 9th", "1 3 5 7 9", "5", 0.8);
def("m9", "m9", "minor 9th", "1 b3 5 b7 9", "5", 0.78);
def("mmaj9", "m(maj9)", "minor-major 9th", "1 b3 5 7 9", "5", 0.5);
def("7b9", "7\u266D9", "dominant 7th \u266D9", "1 3 5 b7 b9", "5", 0.72);
def("7s9", "7\u266F9", "dominant 7th \u266F9", "1 3 5 b7 #9", "5", 0.68);
def("9sus4", "9sus4", "dominant 9th suspended 4th", "1 4 5 b7 9", "5", 0.62);
def("9s5", "9\u266F5", "dominant 9th \u266F5", "1 3 #5 b7 9", "", 0.45);
def("7s5b9", "7\u266F5\u266D9", "dominant 7th \u266F5 \u266D9", "1 3 #5 b7 b9", "", 0.45);
def("7b5b9", "7\u266D5\u266D9", "dominant 7th \u266D5 \u266D9", "1 3 b5 b7 b9", "", 0.42);
def("7s5s9", "7\u266F5\u266F9", "dominant 7th \u266F5 \u266F9", "1 3 #5 b7 #9", "", 0.4);
def("m11", "m11", "minor 11th", "1 b3 5 b7 9 11", "5 9", 0.66);
def("m7add11", "m7(add11)", "minor 7th add11", "1 b3 5 b7 11", "5", 0.6);
def("madd11", "m(add11)", "minor add11", "1 b3 5 11", "5", 0.5);
def("maj7s11", "maj7\u266F11", "major 7th \u266F11", "1 3 5 7 #11", "5", 0.62);
def("maj9s11", "maj9\u266F11", "major 9th \u266F11", "1 3 5 7 9 #11", "5 9", 0.5);
def("7s11", "7\u266F11", "dominant 7th \u266F11", "1 3 5 b7 #11", "5", 0.6);
def("9s11", "9\u266F11", "dominant 9th \u266F11", "1 3 5 b7 9 #11", "5", 0.5);
def("add4", "add4", "major add4", "1 3 4 5", "", 0.45);
def("13", "13", "dominant 13th", "1 3 5 b7 9 13", "5 9", 0.66);
def("maj13", "maj13", "major 13th", "1 3 5 7 9 13", "5 9", 0.6);
def("m13", "m13", "minor 13th", "1 b3 5 b7 9 13", "5 9", 0.55);
def("13b9", "13\u266D9", "dominant 13th \u266D9", "1 3 5 b7 b9 13", "5", 0.5);
def("7add13", "7(13)", "dominant 7th add13", "1 3 5 b7 13", "5", 0.6);
def("maj7add13", "maj7(13)", "major 7th add13", "1 3 5 7 13", "5", 0.5);
var SEMI_SET = (tpl) => {
  const s = /* @__PURE__ */ new Set();
  for (const d of tpl.tones) s.add(DEG[d][0]);
  return s;
};
var PREPARED = T.map((tpl) => ({
  tier: tpl.prior >= 0.7 ? 1 : tpl.prior >= 0.55 ? 2 : 3,
  tpl,
  semis: SEMI_SET(tpl),
  required: tpl.tones.filter((d) => d !== "1" && !tpl.omit.includes(d)).map((d) => DEG[d][0])
}));
var CHORD_LIBRARY_SIZE = T.length;
var CHORD_QUALITIES = T.map((t) => ({ id: t.id, symbol: t.sym, name: t.words, tones: t.tones.join(" ") }));
var BY_ID = new Map(T.map((t) => [t.id, t]));
var FAMILY = {};
for (const id of ["min", "m6", "m69", "m7", "mmaj7", "madd9", "m9", "mmaj9", "m11", "m7add11", "madd11", "m13"]) FAMILY[id] = "min";
for (const id of ["maj", "6", "69", "maj7", "add9", "maj9", "maj7s11", "maj9s11", "add4", "maj13", "maj7add13"]) FAMILY[id] = "maj";
for (const id of ["7", "9", "13", "7b9", "7s9", "7s11", "9s11", "13b9", "7add13"]) FAMILY[id] = "dom";
var familyOf = (id) => FAMILY[id] ?? id;
var KS_MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
var KS_MINOR = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
function pearson(x, y) {
  let mx = 0;
  let my = 0;
  for (let i = 0; i < 12; i++) {
    mx += x[i];
    my += y[i];
  }
  mx /= 12;
  my /= 12;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < 12; i++) {
    const a = x[i] - mx;
    const b = y[i] - my;
    sxy += a * b;
    sxx += a * a;
    syy += b * b;
  }
  return sxx > 1e-9 && syy > 1e-9 ? sxy / Math.sqrt(sxx * syy) : 0;
}
function keyScores(hist) {
  const out = [];
  const rot = new Array(12);
  for (let tonic = 0; tonic < 12; tonic++) {
    for (const minor of [false, true]) {
      const prof = minor ? KS_MINOR : KS_MAJOR;
      for (let i = 0; i < 12; i++) rot[i] = prof[mod12(i - tonic)];
      out.push({ tonic, minor, r: pearson(hist, rot) });
    }
  }
  return out;
}
var keySharps = (tonic, minor) => MAJOR_SHARPS[minor ? mod12(tonic + 3) : tonic];
function keyName(tonic, minor) {
  return `${pcName(tonic, keySharps(tonic, minor))} ${minor ? "minor" : "major"}`;
}
function buildKeyModel(notes, fileKey, allowLocal) {
  let dur = 1;
  for (const n of notes) dur = Math.max(dur, n.end);
  const secs = Math.ceil(dur) + 2;
  const bins = Array.from({ length: secs }, () => new Float32Array(12));
  for (const n of notes) {
    const w0 = 0.6 + 0.4 * (n.vel / 127);
    const d = Math.max(0.05, Math.min(n.end - n.start, 3));
    const bassBoost = n.midi < 52 ? 1.25 : 1;
    let t = n.start;
    const tEnd = n.start + d;
    while (t < tEnd - 1e-9) {
      const s = Math.min(secs - 1, Math.floor(t));
      const seg = Math.min(tEnd, s + 1) - t;
      bins[s][n.midi % 12] += seg * w0 * bassBoost;
      t += seg > 0 ? seg : 1;
    }
  }
  const total = new Float32Array(12);
  for (const b of bins) for (let i = 0; i < 12; i++) total[i] += b[i];
  const scores = keyScores(total);
  if (fileKey) {
    const majTonic = mod12(7 * fileKey.sharps);
    for (const s of scores) {
      if (!s.minor && s.tonic === majTonic || s.minor && s.tonic === mod12(majTonic + 9)) s.r += 0.035;
      if (fileKey.minor && s.minor && s.tonic === mod12(majTonic + 9)) s.r += 0.02;
    }
  }
  scores.sort((a, b) => b.r - a.r);
  const best = scores[0];
  const second = scores.find((s) => !(s.tonic === best.tonic && s.minor === best.minor) && !isRelative(best, s)) ?? scores[1];
  const conf = Math.max(0, Math.min(1, (best.r - 0.2) * 1.1 + Math.min(0.2, (best.r - second.r) * 1.5)));
  const global = {
    tonic: best.tonic,
    minor: best.minor,
    sharps: keySharps(best.tonic, best.minor),
    name: keyName(best.tonic, best.minor),
    confidence: conf,
    source: "analysis"
  };
  const prefix = [];
  for (let i = 0; i < 12; i++) {
    const p = new Float32Array(secs + 1);
    for (let s = 0; s < secs; s++) p[s + 1] = p[s] + bins[s][i];
    prefix.push(p);
  }
  return { global, bins, prefix, localCache: /* @__PURE__ */ new Map(), allowLocal };
}
var isRelative = (a, b) => a.minor !== b.minor && (a.minor ? mod12(a.tonic + 3) === b.tonic : mod12(b.tonic + 3) === a.tonic);
function rawLocalKey(m, bin) {
  const g = m.global;
  const hit = m.localCache.get(bin);
  if (hit) return hit;
  const a = Math.max(0, bin * 3 - 9);
  const b = Math.min(m.bins.length, bin * 3 + 12);
  const hist = new Float32Array(12);
  let tot = 0;
  for (let i = 0; i < 12; i++) {
    hist[i] = m.prefix[i][b] - m.prefix[i][a];
    tot += hist[i];
  }
  let res = g;
  if (tot > 4) {
    const sc = keyScores(hist);
    let best = sc[0];
    let gScore = -1;
    for (const s of sc) {
      if (s.r > best.r) best = s;
      if (s.tonic === g.tonic && s.minor === g.minor) gScore = s.r;
    }
    if (!(best.tonic === g.tonic && best.minor === g.minor) && !isRelative(best, g) && best.r > gScore + 0.12 && best.r > 0.7) res = { tonic: best.tonic, minor: best.minor };
  }
  m.localCache.set(bin, res);
  return res;
}
function localKeyAt(m, t) {
  const g = m.global;
  if (!m.allowLocal) return g;
  const bin = Math.max(0, Math.floor(t / 3));
  const c = rawLocalKey(m, bin);
  if (c.tonic === g.tonic && c.minor === g.minor) return g;
  const p = rawLocalKey(m, Math.max(0, bin - 1));
  const n = rawLocalKey(m, bin + 1);
  const same = (x) => x.tonic === c.tonic && x.minor === c.minor;
  return same(p) && same(n) ? c : g;
}
var SENS = {
  strict: { accept: 0.8, extra: 0.16, arpBonus: 0.06, maxTier: 1, tierPenalty: [0, 0, 0] },
  balanced: { accept: 0.7, extra: 0.28, arpBonus: 0.08, maxTier: 2, tierPenalty: [0, 0, 0.06] },
  detailed: { accept: 0.6, extra: 0.4, arpBonus: 0.08, maxTier: 3, tierPenalty: [0, 0.02, 0.07] }
};
var MAJ_SCALE = /* @__PURE__ */ new Set([0, 2, 4, 5, 7, 9, 11]);
var MIN_SCALE = /* @__PURE__ */ new Set([0, 2, 3, 5, 7, 8, 9, 10, 11]);
function keyFit(root, semis, key) {
  const scale = key.minor ? MIN_SCALE : MAJ_SCALE;
  let inKey = 0;
  semis.forEach((s) => {
    if (scale.has(mod12(root + s - key.tonic))) inKey++;
  });
  const diatonicRoot = scale.has(mod12(root - key.tonic)) ? 1 : 0;
  return 0.65 * (inKey / semis.size) + 0.35 * diatonicRoot;
}
function matchChord(weights, bassPc, key, mo) {
  const extraLimit = mo.extraLimit;
  const GHOST = 0.28;
  let totalW = 0;
  for (let i = 0; i < 12; i++) totalW += weights[i];
  if (totalW <= 0) return null;
  const roots = [];
  for (let i = 0; i < 12; i++) if (weights[i] >= 0.3) roots.push(i);
  let best = null;
  let second = null;
  for (const root of roots) {
    for (const prep of PREPARED) {
      if (prep.tier > mo.maxTier || prep.tpl.tones.length > mo.maxTones) continue;
      let ok = true;
      for (const r of prep.required) {
        if (weights[(root + r) % 12] < 0.3) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      let covered = 0;
      let extra = 0;
      for (let pc = 0; pc < 12; pc++) {
        const w = weights[pc];
        if (w <= 0) continue;
        if (prep.semis.has(mod12(pc - root))) covered += w;
        else if (w >= GHOST && !(pc === mo.exemptPc && pc !== bassPc)) extra += w;
      }
      const share = extra / (covered + extra);
      if (share > extraLimit) continue;
      const fit = covered / (covered + extra);
      let present = 0;
      for (const d of prep.tpl.tones) if (weights[(root + DEG[d][0]) % 12] >= 0.3) present++;
      const completeness = present / prep.tpl.tones.length;
      let bassTerm = 0.02;
      if (bassPc === root) bassTerm = 0.18;
      else {
        const rel = mod12(bassPc - root);
        const tone = prep.tpl.tones.find((d) => DEG[d][0] === rel);
        if (tone === "3" || tone === "b3") bassTerm = 0.085;
        else if (tone === "5" || tone === "b5" || tone === "#5") bassTerm = 0.07;
        else if (tone) bassTerm = 0.05;
      }
      const rootShare = Math.min(1, weights[root] / totalW * prep.tpl.tones.length);
      const kf = keyFit(root, prep.semis, key);
      const complexity = Math.max(0, prep.tpl.tones.length - 4) * 0.02 + mo.tierPenalty[prep.tier - 1];
      const sixthInv = bassPc !== root && (prep.tpl.id === "6" || prep.tpl.id === "m6") ? 0.07 : 0;
      const score = -sixthInv + 0.4 * fit + bassTerm + 0.12 * completeness + 0.14 * prep.tpl.prior + 0.1 * kf + 0.06 * rootShare - complexity;
      const cand = { root, prep, score, extraShare: share, present };
      if (!best || score > best.score) {
        second = best;
        best = cand;
      } else if (!second || score > second.score) second = cand;
    }
  }
  return best ? { best, second, weights } : null;
}
function spellChord(rootPc, tpl, extraSemis, keySharpsPref) {
  const cands = [];
  if (NAT_PC_LETTER[rootPc] >= 0) cands.push({ letter: NAT_PC_LETTER[rootPc], acc: 0 });
  else {
    cands.push({ letter: NAT_PC_LETTER[mod12(rootPc - 1)], acc: 1 });
    cands.push({ letter: NAT_PC_LETTER[mod12(rootPc + 1)], acc: -1 });
  }
  const prefSharp = keySharpsPref > 0 ? true : keySharpsPref < 0 ? false : null;
  let bestCost = Infinity;
  let best = null;
  for (const c of cands) {
    let cost = 0;
    const names = /* @__PURE__ */ new Map();
    const tones = [];
    const nameOf = (semi, step) => {
      const li = (c.letter + step) % 7;
      const target = mod12(rootPc + semi);
      const acc = mod12(target - LETTER_PC[li] + 6) - 6;
      if (Math.abs(acc) > 1) {
        cost += 6;
        return pcName(target, keySharpsPref);
      }
      cost += Math.abs(acc) * (prefSharp === null ? 0.5 : acc > 0 === prefSharp ? 0.2 : 0.7);
      return LETTERS[li] + accStr(acc);
    };
    for (const d of tpl.tones) {
      const [semi, step] = DEG[d];
      const nm = d === "1" ? LETTERS[c.letter] + accStr(c.acc) : nameOf(semi, step);
      names.set(semi, nm);
      if (!tpl.omit.includes(d) || extraSemis.includes(semi)) tones.push(nm);
    }
    for (const semi of extraSemis) {
      if (names.has(semi)) continue;
      names.set(semi, pcName(rootPc + semi, keySharpsPref));
    }
    const rootIsSharp = c.acc > 0;
    if (prefSharp !== null && c.acc !== 0 && rootIsSharp !== prefSharp) cost += 0.45;
    if (c.acc !== 0) cost += prefSharp === null ? 0 : rootIsSharp === prefSharp ? 0.2 : 0.7;
    if (prefSharp === null && c.acc !== 0 && KEY0_NAMES[rootPc] !== LETTERS[c.letter] + accStr(c.acc)) cost += 0.45;
    if (cost < bestCost) {
      bestCost = cost;
      best = { rootName: LETTERS[c.letter] + accStr(c.acc), tones, names };
    }
  }
  return best;
}
var ROMAN_MAJOR = ["I", "\u266DII", "II", "\u266DIII", "III", "IV", "\u266FIV", "V", "\u266DVI", "VI", "\u266DVII", "VII"];
var ROMAN_MINOR = ["I", "\u266DII", "II", "III", "\u266FIII", "IV", "\u266FIV", "V", "VI", "\u266FVI", "VII", "\u266FVII"];
var MINORISH = /* @__PURE__ */ new Set(["min", "dim", "m6", "m69", "m7", "mmaj7", "m7b5", "dim7", "madd9", "m9", "mmaj9", "m11", "m7add11", "madd11", "m13"]);
var ROMAN_SUFFIX = {
  dim: "\xB0",
  aug: "+",
  sus2: "sus2",
  sus4: "sus4",
  majb5: "(\u266D5)",
  "6": "6",
  m6: "6",
  "69": "6/9",
  m69: "6/9",
  maj7: "maj7",
  "7": "7",
  m7: "7",
  mmaj7: "(maj7)",
  m7b5: "\xF87",
  dim7: "\xB07",
  "7s5": "+7",
  maj7s5: "maj7\u266F5",
  "7b5": "7\u266D5",
  "7sus4": "7sus4",
  add9: "add9",
  madd9: "add9",
  "9": "9",
  maj9: "maj9",
  m9: "9",
  mmaj9: "(maj9)",
  "7b9": "7\u266D9",
  "7s9": "7\u266F9",
  "9sus4": "9sus4",
  m11: "11",
  maj7s11: "maj7\u266F11",
  "7s11": "7\u266F11",
  "13": "13",
  maj13: "maj13",
  m13: "13"
};
var SUP = { "6": "\u2076", "5": "\u2075", "4": "\u2074", "3": "\xB3", "2": "\xB2", "7": "\u2077" };
var SUB = { "6": "\u2086", "5": "\u2085", "4": "\u2084", "3": "\u2083", "2": "\u2082" };
function inversionOf(tpl, rootPc, bassPc) {
  if (bassPc === rootPc) return 0;
  const rel = mod12(bassPc - rootPc);
  const idx = tpl.tones.findIndex((d) => DEG[d][0] === rel);
  if (idx < 0) return null;
  if (tpl.fig) {
    const order = tpl.fig === "triad" ? ["1", "3", "5"] : ["1", "3", "5", "7"];
    const base = tpl.tones[idx].replace("b", "").replace("#", "").replace("bb", "");
    const k = order.findIndex((o) => o === base || o === "7" && (base === "7" || tpl.tones[idx] === "bb7" || tpl.tones[idx] === "b7"));
    return k < 0 ? null : k;
  }
  return null;
}
function figure(tpl, inv) {
  if (inv === null || inv === 0 || !tpl.fig) return tpl.fig === "seventh" ? "\u2077" : "";
  if (tpl.fig === "triad") return inv === 1 ? SUP["6"] : SUP["6"] + SUB["4"];
  return inv === 1 ? SUP["6"] + SUB["5"] : inv === 2 ? SUP["4"] + SUB["3"] : SUP["4"] + SUB["2"];
}
function romanFor(rootPc, bassPc, prep, key) {
  const rel = mod12(rootPc - key.tonic);
  const q = prep.tpl.id;
  const minorish = MINORISH.has(q);
  let base = (key.minor ? ROMAN_MINOR : ROMAN_MAJOR)[rel];
  if (key.minor && rel === 11 && (q === "dim" || q === "dim7" || q === "m7b5")) base = "VII";
  if (minorish) base = base.toLowerCase();
  const inv = inversionOf(prep.tpl, rootPc, bassPc);
  let suffix;
  if (prep.tpl.fig === "seventh") {
    const core = { maj7: "maj", "7": "", m7: "", mmaj7: "(maj)", m7b5: "\xF8", dim7: "\xB0" };
    suffix = (core[q] ?? "") + figure(prep.tpl, inv);
    if (q === "maj7" && (inv === 0 || inv === null)) suffix = "maj7";
    else if (q === "mmaj7" && (inv === 0 || inv === null)) suffix = "(maj7)";
    else if (q === "maj7") suffix = "maj" + figure(prep.tpl, inv);
  } else if (prep.tpl.fig === "triad") {
    suffix = (q === "dim" ? "\xB0" : q === "aug" ? "+" : "") + figure(prep.tpl, inv);
  } else suffix = (ROMAN_SUFFIX[q] ?? "") + (inv ? "" : "");
  let numeral = base + suffix;
  if (rel === 1 && q === "maj") numeral = inv === 1 ? "N\u2076" : "\u266DII";
  const scale = key.minor ? MIN_SCALE : MAJ_SCALE;
  const diatonic = [...prep.semis].every((s) => scale.has(mod12(rootPc + s - key.tonic)));
  let fn = null;
  const deg = key.minor ? { T: [0, 3], S: [2, 5, 8], D: [7, 10, 11] } : { T: [0, 4, 9], S: [2, 5], D: [7, 11] };
  if (diatonic || rel === 7) {
    if (deg.T.includes(rel)) fn = "Tonic";
    else if (deg.S.includes(rel)) fn = "Subdominant";
    else if (deg.D.includes(rel)) fn = "Dominant";
  }
  if (rel === 1 && q === "maj") fn = "Predominant";
  return { numeral, base, fn, diatonic, rel };
}
function targetNumeral(rel, key) {
  const majorSet = { 2: "ii", 4: "iii", 5: "IV", 7: "V", 9: "vi" };
  const minorSet = { 3: "III", 5: "iv", 7: "v", 8: "VI", 10: "VII" };
  return (key.minor ? minorSet : majorSet)[rel] ?? null;
}
function clusterNotes(notes) {
  const out = [];
  let cur = [];
  let last = -Infinity;
  for (const n of notes) {
    if (cur.length && (n.start - last > 0.055 || n.start - cur[0].start > 0.16)) {
      out.push(cur);
      cur = [];
    }
    cur.push(n);
    last = n.start;
  }
  if (cur.length) out.push(cur);
  return out;
}
function analyseHarmony(notes, fileKey, optsIn) {
  const opts = { ...DEFAULT_ANALYSIS, ...optsIn };
  const sens = SENS[opts.chordSensitivity] ?? SENS.balanced;
  const model = buildKeyModel(notes, fileKey, opts.localKey);
  const raws = [];
  const sorted = notes.slice().sort((a, b) => a.start - b.start || a.midi - b.midi);
  const clusters = clusterNotes(sorted);
  let active = [];
  const weights = new Float64Array(12);
  let hist = [];
  for (let ci = 0; ci < clusters.length; ci++) {
    const cl = clusters[ci];
    const T0 = cl[0].start;
    const Tc = cl[cl.length - 1].start;
    active = active.filter((n) => n.end + 0.06 > T0 && T0 - n.start < 20);
    hist = hist.filter((n) => T0 - n.start < 2);
    for (const n of cl) {
      active.push(n);
      hist.push(n);
    }
    const isNew = new Set(cl);
    const newPcs = new Set(cl.map((n) => n.midi % 12));
    const blockLike = cl.length >= 2 && newPcs.size >= 2;
    if (!blockLike && !opts.detectArpeggios) continue;
    const arp = !blockLike;
    let pool = active;
    let W = 1;
    if (arp) {
      const back = Math.max(0, ci - 6);
      W = ci > 0 ? Math.min(1.8, Math.max(0.7, (Tc - clusters[back][0].start) / Math.max(1, ci - back) * 7)) : 1;
      const set = new Set(active);
      for (const n of hist) if (T0 - n.start <= W) set.add(n);
      pool = [...set];
    }
    if (pool.length < 3) continue;
    weights.fill(0);
    let low = pool[0];
    let top = pool[0];
    const peak = new Float64Array(12);
    const extraSum = new Float64Array(12);
    for (const n of pool) {
      if (n.midi < low.midi) low = n;
      if (n.midi > top.midi) top = n;
      const age = Tc - n.start;
      let w;
      if (arp) w = age <= 0.55 * W ? 1 : age <= W ? 0.6 : 0.4;
      else {
        w = isNew.has(n) ? 1 : age < 1.5 ? 0.78 : age < 4 ? 0.56 : 0.36;
        if (!isNew.has(n) && n.end - T0 < 0.15) w *= 0.3;
      }
      if (n.end - n.start < 0.07) w *= 0.6;
      w *= 0.75 + 0.25 * (n.vel / 127);
      const pc = n.midi % 12;
      if (w > peak[pc]) {
        extraSum[pc] += peak[pc];
        peak[pc] = w;
      } else extraSum[pc] += w;
    }
    for (let i = 0; i < 12; i++) weights[i] = peak[i] + 0.2 * extraSum[i];
    weights[low.midi % 12] *= 1.3;
    let distinct = 0;
    for (let i = 0; i < 12; i++) if (weights[i] >= 0.3) distinct++;
    if (distinct < 3) continue;
    const bassPc = low.midi % 12;
    const key = localKeyAt(model, T0);
    const m = matchChord(weights, bassPc, key, {
      extraLimit: arp ? Math.min(sens.extra, 0.2) : sens.extra,
      maxTier: arp ? Math.min(sens.maxTier, opts.chordSensitivity === "detailed" ? 2 : 1) : sens.maxTier,
      tierPenalty: sens.tierPenalty,
      // a melody note riding on top of an arpeggiated accompaniment is allowed to be a non-chord tone
      exemptPc: arp && opts.chordSensitivity !== "strict" ? top.midi % 12 : -1,
      // big voicings need to be struck as big gestures; arpeggios stay readable
      maxTones: opts.chordSensitivity === "detailed" ? arp ? 5 : 7 : arp ? 4 : cl.length >= 3 ? 5 : 4
    });
    if (!m) continue;
    const { best, second } = m;
    let conf = best.score;
    if (second && best.score - second.score < 0.035 && second.root !== best.root) conf -= 0.05;
    const threshold = sens.accept + (arp ? sens.arpBonus : 0) + (best.prep.tier === 2 ? 0.04 : 0);
    if (conf < threshold) continue;
    if (arp) {
      const nPc = cl[0].midi % 12;
      if (!best.prep.semis.has(mod12(nPc - best.root))) continue;
      const onsets = /* @__PURE__ */ new Set();
      for (const n of pool) if (T0 - n.start < Math.max(2.6, W) && best.prep.semis.has(mod12(n.midi % 12 - best.root))) onsets.add(Math.round(n.start * 200));
      if (onsets.size < 3) continue;
    }
    const endByPc = /* @__PURE__ */ new Map();
    let spanStart = T0;
    let keyLo = 87;
    let keyHi = 0;
    const hands = /* @__PURE__ */ new Set();
    for (const n of pool) {
      const pc = n.midi % 12;
      if (!best.prep.semis.has(mod12(pc - best.root))) continue;
      const e = Math.max(n.visEnd, n.start + 0.05);
      if ((endByPc.get(pc) ?? -1) < e) endByPc.set(pc, e);
      if (arp) spanStart = Math.min(spanStart, n.start);
      keyLo = Math.min(keyLo, n.key);
      keyHi = Math.max(keyHi, n.key);
      hands.add(n.hand);
    }
    const ends = [...endByPc.values()].sort((a, b) => b - a);
    const end = ends[Math.min(2, ends.length - 1)];
    if (end - T0 < 0.1) continue;
    const played = [...new Set(pool.filter((n) => weights[n.midi % 12] >= 0.3).sort((a, b) => a.midi - b.midi).map((n) => n.midi % 12))];
    raws.push({ start: arp ? Tc : T0, spanStart: arp ? spanStart : T0, end, cand: best, conf: Math.min(1, conf), kind: arp ? "arpeggio" : "block", bassPc, keyLo, keyHi, hands, played, key, newCount: cl.length });
  }
  const merged = [];
  for (const r of raws) {
    const p = merged[merged.length - 1];
    if (p) {
      const sameId = p.cand.prep.tpl.id === r.cand.prep.tpl.id;
      const sameFamily = familyOf(p.cand.prep.tpl.id) === familyOf(r.cand.prep.tpl.id);
      const same = p.cand.root === r.cand.root && (sameId || sameFamily && r.start - p.start < 1.2);
      const loose = p.kind === "arpeggio" || r.kind === "arpeggio";
      if (same && r.start <= p.end + (loose ? 1.2 : sameId ? 0.15 : 0.5) && (loose || !sameId || p.bassPc === r.bassPc)) {
        const rBetter = r.conf > p.conf + 0.02 || Math.abs(r.conf - p.conf) <= 0.02 && r.cand.prep.tpl.tones.length < p.cand.prep.tpl.tones.length;
        if (rBetter) {
          p.cand = r.cand;
          p.bassPc = r.bassPc;
          p.played = r.played;
          p.key = r.key;
        }
        p.end = Math.max(p.end, r.end);
        p.conf = Math.max(p.conf, r.conf);
        p.keyLo = Math.min(p.keyLo, r.keyLo);
        p.keyHi = Math.max(p.keyHi, r.keyHi);
        r.hands.forEach((h) => p.hands.add(h));
        continue;
      }
      if (r.start - p.start < 0.3 && !(r.kind === "block" && r.newCount >= 3 && r.conf >= 0.9)) continue;
    }
    merged.push(r);
  }
  for (let i = merged.length - 2; i >= 0; i--) {
    const r = merged[i];
    if (r.kind === "arpeggio" && merged[i + 1].start - r.start < 0.45 && r.end - r.start < 0.45) merged.splice(i, 1);
  }
  const out = [];
  for (let i = 0; i < merged.length; i++) {
    const r = merged[i];
    const next = merged[i + 1];
    const tpl = r.cand.prep.tpl;
    const sharpsPref = keySharps(r.key.tonic, r.key.minor);
    const extraSemis = r.played.map((pc) => mod12(pc - r.cand.root));
    const sp = spellChord(r.cand.root, tpl, extraSemis, sharpsPref);
    const slashOk = opts.showInversions && r.bassPc !== r.cand.root;
    const bassName = slashOk ? sp.names.get(mod12(r.bassPc - r.cand.root)) ?? pcName(r.bassPc, sharpsPref) : null;
    const symbol = sp.rootName + tpl.sym + (bassName ? `/${bassName}` : "");
    const inv = inversionOf(tpl, r.cand.root, r.bassPc);
    let roman = null;
    let fn = null;
    if (opts.romanNumerals) {
      const ri = romanFor(r.cand.root, r.bassPc, r.cand.prep, r.key);
      roman = ri.numeral;
      fn = ri.fn;
      if ((tpl.id === "maj" || tpl.id === "7" || tpl.id === "9" || tpl.id === "13") && !ri.diatonic && next && next.start - r.end < 3.5 && next.cand.root === mod12(r.cand.root + 7)) {
        const tgt = targetNumeral(mod12(next.cand.root - r.key.tonic), r.key);
        if (tgt) {
          roman = `V${tpl.id === "maj" ? figure(tpl, inv) : tpl.id === "7" ? figure({ ...tpl, fig: "seventh" }, inv) : ROMAN_SUFFIX[tpl.id] ?? ""}/${tgt}`;
          fn = "Applied dominant";
        }
      }
      if (ri.rel === 1 && tpl.id === "maj") fn = "Predominant";
    }
    const nextStart = next ? next.start : Infinity;
    const shownEnd = Math.min(Math.max(r.end, r.start + opts.minChordHold), nextStart);
    const end = Math.min(r.end, nextStart);
    if (shownEnd - r.start < 0.2 && r.kind === "arpeggio") continue;
    const hands = r.hands.size > 1 ? "both" : [...r.hands][0];
    out.push({
      start: r.start,
      end,
      shownEnd,
      spanStart: r.spanStart,
      symbol,
      root: sp.rootName,
      quality: tpl.sym,
      bass: bassName,
      roman,
      fn,
      spelled: `${sp.rootName} ${tpl.words}${bassName ? ` (over ${bassName})` : ""}`,
      tones: sp.tones,
      played: r.played.map((pc) => sp.names.get(mod12(pc - r.cand.root)) ?? pcName(pc, sharpsPref)),
      rootPc: r.cand.root,
      bassPc: r.bassPc,
      qualityId: tpl.id,
      inversion: inv,
      keyLo: r.keyLo,
      keyHi: r.keyHi,
      hand: hands,
      confidence: +r.conf.toFixed(3),
      kind: r.kind,
      chained: false,
      follows: false,
      key: keyName(r.key.tonic, r.key.minor)
    });
  }
  for (let i = 0; i < out.length; i++) {
    const c = out[i];
    const n = out[i + 1];
    if (n && n.start - c.shownEnd < 0.12) {
      c.chained = true;
      n.follows = true;
    }
  }
  return { chords: out, key: model.global };
}
function chordAtTime(chords, t) {
  let lo = 0;
  let hi = chords.length;
  while (lo < hi) {
    const m = lo + hi >> 1;
    if (chords[m].start <= t) lo = m + 1;
    else hi = m;
  }
  for (let i = lo - 1; i >= 0 && i >= lo - 4; i--) if (chords[i].shownEnd > t) return chords[i];
  return null;
}

// src/engine/midi.ts
var Reader = class {
  constructor(d) {
    this.d = d;
  }
  d;
  p = 0;
  u8() {
    if (this.p >= this.d.length) throw new Error("Unexpected end of MIDI data");
    return this.d[this.p++];
  }
  u16() {
    return this.u8() << 8 | this.u8();
  }
  u32() {
    return (this.u8() << 24 | this.u8() << 16 | this.u8() << 8 | this.u8()) >>> 0;
  }
  vlq() {
    let v = 0;
    for (let i = 0; i < 4; i++) {
      const b = this.u8();
      v = v << 7 | b & 127;
      if (!(b & 128)) break;
    }
    return v;
  }
  str(n) {
    let s = "";
    for (let i = 0; i < n; i++) s += String.fromCharCode(this.u8());
    return s;
  }
};
var NOTE_NAMES_SHARP = ["C", "C\u266F", "D", "D\u266F", "E", "F", "F\u266F", "G", "G\u266F", "A", "A\u266F", "B"];
var NOTE_NAMES_FLAT = ["C", "D\u266D", "D", "E\u266D", "E", "F", "G\u266D", "G", "A\u266D", "A", "B\u266D", "B"];
var SOLFEGE = ["Do", "Di", "Re", "Ri", "Mi", "Fa", "Fi", "Sol", "Si", "La", "Li", "Ti"];
var SOLFEGE_FLAT = ["Do", "Ra", "Re", "Me", "Mi", "Fa", "Se", "Sol", "Le", "La", "Te", "Ti"];
function isBlack(midi) {
  const p = (midi % 12 + 12) % 12;
  return p === 1 || p === 3 || p === 6 || p === 8 || p === 10;
}
function noteName(midi, flats = false, withOctave = true) {
  const n = (flats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP)[(midi % 12 + 12) % 12];
  return withOctave ? `${n}${Math.floor(midi / 12) - 1}` : n;
}
function parseMidi(bytes, meta) {
  const r = new Reader(bytes);
  let off = 0;
  for (let i = 0; i < Math.min(bytes.length - 4, 64); i++) {
    if (bytes[i] === 77 && bytes[i + 1] === 84 && bytes[i + 2] === 104 && bytes[i + 3] === 100) {
      off = i;
      break;
    }
  }
  r.p = off;
  if (r.str(4) !== "MThd") throw new Error("Not a Standard MIDI File (missing MThd header).");
  const hdrLen = Math.max(6, r.u32());
  const format = r.u16();
  const nTracks = r.u16();
  const division = r.u16();
  r.p = off + 8 + hdrLen;
  const smpte = (division & 32768) !== 0;
  const ppq = smpte ? 480 : division || 480;
  const ticksPerSecSmpte = smpte ? (256 - (division >> 8)) * (division & 255) : 0;
  const raw = [];
  const tempoEvents = [];
  const timeSigs = [];
  const keySigs = [];
  const pedal = [];
  const trackNames = [];
  let maxTick = 0;
  for (let t = 0; t < nTracks && r.p < bytes.length - 8; t++) {
    const id = r.str(4);
    const len = r.u32();
    const end = Math.min(bytes.length, r.p + len);
    if (id !== "MTrk") {
      r.p = end;
      t--;
      continue;
    }
    let tick = 0;
    let running = 0;
    let name = "";
    try {
      while (r.p < end) {
        tick += r.vlq();
        let status = r.u8();
        if (status < 128) {
          r.p--;
          status = running;
          if (!status) throw new Error("Bad running status");
        }
        if (status === 255) {
          const type = r.u8();
          const l = r.vlq();
          const next = r.p + l;
          if (type === 81 && l === 3) tempoEvents.push({ tick, us: r.u8() << 16 | r.u8() << 8 | r.u8() });
          else if (type === 88 && l >= 2) {
            const num2 = r.u8();
            const den = 1 << r.u8();
            timeSigs.push({ tick, numerator: num2, denominator: den });
          } else if (type === 89 && l === 2) {
            let sf = r.u8();
            if (sf > 127) sf -= 256;
            keySigs.push({ sharps: sf, minor: r.u8() === 1 });
          } else if (type === 3 && !name) name = r.str(l).trim();
          r.p = next;
          if (type === 47) break;
        } else if (status === 240 || status === 247) {
          const l = r.vlq();
          r.p += l;
        } else {
          running = status;
          const hi = status & 240;
          const ch = status & 15;
          if (hi === 128 || hi === 144) {
            const note = r.u8();
            const vel = r.u8();
            raw.push({ tick, on: hi === 144 && vel > 0, ch, note, vel, track: t });
          } else if (hi === 176) {
            const cc = r.u8();
            const v = r.u8();
            if (cc === 64) pedal.push({ tick, down: v >= 64, ch });
          } else if (hi === 192 || hi === 208) r.u8();
          else r.p += 2;
        }
      }
    } catch {
    }
    maxTick = Math.max(maxTick, tick);
    trackNames[t] = name;
    r.p = end;
  }
  if (raw.length === 0) throw new Error("This MIDI file contains no playable notes.");
  tempoEvents.sort((a, b) => a.tick - b.tick);
  const tempos = [];
  const pushTempo = (tick, us, time) => {
    const last = tempos[tempos.length - 1];
    if (last && last.tick === tick) {
      last.usPerBeat = us;
      last.bpm = 6e7 / us;
      return;
    }
    tempos.push({ tick, time, bpm: 6e7 / us, usPerBeat: us });
  };
  pushTempo(0, tempoEvents.find((e) => e.tick === 0)?.us ?? 5e5, 0);
  for (const e of tempoEvents) {
    if (e.tick === 0) continue;
    const prev = tempos[tempos.length - 1];
    const dt = smpte ? 0 : (e.tick - prev.tick) * prev.usPerBeat / ppq / 1e6;
    pushTempo(e.tick, e.us, prev.time + dt);
  }
  const tickToSec = (tick) => {
    if (smpte) return tick / ticksPerSecSmpte;
    let lo = 0;
    let hi = tempos.length - 1;
    while (lo < hi) {
      const mid = lo + hi + 1 >> 1;
      if (tempos[mid].tick <= tick) lo = mid;
      else hi = mid - 1;
    }
    const tp = tempos[lo];
    return tp.time + (tick - tp.tick) * tp.usPerBeat / ppq / 1e6;
  };
  pedal.sort((a, b) => a.tick - b.tick);
  const chDown = /* @__PURE__ */ new Set();
  const sustain = [];
  let openAt = null;
  for (const e of pedal) {
    if (e.down) chDown.add(e.ch);
    else chDown.delete(e.ch);
    const s = tickToSec(e.tick);
    if (chDown.size > 0 && openAt === null) openAt = s;
    else if (chDown.size === 0 && openAt !== null) {
      if (s > openAt) sustain.push({ start: openAt, end: s });
      openAt = null;
    }
  }
  const endTimeAll = tickToSec(maxTick);
  if (openAt !== null) sustain.push({ start: openAt, end: endTimeAll });
  raw.sort((a, b) => a.tick - b.tick || Number(a.on) - Number(b.on));
  const open = /* @__PURE__ */ new Map();
  const paired = [];
  for (const e of raw) {
    if (e.ch === 9) continue;
    const k = e.ch * 256 + e.note;
    if (e.on) {
      if (e.note < 21 || e.note > 108) continue;
      let q = open.get(k);
      if (!q) open.set(k, q = []);
      q.push({ tick: e.tick, vel: e.vel, track: e.track });
    } else {
      const q = open.get(k);
      if (q && q.length) {
        const o = q.shift();
        paired.push({ tick: o.tick, endTick: Math.max(o.tick + 1, e.tick), midi: e.note, vel: o.vel, track: o.track, ch: e.ch });
      }
    }
  }
  for (const [k, q] of open) {
    for (const o of q) paired.push({ tick: o.tick, endTick: Math.max(o.tick + ppq / 4, maxTick), midi: k & 255, vel: o.vel, track: o.track, ch: k >> 8 });
  }
  if (paired.length === 0) throw new Error("This MIDI file contains no notes within the 88-key range (A0\u2013C8).");
  const distinctTracks = new Set(paired.map((x) => x.track)).size;
  const trackKeys = /* @__PURE__ */ new Map();
  const trackSources = [];
  const noteTrackOf = (p) => {
    const key = distinctTracks > 1 || format !== 0 ? `t${p.track}` : `c${p.ch}`;
    let idx = trackKeys.get(key);
    if (idx === void 0) {
      idx = trackSources.length;
      trackKeys.set(key, idx);
      trackSources.push({ name: trackNames[p.track] ?? "", src: p.track, ch: p.ch });
    }
    return idx;
  };
  const notes = paired.map((p, i) => ({
    id: i,
    midi: p.midi,
    key: p.midi - 21,
    start: tickToSec(p.tick),
    end: tickToSec(p.endTick),
    visEnd: 0,
    sustainEnd: 0,
    vel: Math.max(1, p.vel),
    track: noteTrackOf(p),
    hand: "R",
    finger: 1,
    tick: p.tick
  }));
  notes.sort((a, b) => a.start - b.start || a.key - b.key);
  notes.forEach((n, i) => n.id = i);
  timeSigs.sort((a, b) => a.tick - b.tick);
  if (!timeSigs.length || timeSigs[0].tick > 0) timeSigs.unshift({ tick: 0, numerator: 4, denominator: 4 });
  let lastNoteTick = 0;
  for (const p of paired) lastNoteTick = Math.max(lastNoteTick, p.endTick);
  const measures = [];
  {
    let tick = 0;
    let n = 1;
    let si = 0;
    while (tick <= lastNoteTick + 1 && n < 5e3) {
      while (si + 1 < timeSigs.length && timeSigs[si + 1].tick <= tick) si++;
      const ts = timeSigs[si];
      const beatTicks = ppq * 4 / ts.denominator;
      const group = ts.denominator === 8 && ts.numerator % 3 === 0 && ts.numerator > 3 ? 3 : 1;
      const measTicks = beatTicks * ts.numerator;
      const beats = [];
      for (let b = group; b < ts.numerator; b += group) beats.push(tickToSec(tick + b * beatTicks));
      measures.push({ number: n, time: tickToSec(tick), tick, beats, numerator: ts.numerator, denominator: ts.denominator });
      tick += measTicks;
      n++;
    }
  }
  const nTr = trackSources.length;
  const trackInfos = trackSources.map((s, i) => {
    const tn = notes.filter((n) => n.track === i);
    const avg = tn.reduce((a, n) => a + n.midi, 0) / Math.max(1, tn.length);
    let lo = 127;
    let hi = 0;
    for (const n of tn) {
      lo = Math.min(lo, n.midi);
      hi = Math.max(hi, n.midi);
    }
    return {
      index: i,
      name: s.name || (nTr === 1 ? "Piano" : `Voice ${i + 1}`),
      hand: "auto",
      resolvedHand: "R",
      noteCount: tn.length,
      avgPitch: avg,
      lo: tn.length ? lo : 60,
      hi: tn.length ? hi : 60
    };
  });
  const keySig = keySigs[0] ?? { sharps: 0, minor: false };
  let minKey = 87;
  let maxKey = 0;
  let duration = 0;
  for (const n of notes) {
    minKey = Math.min(minKey, n.key);
    maxKey = Math.max(maxKey, n.key);
    duration = Math.max(duration, n.end);
  }
  const song2 = {
    id: meta.id ?? "custom",
    fileName: meta.fileName,
    name: meta.name ?? meta.fileName.replace(/\.(mid|midi)$/i, ""),
    artist: meta.artist,
    piece: meta.piece,
    copyright: meta.copyright,
    difficulty: meta.difficulty,
    notes,
    prefixMaxEnd: new Float64Array(0),
    tempos,
    measures,
    sustain,
    chords: [],
    key: { tonic: 0, minor: false, sharps: 0, name: "C major", confidence: 0, source: "analysis" },
    analysisSig: "",
    fileKeySig: keySigs[0] ?? null,
    tracks: trackInfos,
    keySig,
    timeSigs,
    ppq,
    duration,
    minKey,
    maxKey,
    densityBins: []
  };
  analyseSong(song2);
  return song2;
}
function analyseSong(song2, opts = {}) {
  const { notes, tracks } = song2;
  const multi = tracks.length >= 2;
  const ranked = tracks.slice().sort((a, b) => b.avgPitch - a.avgPitch);
  for (const t of tracks) {
    const nm = t.name.toLowerCase();
    if (t.hand !== "auto") t.resolvedHand = t.hand;
    else if (/left|bass|\blh\b|\bl\.h/.test(nm)) t.resolvedHand = "L";
    else if (/right|treble|\brh\b|\br\.h/.test(nm)) t.resolvedHand = "R";
    else if (multi) t.resolvedHand = ranked.indexOf(t) < Math.ceil(tracks.length / 2) ? "R" : "L";
    else t.resolvedHand = "split";
  }
  for (const n of notes) {
    const th = tracks[n.track].resolvedHand;
    n.hand = th === "split" ? n.midi < 60 ? "L" : "R" : th;
  }
  const byKey = Array.from({ length: 88 }, () => []);
  for (const n of notes) byKey[n.key].push(n);
  for (const list of byKey) {
    for (let i = 0; i < list.length; i++) {
      const n = list[i];
      n.visEnd = n.end;
      const nx = list[i + 1];
      if (nx && nx.start < n.end + 0.035) n.visEnd = Math.max(n.start + 0.025, Math.min(n.end, nx.start - 0.035));
    }
  }
  const sus = song2.sustain;
  for (const n of notes) {
    n.sustainEnd = n.end;
    if (!sus.length) continue;
    let lo = 0;
    let hi = sus.length;
    while (lo < hi) {
      const m = lo + hi >> 1;
      if (sus[m].end > n.end) hi = m;
      else lo = m + 1;
    }
    const p = sus[lo];
    if (p && p.start <= n.end) n.sustainEnd = Math.min(p.end, n.end + 6);
  }
  const pm = new Float64Array(notes.length);
  let mx = -Infinity;
  for (let i = 0; i < notes.length; i++) {
    mx = Math.max(mx, notes[i].sustainEnd, notes[i].visEnd);
    pm[i] = mx;
  }
  song2.prefixMaxEnd = pm;
  assignFingers(notes.filter((n) => n.hand === "R"), "R");
  assignFingers(notes.filter((n) => n.hand === "L"), "L");
  analyseChords(song2, opts);
  const bins = new Array(160).fill(0);
  const dur = Math.max(1e-3, song2.duration);
  for (const n of notes) bins[Math.min(159, Math.floor(n.start / dur * 160))]++;
  const bmax = Math.max(1, ...bins);
  song2.densityBins = bins.map((b) => b / bmax);
}
function analysisSignature(opts) {
  const o = { ...DEFAULT_ANALYSIS, ...opts };
  return [o.chordSensitivity, o.detectArpeggios, o.showInversions, o.romanNumerals, o.localKey, o.minChordHold].join("|");
}
function analyseChords(song2, opts = {}) {
  const o = { ...DEFAULT_ANALYSIS, ...opts };
  song2.analysisSig = analysisSignature(o);
  const res = analyseHarmony(song2.notes, song2.fileKeySig, o);
  song2.chords = res.chords;
  song2.key = res.key;
  song2.keySig = { sharps: res.key.sharps, minor: res.key.minor };
}
var BLACK_PC = /* @__PURE__ */ new Set([1, 3, 6, 8, 10]);
var blackKey = (midi) => BLACK_PC.has(midi % 12);
function candidatesFor(n, hand, span) {
  let base;
  if (n === 1) base = [[1], [2], [3], [4], [5]];
  else if (n === 2) {
    base = [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5]].filter(
      (f) => span <= 2 * (f[1] - f[0]) + 7
    );
    if (!base.length) base = [[1, 5]];
  } else if (n === 3) base = [[1, 3, 5], [1, 2, 4], [1, 2, 5], [2, 3, 5], [1, 3, 4], [1, 2, 3]];
  else if (n === 4) base = [[1, 2, 3, 5], [1, 2, 4, 5], [1, 3, 4, 5]];
  else base = [Array.from({ length: n }, (_, i) => Math.min(5, i + 1))];
  return hand === "R" ? base : base.map((c) => c.map((f) => 6 - f));
}
function assignFingers(list, hand) {
  if (!list.length) return;
  list.sort((a, b) => a.start - b.start || a.key - b.key);
  const groups = [];
  let g = null;
  for (const n of list) {
    if (g && n.start - g[0].start <= 0.04) g.push(n);
    else groups.push(g = [n]);
  }
  const dir = hand === "R" ? 1 : -1;
  const layers = groups.map((grp) => {
    const sorted = grp.slice().sort((a, b) => a.key - b.key);
    const span = sorted[sorted.length - 1].key - sorted[0].key;
    const cands = candidatesFor(sorted.length, hand, span);
    const anchorIdx = hand === "R" ? sorted.length - 1 : 0;
    return cands.map((f) => {
      let cost = 0;
      for (let i = 0; i < f.length; i++) {
        const bk = blackKey(sorted[i].midi);
        if (bk && (f[i] === 1 || f[i] === 5)) cost += sorted.length === 1 ? 2.2 : 1.4;
        if (f[i] === 4) cost += 0.5;
        if (f[i] === 5) cost += 0.3;
      }
      for (let i = 1; i < f.length; i++) {
        const dk = sorted[i].key - sorted[i - 1].key;
        const df = Math.abs(f[i] - f[i - 1]);
        if (dk > 2 * df + 5) cost += (dk - 2 * df) * 0.5;
      }
      return { f, anchorKey: sorted[anchorIdx].key, anchorF: f[anchorIdx], cost };
    });
  });
  const trans = (a, b, gap) => {
    const d = b.anchorKey - a.anchorKey;
    const df = (b.anchorF - a.anchorF) * dir;
    const looseness = Math.min(1, 0.3 / Math.max(0.05, gap));
    let c = 0;
    if (d === 0) return b.anchorF === a.anchorF ? 0 : 0.8;
    if (df === 0) c += 6 * looseness + 0.5;
    else if (Math.sign(d) !== Math.sign(df)) {
      const thumb = a.anchorF === 1 || b.anchorF === 1;
      c += thumb ? 2.4 : 6.5;
      c += Math.max(0, Math.abs(d) - 4) * 0.4;
    } else {
      const expected = 2 * Math.abs(df);
      const diff = Math.abs(Math.abs(d) - expected);
      c += diff * 0.45 * (0.5 + looseness);
      if (Math.abs(d) > expected + 5) c += (Math.abs(d) - expected - 5) * 0.8;
    }
    return c;
  };
  let prevCost = layers[0].map((c) => c.cost);
  const back = [new Int16Array(layers[0].length)];
  for (let i = 1; i < layers.length; i++) {
    const gap = groups[i][0].start - groups[i - 1][0].start;
    const cur = layers[i];
    const pl = layers[i - 1];
    const nc = new Array(cur.length);
    const bp = new Int16Array(cur.length);
    for (let j = 0; j < cur.length; j++) {
      let best = Infinity;
      let bi2 = 0;
      for (let k = 0; k < pl.length; k++) {
        const v = prevCost[k] + trans(pl[k], cur[j], gap);
        if (v < best) {
          best = v;
          bi2 = k;
        }
      }
      nc[j] = best + cur[j].cost;
      bp[j] = bi2;
    }
    prevCost = nc;
    back.push(bp);
  }
  let bi = 0;
  for (let j = 1; j < prevCost.length; j++) if (prevCost[j] < prevCost[bi]) bi = j;
  for (let i = layers.length - 1; i >= 0; i--) {
    const cand = layers[i][bi];
    const sorted = groups[i].slice().sort((a, b) => a.key - b.key);
    sorted.forEach((n, idx) => n.finger = cand.f[idx] ?? 3);
    bi = back[i][bi];
  }
}
function tempoAt(song2, t) {
  const ts = song2.tempos;
  let lo = 0;
  let hi = ts.length - 1;
  while (lo < hi) {
    const m = lo + hi + 1 >> 1;
    if (ts[m].time <= t) lo = m;
    else hi = m - 1;
  }
  return ts[lo];
}
function measureAt(song2, t) {
  const ms = song2.measures;
  if (t < ms[0].time - 1e-6) return 0;
  let lo = 0;
  let hi = ms.length - 1;
  while (lo < hi) {
    const m = lo + hi + 1 >> 1;
    if (ms[m].time <= t + 1e-6) lo = m;
    else hi = m - 1;
  }
  return ms[lo].number;
}
function firstVisibleIndex(song2, t) {
  const pm = song2.prefixMaxEnd;
  let lo = 0;
  let hi = pm.length;
  while (lo < hi) {
    const m = lo + hi >> 1;
    if (pm[m] >= t) hi = m;
    else lo = m + 1;
  }
  return lo;
}
function chordAt(song2, t) {
  return chordAtTime(song2.chords, t);
}
function pedalAt(song2, t) {
  const ps = song2.sustain;
  let lo = 0;
  let hi = ps.length;
  while (lo < hi) {
    const m = lo + hi >> 1;
    if (ps[m].start <= t) lo = m + 1;
    else hi = m;
  }
  return lo > 0 && ps[lo - 1].end > t;
}

// src/engine/keypress.ts
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var lerp = (a, b, t) => a + (b - a) * t;
function ihash(n) {
  n = Math.imul((n | 0) ^ (n | 0) >>> 16, 73244475);
  n = Math.imul(n ^ n >>> 16, 73244475);
  n ^= n >>> 16;
  return (n >>> 0) / 4294967296;
}
var velocityFactor = (vel) => clamp((vel - 20) / 100, 0, 1);
var TWO_PI = Math.PI * 2;
function evalSeg(s, t) {
  const tau = t - s.t0;
  if (tau <= 0) return s.h0;
  if (s.kind === 0) {
    if (tau < s.dur) {
      const u = tau / s.dur;
      return s.h0 + (s.target - s.h0) * (1 - Math.pow(1 - u, 2.2));
    }
    const a2 = tau - s.dur;
    return s.target + s.amp * 1.6 * Math.exp(-a2 / 0.022) * Math.sin(TWO_PI * a2 / 0.05);
  }
  if (tau < s.dur) {
    const u = tau / s.dur;
    const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    return s.h0 * (1 - e);
  }
  const a = tau - s.dur;
  return -s.amp * 1.6 * Math.exp(-a / 0.02) * Math.sin(TWO_PI * a / 0.05);
}
function keyDepressAt(notes, t, key, P, lead) {
  const n = notes.length;
  if (n === 0) return null;
  const ev = [];
  const jit = (ihash(key * 7 + 3) - 0.5) * 0.08 * P.variation;
  for (let i = 0; i < n; i++) {
    const nt = notes[i];
    const ta = nt.start - lead;
    ev.push({ t: ta, i, press: true });
    ev.push({ t: Math.max(ta + 0.012, nt.end - P.anticipation), i, press: false });
  }
  ev.sort((a, b) => a.t - b.t || (a.press ? 1 : 0) - (b.press ? 1 : 0));
  let seg = null;
  let held = 0;
  let ref = notes[0].ref;
  let vf = 0;
  const depthVar = 1 - ihash(key * 13 + 5) * 0.045 * P.variation;
  for (const e of ev) {
    if (e.t > t) break;
    const cur = seg;
    const h = cur ? evalSeg(cur, e.t) : 0;
    if (e.press) {
      held++;
      const nt = notes[e.i];
      ref = nt.ref;
      vf = velocityFactor(nt.vel);
      let target = (P.hold + (1 - P.hold) * Math.pow(vf, 0.85)) * (vf > 0.97 ? 1 : depthVar);
      target = clamp(target, 0.2, 1);
      const atk = lerp(P.attackSlow, P.attackFast, Math.pow(vf, 0.8)) * (1 + jit);
      const dur = Math.max(4e-3, atk * clamp((target - Math.max(h, 0)) / target, 0.25, 1));
      const hard = clamp((vf - 0.5) / 0.5, 0, 1);
      seg = { kind: 0, t0: e.t, h0: h, target, dur, vf, amp: P.bottomOut * Math.pow(hard, 1.4) * (target > 0.95 ? 1 : 0) };
    } else {
      held--;
      if (held <= 0) {
        held = 0;
        const base = lerp(P.releaseSlow, P.releaseFast, vf);
        const dur = Math.max(0.01, base * clamp(0.45 + 0.55 * Math.max(h, 0), 0.45, 1));
        seg = { kind: 1, t0: e.t, h0: Math.max(h, 0), target: 0, dur, vf, amp: P.overshoot * 1.1 * clamp(h, 0, 1) };
      }
    }
  }
  const last = seg;
  if (!last) return null;
  const d = evalSeg(last, t);
  if (last.kind === 1 && t - last.t0 > last.dur + 0.2) return null;
  return { d, vf: last.vf, held: held > 0, ref };
}

// src/engine/keyboard.ts
function mk(wL, hL, S, fn, seed) {
  const w = Math.max(1, Math.ceil(wL * S));
  const h = Math.max(1, Math.ceil(hL * S));
  const c = newCanvas(w, h);
  const g = c.getContext("2d");
  const img = g.createImageData(w, h);
  const d = img.data;
  const o = [0, 0, 0, 0];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      o[0] = 0;
      o[1] = 0;
      o[2] = 0;
      o[3] = 0;
      fn((x + 0.5) / S, (y + 0.5) / S, o);
      const i = (y * w + x) * 4;
      d[i] = o[0];
      d[i + 1] = o[1];
      d[i + 2] = o[2];
      d[i + 3] = clamp2(o[3], 0, 1) * 255 + (ihash(x * 131 + y * 977 + seed * 31) - 0.5);
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}
var sstep = (a, b, v) => {
  const t = clamp2((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
var vnoise = (x, seed) => {
  const i = Math.floor(x);
  const f = x - i;
  const a = ihash(i * 7919 + seed * 104729);
  const b = ihash((i + 1) * 7919 + seed * 104729);
  const t = f * f * (3 - 2 * f);
  return a + (b - a) * t;
};
var sdBoxOpenTop = (px, py, x0, x1, yb) => {
  const dx = Math.max(x0 - px, px - x1);
  const dy = py - yb;
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0);
};
var cache = null;
var NLEVEL = 8;
function build(L, gapPx, S, lit, lx) {
  const { wkw, keysH: kh, bkw, bkh, u } = L;
  const w = Math.max(2, wkw - gapPx);
  const sc = Math.max(1, wkw / 37);
  const lipH = Math.max(7, 12 * u);
  const tw = Math.ceil(wkw * 8);
  const ivTex = mk(
    tw,
    kh,
    1,
    (x, y, o) => {
      const X = Math.floor(x / sc);
      const Y = Math.floor(y / sc);
      const f = ihash(X * 3 + 11);
      const fib = f > 0.5 ? (f - 0.5) / 0.5 : 0;
      const slow = 0.35 + 0.65 * vnoise(Y / (kh / sc) * 3.4 + X * 0.21, 3);
      let a = 0;
      let r = 118;
      let g = 90;
      let b = 50;
      if (fib > 0) a = fib * 0.075 * slow;
      else if (f < 0.1) {
        r = 255;
        g = 252;
        b = 238;
        a = 0.06 * slow;
      }
      const pore = ihash(X * 13 + Math.floor(Y / 2) * 71 + 9);
      if (pore > 0.9972) {
        r = 92;
        g = 66;
        b = 32;
        a = 0.2;
      } else if (ihash(X * 17 + Y * 29 + 4) > 0.9988) {
        r = 255;
        g = 255;
        b = 248;
        a = 0.3;
      }
      o[0] = r;
      o[1] = g;
      o[2] = b;
      o[3] = a;
    },
    1
  );
  const edge = mk(
    w,
    kh,
    S,
    (x, y, o) => {
      const e = Math.exp(-x / (0.1 * w)) + Math.exp(-(w - x) / (0.1 * w));
      const n = Math.exp(-(kh - y) / (lipH * 1.4)) * 0.5;
      o[0] = 206;
      o[1] = 150;
      o[2] = 74;
      o[3] = 0.13 * (e * (0.6 + 0.4 * (y / kh)) + n);
    },
    2
  );
  const sdL = 0.17 * w;
  const contactL = (x, y) => Math.exp(-x / sdL) * (0.28 + 0.72 * Math.pow(y / kh, 1.25));
  const shL = mk(w, kh, S, (x, y, o) => (o[0] = 22, o[1] = 9, o[2] = 2, o[3] = contactL(x, y)), 3);
  const shR = mk(w, kh, S, (x, y, o) => (o[0] = 22, o[1] = 9, o[2] = 2, o[3] = contactL(w - x, y)), 4);
  const rear = mk(w, kh, S, (_x, y, o) => (o[0] = 14, o[1] = 6, o[2] = 1, o[3] = Math.exp(-y / (0.09 * kh)) * 0.85 + Math.exp(-y / (0.28 * kh)) * 0.18), 5);
  const nose = mk(w, kh, S, (_x, y, o) => (o[0] = 20, o[1] = 8, o[2] = 2, o[3] = Math.exp(-(kh - y) / (lipH * 0.9)) * 0.9), 6);
  const tilt = mk(w, kh, S, (_x, y, o) => (o[0] = 40, o[1] = 22, o[2] = 8, o[3] = Math.pow(y / kh, 1.7)), 7);
  const wallW = Math.ceil(0.13 * wkw) + 1;
  const wallFn = (rimLeft, litAmt) => (x, y, o) => {
    const dep = rimLeft ? x / wallW : 1 - x / wallW;
    const along = 0.6 + 0.4 * sstep(0, 0.55, y / kh);
    let v = (0.3 + 0.36 * litAmt) * along * (1 - 0.88 * Math.pow(dep, 1.15));
    v += 0.16 * litAmt * Math.exp(-dep / 0.07);
    o[0] = 214 * v;
    o[1] = 198 * v;
    o[2] = 168 * v;
    o[3] = 1;
  };
  const wallR = mk(wallW, kh, S, wallFn(true, 1 - lit), 8);
  const wallL = mk(wallW, kh, S, wallFn(false, lit), 9);
  const streakX = lx <= 0 ? 0.3 : 0.7;
  const streak = mk(
    bkw,
    bkh,
    S,
    (x, y, o) => {
      const xn = x / bkw;
      const yn = y / bkh;
      const band = Math.exp(-Math.pow((xn - streakX) / 0.085, 2)) + 0.3 * Math.exp(-Math.pow((xn - (1 - streakX)) / 0.04, 2));
      const fade = sstep(0, 0.08, yn) * (1 - sstep(0.4, 0.86, yn));
      const env = 0.5 * Math.pow(1 - yn, 3);
      const a = band * fade;
      o[0] = 255 * a + 128 * env * (1 - a);
      o[1] = 255 * a + 156 * env * (1 - a);
      o[2] = 255 * a + 196 * env * (1 - a);
      o[3] = a * 0.3 + env * 0.045;
    },
    10
  );
  const noise = mk(
    128,
    128,
    1,
    (x, y, o) => {
      const v = ihash(Math.floor(x) * 4099 + Math.floor(y) * 131 + 77) > 0.5 ? 255 : 0;
      o[0] = v;
      o[1] = v;
      o[2] = v;
      o[3] = 1.6 / 255;
    },
    11
  );
  const padB = Math.ceil(0.55 * wkw);
  const padTopB = Math.ceil(0.3 * padB);
  return { key: "", ivTex, edge, shL, shR, rear, nose, tilt, wallR, wallL, wallW, streak, noise, bShadow: new Array(NLEVEL + 1), padB, padTopB, S };
}
function blackShadow(c, L, ex, lx) {
  const { wkw, bkw, bkh } = L;
  const pad = c.padB;
  const padTop = c.padTopB;
  const W = bkw + pad * 2;
  const H = bkh + pad + padTop;
  const ox0 = -lx * 0.1 * wkw;
  const oy0 = 0.105 * wkw;
  const layers = [
    { A: 0.6, sg: 0.028 * wkw, k: 0.22 },
    { A: 0.36, sg: 0.085 * wkw * (0.55 + 0.45 * ex), k: 1 },
    { A: 0.2, sg: 0.2 * wkw * (0.55 + 0.45 * ex), k: 1.9 }
  ];
  return mk(
    W,
    H,
    c.S,
    (x, y, o) => {
      let t = 1;
      for (const l of layers) {
        const sd = sdBoxOpenTop(x - ox0 * ex * l.k, y - oy0 * ex * l.k, pad, pad + bkw, padTop + bkh);
        t *= 1 - l.A * (1 - sstep(-l.sg, l.sg, sd));
      }
      o[0] = 8;
      o[1] = 3;
      o[2] = 0;
      o[3] = 1 - t;
    },
    20
  );
}
function drawKeysPhysical(ctx, L, s, pv, incoming, t, dpr) {
  const { u, keysTop: top, keysH: kh, wkw, bkw, bkh } = L;
  const K = s.keys;
  const F2 = s.finish;
  const col2 = s.colors;
  const gl = s.glow;
  const pd = K.pressDepth;
  const gapPx = Math.max(wkw > 3 ? 1 : 0, wkw * K.gap);
  const radius = clamp2(wkw * 0.16 * K.cornerRadius, 0, Math.max(6.5 * u, 6.5 * u * K.cornerRadius));
  const ang = F2.lightAngle * Math.PI / 180;
  const lx = Math.sin(ang);
  const lit = clamp2(0.5 - lx * 0.8, 0.05, 0.95);
  const fill = clamp2(F2.lightFill, 0, 3);
  const amb = clamp2(F2.lightAmbient, 0, 3);
  const hiL = clamp2(lit + 0.12 * fill, 0, 1);
  const hiR = clamp2(1 - lit + 0.12 * fill, 0, 1);
  const shadeL = clamp2(1 - lit, 0, 1);
  const shadeR = clamp2(lit, 0, 1);
  const S = Math.max(1, Math.min(3, dpr));
  const ck = [wkw.toFixed(2), kh, bkw.toFixed(2), bkh.toFixed(1), gapPx.toFixed(2), u.toFixed(3), S, F2.lightAngle, F2.lightFill].join("|");
  if (!cache || cache.key !== ck) {
    cache = build(L, gapPx, S, lit, lx);
    cache.key = ck;
  }
  const C2 = cache;
  const D = new Float64Array(88);
  for (let k = L.lo; k <= L.hi; k++) {
    const p = pv[k];
    D[k] = p ? Math.max(0, p.d) : 0;
  }
  const prevWhite = (k) => {
    let j = k - 1;
    if (j >= L.lo && isBlack(j + 21)) j--;
    return j >= L.lo ? j : -1;
  };
  const nextWhite = (k) => {
    let j = k + 1;
    if (j <= L.hi && isBlack(j + 21)) j++;
    return j <= L.hi ? j : -1;
  };
  const wc = col2.whiteKey;
  const iv = [darken(wc, 0.13), darken(wc, 0.025), wc, darken(wc, 0.05), darken(wc, 0.17)];
  const ivory = ctx.createLinearGradient(0, top, 0, top + kh);
  ivory.addColorStop(0, iv[0]);
  ivory.addColorStop(0.06, iv[1]);
  ivory.addColorStop(0.5, iv[2]);
  ivory.addColorStop(0.88, iv[3]);
  ivory.addColorStop(1, iv[4]);
  const bandY = top + kh * 0.6;
  const bandH = kh * 0.17;
  const band = ctx.createLinearGradient(0, bandY - bandH, 0, bandY + bandH);
  band.addColorStop(0, "rgba(255,255,255,0)");
  band.addColorStop(0.5, "rgba(255,255,255,1)");
  band.addColorStop(1, "rgba(255,255,255,0)");
  const inc = /* @__PURE__ */ new Map();
  const incColor = /* @__PURE__ */ new Map();
  if (s.showIncomingKeyPreview) {
    for (const n of incoming) {
      const ramp = 1 - (n.start - t) / s.incomingLookAheadSeconds;
      if (!inc.has(n.key) || ramp > inc.get(n.key)) inc.set(n.key, ramp);
    }
  }
  for (const n of incoming) if (!incColor.has(n.key)) incColor.set(n.key, noteColor(n, s.colorMode, col2));
  const wash = gl.keyWash;
  const pre = gl.incomingKey;
  const spanX0 = L.kx[L.lo];
  const spanX1 = L.kx[L.hi] + L.kw[L.hi];
  if (F2.keybedDepth > 0) {
    const kb = ctx.createLinearGradient(0, top, 0, top + kh);
    kb.addColorStop(0, "#030201");
    kb.addColorStop(0.5, "#0b0705");
    kb.addColorStop(1, "#160e09");
    ctx.save();
    ctx.globalAlpha = clamp2(F2.keybedDepth, 0, 1);
    ctx.fillStyle = kb;
    ctx.fillRect(spanX0, top, spanX1 - spanX0, kh);
    ctx.restore();
  }
  const texAmt = F2.keyGrain > 0 ? clamp2(F2.keyGrain * F2.ivoryDetail, 0, 3) : 0;
  const cueDrop = F2.cueDrop * pd;
  const cNose = F2.cueNose;
  const cSide = F2.cueSideWalls;
  const cChan = F2.cueChannel;
  const cCont = F2.cueContact;
  const cTilt = F2.cueTilt;
  const cBlack = F2.cueBlackKeys;
  const cOver = F2.cueOverhang;
  const cBounce = F2.cueBounce;
  const lipH0 = Math.max(7, 12 * u);
  const wallPx = 0.1 * wkw * pd;
  for (let k = L.lo; k <= L.hi; k++) {
    if (isBlack(k + 21)) continue;
    const st = pv[k];
    const dp = D[k];
    const pressed = dp > 4e-3;
    const xx = L.kx[k] + gapPx / 2;
    const ww = L.kw[k] - gapPx;
    const lw = prevWhite(k);
    const rw = nextWhite(k);
    const dl = lw >= 0 ? D[lw] : 0;
    const dr = rw >= 0 ? D[rw] : 0;
    const wl = Math.max(0, dp - dl) * wallPx * cSide;
    const wr = Math.max(0, dp - dr) * wallPx * cSide;
    const g0 = dp * 0.012 * wkw * cueDrop;
    const x0 = xx + wl + g0;
    const x1 = xx + ww - wr - g0;
    const yTop = top + dp * 0.07 * wkw * cueDrop;
    const yBot = top + kh - dp * 0.045 * wkw * cueDrop;
    const fw = x1 - x0;
    const fh = yBot - yTop;
    const vfk = st ? 0.7 + 0.3 * st.vf : 1;
    const dS = dp * vfk;
    if (wl > 0.25) {
      const yS = lw >= 0 && k - lw === 2 ? top + L.bkh : yTop;
      ctx.drawImage(C2.wallR, xx, yS, wl + g0 + 0.5, yBot - yS - 0);
    }
    if (wr > 0.25) {
      const yS = rw >= 0 && rw - k === 2 ? top + L.bkh : yTop;
      ctx.drawImage(C2.wallL, xx + ww - wr - g0 - 0.5, yS, wr + g0 + 0.5, yBot - yS);
    }
    const face = () => rrBottom(ctx, x0, yTop, fw, fh, radius);
    ctx.fillStyle = ivory;
    face();
    ctx.fill();
    if (F2.keyVariance > 0) {
      const hv = ihash(k * 977 + 17);
      ctx.fillStyle = hv > 0.5 ? `rgba(255,252,238,${(hv - 0.5) * 0.06 * F2.keyVariance})` : `rgba(112,84,40,${(0.5 - hv) * 0.08 * F2.keyVariance})`;
      face();
      ctx.fill();
    }
    if (texAmt > 0 || F2.ivoryDetail > 0) {
      ctx.save();
      face();
      ctx.clip();
      if (texAmt > 0) {
        ctx.globalAlpha = clamp2(texAmt, 0, 1);
        ctx.drawImage(C2.ivTex, xx - k % 8 * wkw, top);
      }
      if (F2.ivoryDetail > 0) {
        ctx.globalAlpha = clamp2(F2.ivoryDetail, 0, 1.5);
        ctx.drawImage(C2.edge, xx, top, ww, kh);
      }
      ctx.restore();
    }
    if (st && dp > 0.01) {
      const p = Math.min(1, dp);
      ctx.save();
      face();
      ctx.clip();
      const wg = ctx.createLinearGradient(0, yTop, 0, yBot);
      wg.addColorStop(0, rgba(st.color, 0.92 * p * wash));
      wg.addColorStop(0.45, rgba(st.color, 0.62 * p * wash));
      wg.addColorStop(1, rgba(st.color, 0.28 * p * wash));
      ctx.fillStyle = wg;
      ctx.fillRect(x0, yTop, fw, fh);
      ctx.restore();
    } else if (inc.has(k)) {
      const r = inc.get(k);
      const c = incColor.get(k);
      ctx.save();
      face();
      ctx.clip();
      const wg = ctx.createLinearGradient(0, yTop, 0, yTop + fh * 0.5);
      wg.addColorStop(0, rgba(c, 0.34 * r * pre));
      wg.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = wg;
      ctx.fillRect(x0, yTop, fw, fh);
      ctx.restore();
    }
    if (K.gloss > 0) {
      if (!pressed) {
        ctx.globalAlpha = clamp2(0.085 * K.gloss, 0, 1);
        ctx.fillStyle = band;
        face();
        ctx.fill();
        ctx.globalAlpha = 1;
      } else {
        ctx.save();
        face();
        ctx.clip();
        const slide = -dp * 0.16 * kh * cTilt;
        ctx.translate(0, slide);
        ctx.globalAlpha = clamp2(0.085 * K.gloss * (1 - 0.55 * Math.min(1, dp) * cTilt), 0, 1);
        ctx.fillStyle = band;
        ctx.fillRect(x0, yTop - slide, fw, fh);
        ctx.restore();
      }
    }
    if (pressed) {
      ctx.save();
      face();
      ctx.clip();
      ctx.globalAlpha = clamp2(0.2 * dS * cTilt * amb, 0, 1);
      ctx.drawImage(C2.tilt, x0, yTop, fw, fh);
      ctx.globalAlpha = clamp2(0.62 * dS * cCont * amb * (0.45 + 0.55 * shadeL / 0.5 * 0.5) * (shadeL + 0.25), 0, 1);
      ctx.drawImage(C2.shL, x0, yTop, ww, fh);
      ctx.globalAlpha = clamp2(0.62 * dS * cCont * amb * (shadeR + 0.25) * 0.8, 0, 1);
      ctx.drawImage(C2.shR, x1 - ww, yTop, ww, fh);
      ctx.globalAlpha = clamp2(0.62 * dS * cCont * amb, 0, 1);
      ctx.drawImage(C2.rear, x0, yTop, fw, kh);
      ctx.globalAlpha = clamp2(0.55 * dS * cNose * amb, 0, 1);
      ctx.drawImage(C2.nose, x0, yBot - kh, fw, kh);
      ctx.restore();
    }
    if (K.bevel > 0) {
      const bw = Math.max(1, wkw * 0.045);
      const bw2 = Math.max(1, wkw * 0.06);
      const dim = 1 - 0.75 * Math.min(1, dp) * cCont;
      ctx.fillStyle = `rgba(255,255,255,${clamp2(0.6 * K.bevel * hiL * dim, 0, 1)})`;
      ctx.fillRect(x0 + 0.5, yTop + 2 * u, bw, fh - 10 * u);
      ctx.fillStyle = `rgba(255,255,255,${clamp2(0.3 * K.bevel * hiR * hiR * dim, 0, 1)})`;
      ctx.fillRect(x1 - bw - 0.5, yTop + 2 * u, Math.max(1, bw * 0.7), fh - 10 * u);
      ctx.fillStyle = `rgba(90,66,30,${clamp2(0.22 * K.bevel * shadeR * 1.2, 0, 1)})`;
      ctx.fillRect(x1 - bw2, yTop + 2 * u, bw2, fh - 10 * u);
      ctx.fillStyle = `rgba(90,66,30,${clamp2(0.1 * K.bevel * shadeL, 0, 1)})`;
      ctx.fillRect(x0, yTop + 2 * u, bw * 0.8, fh - 10 * u);
    }
    const lipH = lipH0 * (1 - 0.6 * Math.min(1, dp) * cNose);
    const lg = ctx.createLinearGradient(0, yBot - lipH, 0, yBot);
    const crest = clamp2(0.7 * K.gloss * (1 - 0.7 * Math.min(1, dp) * cNose), 0, 1);
    lg.addColorStop(0, `rgba(255,255,255,${crest})`);
    lg.addColorStop(0.07, "rgba(255,255,255,0)");
    lg.addColorStop(0.16, "rgba(140,108,60,0.06)");
    lg.addColorStop(0.62, "rgba(120,92,48,0.15)");
    lg.addColorStop(1, "rgba(66,44,18,0.5)");
    ctx.save();
    face();
    ctx.clip();
    ctx.fillStyle = lg;
    ctx.fillRect(x0, yBot - lipH, fw, lipH);
    const gl2 = ctx.createLinearGradient(x0, 0, x0 + fw, 0);
    gl2.addColorStop(0, "rgba(255,255,255,0)");
    gl2.addColorStop(lx <= 0 ? 0.3 : 0.7, `rgba(255,255,255,${clamp2(0.16 * K.gloss * (1 - 0.6 * Math.min(1, dp)), 0, 1)})`);
    gl2.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gl2;
    ctx.fillRect(x0, yBot - lipH - 1, fw, Math.max(1.5, 2.2 * u));
    ctx.fillStyle = `rgba(255,255,255,${clamp2(0.22 * K.gloss * (1 - 0.6 * Math.min(1, dp)), 0, 1)})`;
    ctx.fillRect(x0 + radius * 0.5, yBot - Math.max(1.2, 1.6 * u), fw - radius, Math.max(0.8, 0.8 * u));
    if (st && dp > 0.02 && cBounce > 0) {
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = rgba(lighten(st.color, 0.35), clamp2(0.5 * Math.min(1, dp) * cBounce * wash, 0, 1));
      ctx.fillRect(x0, yBot - lipH, fw, Math.max(1, 1.5 * u));
    }
    ctx.restore();
    if (st && cBounce > 0 && (wl > 0.25 || wr > 0.25)) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = rgba(st.color, clamp2(0.3 * cBounce * wash, 0, 1));
      if (wl > 0.25) ctx.fillRect(xx, yTop + 2, wl + g0, yBot - yTop - 2);
      if (wr > 0.25) ctx.fillRect(xx + ww - wr - g0, yTop + 2, wr + g0, yBot - yTop - 2);
      ctx.restore();
    }
    ctx.strokeStyle = "rgba(60,40,16,0.34)";
    ctx.lineWidth = 1;
    rrBottom(ctx, x0 + 0.5, yTop, fw - 1, fh - 0.5, radius);
    ctx.stroke();
    if (F2.middleCMarker && (k + 21) % 12 === 0 && wkw >= 9) {
      const mid = k === 39;
      const rd = clamp2(wkw * (mid ? 0.11 : 0.07), 1.1, mid ? 3.6 * u : 2.4 * u);
      const cx = xx + ww / 2;
      const cy = yBot - 29 * u;
      const bd = F2.brassDetail;
      ctx.fillStyle = `rgba(40,24,8,${0.35 * bd})`;
      ctx.beginPath();
      ctx.arc(cx, cy, rd + Math.max(0.5, rd * 0.22), 0, Math.PI * 2);
      ctx.fill();
      const dg = ctx.createRadialGradient(cx - rd * 0.35, cy - rd * 0.35, 0, cx, cy, rd * 1.15);
      dg.addColorStop(0, rgba(lighten(col2.keyLabelC, 0.55), mid ? 0.98 : 0.6));
      dg.addColorStop(0.55, rgba(col2.keyLabelC, mid ? 0.95 : 0.45));
      dg.addColorStop(1, rgba(darken(col2.keyLabelC, 0.35), mid ? 0.95 : 0.45));
      ctx.fillStyle = dg;
      ctx.beginPath();
      ctx.arc(cx, cy, rd, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.55 * Math.max(bd, 0.4)})`;
      ctx.fillRect(cx - rd, cy + rd + Math.max(0.5, rd * 0.22), rd * 2, 0.8);
    }
  }
  if (cChan > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(spanX0, top, spanX1 - spanX0, kh);
    ctx.clip();
    for (let k = L.lo; k <= L.hi; k++) {
      if (isBlack(k + 21)) continue;
      const dp = D[k];
      if (dp < 0.02) continue;
      const xx = L.kx[k] + gapPx / 2;
      const ww = L.kw[k] - gapPx;
      const yTop = top + dp * 0.07 * wkw * cueDrop;
      const yBot = top + kh - dp * 0.045 * wkw * cueDrop;
      const pvk = pv[k];
      const vfk = pvk ? 0.7 + 0.3 * pvk.vf : 1;
      const aw = Math.max(1.5, 0.07 * wkw);
      for (const side of [-1, 1]) {
        const nb = side < 0 ? prevWhite(k) : nextWhite(k);
        const dn = nb >= 0 ? D[nb] : 0;
        const rel = clamp2((dp - dn) * 0.85 + dp * 0.15, 0, 1) * vfk * cChan * amb;
        if (rel < 0.01) continue;
        const gx = side < 0 ? xx : xx + ww;
        ctx.fillStyle = `rgba(3,1,0,${clamp2(0.8 * rel, 0, 1)})`;
        ctx.fillRect(side < 0 ? gx - gapPx : gx, yTop, gapPx, yBot - yTop);
        const x2 = side < 0 ? gx - gapPx - aw : gx + gapPx + aw;
        const og = ctx.createLinearGradient(side < 0 ? gx - gapPx : gx + gapPx, 0, x2, 0);
        og.addColorStop(0, `rgba(12,5,0,${clamp2(0.38 * rel, 0, 1)})`);
        og.addColorStop(1, "rgba(12,5,0,0)");
        ctx.fillStyle = og;
        ctx.fillRect(Math.min(side < 0 ? gx - gapPx : gx + gapPx, x2), yTop + dp * 0.02 * wkw, aw, yBot - yTop);
        if (pvk && cBounce > 0) {
          ctx.globalCompositeOperation = "lighter";
          ctx.fillStyle = rgba(pvk.color, clamp2(0.35 * rel * cBounce * wash, 0, 1));
          ctx.fillRect(side < 0 ? gx - gapPx : gx, yTop + 2, gapPx, yBot - yTop - 4);
          ctx.globalCompositeOperation = "source-over";
        }
      }
    }
    ctx.restore();
  }
  if (F2.lampSheen > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(spanX0, top, spanX1 - spanX0, kh);
    ctx.clip();
    ctx.globalCompositeOperation = "multiply";
    const lf = ctx.createLinearGradient(0, 0, L.W, 0);
    const la = clamp2(0.1 * F2.lampSheen, 0, 0.5);
    lf.addColorStop(0, `rgba(84,56,24,${la * 1.6})`);
    lf.addColorStop(0.3, "rgba(84,56,24,0)");
    lf.addColorStop(0.7, "rgba(84,56,24,0)");
    lf.addColorStop(1, `rgba(84,56,24,${la * 1.6})`);
    ctx.fillStyle = lf;
    ctx.fillRect(spanX0, top, spanX1 - spanX0, kh);
    const rf = ctx.createLinearGradient(0, top, 0, top + kh * 0.5);
    rf.addColorStop(0, `rgba(84,56,24,${la * 1.2})`);
    rf.addColorStop(1, "rgba(84,56,24,0)");
    ctx.fillStyle = rf;
    ctx.fillRect(spanX0, top, spanX1 - spanX0, kh * 0.5);
    ctx.restore();
  }
  {
    const sg = ctx.createLinearGradient(0, top, 0, top + 16 * u);
    sg.addColorStop(0, "rgba(20,8,6,0.55)");
    sg.addColorStop(1, "rgba(20,8,6,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(0, top, L.W, 16 * u);
  }
  const bc = col2.blackKey;
  const bcr = Math.max(2, bkw * 0.13);
  ctx.save();
  ctx.beginPath();
  ctx.rect(spanX0, top, spanX1 - spanX0, kh);
  ctx.clip();
  for (let k = L.lo; k <= L.hi; k++) {
    if (!isBlack(k + 21)) continue;
    const dB = D[k];
    const dW = Math.max(k - 1 >= L.lo ? D[k - 1] : 0, k + 1 <= L.hi ? D[k + 1] : 0);
    const ex = clamp2(1 - 0.55 * dB * cBlack + 0.4 * dW * cOver, 0.3, 1.3);
    const f = clamp2((ex - 0.3) * NLEVEL, 0, NLEVEL);
    const lo = Math.min(NLEVEL, Math.floor(f));
    const hi = Math.min(NLEVEL, lo + 1);
    const fr = f - lo;
    const lvl = (i) => C2.bShadow[i] ??= blackShadow(C2, L, 0.3 + i / NLEVEL, lx);
    const sw = bkw + C2.padB * 2;
    const sh = bkh + C2.padB + C2.padTopB;
    const px = L.kx[k] - C2.padB;
    const py = top - C2.padTopB;
    const a = clamp2(amb, 0, 1.6);
    ctx.globalAlpha = clamp2((1 - fr) * a, 0, 1);
    ctx.drawImage(lvl(lo), px, py, sw, sh);
    if (fr > 0.01) {
      ctx.globalAlpha = clamp2(fr * a, 0, 1);
      ctx.drawImage(lvl(hi), px, py, sw, sh);
    }
  }
  ctx.restore();
  const litLeft = lx <= 0;
  const bodyG = ctx.createLinearGradient(0, 0, bkw, 0);
  if (litLeft) {
    bodyG.addColorStop(0, lighten(bc, 0.2));
    bodyG.addColorStop(0.14, bc);
    bodyG.addColorStop(0.86, darken(bc, 0.55));
    bodyG.addColorStop(1, darken(bc, 0.78));
  } else {
    bodyG.addColorStop(0, darken(bc, 0.78));
    bodyG.addColorStop(0.14, darken(bc, 0.55));
    bodyG.addColorStop(0.86, bc);
    bodyG.addColorStop(1, lighten(bc, 0.2));
  }
  const facetG = ctx.createLinearGradient(0, 0, bkw, 0);
  if (litLeft) {
    facetG.addColorStop(0.1, lighten(bc, 0.16));
    facetG.addColorStop(0.32, lighten(bc, 0.07));
    facetG.addColorStop(0.75, bc);
    facetG.addColorStop(0.92, darken(bc, 0.35));
  } else {
    facetG.addColorStop(0.08, darken(bc, 0.35));
    facetG.addColorStop(0.25, bc);
    facetG.addColorStop(0.68, lighten(bc, 0.07));
    facetG.addColorStop(0.9, lighten(bc, 0.16));
  }
  const sideRefl = ctx.createLinearGradient(0, top, 0, top + bkh);
  sideRefl.addColorStop(0, "rgba(255,255,255,0.3)");
  sideRefl.addColorStop(0.5, "rgba(255,255,255,0.07)");
  sideRefl.addColorStop(1, "rgba(255,255,255,0)");
  for (let k = L.lo; k <= L.hi; k++) {
    if (!isBlack(k + 21)) continue;
    const st = pv[k];
    const dB = Math.min(1.06, D[k]);
    const dBc = Math.min(1, dB);
    const x = L.kx[k];
    const w = L.kw[k];
    const dWl = k - 1 >= L.lo ? D[k - 1] : 0;
    const dWr = k + 1 <= L.hi ? D[k + 1] : 0;
    const yT = top + dB * 0.05 * wkw * cueDrop;
    const yB = top + bkh - dB * 0.035 * wkw * cueDrop;
    const h = yB - yT;
    const rad = Math.max(2, w * 0.13);
    const vfk = st ? 0.7 + 0.3 * st.vf : 1;
    const dS = dB * vfk;
    if (st && dB > 0.01 && gl.blackKeyHalo > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const cx = x + w / 2;
      const R2 = w * 1.7 + 8 * u;
      const hg = ctx.createRadialGradient(cx, yT + h * 0.55, 0, cx, yT + h * 0.55, R2);
      hg.addColorStop(0, rgba(st.color, gl.blackKeyHalo * dBc * 0.8));
      hg.addColorStop(1, rgba(st.color, 0));
      ctx.fillStyle = hg;
      ctx.fillRect(cx - R2, yT - R2 * 0.2, R2 * 2, h + R2 * 0.6);
      ctx.restore();
    }
    const wLeft = Math.max(0, dWl - dBc * 0.5) * wallPx * 0.8 * cSide;
    const wRight = Math.max(0, dWr - dBc * 0.5) * wallPx * 0.8 * cSide;
    if (wLeft > 0.25) {
      const sy = Math.max(0, yT - top);
      ctx.drawImage(C2.wallL, 0, 0, C2.wallL.width, Math.min(C2.wallL.height, Math.round((bkh - 2) * C2.S)), x - wLeft, top + sy * 0, wLeft + 0.5, bkh - 2);
      if (st && cBounce > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = rgba(st.color, clamp2(0.22 * cBounce * wash, 0, 1));
        ctx.fillRect(x - wLeft, top, wLeft, bkh - 2);
        ctx.restore();
      }
    }
    if (wRight > 0.25) {
      ctx.drawImage(C2.wallR, 0, 0, C2.wallR.width, Math.min(C2.wallR.height, Math.round((bkh - 2) * C2.S)), x + w - 0.5, top, wRight + 0.5, bkh - 2);
      if (st && cBounce > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = rgba(st.color, clamp2(0.22 * cBounce * wash, 0, 1));
        ctx.fillRect(x + w - 0.5, top, wRight, bkh - 2);
        ctx.restore();
      }
    }
    const inset = w * 0.14 * (1 - 0.5 * dBc * cBlack);
    const fx = inset;
    const fwk = w - inset * 2;
    const chH = bkh * 0.14 * (1 - 0.55 * dBc * cNose);
    const fh = h - chH;
    ctx.save();
    ctx.translate(x, 0);
    ctx.fillStyle = bodyG;
    rrBottom(ctx, 0, yT, w, h, rad);
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = clamp2(F2.ebonyDetail * (1 - 0.5 * dBc), 0, 1.5);
    ctx.fillStyle = sideRefl;
    if (litLeft) ctx.fillRect(0.5, yT, Math.max(1, inset - 0.5), fh);
    else ctx.fillRect(w - inset, yT, Math.max(1, inset - 0.5), fh);
    ctx.restore();
    ctx.fillStyle = facetG;
    const fr = Math.max(1.5, fwk * 0.14);
    rrBottom(ctx, fx, yT, fwk, fh, fr);
    ctx.fill();
    ctx.save();
    rrBottom(ctx, fx, yT, fwk, fh, fr);
    ctx.clip();
    if (st && dB > 0.01) {
      const wg = ctx.createLinearGradient(0, yT, 0, yT + fh);
      wg.addColorStop(0, rgba(st.color, 0.95 * dBc * wash));
      wg.addColorStop(0.6, rgba(st.color, 0.6 * dBc * wash));
      wg.addColorStop(1, rgba(st.color, 0.35 * dBc * wash));
      ctx.fillStyle = wg;
      ctx.fillRect(fx, yT, fwk, fh);
    } else if (inc.has(k)) {
      const r = inc.get(k);
      const wg = ctx.createLinearGradient(0, yT, 0, yT + fh * 0.5);
      wg.addColorStop(0, rgba(incColor.get(k), 0.42 * r * pre));
      wg.addColorStop(1, rgba(incColor.get(k), 0));
      ctx.fillStyle = wg;
      ctx.fillRect(fx, yT, fwk, fh);
    }
    {
      const slide = dBc * 0.14 * bkh * cTilt;
      ctx.globalAlpha = clamp2(K.gloss * F2.ebonyDetail * (1 - 0.5 * dBc * cTilt), 0, 1.5);
      ctx.drawImage(C2.streak, 0, yT - slide, w, bkh);
      ctx.globalAlpha = 1;
      const sg = ctx.createLinearGradient(0, yT, 0, yT + fh);
      sg.addColorStop(0, `rgba(255,255,255,${clamp2(0.2 * K.gloss * (1 - 0.45 * dBc), 0, 1)})`);
      sg.addColorStop(0.35, `rgba(255,255,255,${clamp2(0.05 * K.gloss * (1 - 0.45 * dBc), 0, 1)})`);
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(fx, yT, fwk, fh);
    }
    if (dB > 0.01) {
      const tg = ctx.createLinearGradient(0, yT, 0, yT + fh);
      tg.addColorStop(0, `rgba(0,0,0,${clamp2(0.05 * dS * cTilt, 0, 1)})`);
      tg.addColorStop(1, `rgba(0,0,0,${clamp2(0.4 * dS * cTilt * amb, 0, 1)})`);
      ctx.fillStyle = tg;
      ctx.fillRect(fx, yT, fwk, fh);
    }
    ctx.restore();
    ctx.fillStyle = `rgba(255,255,255,${clamp2(0.22 * K.gloss * F2.ebonyDetail * (1 - 0.5 * dBc), 0, 1)})`;
    ctx.fillRect(litLeft ? fx : fx + fwk - 1, yT + fr, 1, fh - fr);
    ctx.restore();
    const cg = ctx.createLinearGradient(0, yT + fh, 0, yB);
    cg.addColorStop(0, lighten(bc, 0.17 * (1 - 0.5 * dBc)));
    cg.addColorStop(0.18, lighten(bc, 0.07));
    cg.addColorStop(1, darken(bc, 0.4 + 0.25 * dBc));
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.moveTo(x + fx, yT + fh);
    ctx.lineTo(x + fx + fwk, yT + fh);
    ctx.lineTo(x + w - w * 0.04, yB - bcr);
    ctx.lineTo(x + w * 0.04, yB - bcr);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${clamp2(0.28 * K.gloss * F2.ebonyDetail * (1 - 0.6 * dBc), 0, 1)})`;
    ctx.fillRect(x + fx, yT + fh - 0.5, fwk, 1);
    if (st && dB > 0.02 && cBounce > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = rgba(st.color, clamp2(0.45 * dBc * cBounce * wash, 0, 1));
      ctx.fillRect(x + fx, yT + fh, fwk, 1.2);
      ctx.restore();
    }
    ctx.strokeStyle = `rgba(0,0,0,${clamp2(0.7 + 0.25 * dBc, 0, 1)})`;
    ctx.lineWidth = 1;
    rrBottom(ctx, x + 0.5, yT, w - 1, h - 0.5, rad);
    ctx.stroke();
  }
  if (F2.keyDither > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(spanX0, top, spanX1 - spanX0, kh);
    ctx.clip();
    ctx.globalAlpha = clamp2(F2.keyDither, 0, 3);
    for (let y = top; y < top + kh; y += 128) for (let x = Math.floor(spanX0); x < spanX1; x += 128) ctx.drawImage(C2.noise, x, y, 128, 128);
    ctx.restore();
  }
  drawCheeks(ctx, L, s, spanX0, spanX1);
  if (s.keyLabelMode !== "none" && wkw >= 10) {
    const fs = Math.round(clamp2(wkw * 0.4, 8, 14 * u) * K.labelScale);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    for (let k = L.lo; k <= L.hi; k++) {
      const midi = k + 21;
      const black = isBlack(midi);
      const pc = midi % 12;
      const oct = Math.floor(midi / 12) - 1;
      let txt2 = "";
      switch (s.keyLabelMode) {
        case "onlyC":
          if (pc === 0) txt2 = `C${oct}`;
          else if (k === 0) txt2 = "A0";
          break;
        case "allWhite":
          if (!black) txt2 = noteName(midi, s.useFlats, false) + (pc === 0 ? String(oct) : "");
          break;
        case "all88":
          txt2 = noteName(midi, s.useFlats, false) + (pc === 0 || k === 0 ? String(oct) : "");
          break;
        case "solfege":
          if (!black) txt2 = SOLFEGE[pc];
          break;
      }
      if (!txt2) continue;
      if (black) {
        if (L.kw[k] < 9) continue;
        ctx.font = `600 ${Math.max(7, fs - 3)}px ${SANS}`;
        ctx.fillStyle = rgba(col2.keyLabelBlack, 0.8);
        ctx.fillText(txt2, L.kx[k] + L.kw[k] / 2, top + L.bkh - 9 * u - D[k] * 0.035 * wkw * cueDrop);
      } else {
        const st = pv[k];
        const isC = pc === 0;
        ctx.font = `${isC ? 700 : 600} ${fs}px ${SANS}`;
        const down = st && st.d > 0.5;
        ctx.fillStyle = down ? luminance(st.color) > 0.55 ? "rgba(30,16,4,0.9)" : "#fff" : isC ? col2.keyLabelC : col2.keyLabel;
        ctx.fillText(txt2, L.kx[k] + L.kw[k] / 2, top + kh - 9 * u - D[k] * 0.045 * wkw * cueDrop);
      }
    }
  }
  void mix;
}

// src/engine/renderer.ts
var SERIF = '"Cormorant", "Iowan Old Style", "Palatino Linotype", Georgia, serif';
var SANS = '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
var canvasFactory = (w, h) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};
function setCanvasFactory(f) {
  canvasFactory = f;
}
var CACHE_CAP = 600;
var rgbCache = /* @__PURE__ */ new Map();
function toRgb(hex) {
  let v = rgbCache.get(hex);
  if (!v) {
    const h = hex.replace("#", "");
    v = [parseInt(h.slice(0, 2), 16) || 0, parseInt(h.slice(2, 4), 16) || 0, parseInt(h.slice(4, 6), 16) || 0];
    if (rgbCache.size > CACHE_CAP) rgbCache.clear();
    rgbCache.set(hex, v);
  }
  return v;
}
var clamp2 = (v, a, b) => Math.max(a, Math.min(b, v));
function rgba(hex, a) {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r},${g},${b},${clamp2(a, 0, 1)})`;
}
var hx = (v) => Math.round(clamp2(v, 0, 255)).toString(16).padStart(2, "0");
function mix(a, b, t) {
  const A = toRgb(a);
  const B = toRgb(b);
  return `#${hx(A[0] + (B[0] - A[0]) * t)}${hx(A[1] + (B[1] - A[1]) * t)}${hx(A[2] + (B[2] - A[2]) * t)}`;
}
function scaleHex(hex, f) {
  const [r, g, b] = toRgb(hex);
  return `#${hx(r * f)}${hx(g * f)}${hx(b * f)}`;
}
var shadeCache = /* @__PURE__ */ new Map();
function lighten(hex, amt) {
  const k = hex + "L" + amt;
  let v = shadeCache.get(k);
  if (!v) {
    if (shadeCache.size > CACHE_CAP) shadeCache.clear();
    shadeCache.set(k, v = mix(hex, "#ffffff", clamp2(amt, 0, 1)));
  }
  return v;
}
function darken(hex, amt) {
  const k = hex + "D" + amt;
  let v = shadeCache.get(k);
  if (!v) {
    if (shadeCache.size > CACHE_CAP) shadeCache.clear();
    shadeCache.set(k, v = mix(hex, "#000000", clamp2(amt, 0, 1)));
  }
  return v;
}
function luminance(hex) {
  const [r, g, b] = toRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
function noteColor(n, mode, c) {
  switch (mode) {
    case "finger":
      return c.finger[n.finger - 1] ?? c.rightHand;
    case "pitch":
      return c.pitch[n.midi % 12] ?? c.rightHand;
    case "colorblind":
      return n.hand === "R" ? c.colorblindRight : c.colorblindLeft;
    case "monochrome":
      return n.hand === "R" ? c.monoRight : c.monoLeft;
    default:
      return n.hand === "R" ? c.rightHand : c.leftHand;
  }
}
var WHITE_IDX = [];
{
  let w = 0;
  for (let k = 0; k < 88; k++) {
    if (isBlack(k + 21)) WHITE_IDX.push(w - 1);
    else WHITE_IDX.push(w++);
  }
}
var BLACK_OFFSET = { 1: -0.075, 3: 0.075, 6: -0.1, 8: 0, 10: 0.1 };
function computeLayout(W, H, s, song2) {
  const u = clamp2(H / 900, 0.85, 2.6) * s.layout.scale;
  let lo = 0;
  let hi = 87;
  if (s.autoZoomRange) {
    lo = song2.minKey;
    hi = song2.maxKey;
    if (isBlack(lo + 21)) lo--;
    if (isBlack(hi + 21)) hi++;
    while (hi - lo < 35) {
      if (lo > 0) lo--;
      if (hi < 87) hi++;
      if (lo === 0 && hi === 87) break;
    }
    while (lo > 0 && isBlack(lo + 21)) lo--;
    while (hi < 87 && isBlack(hi + 21)) hi++;
    lo = Math.max(0, lo - 1);
    hi = Math.min(87, hi + 1);
    while (lo > 0 && isBlack(lo + 21)) lo--;
    while (hi < 87 && isBlack(hi + 21)) hi++;
  }
  const k = s.keys;
  const w0 = WHITE_IDX[lo];
  const whiteCount = WHITE_IDX[hi] - w0 + 1;
  const wkw = W / whiteCount * k.widthScale;
  const span = wkw * whiteCount;
  const x0 = (W - span) * (span > W ? 0.5 + clamp2(k.panX, -1, 1) * 0.5 : 0.5);
  const bkw = wkw * k.blackWidthRatio;
  const railH = Math.round(14 * u * s.layout.railHeight);
  const frontH = Math.round(7 * u * s.layout.frontBoardHeight);
  const miniH = s.showKeyMinimap ? Math.round(34 * u * s.layout.minimapHeight) : 0;
  const maxKeys = Math.max(40, H - miniH - frontH - railH - H * 0.12);
  const keysH = Math.round(Math.min(maxKeys, clamp2(H * k.heightRatio, 40 * u, H * 0.7)));
  const bkh = keysH * k.blackHeightRatio;
  const laneH = Math.max(24, H - miniH - frontH - keysH - railH);
  const kx = new Float64Array(88);
  const kw = new Float64Array(88);
  for (let i = 0; i < 88; i++) {
    const midi = i + 21;
    if (isBlack(midi)) {
      const off = s.acousticBlackKeyOffsets ? BLACK_OFFSET[midi % 12] ?? 0 : 0;
      const centre = x0 + (WHITE_IDX[i] + 1 - w0) * wkw + off * wkw;
      kw[i] = bkw;
      kx[i] = centre - bkw / 2;
    } else {
      kw[i] = wkw;
      kx[i] = x0 + (WHITE_IDX[i] - w0) * wkw;
    }
  }
  const c = s.colors;
  const l = s.lines;
  const bgSig = [c.bgTop, c.bgMid, c.bgBottom, c.lamp, c.laneGuide, s.glow.lamp, l.blackLaneShade, l.whiteLaneAlt, l.vignetteTop, l.vignetteSide, l.guideAlphaC, l.guideAlphaF, l.guideWidth, s.finish.laneDepth, s.finish.middleCMarker].join(",");
  return {
    W,
    H,
    u,
    laneH,
    railH,
    keysTop: laneH + railH,
    keysH,
    frontY: laneH + railH + keysH,
    frontH,
    miniY: H - miniH,
    miniH,
    lo,
    hi,
    wkw,
    bkw,
    bkh,
    x0,
    kx,
    kw,
    key: `${W}x${H}|${lo}-${hi}|${laneH}|${x0.toFixed(2)}|${wkw.toFixed(3)}|${k.blackWidthRatio}|${u.toFixed(3)}|${s.acousticBlackKeyOffsets}|${s.showKeyLaneGuides}|${bgSig}`
  };
}
function rr(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
function rrBottom(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.closePath();
}
function setSpacing(ctx, px) {
  const c = ctx;
  if ("letterSpacing" in c) c.letterSpacing = `${px}px`;
}
function fitText(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const m = lo + hi + 1 >> 1;
    if (ctx.measureText(text.slice(0, m) + "\u2026").width <= maxW) lo = m;
    else hi = m - 1;
  }
  return text.slice(0, Math.max(1, lo)).trimEnd() + "\u2026";
}
function hash(n) {
  let x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  x -= Math.floor(x);
  return x;
}
function lowerBoundStart(list, t) {
  let lo = 0;
  let hi = list.length;
  while (lo < hi) {
    const m = lo + hi >> 1;
    if (list[m].start < t) lo = m + 1;
    else hi = m;
  }
  return lo;
}
var feltPattern = null;
var woodPattern = null;
function pnoise(x, per, seed) {
  const i = Math.floor(x);
  const f = x - i;
  const a = ihash((i % per + per) % per * 7919 + seed * 104729);
  const b = ihash(((i + 1) % per + per) % per * 7919 + seed * 104729);
  const t = f * f * (3 - 2 * f);
  return a + (b - a) * t;
}
function getFelt(ctx) {
  if (feltPattern) return feltPattern;
  const N = 96;
  const c = canvasFactory(N, N);
  const g = c.getContext("2d");
  g.fillStyle = "#000";
  g.fillRect(0, 0, N, N);
  const img = g.getImageData(0, 0, N, N);
  for (let i = 0; i < N * N; i++) {
    const x = i % N;
    const v = ihash(i * 3 + 1) * 70 + (x % 2 === 0 ? 10 : 0) + pnoise(x / 12, N / 12, 2) * 26;
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v * 0.9;
    img.data[i * 4 + 2] = v * 0.9;
    img.data[i * 4 + 3] = 70;
  }
  g.putImageData(img, 0, 0);
  g.lineWidth = 0.8;
  for (let i = 0; i < 260; i++) {
    const x = ihash(i * 5 + 1) * N;
    const y = ihash(i * 5 + 2) * N;
    const a = ihash(i * 5 + 3) * Math.PI * 2;
    const len = 2 + ihash(i * 5 + 4) * 5;
    g.strokeStyle = ihash(i * 5 + 5) > 0.55 ? "rgba(255,225,225,0.16)" : "rgba(0,0,0,0.22)";
    for (const ox of [-N, 0, N]) {
      for (const oy of [-N, 0, N]) {
        g.beginPath();
        g.moveTo(x + ox, y + oy);
        g.quadraticCurveTo(x + ox + Math.cos(a + 0.5) * len * 0.5, y + oy + Math.sin(a + 0.5) * len * 0.5, x + ox + Math.cos(a) * len, y + oy + Math.sin(a) * len);
        g.stroke();
      }
    }
  }
  feltPattern = ctx.createPattern(c, "repeat");
  return feltPattern;
}
function woodTile(vertical) {
  const LEN = 512;
  const T2 = 48;
  const c = canvasFactory(vertical ? T2 : LEN, vertical ? LEN : T2);
  const g = c.getContext("2d");
  const img = g.createImageData(c.width, c.height);
  for (let a = 0; a < LEN; a++) {
    for (let b = 0; b < T2; b++) {
      const warp = pnoise(a / 140, LEN / 140, 7) * 5;
      const ring = pnoise((b + warp) / 3.1, T2 / 3.1 + 1e5, 11);
      const fine = ihash(b * 31 + 5) * 0.5 + pnoise(a / 18 + b * 0.7, LEN / 18, 3) * 0.5;
      let dark = Math.pow(ring, 2.2) * 0.2 + fine * 0.07;
      let r = 40;
      let gg = 20;
      let bb = 4;
      let al = dark;
      if (ring < 0.45) {
        r = 255;
        gg = 205;
        bb = 140;
        al = (0.45 - ring) * 0.85 * (0.45 + fine);
      }
      if (ihash(a * 13 + b * 97 + 4) > 0.9965) {
        r = 20;
        gg = 8;
        bb = 0;
        al = 0.3;
      }
      const x = vertical ? b : a;
      const y = vertical ? a : b;
      const i = (y * c.width + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = gg;
      img.data[i + 2] = bb;
      img.data[i + 3] = Math.min(255, al * 255);
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}
function getWood(ctx) {
  if (woodPattern) return woodPattern;
  woodPattern = ctx.createPattern(woodTile(false), "repeat");
  return woodPattern;
}
var woodVPattern = null;
function getWoodV(ctx) {
  if (woodVPattern) return woodVPattern;
  woodVPattern = ctx.createPattern(woodTile(true), "repeat");
  return woodVPattern;
}
var grainPattern = null;
function getGrain(ctx) {
  if (grainPattern) return grainPattern;
  const W = 96;
  const H = 192;
  const c = canvasFactory(W, H);
  const g = c.getContext("2d");
  for (let x = 0; x < W; x++) {
    const base = hash(x * 3.7 + 11);
    const wid = 1 + (hash(x * 1.3) > 0.7 ? 1 : 0);
    const gr = g.createLinearGradient(0, 0, 0, H);
    const a = 0.018 + base * 0.05;
    gr.addColorStop(0, `rgba(120,92,52,${a * 0.4})`);
    gr.addColorStop(0.35 + hash(x) * 0.2, `rgba(120,92,52,${a})`);
    gr.addColorStop(1, `rgba(120,92,52,${a * 0.3})`);
    g.fillStyle = hash(x * 5.1) > 0.82 ? `rgba(255,255,255,${0.05 + base * 0.07})` : gr;
    g.fillRect(x, 0, wid, H);
  }
  for (let i = 0; i < 70; i++) {
    g.fillStyle = `rgba(90,64,30,${0.05 + hash(i * 2.9) * 0.07})`;
    g.fillRect(hash(i * 7.7) * W, hash(i * 4.1) * H, 1, 1 + hash(i) * 3);
  }
  grainPattern = ctx.createPattern(c, "repeat");
  return grainPattern;
}
var bgCaches = /* @__PURE__ */ new Map();
function buildBackground(L, s, dpr) {
  const c = canvasFactory(Math.max(1, Math.round(L.W * dpr)), Math.max(1, Math.round(L.laneH * dpr)));
  const g = c.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const { W, laneH: h, u } = L;
  const col2 = s.colors;
  const ln = s.lines;
  const grad = g.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, col2.bgTop);
  grad.addColorStop(0.5, col2.bgMid);
  grad.addColorStop(1, col2.bgBottom);
  g.fillStyle = grad;
  g.fillRect(0, 0, W, h);
  const rg = g.createRadialGradient(W / 2, h, 0, W / 2, h, Math.max(W, h) * 0.75);
  rg.addColorStop(0, rgba(col2.lamp, s.glow.lamp));
  rg.addColorStop(0.5, rgba(mix(col2.lamp, "#000000", 0.35), s.glow.lamp * 0.31));
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg;
  g.fillRect(0, 0, W, h);
  for (let k = L.lo; k <= L.hi; k++) {
    if (!isBlack(k + 21)) continue;
    const lg = g.createLinearGradient(L.kx[k], 0, L.kx[k] + L.kw[k], 0);
    lg.addColorStop(0, `rgba(0,0,0,${ln.blackLaneShade})`);
    lg.addColorStop(0.5, `rgba(0,0,0,${ln.blackLaneShade * 0.647})`);
    lg.addColorStop(1, `rgba(0,0,0,${ln.blackLaneShade})`);
    g.fillStyle = lg;
    g.fillRect(L.kx[k], 0, L.kw[k], h);
  }
  if (ln.whiteLaneAlt > 0) {
    g.fillStyle = `rgba(255,226,170,${ln.whiteLaneAlt})`;
    for (let k = L.lo; k <= L.hi; k++) {
      if (isBlack(k + 21)) continue;
      if (WHITE_IDX[k] % 2 === 0) g.fillRect(L.kx[k], 0, L.kw[k], h);
    }
  }
  if (s.showKeyLaneGuides) {
    for (let k = L.lo; k <= L.hi; k++) {
      const pc = (k + 21) % 12;
      if (pc !== 0 && pc !== 5) continue;
      const x = Math.round(L.kx[k]) + 0.5;
      const isC = pc === 0;
      const a = isC ? ln.guideAlphaC : ln.guideAlphaF;
      const lg = g.createLinearGradient(0, 0, 0, h);
      lg.addColorStop(0, rgba(col2.laneGuide, a * 0.135));
      lg.addColorStop(1, rgba(col2.laneGuide, a));
      g.strokeStyle = lg;
      g.lineWidth = Math.max(1, (isC ? 1.3 : 0.9) * u * ln.guideWidth);
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, h);
      g.stroke();
    }
  }
  if (s.finish.middleCMarker && 39 >= L.lo && 39 <= L.hi) {
    const mg = g.createLinearGradient(0, h * 0.2, 0, h);
    mg.addColorStop(0, "rgba(255,214,140,0)");
    mg.addColorStop(1, "rgba(255,214,140,0.05)");
    g.fillStyle = mg;
    g.fillRect(L.kx[39], 0, L.kw[39], h);
  }
  if (s.finish.laneDepth > 0) {
    const ld = s.finish.laneDepth;
    const fl = g.createLinearGradient(0, h * 0.5, 0, h);
    fl.addColorStop(0, "rgba(255,226,170,0)");
    fl.addColorStop(1, `rgba(255,226,170,${clamp2(0.03 * ld, 0, 0.3)})`);
    g.fillStyle = fl;
    for (let k = L.lo; k <= L.hi; k++) if (!isBlack(k + 21)) g.fillRect(L.kx[k], h * 0.5, L.kw[k], h * 0.5);
    const far = g.createLinearGradient(0, 0, 0, h * 0.6);
    far.addColorStop(0, `rgba(0,0,0,${clamp2(0.22 * ld, 0, 0.8)})`);
    far.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = far;
    g.fillRect(0, 0, W, h * 0.6);
  }
  const vt = g.createLinearGradient(0, 0, 0, h * 0.32);
  vt.addColorStop(0, `rgba(0,0,0,${ln.vignetteTop})`);
  vt.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = vt;
  g.fillRect(0, 0, W, h * 0.32);
  const vs = g.createLinearGradient(0, 0, W, 0);
  vs.addColorStop(0, `rgba(0,0,0,${ln.vignetteSide})`);
  vs.addColorStop(0.12, "rgba(0,0,0,0)");
  vs.addColorStop(0.88, "rgba(0,0,0,0)");
  vs.addColorStop(1, `rgba(0,0,0,${ln.vignetteSide})`);
  g.fillStyle = vs;
  g.fillRect(0, 0, W, h);
  return c;
}
var DEGREES = ["1", "\u266D2", "2", "\u266D3", "3", "4", "\u266F4", "5", "\u266D6", "6", "\u266D7", "7"];
function noteLabel(n, s, song2) {
  switch (s.noteLabelMode) {
    case "fingering":
      return String(n.finger);
    case "noteName":
      return noteName(n.midi, s.useFlats, false);
    case "solfege":
      return (s.useFlats ? SOLFEGE_FLAT : SOLFEGE)[n.midi % 12];
    case "scaleDegree": {
      const tonic = (7 * song2.keySig.sharps % 12 + 12) % 12;
      const t = song2.keySig.minor ? (tonic + 9) % 12 : tonic;
      return DEGREES[(n.midi - t + 120) % 12];
    }
    default:
      return "";
  }
}
function drawFrame(ctx, song2, t, s, o) {
  const { width: W, height: H, dpr } = o;
  const eps = o.hitEps ?? 4e-3;
  const L = computeLayout(W, H, s, song2);
  const { u, laneH, railH } = L;
  const col2 = s.colors;
  const gl = s.glow;
  const ln = s.lines;
  const nt = s.notes;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.fillStyle = scaleHex(col2.bgBottom, 0.55);
  ctx.fillRect(0, laneH, W, H - laneH);
  const bgKey = `${L.key}@${dpr}`;
  let bg = bgCaches.get(bgKey);
  if (!bg) {
    if (bgCaches.size >= 3) bgCaches.delete(bgCaches.keys().next().value);
    bgCaches.set(bgKey, bg = { key: L.key, dpr, canvas: buildBackground(L, s, dpr) });
  }
  ctx.drawImage(bg.canvas, 0, 0, W, laneH);
  const fall = s.noteFallSeconds;
  const yOf = (time) => laneH - (time - t) / fall * laneH;
  const muted = s.mutedTracks.length ? new Set(s.mutedTracks) : null;
  const handOk = (n) => (s.activeHandFilter === "both" || (s.activeHandFilter === "right" ? n.hand === "R" : n.hand === "L")) && !(muted && muted.has(n.track));
  if (s.ambientDust && s.dust.count > 0) {
    const d = s.dust;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < d.count; i++) {
      const sp = (0.012 + hash(i * 5.3) * 0.03) * d.speed;
      const x = (hash(i * 1.7) * W + Math.sin(t * d.speed * (0.2 + hash(i) * 0.3) + i) * 26 * u + W) % W;
      const y = ((hash(i * 3.9) - t * sp) % 1 + 1) % 1 * laneH;
      const r = (0.5 + hash(i * 8.1) * 1.4) * u * d.size;
      const a = (0.1 + 0.25 * (0.5 + 0.5 * Math.sin(t * d.speed * (0.6 + hash(i * 2.2)) + i * 3))) * clamp2((laneH - y) / (laneH * 0.4) + 0.2, 0, 1) * d.alpha;
      const dg = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
      dg.addColorStop(0, rgba(col2.dust, a));
      dg.addColorStop(1, rgba(col2.dust, 0));
      ctx.fillStyle = dg;
      ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
    }
    ctx.restore();
  }
  const pedal = pedalAt(song2, t);
  if (pedal && s.showSustainPedal && gl.pedalWash > 0) {
    const pg = ctx.createLinearGradient(0, laneH * 0.55, 0, laneH);
    pg.addColorStop(0, rgba(col2.pedalWash, 0));
    pg.addColorStop(1, rgba(col2.pedalWash, gl.pedalWash));
    ctx.fillStyle = pg;
    ctx.fillRect(0, laneH * 0.55, W, laneH * 0.45);
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, laneH);
  ctx.clip();
  const tTop = t + fall;
  if (s.showMeasureLines || s.showBeatLines) {
    const ms = song2.measures;
    let a = 0;
    let b = ms.length;
    while (a < b) {
      const m = a + b >> 1;
      if (ms[m].time < t - 1e-6) a = m + 1;
      else b = m;
    }
    ctx.textBaseline = "alphabetic";
    const startI = Math.max(0, a - 1);
    for (let i = startI; i < ms.length; i++) {
      const m = ms[i];
      if (m.time > tTop && (m.beats[0] ?? Infinity) > tTop) break;
      if (s.showBeatLines && ln.beatAlpha > 0) {
        for (const bt of m.beats) {
          if (bt < t || bt > tTop) continue;
          const y = Math.round(yOf(bt)) + 0.5;
          ctx.strokeStyle = rgba(col2.beatLine, ln.beatAlpha);
          ctx.lineWidth = Math.max(1, 0.9 * u);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
      }
      if (s.showMeasureLines && m.time >= t - 1e-6 && m.time <= tTop) {
        const y = Math.round(yOf(m.time)) + 0.5;
        const lg = ctx.createLinearGradient(0, 0, W, 0);
        lg.addColorStop(0, rgba(col2.measureLine, ln.measureAlpha));
        lg.addColorStop(0.5, rgba(col2.measureLine, ln.measureAlpha * 0.53));
        lg.addColorStop(1, rgba(col2.measureLine, ln.measureAlpha));
        ctx.strokeStyle = lg;
        ctx.lineWidth = Math.max(1, 1.3 * u * ln.measureWidth);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        if (s.showMeasureNumbers) {
          ctx.font = `italic 600 ${Math.round(15 * u * ln.measureNumberSize)}px ${SERIF}`;
          ctx.fillStyle = rgba(col2.measureNumber, 0.62);
          ctx.textAlign = "left";
          ctx.fillText(String(m.number), 12 * u, y - 5 * u);
        }
      }
    }
  }
  const keyState = new Array(88).fill(null);
  const visible = [];
  const incoming = [];
  const startIdx = firstVisibleIndex(song2, t - 0.12);
  const notes = song2.notes;
  let activeCount = 0;
  for (let i = startIdx; i < notes.length; i++) {
    const n = notes[i];
    if (n.start > tTop) break;
    if (!handOk(n)) continue;
    visible.push(n);
    const sounding = n.start <= t + eps && t < n.visEnd;
    let press = 0;
    if (sounding) {
      press = clamp2((t - n.start + eps) / 0.045, 0, 1);
      press = 1 - Math.pow(1 - Math.max(press, 0.18), 2);
      activeCount++;
    } else if (t >= n.visEnd && t < n.visEnd + 0.11) press = 1 - (t - n.visEnd) / 0.11;
    if (press > 0) {
      const prev = keyState[n.key];
      if (!prev || sounding && n.start >= prev.start || press > prev.press) {
        keyState[n.key] = { press: sounding ? press : Math.max(press, 0), color: noteColor(n, s.colorMode, col2), vel: n.vel, start: n.start };
      }
    }
    if (n.start > t + eps && n.start <= t + s.incomingLookAheadSeconds) incoming.push(n);
  }
  let pressView = null;
  if (s.finish.keyPhysics) {
    const Fz = s.finish;
    const P = {
      hold: Fz.pressHold,
      attackSlow: Fz.pressAttackSlow,
      attackFast: Fz.pressAttackFast,
      bottomOut: Fz.pressBottomOut,
      releaseSlow: Fz.pressReleaseSlow,
      releaseFast: Fz.pressReleaseFast,
      overshoot: Fz.pressOvershoot,
      anticipation: Fz.pressAnticipation / 1e3,
      variation: Fz.pressVariation
    };
    const perKey = new Array(88);
    for (let i = firstVisibleIndex(song2, t - 0.6); i < notes.length; i++) {
      const n = notes[i];
      if (n.start > t + 0.08) break;
      if (!handOk(n) || n.visEnd + 0.6 < t) continue;
      (perKey[n.key] ||= []).push({ start: n.start, end: n.visEnd, vel: n.vel, ref: n });
    }
    pressView = new Array(88).fill(null);
    for (let k = 0; k < 88; k++) {
      const list = perKey[k];
      if (!list) continue;
      const r = keyDepressAt(list, t, k, P, eps + P.anticipation);
      if (r) pressView[k] = { d: r.d, vf: r.vf, color: noteColor(r.ref, s.colorMode, col2) };
    }
  }
  if (s.showSustainTails && s.showSustainPedal && gl.sustainTail > 0) {
    for (const n of visible) {
      if (n.sustainEnd <= n.visEnd + 0.05) continue;
      const c = noteColor(n, s.colorMode, col2);
      const yTop = yOf(n.sustainEnd);
      const yBot = yOf(n.visEnd);
      if (yBot < 0 || yTop > laneH) continue;
      const tw = Math.max(2 * u, L.kw[n.key] * 0.3);
      const x = L.kx[n.key] + (L.kw[n.key] - tw) / 2;
      const tg = ctx.createLinearGradient(0, yTop, 0, yBot);
      tg.addColorStop(0, rgba(c, 0));
      tg.addColorStop(1, rgba(c, gl.sustainTail));
      ctx.fillStyle = tg;
      rr(ctx, x, yTop, tw, Math.max(1, yBot - yTop), tw / 2);
      ctx.fill();
    }
  }
  if (s.showChordBrackets) {
    ctx.textAlign = "center";
    const bracketCol = col2.chordText;
    const romanCol = mix(col2.chordText, col2.chordRoman, 0.35);
    for (let ci = lowerBoundStart(song2.chords, t - 0.02); ci < song2.chords.length; ci++) {
      const c = song2.chords[ci];
      if (c.start > tTop) break;
      if (c.start < t - 0.02 || c.shownEnd - c.start < 0.2) continue;
      const y = yOf(c.start);
      if (y + 30 * u > laneH || y < 20 * u) continue;
      const x1 = L.kx[c.keyLo];
      const x2 = L.kx[c.keyHi] + L.kw[c.keyHi];
      const by = y + 5 * u;
      ctx.strokeStyle = rgba(bracketCol, 0.55);
      ctx.lineWidth = Math.max(1, 1.3 * u);
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x1 + 2 * u, by - 4 * u);
      ctx.lineTo(x1 + 2 * u, by);
      ctx.lineTo(x2 - 2 * u, by);
      ctx.lineTo(x2 - 2 * u, by - 4 * u);
      ctx.stroke();
      const cx = (x1 + x2) / 2;
      ctx.font = `italic 700 ${Math.round(15 * u)}px ${SERIF}`;
      ctx.fillStyle = rgba(bracketCol, 0.92);
      ctx.fillText(c.symbol, cx, by + 16 * u);
      if (c.roman) {
        ctx.font = `500 ${Math.round(9.5 * u)}px ${SANS}`;
        ctx.fillStyle = rgba(romanCol, 0.6);
        ctx.fillText(c.roman, cx, by + 28 * u);
      }
    }
  }
  const gap = nt.gap * u;
  const activeBeams = [];
  for (const n of visible) {
    const c = noteColor(n, s.colorMode, col2);
    const black = isBlack(n.midi);
    const kwid = L.kw[n.key];
    const nw = Math.max(2, kwid * (black ? nt.widthBlack : nt.widthWhite));
    const x = L.kx[n.key] + (kwid - nw) / 2;
    const yb = yOf(n.start) - gap;
    let yt = yOf(n.visEnd);
    if (yb < 0 || yt > laneH) continue;
    if (yb - yt < nt.minHeight * u) yt = yb - nt.minHeight * u;
    const h = yb - yt;
    const active = n.start <= t + eps && t < n.visEnd;
    const r = Math.min(nw * nt.cornerRadius, 9 * u, h / 2);
    const dim = nt.velocityDim * (1 - n.vel / 127) * 0.5 + (black ? nt.blackDarken : 0);
    const base = dim > 5e-4 ? darken(c, dim) : c;
    const tl = nt.topLight;
    ctx.save();
    ctx.globalAlpha = nt.opacity;
    if (active) {
      if (gl.noteActiveBlur > 0 && gl.noteActiveAlpha > 0) {
        ctx.shadowColor = rgba(c, gl.noteActiveAlpha);
        ctx.shadowBlur = gl.noteActiveBlur * u;
      }
    } else if (gl.noteIdleAlpha > 0) {
      const sp = gl.noteIdleSpread * u;
      ctx.fillStyle = rgba(c, gl.noteIdleAlpha);
      rr(ctx, x - sp, yt - sp, nw + sp * 2, h + sp * 2, r + sp);
      ctx.fill();
    }
    const gr = ctx.createLinearGradient(0, yt, 0, yb);
    gr.addColorStop(0, lighten(base, (active ? 0.34 : 0.2) * tl));
    gr.addColorStop(0.18, lighten(base, (active ? 0.18 : 0.08) * tl));
    gr.addColorStop(0.75, base);
    gr.addColorStop(1, darken(base, 0.26));
    ctx.fillStyle = gr;
    rr(ctx, x, yt, nw, h, r);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = nt.opacity;
    ctx.save();
    rr(ctx, x, yt, nw, h, r);
    ctx.clip();
    if (nt.shine > 0) {
      const sh = ctx.createLinearGradient(x, 0, x + nw, 0);
      sh.addColorStop(0, `rgba(255,255,255,${clamp2(0.3 * nt.shine, 0, 1)})`);
      sh.addColorStop(0.18, `rgba(255,255,255,${clamp2(0.06 * nt.shine, 0, 1)})`);
      sh.addColorStop(0.7, "rgba(255,255,255,0)");
      sh.addColorStop(1, `rgba(0,0,0,${clamp2(0.22 * nt.shine, 0, 1)})`);
      ctx.fillStyle = sh;
      ctx.fillRect(x, yt, nw, h);
    }
    if (s.finish.noteCore > 0 && h > 9 * u && nw > 5) {
      const cw = Math.max(1, nw * 0.075);
      const ca = clamp2(0.17 * s.finish.noteCore * (active ? 1.5 : 1), 0, 0.9);
      const cg = ctx.createLinearGradient(0, yt, 0, yb);
      cg.addColorStop(0, "rgba(255,255,255,0)");
      cg.addColorStop(0.18, `rgba(255,255,255,${ca})`);
      cg.addColorStop(0.85, `rgba(255,255,255,${ca * 0.55})`);
      cg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(x + nw * 0.34 - cw / 2, yt + 1, cw, h - 2);
    }
    const fh = Math.min(h, 16 * u);
    const fg = ctx.createLinearGradient(0, yb - fh, 0, yb);
    fg.addColorStop(0, "rgba(255,255,255,0)");
    fg.addColorStop(1, `rgba(255,255,255,${clamp2((active ? 0.38 : 0.12) * nt.strikeFlare, 0, 1)})`);
    ctx.fillStyle = fg;
    ctx.fillRect(x, yb - fh, nw, fh);
    ctx.restore();
    ctx.lineWidth = Math.max(1, 1 * u);
    if (nt.outline > 0) {
      ctx.strokeStyle = `rgba(255,255,255,${clamp2(0.34 * nt.outline, 0, 1)})`;
      rr(ctx, x + 0.5, yt + 0.5, nw - 1, h - 1, Math.max(0, r - 0.5));
      ctx.stroke();
    }
    if (nt.edgeShadow > 0) {
      ctx.strokeStyle = `rgba(0,0,0,${clamp2(0.38 * nt.edgeShadow, 0, 1)})`;
      rr(ctx, x - 0.5, yt - 0.5, nw + 1, h + 1, r + 0.5);
      ctx.stroke();
    }
    if (s.noteLabelMode !== "none") {
      const lab = noteLabel(n, s, song2);
      const fs = clamp2(nw * 0.5, 8 * u, 18 * u) * nt.labelScale;
      if (lab && nw >= 11 * u * 0.9 && h >= fs * 1.4) {
        ctx.font = `700 ${Math.round(fs)}px ${SANS}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const dark = luminance(base) > 0.5;
        ctx.fillStyle = dark ? "rgba(30,16,4,0.9)" : "rgba(255,247,230,0.95)";
        if (!dark) {
          ctx.shadowColor = "rgba(0,0,0,0.45)";
          ctx.shadowBlur = 2 * u;
        }
        ctx.fillText(lab, x + nw / 2, yb - fs * 0.95);
        ctx.shadowBlur = 0;
        ctx.textBaseline = "alphabetic";
      }
    }
    ctx.restore();
    if (active) activeBeams.push({ x: L.kx[n.key], w: kwid, col: c, vel: n.vel, age: t - n.start, id: n.id });
  }
  if (s.finish.noteFadeIn > 0) {
    const fh = laneH * clamp2(s.finish.noteFadeIn, 0, 0.8);
    const fg = ctx.createLinearGradient(0, 0, 0, fh);
    fg.addColorStop(0, rgba(col2.bgTop, 0.94));
    fg.addColorStop(0.5, rgba(col2.bgTop, 0.42));
    fg.addColorStop(1, rgba(col2.bgTop, 0));
    ctx.fillStyle = fg;
    ctx.fillRect(0, 0, W, fh);
  }
  if (s.showAcousticBloom && activeBeams.length) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const b of activeBeams) {
      const cx = b.x + b.w / 2;
      const v = 0.5 + 0.5 * (b.vel / 127);
      const env = Math.exp(-Math.max(0, b.age) * gl.bloomDecay) * 0.65 + 0.35;
      const beamH = laneH * gl.beamHeight * v;
      if (beamH > 1 && gl.beamAlpha > 0) {
        const bg2 = ctx.createLinearGradient(0, laneH - beamH, 0, laneH);
        bg2.addColorStop(0, rgba(b.col, 0));
        bg2.addColorStop(1, rgba(b.col, gl.beamAlpha * env));
        ctx.fillStyle = bg2;
        ctx.fillRect(b.x, laneH - beamH, b.w, beamH);
      }
      const R2 = (b.w * 2.1 + 26 * u) * v * gl.bloomSize;
      if (R2 > 1 && gl.bloomAlpha > 0) {
        const rg2 = ctx.createRadialGradient(cx, laneH, 0, cx, laneH, R2);
        rg2.addColorStop(0, rgba(lighten(b.col, 0.35), gl.bloomAlpha * env));
        rg2.addColorStop(0.35, rgba(b.col, gl.bloomAlpha * 0.355 * env));
        rg2.addColorStop(1, rgba(b.col, 0));
        ctx.fillStyle = rg2;
        ctx.fillRect(cx - R2, laneH - R2, R2 * 2, R2);
      }
      if (gl.impactFlash > 0 && b.age >= 0 && b.age < 0.14) {
        const f = (1 - b.age / 0.14) * gl.impactFlash * v;
        const FR = b.w * 1.5 + 18 * u;
        const fg2 = ctx.createRadialGradient(cx, laneH, 0, cx, laneH, FR);
        fg2.addColorStop(0, `rgba(255,255,255,${clamp2(f * 0.85, 0, 1)})`);
        fg2.addColorStop(0.4, rgba(lighten(b.col, 0.6), clamp2(f * 0.35, 0, 1)));
        fg2.addColorStop(1, rgba(b.col, 0));
        ctx.fillStyle = fg2;
        ctx.fillRect(cx - FR, laneH - FR, FR * 2, FR);
      }
      if (gl.sparkCount > 0 && b.age >= 0 && b.age < 0.42) {
        for (let j = 0; j < gl.sparkCount; j++) {
          const seed = b.id * 13 + j * 3.7;
          const ang = -Math.PI / 2 + (hash(seed) - 0.5) * 1.5;
          const spd = (70 + hash(seed + 1) * 150) * u * gl.sparkSpeed;
          const a = b.age;
          const px = cx + Math.cos(ang) * spd * a;
          const py = laneH + Math.sin(ang) * spd * a + 220 * u * a * a;
          const life = 1 - a / 0.42;
          const sz = (0.8 + hash(seed + 2) * 1.6) * u * (0.4 + life) * gl.sparkSize;
          ctx.fillStyle = rgba(lighten(b.col, 0.5), gl.sparkAlpha * life);
          ctx.beginPath();
          ctx.arc(px, py, sz, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }
  ctx.restore();
  if (s.showStrikeContactBar) {
    const cb = gl.contactBar;
    if (cb > 0) {
      const lg = ctx.createLinearGradient(0, 0, W, 0);
      lg.addColorStop(0, rgba(col2.accent, 0));
      lg.addColorStop(0.1, rgba(col2.accent, 0.5 * cb));
      lg.addColorStop(0.5, rgba(col2.accentLight, 0.85 * cb));
      lg.addColorStop(0.9, rgba(col2.accent, 0.5 * cb));
      lg.addColorStop(1, rgba(col2.accent, 0));
      ctx.fillStyle = lg;
      ctx.fillRect(0, laneH - 2 * u, W, 2 * u);
      const hg = ctx.createLinearGradient(0, laneH - 14 * u, 0, laneH);
      hg.addColorStop(0, rgba(col2.accent, 0));
      hg.addColorStop(1, rgba(col2.accent, 0.12 * cb));
      ctx.fillStyle = hg;
      ctx.fillRect(0, laneH - 14 * u, W, 14 * u);
    }
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let k = L.lo; k <= L.hi; k++) {
      const ks = keyState[k];
      if (!ks) continue;
      ctx.fillStyle = rgba(lighten(ks.color, 0.4), gl.contactSegment * ks.press);
      ctx.fillRect(L.kx[k] + 1, laneH - 2.5 * u, L.kw[k] - 2, 2.5 * u);
    }
    ctx.restore();
  }
  if (railH > 0) {
    const y = laneH;
    const gr = ctx.createLinearGradient(0, y, 0, y + railH);
    gr.addColorStop(0, col2.rail);
    gr.addColorStop(0.5, darken(col2.rail, 0.2));
    gr.addColorStop(1, darken(col2.rail, 0.55));
    ctx.fillStyle = gr;
    ctx.fillRect(0, y, W, railH);
    const felt = getFelt(ctx);
    if (felt) {
      ctx.save();
      ctx.globalAlpha = clamp2(s.finish.woodDetail, 0, 2) * 0.5 + 0.5;
      ctx.fillStyle = felt;
      ctx.fillRect(0, y, W, railH);
      ctx.restore();
    }
    const tg = ctx.createLinearGradient(0, y, 0, y + 2.2 * u);
    tg.addColorStop(0, lighten(col2.railTrim, 0.55));
    tg.addColorStop(0.5, col2.railTrim);
    tg.addColorStop(1, darken(col2.railTrim, 0.32));
    ctx.fillStyle = tg;
    ctx.fillRect(0, y, W, Math.max(1.5, 2.2 * u));
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, y + railH - 1.5 * u, W, 1.5 * u);
    const bt = ctx.createLinearGradient(0, y + railH - 2.8 * u, 0, y + railH);
    bt.addColorStop(0, darken(col2.railTrim, 0.05));
    bt.addColorStop(1, darken(col2.railTrim, 0.5));
    ctx.fillStyle = bt;
    ctx.fillRect(0, y + railH - 1.2 * u, W, 1.2 * u);
    drawRailPlate(ctx, L, s);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    if (gl.railGlow > 0) {
      for (let k = L.lo; k <= L.hi; k++) {
        const ks = keyState[k];
        if (!ks) continue;
        const cx = L.kx[k] + L.kw[k] / 2;
        const R2 = L.kw[k] * 1.5 + 8 * u;
        const rg = ctx.createRadialGradient(cx, y + railH / 2, 0, cx, y + railH / 2, R2);
        rg.addColorStop(0, rgba(ks.color, gl.railGlow * ks.press));
        rg.addColorStop(1, rgba(ks.color, 0));
        ctx.fillStyle = rg;
        ctx.fillRect(cx - R2, y, R2 * 2, railH);
      }
    }
    if (s.finish.noteReflection > 0) {
      for (const n of visible) {
        if (n.start <= t) continue;
        const d = (n.start - t) / fall;
        if (d > 0.2) break;
        const ramp = 1 - d / 0.2;
        const c = noteColor(n, s.colorMode, col2);
        const wdt = L.kw[n.key] * 0.62;
        const cx = L.kx[n.key] + L.kw[n.key] / 2;
        const rg = ctx.createLinearGradient(cx - wdt / 2, 0, cx + wdt / 2, 0);
        rg.addColorStop(0, rgba(c, 0));
        rg.addColorStop(0.5, rgba(lighten(c, 0.35), 0.5 * ramp * s.finish.noteReflection));
        rg.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = rg;
        ctx.fillRect(cx - wdt / 2, y, wdt, Math.max(1.6, 2.2 * u));
      }
    }
    if (s.showIncomingKeyPreview && gl.incomingRail > 0) {
      const seen = /* @__PURE__ */ new Set();
      for (const n of incoming) {
        if (seen.has(n.key)) continue;
        seen.add(n.key);
        const ramp = (1 - (n.start - t) / s.incomingLookAheadSeconds) * gl.incomingRail;
        const c = noteColor(n, s.colorMode, col2);
        const cx = L.kx[n.key] + L.kw[n.key] / 2;
        const rad = (2 + 3.2 * clamp2(ramp, 0, 2)) * u;
        const dg = ctx.createRadialGradient(cx, y + railH / 2, 0, cx, y + railH / 2, rad * 3);
        dg.addColorStop(0, rgba(lighten(c, 0.3), 0.95 * ramp));
        dg.addColorStop(0.35, rgba(c, 0.5 * ramp));
        dg.addColorStop(1, rgba(c, 0));
        ctx.fillStyle = dg;
        ctx.fillRect(cx - rad * 3, y, rad * 6, railH);
      }
    }
    ctx.restore();
  }
  if (pressView) drawKeysPhysical(ctx, L, s, pressView, incoming, t, dpr);
  else drawKeys(ctx, L, s, keyState, incoming, t);
  if (L.frontH > 0) {
    const y = L.frontY;
    const gr = ctx.createLinearGradient(0, y, 0, y + L.frontH);
    gr.addColorStop(0, scaleHex(col2.frontBoard, 1.47));
    gr.addColorStop(0.35, col2.frontBoard);
    gr.addColorStop(1, scaleHex(col2.frontBoard, 0.52));
    ctx.fillStyle = gr;
    ctx.fillRect(0, y, W, L.frontH);
    const wood = getWood(ctx);
    if (wood) {
      ctx.save();
      ctx.globalAlpha = clamp2(s.finish.woodDetail, 0, 2);
      ctx.fillStyle = wood;
      ctx.fillRect(0, y, W, L.frontH);
      ctx.restore();
      if (s.finish.woodDetail > 0) {
        const cc = ctx.createLinearGradient(0, y, 0, y + L.frontH);
        cc.addColorStop(0, "rgba(255,236,200,0.14)");
        cc.addColorStop(0.35, "rgba(255,236,200,0.03)");
        cc.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = cc;
        ctx.fillRect(0, y, W, L.frontH);
      }
    }
    ctx.fillStyle = "rgba(255,214,160,0.28)";
    ctx.fillRect(0, y, W, Math.max(1, 1 * u));
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, y + L.frontH - 1, W, 1);
    if (gl.frontBoardGlow > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, y, W, L.frontH);
      ctx.clip();
      ctx.globalCompositeOperation = "lighter";
      for (let k = L.lo; k <= L.hi; k++) {
        const ks = keyState[k];
        if (!ks) continue;
        const cx = L.kx[k] + L.kw[k] / 2;
        const R2 = L.kw[k] * 1.6 + 10 * u;
        const fg = ctx.createRadialGradient(cx, y, 0, cx, y, R2);
        fg.addColorStop(0, rgba(ks.color, gl.frontBoardGlow * ks.press));
        fg.addColorStop(1, rgba(ks.color, 0));
        ctx.fillStyle = fg;
        ctx.fillRect(cx - R2, y, R2 * 2, L.frontH);
      }
      ctx.restore();
    }
  }
  if (L.miniH > 0) drawMinimap(ctx, L, s, keyState);
  const tp = tempoAt(song2, Math.max(0, t));
  const chord = chordAt(song2, t);
  const measure = measureAt(song2, t);
  if (s.hud.opacity > 0) {
    ctx.save();
    ctx.globalAlpha = s.hud.opacity;
    if (s.showHudMetadata) drawHud(ctx, L, s, song2, tp.bpm, pedal && s.showSustainPedal, measure);
    if (s.showChordBanner && chord) drawChordBanner(ctx, L, s, chord, t);
    ctx.restore();
  }
  applyPost(ctx, W, H, dpr, s.post);
  return { bpm: tp.bpm, chord, measure, pedal, active: activeCount };
}
function drawKeys(ctx, L, s, ks, incoming, t) {
  const { u, keysTop: top, keysH: kh, wkw } = L;
  const K = s.keys;
  const col2 = s.colors;
  const gl = s.glow;
  const gapPx = Math.max(wkw > 3 ? 1 : 0, wkw * K.gap);
  const radius = clamp2(wkw * 0.16 * K.cornerRadius, 0, Math.max(6.5 * u, 6.5 * u * K.cornerRadius));
  const wc = col2.whiteKey;
  const iv = [darken(wc, 0.13), darken(wc, 0.025), wc, darken(wc, 0.05), darken(wc, 0.17)];
  const ivory = ctx.createLinearGradient(0, top, 0, top + kh);
  ivory.addColorStop(0, iv[0]);
  ivory.addColorStop(0.06, iv[1]);
  ivory.addColorStop(0.5, iv[2]);
  ivory.addColorStop(0.88, iv[3]);
  ivory.addColorStop(1, iv[4]);
  const inc = /* @__PURE__ */ new Map();
  if (s.showIncomingKeyPreview) {
    for (const n of incoming) {
      const ramp = 1 - (n.start - t) / s.incomingLookAheadSeconds;
      if (!inc.has(n.key) || ramp > inc.get(n.key)) inc.set(n.key, ramp);
    }
  }
  const incColor = /* @__PURE__ */ new Map();
  for (const n of incoming) if (!incColor.has(n.key)) incColor.set(n.key, noteColor(n, s.colorMode, col2));
  const wash = gl.keyWash;
  const pre = gl.incomingKey;
  const F2 = s.finish;
  const spanX0 = L.kx[L.lo];
  const spanX1 = L.kx[L.hi] + L.kw[L.hi];
  if (F2.keybedDepth > 0) {
    const kb = ctx.createLinearGradient(0, top, 0, top + kh);
    kb.addColorStop(0, "#030201");
    kb.addColorStop(0.5, "#0b0705");
    kb.addColorStop(1, "#160e09");
    ctx.save();
    ctx.globalAlpha = clamp2(F2.keybedDepth, 0, 1);
    ctx.fillStyle = kb;
    ctx.fillRect(spanX0, top, spanX1 - spanX0, kh);
    ctx.restore();
  }
  const grain = F2.keyGrain > 0 ? getGrain(ctx) : null;
  for (let k = L.lo; k <= L.hi; k++) {
    if (isBlack(k + 21)) continue;
    const st = ks[k];
    const p = st ? st.press : 0;
    const x = L.kx[k] + gapPx / 2;
    const w = L.kw[k] - gapPx;
    const dy = p * 2.6 * u * K.pressDepth;
    const y = top + dy;
    const h = kh - dy - p * 1.2 * u * K.pressDepth;
    if (p > 0.01) {
      const g = ctx.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, mix(iv[0], darken(iv[0], 0.23), p));
      g.addColorStop(0.08, mix(iv[1], darken(iv[1], 0.16), p));
      g.addColorStop(0.55, mix(iv[2], darken(iv[2], 0.09), p));
      g.addColorStop(1, mix(iv[4], darken(iv[4], 0.13), p));
      ctx.fillStyle = g;
    } else ctx.fillStyle = ivory;
    rrBottom(ctx, x, y, w, h, radius);
    ctx.fill();
    if (F2.keyVariance > 0) {
      const hv = hash(k * 7.31 + 1.7);
      ctx.fillStyle = hv > 0.5 ? `rgba(255,252,238,${(hv - 0.5) * 0.06 * F2.keyVariance})` : `rgba(112,84,40,${(0.5 - hv) * 0.08 * F2.keyVariance})`;
      rrBottom(ctx, x, y, w, h, radius);
      ctx.fill();
    }
    if (grain) {
      ctx.save();
      ctx.globalAlpha = clamp2(F2.keyGrain, 0, 2) * 0.9;
      ctx.fillStyle = grain;
      rrBottom(ctx, x, y, w, h, radius);
      ctx.fill();
      ctx.restore();
    }
    if (st && p > 0.01) {
      ctx.save();
      rrBottom(ctx, x, y, w, h, radius);
      ctx.clip();
      const wg = ctx.createLinearGradient(0, y, 0, y + h);
      wg.addColorStop(0, rgba(st.color, 0.92 * p * wash));
      wg.addColorStop(0.45, rgba(st.color, 0.62 * p * wash));
      wg.addColorStop(1, rgba(st.color, 0.28 * p * wash));
      ctx.fillStyle = wg;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    } else if (inc.has(k)) {
      const r = inc.get(k);
      const c = incColor.get(k);
      ctx.save();
      rrBottom(ctx, x, y, w, h, radius);
      ctx.clip();
      const wg = ctx.createLinearGradient(0, y, 0, y + h * 0.5);
      wg.addColorStop(0, rgba(c, 0.34 * r * pre));
      wg.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = wg;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }
    if (p > 0.04) {
      const sw = Math.max(1.2, 1.7 * u);
      const sg = ctx.createLinearGradient(x, 0, x + sw, 0);
      sg.addColorStop(0, `rgba(14,6,2,${0.34 * p})`);
      sg.addColorStop(1, "rgba(14,6,2,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(x, y, sw, h - 2 * u);
      const sg2 = ctx.createLinearGradient(x + w, 0, x + w - sw, 0);
      sg2.addColorStop(0, `rgba(14,6,2,${0.34 * p})`);
      sg2.addColorStop(1, "rgba(14,6,2,0)");
      ctx.fillStyle = sg2;
      ctx.fillRect(x + w - sw, y, sw, h - 2 * u);
    }
    if (K.bevel > 0) {
      ctx.fillStyle = `rgba(255,255,255,${clamp2(0.6 * K.bevel, 0, 1)})`;
      ctx.fillRect(x + 0.5, y + 2 * u, Math.max(1, wkw * 0.045), h - 10 * u);
      ctx.fillStyle = `rgba(90,66,30,${clamp2(0.22 * K.bevel, 0, 1)})`;
      ctx.fillRect(x + w - Math.max(1, wkw * 0.06), y + 2 * u, Math.max(1, wkw * 0.06), h - 10 * u);
    }
    const lipH = Math.max(7, 12 * u);
    const lg = ctx.createLinearGradient(0, y + h - lipH, 0, y + h);
    lg.addColorStop(0, `rgba(255,255,255,${clamp2(0.7 * K.gloss, 0, 1)})`);
    lg.addColorStop(0.07, "rgba(255,255,255,0)");
    lg.addColorStop(0.16, "rgba(140,108,60,0.06)");
    lg.addColorStop(0.62, "rgba(120,92,48,0.15)");
    lg.addColorStop(1, "rgba(66,44,18,0.5)");
    ctx.save();
    rrBottom(ctx, x, y, w, h, radius);
    ctx.clip();
    ctx.fillStyle = lg;
    ctx.fillRect(x, y + h - lipH, w, lipH);
    const gl2 = ctx.createLinearGradient(x, 0, x + w, 0);
    gl2.addColorStop(0, "rgba(255,255,255,0)");
    gl2.addColorStop(0.3, `rgba(255,255,255,${clamp2(0.16 * K.gloss, 0, 1)})`);
    gl2.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gl2;
    ctx.fillRect(x, y + h - lipH - 1, w, Math.max(1.5, 2.2 * u));
    ctx.restore();
    ctx.strokeStyle = "rgba(60,40,16,0.34)";
    ctx.lineWidth = 1;
    rrBottom(ctx, x + 0.5, y, w - 1, h - 0.5, radius);
    ctx.stroke();
    if (F2.middleCMarker && (k + 21) % 12 === 0 && wkw >= 9) {
      const mid = k === 39;
      const rd = clamp2(wkw * (mid ? 0.11 : 0.07), 1.1, mid ? 3.6 * u : 2.4 * u);
      const cx = x + w / 2;
      const cy = top + kh - 29 * u - dy;
      const dg = ctx.createRadialGradient(cx - rd * 0.3, cy - rd * 0.3, 0, cx, cy, rd * 1.1);
      dg.addColorStop(0, rgba(lighten(col2.keyLabelC, 0.45), mid ? 0.95 : 0.5));
      dg.addColorStop(1, rgba(col2.keyLabelC, mid ? 0.9 : 0.4));
      ctx.fillStyle = dg;
      ctx.beginPath();
      ctx.arc(cx, cy, rd, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillRect(cx - rd, cy + rd + 0.5, rd * 2, 0.8);
    }
  }
  if (F2.lampSheen > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(spanX0, top, spanX1 - spanX0, kh);
    ctx.clip();
    ctx.globalCompositeOperation = "multiply";
    const lf = ctx.createLinearGradient(0, 0, L.W, 0);
    const la = clamp2(0.1 * F2.lampSheen, 0, 0.5);
    lf.addColorStop(0, `rgba(84,56,24,${la * 1.6})`);
    lf.addColorStop(0.3, "rgba(84,56,24,0)");
    lf.addColorStop(0.7, "rgba(84,56,24,0)");
    lf.addColorStop(1, `rgba(84,56,24,${la * 1.6})`);
    ctx.fillStyle = lf;
    ctx.fillRect(spanX0, top, spanX1 - spanX0, kh);
    const rf = ctx.createLinearGradient(0, top, 0, top + kh * 0.5);
    rf.addColorStop(0, `rgba(84,56,24,${la * 1.2})`);
    rf.addColorStop(1, "rgba(84,56,24,0)");
    ctx.fillStyle = rf;
    ctx.fillRect(spanX0, top, spanX1 - spanX0, kh * 0.5);
    ctx.restore();
  }
  {
    const sg = ctx.createLinearGradient(0, top, 0, top + 16 * u);
    sg.addColorStop(0, "rgba(20,8,6,0.55)");
    sg.addColorStop(1, "rgba(20,8,6,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(0, top, L.W, 16 * u);
  }
  const bc = col2.blackKey;
  const bcr = Math.max(2, L.bkw * 0.13);
  for (let k = L.lo; k <= L.hi; k++) {
    if (!isBlack(k + 21)) continue;
    const st = ks[k];
    const p = st ? st.press : 0;
    const x = L.kx[k];
    const w = L.kw[k];
    const dy = p * 1.4 * u * K.pressDepth;
    const y = top + dy * 0.5;
    const h = L.bkh - dy;
    const rad = Math.max(2, w * 0.13);
    if (st && p > 0.01 && gl.blackKeyHalo > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const cx = x + w / 2;
      const R2 = w * 1.7 + 8 * u;
      const hg = ctx.createRadialGradient(cx, y + h * 0.55, 0, cx, y + h * 0.55, R2);
      hg.addColorStop(0, rgba(st.color, gl.blackKeyHalo * p * 0.8));
      hg.addColorStop(1, rgba(st.color, 0));
      ctx.fillStyle = hg;
      ctx.fillRect(cx - R2, y - R2 * 0.2, R2 * 2, h + R2 * 0.6);
      ctx.restore();
    }
    ctx.save();
    ctx.shadowColor = `rgba(10,4,0,${0.55 - p * 0.3})`;
    ctx.shadowBlur = (7 - p * 3) * u;
    ctx.shadowOffsetX = (2.2 - p) * u;
    ctx.shadowOffsetY = (4 - p * 2) * u;
    ctx.fillStyle = darken(bc, 0.25);
    rrBottom(ctx, x, y, w, h, rad);
    ctx.fill();
    ctx.restore();
    const bg = ctx.createLinearGradient(x, 0, x + w, 0);
    bg.addColorStop(0, lighten(bc, 0.1));
    bg.addColorStop(0.12, bc);
    bg.addColorStop(0.88, darken(bc, 0.55));
    bg.addColorStop(1, darken(bc, 0.78));
    ctx.fillStyle = bg;
    rrBottom(ctx, x, y, w, h, rad);
    ctx.fill();
    const inset = w * 0.14;
    const fx = x + inset;
    const fw = w - inset * 2;
    const fh = h * 0.86 - p * 1.5 * u * K.pressDepth;
    const fg = ctx.createLinearGradient(fx, 0, fx + fw, 0);
    fg.addColorStop(0, lighten(bc, 0.16));
    fg.addColorStop(0.25, lighten(bc, 0.07));
    fg.addColorStop(0.7, bc);
    fg.addColorStop(1, darken(bc, 0.35));
    ctx.fillStyle = fg;
    rrBottom(ctx, fx, y, fw, fh, Math.max(1.5, fw * 0.14));
    ctx.fill();
    ctx.save();
    rrBottom(ctx, fx, y, fw, fh, Math.max(1.5, fw * 0.14));
    ctx.clip();
    const sg = ctx.createLinearGradient(0, y, 0, y + fh);
    sg.addColorStop(0, `rgba(255,255,255,${clamp2(0.2 * K.gloss, 0, 1)})`);
    sg.addColorStop(0.35, `rgba(255,255,255,${clamp2(0.05 * K.gloss, 0, 1)})`);
    sg.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(fx, y, fw, fh);
    ctx.fillStyle = `rgba(255,255,255,${clamp2(0.14 * K.gloss, 0, 1)})`;
    ctx.fillRect(fx + 0.5, y, Math.max(1, fw * 0.12), fh);
    if (st && p > 0.01) {
      const wg = ctx.createLinearGradient(0, y, 0, y + fh);
      wg.addColorStop(0, rgba(st.color, 0.95 * p * wash));
      wg.addColorStop(0.6, rgba(st.color, 0.6 * p * wash));
      wg.addColorStop(1, rgba(st.color, 0.35 * p * wash));
      ctx.fillStyle = wg;
      ctx.fillRect(fx, y, fw, fh);
    } else if (inc.has(k)) {
      const r = inc.get(k);
      const wg = ctx.createLinearGradient(0, y, 0, y + fh * 0.5);
      wg.addColorStop(0, rgba(incColor.get(k), 0.42 * r * pre));
      wg.addColorStop(1, rgba(incColor.get(k), 0));
      ctx.fillStyle = wg;
      ctx.fillRect(fx, y, fw, fh);
    }
    ctx.restore();
    const cg = ctx.createLinearGradient(0, y + fh, 0, y + h);
    cg.addColorStop(0, lighten(bc, 0.17));
    cg.addColorStop(1, darken(bc, 0.4));
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.moveTo(fx, y + fh);
    ctx.lineTo(fx + fw, y + fh);
    ctx.lineTo(x + w - w * 0.04, y + h - bcr);
    ctx.lineTo(x + w * 0.04, y + h - bcr);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.lineWidth = 1;
    rrBottom(ctx, x + 0.5, y, w - 1, h - 0.5, rad);
    ctx.stroke();
  }
  drawCheeks(ctx, L, s, spanX0, spanX1);
  if (s.keyLabelMode !== "none" && wkw >= 10) {
    const fs = Math.round(clamp2(wkw * 0.4, 8, 14 * u) * K.labelScale);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    for (let k = L.lo; k <= L.hi; k++) {
      const midi = k + 21;
      const black = isBlack(midi);
      const pc = midi % 12;
      const oct = Math.floor(midi / 12) - 1;
      let txt2 = "";
      switch (s.keyLabelMode) {
        case "onlyC":
          if (pc === 0) txt2 = `C${oct}`;
          else if (k === 0) txt2 = "A0";
          break;
        case "allWhite":
          if (!black) txt2 = noteName(midi, s.useFlats, false) + (pc === 0 ? String(oct) : "");
          break;
        case "all88":
          txt2 = noteName(midi, s.useFlats, false) + (pc === 0 || k === 0 ? String(oct) : "");
          break;
        case "solfege":
          if (!black) txt2 = SOLFEGE[pc];
          break;
      }
      if (!txt2) continue;
      if (black) {
        if (L.kw[k] < 9) continue;
        ctx.font = `600 ${Math.max(7, fs - 3)}px ${SANS}`;
        ctx.fillStyle = rgba(col2.keyLabelBlack, 0.8);
        ctx.fillText(txt2, L.kx[k] + L.kw[k] / 2, top + L.bkh - 9 * u);
      } else {
        const st = ks[k];
        const isC = pc === 0;
        ctx.font = `${isC ? 700 : 600} ${fs}px ${SANS}`;
        ctx.fillStyle = st && st.press > 0.5 ? luminance(st.color) > 0.55 ? "rgba(30,16,4,0.9)" : "#fff" : isC ? col2.keyLabelC : col2.keyLabel;
        ctx.fillText(txt2, L.kx[k] + L.kw[k] / 2, top + kh - 9 * u - (st ? st.press * 2 * u * K.pressDepth : 0));
      }
    }
  }
}
function drawCheeks(ctx, L, s, x0, x1) {
  const amt = s.finish.cheekBlocks;
  if (amt <= 0) return;
  const { u, keysTop: top, keysH: kh, W } = L;
  const wood = s.colors.frontBoard;
  const block = (xa, xb, inner) => {
    if (xb - xa < 2) return;
    const g = ctx.createLinearGradient(xa, 0, xb, 0);
    const a = inner === "right" ? [0.95, 1.5] : [1.5, 0.95];
    g.addColorStop(0, scaleHex(wood, a[0] * 0.8));
    g.addColorStop(1, scaleHex(wood, a[1] * 0.8));
    ctx.fillStyle = g;
    ctx.fillRect(xa, top - 1, xb - xa, kh + 1);
    const wp = getWoodV(ctx);
    if (wp) {
      ctx.save();
      ctx.globalAlpha = clamp2(0.9 * s.finish.woodDetail, 0, 1.6);
      ctx.fillStyle = wp;
      ctx.fillRect(xa, top - 1, xb - xa, kh + 1);
      ctx.restore();
    }
    if (s.finish.woodDetail > 0) {
      const cap = Math.max(3, 7 * u);
      const eg = ctx.createLinearGradient(0, top + kh - cap, 0, top + kh);
      eg.addColorStop(0, "rgba(255,226,170,0.0)");
      eg.addColorStop(0.2, "rgba(255,226,170,0.16)");
      eg.addColorStop(1, "rgba(30,14,2,0.42)");
      ctx.fillStyle = eg;
      ctx.fillRect(xa, top + kh - cap, xb - xa, cap);
      for (let r = 0; r < Math.min(6, (xb - xa) / 3); r++) {
        ctx.fillStyle = `rgba(40,20,4,${0.07 + 0.05 * ihash(r * 17 + 3)})`;
        ctx.fillRect(xa, top + kh - cap + r * cap / 6, xb - xa, Math.max(0.6, 0.7 * u));
      }
      const cs = ctx.createLinearGradient(xa, 0, xb, 0);
      const sx = inner === "right" ? 0.62 : 0.38;
      cs.addColorStop(0, "rgba(255,240,210,0)");
      cs.addColorStop(sx, `rgba(255,240,210,${0.17 * s.finish.woodDetail})`);
      cs.addColorStop(1, "rgba(255,240,210,0)");
      ctx.fillStyle = cs;
      ctx.fillRect(xa, top, xb - xa, kh);
    }
    const ex = inner === "right" ? xb - 1.5 * u : xa;
    ctx.fillStyle = "rgba(255,214,160,0.3)";
    ctx.fillRect(ex, top, Math.max(1, 1.4 * u), kh);
    const sg = ctx.createLinearGradient(0, top, 0, top + kh);
    sg.addColorStop(0, "rgba(0,0,0,0.55)");
    sg.addColorStop(0.25, "rgba(0,0,0,0.05)");
    sg.addColorStop(1, "rgba(0,0,0,0.3)");
    ctx.fillStyle = sg;
    ctx.fillRect(xa, top, xb - xa, kh);
  };
  block(0, x0, "right");
  block(x1, W, "left");
  const sw = Math.min(14 * u, (x1 - x0) * 0.05);
  const gl = ctx.createLinearGradient(x0, 0, x0 + sw, 0);
  gl.addColorStop(0, `rgba(8,3,0,${clamp2(0.3 * amt, 0, 0.8)})`);
  gl.addColorStop(1, "rgba(8,3,0,0)");
  ctx.fillStyle = gl;
  ctx.fillRect(x0, top, sw, kh);
  const gr = ctx.createLinearGradient(x1, 0, x1 - sw, 0);
  gr.addColorStop(0, `rgba(8,3,0,${clamp2(0.3 * amt, 0, 0.8)})`);
  gr.addColorStop(1, "rgba(8,3,0,0)");
  ctx.fillStyle = gr;
  ctx.fillRect(x1 - sw, top, sw, kh);
}
function drawRailPlate(ctx, L, s) {
  const { u, railH, W } = L;
  const y = L.laneH;
  const trim = s.colors.railTrim;
  if (railH >= 10) {
    const r = clamp2(railH * 0.17, 1.6, 3.4 * u);
    for (const sx of [r * 3.4 + 4 * u, W - r * 3.4 - 4 * u]) {
      const cy = y + railH * 0.56;
      const bd = s.finish.brassDetail;
      if (bd > 0) {
        ctx.fillStyle = `rgba(8,2,0,${clamp2(0.5 * bd, 0, 1)})`;
        ctx.beginPath();
        ctx.ellipse(sx + r * 0.32, cy + r * 0.42, r * 1.12, r * 1.05, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(20,8,0,${clamp2(0.6 * bd, 0, 1)})`;
        ctx.beginPath();
        ctx.arc(sx, cy, r * 1.22, 0, Math.PI * 2);
        ctx.fill();
      }
      const sg = ctx.createRadialGradient(sx - r * 0.35, cy - r * 0.35, 0, sx, cy, r * 1.2);
      sg.addColorStop(0, lighten(trim, 0.6));
      sg.addColorStop(0.6, trim);
      sg.addColorStop(1, darken(trim, 0.6));
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(sx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(20,8,0,0.65)";
      ctx.lineWidth = Math.max(0.8, r * 0.28);
      ctx.beginPath();
      ctx.moveTo(sx - r * 0.7, cy + r * 0.25);
      ctx.lineTo(sx + r * 0.7, cy - r * 0.25);
      ctx.stroke();
      if (bd > 0) {
        ctx.strokeStyle = rgba(lighten(trim, 0.7), clamp2(0.55 * bd, 0, 1));
        ctx.lineWidth = Math.max(0.5, r * 0.12);
        ctx.beginPath();
        ctx.moveTo(sx - r * 0.7, cy + r * 0.25 + r * 0.26);
        ctx.lineTo(sx + r * 0.7, cy - r * 0.25 + r * 0.26);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,252,235,${clamp2(0.8 * bd, 0, 1)})`;
        ctx.beginPath();
        ctx.arc(sx - r * 0.42, cy - r * 0.5, Math.max(0.5, r * 0.14), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const text = (s.finish.brandText || "").trim();
  if (!s.finish.brandPlate || !text || railH < 11 || W < 560) return;
  const fs = clamp2(railH * 0.44, 6.5, 13 * u);
  ctx.save();
  ctx.font = `600 ${fs.toFixed(2)}px ${SANS}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  setSpacing(ctx, fs * 0.42);
  const label = text.toUpperCase();
  const tw = ctx.measureText(label).width;
  const cx = W / 2 + fs * 0.21;
  const by = y + railH * 0.5 + fs * 0.36;
  const hl = Math.min(W * 0.09, 120 * u);
  for (const dir of [-1, 1]) {
    const x0 = cx - fs * 0.21 + dir * (tw / 2 + fs * 1.1);
    const lg = ctx.createLinearGradient(x0, 0, x0 + dir * hl, 0);
    lg.addColorStop(0, rgba(trim, 0.5));
    lg.addColorStop(1, rgba(trim, 0));
    ctx.fillStyle = lg;
    ctx.fillRect(Math.min(x0, x0 + dir * hl), by - fs * 0.34, hl, 1);
  }
  if (s.finish.brassDetail > 0) {
    const pw = tw + fs * 3.2;
    const ph = railH * 0.72;
    const px = cx - fs * 0.21 - pw / 2;
    const py = y + railH * 0.5 - ph / 2;
    const bdp = s.finish.brassDetail;
    const pg = ctx.createLinearGradient(0, py, 0, py + ph);
    pg.addColorStop(0, `rgba(10,3,0,${0.5 * bdp})`);
    pg.addColorStop(0.35, `rgba(10,3,0,${0.12 * bdp})`);
    pg.addColorStop(1, `rgba(255,226,160,${0.1 * bdp})`);
    ctx.fillStyle = pg;
    rr(ctx, px, py, pw, ph, ph * 0.3);
    ctx.fill();
    ctx.strokeStyle = rgba(lighten(trim, 0.5), 0.35 * Math.min(1, bdp));
    ctx.lineWidth = 1;
    rr(ctx, px + 0.5, py + 0.5, pw - 1, ph - 1, ph * 0.3);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(10,2,0,0.65)";
  ctx.fillText(label, cx, by + Math.max(0.8, 0.9 * u));
  ctx.fillStyle = rgba(lighten(trim, 0.7), 0.4);
  ctx.fillText(label, cx, by - 0.6);
  const tg = ctx.createLinearGradient(0, by - fs, 0, by);
  tg.addColorStop(0, rgba(lighten(trim, 0.45), 0.9));
  tg.addColorStop(1, rgba(darken(trim, 0.15), 0.82));
  ctx.fillStyle = tg;
  ctx.fillText(label, cx, by);
  setSpacing(ctx, 0);
  ctx.restore();
}
function drawMinimap(ctx, L, s, ks) {
  const { u, W, miniY: y, miniH: h } = L;
  const col2 = s.colors;
  const bg = ctx.createLinearGradient(0, y, 0, y + h);
  bg.addColorStop(0, scaleHex(col2.hudPanel, 0.62));
  bg.addColorStop(1, scaleHex(col2.hudPanel, 0.3));
  ctx.fillStyle = bg;
  ctx.fillRect(0, y, W, h);
  ctx.fillStyle = rgba(col2.accentLight, 0.1);
  ctx.fillRect(0, y, W, 1);
  const pad = 18 * u;
  const mw = W - pad * 2;
  const wk = mw / 52;
  const kTop = y + 7 * u;
  const kH = h - 21 * u;
  const bH = kH * 0.62;
  const xs = (k) => pad + (isBlack(k + 21) ? (WHITE_IDX[k] + 1) * wk - wk * 0.3 : WHITE_IDX[k] * wk);
  const wIn = darken(col2.whiteKey, 0.16);
  const wOut = darken(col2.whiteKey, 0.55);
  const wHit = darken(col2.whiteKey, 0.13);
  const bIn = lighten(col2.blackKey, 0.04);
  const bOut = col2.blackKey;
  const bHit = lighten(col2.blackKey, 0.1);
  const x1 = pad + WHITE_IDX[L.lo] * wk;
  const x2 = pad + (WHITE_IDX[L.hi] + 1) * wk;
  for (let k = 0; k < 88; k++) {
    if (isBlack(k + 21)) continue;
    const st = ks[k];
    const inRange = k >= L.lo && k <= L.hi;
    ctx.fillStyle = st && st.press > 0.05 ? mix(wHit, st.color, 0.4 + 0.6 * st.press) : inRange ? wIn : wOut;
    rr(ctx, xs(k) + 0.4, kTop, wk - 0.8, kH, Math.min(2, wk * 0.2));
    ctx.fill();
  }
  for (let k = 0; k < 88; k++) {
    if (!isBlack(k + 21)) continue;
    const st = ks[k];
    const inRange = k >= L.lo && k <= L.hi;
    ctx.fillStyle = st && st.press > 0.05 ? mix(bHit, st.color, 0.3 + 0.7 * st.press) : inRange ? bIn : bOut;
    rr(ctx, xs(k), kTop, wk * 0.6, bH, Math.min(1.6, wk * 0.15));
    ctx.fill();
  }
  if (L.lo > 0 || L.hi < 87) {
    ctx.fillStyle = "rgba(8,6,4,0.45)";
    ctx.fillRect(pad, kTop, x1 - pad, kH);
    ctx.fillRect(x2, kTop, pad + mw - x2, kH);
  }
  ctx.strokeStyle = rgba(col2.accent, 0.9);
  ctx.lineWidth = Math.max(1, 1.4 * u);
  rr(ctx, x1, kTop - 2 * u, x2 - x1, kH + 4 * u, 3 * u);
  ctx.stroke();
  ctx.font = `600 ${Math.round(8.5 * u)}px ${SANS}`;
  ctx.textAlign = "center";
  ctx.fillStyle = rgba(col2.hudSub, 0.55);
  for (let k = 3; k < 88; k += 12) {
    const oct = Math.floor((k + 21) / 12) - 1;
    ctx.fillText(`C${oct}`, xs(k) + wk / 2, y + h - 5 * u);
  }
}
function glass(ctx, s, x, y, w, h, r, minAlpha = 0) {
  const col2 = s.colors;
  const a = Math.max(s.hud.panelAlpha, minAlpha);
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, rgba(col2.hudPanel, a));
  g.addColorStop(1, rgba(scaleHex(col2.hudPanel, 0.47), a));
  ctx.fillStyle = g;
  rr(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = rgba(col2.accentLight, 0.16);
  ctx.lineWidth = 1;
  rr(ctx, x + 0.5, y + 0.5, w - 1, h - 1, r);
  ctx.stroke();
  ctx.strokeStyle = rgba(col2.hudText, 0.06);
  rr(ctx, x + 1.5, y + 1.5, w - 3, h - 3, Math.max(0, r - 1));
  ctx.stroke();
}
function drawHud(ctx, L, s, song2, bpm, pedal, measure) {
  const u = L.u * s.hud.scale;
  const col2 = s.colors;
  const x = 16 * u;
  const y = 14 * u;
  const pad = 14 * u;
  const maxW = Math.min(L.W * 0.46, 560 * u);
  const title = song2.name.split(" \u2014 ")[0];
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 ${Math.round(20 * u)}px ${SERIF}`;
  const tShown = fitText(ctx, title, maxW - pad * 2);
  const tW = ctx.measureText(tShown).width;
  const sub = [song2.artist, song2.piece].filter(Boolean).join("  \xB7  ");
  ctx.font = `600 ${Math.round(9.5 * u)}px ${SANS}`;
  setSpacing(ctx, 1.4 * u);
  const subShown = sub ? fitText(ctx, sub.toUpperCase(), maxW - pad * 2) : "";
  const sW = ctx.measureText(subShown).width;
  setSpacing(ctx, 0);
  const chips = [{ text: `\u2669 = ${Math.round(bpm)}`, accent: true }];
  if (measure > 0) chips.push({ text: `m. ${measure}` });
  if (s.analysis.showKeyChip && song2.key.confidence >= 0.3) chips.push({ text: song2.key.name });
  if (pedal) chips.push({ text: "Ped." });
  ctx.font = `600 ${Math.round(11 * u)}px ${SANS}`;
  const chipH = 20 * u;
  const chipGap = 6 * u;
  const chipWs = chips.map((c) => ctx.measureText(c.text).width + 16 * u);
  const chipsW = chipWs.reduce((a, b) => a + b, 0) + chipGap * (chips.length - 1);
  const contentW = Math.max(tW, sW, chipsW);
  const boxW = contentW + pad * 2 + 6 * u;
  const boxH = pad * 2 + 22 * u + (subShown ? 17 * u : 0) + chipH + 8 * u;
  glass(ctx, s, x, y, boxW, boxH, 12 * u);
  const ag = ctx.createLinearGradient(0, y, 0, y + boxH);
  ag.addColorStop(0, lighten(col2.accent, 0.22));
  ag.addColorStop(1, darken(col2.accent, 0.28));
  ctx.fillStyle = ag;
  rr(ctx, x + 5 * u, y + 14 * u, 2.5 * u, boxH - 28 * u, 1.5 * u);
  ctx.fill();
  let cy = y + pad + 17 * u;
  const cx = x + pad + 4 * u;
  ctx.font = `700 ${Math.round(20 * u)}px ${SERIF}`;
  ctx.fillStyle = col2.hudText;
  ctx.fillText(tShown, cx, cy);
  if (subShown) {
    cy += 18 * u;
    ctx.font = `600 ${Math.round(9.5 * u)}px ${SANS}`;
    setSpacing(ctx, 1.4 * u);
    ctx.fillStyle = rgba(col2.hudSub, 0.85);
    ctx.fillText(subShown, cx, cy);
    setSpacing(ctx, 0);
  }
  cy += 10 * u;
  let chipX = cx;
  const accentText = lighten(col2.accent, 0.4);
  const plainText = mix(col2.hudText, col2.hudPanel, 0.2);
  chips.forEach((c, i) => {
    const w = chipWs[i];
    ctx.fillStyle = c.accent ? rgba(col2.accent, 0.16) : rgba(col2.hudText, 0.07);
    rr(ctx, chipX, cy, w, chipH, chipH / 2);
    ctx.fill();
    ctx.strokeStyle = c.accent ? rgba(col2.accent, 0.5) : rgba(col2.hudText, 0.14);
    ctx.lineWidth = 1;
    rr(ctx, chipX + 0.5, cy + 0.5, w - 1, chipH - 1, chipH / 2);
    ctx.stroke();
    ctx.font = `600 ${Math.round(11 * u)}px ${SANS}`;
    ctx.fillStyle = c.accent ? accentText : plainText;
    ctx.textAlign = "center";
    ctx.fillText(c.text, chipX + w / 2, cy + chipH / 2 + 4 * u);
    ctx.textAlign = "left";
    chipX += w + chipGap;
  });
}
function drawChordBanner(ctx, L, s, chord, t) {
  const u = L.u * s.hud.chordScale;
  const col2 = s.colors;
  const sinceStart = t - chord.start;
  const fadeIn = chord.follows ? 0.5 + 0.5 * clamp2(sinceStart / 0.12, 0, 1) : clamp2(sinceStart / 0.14, 0, 1);
  const fadeOut = chord.chained ? 1 : clamp2((chord.shownEnd - t) / 0.24, 0, 1);
  const a = Math.min(fadeIn, fadeOut);
  if (a <= 0.01) return;
  const settle = chord.follows ? (1 - clamp2(sinceStart / 0.16, 0, 1)) * 5 * u : (1 - a) * -6 * u;
  const rootPx = Math.round(34 * u);
  const qualPx = Math.round(19 * u);
  const bassPx = Math.round(26 * u);
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.font = `italic 700 ${rootPx}px ${SERIF}`;
  const rootW = ctx.measureText(chord.root).width;
  ctx.font = `italic 600 ${qualPx}px ${SERIF}`;
  const qualW = chord.quality ? ctx.measureText(chord.quality).width + 1.5 * u : 0;
  const bassText = chord.bass ? "/" + chord.bass : "";
  ctx.font = `italic 600 ${bassPx}px ${SERIF}`;
  const bassW = bassText ? ctx.measureText(bassText).width + 1 * u : 0;
  const symW = rootW + qualW + bassW;
  const showTones = s.analysis.showChordTones && chord.tones.length > 0;
  const hasLine2 = !!chord.roman || showTones;
  ctx.font = `600 ${Math.round(11 * u)}px ${SANS}`;
  setSpacing(ctx, 0.8 * u);
  const romanW = chord.roman ? ctx.measureText(chord.roman).width : 0;
  setSpacing(ctx, 0);
  ctx.font = `500 ${Math.round(10.5 * u)}px ${SANS}`;
  const toneGap = 7 * u;
  const toneWs = showTones ? chord.tones.map((n) => ctx.measureText(n).width) : [];
  const tonesW = toneWs.reduce((p, c) => p + c, 0) + Math.max(0, toneWs.length - 1) * toneGap;
  const divW = chord.roman && showTones ? 16 * u : 0;
  const line2W = romanW + divW + tonesW;
  const w = Math.max(symW, line2W) + 48 * u;
  const h = hasLine2 ? 78 * u : 58 * u;
  const x = L.W / 2 - w / 2;
  const y = 14 * L.u + s.hud.chordOffsetY + settle;
  glass(ctx, s, x, y, w, h, 14 * u, 0.95);
  const hg = ctx.createLinearGradient(x, 0, x + w, 0);
  hg.addColorStop(0, rgba(col2.accentLight, 0));
  hg.addColorStop(0.5, rgba(col2.accentLight, 0.5));
  hg.addColorStop(1, rgba(col2.accentLight, 0));
  ctx.fillStyle = hg;
  ctx.fillRect(x + 16 * u, y + 1, w - 32 * u, 1);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  let px = L.W / 2 - symW / 2;
  const base = y + 39 * u;
  ctx.fillStyle = col2.chordText;
  ctx.font = `italic 700 ${rootPx}px ${SERIF}`;
  ctx.fillText(chord.root, px, base);
  px += rootW;
  if (chord.quality) {
    ctx.font = `italic 600 ${qualPx}px ${SERIF}`;
    ctx.fillStyle = rgba(col2.chordText, 0.92);
    ctx.fillText(chord.quality, px + 1.5 * u, base - 12 * u);
    px += qualW;
  }
  if (bassText) {
    ctx.font = `italic 600 ${bassPx}px ${SERIF}`;
    ctx.fillStyle = rgba(col2.chordText, 0.78);
    ctx.fillText(bassText, px, base);
  }
  if (hasLine2) {
    const ly = y + 62 * u;
    let lx = L.W / 2 - line2W / 2;
    if (chord.roman) {
      ctx.font = `600 ${Math.round(11 * u)}px ${SANS}`;
      setSpacing(ctx, 0.8 * u);
      ctx.fillStyle = col2.chordRoman;
      ctx.fillText(chord.roman, lx, ly);
      setSpacing(ctx, 0);
      lx += romanW;
      if (showTones) {
        ctx.fillStyle = rgba(col2.hudText, 0.22);
        ctx.fillRect(lx + divW / 2, ly - 9 * u, 1, 11 * u);
        lx += divW;
      }
    }
    if (showTones) {
      const bassName = chord.bass ?? chord.root;
      ctx.font = `500 ${Math.round(10.5 * u)}px ${SANS}`;
      chord.tones.forEach((n, i) => {
        const isBass = n === bassName;
        ctx.fillStyle = isBass ? col2.chordText : rgba(col2.hudSub, 0.78);
        ctx.fillText(n, lx, ly);
        if (isBass) {
          ctx.fillStyle = rgba(col2.chordRoman, 0.8);
          ctx.fillRect(lx, ly + 2.5 * u, toneWs[i], Math.max(1, 1.1 * u));
        }
        lx += toneWs[i] + toneGap;
      });
    }
  }
  ctx.restore();
}
var scratch = /* @__PURE__ */ new Map();
function getScratch(w, h) {
  const k = `${w}x${h}`;
  let c = scratch.get(k);
  if (!c) {
    if (scratch.size >= 2) scratch.clear();
    c = canvasFactory(w, h);
    scratch.set(k, c);
  }
  return c;
}
function applyPost(ctx, W, H, dpr, p) {
  const needsFilter = p.brightness !== 1 || p.contrast !== 1 || p.saturation !== 1 || p.hue !== 0 || p.grayscale > 0 || p.sepia > 0;
  const needsBloom = p.bloom > 0;
  if (!needsFilter && !needsBloom && p.vignette <= 0) return;
  const pw = Math.round(W * dpr);
  const ph = Math.round(H * dpr);
  const canFilter = typeof ctx.filter === "string";
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if ((needsFilter || needsBloom) && (canFilter || needsFilter)) {
    const tmp = getScratch(pw, ph);
    const tg = tmp.getContext("2d");
    tg.setTransform(1, 0, 0, 1, 0, 0);
    tg.globalCompositeOperation = "copy";
    tg.globalAlpha = 1;
    tg.drawImage(ctx.canvas, 0, 0);
    if (needsFilter) {
      if (canFilter) {
        const f = [];
        if (p.brightness !== 1) f.push(`brightness(${p.brightness})`);
        if (p.contrast !== 1) f.push(`contrast(${p.contrast})`);
        if (p.saturation !== 1) f.push(`saturate(${p.saturation})`);
        if (p.hue !== 0) f.push(`hue-rotate(${p.hue}deg)`);
        if (p.grayscale > 0) f.push(`grayscale(${p.grayscale})`);
        if (p.sepia > 0) f.push(`sepia(${p.sepia})`);
        const c2 = ctx;
        c2.filter = f.join(" ");
        ctx.globalCompositeOperation = "copy";
        ctx.drawImage(tmp, 0, 0);
        c2.filter = "none";
      } else {
        pixelGrade(ctx, pw, ph, p);
      }
    }
    if (needsBloom && canFilter) {
      const c2 = ctx;
      c2.filter = `blur(${Math.max(1, p.bloomRadius * dpr)}px) brightness(1.25) contrast(1.15)`;
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = clamp2(p.bloom, 0, 1.5);
      ctx.drawImage(tmp, 0, 0);
      c2.filter = "none";
    }
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  if (p.vignette > 0) {
    const r = Math.hypot(pw, ph) / 2;
    const vg = ctx.createRadialGradient(pw / 2, ph / 2, r * 0.35, pw / 2, ph / 2, r);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, `rgba(0,0,0,${clamp2(p.vignette, 0, 1)})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, pw, ph);
  }
  ctx.restore();
}
function pixelGrade(ctx, w, h, p) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const lut = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++) lut[i] = ((i / 255 - 0.5) * p.contrast + 0.5) * 255 * p.brightness;
  for (let i = 0; i < d.length; i += 4) {
    let r = lut[d[i]];
    let g = lut[d[i + 1]];
    let b = lut[d[i + 2]];
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const sat = p.saturation * (1 - p.grayscale);
    r = l + (r - l) * sat;
    g = l + (g - l) * sat;
    b = l + (b - l) * sat;
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
  }
  ctx.putImageData(img, 0, 0);
}
function newCanvas(w, h) {
  return canvasFactory(w, h);
}

// src/engine/settings.ts
var APP_NAME = "Fahh MIDI";
var SETTINGS_FORMAT = "fahh-midi-settings";
var SETTINGS_VERSION = 1;
var G = {
  theme: "Theme \xB7 Interface colours",
  keyGeo: "Keyboard \xB7 Length, width & geometry",
  keyLook: "Keyboard \xB7 Colours & finish",
  noteShape: "Falling notes \xB7 Shape & surface",
  noteCol: "Falling notes \xB7 Colours",
  glow: "Glow & light intensity",
  bg: "Background, lanes & atmosphere",
  lines: "Lines, guides & numerals",
  hud: "HUD, chord banner & labels",
  analysis: "Harmony \xB7 Chord & key analysis",
  finish: "Keyboard & lane \xB7 Fine detail",
  layout: "Layout & proportions",
  post: "Post-processing \xB7 Contrast & grading",
  features: "Layers & features",
  playback: "Playback, timing & practice",
  audio: "Audio & soundfont",
  video: "Video export & sync"
};
var GROUP_ORDER = Object.values(G);
var F = [];
var num = (path, label, def2, min, max, step, group, hint, unit) => F.push({ path, type: "number", label, def: def2, min, max, step, group, hint, unit });
var bool = (path, label, def2, group, hint) => F.push({ path, type: "boolean", label, def: def2, group, hint });
var col = (path, label, def2, group, hint) => F.push({ path, type: "color", label, def: def2, group, hint });
var opt = (path, label, def2, options, group, hint) => F.push({ path, type: "enum", label, def: def2, options, group, hint });
var txt = (path, label, def2, group, hint) => F.push({ path, type: "text", label, def: def2, group, hint });
var R = "render.";
var C = "render.colors.";
col("ui.accent", "Accent colour (metal / highlights)", "#e2b256", G.theme, "Buttons, sliders, active states, glows across the whole interface");
col("ui.accent2", "Secondary accent", "#59c4a8", G.theme, "Left-hand pigment in the UI, success states, video readouts");
col("ui.surface", "Surface / panel base", "#1b1511", G.theme, "The dark base every panel, bar and card is derived from");
col("ui.text", "Text colour", "#f3e8d0", G.theme, "Primary text; all secondary text tones derive from it");
num("ui.glassBlur", "Panel glass blur", 22, 0, 60, 1, G.theme, "Backdrop blur behind floating panels", "px");
num(R + "keys.heightRatio", "Key length (keyboard height)", 0.205, 0.08, 0.6, 5e-3, G.keyGeo, "Fraction of the stage height taken by the keys", "\xD7H");
num(R + "keys.widthScale", "Key width", 1, 0.4, 3, 0.01, G.keyGeo, "1 = all keys fit the screen. Above 1 the keyboard overflows (use Pan)", "\xD7");
num(R + "keys.panX", "Keyboard pan", 0, -1, 1, 0.01, G.keyGeo, "Slides an over-wide keyboard left / right");
num(R + "keys.blackWidthRatio", "Black key width", 0.6, 0.3, 0.9, 0.01, G.keyGeo, "Relative to a white key", "\xD7");
num(R + "keys.blackHeightRatio", "Black key length", 0.6643, 0.3, 0.95, 5e-3, G.keyGeo, "Relative to a white key", "\xD7");
num(R + "keys.gap", "Gap between white keys", 0.045, 0, 0.3, 5e-3, G.keyGeo, "Fraction of key width", "\xD7");
num(R + "keys.cornerRadius", "Key corner rounding", 1, 0, 4, 0.05, G.keyGeo, void 0, "\xD7");
num(R + "keys.pressDepth", "Key press depth", 1, 0, 4, 0.05, G.keyGeo, "How far a key sinks when struck", "\xD7");
num(R + "keys.gloss", "Key gloss / sheen", 1, 0, 3, 0.05, G.keyGeo, "Black key lacquer shine and white key lip highlight", "\xD7");
num(R + "keys.bevel", "White key side bevels", 1, 0, 3, 0.05, G.keyGeo, void 0, "\xD7");
num(R + "keys.labelScale", "Key label size", 1, 0.4, 3, 0.05, G.keyGeo, void 0, "\xD7");
bool(R + "acousticBlackKeyOffsets", "Concert-grand black key offsets", true, G.keyGeo, "Authentic asymmetric black-key placement");
bool(R + "autoZoomRange", "Fit keyboard to the piece's range", false, G.keyGeo, "Zooms to the notes actually used instead of all 88 keys");
col(C + "whiteKey", "White key ivory", "#f8f2e4", G.keyLook);
col(C + "blackKey", "Black key lacquer", "#16120f", G.keyLook);
col(C + "keyLabel", "Key label", "#8b7b5c", G.keyLook);
col(C + "keyLabelC", "Key label \xB7 C notes", "#8b5a1e", G.keyLook);
col(C + "keyLabelBlack", "Key label \xB7 black keys", "#ebe0c8", G.keyLook);
col(C + "rail", "Damper rail (baize)", "#6e2535", G.keyLook, "The felt strip above the keys");
col(C + "railTrim", "Rail brass trim", "#d4a24c", G.keyLook);
col(C + "frontBoard", "Front board wood", "#3d2614", G.keyLook, "The key slip under the keys");
num(R + "notes.widthWhite", "Note width \xB7 white keys", 0.88, 0.2, 1, 0.01, G.noteShape, "Relative to the key lane", "\xD7");
num(R + "notes.widthBlack", "Note width \xB7 black keys", 0.84, 0.2, 1, 0.01, G.noteShape, void 0, "\xD7");
num(R + "notes.cornerRadius", "Note corner rounding", 0.22, 0, 0.5, 0.01, G.noteShape);
num(R + "notes.minHeight", "Minimum note height", 4, 1, 40, 0.5, G.noteShape, "Keeps staccato notes visible", "px");
num(R + "notes.gap", "Gap above strike line", 1.6, 0, 12, 0.1, G.noteShape, void 0, "px");
num(R + "notes.opacity", "Note opacity", 1, 0.05, 1, 0.01, G.noteShape);
num(R + "notes.velocityDim", "Velocity dimming", 0.16, 0, 1, 0.01, G.noteShape, "How much soft notes darken");
num(R + "notes.blackDarken", "Black-key note darkening", 0.16, 0, 0.8, 0.01, G.noteShape);
num(R + "notes.topLight", "Top-to-bottom light gradient", 1, 0, 3, 0.05, G.noteShape, void 0, "\xD7");
num(R + "notes.shine", "Side sheen", 1, 0, 3, 0.05, G.noteShape, void 0, "\xD7");
num(R + "notes.outline", "Bright rim light", 1, 0, 3, 0.05, G.noteShape, void 0, "\xD7");
num(R + "notes.edgeShadow", "Dark outer edge", 1, 0, 3, 0.05, G.noteShape, void 0, "\xD7");
num(R + "notes.strikeFlare", "Strike-edge flare", 1, 0, 3, 0.05, G.noteShape, void 0, "\xD7");
num(R + "notes.labelScale", "Label size on notes", 1, 0.4, 3, 0.05, G.noteShape, void 0, "\xD7");
opt(R + "colorMode", "Colour mode", "hand", [
  { value: "hand", label: "By hand / voice" },
  { value: "finger", label: "By finger 1\u20135" },
  { value: "pitch", label: "By pitch class" },
  { value: "colorblind", label: "Colour-blind safe" },
  { value: "monochrome", label: "Monochrome" }
], G.noteCol, "Which palette below is applied to the falling notes");
col(C + "rightHand", "Right hand", "#f2b84b", G.noteCol);
col(C + "leftHand", "Left hand", "#4fc4a8", G.noteCol);
["#ea695c", "#f0a24a", "#ebd46a", "#5bba8b", "#5b94d9"].forEach((c, i) => col(`${C}finger.${i}`, `Finger ${i + 1}`, c, G.noteCol));
["C", "C\u266F", "D", "D\u266F", "E", "F", "F\u266F", "G", "G\u266F", "A", "A\u266F", "B"].forEach(
  (n, i) => col(`${C}pitch.${i}`, `Pitch class ${n}`, ["#e6604f", "#ee8046", "#f1a340", "#efc94b", "#d6dd58", "#90d05e", "#4fc18a", "#40bdb8", "#4a9cdc", "#6c80e1", "#9b6fe1", "#cd67c6"][i], G.noteCol)
);
col(C + "colorblindRight", "Colour-blind \xB7 right hand", "#e69f00", G.noteCol);
col(C + "colorblindLeft", "Colour-blind \xB7 left hand", "#56b4e9", G.noteCol);
col(C + "monoRight", "Monochrome \xB7 right hand", "#f1e8d4", G.noteCol);
col(C + "monoLeft", "Monochrome \xB7 left hand", "#a99e88", G.noteCol);
num(R + "glow.noteActiveBlur", "Sounding-note glow radius", 20, 0, 90, 1, G.glow, void 0, "px");
num(R + "glow.noteActiveAlpha", "Sounding-note glow intensity", 0.75, 0, 1, 0.01, G.glow);
num(R + "glow.noteIdleAlpha", "Resting-note halo intensity", 0.1, 0, 0.8, 0.01, G.glow);
num(R + "glow.noteIdleSpread", "Resting-note halo size", 2, 0, 14, 0.5, G.glow, void 0, "px");
num(R + "glow.beamAlpha", "Light-beam intensity", 0.34, 0, 1, 0.01, G.glow, "Vertical beam rising from struck keys");
num(R + "glow.beamHeight", "Light-beam height", 0.3, 0, 1, 0.01, G.glow, "Fraction of the lane height");
num(R + "glow.bloomAlpha", "Strike bloom intensity", 0.62, 0, 1.5, 0.01, G.glow);
num(R + "glow.bloomSize", "Strike bloom size", 1, 0, 4, 0.05, G.glow, void 0, "\xD7");
num(R + "glow.bloomDecay", "Strike bloom decay speed", 2.2, 0, 10, 0.1, G.glow, "Higher = fades faster after the strike");
num(R + "glow.sparkCount", "Sparks per strike", 7, 0, 30, 1, G.glow);
num(R + "glow.sparkSpeed", "Spark speed", 1, 0.1, 4, 0.05, G.glow, void 0, "\xD7");
num(R + "glow.sparkSize", "Spark size", 1, 0.2, 5, 0.05, G.glow, void 0, "\xD7");
num(R + "glow.sparkAlpha", "Spark brightness", 0.8, 0, 1, 0.01, G.glow);
num(R + "glow.keyWash", "Pressed-key colour wash", 1, 0, 1.5, 0.01, G.glow, "How strongly struck keys take the note colour", "\xD7");
num(R + "glow.blackKeyHalo", "Black-key halo", 0.35, 0, 1.5, 0.01, G.glow, "Soft light around pressed black keys");
num(R + "glow.railGlow", "Damper-rail glow", 0.7, 0, 1.5, 0.01, G.glow);
num(R + "glow.frontBoardGlow", "Front-board underglow", 0.35, 0, 1.5, 0.01, G.glow, "Light spilling under pressed keys");
num(R + "glow.impactFlash", "Impact flash", 0.45, 0, 1.5, 0.01, G.glow, "Quick white flash at the instant of the strike");
num(R + "glow.contactBar", "Strike contact line", 1, 0, 2, 0.01, G.glow, void 0, "\xD7");
num(R + "glow.contactSegment", "Lit contact segments", 0.9, 0, 1.5, 0.01, G.glow);
num(R + "glow.incomingKey", "Incoming-key pre-glow (keys)", 1, 0, 3, 0.05, G.glow, void 0, "\xD7");
num(R + "glow.incomingRail", "Incoming-key pre-glow (rail)", 1, 0, 3, 0.05, G.glow, void 0, "\xD7");
num(R + "glow.sustainTail", "Sustain-pedal tail intensity", 0.26, 0, 1, 0.01, G.glow);
num(R + "glow.lamp", "Lamp glow behind lanes", 0.13, 0, 0.6, 5e-3, G.glow);
num(R + "glow.pedalWash", "Pedal-down wash", 0.1, 0, 0.6, 5e-3, G.glow);
col(C + "bgTop", "Background \xB7 top", "#080605", G.bg);
col(C + "bgMid", "Background \xB7 middle", "#100b08", G.bg);
col(C + "bgBottom", "Background \xB7 bottom", "#1b130d", G.bg);
col(C + "lamp", "Lamp glow colour", "#d69648", G.bg);
col(C + "pedalWash", "Pedal wash colour", "#d68c46", G.bg);
col(C + "dust", "Dust-mote colour", "#ffd696", G.bg);
num(R + "lines.blackLaneShade", "Black-key lane darkness", 0.34, 0, 0.9, 0.01, G.bg);
num(R + "lines.whiteLaneAlt", "White-lane alternation", 0.012, 0, 0.2, 2e-3, G.bg, "Subtle striping that helps track columns");
num(R + "lines.vignetteTop", "Top vignette", 0.62, 0, 1, 0.01, G.bg);
num(R + "lines.vignetteSide", "Side vignette", 0.42, 0, 1, 0.01, G.bg);
bool(R + "ambientDust", "Floating dust motes", false, G.bg);
num(R + "dust.count", "Dust mote count", 54, 0, 400, 1, G.bg);
num(R + "dust.speed", "Dust mote speed", 1, 0, 6, 0.05, G.bg, void 0, "\xD7");
num(R + "dust.size", "Dust mote size", 1, 0.2, 6, 0.05, G.bg, void 0, "\xD7");
num(R + "dust.alpha", "Dust mote brightness", 1, 0, 3, 0.05, G.bg, void 0, "\xD7");
col(C + "laneGuide", "Octave guide colour", "#ecc88a", G.lines);
col(C + "beatLine", "Beat line colour", "#ecd0a0", G.lines);
col(C + "measureLine", "Measure line colour", "#eece92", G.lines);
col(C + "measureNumber", "Measure number colour", "#f0d49e", G.lines);
col(C + "accent", "Strike line / HUD accent", "#e2b260", G.lines);
col(C + "accentLight", "Strike line highlight", "#ffe2a0", G.lines);
num(R + "lines.guideAlphaC", "Octave (C) guide intensity", 0.3, 0, 1, 0.01, G.lines);
num(R + "lines.guideAlphaF", "Semi-guide (F) intensity", 0.11, 0, 1, 0.01, G.lines);
num(R + "lines.guideWidth", "Guide thickness", 1, 0.2, 5, 0.05, G.lines, void 0, "\xD7");
num(R + "lines.beatAlpha", "Beat line intensity", 0.075, 0, 1, 5e-3, G.lines);
num(R + "lines.measureAlpha", "Measure line intensity", 0.34, 0, 1, 0.01, G.lines);
num(R + "lines.measureWidth", "Measure line thickness", 1, 0.2, 5, 0.05, G.lines, void 0, "\xD7");
num(R + "lines.measureNumberSize", "Measure number size", 1, 0.4, 4, 0.05, G.lines, void 0, "\xD7");
col(C + "hudPanel", "HUD panel colour", "#221a13", G.hud);
col(C + "hudText", "HUD title colour", "#f7ecd3", G.hud);
col(C + "hudSub", "HUD subtitle colour", "#c4ac80", G.hud);
col(C + "chordText", "Chord symbol colour", "#fbefd4", G.hud);
col(C + "chordRoman", "Roman numeral colour", "#e0b45c", G.hud);
num(R + "hud.scale", "HUD size", 1, 0.4, 3, 0.05, G.hud, void 0, "\xD7");
num(R + "hud.opacity", "HUD opacity", 1, 0, 1, 0.01, G.hud);
num(R + "hud.panelAlpha", "HUD panel solidity", 0.82, 0, 1, 0.01, G.hud);
num(R + "hud.chordScale", "Chord banner size", 1, 0.4, 3, 0.05, G.hud, void 0, "\xD7");
num(R + "hud.chordOffsetY", "Chord banner vertical offset", 0, -40, 400, 1, G.hud, void 0, "px");
opt(R + "analysis.chordSensitivity", "Chord detection sensitivity", "balanced", [
  { value: "strict", label: "Strict \u2014 only unmistakable chords" },
  { value: "balanced", label: "Balanced (recommended)" },
  { value: "detailed", label: "Detailed \u2014 extensions & colour chords" }
], G.analysis, "Chords appear only when they are really played; this sets how much evidence is required");
bool(R + "analysis.detectArpeggios", "Recognise arpeggiated chords", true, G.analysis, "A chord built up note-by-note (Bach prelude, Alberti bass\u2026) is named when it completes");
bool(R + "analysis.showInversions", "Show inversions as slash chords", true, G.analysis, "C/E, G7/B \u2026");
bool(R + "analysis.romanNumerals", "Roman-numeral analysis", true, G.analysis, "Figured numerals (I\u2076\u2084, V\u2076\u2085), applied dominants (V\u2077/V), Neapolitan sixth");
bool(R + "analysis.localKey", "Follow modulations (local key)", true, G.analysis, "Roman numerals use the key that is actually sounding, not just the global one");
num(R + "analysis.minChordHold", "Minimum chord display time", 0.6, 0.1, 4, 0.05, G.analysis, "Short chords stay readable for at least this long", "s");
bool(R + "analysis.showChordTones", "Show chord tones in the banner", true, G.analysis);
bool(R + "analysis.showKeyChip", "Show detected key in the HUD", true, G.analysis);
num(R + "finish.keyGrain", "Ivory grain", 1, 0, 3, 0.05, G.finish, "Barely-there texture on the white keys", "\xD7");
num(R + "finish.keyVariance", "Per-key tonal variation", 1, 0, 3, 0.05, G.finish, "No two ivories are exactly alike", "\xD7");
num(R + "finish.keybedDepth", "Keybed depth (gaps between keys)", 1, 0, 3, 0.05, G.finish, void 0, "\xD7");
num(R + "finish.cheekBlocks", "Cheek blocks & end shading", 1, 0, 3, 0.05, G.finish, "Wooden cheeks beside a zoomed keyboard and inner shadow at the keyboard ends", "\xD7");
bool(R + "finish.middleCMarker", "Middle-C marker", true, G.finish, "A tiny engraved dot on C4 and a notch on every C");
bool(R + "finish.brandPlate", "Brand plate on the damper rail", true, G.finish);
txt(R + "finish.brandText", "Brand plate text", "FAHH \xB7 CONCERT GRAND", G.finish, "Engraved on the rail, like a fallboard nameplate");
num(R + "finish.lampSheen", "Lamp sheen along the keys", 1, 0, 3, 0.05, G.finish, void 0, "\xD7");
num(R + "finish.noteFadeIn", "Notes emerge from the dark", 0.16, 0, 0.6, 0.01, G.finish, "Fraction of the lane over which new notes fade in");
num(R + "finish.noteCore", "Note inner core light", 1, 0, 3, 0.05, G.finish, "A fine bright line down the centre of every note", "\xD7");
num(R + "finish.noteReflection", "Note reflection on the rail", 1, 0, 3, 0.05, G.finish, "Approaching notes are faintly mirrored in the brass", "\xD7");
num(R + "finish.laneDepth", "Lane depth shading", 1, 0, 3, 0.05, G.finish, void 0, "\xD7");
bool(R + "finish.keyPhysics", "Physical key press model", true, G.finish, "Keys are pushed down with real travel, rebound and depth cues. Off = the original shallow press");
num(R + "finish.pressHold", "Press \xB7 hold depth at pp", 0.72, 0.3, 1, 0.01, G.finish, "How far a soft (pp) key travels; ff always reaches the keybed", "of travel");
num(R + "finish.pressAttackSlow", "Press \xB7 attack time at pp", 0.11, 0.01, 0.4, 5e-3, G.finish, "Seconds for a soft key to go down", "s");
num(R + "finish.pressAttackFast", "Press \xB7 attack time at ff", 0.018, 4e-3, 0.2, 2e-3, G.finish, "Seconds for a hard strike to reach the keybed", "s");
num(R + "finish.pressBottomOut", "Press \xB7 felt compression & rebound", 0.045, 0, 0.15, 5e-3, G.finish, "Hard strikes squash the keybed felt and rebound within ~70 ms", "of travel");
num(R + "finish.pressReleaseSlow", "Press \xB7 release time (slow)", 0.14, 0.02, 0.5, 5e-3, G.finish, "Seconds for a gently released key to return", "s");
num(R + "finish.pressReleaseFast", "Press \xB7 release time (fast)", 0.07, 0.02, 0.4, 5e-3, G.finish, "Seconds for a key released after a hard strike", "s");
num(R + "finish.pressOvershoot", "Press \xB7 release overshoot", 0.03, 0, 0.1, 5e-3, G.finish, "How far above rest height a returning key springs", "of travel");
num(R + "finish.pressAnticipation", "Press \xB7 anticipation", 20, 0, 40, 1, G.finish, "The key starts to move this long before the note and lifts before its end (0 = exact old timing)", "ms");
num(R + "finish.pressVariation", "Press \xB7 per-key variation", 1, 0, 3, 0.05, G.finish, "Tiny deterministic differences in depth and speed between keys", "\xD7");
num(R + "finish.cueDrop", "Cue \xB7 surface drop & foreshortening", 1, 0, 3, 0.05, G.finish, "The top face of a pressed key sinks and compresses", "\xD7");
num(R + "finish.cueNose", "Cue \xB7 nose sinks under the key slip", 1, 0, 3, 0.05, G.finish, "Visible front face shrinks, the slip shades it", "\xD7");
num(R + "finish.cueSideWalls", "Cue \xB7 exposed neighbour walls", 1, 0, 3, 0.05, G.finish, "Side walls revealed beside a pressed key", "\xD7");
num(R + "finish.cueChannel", "Cue \xB7 dark channel between keys", 1, 0, 3, 0.05, G.finish, "The hairline gap deepens into an occluded channel", "\xD7");
num(R + "finish.cueContact", "Cue \xB7 contact shadows", 1, 0, 3, 0.05, G.finish, "Neighbours shade a pressed key along both edges and at the rear", "\xD7");
num(R + "finish.cueTilt", "Cue \xB7 tilt shading & sliding reflection", 1, 0, 3, 0.05, G.finish, "The face and its reflection follow the key's pitch", "\xD7");
num(R + "finish.cueBlackKeys", "Cue \xB7 black-key depth", 1, 0, 3, 0.05, G.finish, "Pressed black keys sit lower with a tighter cast shadow", "\xD7");
num(R + "finish.cueOverhang", "Cue \xB7 black-key overhang shadow", 1, 0, 3, 0.05, G.finish, "The shadow on a pressed white key's neck deepens", "\xD7");
num(R + "finish.cueBounce", "Cue \xB7 coloured bounce light", 1, 0, 3, 0.05, G.finish, "Note colour spills onto exposed walls, the channel floor and the key crest", "\xD7");
num(R + "finish.lightAngle", "Light \xB7 key-light direction", -38, -80, 80, 1, G.finish, "Single light model: negative = softbox from the upper left. Highlights, bevels and shadows follow it", "\xB0");
num(R + "finish.lightFill", "Light \xB7 soft fill", 1, 0, 3, 0.05, G.finish, "Fill light that lifts the shaded edges", "\xD7");
num(R + "finish.lightAmbient", "Light \xB7 shadow depth (ambient)", 1, 0, 3, 0.05, G.finish, "Strength of every cast and contact shadow on the keyboard", "\xD7");
num(R + "finish.ivoryDetail", "Ivory detail (pores, edge warmth)", 1, 0, 2, 0.05, G.finish, "Micro-pores, fibres and the warm translucent edge of the ivory", "\xD7");
num(R + "finish.ebonyDetail", "Ebony detail (reflections)", 1, 0, 2, 0.05, G.finish, "Soft-box streak and cool environment reflection on black keys", "\xD7");
num(R + "finish.woodDetail", "Wood & felt detail", 1, 0, 2, 0.05, G.finish, "Grain, end-grain and felt fibres of the keybed, cheeks, slip and damper rail", "\xD7");
num(R + "finish.brassDetail", "Brass detail (screws, dots, plate)", 1, 0, 2, 0.05, G.finish, "Bevel, slot, highlight and cast shadow on brass parts", "\xD7");
num(R + "finish.keyDither", "Anti-banding dither", 1, 0, 3, 0.05, G.finish, "Seeded static noise that stops dark gradients banding in H.264", "\xD7");
num(R + "layout.scale", "Global drawing scale", 1, 0.4, 3, 0.02, G.layout, "Scales every pixel-sized element (lines, glows, rails\u2026)", "\xD7");
num(R + "layout.railHeight", "Damper rail height", 1, 0, 4, 0.05, G.layout, void 0, "\xD7");
num(R + "layout.frontBoardHeight", "Front board height", 1, 0, 6, 0.05, G.layout, void 0, "\xD7");
num(R + "layout.minimapHeight", "Minimap height", 1, 0.4, 3, 0.05, G.layout, void 0, "\xD7");
num(R + "post.brightness", "Brightness", 1, 0.2, 2.5, 0.01, G.post, void 0, "\xD7");
num(R + "post.contrast", "Contrast", 1, 0.2, 3, 0.01, G.post, void 0, "\xD7");
num(R + "post.saturation", "Saturation", 1, 0, 3, 0.01, G.post, void 0, "\xD7");
num(R + "post.hue", "Hue rotation", 0, -180, 180, 1, G.post, void 0, "\xB0");
num(R + "post.grayscale", "Grayscale", 0, 0, 1, 0.01, G.post);
num(R + "post.sepia", "Sepia", 0, 0, 1, 0.01, G.post);
num(R + "post.vignette", "Screen vignette", 0, 0, 1, 0.01, G.post);
num(R + "post.bloom", "Global bloom", 0, 0, 1.5, 0.01, G.post, "Soft glow over the whole image (needs canvas filter support)");
num(R + "post.bloomRadius", "Global bloom radius", 10, 1, 60, 1, G.post, void 0, "px");
opt(R + "activeHandFilter", "Hands shown", "both", [
  { value: "both", label: "Both hands" },
  { value: "right", label: "Right hand only" },
  { value: "left", label: "Left hand only" }
], G.features);
opt(R + "noteLabelMode", "Note labels", "fingering", [
  { value: "fingering", label: "Fingering" },
  { value: "noteName", label: "Pitch names" },
  { value: "solfege", label: "Solf\xE8ge" },
  { value: "scaleDegree", label: "Scale degree" },
  { value: "none", label: "None (clean bars)" }
], G.features);
opt(R + "keyLabelMode", "Key labels", "onlyC", [
  { value: "onlyC", label: "Octave C only" },
  { value: "allWhite", label: "All naturals" },
  { value: "all88", label: "All 88 keys" },
  { value: "solfege", label: "Solf\xE8ge" },
  { value: "none", label: "Unlabelled" }
], G.features);
bool(R + "useFlats", "Spell accidentals as flats (\u266D)", false, G.features);
bool(R + "showMeasureLines", "Measure lines", true, G.features);
bool(R + "showMeasureNumbers", "Measure numbers", true, G.features);
bool(R + "showBeatLines", "Beat lines", true, G.features);
bool(R + "showKeyLaneGuides", "Octave & semitone lane guides", true, G.features);
bool(R + "showSustainPedal", "Pedal indicator & wash", true, G.features);
bool(R + "showSustainTails", "Sustain-pedal tails", true, G.features);
bool(R + "showChordBanner", "Chord banner", true, G.features);
bool(R + "showChordBrackets", "Chord brackets in lanes", true, G.features);
bool(R + "showIncomingKeyPreview", "Incoming-key pre-glow", true, G.features);
bool(R + "showStrikeContactBar", "Strike contact line", true, G.features);
bool(R + "showHudMetadata", "Title / tempo HUD", true, G.features);
bool(R + "showKeyMinimap", "88-key minimap strip", true, G.features);
bool(R + "showAcousticBloom", "Strike bloom, beams & sparks", true, G.features);
F.push({ path: R + "mutedTracks", type: "intList", label: "Hidden voices (track indexes)", def: [], group: G.features, hint: "Zero-based voice indexes to hide, e.g. [1]" });
num(R + "noteFallSeconds", "Falling lookahead", 2.4, 0.5, 10, 0.1, G.playback, "Seconds of music visible above the keys", "s");
num(R + "incomingLookAheadSeconds", "Pre-glow lookahead", 0.45, 0.05, 3, 0.01, G.playback, void 0, "s");
num("playback.speed", "Playback speed", 1, 0.1, 4, 0.05, G.playback, void 0, "\xD7");
bool("playback.practice", "Practice mode (pause at every note)", false, G.playback);
bool("playback.loopOn", "A\u2013B measure loop", false, G.playback);
num("playback.loopStart", "Loop start measure", 1, 1, 9999, 1, G.playback);
num("playback.loopEnd", "Loop end measure", 4, 1, 9999, 1, G.playback);
var INSTRUMENTS = [
  { value: "salamander", label: "Salamander Grand Piano \u2014 studio quality (recommended)" },
  { value: "fluid-grand", label: "FluidR3 Acoustic Grand Piano" },
  { value: "fluid-bright", label: "FluidR3 Bright Acoustic Piano" },
  { value: "fluid-epiano", label: "FluidR3 Electric Piano" },
  { value: "fluid-honky", label: "FluidR3 Honky-tonk Piano" },
  { value: "fluid-harpsichord", label: "FluidR3 Harpsichord" },
  { value: "fluid-celesta", label: "FluidR3 Celesta" },
  { value: "fluid-musicbox", label: "FluidR3 Music Box" },
  { value: "fluid-vibraphone", label: "FluidR3 Vibraphone" },
  { value: "fluid-marimba", label: "FluidR3 Marimba" },
  { value: "fluid-harp", label: "FluidR3 Orchestral Harp" },
  { value: "fluid-guitar", label: "FluidR3 Nylon Guitar" },
  { value: "fluid-strings", label: "FluidR3 String Ensemble" },
  { value: "fluid-organ", label: "FluidR3 Church Organ" },
  { value: "custom", label: "Custom soundfont URL\u2026" }
];
bool("audio.enabled", "Audio on", true, G.audio, "Samples stream from a CDN. Offline \u2192 silent, nothing breaks.");
num("audio.volume", "Master volume", 0.8, 0, 1, 0.01, G.audio);
opt("audio.instrument", "Instrument / soundfont", "salamander", INSTRUMENTS, G.audio);
txt("audio.customUrl", "Custom soundfont URL", "", G.audio, "A midi-js-soundfonts style .js file, or a folder URL ending in \u201C/\u201D holding A0.mp3, Ds1.mp3 \u2026 (Salamander naming)");
bool("audio.followFilters", "Audio follows hand / voice filters", true, G.audio, "Hide the left hand \u2192 it is muted too");
bool("audio.honorPedal", "Honour sustain pedal", true, G.audio);
num("audio.release", "Note release time", 0.35, 0.02, 3, 0.01, G.audio, void 0, "s");
num("audio.velocityCurve", "Velocity curve", 1.6, 0.4, 4, 0.05, G.audio, "Higher = bigger difference between soft and loud");
num("audio.reverb", "Reverb amount", 0.12, 0, 1, 0.01, G.audio);
num("audio.reverbSize", "Reverb length", 2.2, 0.3, 6, 0.1, G.audio, void 0, "s");
num("audio.transpose", "Transpose", 0, -24, 24, 1, G.audio, void 0, "st");
num("audio.latency", "Audio offset", 0, -0.5, 0.5, 5e-3, G.audio, "Shift sound earlier (\u2212) or later (+) relative to the picture", "s");
num("video.width", "Video width", 1920, 320, 7680, 2, G.video, void 0, "px");
num("video.height", "Video height", 1080, 240, 4320, 2, G.video, void 0, "px");
num("video.fps", "Frame rate", 60, 1, 240, 1, G.video, void 0, "fps");
num("video.leadInSeconds", "Lead-in offset", 2, 0, 30, 0.5, G.video, "Silent run-up before the first note", "s");
num("video.tailOutSeconds", "Tail-out", 1, 0, 30, 0.5, G.video, void 0, "s");
opt("video.qualityProfile", "Quality profile", "rgb-lossless", [
  { value: "rgb-lossless", label: "Archival master (max bitrate)" },
  { value: "yuv444-lossless", label: "High-quality editing grade" },
  { value: "compatible-lossless", label: "Compatible (smaller files)" }
], G.video);
var FIELD_BY_PATH = new Map(F.map((f) => [f.path, f]));
function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null || typeof cur[k] !== "object") cur[k] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}
var clone = (v) => JSON.parse(JSON.stringify(v));
function resolvePath(p) {
  const key = p.trim();
  if (FIELD_BY_PATH.has(key)) return key;
  for (const pre of ["render.", "video.", "playback.", "audio.", "ui.", "render.colors.", "render.glow.", "render.keys.", "render.notes."]) {
    if (FIELD_BY_PATH.has(pre + key)) return pre + key;
  }
  return null;
}
function buildDefaults() {
  const doc = {};
  for (const f of F) setByPath(doc, f.path, clone(f.def));
  return doc;
}
var DEFAULTS = buildDefaults();
var DEFAULT_SETTINGS = DEFAULTS.render;
var DEFAULT_SYNC = DEFAULTS.video;
var DEFAULT_PLAYBACK = DEFAULTS.playback;
var DEFAULT_AUDIO = DEFAULTS.audio;
var DEFAULT_UI = DEFAULTS.ui;
var freshDefaults = () => clone(DEFAULTS);
function normalizeColor(v) {
  if (typeof v !== "string") return null;
  let s = v.trim().toLowerCase();
  const m = s.match(/^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/);
  if (m) {
    const h = (n) => Math.max(0, Math.min(255, +n)).toString(16).padStart(2, "0");
    return `#${h(m[1])}${h(m[2])}${h(m[3])}`;
  }
  if (/^[0-9a-f]{3}$|^[0-9a-f]{6}$/.test(s)) s = "#" + s;
  if (/^#[0-9a-f]{3}$/.test(s)) return "#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3];
  if (/^#[0-9a-f]{6}$/.test(s)) return s;
  return null;
}
function coerce(f, v) {
  switch (f.type) {
    case "number": {
      const n = typeof v === "string" && v.trim() !== "" ? Number(v) : v;
      if (typeof n !== "number" || !isFinite(n)) return { ok: false, reason: "expected a finite number" };
      let x = Math.max(f.min ?? -Infinity, Math.min(f.max ?? Infinity, n));
      if (f.step && f.step >= 1 && Number.isInteger(f.step)) x = Math.round(x);
      return { ok: true, value: x };
    }
    case "boolean": {
      if (typeof v === "boolean") return { ok: true, value: v };
      if (v === 1 || v === "1" || v === "true") return { ok: true, value: true };
      if (v === 0 || v === "0" || v === "false") return { ok: true, value: false };
      return { ok: false, reason: "expected true or false" };
    }
    case "color": {
      const c = normalizeColor(v);
      return c ? { ok: true, value: c } : { ok: false, reason: "expected a colour like #ffcc00" };
    }
    case "enum": {
      const hit = f.options?.find((o) => String(o.value) === String(v));
      return hit ? { ok: true, value: hit.value } : { ok: false, reason: `expected one of: ${f.options?.map((o) => o.value).join(", ")}` };
    }
    case "text":
      return typeof v === "string" ? { ok: true, value: v.slice(0, 2e3) } : { ok: false, reason: "expected text" };
    case "intList": {
      if (!Array.isArray(v)) return { ok: false, reason: "expected a list of integers" };
      const out = v.map(Number).filter((n) => Number.isInteger(n) && n >= 0);
      return { ok: true, value: Array.from(new Set(out)).sort((a, b) => a - b) };
    }
  }
}
function flatten(value, prefix, out) {
  if (value !== null && typeof value === "object") {
    if (Array.isArray(value) && prefix && FIELD_BY_PATH.get(resolvePath(prefix) ?? "")?.type === "intList") {
      out.push([prefix, value]);
      return;
    }
    const entries = Array.isArray(value) ? value.map((v, i) => [String(i), v]) : Object.entries(value);
    for (const [k, v] of entries) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else if (prefix) out.push([prefix, value]);
}
function applyPatch(doc, patch, prefix = "") {
  const next = clone(doc);
  const applied = [];
  const rejected = [];
  if (patch === null || typeof patch !== "object") {
    rejected.push({ path: prefix || "(root)", reason: "settings must be an object" });
    return { doc: next, applied, rejected };
  }
  const flat = [];
  flatten(patch, prefix, flat);
  for (const [raw, value] of flat) {
    const path = resolvePath(raw);
    if (!path) {
      if (!raw.startsWith("meta.") && raw !== "format" && raw !== "version" && raw !== "app" && raw !== "exportedAt") rejected.push({ path: raw, reason: "unknown setting" });
      continue;
    }
    const field = FIELD_BY_PATH.get(path);
    const r = coerce(field, value);
    if (!r.ok) {
      rejected.push({ path, reason: r.reason });
      continue;
    }
    setByPath(next, path, r.value);
    applied.push(path);
  }
  return { doc: next, applied, rejected };
}
function exportDocument(doc) {
  return { format: SETTINGS_FORMAT, version: SETTINGS_VERSION, app: APP_NAME, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), settings: clone(doc) };
}
function theme(o) {
  return {
    "ui.accent": o.accent,
    "ui.accent2": o.accent2,
    "ui.surface": o.surface,
    "ui.text": o.text,
    [C + "rightHand"]: o.right,
    [C + "leftHand"]: o.left,
    [C + "bgTop"]: o.bg[0],
    [C + "bgMid"]: o.bg[1],
    [C + "bgBottom"]: o.bg[2],
    [C + "lamp"]: o.lamp,
    [C + "pedalWash"]: o.lamp,
    [C + "dust"]: o.accentLight,
    [C + "laneGuide"]: o.line,
    [C + "beatLine"]: o.line,
    [C + "measureLine"]: o.line,
    [C + "measureNumber"]: o.line,
    [C + "accent"]: o.accent,
    [C + "accentLight"]: o.accentLight,
    [C + "rail"]: o.rail,
    [C + "railTrim"]: o.trim,
    [C + "frontBoard"]: o.wood,
    [C + "hudPanel"]: o.hudPanel,
    [C + "hudSub"]: o.line,
    [C + "chordRoman"]: o.accent,
    ...o.extra
  };
}
var THEME_PRESETS = [
  {
    id: "classic-brass",
    label: "Classic Brass",
    swatch: ["#e2b256", "#59c4a8", "#6e2535"],
    patch: theme({ accent: "#e2b256", accent2: "#59c4a8", surface: "#1b1511", text: "#f3e8d0", right: "#f2b84b", left: "#4fc4a8", bg: ["#080605", "#100b08", "#1b130d"], lamp: "#d69648", line: "#ecc88a", rail: "#6e2535", trim: "#d4a24c", wood: "#3d2614", accentLight: "#ffe2a0", hudPanel: "#221a13", extra: { [C + "measureLine"]: "#eece92", [C + "beatLine"]: "#ecd0a0", [C + "measureNumber"]: "#f0d49e", [C + "hudSub"]: "#c4ac80", [C + "chordRoman"]: "#e0b45c", [C + "accent"]: "#e2b260" } })
  },
  {
    id: "midnight-neon",
    label: "Midnight Neon",
    swatch: ["#4cc9ff", "#ff5fa2", "#101a44"],
    patch: theme({ accent: "#4cc9ff", accent2: "#ff5fa2", surface: "#10131f", text: "#e6efff", right: "#4cc9ff", left: "#ff5fa2", bg: ["#03040c", "#070a1a", "#0d1330"], lamp: "#3a6cff", line: "#8fb4ff", rail: "#1a2a78", trim: "#4cc9ff", wood: "#141c3c", accentLight: "#b9ecff", hudPanel: "#11162b" })
  },
  {
    id: "emerald-studio",
    label: "Emerald Studio",
    swatch: ["#4fe0a0", "#e8c35a", "#0f4a38"],
    patch: theme({ accent: "#4fe0a0", accent2: "#e8c35a", surface: "#10191a", text: "#e3f5ec", right: "#7cf0b8", left: "#e8c35a", bg: ["#040806", "#07110d", "#0c1d16"], lamp: "#35c98a", line: "#9be8c4", rail: "#0f4a38", trim: "#c9b45a", wood: "#1f2c22", accentLight: "#c8ffe4", hudPanel: "#0f1d19" })
  },
  {
    id: "rose-gold",
    label: "Rose Gold",
    swatch: ["#f0a39a", "#b9a2f0", "#5a2338"],
    patch: theme({ accent: "#f0a39a", accent2: "#b9a2f0", surface: "#1d1416", text: "#f8e8e6", right: "#f6b3a8", left: "#b9a2f0", bg: ["#0a0507", "#150a0e", "#21111a"], lamp: "#e38a8a", line: "#f1c4bd", rail: "#5a2338", trim: "#e8b4a0", wood: "#3a2022", accentLight: "#ffd9d2", hudPanel: "#241518" })
  },
  {
    id: "sunset",
    label: "Sunset",
    swatch: ["#ff8a3d", "#c35bff", "#4a1d5c"],
    patch: theme({ accent: "#ff8a3d", accent2: "#c35bff", surface: "#1c1220", text: "#fff0e2", right: "#ffa24d", left: "#c35bff", bg: ["#0a0510", "#1a0a1c", "#2e1124"], lamp: "#ff6a3d", line: "#ffc08a", rail: "#4a1d5c", trim: "#ffb052", wood: "#35192b", accentLight: "#ffd2a6", hudPanel: "#241328" })
  },
  {
    id: "monochrome-noir",
    label: "Monochrome Noir",
    swatch: ["#e8e8e8", "#8a8a8a", "#2a2a2a"],
    patch: theme({ accent: "#dcdcdc", accent2: "#9a9a9a", surface: "#161616", text: "#ececec", right: "#f2f2f2", left: "#8f8f8f", bg: ["#030303", "#0a0a0a", "#141414"], lamp: "#bbbbbb", line: "#cfcfcf", rail: "#3a3a3a", trim: "#cfcfcf", wood: "#222222", accentLight: "#ffffff", hudPanel: "#1a1a1a", extra: { [C + "whiteKey"]: "#f4f4f4", [C + "blackKey"]: "#111111", [C + "keyLabel"]: "#808080", [C + "keyLabelC"]: "#404040", [C + "keyLabelBlack"]: "#e0e0e0" } })
  },
  {
    id: "high-contrast",
    label: "High Contrast",
    swatch: ["#ffe600", "#00e5ff", "#000000"],
    patch: theme({ accent: "#ffe600", accent2: "#00e5ff", surface: "#0b0b0b", text: "#ffffff", right: "#ffe600", left: "#00e5ff", bg: ["#000000", "#000000", "#0a0a0a"], lamp: "#ffffff", line: "#ffffff", rail: "#202020", trim: "#ffe600", wood: "#1a1a1a", accentLight: "#ffffff", hudPanel: "#101010", extra: { [R + "post.contrast"]: 1.18, [R + "lines.beatAlpha"]: 0.16, [R + "lines.measureAlpha"]: 0.6, [R + "lines.guideAlphaC"]: 0.5 } })
  }
];

// qa/node/entry.ts
import { createCanvas } from "@napi-rs/canvas";
setCanvasFactory(((w, h) => createCanvas(w, h)));
function song(bytes) {
  return parseMidi(bytes, { fileName: "scenes.mid" });
}
function settings(patch = {}) {
  const r = applyPatch(freshDefaults(), patch);
  const d = r.doc;
  if (r.rejected && r.rejected.length) console.error("rejected", r.rejected);
  return d;
}
function render(sg, t, W, H, doc) {
  const c = createCanvas(W, H);
  const ctx = c.getContext("2d");
  const t0 = process.hrtime.bigint();
  drawFrame(ctx, sg, t, doc.render, { width: W, height: H, dpr: 1, hitEps: 0.5 / doc.video.fps });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  return { png: c.toBuffer("image/png"), ms, rgba: ctx.getImageData(0, 0, W, H).data };
}
export {
  applyPatch,
  exportDocument,
  freshDefaults,
  keyDepressAt,
  render,
  settings,
  song
};
