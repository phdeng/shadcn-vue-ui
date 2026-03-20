# shadcn-vue-ui 设计系统文档

> 版本：v1.0
> 日期：2026-03-21
> 状态：已建立

---

## 一、设计理念

### 1.1 风格方向

shadcn-vue-ui 的视觉设计对标三类产品的设计语言：

| 参考产品 | 吸收的设计特征 |
|----------|---------------|
| **Dify** | 通透感、大面积留白、轻盈卡片、精致的信息层级 |
| **阿里云控制台** | 专业的技术控制台气质、结构化信息组织、清晰的操作引导 |
| **Google Cloud Console** | 克制的色彩运用、高对比度的可读性、一致的组件语言 |

我们不追求视觉冲击力，而是追求**使用体验的精致感**。好的控制台设计应该像一件称手的工具：不张扬、不干扰、用得顺、看得舒服。

### 1.2 设计关键词

> **简洁 · 克制 · 现代 · 留白 · 通透 · 精致**

| 关键词 | 在设计中的体现 |
|--------|---------------|
| **简洁** | 去除不必要的装饰元素，视觉噪音最小化 |
| **克制** | 色彩使用节制，主色仅用于关键操作和状态提示，不滥用强调色 |
| **现代** | Inter 字体、oklch 色彩空间、圆角卡片、无边框设计 |
| **留白** | 页面内容不拥挤，信息区块之间保持充分呼吸感 |
| **通透** | 卡片、弹窗、侧边栏的阴影轻盈通透，不厚重不压迫 |
| **精致** | 滚动条、hover 状态、过渡动效等细节处理到位 |

### 1.3 视觉层级原则

页面的视觉信息层级通过**背景色阶差**和**阴影**来建立，而非通过粗重的边框线：

```
┌─────────────────────────────────────────────┐
│ 页面底色（--background）  极浅灰            │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │ 卡片（--card）  纯白 + 轻阴影        │   │
│  │                                      │   │
│  │  ┌───────────────────────────────┐   │   │
│  │  │ 弹窗（--popover）  纯白 + 中阴影│   │   │
│  │  └───────────────────────────────┘   │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────┐                               │
│  │ 侧边栏    │  微灰底，与内容区形成层次     │
│  └──────────┘                               │
└─────────────────────────────────────────────┘
```

---

## 二、色彩体系

### 2.1 oklch 色彩空间

本项目采用 **oklch** 色彩空间定义所有颜色，这是 Tailwind CSS v4 的原生推荐方案。

**oklch 语法：** `oklch(L C H)`

| 参数 | 含义 | 范围 |
|------|------|------|
| **L**（Lightness） | 感知亮度 | 0（纯黑）~ 1（纯白） |
| **C**（Chroma） | 色度/饱和度 | 0（无色）~ 0.4（极饱和） |
| **H**（Hue） | 色相角度 | 0 ~ 360（色环） |

**为什么选择 oklch？**

- **感知均匀：** 相同 L 值的颜色在视觉上看起来一样亮，传统 HSL 做不到
- **色域更广：** 能表示 P3 色域的颜色，在现代显示器上更精准
- **主题友好：** 调整亮暗模式只需改 L 值，色相和饱和度保持一致
- **与 shadcn-vue 完全兼容：** shadcn-vue v2 原生支持 oklch Token

### 2.2 亮色主题 Token 表

以下 Token 定义在 `packages/ui/src/styles/globals.css` 的 `:root` 选择器中。

#### 页面基础色

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--background` | `oklch(0.98 0.002 260)` | 页面底色，极浅灰，略带冷蓝调 |
| `--foreground` | `oklch(0.15 0.015 260)` | 页面主文字色，深蓝黑 |

#### 卡片与弹出层

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--card` | `oklch(1 0 0)` | 卡片背景，纯白 |
| `--card-foreground` | `oklch(0.15 0.015 260)` | 卡片文字色 |
| `--popover` | `oklch(1 0 0)` | 弹出层背景，纯白 |
| `--popover-foreground` | `oklch(0.15 0.015 260)` | 弹出层文字色 |

