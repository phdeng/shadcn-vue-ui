<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { cn } from '@ui/lib/utils'
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-vue-next'
/**
 * @description 业务管理后台概览页 — 运营数据看板
 * @author Timon
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import { useAuthStore } from '@/stores/auth'

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

// ==================== 统计卡片数据 ====================
const stats = [
  {
    title: '总用户数',
    value: '12,486',
    change: '+12%',
    trend: 'up' as const,
    desc: '较上月',
    icon: Users,
    color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: '今日订单',
    value: '326',
    change: '+8%',
    trend: 'up' as const,
    desc: '较昨日',
    icon: ShoppingCart,
    color: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    title: '月营收',
    value: '¥284,520',
    change: '+23%',
    trend: 'up' as const,
    desc: '较上月',
    icon: DollarSign,
    color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: '活跃用户',
    value: '3,847',
    change: '-2%',
    trend: 'down' as const,
    desc: '较昨日',
    icon: UserCheck,
    color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
]

// ==================== 用户增长趋势折线图数据 ====================
const userGrowthChartData = {
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  datasets: [
    {
      label: '新增用户',
      data: [45, 62, 58, 89, 112, 95, 128],
      borderColor: 'rgba(59, 130, 246, 0.9)', // 蓝色
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 1.5,
      borderWidth: 2,
    },
  ],
}

/** 折线图配置 — 简洁网格、无标题、Inter 字体 */
const userGrowthChartOptions = {
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

// ==================== 订单状态分布环形图数据 ====================
const orderStatusChartData = {
  labels: ['待处理', '处理中', '已完成', '已取消'],
  datasets: [
    {
      data: [30, 25, 35, 10],
      backgroundColor: [
        'rgba(245, 158, 11, 0.8)', // 琥珀色 — 待处理
        'rgba(59, 130, 246, 0.8)', // 蓝色 — 处理中
        'rgba(16, 185, 129, 0.8)', // 翡翠色 — 已完成
        'rgba(156, 163, 175, 0.5)', // 灰色 — 已取消
      ],
      borderColor: [
        'rgba(245, 158, 11, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(156, 163, 175, 0.7)',
      ],
      borderWidth: 1,
      hoverOffset: 6,
    },
  ],
}

/** 环形图配置 — 紧凑布局、右侧图例 */
const orderStatusChartOptions = {
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
  { label: '新增用户', desc: '创建并分配用户角色', path: '/users' },
  { label: '创建订单', desc: '手动录入业务订单', path: '/orders' },
  { label: '查看报表', desc: '浏览业务数据分析', path: '/reports' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 欢迎区 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          {{ greeting }}，{{ userName }}
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          以下是你的业务运营概况
        </p>
      </div>
    </div>

    <!-- 统计卡片 — 渐变背景风格 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        v-for="item in stats"
        :key="item.title"
        class="overflow-hidden border-0 shadow-sm transition-all hover:shadow-md"
      >
        <div :class="cn('bg-gradient-to-br', item.color)">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">
              {{ item.title }}
            </CardTitle>
            <div :class="cn('rounded-lg bg-background/60 p-2 backdrop-blur-sm', item.iconColor)">
              <component :is="item.icon" class="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold tracking-tight">
              {{ item.value }}
            </div>
            <div class="mt-2 flex items-center gap-1.5 text-xs">
              <Badge
                :variant="item.trend === 'up' ? 'secondary' : 'destructive'"
                class="gap-0.5 rounded-full px-1.5 py-0 text-[10px] font-medium"
              >
                <ArrowUpRight v-if="item.trend === 'up'" class="size-3" />
                <ArrowDownRight v-else class="size-3" />
                {{ item.change }}
              </Badge>
              <span class="text-muted-foreground">{{ item.desc }}</span>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>

    <!-- 中间区 — 用户增长趋势 + 订单状态分布 -->
    <div class="grid gap-4 lg:grid-cols-7">
      <!-- 用户增长趋势折线图 -->
      <Card class="lg:col-span-4 shadow-sm border-0">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base">
                用户增长趋势
              </CardTitle>
              <CardDescription>近 7 日新增用户变化</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="h-[240px]">
            <LineChart :data="userGrowthChartData" :options="userGrowthChartOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- 订单状态分布环形图 -->
      <Card class="lg:col-span-3 shadow-sm border-0">
        <CardHeader>
          <CardTitle class="text-base">
            订单状态分布
          </CardTitle>
          <CardDescription>当前订单状态占比</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[240px]">
            <DoughnutChart :data="orderStatusChartData" :options="orderStatusChartOptions" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 快速操作 -->
    <div>
      <h3 class="mb-3 text-sm font-medium text-muted-foreground">
        快速开始
      </h3>
      <div class="grid gap-3 sm:grid-cols-3">
        <RouterLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.path"
          class="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
        >
          <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Sparkles class="size-4" />
          </div>
          <div>
            <p class="text-sm font-medium">
              {{ action.label }}
            </p>
            <p class="text-[11px] text-muted-foreground">
              {{ action.desc }}
            </p>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
