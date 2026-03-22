/**
 * @description 模型模块 Mock 数据集中管理
 * @author Timon
 */
import type { TrainingJob, Deployment } from '@/types/models'

/** 训练任务 Mock 数据 */
export const mockTrainingJobs: TrainingJob[] = [
  { id: 't1', name: '客服模型 v2 微调', baseModel: 'Qwen2.5-72B', dataset: '客服对话数据', status: 'running', progress: 67, epochs: '3/5', loss: '0.342', duration: '2h 15m', createdAt: '1 小时前' },
  { id: 't2', name: '代码审查模型', baseModel: 'DeepSeek-V3', dataset: '代码审查数据', status: 'completed', progress: 100, epochs: '5/5', loss: '0.128', duration: '4h 32m', createdAt: '3 小时前' },
  { id: 't3', name: '文档摘要 LoRA', baseModel: 'GPT-4o', dataset: '产品文档', status: 'failed', progress: 45, epochs: '2/5', loss: '—', duration: '1h 08m', createdAt: '5 小时前' },
  { id: 't4', name: 'FAQ 问答优化', baseModel: 'Qwen2.5-72B', dataset: 'FAQ问答对', status: 'queued', progress: 0, epochs: '0/3', loss: '—', duration: '—', createdAt: '10 分钟前' },
  { id: 't5', name: '多轮对话增强', baseModel: 'Claude 3.5', dataset: '多轮对话', status: 'completed', progress: 100, epochs: '4/4', loss: '0.091', duration: '6h 12m', createdAt: '1 天前' },
]

/** 部署实例 Mock 数据 */
export const mockDeployments: Deployment[] = [
  { id: 'd1', name: '客服助手推理服务', model: 'Qwen2.5-72B-SFT', endpoint: 'https://api.example.com/v1/chat/customer', status: 'running', replicas: 3, qps: 1250, latency: '120ms', region: '华北2', createdAt: '2026-03-18 10:00' },
  { id: 'd2', name: '文档摘要服务', model: 'GPT-4o', endpoint: 'https://api.example.com/v1/summary', status: 'running', replicas: 2, qps: 860, latency: '340ms', region: '华东1', createdAt: '2026-03-15 14:30' },
  { id: 'd3', name: '代码审查服务', model: 'DeepSeek-V3', endpoint: 'https://api.example.com/v1/code-review', status: 'deploying', replicas: 1, qps: 0, latency: '—', region: '华北2', createdAt: '2026-03-21 09:20' },
  { id: 'd4', name: '翻译服务', model: 'Qwen2.5-72B', endpoint: 'https://api.example.com/v1/translate', status: 'stopped', replicas: 0, qps: 0, latency: '—', region: '华南1', createdAt: '2026-03-10 16:45' },
  { id: 'd5', name: '知识问答服务', model: 'Claude 3.5 Sonnet', endpoint: 'https://api.example.com/v1/qa', status: 'running', replicas: 4, qps: 2100, latency: '95ms', region: '华北2', createdAt: '2026-03-12 08:00' },
  { id: 'd6', name: '数据分析服务（旧版）', model: 'GPT-4o-mini', endpoint: 'https://api.example.com/v1/analysis-legacy', status: 'failed', replicas: 0, qps: 0, latency: '—', region: '华东1', createdAt: '2026-03-20 22:10' },
]