#### 功能色

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--primary` | `oklch(0.58 0.22 264)` | 主色，饱和靛蓝，用于主按钮、链接、焦点 |
| `--primary-foreground` | `oklch(0.99 0 0)` | 主色上的文字，近白 |
| `--secondary` | `oklch(0.965 0.005 260)` | 辅色背景，极浅灰 |
| `--secondary-foreground` | `oklch(0.25 0.015 260)` | 辅色文字 |
| `--muted` | `oklch(0.965 0.003 260)` | 弱化背景色，用于禁用、占位 |
| `--muted-foreground` | `oklch(0.50 0.01 260)` | 弱化文字色，用于说明文字、占位符 |
| `--accent` | `oklch(0.955 0.005 260)` | 强调背景色，用于 hover 高亮、选中态 |
| `--accent-foreground` | `oklch(0.25 0.015 260)` | 强调文字色 |
| `--destructive` | `oklch(0.60 0.24 25)` | 危险/警告色，暖红 |
| `--destructive-foreground` | `oklch(0.60 0.24 25)` | 危险文字色 |

#### 边框与交互

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--border` | `oklch(0.93 0.003 260)` | 通用边框色，极淡 |
| `--input` | `oklch(0.93 0.003 260)` | 输入框边框色 |
| `--ring` | `oklch(0.58 0.22 264)` | 聚焦环颜色，与主色一致 |

#### 图表色板

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--chart-1` | `oklch(0.58 0.22 264)` | 图表色 1，靛蓝（主色） |
| `--chart-2` | `oklch(0.65 0.19 165)` | 图表色 2，青绿 |
| `--chart-3` | `oklch(0.72 0.17 55)` | 图表色 3，琥珀 |
| `--chart-4` | `oklch(0.62 0.24 310)` | 图表色 4，紫红 |
| `--chart-5` | `oklch(0.68 0.22 30)` | 图表色 5，橙红 |

#### 侧边栏专用

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--sidebar` | `oklch(0.985 0.002 260)` | 侧边栏背景，微灰 |
| `--sidebar-foreground` | `oklch(0.35 0.01 260)` | 侧边栏文字 |
| `--sidebar-primary` | `oklch(0.58 0.22 264)` | 侧边栏主色（选中态） |
| `--sidebar-primary-foreground` | `oklch(0.99 0 0)` | 侧边栏主色文字 |
| `--sidebar-accent` | `oklch(0.955 0.008 264)` | 侧边栏 hover/强调背景 |
| `--sidebar-accent-foreground` | `oklch(0.20 0.015 260)` | 侧边栏强调文字 |
| `--sidebar-border` | `oklch(0.935 0.003 260)` | 侧边栏边框 |
| `--sidebar-ring` | `oklch(0.58 0.22 264)` | 侧边栏聚焦环 |

### 2.3 暗色主题 Token 表

以下 Token 定义在 `packages/ui/src/styles/globals.css` 的 `.dark` 选择器中。

#### 页面基础色

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--background` | `oklch(0.13 0.01 260)` | 页面底色，深蓝黑 |
| `--foreground` | `oklch(0.93 0.005 260)` | 页面主文字色，浅灰白 |

#### 卡片与弹出层

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--card` | `oklch(0.165 0.01 260)` | 卡片背景，深灰蓝 |
| `--card-foreground` | `oklch(0.93 0.005 260)` | 卡片文字色 |
| `--popover` | `oklch(0.165 0.01 260)` | 弹出层背景 |
| `--popover-foreground` | `oklch(0.93 0.005 260)` | 弹出层文字色 |

#### 功能色

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--primary` | `oklch(0.68 0.20 264)` | 主色，提亮靛蓝（暗色下需更亮） |
| `--primary-foreground` | `oklch(0.13 0.01 260)` | 主色上的文字，深色 |
| `--secondary` | `oklch(0.20 0.012 260)` | 辅色背景，深灰 |
| `--secondary-foreground` | `oklch(0.93 0.005 260)` | 辅色文字 |
| `--muted` | `oklch(0.20 0.012 260)` | 弱化背景色 |
| `--muted-foreground` | `oklch(0.60 0.01 260)` | 弱化文字色 |
| `--accent` | `oklch(0.20 0.012 260)` | 强调背景色 |
| `--accent-foreground` | `oklch(0.93 0.005 260)` | 强调文字色 |
| `--destructive` | `oklch(0.45 0.18 25)` | 危险色，暗调暖红 |
| `--destructive-foreground` | `oklch(0.70 0.22 25)` | 危险文字色，亮红 |

#### 边框与交互

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--border` | `oklch(0.23 0.01 260)` | 通用边框色，深灰 |
| `--input` | `oklch(0.23 0.01 260)` | 输入框边框色 |
| `--ring` | `oklch(0.68 0.20 264)` | 聚焦环颜色 |

