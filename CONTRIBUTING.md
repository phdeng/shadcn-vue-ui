# 贡献指南

感谢你对 shadcn-vue-ui 的关注！以下是参与贡献的流程和规范。

## 开发环境

- **Node.js** >= 20.0.0
- **Yarn** 1.22+（包管理）
- **IDE** 推荐 VS Code + Volar 扩展

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/phdeng/shadcn-vue-ui.git
cd shadcn-vue-ui

# 安装依赖
yarn install

# 启动 Console 开发服务器
yarn dev:console

# 启动 Business 开发服务器
yarn dev:business
```

## 项目结构

```
shadcn-vue-ui/
├── packages/shared/     # 共享组件和工具函数
├── packages/ui/         # shadcn-vue 基础 UI 组件
├── shadcn-vue-ui-console/   # AI 平台控制台
├── shadcn-vue-ui-business/  # 业务管理后台
└── docs/                # 项目文档
```

## 开发规范

### 代码风格

- 使用 **TypeScript** 严格模式
- 使用 **Vue 3 Composition API** + `<script setup>`
- 使用 **Tailwind CSS v4** 原子类，颜色必须用 CSS 变量
- 使用 `cn()` 函数合并类名
- ESLint 检查：`yarn lint`

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue 组件 | PascalCase | `ModelCard.vue` |
| TypeScript 文件 | camelCase | `useTheme.ts` |
| CSS 变量 | kebab-case | `--primary` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |

### 语言规则

- 代码注释使用**中文**
- 新文件添加 `@author` 标注
- Commit message 使用**中文**

### Commit 规范

```
<type>: <description>

type:
- feat: 新功能
- fix: Bug 修复
- docs: 文档更新
- chore: 工程配置
- refactor: 重构
- style: 样式调整
- perf: 性能优化
```

## 提交流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/your-feature`
3. 开发并确保 `yarn lint` 和 `yarn build:console` 通过
4. 提交更改
5. 推送到分支：`git push origin feat/your-feature`
6. 提交 Pull Request

## 相关文档

- [CLAUDE.md](./CLAUDE.md) — AI 协作入口
- [agents-frontend.md](./agents-frontend.md) — 前端开发规范
- [docs/01-design-system.md](./docs/01-design-system.md) — 设计系统
- [docs/02-component-guide.md](./docs/02-component-guide.md) — 组件指南
