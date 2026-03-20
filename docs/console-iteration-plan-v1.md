# Console UI 迭代计划 v1

> 来源：BMAD 专家团队圆桌会议（Party Mode）
> 参与 Agent：🎨 Sally（UX）、📋 John（PM）、🏗️ Winston（架构师）、💻 Amelia（开发）、📚 Paige（文档）
> 日期：2026-03-20
> 状态：已批准，待执行

---

## 一、当前状态评估

### 已完成
- Monorepo 骨架（Yarn workspace）
- 19 个 shadcn-vue 基础组件
- 3 个共享场景组件（PageHeader / StatCard / EmptyState）
- 设计 Token 体系（oklch + 亮暗双模式）
- 7 个 Console 页面（概览 / 模型列表 / 模型详情 / Agent / 知识库 / 插件市场 / ChatAgent）
- Dify/云平台产品风格（渐变卡片 / 毛玻璃顶栏 / 面包屑 / 全局搜索）
- 侧边栏可折叠导航 + 模型子菜单

### 待改进
- 所有数据硬编码 mock，无 API 抽象层
- 无登录 / 鉴权 / 路由守卫
- 无路由过渡动效
- ChatAgent 无 Markdown 渲染
- 表格无分页排序
- 文档滞后于代码

---

## 二、迭代优先级

### Sprint 1 — 体验基础（预计 1-2 天）

| 编号 | 任务 | 负责角色 | 说明 |
|------|------|---------|------|
| S1-1 | 路由过渡动效 | UX + DEV | RouterView 添加 `<transition>` 包裹，fade + slide 动效 |
| S1-2 | 侧边栏折叠 tooltip | DEV | icon 模式下显示菜单名称 tooltip |
| S1-3 | ChatAgent Markdown 渲染 | DEV | 集成轻量 Markdown 渲染（v-html + 简单解析或 marked） |
| S1-4 | 导航配置化 | 架构 + DEV | 侧边栏菜单抽取为配置数据，支持动态菜单 |
| S1-5 | 全局错误处理 | DEV | app.config.errorHandler + 错误边界组件 |
| S1-6 | 构建验证 | DEV | 确保 `yarn build:console` 零报错 |

### Sprint 2 — 数据层与表单（预计 2-3 天）

| 编号 | 任务 | 负责角色 | 说明 |
|------|------|---------|------|
| S2-1 | useRequest 请求封装 | 架构 + DEV | 基于 fetch 的请求 composable，含 loading/error 状态 |
| S2-2 | Mock 数据层 | DEV | 将硬编码数据抽取为独立 mock 模块，为对接 API 做准备 |
| S2-3 | 模型注册 Dialog | UX + DEV | 创建模型表单弹窗（名称 / 提供商 / 端点 / 参数） |
| S2-4 | Agent 创建 Dialog | UX + DEV | 创建 Agent 表单弹窗（名称 / 描述 / 模型 / 能力标签） |
| S2-5 | 表格分页排序 | DEV | 模型详情调用记录表格增加分页和列排序 |
| S2-6 | 页面三态统一 | DEV | 所有列表页统一 Loading（Skeleton）/ Error / Empty 处理 |

### Sprint 3 — 鉴权与权限（预计 2 天）

| 编号 | 任务 | 负责角色 | 说明 |
|------|------|---------|------|
| S3-1 | 登录页设计与开发 | UX + DEV | 产品风格的登录页（账号密码 + 记住登录） |
| S3-2 | Auth Store | 架构 + DEV | Pinia useAuthStore，JWT Token 管理 |
| S3-3 | 路由守卫 | DEV | 未登录跳转登录页，角色权限校验 |
| S3-4 | 用户菜单 | DEV | 顶栏头像下拉菜单（个人设置 / 退出登录） |

### Sprint 4 — 数据可视化（预计 2 天）

| 编号 | 任务 | 负责角色 | 说明 |
|------|------|---------|------|
| S4-1 | 图表库选型与集成 | 架构 | 评估 ECharts / Chart.js / unovis，选择最轻量方案 |
| S4-2 | Dashboard 折线图 | DEV | 概览页"调用趋势"替换为真实折线图 |
| S4-3 | Dashboard 饼图 | DEV | 模型调用占比饼图 |
| S4-4 | 模型详情趋势图 | DEV | 单模型的调用量 / 延迟 / 错误率趋势图 |

### Sprint 5 — 文档与打磨（预计 1-2 天）

| 编号 | 任务 | 负责角色 | 说明 |
|------|------|---------|------|
| S5-1 | 设计系统文档 | 文档 | docs/01-design-system.md — Token / 色彩 / 字体 / 圆角 / 阴影 |
| S5-2 | 组件使用指南 | 文档 | docs/02-component-guide.md — 共享组件 API 和用法示例 |
| S5-3 | CHANGELOG 更新 | 文档 | 补充所有已完成的迭代内容 |
| S5-4 | 响应式适配 | UX + DEV | 平板和移动端断点测试与修复 |
| S5-5 | 主题微调 | UX | 根据实际使用反馈调优色彩 / 间距 / 阴影 |

---

## 三、技术决策记录

### 决策 1：Markdown 渲染方案
- **选择：** 使用 `marked` + `DOMPurify` 轻量方案
- **原因：** 不引入 markdown-it 或 tiptap 等重型方案，保持轻量化（marked ~28KB gzip）
- **替代方案：** 自写简单解析器（过于简陋）/ markdown-it（功能过多）

### 决策 2：图表库
- **推荐：** 延后决策到 Sprint 4，届时评估 ECharts / Chart.js / unovis
- **约束：** 必须支持 tree-shaking，gzip 后增量 < 50KB

### 决策 3：Mock 数据层
- **选择：** 简单的 TypeScript mock 模块（`/src/mocks/`），不引入 MSW
- **原因：** 当前阶段只需要静态 mock，MSW 过度

### 决策 4：路由过渡动效
- **选择：** CSS transition（fade + translateY），不用 Vue 动画库
- **原因：** 轻量，符合"克制"的设计原则

---

## 四、执行计划

立即开始 **Sprint 1**，按编号顺序逐项执行。
每个 Sprint 完成后提交代码并推送到远程仓库。

---

## 五、验收标准

每个 Sprint 完成后需满足：
- [ ] 所有页面亮暗模式正常
- [ ] TypeScript 零报错
- [ ] `yarn build:console` 构建成功
- [ ] 浏览器控制台无错误
- [ ] 新增功能有对应的中文注释
