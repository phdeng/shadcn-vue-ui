# shadcn-vue-ui 工程初始化总体方案

> 版本：v1.0
> 日期：2026-03-20
> 状态：初始化规划

---

## 一、项目定位与价值主张

### 1.1 一句话定位

**shadcn-vue-ui 是一个轻量化、设计系统驱动、AI 协作友好的 Vue 3 中后台前端框架。**

它不是传统的"后台模板"，而是一套包含设计语言、组件体系、工程规范、AI 协作方法的现代中后台解决方案。

### 1.2 核心价值主张

| 维度 | 价值 |
|------|------|
| 对开发者 | 轻量起步、源码可控、快速搭建高质量中后台 |
| 对设计师 | 统一设计语言、Token 体系、亮暗双模式 |
| 对团队 | 清晰工程边界、可维护、可扩展、降低协作成本 |
| 对 AI | 显式规范、模板驱动、文档可追踪、大模型可直接接手开发 |
| 对社区 | 双子项目覆盖 AI 平台 + 通用业务，一套框架解决两类场景 |

### 1.3 目标用户

- 需要搭建 AI 管理平台的技术团队
- 需要搭建企业级业务后台的中小团队
- 追求高质量 UI 的独立开发者
- 使用 AI 辅助开发的工程师

---

## 二、为什么这个项目值得做

### 2.1 当前开源 Vue 后台项目的普遍问题

| 问题 | 表现 | 影响 |
|------|------|------|
| 依赖臃肿 | 动辄 30+ 依赖，构建产物 2MB+ | 加载慢、维护成本高 |
| 架构过重 | 微前端、复杂权限、过度抽象 | 学习成本高、改不动 |
| 审美同质化 | 千篇一律的蓝白黑后台 | 缺乏辨识度、用户体验平庸 |
| 组件拼装式 | 缺乏统一设计语言 | 视觉不一致、迭代失控 |
| AI 不友好 | 隐式约定多、文档缺失、边界模糊 | 大模型无法稳定接手 |

### 2.2 shadcn-vue-ui 的本质区别

**传统 Vue 后台模板：** 拼装组件 → 堆砌页面 → 一次性交付

**shadcn-vue-ui：** 建立设计语言 → 沉淀组件体系 → 构建页面模板 → 持续演进

| 维度 | 传统模板 | shadcn-vue-ui |
|------|----------|---------------|
| 组件控制权 | npm 黑盒依赖 | 源码级可控（shadcn 思想） |
| 设计体系 | 无或依赖第三方 | 自建 Design Token + 主题系统 |
| 架构复杂度 | 过度工程化 | 最小可行架构，按需增强 |
| AI 协作 | 完全不考虑 | 核心创新点 |
| 场景覆盖 | 单一模板包罗万象 | 双子项目精准匹配 |

---

## 三、双子项目的定位与区别

### 3.1 shadcn-vue-ui-console

**定位：** 面向 AI 基础设施与平台能力管理的控制台。

**核心场景：**
- 模型管理（注册、部署、版本、监控）
- Agent / Workflow 管理（创建、编排、执行记录）
- 知识库管理（上传、解析、索引、检索测试）
- Prompt 管理（模板、版本、A/B 测试）
- 插件 / Skills 管理（注册、配置、调用链）
- API 密钥 / Token / 配额管理
- 平台监控与可观测性面板

**信息架构：** 对象驱动 — 以"资源对象"为核心组织信息
**交互重点：** 配置编排、状态观测、关联关系
**视觉气质：** 专业、结构化、偏技术控制台

### 3.2 shadcn-vue-ui-business

**定位：** 面向通用业务管理与运营后台。

**核心场景：**
- 用户 / 角色 / 部门 / 菜单管理
- 订单 / 工单 / 内容 / 活动管理
- 数据报表与统计概览
- 运营配置与审核后台
- CRM / SaaS 类业务系统

**信息架构：** 流程驱动 — 以"业务流程"为核心组织信息
**交互重点：** 表格表单效率、筛选搜索、批量操作
**视觉气质：** 清晰、稳重、偏业务管理

### 3.3 两者的共享与独立

