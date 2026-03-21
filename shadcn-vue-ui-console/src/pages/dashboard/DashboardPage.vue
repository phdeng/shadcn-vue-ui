<script setup lang="ts">
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar'
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Skeleton } from '@ui/components/ui/skeleton'
import { cn } from '@ui/lib/utils'
import { Activity, ArrowDownRight, ArrowUpRight, BookOpen, Bot, Box, MessageSquare, Plus, Sparkles } from 'lucide-vue-next'
/**
 * @description 控制台概览页 — 云平台产品风格
 * @author Timon
 */
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import ServiceStatus from '@/components/dashboard/ServiceStatus.vue'

// 图表组件懒加载 — 减少首屏 JS 体积（Chart.js ~130KB）
const LineChart = defineAsyncComponent(() => import('@/components/charts/LineChart.vue'))
const DoughnutChart = defineAsyncComponent(() => import('@/components/charts/DoughnutChart.vue'))
import { useCountUp } from '@/composables/useCountUp'
import { mockDashboardStats } from '@/mocks'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

const authStore = useAuthStore()

// 根据时段动态问候
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6)
    return '夜深了'
  if (hour < 12)
    return '早上好'
  if (hour < 14)
    return '中午好'
  if (hour < 18)
    return '下午好'
  return '晚上好'
})

const userName = computed(() => authStore.user?.name || 'Timon')

// ==================== 统计卡片数据（从 Mock 模块获取） ====================

// count-up 动画数值
const countModels = useCountUp(mockDashboardStats.totalModels, 800)
const countRunning = useCountUp(mockDashboardStats.runningModels, 800)
const countKnowledge = useCountUp(24, 800)
const countCalls = useCountUp(mockDashboardStats.todayCalls, 1000)

const stats = [
  { title: '已注册模型', countRef: countModels, change: '+3', trend: 'up' as const, desc: '较上月', icon: Box, iconBase: 'text-chart-1/20 dark:text-chart-1/10', iconHover: 'group-hover:text-chart-1/40 dark:group-hover:text-chart-1/25', glow: 'from-chart-1/30 via-chart-1/8 to-transparent' },
  { title: '运行中模型', countRef: countRunning, change: '+2', trend: 'up' as const, desc: '较上月', icon: Bot, iconBase: 'text-chart-4/20 dark:text-chart-4/10', iconHover: 'group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25', glow: 'from-chart-4/30 via-chart-4/8 to-transparent' },
  { title: '知识库总量', countRef: countKnowledge, change: '+5', trend: 'up' as const, desc: '较上月', icon: BookOpen, iconBase: 'text-success/20 dark:text-success/10', iconHover: 'group-hover:text-success/40 dark:group-hover:text-success/25', glow: 'from-success/30 via-success/8 to-transparent' },
  { title: '今日调用次数', countRef: countCalls, change: '-3%', trend: 'down' as const, desc: '较昨日', icon: Activity, iconBase: 'text-chart-5/20 dark:text-chart-5/10', iconHover: 'group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25', glow: 'from-chart-5/30 via-chart-5/8 to-transparent' },
]

// ==================== 最近活动数据 ====================
const recentActivities = [
  { action: '注册模型 DeepSeek-V3', user: 'Timon', time: '5 分钟前', avatar: 'T' },
  { action: '知识库「产品文档」完成索引', user: '系统', time: '18 分钟前', avatar: 'S' },
  { action: 'Agent「客服助手」配置更新', user: 'Timon', time: '1 小时前', avatar: 'T' },
  { action: 'Prompt 模板「摘要生成」发布 v2', user: 'Alex', time: '2 小时前', avatar: 'A' },
  { action: '模型 GPT-4o 调用量超过阈值', user: '系统', time: '3 小时前', avatar: 'S' },
]

