# BMM 模块数据

本目录包含 BMM Agent 和工作流使用的模块特定数据文件。

## 文件

### `project-context-template.md`

项目特定头脑风暴上下文模板。被以下使用：

- Analyst Agent 的 `brainstorm-project` 命令
- 带上下文调用时的核心头脑风暴工作流

### `documentation-standards.md`

BMAD 文档标准和指南。被以下使用：

- Tech Writer Agent（关键操作加载）
- 各种文档工作流
- 标准验证和审查流程

## 目的

将模块特定数据与核心工作流实现分离，保持清晰架构：

- 核心工作流保持通用和可复用
- 模块特定模板和标准得到适当的作用域限定
- 数据文件可以轻松维护和更新
- 核心功能与模块功能之间有清晰的关注点分离
