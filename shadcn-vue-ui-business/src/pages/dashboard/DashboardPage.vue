<script setup lang="ts">
/**
 * @description 业务管理后台概览页 — 运营数据看板
 * @author Timon
 */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Users,
  ShoppingCart,
  DollarSign,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Badge } from '@ui/components/ui/badge'
import { cn } from '@ui/lib/utils'

const authStore = useAuthStore()

// 根据时段动态问候
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
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
        <h2 class="text-2xl font-semibold tracking-tight">{{ greeting }}，{{ userName }}</h2>
        <p class="mt-1 text-sm text-muted-foreground">以下是你的业务运营概况</p>
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
