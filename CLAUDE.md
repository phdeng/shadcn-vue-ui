# CLAUDE.md — shadcn-vue-ui 项目 AI 协作入口

## 项目概述

shadcn-vue-ui 是一个现代化、轻量化、设计系统驱动的 Vue 3 前端框架，包含两个子项目：
- **shadcn-vue-ui-console** — 面向 AI 基础设施与平台能力管理的控制台
- **shadcn-vue-ui-business** — 面向通用业务管理与运营后台

## 核心技术栈

| 技术 | 版本/说明 | 用途 |
|------|-----------|------|
| Vue 3 | Composition API + `<script setup>` | 框架核心 |
| TypeScript | 严格模式 | 类型安全 |
| Vite | 最新稳定版 | 构建工具 |
| Tailwind CSS v4 | oklch 色彩空间 | 样式方案 |
| Reka UI | 无样式原语组件库 | 组件原语层 |
| shadcn-vue | 源码级组件分发 | 基础 UI 组件 |
| Vue Router | 最新稳定版 | 路由管理 |
| Pinia | 最新稳定版 | 状态管理 |
| VueUse | 按需引入 | 组合式工具函数 |
| Lucide Vue Next | 按需引入 | 图标系统 |
| Yarn | workspace 模式 | 包管理 |

## 工程结构（Monorepo）

```
shadcn-vue-ui/
├── CLAUDE.md                    # 本文件 — AI 协作入口
├── README.md                    # 项目首页文档
├── package.json                 # 根 package.json（含 workspaces 配置）
├── docs/                        # 项目文档体系
│   ├── 00-initialization-plan.md
│   ├── ai-collaboration/        # AI 协作开发文档
│   └── ...
├── packages/
│   ├── shared/                  # 共享层：设计 Token、基础组件、工具函数
│   │   ├── src/
│   │   │   ├── design-tokens/   # 设计 Token（颜色、间距、圆角等）
│   │   │   ├── components/      # 共享基础组件
│   │   │   ├── composables/     # 共享组合式函数
│   │   │   ├── utils/           # 共享工具函数
│   │   │   └── types/           # 共享类型定义
│   │   └── package.json
│   └── ui/                      # shadcn-vue 基础 UI 组件（源码级）
│       ├── src/
│       │   └── components/ui/   # 通过 shadcn-vue CLI 添加的组件
│       └── package.json
├── shadcn-vue-ui-console/       # 子项目：AI 平台控制台
│   ├── src/
│   │   ├── assets/              # 静态资源
│   │   ├── components/          # 控制台场景组件
│   │   ├── composables/         # 控制台组合式函数
│   │   ├── layouts/             # 布局组件
│   │   ├── pages/               # 页面
│   │   ├── router/              # 路由配置
│   │   ├── stores/              # Pinia Store
│   │   ├── styles/              # 控制台样式与主题
│   │   ├── types/               # 类型定义
│   │   └── App.vue
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
└── shadcn-vue-ui-business/      # 子项目：业务管理后台
    ├── src/                     # 结构同 console
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

## 语言与风格规则

- 所有代码注释使用中文
- 所有文档使用中文
- 所有 commit message 使用中文
- 组件/变量/函数命名使用英文（遵循 Vue 社区规范）
- 设计风格关键词：简洁、克制、现代、留白、通透、精致、高级

## 组件开发规范

### 目录约定
```
ComponentName/
├── ComponentName.vue     # 主组件
├── ComponentNameItem.vue # 子组件（如有）
├── index.ts              # 统一导出
├── types.ts              # 类型定义
└── composables.ts        # 组合式函数（如有）
```

### 组件模板
```vue
<script setup lang="ts">
// 1. 导入
import { computed } from 'vue'
import type { ComponentNameProps } from './types'

// 2. Props 定义
const props = withDefaults(defineProps<ComponentNameProps>(), {
  // 默认值
})

// 3. Emits 定义
const emit = defineEmits<{
  (e: 'update', value: string): void
}>()

// 4. 组合式逻辑
// 5. 计算属性
// 6. 方法
</script>

<template>
  <!-- 模板 -->
</template>
```

### 页面模板
```vue
<script setup lang="ts">
// 1. 导入
// 2. 路由/Store
// 3. 状态
// 4. 数据请求
// 5. 事件处理
// 6. 生命周期
</script>

<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <header class="page-header">...</header>
    <!-- 页面内容 -->
    <main class="page-content">...</main>
  </div>
</template>
```

## 设计 Token 体系

基于 Tailwind CSS v4 + oklch 色彩空间，通过 CSS 变量管理：

| Token 类型 | 说明 |
|-----------|------|
| `--background / --foreground` | 页面底色/文字色 |
| `--card / --card-foreground` | 卡片色 |
| `--primary / --primary-foreground` | 主色 |
| `--secondary / --secondary-foreground` | 辅色 |
| `--muted / --muted-foreground` | 弱化色 |
| `--accent / --accent-foreground` | 强调色 |
| `--destructive / --destructive-foreground` | 危险色 |
| `--border / --input / --ring` | 边框/输入/聚焦环 |
| `--sidebar-*` | 侧边栏专用 |
| `--chart-1 ~ --chart-5` | 图表色板 |
| `--radius` | 全局圆角基准 |

## AI 协作规则

1. **先读后改** — 修改任何文件前先阅读现有内容
2. **职责单一** — 每个组件/模块只做一件事
3. **显式优于隐式** — 不使用魔法字符串，所有配置可追踪
4. **模板驱动** — 新组件/页面必须遵循上述模板
5. **文档同步** — 每开发一个模块，同步更新相关文档
6. **自检清单** — 完成开发后检查：类型完整性、样式一致性、响应式、暗色模式、可访问性

## BMAD Agent 团队

本项目已接入 [BMAD-METHOD v6](https://github.com/bmad-code-org/BMAD-METHOD)，提供 12+ 专业化 AI Agent 覆盖开发全生命周期：

| Agent | 角色 | 核心职责 |
|-------|------|---------|
| Analyst | 业务分析师 | 需求调研、头脑风暴、可行性分析 |
| PM | 产品经理 | PRD 编写、Epic/Story 拆分 |
| Architect | 系统架构师 | 架构设计、技术决策 |
| UX Designer | UX 设计师 | 交互设计、线框图 |
| SM | Scrum Master | Sprint 规划、进度跟踪 |
| DEV | 开发工程师 | 代码实现、代码审查 |
| TEA | 测试架构师 | 测试策略、测试覆盖 |
| Tech Writer | 技术文档 | 文档编写与维护 |
| BMad Master | 编排器 | 工作流调度、多角色协调 |

详细的 Agent 协作规则见 [agents-frontend.md 第十四章](./agents-frontend.md#十四bmad-agent-团队协作体系)。

## 关联文档

| 文档 | 说明 |
|------|------|
| [agents-frontend.md](./agents-frontend.md) | AI Agent 前端开发规范（工作流程、设计原则、命名规范、质量保证、安全规范、BMAD 协作） |
| [docs/00-initialization-plan.md](./docs/00-initialization-plan.md) | 工程初始化总体方案（定位、技术栈、目录结构、路线图） |
| [docs/ai-collaboration/core-requirements.md](./docs/ai-collaboration/core-requirements.md) | 核心需求清单（不可违反） |
| [README.md](./README.md) | 项目首页文档 |
| [.bmad/bmm/docs/quick-start.md](./.bmad/bmm/docs/quick-start.md) | BMAD 快速入门 |
| [.bmad/bmm/docs/agents-guide.md](./.bmad/bmm/docs/agents-guide.md) | BMAD Agent 完整指南 |
