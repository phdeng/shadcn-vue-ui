# shadcn-vue-ui Console

面向 AI 基础设施与平台能力管理的控制台，统一管理大语言模型、知识库与智能体。

## 技术栈

- **Vue 3** — Composition API + `<script setup>`
- **TypeScript** — 严格模式
- **Vite 8** — 构建工具（rolldown）
- **Tailwind CSS v4** — oklch 色彩空间
- **shadcn-vue + Reka UI** — UI 组件系统
- **Pinia** — 状态管理
- **Vue Router** — 路由 + 认证守卫 + NProgress
- **Chart.js** — 数据可视化（懒加载）
- **marked + DOMPurify** — Markdown 渲染（懒加载）

## 功能模块

| 模块 | 页面 | 说明 |
|------|------|------|
| 概览 | Dashboard | 统计卡片（count-up 动画）、调用趋势图、模型分布图、服务状态、最近活动 |
| 模型管理 | 列表 / 详情 | 6 个模型、搜索筛选、注册对话框、暂停/启动/删除、调用记录、运行日志 |
| 数据集 | 列表 | 12 条数据、表格分页、上传对话框、格式/状态筛选 |
| 模型训练 | 列表 | 训练任务 CRUD、进度条、状态管理（训练中/已完成/失败/排队） |
| 知识库 | 列表 / 详情 / 文档详情 | 6 个知识库、文档管理、召回测试（Rerank）、分段查看、Embedding 配置 |
| Agent | 列表 / 详情 | 6 个 Agent、对话测试（打字指示器）、配置信息、调用日志 |
| 插件市场 | 列表 | Prompt / MCP / Skill 分类筛选 |
| ChatAgent | 对话 | Agent 切换联动、推荐提问 chips、Markdown 渲染 |
| 系统设置 | 3 Tab | 基本设置、安全设置（密码强度校验）、通知设置（Webhook URL 校验） |

## 质量指标

| 指标 | 数值 |
|------|------|
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |
| TypeScript 类型错误 | 0 |
| console.log | 0 |
| 未使用组件 | 0 |

## 性能优化

- Chart.js 懒加载（`defineAsyncComponent`）— DashboardPage -93%
- marked + DOMPurify 懒加载（`requestIdleCallback` 预热）— ChatAgentPage -71%
- Vue/Router/Pinia vendor chunk 拆分 — 支持长期缓存
- Inter 字体 preload — 消除 FOIT
- 路由级代码分割 — 每个页面独立 chunk
- 骨架屏加载态 — 所有列表页和详情页

## 开发

```bash
# 安装依赖（在 monorepo 根目录）
yarn install

# 启动开发服务器
yarn workspace shadcn-vue-ui-console dev

# 类型检查
yarn workspace shadcn-vue-ui-console typecheck

# 构建
yarn workspace shadcn-vue-ui-console build

# 预览构建产物
yarn workspace shadcn-vue-ui-console preview
```

## 登录

Mock 模式：任意非空邮箱 + 任意非空密码即可登录。

默认填充：`timon@example.com` / `123456`