```
共享层（packages/shared + packages/ui）
├── 设计 Token（颜色、间距、圆角、阴影、字体）
├── 基础 UI 组件（Button, Card, Table, Form, Dialog...）
├── 通用工具函数（cn(), 格式化, 校验...）
├── 通用组合式函数（useTheme, usePermission...）
├── 通用类型定义
└── 工程规范（ESLint, Prettier, commit 规范）

独立层
├── console 专属场景组件（模型卡片、Agent 编排器、日志面板...）
├── console 专属页面与路由
├── console 专属布局
├── business 专属场景组件（高级表格、审批流、统计卡片...）
├── business 专属页面与路由
└── business 专属布局
```

---

## 四、核心设计原则

### 4.1 轻量化优先

- **依赖最小化：** 核心依赖控制在 10 个以内
- **按需引入：** 组件、图标、工具函数均支持 tree-shaking
- **构建体积：** 初始加载目标 < 200KB（gzip）
- **最小可行架构：** 先跑通核心链路，再逐步增强

### 4.2 高审美优先

- **风格关键词：** 简洁、克制、现代、留白、通透、精致、高级
- **拒绝传统后台审美：** 不做黑白蓝千篇一律的模板
- **亮暗双模式：** 每个子项目维护 1 套亮色 + 1 套暗色主题
- **设计一致性：** 所有组件遵循统一的 Token 体系

### 4.3 设计系统优先

- **分层建设：** Design Token → 基础组件 → 场景组件 → 页面模板
- **Token 可维护：** 颜色、间距、圆角、阴影、字体、动效全部 Token 化
- **组件可组合：** 遵循 shadcn 的 composable sub-component 模式

### 4.4 shadcn 思想优先

- **源码可控：** 组件源码在项目内，不是 npm 黑盒
- **组合式设计：** Card → CardHeader + CardTitle + CardContent + CardFooter
- **透明封装：** 所有封装可理解、可修改、可扩展
- **Reka UI 原语：** 底层使用 Reka UI（前身 Radix Vue）提供无障碍支持

### 4.5 场景化优先

- **不只是基础组件：** 还要建设管理后台高频场景组件
- **Console 场景：** 模型卡片、配置面板、状态指示器、日志查看器、用量仪表盘
- **Business 场景：** 高级筛选栏、CRUD 页面模板、统计概览卡、审批流程组件

### 4.6 AI 协作优先

- **显式规则：** 所有约定写入文档，不依赖隐式共识
- **模板驱动：** 组件和页面都有标准模板，AI 按模板输出
- **文档同步：** 开发即文档，模块完成即文档完成
- **自检机制：** 每次开发后按清单自检

---

## 五、推荐技术栈与理由

### 5.1 核心技术栈

| 技术 | 选型 | 为什么选它 | 为什么不选替代方案 |
|------|------|-----------|-------------------|
| 框架 | Vue 3 | 项目定位即 Vue 框架 | — |
| 语言 | TypeScript | 类型安全、IDE 支持、AI 友好 | JS 缺乏类型约束，AI 生成代码容易出错 |
| 构建 | Vite | 极快的 HMR、原生 ESM、Vue 官方推荐 | Webpack 太重；Turbopack 不成熟 |
| 路由 | Vue Router 4 | Vue 官方路由，与 Vue 3 深度集成 | — |
| 状态 | Pinia | Vue 官方推荐、轻量、TypeScript 友好 | Vuex 已进入维护模式 |
| CSS | Tailwind CSS v4 | 原子化、与 shadcn-vue 深度集成 | UnoCSS 兼容性略差；传统 CSS 维护成本高 |
| 组件原语 | Reka UI | 无样式、可访问性、shadcn-vue 底层依赖 | 直接用 Element Plus 等违背轻量化原则 |
| 组件分发 | shadcn-vue | 源码级可控、轻量、社区活跃 | 传统 npm 组件库无法深度定制 |
| 图标 | Lucide Vue Next | 一致性好、tree-shakable、shadcn-vue 默认 | Iconify 功能多但体积偏大 |
| 工具函数 | VueUse | 按需引入、覆盖面广、TS 完整支持 | 自写太多轮子 |
| 包管理 | Yarn | workspace 原生支持、社区成熟、生态稳定 | npm workspace 功能较弱；pnpm 部分场景兼容性不佳 |

