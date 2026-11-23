"use strict";
/** Dependency-free smoke test: simulate the DOM to initialize every game, unit and difficulty. */
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const source = fs.readFileSync("games.js", "utf8");
const games = ["memory", "scramble", "search", "crossword", "match",
               "sentence", "fill", "error", "verbs"];
class Element {
  constructor(tag = "div") {
    this.tagName = tag.toUpperCase();
    this.children = []; this.textContent = ""; this.value = "";
    this.dataset = {}; this.style = {}; this.handlers = {};
    this.attributes = {}; this.disabled = false; this.className = "";
    const classes = new Set();
    this.classList = { add: name => classes.add(name), remove: name => classes.delete(name),
      contains: name => classes.has(name) };
  }
  append(...items) { this.children.push(...items); }
  replaceChildren(...items) { this.children = [...items]; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; if (name === "disabled") this.disabled = false; }
  addEventListener(name, handler) { this.handlers[name] = handler; }
  querySelectorAll(tag) { return this.children.filter(child => child.tagName.toLowerCase() === tag); }
  focus() {} select() {}
  click() { this.handlers.click?.(); }
}
function simulate(unit, game, difficulty) {
  const ids = {};
  const get = (id, tag = "div") => ids[id] ?? (ids[id] = new Element(tag));
  ["game-area", "game-feedback", "game-title", "game-instructions", "game-score"].forEach(id => get(id));
  get("unit", "select").value = String(unit);
  get("level", "select").value = difficulty;
  get("game-tabs", "nav"); get("reset", "button");
  const location = { href: "https://example.test/AkSpanishclass/games.html?unit=" + unit + "&game=" + game,
    search: "?unit=" + unit + "&game=" + game };
  const context = vm.createContext({
    document: { getElementById: get, createElement: tag => new Element(tag),
      querySelectorAll: () => ids["game-tabs"].children },
    location, history: { replaceState() {} }, URL, URLSearchParams,
    setTimeout: fn => fn(), Math, console,
  });
  vm.runInContext(source, context, { filename: "games.js", timeout: 3000 });
  assert.equal(ids["game-tabs"].children.length, 9, "Game tabs missing");
  assert.ok(ids["game-title"].textContent, "No game title");
  assert.ok(ids["game-area"].children.length > 0, "Game not rendered: " + game);
  assert.equal(ids["unit"].value, String(unit));
  const area = ids["game-area"];
  if (["scramble", "fill", "error", "verbs"].includes(game)) {
    const form = area.children.find(x => x.tagName === "FORM");
    assert.ok(form, "Missing answer form in " + game);
    form.children[0].value = "invalid test answer";
    form.handlers.submit({ preventDefault() {} });
    assert.ok(ids["game-score"].textContent, "Answer did not update score");
  } else if (game === "memory") {
    area.children[0].children[0].click();
    assert.notEqual(area.children[0].children[0].textContent, "?");
  } else if (game === "sentence") {
    const tray = area.children.find(x => x.className === "game-row");
    assert.ok(tray && tray.children.length, "Missing sentence tiles");
    tray.children[0].click();
    assert.ok(tray.children[0].disabled, "Sentence selection failed");
  } else if (game === "match") {
    const columns = area.children[0].children;
    columns[0].children[0].click();
    columns[1].children[0].click();
    assert.ok(ids["game-score"].textContent, "Matching selection failed");
  } else if (game === "search") {
    const grid = area.children.find(x => x.className === "game-word-grid");
    assert.ok(grid && grid.children.length > 60, "Missing word-search grid");
    grid.children[0].click(); grid.children[1].click();
    assert.ok(ids["game-score"].textContent, "Word search selection failed");
  } else if (game === "crossword") {
    const grid = area.children.find(x => x.className === "crossword");
    const clues = area.children.find(x => x.tagName === "OL");
    assert.ok(grid && clues, "Missing crossword grid or clues");
    const squares = grid.children.filter(x => x.className === "crossword-cell");
    assert.ok(squares.length && squares.every(x => x.children[0].tagName === "INPUT"), "Missing editable crossword squares");
    const numbers = squares.flatMap(square => square.children
      .filter(child => child.className === "crossword-number")
      .flatMap(number => number.textContent.split("/").map(Number)))
      .sort((a, b) => a - b);
    const expected = Array.from({length: clues.children.length}, (_, i) => i + 1);
    assert.deepEqual(numbers, expected, "Every crossword clue must be numbered once in its starting square");
    assert.ok(grid.style.gridTemplateColumns.includes("var(--cross-cell)"), "Crossword must respect mobile cell sizing");
    area.children.find(x => x.tagName === "BUTTON").click();
    assert.ok(ids["game-score"].textContent, "Crossword check failed");
  }
}
let total = 0;
for (let unit = 0; unit <= 9; unit++) for (const game of games)
  for (const difficulty of ["easy", "hard"]) {
    simulate(unit, game, difficulty);
    total++;
  }
console.log("PASS: " + total + " runtime scenarios across 10 units, 9 game modes and 2 difficulties.");
