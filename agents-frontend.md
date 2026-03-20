# agents-frontend.md — shadcn-vue-ui AI Agent 前端开发规范

> 本文档是 AI Agent（Claude、Qwen、DeepSeek、Kimi、GLM 等）参与 shadcn-vue-ui 项目开发时必须遵守的前端开发规范。
> 它融合了通用软件工程原则与本项目的具体技术栈、设计体系和 AI 协作方法。
> **与 CLAUDE.md 的关系：** CLAUDE.md 是项目认知入口（做什么），本文档是开发行为规范（怎么做）。

---

## 一、工作流程标准化

### 1.1 标准开发流程

任何功能开发、Bug 修复、重构任务，都必须遵循以下流程：

```
需求分析 → 代码审查 → 制定计划 → 逐步实施 → 测试验证 → 代码优化 → 文档更新 → 清理收尾
```

| 阶段 | 动作 | 产出物 |
|------|------|--------|
| 需求分析 | 理解需求本质、明确边界、确认技术可行性 | 需求理解摘要 |
| 代码审查 | 阅读相关模块的现有代码，理解上下文 | 现状理解 |
| 制定计划 | 拆解任务，确定实施步骤和优先级 | 任务卡 / todo 清单 |
| 逐步实施 | 按计划小步迭代，每步可验证 | 代码变更 |
| 测试验证 | 确认功能正确、无 TypeScript 报错、无控制台错误 | 验证通过 |
| 代码优化 | 检查代码质量、消除重复、优化性能 | 优化后的代码 |
| 文档更新 | 同步更新组件文档、页面文档或 API 文档 | 文档变更 |
| 清理收尾 | 删除临时文件、调试代码、console.log | 干净的代码 |

### 1.2 任务拆解原则

- 大任务必须拆分为可独立完成的小任务
- 每个小任务应在一次对话轮次内可完成
- 避免任务间强依赖，尽量解耦
- 每完成一个步骤，标记完成状态并添加摘要

---

## 二、核心设计原则

### 2.1 必须遵守的基础原则

| 原则 | 在本项目中的应用 |
|------|----------------|
| **SRP（单一职责）** | 一个组件只做一件事，一个 composable 只管一个关注点 |
| **OCP（开闭原则）** | 通过 props / slots 扩展组件，不修改基础组件源码 |
| **ISP（接口隔离）** | Props 接口最小化，不强迫消费者传入不需要的 prop |
| **DIP（依赖倒置）** | 依赖 TypeScript 接口（type/interface），不依赖具体实现 |
| **KISS** | 用最简单的方式解决问题，不过度抽象 |
| **YAGNI** | 不实现当前不需要的功能，不预建"可能用到"的组件 |

### 2.2 结构原则

| 原则 | 在本项目中的应用 |
|------|----------------|
| **组合优于继承** | Vue 3 Composition API 天然鼓励组合，禁止使用 Options API 的 mixins |
| **SOC（关注点分离）** | 模板管渲染、script 管逻辑、样式管展示；Store 管全局状态、composable 管可复用逻辑 |
| **SLAP（单一抽象层次）** | 组件分为容器组件（管理数据和状态）和展示组件（纯 UI 渲染），不混合 |
| **LoD（最少知道原则）** | 组件只依赖直接父组件传入的 props，不跨层级直接访问 |

### 2.3 演进原则

| 原则 | 在本项目中的应用 |
|------|----------------|
| **DRY vs WET 平衡** | Rule of Three — 第三次重复时才抽象；测试代码可以适当重复（DAMP 原则） |
| **Boy Scout Rule** | 每次修改代码时，顺手改善周围代码质量（但不大范围重构） |
| **POLA（最小惊讶）** | 组件 API 设计符合直觉，命名可预测，行为可预期 |

### 2.4 原则选择决策树

```
面临设计决策
├── 是否涉及架构？
│   ├── 是 → 优先 SOLID + SOC
│   └── 否 → 继续判断
├── 是否涉及性能？
│   ├── 是 → 先测量数据，再基于数据优化
│   └── 否 → 继续判断
├── 代码是否重复？
│   ├── 重复 ≥ 3 次 → 应用 DRY，提取共享组件/composable
│   ├── 重复 < 3 次 → 保持 WET，先不抽象
│   └── 否 → 应用 KISS，保持简单
```

