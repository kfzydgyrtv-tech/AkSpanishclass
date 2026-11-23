#!/usr/bin/env python3
"""Verify that the actual GitHub Pages deployment serves games, not just its source files."""
import os
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from urllib.parse import urljoin

base = os.environ["SITE_URL"].rstrip("/") + "/"
paths = [
    "index.html",
    "practice.html",
    "arcade.html",
    "arcade.css",
    "games.html",
    "games.css",
    "games.js",
    "freeplay.html",
    "freeplay.js",
    "freeplay.css",
    "arcade-progress.js",
    "arcade-leaderboard.js",
    "games.html?unit=2&game=error",
    "games.html?unit=0&game=scramble",
    "games.html?unit=1&game=memory",
    "games.html?unit=3&game=search",
    "games.html?unit=4&game=crossword",
    "games.html?unit=5&game=fill",
    "games.html?unit=6&game=sentence",
    "games.html?unit=7&game=match",
    "games.html?unit=8&game=search",
    "games.html?unit=9&game=verbs",
]

for path in paths:
    url = urljoin(base, path)
    last_error = None
    for attempt in range(6):
        try:
            with urlopen(Request(url, headers={"User-Agent": "AkSpanishclass-live-check/1.0"}), timeout=20) as response:
                data = response.read(24000)
                if response.status != 200:
                    raise RuntimeError(f"HTTP {response.status}: {url}")
                if len(data) < 50:
                    raise RuntimeError(f"Suspiciously short response: {url}")
                if path == "arcade.html" and b"arcade-cards" not in data:
                    raise RuntimeError("Wrong page served for arcade.html")
                if path == "games.js" and b"const DATA" not in data:
                    raise RuntimeError("Wrong asset served for games.js")
                if path.startswith("games.html") and b"game-area" not in data:
                    raise RuntimeError("Wrong page served for game route")
                if path == "freeplay.html" and b"freeplay-initials-entry" not in data:
                    raise RuntimeError("Wrong page served for Free Play")
                if path == "freeplay.js" and b"function showInitials" not in data:
                    raise RuntimeError("Free Play script missing score entry")
            last_error = None
            break
        except (HTTPError, URLError, TimeoutError, RuntimeError) as error:
            last_error = error
            if attempt < 5:
                time.sleep(4)
    if last_error:
        raise AssertionError(f"Live-site check failed for {url}: {last_error}")
    print("PASS:", url)
print(f"PASS: {len(paths)} live GitHub Pages URLs respond with their expected files.")