#### 图表色板

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--chart-1` | `oklch(0.68 0.20 264)` | 图表色 1，靛蓝（提亮） |
| `--chart-2` | `oklch(0.65 0.19 165)` | 图表色 2，青绿 |
| `--chart-3` | `oklch(0.72 0.17 55)` | 图表色 3，琥珀 |
| `--chart-4` | `oklch(0.62 0.24 310)` | 图表色 4，紫红 |
| `--chart-5` | `oklch(0.68 0.22 30)` | 图表色 5，橙红 |

#### 侧边栏专用

| CSS 变量 | oklch 值 | 用途 |
|----------|----------|------|
| `--sidebar` | `oklch(0.145 0.01 260)` | 侧边栏背景，比页面底色略浅 |
| `--sidebar-foreground` | `oklch(0.75 0.008 260)` | 侧边栏文字 |
| `--sidebar-primary` | `oklch(0.68 0.20 264)` | 侧边栏主色 |
| `--sidebar-primary-foreground` | `oklch(0.93 0.005 260)` | 侧边栏主色文字 |
| `--sidebar-accent` | `oklch(0.20 0.012 260)` | 侧边栏 hover 背景 |
| `--sidebar-accent-foreground` | `oklch(0.93 0.005 260)` | 侧边栏强调文字 |
| `--sidebar-border` | `oklch(0.23 0.01 260)` | 侧边栏边框 |
| `--sidebar-ring` | `oklch(0.68 0.20 264)` | 侧边栏聚焦环 |

### 2.4 色彩使用规则

#### 基本原则

1. **禁止硬编码颜色值** — 所有颜色必须通过 CSS 变量引用，确保主题切换时自动适配
2. **主色节制使用** — `--primary` 仅用于主按钮、链接、选中态、聚焦环等关键视觉锚点
3. **层级靠灰度区分** — 不同层级的界面元素通过 L 值（亮度）的微妙差异来区分，而非色相
4. **色相统一** — 整套 Token 的色相角度（H）统一在 260 附近（蓝紫色域），保证视觉和谐

#### 在 Tailwind 中使用

```html
<!-- 正确：使用语义化颜色类 -->
<div class="bg-background text-foreground">
  <div class="bg-card rounded-lg shadow-sm">
    <h2 class="text-card-foreground">标题</h2>
    <p class="text-muted-foreground">描述文字</p>
    <button class="bg-primary text-primary-foreground">操作</button>
  </div>
</div>

<!-- 错误：硬编码颜色 -->
<div class="bg-white text-gray-900">
  <button class="bg-blue-600 text-white">操作</button>
</div>
```

#### 各场景色彩对照

| 场景 | 背景色 | 文字色 | 说明 |
|------|--------|--------|------|
| 页面整体 | `--background` | `--foreground` | 最外层容器 |
| 卡片/面板 | `--card` | `--card-foreground` | 内容承载区 |
| 主按钮 | `--primary` | `--primary-foreground` | CTA 按钮 |
| 次级按钮 | `--secondary` | `--secondary-foreground` | 非关键操作 |
| 说明文字 | — | `--muted-foreground` | 辅助信息 |
| Hover 高亮 | `--accent` | `--accent-foreground` | 列表项悬停 |
| 删除/危险 | `--destructive` | `--destructive-foreground` | 危险操作 |
| 输入框边框 | — | — | 使用 `--input` 作为 border-color |
| 聚焦状态 | — | — | 使用 `--ring` 作为 outline/ring |

---

## 三、字体排版

### 3.1 字体选择

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

**为什么选择 Inter？**

- 专为屏幕设计的无衬线字体，在小字号下可读性极佳
- Google Fonts 免费开源，中文回退到系统字体
- 支持可变字体（Variable Font），按需加载字重
- 现代产品感强，与 shadcn 设计语言一致

### 3.2 OpenType 特性

```css
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
font-variation-settings: 'opsz' 16;
```

| 特性代码 | 作用 |
|----------|------|
| `cv02` | 字母 `a` 使用简单形式（单层 a） |
| `cv03` | 字母 `r` 使用直角形式，更清晰 |
| `cv04` | 字母 `i` 使用带衬线的点，避免与 `l` 混淆 |
| `cv11` | 数字 `1` 使用无衬线形式 |
| `opsz 16` | 光学尺寸优化为 16px 基准，提升小字号可读性 |

这些特性使 Inter 在代码类产品界面中具有更好的字符辨识度。

### 3.3 字号层级体系

基于 Tailwind CSS 的 font-size 工具类，建立从标题到辅助文字的完整层级：

| 层级 | Tailwind 类 | 字号 | 字重 | 行高 | 使用场景 |
|------|-------------|------|------|------|----------|
| H1 | `text-2xl` | 24px | `font-semibold`（600） | 1.33 | 页面主标题 |
| H2 | `text-xl` | 20px | `font-semibold`（600） | 1.4 | 区块标题 |
| H3 | `text-lg` | 18px | `font-medium`（500） | 1.55 | 卡片标题 |
| H4 | `text-base` | 16px | `font-medium`（500） | 1.5 | 小节标题 |
| Body | `text-sm` | 14px | `font-normal`（400） | 1.43 | 正文、表格、表单 |
| Caption | `text-xs` | 12px | `font-normal`（400） | 1.33 | 辅助文字、标签、时间戳 |
| Tiny | `text-[11px]` | 11px | `font-medium`（500） | 1.27 | 徽标、角标 |

> **设计决策：** 后台系统的正文基准字号为 14px（`text-sm`），而非 16px。这是因为后台界面信息密度较高，14px 在保证可读性的同时能容纳更多内容。

### 3.4 字重使用规则

| 字重 | Tailwind 类 | 使用场景 |
|------|-------------|----------|
| 400 Regular | `font-normal` | 正文、描述文字、表格内容 |
| 500 Medium | `font-medium` | 标签、导航项、卡片标题、按钮文字 |
| 600 Semibold | `font-semibold` | 页面标题、区块标题、强调文字 |

> **注意：** 不使用 `font-bold`（700）和 `font-light`（300）。过粗的字体破坏精致感，过细的字体降低可读性。保持 400/500/600 三级字重是"克制"设计原则的体现。

### 3.5 排版代码示例

```html
<!-- 页面标题区域 -->
<header class="page-header">
  <h1 class="text-2xl font-semibold text-foreground">模型管理</h1>
  <p class="text-sm text-muted-foreground mt-1">管理和监控您的 AI 模型资源</p>
