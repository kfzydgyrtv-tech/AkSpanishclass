from collections import defaultdict
from html import escape
from pathlib import Path
import re
from shutil import copy2, copytree, rmtree
from urllib.parse import quote

BUILD_DIR = Path("_class_site")
AUDIO = {".mp3", ".m4a", ".wav", ".ogg", ".oga", ".aac", ".opus"}
DOCUMENTS = {".pdf", ".docx", ".doc"}
SLIDES = {".pdf", ".pptx", ".ppt", ".odp"}
UNIT_PREFIX = re.compile(r"unit-([0-9]+)--(.+)", re.IGNORECASE)
AULA_UNITS = tuple((f"Unit {number}",) for number in range(10))


def natural_order(value):
    return tuple((0, int(part)) if part.isdecimal() else (1, part.casefold())
                 for part in re.split(r"([0-9]+)", value))


def display_name(name):
    return re.sub(r"[-_]+", " ", name).strip()


def unit_name(folder):
    match = re.fullmatch(r"(?:unit|unidad)[- _]*([0-9]+)", folder, re.IGNORECASE)
    return f"Unit {int(match[1])}" if match else display_name(folder)


def edit(path, text, replacement):
    html = path.read_text(encoding="utf-8")
    if html.count(text) != 1:
        raise ValueError(f"Expected one insertion point in {path.name}: {text!r}")
    path.write_text(html.replace(text, replacement, 1), encoding="utf-8")


def file_url(path, site):
    return quote(path.relative_to(site).as_posix(), safe="/")


def resource_groups(site, category, extensions):
    directory = site / "files" / category
    groups = defaultdict(dict)
    for item in sorted(directory.rglob("*"), key=lambda path: natural_order(path.as_posix())):
        relative = item.relative_to(directory)
        if not item.is_file() or item.suffix.lower() not in extensions:
            continue
        if any(part.startswith(".") for part in relative.parts):
            continue
        folders = tuple(unit_name(folder) for folder in relative.parent.parts)
        stem = item.stem
        if not folders and (prefix := UNIT_PREFIX.fullmatch(stem)):
            folders = (f"Unit {int(prefix[1])}",)
            stem = prefix[2]
        key = (relative.parent, item.stem.casefold() if category == "slides" else item.name)
        _, versions = groups[folders].setdefault(key, (display_name(stem), []))
        versions.append(item)
    return groups


def actions(title, versions, site):
    links = []
    for item in sorted(versions, key=lambda path: (path.suffix.lower() != ".pdf", path.name.casefold())):
        url = file_url(item, site)
        suffix = item.suffix[1:].upper()
        if suffix == "PDF":
            links.append(f'<a class="button" href="{url}" target="_blank" rel="noopener">'
                         f'Open PDF<span class="resource-sr-only">: {escape(title)}</span></a>')
        links.append(f'<a class="button primary" href="{url}" download>'
                     f'Download {suffix}<span class="resource-sr-only">: {escape(title)}</span></a>')
    return '<div class="actions file-actions">' + "".join(links) + "</div>"


def resource_cards(site, resources, heading, audio=False):
    parts = ['<div class="file-list">']
    for title, versions in resources:
        safe_title = escape(title)
        parts.append(f'<article class="file-card uploaded-resource"><div class="file-copy">'
                     f'<{heading} class="uploaded-title">{safe_title}</{heading}>')
        if audio:
            url = file_url(versions[0], site)
            parts.append(f'<audio controls preload="none" src="{url}" aria-label="{safe_title}"></audio>')
        parts.append('</div>' + actions(title, versions, site) + '</article>')
    parts.append('</div>')
    return "\n".join(parts)


def room(site, category, extensions, title, anchor):
    groups = resource_groups(site, category, extensions)
    if not groups:
        return ""

    parts = [f'<section class="contents resource-uploads" id="{anchor}"><h2>{title}</h2>']
    for folders in sorted(groups, key=lambda parts: natural_order(" / ".join(parts))):
        resources = groups[folders]
        heading = "h3"
        if folders:
            parts.append(f'<h3 class="resource-group">{escape(" / ".join(folders))}</h3>')
            heading = "h4"
        parts.append(resource_cards(site, resources.values(), heading))
    parts.append("</section>")
    return "\n".join(parts)


def audio_room(site):
    groups = resource_groups(site, "audio", AUDIO)
    parts = ['<section class="contents resource-uploads" id="audio" aria-labelledby="audio-heading">',
             '<h2 id="audio-heading">Textbook audio by unit</h2>',
             '<p>Choose a unit to see its tracks.</p>']
    for folders in sorted(set(AULA_UNITS) | groups.keys(),
                          key=lambda parts: (not parts, natural_order(" / ".join(parts)))):
        title = escape(" / ".join(folders) or "General audio")
        tracks = sorted(groups.get(folders, {}).values(), key=lambda track: natural_order(track[0]))
        parts.append(f'<details class="audio-unit"><summary>{title}</summary>')
        parts.append(resource_cards(site, tracks, "h3", audio=True) if tracks else
                     '<p class="audio-empty">No tracks available yet.</p>')
        parts.append('</details>')
    parts.append('</section>')
    return "\n".join(parts)