### 5.2 样式工具链

| 工具 | 用途 |
|------|------|
| tailwindcss | 原子化 CSS |
| @tailwindcss/vite | Vite 集成插件 |
| tw-animate-css | 动画工具类 |
| class-variance-authority (cva) | 组件变体管理 |
| clsx | 条件类名拼接 |
| tailwind-merge | 类名冲突合并 |

### 5.3 开发工具链

| 工具 | 用途 |
|------|------|
| ESLint | 代码规范检查 |
| Prettier | 代码格式化 |
| @antfu/eslint-config | 开箱即用的 ESLint 配置 |
| simple-git-hooks | 轻量 git hooks |
| lint-staged | 暂存区代码检查 |
| VueDevTools | Vue 开发调试 |

### 5.4 明确不引入的技术

| 技术 | 原因 |
|------|------|
| Element Plus / Ant Design Vue | 违背轻量化和源码可控原则 |
| 微前端（qiankun/wujie） | 过度工程化，当前阶段不需要 |
| SSR（Nuxt） | 后台系统不需要 SSR |
| CSS-in-JS | 与 Tailwind 方案冲突 |
| Axios | fetch API + 轻量封装即可 |
| moment.js / dayjs | 按需引入 date-fns 或原生 Intl API |
| lodash 全量引入 | 按需 import 或用 VueUse 替代 |

---

## 六、根工程与双子项目目录结构方案

### 6.1 为什么选择 Monorepo

| 考量 | 结论 |
|------|------|
| 共享设计系统 | 需要统一的 Token 和基础组件 → Monorepo |
| 独立部署 | 两个子项目独立构建、独立部署 → Yarn workspace |
| 开发体验 | 改共享层自动热更新到子项目 → Monorepo |
| 复杂度控制 | 不需要 Turborepo/Nx 等重型工具 → Yarn workspace 足够 |

### 6.2 完整目录结构