</header>

<!-- 卡片内部排版 -->
<div class="bg-card rounded-lg shadow-sm p-6">
  <h3 class="text-lg font-medium text-card-foreground">GPT-4o</h3>
  <p class="text-sm text-muted-foreground mt-2">最新的多模态模型，支持文本和图像输入</p>
  <div class="text-xs text-muted-foreground mt-4">更新于 2 小时前</div>
</div>
```

---

## 四、间距系统

### 4.1 基准单元

间距系统基于 Tailwind CSS 的 **4px 基准单元**。所有间距值都是 4 的倍数，确保对齐的规律性和视觉的整洁感。

```
1 单元 = 4px = 0.25rem
```

### 4.2 常用间距值

| Tailwind 类 | 像素值 | rem 值 | 使用场景 |
|-------------|--------|--------|----------|
| `p-1` / `m-1` / `gap-1` | 4px | 0.25rem | 紧凑图标间距、徽标内边距 |
| `p-1.5` / `m-1.5` / `gap-1.5` | 6px | 0.375rem | 极紧凑元素 |
| `p-2` / `m-2` / `gap-2` | 8px | 0.5rem | 按钮内边距、紧凑列表项间距 |
| `p-3` / `m-3` / `gap-3` | 12px | 0.75rem | 小卡片内边距、表单字段间距 |
| `p-4` / `m-4` / `gap-4` | 16px | 1rem | 标准卡片内边距、区块间距 |
| `p-5` / `m-5` / `gap-5` | 20px | 1.25rem | 稍宽松的卡片内边距 |
| `p-6` / `m-6` / `gap-6` | 24px | 1.5rem | 宽松卡片内边距、页面区块间距 |
| `p-8` / `m-8` / `gap-8` | 32px | 2rem | 大区块间距、页面段落间距 |
| `p-10` / `m-10` / `gap-10` | 40px | 2.5rem | 页面顶部/底部留白 |
| `p-12` / `m-12` / `gap-12` | 48px | 3rem | 大面积留白、章节分隔 |

### 4.3 页面间距规范

#### 页面容器

```html
<!-- 标准页面容器 -->
<div class="p-6 space-y-6">
  <!-- 页面头部 -->
  <!-- 页面内容 -->
</div>

<!-- 紧凑型页面（如设置页） -->
<div class="p-4 space-y-4">
  <!-- 页面头部 -->
  <!-- 页面内容 -->
