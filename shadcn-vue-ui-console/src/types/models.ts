/**
 * @description 模型模块统一类型定义
 * @author Timon
 */

/** 数据集状态 */
export type DatasetStatus = 'processed' | 'processing' | 'pending'

/** 数据集格式 */
export type DatasetFormat = 'JSONL' | 'JSON' | 'CSV' | 'TXT' | 'XLSX'

/** 数据模态类型 */
export type DataModality = 'text' | 'image' | 'audio' | 'video' | 'multimodal'

/** 数据集项 */
export interface DatasetItem {
  id: string
  name: string
  records: number
  size: string
  format: DatasetFormat
  modality?: DataModality
  status: DatasetStatus
  updatedAt: string
}

/** 模型状态 */
export type ModelStatus = 'running' | 'stopped' | 'error'

/** 模型提供方 */
export type ModelProvider = 'OpenAI' | 'Anthropic' | 'Qwen' | 'DeepSeek' | 'Baichuan' | 'Meta'

/** 训练任务状态 */
export type TrainingStatus = 'running' | 'completed' | 'failed' | 'queued'

/** 训练任务 */
export interface TrainingJob {
  id: string
  name: string
  baseModel: string
  dataset: string
  status: TrainingStatus
  progress: number
  epochs: string
  loss: string
  duration: string
  createdAt: string
}

/** 部署状态 */
export type DeployStatus = 'running' | 'stopped' | 'deploying' | 'failed'

/** 部署实例 */
export interface Deployment {
  id: string
  name: string
  model: string
  endpoint: string
  status: DeployStatus
  replicas: number
  qps: number
  latency: string
  region: string
  createdAt: string
}

/** 评测状态 */
export type EvaluationStatus = 'running' | 'completed' | 'failed'

/** 知识库状态 */
export type KnowledgeBaseStatus = 'ready' | 'indexing' | 'error'

/** 知识库类型 */
export type KnowledgeBaseType = 'unstructured' | 'structured' | 'qa'
