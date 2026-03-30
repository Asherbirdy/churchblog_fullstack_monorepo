# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A pnpm workspace monorepo nodejs project  

## Monorepo Structure

- **packages/libs**: Shared library (`@monorepo/libs`) — Vue composables (`useLiff`), utils (`setToken`, `getToken`, `removeToken`, `clearToken`), components
- **packages/backend**: Express + Prisma + TypeScript backend API server
- **packages/frontend-admin**: Admin panel (React 19 + Chakra UI v3 + Vite + TypeScript) — church management dashboard
- **packages/chatbot**: Embeddable chatbot widget (React 19 + Vite + TypeScript) — builds to static assets, deployed into frontend's `public/chatbot`
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

**IMPORTANT**: When adding a new controller, always also add the corresponding route in the matching routes file (e.g. `AuthRoutes.ts` for Auth controllers), and add the corresponding frontend API definition in `packages/frontend/app/api/` with its enum in `RequestUrlEnum.ts`.

### Early Return Convention
Controllers must use **early return** pattern instead of `if/else` blocks. Each branch should validate, execute, and `return` independently:
```typescript
// Good — early return
if (condition === 'A') {
  // handle A
  return res.status(StatusCode.OK).json({ ... })
}

// handle default / B
res.status(StatusCode.OK).json({ ... })

// Bad — if/else
if (condition === 'A') {
  // handle A
} else {
  // handle B
}
```

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

## Chatbot Architecture (packages/chatbot)

### Tech Stack
- React 19 + TypeScript 5.9
- Vite 8
- Zustand (state management)
- Axios (HTTP client)
- SCSS for styling

### Chatbot Structure
```
packages/chatbot/src/
├── main.tsx            # Entry point — creates root container, exports init() to window.Chatbot
├── App.tsx             # Root component — toggle open/close chatbot widget
├── App.css             # All chatbot styles (scoped via .chatbot-* classnames)
├── component/          # React components
│   ├── Chatroom.tsx    # Chat UI (header, message list, input footer)
│   └── index.ts        # Barrel export
├── api/
│   ├── index.ts        # Barrel export
│   ├── useMessageApi.ts # sendMessage API call
│   └── http/           # Axios instance & interceptors
│       ├── index.ts    # Creates useApiRequest Axios instance
│       ├── config.ts   # Base URL from VITE_API env var
│       └── axios/      # Axios class, interceptors, retry, abort, error handling
├── store/
│   ├── index.ts        # Barrel export
│   └── useMessageStore.ts # Zustand store — messages[], addMessage, clearMessages
├── hook/               # Custom React hooks (placeholder)
├── enum/               # Enums (placeholder)
├── type/               # Type definitions (placeholder)
└── assets/             # Static assets (images, SCSS)
    └── scss/style.scss
```

### Chatbot Build & Deploy
- `pnpm run -C packages/chatbot dev` — local dev server
- `pnpm run -C packages/chatbot build` — production build
- `pnpm run -C packages/chatbot build-to-frontend` — build and copy `dist/` to `packages/frontend/public/chatbot`

### Chatbot Embedding
The chatbot is designed as an embeddable widget. `main.tsx` exposes `window.Chatbot.init()` which creates a root container div and mounts the React app. Host pages call `Chatbot.init()` to bootstrap the widget.

### Chatbot API Convention
- API functions live in `api/` with barrel export in `api/index.ts`
- Each API group is a `use[Group]Api` object (e.g. `useMessageApi`)
- Uses a custom `Axios` wrapper class from `api/http/axios/Axios.ts` with interceptors, retry, and abort support
- HTTP instance created in `api/http/index.ts` as `useApiRequest`

### Chatbot Store Convention
- All Zustand stores live in `store/` with barrel export in `store/index.ts`
- Always import stores from the barrel: `import { useMessageStore } from '../store'`

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