```
shadcn-vue-ui/
├── .claude/                         # Claude Code 配置
│   └── skillls/                     # AI Skills（已有）
├── .github/                         # GitHub 配置
│   └── workflows/                   # CI/CD
├── .husky/                          # Git Hooks（或 simple-git-hooks）
│
├── CLAUDE.md                        # AI 协作入口（已创建）
├── README.md                        # 项目首页（已有）
├── package.json                     # 根 package.json（scripts + devDependencies）
├── package.json                     # 根 package.json（含 workspaces 配置）
├── .editorconfig                    # 编辑器统一配置
├── .gitignore                       # Git 忽略规则
├── .prettierrc                      # Prettier 配置
├── eslint.config.js                 # ESLint 配置
├── tsconfig.base.json               # TypeScript 基础配置
│
├── docs/                            # 项目文档体系
│   ├── 00-initialization-plan.md    # 本文档
│   ├── 01-design-system.md          # 设计系统文档
│   ├── 02-component-guide.md        # 组件开发指南
│   ├── 03-page-guide.md             # 页面开发指南
│   ├── 04-engineering.md            # 工程规范文档
│   ├── 05-routing-permission.md     # 路由与权限文档
│   └── ai-collaboration/            # AI 协作开发文档
│       ├── onboarding.md            # AI 认知入口
│       ├── task-card.md             # 任务卡模板
│       ├── component-prompt.md      # 组件开发 Prompt
│       ├── page-prompt.md           # 页面开发 Prompt
│       └── self-check.md            # 自检清单
│
├── packages/
│   ├── shared/                      # 共享包
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts             # 统一导出
│   │       ├── design-tokens/
│   │       │   ├── colors.css       # 颜色 Token
│   │       │   ├── spacing.css      # 间距 Token
│   │       │   └── typography.css   # 字体 Token
│   │       ├── components/          # 共享场景组件
│   │       │   ├── PageHeader/
│   │       │   ├── StatCard/
│   │       │   └── EmptyState/
│   │       ├── composables/         # 共享组合式函数
│   │       │   ├── useTheme.ts
│   │       │   ├── usePermission.ts
│   │       │   └── usePagination.ts
│   │       ├── utils/               # 工具函数
│   │       │   ├── cn.ts            # className 合并
│   │       │   ├── format.ts        # 格式化工具
│   │       │   └── request.ts       # HTTP 请求封装
│   │       └── types/               # 共享类型
│   │           ├── api.ts
│   │           ├── auth.ts
│   │           └── common.ts
│   │
│   └── ui/                          # shadcn-vue 基础 UI 组件
│       ├── package.json
│       ├── components.json          # shadcn-vue 配置
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── styles/
│           │   └── globals.css      # 全局样式 + CSS 变量
│           ├── components/
│           │   └── ui/              # shadcn-vue CLI 生成的组件
│           │       ├── button/
│           │       ├── card/
│           │       ├── dialog/
│           │       ├── table/
│           │       ├── form/
│           │       ├── input/
│           │       └── ...
│           └── lib/
│               └── utils.ts         # cn() 等工具
│
├── shadcn-vue-ui-console/           # 控制台子项目
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── index.html
│   ├── env.d.ts
│   ├── public/
│   └── src/
│       ├── App.vue
│       ├── main.ts
│       ├── assets/                  # 静态资源
│       │   ├── images/
│       │   └── icons/
│       ├── components/              # 控制台场景组件
│       │   ├── model/               # 模型管理相关
│       │   ├── agent/               # Agent 管理相关
│       │   ├── knowledge/           # 知识库管理相关
│       │   ├── dashboard/           # 仪表板组件
│       │   └── common/              # 控制台通用组件
│       ├── composables/             # 控制台组合式函数
│       ├── layouts/                 # 布局
│       │   ├── DefaultLayout.vue
│       │   ├── Sidebar.vue
│       │   ├── Header.vue
│       │   └── Footer.vue
│       ├── pages/                   # 页面（按功能模块）
│       │   ├── dashboard/
│       │   ├── model/
│       │   ├── agent/
│       │   ├── knowledge/
│       │   ├── prompt/
│       │   ├── plugin/
│       │   ├── settings/
│       │   └── auth/
│       ├── router/
│       │   ├── index.ts
│       │   ├── routes.ts
│       │   └── guards.ts
│       ├── stores/
│       │   ├── auth.ts
│       │   ├── app.ts
│       │   └── model.ts
│       ├── styles/
│       │   ├── index.css            # 入口样式
│       │   └── console-theme.css    # 控制台主题覆盖
│       └── types/
│
└── shadcn-vue-ui-business/          # 业务后台子项目
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.node.json
    ├── index.html
    ├── env.d.ts
    ├── public/
    └── src/
        ├── App.vue
        ├── main.ts
        ├── assets/
        ├── components/              # 业务场景组件
        │   ├── crud/                # CRUD 通用组件
        │   ├── filter/              # 高级筛选组件
        │   ├── stats/               # 统计展示组件
        │   ├── approval/            # 审批流组件
        │   └── common/              # 业务通用组件
        ├── composables/
        ├── layouts/
        │   ├── DefaultLayout.vue
        │   ├── Sidebar.vue
        │   ├── Header.vue
        │   └── Footer.vue
        ├── pages/                   # 页面（按功能模块）
        │   ├── dashboard/
        │   ├── user/
        │   ├── role/
        │   ├── menu/
        │   ├── order/
        │   ├── content/
        │   ├── report/
        │   ├── settings/
        │   └── auth/
        ├── router/
        ├── stores/
        ├── styles/
        │   ├── index.css
        │   └── business-theme.css
        └── types/
```

### 6.3 关键设计决策说明

**为什么 packages/ui 独立一个包？**
shadcn-vue 的组件通过 CLI 生成到 `components/ui/` 目录。将其放到独立包中，两个子项目可以共同引用，避免重复生成。

**为什么 packages/shared 和 packages/ui 分开？**
- `ui` 是 shadcn-vue 原生组件，由 CLI 管理
- `shared` 是项目自建的共享层（场景组件、工具、类型）
- 分开后职责清晰，互不干扰

**为什么不用 Turborepo？**
当前只有 2 个子项目 + 2 个共享包，Yarn workspace 完全够用。引入 Turborepo 增加学习成本和配置复杂度，违背轻量化原则。后续如果包增多，再评估引入。

---

## 七、UI / 主题设计方向

### 7.1 设计语言关键词

