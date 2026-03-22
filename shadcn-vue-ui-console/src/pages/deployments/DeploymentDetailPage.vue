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
import { Separator } from '@ui/components/ui/separator'
import { Skeleton } from '@ui/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
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
  ArrowLeft,
  Clock,
  Globe,
  Play,
  RefreshCw,
  Server,
  Settings,
  Sparkles,
  Square,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-vue-next'
/**
 * @description 部署详情页 — Tab 布局：服务监控 / 部署配置 / 操作
 * @author Timon
 */
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// ==================== 部署服务数据 ====================

type DeployStatus = 'running' | 'stopped' | 'deploying' | 'failed'

const deployment = ref({
  id: route.params.id as string,
  name: '客服助手推理服务',
  model: 'Qwen2.5-72B-SFT',
  endpoint: 'https://api.example.com/v1/chat/customer',
  status: 'running' as DeployStatus,
  replicas: 3,
  qps: 1250,
  latency: '120ms',
  successRate: 99.7,
  region: '华北2',
  autoScale: true,
  createdAt: '2026-03-18 10:00',
})

const statusConfig: Record<DeployStatus, { label: string, dotClass: string, badgeClass: string }> = {
  running: { label: '运行中', dotClass: 'bg-success animate-pulse', badgeClass: 'bg-success/10 text-success' },
  stopped: { label: '已停止', dotClass: 'bg-muted-foreground', badgeClass: 'bg-muted text-muted-foreground' },
  deploying: { label: '部署中', dotClass: 'bg-primary animate-pulse', badgeClass: 'bg-primary/10 text-primary' },
  failed: { label: '失败', dotClass: 'bg-destructive', badgeClass: 'bg-destructive/10 text-destructive' },
}

// ==================== 统计卡片 ====================

const stats = computed(() => [
  {
    label: '当前 QPS',
    value: deployment.value.qps > 0 ? deployment.value.qps.toLocaleString() : '—',
    icon: Zap,
    iconBase: 'text-chart-5/20 dark:text-chart-5/10',
    iconHover: 'group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25',
    glow: 'from-chart-5/30 via-chart-5/8 to-transparent',
  },
  {
    label: '平均延迟',
    value: deployment.value.latency,
    icon: Clock,
    iconBase: 'text-chart-1/20 dark:text-chart-1/10',
    iconHover: 'group-hover:text-chart-1/40 dark:group-hover:text-chart-1/25',
    glow: 'from-chart-1/30 via-chart-1/8 to-transparent',
  },
  {
    label: '成功率',
    value: deployment.value.successRate > 0 ? `${deployment.value.successRate}%` : '—',
    icon: TrendingUp,
    iconBase: 'text-success/20 dark:text-success/10',
    iconHover: 'group-hover:text-success/40 dark:group-hover:text-success/25',
    glow: 'from-success/30 via-success/8 to-transparent',
  },
  {
    label: '副本数',
    value: deployment.value.replicas.toString(),
    icon: Server,
    iconBase: 'text-chart-4/20 dark:text-chart-4/10',
    iconHover: 'group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25',
    glow: 'from-chart-4/30 via-chart-4/8 to-transparent',
  },
])

// ==================== 调用记录 ====================

interface CallRecord {
  time: string
  user: string
  tokens: number
  latency: string
  status: 'success' | 'error'
}

const callRecords = ref<CallRecord[]>([
  { time: '10:32:15', user: 'user_a8k2x', tokens: 342, latency: '115ms', status: 'success' },
  { time: '10:32:12', user: 'user_m3n7p', tokens: 1208, latency: '287ms', status: 'success' },
  { time: '10:32:08', user: 'user_q9w1e', tokens: 89, latency: '62ms', status: 'success' },
  { time: '10:31:55', user: 'user_z4c6v', tokens: 2041, latency: '520ms', status: 'error' },
  { time: '10:31:49', user: 'user_b5n8m', tokens: 456, latency: '134ms', status: 'success' },
])

// ==================== 对话框 ====================

const showDeleteDialog = ref(false)

// ==================== 事件处理 ====================

/** 启动 / 停止服务 */
function handleToggle() {
  if (deployment.value.status === 'running') {
    deployment.value.status = 'stopped'
    deployment.value.replicas = 0
    deployment.value.qps = 0
    deployment.value.latency = '—'
    deployment.value.successRate = 0
    toast.info('已停止', { description: deployment.value.name })
  }
  else {
    deployment.value.status = 'deploying'
    toast.info('启动中', { description: deployment.value.name })
  }
}

/** 重新部署 */
function handleRedeploy() {
  deployment.value.status = 'deploying'
  toast.info('已提交重新部署', { description: deployment.value.name })
}

/** 编辑配置 */
function handleEditConfig() {
  toast.info('编辑配置', { description: '配置编辑功能开发中' })
}

