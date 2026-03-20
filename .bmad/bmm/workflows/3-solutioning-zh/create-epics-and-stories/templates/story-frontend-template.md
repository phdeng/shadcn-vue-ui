# Story {Epic}.{Seq}: {Story 名称}

## Story 概述

| 字段 | 值 |
|------|-----|
| Story ID | story-{Epic}.{Seq}-{type}-{name} |
| Track | Frontend |
| 类型 | {page/component/feature/style} |
| 页面类型 | {list/tree-list/form/detail/overview/wizard/search} |
| Epic | Epic {Epic}: {Epic 名称} |
| 状态 | backlog |

## 用户故事

作为 {用户角色}，
我希望 {页面/组件提供的功能}，
以便 {获得的价值/完成的任务}。

---

## UI 设计

### 设计稿

> 选择一种或多种方式提供设计参考

- Figma: {figma_link}?node-id={node_id}
- 本地截图:
  - 列表状态: {screenshot_path}
  - 编辑弹窗: {screenshot_path}
- 参考现有页面: `src/views/{module}/{page}.vue`

### 页面功能

> 列出页面能做的所有操作

- 查询：按 {字段1}、{字段2} 筛选
- 新增：{点击按钮/跳转页面} 打开表单
- 编辑：{行内编辑/跳转页面/弹窗编辑}
- 删除：{二次确认后删除/软删除}
- 导出：导出 {Excel/PDF/CSV}
- {其他功能}

### 页面内容

> 描述页面的信息结构和元素

**查询区**
- {字段1}：{控件类型}，{验证规则}
- {字段2}：{下拉框}，选项来源 {API/枚举}
- 按钮：查询、重置

**表格列**（如 list/tree-list 类型）
| 列名 | 字段 | 宽度 | 对齐 | 特殊渲染 |
|------|------|------|------|----------|
| 序号 | index | 60px | center | - |
| {名称} | name | auto | left | - |
| {状态} | status | 100px | center | Tag 组件 |
| 操作 | - | 150px | center | 编辑、删除按钮 |

**表单字段**（如 form/wizard 类型）
| 字段 | 控件 | 必填 | 验证规则 | 说明 |
|------|------|------|----------|------|
| {名称} | Input | Y | max: 50 | - |
| {类型} | Select | Y | - | 选项: A/B/C |
| {描述} | Textarea | N | max: 500 | - |

### 页面布局

> 使用 ASCII 图示意或描述

```
┌─────────────────────────────────────┐
│ 页面标题                    [新增按钮] │
├─────────────────────────────────────┤
│ 查询条件区                           │
│ [输入框] [下拉框] [查询] [重置]        │
├─────────────────────────────────────┤
│ 数据表格                            │
│ ┌───┬───────┬───────┬─────┐        │
│ │ # │ 名称   │ 状态   │ 操作 │        │
│ ├───┼───────┼───────┼─────┤        │
│ │ 1 │ xxx   │ 启用   │ ... │        │
│ └───┴───────┴───────┴─────┘        │
├─────────────────────────────────────┤
│                          [分页组件]  │
└─────────────────────────────────────┘
```

### 样式规范

> 特殊样式要求，没有可省略

- 状态标签：{启用=绿色/success，禁用=灰色/info}
- 按钮样式：{主按钮=primary，危险按钮=danger}
- 参考组件：`src/components/{ComponentName}.vue`
- 参考页面：`src/views/{module}/{page}.vue`

---

## 数据规格

### 数据来源

> 说明数据从哪里来

- [ ] **Mock 数据**：生成 {N} 条模拟数据，预留 API 调用位置
- [ ] **真实 API**：对接后端接口

### 依赖的 API

