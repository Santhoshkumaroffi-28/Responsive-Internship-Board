# InternBoard — Responsive Internship Board

A small, responsive internship discovery board built with plain HTML, CSS and JavaScript. It uses the fictional seed records supplied for the EdVyro Full Stack Development Task 1.

## Features

- Responsive layout designed for mobile, tablet and desktop.
- Internship cards are rendered from `internships.json`; seed IDs are preserved.
- Search across title, domain, work mode, location and skills.
- Filter by domain and work mode, with a clear-filters action.
- Loading, empty, error and retry states.
- Keyboard-friendly navigation, visible focus styles, skip link, labelled controls and native accessible dialogs.
- Details dialog and a client-side application form with basic name, email, HTTPS URL and duplicate checks.

## Tech used

- Semantic HTML5
- CSS3 (no CSS framework)
- Vanilla JavaScript
- JSON seed data
- `localStorage` for the demo application state

## Run locally

Because the page loads `internships.json` with `fetch()`, run it through a local web server rather than opening `index.html` directly.

### Option 1: VS Code

Install the Live Server extension, open `index.html`, then choose **Open with Live Server**.

### Option 2: Python

From this folder, run:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Seed data

The `internships.json` file contains the supplied fictional records. The original IDs are retained:

- INT-101
- INT-102
- INT-103
- INT-104
- INT-105

## Important scope note

This is the Task 1 front-end interface. The application form is a browser-only demonstration: it stores a minimal demo record in `localStorage`. It does **not** send applications to a server and does not provide server-side validation, database persistence, authentication, API pagination, or production security. Those features belong in the later API and secure-integration milestones. Do not present the demo form as a production application service.

The brief's server-side requirements (rejecting duplicate applications and invalid data, safe URL validation, and protecting logs) must be implemented and tested on the server in the later backend tasks.

## Accessibility and responsive checks

Manual checks to complete before submission:

- [ ] Keyboard-only: Tab through links, fields and buttons; Enter/Space activate controls; Escape closes dialogs.
- [ ] Screen reader: verify labels, live result count, status messages and dialog names.
- [ ] 360px: no horizontal scrolling.
- [ ] 768px: cards and filters fit without clipping.
- [ ] Desktop: three-column card layout is comfortable.
- [ ] Try a search with no matches and verify the empty state.
- [ ] Temporarily rename `internships.json` to verify the error and retry state, then restore it.

## Screenshots and walkthrough

Add your own screenshots after running and testing the page:

- `screenshots/desktop.png`
- `screenshots/tablet.png`
- `screenshots/mobile-360.png`

For the two-minute walkthrough, show:
1. The home page and responsive layout.
2. Search and domain/work-mode filters.
3. Empty state and retry state.
4. An internship details dialog.
5. The demo application form and its validation message.

## Deployment

Publish the repository with GitHub Pages (Settings → Pages → Deploy from a branch → `main` → `/root`). Add the resulting deployed URL here:

**Live preview:** _Add your GitHub Pages URL after deployment._

## Author

Add your name and LinkedIn/GitHub profile here.
