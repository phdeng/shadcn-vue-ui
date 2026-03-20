# 2-Plan-Workflows 中文翻译指南

本目录包含第 2 阶段（规划工作流）的完整中文翻译，包括两个核心工作流。

## 📁 目录结构

```
2-plan-workflows-zh/
├── create-ux-design/              # UX 设计工作流
│   ├── workflow.md               # 工作流概览
│   ├── ux-design-template.md     # 设计规范模板
│   └── steps/                    # 14 个工作流步骤
│       ├── step-01-init.md               # 步骤 1: 初始化
│       ├── step-01b-continue.md          # 步骤 1b: 继续
│       ├── step-02-discovery.md          # 步骤 2: 发现
│       ├── step-03-core-experience.md    # 步骤 3: 核心体验
│       ├── step-04-emotional-response.md # 步骤 4: 情感反应
│       ├── step-05-inspiration.md        # 步骤 5: 灵感
│       ├── step-06-design-system.md      # 步骤 6: 设计系统
│       ├── step-07-defining-experience.md# 步骤 7: 定义体验
│       ├── step-08-visual-foundation.md  # 步骤 8: 视觉基础
│       ├── step-09-design-directions.md  # 步骤 9: 设计方向
│       ├── step-10-user-journeys.md      # 步骤 10: 用户旅程
│       ├── step-11-component-strategy.md # 步骤 11: 组件策略
│       ├── step-12-ux-patterns.md        # 步骤 12: UX 模式
│       ├── step-13-responsive-accessibility.md # 步骤 13: 响应式和可访问性
│       └── step-14-complete.md           # 步骤 14: 完成
│
└── prd/                           # 产品需求文档工作流
    ├── workflow.md               # 工作流概览
    ├── prd-template.md          # PRD 模板
    └── steps/                   # 11 个工作流步骤
        └── [step-01-init.md ... step-11-complete.md]
```

## 🎯 工作流概述

### 1️⃣ 创建 UX 设计工作流 (create-ux-design)

**目标**: 通过协作视觉探索和知情决策创建全面的 UX 设计规范。

**核心步骤**:
- 初始化和发现
- 核心体验和情感反应
- 灵感和设计系统定义
- 视觉基础和设计方向
- 用户旅程和组件策略
- UX 模式、响应式和可访问性
- 最终完成和交接

**输出**: UX 设计规范文档 (ux-design-specification.md)

### 2️⃣ PRD 工作流 (prd)

**目标**: 通过产品经理之间的协作逐步发现来创建全面的产品需求文档。

**核心步骤**:
- 初始化和项目发现
- 用户研究和竞争分析
- 功能定义和优先级
- 成功指标和时间表
- 最终审查和交接

**输出**: 产品需求文档 (prd.md)

## 📖 使用说明

### 启动工作流

1. **UX 设计工作流**:
   ```bash
   /bmad:bmm:workflows:create-ux-design
   ```

2. **PRD 工作流**:
   ```bash
   /bmad:bmm:workflows:create-prd
   ```

### 工作流执行原则

1. **顺序执行** - 按步骤顺序进行，不允许跳过
2. **完全阅读** - 执行前阅读整个步骤文件
3. **用户输入** - 等待菜单处的用户选择
4. **状态追踪** - 在前置信息中跟踪完成的步骤
5. **协作发现** - 与利益相关者进行对话式发现

## 🔄 继续工作流

如果您之前启动过工作流但未完成：

1. 工作流自动检测现有文档
2. 加载 `step-01b-continue.md`
3. 恢复工作流状态和上下文
4. 从中断处继续

## 📋 关键概念

| 概念 | 说明 |
|-----|------|
| 微文件架构 | 每个步骤是自包含的文件，有完整的执行规则 |
| 状态追踪 | 前置信息跟踪 `stepsCompleted` 和 `lastStep` |
| 仅追加 | 文档内容按步骤追加，保持历史记录 |
| 协作发现 | AI 作为协调员，用户作为专家，平等合作 |

## 🌐 翻译说明

- ✅ 工作流概览 - 已翻译
- ✅ 核心步骤文件 - 已翻译
- ✅ 关键模板 - 已翻译
- 🔄 所有步骤文件结构保持一致

## 📚 相关文档

- 原始英文版本: `3-solutioning/` 和 `4-implementation/` 目录
- 完整中文翻译: 本目录（2-plan-workflows-zh）
- 项目指南: 项目根目录的 CLAUDE.md

---

**注**: 这些工作流遵循严格的执行规则和步骤结构，以确保有纪律的工作流执行。始终完整阅读每个步骤文件，然后在进行前理解所有指导。