| API | 方法 | 用途 | 请求参数 | 响应结构 | Backend Story |
|-----|------|------|----------|----------|---------------|
| /api/v1/{resource} | GET | 列表查询 | page, size, {filters} | `{list, total}` | story-{X}.{Y} |
| /api/v1/{resource}/{id} | GET | 详情查询 | id | `{detail}` | story-{X}.{Y} |
| /api/v1/{resource} | POST | 新增 | {body} | `{id}` | story-{X}.{Y} |
| /api/v1/{resource}/{id} | PUT | 编辑 | id, {body} | - | story-{X}.{Y} |
| /api/v1/{resource}/{id} | DELETE | 删除 | id | - | story-{X}.{Y} |

### 数据类型定义

```typescript
// 列表项类型
interface {ResourceItem} {
  id: string;
  name: string;
  status: 'enabled' | 'disabled';
  createdAt: string;
  // ...
}

// 查询参数类型
interface {ResourceQuery} {
  page: number;
  size: number;
  name?: string;
  status?: string;
}

// 表单数据类型
interface {ResourceForm} {
  name: string;
  // ...
}
```

---

## 路由信息

> 仅 page- 类型需要

| 字段 | 值 |
|------|-----|
| 路由路径 | `/module/page` |
| 路由名称 | `ModulePage` |
| 父路由 | `/module` |
| 权限标识 | `module:page:view` |
| 菜单位置 | {一级菜单} > {二级菜单} |

---

## 验收标准

### AC-1: 页面加载

**Given** 用户访问 `{路由路径}`
**When** 页面完成加载
**Then** 显示 {默认状态/列表数据}
**And** 查询条件为默认值

### AC-2: 查询功能

**Given** 用户在查询区输入条件
**When** 点击「查询」按钮
**Then** 表格显示筛选后的数据
**And** 分页重置到第一页

### AC-3: 新增功能

**Given** 用户点击「新增」按钮
**When** 填写表单并提交
**Then** 数据保存成功
**And** 列表刷新显示新数据

### AC-4: 编辑功能

**Given** 用户点击行的「编辑」按钮
**When** 修改数据并保存
**Then** 数据更新成功
**And** 列表显示更新后的数据

### AC-5: 删除功能

**Given** 用户点击「删除」按钮
**When** 确认删除
**Then** 数据删除成功
**And** 列表移除该行

### AC-6: 错误处理

**Given** API 返回错误（{错误码}）
**When** 页面接收到错误
**Then** 显示错误提示 `{错误消息}`
**And** 页面保持可操作状态

### AC-7: 响应式适配

**Given** 用户使用 {移动端/平板/PC}
**When** 访问页面
**Then** 布局正确适配
**And** 功能正常可用

---

## 交互细节

### 加载状态

| 场景 | 加载指示器 | 位置 |
|------|-----------|------|
| 页面初始化 | 骨架屏/Spinner | 内容区 |
| 表格加载 | v-loading | 表格区域 |
| 按钮提交 | loading 状态 | 按钮本身 |

### 空状态

| 场景 | 显示内容 | 操作引导 |
|------|----------|----------|
| 无数据 | 空状态图 + 文案 | 「立即创建」按钮 |
| 搜索无结果 | 提示文案 | 「重置筛选」链接 |

### 确认弹窗

| 操作 | 标题 | 内容 | 确认按钮 | 取消按钮 |
|------|------|------|----------|----------|
| 删除 | 确认删除 | 确定要删除 {name} 吗？ | 删除（danger） | 取消 |
| 批量删除 | 确认删除 | 确定要删除选中的 {n} 条数据吗？ | 删除 | 取消 |

---

## 状态管理

### 本地状态

```typescript
interface PageState {
  // 加载状态
  loading: boolean
  submitting: boolean

  // 数据
  list: { ResourceItem }[]
  total: number
  currentItem: { ResourceItem } | null

  // 查询参数
  query: { ResourceQuery }

  // UI 状态
  dialogVisible: boolean
  dialogMode: 'add' | 'edit' | 'view'
}
```

### 全局状态依赖

