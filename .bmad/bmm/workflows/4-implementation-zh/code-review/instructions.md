# Code Review - 代码审查工作流

## 概述

本工作流用于对已完成开发的 Story 进行代码审查，确保代码质量和规范符合项目要求。

## 前置条件

- Story 状态为 `review`
- 代码已提交到版本控制
- 开发者已完成自测

## 审查维度

### 1. 功能正确性
- [ ] 验收标准全部满足
- [ ] 边界条件正确处理
- [ ] 错误处理完善

### 2. 代码质量
- [ ] 代码结构清晰
- [ ] 命名规范合理
- [ ] 无重复代码
- [ ] 无硬编码

### 3. 安全性
- [ ] 无安全漏洞
- [ ] 输入验证完整
- [ ] 敏感数据保护

### 4. 性能
- [ ] 无明显性能问题
- [ ] 数据库查询优化
- [ ] 无内存泄漏风险

### 5. 测试覆盖
- [ ] 单元测试覆盖
- [ ] 关键路径测试
- [ ] 异常场景测试

## 执行流程

<workflow>

<step n="1" goal="加载待审查的 Story">
<action>读取 sprint-status.yaml 找到状态为 review 的 Stories</action>
<action>选择要审查的 Story</action>
<action>加载 Story 详情和代码变更</action>
</step>

<step n="2" goal="执行代码审查">
<action>按审查维度逐一检查</action>
<action>记录发现的问题</action>

**问题记录格式**:
```markdown
### 审查问题

| 序号 | 文件 | 行号 | 级别 | 描述 | 建议 |
|------|------|------|------|------|------|
| 1 | {file} | {line} | {critical/major/minor} | {问题描述} | {修改建议} |
```
</step>

<step n="3" goal="生成审查报告">
<action>汇总审查结果</action>

**审查报告模板**:
```markdown
# 代码审查报告

## Story 信息
- Story: {story_id}
- Track: {track}
- 开发者: {developer}
- 审查时间: {date}

## 审查结果

### 通过项
- [x] 功能正确性
- [x] 代码质量
- [ ] 安全性 (有问题)
- [x] 性能
- [x] 测试覆盖

### 问题列表
{问题表格}

### 审查结论
- [ ] 通过 - 可以合并
- [x] 需修改 - 修复后重新审查
- [ ] 拒绝 - 需要重大修改

### 修改建议
{具体建议}
```
</step>

<step n="4" goal="更新状态">

**如果通过**:
<action>更新 Story 状态为 done</action>
<action>如果 Epic 所有 Story 完成，更新 Epic 状态为 done</action>

**如果需修改**:
<action>Story 状态保持 review</action>
<action>通知开发者修复问题</action>
<action>修复后重新审查</action>
</step>

</workflow>

## Track 特定审查点

### Backend 审查重点
- API 接口规范
- 数据库事务处理
- 异常处理机制
- 日志记录完整性

### Frontend 审查重点
- 组件职责单一
- 状态管理合理
- 用户体验流畅
- 可访问性支持

### Integration 审查重点
- 端到端流程完整
- 数据一致性
- 错误恢复机制
- 测试可重复性
