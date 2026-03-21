# vue-design-system-ops — 完整 Skill 设计方案

---

## 1. 推荐的 Skill 名称（3 个候选）

| 候选 | 说明 | 评价 |
|------|------|------|
| **vue-design-system-ops** | "ops" 暗示持续运营而非一次性动作，"design-system" 明确领域 | ✅ 推荐：专业、可复用、领域明确 |
| vue-component-engineering | 侧重工程化，但缺少"设计系统"视角 | 稍窄，缺少 token/一致性治理含义 |
| shadcn-vue-dev-orchestrator | 绑定 shadcn-vue 品牌名，但过于特定 | 绑定太紧，如果项目演进超出 shadcn-vue 会不适用 |

## 2. 最终推荐名称

**`vue-design-system-ops`**

理由：
- "vue" 明确技术栈
- "design-system" 覆盖组件库 + token + 一致性治理 + 可访问性
- "ops" 表达持续运营、工程化迭代的含义，而非单次开发
- 不绑定 shadcn-vue 品牌名，项目演进时仍适用

---

## 3. 完整 SKILL.md

见 `SKILL.md` 文件（已单独创建）。核心结构：

- 一、启动流程（任务规模判断 → 需求类型识别 → Agent 编排 → 主动扩展检查）
- 二、Agent 团队（8 个角色 + 协作规则）
- 三、工作流（7 种模式：标准/简版/Brainstorm/深度架构/模糊/一致性治理/发布检查）
- 四、组件库专项检查清单
- 五、输出模板（4 种级别）
- 六、决策原则（增量迭代/Breaking Changes/复制vs抽象/组件粒度）
- 七、主动扩展策略（10 项检查，分必做/建议）
- 八、Reference 文件索引
- 九、项目特定约定
- 十、边界与默认行为

---

## 4. Skill 目录结构树

```
vue-design-system-ops/
├── SKILL.md                                # 主入口文件，工作流、编排机制、决策原则
│
├── agents/                                 # Agent 角色定义
│   ├── pm.md                               # 产品策略 — 需求澄清、验收标准
│   ├── architect.md                        # 架构师 — 技术方案、影响范围、依赖
│   ├── ui-designer.md                      # UI 系统设计师 — API 设计、token、a11y
│   ├── engineer.md                         # 前端工程师 — Vue 组件实现
│   ├── qa.md                               # 测试 — 策略、用例、自动化
│   ├── reviewer.md                         # 评审 — 代码审查、风险、规范
│   ├── docs.md                             # 文档 — 组件文档、示例、变更说明
│   └── release.md                          # 发布 — changelog、版本、检查
│
├── references/                             # 领域知识参考文档
│   ├── vue-component-patterns.md           # Vue 3 组件设计模式
│   ├── shadcn-vue-conventions.md           # shadcn-vue 约定与规范
│   ├── design-token-system.md              # Design Token 体系
│   ├── accessibility-guide.md              # 可访问性指南
│   ├── testing-strategy.md                 # 测试策略
│   └── monorepo-architecture.md            # Monorepo 架构
│
├── checklists/                             # 执行检查清单
│   ├── component-checklist.md              # 组件开发检查清单
│   ├── proactive-expansion.md              # 主动扩展检查清单
│   └── release-checklist.md                # 发布前检查清单
│
└── templates/                              # 输出模板
    └── output-templates.md                 # 4 种级别的输出模板（S/M/brainstorm/L）
```

---

## 5. 关键 Reference 文件清单与内容大纲

| 文件 | 核心内容 | 何时读取 |
|------|---------|---------|
| `vue-component-patterns.md` | Props/Emits/Slots 设计模式、Composables 模式、Compound Component、TypeScript 集成、v-model 支持 | 设计新组件 API 或重构时 |
| `shadcn-vue-conventions.md` | 源码级分发理念、与 Reka UI 的关系、组件层级（ui→shared→子项目）、样式约定、定制边界 | 添加/修改基础 UI 组件时 |
| `design-token-system.md` | Token 三层架构、完整颜色 Token 清单、间距/尺寸/排版 scale、动效约定、新增 Token 流程 | 涉及样式/主题/颜色时 |
| `accessibility-guide.md` | 键盘导航模式表、ARIA 属性速查、焦点管理（trap/restore）、颜色对比度、常见错误清单 | 任何组件变更时（必读摘要部分） |
| `testing-strategy.md` | 测试分层金字塔、工具栈、组件/Composable 测试模板、必覆盖场景清单、命名约定 | 编写测试时 |
| `monorepo-architecture.md` | 包结构与依赖方向、"何时放在哪个包"决策表、跨包变更注意事项、Yarn Workspaces 操作 | 跨包变更或新增包时 |

---

## 6. Agent 团队设计