> **简洁 · 克制 · 现代 · 留白 · 通透 · 精致 · 高级**

### 7.2 色彩方案

采用 Tailwind CSS v4 的 **oklch** 色彩空间，优点：
- 感知均匀（同样的明度数值看起来真的一样亮）
- 色域更广
- 与 shadcn-vue 完全兼容

#### 亮色主题基调

| 角色 | oklch 值 | 说明 |
|------|----------|------|
| background | oklch(0.995 0.002 250) | 极浅冷灰蓝底 |
| foreground | oklch(0.18 0.01 260) | 深蓝黑文字 |
| primary | oklch(0.55 0.18 260) | 克制的靛蓝 |
| secondary | oklch(0.96 0.008 260) | 浅灰蓝辅色 |
| accent | oklch(0.65 0.20 180) | 通透青绿点缀 |
| muted | oklch(0.94 0.005 260) | 弱化背景 |
| destructive | oklch(0.58 0.22 25) | 暖红警告 |

#### 暗色主题基调

| 角色 | oklch 值 | 说明 |
|------|----------|------|
| background | oklch(0.14 0.01 260) | 深蓝黑底 |
| foreground | oklch(0.93 0.005 260) | 浅灰白文字 |
| primary | oklch(0.65 0.20 260) | 亮靛蓝 |
| secondary | oklch(0.22 0.015 260) | 深灰辅色 |
| accent | oklch(0.60 0.15 180) | 暗调青绿 |
| muted | oklch(0.25 0.01 260) | 弱化背景 |

### 7.3 排版规范

| Token | 值 | 说明 |
|-------|-----|------|
| font-family | Inter, system-ui, sans-serif | 优先 Inter 体现现代感 |
| font-size-base | 14px | 后台系统标准 |
| line-height-base | 1.6 | 舒适阅读间距 |
| font-weight-normal | 400 | 正文 |
| font-weight-medium | 500 | 标签、小标题 |
| font-weight-semibold | 600 | 标题 |

### 7.4 间距与圆角

| Token | 值 | 说明 |
|-------|-----|------|
| --radius | 0.5rem (8px) | 全局圆角基准，略小于 shadcn 默认值，更克制 |
| spacing-unit | 4px | 间距基准单元（4, 8, 12, 16, 20, 24, 32, 40, 48） |
| 卡片圆角 | --radius-lg = var(--radius) | 卡片使用标准圆角 |
| 按钮圆角 | --radius-md = calc(var(--radius) - 2px) | 按钮略小 |
| 输入框圆角 | --radius-md | 与按钮一致 |

### 7.5 阴影系统

```css
/* 轻盈、通透的阴影 */
--shadow-xs: 0 1px 2px oklch(0 0 0 / 0.04);
--shadow-sm: 0 1px 3px oklch(0 0 0 / 0.06), 0 1px 2px oklch(0 0 0 / 0.04);
--shadow-md: 0 4px 6px oklch(0 0 0 / 0.06), 0 2px 4px oklch(0 0 0 / 0.04);
--shadow-lg: 0 10px 15px oklch(0 0 0 / 0.06), 0 4px 6px oklch(0 0 0 / 0.04);
```

### 7.6 动效原则

- **克制：** 动效服务于体验，不做花哨动画
- **快速：** 过渡时长 150-250ms
- **自然：** 使用 ease-out 或 cubic-bezier(0.16, 1, 0.3, 1)
- **一致：** 所有组件使用统一的 transition timing

---

## 八、AI 协作开发方法论初版

### 8.1 项目认知入口（Onboarding Protocol）

一个新的 AI 模型（或新开发者）接手项目时，应按以下顺序理解项目：

```
Step 1: 阅读 CLAUDE.md          → 了解项目概览、技术栈、目录结构、规范
Step 2: 阅读 README.md          → 了解项目定位、双子项目差异
Step 3: 阅读本文档（初始化方案）  → 了解设计原则、技术选型决策
Step 4: 阅读设计系统文档          → 了解 Token 体系、组件规范
Step 5: 阅读目标子项目的路由文件   → 了解页面结构
Step 6: 阅读目标模块的组件代码     → 了解实现模式
```

### 8.2 需求拆解方法（Decomposition Method）

