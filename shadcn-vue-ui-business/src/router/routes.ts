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

      // 用户管理
      {
        path: 'users',
        name: 'UserList',
        component: () => import('@/pages/users/UserListPage.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'users/:id',
        name: 'UserDetail',
        component: () => import('@/pages/users/UserDetailPage.vue'),
        meta: { title: '用户详情' },
      },

      // 角色管理
      {
        path: 'roles',
        name: 'RoleList',
        component: () => import('@/pages/roles/RoleListPage.vue'),
        meta: { title: '角色管理' },
      },

      // 订单管理
      {
        path: 'orders',
        name: 'OrderList',
        component: () => import('@/pages/orders/OrderListPage.vue'),
        meta: { title: '订单管理' },
      },

      // 内容管理
      {
        path: 'content',
        name: 'ContentList',
        component: () => import('@/pages/content/ContentListPage.vue'),
        meta: { title: '内容管理' },
      },

      // 数据报表
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/pages/reports/ReportPage.vue'),
        meta: { title: '数据报表' },
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
