#!/usr/bin/env python3
"""Offline guardrail for the published static site (stdlib only)."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path("_class_site")
PAGES = [
    "index.html", "aula-1.html", "class-slides.html", "vocabulary.html",
    "review.html", "practice.html", "contact.html", "teacher.html",
    "games.html", "arcade.html",
]
ASSETS = ["games.js", "games.css", "arcade.css", "style.css", "theme.js"]
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
    for link in page.links + page.assets:
        parts = urlparse(link)
        if parts.scheme or parts.netloc or link.startswith("#"):
            continue
        if not parts.path:
            continue
        if parts.path in {"games.html", "arcade.html", "games.js", "games.css", "arcade.css"}:
            assert (ROOT / parts.path).is_file(), f"Broken new game asset link: {filename}: {link}"

runner = read_links(ROOT / "games.html")
assert any(urlparse(x).path == "games.js" for x in runner.assets), "Runner missing games.js"
assert any(urlparse(x).path == "games.css" for x in runner.assets), "Runner missing games.css"
hub = read_links(ROOT / "arcade.html")
assert any(urlparse(x).path == "arcade.css" for x in hub.assets), "Hub missing arcade.css"

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
print(f"PASS: {len(PAGES)} deployed pages, {len(ASSETS)} core assets, "
      f"{len(hub_links)} arcade cards, {len(practice_links)} unit game links")
