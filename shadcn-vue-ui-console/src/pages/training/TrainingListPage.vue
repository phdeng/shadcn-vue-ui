<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Input } from '@ui/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table'
import { cn } from '@ui/lib/utils'
import {
  Activity,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  XCircle,
} from 'lucide-vue-next'
/**
 * @description 模型训练页 — 管理微调任务与训练日志
 * @author Timon
 */
import { Skeleton } from '@ui/components/ui/skeleton'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import TrainingCreateDialog from '@/components/training/TrainingCreateDialog.vue'

const searchQuery = ref('')
const loading = ref(true)
setTimeout(() => { loading.value = false }, 600)

type TrainingStatus = 'running' | 'completed' | 'failed' | 'queued'

interface TrainingJob {
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

const jobs = ref<TrainingJob[]>([
  { id: 't1', name: '客服模型 v2 微调', baseModel: 'Qwen2.5-72B', dataset: '客服对话数据', status: 'running', progress: 67, epochs: '3/5', loss: '0.342', duration: '2h 15m', createdAt: '1 小时前' },
  { id: 't2', name: '代码审查模型', baseModel: 'DeepSeek-V3', dataset: '代码审查数据', status: 'completed', progress: 100, epochs: '5/5', loss: '0.128', duration: '4h 32m', createdAt: '3 小时前' },
  { id: 't3', name: '文档摘要 LoRA', baseModel: 'GPT-4o', dataset: '产品文档', status: 'failed', progress: 45, epochs: '2/5', loss: '—', duration: '1h 08m', createdAt: '5 小时前' },
  { id: 't4', name: 'FAQ 问答优化', baseModel: 'Qwen2.5-72B', dataset: 'FAQ问答对', status: 'queued', progress: 0, epochs: '0/3', loss: '—', duration: '—', createdAt: '10 分钟前' },
  { id: 't5', name: '多轮对话增强', baseModel: 'Claude 3.5', dataset: '多轮对话', status: 'completed', progress: 100, epochs: '4/4', loss: '0.091', duration: '6h 12m', createdAt: '1 天前' },
])

const statusConfig: Record<TrainingStatus, { label: string, icon: typeof Play, dotClass: string, badgeClass: string }> = {
  running: { label: '训练中', icon: Activity, dotClass: 'bg-blue-500 animate-pulse', badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' },
  completed: { label: '已完成', icon: CheckCircle2, dotClass: 'bg-emerald-500', badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' },
  failed: { label: '失败', icon: XCircle, dotClass: 'bg-red-500', badgeClass: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400' },
  queued: { label: '排队中', icon: Clock, dotClass: 'bg-gray-400', badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400' },
}

// ==================== 搜索过滤 ====================

/** 根据搜索关键词过滤训练任务 */
const filteredJobs = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query)
    return jobs.value
  return jobs.value.filter(
    j =>
      j.name.toLowerCase().includes(query)
      || j.baseModel.toLowerCase().includes(query)
      || j.dataset.toLowerCase().includes(query),
  )
})

// 统计（改为 computed 以响应数据变更）
const stats = computed(() => ({
  total: jobs.value.length,
  running: jobs.value.filter(j => j.status === 'running').length,
  completed: jobs.value.filter(j => j.status === 'completed').length,
}))

// ==================== 对话框状态 ====================

const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const deleteTarget = ref<TrainingJob | null>(null)

// ==================== 事件处理 ====================

/** 创建训练任务提交 */
function handleCreateSubmit(data: { name: string }) {
  toast.success('训练任务已创建', { description: data.name })
}

/** 查看日志 */
function handleViewLogs(job: TrainingJob) {
  toast.info(`查看训练日志：${job.name}`, { description: `状态: ${statusConfig[job.status].label}` })
}

/** 导出模型 */
function handleExport(job: TrainingJob) {
  if (job.status !== 'completed') {
    toast.warning('仅已完成的训练任务支持导出')
    return
  }
  toast.success('开始导出模型', { description: job.name })
}

/** 暂停训练 */
function handlePause(job: TrainingJob) {
  job.status = 'queued'
  toast.info('训练已暂停', { description: job.name })
}

/** 重新训练 */
function handleRetrain(job: TrainingJob) {
  job.status = 'queued'
  job.progress = 0
  toast.info('已提交重新训练', { description: job.name })
}

/** 打开删除确认 */
function handleDeleteConfirm(job: TrainingJob) {
  deleteTarget.value = job
  showDeleteDialog.value = true
}

/** 执行删除 */
function handleDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  jobs.value = jobs.value.filter(j => j.id !== deleteTarget.value!.id)
  showDeleteDialog.value = false
  deleteTarget.value = null
  toast.success('已删除', { description: name })
}
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-6">
    <div class="flex items-end justify-between">
      <div class="space-y-2">
        <Skeleton class="h-8 w-32" />
        <Skeleton class="h-4 w-64" />
      </div>
      <Skeleton class="h-9 w-32" />
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <Skeleton v-for="i in 3" :key="i" class="h-[88px] rounded-xl" />
    </div>
    <Skeleton class="h-[360px] rounded-xl" />
  </div>

