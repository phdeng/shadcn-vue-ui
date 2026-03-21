# shadcn-vue-ui Business

面向通用业务管理与运营后台，覆盖用户、订单、角色、内容、报表等核心业务模块。

## 技术栈

- **Vue 3** — Composition API + `<script setup>`
- **TypeScript** — 严格模式
- **Vite 8** — 构建工具
- **Tailwind CSS v4** — oklch 色彩空间
- **shadcn-vue + Reka UI** — UI 组件系统
- **Pinia** — 状态管理
- **Vue Router** — 路由 + 认证守卫 + NProgress
- **Chart.js** — 数据可视化（懒加载）

## 功能模块

| 模块 | 页面 | 说明 |
|------|------|------|
| 概览 | Dashboard | 统计卡片、用户增长趋势图、订单分布图、系统状态 |
| 用户管理 | 列表 / 详情 | 搜索筛选、角色标签、状态切换、重置密码、删除确认 |
| 订单管理 | 列表 / 详情 | 状态筛选、订单处理、取消确认、时间线、操作记录 |
| 角色管理 | 列表 | 卡片布局、权限管理、创建/编辑/删除 |
| 内容管理 | 列表 | 发布状态、分类筛选、编辑/预览/下线/删除 |
| 数据报表 | 报表 | 营收趋势、Top 5 产品、7 日订单汇总 |
| 系统设置 | 3 Tab | 基本设置、安全设置、通知设置 |

## 开发

```bash
# 安装依赖（在 monorepo 根目录）
yarn install

# 启动开发服务器
yarn workspace shadcn-vue-ui-business dev

# 类型检查
yarn workspace shadcn-vue-ui-business typecheck

# 构建
yarn workspace shadcn-vue-ui-business build
```

## 登录

Mock 模式：任意非空邮箱 + 任意非空密码即可登录。

默认填充：`timon@example.com` / `123456`
