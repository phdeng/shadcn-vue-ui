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
import { Skeleton } from '@ui/components/ui/skeleton'
import { cn } from '@ui/lib/utils'
import {
  Activity,
  CheckCircle2,
  ClipboardCheck,
  MoreHorizontal,
  Plus,
  Search,
  XCircle,
} from 'lucide-vue-next'
/**
 * @description 模型评测页 — 管理评测任务与评测报告
 * @author Timon
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const router = useRouter()
const searchQuery = ref('')
const loading = ref(true)
setTimeout(() => { loading.value = false }, 600)

// ==================== 类型定义 ====================

type EvaluationStatus = 'running' | 'completed' | 'failed'

interface EvaluationJob {
  id: string
  name: string
  model: string
  dataset: string
  status: EvaluationStatus
  score: number | null
  createdAt: string
}

// ==================== Mock 数据 ====================

const jobs = ref<EvaluationJob[]>([
  { id: 'e1', name: '客服模型 v2 综合评测', model: 'Qwen2.5-72B', dataset: '客服对话测试集', status: 'completed', score: 87.3, createdAt: '2 小时前' },
  { id: 'e2', name: '代码审查模型基线', model: 'DeepSeek-V3', dataset: '代码审查评测集', status: 'running', score: null, createdAt: '30 分钟前' },
  { id: 'e3', name: '文档摘要质量验证', model: 'GPT-4o', dataset: '产品文档摘要', status: 'completed', score: 92.1, createdAt: '5 小时前' },
  { id: 'e4', name: 'FAQ 问答准确率测试', model: 'Qwen2.5-72B', dataset: 'FAQ 验证集', status: 'failed', score: null, createdAt: '1 天前' },
  { id: 'e5', name: '多轮对话连贯性评测', model: 'Claude 3.5', dataset: '多轮对话测试', status: 'completed', score: 94.6, createdAt: '1 天前' },
])

// ==================== 状态配置 ====================

const statusConfig: Record<EvaluationStatus, { label: string, dotClass: string, badgeClass: string }> = {
  running: { label: '进行中', dotClass: 'bg-primary animate-pulse', badgeClass: 'bg-primary/10 text-primary' },
  completed: { label: '已完成', dotClass: 'bg-success', badgeClass: 'bg-success/10 text-success' },
  failed: { label: '失败', dotClass: 'bg-destructive', badgeClass: 'bg-destructive/10 text-destructive' },
}

// ==================== 搜索过滤 ====================

/** 根据搜索关键词过滤评测任务 */
const filteredJobs = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query)
    return jobs.value
  return jobs.value.filter(
    j =>
      j.name.toLowerCase().includes(query)
      || j.model.toLowerCase().includes(query)
      || j.dataset.toLowerCase().includes(query),
  )
})

// ==================== 统计 ====================

const stats = computed(() => ({
  total: jobs.value.length,
  running: jobs.value.filter(j => j.status === 'running').length,
  completed: jobs.value.filter(j => j.status === 'completed').length,
}))

// ==================== 对话框状态 ====================

const showDeleteDialog = ref(false)
const deleteTarget = ref<EvaluationJob | null>(null)

// ==================== 事件处理 ====================

/** 查看评测报告 */
function handleViewReport(job: EvaluationJob) {
  router.push(`/evaluation/${job.id}`)
}

/** 重新评测 */
function handleRerun(job: EvaluationJob) {
  job.status = 'running'
  job.score = null
  toast.info('已提交重新评测', { description: job.name })
}

/** 打开删除确认 */
function handleDeleteConfirm(job: EvaluationJob) {
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

/** 创建评测任务（占位） */
function handleCreate() {
  toast.info('创建评测任务', { description: '功能开发中' })
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
            模型评测
          </h2>
          <p class="mt-1 text-sm text-muted-foreground">
            创建评测任务，验证模型在各类数据集上的表现
          </p>
        </div>
        <Button size="sm" @click="handleCreate">
          <Plus class="mr-2 size-4" />
          创建评测任务
        </Button>
      </div>

      <!-- 统计概览 — HUD 水印风格 -->
      <div class="grid gap-4 sm:grid-cols-3">
        <!-- 总评测数 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <ClipboardCheck class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-muted-foreground/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-muted-foreground/20" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">总评测数</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.total }}
            </div>
          </div>
        </div>
        <!-- 进行中 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Activity class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-primary/20 dark:text-primary/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-primary/40 dark:group-hover:text-primary/25" />
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial from-primary/30 via-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">进行中</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.running }}
            </div>
          </div>
        </div>
        <!-- 已完成 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <CheckCircle2 class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-success/20 dark:text-success/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-success/40 dark:group-hover:text-success/25" />
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial from-success/30 via-success/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">已完成</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.completed }}
            </div>
          </div>
        </div>
      </div>

      <!-- 评测任务表格 -->
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between">
            <CardTitle class="text-[15px] font-semibold">
              评测任务
            </CardTitle>
            <div class="relative w-64">
              <Search class="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input v-model="searchQuery" placeholder="搜索评测任务..." class="pl-9 h-9 rounded-xl text-xs" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>评测任务名</TableHead>
                <TableHead>模型</TableHead>
                <TableHead>评测数据集</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>综合评分</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead class="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="job in filteredJobs" :key="job.id" class="group cursor-pointer" @click="handleViewReport(job)">
                <TableCell class="font-medium">
                  {{ job.name }}
                </TableCell>
                <TableCell class="text-muted-foreground text-xs">
                  {{ job.model }}
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
                  <span v-if="job.score !== null" class="text-sm font-semibold tabular-nums">
                    {{ job.score }}
                  </span>
                  <span v-else class="text-xs text-muted-foreground">—</span>
                </TableCell>
                <TableCell class="text-xs text-muted-foreground">
                  {{ job.createdAt }}
                </TableCell>
                <TableCell @click.stop>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="size-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal class="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleViewReport(job)">
                        查看报告
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleRerun(job)">
                        重新评测
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
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

      <!-- 删除确认对话框 -->
      <ConfirmDialog
        v-model:open="showDeleteDialog"
        title="删除评测任务"
        :description="`确定要删除「${deleteTarget?.name}」吗？此操作不可撤销。`"
        confirm-text="删除"
        @confirm="handleDelete"
      />
    </div>
  </div>
</template>
