<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
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
  Brain,
  Cpu,
  Layers,
  Plus,
  TrendingDown,
  Zap,
} from 'lucide-vue-next'
/**
 * @description 蒸馏与量化工作台 — 管理模型蒸馏与量化任务
 * @author Timon
 */
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const loading = ref(true)
setTimeout(() => { loading.value = false }, 600)

// ==================== 状态配置 ====================

type TaskStatus = 'completed' | 'running' | 'failed' | 'queued'

const statusConfig: Record<TaskStatus, { label: string, dotClass: string, badgeClass: string }> = {
  completed: { label: '已完成', dotClass: 'bg-success', badgeClass: 'bg-success/10 text-success' },
  running: { label: '进行中', dotClass: 'bg-primary animate-pulse', badgeClass: 'bg-primary/10 text-primary' },
  failed: { label: '失败', dotClass: 'bg-destructive', badgeClass: 'bg-destructive/10 text-destructive' },
  queued: { label: '排队中', dotClass: 'bg-muted-foreground', badgeClass: 'bg-muted text-muted-foreground' },
}

// ==================== 蒸馏任务数据 ====================

interface DistillationTask {
  id: string
  name: string
  teacherModel: string
  studentModel: string
  method: '知识蒸馏' | '特征蒸馏'
  status: TaskStatus
  compression: string
  accuracy: string
  createdAt: string
}

const distillationTasks = ref<DistillationTask[]>([
  { id: 'd1', name: 'GPT-4o 知识蒸馏', teacherModel: 'GPT-4o', studentModel: 'GPT-4o-mini', method: '知识蒸馏', status: 'completed', compression: '4x', accuracy: '96.3%', createdAt: '2026-03-20 14:30' },
  { id: 'd2', name: 'Qwen 特征蒸馏', teacherModel: 'Qwen2.5-72B', studentModel: 'Qwen2.5-7B', method: '特征蒸馏', status: 'running', compression: '10x', accuracy: '—', createdAt: '2026-03-21 09:15' },
  { id: 'd3', name: 'DeepSeek 知识蒸馏', teacherModel: 'DeepSeek-V3', studentModel: 'DeepSeek-V3-Lite', method: '知识蒸馏', status: 'completed', compression: '6x', accuracy: '94.8%', createdAt: '2026-03-19 16:42' },
  { id: 'd4', name: 'Claude 特征蒸馏', teacherModel: 'Claude 3.5', studentModel: 'Claude 3.5-Lite', method: '特征蒸馏', status: 'failed', compression: '8x', accuracy: '—', createdAt: '2026-03-18 11:20' },
  { id: 'd5', name: 'Llama 知识蒸馏', teacherModel: 'Llama-3.1-70B', studentModel: 'Llama-3.1-8B', method: '知识蒸馏', status: 'completed', compression: '8.75x', accuracy: '95.1%', createdAt: '2026-03-17 08:55' },
])

// ==================== 量化任务数据 ====================

interface QuantizationTask {
  id: string
  name: string
  sourceModel: string
  method: 'INT8' | 'INT4' | 'FP16' | 'GPTQ' | 'AWQ'
  status: TaskStatus
  sizeBefore: string
  sizeAfter: string
  accuracyLoss: string
  speedup: string
  createdAt: string
}

