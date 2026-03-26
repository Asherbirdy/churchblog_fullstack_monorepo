# 小羊天地 Monorepo

pnpm workspace monorepo，包含後台管理系統、API 伺服器、嵌入式聊天機器人。

## Tech Stack

| Package | Stack |
|---------|-------|
| **frontend** | Nuxt 4 + Vue 3 + Pinia + Tailwind CSS 4 + Tiptap Editor |
| **backend** | Express 4 + Prisma ORM + PostgreSQL + JWT + PM2 |
| **chatbot** | React 19 + Zustand + Axios + Vite (IIFE build) |

**Runtime:** Node >= 22.14.0, pnpm >= 9.7.1

## Monorepo Structure

```
monorepo/
├── packages/
│   ├── frontend/       # Nuxt 管理後台 + 公開頁面 (port 1208)
│   ├── backend/        # Express API 伺服器 (port 1210)
│   └── chatbot/        # 嵌入式聊天機器人 widget (IIFE)
├── pnpm-workspace.yaml
├── plopfile.js         # 新 package 產生器
├── run-project.js      # 互動式專案啟動器
└── .eslintrc.yml       # 共用 ESLint 設定
```

## Quick Start

```bash
# 安裝依賴
pnpm install

# 產生 Prisma client
cd packages/backend && npx prisma generate

# 互動式選擇專案啟動
pnpm start
# 互動式 CLI，兩步驟選擇：
# 1) 選擇專案 → frontend / backend / chatbot
# 2) 選擇指令 → dev / build / deploy / pm2-deploy ...
# 執行後自動運行 pnpm run -C packages/<project> <command>
# build 完成後會自動開啟 dist 資料夾

# 或個別啟動
pnpm run -C packages/backend dev       # API server
pnpm run -C packages/frontend dev      # Frontend
pnpm run -C packages/chatbot dev       # Chatbot
```

## Architecture Overview

```
┌──────────────────────────┐     ┌─────────────────────────┐
│   External Website       │     │   Frontend (Nuxt)       │
│   window.Chatbot.init()  │     │   /admin/* (管理後台)    │
│   嵌入聊天機器人 widget    │     │   /C/* (公開頁面, SSG)   │
└────────────┬─────────────┘     └────────────┬────────────┘
             │                                │
             │ POST /chat/send-message        │ JWT Auth (Cookie/Header)
             │                                │
             └──────────┬─────────────────────┘
                        ▼
            ┌───────────────────────┐
            │   Backend (Express)   │
            │   /api/v1/*           │
            │   Prisma + PostgreSQL │
            └───────────────────────┘
```

---

## Backend (`packages/backend`)

### API Routes

| Route | Description | Auth |
|-------|-------------|------|
| `POST /api/v1/auth/loginSendOtp` | 發送登入 OTP 至信箱 | Public |
| `POST /api/v1/auth/login` | Email + Password + OTP 登入 | Public |
| `GET /api/v1/auth/refreshToken` | 刷新 Access Token (含 IP 驗證) | Public |
| `DELETE /api/v1/auth/logout` | 登出並清除 Token | Auth |
| `GET /api/v1/auth/checkValidToken` | 驗證 Token 有效性 | Auth |
| `POST /api/v1/auth/forgetPasswordEmailOTP` | 忘記密碼 OTP | Public |
| `POST /api/v1/auth/changePasswordWithOTP` | OTP 重設密碼 | Public |
| `POST /api/v1/auth/sendVerificationEmail` | 發送驗證信 | Auth + Admin |
| `GET /api/v1/user/showMe` | 取得當前使用者資料 | Auth |
| `POST /api/v1/account/adminInit` | 初始化第一個 Admin 帳號 | Public |
| `POST /api/v1/account/adminRegisterUser` | Admin 註冊新使用者 | Auth + Admin |
| `DELETE /api/v1/account/deleteUser/:id` | 刪除使用者 | Auth + Admin |
| `GET /api/v1/account/getAllUser` | 取得所有使用者 | Auth + Admin |
| `PATCH /api/v1/account/editAccess` | 編輯使用者權限 | Auth + Admin |
| `POST /api/v1/page` | 建立頁面 | Auth + Page Access |
| `GET /api/v1/page` | 取得所有頁面 | Auth |
| `GET /api/v1/page/info/:id` | 取得頁面詳情 | Auth |
| `GET /api/v1/page/online` | 取得所有上線頁面 | Public |
| `GET /api/v1/page/route/:routeName` | 依路由名取得頁面 | Public |
| `PATCH /api/v1/page/update/:id` | 更新頁面 | Auth + Page Access |
| `PATCH /api/v1/page/edited-html/:id` | 更新編輯中 HTML | Auth + Page Access |
| `PATCH /api/v1/page/set-to-online-scheduled` | 排程上線 | Auth + Page Access |
| `PATCH /api/v1/page/set-to-offline-scheduled` | 排程下線 | Auth + Page Access |
| `PATCH /api/v1/page/cancel-scheduled` | 取消排程 | Auth + Page Access |
| `PATCH /api/v1/page/go-to-previous-html` | 回復上一版 HTML | Auth + Page Access |
| `CRUD /api/v1/chat-topic` | 聊天主題管理 | Auth + Page Access |
| `CRUD /api/v1/chat-card` | 聊天卡片管理 | Auth + Page Access |
| `POST /api/v1/chat/send-message` | 發送聊天訊息 (關鍵字搜尋) | Public |
| `GET /api/v1/dev/check-ip` | 檢查 Client IP | Public |