### Frontend API Convention
- API functions live in `app/api/` with a barrel export in `app/api/index.ts`
- Each API group is a `use[Group]Api` object (e.g. `useAuthApi`, `usePageApi`)
- **API type definitions**: Always define explicit `interface` types for request payload and response data. NEVER use inline object types in API function signatures:
```typescript
// Good — named interfaces
export interface ForgetPasswordEmailOTPPayload {
  email: string
  otp: string
  newPassword: string
}

export interface ForgetPasswordEmailOTPResponse {
  msg: string
}

forgetPasswordChangePassword: async (body: ForgetPasswordEmailOTPPayload) => {
  return await useRequestApi<ForgetPasswordEmailOTPResponse, null>(
    PublicRequestUrl.AuthForgetPasswordChangePassword, {
      method: 'POST',
      body,
      server: false,
      lazy: true,
      immediate: false,
      watch: false
    })
}

// Bad — inline types
forgetPasswordChangePassword: async (body: { email: string, otp: string, newPassword: string }) => {
  return await useRequestApi<{ msg: string }, null>(PublicRequestUrl.AuthForgetPasswordChangePassword, {
    method: 'POST',
    body,
    server: false,
    lazy: true,
    immediate: false,
    watch: false
  })
}
```
- API URL paths are defined in `app/enum/RequestUrlEnum.ts` using two enums:
  - `PublicRequestUrl` — endpoints that don't require authentication
  - `UserRequestUrl` — endpoints that require authentication
- Enum key naming: `[RouteGroup][Action]` in PascalCase (e.g. `AuthLogin`, `AuthLogout`, `AuthRefreshToken`, `DevCheckIp`, `UserShowMe`, `Page`)
- All API functions use `useRequestApi` composable from `~/composables`
- Always import API from the barrel: `import { useAuthApi } from '~/api'`
- **Hoist API calls to outer scope**: For API calls with fixed URLs (e.g. `create`), pass reactive `toRef`/`computed` body and call the API at the top level of `<script setup>`, then only call `execute()` inside event handlers. For dynamic URL APIs that accept `ComputedRef` (e.g. `useChatCardApi.update`, `useChatCardApi.delete`), also hoist with `computed`. For dynamic URL APIs that only accept plain `string`, keep them inside event handlers.
- **Use `pending` for loading state**: Destructure `pending` from the API composable and bind it to `:loading` in templates. **NEVER** create manual loading state variables (e.g. `feature.create.loading`) — use `pending` from the hoisted API call instead.
```typescript
// Good — hoisted create, use pending for loading
const { execute: executeCreate, pending: createPending } = await useApi.create(
  toRef(() => ({
    name: state.value.feature.create.name.trim(),
    chatTopicId: topicId
  }))
)
// Template: :loading="createPending"

// Good — hoisted with ComputedRef (API accepts ComputedRef<string>)
const { execute: executeDelete } = await useApi.delete(
  computed(() => state.value.feature.delete.id)
)

// OK — dynamic URL with plain string, kept inside handler
const confirmDelete = async () => {
  const { execute } = await useApi.delete(del.id)
  await execute()
}
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
Every `.vue` page file must define a `state` ref with two keys. Feature state for modals (create, edit, delete, access, etc.) must use **nested objects** grouped by action:
```typescript
const state = ref({
  data: {},    // view data (API responses, card content, display values)
  feature: {   // feature flags grouped by action
    create: {
      modal: false,
      name: '',
      url: ''
    },
    edit: {
      modal: false,
      id: '',
      name: '',
      url: ''
    },
    delete: {
      modal: false,
      id: ''
    }
  }
})
```
**NEVER** use flat naming like `deleteModal`, `deleteTargetId`, `editLoading` — always nest under the action key.

### State Destructuring Convention
Always destructure `state.value` into `feature` and/or `data` first — **never** destructure deeper (e.g. `state.value.feature`):
```typescript
// Good — destructure state.value, then access nested group
const openDeleteModal = (id: string) => {
  const { feature } = state.value
  feature.delete.id = id
  feature.delete.modal = true
}

// Bad — destructuring deeper than feature/data
const openDeleteModal = (id: string) => {
  const { delete: del } = state.value.feature  // ✗ don't do this
  del.id = id
  del.modal = true
}

