---
name: 'step-05-final-validation'
description: '最终验证所有 Epic、Story 和 Sprint 状态'

workflow_path: '{project-root}/.bmad/bmm/workflows/3-solutioning-zh/create-epics-and-stories'

thisStepFile: '{workflow_path}/steps/step-05-final-validation.md'
workflowFile: '{workflow_path}/workflow.md'
---

# Step 5: 最终验证

## 步骤目标

验证所有创建的 Epic、Story 和 Sprint 状态文件的完整性和一致性。

## 验证清单

### 1. 结构验证

- [ ] 目录结构符合规范
  ```
  {output_folder}/
  ├── sprint-status.yaml
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

- [ ] 每个 Epic 目录包含 `epic.md`
- [ ] 每个 Epic 目录包含对应的 Story 文件

### 2. 命名验证

- [ ] Epic 编号在三个 Track 中一致
- [ ] Story 文件命名符合规范：`story-{Epic}.{Seq}-{type}-{name}.md`
- [ ] Story 类型前缀正确使用

### 3. 内容验证

- [ ] 每个 Epic 有明确的目标描述
- [ ] 每个 Story 有完整的用户故事格式
- [ ] 每个 Story 有验收标准
- [ ] 依赖关系清晰标注

### 4. 覆盖验证

- [ ] 所有 PRD 功能需求（FR）都被 Epic 覆盖
- [ ] 没有 FR 被遗漏
- [ ] 没有重复覆盖

### 5. Sprint Status 验证

- [ ] `sprint-status.yaml` 包含所有三个 Track
- [ ] 每个 Epic 在 Status 中有条目
- [ ] 每个 Story 在 Status 中有条目
- [ ] 初始状态设置正确

## 验证报告

生成验证报告：

```markdown
# Epic 和 Story 验证报告

## 概览
- 总 Epic 数量: {epic_count}
- Backend Stories: {backend_story_count}
- Frontend Stories: {frontend_story_count}
- Integration Stories: {integration_story_count}
- 总 Story 数量: {total_story_count}

## 需求覆盖
- 已覆盖 FR: {covered_fr_count}/{total_fr_count}
- 覆盖率: {coverage_percent}%

## 验证结果
- [ ] 结构验证: {pass/fail}
- [ ] 命名验证: {pass/fail}
- [ ] 内容验证: {pass/fail}
- [ ] 覆盖验证: {pass/fail}
- [ ] Sprint Status 验证: {pass/fail}

## 待解决问题
{issues_list}
```

## 完成标准

- [ ] 所有验证项通过
- [ ] 验证报告已生成
- [ ] 用户确认可以进入实现阶段

## 工作流完成

恭喜！Epic 和 Story 创建工作流已完成。

**下一步**：
1. 进入 `4-implementation-zh/sprint-planning` 工作流
2. 开始开发第一个 Story