</div>
```

#### 各层级间距参考

| 层级 | 间距 | 说明 |
|------|------|------|
| 页面外边距 | `p-6`（24px） | 页面内容与侧边栏/顶栏的距离 |
| 区块间距 | `space-y-6`（24px） | 页面内各功能区块之间 |
| 卡片内边距 | `p-6`（24px） | 卡片内部内容到边框的距离 |
| 卡片内区块间距 | `space-y-4`（16px） | 卡片内各部分之间 |
| 表单字段间距 | `space-y-4`（16px） | 表单各字段之间 |
| 按钮组间距 | `gap-2`（8px） | 并列按钮之间 |
| 图标与文字间距 | `gap-2`（8px） | 图标与其旁边的文字 |
| 列表项间距 | `gap-1`（4px） | 紧凑列表的各行之间 |

### 4.4 间距设计原则

1. **内大外小：** 同一容器内，内部元素的间距应小于容器到外部的间距
2. **亲密性原则：** 相关的元素间距更小，不相关的元素间距更大
3. **一致性：** 同一层级的间距保持统一，不要出现 14px、18px 这种非 4 倍数的值
4. **留白充分：** 宁可多留白也不要挤满，这是"通透"设计感的基础

---

## 五、圆角系统

### 5.1 圆角变量体系

全局圆角基准值定义在 `:root` 中：

```css
:root {
  --radius: 0.625rem; /* 10px */
}
```

基于 `--radius` 基准值，通过计算派生出完整的圆角层级：

| Tailwind 类 | CSS 变量 | 计算公式 | 实际值 | 使用场景 |
|-------------|----------|----------|--------|----------|
| `rounded-sm` | `--radius-sm` | `calc(var(--radius) - 4px)` | 6px | 小元素：徽标、标签、Chip |
| `rounded-md` | `--radius-md` | `calc(var(--radius) - 2px)` | 8px | 中等元素：按钮、输入框、下拉菜单 |
| `rounded-lg` | `--radius-lg` | `var(--radius)` | 10px | 标准元素：卡片、面板、对话框 |
| `rounded-xl` | `--radius-xl` | `calc(var(--radius) + 4px)` | 14px | 大元素：模态窗、大面板 |

### 5.2 各组件圆角规则

| 组件 | 圆角级别 | Tailwind 类 | 说明 |
|------|----------|-------------|------|
| Button | md | `rounded-md` | 按钮保持克制的圆角 |
| Input / Select | md | `rounded-md` | 与按钮保持一致 |
| Card | lg | `rounded-lg` | 卡片使用标准圆角 |
| Dialog / Sheet | lg | `rounded-lg` | 弹窗与卡片同级 |
| Dropdown Menu | lg | `rounded-lg` | 下拉菜单使用标准圆角 |
| Badge / Tag | sm | `rounded-sm` | 小元素用小圆角 |
| Tooltip | md | `rounded-md` | 提示框中等圆角 |
| Avatar | full | `rounded-full` | 头像为正圆 |
| Sidebar Item | md | `rounded-md` | 侧边栏菜单项 |

### 5.3 圆角设计原则

1. **不要用 `rounded-full` 做按钮** — 胶囊按钮不符合本项目的克制风格
2. **嵌套圆角递减** — 外层容器用 `rounded-lg`，内层元素用 `rounded-md` 或 `rounded-sm`
3. **统一比例感** — 同一视觉层级的组件使用相同圆角值
4. **修改 `--radius` 即可全局调整** — 如需整体调整圆角风格，只需修改基准值

---

## 六、阴影系统

### 6.1 设计原则

本项目的阴影设计追求**轻盈通透**，拒绝厚重粗暴的阴影。卡片承载不依赖边框线，而是靠微妙的阴影来建立层级感。

### 6.2 阴影层级

| Tailwind 类 | CSS 值 | 使用场景 |
|-------------|--------|----------|
| `shadow-xs` | `0 1px 2px oklch(0 0 0 / 0.04)` | 极轻微阴影，按钮静态态 |
| `shadow-sm` | `0 1px 3px oklch(0 0 0 / 0.06), 0 1px 2px oklch(0 0 0 / 0.04)` | 卡片默认阴影、输入框 |
| `shadow-md` | `0 4px 6px oklch(0 0 0 / 0.06), 0 2px 4px oklch(0 0 0 / 0.04)` | 悬浮卡片、下拉菜单、弹出层 |
| `shadow-lg` | `0 10px 15px oklch(0 0 0 / 0.06), 0 4px 6px oklch(0 0 0 / 0.04)` | 模态窗、大弹窗、浮层 |

### 6.3 使用规则

| 组件/场景 | 默认阴影 | Hover 阴影 | 说明 |
|-----------|----------|------------|------|
| 页面卡片 | `shadow-sm` | `shadow-md` | 卡片无边框，靠阴影承载 |
| 可点击卡片 | `shadow-sm` | `shadow-md` | hover 时阴影加深表示可交互 |
| 下拉菜单 | `shadow-md` | — | 浮在页面上方 |
| Dialog / Sheet | `shadow-lg` | — | 最高层级弹窗 |
| 按钮 | 无 | — | 按钮通过背景色变化表示状态，不加阴影 |
| 侧边栏 | 无 | — | 侧边栏通过背景色与内容区区分 |

### 6.4 卡片阴影示例

```html
<!-- 标准静态卡片 -->
<div class="bg-card rounded-lg shadow-sm p-6">
  <h3 class="font-medium">卡片标题</h3>
  <p class="text-sm text-muted-foreground mt-2">卡片内容</p>
