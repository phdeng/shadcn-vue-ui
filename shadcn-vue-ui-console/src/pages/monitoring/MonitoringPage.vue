<script setup lang="ts">
/**
 * @description 可观测性页 — 全链路推理监控、调用追踪、成本分析与告警管理
 * @author Timon
 */
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Switch } from '@ui/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { cn } from '@ui/lib/utils'
import {
  Activity,
  Bell,
  Bot,
  ChevronDown,
  ChevronRight,
  Clock,
  Coins,
  GitBranch,
  Plus,
  TrendingUp,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useCountUp } from '@/composables/useCountUp'

// ==================== 时间范围 ====================
const timeRanges = ['Today', '7天', '30天'] as const
const activeRange = ref<(typeof timeRanges)[number]>('Today')

// ==================== 统计卡片数据 ====================
const countRequests = useCountUp(156780, 1000)
const countLatency = useCountUp(245, 800)
const countSuccess = useCountUp(99.2, 800)
const countModels = useCountUp(4, 600)

const stats = [
  {
    title: '总请求数',
    countRef: countRequests,
    suffix: '',
    format: (v: number) => v.toLocaleString(),
    icon: Activity,
    iconBase: 'text-chart-1/20 dark:text-chart-1/10',
    iconHover: 'group-hover:text-chart-1/40 dark:group-hover:text-chart-1/25',
    glow: 'from-chart-1/30 via-chart-1/8 to-transparent',
  },
  {
    title: '平均延迟',
    countRef: countLatency,
    suffix: 'ms',
    format: (v: number) => `${v}`,
    icon: Clock,
    iconBase: 'text-chart-5/20 dark:text-chart-5/10',
    iconHover: 'group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25',
    glow: 'from-chart-5/30 via-chart-5/8 to-transparent',
  },
  {
    title: '成功率',
    countRef: countSuccess,
    suffix: '%',
    format: (v: number) => v.toFixed(1),
    icon: TrendingUp,
    iconBase: 'text-success/20 dark:text-success/10',
    iconHover: 'group-hover:text-success/40 dark:group-hover:text-success/25',
    glow: 'from-success/30 via-success/8 to-transparent',
  },
  {
    title: '活跃模型',
    countRef: countModels,
    suffix: '',
    format: (v: number) => `${v}`,
    icon: Bot,
    iconBase: 'text-chart-4/20 dark:text-chart-4/10',
    iconHover: 'group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25',
    glow: 'from-chart-4/30 via-chart-4/8 to-transparent',
  },
]

// ==================== Tab 1: 调用日志 Mock 数据 ====================
interface LogEntry {
  time: string
  model: string
  user: string
  tokens: number
  latency: string
  status: 'success' | 'error' | 'timeout'
}

const logEntries: LogEntry[] = [
  { time: '14:32:05', model: 'GPT-4o', user: 'Timon', tokens: 1240, latency: '312ms', status: 'success' },
  { time: '14:31:58', model: 'Claude 3.5', user: 'Alex', tokens: 890, latency: '245ms', status: 'success' },
  { time: '14:31:42', model: 'DeepSeek-V3', user: 'Timon', tokens: 2100, latency: '189ms', status: 'success' },
  { time: '14:31:35', model: 'GPT-4o', user: 'Sarah', tokens: 560, latency: '1520ms', status: 'timeout' },
  { time: '14:31:20', model: 'Claude 3.5', user: 'Alex', tokens: 1800, latency: '278ms', status: 'success' },
  { time: '14:30:55', model: 'DeepSeek-V3', user: 'Timon', tokens: 430, latency: '156ms', status: 'success' },
  { time: '14:30:48', model: 'GPT-4o', user: 'Sarah', tokens: 1560, latency: '0ms', status: 'error' },
  { time: '14:30:30', model: 'Claude 3.5', user: 'Alex', tokens: 720, latency: '198ms', status: 'success' },
  { time: '14:30:15', model: 'DeepSeek-V3', user: 'Timon', tokens: 980, latency: '210ms', status: 'success' },
  { time: '14:29:58', model: 'GPT-4o', user: 'Sarah', tokens: 1100, latency: '335ms', status: 'success' },
]

const statusMap: Record<LogEntry['status'], { label: string; class: string }> = {
  success: { label: '成功', class: 'bg-success/10 text-success border-success/20' },
  error: { label: '失败', class: 'bg-destructive/10 text-destructive border-destructive/20' },
  timeout: { label: '超时', class: 'bg-chart-5/10 text-chart-5 border-chart-5/20' },
}

