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

const stats = [
  { title: '已注册模型', value: '12', change: '+3', trend: 'up' as const, desc: '较上月', icon: Box, color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20', iconColor: 'text-blue-600 dark:text-blue-400' },
  { title: '运行中 Agent', value: '8', change: '+2', trend: 'up' as const, desc: '较上月', icon: Bot, color: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20', iconColor: 'text-violet-600 dark:text-violet-400' },
  { title: '知识库总量', value: '24', change: '+5', trend: 'up' as const, desc: '较上月', icon: BookOpen, color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { title: '今日调用次数', value: '1,847', change: '-3%', trend: 'down' as const, desc: '较昨日', icon: Activity, color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20', iconColor: 'text-amber-600 dark:text-amber-400' },
]

const recentActivities = [
  { action: '注册模型 DeepSeek-V3', user: 'Timon', time: '5 分钟前', avatar: 'T' },
  { action: '知识库「产品文档」完成索引', user: '系统', time: '18 分钟前', avatar: 'S' },
  { action: 'Agent「客服助手」配置更新', user: 'Timon', time: '1 小时前', avatar: 'T' },
  { action: 'Prompt 模板「摘要生成」发布 v2', user: 'Alex', time: '2 小时前', avatar: 'A' },
  { action: '模型 GPT-4o 调用量超过阈值', user: '系统', time: '3 小时前', avatar: 'S' },
]

const topModels = [
  { name: 'GPT-4o', provider: 'OpenAI', calls: '12,340', pct: 85 },
  { name: 'Claude 3.5', provider: 'Anthropic', calls: '8,921', pct: 62 },
  { name: 'DeepSeek-V3', provider: 'DeepSeek', calls: '5,678', pct: 39 },
  { name: 'Qwen2.5-72B', provider: 'Alibaba', calls: '3,210', pct: 22 },
]

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

    <!-- 中间区 -->
    <div class="grid gap-4 lg:grid-cols-7">
      <!-- 模型调用排行 -->
      <Card class="lg:col-span-4 shadow-sm border-0">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base">模型调用排行</CardTitle>
              <CardDescription>按调用量排序的模型使用情况</CardDescription>
            </div>
            <Button variant="ghost" size="sm" class="text-xs text-muted-foreground">
              查看全部
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="model in topModels" :key="model.name" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ model.name }}</span>
                  <span class="text-xs text-muted-foreground">{{ model.provider }}</span>
                </div>
                <span class="text-muted-foreground tabular-nums text-xs">{{ model.calls }} 次</span>
              </div>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700"
                  :style="{ width: `${model.pct}%` }"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 最近活动 -->
      <Card class="lg:col-span-3 shadow-sm border-0">
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-base">最近活动</CardTitle>
              <CardDescription>平台最新操作记录</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