// ==================== 调用趋势折线图数据 ====================
// 注意：Chart.js 不支持 oklch/CSS 变量，此处使用 rgba 硬编码
// 颜色对应关系：蓝色 → --chart-1，橙色 → --chart-5
const lineChartData = {
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  datasets: [
    {
      label: 'GPT-4o',
      data: [1200, 1900, 1500, 2100, 2400, 1800, 2200],
      borderColor: 'rgba(59, 130, 246, 0.9)', // --chart-1
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 1.5,
      pointStyle: 'circle' as const,
      borderWidth: 2,
    },
    {
      label: 'Claude 3.5',
      data: [800, 1100, 950, 1400, 1600, 1200, 1500],
      borderColor: 'rgba(245, 158, 11, 0.9)', // --chart-5
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: 'rgba(245, 158, 11, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 1.5,
      pointStyle: 'circle' as const,
      borderWidth: 2,
    },
  ],
}

/** 折线图配置 — 简洁网格、无标题、Inter 字体 */
const lineChartOptions = {
  plugins: {
    title: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      titleFont: { family: 'Inter, sans-serif', size: 12 },
      bodyFont: { family: 'Inter, sans-serif', size: 11 },
      padding: 10,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 4,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Inter, sans-serif', size: 11 },
        color: 'rgba(156, 163, 175, 0.9)',
      },
      border: { display: false },
    },
    y: {
      grid: {
        color: 'rgba(156, 163, 175, 0.15)',
        borderDash: [4, 4],
      },
      ticks: {
        font: { family: 'Inter, sans-serif', size: 11 },
        color: 'rgba(156, 163, 175, 0.9)',
        maxTicksLimit: 5,
      },
      border: { display: false },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
}

// ==================== 模型调用分布环形图数据 ====================
// 颜色对应：蓝 → --chart-1，橙 → --chart-5，绿 → --chart-3，灰 → --muted
const doughnutChartData = {
  labels: ['GPT-4o', 'Claude 3.5', 'DeepSeek', '其他'],
  datasets: [
    {
      data: [42, 30, 18, 10],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)', // --chart-1
        'rgba(245, 158, 11, 0.8)', // --chart-5
        'rgba(16, 185, 129, 0.8)', // --chart-3
        'rgba(156, 163, 175, 0.4)', // --muted
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(156, 163, 175, 0.6)',
      ],
      borderWidth: 1,
      hoverOffset: 6,
    },
  ],
}

