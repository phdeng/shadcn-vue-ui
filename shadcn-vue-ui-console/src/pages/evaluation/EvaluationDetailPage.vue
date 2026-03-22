<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Label } from '@ui/components/ui/label'
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
  ArrowLeft,
  BarChart3,
  Clock,
  FileText,
  Settings,
  Target,
  Zap,
} from 'lucide-vue-next'
/**
 * @description 评测详情/报告页 — Tab 布局：评测报告 / 样本对比 / 评测配置
 * @author Timon
 */
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// ==================== 评测数据 ====================

const evaluation = {
  id: route.params.id as string,
  name: '客服模型 v2 综合评测',
  model: 'Qwen2.5-72B',
  dataset: '客服对话测试集',
  status: 'completed' as const,
  overallScore: 87.3,
  bleuScore: 42.8,
  rougeLScore: 78.5,
  inferenceLatency: '128ms',
  createdAt: '2026-03-22 10:30',
}

const statusConfig = {
  running: { label: '进行中', dotClass: 'bg-primary animate-pulse', badgeClass: 'bg-primary/10 text-primary' },
  completed: { label: '已完成', dotClass: 'bg-success', badgeClass: 'bg-success/10 text-success' },
  failed: { label: '失败', dotClass: 'bg-destructive', badgeClass: 'bg-destructive/10 text-destructive' },
}

// ==================== 统计卡片 ====================

const stats = [
  { label: '综合评分', value: `${evaluation.overallScore}`, icon: Target, iconBase: 'text-chart-1/20 dark:text-chart-1/10', iconHover: 'group-hover:text-chart-1/40 dark:group-hover:text-chart-1/25', glow: 'from-chart-1/30 via-chart-1/8 to-transparent' },
  { label: 'BLEU 分数', value: `${evaluation.bleuScore}`, icon: BarChart3, iconBase: 'text-chart-4/20 dark:text-chart-4/10', iconHover: 'group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25', glow: 'from-chart-4/30 via-chart-4/8 to-transparent' },
  { label: 'ROUGE-L 分数', value: `${evaluation.rougeLScore}`, icon: FileText, iconBase: 'text-success/20 dark:text-success/10', iconHover: 'group-hover:text-success/40 dark:group-hover:text-success/25', glow: 'from-success/30 via-success/8 to-transparent' },
  { label: '推理延迟', value: evaluation.inferenceLatency, icon: Zap, iconBase: 'text-chart-5/20 dark:text-chart-5/10', iconHover: 'group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25', glow: 'from-chart-5/30 via-chart-5/8 to-transparent' },
]

// ==================== 评测指标 ====================

interface Metric {
  name: string
  score: number
  baseline: number
  description: string
}

const metrics: Metric[] = [
  { name: 'BLEU', score: 42.8, baseline: 38.5, description: '机器翻译质量评估，衡量生成文本与参考文本的 n-gram 重叠度' },
  { name: 'ROUGE-1', score: 81.2, baseline: 76.0, description: '单字粒度的召回率，衡量生成摘要覆盖参考摘要的程度' },
  { name: 'ROUGE-L', score: 78.5, baseline: 72.3, description: '最长公共子序列，衡量生成文本的流畅度与连贯性' },
  { name: 'F1', score: 89.1, baseline: 85.4, description: '精确率与召回率的调和平均，综合衡量分类/问答质量' },
  { name: 'Accuracy', score: 91.7, baseline: 88.0, description: '分类准确率，衡量模型预测正确的比例' },
]

// ==================== 样本对比 ====================

interface Sample {
  id: string
  input: string
  reference: string
  output: string
  score: number
}

const samples: Sample[] = [
  { id: 's1', input: '如何重置我的账户密码？', reference: '您可以通过「设置 > 安全」页面点击"重置密码"按钮，系统会发送验证邮件到您的注册邮箱。', output: '请前往「设置 > 安全设置」，点击"修改密码"，系统将发送重置链接到您的邮箱。', score: 92 },
  { id: 's2', input: '你们的产品支持哪些数据格式导入？', reference: '支持 CSV、JSON、Excel（.xlsx）、Parquet 四种格式，单文件上限 500MB。', output: '目前支持 CSV、JSON、Excel 和 Parquet 格式导入，文件大小限制为 500MB。', score: 95 },
  { id: 's3', input: '训练任务失败了怎么办？', reference: '请检查数据集格式是否正确，确认 GPU 资源是否充足，然后在训练列表中点击「重新训练」。', output: '建议您检查数据格式和 GPU 配额，然后在训练页面重新提交任务。', score: 88 },
  { id: 's4', input: '如何配置 API 调用限流？', reference: '在「系统设置 > API 管理」中设置每秒请求数（QPS）和每日调用上限。', output: '您可以在系统设置的 API 管理模块中配置 QPS 限制和每日调用量上限。', score: 90 },
  { id: 's5', input: '知识库索引需要多长时间？', reference: '取决于文档数量和大小，通常 100 篇文档约需 5-10 分钟完成索引。', output: '索引时间取决于文档量，一般 100 篇文档需要 5 到 10 分钟。', score: 93 },
]

// ==================== 评测配置 ====================