const quantizationTasks = ref<QuantizationTask[]>([
  { id: 'q1', name: 'Qwen2.5-72B INT4 量化', sourceModel: 'Qwen2.5-72B', method: 'INT4', status: 'completed', sizeBefore: '144GB', sizeAfter: '36GB', accuracyLoss: '-1.2%', speedup: '3.8x', createdAt: '2026-03-20 10:00' },
  { id: 'q2', name: 'DeepSeek-V3 GPTQ', sourceModel: 'DeepSeek-V3', method: 'GPTQ', status: 'running', sizeBefore: '—', sizeAfter: '—', accuracyLoss: '—', speedup: '—', createdAt: '2026-03-21 15:30' },
  { id: 'q3', name: 'Llama-3.1-70B AWQ', sourceModel: 'Llama-3.1-70B', method: 'AWQ', status: 'completed', sizeBefore: '140GB', sizeAfter: '42GB', accuracyLoss: '-0.8%', speedup: '3.2x', createdAt: '2026-03-19 09:20' },
  { id: 'q4', name: 'GPT-4o FP16 量化', sourceModel: 'GPT-4o', method: 'FP16', status: 'completed', sizeBefore: '320GB', sizeAfter: '160GB', accuracyLoss: '-0.1%', speedup: '1.5x', createdAt: '2026-03-18 14:10' },
  { id: 'q5', name: 'Qwen2.5-72B INT8 量化', sourceModel: 'Qwen2.5-72B', method: 'INT8', status: 'queued', sizeBefore: '—', sizeAfter: '—', accuracyLoss: '—', speedup: '—', createdAt: '2026-03-22 07:45' },
])

// ==================== 精度对比数据 ====================

interface AccuracyMetric {
  metric: string
  original: string
  optimized: string
  diff: string
  diffClass: string
}

const accuracyMetrics: AccuracyMetric[] = [
  { metric: 'BLEU', original: '42.8', optimized: '41.5', diff: '-1.3', diffClass: 'text-warning' },
  { metric: 'ROUGE-L', original: '68.4', optimized: '67.1', diff: '-1.3', diffClass: 'text-warning' },
  { metric: 'F1 Score', original: '91.2', optimized: '89.8', diff: '-1.4', diffClass: 'text-warning' },
  { metric: '推理延迟 (ms)', original: '245', optimized: '68', diff: '-72.2%', diffClass: 'text-success' },
]

// ==================== 事件处理 ====================

