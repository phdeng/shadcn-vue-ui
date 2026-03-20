# 核心 Excalidraw 资源

创建 Excalidraw 图表的通用知识。所有创建 Excalidraw 文件的 Agent 都应参考这些资源。

## 目的

提供**如何做**（通用知识），而 Agent 提供**做什么**（特定领域应用）。

**核心 = "如何创建 Excalidraw 元素"**

- 如何将形状与文本标签分组
- 如何计算文本宽度
- 如何创建具有正确绑定的箭头
- 如何验证 JSON 语法
- 基础结构和原语

**Agent = "创建什么图表"**

- Frame Expert（BMM）：技术流程图、架构图、线框图
- Presentation Master（CIS）：演示文稿、创意视觉、鲁布·戈德堡机械
- Tech Writer（BMM）：文档图表、概念说明

## 本目录中的文件

### excalidraw-helpers.md

**通用元素创建模式**

- 文本宽度计算
- 元素分组规则（形状 + 标签）
- 网格对齐
- 箭头创建（直线、折线）
- 主题应用
- 验证清单
- 优化规则

**Agent 参考此文件来：**

- 创建正确分组的形状
- 计算文本尺寸
- 用箭头连接元素
- 确保有效结构

### validate-json-instructions.md

**通用 JSON 验证流程**

- 如何验证 Excalidraw JSON
- 常见错误和修复
- 工作流集成
- 错误恢复

**Agent 参考此文件来：**

- 创建后验证文件
- 修复语法错误
- 确保文件可以在 Excalidraw 中打开

### library-loader.md（未来）

**如何加载外部 .excalidrawlib 文件**

- 程序化库加载
- 社区库集成
- 自定义库管理

**状态：** 实现外部库支持时将开发。

## Agent 如何使用这些资源

### 示例：Frame Expert（技术图表）

```yaml
# workflows/diagrams/create-flowchart/workflow.yaml
helpers: '{project-root}/.bmad/core/resources/excalidraw/excalidraw-helpers.md'
json_validation: '{project-root}/.bmad/core/resources/excalidraw/validate-json-instructions.md'
```

**特定领域补充：**

```yaml
# workflows/diagrams/_shared/flowchart-templates.yaml
flowchart:
  start_node:
    type: ellipse
    width: 120
    height: 60
  process_box:
    type: rectangle
    width: 160
    height: 80
  decision_diamond:
    type: diamond
    width: 140
    height: 100
```

### 示例：Presentation Master（创意视觉）

```yaml
# workflows/create-visual-metaphor/workflow.yaml
helpers: '{project-root}/.bmad/core/resources/excalidraw/excalidraw-helpers.md'
json_validation: '{project-root}/.bmad/core/resources/excalidraw/validate-json-instructions.md'
```

**特定领域补充：**

```yaml
# workflows/_shared/creative-templates.yaml
rube_goldberg:
  whimsical_connector:
    type: arrow
    strokeStyle: dashed
    roughness: 2
  playful_box:
    type: rectangle
    roundness: 12
```

## 不属于核心的内容

**特定领域元素：**

- 流程图特定模板（属于 Frame Expert）
- 演示文稿布局（属于 Presentation Master）
- 文档特定样式（属于 Tech Writer）

**Agent 工作流：**

- 如何创建流程图（Frame Expert 工作流）
- 如何创建演示文稿（Presentation Master 工作流）
- 逐步图表创建（Agent 特定）

**主题：**

- 目前在 Agent 工作流中
- **未来：** 将重构为核心作为用户可配置主题

## 架构原则

**单一真相来源：**

- 核心保存通用知识
- Agent 引用核心，不复制
- 核心更新惠及所有 Agent
- Agent 用领域知识进行专业化

**DRY（不要重复自己）：**

- 元素创建逻辑：核心中一次
- 文本宽度计算：核心中一次
- 验证流程：核心中一次
- 箭头绑定模式：核心中一次

## 未来增强

1. **外部库加载器** - 从 libraries.excalidraw.com 加载 .excalidrawlib 文件
2. **主题管理** - 用户可配置的颜色主题保存在核心中
3. **组件库** - 跨 Agent 共享的可复用组件
4. **布局算法** - 用于定位元素的自动布局助手
