# DevTools

跨平台开发常用工具客户端，支持 Windows 和 macOS。

## 项目简介

DevTools 是一个为个人开发者打造的跨平台开发工具集合，旨在解决不同平台开发工具功能不一致的痛点，提供统一的使用体验，提高开发效率。

### 核心功能

- **编码解码工具**：Base64 编码/解码、URL 编码/解码、JSON 格式化/压缩
- **网络工具**：HTTP 请求测试、WebSocket 调试
- **数据处理工具**：时间戳转换、正则表达式测试
- **历史记录管理**：保存和重用常用操作

## 技术栈

- **桌面框架**：Electron 28.x
- **前端**：React 18.x + TypeScript 5.x
- **样式**：Tailwind CSS
- **状态管理**：Zustand
- **数据存储**：SQLite (better-sqlite3)
- **构建工具**：Vite + electron-vite
- **打包工具**：electron-builder

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建

#### 构建 Windows 安装包

```bash
pnpm build:win
```

#### 构建 macOS 安装包

```bash
pnpm build:mac
```

#### 构建所有平台

```bash
pnpm build:all
```

### 代码质量

#### 类型检查

```bash
pnpm typecheck
```

#### 代码检查

```bash
pnpm lint
```

#### 代码格式化

```bash
pnpm format
```

## 项目结构

```
DevTools/
├── specs/                  # 项目核心定义 (产品/技术/结构/规范)
├── docs/                   # 项目文档
├── src/                    # 源代码
│   ├── main/               # Electron 主进程
│   ├── preload/            # 预加载脚本
│   └── renderer/           # 渲染进程 (React 前端)
├── resources/              # 静态资源
├── tests/                  # 测试代码
└── 配置文件
```

## 开发规范

请参考 [开发规范](specs/开发规范.md) 文件。

## 开发路线图

请参考 [开发路线图](specs/开发路线图.md) 文件。
