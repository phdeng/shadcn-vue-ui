# 测试策略参考

## 测试分层

```
┌─────────────────────────┐
│    E2E Tests (少)        │  关键用户流程
├─────────────────────────┤
│  Component Tests (多)    │  组件交互与集成
├─────────────────────────┤
│   Unit Tests (最多)      │  工具函数、composables
└─────────────────────────┘
```

## 工具栈

| 工具 | 用途 |
|------|------|
| Vitest | 测试运行器 + 断言库 |
| @vue/test-utils | Vue 组件挂载与查询 |
| @testing-library/vue | 行为驱动的组件测试（可选） |
| happy-dom / jsdom | DOM 环境 |
| vitest-axe | 可访问性自动检测 |

## 组件测试模板

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  // 渲染测试
  it('默认渲染', () => {
    const wrapper = mount(Button, {
      slots: { default: '点击' }
    })
    expect(wrapper.text()).toBe('点击')
    expect(wrapper.classes()).toContain('...')
  })

  // Props 测试
  it('variant=destructive 应用正确样式', () => {
    const wrapper = mount(Button, {
      props: { variant: 'destructive' }
    })
    expect(wrapper.classes()).toContain('bg-destructive')
  })

  // 事件测试
  it('点击触发 click 事件', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  // disabled 状态
  it('disabled 时不触发事件', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  // 可访问性
  it('有正确的 ARIA 属性', () => {
    const wrapper = mount(Button, {
      props: { disabled: true }
    })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })
})
```

## 每个组件必须覆盖的测试场景

1. **默认渲染**: 无 props 时的默认状态
2. **所有 variant**: 每个 variant 值的样式检查
3. **所有 size**: 每个 size 值的尺寸检查
4. **disabled 状态**: 禁用时外观和行为
5. **事件触发**: 用户交互触发的事件
6. **v-model**: 双向绑定是否正常
7. **slots**: 默认和具名 slot 的渲染
8. **键盘操作**: Tab、Enter、Escape 等
9. **ARIA**: 角色和属性
10. **边界条件**: 空内容、超长文本、极端数据

## Composable 测试模板

```typescript
import { describe, it, expect } from 'vitest'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('初始值为 false', () => {
    const { value } = useToggle()
    expect(value.value).toBe(false)
  })

  it('toggle 切换值', () => {
    const { value, toggle } = useToggle()
    toggle()
    expect(value.value).toBe(true)
    toggle()
    expect(value.value).toBe(false)
  })

  it('接受自定义初始值', () => {
    const { value } = useToggle(true)
    expect(value.value).toBe(true)
  })
})
```

## 测试命名约定
- 文件名：`ComponentName.test.ts` 或 `ComponentName.spec.ts`
- 描述用中文
- 使用 `describe` 按组件/功能分组
- 使用 `it` 描述具体行为

## 何时写测试
- M/L 级任务：必须写
- S 级任务：列出测试场景但不要求写代码
- 已有组件的 bug 修复：必须补充回归测试