| Store 模块 | 使用的状态/方法 | 用途 |
|-----------|----------------|------|
| user | userInfo, permissions | 权限判断 |
| app | sidebar, device | 响应式布局 |

---

## 依赖关系

### 前置 Story

- [ ] story-{X}.{Y}-{type}-{name} - {依赖原因}

### 依赖的 Backend Story

- [ ] story-{X}.{Y}-api-{name} - 提供 CRUD API

### 被依赖

- story-{X}.{Y} 需要此页面/组件

---

## 技术说明

### 使用的组件

| 组件 | 来源 | 用途 |
|------|------|------|
| ElTable | Element Plus | 数据表格 |
| ElPagination | Element Plus | 分页 |
| ElDialog | Element Plus | 弹窗 |
| {CustomComponent} | 项目组件库 | {用途} |

### 实现要点

1. {要点 1：关键技术选型或实现方式}
2. {要点 2：需要注意的边界情况}
3. {要点 3：性能优化建议}

### 参考资料

- PRD: [Source: {PRD 文档}#{章节}]
- UX: [Source: {UX 设计文档}#{章节}]

---

## 技术任务

> 将 Story 拆分为具体的开发任务，每个 Task 对应一个独立的代码文件或功能模块

### Task 1: {任务名称}

**模块**: `{项目模块名，如 msp-operations-ui}`
**文件**: `{文件路径，如 src/views/module/page/list.vue}`

**任务描述**:
{简要描述这个任务要完成的工作}

**实现要点**:
- {要点 1}
- {要点 2}

**代码示例** (可选):
```vue
<script setup lang="ts">
// 关键逻辑代码
</script>

<template>
  <!-- 关键模板结构 -->
</template>
```

---

### Task 2: {任务名称}

**模块**: `{项目模块名}`
**文件**: `{文件路径}`

**任务描述**:
{简要描述}

**实现要点**:
- {要点 1}
- {要点 2}

---

### Task 3: {任务名称} - API 接口

**模块**: `{项目模块名}`
**文件**: `{src/api/module/resource.ts}`

**任务描述**:
创建 API 接口调用函数

**接口列表**:
```typescript
// 获取列表
export function get{Resource}List(params: QueryParams) {
  return request.get('/api/v1/{resource}', { params })
}

// 获取详情
export function get{Resource}ById(id: number) {
  return request.get(`/api/v1/{resource}/${id}`)
}

// 新增
export function add{Resource}(data: ResourceDTO) {
  return request.post('/api/v1/{resource}', data)
}

// 修改
export function update{Resource}(id: number, data: ResourceDTO) {
  return request.put(`/api/v1/{resource}/${id}`, data)
}

// 删除
export function delete{Resource}(id: number) {
  return request.delete(`/api/v1/{resource}/${id}`)
}
```

---

### Task 4: {任务名称} - 类型定义

**模块**: `{项目模块名}`
**文件**: `{src/types/module/resource.ts}`

**任务描述**:
创建 TypeScript 类型定义

**类型定义**:
```typescript
// 列表项类型
export interface {Resource}VO {
  id: number
  // ...
}

// 表单 DTO
export interface {Resource}DTO {
  // ...
}

// 查询参数
export interface {Resource}Query {
  page: number
  size: number
  // ...
}
```

---

## 测试要求

### 组件/单元测试

- [ ] 页面正确渲染
- [ ] 查询功能正常
- [ ] 表单验证正确
- [ ] 错误处理正确

### E2E 测试

- [ ] 完整 CRUD 流程
- [ ] 异常场景处理

---

## 开发记录

### 完成记录

<!-- 开发完成后填写 -->
- 完成时间:
- 开发者/Agent:
- 提交记录:

### 实现文件

<!-- 开发完成后列出 -->
```
src/views/{module}/
├── list.vue          # 列表页
├── add.vue           # 新增页
├── edit.vue          # 编辑页
└── components/
    └── {Component}.vue
```

### 备注

<!-- 开发过程中的注意事项 -->
