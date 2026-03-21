# Monorepo 架构参考

## 包结构与依赖关系

```
shadcn-vue-ui/                    (root — Yarn Workspaces)
├── packages/
│   ├── ui/                       基础 UI 组件（shadcn-vue 源码级）
│   │   └── src/components/ui/    21 个组件
│   └── shared/                   共享层
│       └── src/
│           ├── design-tokens/    Design Token 定义
│           ├── components/       跨子项目共享组件
│           ├── composables/      共享组合式函数
│           ├── utils/            工具函数
│           └── types/            共享类型
├── shadcn-vue-ui-console/        AI 平台控制台子项目
└── shadcn-vue-ui-business/       业务管理后台子项目
```

## 依赖方向（严格单向）

```
console ──→ shared ──→ ui
business ─↗           ↑
                      │
              Reka UI ┘ (外部依赖)
```

### 规则
1. **ui 包**：只依赖 Reka UI 和 Vue 核心，不依赖 shared 或子项目
2. **shared 包**：可依赖 ui 包，不依赖子项目
3. **子项目**：可依赖 ui 和 shared，子项目间不互相依赖

## 何时放在哪个包

| 代码类型 | 位置 | 判断标准 |
|---------|------|---------|
| 通用 UI 组件（Button, Table, Dialog） | packages/ui | shadcn-vue 原生或基于 Reka UI |
| Design Token 定义 | packages/shared | 两个子项目都使用 |
| 通用 composable（useTheme, useBreakpoint） | packages/shared | 两个子项目都使用 |
| 共享类型定义 | packages/shared | 两个子项目都引用的类型 |
| 控制台专用组件（ModelCard, AgentChat） | console/src/components | 仅控制台使用 |
| 业务后台专用组件 | business/src/components | 仅业务后台使用 |
| 页面级组件 | 各子项目/src/pages | 永远在子项目内 |

## 跨包变更注意事项

1. **修改 packages/ui 中的组件**：
   - 影响范围：所有子项目 + packages/shared
   - 必须在两个子项目中验证
   - API 变更需要通知所有消费者

2. **修改 packages/shared**：
   - 影响范围：所有子项目
   - Design Token 变更需要在亮/暗模式下都验证

3. **修改子项目内组件**：
   - 影响范围：仅该子项目
   - 如果发现"另一个子项目也需要"，考虑提升到 shared

## Yarn Workspaces 常用操作

```bash
# 安装所有依赖
yarn install

# 为特定包添加依赖
yarn workspace shadcn-vue-ui-console add lodash

# 运行特定子项目
yarn dev:console
yarn dev:business

# 全局 lint
yarn lint

# 全局构建
yarn build
```

## 新增包的流程

1. 在 packages/ 或根目录创建文件夹
2. 创建 package.json（name 使用 `@shadcn-vue-ui/xxx` 格式）
3. 在根 package.json 的 workspaces 中注册
4. 配置 tsconfig 路径别名
5. 在消费方的 package.json 中添加依赖
6. 运行 `yarn install` 更新链接