def render_resources(site):
    book = room(site, "books", {".pdf"}, "Class textbook PDFs", "textbook-pdfs")
    shortcuts = []
    if book:
        shortcuts.append('<a class="button" href="#textbook-pdfs">Textbook PDFs</a>')
    shortcuts.append('<a class="button" href="#audio">Textbook audio</a>')
    marker = '    <section class="contents" aria-labelledby="unit-heading">'
    edit(site / "aula-1.html", marker, '<div class="actions upload-shortcuts">' +
         "".join(shortcuts) + "</div>\n" + book + "\n" + audio_room(site) + "\n" + marker)
    edit(site / "index.html", '    <section class="practice-banner">',
         '    <div class="actions upload-shortcuts"><a class="button" href="aula-1.html#audio">'
         'Textbook audio by unit →</a></div>\n    <section class="practice-banner">')

    for page, folder, extensions, title, anchor in (
        ("class-slides.html", "slides", SLIDES, "Additional class slides", "class-uploads"),
        ("vocabulary.html", "vocabulary", DOCUMENTS, "Additional vocabulary sheets", "class-uploads"),
        ("review.html", "review", DOCUMENTS, "Additional review materials", "class-uploads"),
    ):
        section = room(site, folder, extensions, title, anchor)
        if section:
            edit(site / page, "  </div>\n  </main>", section + "\n  </div>\n  </main>")

    with (site / "style.css").open("a", encoding="utf-8") as css:
        css.write("""
/* Automatically listed classroom files */
.upload-shortcuts { margin-top: 18px; }
.resource-uploads > .file-list { margin-top: 14px; }
.resource-group { margin: 18px 0 9px; font-size: 1rem; }
.uploaded-resource { grid-template-columns: minmax(0, 1fr) auto; }
.uploaded-resource .file-copy { min-width: 0; }
.uploaded-title { font-size: 1rem; margin: 0; overflow-wrap: anywhere; }
.uploaded-resource audio { display: block; width: min(100%, 380px); margin-top: 9px; }
.audio-unit { border-top: 1px solid var(--line, #dedbd5); }
.audio-unit summary { cursor: pointer; padding: 12px 4px; font-weight: 700; }
.audio-unit > .file-list, .audio-unit > .audio-empty { margin: 0 0 12px; }
.resource-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 735px) {
  .uploaded-resource { grid-template-columns: minmax(0, 1fr); }
  .uploaded-resource .file-actions { grid-column: 1; }
}
""")


def copy_site(source, destination):
    destination.mkdir(parents=True)
    for name in ("index.html", "aula-1.html", "class-slides.html", "vocabulary.html", "review.html",
                 "practice.html", "style.css", "pdf-reader.js", "theme.js"):
        copy2(source / name, destination / name)
    copytree(source / "files", destination / "files",
             ignore=lambda _, names: [name for name in names if name.startswith(".")])
    for name in ("contact.html", "teacher.html", "student-message.js"):
        if (source / name).is_file():
            copy2(source / name, destination / name)
    render_resources(destination)


def redirect(destination, url):
    destination.write_text(
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<meta http-equiv="refresh" content="0; url={url}"><title>Ak’s Spanish Class</title>'
        f'</head><body><p><a href="{url}">Open Ak’s Spanish Class</a></p></body></html>',
        encoding="utf-8",
    )


def preserve_index_links():
    legacy = BUILD_DIR / "index"
    legacy.mkdir()
    redirect(legacy / "index.html", "../")
    for page in BUILD_DIR.glob("*.html"):
        if page.name != "index.html":
            redirect(legacy / page.name, "../" + page.name)
    if Path("index/files").is_dir():
        copytree("index/files", legacy / "files",
                 ignore=lambda _, names: [name for name in names if name.startswith(".")])


def main():
    if BUILD_DIR.exists():
        rmtree(BUILD_DIR)
    if Path("aula-1.html").is_file():
        copy_site(Path("."), BUILD_DIR)
        preserve_index_links()
    elif Path("index/aula-1.html").is_file():
        copy_site(Path("index"), BUILD_DIR / "index")
        redirect(BUILD_DIR / "index.html", "index/")
    else:
        raise SystemExit("Cannot find the class website. Expected aula-1.html at the root or in index/.")


if __name__ == "__main__":
    main()

