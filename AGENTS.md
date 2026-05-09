# AGENTS.md

## Context

- **Project Name**: blog-v2
- **Tech Stack**: Astro, React, Tailwind CSS.
- **Goal**: A modern personal blog.

## Operational Constraints & Commands

- **DO NOT** use `pnpm dev`. The development server is unstable in this environment.
- **Build Process**: Always use `pnpm build` to compile the project.
- **Previewing**: Use `pnpm preview` to check changes (Note: This requires a fresh build first).
- **Avoid `npx`**: Use `pnpm dlx` to avoid `npx`

## Coding Conventions

- 📂 **Import Alias**: Use `@/` for absolute paths starting from the `src` directory.
- ⛔️ **Avoid Relative Paths**: **DO NOT** use relative paths like `../../` for files inside the `src` folder.

> **Example:**
>
> - ❌ `import Button from "../../components/Button"`
> - ✅ `import Button from "@/components/Button"`
