# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A pnpm workspace monorepo nodejs project  

## Monorepo Structure

- **packages/libs**: Shared library (`@monorepo/libs`) — Vue composables (`useLiff`), utils (`setToken`, `getToken`, `removeToken`, `clearToken`), components
- **packages/backend**: Express + Prisma + TypeScript backend API server
- **packages/[vendor-project]**: Individual LINE OA frontend apps (Vue 3 + Vite + TypeScript)

## Common Commands

```bash
# Create new frontend package (uses Plop template)
pnpm new

# Interactive project launcher
pnpm start

# Run specific frontend project
pnpm run -C packages/[project-name] dev
pnpm run -C packages/[project-name] build

# Backend
pnpm run -C packages/backend dev      # dev with tsc-watch (.env.dev)
pnpm run -C packages/backend deploy   # prod with tsc-watch (.env.prod)
pnpm run -C packages/backend build    # compile TypeScript

# Prisma (run from packages/backend)
npx prisma generate
npx prisma migrate dev
npx prisma studio

# Clean
pnpm clean        # remove all packages' node_modules and dist
pnpm clean:all    # also remove root node_modules
```

## Backend Architecture (packages/backend)

### Tech Stack
- Express 4 + TypeScript, compiled via `tsc-watch`
- Prisma ORM with PostgreSQL
- JWT auth with access/refresh token cookies (httpOnly, signed)
- bcryptjs for password hashing

### Backend Structure
```
packages/backend/
├── app.ts              # Server class (entry point) — middlewares, routes, security
├── config.ts           # Environment config (dotenv, loads .env.dev or .env.prod)
├── db/                 # Prisma client instance
├── prisma/schema.prisma
├── controllers/
│   ├── index.ts        # Re-exports all controller groups
│   ├── Auth/           # AuthController (register, login, logout)
│   ├── User/           # UserController (showCurrentUser)
│   ├── Page/           # PageController (create, getAll, getOne, update, delete)
│   └── Dev/            # DevController (checkIp) — dev/debugging utilities only
├── routes/
│   ├── AuthRoutes.ts   # /api/v1/auth
│   ├── UserRoutes.ts   # /api/v1/user
│   ├── PageRoutes.ts   # /api/v1/page
│   └── DevRoutes.ts    # /api/v1/dev
├── middleware/          # authenticateUser, authorizePermission, errorHandler
├── utils/              # JWT helpers (createJWT, isTokenValid, attachCookieToResponse), createTokenUser
├── enums/              # StatusCode, Role, RecordStatus
├── errors/             # Custom error classes (BadRequest, NotFound, Unauthenticated)
└── types/              # Req, Res, IUser, ApiTypes
```

### Controller Convention
Each controller group is a folder with individual controller files and an index that exports a single object:
```typescript
// controllers/Auth/index.ts
export const AuthController = {
  register: RegisterController,
  login: LoginController,
  logout: LogoutController,
}
```
Routes reference methods as `AuthController.register`, etc.

### Error Handling Convention
Controllers use custom error classes from `errors/` instead of manual `res.status().json()`.
Error messages must use **UPPER_SNAKE_CASE error codes**, not human-readable text:
```typescript
throw new UnauthenticatedError('AUTHENTICATION_INVALID')
throw new NotFoundError('CANT_FIND_PAGE')
throw new BadRequestError('INVALID_STATUS_VALUE')
```
Errors are caught by `express-async-errors` and handled by `errorHandlerMiddleware`.

### Environment Variables (backend)
Uses `.env.dev` / `.env.prod` — requires: `PORT`, `ENVIRONMENT` (DEV/PROD), `DATABASE_URL`, `JWT_SECRET`

## Frontend Architecture

### Tech Stack
- Vue 3.4 (Composition API, `<script setup>`)
- Vite 5 + TypeScript 5.3
- Naive UI, UnoCSS
- Vue Router 4 + file-based routing (`vite-plugin-pages`)
- `vite-plugin-vue-layouts` for layouts
- Auto-imports: `unplugin-auto-import`, `unplugin-vue-components`
- LINE LIFF integration (`@line/liff`)

### Frontend Project Structure
```
packages/[project-name]/src/
├── pages/        # File-based routing
├── layouts/      # Layout templates (default.vue)
├── components/   # Auto-imported components
├── composables/
├── utils/
├── types/
├── enums/
├── constant/
├── config.ts
├── theme.ts
└── main.ts
```

### Frontend Environment Variables
- `.env.development` / `.env.production`
- Must prefix with `VITE_`
- `VITE_BASE` (base path), `VITE_API` (API proxy target)
- Dev server proxies `/api/*` to `VITE_API` target

## Frontend Design Style (packages/frontend)

### Brand
- Project name: **小羊天地**
- Tone: Warm, welcoming, church/ministry themed

### Color Palette (defined in `main.css` via `@theme static`)
- **Sand** (primary neutral): `sand-50` ~ `sand-950` — warm beige/brown tones for backgrounds, text, borders
- **Sage** (accent green): `sage-50` ~ `sage-950` — muted earthy green for CTAs, active states, ministry highlights
- **Warm** (accent orange): `warm-50` ~ `warm-950` — warm orange for secondary accents, highlights
- Base background: `bg-sand-50`
- Primary text: `text-sand-950`
- Primary button/CTA: `bg-sage-600`
- **IMPORTANT**: Always use Tailwind utility classes directly (e.g. `bg-sand-50`, `text-sage-600`, `border-warm-200`). NEVER use `[var(--color-...)]` syntax — the `@theme static` block registers these as native Tailwind colors.

### Typography
- **Display font**: `Playfair Display` (serif) — headings, brand name. Use via `font-display` class
- **Body font**: `DM Sans` (sans-serif) — body text, UI elements
- Fonts loaded from Google Fonts in `default.vue` layout

### Layout Conventions
- Max width container: `max-w-7xl mx-auto px-6`
- Border radius: `rounded-2xl` for cards, `rounded-xl` for buttons/inputs, `rounded-full` for pill buttons
- Cards use `bg-white` with `border border-sand-200` and `shadow-sm`
- Animations: `animate-fade-up` with `stagger-1` ~ `stagger-6` delay classes

### Vue Page State Convention
Every `.vue` page file must define a `state` ref with two keys:
```typescript
const state = ref({
  data: {},    // view data (API responses, card content, display values)
  feature: {}  // feature flags (modal open/close, loading states, toggles)
})
```

### Store Convention
- All Pinia stores live in `app/stores/` with a barrel export in `app/stores/index.ts`
- Always import stores from the barrel: `import { useMenuStore } from '~/stores'`
- NEVER import directly from individual store files (e.g. `~/stores/useMenuStore`)
- Use `storeToRefs()` to destructure reactive state from stores

### Component Patterns
- Use Nuxt UI components (`UButton`, `UInput`, `UIcon`, `UColorModeButton`)
- Icons: Lucide icon set (`i-lucide-*`)
- Buttons: `bg-sand-950` for neutral, `bg-sage-600` for primary action

## ESLint Style Rules

Key formatting rules enforced by ESLint:
- **No semicolons**, single quotes, 2-space indent
- **Template literal spacing**: `${ var }` (spaces inside braces)
- **Computed property spacing**: `obj[ key ]` (spaces inside brackets)
- **Rest/spread spacing**: `... args` (space after `...`)
- **Space before function parens**: `function () {}`, `async () => {}`
- **Arrow parens always**: `(x) => x`
- **Vue block order**: `<script>` then `<template>`
- **Vue attributes**: one per line when multiline
- No `v-html`, no console (warn)