# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

這是一個基於 pnpm workspace 的 monorepo 專案，專門用於建立多個 LINE OA (Official Account) 相關的 Vue 3 應用程式。

## Architecture

### Monorepo Structure

- **packages/libs**: 共用程式庫，包含可重用的元件、工具函數、composables
  - Components: 共用 Vue 元件
  - Utils: Cookie 管理等工具函數
  - Composables: useLiff 等 Vue composables

- **packages/***: 各個獨立的專案包，每個包代表一個 LINE OA 應用
  - 每個包都是獨立的 Vue 3 + Vite + TypeScript 專案
  - 使用 `workspace:*` 參照共用的 `@lineoa-monorepo/libs`

### Project Naming Convention

專案命名規則：`[廠商英文]-[專案名稱英文]`（例如：`Takeda-Register`）

### Technology Stack

- **Frontend**: Vue 3.4.0 (Composition API with `<script setup>`)
- **Build Tool**: Vite 5.0.10
- **TypeScript**: 5.3.3
- **UI Framework**: Naive UI 2.38.0
- **Styling**: UnoCSS 0.62.3
- **Router**: Vue Router 4.4.3 + vite-plugin-pages (file-based routing)
- **Layout**: vite-plugin-vue-layouts
- **LINE Integration**: @line/liff 2.24.0
- **Package Manager**: pnpm >=9.7.1
- **Node**: >=18.17.0

### Key Vite Plugins

每個專案包都配置了以下 Vite 插件：

1. **unplugin-auto-import**: 自動引入 Vue 和 Vue Router API
2. **vite-plugin-pages**: 基於檔案系統的路由（`src/pages/*`）
3. **vite-plugin-vue-layouts**: 佈局系統（`src/layouts/*`）
4. **unplugin-vue-components**: 自動引入元件（從 `src/components/` 深度搜尋）
5. **UnoCSS**: 原子化 CSS

## Common Commands

### 建立新專案包

```bash
pnpm new
# 或
pnpm run new
```

此指令會：
1. 使用 Plop 模板生成器建立新包
2. 詢問專案名稱（遵循命名規則）
3. 從 `plop-templates/package` 複製模板到 `packages/[name]`
4. 自動更新 `run-project.js` 註冊新專案
5. 在 `docs/` 建立專案文件

### 互動式啟動專案

```bash
pnpm start
# 或
node run-project.js
```

此指令會：
1. 列出所有可用專案
2. 選擇專案後顯示可用指令（dev/build 等）
3. 執行選定的指令
4. 若執行 build，會自動開啟 dist 資料夾

### 直接執行特定專案

```bash
# 開發模式
pnpm run dev:vite-demo
pnpm run -C packages/[project-name] dev

# 建置
pnpm run build:vite-demo
pnpm run -C packages/[project-name] build

# 型別檢查
pnpm run -C packages/[project-name] type-check
```

### 清理

```bash
# 清理所有包的 node_modules 和 dist
pnpm clean

# 清理包含根目錄的所有 node_modules
pnpm clean:all
```

## Development Workflow

### 新增專案時的流程

1. 執行 `pnpm new` 建立新專案
2. 專案會自動在 `run-project.js` 註冊
3. 專案文件會建立在 `docs/[project-name].txt`
4. 新專案已包含完整的 Vue 3 + Vite 設定

### 專案結構慣例

每個專案包的結構：

```
packages/[project-name]/
├── src/
│   ├── pages/          # 檔案式路由
│   ├── layouts/        # 佈局模板
│   ├── components/     # 元件（自動引入）
│   ├── composables/    # Composables
│   ├── utils/          # 工具函數
│   ├── types/          # TypeScript 型別定義
│   ├── enums/          # 列舉
│   ├── constant/       # 常數
│   ├── config.ts       # 配置
│   ├── theme.ts        # 主題設定
│   └── main.ts         # 進入點
├── public/
├── .env.development
├── .env.production
├── vite.config.mts
├── tsconfig.json
└── uno.config.ts
```

### 路由與佈局

- 路由自動從 `src/pages/` 生成（vite-plugin-pages）
- 佈局放在 `src/layouts/`，預設為 `default.vue`
- 元件從 `src/components/` 自動引入（包含子目錄）

### 環境變數

- 開發環境：`.env.development`
- 生產環境：`.env.production`
- Vite 環境變數需以 `VITE_` 開頭
- 常見變數：`VITE_BASE`（base path）、`VITE_API`（API proxy target）

### API Proxy

Vite dev server 已配置 `/api` proxy：
- 請求 `/api/*` 會轉發到 `VITE_API` 環境變數指定的目標
- 自動移除 `/api` 前綴
- 啟用 CORS 和 changeOrigin

## Linting

專案使用 ESLint with Vue 3 + TypeScript 配置（`.eslintrc.yml`）：

### 重要規則

- Vue 元件區塊順序：`<script>` → `<template>`
- HTML 縮排：2 spaces
- 屬性每行一個（多行時）
- 禁止使用 `v-html`
- 元件命名不強制多字（multi-word-component-names: off）
- 允許 template 多個根元素

## 共用程式庫 (@lineoa-monorepo/libs)

位於 `packages/libs/`，匯出：

- **Components**: `Hello` 元件
- **Utils**: `setToken`, `getToken`, `removeToken`, `clearToken`（Cookie 管理）
- **Composables**: `useLiff`（LINE LIFF 整合）

在專案中使用：

```typescript
import { useLiff, setToken, Hello } from '@lineoa-monorepo/libs'
```

## Plop Templates

位於 `plop-templates/package/`，作為新專案的模板。

修改模板會影響之後建立的所有新專案，但不影響已存在的專案。

## 文件慣例

每個專案在 `docs/[project-name].txt` 都有對應文件，記錄：
- 專案名稱
- 官方帳號名稱
- 正式/測試網址
- 專案簡介
