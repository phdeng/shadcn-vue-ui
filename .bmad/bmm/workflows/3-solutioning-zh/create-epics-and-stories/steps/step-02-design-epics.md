---
name: 'step-02-design-epics'
description: '设计统一的功能模块 Epic 列表，为 Multi-Track 拆分做准备'

workflow_path: '{project-root}/.bmad/bmm/workflows/3-solutioning-zh/create-epics-and-stories'

thisStepFile: '{workflow_path}/steps/step-02-design-epics.md'
nextStepFile: '{workflow_path}/steps/step-03-create-stories.md'
workflowFile: '{workflow_path}/workflow.md'
---

# Step 2: 设计统一 Epic 列表

## 步骤目标

识别功能模块并设计统一的 Epic 列表。Epic 编号将在 Backend、Frontend、Integration 三个 Track 中保持一致。

## Epic 设计原则

### 核心原则

1. **功能模块导向**：按业务功能模块划分，而非技术层
2. **统一编号**：同一功能的 Epic 在三个 Track 中使用相同编号
3. **独立交付**：每个 Epic 完成后可独立演示价值
4. **顺序依赖**：Epic 按自然顺序排列，后面的 Epic 可依赖前面的

### 正确示例

```
Epic 1: 用户系统
├── backend/epic-1/   → 用户实体、认证 API、权限服务
├── frontend/epic-1/  → 登录页、注册页、个人中心页
└── integration/epic-1/ → 登录流程、注册流程联调

Epic 2: 商品管理
├── backend/epic-2/   → 商品实体、商品 API、分类服务
├── frontend/epic-2/  → 商品列表页、商品详情页、搜索组件
└── integration/epic-2/ → 商品浏览流程、搜索功能联调
```

### 错误示例

```
❌ Epic 1: 数据库设计（技术层，无用户价值）
❌ Epic 2: API 开发（技术层）
❌ Epic 3: 前端组件库（技术层）
```

## 执行流程

### 1. 提取需求

从 PRD 文档中提取：
- **功能需求（FR）**：列出所有 FR 编号和描述
- **非功能需求（NFR）**：记录性能、安全等要求
- **用户角色**：识别系统中的用��类型

### 2. 识别功能模块

根据 FR 分组，识别自然的功能模块边界：
- 用户相关功能 → 用户系统
- 内容相关功能 → 内容管理
- 交易相关功能 → 订单系统

### 3. 设计 Epic 列表

为每个功能模块创建 Epic：

```markdown
## Epic 列表

### Epic 1: {功能模块名称}
**目标**: {用户可完成什么}
**覆盖 FR**: FR1, FR2, FR3
**Multi-Track 范围**:
- Backend: {后端需要实现什么}
- Frontend: {前端需要实现什么}
- Integration: {需要联调什么流程}

### Epic 2: {功能模块名称}
...
```

### 4. 验证覆盖

创建 FR 覆盖映射表：

| FR | Epic | 说明 |
|----|------|------|
| FR1 | Epic 1 | 用户注册功能 |
| FR2 | Epic 1 | 用户登录功能 |
| FR3 | Epic 2 | 商品浏览功能 |

确保：
- 所有 FR 都被映射到 Epic
- 没有 FR 被遗漏

### 5. 用户确认

展示 Epic 列表，获取用户确认：
- Epic 划分是否合理？
- 优先级顺序是否正确？
- 是否需要调整？

## 输出产物

完成后，在 `{output_folder}` 中创建三个 Track 的 `epics.md` 索引文件。

## 菜单选项

**选择操作:** [A] 高级引导 [P] 派对模式 [C] 继续下一步

- **A**: 深入讨论 Epic 划分
- **P**: 多角色评审 Epic 设计
- **C**: Epic 列表已确认，继续创建 Story

## 完成标准

- [ ] Epic 列表按功能模块设计
- [ ] 所有 FR 都已映射到 Epic
- [ ] 用户已确认 Epic 划分
- [ ] Multi-Track 索引文件已创建
