# Ak’s Spanish Class

## Upload the site to GitHub

1. Extract the ZIP and copy its contents into the top level of the AkSpanishclass repository on the `main` branch. At the top level you should see `index.html`, `aula-1.html`, `style.css`, `files/`, and `.github/`. The files in this package go directly in the repository root.
2. Include the hidden `.github/` folder. In Finder, press **Command + Shift + .** to show hidden files. If GitHub’s web uploader skips the hidden folder, create its two files from the **Code** tab using **Add file → Create new file**. Enter the full paths and paste the matching files from this package.
   - `.github/build_class_site.py`
   - `.github/workflows/publish-class-site.yml`
3. Commit the upload to `main`. Under **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. Under **Actions → Publish class website**, run the workflow on `main` if a deployment hasn't started.
4. After the run completes, open the site from **Settings → Pages**. The short root URL opens the homepage. The previously shared `/index/` URL also leads to the site.

Use the two workflow files from this package together. GitHub Actions builds and publishes the resource listings. There is no local build step required for uploads.

## Add class materials

Open **Teacher Access** on the website and choose an upload destination. In GitHub, sign in with an account that can write to the repository, select your file, and commit the upload to `main`. The Pages workflow will update the corresponding page.

| Repository folder | Website destination and file types |
| --- | --- |
| `files/books/` | **Aula 1** · PDF books |
| `files/audio/` | **Aula 1 → Textbook audio by unit** · MP3, M4A, WAV, OGG, AAC, and Opus tracks with players |
| `files/slides/` | **Class Slides** · PDF, PPTX, PPT, and ODP |
| `files/vocabulary/` | **Vocabulary Sheets** · PDF, DOCX, and DOC |
| `files/review/` | **Review Materials** · PDF, DOCX, and DOC |

Keep files directly in the appropriate category folder. To group a file under Unit 1, name it `unit-01--Definite articles.pdf`. The page shows **Definite articles** under **Unit 1**. Leave off the prefix for general resources. Existing unit subfolders still work. Number tracks in their filenames to set their order. Give a PowerPoint and its PDF preview the same basename in the same folder to put both formats on one card. Use the same path and filename to replace an existing resource.

For audio, name files like `unit-03--Track 02.mp3`. The **Textbook audio by unit** section shows **Track 02** under **Unit 3**. Units 0 to 9 are available from the start, and audio with no unit prefix appears under **General audio**.

The Grade 10 Unit 1 quiz and Grade 12 presentation rubric are linked under **Review Materials → Assessment archive**. The corrected subject-pronoun reference is on **Vocabulary Sheets**.

The site and its repository are public. Use the book and audio folders for material you can share publicly. GitHub's browser uploader allows files up to 25 MiB each. The Campus Difusión and local PDF-reader options remain available on the Aula 1 page.

## Student messages and teacher access

The **Contact Me** page opens a prepared email draft addressed to the teacher. Students send it from their email app. Messages go to the teacher’s mailbox and are not stored on the website or in GitHub.

The **Teacher Access** page links directly to GitHub’s upload screens. GitHub authenticates the uploader and enforces repository write permissions.

## Interactive Spanish games

The **Games** navigation opens `arcade.html`, a retro arcade gallery for nine original, self-hosted vocabulary and grammar games. Each card links to `games.html?unit=0&game=scramble`-style routes. The **Extra Practice** page keeps direct links inside the relevant AULA units.

Game content lives in the `DATA` dictionary in `games.js` (units 0–9). The same nine game engines can be reused across units. The player can change the unit and switch between A1 and A1+ difficulty. No student login, external game service, or score-storage backend is used.

The Pages builder (`.github/build_class_site.py`) automatically copies all top-level HTML, CSS, and JavaScript files into the deployed site. This is important: a file in the repository is **not available on GitHub Pages** unless it is copied into `_class_site` by the publishing workflow. New root-level game pages and styles are now included automatically.

To check the games before deploying, run:

```bash
node --check games.js
node tests/game-smoke.cjs
python3 .github/build_class_site.py
python3 tests/check_published_site.py
```

GitHub Actions runs these checks on each push to `main` before publishing. The first smoke test covers all nine game modes, ten AULA units, and two difficulty settings; the second verifies published assets and internal game links.

### Add a PDF resource

Upload the PDF to the folder for the page where it should appear.

| Folder | Website page |
| --- | --- |
| `files/review/` | Review Materials |
| `files/vocabulary/` | Vocabulary Sheets |
| `files/slides/` | Class Slides |
| `files/practice/` | Extra Practice, under Worksheets |

GitHub Pages builds the listing when it publishes `main`. Use a descriptive filename, such as `El, la, los y las.pdf`, because the site uses the filename as the card title. Spaces and Spanish accents are supported. Removing the file removes its card on the next deployment.



### Endless Free Play (A1–C2) and high scores

