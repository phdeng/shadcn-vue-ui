# shadcn-vue 约定与规范

本文档供 Agent 在操作 shadcn-vue 组件时参考。

## 目录
1. shadcn-vue 核心理念
2. 组件分发方式
3. 与 Reka UI 的关系
4. 样式约定
5. 组件注册与导出
6. 定制与覆写

---

## 1. shadcn-vue 核心理念

shadcn-vue 不是传统组件库（npm 安装后 import 使用），而是**源码级分发**：
- 组件代码直接复制到项目中
- 开发者拥有完整所有权，可自由修改
- 不存在"升级组件库版本"的概念
- 组件是起点，不是终点

这意味着：
- 修改 packages/ui 中的组件是正常操作，不是"hack"
- 可以根据项目需要删减或扩展组件
- 但要保持内部一致性

## 2. 组件分发方式

### 添加新组件（通过 CLI）
```bash
npx shadcn-vue@latest add button
```
组件会被添加到 `packages/ui/src/components/ui/` 下。

### 项目中的组件层次
```
packages/ui/src/components/ui/    # 基础 UI 组件（shadcn-vue 源码级）
packages/shared/src/components/   # 跨子项目共享的业务组件
shadcn-vue-ui-console/src/components/  # 控制台专用组件
shadcn-vue-ui-business/src/components/ # 业务后台专用组件
```

### 引用关系
- 子项目 → packages/ui ✅
- 子项目 → packages/shared ✅
- packages/shared → packages/ui ✅
- packages/ui → packages/shared ❌（禁止反向依赖）
- 子项目间互相引用 ❌

## 3. 与 Reka UI 的关系

Reka UI 是 shadcn-vue 的底层无样式原语库（类似 React 生态中的 Radix UI）。

### 使用原则
- 复杂交互组件（Dialog, Popover, Select, Tabs）优先使用 Reka UI 原语
- 简单组件（Button, Badge, Card）可直接实现
- 不重复实现 Reka UI 已提供的功能（焦点管理、键盘导航、ARIA）
- Reka UI 的 API 是稳定的上游依赖，不在项目中修改

### 典型用法
```vue
<script setup lang="ts">
import { DialogRoot, DialogTrigger, DialogContent, DialogOverlay } from 'reka-ui'
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <Button>打开</Button>
    </DialogTrigger>
    <DialogOverlay class="fixed inset-0 bg-black/50" />
    <DialogContent class="fixed left-1/2 top-1/2 ...">
      <slot />
    </DialogContent>
  </DialogRoot>
</template>
```

## 4. 样式约定

### Tailwind CSS v4 + oklch
- 所有颜色使用 CSS 变量映射到 oklch 色彩空间
- 不直接使用 Tailwind 预设颜色（如 `bg-blue-500`）
- 使用 `bg-primary`, `text-muted-foreground` 等语义化类名

### CSS 变量体系
```css
/* 基础 token */
--background / --foreground
--card / --card-foreground
--primary / --primary-foreground
--secondary / --secondary-foreground
--muted / --muted-foreground
--accent / --accent-foreground
--destructive / --destructive-foreground
--border / --input / --ring

/* 功能 token */
--sidebar-*          /* 侧边栏专用 */
--chart-1 ~ --chart-5  /* 图表色板 */
--radius             /* 全局圆角基准 */
```

### 圆角约定
```css
/* 组件层级圆角递减 */
容器: rounded-lg (calc(var(--radius)))
卡片: rounded-md (calc(var(--radius) - 2px))
内部元素: rounded-sm (calc(var(--radius) - 4px))
```

### 暗色模式
- 仅通过 CSS 变量切换，组件代码中不应有 `dark:` 前缀类名
- 所有颜色值必须在 light/dark 两套 token 中都有定义
- 测试时必须在两种模式下验证

## 5. 组件注册与导出

### 单组件导出
```typescript
// packages/ui/src/components/ui/button/index.ts
export { default as Button } from './Button.vue'
export type { ButtonProps } from './types'
```

### 子项目引用
```typescript
// shadcn-vue-ui-console/src/components/SomeComponent.vue
import { Button } from '@packages/ui'
```

## 6. 定制与覆写

### 合理的定制
- 修改默认 variant 样式
- 添加新的 variant
- 调整间距/圆角
- 扩展 props

### 需要谨慎的定制
- 修改组件的 ARIA 行为
- 移除 Reka UI 原语的默认行为
- 改变 v-model 的绑定语义

### 禁止的操作
- 在 packages/ui 组件中硬编码业务逻辑
- 在基础组件中引用子项目的类型或状态
