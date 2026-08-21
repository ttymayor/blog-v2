# AGENTS.md

## 專案主旨

這是一份部落格專案，技術使用 Astro 7 框架，使用 React 作為前端框架，並使用 Tailwind CSS 作為樣式框架。

- 擁有 build 產出 Open Graph 圖片的功能（使用 satori 以及 sharp）

## 操作限制與指令

- **不使用** `pnpm dev` 幫我啟動開發環境
- **不使用** `pnpm build` 來編譯專案
- **只需要執行** `pnpm lint`/`pnpm lint:fix` 來檢查程式碼風格，與執行 `pnpm fmt` 來格式化程式碼。
- **避免使用** `npx`，使用 `pnpx` 來替代。

## 程式碼規範

- 匯入別名: 使用絕對路徑 `@/` 來引用 `src` 目錄下的檔案。
- 避免相對路徑: 「避免」使用相對路徑 `../../` 來引用 `src` 目錄下的檔案。

> 例如：
>
> - `import Button from "../../components/Button"` 不被允許
> - 請使用 `import Button from "@/components/Button"`

## 專案結構

- `src/`: 專案的主要程式碼目錄
  - `components/`: 存放 Astro 與 React 元件
  - `assets/`: 存放靜態資源
  - `content/`: 存放部落格或隨筆的 Markdown 內容
  - `pages/`: 存放 Astro 頁面
  - `layouts/`: 存放 Astro 佈局元件
  - `styles/`: 存放樣式檔案
  - `lib/`: 存放工具函數
- `scripts/`: 存放專案的腳本檔案，用來建立新文章的 Template
