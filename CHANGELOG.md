# 更新日志

本文件记录 shadcn-vue-ui 项目的所有重要变更。

---

## 2026-03-21

### Round 13 — Business 角色管理 + 内容管理
- 角色管理页：卡片布局 + 权限数/用户数 + 系统/自定义角色
- 内容管理页：表格布局 + 分类标签 + 发布状态筛选

### Round 12 — Business 用户管理 + 订单管理
- 用户管理页：8 用户表格 + Avatar + 角色/部门 Badge
- 订单管理页：8 订单表格 + 金额 + 4 状态

### Round 11 — 里程碑：Business 子项目初始化
- shadcn-vue-ui-business 完整骨架搭建
- 共享 packages/ui + packages/shared
- 布局/鉴权/路由/NProgress + 9 个页面模块

### Round 10 — 开源闭环
- MIT LICENSE 文件
- UI 包导出补全（command/sonner/textarea）
- Dashboard 快速操作增加"开始对话"

### Round 9 — Agent 详情页 + 服务状态面板
- Agent 详情页：对话测试 + 配置信息 + 调用日志 3 Tab
- Dashboard 服务状态面板（10 服务健康检查）
- shadcn-vue Textarea 组件

### Round 8 — 代码质量与细节打磨
- 侧边栏用户信息从 authStore 动态读取
- 模型卡片 hover 上浮效果（translateY）
- CHANGELOG 补充 Round 3-7 记录

### Round 7 — README 升级 + 产品细节
- README 全面重写：shields.io 徽章 + 快速开始 + 页面清单
- Dashboard 时段动态问候（早上好/下午好/晚上好）
- 侧边栏底部配额用量指示器

### Round 6 — 404 页面 + 主题过渡
- 404 页面：产品风格友好提示
- 暗色模式平滑过渡动画（CSS transition）
- .env.example 环境变量模板

### Round 5 — 知识库详情 + 全局进度条
- 知识库详情页：文档列表表格 + 上传入口
- NProgress 全局路由进度条
- 知识库列表卡片点击跳转详情

### Round 4 — Dialog 接入 + Toast + 面包屑
- 模型注册 Dialog + Agent 创建 Dialog 接入页面
- 登录/注册/创建操作 Toast 通知
- 面包屑多级化 + Console 可点击

### Round 3 — 消灭占位页 + Command Palette
- 数据集管理页（表格布局 + 状态筛选）
- 模型训练页（任务表格 + 进度条 + Loss）
- 系统设置页（3 Tab + Toast 保存）
- Command Palette（⌘K 全局搜索跳转）

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
