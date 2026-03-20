# Sprint Status - 状态查看与更新

## 概述

本工作流用于查看和更新 Sprint 状态，提供 Multi-Track 的进度概览。

## 状态查看

### 执行命令
读取 `{output_folder}/sprint-status.yaml` 并展示状态概览。

### 输出格式

```
═══════════════════════════════════════════════════════════════
                    Sprint Status 概览
═══════════════════════════════════════════════════════════════

项目: {project_name}
更新时间: {date}

───────────────────────────────────────────────────────────────
Backend Track
───────────────────────────────────────────────────────────────
Epic 1: 用户系统                                    [in-progress]
  ├─ story-1.1-entity-user                         [done]
  ├─ story-1.2-api-auth                            [in-progress]
  └─ story-1.3-service-permission                  [backlog]

Epic 2: 商品管理                                    [backlog]
  ├─ story-2.1-entity-product                      [backlog]
  └─ story-2.2-api-product                         [backlog]

───────────────────────────────────────────────────────────────
Frontend Track
───────────────────────────────────────────────────────────────
Epic 1: 用户系统                                    [in-progress]
  ├─ story-1.1-page-login                          [done]
  ├─ story-1.2-page-register                       [in-progress]
  └─ story-1.3-page-profile                        [backlog]

───────────────────────────────────────────────────────────────
Integration Track
───────────────────────────────────────────────────────────────
Epic 1: 用户系统                                    [backlog]
  ├─ story-1.1-flow-login                          [backlog]
  └─ story-1.2-flow-register                       [backlog]

═══════════════════════════════════════════════════════════════
                        统计摘要
═══════════════════════════════════════════════════════════════

| Track       | 总计 | Backlog | In Progress | Done | 完成率 |
|-------------|------|---------|-------------|------|--------|
| Backend     | 5    | 3       | 1           | 1    | 20%    |
| Frontend    | 4    | 2       | 1           | 1    | 25%    |
| Integration | 2    | 2       | 0           | 0    | 0%     |
| **总计**    | 11   | 7       | 2           | 2    | 18%    |

═══════════════════════════════════════════════════════════════
```

## 状态更新

### 手动更新状态

用户可以请求更新特定 Story 的状态：

**请求格式**:
```
更新 story-1.2-api-auth 状态为 done
```

**执行步骤**:
1. 验证 Story ID 存在
2. 验证新状态合法
3. 更新 sprint-status.yaml
4. 显示更新后的状态

### 批量更新

**请求格式**:
```
将 Epic 1 的所有 Backend Stories 标记为 done
```

## 状态过滤

### 按状态过滤
```
显示所有 in-progress 的 Stories
```

### 按 Track 过滤
```
显示 Backend Track 的状态
```

### 按 Epic 过滤
```
显示 Epic 1 在所有 Track 的状态
```

## 进度报告

### 生成进度报告

```markdown
# Sprint 进度报告

## 生成时间
{date}

## 整体进度
- 总 Story 数: {total}
- 已完成: {done} ({percent}%)
- 进行中: {in_progress}
- 待处理: {backlog}

## 各 Track 进度

### Backend
{backend_progress_bar} {backend_percent}%

### Frontend
{frontend_progress_bar} {frontend_percent}%

### Integration
{integration_progress_bar} {integration_percent}%

## 阻塞项
- {blocking_items}

## 下一步建议
- {next_actions}
```

## 联调就绪检查

### 检查 Integration Story 的前置条件

```
检查 story-1.1-flow-login 是否可以开始联调
```

**输出**:
```
联调就绪检查: story-1.1-flow-login

依赖的 Backend Stories:
  ✅ story-1.1-entity-user (done)
  ✅ story-1.2-api-auth (done)

依赖的 Frontend Stories:
  ✅ story-1.1-page-login (done)
  ⏳ story-1.2-page-register (in-progress)

结论: ⚠️ 部分依赖未完成，建议等待 story-1.2-page-register 完成后再开始联调
```
