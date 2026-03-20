# 组件使用指南

> 本文档涵盖 shadcn-vue-ui 项目中所有自定义/共享组件与组合式函数的 API 参考，不包含 shadcn-vue 原始 UI 组件。

---

## 目录

### 共享组件（@shared）
- [PageHeader — 页面头部](#pageheader)
- [StatCard — 统计卡片](#statcard)
- [EmptyState — 空状态](#emptystate)

### 控制台通用组件（console）
- [PageLoading — 页面加载骨架屏](#pageloading)
- [PageError — 页面错误状态](#pageerror)
- [SimplePagination — 简易分页](#simplepagination)
- [PlaceholderPage — 页面占位](#placeholderpage)

### 图表组件（console）
- [LineChart — 折线图](#linechart)
- [DoughnutChart — 环形图](#doughnutchart)

### 业务对话框组件（console）
- [ModelRegisterDialog — 模型注册对话框](#modelregisterdialog)
- [AgentCreateDialog — Agent 创建对话框](#agentcreatedialog)

### 组合式函数
- [useRequest — 异步请求状态管理](#userequest)
- [useTheme — 主题切换](#usetheme)
- [useMarkdown — Markdown 渲染](#usemarkdown)

---

## 共享组件（@shared）

### PageHeader

页面头部组件，提供标题 + 描述 + 右侧操作区的标准布局。

**所属包：** `@shared` — `packages/shared/src/components/PageHeader/PageHeader.vue`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `title` | `string` | — | 是 | 页面标题 |
| `description` | `string` | `undefined` | 否 | 标题下方的描述文案 |

#### Slots

| 插槽名 | 说明 |
|--------|------|
| `actions` | 右侧操作区，适合放置按钮等操作元素，仅当插槽有内容时渲染 |

#### 使用示例

```vue
<template>
  <PageHeader title="模型管理" description="管理平台中注册的所有 AI 模型">
    <template #actions>
      <Button @click="handleCreate">
        <Plus class="mr-2 size-4" />
        注册模型
      </Button>
    </template>
  </PageHeader>
</template>
```

---

### StatCard

统计卡片组件，用于 Dashboard 数据展示，支持趋势箭头与变化描述。

**所属包：** `@shared` — `packages/shared/src/components/StatCard/StatCard.vue`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `title` | `string` | — | 是 | 卡片标题（如"总请求数"） |
| `value` | `string \| number` | — | 是 | 核心数值 |
| `change` | `string` | `undefined` | 否 | 变化幅度文案（如"+12.5%"） |
| `trend` | `'up' \| 'down'` | `undefined` | 否 | 趋势方向，`up` 显示绿色上箭头，`down` 显示红色下箭头 |
| `description` | `string` | `undefined` | 否 | 变化幅度后的补充说明（如"较上周"） |
| `icon` | `Component` | `undefined` | 否 | 卡片右上角的图标组件 |

#### 使用示例

```vue
<template>
  <StatCard
    title="总请求数"
    value="128,430"
    change="+12.5%"
    trend="up"
    description="较上周"
    :icon="Activity"
  />
</template>

<script setup lang="ts">
import { Activity } from 'lucide-vue-next'
</script>
```

---

### EmptyState

空状态组件，无数据时展示友好提示，支持自定义图标与操作按钮。

**所属包：** `@shared` — `packages/shared/src/components/EmptyState/EmptyState.vue`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `icon` | `Component` | `Inbox`（lucide） | 否 | 自定义图标组件，默认使用 `Inbox` 图标 |
| `title` | `string` | `undefined` | 否 | 提示标题 |
| `description` | `string` | `undefined` | 否 | 提示描述文案 |

#### Slots

| 插槽名 | 说明 |
|--------|------|
| `action` | 底部操作区，适合放置"新建"按钮等引导性操作 |

#### 使用示例

```vue
<template>
  <EmptyState
    title="暂无模型"
    description="点击下方按钮注册你的第一个模型"
    :icon="Bot"
  >
    <template #action>
      <Button size="sm" @click="handleCreate">
        <Plus class="mr-2 size-4" />
        注册模型
      </Button>
    </template>
  </EmptyState>
</template>

<script setup lang="ts">
import { Bot, Plus } from 'lucide-vue-next'
</script>
```

---

## 控制台通用组件（console）

### PageLoading

页面加载骨架屏组件，模拟卡片列表布局的 Skeleton 效果，包含标题骨架、工具栏骨架与卡片网格骨架。

**所属包：** `console` — `shadcn-vue-ui-console/src/components/common/PageLoading.vue`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `count` | `number` | `6` | 否 | 骨架卡片数量 |
| `cols` | `3 \| 4` | `3` | 否 | 布局列数，`3` 对应 `xl:grid-cols-3`，`4` 对应 `xl:grid-cols-4` |

#### 使用示例

```vue
<template>
  <!-- 加载时展示骨架屏 -->
  <PageLoading v-if="loading" :count="8" :cols="4" />

  <!-- 加载完成后展示内容 -->
  <div v-else>
    <!-- 实际内容 -->
  </div>
</template>
```

---

### PageError

页面错误状态组件，在数据加载失败时展示错误提示与重试按钮。

**所属包：** `console` — `shadcn-vue-ui-console/src/components/common/PageError.vue`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `message` | `string` | `'请检查网络连接后重试'` | 否 | 自定义错误提示信息 |

#### Emits

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `retry` | — | 用户点击"重试"按钮时触发 |

#### 使用示例

```vue
<template>
  <PageError
    v-if="error"
    :message="error"
    @retry="fetchData"
  />
</template>
```

---

### SimplePagination

简易分页组件，提供上一页/下一页导航、页码按钮（最多显示 5 个）与总条数展示。支持 `v-model` 双向绑定当前页。

**所属包：** `console` — `shadcn-vue-ui-console/src/components/common/SimplePagination.vue`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `total` | `number` | — | 是 | 数据总条数 |
| `pageSize` | `number` | `10` | 否 | 每页条数 |
| `currentPage` | `number` | — | 是 | 当前页码（支持 `v-model:currentPage`） |

#### Emits

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:currentPage` | `page: number` | 页码变更时触发，配合 `v-model:currentPage` 使用 |

#### 使用示例

```vue
<template>
  <SimplePagination
    v-model:current-page="currentPage"
    :total="total"
    :page-size="20"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentPage = ref(1)
const total = ref(100)
</script>
```

> **注意：** 当总页数 <= 1 时，分页组件自动隐藏。

---

### PlaceholderPage

页面占位组件，用于尚未开发的模块，展示"模块开发中..."的友好提示。

**所属包：** `console` — `shadcn-vue-ui-console/src/components/common/PlaceholderPage.vue`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `title` | `string` | — | 是 | 页面标题 |
| `description` | `string` | `undefined` | 否 | 页面描述文案 |

#### 使用示例

```vue
<template>
  <PlaceholderPage
    title="知识库管理"
    description="管理和维护 Agent 使用的知识库"
  />
</template>
```

---

## 图表组件（console）

### LineChart

折线图组件，基于 `vue-chartjs` 的轻量封装，支持面积填充、平滑曲线，适用于趋势类数据可视化。

**所属包：** `console` — `shadcn-vue-ui-console/src/components/charts/LineChart.vue`

**依赖：** `chart.js`、`vue-chartjs`

已注册的 Chart.js 模块：`CategoryScale`、`LinearScale`、`PointElement`、`LineElement`、`Title`、`Tooltip`、`Filler`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `data` | `ChartData` | — | 是 | Chart.js 数据对象，包含 `labels` 和 `datasets` |
| `options` | `ChartOptions` | `{}` | 否 | Chart.js 配置项，会与内置默认配置（`responsive: true, maintainAspectRatio: false`）合并 |

#### 使用示例

```vue
<template>
  <div class="h-64">
    <LineChart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
const chartData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '请求量',
      data: [1200, 1900, 3000, 5000, 4200, 6300],
      borderColor: 'oklch(0.7 0.15 250)',
      backgroundColor: 'oklch(0.7 0.15 250 / 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
}

const chartOptions = {
  plugins: { legend: { display: false } },
}
</script>
```

---

### DoughnutChart

环形图组件，基于 `vue-chartjs` 的轻量封装，适用于占比分布类数据可视化。

**所属包：** `console` — `shadcn-vue-ui-console/src/components/charts/DoughnutChart.vue`

**依赖：** `chart.js`、`vue-chartjs`

已注册的 Chart.js 模块：`ArcElement`、`DoughnutController`、`Tooltip`、`Legend`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `data` | `ChartData` | — | 是 | Chart.js 数据对象，包含 `labels` 和 `datasets` |
| `options` | `ChartOptions` | `{}` | 否 | Chart.js 配置项，会与内置默认配置（`responsive: true, maintainAspectRatio: false`）合并 |

#### 使用示例

```vue
<template>
  <div class="h-64">
    <DoughnutChart :data="chartData" />
  </div>
</template>

<script setup lang="ts">
const chartData = {
  labels: ['GPT-4o', 'Claude 3.5', 'DeepSeek-V3', '其他'],
  datasets: [
    {
      data: [40, 30, 20, 10],
      backgroundColor: [
        'oklch(0.7 0.15 250)',
        'oklch(0.65 0.18 290)',
        'oklch(0.72 0.15 160)',
        'oklch(0.8 0.08 80)',
      ],
    },
  ],
}
</script>
```

---

## 业务对话框组件（console）

### ModelRegisterDialog

模型注册对话框组件，Dify 风格的模型配置表单弹窗，支持 `v-model:open` 双向绑定。打开对话框时自动重置表单。

**所属包：** `console` — `shadcn-vue-ui-console/src/components/models/ModelRegisterDialog.vue`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `open` | `boolean` | — | 是 | 控制对话框显示/隐藏，支持 `v-model:open` |

#### Emits

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:open` | `value: boolean` | 对话框开关状态变更时触发 |
| `submit` | `data: ModelFormData` | 表单提交时触发，携带表单数据 |

#### ModelFormData 类型

```ts
interface ModelFormData {
  name: string        // 模型名称（必填）
  provider: string    // 提供商（openai / anthropic / alibaba / deepseek / google / zhipu / custom）
  modelType: string   // 模型类型（llm / embedding / image / speech）
  apiEndpoint: string // API 端点
  maxTokens: number   // 最大 Token 数（默认 4096）
  temperature: number // 采样温度（默认 0.7）
  description: string // 模型描述
}
```

#### 内置选项

- **提供商：** OpenAI、Anthropic、Alibaba、DeepSeek、Google、Zhipu、自定义
- **模型类型：** 大语言模型、嵌入模型、图像生成、语音识别

#### 使用示例

```vue
<template>
  <ModelRegisterDialog
    v-model:open="dialogOpen"
    @submit="handleModelSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialogOpen = ref(false)

function handleModelSubmit(data: ModelFormData) {
  console.log('注册模型：', data)
  // 调用 API 提交数据
}
</script>
```

---

### AgentCreateDialog

Agent 创建对话框组件，Dify/cloud-console 风格的表单弹窗，支持头像颜色选择与表单校验。打开对话框时自动重置表单。

**所属包：** `console` — `shadcn-vue-ui-console/src/components/agents/AgentCreateDialog.vue`

#### Props

| 属性名 | 类型 | 默认值 | 必填 | 说明 |
|--------|------|--------|------|------|
| `open` | `boolean` | — | 是 | 控制对话框开关，支持 `v-model:open` |

#### Emits

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:open` | `value: boolean` | 对话框开关状态变更时触发 |
| `submit` | `data: AgentFormData` | 表单提交时触发，携带表单数据 |

#### AgentFormData 类型

```ts
type AvatarColor = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose'

interface AgentFormData {
  name: string          // Agent 名称（必填）
  description: string   // Agent 描述（必填）
  model: string         // 关联模型（gpt-4o / claude-3.5-sonnet / deepseek-v3 / qwen2.5-72b）
  systemPrompt: string  // 系统提示词
  tags: string          // 能力标签（逗号分隔）
  avatarColor: AvatarColor // 头像颜色（默认 'blue'）
}
```

#### 校验规则

- `name` 和 `description` 均为必填，为空时提交按钮禁用

#### 使用示例

```vue
<template>
  <AgentCreateDialog
    v-model:open="showCreateDialog"
    @submit="handleAgentCreate"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showCreateDialog = ref(false)

function handleAgentCreate(data: AgentFormData) {
  console.log('创建 Agent：', data)
  // 调用 API 提交数据
}
</script>
```

---

## 组合式函数

### useRequest

基于 Fetch API 的轻量级异步请求状态管理组合式函数，提供 `loading`、`error`、`data` 三态追踪，支持泛型推导。

**所属包：** `@shared` — `packages/shared/src/composables/useRequest.ts`

#### 函数签名

```ts
function useRequest<T>(
  fetcher: () => Promise<T>,
  options?: UseRequestOptions
): UseRequestReturn<T>
```

#### 参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `fetcher` | `() => Promise<T>` | 返回 Promise 的异步请求函数 |
| `options` | `UseRequestOptions` | 配置项（可选） |

#### UseRequestOptions

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `immediate` | `boolean` | `false` | 是否在创建时立即执行请求 |

#### 返回值 UseRequestReturn\<T\>

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `data` | `Ref<T \| null>` | 请求返回的数据，初始为 `null` |
| `loading` | `Ref<boolean>` | 是否正在加载中 |
| `error` | `Ref<string \| null>` | 错误信息，无错误时为 `null` |
| `execute` | `() => Promise<void>` | 手动执行请求 |
| `refresh` | `() => Promise<void>` | 刷新数据（`execute` 的语义化别名） |

#### 使用示例

```ts
// 立即执行
const { data, loading, error } = useRequest(
  () => fetch('/api/models').then(res => res.json()),
  { immediate: true }
)

// 手动触发
const { data: agents, execute: fetchAgents } = useRequest(
  () => fetch('/api/agents').then(res => res.json())
)

// 在需要时手动调用
await fetchAgents()
```

#### 搭配 PageLoading / PageError 使用

```vue
<template>
  <PageLoading v-if="loading" />
  <PageError v-else-if="error" :message="error" @retry="refresh" />
  <div v-else>
    <!-- 使用 data 渲染内容 -->
  </div>
</template>

<script setup lang="ts">
const { data, loading, error, refresh } = useRequest(
  () => fetch('/api/data').then(r => r.json()),
  { immediate: true }
)
</script>
```

---

### useTheme

主题切换组合式函数，基于 VueUse 的 `useColorMode`，支持 `light` / `dark` 模式切换。

**所属包：** `console` — `shadcn-vue-ui-console/src/composables/useTheme.ts`

**依赖：** `@vueuse/core`

#### 函数签名

```ts
function useTheme(): {
  mode: Ref<'light' | 'dark' | 'auto'>
  toggleTheme: () => void
}
```

#### 返回值

| 属性名 | 类型 | 说明 |
|--------|------|------|
| `mode` | `Ref<'light' \| 'dark' \| 'auto'>` | 当前主题模式，可读写 |
| `toggleTheme` | `() => void` | 在 `light` 与 `dark` 之间切换 |

#### 使用示例

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { mode, toggleTheme } = useTheme()
</script>

<template>
  <Button variant="ghost" size="icon" @click="toggleTheme">
    <Sun v-if="mode === 'dark'" class="size-4" />
    <Moon v-else class="size-4" />
  </Button>
</template>
```

---

### useMarkdown

Markdown 渲染组合式函数，将 Markdown 文本转换为安全的 HTML 字符串。基于 `marked` 解析、`dompurify` 消毒，支持 GFM 语法和自动换行。

**所属包：** `console` — `shadcn-vue-ui-console/src/composables/useMarkdown.ts`

**依赖：** `marked`、`dompurify`

#### 导出函数

##### renderMarkdown

纯函数，将 Markdown 文本一次性渲染为安全 HTML。

```ts
function renderMarkdown(text: string): string
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `text` | `string` | 原始 Markdown 文本 |
| **返回值** | `string` | 消毒后的 HTML 字符串 |

##### useMarkdown

响应式组合式函数，返回一个计算属性，当源文本变化时自动重新渲染。

```ts
function useMarkdown(getText: () => string): ComputedRef<string>
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `getText` | `() => string` | 返回 Markdown 文本的 getter 函数 |
| **返回值** | `ComputedRef<string>` | 响应式的安全 HTML 字符串 |

#### 使用示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useMarkdown, renderMarkdown } from '@/composables/useMarkdown'

// 响应式用法
const rawText = ref('# 你好\n这是一段 **Markdown** 文本')
const html = useMarkdown(() => rawText.value)

// 一次性用法
const staticHtml = renderMarkdown('**加粗文本**')
</script>

<template>
  <div v-html="html" />
</template>
```

---

## 组件关系与典型页面组装

下图展示一个典型的列表管理页面如何组装上述组件：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRequest } from '@shared/composables/useRequest'
import PageHeader from '@shared/components/PageHeader/PageHeader.vue'
import EmptyState from '@shared/components/EmptyState/EmptyState.vue'
import PageLoading from '@/components/common/PageLoading.vue'
import PageError from '@/components/common/PageError.vue'
import SimplePagination from '@/components/common/SimplePagination.vue'

const currentPage = ref(1)

const { data, loading, error, refresh } = useRequest(
  () => fetch('/api/models').then(r => r.json()),
  { immediate: true }
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <PageHeader title="模型管理" description="管理平台中注册的所有 AI 模型">
      <template #actions>
        <Button>注册模型</Button>
      </template>
    </PageHeader>

    <!-- 加载态 -->
    <PageLoading v-if="loading" />

    <!-- 错误态 -->
    <PageError v-else-if="error" :message="error" @retry="refresh" />

    <!-- 空状态 -->
    <EmptyState v-else-if="!data?.length" title="暂无模型" description="开始注册你的第一个模型" />

    <!-- 正常内容 -->
    <template v-else>
      <!-- 列表/卡片内容 -->
      <div>...</div>

      <!-- 分页 -->
      <SimplePagination
        v-model:current-page="currentPage"
        :total="data.length"
        :page-size="10"
      />
    </template>
  </div>
</template>
```

---

## 附录：组件索引速查表

| 组件 | 所属包 | 路径 | 用途 |
|------|--------|------|------|
| `PageHeader` | @shared | `packages/shared/src/components/PageHeader/` | 页面标题与操作区 |
| `StatCard` | @shared | `packages/shared/src/components/StatCard/` | Dashboard 统计数据展示 |
| `EmptyState` | @shared | `packages/shared/src/components/EmptyState/` | 无数据友好提示 |
| `PageLoading` | console | `shadcn-vue-ui-console/src/components/common/` | 骨架屏加载态 |
| `PageError` | console | `shadcn-vue-ui-console/src/components/common/` | 错误状态与重试 |
| `SimplePagination` | console | `shadcn-vue-ui-console/src/components/common/` | 简易分页导航 |
| `PlaceholderPage` | console | `shadcn-vue-ui-console/src/components/common/` | 未开发模块占位 |
| `LineChart` | console | `shadcn-vue-ui-console/src/components/charts/` | 折线/面积图 |
| `DoughnutChart` | console | `shadcn-vue-ui-console/src/components/charts/` | 环形占比图 |
| `ModelRegisterDialog` | console | `shadcn-vue-ui-console/src/components/models/` | 模型注册表单弹窗 |
| `AgentCreateDialog` | console | `shadcn-vue-ui-console/src/components/agents/` | Agent 创建表单弹窗 |
