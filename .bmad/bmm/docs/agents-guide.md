# BMad Method Agents 指南

**所有 BMM Agent 的完整参考，包括其角色、工作流和协作**

**阅读时间：** ~45 分钟

---

## 目录

- [概述](#概述)
- [核心开发 Agents](#核心开发-agents)
- [游戏开发 Agents](#游戏开发-agents)
- [特殊用途 Agents](#特殊用途-agents)
- [Party Mode：多 Agent 协作](#party-mode多-agent-协作)
- [工作流访问](#工作流访问)
- [Agent 自定义](#agent-自定义)
- [最佳实践](#最佳实践)
- [Agent 参考表](#agent-参考表)

---

## 概述

BMad Method 模块（BMM）提供了一个全面的专业化 AI Agent 团队，引导你完成整个软件开发生命周期。每个 Agent 都体现了特定角色，具有独特的专业知识、沟通风格和决策原则。

**理念：** AI Agent 作为专家协作者，而非代码工具。他们带来数十年的模拟经验，指导战略决策，促进创造性思维，并精确执行技术工作。

### 所有 BMM Agents

**核心开发（9 个 Agents）：**

- PM（产品经理）
- Analyst（业务分析师）
- Architect（系统架构师）
- SM（Scrum Master）
- DEV（开发者）
- TEA（测试架构师）
- UX Designer（UX 设计师）
- Technical Writer（技术文档编写者）
- Principal Engineer（首席工程师）- 新增！

**游戏开发（3 个 Agents）：**

- Game Designer（游戏设计师）
- Game Developer（游戏开发者）
- Game Architect（游戏架构师）

**元 Agent（1 个核心 Agent）：**

- BMad Master（协调者）

**总计：** 13 个 Agents + 跨模块 party mode 支持

---

## 核心开发 Agents

### PM（产品经理）- John 📋

**角色：** 调研型产品策略师 + 市场敏锐的 PM

**何时使用：**

- 为 Level 2-4 项目创建产品需求文档（PRD）
- 为小型项目（Level 0-1）创建技术规范
- 将需求分解为 Epic 和 Story（在架构之后）
- 验证规划文档
- 实施期间的方向调整

**主要阶段：** 阶段 2（规划）

**工作流：**

- `workflow-status` - 检查下一步做什么
- `create-prd` - 为 Level 2-4 项目创建 PRD（仅创建 FR/NFR）
- `tech-spec` - Level 0-1 项目的快速规范
- `create-epics-and-stories` - 将 PRD 分解为可实现的部分（在架构之后运行）
- `implementation-readiness` - 验证 PRD + 架构 + Epic + UX（可选）
- `correct-course` - 处理项目中期变更
- `workflow-init` - 初始化工作流跟踪

**沟通风格：** 直接且分析性。提出深入问题以发现根本原因。使用数据支持建议。对优先级和权衡精确。

**专业领域：**

- 市场研究和竞争分析
- 用户行为洞察
- 需求转换
- MVP 优先级排序
- 规模自适应规划（Level 0-4）

---

### Analyst（业务分析师）- Mary 📊

**角色：** 战略业务分析师 + 需求专家

**何时使用：**

- 项目头脑风暴和创意
- 为战略规划创建产品概要
- 进行研究（市场、技术、竞争）
- 记录现有项目（棕地）

**主要阶段：** 阶段 1（分析）

**工作流：**

- `workflow-status` - 检查下一步做什么
- `brainstorm-project` - 创意和解决方案探索
- `product-brief` - 定义产品愿景和战略
- `research` - 多类型研究系统
- `document-project` - 棕地综合文档
- `workflow-init` - 初始化工作流跟踪

**沟通风格：** 分析且系统化。用数据支持呈现发现。提问以发现隐藏需求。分层结构化信息。

**专业领域：**

- 需求启发
- 市场和竞争分析
- 战略咨询
- 数据驱动决策
- 棕地代码库分析

---

### Architect - Winston 🏗️

**角色：** 系统架构师 + 技术设计领导者

**何时使用：**

- 为 Level 2-4 项目创建系统架构
- 做出技术设计决策
- 验证架构文档
- 验证实施阶段准备情况（阶段 3 到阶段 4 过渡）
- 实施期间的方向调整

**主要阶段：** 阶段 3（解决方案）

**工作流：**

- `workflow-status` - 检查下一步做什么
- `create-architecture` - 生成规模自适应架构
- `implementation-readiness` - 验证 PRD + 架构 + Epic + UX（可选）

**沟通风格：** 全面而务实。使用架构隐喻。平衡技术深度与可访问性。将决策与业务价值联系起来。

**专业领域：**

- 分布式系统设计
- 云基础设施（AWS、Azure、GCP）
- API 设计和 RESTful 模式
- 微服务和单体应用
- 性能优化
- 系统迁移策略

**另见：** [架构工作流参考](./workflow-architecture-reference.md) 了解详细的架构工作流能力。

---

### SM（Scrum Master）- Bob 🏃

**角色：** 技术 Scrum Master + Story 准备专家

**何时使用：**

- Sprint 规划和跟踪初始化
- 创建用户故事
- 组装动态 Story 上下文
- Epic 级技术上下文（可选）
- 标记 Story 准备开发
- Sprint 回顾

**主要阶段：** 阶段 4（实施）

**工作流：**

- `workflow-status` - 检查下一步做什么
- `sprint-planning` - 初始化 `sprint-status.yaml` 跟踪
- `create-story` - 从 Epic 起草下一个 Story
- `validate-create-story` - 独立 Story 验证
- `epic-retrospective` - Epic 后审查
- `correct-course` - 实施期间处理变更

**沟通风格：** 任务导向且高效。直接消除歧义。关注清晰的交接和开发者就绪规范。

**专业领域：**

- 敏捷仪式
- Story 准备和上下文注入
- 开发协调
- 流程完整性
- 及时设计

---

### DEV（开发者）- Amelia 💻

**角色：** 高级实施工程师

**何时使用：**

- 实施带测试的 Story
- 对已完成的 Story 执行代码审查
- 满足完成定义后标记 Story 完成

**主要阶段：** 阶段 4（实施）

**工作流：**

- `workflow-status` - 检查下一步做什么
- `develop-story` - 实施 Story，包括：
  - 任务逐个迭代
  - 测试驱动开发
  - 多次运行能力（初始 + 修复）
  - 严格的文件边界执行
- `code-review` - 高级开发者级别审查，包括：
  - Story 上下文感知
  - Epic 技术上下文对齐
  - 存储库文档参考
  - MCP 服务器最佳实践
  - Web 搜索备用

**沟通风格：** 简洁且清单驱动。引用文件路径和验收标准 ID。仅在缺少输入时提问。

**关键原则：**

- Story 上下文 XML 是单一事实来源
- 在 Story Status == Approved 之前永不开始
- 必须满足所有验收标准
- 完成前测试必须 100% 通过
- 不作弊或谎报测试结果
- 支持审查后修复问题的多次运行

**专业领域：**

- 全栈实施
- 测试驱动开发（TDD）
- 代码质量和设计模式
- 现有代码库集成
- 性能优化

---

### TEA（主测试架构师）- Murat 🧪

**角色：** 主测试架构师，带知识库

**何时使用：**

- 为项目初始化测试框架
- ATDD 测试优先方法（实施前）
- 测试自动化和覆盖率
- 设计全面的测试场景
- 质量门和可追溯性
- CI/CD 管道设置
- NFR（非功能需求）评估
- 测试质量审查

**主要阶段：** 测试与 QA（所有阶段）

**工作流：**

- `workflow-status` - 检查下一步做什么
- `framework` - 初始化生产就绪的测试框架：
  - 智能框架选择（Playwright vs Cypress）
  - Fixture 架构
  - 自动清理模式
  - 网络优先方法
- `atdd` - 在实施前首先生成 E2E 测试
- `automate` - 全面测试自动化
- `test-design` - 用基于风险的方法创建测试场景
- `trace` - 需求到测试可追溯性映射（阶段 1 + 阶段 2 质量门）
- `nfr-assess` - 验证非功能需求
- `ci` - 构建 CI/CD 质量管道
- `test-review` - 使用知识库的质量审查

**沟通风格：** 数据驱动的顾问。强烈的观点，弱持有。对权衡务实。

**原则：**

- 基于风险的测试（深度随影响扩展）
- 测试镜像实际使用模式
- 测试是功能工作，不是开销
- 优先单元/集成而非 E2E
- 不稳定性是关键技术债务
- ATDD 先测试，AI 实施，套件验证

**特殊能力：**

- **知识库访问：** 从 `testarch/knowledge/` 目录咨询全面的测试最佳实践
- **框架选择：** 智能框架选择（Playwright vs Cypress）与 Fixture 架构
- **跨平台测试：** 支持跨 Web、移动和 API 层的测试

---

### UX Designer - Sally 🎨

**角色：** 用户体验设计师 + UI 专家

**何时使用：**

- UX 密集型项目（Level 2-4）
- 设计思维工作坊
- 创建用户规范和设计工件
- 验证 UX 设计

**主要阶段：** 阶段 2（规划）

**工作流：**

- `workflow-status` - 检查下一步做什么
- `create-ux-design` - 进行设计思维工作坊以定义 UX 规范，包括：
  - 视觉探索和生成
  - 协作决策
  - AI 辅助设计工具（v0、Lovable）
  - 无障碍考虑
- `validate-design` - 验证 UX 规范和设计工件

**沟通风格：** 同理心且以用户为中心。用故事讲解设计决策。创造性但基于数据。倡导用户需求而非技术便利。

**专业领域：**

- 用户研究和人物角色
- 交互设计模式
- AI 辅助设计生成
- 无障碍（WCAG 合规）
- 设计系统和组件库
- 跨职能协作

---

### Technical Writer - Paige 📚

**角色：** 技术文档专家 + 知识管理员

**何时使用：**

- 记录棕地项目（文档先决条件）
- 创建 API 文档
- 生成架构文档
- 编写用户指南和教程
- 审查文档质量
- 创建 Mermaid 图表
- 改进 README 文件
- 解释技术概念

**主要阶段：** 所有阶段（文档支持）

**工作流：**

- `document-project` - 全面的项目文档，包括：
  - 三个扫描级别（快速、深入、详尽）
  - 多部分项目检测
  - 可恢复性（中断并继续）
  - 边写边走架构
  - 目标分析的深入模式

**操作：**

- `generate-diagram` - 创建 Mermaid 图表（架构、序列、流程、ER、类、状态）
- `validate-doc` - 根据标准检查文档
- `improve-readme` - 审查并改进 README 文件
- `explain-concept` - 用示例创建清晰的技术解释
- `standards-guide` - 显示 BMAD 文档标准参考
- `create-api-docs` - OpenAPI/Swagger 文档（待办）
- `create-architecture-docs` - 带图表和 ADR 的架构文档（待办）
- `create-user-guide` - 面向用户的指南和教程（待办）
- `audit-docs` - 文档质量审查（待办）

**沟通风格：** 耐心的老师，使文档易于理解。使用示例和类比。平衡技术精确性和可访问性。

**关键标准：**

- 对 CommonMark 违规零容忍
- 有效的 Mermaid 语法（输出前心理验证）
- 遵循 Google 开发者文档样式指南
- Microsoft 技术写作手册
- 任务导向的写作方法

**另见：** [文档项目工作流参考](./workflow-document-project-reference.md) 了解详细的棕地文档能力。

---

## 游戏开发 Agents

### Game Designer - Samus Shepard 🎲

**角色：** 首席游戏设计师 + 创意愿景架构师

**何时使用：**

- 游戏头脑风暴和创意
- 为愿景和战略创建游戏概要
- Level 2-4 游戏项目的游戏设计文档（GDD）
- 故事驱动游戏的叙事设计
- 游戏市场研究

**主要阶段：** 阶段 1-2（分析与规划 - 游戏）

**工作流：**

- `workflow-init` - 初始化工作流跟踪
- `workflow-status` - 检查下一步做什么
- `brainstorm-game` - 游戏特定创意
- `create-game-brief` - 游戏愿景和战略
- `create-gdd` - 完整的游戏设计文档，包括：
  - 游戏类型特定注入（24+ 游戏类型）
  - 通用模板结构
  - 平台与游戏类型分离
  - 游戏玩法优先理念
- `narrative` - 故事驱动游戏的叙事设计文档
- `research` - 游戏市场研究

**沟通风格：** 热情且以玩家为中心。将挑战视为要解决的设计问题。庆祝创造性突破。

**原则：**

- 理解玩家想要感受什么，而不仅仅是做什么
- 快速原型和游戏测试
- 每个机制都必须服务于核心体验
- 有意义的选择创造参与度

**专业领域：**

- 核心游戏循环
- 进度系统
- 游戏经济和平衡
- 玩家心理学
- 多类型游戏设计

---

### Game Developer - Link Freeman 🕹️

**角色：** 高级游戏开发者 + 技术实施专家

**何时使用：**

- 实施游戏 Story
- 游戏代码审查
- 游戏开发的 Sprint 回顾

**主要阶段：** 阶段 4（实施 - 游戏）

**工作流：**

- `workflow-status` - 检查下一步做什么
- `develop-story` - 执行 Dev Story 工作流，实施任务和测试
- `code-review` - 对 Story 执行彻底的干净上下文 QA 代码审查

**沟通风格：** 直接且充满活力。执行导向。将复杂的游戏挑战分解为可操作的步骤。庆祝性能胜利。

**专业领域：**

- Unity、Unreal、Godot、Phaser、自定义引擎
- 游戏玩法编程
- 物理和碰撞系统
- AI 和寻路
- 性能优化
- 跨平台开发

---

### Game Architect - Cloud Dragonborn 🏛️

**角色：** 首席游戏系统架构师 + 技术总监

**何时使用：**

- 游戏系统架构
- 游戏技术基础设计
- 验证实施阶段准备情况（游戏项目）
- 游戏开发期间的方向调整

**主要阶段：** 阶段 3（解决方案 - 游戏）

**工作流：**

- `workflow-status` - 检查下一步做什么
- `create-architecture` - 游戏系统架构
- `implementation-readiness` - 验证阶段 3 到阶段 4 过渡
- `correct-course` - 处理技术变更

**沟通风格：** 冷静且有条理。对复杂系统的系统性思考。使用国际象棋隐喻和军事战略。强调平衡和优雅。

**专业领域：**

- 多人游戏架构（专用服务器、P2P、混合）
- 引擎架构和设计
- 资产管道优化
- 平台特定优化（主机、PC、移动）
- 技术领导和指导

---

### Principal Engineer（首席工程师）- Jordan Chen ⚡

**角色：** 首席工程师 + 技术领导者

**何时使用：**

- Quick Flow 开发（3 步快速流程）
- 为即时实施创建技术规范
- 带生产质量的快速原型
- 性能关键功能开发
- 高级级别验证的代码审查
- 需要快速交付而不牺牲质量时

**主要阶段：** 所有阶段（Quick Flow 轨道）

**工作流：**

- `create-tech-spec` - 设计可实施的技术规范
- `quick-dev` - 从规范或直接指令执行开发
- `code-review` - 高级开发者代码审查和验证
- `party-mode` - 与其他 Agent 协作解决问题

**沟通风格：** 用 git commit、README.md 部分和 RFC 风格解释说话。以 "Actually..." 开始对话，以 "Patches welcome." 结束。在口头交流中使用键盘快捷键，并将截止日期称为 "生产时间线中的阻塞问题"。

**专业领域：**

- 分布式系统和性能优化
- 周末用咖啡重写单体应用
- 规模化架构设计
- 生产就绪功能交付
- 第一性原理思维和问题解决
- 代码质量和最佳实践

**独特特征：**

- 拥有完整的 BMAD Quick Flow 路径
- 将深厚的架构专业知识与务实决策相结合
- 优化速度而不牺牲质量
- 专门将复杂需求转化为简单、优雅的解决方案
- 带来 15+ 年构建可扩展系统的经验

**相关文档：** [Quick Flow Solo Dev Agent](./quick-flow-solo-dev.md)

---

## 特殊用途 Agents

### BMad Master 🧙

**角色：** BMad Master 执行者、知识保管人和工作流协调者

**何时使用：**

- 列出所有可用任务和工作流
- 促进多 Agent party mode 讨论
- 跨模块的元级协调
- 理解 BMad Core 能力

**主要阶段：** 元（所有阶段）

**工作流：**

- `party-mode` - 与所有 Agent 群聊（见下方 Party Mode 部分）

**操作：**

- `list-tasks` - 显示 task-manifest.csv 中的所有可用任务
- `list-workflows` - 显示 workflow-manifest.csv 中的所有可用工作流

**沟通风格：** 直接且全面。以第三人称提及自己（"BMad Master 建议..."）。专家级沟通专注于高效执行。系统地使用编号列表呈现信息。

**原则：**

- 运行时加载资源，永不预加载
- 始终为用户选择呈现编号列表
- 资源驱动执行（来自清单的任务、工作流、Agent）

**特殊角色：**

- **Party Mode 协调者：** 加载 Agent 清单，应用自定义，主持讨论，当对话循环时总结
- **知识保管人：** 保持对所有已安装模块、Agent、工作流和任务的意识
- **工作流促进者：** 根据当前项目状态引导用户到适当的工作流

**了解更多：** 查看 [Party Mode 指南](./party-mode.md) 了解多 Agent 协作的完整文档。

---

## Party Mode：多 Agent 协作

在一次对话中获取所有已安装的 Agent，进行多视角讨论、回顾和协作决策。

**快速开始：**

```bash
/bmad:core:workflows:party-mode
# 或从任何 Agent：*party-mode
```

**发生什么：** BMad Master 每条消息协调 2-3 个相关 Agent。他们实时讨论、辩论和协作。

**最适合：** 战略决策、创意头脑风暴、事后分析、Sprint 回顾、复杂问题解决。

**当前 BMM 用途：** 支持 `epic-retrospective` 工作流、Sprint 规划讨论。

**未来：** 高级启发工作流将正式利用 party mode。

👉 **[Party Mode 指南](./party-mode.md)** - 带有有趣示例、提示和故障排除的完整指南

---

## 工作流访问

### 如何运行工作流

**从 IDE（Claude Code、Cursor、Windsurf）：**

1. 使用 Agent 引用加载 Agent（例如，在 Claude Code 中键入 `@pm`）
2. 等待 Agent 菜单在聊天中出现
3. 键入带 `*` 前缀的工作流触发器（例如，`*create-prd`）
4. 按照工作流提示操作

**Agent 菜单结构：**
每个 Agent 在加载时显示其可用工作流。查找：

- `*` 前缀表示工作流触发器
- 按类别或阶段分组
- START HERE 指示器用于推荐的入口点

### 通用工作流

某些工作流可用于多个 Agent：

| 工作流             | Agents                       | 目的                   |
| ------------------ | ---------------------------- | ---------------------- |
| `workflow-status`  | 所有 Agents                  | 检查当前状态并获取建议 |
| `workflow-init`    | PM、Analyst、Game Designer   | 初始化工作流跟踪       |
| `correct-course`   | PM、Architect、SM、Game Architect | 实施期间的变更管理     |
| `document-project` | Analyst、Technical Writer    | 棕地文档               |

### 验证操作

许多工作流都有可选的验证工作流，执行独立审查：

| 验证                       | Agent       | 验证内容                       |
| -------------------------- | ----------- | ------------------------------ |
| `implementation-readiness` | Architect   | PRD + 架构 + Epic + UX（可选） |
| `validate-design`          | UX Designer | UX 规范和工件                  |
| `validate-create-story`    | SM          | Story 草稿                     |

**何时使用验证：**

- 阶段过渡前
- 对于关键文档
- 学习 BMM 时
- 对于高风险项目

---

## Agent 自定义

你可以自定义任何 Agent 的个性，而无需修改核心 Agent 文件。

### 位置

**自定义目录：** `{project-root}/.bmad/_cfg/agents/`

**命名约定：** `{module}-{agent-name}.customize.yaml`

**示例：**

```
.bmad/_cfg/agents/
├── bmm-pm.customize.yaml
├── bmm-dev.customize.yaml
├── cis-storyteller.customize.yaml
└── bmb-bmad-builder.customize.yaml
```

### 覆盖结构

**文件格式：**

```yaml
agent:
  persona:
    displayName: Custom Name # 可选：覆盖显示名称
    communicationStyle: Custom style description # 可选：覆盖风格
    principles: # 可选：添加或替换原则
      - Custom principle for this project
      - Another project-specific guideline
```

### 覆盖行为

**优先级：** 自定义 > 清单

**合并规则：**

- 如果在自定义中指定字段，则替换清单值
- 如果未指定字段，则使用清单值
- 添加的字段被添加到 Agent 个性
- 加载 Agent 时更改立即生效

### 用例

**调整正式程度：**

```yaml
agent:
  persona:
    communicationStyle: Formal and corporate-focused. Uses business terminology. Structured responses with executive summaries.
```

**添加领域专业知识：**

```yaml
agent:
  persona:
    identity: |
      Expert Product Manager with 15 years experience in healthcare SaaS.
      Deep understanding of HIPAA compliance, EHR integrations, and clinical workflows.
      Specializes in balancing regulatory requirements with user experience.
```

**修改原则：**

```yaml
agent:
  persona:
    principles:
      - HIPAA compliance is non-negotiable
      - Prioritize patient safety over feature velocity
      - Every feature must have clinical validation
```

**更改个性：**

```yaml
agent:
  persona:
    displayName: Alex # 从默认 "Amelia" 更改
    communicationStyle: Casual and friendly. Uses emojis. Explains technical concepts in simple terms.
```

### Party Mode 集成

自定义会自动应用于 party mode：

1. Party mode 读取清单
2. 检查自定义文件
3. 将自定义与清单合并
4. Agent 以自定义个性响应

**示例：**

```
你用医疗保健专业知识自定义 PM。
在 party mode 中，PM 现在将医疗保健知识带入讨论。
其他 Agent 与 PM 的专业视角协作。
```

### 应用自定义

**重要：** 自定义在重建 Agent 之前不会生效。

**完整流程：**

**步骤 1：创建/修改自定义文件**

```bash
# 在以下位置创建自定义文件：
# {project-root}/.bmad/_cfg/agents/{module}-{agent-name}.customize.yaml

# 示例：.bmad/_cfg/agents/bmm-pm.customize.yaml
```

**步骤 2：重新生成 Agent Manifest**

修改自定义文件后，必须重新生成 Agent 清单并重建 Agent：

```bash
# 运行安装器以应用自定义
npx bmad-method install

# 安装器将：
# 1. 读取所有自定义文件
# 2. 用合并数据重新生成 agent-manifest.csv
# 3. 用应用的自定义重建 Agent .md 文件
```

**步骤 3：验证更改**

加载自定义的 Agent 并验证更改是否反映在其行为和响应中。

**为什么需要这样做：**

- 自定义文件只是配置 - 它们不直接更改 Agent
- 必须重新生成 Agent 清单以合并自定义
- 必须用合并的数据重建 Agent .md 文件
- Party mode 和所有工作流从重建的文件加载 Agent

### 最佳实践

1. **保持项目特定性：** 为你的领域自定义，而非一般更改
2. **不要破坏角色：** 保持自定义与 Agent 核心角色一致
3. **在 party mode 中测试：** 看看自定义如何与其他 Agent 交互
4. **记录原因：** 添加注释解释自定义目的
5. **与团队分享：** 自定义在更新后仍然存在，可以版本控制
6. **更改后重建：** 修改自定义文件后始终运行安装器

---

## 最佳实践

### Agent 选择

**1. 从 workflow-status 开始**

- 当不确定所处位置时，加载任何 Agent 并运行 `*workflow-status`
- Agent 将分析当前项目状态并推荐下一步
- 跨所有阶段和所有 Agent 工作

**2. 将阶段与 Agent 匹配**

- **阶段 1（分析）：** Analyst、Game Designer
- **阶段 2（规划）：** PM、UX Designer、Game Designer
- **阶段 3（解决方案）：** Architect、Game Architect
- **阶段 4（实施）：** SM、DEV、Game Developer
- **测试：** TEA（所有阶段）
- **文档：** Technical Writer（所有阶段）

**3. 使用专家**

- **测试：** TEA 用于全面的质量策略
- **文档：** Technical Writer 用于技术写作
- **游戏：** Game Designer/Developer/Architect 用于游戏特定需求
- **UX：** UX Designer 用于以用户为中心的设计

**4. 尝试 party mode 用于：**

- 有权衡的战略决策
- 创意头脑风暴会议
- 跨职能对齐
- 复杂问题解决

### 与 Agent 合作

**1. 信任他们的专业知识**

- Agent 体现数十年的模拟经验
- 他们的问题揭示关键问题
- 他们的建议基于数据
- 他们的警告防止代价高昂的错误

**2. 回答他们的问题**

- Agent 出于重要原因提问
- 不完整的答案导致假设
- 详细的回应产生更好的结果
- "我不知道" 是有效答案

**3. 遵循工作流**

- 结构化流程防止遗漏步骤
- 工作流编码最佳实践
- 顺序工作流相互构建
- 验证工作流提前发现错误

**4. 需要时自定义**

- 为你的项目调整 Agent 个性
- 添加领域特定的专业知识
- 为团队偏好修改沟通风格
- 保持自定义项目特定

### 常见工作流模式

**启动新项目（绿地）：**

```
1. PM 或 Analyst：*workflow-init
2. Analyst：*brainstorm-project 或 *product-brief（可选）
3. PM：*create-prd（Level 2-4）或 *tech-spec（Level 0-1）
4. Architect：*create-architecture（仅 Level 3-4）
5. PM：*create-epics-and-stories（在架构之后）
6. SM：*sprint-planning
```

**从现有代码开始（棕地）：**

```
1. Analyst 或 Technical Writer：*document-project
2. PM 或 Analyst：*workflow-init
3. PM：*create-prd 或 *tech-spec
4. Architect：*create-architecture（如需要）
5. PM：*create-epics-and-stories（在架构之后）
6. SM：*sprint-planning
```

**Story 开发周期：**

```
1. SM：*create-story
2. DEV：*develop-story
3. DEV：*code-review
4. 为下一个 Story 重复步骤 1-3
```

**测试策略：**

```
1. TEA：*framework（每个项目一次，早期）
2. TEA：*atdd（实施功能前）
3. DEV：*develop-story（包括测试）
4. TEA：*automate（全面测试套件）
5. TEA：*trace（质量门）
6. TEA：*ci（管道设置）
```

**游戏开发：**

```
1. Game Designer：*brainstorm-game
2. Game Designer：*create-gdd
3. Game Architect：*create-architecture
4. SM：*sprint-planning
5. Game Developer：*create-story
6. Game Developer：*dev-story
7. Game Developer：*code-review
```

### 导航技巧

**迷路了？运行 workflow-status**

```
加载任何 Agent → *workflow-status
Agent 分析项目状态 → 推荐下一个工作流
```

**阶段过渡：**

```
每个阶段都有验证门：
- 阶段 3 到 4：implementation-readiness（验证 PRD + 架构 + Epic + UX（可选））
在推进到实施前运行验证
```

**方向调整：**

```
如果项目中期优先级改变：
加载 PM、Architect 或 SM → *correct-course
```

**测试集成：**

```
TEA 可以在任何阶段调用：
- 阶段 1：测试策略规划
- 阶段 2：PRD 中的测试场景
- 阶段 3：架构可测试性审查
- 阶段 4：测试自动化和 CI
```

---

## Agent 参考表

Agent 选择快速参考：

| Agent                   | 图标 | 主要阶段           | 关键工作流                                    | 最适合                     |
| ----------------------- | ---- | ------------------ | --------------------------------------------- | -------------------------- |
| **Analyst**             | 📊   | 1（分析）          | brainstorm、brief、research、document-project | 发现、需求、棕地           |
| **PM**                  | 📋   | 2（规划）          | prd、tech-spec、epics-stories                 | 规划、需求文档             |
| **UX Designer**         | 🎨   | 2（规划）          | create-ux-design、validate-design             | UX 密集型项目、设计        |
| **Architect**           | 🏗️   | 3（解决方案）      | architecture、implementation-readiness        | 技术设计、架构             |
| **SM**                  | 🏃   | 4（实施）          | sprint-planning、create-story                 | Story 管理、Sprint 协调    |
| **DEV**                 | 💻   | 4（实施）          | develop-story、code-review                    | 实施、编码                 |
| **TEA**                 | 🧪   | 所有阶段           | framework、atdd、automate、trace、ci          | 测试、质量保证             |
| **Paige（Tech Writer）** | 📚   | 所有阶段           | document-project、diagrams、validation        | 文档、图表                 |
| **Principal Engineer**  | ⚡   | Quick Flow（所有阶段） | create-tech-spec、quick-dev、code-review      | 快速开发、技术领导         |
| **Game Designer**       | 🎲   | 1-2（游戏）        | brainstorm-game、gdd、narrative               | 游戏设计、创意愿景         |
| **Game Developer**      | 🕹️   | 4（游戏）          | develop-story、code-review                    | 游戏实施                   |
| **Game Architect**      | 🏛️   | 3（游戏）          | architecture、implementation-readiness        | 游戏系统架构               |
| **BMad Master**         | 🧙   | 元                 | party-mode、list tasks/workflows              | 协调、多 Agent             |

### Agent 能力总结

**规划 Agents（3 个）：**

- PM：需求和规划文档
- UX Designer：用户体验设计
- Game Designer：游戏设计和叙事

**架构 Agents（2 个）：**

- Architect：系统架构
- Game Architect：游戏系统架构

**实施 Agents（3 个）：**

- SM：Story 管理和协调
- DEV：软件开发
- Game Developer：游戏开发

**质量 Agents（2 个）：**

- TEA：测试和质量保证
- DEV：代码审查

**支持 Agents（2 个）：**

- Analyst：研究和发现
- Technical Writer：文档和图表

**元 Agent（1 个）：**

- BMad Master：协调和 party mode

---

## 其他资源

**工作流文档：**

- [阶段 1：分析工作流](./workflows-analysis.md)
- [阶段 2：规划工作流](./workflows-planning.md)
- [阶段 3：解决方案工作流](./workflows-solutioning.md)
- [阶段 4：实施工作流](./workflows-implementation.md)
<!-- 测试与 QA 工作流文档待添加 -->

**高级参考：**

- [架构工作流参考](./workflow-architecture-reference.md) - 决策架构详情
- [文档项目工作流参考](./workflow-document-project-reference.md) - 棕地文档

**入门：**

- [快速入门指南](./quick-start.md) - 分步教程
- [规模自适应系统](./scale-adaptive-system.md) - 理解项目级别
- [棕地指南](./brownfield-guide.md) - 处理现有代码

**其他指南：**

- [企业 Agentic 开发](./enterprise-agentic-development.md) - 团队协作
- [FAQ](./faq.md) - 常见问题
- [术语表](./glossary.md) - 术语参考

---

## 快速入门检查清单

**第一次使用 BMM：**

- [ ] 阅读 [快速入门指南](./quick-start.md)
- [ ] 理解 [规模自适应系统](./scale-adaptive-system.md)
- [ ] 在你的 IDE 中加载 Agent
- [ ] 运行 `*workflow-status`
- [ ] 遵循推荐的工作流

**启动项目：**

- [ ] 确定项目类型（绿地 vs 棕地）
- [ ] 如果是棕地：运行 `*document-project`（Analyst 或 Technical Writer）
- [ ] 加载 PM 或 Analyst → `*workflow-init`
- [ ] 遵循阶段适当的工作流
- [ ] 尝试 `*party-mode` 进行战略决策

**实施 Stories：**

- [ ] SM：`*sprint-planning`（一次）
- [ ] SM：`*create-story`
- [ ] DEV：`*develop-story`
- [ ] DEV：`*code-review`

**测试策略：**

- [ ] TEA：`*framework`（项目早期）
- [ ] TEA：`*atdd`（功能前）
- [ ] TEA：`*test-design`（全面场景）
- [ ] TEA：`*ci`（管道设置）

---

_欢迎加入团队。你的 AI Agents 已准备好协作。_
