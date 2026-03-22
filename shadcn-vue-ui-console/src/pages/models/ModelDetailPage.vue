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
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import { Separator } from '@ui/components/ui/separator'
import { Skeleton } from '@ui/components/ui/skeleton'
import { cn } from '@ui/lib/utils'
import {
  Activity,
  ArrowLeft,
  Circle,
  Clock,
  FileText,
  LayoutGrid,
  Link,
  Plus,
  ScrollText,
  Send,
  Settings,
  Sparkles,
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

// 指标卡片 — HUD 水印风格，根据模型真实数据动态生成
const metrics = computed(() => [
  { label: '总调用次数', value: model.value.calls.toLocaleString(), icon: Activity, iconBase: 'text-chart-1/20 dark:text-chart-1/10', iconHover: 'group-hover:text-chart-1/40 dark:group-hover:text-chart-1/25', glow: 'from-chart-1/30 via-chart-1/8 to-transparent' },
  { label: '平均延迟', value: model.value.latency, icon: Clock, iconBase: 'text-chart-5/20 dark:text-chart-5/10', iconHover: 'group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25', glow: 'from-chart-5/30 via-chart-5/8 to-transparent' },
  { label: '成功率', value: '99.2%', icon: TrendingUp, iconBase: 'text-success/20 dark:text-success/10', iconHover: 'group-hover:text-success/40 dark:group-hover:text-success/25', glow: 'from-success/30 via-success/8 to-transparent' },
  { label: '今日调用', value: Math.round(model.value.calls * 0.026).toLocaleString(), icon: Zap, iconBase: 'text-chart-4/20 dark:text-chart-4/10', iconHover: 'group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25', glow: 'from-chart-4/30 via-chart-4/8 to-transparent' },
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

// ==================== 关联资源 mock 数据 ====================

/** 相关训练任务 */
const relatedTrainingJobs = [
  { id: 't1', name: '客服模型 v2 微调', status: 'running' as const, createdAt: '2026-03-22 08:15' },
  { id: 't2', name: '代码审查模型 SFT', status: 'completed' as const, createdAt: '2026-03-20 14:00' },
  { id: 't5', name: '多轮对话增强训练', status: 'completed' as const, createdAt: '2026-03-18 09:30' },
]

const trainingStatusConfig: Record<string, { label: string, dotClass: string, badgeClass: string }> = {
  running: { label: '训练中', dotClass: 'bg-primary animate-pulse', badgeClass: 'bg-primary/10 text-primary' },
  completed: { label: '已完成', dotClass: 'bg-success', badgeClass: 'bg-success/10 text-success' },
}

/** 部署实例 */
const relatedDeployments = [
  { id: 'd1', name: 'prod-gpt4o-service', status: 'running' as const, qps: 128 },
  { id: 'd2', name: 'staging-gpt4o-test', status: 'stopped' as const, qps: 0 },
]

const deploymentStatusConfig: Record<string, { label: string, dotClass: string, badgeClass: string }> = {
  running: { label: '运行中', dotClass: 'bg-success', badgeClass: 'bg-success/10 text-success' },
  stopped: { label: '已停止', dotClass: 'bg-muted-foreground', badgeClass: 'bg-muted text-muted-foreground' },
}

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

// ==================== 推理测试 ====================

interface InferenceResult {
  output: string
  tokens: number
  latency: string
  model: string
}

const inferenceSystemPrompt = ref((model.value as any).systemPrompt ?? '')
const inferenceTemperature = ref(0.7)
const inferenceMaxTokens = ref(2048)
const inferenceQuery = ref('')
const inferenceLoading = ref(false)
const inferenceResult = ref<InferenceResult | null>(null)

/** 执行推理测试 */
function handleInferenceTest() {
  const q = inferenceQuery.value.trim()
  if (!q) return
  inferenceLoading.value = true
  inferenceResult.value = null
  // 模拟 API 调用
  setTimeout(() => {
    inferenceResult.value = {
      output: `基于您的输入「${q}」，模型分析如下：\n\n1. 这是一个关于「${q.slice(0, 20)}」的推理请求。模型已根据当前配置（Temperature: ${inferenceTemperature.value}, Max Tokens: ${inferenceMaxTokens.value}）生成以下结果。\n\n2. 系统提示词${inferenceSystemPrompt.value ? '已应用' : '未设置'}，模型在对应上下文中完成推理。\n\n3. 推理过程经过多步思维链分析，综合考虑了输入语义、上下文关联和知识库匹配等因素，最终生成此响应。`,
      tokens: Math.floor(Math.random() * 800) + 200,
      latency: `${(Math.random() * 400 + 200).toFixed(0)}ms`,
      model: model.value.name,
    }
    inferenceLoading.value = false
  }, 800)
}
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

  <div v-else class="flex flex-col gap-8">
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
            <h2 class="text-2xl font-bold tracking-tight text-foreground">
              {{ model.name }}
            </h2>
            <Badge variant="secondary">
              {{ model.type === 'chat' ? '大语言模型' : model.type }}
            </Badge>
            <div class="flex items-center gap-1.5">
              <Circle
                :class="cn(
                  'size-2',
                  model.status === 'running' ? 'fill-success text-success' : model.status === 'error' ? 'fill-destructive text-destructive' : 'fill-muted-foreground text-muted-foreground',
                )"
              />
              <span
                :class="cn(
                  'text-xs font-medium',
                  model.status === 'running' ? 'text-success' : model.status === 'error' ? 'text-destructive' : 'text-muted-foreground',
                )"
              >
                {{ model.status === 'running' ? '运行中' : model.status === 'error' ? '异常' : '已停止' }}
              </span>
            </div>
          </div>
          <p class="mt-1.5 text-[13px] text-muted-foreground">
            {{ model.provider }} · 创建于 {{ model.createdAt }}
          </p>
        </div>
      </div>
      <Button variant="outline" class="shrink-0" @click="handleEditConfig">
        <Settings class="mr-2 size-4" />
        编辑配置
      </Button>
    </div>

    <!-- 指标卡片 — HUD 水印风格 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in metrics"
        :key="item.label"
        class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
      >
        <component
          :is="item.icon"
          :class="cn('absolute right-4 top-1/2 -translate-y-1/2 size-20 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6', item.iconBase, item.iconHover)"
        />
        <div :class="cn('absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100', item.glow)" />
        <div class="relative z-10">
          <span class="text-[13px] font-medium text-muted-foreground">{{ item.label }}</span>
          <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 区域：调用记录 / 模型配置 / 运行日志 -->
    <Tabs default-value="calls">
      <TabsList>
        <TabsTrigger value="inference" class="gap-1.5">
          <Sparkles class="size-3.5" />
          推理测试
        </TabsTrigger>
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
        <TabsTrigger value="relations" class="gap-1.5">
          <Link class="size-3.5" />
          关联资源
        </TabsTrigger>
      </TabsList>

      <!-- ==================== 推理测试（左右分栏） ==================== -->
      <TabsContent value="inference">
        <div class="grid gap-4 lg:grid-cols-[360px_1fr]">
          <!-- 左侧：配置面板 -->
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm shadow-xs self-start">
            <CardHeader class="pb-4">
              <CardTitle class="text-[15px] font-semibold">推理配置</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- 系统提示词 -->
              <div class="space-y-2.5">
                <Label class="text-xs font-medium">系统提示词</Label>
                <textarea
                  v-model="inferenceSystemPrompt"
                  rows="3"
                  placeholder="设置系统提示词（可选）"
                  class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                />
              </div>

              <!-- Temperature -->
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <Label class="text-xs font-medium">Temperature</Label>
                  <Input
                    v-model.number="inferenceTemperature"
                    type="number"
                    :min="0"
                    :max="2"
                    :step="0.1"
                    class="h-6 w-14 text-xs text-center rounded-md"
                  />
                </div>
                <input
                  v-model.number="inferenceTemperature"
                  type="range"
                  :min="0"
                  :max="2"
                  :step="0.1"
                  class="w-full accent-primary h-1.5"
                >
                <div class="flex justify-between text-[10px] text-muted-foreground/60">
                  <span>0</span>
                  <span>2</span>
                </div>
              </div>

              <!-- Max Tokens -->
              <div class="space-y-2.5">
                <div class="flex items-center justify-between">
                  <Label class="text-xs font-medium">Max Tokens</Label>
                  <Input
                    v-model.number="inferenceMaxTokens"
                    type="number"
                    :min="256"
                    :max="8192"
                    class="h-6 w-14 text-xs text-center rounded-md"
                  />
                </div>
                <input
                  v-model.number="inferenceMaxTokens"
                  type="range"
                  :min="256"
                  :max="8192"
                  class="w-full accent-primary h-1.5"
                >
                <div class="flex justify-between text-[10px] text-muted-foreground/60">
                  <span>256</span>
                  <span>8192</span>
                </div>
              </div>

              <Separator class="border-border/50" />

              <!-- 输入提示词 -->
              <div class="space-y-2.5">
                <Label class="text-xs font-medium">输入</Label>
                <textarea
                  v-model="inferenceQuery"
                  rows="4"
                  placeholder="输入提示词测试模型推理..."
                  class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                  @keydown.meta.enter="handleInferenceTest"
                />
                <div class="flex items-center justify-between">
                  <p class="text-[10px] text-muted-foreground/60">⌘ + Enter 发送</p>
                  <Button
                    size="sm"
                    :disabled="!inferenceQuery.trim() || inferenceLoading"
                    @click="handleInferenceTest"
                  >
                    <Send class="mr-1.5 size-3.5" />
                    测试
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- 右侧：结果展示 -->
          <Card class="border border-border/40 shadow-xs">
            <CardHeader class="pb-4">
              <div class="flex items-center gap-2.5">
                <CardTitle class="text-[15px] font-semibold">{{ model.name }}</CardTitle>
                <Badge variant="secondary" class="text-[10px]">
                  {{ model.type === 'chat' ? '大语言模型' : model.type }}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <!-- 加载态 -->
              <div v-if="inferenceLoading" class="space-y-3">
                <Skeleton v-for="i in 4" :key="i" class="h-5 rounded-lg" :class="i === 4 ? 'w-2/3' : 'w-full'" />
              </div>

              <!-- 结果展示 -->
              <div v-else-if="inferenceResult" class="space-y-4">
                <div class="rounded-xl border border-border/40 bg-card/80 p-4">
                  <p class="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                    {{ inferenceResult.output }}
                  </p>
                </div>
                <div class="flex items-center gap-4 text-[11px] text-muted-foreground/60">
                  <span class="font-mono tabular-nums">Token: {{ inferenceResult.tokens }}</span>
                  <span class="font-mono tabular-nums">延迟: {{ inferenceResult.latency }}</span>
                  <span>模型: {{ inferenceResult.model }}</span>
                </div>
              </div>

              <!-- 空状态 -->
              <div
                v-else
                class="flex flex-col items-center justify-center gap-4 py-24"
              >
                <Sparkles class="size-16 text-muted-foreground/20" />
                <div class="text-center">
                  <p class="text-sm font-medium text-muted-foreground">等待推理</p>
                  <p class="mt-1.5 text-xs text-muted-foreground/60">
                    请在左侧输入提示词，点击测试进行推理
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- 调用记录 -->
      <TabsContent value="calls">
        <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader>
            <CardTitle class="text-[15px] font-semibold">
              最近调用
            </CardTitle>
            <CardDescription>最近 5 条推理调用记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">时间</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Token 数</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">延迟</TableHead>
                  <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">状态</TableHead>
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
        <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader>
            <CardTitle class="text-[15px] font-semibold">
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
        <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader>
            <CardTitle class="text-[15px] font-semibold">
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
                    log.level === 'ERROR' ? 'text-destructive' : log.level === 'WARN' ? 'text-warning' : 'text-success',
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

      <!-- 关联资源 -->
      <TabsContent value="relations">
        <div class="grid gap-6 lg:grid-cols-2">
          <!-- 相关训练任务 -->
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px] font-semibold">相关训练任务</CardTitle>
              <CardDescription>使用该模型作为基座的训练任务</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <div
                v-for="job in relatedTrainingJobs"
                :key="job.id"
                class="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30"
                @click="router.push(`/training/${job.id}`)"
              >
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate">{{ job.name }}</p>
                  <p class="mt-0.5 text-xs text-muted-foreground">{{ job.createdAt }}</p>
                </div>
                <Badge
                  variant="secondary"
                  :class="cn('gap-1.5 border-0 text-[10px] tracking-wide font-medium shrink-0 ml-3', trainingStatusConfig[job.status].badgeClass)"
                >
                  <span :class="cn('size-1.5 rounded-full', trainingStatusConfig[job.status].dotClass)" />
                  {{ trainingStatusConfig[job.status].label }}
                </Badge>
              </div>
              <!-- 查看全部 -->
              <Button
                variant="ghost"
                size="sm"
                class="w-full text-xs text-muted-foreground hover:text-foreground"
                @click="router.push('/training')"
              >
                查看全部训练任务
              </Button>
            </CardContent>
          </Card>

          <!-- 部署实例 -->
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px] font-semibold">部署实例</CardTitle>
              <CardDescription>该模型关联的部署服务</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              <div
                v-for="dep in relatedDeployments"
                :key="dep.id"
                class="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/30"
                @click="router.push('/deployments')"
              >
                <div class="min-w-0">
                  <p class="text-sm font-medium font-mono truncate">{{ dep.name }}</p>
                  <p class="mt-0.5 text-xs text-muted-foreground tabular-nums">QPS: {{ dep.qps }}</p>
                </div>
                <Badge
                  variant="secondary"
                  :class="cn('gap-1.5 border-0 text-[10px] tracking-wide font-medium shrink-0 ml-3', deploymentStatusConfig[dep.status].badgeClass)"
                >
                  <span :class="cn('size-1.5 rounded-full', deploymentStatusConfig[dep.status].dotClass)" />
                  {{ deploymentStatusConfig[dep.status].label }}
                </Badge>
              </div>
              <!-- 创建部署 -->
              <Button
                size="sm"
                class="w-full"
                @click="router.push('/deployments/create')"
              >
                <Plus class="mr-2 size-4" />
                创建部署
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
  </div>
</template>