/** 弹性扩缩容 */
function handleScale() {
  toast.info('弹性扩缩容', { description: `${deployment.value.name} — 当前 ${deployment.value.replicas} 副本` })
}

/** 执行删除 */
function handleDelete() {
  showDeleteDialog.value = false
  toast.success('已删除', { description: deployment.value.name })
  router.push('/deployments')
}
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-8">
      <div class="flex items-center gap-3">
        <Skeleton class="size-9 rounded-xl" />
        <div class="space-y-2">
          <Skeleton class="h-7 w-48" />
          <Skeleton class="h-4 w-80" />
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton v-for="i in 4" :key="i" class="h-[100px] rounded-xl" />
      </div>
      <Skeleton class="h-[400px] rounded-xl" />
    </div>

    <div v-else class="flex flex-col gap-8">
      <!-- 顶部区域：返回 + 服务名称 + 状态 + 模型标签 -->
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            class="mt-0.5 shrink-0"
            @click="router.back()"
          >
            <ArrowLeft class="size-4" />
          </Button>
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-2xl font-bold tracking-tight text-foreground">
                {{ deployment.name }}
              </h2>
              <Badge
                variant="secondary"
                :class="cn('gap-1.5 border-0 text-[11px] font-medium', statusConfig[deployment.status].badgeClass)"
              >
                <span :class="cn('size-1.5 rounded-full', statusConfig[deployment.status].dotClass)" />
                {{ statusConfig[deployment.status].label }}
              </Badge>
              <Badge variant="outline" class="text-[11px] gap-1">
                <Sparkles class="size-3" />
                {{ deployment.model }}
              </Badge>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">
              创建于 {{ deployment.createdAt }} · 区域：{{ deployment.region }}
            </p>
          </div>
        </div>
      </div>

      <!-- 统计卡片 — HUD 水印风格 -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in stats"
          :key="item.label"
          class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
        >
          <!-- 大图标水印 — 右侧居中 -->
          <component
            :is="item.icon"
            :class="cn(
              'absolute right-4 top-1/2 -translate-y-1/2 size-20 transition-all duration-700 ease-out',
              'group-hover:scale-125 group-hover:rotate-6',
              item.iconBase, item.iconHover,
            )"
          />
          <!-- 径向光晕衍射 -->
          <div :class="cn('absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100', item.glow)" />

          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">{{ item.label }}</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 区域 -->
      <Tabs default-value="monitor">
        <TabsList class="rounded-xl p-1">
          <TabsTrigger value="monitor" class="gap-1.5 rounded-lg">
            <Activity class="size-3.5" />
            服务监控
          </TabsTrigger>
          <TabsTrigger value="config" class="gap-1.5 rounded-lg">
            <Settings class="size-3.5" />
            部署配置
          </TabsTrigger>
          <TabsTrigger value="actions" class="gap-1.5 rounded-lg">
            <Zap class="size-3.5" />
            操作
          </TabsTrigger>
        </TabsList>

        <!-- ==================== Tab 1：服务监控 ==================== -->
        <TabsContent value="monitor">
          <div class="space-y-4">
            <!-- 基本信息 -->
            <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
              <CardHeader>
                <CardTitle class="text-[15px] font-semibold">基本信息</CardTitle>
                <CardDescription>服务部署概览</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="rounded-xl border border-border/40 p-5 space-y-2.5">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">服务名称</span>
                      <span class="font-medium">{{ deployment.name }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">端点 URL</span>
                      <span class="font-mono text-xs text-muted-foreground/80 truncate max-w-[260px]">{{ deployment.endpoint }}</span>
                    </div>
                  </div>
                  <div class="rounded-xl border border-border/40 p-5 space-y-2.5">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">部署区域</span>
                      <Badge variant="outline" class="text-[10px] tracking-wide">
                        <Globe class="mr-1 size-3" />
                        {{ deployment.region }}
                      </Badge>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">创建时间</span>
                      <span class="font-medium tabular-nums">{{ deployment.createdAt }}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- 最近调用记录 -->
            <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
              <CardHeader>
                <CardTitle class="text-[15px] font-semibold">最近调用</CardTitle>
                <CardDescription>最近 5 条推理调用记录</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow class="border-border/50">
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">时间</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">用户</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Token 数</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">延迟</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow
                      v-for="(record, index) in callRecords"
                      :key="index"
                      class="border-border/50 transition-colors duration-200 hover:bg-muted/30"
                    >
                      <TableCell class="tabular-nums text-[13px] font-mono text-muted-foreground">{{ record.time }}</TableCell>
                      <TableCell class="text-[13px] font-mono text-muted-foreground">{{ record.user }}</TableCell>
                      <TableCell class="tabular-nums text-[13px] font-medium">{{ record.tokens.toLocaleString() }}</TableCell>
                      <TableCell class="tabular-nums text-[13px] text-muted-foreground">{{ record.latency }}</TableCell>
                      <TableCell>
                        <Badge
                          :variant="record.status === 'success' ? 'secondary' : 'destructive'"
                          class="text-[10px] tracking-wide"
                        >
                          {{ record.status === 'success' ? '成功' : '失败' }}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- ==================== Tab 2：部署配置 ==================== -->
        <TabsContent value="config">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px] font-semibold">部署配置</CardTitle>
              <CardDescription>当前部署服务的完整配置信息</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- 模型与部署 -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-xl border border-border/40 p-5 space-y-3">
                  <h4 class="text-xs font-medium uppercase tracking-wider text-muted-foreground">模型信息</h4>
                  <div class="space-y-2.5">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">模型名称</span>
                      <span class="font-medium">{{ deployment.model }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">部署区域</span>
                      <Badge variant="outline" class="text-[10px] tracking-wide">{{ deployment.region }}</Badge>
                    </div>
                  </div>
                </div>
                <div class="rounded-xl border border-border/40 p-5 space-y-3">
                  <h4 class="text-xs font-medium uppercase tracking-wider text-muted-foreground">运行配置</h4>
                  <div class="space-y-2.5">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">副本数</span>
                      <span class="font-medium tabular-nums">{{ deployment.replicas }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">自动扩缩容</span>
                      <Badge :variant="deployment.autoScale ? 'secondary' : 'outline'" class="text-[10px]">
                        {{ deployment.autoScale ? '已启用' : '未启用' }}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator class="!bg-border/40" />

              <!-- 端点信息 -->
              <div class="rounded-xl border border-border/40 p-5 space-y-3">
                <h4 class="text-xs font-medium uppercase tracking-wider text-muted-foreground">端点信息</h4>
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">端点 URL</span>
                    <span class="font-mono text-xs text-muted-foreground/80">{{ deployment.endpoint }}</span>
                  </div>
                </div>
              </div>

              <Separator class="!bg-border/40" />

              <!-- 操作按钮 -->
              <div class="flex items-center gap-3">
                <Button size="sm" variant="outline" @click="handleEditConfig">
                  <Settings class="mr-2 size-4" />
                  编辑配置
                </Button>
                <Button size="sm" variant="outline" @click="handleScale">
                  <Server class="mr-2 size-4" />
                  扩缩容
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- ==================== Tab 3：操作 ==================== -->
        <TabsContent value="actions">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px] font-semibold">操作</CardTitle>
              <CardDescription>启停服务、重新部署或删除当前部署</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- 启动 / 停止 -->
              <div class="flex items-center justify-between rounded-xl border border-border/40 p-5">
                <div>
                  <h4 class="text-sm font-medium">{{ deployment.status === 'running' ? '停止服务' : '启动服务' }}</h4>
                  <p class="mt-1 text-xs text-muted-foreground">
                    {{ deployment.status === 'running' ? '停止后将立即释放计算资源' : '重新启动推理服务' }}
                  </p>
                </div>
                <Button
                  size="sm"
                  :variant="deployment.status === 'running' ? 'outline' : 'default'"
                  @click="handleToggle"
                >
                  <component :is="deployment.status === 'running' ? Square : Play" class="mr-2 size-4" />
                  {{ deployment.status === 'running' ? '停止' : '启动' }}
                </Button>
              </div>

              <!-- 重新部署 -->
              <div class="flex items-center justify-between rounded-xl border border-border/40 p-5">
                <div>
                  <h4 class="text-sm font-medium">重新部署</h4>
                  <p class="mt-1 text-xs text-muted-foreground">
                    使用当前配置重新部署服务
                  </p>
                </div>
                <Button variant="outline" size="sm" @click="handleRedeploy">
                  <RefreshCw class="mr-2 size-4" />
                  重新部署
                </Button>
              </div>

              <Separator class="!bg-border/40" />

              <!-- 删除 -->
              <div class="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/[0.02] p-5">
                <div>
                  <h4 class="text-sm font-medium text-destructive">删除部署</h4>
                  <p class="mt-1 text-xs text-muted-foreground">
                    删除后不可恢复，服务将被立即停止并释放所有资源
                  </p>
                </div>
                <Button variant="destructive" size="sm" @click="showDeleteDialog = true">
                  <Trash2 class="mr-2 size-4" />
                  删除
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <!-- 删除确认对话框 -->
      <ConfirmDialog
        v-model:open="showDeleteDialog"
        title="删除部署服务"
        :description="`确定要删除「${deployment.name}」吗？服务将被立即停止并释放资源。`"
        confirm-text="删除"
        @confirm="handleDelete"
      />
    </div>
  </div>
</template>
