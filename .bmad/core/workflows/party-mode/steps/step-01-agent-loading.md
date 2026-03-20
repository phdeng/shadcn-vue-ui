# 步骤 1：Agent 加载和派对模式初始化

## 强制执行规则（先阅读）：

- ✅ 你是派对模式协调者，而不仅仅是工作流执行器
- 🎯 为多 Agent 协作创建引人入胜的氛围
- 📋 从清单加载包含合并人格的完整 Agent 名册
- 🔍 解析 Agent 数据用于对话编排
- 💬 介绍多样化的 Agent 样本以启动讨论

## 执行协议：

- 🎯 在呈现派对激活之前显示 Agent 加载过程
- ⚠️ 在 Agent 名册加载后呈现 [C] 继续选项
- 💾 仅在用户选择 C（继续）时保存
- 📖 在加载下一步之前更新 frontmatter `stepsCompleted: [1]`
- 🚫 禁止在选择 C 之前开始对话

## 上下文边界：

- Agent 清单 CSV 可在 `{project-root}/.bmad/_cfg/agent-manifest.csv` 获取
- config.yaml 中的用户配置已加载并解析
- 派对模式是独立的交互式工作流
- 所有 Agent 数据可用于对话编排

## 你的任务：

从清单加载完整的 Agent 名册，并通过引人入胜的介绍初始化派对模式。

## Agent 加载序列：

### 1. 加载 Agent 清单

开始 Agent 加载过程：

"现在正在使用我们完整的 BMAD Agent 名册初始化**派对模式**！让我加载所有我们才华横溢的 Agent，让他们准备好进行精彩的协作讨论。

**Agent 清单加载中：**"

从 `{project-root}/.bmad/_cfg/agent-manifest.csv` 加载并解析 Agent 清单 CSV

### 2. 提取 Agent 数据

解析 CSV 以提取每个条目的完整 Agent 信息：

**Agent 数据点：**

- **name**（用于系统调用的 Agent 标识符）
- **displayName**（用于对话的 Agent 人格名称）
- **title**（正式职位和角色描述）
- **icon**（视觉标识符 emoji）
- **role**（能力和专业知识摘要）
- **identity**（背景和专业化细节）
- **communicationStyle**（他们如何沟通和表达自己）
- **principles**（决策哲学和价值观）
- **module**（来源模块组织）
- **path**（文件位置引用）

### 3. 构建 Agent 名册

创建包含合并人格的完整 Agent 名册：

**名册构建过程：**

- 将清单数据与 Agent 文件配置合并
- 合并人格特征、能力和沟通风格
- 验证 Agent 可用性和配置完整性
- 按专业领域组织 Agent 以进行智能选择

### 4. 派对模式激活

生成热情的派对模式介绍：

"🎉 派对模式已激活！🎉

欢迎 {{user_name}}！我很高兴能与我们完整的 BMAD 团队一起协调一场精彩的多 Agent 讨论。我们所有的专业 Agent 都已上线，准备好协作，为你想要探索的任何话题带来他们独特的专业知识和视角。

**我们的协作 Agent 包括：**

[展示 3-4 个多样化的 Agent 以展示多样性]：

- [图标 Emoji] **[Agent 名称]**（[职位]）：[简要角色描述]
- [图标 Emoji] **[Agent 名称]**（[职位]）：[简要角色描述]
- [图标 Emoji] **[Agent 名称]**（[职位]）：[简要角色描述]

**[总数] 个 Agent** 已准备好贡献他们的专业知识！

**你今天想和团队讨论什么？**"

### 5. 呈现继续选项

在 Agent 加载和介绍之后：

"**Agent 名册加载成功！** 我们所有的 BMAD 专家都很高兴与你协作。

**准备好开始讨论了吗？**
[C] 继续 - 开始多 Agent 对话

### 6. 处理继续选择

#### 如果选择 'C'（继续）：

- 更新 frontmatter：`stepsCompleted: [1]`
- 设置 `agents_loaded: true` 和 `party_active: true`
- 加载：`./step-02-discussion-orchestration.md`

## 成功指标：

✅ Agent 清单成功加载并解析
✅ 构建了包含合并人格的完整 Agent 名册
✅ 创建了引人入胜的派对模式介绍
✅ 为用户展示了多样化的 Agent 样本
✅ [C] 继续选项正确呈现和处理
✅ Frontmatter 更新了 Agent 加载状态
✅ 正确路由到讨论编排步骤

## 失败模式：

❌ 无法加载或解析 Agent 清单 CSV
❌ Agent 数据提取或名册构建不完整
❌ 派对模式介绍通用或无吸引力
❌ 未展示多样化的 Agent 能力
❌ 加载后未呈现 [C] 继续选项
❌ 未经用户选择就开始对话

## Agent 加载协议：

- 验证 CSV 格式和必需列
- 优雅处理缺失或不完整的 Agent 条目
- 将清单与实际 Agent 文件交叉引用
- 准备 Agent 选择逻辑以进行智能对话路由
- 为每个 Agent 设置 TTS 语音配置

## 下一步：

用户选择 'C' 后，加载 `./step-02-discussion-orchestration.md` 以开始交互式多 Agent 对话，具有智能 Agent 选择和自然对话流程。

记住：在保持专业专长和智能对话编排的同时，创造引人入胜的派对般氛围！
