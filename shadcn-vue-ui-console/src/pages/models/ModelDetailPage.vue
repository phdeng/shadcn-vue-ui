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
import { Skeleton } from '@ui/components/ui/skeleton'
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { getModelById, mockModelCalls } from '@/mocks'

const router = useRouter()
const route = useRoute()
const activeTab = ref('calls')
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// 根据路由参数查找模型（支持 id 或 name 匹配）
const modelId = route.params.id as string
const mockModel = getModelById(modelId)

const model = computed(() => {
  if (!mockModel) {
    return { id: modelId, name: modelId, provider: '未知', type: 'chat', status: 'stopped' as const, endpoint: '—', maxTokens: 0, temperature: 0, createdAt: '—', updatedAt: '—', calls: 0, latency: '—' }
  }
  return mockModel
})

// 指标卡片 — 渐变背景风格，根据模型真实数据动态生成
const metrics = computed(() => [
  {
    label: '总调用次数',
    value: model.value.calls.toLocaleString(),
    icon: Activity,
    color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: '平均延迟',
    value: model.value.latency,
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
    value: Math.round(model.value.calls * 0.026).toLocaleString(),
    icon: Zap,
    color: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
])

// 模型配置项 — 动态绑定
const configItems = computed(() => [
  { label: 'API 端点', value: model.value.endpoint },
  { label: '最大 Token', value: model.value.maxTokens.toLocaleString() },
  { label: 'Temperature', value: String(model.value.temperature) },
  { label: '提供商', value: model.value.provider },
  { label: '创建时间', value: model.value.createdAt },
  { label: '最后更新', value: model.value.updatedAt },
])

/** 编辑配置 */
function handleEditConfig() {
  toast.info('编辑模型配置', { description: `${model.name} — 修改参数后将立即生效` })
}

// 运行日志数据
const runLogs = [
  { time: '14:23:05', level: 'INFO', message: '[GPT-4o] 推理请求已处理 — tokens: 2340, latency: 312ms' },
  { time: '14:22:51', level: 'INFO', message: '[GPT-4o] 推理请求已处理 — tokens: 1850, latency: 287ms' },
  { time: '14:22:30', level: 'WARN', message: '[GPT-4o] 响应延迟超过阈值 — latency: 456ms (阈值: 400ms)' },
  { time: '14:21:58', level: 'INFO', message: '[GPT-4o] 推理请求已处理 — tokens: 980, latency: 198ms' },
  { time: '14:21:12', level: 'ERROR', message: '[GPT-4o] 推理请求失败 — status: 429 Rate Limit Exceeded' },
  { time: '14:20:45', level: 'INFO', message: '[GPT-4o] 推理请求已处理 — tokens: 1520, latency: 265ms' },
  { time: '14:19:30', level: 'INFO', message: '[GPT-4o] 健康检查通过 — endpoint: api.openai.com' },
]

// 最近调用记录 — 从 mock 数据中按模型名称过滤
const recentCalls = computed(() => {
  const modelName = model.value.name
  return mockModelCalls
    .filter(c => c.model === modelName)
    .slice(0, 5)
    .map(c => ({
      time: c.time.split(' ')[1] || c.time,
      tokens: c.tokens,
      latency: c.latency,
      status: c.status === 'success' ? '成功' : c.status === 'failed' ? '失败' : '超时',
    }))
})
</script>

<template>
  <div>
    <!-- 详情页骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-6">
    <div class="flex items-center gap-3">
      <Skeleton class="size-9 rounded-lg" />
      <div class="space-y-2">
        <Skeleton class="h-7 w-40" />
        <Skeleton class="h-4 w-56" />
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Skeleton v-for="i in 4" :key="i" class="h-[100px] rounded-xl" />
    </div>
    <Skeleton class="h-[360px] rounded-xl" />
  </div>

  <div v-else class="flex flex-col gap-6">
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
              {{ model.type === 'chat' ? '大语言模型' : model.type }}
            </Badge>
            <div class="flex items-center gap-1.5">
              <Circle
                :class="cn(
                  'size-2',
                  model.status === 'running' ? 'fill-emerald-500 text-emerald-500' : model.status === 'error' ? 'fill-red-500 text-red-500' : 'fill-gray-400 text-gray-400',
                )"
              />
              <span
                :class="cn(
                  'text-xs font-medium',
                  model.status === 'running' ? 'text-emerald-600 dark:text-emerald-400' : model.status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-500',
                )"
              >
                {{ model.status === 'running' ? '运行中' : model.status === 'error' ? '异常' : '已停止' }}
              </span>
            </div>
          </div>
          <p class="mt-1.5 text-sm text-muted-foreground">
            {{ model.provider }} · 创建于 {{ model.createdAt }}
          </p>
        </div>
      </div>
      <Button variant="outline" class="shrink-0" @click="handleEditConfig">
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
          <CardHeader>
            <CardTitle class="text-base">
              运行日志
            </CardTitle>
            <CardDescription>模型推理服务实时日志</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="rounded-lg bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-300 max-h-[400px] overflow-y-auto space-y-1">
              <div v-for="(log, i) in runLogs" :key="i" class="flex gap-2">
                <span class="text-zinc-500 shrink-0">{{ log.time }}</span>
                <span
                  :class="cn(
                    'shrink-0 w-12',
                    log.level === 'ERROR' ? 'text-red-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-emerald-400',
                  )"
                >
                  {{ log.level }}
                </span>
                <span>{{ log.message }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
  </div>
</template>
