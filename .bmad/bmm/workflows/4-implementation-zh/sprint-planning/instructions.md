# Sprint Planning - Sprint 状态生成器

<critical>本工作流执行引擎由以下文件控制: {project-root}/.bmad/core/tasks/workflow.xml</critical>

## 概述

本工作流扫描项目的 Epic 和 Story 文件，生成或更新 `sprint-status.yaml` 状态跟踪文件。

支持 Multi-Track 架构：
- **Backend**: 后端开发 Track
- **Frontend**: 前端开发 Track
- **Integration**: 前后端联调 Track

## 文档发现策略

### Epic 发现流程

1. **检查 Multi-Track 目录结构**:
   ```
   {output_folder}/
   ├── backend/
   │   ├── epics.md
   │   └── epic-{N}/
   ├── frontend/
   │   ├── epics.md
   │   └── epic-{N}/
   └── integration/
       ├── epics.md
       └── epic-{N}/
   ```

2. **扫描每个 Track**:
   - 读取 `epics.md` 获取 Epic 列表
   - 遍历 `epic-{N}/` 目录获取 Story 文件

3. **Story 文件识别**:
   - 文件名格式: `story-{Epic}.{Seq}-{type}-{name}.md`
   - 提取 Epic 编号、序号、类型和名称

<workflow>

<step n="1" goal="扫描项目文件结构">
<action>使用 {communication_language} 与 {user_name} 交流</action>
<action>在 {output_folder} 中查找 Multi-Track 目录</action>
<action>验证目录结构是否符合规范</action>

**目录验证**:
- [ ] backend/ 目录存在
- [ ] frontend/ 目录存在
- [ ] integration/ 目录存在
- [ ] 每个目录包含 epics.md
</step>

<step n="2" goal="提取所有 Epic 和 Story">
<action>遍历每个 Track 目录</action>
<action>读取 Epic 目录中的所有 Story 文件</action>

**Story ID 提取规则**:
- 原始文件: `story-1.1-entity-user.md`
- 提取结果: `story-1.1-entity-user`

<action>构建完整的 Epic 和 Story 清单</action>
</step>

<step n="3" goal="检测当前状态">
<action>对于每个 Story，检测当前状态:</action>

**状态检测规则**:
| 条件 | 状态 |
|------|------|
| Story 文件存在 | drafted |
| 文件中 Status 字段为 ready-for-dev | ready-for-dev |
| 文件中 Status 字段为 in-progress | in-progress |
| 文件中 Status 字段为 review | review |
| 文件中 Status 字段为 done | done |
| 仅在 Epic 中列出 | backlog |

**保留规则**:
- 如果现有 status 文件中状态更高级，保留原状态
- 不降级状态（例如不将 done 改为 drafted）
</step>

<step n="4" goal="生成 Sprint Status 文件">
<action>创建或更新 {output_folder}/sprint-status.yaml</action>

**文件结构**:
```yaml
metadata:
  generated: '{date}'
  project: '{project_name}'
  version: '1.0'

tracks:
  backend:
    epic-1: {status}
    story-1.1-entity-user: {status}
    story-1.2-api-auth: {status}
    epic-1-retrospective: optional

  frontend:
    epic-1: {status}
    story-1.1-page-login: {status}
    epic-1-retrospective: optional

  integration:
    epic-1: {status}
    story-1.1-flow-login: {status}
    epic-1-retrospective: optional
```

<action>按顺序写入: Track → Epic → Stories → Retrospective</action>
</step>

<step n="5" goal="验证并报告">
<action>执行验证检查:</action>

- [ ] 每个 Track 的所有 Epic 都有条目
- [ ] 每个 Epic 的所有 Story 都有条目
- [ ] 每个 Epic 都有 retrospective 条目
- [ ] 状态值都是合法的
- [ ] YAML 语法正确

<action>生成统计报告:</action>

**Sprint Status 生成完成**

| Track | Epic 数 | Story 数 | 进行中 | 已完成 |
|-------|---------|----------|--------|--------|
| Backend | {N} | {N} | {N} | {N} |
| Frontend | {N} | {N} | {N} | {N} |
| Integration | {N} | {N} | {N} | {N} |

**下一步**:
1. 查看生成的 {output_folder}/sprint-status.yaml
2. 使用 create-story 工作流细化 Story
3. 使用 dev-story 工作流开始开发
</step>

</workflow>

## 状态流转说明

### Epic 状态
```
backlog → in-progress → done
```

### Story 状态
```
backlog → drafted → ready-for-dev → in-progress → review → done
```

### Retrospective 状态
```
optional ↔ completed
```

## 注意事项

1. **Epic 状态自动推断**:
   - 如果任一 Story 为 in-progress，Epic 为 in-progress
   - 如果所有 Story 为 done，Epic 为 done

2. **跨 Track 一致性**:
   - 同一 Epic 编号在三个 Track 中代表同一功能模块
   - 状态独立跟踪，不自动同步
