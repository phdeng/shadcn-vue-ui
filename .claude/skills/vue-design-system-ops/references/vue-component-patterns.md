# Vue 组件设计模式参考

本文档供 Agent 在设计和实现 Vue 3 组件时参考。

## 目录
1. Props 设计模式
2. Emits 设计模式
3. Slots 与作用域插槽
4. Composables 设计模式
5. 组件组合模式
6. 状态管理模式
7. TypeScript 集成

---

## 1. Props 设计模式

### 命名约定
- camelCase：`modelValue`, `isDisabled`, `hasIcon`
- 布尔值用 `is` / `has` / `show` 前缀：`isLoading`, `hasError`, `showLabel`
- 枚举用具名 prop：`variant`, `size`, `placement`
- 回调用 `on` 前缀（仅在不使用 emit 时）

### Variant 模式（推荐）
```typescript
// ✅ 好：使用 variant prop
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

// ❌ 差：使用多个布尔 props
interface ButtonProps {
  isPrimary?: boolean
  isOutline?: boolean
  isGhost?: boolean
}
```

### 默认值策略
- 所有非必需 props 必须有默认值
- 使用 `withDefaults` 而非运行时默认值
- 布尔 props 默认 `false`
- 字符串 props 默认 `''` 或最常用值

### v-model 支持
```typescript
// 单值绑定
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// 多值绑定
const props = defineProps<{
  modelValue: string
  open: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:open': [value: boolean]
}>()
```

---

## 2. Emits 设计模式

### 命名约定
- v-model 更新：`update:modelValue`, `update:open`
- 用户行为：`click`, `change`, `select`, `dismiss`
- 生命周期：`ready`, `close`, `afterEnter`, `afterLeave`

### 类型定义
```typescript
// 推荐：新语法
const emit = defineEmits<{
  change: [value: string]
  select: [item: ItemType, index: number]
}>()

// 也可接受：旧语法
const emit = defineEmits<{
  (e: 'change', value: string): void
  (e: 'select', item: ItemType, index: number): void
}>()
```

---

## 3. Slots 与作用域插槽

### 基本原则
- 优先用 slots 扩展组件，而非增加 props
- 默认 slot 用于主要内容
- 具名 slot 用于固定布局位置（header, footer, icon）
- 作用域 slot 用于向消费者传递内部状态

### 模式示例
```vue
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div class="card-content">
      <slot :data="internalData" :loading="isLoading" />
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
```

---

## 4. Composables 设计模式

### 命名
- 以 `use` 前缀：`useTheme`, `useSidebar`, `useCommandPalette`
- 返回响应式状态和方法的对象

### 结构
```typescript
export function useToggle(initialValue = false) {
  const value = ref(initialValue)
  
  function toggle() {
    value.value = !value.value
  }
  
  function set(newValue: boolean) {
    value.value = newValue
  }
  
  return { value: readonly(value), toggle, set }
}
```

### 原则
- 返回值用 `readonly` 包裹防止外部直接修改
- 一个 composable 做一件事
- 可以组合其他 composables
- 副作用在 `onMounted` / `onUnmounted` 中管理

---

## 5. 组件组合模式

### Compound Component（复合组件）
适用于有父子关系的组件组（如 Tabs, Accordion, Select）：
```vue
<!-- 使用方式 -->
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">标签1</TabsTrigger>
    <TabsTrigger value="tab2">标签2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">内容1</TabsContent>
  <TabsContent value="tab2">内容2</TabsContent>
</Tabs>
```

通过 provide/inject 共享状态：
```typescript
// 父组件 provide
const context = reactive({ activeValue, setActive })
provide(TABS_INJECTION_KEY, context)

// 子组件 inject
const ctx = inject(TABS_INJECTION_KEY)
```

### Headless Component（无样式组件）
当组件只提供逻辑不提供样式时，使用 Reka UI 原语或自行实现 renderless component。

---

## 6. 状态管理模式

### 组件内状态
- `ref` / `reactive` 用于局部状态
- `computed` 用于派生状态

### 跨组件状态
- 父子：props + emits
- 祖孙：provide + inject
- 全局：Pinia store

### Pinia 使用约定
```typescript
export const useAuthStore = defineStore('auth', () => {
  // state
  const user = ref<User | null>(null)
  
  // getters
  const isLoggedIn = computed(() => !!user.value)
  
  // actions
  async function login(credentials: LoginCredentials) { ... }
  
  return { user, isLoggedIn, login }
})
```

---

## 7. TypeScript 集成

### 类型文件约定
每个组件的 `types.ts` 应包含：
```typescript
// Props 类型
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
}

// Emits 类型（如需在外部引用）
export interface ButtonEmits {
  click: [event: MouseEvent]
}

// Slot 作用域类型（如有）
export interface ButtonSlotProps {
  loading: boolean
  disabled: boolean
}

// 组件实例类型（如需暴露方法）
export interface ButtonExposed {
  focus: () => void
}
```

### 严格模式要求
- 禁止 `any`（除非有充分理由并加注释说明）
- 所有 props 有类型定义
- 所有 emits 有类型定义
- 工具函数有完整的输入输出类型
