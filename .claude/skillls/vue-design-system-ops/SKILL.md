---
name: vue-design-system-ops
description: >
  vue/shadcn-vue 组件库与设计系统的工程化迭代技能。覆盖从需求澄清、架构设计、组件开发、测试、文档到发布的完整生命周期。
  在以下场景必须触发此 skill：用户提到 shadcn-vue 组件开发、UI 组件库维护、设计系统治理、design token、
  组件 API 设计、props/emits/slots 设计、主题系统、可访问性改进、组件一致性检查、monorepo 组件包管理、
  Vue 3 组件库重构、组件文档编写、组件测试策略、发布前检查、breaking changes 评估、
  或任何对 shadcn-vue-ui 项目的功能开发与工程改进需求。即使用户只给出模糊的一句话需求，也应触发此 skill 来
  执行需求澄清和影响分析。也适用于 brainstorming 新组件方案、设计系统一致性审计、以及跨模块重构规划。
---

# Vue Design System Ops

面向 Vue 3 + shadcn-vue 组件库/设计系统项目的工程化迭代技能。
本 skill 将 Claude Code 转变为一个"项目研发操作系统"，能动态编排多 agent 团队，以工程化方式持续推进项目。

## 项目上下文

本 skill 针对以下技术栈的 monorepo 项目：
- Vue 3 (Composition API + `<script setup>`)
- TypeScript 严格模式
- Vite 构建
- Tailwind CSS v4 (oklch 色彩空间)
- Reka UI 无样式原语
- shadcn-vue 源码级组件
- Pinia 状态管理
- VueUse 组合式工具

---

## 一、启动流程

收到任务后，按以下顺序执行：

### 1. 判断任务规模
根据用户输入判断属于哪个级别：
- **S (小)**: 单文件修改、样式微调、typo 修复 → 简版模式
- **M (中)**: 单组件新增/增强、composable 新增、文档补齐 → 标准模式
- **L (大)**: 多组件联动、API 重构、design token 重构 → 深度架构模式
- **探索**: 用户不确定要什么、brainstorm → brainstorm 模式

### 2. 识别需求类型
将用户输入归类为以下一种或多种：
- `component-new`: 新组件开发
- `component-enhance`: 已有组件增强
- `bug-fix`: 缺陷修复
- `design-system`: 设计系统一致性治理
- `accessibility`: 可访问性改进
- `dx-improve`: 开发体验改进
- `docs`: 文档完善
- `test`: 测试补齐
- `perf`: 性能优化
- `build`: 构建链路优化
- `release`: 发布准备
- `refactor`: 重构

### 3. 编排 Agent 团队
根据任务规模和类型选择所需 agent（详见 agents/ 目录）。
不要每次全员出动。典型编排：

| 场景 | 必选 Agent | 可选 Agent |
|------|-----------|-----------|
| S 小修改 | Engineer | Reviewer |
| M 新组件 | PM, UIDesigner, Engineer, QA | Reviewer, Docs |
| L 大重构 | PM, Architect, UIDesigner, Engineer, QA, Reviewer | Docs, Release |
| 探索 | PM, Architect, UIDesigner | Engineer |

### 4. 执行主动扩展检查
在处理用户显式需求之前，必须检查以下扩展维度（阅读 `checklists/proactive-expansion.md`）：
- 基础组件 / 组合组件 / hooks / utils / types 是否需同步更新
- API 一致性：新改动是否与已有组件的 props/emits/slots 命名规范一致
- 样式一致性：是否使用了项目 design token 而非硬编码值
- 可访问性：键盘导航、ARIA 属性、焦点管理是否完备
- 文档 / 示例 / 变更日志是否需要同步更新
- 是否存在可提炼的通用 pattern 或 primitive

---

## 二、Agent 团队

每个 agent 有明确的职责边界。详细角色说明见 `agents/` 目录下对应文件。

### Agent 列表

