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
import { Separator } from '@ui/components/ui/separator'
import { Skeleton } from '@ui/components/ui/skeleton'
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
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  FileText,
  HardDrive,
  ImageIcon,
  Layers,
  Music,
  Sparkles,
  Video,
  Zap,
} from 'lucide-vue-next'
/**
 * @description 数据集详情页 — Tab 布局（数据预览 / 处理历史 / 数据集配置）
 * @author Timon
 */
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

const datasetId = route.params.id as string

// ==================== 数据集信息 ====================

/** 数据模态类型 */
type DataModality = 'text' | 'image' | 'audio' | 'video' | 'multimodal'

/** 模态标签配置 */
const modalityConfig: Record<DataModality, { label: string, icon: typeof FileText }> = {
  text: { label: '文本', icon: FileText },
  image: { label: '图片', icon: ImageIcon },
  audio: { label: '音频', icon: Music },
  video: { label: '视频', icon: Video },
  multimodal: { label: '多模态', icon: Layers },
}

const dataset = {
  id: datasetId,
  name: '客服对话数据',
  status: 'processed' as const,
  modality: 'text' as DataModality,
  format: 'jsonl',
  records: 12340,
  size: '256 MB',
  createdAt: '2026-03-15 10:30',
  type: '对话数据',
  trainingMethod: 'SFT 监督微调',
  description: '包含 12000+ 条客服真实对话记录，涵盖售前咨询、售后服务、投诉处理等场景，已完成清洗和标注。',
  files: ['customer_service_train.jsonl', 'customer_service_eval.jsonl', 'metadata.json'],
}

const statusConfig = {
  processed: { label: '已处理', dotClass: 'bg-success', badgeVariant: 'secondary' as const },
  processing: { label: '处理中', dotClass: 'bg-warning animate-pulse', badgeVariant: 'secondary' as const },
  pending: { label: '待处理', dotClass: 'bg-muted-foreground', badgeVariant: 'outline' as const },
}

/** 格式标签颜色 */
const formatBadgeClass: Record<string, string> = {
  jsonl: 'bg-chart-1/10 text-chart-1',
  json: 'bg-chart-2/10 text-chart-2',
  csv: 'bg-chart-3/10 text-chart-3',
  txt: 'bg-chart-4/10 text-chart-4',
}

// ==================== 统计指标 ====================

const stats = [
  { label: '记录数', value: dataset.records.toLocaleString(), icon: Layers },
  { label: '文件大小', value: dataset.size, icon: HardDrive },
  { label: '创建时间', value: dataset.createdAt, icon: Calendar },
  { label: '格式', value: dataset.format.toUpperCase(), icon: FileText },
]

// ==================== Tab 1：数据预览 ====================

interface SampleRecord {
  id: number
  input: string
  output: string
  expanded: boolean
}

const samples = ref<SampleRecord[]>([
  { id: 1, input: '你好，我想咨询一下你们的退货政策是怎样的？', output: '您好！感谢您的咨询。我们的退货政策如下：自收到商品之日起 7 天内，如商品存在质量问题或与描述不符，您可以申请无条件退货退款。请确保商品未使用且包装完好。', expanded: false },
  { id: 2, input: '我上周买的手机壳有裂纹，可以换一个吗？', output: '非常抱歉给您带来不便！您描述的情况属于质量问题，我们可以为您免费更换。请您提供订单号和商品照片，我们会尽快为您处理换货申请。', expanded: false },
  { id: 3, input: '请问你们有没有企业版的订阅计划？', output: '有的！我们提供企业版订阅计划，包含以下权益：不限量 API 调用、专属技术支持、SLA 保障（99.9% 可用性）、自定义模型训练等。您可以联系我们的企业销售团队获取详细报价。', expanded: false },
  { id: 4, input: '我的订单已经发货了吗？订单号是 2026031500123', output: '让我帮您查询一下。您的订单 2026031500123 已于 2026-03-16 从北京仓库发出，快递单号为 SF1234567890，预计 2026-03-18 到达。您可以在物流页面实时追踪包裹状态。', expanded: false },
  { id: 5, input: '你们的 AI 助手支持哪些语言？', output: '目前我们的 AI 助手支持以下语言：中文（简/繁）、英语、日语、韩语、法语、德语、西班牙语。我们正在持续扩展语言支持范围，预计下季度将新增阿拉伯语和葡萄牙语。', expanded: false },
])

/** 切换样本行展开/收起 */
function toggleExpand(record: SampleRecord) {
  record.expanded = !record.expanded
}

// ==================== Tab 2：处理历史 ====================

interface TimelineEvent {
  time: string
  label: string
  description: string
  type: 'upload' | 'process' | 'complete' | 'training'
}