### 2.5 原则误用警示

以下行为在本项目中**明确禁止**：

- 过度使用 DRY：为一两处相似代码创建抽象层
- 滥用设计模式：为了用模式而用模式
- 过早优化：没有性能数据支撑就做优化
- 过度工程化：简单问题复杂化（如只有两个子项目就上微前端）
- 盲目遵循规范：不考虑上下文的机械执行

---

## 三、项目技术栈规范

### 3.1 技术栈锁定

本项目技术栈已确定，AI Agent 开发时必须严格使用：

| 类别 | 技术 | 禁止替代 |
|------|------|----------|
| 框架 | Vue 3 Composition API + `<script setup>` | 禁止使用 Options API、React、Svelte |
| 语言 | TypeScript 严格模式 | 禁止使用纯 JavaScript |
| 构建 | Vite | 禁止使用 Webpack、Rollup |
| 样式 | Tailwind CSS v4 原子类 + CSS 变量 | 禁止使用 Sass/Less/CSS-in-JS/UnoCSS |
| 组件原语 | Reka UI | 禁止使用 Element Plus、Ant Design Vue、Naive UI |
| 组件分发 | shadcn-vue（源码级） | 禁止使用 npm 黑盒组件库 |
| 路由 | Vue Router 4 | — |
| 状态 | Pinia | 禁止使用 Vuex |
| 图标 | Lucide Vue Next | 全量引入 Iconify 时需确认 |
| 工具函数 | VueUse（按需引入） | 禁止全量引入 lodash |
| 类名工具 | cn()（clsx + tailwind-merge） | 禁止手动拼接类名字符串 |
| 变体管理 | class-variance-authority (cva) | — |
| 包管理 | Yarn（workspace 模式） | 禁止使用 npm / pnpm |

### 3.2 样式规范

```
必须使用 Tailwind CSS 原子类
├── 颜色 → 必须使用 CSS 变量（bg-primary、text-foreground 等）
│          禁止硬编码颜色值（bg-blue-500、text-#333）
├── 间距 → 使用 Tailwind 间距类（p-4、gap-3、space-y-2）
├── 圆角 → 使用项目 Token（rounded-md → calc(var(--radius) - 2px)）
├── 阴影 → 使用项目 Token（shadow-sm、shadow-md）
├── 条件类名 → 使用 cn() 函数合并
│             示例：cn('flex items-center', isActive && 'bg-accent')
└── 组件变体 → 使用 cva() 定义
              示例：const buttonVariants = cva('inline-flex items-center', { variants: { ... } })
```

### 3.3 状态管理规范

| 层级 | 工具 | 场景 |
|------|------|------|
| 组件局部状态 | `ref()` / `reactive()` | 仅当前组件使用的 UI 状态 |
| 跨组件共享 | `provide/inject` 或 props 传递 | 父子/祖孙组件间共享 |
| 全局应用状态 | Pinia Store | 认证信息、用户偏好、全局配置 |
| 服务端数据缓存 | Pinia Store 或 composable | API 响应数据、列表缓存 |

**Pinia Store 模板：**

```typescript
// stores/example.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // 状态
  const items = ref<ExampleItem[]>([])
  const loading = ref(false)

  // 计算属性
  const itemCount = computed(() => items.value.length)

  // 操作
  async function fetchItems() {
    loading.value = true
    try {
      items.value = await api.getItems()
    }
    finally {
      loading.value = false
    }
  }

  return { items, loading, itemCount, fetchItems }
})
```

---

## 四、命名规范

### 4.1 文件与目录命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue 组件文件 | PascalCase | `ModelCard.vue`、`StatusBadge.vue` |
| 组件目录 | PascalCase | `ModelCard/`、`AdvancedFilter/` |
| TypeScript 文件 | camelCase | `useTheme.ts`、`formatDate.ts` |
| 类型定义文件 | camelCase | `types.ts`、`api.ts` |
| 样式文件 | kebab-case | `globals.css`、`console-theme.css` |
| 页面目录 | kebab-case 或小写 | `pages/model/`、`pages/dashboard/` |
| Store 文件 | camelCase | `auth.ts`、`model.ts` |