const configItems = [
  { label: '评测任务名', value: evaluation.name },
  { label: '评测模型', value: evaluation.model },
  { label: '评测数据集', value: evaluation.dataset },
  { label: '评测指标', value: 'BLEU, ROUGE-1, ROUGE-L, F1, Accuracy' },
  { label: '创建时间', value: evaluation.createdAt },
]

/** 返回指标分数颜色 */
function scoreColor(score: number): string {
  if (score >= 90) return 'text-success'
  if (score >= 70) return 'text-chart-1'
  if (score >= 50) return 'text-warning'
  return 'text-destructive'
}

/** 进度条颜色 */
function barColor(score: number): string {
  if (score >= 90) return 'bg-success'
  if (score >= 70) return 'bg-chart-1'
  if (score >= 50) return 'bg-warning'
  return 'bg-destructive'
}
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-6">
      <div class="flex items-center gap-3">
        <Skeleton class="size-9 rounded-lg" />
        <div class="space-y-2">
          <Skeleton class="h-7 w-48" />
          <Skeleton class="h-4 w-32" />
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-4">
        <Skeleton v-for="i in 4" :key="i" class="h-[88px] rounded-xl" />
      </div>
      <Skeleton class="h-[400px] rounded-xl" />
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- 页面头部 -->
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" class="size-9 rounded-xl" aria-label="返回" @click="router.push('/evaluation')">
          <ArrowLeft class="size-4" />
        </Button>
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-semibold tracking-tight">
              {{ evaluation.name }}
            </h2>
            <Badge
              variant="secondary"
              :class="cn('gap-1.5 border-0 text-[11px] font-medium', statusConfig[evaluation.status].badgeClass)"
            >
              <span :class="cn('size-1.5 rounded-full', statusConfig[evaluation.status].dotClass)" />
              {{ statusConfig[evaluation.status].label }}
            </Badge>
          </div>
          <p class="mt-1 text-sm text-muted-foreground">
            模型：{{ evaluation.model }}
          </p>
        </div>
      </div>

      <!-- 统计卡片 — 4 个 HUD 水印 -->
      <div class="grid gap-4 sm:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
        >
          <component
            :is="stat.icon"
            :class="cn('absolute right-4 top-1/2 -translate-y-1/2 size-20 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6', stat.iconBase, stat.iconHover)"
          />
          <div :class="cn('absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100', stat.glow)" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">{{ stat.label }}</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ stat.value }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 区域 -->
      <Tabs default-value="report" class="w-full">
        <TabsList>
          <TabsTrigger value="report">
            <BarChart3 class="mr-1.5 size-3.5" />
            评测报告
          </TabsTrigger>
          <TabsTrigger value="samples">
            <FileText class="mr-1.5 size-3.5" />
            样本对比
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings class="mr-1.5 size-3.5" />
            评测配置
          </TabsTrigger>
        </TabsList>

        <!-- Tab 1：评测报告 -->
        <TabsContent value="report" class="mt-4">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader class="pb-3">
              <CardTitle class="text-[15px] font-semibold">
                评测指标
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-5">
              <div
                v-for="metric in metrics"
                :key="metric.name"
                class="space-y-2"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-medium w-20">{{ metric.name }}</span>
                    <span class="text-xs text-muted-foreground">{{ metric.description }}</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-muted-foreground">基线 {{ metric.baseline }}</span>
                    <span :class="cn('text-sm font-semibold tabular-nums', scoreColor(metric.score))">
                      {{ metric.score }}
                    </span>
                  </div>
                </div>
                <div class="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <!-- 基线标记 -->
                  <div
                    class="absolute top-0 h-full w-0.5 bg-muted-foreground/40 z-10"
                    :style="{ left: `${metric.baseline}%` }"
                  />
                  <!-- 实际分数 -->
                  <div
                    :class="cn('h-full rounded-full transition-all duration-500', barColor(metric.score))"
                    :style="{ width: `${metric.score}%` }"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Tab 2：样本对比 -->
        <TabsContent value="samples" class="mt-4">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader class="pb-3">
              <CardTitle class="text-[15px] font-semibold">
                评测样本
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-[25%]">输入</TableHead>
                    <TableHead class="w-[30%]">标准答案</TableHead>
                    <TableHead class="w-[30%]">模型输出</TableHead>
                    <TableHead class="w-[15%] text-right">评分</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="sample in samples" :key="sample.id">
                    <TableCell class="text-sm align-top">
                      {{ sample.input }}
                    </TableCell>
                    <TableCell class="text-xs text-muted-foreground align-top leading-relaxed">
                      {{ sample.reference }}
                    </TableCell>
                    <TableCell class="text-xs align-top leading-relaxed">
                      {{ sample.output }}
                    </TableCell>
                    <TableCell class="text-right align-top">
                      <span :class="cn('text-sm font-semibold tabular-nums', scoreColor(sample.score))">
                        {{ sample.score }}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Tab 3：评测配置 -->
        <TabsContent value="config" class="mt-4">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader class="pb-3">
              <CardTitle class="text-[15px] font-semibold">
                评测配置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid gap-4 max-w-lg">
                <div
                  v-for="item in configItems"
                  :key="item.label"
                  class="grid grid-cols-[120px_1fr] items-center gap-2"
                >
                  <Label class="text-sm text-muted-foreground">{{ item.label }}</Label>
                  <span class="text-sm">{{ item.value }}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