| Agent | 文件 | 核心职责 |
|-------|------|---------|
| PM | `agents/pm.md` | 需求澄清、用户价值、优先级、验收标准 |
| Architect | `agents/architect.md` | 架构设计、目录结构、边界划分、技术决策 |
| UIDesigner | `agents/ui-designer.md` | 组件 API、一致性、design token、交互语义、a11y |
| Engineer | `agents/engineer.md` | Vue 组件实现、组合式 API、样式、状态、交互 |
| QA | `agents/qa.md` | 测试策略、单测、交互测试、回归检查 |
| Reviewer | `agents/reviewer.md` | 代码评审、风险识别、重构建议、规范校验 |
| Docs | `agents/docs.md` | 组件文档、示例、变更说明、迁移指南 |
| Release | `agents/release.md` | changelog、版本策略、breaking changes、发布检查 |

### Agent 协作规则
1. **顺序依赖**: PM → Architect → UIDesigner → Engineer → QA → Reviewer → Docs → Release
2. **可跳过**: 小任务可跳过 PM/Architect，直接由 Engineer 执行
3. **可回环**: Reviewer 发现问题可打回给 Engineer 或 Architect
4. **可并行**: QA 写测试用例和 Docs 写文档可与 Engineer 编码并行
5. **冲突裁决**: Architect 是技术决策的最终裁决者，UIDesigner 是 API/交互决策的裁决者

---

## 三、工作流

### 工作流 A：标准迭代（适合 M 级常规需求）

```
PM: 需求澄清
  ↓ 输出：需求摘要、验收标准、假设列表
Architect: 方案设计
  ↓ 输出：影响范围、目录结构、技术方案
UIDesigner: API 设计
  ↓ 输出：props/emits/slots 定义、design token 映射、a11y 方案
Engineer: 编码实现
  ↓ 输出：组件代码、types、composables
QA: 测试
  ↓ 输出：测试用例、测试代码
Reviewer: 评审
  ↓ 输出：评审意见、修改建议（如有问题则回环）
Docs: 文档
  ↓ 输出：组件文档、示例代码
Release (如需): 发布建议
  ↓ 输出：changelog 条目、版本建议
```

### 工作流 B：简版执行（适合 S 级小需求）

```
Engineer: 直接实现
  ↓
Reviewer: 快速检查（内联，不单独产出文档）
  ↓
输出：代码变更 + 简要说明
```

### 工作流 C：Brainstorm 模式（适合探索性需求）

```
PM: 梳理目标与约束
  ↓
Architect + UIDesigner: 各出 2-3 种方案
  ↓
多方案比较表（维度：复杂度、一致性、可扩展性、a11y、DX）
  ↓
推荐方案 + 理由
  ↓
用户确认后转入标准迭代
```

### 工作流 D：深度架构（适合 L 级复杂重构/系统设计）

```
PM: 全面需求分析
  ↓
Architect: 现状分析 → 目标架构 → 迁移路径
  ↓
UIDesigner: API 兼容性分析 → breaking changes 清单
  ↓
团队讨论：风险评估、分阶段计划
  ↓
任务拆解（每个子任务可独立走标准迭代）
  ↓
实施顺序（含回滚点）
```

### 工作流 E：模糊模式（用户只给一句话）

```
1. 解析用户意图，补充合理假设
2. 显式列出所有假设，标注置信度
3. 执行主动扩展检查
4. 生成"最小可行方案"和"推荐完整方案"两个版本
5. 请用户确认后执行
```

### 工作流 F：设计系统一致性治理

```
1. 扫描现有组件的 API 模式、命名、token 使用
2. 识别不一致项（命名、props 风格、样式、a11y）
3. 按优先级排列修复项
4. 生成修复计划（每项可独立 PR）
```

### 工作流 G：发布前检查

