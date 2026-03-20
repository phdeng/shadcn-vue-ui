# Story {Epic}.{Seq}: {Story 名称}

## Story 概述

| 字段 | 值 |
|------|-----|
| Story ID | story-{Epic}.{Seq}-{type}-{name} |
| Track | Backend |
| 类型 | {entity/api/service/infra} |
| Epic | Epic {Epic}: {Epic 名称} |
| 状态 | backlog |

## 用户故事

作为 {后端开发者/系统}，
我需要 {实现的功能}，
以便 {提供的能力/支撑前端功能}。

## Story 类型说明

- `entity-`: 数据库实体、表结构、ORM 模型
- `api-`: RESTful/GraphQL 接口端点
- `service-`: 业务逻辑服务层
- `infra-`: 基础设施（缓存、消息队列、文件存储）

## 技术范围

### 涉及模块
- {模块路径 1}
- {模块路径 2}

### 数据库变更（如 entity- 类型）
```sql
-- 表结构示例
CREATE TABLE {table_name} (
  id BIGINT PRIMARY KEY,
  -- fields
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### API 端点（如 api- 类型）
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/{resource} | 创建资源 |
| GET | /api/v1/{resource}/{id} | 获取资源详情 |
| PUT | /api/v1/{resource}/{id} | 更新资源 |
| DELETE | /api/v1/{resource}/{id} | 删除资源 |

### 服务接口（如 service- 类型）
```typescript
interface I{ServiceName}Service {
  method1(param: Type): Promise<Result>;
  method2(param: Type): Promise<Result>;
}
```

## 验收标准

### AC-1: {验收标准标题}
**Given** {前置条件}
**When** {执行操作}
**Then** {期望结果}
**And** {附加条件}

### AC-2: {验收标准标题}
**Given** {前置条件}
**When** {执行操作}
**Then** {期望结果}

### AC-3: 错误处理
**Given** {异常场景}
**When** {触发条件}
**Then** {错误响应格式和状态码}

## 依赖关系

### 前置 Story
- [ ] story-{X}.{Y}-{type}-{name} - {依赖原因}

### 被依赖
- story-{X}.{Y}-{type}-{name} 需要此 Story 完成后才能开始

### 跨 Track 依赖
- Frontend story-{X}.{Y} 依赖此 API

## 技术说明

### 实现要点
1. {要点 1}
2. {要点 2}

### 参考资料
- [Source: {架构文档路径}#{章节}]
- [Source: {API 规范路径}#{章节}]

## 测试要求

### 单元测试
- [ ] {测试用例 1}
- [ ] {测试用例 2}

### 集成测试
- [ ] {测试场景 1}
- [ ] {测试场景 2}

## 开发记录

### 完成记录
<!-- 开发完成后填写 -->
- 完成时间:
- 开发者/Agent:
- 提交记录:

### 备注
<!-- 开发过程中的注意事项 -->