### 4.2 代码命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件名 | PascalCase | `ModelCard`、`PageHeader` |
| Props 接口 | PascalCase + Props 后缀 | `ModelCardProps`、`PageHeaderProps` |
| Emits 接口 | PascalCase + Emits 后缀 | `ModelCardEmits` |
| 变量 | camelCase | `modelList`、`isLoading` |
| 函数 | camelCase，动词开头 | `fetchModels`、`handleClick` |
| Composable | use 前缀 + camelCase | `useTheme`、`usePagination` |
| Pinia Store | use 前缀 + PascalCase + Store 后缀 | `useModelStore`、`useAuthStore` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE`、`API_BASE_URL` |
| CSS 变量 | kebab-case，双横线前缀 | `--primary`、`--card-foreground` |
| 事件名 | camelCase | `@update:modelValue`、`@itemClick` |

### 4.3 命名禁区

- 禁止使用单字母变量（循环索引 `i` 除外）
- 禁止使用拼音命名
- 禁止使用无意义缩写（`btn` → `button` 是行业惯例，可以使用）
- 禁止使用 `data`、`info`、`item` 等无信息量的命名（应使用 `modelData`、`userInfo`）

---

## 五、组件开发规范

### 5.1 组件分类与归属

| 分类 | 位置 | 说明 | 示例 |
|------|------|------|------|
| 基础 UI 组件 | `packages/ui/src/components/ui/` | shadcn-vue CLI 生成，全项目共享 | Button、Card、Dialog |
| 共享场景组件 | `packages/shared/src/components/` | 两个子项目都用的场景组件 | PageHeader、StatCard、EmptyState |
| Console 场景组件 | `shadcn-vue-ui-console/src/components/` | 控制台专属场景组件 | ModelCard、AgentFlow、LogPanel |
| Business 场景组件 | `shadcn-vue-ui-business/src/components/` | 业务后台专属场景组件 | CrudTable、AdvancedFilter、ApprovalFlow |

### 5.2 组件设计原则

**shadcn composable sub-component 模式（必须遵循）：**

```vue
<!-- 好的设计：组合式子组件 -->
<StatCard>
  <StatCardHeader>
    <StatCardTitle>总用户数</StatCardTitle>
    <StatCardDescription>近 30 天</StatCardDescription>
  </StatCardHeader>
  <StatCardContent>
    <span class="text-3xl font-semibold">12,345</span>
  </StatCardContent>
  <StatCardFooter>
    <span class="text-muted-foreground text-sm">较上月 +12%</span>
  </StatCardFooter>
</StatCard>

<!-- 坏的设计：单组件塞满 props -->
<StatCard
  title="总用户数"
  description="近 30 天"
  value="12,345"
  footer="较上月 +12%"
/>
```

**组件设计检查项：**

- Props 是否最小化？（ISP）
- 是否提供 slot 供自定义？（OCP）
- 是否可以脱离父组件独立使用？（SRP）
- 是否使用了 `cn()` 合并类名？
- 是否支持 `class` 属性透传？

### 5.3 组件完整模板

```vue
<!-- ComponentName/ComponentName.vue -->
<script setup lang="ts">
import type { ComponentNameProps } from './types'
/**
 * @description 组件描述
 * @author Timon
 */
import { computed } from 'vue'
import { cn } from '@/lib/utils'

// Props
const props = withDefaults(defineProps<ComponentNameProps>(), {
  variant: 'default',
  size: 'md',
})

// Emits
const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

// 组合式逻辑
// const { ... } = useXxx()

// 计算属性
const rootClass = computed(() =>
  cn(
    'base-class',
    props.variant === 'outline' && 'border border-border',
    props.class,
  ),
)

// 方法
function handleAction() {
  emit('change', 'value')
}
</script>

<template>
  <div :class="rootClass">
    <slot />
  </div>
