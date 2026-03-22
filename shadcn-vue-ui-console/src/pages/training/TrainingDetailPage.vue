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
import { cn } from '@ui/lib/utils'
import {
  Activity,
  ArrowLeft,
  Clock,
  Download,
  FileText,
  RefreshCw,
  Settings,
  Sparkles,
  Target,
  Timer,
  Trash2,
  TrendingDown,
} from 'lucide-vue-next'
/**
 * @description 训练详情页 — Tab 布局：训练日志 / 训练参数 / 操作
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

// ==================== 训练任务数据 ====================

type TrainingStatus = 'running' | 'completed' | 'failed' | 'queued'

const job = ref({
  id: route.params.id as string,
  name: '客服模型 v2 微调',
  baseModel: 'Qwen2.5-72B',
  baseModelProvider: '通义千问',
  dataset: '客服对话数据',
  datasetRecords: 12500,
  status: 'running' as TrainingStatus,
  progress: 67,
  currentEpoch: 3,
  totalEpochs: 5,
  currentLoss: 0.342,
  elapsedTime: '2h 15m',
  estimatedRemaining: '1h 08m',
  method: 'SFT',
  learningRate: 0.0001,
  batchSize: 8,
  warmupSteps: 100,
  createdAt: '2026-03-22 08:15',
})

const statusConfig: Record<TrainingStatus, { label: string, dotClass: string, badgeClass: string }> = {
  running: { label: '训练中', dotClass: 'bg-primary animate-pulse', badgeClass: 'bg-primary/10 text-primary' },
  completed: { label: '已完成', dotClass: 'bg-success', badgeClass: 'bg-success/10 text-success' },
  failed: { label: '失败', dotClass: 'bg-destructive', badgeClass: 'bg-destructive/10 text-destructive' },
  queued: { label: '排队中', dotClass: 'bg-muted-foreground', badgeClass: 'bg-muted text-muted-foreground' },
}

// ==================== 统计卡片 ====================

const stats = computed(() => [
  {
    label: '训练进度',
    value: `${job.value.progress}%`,
    icon: Target,
    iconBase: 'text-primary/20 dark:text-primary/10',
    iconHover: 'group-hover:text-primary/40 dark:group-hover:text-primary/25',
    glow: 'from-primary/30 via-primary/8 to-transparent',
  },
  {
    label: '当前 Loss',
    value: job.value.currentLoss === 0 ? '—' : job.value.currentLoss.toFixed(3),
    icon: TrendingDown,
    iconBase: 'text-chart-1/20 dark:text-chart-1/10',
    iconHover: 'group-hover:text-chart-1/40 dark:group-hover:text-chart-1/25',
    glow: 'from-chart-1/30 via-chart-1/8 to-transparent',
  },
  {
    label: '已用时间',
    value: job.value.elapsedTime,
    icon: Clock,
    iconBase: 'text-chart-4/20 dark:text-chart-4/10',
    iconHover: 'group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25',
    glow: 'from-chart-4/30 via-chart-4/8 to-transparent',
  },
  {
    label: '预计剩余',
    value: job.value.estimatedRemaining,
    icon: Timer,
    iconBase: 'text-chart-5/20 dark:text-chart-5/10',
    iconHover: 'group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25',
    glow: 'from-chart-5/30 via-chart-5/8 to-transparent',
  },
])

// ==================== 训练日志 ====================

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

interface LogEntry {
  time: string
  level: LogLevel
  message: string
}

const logFilter = ref<LogLevel | 'ALL'>('ALL')

const logs = ref<LogEntry[]>([
  { time: '08:15:02', level: 'INFO', message: '训练任务初始化完成，加载基座模型 Qwen2.5-72B...' },
  { time: '08:15:18', level: 'INFO', message: '模型加载完成，参数量 72B，显存占用 142 GB' },
  { time: '08:15:19', level: 'INFO', message: '加载数据集：客服对话数据（12,500 条记录）' },
  { time: '08:15:22', level: 'INFO', message: '数据预处理完成，有效样本 12,438 条' },
  { time: '08:15:22', level: 'DEBUG', message: '训练参数：method=SFT lr=1e-4 bs=8 epochs=5 warmup=100' },
  { time: '08:15:23', level: 'INFO', message: '开始训练 Epoch 1/5...' },
  { time: '08:32:45', level: 'INFO', message: '[Epoch 1/5] Step 1562/1562 | Loss: 0.892 | LR: 1.00e-4' },
  { time: '08:32:46', level: 'INFO', message: 'Epoch 1 完成，平均 Loss: 0.892，耗时 17m 23s' },
  { time: '08:32:47', level: 'INFO', message: '开始训练 Epoch 2/5...' },
  { time: '08:50:10', level: 'INFO', message: '[Epoch 2/5] Step 1562/1562 | Loss: 0.534 | LR: 1.00e-4' },
  { time: '08:50:11', level: 'INFO', message: 'Epoch 2 完成，平均 Loss: 0.534，耗时 17m 24s' },
  { time: '08:50:12', level: 'WARN', message: '检测到显存使用率超过 90%，建议降低 Batch Size' },
  { time: '08:50:13', level: 'INFO', message: '开始训练 Epoch 3/5...' },
  { time: '09:02:30', level: 'INFO', message: '[Epoch 3/5] Step 1042/1562 | Loss: 0.342 | LR: 9.80e-5' },
  { time: '09:02:31', level: 'DEBUG', message: 'GPU 0 温度: 78°C，功耗: 342W / 400W' },
])

const logLevelConfig: Record<LogLevel, string> = {
  INFO: 'text-chart-4',
  WARN: 'text-warning',
  ERROR: 'text-destructive',
  DEBUG: 'text-muted-foreground',
}

const filteredLogs = computed(() => {
  if (logFilter.value === 'ALL') return logs.value
  return logs.value.filter(l => l.level === logFilter.value)
})

const logLevels: Array<LogLevel | 'ALL'> = ['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG']

// ==================== 对话框 ====================

const showDeleteDialog = ref(false)

// ==================== 事件处理 ====================

/** 导出模型 — 跳转到部署创建页 */
function handleExport() {
  if (job.value.status !== 'completed') {
    toast.warning('仅已完成的训练任务支持导出模型')
    return
  }
  router.push('/deployments/create')
}