### 总体设计原则
- **按需裁剪**: 不是每个任务都需要全部 8 个 Agent
- **顺序依赖**: PM → Architect → UIDesigner → Engineer → QA → Reviewer → Docs → Release
- **可跳过**: S 级任务跳过 PM/Architect，直接 Engineer + Reviewer
- **可并行**: QA 测试用例 + Docs 文档可与 Engineer 编码并行
- **可回环**: Reviewer 打回给 Engineer，Architect 重新评估

### Agent 编排矩阵

| Agent | S 小修改 | M 新组件 | L 大重构 | 探索 | Bug | 发布 | 一致性治理 |
|-------|---------|---------|---------|------|-----|------|-----------|
| PM | — | ✅ | ✅ | ✅ | 可选 | — | ✅ |
| Architect | — | 可选 | ✅ | ✅ | — | — | ✅ |
| UIDesigner | — | ✅ | ✅ | ✅ | — | — | ✅ |
| Engineer | ✅ | ✅ | ✅ | — | ✅ | — | ✅ |
| QA | — | ✅ | ✅ | — | ✅ | ✅ | — |
| Reviewer | ✅ | ✅ | ✅ | — | ✅ | — | — |
| Docs | — | ✅ | ✅ | — | — | ✅ | — |
| Release | — | — | ✅ | — | — | ✅ | — |

### 冲突裁决机制
- **技术决策冲突**: Architect 最终裁决
- **API/交互决策冲突**: UIDesigner 最终裁决
- **业务/优先级冲突**: PM 最终裁决
- **质量标准冲突**: Reviewer 有一票否决权（error 级必须修改）

### 避免重复劳动机制
1. 每个 Agent 产出后标注"已完成"，下一个 Agent 基于前序产出工作
2. S 级任务不产出独立的分析文档
3. 如果用户已给出清晰的 API 设计，UIDesigner 跳过设计直接确认
4. Lint 能检查的问题不由 Reviewer 重复检查

---

## 7. 默认工作流设计

### 场景覆盖

| 场景 | 工作流 | Agent 阵容 | 预估轮次 |
|------|--------|-----------|---------|
| 新功能需求（明确） | 标准迭代 B | PM→UIDesigner→Engineer→QA→Reviewer→Docs | 1-2 |
| 组件增强 | 标准迭代 B | UIDesigner→Engineer→Reviewer | 1 |
| Bug 修复 | 简版执行 A | Engineer→Reviewer | 1 |
| 大范围重构 | 深度架构 D | PM→Architect→UIDesigner→Engineer→QA→Reviewer→Docs→Release | 多轮 |
| 设计系统一致性治理 | 专项工作流 F | UIDesigner→Engineer→Reviewer | 多轮 |
| 发布前检查 | 发布工作流 G | Release→QA→Docs | 1 |
| Brainstorm | 探索工作流 C | PM→Architect→UIDesigner | 1-2 |
| 一句话需求 | 模糊模式 E | 先澄清，再转入对应工作流 | 2+ |

### 工作流切换规则
- 模糊模式自动升级：澄清后根据规模转入对应工作流
- Brainstorm 收敛后：用户确认方案后转入标准迭代
- 标准迭代中发现范围扩大：可升级为深度架构模式
- 任何工作流中发现 bug：分离出独立的 bug fix 简版流程

---

## 8. 默认输出模板

详见 `templates/output-templates.md`，包含 4 种级别：

| 模板 | 适用 | 核心段落 |
|------|------|---------|
| **简版 A** | S 级 | 变更摘要 + 修改文件 + 自检 |
| **标准 B** | M 级 | 需求摘要 + 假设 + 影响范围 + API 设计 + 任务分解 + 验收标准 + 扩展建议 |
| **Brainstorm C** | 探索 | 目标理解 + 约束 + 多方案比较表 + 推荐方案 |
| **深度架构 D** | L 级 | 现状分析 + 目标架构 + Gap 分析 + 分阶段迁移 + Breaking Changes + 风险矩阵 |

---

## 9. 使用示例

### 示例 1: 新增 Tooltip 组件
```
用户: "我需要给项目加一个 Tooltip 组件"

Skill 触发 → 判断 M 级 → 标准迭代工作流
├─ PM: 澄清需求 — 悬停提示？触发方式？定位？
├─ UIDesigner: API 设计 — content/side/align/delay props, Reka UI TooltipRoot
├─ 主动扩展: 检查 Button/IconButton 等是否需要配套 Tooltip 用法示例
├─ Engineer: 基于 Reka UI 原语实现
├─ QA: 键盘聚焦显示、延迟控制、定位偏移边界
├─ Reviewer: 检查 a11y (role="tooltip", aria-describedby)
└─ Docs: 组件文档 + 常见用法示例
```