**Free Play** (`freeplay.html`) is now an endless Spanish challenge separate from the AULA units. It unlocks after **30 unique correct responses across three different unit-game types**. Repeating the same answer in the same game and unit does not increase unlock progress.

**Progression:** rounds 1–10 A1, 11–20 A2, 21–30 B1, 31–40 B2, 41–50 C1, and rounds 51+ C2. Every ten rounds, difficulty/time pressure rises by exactly 0.3% compounded (`1.003 ^ increments`), until C2. The multiplier is capped at `1.003 ^ 5` from round 51 onward; the C2 question deck is reshuffled and repeated indefinitely. Questions gradually shift from straightforward forms and vocabulary to complex agreement, subjunctive, literary/academic register, inferencing and discourse nuances. This is targeted practice, **not an official CEFR or DELE level assessment**.

Correct answers receive 100 points plus a streak bonus, adjusted by the same capped multiplier. Each run has three lives. Written responses are checked with Unicode NFC normalization, case-folding, whitespace trim and ignorable punctuation but **never remove Spanish accents**. For example `esta` is not accepted for `está`. On-screen keys are available for `á é í ó ú ü ñ ¿ ¡`.

The original A1–B1 grammar-book reference `Gramática básica del estudiante de español` informed practice on articles, agreement, ser/estar, pronouns, indicative tenses, future/conditional, subjunctive, and imperatives. For B2–C2, the original question writing was informed by the Instituto Cervantes Plan Curricular and Council of Europe CEFR level descriptors:

- https://cervantes.org/es/sobre-nosotros/publicaciones/plan-curricular-instituto-cervantes-niveles-referencia-espanol
- https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale/
- https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/indice.htm

The question files are `freeplay.js` (initial curated examples), `freeplay-bank.js` (algorithmically produced original tenses, agreement, vocabulary), and `freeplay-advanced.js` (original advanced grammar, diacritical-accent distinctions, register, reading and inference). Answer keys are client-visible because this site is static; do not use Free Play as a secure exam or graded test.

**Two distinct scoreboards:**

1. **Local high scores:** each browser stores its top ten scores and three-letter initials in `localStorage` (`ak-spanish-arcade-v1`). These are not tamper-resistant.
2. **Class records published on the website:** `arcade-class-highscores.json` is shipped with GitHub Pages and read by every visitor. The teacher can add entries, then commit the file; after deployment, all visitors see the same approved top ten. To add scores, use entries such as `{"initials":"ABC","score":25800}` in the JSON array. Only teacher-approved entries should be published. The public site **cannot automatically accept scores from other students** without a database/API; players can copy their score slip to share it with the teacher for optional review.

To test locally:

```bash
node --check freeplay.js
node --check freeplay-bank.js
node --check freeplay-advanced.js
node tests/arcade-smoke.cjs
```

The GitHub Pages workflow runs these tests plus site-asset and live-URL checks.


## Spanish Language Lab

A new standalone site section, `language-lab.html`, provides four learning tools using only original code and self-hosted data:

- **Dictionary:** accent-insensitive Spanish→English and English→Spanish lookup, including approximately 4,500 FreeDict headwords plus 119 independently written classroom-reviewed terms, gender or part of speech where checked, usage examples, local-browser favorites, pagination, and optional browser audio.
- **Translator:** exact-match translations for 38 reviewed classroom expressions and dictionary headwords. It does **not** generate arbitrary sentence translations or pretend to connect to an external machine-translation API.
- **Pronunciation:** browser SpeechSynthesis using Spanish voices, speed control, IPA phoneme explanations, stress rules, and sample words. Availability depends on installed device voices. No third-party audio has been scraped or reproduced.
- **Grammar:** nine short guides and verified regular/irregular conjugations for present, preterite, imperfect, future, and present subjunctive. Unsupported verbs show an explanation rather than fabricated inflections.

The dictionary source is FreeDict Spanish–English v0.3.1, 4,502 headwords, © FreeDict contributors 1999–2019, distributed under GPL-2.0-or-later. The derived JSON includes metadata; a complete license and extraction notes are available at `freedict-gpl-2.0.txt` and `language-lab-license.md`. The source TEI is publicly available at [FreeDict on GitHub](https://github.com/freedict/fd-dictionaries/blob/master/spa-eng/spa-eng.tei). Older FreeDict content may contain limited or ambiguous glosses, which is why common student words are independently curated. The original HTML/CSS/JS and curated content remain clearly separated from the FreeDict-derived data.

For an **offline/local test**, run:

```bash
node --check language-lab.js
node tests/language-lab-smoke.cjs
python3 .github/build_class_site.py
python3 tests/check_published_site.py
```

The GitHub Pages publish workflow runs these smoke checks and checks the public Language Lab URLs. Full-sentence machine translation is a potential second phase requiring a suitable service and connectivity testing, especially for mainland-China use.