</div>

<!-- 可交互卡片（hover 阴影提升） -->
<div class="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer p-6">
  <h3 class="font-medium">可点击的卡片</h3>
  <p class="text-sm text-muted-foreground mt-2">鼠标悬停时阴影加深</p>
</div>

<!-- 无边框设计 — 靠阴影区分层级 -->
<div class="bg-background min-h-screen p-6">
  <div class="bg-card rounded-lg shadow-sm p-6">
    <!-- 不需要 border，shadow-sm 足够建立层级 -->
  </div>
</div>
```

### 6.5 暗色模式下的阴影

在暗色模式下，阴影的视觉效果会减弱（因为背景本身就暗）。暗色模式主要依靠**背景色阶差**来建立层级，阴影作为辅助：

- `--background`（L=0.13）→ `--card`（L=0.165）：卡片比底色亮一个色阶
- `--sidebar`（L=0.145）→ 与 `--background` 形成微妙区分

---

## 七、动效规范

### 7.1 动效原则

> **克制、快速、自然、一致**

| 原则 | 说明 |
|------|------|
| **克制** | 动效服务于体验提升，不做花哨的入场动画和弹跳效果 |
| **快速** | 所有过渡时长控制在 150ms ~ 300ms，用户不等待 |
| **自然** | 使用 `ease-out` 或自定义缓动函数，模拟物理运动 |
| **一致** | 同类交互使用统一的时长和缓动，形成肌肉记忆 |

### 7.2 时长规范

| 时长 | Tailwind 类 | 使用场景 |
|------|-------------|----------|
| 100ms | `duration-100` | 极快反馈：按钮颜色变化、开关切换 |
| 150ms | `duration-150` | 快速过渡：hover 背景色、边框色 |
| 200ms | `duration-200` | 标准过渡：阴影变化、透明度渐变 |
| 300ms | `duration-300` | 较慢过渡：面板展开/收起、高度变化 |

> **红线：** 任何过渡时长不得超过 400ms。超过 400ms 的动画在后台系统中会显得拖沓。

### 7.3 缓动函数

| 缓动函数 | Tailwind 类 | 使用场景 |
|----------|-------------|----------|
| `ease-out` | `ease-out` | 元素进入视口（从快到慢，自然减速） |
| `ease-in` | `ease-in` | 元素离开视口（从慢到快，自然加速） |
| `ease-in-out` | `ease-in-out` | 位置移动、大小变化（两端缓、中间快） |
| `cubic-bezier(0.16, 1, 0.3, 1)` | 自定义 | 弹性过渡，适用于下拉菜单展开、面板滑入 |

### 7.4 路由过渡

页面切换使用简洁的淡入效果，不使用滑动或缩放：

```vue
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
.page-enter-active {
  transition: opacity 200ms ease-out;
}
.page-leave-active {
  transition: opacity 150ms ease-in;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
```

### 7.5 常见交互动效

#### Hover 状态

```html
<!-- 按钮 hover -->
<button class="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150">
  按钮
</button>

<!-- 卡片 hover（阴影提升） -->
<div class="shadow-sm hover:shadow-md transition-shadow duration-200">
  卡片内容
</div>

<!-- 列表项 hover（背景高亮） -->
<div class="hover:bg-accent transition-colors duration-100">
  列表项
</div>
```

#### 展开/收起

```html
<!-- 面板展开/收起 -->
<div class="overflow-hidden transition-all duration-300 ease-in-out"
     :class="isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'">
  面板内容
</div>
```

#### 加载状态

```html
<!-- 骨架屏脉冲动画 -->
<div class="bg-muted animate-pulse rounded-md h-4 w-3/4"></div>

<!-- 旋转加载指示器 -->
<div class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
```

---

## 八、图标系统

### 8.1 图标库选择

本项目使用 **Lucide Vue Next** 作为图标系统。

| 特性 | 说明 |
|------|------|
| 图标数量 | 1500+ 高质量图标 |
| 风格 | 线性描边，1.5px ~ 2px 线宽，与 Inter 字体搭配和谐 |
| 尺寸 | 默认 24x24，支持自定义 |
| 引入方式 | 按需引入，完美 tree-shaking |
| 与 shadcn-vue | shadcn-vue 默认图标库，风格一致 |

### 8.2 按需引入

```vue
<script setup lang="ts">
// 逐个导入需要的图标（tree-shakable）
import { Search, Plus, Settings, ChevronRight, Loader2 } from 'lucide-vue-next'
</script>

<template>
  <!-- 直接使用，默认 24x24 -->
  <Search />

  <!-- 自定义尺寸 -->
  <Settings :size="20" />

  <!-- 自定义颜色（跟随文字色） -->
  <Plus class="text-primary" :size="16" />

  <!-- 加载旋转 -->
  <Loader2 class="animate-spin" :size="16" />
</template>
```

### 8.3 图标尺寸规范

| 使用场景 | 尺寸 | 说明 |
|----------|------|------|
| 导航菜单 | 20px | 侧边栏菜单项图标 |
| 按钮内图标 | 16px | 按钮文字前/后的图标 |
| 页面标题图标 | 24px | 页面标题旁的装饰图标 |
| 表格操作 | 16px | 表格行内操作按钮 |
| 空状态 | 48px ~ 64px | 空数据、错误页面的大图标 |
| 徽标/标签内 | 14px | 小型标签、状态指示 |

### 8.4 图标使用规则

1. **不要混用图标库** — 全部使用 Lucide，禁止引入 Heroicons、Phosphor 等其他图标库
2. **颜色跟随语义** — 图标颜色使用 `text-foreground`、`text-muted-foreground`、`text-primary` 等语义色
3. **不要用图标替代文字** — 关键操作按钮必须有文字标签，图标仅作辅助
4. **保持一致性** — 同类功能使用同一图标，全项目统一

### 8.5 常用图标速查

| 功能 | 图标组件 | 说明 |
|------|----------|------|
| 搜索 | `Search` | 搜索框、筛选 |
| 新增 | `Plus` | 创建按钮 |
| 编辑 | `Pencil` | 编辑操作 |
| 删除 | `Trash2` | 删除操作 |
| 设置 | `Settings` | 系统设置 |
| 用户 | `User` | 用户管理 |
| 展开 | `ChevronDown` | 下拉、展开 |
| 收起 | `ChevronUp` | 收起、折叠 |
| 导航前进 | `ChevronRight` | 面包屑、列表导航 |
| 关闭 | `X` | 关闭弹窗、清除 |
| 更多 | `MoreHorizontal` | 更多操作菜单 |
| 加载 | `Loader2` | 配合 `animate-spin` 使用 |
| 成功 | `Check` | 成功状态 |
| 警告 | `AlertTriangle` | 警告提示 |
| 错误 | `AlertCircle` | 错误提示 |
| 信息 | `Info` | 信息提示 |
| 复制 | `Copy` | 复制到剪贴板 |
| 下载 | `Download` | 下载/导出 |
| 上传 | `Upload` | 上传/导入 |
| 刷新 | `RefreshCw` | 刷新数据 |
| 筛选 | `Filter` | 筛选/过滤 |
| 排序 | `ArrowUpDown` | 排序 |

---

## 九、暗色模式

### 9.1 实现方案

本项目采用 **class 策略**实现暗色模式切换，即通过在 `<html>` 元素上添加/移除 `.dark` 类来控制主题。

```css
/* globals.css 中的声明 */
@custom-variant dark (&:is(.dark *));
```

这行代码告诉 Tailwind CSS v4：当元素处于 `.dark` 类的后代树中时，激活暗色变体。

### 9.2 CSS 变量自动适配

所有 Token 都在 `:root`（亮色）和 `.dark`（暗色）中分别定义了对应值。当 `.dark` 类被添加时，所有使用 `var(--xxx)` 的样式会自动切换到暗色值。

```css
/* 亮色：卡片为纯白 */
:root {
  --card: oklch(1 0 0);
}

/* 暗色：卡片为深灰蓝 */
.dark {
  --card: oklch(0.165 0.01 260);
}
```

因此，组件代码中无需为暗色模式写任何额外样式：

```html
<!-- 无需写 dark: 前缀，CSS 变量自动适配 -->
<div class="bg-card text-card-foreground rounded-lg shadow-sm">
  卡片内容
</div>
```

### 9.3 VueUse useColorMode

使用 VueUse 的 `useColorMode` 组合式函数管理主题切换：

```vue
<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Sun, Moon, Monitor } from 'lucide-vue-next'