</template>
```

```typescript
// ComponentName/types.ts
export interface ComponentNameProps {
  /** 组件变体 */
  variant?: 'default' | 'outline' | 'ghost'
  /** 组件尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** 自定义类名 */
  class?: string
}
```

```typescript
// ComponentName/index.ts
export { default as ComponentName } from './ComponentName.vue'
export type { ComponentNameProps } from './types'
```

---

## 六、页面开发规范

### 6.1 页面结构分层

每个页面由以下层次组成：

```
页面（Page）
├── 页面头部（PageHeader）
│   ├── 标题 + 描述
│   └── 操作按钮组
├── 工具栏 / 筛选区（可选）
│   ├── 搜索框
│   ├── 筛选条件
│   └── 视图切换
├── 内容区（Content）
│   ├── 表格 / 卡片列表 / 表单 / 详情
│   └── 空状态 / 加载状态 / 错误状态
└── 底部（可选）
    └── 分页器
```

### 6.2 页面完整模板

```vue
<!-- pages/model/ModelList.vue -->
<script setup lang="ts">
import { PageHeader } from '@shared/components/PageHeader'
import { Button } from '@ui/components/ui/button'
/**
 * @description 模型管理列表页
 * @author Timon
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useModelStore } from '@/stores/model'

// 路由 & Store
const router = useRouter()
const modelStore = useModelStore()

// 页面状态
const searchQuery = ref('')
const currentPage = ref(1)

// 数据请求
onMounted(() => {
  modelStore.fetchModels()
})

// 事件处理
function handleCreate() {
  router.push('/models/create')
}

function handleSearch() {
  modelStore.fetchModels({ query: searchQuery.value })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <PageHeader
      title="模型管理"
      description="管理和监控所有已注册的大语言模型"
    >
      <template #actions>
        <Button @click="handleCreate">
          新建模型
        </Button>
      </template>
    </PageHeader>

    <!-- 筛选区 -->
    <div class="flex items-center gap-3">
      <!-- 搜索和筛选控件 -->
    </div>

    <!-- 内容区 -->
    <div v-if="modelStore.loading" class="flex items-center justify-center py-12">
      <!-- 加载状态 -->
    </div>
    <div v-else-if="modelStore.items.length === 0">
      <!-- 空状态 -->
    </div>
    <div v-else>
      <!-- 数据列表 -->
    </div>

    <!-- 分页 -->
    <div class="flex justify-end">
      <!-- 分页器 -->
    </div>
  </div>
</template>
```

### 6.3 页面三态处理（必须）

每个数据页面必须处理以下三种状态：

| 状态 | 处理方式 |
|------|---------|
| **加载中** | 显示 Skeleton 骨架屏或 Spinner |
| **空状态** | 显示 EmptyState 组件（图标 + 文案 + 操作按钮） |
| **错误状态** | 显示错误提示 + 重试按钮 |

---

## 七、路由规范

### 7.1 路由配置模板

```typescript
// router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/DashboardPage.vue'),
        meta: {
          title: '概览',
          icon: 'LayoutDashboard',
        },
      },
      {
        path: 'models',
        name: 'ModelList',
        component: () => import('@/pages/model/ModelList.vue'),
        meta: {
          title: '模型管理',
          icon: 'Box',
        },
      },
    ],
  },
]

export default routes
```

### 7.2 路由规则

- 所有页面组件必须使用**懒加载**（`() => import(...)`）
- 路由 `meta` 必须包含 `title`（用于面包屑和页签）
- 嵌套路由必须有明确的布局组件
- 路由 `name` 使用 PascalCase，与页面组件名一致

---

## 八、性能优化规范

### 8.1 必须遵守的性能原则

| 原则 | 具体措施 |
|------|---------|
| **代码分割** | 路由级懒加载，大型组件动态导入 |
| **资源懒加载** | 图片使用 `loading="lazy"`，列表超过 50 条考虑虚拟滚动 |
| **防抖节流** | 搜索输入用 `useDebounceFn`（300ms），滚动监听用 `useThrottleFn` |
| **计算缓存** | 复杂计算使用 `computed` 而非方法调用 |
| **组件缓存** | 需要保活的页面使用 `<KeepAlive>` |

### 8.2 构建体积控制

- 初始加载（首屏）目标：**< 200KB**（gzip）
- 所有依赖必须支持 tree-shaking
- 禁止全量引入图标库或工具库
- 定期检查打包体积（`npx vite-bundle-visualizer`）

### 8.3 性能目标（RAIL 模型）

| 指标 | 目标 |
|------|------|
| 用户输入响应 | < 100ms |
| 动画帧 | < 16ms |
| 首屏加载 | < 3 秒 |
| 路由切换 | < 500ms |

---

## 九、错误处理规范

### 9.1 错误处理层次

| 层次 | 处理方式 |
|------|---------|
| 组件级 | `v-if` 条件渲染错误状态，`try/catch` 处理异步操作 |
| 路由级 | 路由守卫中捕获权限错误，跳转 403/404 |
| 应用级 | `app.config.errorHandler` 全局捕获未处理异常 |
| 请求级 | HTTP 请求封装中统一处理 401/403/500 等状态码 |

### 9.2 错误处理原则

- **根因分析：** 找出错误的根本原因，不做表面修复
- **系统修复：** 避免临时补丁方案（如 `catch(() => {})` 吞掉错误）
- **影响评估：** 确保修复不影响其他功能
- **用户友好：** 错误信息对用户有意义（不暴露技术细节）

---

## 十、协作与文档规范

### 10.1 代码注释规范

```typescript
// 好的注释：解释"为什么"
// 使用 oklch 色彩空间是因为它在感知上更均匀，与 Tailwind CSS v4 一致
const primaryColor = 'oklch(0.55 0.18 260)'

// 坏的注释：解释"是什么"（代码本身已经说清楚了）
// 设置主色调为靛蓝色
const primaryColor = 'oklch(0.55 0.18 260)'
```

- 复杂业务逻辑必须注释
- 公共组件的 Props 必须有 JSDoc 注释
- 临时方案必须用 `// TODO:` 标记，注明原因和计划
- 注释语言：中文

### 10.2 作者标注规范

- 新建文件：在 `<script setup>` 顶部添加 `@author Timon`
- 修改文件：保持原作者信息不变
- 格式示例：

```vue
<script setup lang="ts">
/**
 * @description 模型管理列表页
 * @author Timon
 */
