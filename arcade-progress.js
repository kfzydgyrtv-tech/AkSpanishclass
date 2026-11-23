"use strict";
/* Ak's Arcade: browser-only progression and local high scores. No network or accounts. */
const ArcadeProgress = (() => {
  const KEY = "ak-spanish-arcade-v1";
  const TARGET = 30, MODES = 3, MAX_KEYS = 800;
  let fallback = {earned: [], scores: []};

  function sanitize(raw) {
    const value = raw && typeof raw === "object" ? raw : {};
    const earned = Array.isArray(value.earned) ? value.earned
      .filter(x => typeof x === "string" && x.length <= 180).slice(-MAX_KEYS) : [];
    const scores = Array.isArray(value.scores) ? value.scores
      .filter(s => s && /^[A-Z]{3}$/.test(s.initials) &&
        Number.isSafeInteger(s.score) && s.score > 0 && s.score <= 1000000)
      .map(s => ({initials:s.initials, score:s.score})).sort((a,b) => b.score - a.score).slice(0,10) : [];
    return {earned:[...new Set(earned)], scores};
  }

  function load() {
    try {
      const stored = localStorage.getItem(KEY);
      return stored ? sanitize(JSON.parse(stored)) : sanitize(fallback);
    } catch (_) {
      return sanitize(fallback);
    }
  }

  function save(data) {
    fallback = sanitize(data);
    try { localStorage.setItem(KEY, JSON.stringify(fallback)); } catch (_) {
      // Private browsing or disabled storage: changes survive only this page.
    }
    try { window.dispatchEvent(new Event("ak-arcade-progress")); } catch (_) {}
  }

  function status() {
    const state = load();
    const modes = new Set(state.earned.map(key => key.split(":")[0]));
    return {
      correct:state.earned.length, target:TARGET,
      modes:modes.size, requiredModes:MODES,
      unlocked:state.earned.length >= TARGET && modes.size >= MODES
    };
  }

  function record(mode, unit, answer) {
    if (!/^(memory|scramble|search|crossword|match|sentence|fill|error|verbs)$/.test(mode)) return false;
    if (!Number.isInteger(Number(unit)) || Number(unit) < 0 || Number(unit) > 9) return false;
    const safe = String(answer).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9ñ| ]/g, "").trim().slice(0,110);
    if (!safe) return false;
    const key = mode + ":" + unit + ":" + safe;
    const state = load();
    if (state.earned.includes(key)) return false;
    state.earned.push(key);
    save(state);
    return true;
  }

  function scores() { return load().scores; }
  function qualifies(points) {
    if (!Number.isSafeInteger(points) || points <= 0) return false;
    const entries = scores();
    return entries.length < 10 || points > entries[entries.length-1].score;
  }
  function addScore(initials, points) {
    const name = String(initials).toUpperCase();
    if (!/^[A-Z]{3}$/.test(name) || !qualifies(points)) return false;
    const state = load();
    state.scores.push({initials:name,score:points});
    state.scores.sort((a,b)=>b.score-a.score);
    state.scores = state.scores.slice(0,10);
    save(state);
    return true;
  }
  return Object.freeze({status, record, scores, qualifies, addScore});
})();
