# shadcn-vue-ui

**现代化 Vue 3 中后台模板体系 — 为 AI 平台与业务管理而生**

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)
![shadcn-vue](https://img.shields.io/badge/shadcn--vue-源码级-000000)
![License](https://img.shields.io/badge/License-MIT-green)

## 项目介绍

shadcn-vue-ui 是一套基于 Vue 3 + shadcn-vue 的中后台前端模板体系，采用 Monorepo 架构。参考 Dify、Vercel 等云平台的产品设计语言，提供简洁、克制、现代的控制台体验。内置 20+ 源码级 UI 组件、完整的亮暗主题切换、Chart.js 数据可视化和命令面板，开箱即用。

## 核心特性

🎨 **Dify / 云平台产品风格** — oklch 色彩空间，通透留白，专业控制台视觉体验

🧩 **21 个 shadcn-vue 组件** — 源码级分发，Button / Table / Command / Sidebar / Sheet 等全覆盖

🌗 **亮暗双模式** — 基于 CSS 变量的完整 Design Token 体系，一键切换

📊 **Chart.js 数据可视化** — vue-chartjs 集成，Dashboard 图表开箱即用

⌨️ **⌘K 命令面板** — 全局快捷搜索与导航，提升操作效率

🤖 **AI 协作开发方法论** — 接入 BMAD-METHOD v6，12+ AI Agent 覆盖开发全生命周期

<!-- 📸 截图区域 — TODO: 添加项目截图
<p align="center">
  <img src="docs/screenshots/dashboard.png" width="80%" />
</p>
-->

## 双子项目

| 子项目 | 定位 | 状态 |
|--------|------|------|
| **shadcn-vue-ui-console** | AI 基础设施与平台能力管理控制台 | ✅ 开发中 |
| **shadcn-vue-ui-business** | 通用业务管理与运营后台 | 🚧 规划中 |

## 快速开始

```bash
git clone https://github.com/your-username/shadcn-vue-ui.git
cd shadcn-vue-ui
yarn install
yarn dev:console
```

> 需要 Node.js >= 20.0.0

## 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 | Composition API + `<script setup>` |
| TypeScript | 严格模式，全量类型覆盖 |
| Vite 8 | 极速构建与热更新 |
| Tailwind CSS v4 | oklch 色彩空间，Design Token 驱动 |
| Reka UI | 无样式原语组件库 |
| shadcn-vue | 源码级组件分发 |
| Pinia | 状态管理 |
| Vue Router | 路由管理 |
| VueUse | 组合式工具函数 |
| Chart.js | 数据可视化 |
| Lucide Icons | 图标系统 |

## Console 页面清单

| 页面 | 说明 |
|------|------|
| Dashboard | 平台概览与数据看板 |
| 模型管理 | 模型列表、模型详情 |
| 智能体管理 | 智能体列表 |
| 知识库管理 | 知识库列表、知识库详情 |
| 数据集管理 | 数据集列表 |
| 插件管理 | 插件列表、插件市场 |
| 训练管理 | 训练任务列表 |
| 智能对话 | Agent 对话页面 |
| 系统设置 | 平台配置 |
| 登录页 | 用户认证 |

## 项目结构

```
shadcn-vue-ui/
├── packages/
│   ├── shared/                  # 共享层：Design Token、组件、工具函数
│   └── ui/                      # 21 个 shadcn-vue 源码级组件
├── shadcn-vue-ui-console/       # AI 平台控制台
│   └── src/
│       ├── components/          # 控制台场景组件
│       ├── composables/         # 组合式函数
│       ├── layouts/             # 布局组件
│       ├── pages/               # 页面（10+ 页面）
│       ├── router/              # 路由配置
│       ├── stores/              # Pinia Store
│       └── styles/              # 主题与样式
├── shadcn-vue-ui-business/      # 业务管理后台（规划中）
├── docs/                        # 项目文档
└── package.json                 # Yarn Workspaces
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改（commit message 使用中文）
4. 推送到分支：`git push origin feature/your-feature`
5. 提交 Pull Request

> 请确保代码通过 `yarn lint` 检查，并遵循项目的组件开发规范。

## License

[MIT](./LICENSE)