</script>
```

### 10.3 Git Commit 规范

```
<type>: <description>

type 可选值：
- feat: 新功能
- fix: Bug 修复
- refactor: 重构（不改变功能）
- style: 样式调整（不改变逻辑）
- docs: 文档更新
- chore: 工程配置、依赖更新
- perf: 性能优化
```

示例：`feat: 新增模型管理列表页`

### 10.4 文档产出规范

所有开发相关文档存放在 `docs/` 目录下：

```
docs/
├── 00-initialization-plan.md    # 初始化方案
├── 01-design-system.md          # 设计系统文档
├── 02-component-guide.md        # 组件开发指南
├── 03-page-guide.md             # 页面开发指南
├── 04-engineering.md            # 工程规范文档
├── 05-routing-permission.md     # 路由与权限
├── architecture.md              # 架构文档（模块职责、数据流向）
├── api-docs.md                  # API 接口文档
└── ai-collaboration/            # AI 协作文档
    ├── onboarding.md            # AI 认知入口
    ├── task-card.md             # 任务卡模板
    ├── component-prompt.md      # 组件开发 Prompt
    ├── page-prompt.md           # 页面开发 Prompt
    └── self-check.md            # 自检清单
```

文档要求：
- 每个版本发布前更新 `architecture.md`
- 新增功能时创建或更新对应文档
- 所有文档使用中文
- 文档开头注明作者与最后更新时间
- 流程图使用 Mermaid 格式

---

## 十一、质量保证体系

### 11.1 代码质量流程

```
代码编写 → 静态检查（ESLint + TypeScript） → 自检清单 → 代码审查 → 合并
```

### 11.2 静态检查要求

- **ESLint：** 零 warning、零 error
- **TypeScript：** 严格模式，不允许 `any`（确实需要时使用 `unknown` + 类型守卫）
- **Prettier：** 统一格式化，不允许风格不一致

### 11.3 自检清单（每次开发完成后执行）

```markdown
## 规范性
- [ ] 文件命名符合规范（PascalCase 组件、camelCase 工具）
- [ ] Props 有完整 TypeScript 类型定义
- [ ] 导出通过 index.ts 统一管理
- [ ] 代码注释使用中文
- [ ] 新文件添加 @author Timon

