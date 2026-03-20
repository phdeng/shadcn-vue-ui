---
name: 'step-04-generate-sprint-status'
description: '生成 Sprint 状态跟踪文件'

workflow_path: '{project-root}/.bmad/bmm/workflows/3-solutioning-zh/create-epics-and-stories'

thisStepFile: '{workflow_path}/steps/step-04-generate-sprint-status.md'
nextStepFile: '{workflow_path}/steps/step-05-final-validation.md'
workflowFile: '{workflow_path}/workflow.md'

sprintStatusTemplate: '{workflow_path}/templates/sprint-status-template.yaml'
---

# Step 4: 生成 Sprint 状态文件

## 步骤目标

根据创建的 Epic 和 Story 文件，生成 `sprint-status.yaml` 状态跟踪文件。

## Sprint Status 结构

```yaml
# Sprint 状态跟踪文件
# 生成时间: {date}
# 项目: {project_name}

metadata:
  generated: "{date}"
  project: "{project_name}"
  version: "1.0"

# 状态定义
# Epic 状态: backlog → in-progress → done
# Story 状态: backlog → drafted → ready-for-dev → in-progress → review → done

tracks:
  backend:
    epic-1: backlog
    story-1.1-entity-user: backlog
    story-1.2-api-auth: backlog
    story-1.3-api-user: backlog
    epic-1-retrospective: optional
    
    epic-2: backlog
    story-2.1-entity-product: backlog
    # ...
    
  frontend:
    epic-1: backlog
    story-1.1-page-login: backlog
    story-1.2-page-register: backlog
    story-1.3-page-profile: backlog
    epic-1-retrospective: optional
    
    epic-2: backlog
    # ...
    
  integration:
    epic-1: backlog
    story-1.1-flow-login: backlog
    story-1.2-flow-register: backlog
    epic-1-retrospective: optional
    
    epic-2: backlog
    # ...
```

## 状态流转规则

### Epic 状态
```
backlog → in-progress → done
```
- **backlog**: Epic 未开始
- **in-progress**: Epic 中有 Story 正在开发
- **done**: Epic 所有 Story 完成

### Story 状态
```
backlog → drafted → ready-for-dev → in-progress → review → done
```
- **backlog**: Story 仅存在于 Epic 中
- **drafted**: Story 文件已创建
- **ready-for-dev**: Story 详情已完善，可开始开发
- **in-progress**: 开发进行中
- **review**: 代码审查中
- **done**: Story 完成

### 回顾状态
```
optional ↔ completed
```

## 执行流程

### 1. 扫描文件结构

遍历 `{output_folder}` 目录，收集：
- 所有 Epic 目录
- 所有 Story 文件
- 文件创建状态

### 2. 初始化状态

为每个 Story 设置初始状态：
- 如果 Story 文件已存在 → `drafted`
- 如果 Story 仅在 Epic 中列出 → `backlog`

### 3. 生成 YAML 文件

按以下顺序生成条目：
1. Track 分组（backend / frontend / integration）
2. 每个 Track 内按 Epic 顺序
3. 每个 Epic 内按 Story 顺序
4. 每个 Epic 后附带 retrospective 条目

### 4. 验证生成结果

检查：
- [ ] 所有 Epic 都有对应条目
- [ ] 所有 Story 都有对应条目
- [ ] 状态值合法
- [ ] YAML 语法正确

## 输出文件

生成文件位置：`{output_folder}/sprint-status.yaml`

## 菜单选项

**选择操作:** [C] 继续最终验证

## 完成标准

- [ ] sprint-status.yaml 文件已生成
- [ ] 三个 Track 的所有条目完整
- [ ] 初始状态正确设置
- [ ] YAML 格式验证通过
