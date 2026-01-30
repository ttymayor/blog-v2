---
name: install-dependencies
description: Installs project dependencies using pnpm. Use when setting up a new project, adding packages, or resolving dependency issues.
---

# Install Dependencies with pnpm

## When to use this skill

Use this skill when:
- Setting up a new project that uses pnpm
- Installing dependencies from package.json
- Adding new packages to a project
- Resolving dependency conflicts

## Installation commands

### Install all dependencies

```bash
pnpm install
```

### Add a new dependency

```bash
pnpm add <package-name>
```

### Add a dev dependency

```bash
pnpm add -D <package-name>
```

### Update dependencies

```bash
pnpm update
```

## Common issues
- If `pnpm-lock.yaml` exists, respect it for reproducible builds
- Run `pnpm install --frozen-lockfile` in CI environments
- Use `pnpm store prune` to clean unused packages
