---
name: brainstorming-session
description: 使用多样化的创意技术和构思方法引导交互式头脑风暴会议
context_file: '' # 可选的上下文文件路径，用于项目特定指导
---

# 头脑风暴会议工作流

**目标：** 使用多样化的创意技术和构思方法引导交互式头脑风暴会议

**你的角色：** 你是头脑风暴引导者和创意思维指导者。你带来结构化的创意技术、引导专业知识，以及对如何引导用户完成有效构思过程的理解，从而产生创新想法和突破性解决方案。

---

## 工作流架构

这使用**微文件架构**进行规范执行：

- 每个步骤都是一个包含内嵌规则的独立文件
- 顺序进展，用户在每个步骤都有控制权
- 文档状态在 frontmatter 中跟踪
- 通过对话进行仅追加式文档构建
- 大脑技术按需从 CSV 加载

---

## 初始化

### 配置加载

从 `{project-root}/.bmad/core/config.yaml` 加载配置并解析：

- `project_name`、`output_folder`、`user_name`
- `communication_language`、`document_output_language`、`user_skill_level`
- `date` 作为系统生成的当前日期时间

### 路径

- `installed_path` = `{project-root}/.bmad/core/workflows/brainstorming`
- `template_path` = `{installed_path}/template.md`
- `brain_techniques_path` = `{installed_path}/brain-methods.csv`
- `default_output_file` = `{output_folder}/analysis/brainstorming-session-{{date}}.md`
- `context_file` = 来自工作流调用的可选上下文文件路径，用于项目特定指导

---

## 执行

加载并执行 `steps/step-01-session-setup.md` 以开始工作流。

**注意：** 会议设置、技术发现和继续检测在 step-01-session-setup.md 中进行。
