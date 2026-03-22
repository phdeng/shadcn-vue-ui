<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
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
import { Separator } from '@ui/components/ui/separator'
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
  Clock,
  Globe,
  MoreHorizontal,
  Plus,
  Rocket,
  Search,
  Server,
  Zap,
} from 'lucide-vue-next'
/**
 * @description 模型部署管理页 — 管理模型推理服务的部署与监控
 * @author Timon
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import PageLoading from '@/components/common/PageLoading.vue'

const router = useRouter()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 600)
const searchQuery = ref('')
const showDeleteDialog = ref(false)

// ==================== 类型与数据 ====================

type DeployStatus = 'running' | 'stopped' | 'deploying' | 'failed'

interface Deployment {
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

const statusConfig: Record<DeployStatus, { label: string, dotClass: string, badgeVariant: 'secondary' | 'outline' | 'destructive' }> = {
  running: { label: '运行中', dotClass: 'bg-success', badgeVariant: 'secondary' },
  stopped: { label: '已停止', dotClass: 'bg-muted-foreground', badgeVariant: 'outline' },
  deploying: { label: '部署中', dotClass: 'bg-primary animate-pulse', badgeVariant: 'secondary' },
  failed: { label: '失败', dotClass: 'bg-destructive', badgeVariant: 'destructive' },
}

const deployments = ref<Deployment[]>([
  { id: 'd1', name: '客服助手推理服务', model: 'Qwen2.5-72B-SFT', endpoint: 'https://api.example.com/v1/chat/customer', status: 'running', replicas: 3, qps: 1250, latency: '120ms', region: '华北2', createdAt: '2026-03-18 10:00' },
  { id: 'd2', name: '文档摘要服务', model: 'GPT-4o', endpoint: 'https://api.example.com/v1/summary', status: 'running', replicas: 2, qps: 860, latency: '340ms', region: '华东1', createdAt: '2026-03-15 14:30' },
  { id: 'd3', name: '代码审查服务', model: 'DeepSeek-V3', endpoint: 'https://api.example.com/v1/code-review', status: 'deploying', replicas: 1, qps: 0, latency: '—', region: '华北2', createdAt: '2026-03-21 09:20' },
  { id: 'd4', name: '翻译服务', model: 'Qwen2.5-72B', endpoint: 'https://api.example.com/v1/translate', status: 'stopped', replicas: 0, qps: 0, latency: '—', region: '华南1', createdAt: '2026-03-10 16:45' },
  { id: 'd5', name: '知识问答服务', model: 'Claude 3.5 Sonnet', endpoint: 'https://api.example.com/v1/qa', status: 'running', replicas: 4, qps: 2100, latency: '95ms', region: '华北2', createdAt: '2026-03-12 08:00' },
  { id: 'd6', name: '数据分析服务（旧版）', model: 'GPT-4o-mini', endpoint: 'https://api.example.com/v1/analysis-legacy', status: 'failed', replicas: 0, qps: 0, latency: '—', region: '华东1', createdAt: '2026-03-20 22:10' },
])

const stats = computed(() => ({
  total: deployments.value.length,
  running: deployments.value.filter(d => d.status === 'running').length,
  totalQps: deployments.value.reduce((s, d) => s + d.qps, 0),
}))

const filteredDeployments = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return deployments.value
  return deployments.value.filter(d =>
    d.name.toLowerCase().includes(q) || d.model.toLowerCase().includes(q),
  )
})

const deleteTarget = ref<Deployment | null>(null)

// ==================== 事件处理 ====================

function handleCreate() {
  router.push('/deployments/create')
}

function handleDeleteConfirm(d: Deployment) {
  deleteTarget.value = d
  showDeleteDialog.value = true
}

function handleDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  deployments.value = deployments.value.filter(d => d.id !== deleteTarget.value!.id)
  showDeleteDialog.value = false
  deleteTarget.value = null
  toast.success('已删除', { description: name })
}

function handleToggle(d: Deployment) {
  if (d.status === 'running') {
    d.status = 'stopped'
    d.replicas = 0
    d.qps = 0
    d.latency = '—'
    toast.info('已停止', { description: d.name })
  }
  else {
    d.status = 'deploying'
    toast.info('启动中', { description: d.name })
  }
}

function handleScale(d: Deployment) {
  toast.info('弹性扩缩容', { description: `${d.name} — 当前 ${d.replicas} 副本` })
}
</script>

<template>
  <div>
    <PageLoading v-if="loading" :count="5" :cols="1" />

    <div v-else class="flex flex-col gap-8">
      <!-- 页面标题 -->
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">模型部署</h2>
          <p class="mt-1.5 text-[13px] text-muted-foreground">
            管理模型推理服务的部署、监控与弹性扩缩
          </p>
        </div>
        <Button size="sm" @click="handleCreate">
          <Plus class="mr-2 size-4" />
          创建部署
        </Button>
      </div>

      <!-- 统计卡片 — HUD 水印风格 -->
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Server class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-muted-foreground/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-muted-foreground/20" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">部署总数</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.total }}
            </div>
          </div>
        </div>
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Rocket class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-success/20 dark:text-success/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-success/40 dark:group-hover:text-success/25" />
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial from-success/30 via-success/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">运行中</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.running }}
            </div>
          </div>
        </div>
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Zap class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-chart-5/20 dark:text-chart-5/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25" />
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial from-chart-5/30 via-chart-5/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">总 QPS</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stats.totalQps.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- 部署列表 -->
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-[15px] font-semibold">部署服务</CardTitle>
              <CardDescription class="text-[13px]">共 {{ filteredDeployments.length }} 个服务</CardDescription>
            </div>
            <div class="relative w-64">
              <Search class="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input v-model="searchQuery" placeholder="搜索服务名或模型..." class="pl-9 h-9 rounded-xl text-xs" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow class="border-border/50">
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">服务名称</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">模型</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">状态</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">副本</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">QPS</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">延迟</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">区域</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground w-[60px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="d in filteredDeployments"
                :key="d.id"
                class="border-border/50 transition-colors duration-200 hover:bg-muted/30 cursor-pointer"
                @click="router.push(`/deployments/${d.id}`)"
              >
                <TableCell>
                  <div>
                    <span class="font-medium text-sm">{{ d.name }}</span>
                    <p class="mt-0.5 text-[11px] font-mono text-muted-foreground/60 truncate max-w-[280px]">{{ d.endpoint }}</p>
                  </div>
                </TableCell>
                <TableCell class="text-[13px] font-mono text-muted-foreground">{{ d.model }}</TableCell>
                <TableCell>
                  <Badge :variant="statusConfig[d.status].badgeVariant" class="gap-1.5 text-[10px] tracking-wide">
                    <span :class="cn('size-1.5 rounded-full', statusConfig[d.status].dotClass)" />
                    {{ statusConfig[d.status].label }}
                  </Badge>
                </TableCell>
                <TableCell class="tabular-nums text-[13px] text-muted-foreground">{{ d.replicas }}</TableCell>
                <TableCell class="tabular-nums text-[13px] font-medium">{{ d.qps > 0 ? d.qps.toLocaleString() : '—' }}</TableCell>
                <TableCell class="tabular-nums text-[13px] text-muted-foreground">{{ d.latency }}</TableCell>
                <TableCell>
                  <Badge variant="outline" class="text-[10px] tracking-wide">{{ d.region }}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="size-7">
                        <MoreHorizontal class="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click="handleToggle(d)">
                        {{ d.status === 'running' ? '停止' : '启动' }}
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleScale(d)">
                        扩缩容
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive" @click="handleDeleteConfirm(d)">
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <!-- 空状态 -->
          <div
            v-if="filteredDeployments.length === 0"
            class="flex flex-col items-center justify-center gap-4 py-16"
          >
            <Rocket class="size-16 text-muted-foreground/15" />
            <div class="text-center">
              <p class="text-sm font-medium text-muted-foreground">暂无部署服务</p>
              <p class="mt-1 text-[13px] text-muted-foreground/60">创建第一个模型推理服务</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 删除确认 -->
      <ConfirmDialog
        v-model:open="showDeleteDialog"
        title="删除部署服务"
        :description="`确定要删除「${deleteTarget?.name}」吗？服务将被立即停止并释放资源。`"
        confirm-text="删除"
        @confirm="handleDelete"
      />
    </div>
  </div>
</template>
