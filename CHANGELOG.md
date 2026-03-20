# 更新日志

本文件记录 shadcn-vue-ui 项目的所有重要变更。

---

## 2026-03-21

### Sprint 4 — 数据可视化 + Toast 通知
- 集成 Chart.js（vue-chartjs）轻量图表方案
- Dashboard 折线图：7 天调用趋势（面积填充 + 平滑曲线）
- Dashboard 环形图：模型调用占比分布
- 封装 LineChart / DoughnutChart 可复用组件
- 集成 Sonner 全局 Toast 通知系统

### Sprint 3 — 鉴权与权限系统
- 登录页：Dify 风格全屏登录（品牌区 + 表单卡片）
- Auth Store：Pinia 认证状态 + JWT Token 持久化
- 路由守卫：未登录拦截 + 页面标题自动更新
- 用户下拉菜单：个人设置 / 帮助文档 / 退出登录

### Sprint 2 — 数据层与表单
- useRequest 请求封装 composable
- Mock 数据层：6 模型 + 20 调用记录 + 类型定义
- 模型注册 Dialog：Dify 风格表单弹窗
- Agent 创建 Dialog：创建表单 + 头像颜色选择
- SimplePagination 分页组件
- PageLoading 骨架屏 + PageError 错误重试

### Sprint 1 — 体验基础
- 路由过渡动效（fade + translateY）
- 侧边栏导航配置化（config/navigation.ts）
- ChatAgent Markdown 渲染（marked + DOMPurify）
- 全局错误处理（app.config.errorHandler）
- BMAD 圆桌会议输出迭代计划 v1

## 2026-03-20

### Console 产品化改造
- 设计升级：Dify / 阿里云 / Google Cloud 产品控制台风格
- 渐变统计卡片 + 毛玻璃顶栏 + 面包屑导航
- oklch 色彩 Token 调优 + Inter 字体本地化
- 7 个完整页面：概览 / 模型管理 / Agent / 知识库 / 插件市场 / ChatAgent / 占位页

### 工程初始化
- Monorepo 骨架：Yarn workspace + ESLint + Prettier + TypeScript
- 19 个 shadcn-vue 基础组件
- 3 个共享场景组件（PageHeader / StatCard / EmptyState）
- 设计 Token 体系（oklch 亮暗双模式）

### 项目规划
- CLAUDE.md — AI 协作入口
- agents-frontend.md — 前端开发规范
- 初始化方案 + 核心需求清单
- BMAD-METHOD v6 接入