面对一个复杂需求时，按以下维度拆解：

```
需求名称: [名称]
├── 页面拆解: 需要哪些页面/路由？
│   └── 页面 1: /models
│   └── 页面 2: /models/:id
├── 区块拆解: 每个页面包含哪些区块？
│   └── 页面头部（标题 + 操作按钮）
│   └── 筛选区
│   └── 内容区（表格/卡片）
│   └── 分页
├── 组件拆解: 需要哪些组件？
│   └── 基础 UI: Button, Table, Dialog（已有）
│   └── 场景组件: ModelCard, ModelStatusBadge（需新建）
├── 状态拆解: 需要哪些状态管理？
│   └── Store: useModelStore
│   └── 本地状态: 筛选条件、分页参数
├── 接口拆解: 需要对接哪些 API？
│   └── GET /api/models
│   └── POST /api/models
│   └── PUT /api/models/:id
└── 文档拆解: 需要更新哪些文档？
    └── 组件文档: ModelCard
    └── 页面文档: 模型管理页
```

### 8.3 组件开发 Prompt 模板

```
你是 shadcn-vue-ui 项目的组件开发者。请基于以下规范开发组件。

## 组件信息
- 组件名称: [ComponentName]
- 所属项目: [console / business / shared]
- 所属模块: [模块名称]
- 组件类型: [基础组件 / 场景组件 / 业务组件]

## 功能描述
[简述组件功能]

## 技术要求
- 使用 Vue 3 Composition API + <script setup lang="ts">
- 遵循 CLAUDE.md 中的组件模板
- Props 必须有 TypeScript 类型定义
- 使用 Tailwind CSS v4 原子类
- 支持亮色/暗色模式
- 使用 cn() 函数合并类名

## 文件结构
ComponentName/
├── ComponentName.vue
├── index.ts
└── types.ts

## 参考
- 参考项目现有组件的代码风格
- 参考 shadcn-vue 的 composable sub-component 模式
```

### 8.4 页面开发 Prompt 模板

```
你是 shadcn-vue-ui 项目的页面开发者。请基于以下规范开发页面。

## 页面信息
- 页面名称: [页面名称]
- 路由路径: [/path]
- 所属项目: [console / business]
- 所属模块: [模块名称]

## 页面结构
- 页面头部: [标题、描述、操作按钮]
- 内容区域: [表格 / 卡片列表 / 表单 / 详情]
- 底部区域: [分页 / 无]

## 数据与状态
- Store: [store 名称]
- API: [API 路径列表]
- 本地状态: [筛选条件、弹窗状态等]

## 技术要求
- 使用 Vue 3 Composition API + <script setup lang="ts">
- 遵循 CLAUDE.md 中的页面模板
- 路由使用 Vue Router，在 router/routes.ts 中注册
- 使用 Pinia Store 管理共享状态
```

### 8.5 任务卡机制

每个开发任务用结构化任务卡描述：

```yaml
任务编号: TASK-001
任务名称: 开发模型管理列表页
优先级: P0
所属项目: console
所属模块: model
前置依赖: [TASK-000 基础布局]
任务类型: 页面开发

交付物:
  - 文件: src/pages/model/ModelList.vue
  - 文件: src/stores/model.ts
  - 文件: src/router/routes.ts（更新）
  - 文档: docs/pages/model-list.md

验收标准:
  - [ ] 页面可正常渲染
  - [ ] 支持亮色/暗色模式
  - [ ] TypeScript 无报错
  - [ ] 响应式布局正常
  - [ ] 路由注册正确
```

### 8.6 自检清单

每次开发完成后，按以下清单自检：

```
## 规范性检查
- [ ] 文件命名符合 PascalCase（组件）/ camelCase（工具函数）
- [ ] Props 有完整 TypeScript 类型
- [ ] 导出通过 index.ts 统一管理
- [ ] 代码注释使用中文

## 样式检查
- [ ] 使用 Tailwind CSS 原子类
- [ ] 使用 CSS 变量（--primary 等），不硬编码颜色
- [ ] 亮色模式视觉正常
- [ ] 暗色模式视觉正常
- [ ] 间距符合 Token 体系

## 功能检查
- [ ] 核心功能正常运行
- [ ] 边界情况处理（空状态、加载状态、错误状态）
- [ ] 无 console 报错

## 可维护性检查
- [ ] 组件职责单一
- [ ] 无重复代码
- [ ] 可被其他开发者（或 AI）理解
```