```
Release: 读取 checklists/release-checklist.md
  ↓ 逐项检查
QA: 回归测试确认
  ↓
Docs: 文档完整性确认
  ↓
输出：发布就绪报告 或 阻塞项清单
```

---

## 四、组件库/设计系统专项检查清单

每次涉及组件变更时，必须执行（阅读 `checklists/component-checklist.md` 获取详细清单）：

### 组件 API 检查
- [ ] props 命名是否遵循项目约定（camelCase，布尔值 is/has 前缀）
- [ ] emits 命名是否遵循 `on-action` 或 `update:modelValue` 模式
- [ ] slots 是否有默认内容和作用域数据
- [ ] variants 是否通过 `variant` prop 而非多个布尔 props 实现
- [ ] 是否暴露必要的 ref/方法供父组件调用

### Design Token 检查
- [ ] 颜色值是否全部使用 CSS 变量（`--primary` 等）而非硬编码
- [ ] 间距是否使用 Tailwind spacing scale
- [ ] 圆角是否使用 `--radius` 基准
- [ ] 字体是否遵循项目 typography scale
- [ ] 暗色模式是否正常（仅通过 token 切换）

### 可访问性检查
- [ ] 语义化 HTML 标签
- [ ] ARIA 角色和属性
- [ ] 键盘导航（Tab、Enter、Escape、方向键）
- [ ] 焦点管理（focus trap、focus restore）
- [ ] 屏幕阅读器文本
- [ ] 颜色对比度（WCAG AA）
- [ ] 减少动效模式（prefers-reduced-motion）

### 一致性检查
- [ ] 与已有相似组件的 API 风格一致
- [ ] 组件目录结构遵循约定
- [ ] 导出方式遵循约定（index.ts 统一导出）
- [ ] 类型定义在独立 types.ts 中

---

## 五、输出模板

根据任务规模使用不同模板。阅读 `templates/` 目录获取完整模板。

### 简版输出（S 级）

```markdown
## 变更摘要
[一句话说明]

## 修改文件
- `path/to/file.vue` — [修改说明]

## 自检
- [x] 类型完整
- [x] 样式使用 token
- [x] 暗色模式正常
```

### 标准输出（M 级）

```markdown
## 需求摘要
[需求描述]

## 假设与待确认项
- [假设1]（置信度：高/中/低）

## 影响范围
- 直接影响：[文件列表]
- 间接影响：[关联模块]

## 方案设计
### 组件 API
[props/emits/slots 设计]

### 实现方案
[技术方案]

## 任务分解
1. [任务1] — 预估：[时间]
2. [任务2] — 预估：[时间]

## 验收标准
- [ ] [标准1]
- [ ] [标准2]

## 扩展建议
- [主动发现的关联工作]

## 下一步
[可直接执行的操作]
```

### Brainstorm 输出

```markdown
## 目标理解
[对用户目标的理解]

## 方案比较

| 维度 | 方案 A | 方案 B | 方案 C |
|------|--------|--------|--------|
| 复杂度 | | | |
| 一致性 | | | |
| 可扩展性 | | | |
| a11y | | | |
| 迁移成本 | | | |

## 推荐方案
[方案X] — 理由：[...]

## 风险
- [风险1]

## 确认后的下一步
[转入标准迭代的入口]
```

### 深度架构输出

```markdown
## 现状分析
[当前架构/代码现状]

## 目标架构
[期望达到的状态]

## Gap 分析
[现状与目标的差距]

## 迁移路径
### 阶段 1: [名称]
- 范围：[...]
- 风险：[...]
- 回滚点：[...]

### 阶段 2: [名称]
...

## Breaking Changes
- [变更1] — 影响范围：[...] — 迁移方式：[...]

## 任务拆解（每个可独立 PR）
1. [任务1]
2. [任务2]

## 时间线建议
[分阶段时间估算]
```

---

## 六、决策原则