const timeline: TimelineEvent[] = [
  { time: '2026-03-15 10:30', label: '数据集上传', description: '上传 3 个文件，总大小 256 MB', type: 'upload' },
  { time: '2026-03-15 10:32', label: '开始处理', description: '数据清洗、格式校验、去重', type: 'process' },
  { time: '2026-03-15 11:15', label: '处理完成', description: '有效记录 12,340 条，丢弃 56 条异常数据', type: 'complete' },
  { time: '2026-03-16 09:00', label: '关联训练任务', description: '用于「客服助手 SFT 微调」训练任务 (task-0032)', type: 'training' },
]

const timelineDotClass: Record<string, string> = {
  upload: 'bg-chart-1',
  process: 'bg-chart-5',
  complete: 'bg-success',
  training: 'bg-primary',
}
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-8">
      <div class="flex items-center gap-3">
        <Skeleton class="size-9 rounded-xl" />
        <div class="space-y-2">
          <Skeleton class="h-7 w-48" />
          <Skeleton class="h-4 w-80" />
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-4">
        <Skeleton v-for="i in 4" :key="i" class="h-[76px] rounded-xl" />
      </div>
      <Skeleton class="h-[500px] rounded-xl" />
    </div>

    <div v-else class="flex flex-col gap-8">
      <!-- 顶部：返回 + 数据集名 + 状态 + 格式 -->
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            class="mt-0.5 shrink-0 rounded-xl hover:bg-muted/40 transition-all duration-300"
            @click="router.push('/datasets')"
          >
            <ArrowLeft class="size-4" />
          </Button>
          <div>
            <div class="flex items-center gap-3">
              <Database class="size-5 text-muted-foreground/60" />
              <h2 class="text-2xl font-bold tracking-tight text-foreground">
                {{ dataset.name }}
              </h2>
              <Badge
                :variant="statusConfig[dataset.status].badgeVariant"
                class="gap-1.5 text-[10px] tracking-wide"
              >
                <span :class="cn('size-1.5 rounded-full', statusConfig[dataset.status].dotClass)" />
                {{ statusConfig[dataset.status].label }}
              </Badge>
              <Badge
                variant="outline"
                class="gap-1 text-[10px] tracking-wide"
              >
                <component :is="modalityConfig[dataset.modality].icon" class="size-3" />
                {{ modalityConfig[dataset.modality].label }}
              </Badge>
              <Badge
                variant="secondary"
                :class="cn('border-0 text-[10px] font-medium uppercase', formatBadgeClass[dataset.format] || '')"
              >
                {{ dataset.format }}
              </Badge>
            </div>
            <p class="mt-2 text-[13px] text-muted-foreground">
              {{ dataset.description }}
            </p>
          </div>
        </div>
        <!-- 操作按钮 -->
        <Button class="shrink-0" @click="router.push('/training/create')">
          <Sparkles class="mr-2 size-4" />
          使用此数据集训练
        </Button>
      </div>

      <!-- 统计卡片 — HUD 水印风格 -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="(stat, idx) in stats"
          :key="stat.label"
          class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-5 py-4 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
        >
          <component
            :is="stat.icon"
            :class="cn(
              'absolute right-3 top-1/2 -translate-y-1/2 size-16 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6',
              idx === 0 ? 'text-chart-1/15 group-hover:text-chart-1/30' :
              idx === 1 ? 'text-chart-2/15 group-hover:text-chart-2/30' :
              idx === 2 ? 'text-chart-3/15 group-hover:text-chart-3/30' :
              'text-chart-4/15 group-hover:text-chart-4/30',
            )"
          />
          <div class="relative z-10">
            <p class="text-[13px] text-muted-foreground">{{ stat.label }}</p>
            <p class="mt-1.5 text-lg font-bold tabular-nums tracking-tight">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Tab 区域 -->
      <Tabs default-value="preview" class="w-full">
        <TabsList class="h-10">
          <TabsTrigger value="preview" class="text-xs px-4">数据预览</TabsTrigger>
          <TabsTrigger value="history" class="text-xs px-4">处理历史</TabsTrigger>
          <TabsTrigger value="config" class="text-xs px-4">数据集配置</TabsTrigger>
        </TabsList>

        <!-- ==================== Tab 1：数据预览 ==================== -->
        <TabsContent value="preview" class="mt-6">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-xl shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px]">样本数据</CardTitle>
              <CardDescription>展示前 5 条样本记录，点击行可展开完整内容</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow class="border-border/50">
                    <TableHead class="w-[60px] text-xs font-medium uppercase tracking-wider text-muted-foreground">序号</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">输入</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">输出 / 标签</TableHead>
                    <TableHead class="w-[60px] text-xs font-medium uppercase tracking-wider text-muted-foreground">展开</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <template v-for="record in samples" :key="record.id">
                    <TableRow
                      class="border-border/50 cursor-pointer transition-colors duration-200 hover:bg-muted/30"
                      @click="toggleExpand(record)"
                    >
                      <TableCell class="tabular-nums text-muted-foreground font-mono text-[13px]">
                        {{ record.id }}
                      </TableCell>
                      <TableCell class="max-w-[280px]">
                        <p :class="cn('text-sm', record.expanded ? '' : 'truncate')">
                          {{ record.input }}
                        </p>
                      </TableCell>
                      <TableCell class="max-w-[320px]">
                        <p :class="cn('text-sm text-muted-foreground', record.expanded ? '' : 'truncate')">
                          {{ record.output }}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" class="size-7" @click.stop="toggleExpand(record)">
                          <component :is="record.expanded ? ChevronUp : ChevronDown" class="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <!-- 展开后的完整内容 -->
                    <TableRow v-if="record.expanded" class="border-border/50 bg-muted/10">
                      <TableCell colspan="4" class="px-6 py-4">
                        <div class="grid gap-4 sm:grid-cols-2">
                          <div class="space-y-1.5">
                            <span class="text-xs font-medium text-muted-foreground">完整输入</span>
                            <p class="text-sm leading-relaxed whitespace-pre-line">{{ record.input }}</p>
                          </div>
                          <div class="space-y-1.5">
                            <span class="text-xs font-medium text-muted-foreground">完整输出</span>
                            <p class="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{{ record.output }}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </template>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- ==================== Tab 2：处理历史 ==================== -->
        <TabsContent value="history" class="mt-6">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-xl shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px]">处理历史</CardTitle>
              <CardDescription>数据集从上传到处理完成的完整时间线</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="relative ml-4">
                <!-- 竖线 -->
                <div class="absolute left-[7px] top-2 bottom-2 w-px bg-border/60" />

                <div class="space-y-8">
                  <div
                    v-for="(event, index) in timeline"
                    :key="index"
                    class="relative flex gap-4 pl-6"
                  >
                    <!-- 圆点 -->
                    <div
                      :class="cn(
                        'absolute left-0 top-1.5 size-[15px] rounded-full border-2 border-background',
                        timelineDotClass[event.type],
                      )"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-3">
                        <span class="text-sm font-medium">{{ event.label }}</span>
                        <span class="text-xs text-muted-foreground tabular-nums">{{ event.time }}</span>
                      </div>
                      <p class="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
                        {{ event.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- ==================== Tab 3：数据集配置 ==================== -->
        <TabsContent value="config" class="mt-6">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-xl shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px]">数据集配置</CardTitle>
              <CardDescription>数据集的基本信息与配置参数（只读）</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- 配置项列表 -->
              <div class="grid gap-5">
                <div class="flex items-center justify-between py-1">
                  <span class="text-[13px] text-muted-foreground">数据集名称</span>
                  <span class="text-sm font-medium">{{ dataset.name }}</span>
                </div>
                <Separator class="!bg-border/30" />
                <div class="flex items-center justify-between py-1">
                  <span class="text-[13px] text-muted-foreground">数据类型</span>
                  <span class="text-sm font-medium">{{ dataset.type }}</span>
                </div>
                <Separator class="!bg-border/30" />
                <div class="flex items-center justify-between py-1">
                  <span class="text-[13px] text-muted-foreground">数据格式</span>
                  <Badge
                    variant="secondary"
                    :class="cn('border-0 text-[10px] font-medium uppercase', formatBadgeClass[dataset.format] || '')"
                  >
                    {{ dataset.format }}
                  </Badge>
                </div>
                <Separator class="!bg-border/30" />
                <div class="flex items-center justify-between py-1">
                  <span class="text-[13px] text-muted-foreground">训练方式</span>
                  <span class="text-sm font-medium">{{ dataset.trainingMethod }}</span>
                </div>
                <Separator class="!bg-border/30" />
                <div class="flex items-start justify-between py-1">
                  <span class="text-[13px] text-muted-foreground shrink-0">描述</span>
                  <span class="text-sm text-right leading-relaxed max-w-md">{{ dataset.description }}</span>
                </div>
                <Separator class="!bg-border/30" />
                <div class="flex items-start justify-between py-1">
                  <span class="text-[13px] text-muted-foreground shrink-0">文件列表</span>
                  <div class="flex flex-col items-end gap-1.5">
                    <div
                      v-for="file in dataset.files"
                      :key="file"
                      class="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-1.5"
                    >
                      <FileText class="size-3.5 text-muted-foreground" />
                      <span class="text-xs font-mono">{{ file }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
