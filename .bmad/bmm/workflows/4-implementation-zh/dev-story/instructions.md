# Dev Story - Story 开发工作流

## 概述

本工作流指导开发者（或开发 Agent）完成 Story 的实现。支持 Multi-Track 的不同开发模式。

## 前置条件

- Story 状态为 `ready-for-dev`
- 所有前置依赖 Story 已完成
- 开发环境已准备就绪

## 执行流程

<workflow>

<step n="1" goal="选择要开发的 Story">
<action>读取 sprint-status.yaml 找到状态为 ready-for-dev 的 Stories</action>
<action>按优先级展示可开发的 Story 列表</action>

**优先级规则**:
1. 前置依赖已完成的 Story 优先
2. 同一 Epic 内按序号顺序
3. Backend Story 优先于 Frontend（如需）
4. Integration Story 等待前后端完成

<action>用户选择要开发的 Story</action>
</step>

<step n="2" goal="加载 Story 上下文">
<action>读取 Story 文件内容</action>
<action>加载相关依赖和参考文档</action>

**上下文加载**:
- Story 详情和验收标准
- 依赖的其他 Story 实现
- 架构约束和技术规范
- 相关代码模块
</step>

<step n="3" goal="更新状态为 in-progress">
<action>更新 sprint-status.yaml 中 Story 状态为 in-progress</action>
<action>更新 Epic 状态为 in-progress（如果是第一个进行中的 Story）</action>
<action>记录开发开始时间</action>
</step>

<step n="4" goal="执行开发任务">

**Backend 开发指引**:
```
1. entity- 类型:
   - 创建/修改数据库迁移
   - 定义 ORM 模型
   - 编写基础 CRUD 操作
   - 编写单元测试

2. api- 类型:
   - 创建路由定义
   - 实现控制器逻辑
   - 添加参数验证
   - 编写 API 测试

3. service- 类型:
   - 定义服务接口
   - 实现业务逻辑
   - 处理事务和错误
   - 编写服务测试

4. infra- 类型:
   - 配置基础设施组件
   - 实现适配器/客户端
   - 编写集成测试
```

**Frontend 开发指引**:
```
1. page- 类型:
   - 创建页面组件
   - 实现路由配置
   - 接入 API 调用
   - 处理状态管理
   - 编写组件测试

2. component- 类型:
   - 创建可复用组件
   - 定义 Props 接口
   - 实现组件逻辑
   - 编写 Storybook 示例

3. feature- 类型:
   - 实现跨页面功能
   - 配置全局状态
   - 添加中间件/守卫

4. style- 类型:
   - 定义样式变量
   - 实现主题切换
   - 更新全局样式
```

**Integration 开发指引**:
```
1. flow- 类型:
   - 执行端到端联调
   - 验证数据流转
   - 确认错误处理
   - 记录联调问题

2. test- 类型:
   - 编写 E2E 测试
   - 配置测试数据
   - 执行自动化测试
```

<action>按照 Story 验收标准逐一实现</action>
<action>完成一个 AC 后在 Story 文件中标记</action>
</step>

<step n="5" goal="验证验收标准">
<action>对照每个 AC 进行自测</action>

**验证检查表**:
- [ ] AC-1: {验收标准 1} - 通过/失败
- [ ] AC-2: {验收标准 2} - 通过/失败
- [ ] AC-3: {验收标准 3} - 通过/失败

<action>修复未通过的验收标准</action>
</step>

<step n="6" goal="提交代码并更新状态">
<action>提交代码到版本控制</action>
<action>更新 Story 文件的开发记录</action>

**开发记录更新**:
```markdown
## 开发记录

### 完成记录
- 完成时间: {date}
- 开发者/Agent: {name}
- 提交记录: {commit_hash}

### 文件变更
- {file_path_1}
- {file_path_2}
```

<action>更新 sprint-status.yaml 状态为 review</action>
</step>

<step n="7" goal="准备代码审查">
<action>生成变更摘要</action>
<action>提示进行 code-review 工作流</action>

**下一步**: 执行 `code-review` 工作流进行代码审查
</step>

</workflow>

## 状态流转

```
ready-for-dev → in-progress → review → done
```

## 开发最佳实践

### 通用原则
1. 小步提交，频繁集成
2. 先写测试，后写实现（TDD）
3. 保持代码整洁
4. 及时更新文档

### Backend 最佳实践
1. 遵循 RESTful 设计原则
2. 实现适当的错误处理
3. 添加请求验证
4. 编写 API 文档

### Frontend 最佳实践
1. 组件职责单一
2. 状态管理清晰
3. 处理加载和错误状态
4. 响应式设计

### Integration 最佳实践
1. 准备完整测试数据
2. 验证所有边界条件
3. 记录发现的问题
4. 确保可重复执行

## 问题处理

### 遇到阻塞
如果开发过程中遇到阻塞：
1. 记录阻塞原因到 Story 文件
2. 更新状态为 `blocked`（如需要）
3. 通知相关人员

### 范围变更
如果发现 Story 范围需要调整：
1. 与 PM 讨论确认
2. 更新 Story 内容
3. 重新评估工作量