  <div v-else class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          模型训练
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          管理微调任务、训练参数与训练日志
        </p>
      </div>
      <Button size="sm" @click="showCreateDialog = true">
        <Plus class="mr-2 size-4" />
        创建训练任务
      </Button>
    </div>

    <!-- 统计概览 -->
    <div class="grid gap-4 sm:grid-cols-3">
      <Card class="border-0 shadow-sm">
        <CardContent class="flex items-center justify-between pt-5">
          <div>
            <p class="text-xs text-muted-foreground">
              总任务数
            </p>
            <p class="text-2xl font-bold">
              {{ stats.total }}
            </p>
          </div>
          <div class="rounded-lg bg-muted p-2.5">
            <Activity class="size-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      <Card class="border-0 shadow-sm">
        <CardContent class="flex items-center justify-between pt-5">
          <div>
            <p class="text-xs text-muted-foreground">
              训练中
            </p>
            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ stats.running }}
            </p>
          </div>
          <div class="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-950/50">
            <Play class="size-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>
      <Card class="border-0 shadow-sm">
        <CardContent class="flex items-center justify-between pt-5">
          <div>
            <p class="text-xs text-muted-foreground">
              已完成
            </p>
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {{ stats.completed }}
            </p>
          </div>
          <div class="rounded-lg bg-emerald-50 p-2.5 dark:bg-emerald-950/50">
            <CheckCircle2 class="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 训练任务表格 -->
    <Card class="border-0 shadow-sm">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <CardTitle class="text-base">
            训练任务
          </CardTitle>
          <div class="relative w-64">
            <Search class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input v-model="searchQuery" placeholder="搜索任务..." class="pl-8 h-8 text-xs" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>任务名称</TableHead>
              <TableHead>基座模型</TableHead>
              <TableHead>数据集</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>进度</TableHead>
              <TableHead>Epochs</TableHead>
              <TableHead>Loss</TableHead>
              <TableHead>耗时</TableHead>
              <TableHead class="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="job in filteredJobs" :key="job.id" class="group">
              <TableCell class="font-medium">
                {{ job.name }}
              </TableCell>
              <TableCell class="text-muted-foreground text-xs">
                {{ job.baseModel }}
              </TableCell>
              <TableCell class="text-muted-foreground text-xs">
                {{ job.dataset }}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  :class="cn('gap-1.5 border-0 text-[11px] font-medium', statusConfig[job.status].badgeClass)"
                >
                  <span :class="cn('size-1.5 rounded-full', statusConfig[job.status].dotClass)" />
                  {{ statusConfig[job.status].label }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <div class="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: `${job.progress}%` }"
                    />
                  </div>
                  <span class="text-xs text-muted-foreground tabular-nums">{{ job.progress }}%</span>
                </div>
              </TableCell>
              <TableCell class="text-xs tabular-nums">
                {{ job.epochs }}
              </TableCell>
              <TableCell class="text-xs tabular-nums font-mono">
                {{ job.loss }}
              </TableCell>
              <TableCell class="text-xs text-muted-foreground">
                {{ job.duration }}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="size-7 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal class="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="handleViewLogs(job)">
                      查看日志
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="handleExport(job)">
                      导出模型
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem v-if="job.status === 'running'" class="text-amber-600" @click="handlePause(job)">
                      暂停训练
                    </DropdownMenuItem>
                    <DropdownMenuItem v-if="job.status === 'failed'" class="text-blue-600" @click="handleRetrain(job)">
                      重新训练
                    </DropdownMenuItem>
                    <DropdownMenuItem class="text-destructive" @click="handleDeleteConfirm(job)">
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- 创建训练任务对话框 -->
    <TrainingCreateDialog
      v-model:open="showCreateDialog"
      @submit="handleCreateSubmit"
    />

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除训练任务"
      :description="`确定要删除「${deleteTarget?.name}」吗？此操作不可撤销。`"
      confirm-text="删除"
      @confirm="handleDelete"
    />
  </div>
  </div>
</template>