const mode = useColorMode({
  // 将 dark 类添加到 html 元素
  selector: 'html',
  // 支持三种模式
  modes: {
    light: 'light',
    dark: 'dark',
    auto: 'auto',  // 跟随系统
  },
  // 持久化到 localStorage
  storageKey: 'shadcn-vue-ui-color-mode',
})

// 切换主题
function toggleMode() {
  const modes = ['light', 'dark', 'auto'] as const
  const currentIndex = modes.indexOf(mode.value as typeof modes[number])
  mode.value = modes[(currentIndex + 1) % modes.length]
}
</script>

<template>
  <button @click="toggleMode" class="p-2 rounded-md hover:bg-accent transition-colors duration-150">
    <Sun v-if="mode === 'light'" :size="20" />
    <Moon v-if="mode === 'dark'" :size="20" />
    <Monitor v-if="mode === 'auto'" :size="20" />
  </button>
</template>
```

### 9.4 暗色模式设计规则

| 规则 | 说明 |
|------|------|
| **不要简单反转** | 暗色模式不是把白变黑、黑变白。需要精心调整每个色阶 |
| **降低对比度** | 暗色模式的文字色不用纯白（L=1），而是用 L=0.93 的灰白，减轻视觉疲劳 |
| **提亮主色** | 暗色模式下主色的 L 值从 0.58 提升到 0.68，保证在深色背景上的可辨识度 |
| **阴影弱化** | 暗色背景上阴影几乎不可见，层级主要靠背景色阶差 |
| **边框色加深** | 暗色下边框 L 值从 0.93 降为 0.23，保持足够的可见性但不刺眼 |
| **禁止使用 `dark:` 前缀** | 通过 CSS 变量自动适配，不在 Tailwind 类中写 `dark:bg-xxx` |

### 9.5 滚动条适配

暗色模式下滚动条也会自动适配，在 `globals.css` 中已定义：

```css
/* 亮色模式滚动条 */
::-webkit-scrollbar-thumb {
  background: oklch(0.82 0.003 260);  /* 浅灰 */
}
::-webkit-scrollbar-thumb:hover {
  background: oklch(0.72 0.005 260);  /* 深一点的灰 */
}

