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

      // 模型 — 模型管理
      {
        path: 'models',
        name: 'ModelList',
        component: () => import('@/pages/models/ModelListPage.vue'),
        meta: { title: '模型管理' },
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

      // Agent 管理
      {
        path: 'agents',
        name: 'AgentList',
        component: () => import('@/pages/agents/AgentListPage.vue'),
        meta: { title: 'Agent 管理' },
      },
      {
        path: 'agents/:id',
        name: 'AgentDetail',
        component: () => import('@/pages/agents/AgentDetailPage.vue'),
        meta: { title: 'Agent 详情' },
      },

      // 插件市场
      {
        path: 'plugins',
        name: 'PluginMarket',
        component: () => import('@/pages/plugins/PluginMarketPage.vue'),
        meta: { title: '插件市场' },
      },

      // ChatAgent
      {
        path: 'chat',
        name: 'ChatAgent',
        component: () => import('@/pages/chat/ChatAgentPage.vue'),
        meta: { title: 'ChatAgent' },
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
