# 创建 Epic 和 Story 工作流（Multi-Track 版本）

本工作流支持微服务前后端分离架构，将需求拆分为多个独立 Track：

- **Backend Track**：后端开发（实体、API、服务）
- **Frontend Track**：前端开发（页面、组件、功能）
- **Integration Track**：前后端联调

## 工作流概述

```
PRD 需求 → 功能模块识别 → Multi-Track Epic 拆分 → Story 细化 → Sprint 状态初始化
```

## 目标输出结构

```
{output_folder}/
├── sprint-status.yaml              # Sprint 状态跟踪
├── backend/
│   ├── epics.md                    # 后端 Epic 索引
│   └── epic-{N}/
│       ├── epic.md                 # Epic 详情
│       ├── story-{N}.1-{type}-{name}.md
│       └── story-{N}.2-{type}-{name}.md
├── frontend/
│   ├── epics.md                    # 前端 Epic 索引
│   └── epic-{N}/
│       ├── epic.md
│       └── story-{N}.1-{type}-{name}.md
└── integration/
    ├── epics.md                    # 联调 Epic 索引
    └── epic-{N}/
        ├── epic.md
        └── story-{N}.1-flow-{name}.md
```

## Story 类型前缀规范

### 后端 Story 类型
| 前缀 | 用途 | 示例 |
|------|------|------|
| `entity-` | 实体/表模块 | `story-1.1-entity-user.md` |
| `api-` | API 端点组 | `story-1.2-api-auth.md` |
| `service-` | 业务服务 | `story-1.3-service-permission.md` |
| `infra-` | 基础设施 | `story-1.4-infra-cache.md` |

### 前端 Story 类型
| 前缀 | 用途 | 示例 |
|------|------|------|
| `page-` | 完整页面 | `story-1.1-page-login.md` |
| `component-` | 独立组件 | `story-1.2-component-rich-editor.md` |
| `feature-` | 跨页面功能 | `story-1.3-feature-auth-guard.md` |
| `style-` | 样式/主题 | `story-1.4-style-dark-mode.md` |

### 联调 Story 类型
| 前缀 | 用途 | 示例 |
|------|------|------|
| `flow-` | 业务流程联调 | `story-1.1-flow-login.md` |
| `test-` | 集成测试 | `story-1.2-test-e2e-auth.md` |

## 统一编号规则

- Epic 编号跨 Track 统一：`Epic 1` 在三个 Track 中都代表同一功能模块
- 例如：`Epic 1: 用户系统` 对应：
  - `backend/epic-1/` - 用户系统后端
  - `frontend/epic-1/` - 用户系统前端
  - `integration/epic-1/` - 用户系统联调

## 工作流步骤

1. **Step 1**: 验证前置条件（PRD、架构文档）
2. **Step 2**: 识别功能模块并设计统一 Epic 列表
3. **Step 3**: 为每个 Epic 创建 Multi-Track Story
4. **Step 4**: 生成 Sprint 状态文件
5. **Step 5**: 最终验证

## 执行入口

从 [Step 1: 验证前置条件](steps/step-01-validate-prerequisites.md) 开始执行。
