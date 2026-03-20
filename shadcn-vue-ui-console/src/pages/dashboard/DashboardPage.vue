<script setup lang="ts">
/**
 * @description 控制台概览页 — 云平台产品风格
 * @author Timon
 */
import { Box, Bot, BookOpen, Activity, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@ui/components/ui/card'
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar'
import { cn } from '@ui/lib/utils'
import LineChart from '@/components/charts/LineChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'

// ==================== 统计卡片数据 ====================
const stats = [
  { title: '已注册模型', value: '12', change: '+3', trend: 'up' as const, desc: '较上月', icon: Box, color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20', iconColor: 'text-blue-600 dark:text-blue-400' },
  { title: '运行中 Agent', value: '8', change: '+2', trend: 'up' as const, desc: '较上月', icon: Bot, color: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20', iconColor: 'text-violet-600 dark:text-violet-400' },
  { title: '知识库总量', value: '24', change: '+5', trend: 'up' as const, desc: '较上月', icon: BookOpen, color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { title: '今日调用次数', value: '1,847', change: '-3%', trend: 'down' as const, desc: '较昨日', icon: Activity, color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20', iconColor: 'text-amber-600 dark:text-amber-400' },
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
const lineChartData = {
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  datasets: [
    {
      label: 'GPT-4o',
      data: [1200, 1900, 1500, 2100, 2400, 1800, 2200],
      borderColor: 'rgba(59, 130, 246, 0.9)',       // 蓝色
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
      label: 'Claude 3.5',
      data: [800, 1100, 950, 1400, 1600, 1200, 1500],
      borderColor: 'rgba(245, 158, 11, 0.9)',       // 橙色
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
const doughnutChartData = {
  labels: ['GPT-4o', 'Claude 3.5', 'DeepSeek', '其他'],
  datasets: [
    {
      data: [42, 30, 18, 10],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',    // 蓝色 — GPT-4o
        'rgba(245, 158, 11, 0.8)',    // 橙色 — Claude
        'rgba(16, 185, 129, 0.8)',    // 绿色 — DeepSeek
        'rgba(156, 163, 175, 0.5)',   // 灰色 — 其他
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(156, 163, 175, 0.7)',
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
  { label: '注册模型', desc: '接入新的大语言模型', path: '/models' },
  { label: '创建 Agent', desc: '配置智能体工作流', path: '/agents' },
  { label: '上传知识库', desc: '导入文档与数据集', path: '/knowledge' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 欢迎区 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">欢迎回来，Timon</h2>
        <p class="mt-1 text-sm text-muted-foreground">以下是你的 AI 平台运行概况</p>
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
            <CardTitle class="text-sm font-medium text-muted-foreground">{{ item.title }}</CardTitle>
            <div :class="cn('rounded-lg bg-background/60 p-2 backdrop-blur-sm', item.iconColor)">
              <component :is="item.icon" class="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold tracking-tight">{{ item.value }}</div>
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

    <!-- 中间区 — 调用趋势 + 模型分布与最近活动 -->
    <div class="grid gap-4 lg:grid-cols-7">
      <!-- 调用趋势折线图 -->
      <Card class="lg:col-span-4 shadow-sm border-0">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base">调用趋势</CardTitle>
              <CardDescription>近 7 日模型调用量变化</CardDescription>
            </div>
            <Button variant="ghost" size="sm" class="text-xs text-muted-foreground">
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
      <Card class="lg:col-span-3 shadow-sm border-0">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base">最近活动</CardTitle>
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
                <AvatarFallback class="text-[10px] font-medium">{{ activity.avatar }}</AvatarFallback>
              </Avatar>
              <div class="flex-1 space-y-0.5">
                <p class="text-sm leading-snug">{{ activity.action }}</p>
                <p class="text-[11px] text-muted-foreground">{{ activity.user }} · {{ activity.time }}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter class="pt-0">
          <Button variant="ghost" size="sm" class="w-full text-xs text-muted-foreground">
            查看全部活动
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- 快速操作 -->
    <div>
      <h3 class="mb-3 text-sm font-medium text-muted-foreground">快速开始</h3>
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
            <p class="text-sm font-medium">{{ action.label }}</p>
            <p class="text-[11px] text-muted-foreground">{{ action.desc }}</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