/* 暗色模式滚动条 */
.dark ::-webkit-scrollbar-thumb {
  background: oklch(0.28 0.008 260);  /* 深灰 */
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: oklch(0.38 0.008 260);  /* 亮一点的灰 */
}
```

滚动条宽度为 5px，轨道透明，整体风格精致不突兀。

---

## 附录 A：Tailwind 主题映射

`globals.css` 中的 `@theme inline` 块将 CSS 变量映射为 Tailwind 可用的颜色 class：

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... 其余映射见 globals.css */

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

映射完成后即可在模板中使用语义化类名：

```html
<div class="bg-background text-foreground">      <!-- 页面 -->
<div class="bg-card text-card-foreground">        <!-- 卡片 -->
<div class="bg-primary text-primary-foreground">  <!-- 主色 -->
<div class="bg-muted text-muted-foreground">      <!-- 弱化 -->
<div class="border-border">                       <!-- 边框 -->
<div class="rounded-lg">                          <!-- 圆角 -->
```

## 附录 B：全局基础样式

`globals.css` 中的 `@layer base` 定义了全局基础样式：

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
    font-variation-settings: 'opsz' 16;
  }
}
```

| 规则 | 作用 |
|------|------|
| `border-border` | 所有元素的默认边框色使用 `--border` 变量 |
| `outline-ring/50` | 所有元素的默认轮廓色使用 `--ring` 变量的 50% 透明度 |
| `bg-background` | body 背景色使用页面底色 |
| `text-foreground` | body 文字色使用页面文字色 |
| `antialiased` | 开启字体抗锯齿，渲染更平滑 |

## 附录 C：设计自检清单

开发任何组件或页面时，按以下清单检查设计系统的一致性：

- [ ] 所有颜色是否使用 CSS 变量（无硬编码色值）？
- [ ] 间距是否使用 4px 倍数（Tailwind 标准间距值）？
- [ ] 圆角是否使用 `rounded-sm/md/lg/xl`（对应 `--radius` 变量体系）？
- [ ] 字号是否在 `text-xs` ~ `text-2xl` 范围内？字重是否仅用 400/500/600？
- [ ] 阴影是否使用 `shadow-xs/sm/md/lg`？是否通透不厚重？
- [ ] 动效时长是否在 100ms ~ 300ms 范围内？是否使用了 `ease-out`？
- [ ] 图标是否来自 Lucide？是否按需引入？
- [ ] 暗色模式是否正常？是否通过 CSS 变量自动适配而非 `dark:` 前缀？
- [ ] 整体视觉是否符合"简洁、克制、现代、留白、通透、精致"关键词？
