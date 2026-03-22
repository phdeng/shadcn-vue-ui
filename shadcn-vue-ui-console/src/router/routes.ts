import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  // 登录页 — 独立布局，不嵌套 DefaultLayout
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { title: '登录', guest: true },
  },

  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      // 概览
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/DashboardPage.vue'),
        meta: { title: '概览' },
      },

      // 模型 — 数据集
      {
        path: 'datasets',
        name: 'DatasetList',
        component: () => import('@/pages/datasets/DatasetListPage.vue'),
        meta: { title: '数据集' },
      },
      {
        path: 'datasets/create',
        name: 'DatasetCreate',
        component: () => import('@/pages/datasets/DatasetCreatePage.vue'),
        meta: { title: '新增数据集' },
      },
      {
        path: 'datasets/:id',
        name: 'DatasetDetail',
        component: () => import('@/pages/datasets/DatasetDetailPage.vue'),
        meta: { title: '数据集详情' },
      },

      // 模型 — 模型目录
      {
        path: 'models',
        name: 'ModelList',
        component: () => import('@/pages/models/ModelListPage.vue'),
        meta: { title: '模型目录' },
      },
      {
        path: 'models/create',
        name: 'ModelCreate',
        component: () => import('@/pages/models/ModelCreatePage.vue'),
        meta: { title: '注册模型' },
      },
      {
        path: 'models/:id',
        name: 'ModelDetail',
        component: () => import('@/pages/models/ModelDetailPage.vue'),
        meta: { title: '模型详情' },
      },

      // 模型 — 模型训练
      {
        path: 'training',
        name: 'TrainingList',
        component: () => import('@/pages/training/TrainingListPage.vue'),
        meta: { title: '模型训练' },
      },
      {
        path: 'training/create',
        name: 'TrainingCreate',
        component: () => import('@/pages/training/TrainingCreatePage.vue'),
        meta: { title: '创建训练任务' },
      },
      {
        path: 'training/:id',
        name: 'TrainingDetail',
        component: () => import('@/pages/training/TrainingDetailPage.vue'),
        meta: { title: '训练详情' },
      },

      // 模型 — 模型部署
      {
        path: 'deployments',
        name: 'DeploymentList',
        component: () => import('@/pages/deployments/DeploymentListPage.vue'),
        meta: { title: '模型部署' },
      },
      {
        path: 'deployments/create',
        name: 'DeploymentCreate',
        component: () => import('@/pages/deployments/DeploymentCreatePage.vue'),
        meta: { title: '创建部署' },
      },
      {
        path: 'deployments/:id',
        name: 'DeploymentDetail',
        component: () => import('@/pages/deployments/DeploymentDetailPage.vue'),
        meta: { title: '部署详情' },
      },

      // 模型 — 模型评测
      {
        path: 'evaluation',
        name: 'EvaluationList',
        component: () => import('@/pages/evaluation/EvaluationListPage.vue'),
        meta: { title: '模型评测' },
      },
      {
        path: 'evaluation/:id',
        name: 'EvaluationDetail',
        component: () => import('@/pages/evaluation/EvaluationDetailPage.vue'),
        meta: { title: '评测报告' },
      },

      // 知识库
      {
        path: 'knowledge',
        name: 'KnowledgeList',
        component: () => import('@/pages/knowledge/KnowledgeListPage.vue'),
        meta: { title: '知识库' },
      },
      {
        path: 'knowledge/create',
        name: 'KnowledgeCreate',
        component: () => import('@/pages/knowledge/KnowledgeCreatePage.vue'),
        meta: { title: '创建知识库' },
      },
      {
        path: 'knowledge/:id',
        name: 'KnowledgeDetail',
        component: () => import('@/pages/knowledge/KnowledgeDetailPage.vue'),
        meta: { title: '知识库详情' },
      },
      {
        path: 'knowledge/:id/edit',
        name: 'KnowledgeEdit',
        component: () => import('@/pages/knowledge/KnowledgeEditPage.vue'),
        meta: { title: '编辑知识库' },
      },
      {
        path: 'knowledge/:id/upload',
        name: 'KnowledgeUpload',
        component: () => import('@/pages/knowledge/KnowledgeUploadPage.vue'),
        meta: { title: '上传文档' },
      },
      {
        path: 'knowledge/:id/documents/:docId',
        name: 'KnowledgeDocDetail',
        component: () => import('@/pages/knowledge/KnowledgeDocDetailPage.vue'),
        meta: { title: '文档详情' },
      },

      // 工作流编排
      {
        path: 'workflows',
        name: 'WorkflowList',
        component: () => import('@/pages/workflows/WorkflowsPage.vue'),
        meta: { title: '工作流编排' },
      },
      {
        path: 'workflows/create',
        name: 'WorkflowCreate',
        component: () => import('@/pages/workflows/WorkflowCreatePage.vue'),
        meta: { title: '创建工作流' },
      },
      {
        path: 'workflows/:id',
        name: 'WorkflowDetail',
        component: () => import('@/pages/workflows/WorkflowDetailPage.vue'),
        meta: { title: '工作流详情' },
      },

      // 安全合规
      {
        path: 'security',
        name: 'Security',
        component: () => import('@/pages/security/SecurityPage.vue'),
        meta: { title: '安全合规' },
      },

      // Agent 管理
      {
        path: 'agents',
        name: 'AgentList',
        component: () => import('@/pages/agents/AgentListPage.vue'),
        meta: { title: 'Agent 管理' },
      },
      {
        path: 'agents/create',
        name: 'AgentCreate',
        component: () => import('@/pages/agents/AgentCreatePage.vue'),
        meta: { title: '创建 Agent' },
      },
      {
        path: 'agents/:id',
        name: 'AgentDetail',
        component: () => import('@/pages/agents/AgentDetailPage.vue'),
        meta: { title: 'Agent 详情' },
      },

      // Playground（原 ChatAgent）
      {
        path: 'playground',
        name: 'Playground',
        component: () => import('@/pages/chat/ChatAgentPage.vue'),
        meta: { title: 'Playground' },
      },

      // 工具与集成（原插件市场）
      {
        path: 'tools',
        name: 'Tools',
        component: () => import('@/pages/plugins/PluginMarketPage.vue'),
        meta: { title: '工具与集成' },
      },

      // 可观测性（原推理监控）
      {
        path: 'observability',
        name: 'Observability',
        component: () => import('@/pages/monitoring/MonitoringPage.vue'),
        meta: { title: '可观测性' },
      },

      // 系统设置
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/settings/SettingsPage.vue'),
        meta: { title: '系统设置' },
      },
    ],
  },

  // 404 — catch-all
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '页面未找到' },
  },
]