### Authentication Flow

```
1. POST /auth/loginSendOtp   →  Email + Password 驗證 → 寄送 6 碼 OTP
2. POST /auth/login           →  Email + Password + OTP → 發放 JWT Token
3. 後續請求帶 Access Token     →  authenticateUser middleware 驗證
4. Access Token 過期           →  用 Refresh Token 刷新 (驗證 IP 一致性)
5. DELETE /auth/logout        →  刪除 DB Token 記錄 + 清除 Cookie
```

### Security

| Feature | Detail |
|---------|--------|
| **JWT** | Access Token 15 分鐘 / Refresh Token 24 小時 |
| **Cookie** | httpOnly + signed，正式環境加 secure flag |
| **OTP** | 6 碼 hex，5 分鐘過期，失敗 5 次鎖定 1 小時 |
| **Refresh Token IP 驗證** | 刷新時比對登入 IP，不同則拒絕 |
| **Rate Limiting** | 每 IP 15 分鐘內最多 100 次請求 |
| **Helmet** | HTTP 安全標頭 (XSS, clickjacking 等) |
| **HPP** | HTTP 參數汙染防護 |
| **bcryptjs** | 密碼雜湊 |

### Access Control (3 層)

1. **Authentication** — 是否已登入 (`authenticateUser`)
2. **Role-based** — Admin / User (`authorizePermission`)
3. **Feature-based** — page / chatbot 權限 (`authAccess`)

### Database Models (Prisma + PostgreSQL)

```prisma
model User {
  id, name, email, password, role(admin/user),
  access[](page/chatbot), otp, otpAttempts,
  isBlocked, blockUntil,
  tokens[], pages[]
}

model Token {
  id, refreshToken, ip, userAgent, isValid, userId
}

model Page {
  id, name, routeName, status(online/offline),
  setStatus(scheduledOnline/scheduledOffline/none),
  editedHtml, onlineHtml, previousHtml,
  isEdit, lastEditedAt, createdById
}

model ChatTopic {
  id, name, keywords[], cards[]
}

model ChatCard {
  id, name, url, description, online, chatTopicId
}
```

### Environment Variables

`.env.dev` / `.env.prod`:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 1210) |
| `ENVIRONMENT` | DEV / PROD |
| `DATABASE_URL` | PostgreSQL 連線字串 |
| `JWT_SECRET` | JWT 簽名密鑰 |
| `AUTH_TOKEN` | HEADER / COOKIES (Token 傳遞方式) |
| `EMAIL_SERVICE_USER` | Gmail 帳號 (寄送 OTP) |
| `EMAIL_SERVICE_PASS` | Gmail 應用程式密碼 |
| `CORS_ORIGIN` | CORS 來源 (預設 `*`) |

### Backend Commands

```bash
pnpm run -C packages/backend dev          # 開發模式 (.env.dev)
pnpm run -C packages/backend deploy       # 正式模式 (.env.prod)
pnpm run -C packages/backend build        # TypeScript 編譯
pnpm run -C packages/backend pm2-deploy   # Build + PM2 啟動
```

---

## Frontend (`packages/frontend`)

### Pages