// Bad — repeating full path
const openDeleteModal = (id: string) => {
  state.value.feature.delete.id = id
  state.value.feature.delete.modal = true
}
```

### Modal Action Object Convention
Group modal open/confirm functions into a single object per action, rather than separate `openXxxModal` / `confirmXxx` functions:
```typescript
const deleteModal = {
  open: (id: string) => {
    const { feature } = state.value
    feature.delete.id = id
    feature.delete.modal = true
  },
  confirm: async () => {
    const { feature } = state.value
    const { execute: exec } = await useApi.delete(feature.delete.id)
    await exec()
    feature.delete.modal = false
    feature.delete.id = ''
  }
}
// Template: @click="deleteModal.open(item.id)" / @click="deleteModal.confirm"
```

### Reactivity Convention
- Always use `ref()` for all reactive variables — **never use `reactive()`**

### Store Convention
- All Pinia stores live in `app/stores/` with a barrel export in `app/stores/index.ts`
- Always import stores from the barrel: `import { useMenuStore } from '~/stores'`
- NEVER import directly from individual store files (e.g. `~/stores/useMenuStore`)
- Use `storeToRefs()` to destructure reactive state from stores

### Component Import Convention
- **NEVER** use auto-imported component names (e.g. `<WebsiteAddWebsiteButton />`). Always use explicit `import` from the barrel `~/components` and use the imported name directly.
```vue
<script setup lang="ts">
import { AddWebsiteButton } from '~/components'
</script>
<template>
  <AddWebsiteButton />
</template>
```

### Component Patterns
- Use Nuxt UI components (`UButton`, `UInput`, `UIcon`, `UColorModeButton`)
- Icons: Lucide icon set (`i-lucide-*`)
- Buttons: `bg-sand-950` for neutral, `bg-sage-600` for primary action

## Frontend Admin Architecture (packages/frontend-admin)

### Tech Stack
- React 19 + TypeScript 5.4
- Vite 5 + file-based routing (`vite-plugin-pages`)
- **Chakra UI v3** (`@chakra-ui/react`) — **MUST use Chakra UI components for ALL UI**. NEVER use raw HTML elements (`<button>`, `<input>`, `<div>` for layout) when a Chakra equivalent exists
- Zustand (state management)
- Axios (HTTP client) with custom wrapper
- React Query v5 (`@tanstack/react-query`)
- Preact Signals (`@preact/signals-react`) — auto-imported
- `react-icons` for icons (use `react-icons/lu` Lucide set for consistency)
- `next-themes` for color mode (forced to "light")
- `js-cookie` for token storage
- Hash-based router (`createHashRouter`)

### Frontend Admin Structure
```
packages/frontend-admin/src/
├── main.tsx            # Entry point — providers stack (Chakra, ColorMode, QueryClient, Router)
├── App.tsx             # Root component — Suspense wrapper, auth check on mount
├── pages/              # File-based routing (auto-discovered .tsx files)
├── components/
│   ├── ui/             # Chakra UI wrappers (color-mode, toaster, dialog, avatar, tooltip)
│   └── index.ts        # Barrel export
├── api/
│   ├── index.ts        # Barrel export
│   ├── use[Group]Api.ts # API hook per resource group
│   └── http/           # Axios instance & interceptors
│       ├── index.ts    # Creates useApiRequest instance
│       ├── config.ts   # Base URL from VITE_API_URL
│       └── axios/      # Axios class, interceptors, retry, abort, error handling
├── stores/
│   ├── app/            # Zustand stores (useAuthStore, useCounterStore)
│   ├── state/          # Preact Signals state (LoginState)
│   └── index.ts        # Barrel export
├── enums/
│   ├── ApiRouteEnum.ts # PublicApiRoute / PrivateApiRoute enums
│   ├── RoutesEnum.ts   # Route path enums
│   ├── CookieEnum.ts   # Cookie name enums
│   └── index.ts        # Barrel export
├── router/
│   ├── guards.ts       # Route guard functions (auth, guest, admin, dashboard)
│   ├── ProtectedRoute.tsx # Route wrapper with guard checks
│   └── index.ts
├── hook/               # Custom hooks (useColorMode)
├── types/              # Type definitions (api/auth/LoginType, RegisterType, etc.)
├── utils/              # Utilities (cookie, formValidate)
├── config.ts           # Environment config (VITE_API_URL, VITE_BASE, test credentials)
└── assets/
    └── global.css      # Global styles, Google Fonts, animations
