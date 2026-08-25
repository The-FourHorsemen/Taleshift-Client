# Taleshift

# Branching Guide

## Branch Naming Convention

All branches should follow this pattern:

```text
<type>/<short-description>
```

Use **lowercase kebab-case** for the description.

## Branch Types

| Type | Purpose | Example |
|---|---|---|
| `feature/` | Add new functionality | `feature/user-authentication` |
| `fix/` | Fix a bug | `fix/login-validation` |
| `refactor/` | Restructure existing code without changing behavior | `refactor/api-service` |
| `chore/` | Maintenance, configuration, or dependency updates | `chore/update-dependencies` |
| `docs/` | Documentation changes | `docs/api-documentation` |
| `test/` | Add or update tests | `test/authentication` |
| `perf/` | Performance improvements | `perf/database-queries` |
| `hotfix/` | Urgent production fixes | `hotfix/payment-failure` |

## How to Create a Branch

### 1. Switch to `main`

Make sure you are starting from the latest version of the main branch.

```bash
git checkout main
git pull origin main
```

### 2. Create your branch

Use the appropriate branch type followed by a short description.

```bash
git checkout -b <type>/<short-description>
```

Example:

```bash
git checkout -b feature/user-authentication
```

### 3. Push the branch to GitHub

```bash
git push -u origin feature/user-authentication
```

Your branch is now available on GitHub.

## Examples

### Adding a New Feature

```bash
git checkout main
git pull origin main
git checkout -b feature/ai-cost-tracking
git push -u origin feature/ai-cost-tracking
```

### Fixing a Bug

```bash
git checkout main
git pull origin main
git checkout -b fix/rate-limit-calculation
git push -u origin fix/rate-limit-calculation
```

### Refactoring Code

```bash
git checkout main
git pull origin main
git checkout -b refactor/api-service
git push -u origin refactor/api-service
```

### Updating Documentation

```bash
git checkout main
git pull origin main
git checkout -b docs/api-documentation
git push -u origin docs/api-documentation
```

## Branch Naming Rules

Follow these rules when creating a branch:

- Use lowercase letters.
- Use `-` to separate words.
- Do not use spaces.
- Do not use underscores.
- Keep the description short and meaningful.
- Use the correct branch type.
- Describe what the branch is for, not who is working on it.

### Good Examples

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

### Avoid

```text
Feature/UserAuthentication
feature_user_authentication
feature/user authentication
my-branch
wally-branch
changes
test
```

## Using Ticket or Issue Numbers

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

## Quick Reference

| Branch Pattern | Use Case |
|---|---|
| `feature/<description>` | New functionality |
| `fix/<description>` | Bug fix |
| `refactor/<description>` | Code restructuring |
| `chore/<description>` | Maintenance |
| `docs/<description>` | Documentation |
| `test/<description>` | Tests |
| `perf/<description>` | Performance |
| `hotfix/<description>` | Urgent production fix |

## Standard Workflow

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

## Recommended Standard

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
