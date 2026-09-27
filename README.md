# Taleshift

Adaptive literacy app built for the hackathon.

**Hackathon deadline:** September 25

---

## Table of Contents

* [Getting Started](#getting-started)
* [Setup](#setup)
* [Testing the App Locally](#testing-the-app-locally)
* [Mock Accounts (MVP Auth)](#mock-accounts-mvp-auth)
* [UI Screens & Routes](#ui-screens--routes)
* [Dark Mode](#dark-mode)
* [Connecting Supabase](#connecting-supabase)
* [API Routes](#api-routes)
* [Repo Shape](#repo-shape)
* [Critical Path](#critical-path)
* [Running Tests](#running-tests)
* [Branching Guide](#branching-guide)
* [Branch Naming Convention](#branch-naming-convention)
* [How to Create a Branch](#how-to-create-a-branch)
* [Branch Naming Rules](#branch-naming-rules)
* [Using Ticket or Issue Numbers](#using-ticket-or-issue-numbers)
* [Standard Workflow](#standard-workflow)
* [npm Instead of pnpm](#npm-instead-of-pnpm)
* [What's Deliberately Not Built](#whats-deliberately-not-built)

---

# Getting Started

## Prerequisites

Before working on Taleshift, make sure you have the following installed:

* [Node.js](https://nodejs.org/) — use the project's required Node version if one is specified
* npm — included with Node.js
* Git
* PostgreSQL — only required if working with the classroom/database functionality

Verify your installations:

```bash
node --version
npm --version
git --version
```

---

# Setup

## 1. Clone the Repository

Clone the Taleshift repository:

```bash
git clone git@github.com:The-FourHorsemen/Taleshift.git
```

Move into the project directory:

```bash
cd Taleshift
```

## 2. Install Dependencies

Install the project dependencies:

```bash
npm install
```

Run this after cloning the repository and whenever dependencies are added or changed.

If `node_modules` already exists and the project is already set up, you do not need to run `npm install` every time.

## 3. Configure Environment Variables

Create the local environment file from the example:

### macOS / Linux / Git Bash

```bash
cp apps/web/.env.example apps/web/.env.local
```

### Windows PowerShell

```powershell
Copy-Item apps/web/.env.example apps/web/.env.local
```

Open:

```text
apps/web/.env.local
```

and fill in the required API keys and environment variables.

**Do not commit `.env.local` or any secrets to GitHub.**

## 4. Start the Development Server

Run:

```bash
npm run dev
```

The application should be available at:

```text
http://localhost:3000
```

---

# Testing the App Locally

Start at:

```text
http://localhost:3000/login
```

and log in as the parent or a child using the mock credentials below — see
[Mock Accounts](#mock-accounts-mvp-auth). Real Supabase Auth has been
deliberately removed for this MVP; login checks against hardcoded mock data
instead (see [What's Deliberately Not Built](#whats-deliberately-not-built)).

The UI is fully built out for all three personas (learner, parent, teacher)
with mocked data — see [UI Screens & Routes](#ui-screens--routes) below for
the full route list and screenshots.

If a route in the table below 404s, something is actually broken.

---

# Mock Accounts (MVP Auth)

Auth is mocked for this MVP — there's no real sign-up flow and no Supabase
Auth call in the login path. `apps/web/lib/mock-data.ts` is the single
source of truth; the login API routes
(`app/api/auth/{parent-login,student-login}/route.ts`) just check submitted
credentials against it.

**Parent** — log in at `/login/parent`:

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `parent@taleshift.dev` |
| Password | `ReadWithMe123`        |

**Children** — pick a name at `/login/student`, then enter the PIN:

| Name  | Avatar | PIN    | Age | Grade   |
| ----- | ------ | ------ | --- | ------- |
| Alex  | 🐨     | `1234` | 8   | Grade 3 |
| Jamie | 🦊     | `1234` | 10  | Grade 5 |

Both children are linked to the mock parent above. To add more mock
learners or change credentials, edit `MOCK_CHILDREN`/`MOCK_PARENT` in
`apps/web/lib/mock-data.ts` — nothing else needs to change.

---

# UI Screens & Routes

All screens are built with mocked/hardcoded data (see the `TODO(owner:
unassigned)` comments scattered through `apps/web` for exactly what each
screen still needs wired to real data). Nothing below talks to a real
backend yet.

## Sign-in

| Route | Screen |
| --- | --- |
| `/login` | Role picker — student / parent / teacher |
| `/login/student` | "Who's reading today?" — pick your name, then enter your **PIN** |
| `/login/parent`, `/login/teacher` | Email/password login |
| `/login/sign-up` | Account creation UI (parent flow is 3 steps: account → link child(ren) → child support-needs questionnaire) — **not wired**, use the mock accounts instead |
| `/login/forgot-password` | Password reset |
| `/logout` | Logged-out confirmation |

<img src="docs/screenshots/login-role-picker.png" width="600" alt="Login role picker" />
<img src="docs/screenshots/student-pin-entry.png" width="320" alt="Student PIN entry" />
<img src="docs/screenshots/signup-child-questionnaire.png" width="600" alt="Parent sign-up: child support-needs questionnaire" />

**Auth for this MVP is mocked** — see [Mock Accounts](#mock-accounts-mvp-auth).
`/login/parent` and `/login/student` check submitted credentials against
`apps/web/lib/mock-data.ts` instead of Supabase; the child's session is a
plain httpOnly cookie holding the learner id
(`apps/web/lib/auth/student-session.ts`), not a signed JWT.

## Learner (child)

| Route | Screen |
| --- | --- |
| `/` | Home — continue reading, today's goal, weekly activity, recommended story |
| `/read`, `/read/[storyId]` | Reading session — real mic recording, live word highlighting, word bookmarking |
| `/summary/[storyId]` | Spoken book-summary recording, prompted after finishing a story |
| `/feedback` | Post-reading summary ("Great job!") |
| `/words`, `/words/practice` | My Words list (bookmarked + mocked words) + practice flow with pronunciation recording |
| `/profile` | Learner profile — badges, streak, "Switch Reader" |

<img src="docs/screenshots/learner-home.png" width="600" alt="Learner Home" />
<img src="docs/screenshots/reading-session.png" width="280" alt="Reading Session" />
<img src="docs/screenshots/post-reading-summary.png" width="280" alt="Post-Reading Summary" />

The learner nav was rebuilt to match the teacher/parent shell pattern — a
persistent sidebar at desktop widths (branding, streak, nav, "Switch
Reader") with a mobile bottom bar at small widths, instead of the previous
bottom-nav-only layout.

### Reading Session mic features

`/read/[storyId]` (`components/reading/ReadingSession.tsx`) records the
child reading aloud via `MediaRecorder`, then runs the audio through the
real ASR pipeline (transcribe → score → level) — see
[Critical Path](#critical-path) below. On top of that:

* **New words** (per-story vocab list) are highlighted **blue**.
* **Struggle words** (from the learner's `struggleWords` on file, or a
  fallback list if the DB isn't reachable) are highlighted **red**.
* Any word can be **clicked to bookmark/un-bookmark** it
  (`components/reading/HighlightedStoryText.tsx`) — persisted via
  `POST /api/words/bookmark` to the `bookmarkedWords` table, and surfaced
  on **My Words** (`/words`) for later practice.
* On finishing, the full-reading audio is saved (best-effort, non-blocking)
  via `POST /api/reading-summary` with `kind=full_reading`, then the child
  is routed to `/summary/[storyId]` to record a spoken summary before
  landing on `/feedback`.
* **Practice My Words** (`/words/practice`,
  `components/practice/VocabularyPractice.tsx`) lets the child record
  themselves saying each word for self-check playback — local-only
  (not uploaded), reset between words.

## Parent

Parents get the same depth as teachers, scoped to their own linked
child(ren) instead of a whole classroom.

| Route | Screen |
| --- | --- |
| `/parent` | Dashboard — weekly stats, reading profile, struggle insight, adaptive engine |
| `/parent/children` | My Children — roster of linked learners |
| `/parent/children/[childId]` + `/progress`, `/reading-log`, `/roadmap` | Per-child deep dive (mirrors the teacher's per-student tabs) |
| `/parent/library` | Reading Library — browse, filter, preview, assign stories; **upload custom PDF books** |
| `/parent/settings`, `/parent/messages`, `/parent/help`, `/parent/add-child` | Account, messages from the teacher, FAQ, link another child |

<img src="docs/screenshots/parent-dashboard.png" width="600" alt="Parent Dashboard" />

## Teacher

| Route | Screen |
| --- | --- |
| `/teacher` | Class overview |
| `/teacher/students` | Class roster |
| `/teacher/students/[studentId]` + `/progress`, `/reading-log`, `/roadmap`, `/interventions` | Per-student deep dive |
| `/teacher/interventions` | Class-wide intervention planner |
| `/teacher/library` | Reading Library (same component as the parent's, see below) |
| `/teacher/reading-groups`, `/teacher/resources`, `/teacher/settings`, `/teacher/help` | Supporting pages |

<img src="docs/screenshots/teacher-dashboard.png" width="600" alt="Teacher Dashboard" />
<img src="docs/screenshots/student-profile.png" width="600" alt="Student Profile" />
<img src="docs/screenshots/teacher-interventions.png" width="600" alt="Teacher Interventions" />

## Reading Library (shared by parent + teacher)

`components/library/LibraryBrowser.tsx` powers both `/teacher/library` and
`/parent/library`. It's backed by `apps/web/lib/stories.ts` — **10 original
stories, leveled 1–10**, each with real paragraph content, a genre, and a
vocab focus.

* **Filters are functional** — Level (banded), Genre, and Duration all
  actually filter the grid, with a "Clear filters" reset.
* **Preview** opens a modal with the full story text, not just a summary.
* **Assign** is a toggle per story (mocked — no persistence yet).
* **Parents only:** "Add Custom Book (PDF)" opens an upload modal (title +
  level + PDF file) that adds the book to the grid alongside the built-in
  stories. The file itself isn't persisted anywhere yet — see the `TODO` in
  `UploadBookModal.tsx` for wiring it to Supabase Storage.

<img src="docs/screenshots/reading-library.png" width="600" alt="Reading Library" />

---

# Dark Mode

Every screen supports light and dark mode, toggled from a moon/sun button
in each persistent nav shell (teacher, parent, learner, top app bar, and
the `/login` role picker). It respects the OS `prefers-color-scheme` on
first visit and persists the explicit choice to `localStorage`
(`taleshift-theme`).

Implementation: `apps/web/app/globals.css` defines the app's color tokens
(`--color-app-bg`, `--color-text-primary`, etc.) once, then redefines them
under a `.dark` class — so any component using the semantic tokens
(`bg-app-bg`, `text-text-secondary`, `border-border-light`, …) re-themes
automatically with no per-component `dark:` classes needed. Components that
use raw Tailwind colors or arbitrary hex values (a few of the more
illustration-heavy cards) have explicit `dark:` overrides added alongside
them instead. `ThemeToggle` (`components/ui/ThemeToggle.tsx`) is the toggle
button; a small inline script in `app/layout.tsx` applies the stored/system
preference before paint to avoid a light-mode flash.

<img src="docs/screenshots/dark-mode.png" width="600" alt="Dark mode" />

---

# Connecting Supabase

**Note:** parent/student auth for this MVP is mocked (see
[Mock Accounts](#mock-accounts-mvp-auth)) and does **not** go through
Supabase Auth anymore — connecting a project below does not change how
login works. What connecting Supabase *does* enable: persisting reading
summaries, full-reading audio, and bookmarked words for real, plus the
other schema-backed features listed below.

The schema and API routes below are fully scaffolded against Supabase
(Postgres) - nothing has been run against a live project yet. To connect
one:

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
   if you don't have one.
2. **Fill in `apps/web/.env.local`** (copy from `.env.example` if you
   haven't) with three things from your project's dashboard:
   * `DATABASE_URL` - Project Settings -> Database -> Connection string
     -> "URI" tab.
   * `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` -
     Project Settings -> API.
   * `STUDENT_SESSION_SECRET` - any long random string, e.g.
     `openssl rand -hex 32`.
3. **Push the schema:**
   ```bash
   npm run db:push --workspace=@taleshift/db
   ```
   (or `npm run db:generate` first if you want to review the migration
   SQL before applying it).
4. Restart `npm run dev`. "My Children" / "Class Roster" now read/write
   real rows instead of the mocked fallbacks, and the features below start
   persisting for real instead of gracefully falling back to mocks.

**What's real once connected:**

* **Reading summaries and full-reading audio** — the spoken-summary
  recording (`/summary/[storyId]`) and the full reading-session recording
  (both via `POST /api/reading-summary`, distinguished by the `kind`
  column: `"summary"` vs `"full_reading"`) are saved to the
  `readingSummaries` table and surfaced on the parent's Reading Log
  (`/parent/children/[childId]/reading-log`) and Recent Sessions card with
  an inline audio player.
* **Bookmarked words** — clicking a word on the reading page
  (`POST /api/words/bookmark`) writes to the `bookmarkedWords` table and
  shows up on `/words` for later practice.
* The parent sign-up questionnaire (age/gender/race/support needs) and
  "Add Another Child" write directly into `learnerProfiles`.
* "My Children" and "Class Roster" query `learnerProfiles`, falling back
  to mock data only if the query fails (e.g. not connected yet) - see the
  `loadChildren` / `loadRoster` functions in
  `components/parent/ChildRoster.tsx` and
  `components/roster/StudentRoster.tsx`.

**What's still mocked even once connected** - see the `TODO(owner:
unassigned)` comments at each site for specifics:

* **Parent/student login itself** — see [Mock Accounts](#mock-accounts-mvp-auth);
  this does not read from Supabase Auth regardless of whether a project is
  connected.
* Reading/vocabulary stats, "status" (On Track/Excelling/Needs
  Support), and fluency numbers everywhere - there's no analytics
  pipeline over `readingSessions` yet, just the schema for one.
* Story assignments, custom PDF book uploads (nothing is written to
  Supabase Storage yet), messages, and intervention notes - the tables
  exist (`assignments`, `customBooks`, `messages`,
  `interventionNotes`) but the UI for them isn't wired to real queries.
* `apps/web/lib/stories.ts`'s story catalog is still a static in-memory
  array, not read from the `stories` table.
* Recorded audio (summaries and full readings) is saved to
  `apps/web/public/audio-summaries` / `apps/web/public/reading-audio` on
  local disk, **not** Supabase Storage — an explicit MVP placeholder (see
  `customBooks.fileUrl` in `packages/db/src/schema.ts` for the intended
  long-term pattern). This won't survive across multiple server instances
  or a redeploy.

---

# API Routes

Most routes below are wired to the UI (mic recording, word bookmarking).
The classroom routes still have no dedicated UI — test those directly
using tools such as `curl` or Postman.

| Route                                      | Method   | Notes                                                                          |
| ------------------------------------------ | -------- | ------------------------------------------------------------------------------ |
| `/api/asr`                                 | POST     | Proxies to the real FastAPI ASR service (`TALESHIFT_ASR_SERVICE_URL`); used by the reading session |
| `/api/reading-summary`                     | POST     | Saves a child's recorded audio (`kind`: `"summary"` or `"full_reading"`) to disk + `readingSummaries`, best-effort transcription |
| `/api/words/bookmark`                      | POST     | Toggles a bookmarked word for a learner (`bookmarkedWords` table)               |
| `/api/score`                               | POST     | Requires `transcript` + `referenceText`; see `apps/web/app/api/score/route.ts` |
| `/api/level`                               | POST     | Requires `{ score, currentLevel }`                                             |
| `/api/nlp`                                 | POST     | Stubbed; throws until the comprehension check is completed                     |
| `/api/classroom`                           | POST/GET | Create/list classrooms; requires `DATABASE_URL`                                |
| `/api/classroom/[classroomId]/students`    | POST     | Add a student to a roster                                                      |
| `/api/classroom/[classroomId]/assignments` | POST/GET | Assign a story or resolve a student's active assignments                       |

The ASR service itself (`TALESHIFT_ASR_SERVICE_URL`, e.g.
`http://localhost:8000`) is a separate Python FastAPI project, not part of
this repo — `/api/asr` and `packages/asr_client` just call out to it.
Without it set, `/api/asr` and the reading session's transcription fail
closed (caught, surfaced as a failed/skipped step, never blocking the UI).

## Classroom API Requirements

The classroom routes require:

1. A valid `DATABASE_URL` in `apps/web/.env.local`
2. A running PostgreSQL instance
3. Drizzle schema generation
4. Drizzle schema migration/push

Run:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

> Make sure your `DATABASE_URL` points to the PostgreSQL instance you intend to use before running these commands.

---

# Repo Shape

Taleshift is an **npm workspace managed with Turborepo**.

The repository contains one application and several packages.

Each package has an ownership boundary to reduce merge conflicts.

**If you need functionality from another person's package, import it rather than editing their package directly. Open an issue or communicate with the owner when changes are required.**

| Package                     | Owner                                       | Status                                                               |
| --------------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `packages/shared_types`     | Shared — changes need review                | Done, stable                                                         |
| `packages/asr_client`       | Person 1 — ASR/validation lead              | Real FastAPI HTTP client wired up (`transcribeAudio`); `assessPronunciation`/`transcribeSummaryAudio` still stubbed |
| `packages/alignment_engine` | Shared core logic                           | Done, 5 tests passing                                                |
| `packages/nlp_layer`        | Person 4                                    | Hedging + scoring done, 9 tests passing; comprehension check stubbed |
| `packages/leveling_engine`  | Person 5                                    | Leveling rules + assignment resolution done, 10 tests passing        |
| `packages/db`               | Person 5                                    | Schema covers parents/teachers/learners/classrooms/assignments/custom books/messages, plus typed query helpers (`src/queries.ts`); not yet migrated to a live Supabase project — see [Connecting Supabase](#connecting-supabase) |
| `apps/web`                  | Person 2 + everyone for their own API route | Full UI built for all 3 personas + auth (see [UI Screens & Routes](#ui-screens--routes)); API routes wired but not yet connected to the UI; no real backend/auth yet — see [What's Deliberately Not Built](#whats-deliberately-not-built) |

---

# Critical Path

Real data flows through:

```text
asr_client (real FastAPI HTTP client)
     ↓
alignment_engine
     ↓
nlp_layer
```

`packages/asr_client` now calls a live Python FastAPI ASR service
(`TALESHIFT_ASR_SERVICE_URL`) instead of the originally-planned Azure
Speech SDK integration — `assessPronunciation` and `transcribeSummaryAudio`
are still stubs (see the `TODO`s in `packages/asr_client/src/client.ts`).
If the ASR service isn't running locally, build against mocked
`TranscriptResult` objects instead of blocking on it.

The type definition can be found at:

```text
packages/shared_types/src/transcript.ts
```

---

# Running Tests

Run the entire test suite:

```bash
npm test
```

Run tests for a specific package:

```bash
npm run test --workspace=@taleshift/alignment-engine
```

---

# Branching Guide

## Branch Naming Convention

All branches must follow this pattern:

```text
<type>/<short-description>
```

Use **lowercase kebab-case** for the description.

---

## Branch Types

| Type        | Purpose                                             | Example                       |
| ----------- | --------------------------------------------------- | ----------------------------- |
| `feature/`  | Add new functionality                               | `feature/user-authentication` |
| `fix/`      | Fix a bug                                           | `fix/login-validation`        |
| `refactor/` | Restructure existing code without changing behavior | `refactor/api-service`        |
| `chore/`    | Maintenance, configuration, or dependency updates   | `chore/update-dependencies`   |
| `docs/`     | Documentation changes                               | `docs/api-documentation`      |
| `test/`     | Add or update tests                                 | `test/authentication`         |
| `perf/`     | Performance improvements                            | `perf/database-queries`       |
| `hotfix/`   | Urgent production fixes                             | `hotfix/payment-failure`      |

---

# How to Create a Branch

## 1. Switch to `main`

Always start from the latest version of `main`.

```bash
git checkout main
git pull origin main
```

## 2. Create Your Branch

Use the appropriate branch type followed by a short description:

```bash
git checkout -b <type>/<short-description>
```

Example:

```bash
git checkout -b feature/user-authentication
```

## 3. Push the Branch to GitHub

```bash
git push -u origin feature/user-authentication
```

Your branch is now available on GitHub.

---

# Branch Examples

## Adding a New Feature

```bash
git checkout main
git pull origin main
git checkout -b feature/ai-cost-tracking
git push -u origin feature/ai-cost-tracking
```

## Fixing a Bug

```bash
git checkout main
git pull origin main
git checkout -b fix/rate-limit-calculation
git push -u origin fix/rate-limit-calculation
```

## Refactoring Code

```bash
git checkout main
git pull origin main
git checkout -b refactor/api-service
git push -u origin refactor/api-service
```

## Updating Documentation

```bash
git checkout main
git pull origin main
git checkout -b docs/api-documentation
git push -u origin docs/api-documentation
```

---

# Branch Naming Rules

Follow these rules when creating a branch:

* Use lowercase letters.
* Use `-` to separate words.
* Do not use spaces.
* Do not use underscores.
* Keep the description short and meaningful.
* Use the correct branch type.
* Describe what the branch is for, not who is working on it.

## Good Examples

```text
feature/user-authentication
feature/payment-integration
fix/login-validation
fix/database-connection
refactor/api-service
chore/update-dependencies
docs/setup-guide
test/user-service
```

## Avoid

```text
Feature/UserAuthentication
feature_user_authentication
feature/user authentication
my-branch
wally-branch
changes
test
```

---

# Using Ticket or Issue Numbers

If the project uses GitHub Issues, Jira, Linear, or another ticketing system, include the ticket number in the branch name:

```text
<type>/<ticket-id>-<short-description>
```

Examples:

```text
feature/AI-142-token-cost-estimation
fix/AI-157-rate-limit-bug
refactor/AI-163-provider-interface
```

This makes it easier to associate branches with their corresponding tasks or issues.

---

# Quick Branch Reference

| Branch Pattern           | Use Case              |
| ------------------------ | --------------------- |
| `feature/<description>`  | New functionality     |
| `fix/<description>`      | Bug fix               |
| `refactor/<description>` | Code restructuring    |
| `chore/<description>`    | Maintenance           |
| `docs/<description>`     | Documentation         |
| `test/<description>`     | Tests                 |
| `perf/<description>`     | Performance           |
| `hotfix/<description>`   | Urgent production fix |

---

# Standard Git Workflow

```bash
# Switch to the main branch
git checkout main

# Get the latest changes
git pull origin main

# Create a new branch
git checkout -b <type>/<short-description>

# Make your changes

# Stage your changes
git add .

# Commit your changes
git commit -m "Add <description>"

# Push your branch to GitHub
git push -u origin <type>/<short-description>
```

Example:

```bash
git checkout main
git pull origin main

git checkout -b feature/reading-session

# Make your changes

git add .
git commit -m "Add reading session flow"
git push -u origin feature/reading-session
```

---

# npm Instead of pnpm

Taleshift currently uses **npm** rather than pnpm.

This is more than a syntax difference.

npm's `node_modules` structure uses hoisting, which can allow a package to import something it has not explicitly declared as a dependency, as long as another package in the dependency tree happens to install it.

pnpm uses a stricter, less-hoisted dependency structure that can expose these problems earlier.

Therefore:

> If a package works locally but fails when deployed or isolated, check that its own `package.json` explicitly declares every dependency it imports.

Do not rely on another package's dependency installation.

---

# What's Deliberately Not Built

## Real Backend / Auth for the UI

**Parent/student auth is intentionally mocked for this MVP** — no
Supabase Auth call in the login path, no sign-up flow, no hashed PINs.
`/login/parent` and `/login/student` check credentials against
`apps/web/lib/mock-data.ts` (see [Mock Accounts](#mock-accounts-mvp-auth)),
and the child's session is a plain httpOnly cookie
(`apps/web/lib/auth/student-session.ts`), not a signed JWT. This was a
deliberate scope cut to unblock the rest of the app (recording, scoring,
leveling) without needing a live Supabase project set up first.

The teacher/parent rosters, reading summaries, and bookmarked words are
still schema-backed against Supabase (Postgres only, not Auth) - see
[Connecting Supabase](#connecting-supabase) for what's real, what's
still mocked, and how to point it at an actual project. Nothing in this
repo has been run against a live Supabase project yet; it's scaffolded
and ready to connect.

## Prosodic Confidence Scoring

Prosodic confidence scoring was intentionally scoped out of this hackathon build.

This includes:

* Pitch
* Jitter
* Shimmer
* Pause detection

The confidence signal for the hackathon currently comes from:

* Hedging language detection
* ASR word confidence
* ASR accuracy confidence

If prosodic analysis needs to be revisited after September 25, review the previous project discussions and reassess the scope.

---

# Development Principles

To keep the team moving quickly during the hackathon:

1. **Work from a feature branch.**
2. **Do not commit directly to `main`.**
3. **Keep branches focused on one task.**
4. **Follow the branch naming convention.**
5. **Do not edit another person's package without communicating with them.**
6. **Use mocks when an upstream integration is not ready.**
7. **Keep dependencies explicitly declared in each package.**
8. **Never commit API keys, passwords, or other secrets.**
9. **Run tests before pushing changes.**
10. **Pull the latest `main` before starting new work.**

---

# Recommended Standard

Use:

```text
<type>/<short-description>
```

For example:

```text
feature/user-authentication
```

If the project uses tickets or issues:

```text
feature/AI-142-user-authentication
```

This convention should be used consistently across the Taleshift repository.
