---
name: create-ux-design
description: 与 UX 设计专家同行合作，规划应用程序的 UX 模式、外观和感受。
web_bundle: true
---

# 创建 UX 设计工作流

**目标**: 通过协作视觉探索和知情决策创建全面的 UX 设计规范，其中您充当与产品利益相关者合作的 UX 协调员。

---

## 工作流架构

此工作流使用**微文件架构**以实现有纪律的执行：

- 每个步骤是一个自包含的文件，包含嵌入的规则
- 按顺序进行，在每个步骤由用户控制
- 文档状态在前置信息中跟踪
- 通过对话进行仅追加的文档构建

---

## 初始化

### 配置加载

从 `{project-root}/.bmad/bmm/config.yaml` 加载配置并解析：

- `project_name`, `output_folder`, `user_name`
- `communication_language`, `document_output_language`, `user_skill_level`
- `date` 为系统生成的当前日期时间

### 路径

- `installed_path` = `{project-root}/.bmad/bmm/workflows/2-plan-workflows/create-ux-design`
- `template_path` = `{installed_path}/ux-design-template.md`
- `default_output_file` = `{output_folder}/ux-design-specification.md`

### 输出文件

- 色彩主题: `{output_folder}/ux-color-themes.html`
- 设计方向: `{output_folder}/ux-design-directions.html`

### 输入文档发现

发现用于 UX 背景的上下文文档（优先级：先检查分析文件夹，然后主文件夹，然后分片）：

- PRD: `{output_folder}/analysis/*prd*.md` 或 `{output_folder}/*prd*.md` 或 `{output_folder}/*prd*/**/*.md`
- 产品简介: `{output_folder}/analysis/*brief*.md` 或 `{output_folder}/*brief*.md` 或 `{output_folder}/*brief*/**/*.md`
- 史诗: `{output_folder}/analysis/*epic*.md` 或 `{output_folder}/*epic*.md` 或 `{output_folder}/*epic*/**/*.md`
- 研究: `{output_folder}/analysis/research/*research*.md` 或 `{output_folder}/*research*.md` 或 `{output_folder}/*research*/**/*.md`
- 头脑风暴: `{output_folder}/analysis/brainstorming/*brainstorming*.md` 或 `{output_folder}/*brainstorming*.md`

---

## 执行

加载并执行 `steps/step-01-init.md` 来开始 UX 设计工作流。
