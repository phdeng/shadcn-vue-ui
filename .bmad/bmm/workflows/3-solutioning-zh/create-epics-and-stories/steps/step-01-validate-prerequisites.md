---
name: 'step-01-validate-prerequisites'
description: '验证创建 Epic 和 Story 所需的前置条件'

workflow_path: '{project-root}/.bmad/bmm/workflows/3-solutioning-zh/create-epics-and-stories'

thisStepFile: '{workflow_path}/steps/step-01-validate-prerequisites.md'
nextStepFile: '{workflow_path}/steps/step-02-design-epics.md'
workflowFile: '{workflow_path}/workflow.md'
---

# Step 1: 验证前置条件

## 步骤目标

确保创建 Epic 和 Story 所需的所有输入文档已准备就绪。

## 前置条件检查清单

### 必需文档

- [ ] **PRD 文档** - 产品需求文档已审查和批准
  - 位置：`{output_folder}/prd.md` 或类似
  - 包含：功能需求（FR）、非功能需求（NFR）

- [ ] **架构文档** - 技术架构已确定
  - 位置：`{output_folder}/architecture.md` 或类似
  - 包含：技术栈、系统边界、集成点

### 推荐文档

- [ ] **UX 设计** - 用户界面设计（如有）
  - 位置：`{output_folder}/ux-design.md` 或 Figma 链接

- [ ] **API 规范** - API 设计文档（如有）
  - 位置：`{output_folder}/api-spec.md` 或 OpenAPI 文件

## 执行协议

1. **搜索项目文档**
   - 在 `{output_folder}` 中查找 PRD 和架构文档
   - 记录找到的文档路径

2. **验证文档完整性**
   - PRD 是否包含明确的功能需求列表？
   - 架构是否明确前后端技术栈？

3. **记录缺失项**
   - 如有缺失，列出需要补充的内容
   - 与用户确认是否继续

## 菜单选项

**选择操作:** [A] 高级引导 [P] 派对模式 [C] 继续下一步

- **A**: 执行高级引导任务，深入探讨需求
- **P**: 启动派对模式，多角色协作讨论
- **C**: 前置条件已满足，继续到 Step 2

## 完成标准

- [ ] PRD 文档已定位并验证
- [ ] 架构文档已定位并验证
- [ ] 用户确认可以继续