### 示例 2: 修复 Button 暗色模式问题
```
用户: "Button 组件在暗色模式下 ghost variant 看不清"

Skill 触发 → 判断 S 级 → 简版执行
├─ Engineer: 检查 ghost variant 的颜色 token 使用，修复为正确的 CSS 变量
├─ 主动扩展: 扫描其他 variant 是否有类似问题
├─ Reviewer: 内联快速检查
└─ 输出: 修改的文件 + 自检结果 + 如果发现其他 variant 问题则列出
```

### 示例 3: 设计系统一致性审计
```
用户: "检查一下项目里所有组件的 API 是否一致"

Skill 触发 → 设计系统一致性治理工作流 F
├─ UIDesigner: 扫描所有组件的 props/emits/slots 模式
├─ 生成不一致项清单（命名、variant 模式、size 枚举）
├─ 按优先级排列修复项（error/warn/info）
├─ 生成修复计划（每项可独立 PR）
└─ 输出: 一致性审计报告 + 修复优先级表 + 估算工作量
```

### 示例 4: 探索 Command Palette 增强
```
用户: "Command Palette 能不能支持更多功能？brainstorm 一下"

Skill 触发 → Brainstorm 模式 C
├─ PM: 梳理 Command Palette 当前能力和用户场景
├─ Architect + UIDesigner:
│   ├─ 方案 A: 文件搜索 + 快捷操作（轻量扩展）
│   ├─ 方案 B: 插件化架构，支持自定义命令注册
│   └─ 方案 C: AI 对话集成，自然语言操作
├─ 比较表（复杂度、一致性、可扩展性）
├─ 推荐方案 + 理由
└─ 用户确认后转入标准迭代
```

### 示例 5: 大范围 Design Token 重构
```
用户: "我想把 Design Token 从分散的 CSS 文件统一到 packages/shared"

Skill 触发 → 判断 L 级 → 深度架构模式 D
├─ PM: 明确目标 — 统一 token 源、消除重复定义、简化主题切换
├─ Architect:
│   ├─ 现状分析 — token 定义散布在哪些文件
│   ├─ 目标架构 — packages/shared/src/design-tokens/ 统一管理
│   ├─ 迁移路径 — 分 3 阶段（收集→统一→清理）
│   └─ 回滚点 — 每个阶段独立可回退
├─ UIDesigner: 检查 token 命名一致性，列出需要合并/重命名的 token
├─ Breaking Changes 清单
├─ 任务拆解（每个可独立 PR）
└─ 输出: 深度架构文档 + 分阶段计划 + 风险矩阵
```

### 示例 6: 一句话模糊需求
```
用户: "Table 不太好用"

Skill 触发 → 模糊模式 E
├─ 解析意图 — "不好用"可能指：API 复杂、功能缺失、性能差、样式问题
├─ 假设列表:
│   ├─ [中] 可能是缺少排序/筛选功能
│   ├─ [中] 可能是 API 太底层，使用体验差
│   ├─ [低] 可能是大数据量性能问题
├─ 提出两个版本:
│   ├─ 最小方案: 先了解具体问题，做针对性修复
│   └─ 推荐方案: 做一次 Table 组件 API 审计 + 功能增强规划
├─ 请用户确认后执行
```

---

## 10. 后续如何继续迭代这个 Skill

### 短期（1-2 周）
1. **与项目实际代码对齐**: 克隆仓库后，根据实际组件清单更新 references 中的具体示例
2. **补充项目专属 token 清单**: 把实际的 CSS 变量值填入 design-token-system.md
3. **添加已有组件 API 快照**: 记录当前 21 个组件的 props/emits/slots，供一致性审计参照

### 中期（1-2 月）
4. **收集常见问题 FAQ**: 在使用过程中积累的高频问题和解决方案
5. **细化 Reka UI 用法参考**: 添加 Reka UI 原语的具体用法示例和项目中的定制模式
6. **增加 E2E 测试指导**: 如项目引入了 Cypress/Playwright，补充 E2E 测试参考
7. **迁移/升级指南模板**: 当需要升级 Vue/Vite/Tailwind 版本时的标准化流程

### 长期
8. **性能优化参考**: 组件懒加载、虚拟滚动、大列表优化等专题
9. **国际化指导**: 如项目需要 i18n 支持
10. **触发率优化**: 根据 skill-creator 的描述优化流程，调整 description 的触发词
11. **与 BMAD 深度集成**: 如果项目的 .bmad 配置演进，同步更新 agent 编排逻辑

### 迭代方法
- 每次使用 skill 后，记录"哪里不够用"或"哪里太冗余"
- 每完成 5-10 次使用后做一次 skill 评审
- Reference 文件随项目演进持续更新
- Agent 定义根据实际协作效果调整（可能合并或拆分角色）