/** 重新训练 */
function handleRetrain() {
  job.value.status = 'queued'
  job.value.progress = 0
  toast.info('已提交重新训练', { description: job.value.name })
}

/** 执行删除 */
function handleDelete() {
  showDeleteDialog.value = false
  toast.success('已删除', { description: job.value.name })
  router.push('/training')
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
      <!-- 顶部区域：返回 + 任务名称 + 状态 + 基座模型 -->
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
                {{ job.name }}
              </h2>
              <Badge
                variant="secondary"
                :class="cn('gap-1.5 border-0 text-[11px] font-medium', statusConfig[job.status].badgeClass)"
              >
                <span :class="cn('size-1.5 rounded-full', statusConfig[job.status].dotClass)" />
                {{ statusConfig[job.status].label }}
              </Badge>
              <Badge variant="outline" class="text-[11px] gap-1">
                <Sparkles class="size-3" />
                {{ job.baseModel }}
              </Badge>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">
              创建于 {{ job.createdAt }} · 数据集：{{ job.dataset }}
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

      <!-- 进度条 -->
      <div class="rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">整体进度</span>
          <span class="text-sm text-muted-foreground tabular-nums">Epoch {{ job.currentEpoch }} / {{ job.totalEpochs }}</span>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            class="h-full rounded-full bg-primary transition-all duration-500"
            :style="{ width: `${job.progress}%` }"
          />
        </div>
      </div>

      <!-- Tab 区域 -->
      <Tabs default-value="logs">
        <TabsList class="rounded-xl p-1">
          <TabsTrigger value="logs" class="gap-1.5 rounded-lg">
            <FileText class="size-3.5" />
            训练日志
          </TabsTrigger>
          <TabsTrigger value="params" class="gap-1.5 rounded-lg">
            <Settings class="size-3.5" />
            训练参数
          </TabsTrigger>
          <TabsTrigger value="actions" class="gap-1.5 rounded-lg">
            <Activity class="size-3.5" />
            操作
          </TabsTrigger>
        </TabsList>

        <!-- ==================== Tab 1：训练日志 ==================== -->
        <TabsContent value="logs">
          <Card class="border border-border/40 shadow-xs">
            <CardHeader class="pb-4">
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="text-[15px] font-semibold">训练日志</CardTitle>
                  <CardDescription class="mt-1">实时训练日志输出，支持按级别筛选</CardDescription>
                </div>
                <div class="flex items-center gap-1 rounded-xl bg-muted/40 p-1">
                  <button
                    v-for="level in logLevels"
                    :key="level"
                    type="button"
                    :class="cn(
                      'rounded-lg px-2.5 py-1 text-xs transition-all',
                      logFilter === level
                        ? 'bg-background font-medium shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )"
                    @click="logFilter = level"
                  >
                    {{ level }}
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <!-- 黑底日志面板 -->
              <div class="rounded-xl bg-[oklch(0.15_0_0)] p-4 max-h-[480px] overflow-y-auto font-mono text-[13px] leading-relaxed">
                <div
                  v-for="(log, index) in filteredLogs"
                  :key="index"
                  class="flex gap-3 py-0.5 hover:bg-[oklch(0.2_0_0)] rounded px-1 transition-colors"
                >
                  <span class="shrink-0 text-[oklch(0.6_0_0)] tabular-nums">{{ log.time }}</span>
                  <span
                    :class="cn('shrink-0 w-12 text-right font-semibold', logLevelConfig[log.level])"
                  >
                    {{ log.level }}
                  </span>
                  <span class="text-[oklch(0.85_0_0)]">{{ log.message }}</span>
                </div>
                <!-- 光标闪烁 -->
                <div v-if="job.status === 'running'" class="flex items-center gap-1 mt-1 px-1">
                  <span class="inline-block size-2 rounded-sm bg-primary animate-pulse" />
                  <span class="text-[oklch(0.5_0_0)] text-xs">等待新日志...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- ==================== Tab 2：训练参数 ==================== -->
        <TabsContent value="params">
          <Card class="border border-border/40 shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px] font-semibold">训练参数</CardTitle>
              <CardDescription>当前训练任务的完整配置信息</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- 模型与数据 -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-xl border border-border/40 p-5 space-y-3">
                  <h4 class="text-xs font-medium uppercase tracking-wider text-muted-foreground">模型信息</h4>
                  <div class="space-y-2.5">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">基座模型</span>
                      <span class="font-medium">{{ job.baseModel }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">提供方</span>
                      <span class="font-medium">{{ job.baseModelProvider }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">训练方式</span>
                      <Badge variant="secondary" class="text-[10px]">{{ job.method }}</Badge>
                    </div>
                  </div>
                </div>
                <div class="rounded-xl border border-border/40 p-5 space-y-3">
                  <h4 class="text-xs font-medium uppercase tracking-wider text-muted-foreground">数据集信息</h4>
                  <div class="space-y-2.5">
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">数据集名称</span>
                      <span class="font-medium">{{ job.dataset }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-muted-foreground">记录数</span>
                      <span class="font-medium tabular-nums">{{ job.datasetRecords.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator class="!bg-border/40" />

              <!-- 超参数 -->
              <div class="rounded-xl border border-border/40 p-5 space-y-3">
                <h4 class="text-xs font-medium uppercase tracking-wider text-muted-foreground">超参数配置</h4>
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div class="space-y-1">
                    <span class="text-xs text-muted-foreground">Learning Rate</span>
                    <p class="text-sm font-mono font-medium">{{ job.learningRate }}</p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-xs text-muted-foreground">Batch Size</span>
                    <p class="text-sm font-mono font-medium">{{ job.batchSize }}</p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-xs text-muted-foreground">Epochs</span>
                    <p class="text-sm font-mono font-medium">{{ job.totalEpochs }}</p>
                  </div>
                  <div class="space-y-1">
                    <span class="text-xs text-muted-foreground">Warmup Steps</span>
                    <p class="text-sm font-mono font-medium">{{ job.warmupSteps }}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- ==================== Tab 3：操作 ==================== -->
        <TabsContent value="actions">
          <Card class="border border-border/40 shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px] font-semibold">操作</CardTitle>
              <CardDescription>导出模型、重新训练或删除当前任务</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- 导出模型 -->
              <div class="flex items-center justify-between rounded-xl border border-border/40 p-5">
                <div>
                  <h4 class="text-sm font-medium">导出模型</h4>
                  <p class="mt-1 text-xs text-muted-foreground">
                    将训练完成的模型导出并部署上线
                  </p>
                </div>
                <Button
                  size="sm"
                  :disabled="job.status !== 'completed'"
                  @click="handleExport"
                >
                  <Download class="mr-2 size-4" />
                  导出模型
                </Button>
              </div>

              <!-- 重新训练 -->
              <div class="flex items-center justify-between rounded-xl border border-border/40 p-5">
                <div>
                  <h4 class="text-sm font-medium">重新训练</h4>
                  <p class="mt-1 text-xs text-muted-foreground">
                    使用相同参数重新提交训练任务
                  </p>
                </div>
                <Button variant="outline" size="sm" @click="handleRetrain">
                  <RefreshCw class="mr-2 size-4" />
                  重新训练
                </Button>
              </div>

              <Separator class="!bg-border/40" />

              <!-- 删除 -->
              <div class="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/[0.02] p-5">
                <div>
                  <h4 class="text-sm font-medium text-destructive">删除训练任务</h4>
                  <p class="mt-1 text-xs text-muted-foreground">
                    删除后不可恢复，训练产物将一并清除
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
        title="删除训练任务"
        :description="`确定要删除「${job.name}」吗？此操作不可撤销，训练产物将一并清除。`"
        confirm-text="删除"
        @confirm="handleDelete"
      />
    </div>
  </div>
</template>