/** 环形图配置 — 紧凑布局、右侧图例 */
const doughnutChartOptions = {
  cutout: '65%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        font: { family: 'Inter, sans-serif', size: 11 },
        color: 'rgba(156, 163, 175, 0.9)',
        padding: 12,
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      titleFont: { family: 'Inter, sans-serif', size: 12 },
      bodyFont: { family: 'Inter, sans-serif', size: 11 },
      padding: 10,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed}%`,
      },
    },
  },
}

// ==================== 快速操作数据 ====================
const quickActions = [
  { label: '注册模型', desc: '接入新的大语言模型', path: '/models', icon: Plus },
  { label: '创建 Agent', desc: '配置智能体工作流', path: '/agents', icon: Bot },
  { label: '开始对话', desc: '与 Agent 进行对话测试', path: '/chat', icon: MessageSquare },
]
</script>

<template>
  <div>
    <!-- Dashboard 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-6">
    <div class="space-y-2">
      <Skeleton class="h-8 w-56" />
      <Skeleton class="h-4 w-72" />
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Skeleton v-for="i in 4" :key="i" class="h-[120px] rounded-xl" />
    </div>
    <div class="grid gap-4 lg:grid-cols-7">
      <Skeleton class="lg:col-span-4 h-[340px] rounded-xl" />
      <Skeleton class="lg:col-span-3 h-[340px] rounded-xl" />
    </div>
  </div>

  <div v-else class="flex flex-col gap-6">
    <!-- 欢迎区 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          {{ greeting }}，{{ userName }}
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          以下是你的 AI 平台运行概况
        </p>
      </div>
    </div>

    <!-- 统计卡片 — 渐变背景风格 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in stats"
        :key="item.title"
        class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
      >
        <!-- 大图标水印 — 右侧居中，完整可见 -->
        <component
          :is="item.icon"
          :class="cn(
            'absolute right-4 top-1/2 -translate-y-1/2 size-20 transition-all duration-700 ease-out',
            'group-hover:scale-125 group-hover:rotate-6',
            item.iconBase, item.iconHover,
          )"
        />
        <!-- 径向光晕 — hover 时从图标位置衍射 -->
        <div :class="cn('absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100', item.glow)" />

        <!-- 内容层 -->
        <div class="relative z-10">
          <span class="text-[13px] font-medium text-muted-foreground">{{ item.title }}</span>
          <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
            {{ item.countRef.value.toLocaleString() }}
          </div>
          <div class="mt-4 flex items-center gap-1.5 text-xs">
            <Badge
              variant="secondary"
              :class="[
                'gap-0.5 rounded-full px-1.5 py-0 text-[10px] font-medium',
                item.trend === 'down' && 'bg-destructive/10 text-destructive',
              ]"
            >
              <ArrowUpRight v-if="item.trend === 'up'" class="size-3" />
              <ArrowDownRight v-else class="size-3" />
              {{ item.change }}
            </Badge>
            <span class="text-muted-foreground/50">{{ item.desc }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间区 — 调用趋势 + 模型分布与最近活动 -->
    <div class="grid gap-4 lg:grid-cols-7">
      <!-- 调用趋势折线图 -->
      <Card class="lg:col-span-4 border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-[15px] font-semibold">
                调用趋势
              </CardTitle>
              <CardDescription>近 7 日模型调用量变化</CardDescription>
            </div>
            <Button variant="ghost" size="sm" class="text-xs text-muted-foreground" @click="router.push('/models')">
              查看全部
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="h-[240px]">
            <LineChart :data="lineChartData" :options="lineChartOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- 模型分布 + 最近活动 -->
      <Card class="lg:col-span-3 border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-[15px] font-semibold">
                最近活动
              </CardTitle>
              <CardDescription>模型调用分布与平台动态</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- 模型调用分布环形图 -->
          <div class="h-[160px]">
            <DoughnutChart :data="doughnutChartData" :options="doughnutChartOptions" />
          </div>

          <!-- 分割线 -->
          <div class="border-t border-border/60" />

          <!-- 最近活动列表 -->
          <div class="space-y-3">
            <div
              v-for="(activity, i) in recentActivities"
              :key="i"
              class="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
            >
              <Avatar class="size-7 shrink-0">
                <AvatarFallback class="text-[10px] font-medium">
                  {{ activity.avatar }}
                </AvatarFallback>
              </Avatar>
              <div class="flex-1 space-y-0.5">
                <p class="text-sm leading-snug">
                  {{ activity.action }}
                </p>
                <p class="text-[11px] text-muted-foreground">
                  {{ activity.user }} · {{ activity.time }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter class="pt-0">
          <Button variant="ghost" size="sm" class="w-full text-xs text-muted-foreground" @click="router.push('/settings')">
            查看全部活动
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- 服务状态 + 快速操作 -->
    <div class="grid gap-4 lg:grid-cols-2">
      <ServiceStatus />

      <!-- 快速开始 -->
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader class="pb-3">
          <CardTitle class="text-[15px] font-semibold">
            快速开始
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3 sm:grid-cols-3">
            <RouterLink
              v-for="action in quickActions"
              :key="action.label"
              :to="action.path"
              class="group flex flex-col items-center gap-2.5 rounded-xl border border-border/40 bg-muted/30 p-5 text-center transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-primary/5"
            >
              <div class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                <component :is="action.icon" class="size-[18px]" />
              </div>
              <div>
                <p class="text-[13px] font-medium">
                  {{ action.label }}
                </p>
                <p class="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                  {{ action.desc }}
                </p>
              </div>
            </RouterLink>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  </div>
</template>