/** 创建任务 */
function handleCreate() {
  toast.info('创建蒸馏/量化任务', { description: '功能开发中，敬请期待' })
}
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-6">
      <div class="flex items-end justify-between">
        <div class="space-y-2">
          <Skeleton class="h-8 w-36" />
          <Skeleton class="h-4 w-72" />
        </div>
        <Skeleton class="h-9 w-28" />
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <Skeleton v-for="i in 3" :key="i" class="h-[88px] rounded-xl" />
      </div>
      <Skeleton class="h-[400px] rounded-xl" />
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- 页面头部 -->
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight">
            蒸馏与量化
          </h2>
          <p class="mt-1 text-sm text-muted-foreground">
            管理模型蒸馏与量化任务，优化模型体积与推理性能
          </p>
        </div>
        <Button size="sm" @click="handleCreate">
          <Plus class="mr-2 size-4" />
          创建任务
        </Button>
      </div>

      <!-- 统计概览 — HUD 水印风格 -->
      <div class="grid gap-4 sm:grid-cols-3">
        <!-- 总任务数 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Layers class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-muted-foreground/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-muted-foreground/20" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">总任务数</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              12
            </div>
          </div>
        </div>
        <!-- 进行中 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <Zap class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-chart-5/20 dark:text-chart-5/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25" />
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial from-chart-5/30 via-chart-5/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">进行中</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              2
            </div>
          </div>
        </div>
        <!-- 模型压缩率 -->
        <div class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
          <TrendingDown class="absolute right-4 top-1/2 -translate-y-1/2 size-20 text-success/20 dark:text-success/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 group-hover:text-success/40 dark:group-hover:text-success/25" />
          <div class="absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial from-success/30 via-success/8 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">模型压缩率</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              平均 4.2x
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 区域 -->
      <Tabs default-value="distillation">
        <TabsList class="rounded-xl p-1">
          <TabsTrigger value="distillation" class="gap-1.5 rounded-lg">
            <Brain class="size-3.5" />
            蒸馏任务
          </TabsTrigger>
          <TabsTrigger value="quantization" class="gap-1.5 rounded-lg">
            <Cpu class="size-3.5" />
            量化任务
          </TabsTrigger>
        </TabsList>

        <!-- ==================== Tab 1：蒸馏任务 ==================== -->
        <TabsContent value="distillation">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader class="pb-3">
              <CardTitle class="text-[15px] font-semibold">蒸馏任务</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务名称</TableHead>
                    <TableHead>教师模型</TableHead>
                    <TableHead>学生模型</TableHead>
                    <TableHead>蒸馏方法</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>压缩比</TableHead>
                    <TableHead>精度保留率</TableHead>
                    <TableHead>创建时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="task in distillationTasks" :key="task.id" class="group">
                    <TableCell class="font-medium">{{ task.name }}</TableCell>
                    <TableCell class="text-muted-foreground text-xs">{{ task.teacherModel }}</TableCell>
                    <TableCell class="text-muted-foreground text-xs">{{ task.studentModel }}</TableCell>
                    <TableCell>
                      <Badge variant="outline" class="text-[10px] tracking-wide">{{ task.method }}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        :class="cn('gap-1.5 border-0 text-[11px] font-medium', statusConfig[task.status].badgeClass)"
                      >
                        <span :class="cn('size-1.5 rounded-full', statusConfig[task.status].dotClass)" />
                        {{ statusConfig[task.status].label }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-xs tabular-nums font-mono">{{ task.compression }}</TableCell>
                    <TableCell class="text-xs tabular-nums font-mono">{{ task.accuracy }}</TableCell>
                    <TableCell class="text-xs text-muted-foreground">{{ task.createdAt }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- ==================== Tab 2：量化任务 ==================== -->
        <TabsContent value="quantization">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader class="pb-3">
              <CardTitle class="text-[15px] font-semibold">量化任务</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务名称</TableHead>
                    <TableHead>源模型</TableHead>
                    <TableHead>量化方式</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>模型大小</TableHead>
                    <TableHead>精度损失</TableHead>
                    <TableHead>推理加速</TableHead>
                    <TableHead>创建时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="task in quantizationTasks" :key="task.id" class="group">
                    <TableCell class="font-medium">{{ task.name }}</TableCell>
                    <TableCell class="text-muted-foreground text-xs">{{ task.sourceModel }}</TableCell>
                    <TableCell>
                      <Badge variant="outline" class="text-[10px] tracking-wide font-mono">{{ task.method }}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        :class="cn('gap-1.5 border-0 text-[11px] font-medium', statusConfig[task.status].badgeClass)"
                      >
                        <span :class="cn('size-1.5 rounded-full', statusConfig[task.status].dotClass)" />
                        {{ statusConfig[task.status].label }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-xs tabular-nums font-mono">
                      <template v-if="task.sizeBefore !== '—'">
                        {{ task.sizeBefore }} → {{ task.sizeAfter }}
                      </template>
                      <template v-else>—</template>
                    </TableCell>
                    <TableCell class="text-xs tabular-nums font-mono">{{ task.accuracyLoss }}</TableCell>
                    <TableCell class="text-xs tabular-nums font-mono">{{ task.speedup }}</TableCell>
                    <TableCell class="text-xs text-muted-foreground">{{ task.createdAt }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <!-- 精度对比报告 -->
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader class="pb-3">
          <CardTitle class="text-[15px] font-semibold">精度对比报告</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>指标</TableHead>
                <TableHead>原始模型</TableHead>
                <TableHead>蒸馏/量化后</TableHead>
                <TableHead>差异</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in accuracyMetrics" :key="item.metric">
                <TableCell class="font-medium">{{ item.metric }}</TableCell>
                <TableCell class="text-xs tabular-nums font-mono">{{ item.original }}</TableCell>
                <TableCell class="text-xs tabular-nums font-mono">{{ item.optimized }}</TableCell>
                <TableCell :class="cn('text-xs tabular-nums font-mono font-medium', item.diffClass)">
                  {{ item.diff }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
