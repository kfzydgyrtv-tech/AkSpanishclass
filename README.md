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

