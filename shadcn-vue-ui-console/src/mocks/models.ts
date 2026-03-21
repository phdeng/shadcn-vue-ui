/**
 * 模型管理 Mock 数据模块
 *
 * 提供模型列表、调用记录、仪表盘统计等模拟数据，
 * 用于开发阶段的前端独立调试与页面渲染验证。
 *
 * @author Timon
 * @module shadcn-vue-ui-console/mocks
 */

// ─── 类型定义 ────────────────────────────────────────────

/** 模型状态枚举 */
export type ModelStatus = 'running' | 'stopped' | 'error'

/** 模型条目 */
export interface ModelItem {
  /** 唯一标识 */
  id: string
  /** 模型名称 */
  name: string
  /** 提供商 */
  provider: string
  /** 模型类型（如 chat、embedding） */
  type: string
  /** 运行状态 */
  status: ModelStatus
  /** 模型描述 */
  description: string
  /** 累计调用次数 */
  calls: number
  /** 平均延迟 */
  latency: string
  /** 最大 Token 数 */
  maxTokens: number
  /** 默认温度参数 */
  temperature: number
  /** API 端点地址 */
  endpoint: string
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

/** 模型调用记录 */
export interface ModelCallRecord {
  /** 记录唯一标识 */
  id: string
  /** 调用时间 */
  time: string
  /** 消耗 Token 数 */
  tokens: number
  /** 本次调用延迟 */
  latency: string
  /** 调用状态 */
  status: 'success' | 'failed' | 'timeout'
  /** 调用的模型名称 */
  model: string
}

/** 仪表盘统计数据 */
export interface DashboardStats {
  /** 模型总数 */
  totalModels: number
  /** 运行中模型数 */
  runningModels: number
  /** 已停止模型数 */
  stoppedModels: number
  /** 异常模型数 */
  errorModels: number
  /** 今日总调用次数 */
  todayCalls: number
  /** 今日总 Token 消耗 */
  todayTokens: number
}

// ─── Mock 模型列表 ──────────────────────────────────────

/** 模拟模型数据，包含 6 个主流大语言模型 */
export const mockModels: ModelItem[] = [
  {
    id: 'model-001',
    name: 'GPT-4o',
    provider: 'OpenAI',
    type: 'chat',
    status: 'running',
    description: 'OpenAI 最新多模态旗舰模型，支持文本、图像、音频输入输出，推理速度显著提升。',
    calls: 128_450,
    latency: '320ms',
    maxTokens: 128_000,
    temperature: 0.7,
    endpoint: 'https://api.openai.com/v1/chat/completions',
    createdAt: '2025-08-01 10:00:00',
    updatedAt: '2026-03-20 14:30:00',
  },
  {
    id: 'model-002',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    type: 'chat',
    status: 'running',
    description: 'Anthropic 高性能模型，在代码生成、长文本理解与复杂推理方面表现卓越。',
    calls: 95_320,
    latency: '280ms',
    maxTokens: 200_000,
    temperature: 0.5,
    endpoint: 'https://api.anthropic.com/v1/messages',
    createdAt: '2025-09-15 08:00:00',
    updatedAt: '2026-03-19 16:45:00',
  },
  {
    id: 'model-003',
    name: 'Qwen2.5-72B',
    provider: '阿里云',
    type: 'chat',
    status: 'running',
    description: '通义千问开源大模型，中文能力突出，适用于多语言对话与知识问答场景。',
    calls: 67_890,
    latency: '450ms',
    maxTokens: 131_072,
    temperature: 0.8,
    endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    createdAt: '2025-10-20 09:30:00',
    updatedAt: '2026-03-18 11:20:00',
  },
  {
    id: 'model-004',
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    type: 'chat',
    status: 'stopped',
    description: 'DeepSeek 第三代 MoE 架构模型，在数学推理与代码生成领域具备领先水平。',
    calls: 42_150,
    latency: '380ms',
    maxTokens: 128_000,
    temperature: 0.6,
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    createdAt: '2025-11-05 14:00:00',
    updatedAt: '2026-03-15 09:10:00',
  },
  {
    id: 'model-005',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    type: 'chat',
    status: 'running',
    description: 'Google 轻量化高速模型，主打低延迟与高吞吐，适合实时交互与流式输出场景。',
    calls: 83_200,
    latency: '190ms',
    maxTokens: 1_048_576,
    temperature: 0.7,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    createdAt: '2025-12-01 11:00:00',
    updatedAt: '2026-03-20 08:55:00',
  },
  {
    id: 'model-006',
    name: 'GLM-4-Plus',
    provider: '智谱 AI',
    type: 'chat',
    status: 'error',
    description: '智谱 GLM 系列增强版，深度优化中文理解与生成能力，支持长上下文对话。',
    calls: 31_670,
    latency: '520ms',
    maxTokens: 128_000,
    temperature: 0.9,
    endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    createdAt: '2026-01-10 16:00:00',
    updatedAt: '2026-03-17 22:30:00',
  },
]

// ─── Mock 调用记录 ──────────────────────────────────────

/** 模拟模型调用记录，共 20 条 */
export const mockModelCalls: ModelCallRecord[] = [
  { id: 'call-001', time: '2026-03-21 09:01:12', tokens: 1_250, latency: '310ms', status: 'success', model: 'GPT-4o' },
  { id: 'call-002', time: '2026-03-21 09:03:45', tokens: 890, latency: '275ms', status: 'success', model: 'Claude 3.5 Sonnet' },
  { id: 'call-003', time: '2026-03-21 09:05:22', tokens: 2_100, latency: '480ms', status: 'success', model: 'Qwen2.5-72B' },
  { id: 'call-004', time: '2026-03-21 09:08:10', tokens: 560, latency: '185ms', status: 'success', model: 'Gemini 2.0 Flash' },
  { id: 'call-005', time: '2026-03-21 09:10:33', tokens: 1_800, latency: '520ms', status: 'timeout', model: 'GLM-4-Plus' },
  { id: 'call-006', time: '2026-03-21 09:12:50', tokens: 1_420, latency: '330ms', status: 'success', model: 'GPT-4o' },
  { id: 'call-007', time: '2026-03-21 09:15:18', tokens: 3_200, latency: '290ms', status: 'success', model: 'Claude 3.5 Sonnet' },
  { id: 'call-008', time: '2026-03-21 09:18:42', tokens: 670, latency: '195ms', status: 'success', model: 'Gemini 2.0 Flash' },
  { id: 'call-009', time: '2026-03-21 09:20:05', tokens: 1_050, latency: '460ms', status: 'failed', model: 'Qwen2.5-72B' },
  { id: 'call-010', time: '2026-03-21 09:22:30', tokens: 920, latency: '340ms', status: 'success', model: 'GPT-4o' },
  { id: 'call-011', time: '2026-03-21 09:25:14', tokens: 1_600, latency: '300ms', status: 'success', model: 'Claude 3.5 Sonnet' },
  { id: 'call-012', time: '2026-03-21 09:28:01', tokens: 780, latency: '390ms', status: 'success', model: 'DeepSeek-V3' },
  { id: 'call-013', time: '2026-03-21 09:30:47', tokens: 2_400, latency: '510ms', status: 'failed', model: 'GLM-4-Plus' },
  { id: 'call-014', time: '2026-03-21 09:33:20', tokens: 430, latency: '180ms', status: 'success', model: 'Gemini 2.0 Flash' },
  { id: 'call-015', time: '2026-03-21 09:36:55', tokens: 1_150, latency: '325ms', status: 'success', model: 'GPT-4o' },
  { id: 'call-016', time: '2026-03-21 09:39:08', tokens: 1_980, latency: '285ms', status: 'success', model: 'Claude 3.5 Sonnet' },
  { id: 'call-017', time: '2026-03-21 09:42:33', tokens: 540, latency: '440ms', status: 'timeout', model: 'Qwen2.5-72B' },
  { id: 'call-018', time: '2026-03-21 09:45:12', tokens: 1_350, latency: '310ms', status: 'success', model: 'GPT-4o' },
  { id: 'call-019', time: '2026-03-21 09:48:40', tokens: 860, latency: '200ms', status: 'success', model: 'Gemini 2.0 Flash' },
  { id: 'call-020', time: '2026-03-21 09:51:25', tokens: 2_750, latency: '295ms', status: 'success', model: 'Claude 3.5 Sonnet' },
]

// ─── 仪表盘统计 ──────────────────────────────────────────

/** 仪表盘汇总统计数据 */
export const mockDashboardStats: DashboardStats = {
  totalModels: mockModels.length,
  runningModels: mockModels.filter(m => m.status === 'running').length,
  stoppedModels: mockModels.filter(m => m.status === 'stopped').length,
  errorModels: mockModels.filter(m => m.status === 'error').length,
  todayCalls: mockModelCalls.length,
  todayTokens: mockModelCalls.reduce((sum, record) => sum + record.tokens, 0),
}

// ─── 辅助函数 ────────────────────────────────────────────

/**
 * 根据 ID 查找模型
 *
 * @param id - 模型唯一标识
 * @returns 匹配的模型对象，未找到时返回 undefined
 */
export function getModelById(id: string): ModelItem | undefined {
  return mockModels.find(model => model.id === id)
    || mockModels.find(model => model.name.toLowerCase().replace(/[\s.]+/g, '-') === id)
}

/**
 * 根据状态筛选模型列表
 *
 * @param status - 目标状态（running / stopped / error）
 * @returns 符合状态条件的模型数组
 */
export function getModelsByStatus(status: ModelStatus): ModelItem[] {
  return mockModels.filter(model => model.status === status)
}