// ==================== Tab 2: 调用追踪 Mock 数据 ====================
interface TraceSpan {
  name: string
  duration: number // ms
}

interface TraceRecord {
  traceId: string
  entryModel: string
  totalDuration: number // ms
  spanCount: number
  status: 'success' | 'error'
  spans: TraceSpan[]
}

const traceRecords: TraceRecord[] = [
  {
    traceId: 'trace-a3f8c1d2',
    entryModel: 'GPT-4o',
    totalDuration: 1010,
    spanCount: 4,
    status: 'success',
    spans: [
      { name: 'Agent 路由', duration: 15 },
      { name: '知识库检索', duration: 120 },
      { name: '模型推理', duration: 850 },
      { name: '后处理', duration: 25 },
    ],
  },
  {
    traceId: 'trace-b7e2d4a9',
    entryModel: 'Claude 3.5',
    totalDuration: 780,
    spanCount: 4,
    status: 'success',
    spans: [
      { name: 'Agent 路由', duration: 12 },
      { name: '知识库检索', duration: 95 },
      { name: '模型推理', duration: 645 },
      { name: '后处理', duration: 28 },
    ],
  },
  {
    traceId: 'trace-c1f9e5b3',
    entryModel: 'DeepSeek-V3',
    totalDuration: 520,
    spanCount: 4,
    status: 'success',
    spans: [
      { name: 'Agent 路由', duration: 10 },
      { name: '知识库检索', duration: 80 },
      { name: '模型推理', duration: 410 },
      { name: '后处理', duration: 20 },
    ],
  },
  {
    traceId: 'trace-d4a8f2c6',
    entryModel: 'GPT-4o',
    totalDuration: 2150,
    spanCount: 4,
    status: 'error',
    spans: [
      { name: 'Agent 路由', duration: 18 },
      { name: '知识库检索', duration: 230 },
      { name: '模型推理', duration: 1870 },
      { name: '后处理', duration: 32 },
    ],
  },
  {
    traceId: 'trace-e6b3c7d1',
    entryModel: 'Claude 3.5',
    totalDuration: 690,
    spanCount: 4,
    status: 'success',
    spans: [
      { name: 'Agent 路由', duration: 14 },
      { name: '知识库检索', duration: 110 },
      { name: '模型推理', duration: 540 },
      { name: '后处理', duration: 26 },
    ],
  },
]

// 追踪记录展开状态
const expandedTraces = ref<Set<string>>(new Set())

function toggleTrace(traceId: string) {
  if (expandedTraces.value.has(traceId)) {
    expandedTraces.value.delete(traceId)
  }
  else {
    expandedTraces.value.add(traceId)
  }
}

// Span 颜色映射
const spanColors = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
]

// ==================== Tab 3: 成本分析 Mock 数据 ====================
interface CostModelRow {
  model: string
  calls: number
  tokens: number
  unitPrice: string
  subtotal: number
}

const costModels: CostModelRow[] = [
  { model: 'GPT-4o', calls: 45200, tokens: 28500000, unitPrice: '¥0.06/1K', subtotal: 1710 },
  { model: 'Claude 3.5', calls: 12800, tokens: 8200000, unitPrice: '¥0.045/1K', subtotal: 369 },
  { model: 'DeepSeek-V3', calls: 8500, tokens: 5100000, unitPrice: '¥0.02/1K', subtotal: 102 },
  { model: 'Qwen-Max', calls: 3200, tokens: 1900000, unitPrice: '¥0.04/1K', subtotal: 76 },
  { model: 'GLM-4', calls: 2100, tokens: 1300000, unitPrice: '¥0.025/1K', subtotal: 83 },
]

// ==================== Tab 4: 告警配置 Mock 数据 ====================
interface AlertRule {
  id: string
  name: string
  condition: string
  enabled: boolean
  channels: string[]
}

const alertRules = ref<AlertRule[]>([
  { id: '1', name: '高延迟告警', condition: '延迟 > 2s', enabled: true, channels: ['邮件', '钉钉'] },
  { id: '2', name: '高错误率告警', condition: '错误率 > 5%', enabled: true, channels: ['邮件', 'Webhook'] },
  { id: '3', name: 'QPS 超限告警', condition: 'QPS > 5000', enabled: false, channels: ['钉钉'] },
  { id: '4', name: '日成本超限告警', condition: '日成本 > ¥500', enabled: false, channels: ['邮件', '钉钉', 'Webhook'] },
])

