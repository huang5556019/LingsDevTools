# DevTools

跨平台开发常用工具客户端，支持 Windows 和 macOS。

## 项目简介

DevTools 是一个为个人开发者打造的跨平台开发工具集合，旨在解决不同平台开发工具功能不一致的痛点，提供统一的使用体验，提高开发效率。

### 核心功能

- **编码解码工具**：Base64 编码/解码、URL 编码/解码、JSON 格式化/压缩
- **网络工具**：HTTP 请求测试、WebSocket 调试
- **数据处理工具**：时间戳转换、正则表达式测试
- **历史记录管理**：保存和重用常用操作

## 项目截图

### 主界面

![主界面](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20modern%20desktop%20application%20interface%20for%20DevTools%20with%20a%20sidebar%20on%20the%20left%20showing%20different%20tools%20like%20Base64%2C%20URL%20Encode%2C%20JSON%20Format%2C%20HTTP%20Request%2C%20WebSocket%2C%20Timestamp%2C%20Regex%2C%20and%20History%2C%20with%20a%20main%20content%20area%20showing%20a%20Base64%20encoding%20tool%20with%20input%20and%20output%20fields%2C%20built%20with%20Electron%20and%20React%2C%20using%20Tailwind%20CSS%20for%20styling&image_size=landscape_16_9)

### 编码解码工具

![编码解码工具](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20Base64%20encoding%20tool%20interface%20with%20input%20and%20output%20text%20areas%2C%20encode%20and%20decode%20buttons%2C%20error%20handling%20and%20success%20messages%2C%20built%20with%20React%20and%20Tailwind%20CSS&image_size=landscape_16_9)

### 网络工具

![网络工具](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=An%20HTTP%20request%20tool%20interface%20with%20URL%20input%2C%20HTTP%20method%20selection%2C%20headers%20editor%2C%20request%20body%20editor%2C%20and%20response%20display%20area%2C%20built%20with%20React%20and%20Tailwind%20CSS&image_size=landscape_16_9)

## 技术栈

- **桌面框架**：Electron 28.x
- **前端**：React 18.x + TypeScript 5.x
- **样式**：Tailwind CSS
- **状态管理**：Zustand
- **数据存储**：electron-store
- **构建工具**：Vite + electron-vite
- **打包工具**：electron-builder

## 快速开始

### 系统要求

- **Windows**：Windows 10 及以上
- **macOS**：macOS 10.15 及以上
- **Node.js**：16.x 及以上

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
│       ├── components/      # 通用组件
│       ├── modules/         # 工具模块
│       ├── store/           # 状态管理
│       └── styles/          # 样式文件
├── resources/              # 静态资源
├── tests/                  # 测试代码
└── 配置文件
```

## 工具使用指南

### 编码解码工具

1. **Base64 工具**：用于 Base64 编码和解码文本
   - 输入要编码或解码的文本
   - 选择操作类型（编码/解码）
   - 点击按钮执行操作
   - 复制结果或保存到历史记录

2. **URL 编码工具**：用于 URL 编码和解码
   - 输入要编码或解码的 URL
   - 选择操作类型（编码/解码）
   - 点击按钮执行操作
   - 复制结果或保存到历史记录

3. **JSON 工具**：用于 JSON 格式化和压缩
   - 输入要处理的 JSON 数据
   - 选择操作类型（格式化/压缩）
   - 点击按钮执行操作
   - 复制结果或保存到历史记录

### 网络工具

1. **HTTP 请求工具**：用于测试 HTTP 请求
   - 输入请求 URL
   - 选择 HTTP 方法
   - 添加请求头（可选）
   - 添加请求体（可选）
   - 点击发送请求按钮
   - 查看响应结果

2. **WebSocket 调试工具**：用于调试 WebSocket 连接
   - 输入 WebSocket URL
   - 点击连接按钮
   - 发送消息到服务器
   - 查看服务器返回的消息
   - 点击断开按钮关闭连接

### 数据处理工具

1. **时间戳转换工具**：用于时间戳和日期时间的转换
   - 输入时间戳或日期时间
   - 选择操作类型（时间戳转日期/日期转时间戳）
   - 选择日期格式（可选）
   - 点击转换按钮
   - 复制结果

2. **正则表达式工具**：用于测试正则表达式
   - 输入正则表达式模式
   - 输入测试文本
   - 选择正则表达式标志
   - 点击匹配按钮查看匹配结果
   - 或点击替换按钮进行替换操作

### 历史记录管理

1. **历史记录**：查看所有工具的使用历史
   - 点击历史记录工具
   - 查看历史记录列表
   - 点击历史记录项加载到对应工具
   - 选择多个历史记录项进行删除
   - 点击清空按钮删除所有历史记录

2. **收藏**：管理收藏的工具配置
   - 在各工具中保存配置到收藏
   - 点击收藏标签页查看收藏列表
   - 点击收藏项加载到对应工具
   - 点击删除按钮删除收藏

## 开发规范

请参考 [开发规范](specs/开发规范.md) 文件。

## 开发路线图

请参考 [开发路线图](specs/开发路线图.md) 文件。

## 贡献指南

1. ** Fork 仓库**：在 GitHub 上 Fork 本仓库
2. **克隆仓库**：克隆 Fork 后的仓库到本地
3. **创建分支**：创建一个新的分支用于开发
4. **开发功能**：实现新功能或修复 bug
5. **提交代码**：提交代码并编写清晰的 commit 信息
6. **推送分支**：将分支推送到 GitHub
7. **创建 PR**：创建 Pull Request 到主分支

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 联系方式

如有任何问题或建议，请联系我们：

- 邮箱：support@devtools.com
- GitHub：https://github.com/devtools/app

## 更新日志

详见 [CHANGELOG.md](CHANGELOG.md) 文件。

## 发布说明

详见 [RELEASE.md](RELEASE.md) 文件。