## 样式
- [ ] 使用 Tailwind CSS 原子类
- [ ] 使用 CSS 变量，不硬编码颜色
- [ ] 使用 cn() 合并条件类名
- [ ] 亮色模式视觉正常
- [ ] 暗色模式视觉正常
- [ ] 间距符合设计 Token 体系

## 功能
- [ ] 核心功能正常运行
- [ ] 处理了加载状态（Loading）
- [ ] 处理了空状态（Empty）
- [ ] 处理了错误状态（Error）
- [ ] 无 TypeScript 编译报错
- [ ] 无浏览器控制台报错

## 可维护性
- [ ] 组件职责单一
- [ ] 无重复代码（或重复不超过 2 次）
- [ ] 变量/函数命名清晰可理解
- [ ] 可被其他开发者或 AI 理解和扩展

## 性能
- [ ] 路由使用懒加载
- [ ] 无不必要的重复渲染
- [ ] 列表数据有分页或虚拟滚动
```

---

## 十二、安全规范

### 12.1 前端安全要求

| 风险 | 防护措施 |
|------|---------|
| XSS | 禁止使用 `v-html` 渲染用户输入；必须使用时先用 DOMPurify 过滤 |
| CSRF | API 请求携带 CSRF Token（由后端下发） |
| 敏感信息泄露 | 禁止在前端代码中硬编码密钥、Token；使用环境变量 |
| 依赖安全 | 定期执行 `yarn audit`；不引入来路不明的 npm 包 |

### 12.2 环境变量规范

```
.env.development    # 开发环境变量
.env.production     # 生产环境变量
.env.local          # 本地覆盖（不提交 Git）
```

- 所有环境变量必须以 `VITE_` 前缀开头
- 敏感信息放在 `.env.local`，该文件已加入 `.gitignore`

---

## 十三、响应式设计规范

### 13.1 断点定义

遵循 Tailwind CSS 默认断点：

| 断点 | 宽度 | 适用设备 |
|------|------|---------|
| `sm` | 640px+ | 大手机 / 小平板 |
| `md` | 768px+ | 平板 |
| `lg` | 1024px+ | 小桌面 |
| `xl` | 1280px+ | 标准桌面 |
| `2xl` | 1536px+ | 大桌面 |

### 13.2 响应式原则

- 后台系统优先 **桌面端**（Desktop First）
- 侧边栏在 `lg` 以下可折叠为抽屉
- 表格在小屏幕下考虑卡片视图降级
- 所有弹窗/抽屉在移动端适配

---

## 十四、BMAD Agent 团队协作体系

本项目已接入 **BMAD-METHOD v6**（Build More Architect Dreams），提供 12+ 专业化 AI Agent 角色，覆盖软件开发全生命周期。

### 14.1 BMAD 是什么

BMAD 是一个 AI 驱动的敏捷开发框架，核心理念是 **AI Agent 作为专家协作者，而非简单的代码工具**。它通过专业化角色分工 + 结构化工作流，引导项目从需求分析到代码交付的全过程。

**与本项目的关系：**
- BMAD 提供**开发方法论和流程管理**（怎么做事）
- `agents-frontend.md` 提供**前端技术规范**（怎么写代码）
- `CLAUDE.md` 提供**项目认知入口**（做什么事）
- 三者互补，共同构成 shadcn-vue-ui 的 AI 协作开发体系

### 14.2 BMAD 四阶段开发流程

```
阶段 1（分析） → 阶段 2（规划） → 阶段 3（方案设计） → 阶段 4（实施）
```

| 阶段 | 名称 | 负责 Agent | 产出物 | 在本项目中的应用 |
|------|------|-----------|--------|----------------|
| Phase 1 | 分析（可选） | Analyst | 头脑风暴、产品概要、市场/技术调研 | 新功能模块的前期调研和可行性分析 |
| Phase 2 | 规划（必须） | PM、UX Designer | PRD / Tech-Spec、UX 设计 | 功能需求文档、页面交互设计 |
| Phase 3 | 方案设计 | Architect、PM | 架构文档、Epic/Story 拆分 | 技术架构决策、任务拆解 |
| Phase 4 | 实施（必须） | SM、DEV、TEA | Sprint 计划、代码实现、代码审查 | 逐 Story 开发、代码审查、回顾 |

### 14.3 Agent 角色与本项目职责映射

| BMAD Agent | 角色 | 在 shadcn-vue-ui 中的职责 | 调用命令 |
|------------|------|--------------------------|---------|
| **Analyst（Mary）** | 业务分析师 | 新模块需求分析、竞品调研、技术可行性评估 | `bmad:bmm:agents:analyst` |
| **PM（John）** | 产品经理 | PRD 编写、功能需求定义、Epic/Story 创建与拆分 | `bmad:bmm:agents:pm` |
| **Architect（Winston）** | 系统架构师 | 技术架构设计、技术选型决策、架构评审 | `bmad:bmm:agents:architect` |
| **UX Designer（Sally）** | UX 设计师 | 页面交互设计、线框图、设计系统规范 | `bmad:bmm:agents:ux-designer` |
| **SM（Bob）** | Scrum Master | Sprint 规划、Story 创建、进度跟踪、回顾 | `bmad:bmm:agents:sm` |
| **DEV（Amelia）** | 开发工程师 | 代码实现（遵循本文档规范）、代码审查 | `bmad:bmm:agents:dev` |
| **TEA** | 测试架构师 | 测试策略设计、E2E 测试、测试覆盖分析 | `bmad:bmm:agents:tea` |
| **Tech Writer（Paige）** | 技术文档工程师 | 组件文档、API 文档、架构文档编写 | `bmad:bmm:agents:tech-writer` |
| **BMad Master** | 编排器 | 工作流调度、Agent 协调、Party Mode 多角色讨论 | `bmad:core:agents:bmad-master` |

### 14.4 关键工作流与使用场景

#### 规划类工作流

| 工作流 | 用途 | 触发场景 |
|--------|------|---------|
| `workflow-init` | 初始化项目工作流 | 项目首次启动或新增大模块时 |
| `workflow-status` | 查看当前进度和下一步 | 任何时候不确定该做什么时 |
| `create-tech-spec` | 创建技术规格说明 | 小型功能（1-15 个 Story）的快速规划 |
| `create-excalidraw-wireframe` | 创建线框图 | 新页面 UI 设计时 |
| `create-excalidraw-diagram` | 创建架构图 | 系统设计、模块关系梳理时 |

#### 实施类工作流

| 工作流 | 用途 | 触发场景 |
|--------|------|---------|
| `sprint-planning` | Sprint 规划 | 每个 Epic 开始前 |
| `create-story` | 创建下一个 Story | 需要从 Epic 中拆分具体任务时 |
| `dev-story` | 实现一个 Story | 具体编码实现时 |
| `code-review` | 对抗性代码审查 | 每个 Story 完成后（强烈推荐） |
| `quick-dev` | 快速开发 | 简单功能或 Bug 修复 |
| `correct-course` | 方向修正 | 开发中发现需求变更时 |
| `retrospective` | Sprint 回顾 | 每个 Epic 完成后 |

#### 质量类工作流

| 工作流 | 用途 | 触发场景 |
|--------|------|---------|
| `testarch-framework` | 初始化测试框架 | 项目首次建立测试体系时 |
| `testarch-test-design` | 测试设计 | Epic 级别的测试规划 |
| `testarch-atdd` | 验收测试驱动开发 | 先写测试再写代码时 |
| `testarch-trace` | 需求-测试追踪矩阵 | 验证测试覆盖完整性时 |

### 14.5 BMAD + 本项目的协作规则

#### DEV Agent 必须遵守的约束

当 BMAD DEV Agent 在本项目中执行代码实现时，**必须同时遵守本文档的所有前端规范**：

1. **技术栈约束**：第三章的技术栈锁定（Vue 3 + TypeScript + Tailwind CSS v4 + shadcn-vue）
2. **命名约束**：第四章的命名规范
3. **组件约束**：第五章的组件开发规范（shadcn composable sub-component 模式）
4. **样式约束**：使用 CSS 变量 + cn() + cva()，禁止硬编码颜色
5. **质量约束**：第十一章的自检清单
6. **语言约束**：注释使用中文，命名使用英文

#### Architect Agent 的项目特殊约束

1. 架构设计必须遵循 Monorepo（Yarn workspace）结构
2. 共享层（packages/shared + packages/ui）和子项目（console / business）的边界不可打破
3. 不得引入技术红线中禁止的技术

#### PM Agent 的项目特殊约束

1. 需求拆分必须明确归属：shared / console / business
2. Story 描述中必须包含目标子项目和模块路径
3. 功能需求必须覆盖亮色 + 暗色双模式

### 14.6 推荐的项目开发流程

#### 新功能模块开发（中大型）

```
1. [Analyst]  调研分析        → bmad:bmm:agents:analyst → brainstorm / research
2. [PM]       需求规划        → bmad:bmm:agents:pm → create-prd / create-tech-spec
3. [UX]       交互设计        → bmad:bmm:agents:ux-designer → UX 设计
4. [Architect] 架构设计       → bmad:bmm:agents:architect → create-architecture
5. [PM]       任务拆分        → bmad:bmm:agents:pm → create-epics-and-stories
6. [SM]       Sprint 规划     → bmad:bmm:workflows:sprint-planning
7. [SM]       创建 Story      → bmad:bmm:workflows:create-story
8. [DEV]      实现 Story      → bmad:bmm:workflows:dev-story（遵循 agents-frontend.md）
9. [DEV]      代码审查        → bmad:bmm:workflows:code-review
10. [SM]      Sprint 回顾     → bmad:bmm:workflows:retrospective
```

#### 小功能 / Bug 修复（快速流）

```
1. [PM]  快速规格 → bmad:bmm:workflows:create-tech-spec
2. [DEV] 快速开发 → bmad:bmm:workflows:quick-dev（遵循 agents-frontend.md）
3. [DEV] 代码审查 → bmad:bmm:workflows:code-review
```

### 14.7 BMAD 产出物存放规范

| 产出物类型 | 存放位置 | 说明 |
|-----------|---------|------|
| 工作流状态 | `_bmad-output/bmm-workflow-status.yaml` | 自动跟踪，不手动编辑 |
| Sprint 状态 | `_bmad-output/sprint-status.yaml` | 自动跟踪，不手动编辑 |
| PRD 文档 | `_bmad-output/prd.md` | 产品需求文档 |
| 架构文档 | `_bmad-output/architecture.md` | 系统架构文档 |
| Epic/Story | `_bmad-output/epics/` | Epic 和 Story 文件 |
| 项目上下文 | `_bmad-output/project-context.md` | 项目规则和偏好汇总 |

---

## 十五、AI Agent 专属规则

### 15.1 开发前必读

AI Agent 接到开发任务后，必须按以下顺序执行：

```
1. 阅读 CLAUDE.md                → 了解项目全貌
2. 阅读本文件（agents-frontend.md）→ 了解开发规范
3. 阅读目标模块的现有代码          → 了解上下文
4. 检查 BMAD 工作流状态           → 确认当前阶段和任务（如适用）
5. 制定任务计划                  → 拆解为小步骤
6. 按规范逐步实施                 → 遵循模板和命名规范
7. 执行自检清单                  → 第十一章的清单
8. 更新相关文档                  → 代码改了文档必须同步
```

### 15.2 AI 开发禁令

- 禁止跳过"阅读现有代码"步骤直接写代码
- 禁止引入技术栈锁定列表之外的依赖
- 禁止修改 packages/ui 中 shadcn-vue CLI 生成的组件（除非明确要求定制）
- 禁止使用 `any` 类型
- 禁止忽略暗色模式
- 禁止忽略 TypeScript 报错
- 禁止创建不必要的文件（先确认是否有现有文件可扩展）
- 禁止使用英文注释（代码变量名使用英文，注释使用中文）
- 禁止在完成开发后跳过自检清单

### 15.3 AI 输出格式要求

- 先给结论，再给方案
- 结构化表达，层次分明
- 关键设计决策必须说明理由
- 代码修改必须说明修改了哪些文件、为什么修改

---

> 变更记录已迁移至 [CHANGELOG.md](./CHANGELOG.md)
