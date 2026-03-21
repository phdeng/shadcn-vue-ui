# 组件开发检查清单

每次组件新增或修改时逐项检查。

## 结构
- [ ] 组件文件夹结构：`ComponentName/ComponentName.vue + index.ts + types.ts`
- [ ] index.ts 统一导出组件和类型
- [ ] 放置在正确的包中（ui / shared / 子项目）

## 类型
- [ ] Props 类型在 types.ts 中定义并导出
- [ ] Emits 有完整类型定义
- [ ] 无 `any` 类型（除非有注释说明理由）
- [ ] 导出组件实例类型（如暴露了 ref 方法）

## API 一致性
- [ ] Props 命名遵循 camelCase
- [ ] 布尔 Props 使用 is/has/show 前缀
- [ ] 使用 variant prop 而非多个布尔 props
- [ ] size prop 使用 'sm' | 'md' | 'lg'
- [ ] 与同类组件的 API 风格一致
- [ ] v-model 使用 modelValue / update:modelValue

## 样式
- [ ] 所有颜色使用 CSS 变量（不硬编码）
- [ ] 间距使用 Tailwind spacing scale
- [ ] 圆角使用 --radius 基准
- [ ] 暗色模式正常（仅通过 token 切换）
- [ ] 响应式适配（至少 mobile/desktop）

## 可访问性
- [ ] 语义化 HTML 标签
- [ ] ARIA 角色和属性完备
- [ ] 键盘可完全操作（Tab + Enter + Escape + 方向键）
- [ ] 焦点样式可见（:focus-visible + --ring）
- [ ] 图标/操作有 aria-label
- [ ] 颜色对比度 WCAG AA
- [ ] prefers-reduced-motion 处理

## 代码质量
- [ ] `<script setup lang="ts">`
- [ ] 内部代码顺序：导入→Props→Emits→组合式→计算→方法
- [ ] 注释使用中文
- [ ] 无未使用的导入
- [ ] 无 console.log

## 文档
- [ ] 组件用途说明
- [ ] Props 文档
- [ ] 使用示例
- [ ] 变更日志条目（如是修改）
