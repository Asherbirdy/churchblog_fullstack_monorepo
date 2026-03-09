# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A pnpm workspace monorepo for LINE OA (Official Account) Vue 3 apps and a backend Express API server.

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
│   └── Page/           # PageController (create, getAll, getOne, update, delete)
├── routes/
│   ├── AuthRoutes.ts   # /api/v1/auth
│   ├── UserRoutes.ts   # /api/v1/user
│   └── PageRoutes.ts   # /api/v1/page
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
Controllers use custom error classes from `errors/` instead of manual `res.status().json()`:
```typescript
throw new UnauthenticatedError('Authentication Invalid')
throw new NotFoundError('找不到此頁面')
throw new BadRequestError('無效的狀態值')
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