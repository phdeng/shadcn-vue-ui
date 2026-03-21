# Design Token 体系参考

## 目录
1. Token 架构
2. 颜色 Token
3. 间距与尺寸
4. 排版
5. 动效
6. 新增 Token 的流程

---

## 1. Token 架构

Design Token 分三层：
```
Primitive Token (原始值)
  → Semantic Token (语义值)
    → Component Token (组件值)
```

示例：
```
oklch(0.98 0.01 240)     ← Primitive
--background              ← Semantic
bg-background             ← Component (Tailwind 映射)
```

项目使用 Semantic Token 层，通过 CSS 变量定义，由 Tailwind CSS v4 消费。

## 2. 颜色 Token

### 完整 Token 清单

| Token | 用途 | 亮色示例 | 暗色示例 |
|-------|------|---------|---------|
| `--background` | 页面背景 | 近白 | 近黑 |
| `--foreground` | 默认文字 | 近黑 | 近白 |
| `--card` | 卡片背景 | 白 | 深灰 |
| `--card-foreground` | 卡片文字 | 近黑 | 近白 |
| `--primary` | 主操作色 | 品牌蓝 | 品牌蓝(亮) |
| `--primary-foreground` | 主色上的文字 | 白 | 黑 |
| `--secondary` | 次要操作色 | 灰 | 深灰 |
| `--secondary-foreground` | 次要色上的文字 | 近黑 | 近白 |
| `--muted` | 弱化背景 | 浅灰 | 深灰 |
| `--muted-foreground` | 弱化文字 | 中灰 | 中灰 |
| `--accent` | 强调背景 | 浅色 | 深色 |
| `--accent-foreground` | 强调色文字 | 近黑 | 近白 |
| `--destructive` | 危险/错误 | 红 | 红(亮) |
| `--destructive-foreground` | 危险色上的文字 | 白 | 白 |
| `--border` | 边框 | 浅灰 | 深灰 |
| `--input` | 输入框边框 | 浅灰 | 深灰 |
| `--ring` | 焦点环 | 品牌色 | 品牌色 |

### 侧边栏专用 Token
```
--sidebar-background
--sidebar-foreground
--sidebar-primary
--sidebar-primary-foreground
--sidebar-accent
--sidebar-accent-foreground
--sidebar-border
--sidebar-ring
```

### 图表色板
```
--chart-1 ~ --chart-5
```

## 3. 间距与尺寸

使用 Tailwind 默认的 spacing scale（基于 4px）：
- `p-1` = 4px, `p-2` = 8px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px

组件尺寸（size prop 映射）：
| Size | Height | Padding-x | Font |
|------|--------|-----------|------|
| sm | h-8 (32px) | px-3 | text-xs |
| md | h-10 (40px) | px-4 | text-sm |
| lg | h-12 (48px) | px-6 | text-base |

## 4. 排版

字体族：系统字体栈
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

排版 scale：
| 用途 | Class | 大小 |
|------|-------|------|
| 正文 | text-sm | 14px |
| 小字 | text-xs | 12px |
| 标题 | text-lg ~ text-2xl | 18~30px |
| 标签 | text-xs + font-medium | 12px 中等 |

## 5. 动效

### 基本原则
- 使用 CSS transition 而非 animation（除非需要关键帧）
- 默认时长：150ms（微交互）、200ms（展开/折叠）、300ms（页面级过渡）
- 缓动函数：`ease-in-out`（默认）、`ease-out`（进入）、`ease-in`（离开）
- 尊重 `prefers-reduced-motion`

### 实现
```css
.transition-default {
  transition: all 150ms ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

## 6. 新增 Token 的流程

1. 确认是否真的需要新 Token（而非复用已有语义）
2. 命名遵循 `--[scope]-[property]` 格式
3. 在 light 和 dark 两套主题中都定义值
4. 在 Tailwind 配置中注册映射
5. 更新本文档
6. 通知相关组件消费新 Token
