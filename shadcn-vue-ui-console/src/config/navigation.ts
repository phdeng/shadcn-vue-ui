/**
 * @description 控制台侧边栏导航配置 — 配置驱动，支持动态菜单
 * @author Timon
 */
import type { Component } from 'vue'
import {
  Activity,
  BookOpen,
  Bot,
  Box,
  ClipboardCheck,
  Database,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Rocket,
  Settings,
  Store,
} from 'lucide-vue-next'

export interface NavItem {
  title: string
  icon: Component
  path: string
}

export interface NavGroup {
  title: string
  icon: Component
  children: NavItem[]
}

/** 主导航菜单 */
export const mainNavItems: NavItem[] = [
  { title: '概览', icon: LayoutDashboard, path: '/' },
]

/** 模型子菜单 */
export const modelNavGroup: NavGroup = {
  title: '模型',
  icon: Box,
  children: [
    { title: '数据集', icon: Database, path: '/datasets' },
    { title: '模型管理', icon: Box, path: '/models' },
    { title: '模型训练', icon: GraduationCap, path: '/training' },
    { title: '模型部署', icon: Rocket, path: '/deployments' },
    { title: '模型评测', icon: ClipboardCheck, path: '/evaluation' },
  ],
}

/** 功能模块导航 */
export const featureNavItems: NavItem[] = [
  { title: '知识库', icon: BookOpen, path: '/knowledge' },
  { title: '推理监控', icon: Activity, path: '/monitoring' },
  { title: 'Agent 管理', icon: Bot, path: '/agents' },
  { title: '插件市场', icon: Store, path: '/plugins' },
  { title: 'ChatAgent', icon: MessageCircle, path: '/chat' },
]

/** 系统导航 */
export const systemNavItems: NavItem[] = [
  { title: '系统设置', icon: Settings, path: '/settings' },
]
