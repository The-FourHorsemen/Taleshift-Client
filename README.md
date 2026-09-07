# Taleshift

Adaptive literacy app built for the hackathon.

**Hackathon deadline:** September 25

---

## Table of Contents

* [Getting Started](#getting-started)
* [Setup](#setup)
* [Testing the App Locally](#testing-the-app-locally)
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

Visiting:

```text
http://localhost:3000/
```

may return a `404`.

**This is expected and is not currently a bug.**

The `(child)` and `(dashboard)` folders are Next.js route groups. The parentheses mean that the folders organize files without adding a URL segment.

There is currently no page registered for the bare `/` path.

Use the available routes instead:

| URL             | What it should show                           |
| --------------- | --------------------------------------------- |
| `/read/story-1` | Reading session placeholder                   |
| `/feedback`     | Post-session results placeholder              |
| `/progress`     | Parent/teacher progress dashboard placeholder |

These are currently placeholders rather than full features.

If one of these routes returns a `404` instead of displaying its expected placeholder, then something is actually broken.

---

# API Routes

API routes currently have no dedicated UI. Test them directly using tools such as `curl` or Postman.

| Route                                      | Method   | Notes                                                                          |
| ------------------------------------------ | -------- | ------------------------------------------------------------------------------ |
| `/api/asr`                                 | POST     | Stubbed; throws until Azure integration is completed                           |
| `/api/score`                               | POST     | Requires `transcript` + `referenceText`; see `apps/web/app/api/score/route.ts` |
| `/api/level`                               | POST     | Requires `{ score, currentLevel }`                                             |
| `/api/nlp`                                 | POST     | Stubbed; throws until the comprehension check is completed                     |
| `/api/classroom`                           | POST/GET | Create/list classrooms; requires `DATABASE_URL`                                |
| `/api/classroom/[classroomId]/students`    | POST     | Add a student to a roster                                                      |
| `/api/classroom/[classroomId]/assignments` | POST/GET | Assign a story or resolve a student's active assignments                       |

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
| `packages/asr_client`       | Person 1 — ASR/validation lead              | Stubbed, blocked on Azure validation                                 |
| `packages/alignment_engine` | Shared core logic                           | Done, 5 tests passing                                                |
| `packages/nlp_layer`        | Person 4                                    | Hedging + scoring done, 9 tests passing; comprehension check stubbed |
| `packages/leveling_engine`  | Person 5                                    | Leveling rules + assignment resolution done, 10 tests passing        |
| `packages/db`               | Person 5                                    | Schema includes classrooms/roster/assignments; not yet migrated      |
| `apps/web`                  | Person 2 + everyone for their own API route | Routes wired, including classroom LMS; UI is placeholder             |

---

# Critical Path

`asr_client` blocks the real data flow through:

```text
asr_client
     ↓
alignment_engine
     ↓
nlp_layer
```

Until the Azure validation is completed, other developers should build against mocked `TranscriptResult` objects.

The type definition can be found at:

```text
packages/shared_types/src/transcript.ts
```

**Do not wait for the ASR integration to be completed before continuing development.**

Use mocked data and continue building your assigned functionality.

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