```

### Chakra UI Component Convention
**IMPORTANT**: Always use `@chakra-ui/react` components instead of raw HTML:
```tsx
// Good — Chakra UI components
import { Box, Flex, Text, Heading, Input, Button, VStack, HStack, Icon } from '@chakra-ui/react'
import { LuChurch } from 'react-icons/lu'

<Flex align="center" gap="2">
  <Icon as={LuChurch} />
  <Text fontSize="sm">Label</Text>
</Flex>

// Bad — raw HTML
<div style={{ display: 'flex' }}>
  <span>Label</span>
</div>
```

### Frontend Admin API Convention
- API functions live in `api/` with barrel export in `api/index.ts`
- Each API group is a `use[Group]Api` object (e.g. `useAuthApi`, `usePageApi`, `useChatTopicApi`)
- Uses custom `Axios` wrapper from `api/http/axios/Axios.ts` with interceptors, retry, and abort
- HTTP instance created in `api/http/index.ts` as `useApiRequest`
- API URL paths defined in `enums/ApiRouteEnum.ts` using `PublicApiRoute` / `PrivateApiRoute` enums
- **Type definitions**: Always define explicit `interface` types in `types/` for payloads and responses. NEVER use inline object types
- Always import API from barrel: `import { useAuthApi } from '@/api'`

### Frontend Admin Store Convention
- Zustand stores live in `stores/app/` with barrel export in `stores/index.ts`
- Preact Signals state lives in `stores/state/`
- Always import from barrel: `import { useAuthStore } from '@/stores'`

### Frontend Admin Component Convention
- All components barrel-exported from `components/index.ts`
- Always import from barrel: `import { Toaster } from '@/components'`
- Use Chakra UI's `defaultSystem` theme — do NOT create custom Chakra themes

### Frontend Admin Design Style
- **Brand**: 小羊天地 (admin panel)
- **Color palette**: Same sand/sage/warm tones as frontend (see "Frontend Design Style" section)
- **Typography**: `Playfair Display` (serif) for headings, `DM Sans` (sans-serif) for body — loaded via Google Fonts `@import` in `global.css`
- **Icons**: `react-icons/lu` (Lucide icon set) — use `Icon` component with `as` prop: `<Icon as={LuChurch} />`

### Frontend Admin Color Reference (hex values for Chakra props)
Since Chakra UI does not use Tailwind, use hex color values directly in style props:
- Sand: `#faf8f5` (50), `#e8e0d4` (200), `#bfab92` (400), `#a8916f` (500), `#7a664a` (700), `#2d241c` (950)
- Sage: `#425f40` (600), `#364c34` (700)
- Background: `#faf8f5` (sand-50)
- Primary text: `#2d241c` (sand-950)
- Primary button: `bg="#2d241c"` with `_hover={{ bg: '#544638' }}`
- Muted text: `#a8916f` (sand-500)
- Labels: `#7a664a` (sand-700)
- Borders: `#e8e0d4` (sand-200)
- Input focus: `borderColor="#a8916f"` with `boxShadow="0 0 0 3px rgba(168,145,111,0.15)"`
- Accent/link: `#425f40` (sage-600)

### Frontend Admin Environment Variables
- `.env.development` / `.env.production`
- Must prefix with `VITE_`
- `VITE_API_URL` (API base URL), `VITE_BASE` (base path), `VITE_PORT` (dev server port, default 3000)
- `VITE_TEST_EMAIL`, `VITE_TEST_PASSWORD` (dev test credentials)

### Auto-imports (configured in vite.config.ts)
The following are auto-imported and do NOT need explicit import statements:
- **React**: `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, etc.
- **React Query**: `useQuery`, `useMutation`, `useQueryClient`, etc.
- **React Router**: `useNavigate`, `useParams`, `useLocation`, etc.

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