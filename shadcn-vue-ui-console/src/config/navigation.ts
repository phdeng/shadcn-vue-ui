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
  Layers,
  LayoutDashboard,
  MessageCircle,
  Network,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Workflow,
  Wrench,
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
    { title: '模型目录', icon: Box, path: '/models' },
    { title: '数据集', icon: Database, path: '/datasets' },
    { title: '模型训练', icon: GraduationCap, path: '/training' },
    { title: '蒸馏与量化', icon: Layers, path: '/training/distillation' },
    { title: '模型评测', icon: ClipboardCheck, path: '/evaluation' },
    { title: '模型部署', icon: Rocket, path: '/deployments' },
  ],
}

/** Agent 子菜单 */
export const agentNavGroup: NavGroup = {
  title: 'Agent',
  icon: Bot,
  children: [
    { title: 'Agent 管理', icon: Bot, path: '/agents' },
    { title: '工作流编排', icon: Workflow, path: '/workflows' },
    { title: 'Prompt 工程台', icon: Sparkles, path: '/prompts' },
    { title: 'Playground', icon: MessageCircle, path: '/playground' },
  ],
}

/** 功能模块导航 */
export const featureNavItems: NavItem[] = [
  { title: '知识库', icon: BookOpen, path: '/knowledge' },
  { title: '工具与集成', icon: Wrench, path: '/tools' },
  { title: '可观测性', icon: Activity, path: '/observability' },
]

/** 系统导航 */
export const systemNavItems: NavItem[] = [
  { title: '安全合规', icon: Shield, path: '/security' },
  { title: '联邦学习', icon: Network, path: '/federated' },
  { title: '系统设置', icon: Settings, path: '/settings' },
]
