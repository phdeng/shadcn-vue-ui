<script setup lang="ts">
/**
 * @description 控制台概览页 — 平台运行状态总览
 * @author Timon
 */
import { Box, Bot, BookOpen, Activity, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-vue-next'
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
import { Separator } from '@ui/components/ui/separator'
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar'
import { cn } from '@ui/lib/utils'

const recentActivities = [
  { action: '注册模型 DeepSeek-V3', user: 'Timon', time: '5 分钟前', avatar: 'T' },
  { action: '知识库「产品文档」完成索引', user: '系统', time: '18 分钟前', avatar: 'S' },
  { action: 'Agent「客服助手」配置更新', user: 'Timon', time: '1 小时前', avatar: 'T' },
  { action: 'Prompt 模板「摘要生成」发布 v2', user: 'Alex', time: '2 小时前', avatar: 'A' },
  { action: '模型 GPT-4o 调用量超过阈值', user: '系统', time: '3 小时前', avatar: 'S' },
]

const stats = [
  { title: '已注册模型', value: '12', change: '+3', trend: 'up' as const, desc: '较上月', icon: Box },
  { title: '运行中 Agent', value: '8', change: '+2', trend: 'up' as const, desc: '较上月', icon: Bot },
  { title: '知识库总量', value: '24', change: '+5', trend: 'up' as const, desc: '较上月', icon: BookOpen },
  { title: '今日调用次数', value: '1,847', change: '-3%', trend: 'down' as const, desc: '较昨日', icon: Activity },
]

const topModels = [
  { name: 'GPT-4o', calls: '12,340', pct: 85 },
  { name: 'Claude 3.5', calls: '8,921', pct: 62 },
  { name: 'DeepSeek-V3', calls: '5,678', pct: 39 },
  { name: 'Qwen2.5-72B', calls: '3,210', pct: 22 },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">概览</h2>
        <p class="text-muted-foreground text-sm">AI 平台运行状态一览</p>
      </div>
      <Button variant="outline" size="sm">
        <TrendingUp class="mr-2 size-4" />
        查看报表
      </Button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card v-for="item in stats" :key="item.title" class="transition-all hover:shadow-md">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">{{ item.title }}</CardTitle>
          <div class="rounded-md bg-muted p-2">
            <component :is="item.icon" class="size-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold tracking-tight">{{ item.value }}</div>
          <div class="mt-2 flex items-center gap-1 text-xs">
            <Badge
              :variant="item.trend === 'up' ? 'secondary' : 'destructive'"
              class="gap-0.5 px-1.5 py-0 text-[10px] font-medium"
            >
              <ArrowUpRight v-if="item.trend === 'up'" class="size-3" />
              <ArrowDownRight v-else class="size-3" />
              {{ item.change }}
            </Badge>
            <span class="text-muted-foreground">{{ item.desc }}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 下半区 -->
    <div class="grid gap-4 lg:grid-cols-7">
      <!-- 模型调用排行 -->
      <Card class="lg:col-span-4 transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>模型调用排行</CardTitle>
          <CardDescription>按调用量排序的模型使用情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-5">
            <div v-for="model in topModels" :key="model.name" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium">{{ model.name }}</span>
                <span class="text-muted-foreground tabular-nums">{{ model.calls }} 次</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  class="h-full rounded-full bg-primary transition-all duration-500"
                  :style="{ width: `${model.pct}%` }"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 最近活动 -->
      <Card class="lg:col-span-3 transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
          <CardDescription>平台最新操作记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="(activity, i) in recentActivities"
              :key="i"
              class="flex items-start gap-3"
            >
              <Avatar class="size-8 shrink-0">
                <AvatarFallback class="text-xs">{{ activity.avatar }}</AvatarFallback>
              </Avatar>
              <div class="flex-1 space-y-0.5">
                <p class="text-sm leading-snug">{{ activity.action }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ activity.user }} · {{ activity.time }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" class="w-full text-muted-foreground">
            查看全部活动
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
