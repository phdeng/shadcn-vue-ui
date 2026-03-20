
---

# shadcn-vue-ui

面向不同中后台产品场景的 Vue 3 ui 模板体系。
基于 `Vue 3`、`TypeScript`、`Vite`、`shadcn-vue` 构建，提供统一的设计基础、工程能力与可扩展组件体系。

`shadcn-vue-ui` 当前提供两套模板：

* **shadcn-vue-ui-console**
* **shadcn-vue-ui-business**

它们共享同一套设计语言与工程底座，但分别面向两类不同的后台产品范式：

* **Console**：面向 AI 基础设施与平台能力管理
* **Business**：面向通用业务管理与运营后台

---

## Why shadcn-vue-ui

不是所有后台系统都适合使用同一套模板。

传统业务后台更关注流程承载、表格表单和日常管理效率；
而 AI 平台、资源控制台、能力管理系统，更关注对象管理、配置编排、状态观测和专业控制台体验。

`shadcn-vue-ui` 将这两类场景拆分为两套模板，帮助团队以更清晰的产品范式构建中后台系统。

---

## Template Lineup

### shadcn-vue-ui-console

面向 **AI 基础设施与平台能力管理** 的控制台型前端模板。

适用于：

* 大模型管理
* 智能体管理
* 知识库管理
* Prompt / 工作流管理
* 工具 / 插件管理
* API / Key / Token 管理
* 任务流与执行记录
* 平台资源配置与运行监控

它强调资源对象管理、能力配置、运行状态与系统可观测性，适合构建具备平台属性、系统属性和技术属性的控制台产品。

---

### shadcn-vue-ui-business

面向 **通用业务管理与运营场景** 的后台前端模板。

适用于：

* 基础平台系统
* 用户 / 角色 / 菜单 / 部门管理
* 运营管理系统
* 客户服务系统
* 工单 / 审批 / 内容 / 订单管理
* 企业内部业务后台
* 通用中后台管理系统

它强调流程承载、表格表单效率、角色协作与通用后台建设能力，适合企业常见的业务管理类系统。

---

# Product Positioning

## Console

`shadcn-vue-ui-console` 是一套面向平台能力和技术对象管理的控制台模板。
它更适合承载“模型、智能体、知识库、任务、工具、服务”等资源对象，而不是围绕传统业务流程展开。

在产品体验上，Console 更强调：

* 对象驱动的信息架构
* 配置驱动的管理方式
* 运行状态与结果可观测
* 更专业的控制台交互体验

它适合用来搭建 AI 原生后台、PaaS 控制台、能力管理平台和资源运营平台。

---

## Business

`shadcn-vue-ui-business` 是一套面向业务流程和日常管理操作的通用后台模板。
它更适合承载“用户、角色、菜单、订单、工单、内容、活动、客户”等业务对象，并围绕增删改查、审核、统计、导出等操作展开。

在产品体验上，Business 更强调：

* 流程驱动的信息架构
* 高效率的表格与表单交互
* 更低的学习成本
* 稳定、清晰、耐用的业务后台体验

它适合用来搭建各类企业内部管理系统、运营后台和客服支持系统。

---

# Core Differences

| Dimension | Console           | Business          |
| --------- | ----------------- | ----------------- |
| 产品定位      | 平台控制台 / 资源控制台     | 业务后台 / 运营后台       |
| 核心对象      | 模型、智能体、知识库、任务、服务  | 用户、角色、菜单、订单、工单、内容 |
| 信息架构      | 对象驱动              | 流程驱动              |
| 交互重点      | 配置、状态、运行、关联关系     | 列表、筛选、表单、审批、流转    |
| 用户角色      | 平台管理员、产品、实施、算法、运维 | 管理员、运营、客服、审核、业务人员 |
| 页面形态      | 卡片、详情、配置面板、状态面板   | 表格、搜索区、表单弹窗、统计看板  |
| 视觉气质      | 专业、结构化、偏控制台       | 清晰、稳重、偏业务管理       |

---

# Template Features

## Shared Foundation

两套模板共享统一的工程与设计基础：

* Vue 3 + TypeScript + Vite
* shadcn-vue 组件体系
* 可扩展的 Layout / Route / Permission 模式
* 统一的 Design Token 与 Theme 能力
* 通用表格、表单、弹窗、抽屉、详情页基础设施
* 可复用的页面规范与模块化工程结构

---

## Console Features

适合控制台场景的能力侧重：

* 资源对象管理页面模板
* 卡片 + 列表混合布局
* 配置面板与参数编辑能力
* 状态展示与运行反馈组件
* 任务记录、日志、版本、配额等技术型模块
* 对象关联关系与详情页结构
* 更适合 AI 平台与系统能力控制场景的交互模式

---

## Business Features

适合业务后台场景的能力侧重：

* 标准 CRUD 页面模板
* 高密度表格与高级筛选
* 表单录入、编辑、审核、批量操作
* 统计概览与业务状态展示
* 用户、权限、菜单、组织等基础平台页面能力
* 更适合运营、客服、流程型系统的交互模式

---

# Use Cases

## shadcn-vue-ui-console

适合以下产品方向：

* AI 管理控制台
* LLM Ops 平台
* 智能体运营平台
* 知识库控制台
* 模型服务管理平台
* 工作流 / 工具链配置平台
* API 网关 / 密钥 / 配额控制台
* 系统资源与能力编排平台

---

## shadcn-vue-ui-business

适合以下产品方向：

* 企业基础管理后台
* 用户权限管理系统
* 内容运营后台
* 商品 / 订单 / 活动管理系统
* 客户服务系统
* 工单与审批系统
* 数据录入与流程协同平台
* 通用 ui / 中后台业务系统

---

# Design Philosophy

`shadcn-vue-ui` 不把后台模板理解为单纯的页面集合，而是把它看作一种可复用的产品框架。

因此，这个模板体系不仅提供基础组件，也关注：

* 不同后台产品的典型信息架构
* 页面组织方式与交互重心
* 不同角色使用场景下的操作效率
* 在长期迭代中的扩展性与一致性

通过将 **Console** 与 **Business** 分离，团队可以更自然地构建与产品目标匹配的后台系统，而不是在同一套模版里不断妥协。

---

# Choose the Right Template

选择 `console`，当你的系统更偏向：

* AI 基础设施
* 资源对象管理
* 平台能力配置
* 状态监控与运行反馈
* 技术型产品控制台

选择 `business`，当你的系统更偏向：

* 通用业务管理
* 运营与客服后台
* 用户权限与组织管理
* 表格表单驱动
* 流程协同与日常管理

---

# One System, Two Patterns

`shadcn-vue-ui` 提供的不只是两套 UI 模板，而是两种后台产品构建范式：

* **Console Pattern**：面向平台能力与技术对象
* **Business Pattern**：面向业务流程与管理操作

在统一工程体系下，帮助团队更高效地构建符合场景的中后台产品。

---

# Short Intro

## shadcn-vue-ui-console

A console-style ui template for AI infrastructure and platform capability management, designed for models, agents, knowledge bases, workflows, tools, and system resources.

## shadcn-vue-ui-business

A business-oriented ui template for common management and operation scenarios, designed for users, roles, menus, customer service, operations, and internal business systems.

---
 