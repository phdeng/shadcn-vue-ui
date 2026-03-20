<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { cn } from '@ui/lib/utils'
import {
  Activity,
  ArrowLeft,
  Circle,
  Clock,
  FileText,
  LayoutGrid,
  ScrollText,
  Settings,
  TrendingUp,
  Zap,
} from 'lucide-vue-next'
/**
 * @description 模型详情页 — Dify / 云控制台产品风格
 * @author Timon
 */
import { useRouter } from 'vue-router'

const router = useRouter()
// 模拟数据 — 后续替换为 API
const model = {
  id: '1',
  name: 'GPT-4o',
  provider: 'OpenAI',
  type: '大语言模型',
  status: 'running' as const,
  endpoint: 'https://api.openai.com/v1/chat/completions',
  maxTokens: 128000,
  temperature: 0.7,
  createdAt: '2026-01-15',
  updatedAt: '2026-03-18',
}

// 指标卡片 — 渐变背景风格，与 Dashboard 保持一致
const metrics = [
  {
    label: '总调用次数',
    value: '45,230',
    icon: Activity,
    color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: '平均延迟',
    value: '320ms',
    icon: Clock,
    color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    label: '成功率',
    value: '99.7%',
    icon: TrendingUp,
    color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label: '今日调用',
    value: '1,204',
    icon: Zap,
    color: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
]

// 模型配置项
const configItems = [
  { label: 'API 端点', value: 'https://api.openai.com/v1/chat/completions' },
  { label: '最大 Token', value: '128,000' },
  { label: 'Temperature', value: '0.7' },
  { label: '提供商', value: 'OpenAI' },
  { label: '创建时间', value: '2026-01-15' },
  { label: '最后更新', value: '2026-03-18' },
]

// 最近调用记录
const recentCalls = [
  { time: '14:23:05', tokens: 2340, latency: '312ms', status: '成功' },
  { time: '14:22:51', tokens: 1850, latency: '287ms', status: '成功' },
  { time: '14:22:30', tokens: 4120, latency: '456ms', status: '成功' },
  { time: '14:21:58', tokens: 980, latency: '198ms', status: '成功' },
  { time: '14:21:12', tokens: 3200, latency: '401ms', status: '失败' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 顶部区域：返回按钮 + 模型名称 + 标签 + 状态 + 操作按钮 -->
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          class="mt-0.5 shrink-0"
          @click="router.back()"
        >
          <ArrowLeft class="size-4" />
        </Button>
        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">
              {{ model.name }}
            </h2>
            <Badge variant="secondary">
              {{ model.type }}
            </Badge>
            <div class="flex items-center gap-1.5">
              <Circle class="size-2 fill-emerald-500 text-emerald-500" />
              <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">运行中</span>
            </div>
          </div>
          <p class="mt-1.5 text-sm text-muted-foreground">
            {{ model.provider }} · 创建于 {{ model.createdAt }}
          </p>
        </div>
      </div>
      <Button variant="outline" class="shrink-0">
        <Settings class="mr-2 size-4" />
        编辑配置
      </Button>
    </div>

    <!-- 指标卡片 — 渐变背景 + 毛玻璃图标容器 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        v-for="item in metrics"
        :key="item.label"
        class="overflow-hidden border-0 shadow-sm transition-all hover:shadow-md"
      >
        <div :class="cn('bg-gradient-to-br', item.color)">
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">
              {{ item.label }}
            </CardTitle>
            <div
              :class="cn(
                'rounded-lg bg-background/60 p-2 backdrop-blur-sm',
                item.iconColor,
              )"
            >
              <component :is="item.icon" class="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold tracking-tight">
              {{ item.value }}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>

    <!-- Tab 区域：调用记录 / 模型配置 / 运行日志 -->
    <Tabs default-value="calls">
      <TabsList>
        <TabsTrigger value="calls" class="gap-1.5">
          <FileText class="size-3.5" />
          调用记录
        </TabsTrigger>
        <TabsTrigger value="config" class="gap-1.5">
          <LayoutGrid class="size-3.5" />
          模型配置
        </TabsTrigger>
        <TabsTrigger value="logs" class="gap-1.5">
          <ScrollText class="size-3.5" />
          运行日志
        </TabsTrigger>
      </TabsList>

      <!-- 调用记录 -->
      <TabsContent value="calls">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <CardTitle class="text-base">
              最近调用
            </CardTitle>
            <CardDescription>最近 5 条推理调用记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>Token 数</TableHead>
                  <TableHead>延迟</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(call, i) in recentCalls" :key="i">
                  <TableCell class="font-mono text-sm">
                    {{ call.time }}
                  </TableCell>
                  <TableCell class="tabular-nums">
                    {{ call.tokens.toLocaleString() }}
                  </TableCell>
                  <TableCell class="tabular-nums">
                    {{ call.latency }}
                  </TableCell>
                  <TableCell>
                    <Badge
                      :variant="call.status === '成功' ? 'secondary' : 'destructive'"
                    >
                      {{ call.status }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 模型配置 -->
      <TabsContent value="config">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <CardTitle class="text-base">
              配置详情
            </CardTitle>
            <CardDescription>当前模型的运行参数</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div
                v-for="item in configItems"
                :key="item.label"
                class="space-y-1 rounded-lg bg-muted/40 px-4 py-3"
              >
                <p class="text-xs font-medium text-muted-foreground">
                  {{ item.label }}
                </p>
                <p class="break-all font-mono text-sm font-medium text-foreground">
                  {{ item.value }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 运行日志 -->
      <TabsContent value="logs">
        <Card class="border-0 shadow-sm">
          <CardContent class="flex flex-col items-center justify-center py-16">
            <div class="flex size-12 items-center justify-center rounded-full bg-muted">
              <ScrollText class="size-5 text-muted-foreground" />
            </div>
            <h3 class="mt-4 text-sm font-medium text-foreground">
              暂无运行日志
            </h3>
            <p class="mt-1.5 text-center text-xs text-muted-foreground">
              模型运行后，日志将在此处展示
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
