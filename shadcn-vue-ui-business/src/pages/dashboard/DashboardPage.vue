<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Skeleton } from '@ui/components/ui/skeleton'
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
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import SystemStatus from '@/components/dashboard/SystemStatus.vue'
import { useAuthStore } from '@/stores/auth'

// 图表组件懒加载 — 减少首屏体积
const DoughnutChart = defineAsyncComponent(() => import('@/components/charts/DoughnutChart.vue'))
const LineChart = defineAsyncComponent(() => import('@/components/charts/LineChart.vue'))

// 骨架屏加载状态
const loading = ref(true)
onMounted(() => {
  setTimeout(() => { loading.value = false }, 600)
})

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
    iconBase: 'text-chart-1/20 dark:text-chart-1/10',
    iconHover: 'group-hover:text-chart-1/40 dark:group-hover:text-chart-1/25',
    glow: 'from-chart-1/30 via-chart-1/8 to-transparent',
  },
  {
    title: '今日订单',
    value: '326',
    change: '+8%',
    trend: 'up' as const,
    desc: '较昨日',
    icon: ShoppingCart,
    iconBase: 'text-chart-4/20 dark:text-chart-4/10',
    iconHover: 'group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25',
    glow: 'from-chart-4/30 via-chart-4/8 to-transparent',
  },
  {
    title: '月营收',
    value: '¥284,520',
    change: '+23%',
    trend: 'up' as const,
    desc: '较上月',
    icon: DollarSign,
    iconBase: 'text-success/20 dark:text-success/10',
    iconHover: 'group-hover:text-success/40 dark:group-hover:text-success/25',
    glow: 'from-success/30 via-success/8 to-transparent',
  },
  {
    title: '活跃用户',
    value: '3,847',
    change: '-2%',
    trend: 'down' as const,
    desc: '较昨日',
    icon: UserCheck,
    iconBase: 'text-chart-5/20 dark:text-chart-5/10',
    iconHover: 'group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25',
    glow: 'from-chart-5/30 via-chart-5/8 to-transparent',
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
    <!-- 骨架屏 -->
    <template v-if="loading">
      <!-- 欢迎区骨架 -->
      <div class="flex items-end justify-between">
        <div class="space-y-2">
          <Skeleton class="h-8 w-56" />
          <Skeleton class="h-4 w-40" />
        </div>
      </div>
      <!-- 统计卡片骨架 -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card v-for="i in 4" :key="i" class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs overflow-hidden">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <Skeleton class="h-4 w-16" />
            <Skeleton class="size-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-9 w-28 mb-2" />
            <Skeleton class="h-4 w-20" />
          </CardContent>
        </Card>
      </div>
      <!-- 图表区骨架 -->
      <div class="grid gap-4 lg:grid-cols-7">
        <Card class="lg:col-span-4 border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader>
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-4 w-24 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-[240px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card class="lg:col-span-3 border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader>
            <Skeleton class="h-5 w-28" />
            <Skeleton class="h-4 w-20 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-[240px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
      <!-- 底部区骨架 -->
      <div class="grid gap-4 lg:grid-cols-2">
        <Skeleton class="h-48 w-full rounded-xl" />
        <Skeleton class="h-48 w-full rounded-xl" />
      </div>
    </template>

    <!-- 实际内容 -->
    <template v-else>
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

    <!-- 统计卡片 — HUD 水印图标风格 -->
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
            {{ item.value }}
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

    <!-- 中间区 — 用户增长趋势 + 订单状态分布 -->
    <div class="grid gap-4 lg:grid-cols-7">
      <!-- 用户增长趋势折线图 -->
      <Card class="lg:col-span-4 border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-[15px] font-semibold">
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
      <Card class="lg:col-span-3 border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px] font-semibold">
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

    <!-- 系统状态 + 快速操作 -->
    <div class="grid gap-4 lg:grid-cols-2">
      <SystemStatus />

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
                <Sparkles class="size-[18px]" />
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
    </template>
  </div>
</template>
