<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
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
/**
 * @description 数据报表页 — 业务数据分析与可视化
 * @author Timon
 */
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from 'lucide-vue-next'
import { defineAsyncComponent, onMounted, ref } from 'vue'

// 图表组件懒加载
const LineChart = defineAsyncComponent(() => import('@/components/charts/LineChart.vue'))

// 骨架屏加载状态
const loading = ref(true)
onMounted(() => {
  setTimeout(() => { loading.value = false }, 600)
})

// ==================== 统计卡片数据 ====================
const stats = [
  {
    title: '总营收',
    value: '¥128,450',
    change: '+18%',
    trend: 'up' as const,
    desc: '较上月',
    icon: DollarSign,
    color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: '订单总量',
    value: '1,234',
    change: '+12%',
    trend: 'up' as const,
    desc: '较上月',
    icon: ShoppingCart,
    color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: '用户转化率',
    value: '12.8%',
    change: '+2.1%',
    trend: 'up' as const,
    desc: '较上月',
    icon: TrendingUp,
    color: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    title: '平均客单价',
    value: '¥104',
    change: '-3%',
    trend: 'down' as const,
    desc: '较上月',
    icon: CreditCard,
    color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
]

// ==================== 营收趋势折线图数据 ====================
const revenueChartData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  datasets: [
    {
      label: '营收（万元）',
      data: [8.2, 9.1, 7.8, 10.5, 12.3, 11.8, 13.2, 14.1, 12.8, 15.3, 14.7, 16.2],
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
    {
      label: '成本（万元）',
      data: [5.1, 5.8, 5.2, 6.3, 7.1, 6.8, 7.5, 8.2, 7.4, 8.8, 8.3, 9.1],
      borderColor: 'rgba(245, 158, 11, 0.9)', // 橙色
      backgroundColor: 'rgba(245, 158, 11, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: 'rgba(245, 158, 11, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 1.5,
      borderWidth: 2,
    },
  ],
}

/** 营收趋势折线图配置 — 简洁网格、Inter 字体 */
const revenueChartOptions = {
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

// ==================== 热门商品 TOP 5 ====================
interface TopProduct {
  name: string
  sales: number
  percentage: number
  color: string
}

const topProducts: TopProduct[] = [
  { name: '企业版年度订阅', sales: 326, percentage: 100, color: 'bg-blue-500' },
  { name: 'API 调用额度包', sales: 258, percentage: 79, color: 'bg-violet-500' },
  { name: '专业版季度订阅', sales: 194, percentage: 60, color: 'bg-emerald-500' },
  { name: '定制化部署服务', sales: 147, percentage: 45, color: 'bg-amber-500' },
  { name: '基础版月度订阅', sales: 103, percentage: 32, color: 'bg-rose-500' },
]

// ==================== 近期订单统计 ====================
interface OrderSummary {
  date: string
  orderCount: number
  revenue: number
  refund: number
}

const orderSummary: OrderSummary[] = [
  { date: '2026-03-21', orderCount: 48, revenue: 18420, refund: 1200 },
  { date: '2026-03-20', orderCount: 52, revenue: 21350, refund: 0 },
  { date: '2026-03-19', orderCount: 39, revenue: 15680, refund: 3200 },
  { date: '2026-03-18', orderCount: 61, revenue: 24900, refund: 800 },
  { date: '2026-03-17', orderCount: 44, revenue: 17200, refund: 1500 },
  { date: '2026-03-16', orderCount: 37, revenue: 14800, refund: 0 },
  { date: '2026-03-15', orderCount: 55, revenue: 22100, refund: 2400 },
]

/**
 * 格式化金额
 */
function formatAmount(amount: number): string {
  return amount.toLocaleString('zh-CN')
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 骨架屏 -->
    <template v-if="loading">
      <div class="flex items-end justify-between">
        <div class="space-y-2">
          <Skeleton class="h-8 w-32" />
          <Skeleton class="h-4 w-44" />
        </div>
      </div>
      <!-- 统计卡片骨架 -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card v-for="i in 4" :key="i" class="border-0 shadow-sm overflow-hidden">
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
        <Card class="lg:col-span-4 border-0 shadow-sm">
          <CardHeader>
            <Skeleton class="h-5 w-24" />
            <Skeleton class="h-4 w-32 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton class="h-[240px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card class="lg:col-span-3 border-0 shadow-sm">
          <CardHeader>
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-4 w-28 mt-1" />
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="i in 5" :key="i" class="space-y-2">
              <div class="flex items-center justify-between">
                <Skeleton class="h-4 w-32" />
                <Skeleton class="h-4 w-12" />
              </div>
              <Skeleton class="h-1.5 w-full rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      <!-- 表格骨架 -->
      <Card class="border-0 shadow-sm">
        <CardHeader>
          <Skeleton class="h-5 w-28" />
          <Skeleton class="h-4 w-36 mt-1" />
        </CardHeader>
        <CardContent class="p-4 space-y-4">
          <div v-for="i in 5" :key="i" class="flex items-center gap-8">
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-4 w-12" />
            <Skeleton class="h-4 w-20" />
            <Skeleton class="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    </template>

    <template v-else>
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          数据报表
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          业务数据分析与可视化
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

    <!-- 中间区 — 营收趋势 + 热门商品 -->
    <div class="grid gap-4 lg:grid-cols-7">
      <!-- 营收趋势 -->
      <Card class="lg:col-span-4 border-0 shadow-sm">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base">
                营收趋势
              </CardTitle>
              <CardDescription>年度营收与成本对比</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="h-[240px]">
            <LineChart :data="revenueChartData" :options="revenueChartOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- 热门商品 TOP 5 -->
      <Card class="lg:col-span-3 border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">
            热门商品 TOP 5
          </CardTitle>
          <CardDescription>按销量排名的商品列表</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="(product, index) in topProducts"
              :key="product.name"
              class="space-y-2"
            >
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <span class="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-muted-foreground bg-muted">
                    {{ index + 1 }}
                  </span>
                  <span class="font-medium">{{ product.name }}</span>
                </div>
                <span class="font-mono text-xs tabular-nums text-muted-foreground">{{ product.sales }} 件</span>
              </div>
              <!-- 进度条 -->
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  :class="cn('h-full rounded-full transition-all', product.color)"
                  :style="{ width: `${product.percentage}%` }"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 近期订单统计表 -->
    <Card class="border-0 shadow-sm">
      <CardHeader>
        <CardTitle class="text-base">
          近期订单统计
        </CardTitle>
        <CardDescription>近 7 日订单汇总数据</CardDescription>
      </CardHeader>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日期</TableHead>
              <TableHead class="text-right">
                订单数
              </TableHead>
              <TableHead class="text-right">
                营收
              </TableHead>
              <TableHead class="text-right">
                退款
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in orderSummary" :key="row.date">
              <TableCell class="font-mono text-sm">
                {{ row.date }}
              </TableCell>
              <TableCell class="text-right font-mono tabular-nums">
                {{ row.orderCount }}
              </TableCell>
              <TableCell class="text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                ¥{{ formatAmount(row.revenue) }}
              </TableCell>
              <TableCell class="text-right font-mono tabular-nums">
                <span :class="row.refund > 0 ? 'text-destructive' : 'text-muted-foreground'">
                  {{ row.refund > 0 ? `¥${formatAmount(row.refund)}` : '—' }}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </template>
  </div>
</template>
