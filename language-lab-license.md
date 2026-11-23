# FreeDict source and redistribution information

This site's Spanish–English dictionary dataset (`language-lab-dictionary.json`) is a machine-readable transformation of the FreeDict Spanish–English 0.3.1 TEI dictionary, dated 2019-04-30, with 4,502 headwords.

- Original FreeDict project: https://freedict.org/
- Upstream source (complete original TEI): https://github.com/freedict/fd-dictionaries/blob/master/spa-eng/spa-eng.tei
- Upstream license: **GNU General Public License, version 2 or later (GPL-2.0-or-later)**.
- Upstream copyright: © 1999–2019 FreeDict contributors, various authors (see upstream TEI header and revision history).
- Download the full upstream source through the link above. The site's transformed JSON is itself provided in this public repository.
- Full license text: [GNU GPL version 2](freedict-gpl-2.0.txt).
- Transformation: for each TEI `<entry>`, take its `<orth>` headword and each `<cit type="trans"><quote>` translation; decode XML entities, strip TEI markup, normalize whitespace, deduplicate exact translations, and serialize into `[headword,[translations]]` entries.
- Modification notices: entry metadata and unsupported TEI markup were omitted to build an efficient, searchable client-side data file. This is **not an endorsement or maintenance claim by FreeDict**.
- The separate classroom curated examples, phrase translations, grammar notes, and interface code are independent original educational material, and are distinguished in the UI.

**Quality note:** This particular FreeDict release is older and some translations may be incomplete, dated, or context-dependent. We prioritize explicit classroom-reviewed entries in the UI and label generic dictionary entries as FreeDict. A word-level bilingual dictionary is **not** a general sentence translation engine.

**Accessibility note:** The dictionary search, curated phrase translations, grammar guides and pronunciation chart work offline after loading the site assets. Spoken audio is generated locally by the browser when a suitable Spanish speech voice is available; no recordings from Forvo, WordReference, or the University of Iowa have been copied.