---

## 九、Skills / 教学式开发体系初版

### 9.1 体系概述

Skills 是一套面向 AI 模型的"标准操作规范"，让不同大模型（Qwen、GLM、Kimi、DeepSeek、Claude）都能按照统一规范参与项目开发。

### 9.2 Skills 清单

| Skill 名称 | 用途 | 触发场景 |
|------------|------|----------|
| `component-dev` | 按规范开发组件 | "创建/开发 XX 组件" |
| `page-dev` | 按规范开发页面 | "创建/开发 XX 页面" |
| `store-dev` | 按规范创建 Pinia Store | "创建 XX Store" |
| `router-config` | 按规范配置路由 | "添加/配置路由" |
| `theme-extend` | 按规范扩展主题 | "添加颜色/主题变量" |
| `api-integrate` | 按规范对接 API | "对接 XX 接口" |
| `layout-dev` | 按规范开发布局 | "创建/修改布局" |
| `doc-sync` | 按规范更新文档 | "更新文档" |
| `self-check` | 执行自检清单 | 每次开发完成后 |
| `task-decompose` | 拆解复杂需求为任务卡 | "拆解/规划 XX 需求" |

### 9.3 Skill 模板结构

每个 Skill 的文档结构：

```markdown
# Skill: [名称]

## 触发条件
[什么时候使用这个 Skill]

## 输入要求
[AI 需要获得哪些信息才能执行]

## 执行步骤
1. [步骤 1]
2. [步骤 2]
...

## 输出规范
[输出的文件、格式、命名]

## 示例
[完整的输入输出示例]

## 自检项
[完成后需要检查什么]
```

### 9.4 面向不同大模型的适配策略

| 模型 | 特点 | 适配建议 |
|------|------|----------|
| Claude | 上下文长、推理强 | 可给完整项目上下文，适合复杂任务 |
| Qwen | 中文理解好 | 中文 Prompt 效果最佳，适合文档类任务 |
| DeepSeek | 代码能力强 | 给足代码示例，适合组件/页面开发 |
| Kimi | 长文本处理好 | 适合阅读和理解项目全局 |
| GLM | 均衡 | 需要结构化 Prompt，步骤要明确 |

**通用原则：**
- Prompt 中永远包含项目技术栈信息
- 永远附上对应的模板代码
- 永远指明文件路径和命名规范
- 永远要求输出 TypeScript 类型

---

## 十、文档体系规划

### 10.1 文档分层

```
文档体系
├── 第一层：入口文档（快速了解）
│   ├── README.md — 项目首页
│   ├── CLAUDE.md — AI 协作入口
│   └── CONTRIBUTING.md — 贡献指南
│
├── 第二层：规划文档（理解设计）
│   ├── 00-initialization-plan.md — 初始化方案（本文档）
│   ├── 01-design-system.md — 设计系统文档
│   └── ROADMAP.md — 版本路线图
│
├── 第三层：开发文档（指导开发）
│   ├── 02-component-guide.md — 组件开发指南
│   ├── 03-page-guide.md — 页面开发指南
│   ├── 04-engineering.md — 工程规范文档
│   └── 05-routing-permission.md — 路由与权限
│
├── 第四层：AI 协作文档（AI 专用）
│   ├── ai-collaboration/onboarding.md
│   ├── ai-collaboration/task-card.md
│   ├── ai-collaboration/component-prompt.md
│   ├── ai-collaboration/page-prompt.md
│   └── ai-collaboration/self-check.md
│
└── 第五层：推广文档（对外输出）
    ├── CHANGELOG.md — 更新日志
    └── （后续）官方推广文案
```

### 10.2 文档编写原则

1. **先写后做：** 每个模块先写设计文档，再写代码
2. **同步更新：** 代码改了，文档必须同步改
3. **面向 AI：** 文档要结构化、无歧义、可机器阅读
4. **中文优先：** 所有文档使用中文

---

## 十一、第一阶段开发路线图

### Phase 0 — 工程骨架（本次 /init 目标）

