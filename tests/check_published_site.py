#!/usr/bin/env python3
"""Offline guardrail for the published static site (stdlib only)."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path("_class_site")
PAGES = [
    "index.html", "aula-1.html", "class-slides.html", "vocabulary.html",
    "review.html", "practice.html", "contact.html", "teacher.html",
    "games.html", "arcade.html", "freeplay.html", "language-lab.html",
]
ASSETS = ["games.js", "games.css", "arcade.css", "style.css", "theme.js", "freeplay.js", "freeplay-bank.js", "freeplay-advanced.js", "freeplay.css", "arcade-progress.js", "arcade-leaderboard.js", "arcade-class-highscores.json", "arcade-rules.js", "language-lab.css", "language-lab.js", "language-lab-core.js", "language-lab-content.js", "language-lab-dictionary.json", "language-lab-license.md", "freedict-gpl-2.0.txt"]
MODES = {"memory", "scramble", "search", "crossword", "match",
         "sentence", "fill", "error", "verbs"}


class Links(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.assets = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "script" and attrs.get("src"):
            self.assets.append(attrs["src"])
        if tag == "link" and attrs.get("href"):
            self.assets.append(attrs["href"])


def read_links(file):
    parser = Links()
    parser.feed(file.read_text(encoding="utf-8"))
    return parser


for filename in PAGES + ASSETS:
    assert (ROOT / filename).is_file(), f"Missing deployed asset: {filename}"

for filename in PAGES:
    page = read_links(ROOT / filename)
    assert "arcade.html" in page.links, f"Missing Games navigation: {filename}"
    assert "language-lab.html" in page.links, f"Missing Language Lab navigation: {filename}"
    for link in page.links + page.assets:
        parts = urlparse(link)
        if parts.scheme or parts.netloc or link.startswith("#"):
            continue
        if not parts.path:
            continue
        if parts.path in {"games.html", "arcade.html", "games.js", "games.css", "arcade.css", "freeplay.html", "freeplay.js", "freeplay-bank.js", "freeplay-advanced.js", "freeplay.css", "arcade-progress.js", "arcade-leaderboard.js", "arcade-class-highscores.json", "language-lab.html", "language-lab.css", "language-lab.js", "language-lab-core.js", "language-lab-content.js", "language-lab-dictionary.json", "language-lab-license.md", "freedict-gpl-2.0.txt"}:
            assert (ROOT / parts.path).is_file(), f"Broken new game asset link: {filename}: {link}"

# Language Lab is static, attributed, and backed by a real local dictionary file.
import json
lab_page = (ROOT / "language-lab.html").read_text(encoding="utf-8")
assert all(f'data-lab-tab="{name}"' in lab_page for name in ("dictionary","translate","pronounce","grammar")), "Missing Language Lab tool"
lab_data = json.loads((ROOT / "language-lab-dictionary.json").read_text(encoding="utf-8"))
assert lab_data.get("headwords") == 4502, "FreeDict dataset metadata mismatch"
assert len(lab_data.get("entries", [])) == 4502, "Incomplete Spanish-English dictionary"
assert lab_data.get("license") == "GPL-2.0-or-later", "Missing dictionary license"
assert (ROOT / "freedict-gpl-2.0.txt").is_file(), "Missing FreeDict license text"

runner = read_links(ROOT / "games.html")
assert any(urlparse(x).path == "games.js" for x in runner.assets), "Runner missing games.js"
assert any(urlparse(x).path == "games.css" for x in runner.assets), "Runner missing games.css"
# Rules button belongs to the Games gallery, not the global header or activity runner.
arcade_html = (ROOT / "arcade.html").read_text(encoding="utf-8")
assert 'id="arcade-rules-button"' in arcade_html, "Missing arcade rules button"
assert 'id="arcade-rules-panel"' in arcade_html, "Missing arcade rules panel"
assert 'arcade-rules.js?v=1' in arcade_html, "Missing rules behavior"
for other_page in ("index.html", "games.html", "practice.html", "freeplay.html"):
    assert 'id="arcade-rules-button"' not in (ROOT / other_page).read_text(encoding="utf-8"), "Rules button duplicated beyond arcade gallery"
hub = read_links(ROOT / "arcade.html")
assert any(urlparse(x).path == "arcade.css" for x in hub.assets), "Hub missing arcade.css"


freeplay = read_links(ROOT / "freeplay.html")
assert any(urlparse(x).path == "freeplay.js" for x in freeplay.assets), "Free Play missing engine"
assert any(urlparse(x).path == "freeplay-bank.js" for x in freeplay.assets), "Free Play missing grammar bank"
assert any(urlparse(x).path == "freeplay-advanced.js" for x in freeplay.assets), "Free Play missing C1–C2 bank"
assert any(urlparse(x).path == "arcade-progress.js" for x in freeplay.assets), "Free Play missing progress store"
assert any(urlparse(x).path == "arcade-leaderboard.js" for x in freeplay.assets), "Free Play missing scores"
assert "freeplay.html" in read_links(ROOT / "arcade.html").links, "Arcade must link to Free Play"
assert (ROOT / "arcade-class-highscores.json").is_file(), "Shared class scores must be deployed"
assert "freeplay.html" in read_links(ROOT / "games.html").links, "Unit games must link to Free Play"

hub_links = [link for link in hub.links if urlparse(link).path == "games.html"]
practice_links = [link for link in read_links(ROOT / "practice.html").links
                  if urlparse(link).path == "games.html"]
assert len(hub_links) == len(MODES), f"Expected nine game cards, got {len(hub_links)}"
assert len(practice_links) >= 10, "Not enough unit-specific game links"

def validate_routes(links):
    found = set()
    for link in links:
        args = parse_qs(urlparse(link).query)
        assert args.get("game", [None])[0] in MODES, f"Invalid game: {link}"
        unit = args.get("unit", [None])[0]
        assert unit is not None and unit.isdecimal() and 0 <= int(unit) <= 9, f"Invalid unit: {link}"
        found.add(args["game"][0])
    return found

assert validate_routes(hub_links) == MODES, "Arcade missing one or more modes"
validate_routes(practice_links)

# Diccionario Vivo V2 must be fully published, including nested JSON shards.
dict_root = ROOT / "dictionary"
for name in ("index.html", "phonetics.html", "SOURCES_AND_LICENSES.md",
             "data/index.js", "data/manifest.json", "data/es/c.json",
             "data/es/b.json", "data/en/h.json"):
    assert (dict_root / name).is_file(), f"Missing deployed dictionary file: {name}"
manifest = json.loads((dict_root / "data/manifest.json").read_text(encoding="utf-8"))
assert manifest["counts"]["spanish_direct_entries"] == 4502
assert manifest["counts"]["english_terms"] >= 59000
assert manifest["counts"]["spanish_terms"] >= 83000
assert "dictionary/index.html" in read_links(ROOT / "index.html").links
assert "dictionary/index.html" in read_links(ROOT / "language-lab.html").links
assert "phonetics.html" in read_links(dict_root / "index.html").links

print(f"PASS: {len(PAGES)} deployed pages, {len(ASSETS)} core assets, "
      f"{len(hub_links)} arcade cards, {len(practice_links)} unit game links")
