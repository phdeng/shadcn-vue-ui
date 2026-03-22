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
  Globe,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Workflow,
} from 'lucide-vue-next'
/**
 * @description 工作流列表页 — 管理工作流编排，支持手动/API/定时触发
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

type WorkflowStatus = 'draft' | 'published' | 'disabled'
type TriggerType = 'manual' | 'api' | 'cron'

interface WorkflowItem {
  id: string
  name: string
  trigger: TriggerType
  nodeCount: number
  status: WorkflowStatus
  updatedAt: string
}

// ==================== Mock 数据 ====================

const workflows = ref<WorkflowItem[]>([
  { id: 'wf-1', name: '智能客服问答流', trigger: 'api', nodeCount: 6, status: 'published', updatedAt: '10 分钟前' },
  { id: 'wf-2', name: '文档摘要生成', trigger: 'manual', nodeCount: 4, status: 'published', updatedAt: '2 小时前' },
  { id: 'wf-3', name: '每日数据报告', trigger: 'cron', nodeCount: 5, status: 'published', updatedAt: '6 小时前' },
  { id: 'wf-4', name: '代码审查助手', trigger: 'api', nodeCount: 3, status: 'draft', updatedAt: '1 天前' },
  { id: 'wf-5', name: '内容审核流水线', trigger: 'manual', nodeCount: 7, status: 'disabled', updatedAt: '3 天前' },
])

// ==================== 状态/触发方式配置 ====================

const statusConfig: Record<WorkflowStatus, { label: string, dotClass: string, badgeClass: string }> = {
  published: { label: '已发布', dotClass: 'bg-success', badgeClass: 'bg-success/10 text-success' },
  draft: { label: '草稿', dotClass: 'bg-muted-foreground', badgeClass: 'bg-muted text-muted-foreground' },
  disabled: { label: '已停用', dotClass: 'bg-destructive', badgeClass: 'bg-destructive/10 text-destructive' },
}

const triggerConfig: Record<TriggerType, string> = {
  manual: '手动触发',
  api: 'API 调用',
  cron: '定时任务',
}

// ==================== 搜索过滤 ====================

const filteredWorkflows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return workflows.value
  return workflows.value.filter(w => w.name.toLowerCase().includes(query))
})

// ==================== 统计 ====================

const stats = computed(() => ({
  total: workflows.value.length,
  running: workflows.value.filter(w => w.status === 'published').length,
  published: workflows.value.filter(w => w.status === 'published').length,
}))

// ==================== 对话框状态 ====================

const showDeleteDialog = ref(false)
const deleteTarget = ref<WorkflowItem | null>(null)

// ==================== 事件处理 ====================

function handleViewDetail(wf: WorkflowItem) {
  router.push(`/workflows/${wf.id}`)
}

function handleToggleStatus(wf: WorkflowItem) {
  if (wf.status === 'published') {
    wf.status = 'disabled'
    toast.info('工作流已停用', { description: wf.name })
  } else {
    wf.status = 'published'
    toast.success('工作流已发布', { description: wf.name })
  }
}

function handleDeleteConfirm(wf: WorkflowItem) {
  deleteTarget.value = wf
  showDeleteDialog.value = true
}

function handleDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  workflows.value = workflows.value.filter(w => w.id !== deleteTarget.value!.id)
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
          <h2 class="text-2xl font-semibold tracking-tight">工作流编排</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            编排 Agent 工作流，支持手动触发、API 调用与定时任务
          </p>
        </div>
        <Button size="sm" @click="router.push('/workflows/create')">
          <Plus class="mr-2 size-4" />
          创建工作流
        </Button>
      </div>

      <!-- 统计概览 — HUD 水印风格 -->
      <div class="grid gap-4 sm:grid-cols-3">
        <!-- 总工作流数 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Workflow class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-muted-foreground/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-muted-foreground/20" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">总工作流数</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.total }}
            </div>
          </div>
        </div>
        <!-- 运行中 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Play class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-primary/20 dark:text-primary/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-primary/40 dark:group-hover:text-primary/25" />
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial from-primary/30 via-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">运行中</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.running }}
            </div>
          </div>
        </div>
        <!-- 已发布 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Globe class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-success/20 dark:text-success/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-success/40 dark:group-hover:text-success/25" />
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial from-success/30 via-success/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">已发布</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.published }}
            </div>
          </div>
        </div>
      </div>

      <!-- 工作流表格 -->
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between">
            <CardTitle class="text-[15px] font-semibold">工作流列表</CardTitle>
            <div class="relative w-64">
              <Search class="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input v-model="searchQuery" placeholder="搜索工作流..." class="pl-9 h-9 rounded-xl text-xs" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>工作流名称</TableHead>
                <TableHead>触发方式</TableHead>
                <TableHead>节点数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>最后编辑</TableHead>
                <TableHead class="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="wf in filteredWorkflows"
                :key="wf.id"
                class="group cursor-pointer"
                @click="handleViewDetail(wf)"
              >
                <TableCell class="font-medium">{{ wf.name }}</TableCell>
                <TableCell class="text-xs text-muted-foreground">
                  {{ triggerConfig[wf.trigger] }}
                </TableCell>
                <TableCell class="text-xs tabular-nums">{{ wf.nodeCount }}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    :class="cn('gap-1.5 border-0 text-[11px] font-medium', statusConfig[wf.status].badgeClass)"
                  >
                    <span :class="cn('size-1.5 rounded-full', statusConfig[wf.status].dotClass)" />
                    {{ statusConfig[wf.status].label }}
                  </Badge>
                </TableCell>
                <TableCell class="text-xs text-muted-foreground">{{ wf.updatedAt }}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="size-7 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="更多操作">
                        <MoreHorizontal class="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleViewDetail(wf)">查看详情</DropdownMenuItem>
                      <DropdownMenuItem @click="handleToggleStatus(wf)">
                        {{ wf.status === 'published' ? '停用' : '发布' }}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive" @click="handleDeleteConfirm(wf)">删除</DropdownMenuItem>
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
        title="删除工作流"
        :description="`确定要删除「${deleteTarget?.name}」吗？此操作不可撤销。`"
        confirm-text="删除"
        @confirm="handleDelete"
      />
    </div>
  </div>
</template>