**目标：** 搭建可运行的 Monorepo 骨架

| 任务 | 交付物 | 优先级 |
|------|--------|--------|
| 初始化 Yarn workspace | 根 package.json（workspaces 字段） | P0 |
| 初始化 packages/shared | package.json, tsconfig.json, src/index.ts | P0 |
| 初始化 packages/ui | package.json, components.json, 基础样式 | P0 |
| 初始化 console 子项目 | Vite + Vue 3 + TS 可运行骨架 | P0 |
| 初始化 business 子项目 | Vite + Vue 3 + TS 可运行骨架 | P0 |
| 配置 ESLint + Prettier | eslint.config.js, .prettierrc | P0 |
| 配置 TypeScript | tsconfig.base.json + 各子项目 tsconfig | P0 |
| 配置 Git | .gitignore, git hooks | P0 |
| 建立文档骨架 | docs/ 目录结构 | P1 |
| 创建 CLAUDE.md | 已完成 | Done |

### Phase 1 — 设计系统 + 基础组件

**目标：** 建立设计语言，添加核心基础组件

| 任务 | 交付物 | 优先级 |
|------|--------|--------|
| 定义设计 Token | colors.css, spacing.css, typography.css | P0 |
| 亮色主题实现 | globals.css :root 变量 | P0 |
| 暗色主题实现 | globals.css .dark 变量 | P0 |
| 添加 shadcn-vue 核心组件 | Button, Card, Dialog, Table, Form, Input, Select, Badge, Tabs, Dropdown | P0 |
| 主题切换功能 | useTheme composable | P0 |
| cn() 工具函数 | packages/ui/src/lib/utils.ts | P0 |
| 设计系统文档 | docs/01-design-system.md | P1 |

### Phase 2 — 布局系统 + 路由

**目标：** 两个子项目各自具备完整的布局和路由骨架

| 任务 | 交付物 | 优先级 |
|------|--------|--------|
| Console 默认布局 | DefaultLayout, Sidebar, Header | P0 |
| Business 默认布局 | DefaultLayout, Sidebar, Header | P0 |
| Console 路由骨架 | router/routes.ts（含基础路由） | P0 |
| Business 路由骨架 | router/routes.ts（含基础路由） | P0 |
| 路由守卫基础 | guards.ts | P1 |
| 布局响应式适配 | 移动端适配 | P1 |

### Phase 3 — 场景组件 + 示例页面

**目标：** 开发各子项目的核心场景组件和首批示例页面

| 任务 | 说明 | 优先级 |
|------|------|--------|
| Console Dashboard 页 | 仪表板示例 | P0 |
| Console 模型管理列表页 | 对象管理类页面示例 | P0 |
| Business Dashboard 页 | 统计概览示例 | P0 |
| Business 用户管理页 | CRUD 类页面示例 | P0 |
| 共享场景组件 | PageHeader, StatCard, EmptyState | P0 |
| Console 场景组件 | ModelCard, StatusBadge, LogPanel | P1 |
| Business 场景组件 | AdvancedFilter, CrudTable | P1 |

### Phase 4 — 完善与文档

**目标：** 完善工程能力，补齐文档

| 任务 | 说明 | 优先级 |
|------|------|--------|
| 权限系统设计 | usePermission, 路由权限 | P1 |
| 国际化基础 | i18n 方案（可选，后续按需） | P2 |
| 完善组件文档 | 每个组件的用法文档 | P1 |
| 完善 AI 协作文档 | Skill 文档、Prompt 模板 | P1 |
| 贡献指南 | CONTRIBUTING.md | P1 |
| 版本路线图 | ROADMAP.md | P2 |

---

## 十二、下一步行动

本方案经确认后，将进入 **Phase 0（工程骨架搭建）**：

1. 初始化 Git 仓库
2. 配置 Yarn workspace
3. 初始化 packages/shared 和 packages/ui
4. 使用 Vite 初始化两个子项目
5. 配置 ESLint + Prettier + TypeScript
6. 添加首批 shadcn-vue 基础组件
7. 验证 Monorepo 构建和开发体验

**请确认本方案是否符合预期，或告诉我需要调整的部分。确认后我将立即执行 Phase 0。**
