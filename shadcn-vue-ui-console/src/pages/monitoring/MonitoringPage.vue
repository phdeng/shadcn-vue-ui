<script setup lang="ts">
/**
 * @description 推理监控页 — 实时推理调用监控仪表板
 * @author Timon
 */
import { Badge } from '@ui/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { cn } from '@ui/lib/utils'
import { Activity, Bot, Clock, TrendingUp } from 'lucide-vue-next'
import { ref } from 'vue'
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

// ==================== 调用日志 Mock 数据 ====================
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

// 状态标签映射
const statusMap: Record<LogEntry['status'], { label: string; class: string }> = {
  success: { label: '成功', class: 'bg-success/10 text-success border-success/20' },
  error: { label: '失败', class: 'bg-destructive/10 text-destructive border-destructive/20' },
  timeout: { label: '超时', class: 'bg-chart-5/10 text-chart-5 border-chart-5/20' },
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          推理监控
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          实时监控推理服务的运行状态与调用情况
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

    <!-- 统计卡片 — HUD 水印风格 -->
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

    <!-- 调用日志表格 -->
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
  </div>
</template>
