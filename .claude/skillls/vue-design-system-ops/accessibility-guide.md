# 可访问性指南

## 必读摘要（每次组件变更必看）

每个组件必须满足以下最低要求：
1. 语义化 HTML（用 `<button>` 而非 `<div @click>`）
2. ARIA 角色和属性（交互组件必须有 role 和 aria-* 属性）
3. 键盘可操作（Tab 可达、Enter/Space 可触发、Escape 可关闭）
4. 焦点可见（`:focus-visible` 样式 + `--ring` token）
5. 屏幕阅读器可理解（aria-label / aria-describedby）
6. 颜色对比度达 WCAG AA（4.5:1 普通文字, 3:1 大字/UI 元素）

---

## 详细指南

### 键盘导航模式

| 组件类型 | Tab | Enter/Space | Escape | 方向键 |
|---------|-----|-------------|--------|--------|
| Button | 聚焦 | 触发点击 | — | — |
| Dialog | 聚焦内容 | — | 关闭 | — |
| Menu | 聚焦首项 | 选中 | 关闭 | 上下导航 |
| Tabs | 聚焦活跃标签 | 选中 | — | 左右切换 |
| Select | 聚焦触发器 | 打开/选中 | 关闭 | 上下浏览选项 |
| Accordion | 聚焦触发器 | 展开/折叠 | — | 上下切换 |

### ARIA 属性速查

```html
<!-- Button -->
<button aria-label="关闭对话框" aria-disabled="true">

<!-- Dialog -->
<div role="dialog" aria-modal="true" aria-labelledby="title-id">
  <h2 id="title-id">标题</h2>
</div>

<!-- Menu -->
<div role="menu" aria-orientation="vertical">
  <div role="menuitem" tabindex="0">选项1</div>
  <div role="menuitem" tabindex="-1">选项2</div>
</div>

<!-- Tabs -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1">
  <button role="tab" aria-selected="false" aria-controls="panel-2">
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">

<!-- Alert -->
<div role="alert" aria-live="assertive">

<!-- Loading -->
<div role="status" aria-live="polite" aria-label="加载中">
```

### 焦点管理

#### Focus Trap（焦点陷阱）
用于 Dialog、Sheet 等覆盖层组件：
- 打开时焦点移入，Tab 循环在内部
- 关闭时焦点还原到触发元素
- Reka UI 的 Dialog/Popover 已内置此行为

#### Focus Restore（焦点还原）
- 组件关闭后，焦点回到触发元素
- 触发元素已被移除时，焦点回到最近的可聚焦祖先

### 颜色与对比度

使用 oklch 色彩空间时注意：
- `foreground` 与 `background` 的对比度必须 ≥ 4.5:1
- `muted-foreground` 也必须 ≥ 4.5:1（这是常见遗漏）
- 仅靠颜色传达信息时，必须同时提供文字或图标辅助

### 动效无障碍

```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

### 常见错误清单

| 错误 | 正确做法 |
|------|---------|
| `<div @click>` 做按钮 | 用 `<button>` 或 Reka UI 原语 |
| 图标按钮无文字 | 加 `aria-label` |
| 自定义 Select 无键盘支持 | 用 Reka UI SelectRoot |
| toast 无 aria-live | 加 `role="status" aria-live="polite"` |
| 模态框外可 Tab 到 | 用 Focus Trap |
| 仅靠颜色区分状态 | 同时用图标或文字 |
| 输入框无关联 label | 用 `<label for="...">` 或 `aria-label` |