| Route | Description | SSR |
|-------|-------------|-----|
| `/` | 首頁 | Prerendered |
| `/login` | 兩步驟 OTP 登入 | SSR |
| `/forgetPassword` | 忘記密碼 | SSR |
| `/C/:routeName` | 動態公開頁面 | Prerendered (build 時從 API 取得) |
| `/tool/lifebible-study` | 生命讀經工具 | SSR |
| `/admin/home` | 個人資料管理 | CSR only |
| `/admin/website` | 一頁網站列表 | CSR only |
| `/admin/website/:id` | Tiptap 富文本編輯器 | CSR only |
| `/admin/chatbot` | 聊天主題管理 | CSR only |
| `/admin/chatbot/:id` | 聊天卡片管理 | CSR only |
| `/admin/account` | 帳號管理 (Admin) | CSR only |

### Layouts

| Layout | Usage |
|--------|-------|
| `default` | 公開頁面 (Header + Footer) |
| `dashboard` | Admin 後台 (可收合側邊欄 + Header) |
| `editor` | 全螢幕頁面編輯器 |

### Route Middleware

| Middleware | Description |
|------------|-------------|
| `auth` | 保護 `/admin/*`，驗證 Token + 取得使用者資料 |
| `guest` | 防止已登入使用者進入 `/login`、`/forgetPassword` |

### Fetch Plugin (Token 自動管理)

Frontend 的 `Fetch.ts` plugin 自動處理 JWT：
- 請求時自動帶上 `Authorization: Bearer <accessToken>`
- Access Token 不存在時自動用 Refresh Token 刷新
- 區分 Public / Private API，Public 不帶 Token

### Frontend Environment Variables

`.env.development` / `.env.production`:

| Variable | Description |
|----------|-------------|
| `NITRO_PORT` | 前端開發 port (1208) |
| `NUXT_PUBLIC_API_URL` | API base URL |

### Frontend Commands

```bash
pnpm run -C packages/frontend dev         # 開發模式
pnpm run -C packages/frontend build       # 正式建置 (含預渲染)
pnpm run -C packages/frontend preview     # 預覽建置結果
```

---

## Chatbot (`packages/chatbot`)

嵌入式聊天機器人 widget，打包為 IIFE 單檔，外部網站透過 `window.Chatbot.init()` 載入。

### How It Works

1. 使用者輸入訊息
2. `POST /api/v1/chat/send-message` 送出關鍵字
3. 後端比對 ChatTopic 的 keywords
4. 回傳匹配的 ChatCard 列表 (名稱 + 描述 + URL)
5. Widget 顯示卡片式結果供使用者點擊

### Embedding

```html
<script src="/chatbot/index.min.js"></script>
<script>
  window.Chatbot.init()
</script>
```

### Design

漫畫手繪風格，綠色 (#42b883) 主色調，Patrick Hand 字體，SVG wobbly filter 手繪效果。

### Build & Deploy

```bash
pnpm run -C packages/chatbot dev                 # 開發 (port 3000)
pnpm run -C packages/chatbot build               # 打包
pnpm run -C packages/chatbot build-to-frontend   # 打包並複製到 frontend/public/chatbot
```

---

## Common Commands

```bash
# 新建 package (Plop 模板)
pnpm new

# 互動式啟動
pnpm start

# Prisma
cd packages/backend
npx prisma generate        # 產生 client
npx prisma migrate dev     # 開發遷移
npx prisma studio          # 資料庫 GUI

# 清理
pnpm clean                 # 移除所有 packages 的 node_modules + dist
pnpm clean:all             # 同上 + 移除根目錄 node_modules
```

## Deployment

### Backend (PM2)

```bash
cd packages/backend
pnpm run pm2-deploy        # Build + PM2 啟動
pnpm run pm2-status        # 查看狀態
pnpm run pm2-stop          # 停止
pnpm run pm2-delete        # 移除
```

### Frontend (Static)

```bash
cd packages/frontend
pnpm run build             # 輸出至 .output/public/
```

Build 時會呼叫 `GET /api/v1/page/online` 取得所有上線頁面，動態產生 `/C/:routeName` 預渲染路由。

### Chatbot

```bash
cd packages/chatbot
pnpm run build-to-frontend  # 打包 → 複製到 frontend/public/chatbot/
```

Chatbot 作為靜態資源隨 Frontend 一起部署。