function toggleAlert(rule: AlertRule) {
  rule.enabled = !rule.enabled
  toast.success(`${rule.name}已${rule.enabled ? '启用' : '停用'}`)
}

function handleAddRule() {
  toast.info('添加告警规则功能即将上线')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          可观测性
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          全链路推理监控、调用追踪、成本分析与告警管理
        </p>
      </div>
      <!-- 时间范围选择 -->
      <div class="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/30 p-1">
        <button
          v-for="range in timeRanges"
          :key="range"
          :class="cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200',
            activeRange === range
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )"
          @click="activeRange = range"
        >
          {{ range }}
        </button>
      </div>
    </div>

    <!-- 统计卡片 — HUD 水印风格（全局展示，不随 Tab 切换） -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in stats"
        :key="item.title"
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
        <!-- 径向光晕 -->
        <div :class="cn('absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100', item.glow)" />

        <!-- 内容层 -->
        <div class="relative z-10">
          <span class="text-[13px] font-medium text-muted-foreground">{{ item.title }}</span>
          <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
            {{ item.format(item.countRef.value) }}<span v-if="item.suffix" class="ml-1 text-lg font-medium text-muted-foreground">{{ item.suffix }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 布局 -->
    <Tabs default-value="logs" class="w-full">
      <TabsList class="h-10">
        <TabsTrigger value="logs" class="gap-1.5 px-4 text-sm">
          <Activity class="size-4" />
          调用日志
        </TabsTrigger>
        <TabsTrigger value="traces" class="gap-1.5 px-4 text-sm">
          <GitBranch class="size-4" />
          调用追踪
        </TabsTrigger>
        <TabsTrigger value="cost" class="gap-1.5 px-4 text-sm">
          <Coins class="size-4" />
          成本分析
        </TabsTrigger>
        <TabsTrigger value="alerts" class="gap-1.5 px-4 text-sm">
          <Bell class="size-4" />
          告警配置
        </TabsTrigger>
      </TabsList>

      <!-- Tab 1: 调用日志 -->
      <TabsContent value="logs" class="mt-6">
        <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader>
            <CardTitle class="text-[15px] font-semibold">
              调用日志
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-border/60">
                    <th class="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">时间</th>
                    <th class="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">模型</th>
                    <th class="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">用户</th>
                    <th class="pb-3 pr-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Token 数</th>
                    <th class="pb-3 pr-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">延迟</th>
                    <th class="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(entry, i) in logEntries"
                    :key="i"
                    class="border-b border-border/30 transition-colors hover:bg-muted/30"
                  >
                    <td class="py-3 pr-4 text-sm tabular-nums text-muted-foreground">{{ entry.time }}</td>
                    <td class="py-3 pr-4 text-sm font-medium">{{ entry.model }}</td>
                    <td class="py-3 pr-4 text-sm text-muted-foreground">{{ entry.user }}</td>
                    <td class="py-3 pr-4 text-right text-sm tabular-nums">{{ entry.tokens.toLocaleString() }}</td>
                    <td class="py-3 pr-4 text-right text-sm tabular-nums text-muted-foreground">{{ entry.latency }}</td>
                    <td class="py-3">
                      <Badge
                        variant="outline"
                        :class="cn('text-[11px] font-medium', statusMap[entry.status].class)"
                      >
                        {{ statusMap[entry.status].label }}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Tab 2: 调用追踪 -->
      <TabsContent value="traces" class="mt-6">
        <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader>
            <CardTitle class="text-[15px] font-semibold">
              分布式追踪
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div
              v-for="trace in traceRecords"
              :key="trace.traceId"
              class="rounded-xl border border-border/40 bg-muted/20 overflow-hidden transition-colors hover:bg-muted/30"
            >
              <!-- 追踪记录头部 -->
              <button
                class="flex w-full items-center gap-4 px-4 py-3.5 text-left"
                @click="toggleTrace(trace.traceId)"
              >
                <component
                  :is="expandedTraces.has(trace.traceId) ? ChevronDown : ChevronRight"
                  class="size-4 shrink-0 text-muted-foreground"
                />
                <span class="font-mono text-sm text-muted-foreground">{{ trace.traceId }}</span>
                <span class="text-sm font-medium">{{ trace.entryModel }}</span>
                <span class="text-sm tabular-nums text-muted-foreground">{{ trace.totalDuration }}ms</span>
                <Badge variant="outline" class="text-[11px]">
                  {{ trace.spanCount }} spans
                </Badge>
                <Badge
                  variant="outline"
                  :class="cn(
                    'ml-auto text-[11px] font-medium',
                    trace.status === 'success'
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20',
                  )"
                >
                  {{ trace.status === 'success' ? '成功' : '失败' }}
                </Badge>
              </button>

              <!-- Span 瀑布流 -->
              <div
                v-if="expandedTraces.has(trace.traceId)"
                class="border-t border-border/30 px-4 py-4 space-y-2.5"
              >
                <div
                  v-for="(span, idx) in trace.spans"
                  :key="idx"
                  class="flex items-center gap-3"
                >
                  <span class="w-24 shrink-0 text-xs text-muted-foreground truncate">{{ span.name }}</span>
                  <div class="relative flex-1 h-6 rounded-md bg-muted/30">
                    <div
                      :class="cn('h-full rounded-md opacity-70', spanColors[idx % spanColors.length])"
                      :style="{ width: `${Math.max((span.duration / trace.totalDuration) * 100, 3)}%` }"
                    />
                  </div>
                  <span class="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{{ span.duration }}ms</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Tab 3: 成本分析 -->
      <TabsContent value="cost" class="mt-6 space-y-6">
        <!-- 成本概览卡片 -->
        <div class="grid gap-4 sm:grid-cols-3">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardContent class="pt-6">
              <p class="text-[13px] font-medium text-muted-foreground">本月总成本</p>
              <p class="mt-2 text-2xl font-bold tracking-tight tabular-nums">¥2,340</p>
            </CardContent>
          </Card>
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardContent class="pt-6">
              <p class="text-[13px] font-medium text-muted-foreground">日均成本</p>
              <p class="mt-2 text-2xl font-bold tracking-tight tabular-nums">¥78</p>
            </CardContent>
          </Card>
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardContent class="pt-6">
              <p class="text-[13px] font-medium text-muted-foreground">环比变化</p>
              <p class="mt-2 text-2xl font-bold tracking-tight tabular-nums text-chart-5">+12%</p>
            </CardContent>
          </Card>
        </div>

        <!-- 按模型分列的成本表格 -->
        <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader>
            <CardTitle class="text-[15px] font-semibold">
              按模型分列
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-border/60">
                    <th class="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">模型</th>
                    <th class="pb-3 pr-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">调用次数</th>
                    <th class="pb-3 pr-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Token 消耗</th>
                    <th class="pb-3 pr-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">单价</th>
                    <th class="pb-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">小计</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in costModels"
                    :key="row.model"
                    class="border-b border-border/30 transition-colors hover:bg-muted/30"
                  >
                    <td class="py-3 pr-4 text-sm font-medium">{{ row.model }}</td>
                    <td class="py-3 pr-4 text-right text-sm tabular-nums">{{ row.calls.toLocaleString() }}</td>
                    <td class="py-3 pr-4 text-right text-sm tabular-nums text-muted-foreground">{{ (row.tokens / 1000000).toFixed(1) }}M</td>
                    <td class="py-3 pr-4 text-right text-sm text-muted-foreground">{{ row.unitPrice }}</td>
                    <td class="py-3 text-right text-sm font-medium tabular-nums">¥{{ row.subtotal.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Tab 4: 告警配置 -->
      <TabsContent value="alerts" class="mt-6 space-y-4">
        <div
          v-for="rule in alertRules"
          :key="rule.id"
          class="flex items-center justify-between rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-5 shadow-xs transition-colors hover:bg-card/90"
        >
          <div class="space-y-1.5">
            <p class="text-sm font-semibold">{{ rule.name }}</p>
            <p class="text-xs text-muted-foreground">{{ rule.condition }}</p>
            <div class="flex items-center gap-1.5 pt-0.5">
              <Badge
                v-for="ch in rule.channels"
                :key="ch"
                variant="outline"
                class="text-[11px] font-normal"
              >
                {{ ch }}
              </Badge>
            </div>
          </div>
          <Switch
            :checked="rule.enabled"
            @update:checked="toggleAlert(rule)"
          />
        </div>

        <Button variant="outline" class="w-full gap-2" @click="handleAddRule">
          <Plus class="size-4" />
          添加规则
        </Button>
      </TabsContent>
    </Tabs>
  </div>
</template>
