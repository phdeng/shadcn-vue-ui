# Create Story - Story 详情编写工作流

## 概述

本工作流用于将 Epic 中列出的 Story 转化为详细的 Story 文件，包含完整的用户故事、验收标准和技术说明。

## 适用场景

当 Story 状态从 `backlog` 转变为 `drafted` 时使用此工作流。

## 执行流程

<workflow>

<step n="1" goal="选择要编写的 Story">
<action>读取 sprint-status.yaml 找到状态为 backlog 的 Stories</action>
<action>展示可编写的 Story 列表</action>

**展示格式**:
```
可编写的 Stories (backlog 状态):

Backend:
  1. story-1.3-service-permission (Epic 1: 用户系统)
  2. story-2.1-entity-product (Epic 2: 商品管理)

Frontend:
  3. story-1.3-page-profile (Epic 1: 用户系统)
  4. story-2.1-page-product-list (Epic 2: 商品管理)

Integration:
  5. story-1.1-flow-login (Epic 1: 用户系统)

请选择要编写的 Story (输入编号):
```

<action>等待用户选择</action>
</step>

<step n="2" goal="加载相关上下文">
<action>根据选择的 Story 类型和 Track，加载相关文档:</action>

**Backend Story 上下文**:
- PRD 中的相关需求
- 架构文档中的技术约束
- 相关 API 规范
- 数据库设计

**Frontend Story 上下文**:
- UX 设计文档
- 相关页面原型
- 依赖的 Backend API
- 组件库规范

**Integration Story 上下文**:
- 依赖的 Backend Stories
- 依赖的 Frontend Stories
- 业务流程描述
</step>

<step n="3" goal="协作编写 Story 内容">
<action>使用对应的 Story 模板</action>
<action>与用户协作填写各部分内容</action>

**必填内容**:
1. 用户故事 (As a / I want / So that)
2. 验收标准 (Given / When / Then)
3. 依赖关系

**选填内容**:
- 技术说明
- 测试要求
- 参考资料
</step>

<step n="4" goal="验证 Story 完整性">
<action>检查 Story 内容完整性:</action>

- [ ] 用户故事格式完整
- [ ] 至少有 2 个验收标准
- [ ] 验收标准可测试
- [ ] 依赖关系明确
- [ ] 符合 Story 粒度要求

**粒度检查**:
- Backend: 一个 Story 应在 1-2 个工作日内完成
- Frontend: 一个页面或一个复杂组件
- Integration: 一个完整业务流程
</step>

<step n="5" goal="创建 Story 文件">
<action>在对应的 Epic 目录下创建 Story 文件</action>

**文件路径**:
```
{output_folder}/{track}/epic-{N}/story-{N}.{M}-{type}-{name}.md
```

<action>更新 sprint-status.yaml 中的状态为 drafted</action>
</step>

<step n="6" goal="更新 Epic 索引">
<action>更新 Epic 的 epic.md 文件中的 Story 列表</action>
<action>更新 Track 的 epics.md 索引文件</action>
</step>

</workflow>

## Story 模板选择

根据 Track 和类型选择模板：

| Track | 类型 | 模板 |
|-------|------|------|
| Backend | entity/api/service/infra | story-backend-template.md |
| Frontend | page/component/feature/style | story-frontend-template.md |
| Integration | flow/test | story-integration-template.md |

## 质量检查清单

### 用户故事质量
- [ ] 角色明确
- [ ] 需求具体
- [ ] 价值清晰

### 验收标准质量
- [ ] 使用 Given/When/Then 格式
- [ ] 可独立验证
- [ ] 覆盖主流程
- [ ] 覆盖异常流程

### 依赖关系质量
- [ ] 前置依赖明确
- [ ] 跨 Track 依赖标注
- [ ] 无循环依赖

## 完成标志

Story 文件创建完成，状态更新为 `drafted`。

**下一步**:
1. Story 审核通过后，状态更新为 `ready-for-dev`
2. 使用 `dev-story` 工作流开始开发