### 增量迭代 vs 一次性重构
- 默认选择增量迭代，除非架构层面无法兼容
- 每个增量步骤必须独立可用、可回滚
- 大重构拆分为多个小 PR，每个 PR 有明确的验收标准

### Breaking Changes 处理
- 尽量避免 breaking changes
- 如果不可避免：必须提供迁移指南、废弃警告期、代码 codemod（如可能）
- breaking changes 必须在 changelog 中用 `BREAKING CHANGE` 标记
- 评估影响范围：列出所有受影响的消费者

### 复制/移植 vs 抽象
- 当某个模式出现 2 次时，注意但不急于抽象
- 当出现 3 次时，考虑抽象为共享 primitive
- 抽象前必须验证：3 个用例是否真的有相同的变化方向
- 过早抽象比重复更危险

### 组件粒度
- 单个组件不超过 200 行模板
- 超过时考虑拆分为子组件
- 拆分边界以"独立可测试"为准则
- 通过 slots 和 composables 实现灵活组合

---

## 七、主动扩展策略

当用户只提出局部需求时，按以下优先级检查扩展工作（阅读 `checklists/proactive-expansion.md`）：

1. **类型安全**: 新增/修改的代码是否有完整类型定义
2. **API 一致性**: 新 API 是否与同类组件风格一致
3. **Design Token**: 是否有硬编码样式值应替换为 token
4. **可访问性**: 是否遗漏了 ARIA/键盘/焦点管理
5. **暗色模式**: 变更是否在暗色模式下正常
6. **文档**: 是否需要更新 README、组件文档、示例
7. **测试**: 是否需要新增/更新测试用例
8. **变更日志**: 是否需要记录到 CHANGELOG
9. **依赖检查**: 上下游组件是否受影响
10. **抽象机会**: 是否存在可提炼的通用模式

扩展工作分为两类：
- **必做**: 类型安全、API 一致性、可访问性 → 直接纳入当前任务
- **建议**: 文档、测试、抽象机会 → 列出建议，由用户决定是否纳入

---

## 八、Reference 文件索引

以下 reference 文件提供领域知识，按需阅读：

| 文件 | 何时阅读 |
|------|---------|
| `references/vue-component-patterns.md` | 设计新组件 API、重构组件时 |
| `references/shadcn-vue-conventions.md` | 添加/修改 shadcn-vue 组件时 |
| `references/design-token-system.md` | 涉及样式、主题、颜色时 |
| `references/accessibility-guide.md` | 任何组件变更时（必读摘要部分） |
| `references/testing-strategy.md` | 编写测试时 |
| `references/monorepo-architecture.md` | 跨包变更、依赖管理时 |

---

## 九、项目特定约定

以下约定来自项目 CLAUDE.md 和代码库：

1. **语言**: 代码注释、文档、commit message 用中文；命名用英文
2. **组件目录**: `ComponentName/ComponentName.vue + index.ts + types.ts`
3. **script setup**: 所有组件使用 `<script setup lang="ts">`
4. **组件内部顺序**: 导入 → Props → Emits → 组合式逻辑 → 计算属性 → 方法
5. **Design Token**: 通过 CSS 变量 + oklch 色彩空间，不硬编码颜色
6. **包管理**: Yarn workspaces
7. **Monorepo 结构**: packages/ui（基础组件）、packages/shared（共享层）、子项目各自独立

---

## 十、边界与默认行为

### 本 Skill 不做的事
- 不做与 Vue/前端/组件无关的后端架构设计
- 不做数据库设计
- 不做 CI/CD pipeline 的深度配置（但会检查构建是否通过）
- 不替用户做产品决策（但会提供决策所需的信息）

### 默认行为
- 如果用户没指定工作流，根据任务规模自动选择
- 如果用户没要求文档，在 M/L 级任务中默认建议补充
- 如果检测到可访问性缺陷，即使用户没提也主动报告
- 如果检测到 breaking change 风险，必须主动提醒
- 输出默认使用中文（与项目约定一致）
