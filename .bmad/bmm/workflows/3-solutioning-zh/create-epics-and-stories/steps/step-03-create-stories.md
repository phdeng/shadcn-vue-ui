---
name: 'step-03-create-stories'
description: '为每个 Epic 创建 Multi-Track 的 Story 文件'

workflow_path: '{project-root}/.bmad/bmm/workflows/3-solutioning-zh/create-epics-and-stories'

thisStepFile: '{workflow_path}/steps/step-03-create-stories.md'
nextStepFile: '{workflow_path}/steps/step-04-generate-sprint-status.md'
workflowFile: '{workflow_path}/workflow.md'

# 模板引用
epicTemplate: '{workflow_path}/templates/epic-template.md'
backendStoryTemplate: '{workflow_path}/templates/story-backend-template.md'
frontendStoryTemplate: '{workflow_path}/templates/story-frontend-template.md'
integrationStoryTemplate: '{workflow_path}/templates/story-integration-template.md'
---

# Step 3: 创建 Multi-Track Story

## 步骤目标

为每个 Epic 在三个 Track（Backend、Frontend、Integration）中创建详细的 Story 文件。

## Story 类型前缀规范

### 后端 Story 类型
| 前缀 | 用途 | 粒度说明 |
|------|------|----------|
| `entity-` | 实体/表模块 | 一个或一组关联表 |
| `api-` | API 端点组 | 一组相关接口 |
| `service-` | 业务服务 | 独立业务逻辑模块 |
| `infra-` | 基础设施 | 缓存、消息队列等 |

### 前端 Story 类型
| 前缀 | 用途 | 粒度说明 |
|------|------|----------|
| `page-` | 完整页面 | 一个路由对应的页面 |
| `component-` | 独立组件 | 可复用的 UI 组件 |
| `feature-` | 跨页面功能 | 路由守卫、全局状态等 |
| `style-` | 样式/主题 | 主题切换、样式系统 |

### 联调 Story 类型
| 前缀 | 用途 | 粒度说明 |
|------|------|----------|
| `flow-` | 业务流程 | 完整用户操作流程 |
| `test-` | 集成测试 | E2E 测试场景 |

## 执行流程

### 1. 创建目录结构

对于每个 Epic N，创建以下目录：

```
{output_folder}/
├── backend/epic-{N}/
├── frontend/epic-{N}/
└── integration/epic-{N}/
```

### 2. 创建 Epic 详情文件

在每个 Epic 目录中创建 `epic.md`：

```markdown
# Epic {N}: {Epic 名称} - {Track 名称}

## Epic 目标
{该 Track 在此 Epic 中要完成的目标}

## 覆盖需求
- FR{X}: {需求描述}
- FR{Y}: {需求描述}

## Story 列表
1. story-{N}.1-{type}-{name}.md - {简述}
2. story-{N}.2-{type}-{name}.md - {简述}

## 依赖关系
- 依赖 Epic {M} 的 {具体内容}
- 被 Epic {P} 依赖
```

### 3. 创建 Backend Stories

后端 Story 粒度控制：
- **entity-**: 按表或关联表组划分
- **api-**: 按功能接口组划分
- **service-**: 按业务服务模块划分

示例 Story 顺序（Epic 1: 用户系统）：
```
story-1.1-entity-user.md      # 用户表、角色表
story-1.2-api-auth.md         # 登录、注册、登出接口
story-1.3-api-user.md         # 用户信息 CRUD 接口
story-1.4-service-permission.md # 权限校验服务
```

### 4. 创建 Frontend Stories

前端 Story 粒度控制：
- **page-**: 每个路由页面一个 Story
- **component-**: 复杂可复用组件单独一个 Story
- **feature-**: 跨页面功能单独一个 Story

示例 Story 顺序（Epic 1: 用户系统）：
```
story-1.1-page-login.md       # 登录页面
story-1.2-page-register.md    # 注册页面
story-1.3-page-profile.md     # 个人中心页面
story-1.4-feature-auth-guard.md # 路由权限守卫
```

### 5. 创建 Integration Stories

联调 Story 粒度控制：
- **flow-**: 完整业务流程的前后端联调
- **test-**: E2E 测试场景

示例 Story 顺序（Epic 1: 用户系统）：
```
story-1.1-flow-login.md       # 登录流程联调
story-1.2-flow-register.md    # 注册流程联调
story-1.3-flow-password-reset.md # 密码重置流程联调
```

### 6. Story 文件格式

每个 Story 文件使用对应的模板，包含：
- 用户故事格式（As a / I want / So that）
- 验收标准（Given / When / Then）
- 技术说明
- 依赖关系

## 命名规则

Story 文件命名：`story-{Epic}.{Seq}-{type}-{name}.md`

- `{Epic}`: Epic 编号（如 1, 2, 3）
- `{Seq}`: Story 在该 Track 中的序号
- `{type}`: Story 类型前缀
- `{name}`: 简短描述（kebab-case）

示例：
- `story-1.1-entity-user.md`
- `story-1.2-api-auth.md`
- `story-2.1-page-product-list.md`

## 菜单选项

**选择操作:** [A] 高级引导 [P] 派对模式 [C] 继续下一步

## 完成标准

- [ ] 每个 Epic 的三个 Track 目录已创建
- [ ] 每个 Track 的 epic.md 已创建
- [ ] 所有 Backend Stories 已创建
- [ ] 所有 Frontend Stories 已创建
- [ ] 所有 Integration Stories 已创建
- [ ] Story 命名符合规范
