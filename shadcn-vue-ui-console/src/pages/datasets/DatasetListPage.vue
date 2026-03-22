<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import { Card, CardContent } from '@ui/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Input } from '@ui/components/ui/input'
import { Separator } from '@ui/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { cn } from '@ui/lib/utils'
import {
  Database,
  Download,
  Eye,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-vue-next'
/**
 * @description 数据集管理列表页 — 表格布局，支持搜索与状态筛选
 * @author Timon
 */
import { Skeleton } from '@ui/components/ui/skeleton'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import SimplePagination from '@/components/common/SimplePagination.vue'

// ==================== 类型定义 ====================

/** 数据集状态 */
type DatasetStatus = 'processed' | 'processing' | 'pending'

/** 数据集项接口 */
interface DatasetItem {
  id: string
  name: string
  records: number
  size: string
  format: string
  status: DatasetStatus
  updatedAt: string
}

// ==================== 状态 ====================

const loading = ref(true)
setTimeout(() => { loading.value = false }, 600)

/** 搜索关键词 */
const searchQuery = ref('')

/** 当前筛选标签 */
const activeTab = ref('all')

// ==================== 模拟数据 ====================

const datasets = ref<DatasetItem[]>([
  {
    id: 'ds-001',
    name: '客服对话数据',
    records: 12340,
    size: '256 MB',
    format: 'jsonl',
    status: 'processed',
    updatedAt: '2026-03-20 14:30',
  },
  {
    id: 'ds-002',
    name: '产品文档',
    records: 890,
    size: '45 MB',
    format: 'txt',
    status: 'processing',
    updatedAt: '2026-03-20 11:15',
  },
  {
    id: 'ds-003',
    name: '代码审查数据',
    records: 5670,
    size: '128 MB',
    format: 'json',
    status: 'processed',
    updatedAt: '2026-03-19 09:42',
  },
  {
    id: 'ds-004',
    name: 'FAQ 问答对',
    records: 2340,
    size: '18 MB',
    format: 'csv',
    status: 'pending',
    updatedAt: '2026-03-18 16:20',
  },
  {
    id: 'ds-005',
    name: '多轮对话',
    records: 8900,
    size: '320 MB',
    format: 'jsonl',
    status: 'processed',
    updatedAt: '2026-03-17 22:05',
  },
  {
    id: 'ds-006',
    name: '用户反馈语料',
    records: 4560,
    size: '78 MB',
    format: 'csv',
    status: 'processed',
    updatedAt: '2026-03-16 14:20',
  },
  {
    id: 'ds-007',
    name: '知识图谱三元组',
    records: 15200,
    size: '410 MB',
    format: 'json',
    status: 'processed',
    updatedAt: '2026-03-15 08:45',
  },
  {
    id: 'ds-008',
    name: '意图分类标注',
    records: 6780,
    size: '92 MB',
    format: 'jsonl',
    status: 'pending',
    updatedAt: '2026-03-14 17:30',
  },
  {
    id: 'ds-009',
    name: '翻译平行语料',
    records: 22100,
    size: '540 MB',
    format: 'txt',
    status: 'processing',
    updatedAt: '2026-03-14 10:15',
  },
  {
    id: 'ds-010',
    name: '文本摘要数据',
    records: 3400,
    size: '65 MB',
    format: 'jsonl',
    status: 'processed',
    updatedAt: '2026-03-13 21:00',
  },
  {
    id: 'ds-011',
    name: '情感分析标注',
    records: 9800,
    size: '145 MB',
    format: 'csv',
    status: 'processed',
    updatedAt: '2026-03-12 13:25',
  },
  {
    id: 'ds-012',
    name: 'NER 实体标注',
    records: 7200,
    size: '210 MB',
    format: 'json',
    status: 'processed',
    updatedAt: '2026-03-11 09:50',
  },
])

// ==================== 状态配置 ====================

const statusConfig: Record<
  DatasetStatus,
  { label: string, dotClass: string, badgeClass: string }
> = {
  processed: {
    label: '已处理',
    dotClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  },
  processing: {
    label: '处理中',
    dotClass: 'bg-amber-500 animate-pulse',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  },
  pending: {
    label: '待处理',
    dotClass: 'bg-gray-400',
    badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400',
  },
}

/** 格式标签颜色映射 */
const formatBadgeClass: Record<string, string> = {
  jsonl: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  json: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
  csv: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400',
  txt: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
}

// ==================== 计算属性 ====================

/**
 * 根据搜索关键词和状态筛选数据集列表
 */
const filteredDatasets = computed(() => {
  let result = datasets.value

  // 按状态筛选
  if (activeTab.value !== 'all') {
    result = result.filter(d => d.status === activeTab.value)
  }

  // 按关键词搜索
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(
      d =>
        d.name.toLowerCase().includes(query)
        || d.format.toLowerCase().includes(query),
    )
  }

  return result
})

/** 各状态的数据集数量 */
const datasetCounts = computed(() => ({
  all: datasets.value.length,
  processed: datasets.value.filter(d => d.status === 'processed').length,
  processing: datasets.value.filter(d => d.status === 'processing').length,
  pending: datasets.value.filter(d => d.status === 'pending').length,
}))

// ==================== 分页 ====================

const currentPage = ref(1)
const pageSize = 10

/** 当前页数据 */
const pagedDatasets = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredDatasets.value.slice(start, start + pageSize)
})

/**
 * 格式化记录数（千分位）
 */
function formatNumber(num: number): string {
  return num.toLocaleString()
}

// ==================== 对话框状态 ====================

const router = useRouter()

const showDeleteDialog = ref(false)
const deleteTarget = ref<DatasetItem | null>(null)

// ==================== 事件处理 ====================

/** 查看详情 */
function handleView(dataset: DatasetItem) {
  router.push(`/datasets/${dataset.id}`)
}

/** 下载数据集 */
function handleDownload(dataset: DatasetItem) {
  toast.success('开始下载', { description: `${dataset.name} (${dataset.size})` })
}

/** 重新处理 */
function handleReprocess(dataset: DatasetItem) {
  dataset.status = 'processing'
  toast.info('已提交重新处理', { description: dataset.name })
}

/** 打开删除确认 */
function handleDeleteConfirm(dataset: DatasetItem) {
  deleteTarget.value = dataset
  showDeleteDialog.value = true
}

/** 执行删除 */
function handleDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  datasets.value = datasets.value.filter(d => d.id !== deleteTarget.value!.id)
  showDeleteDialog.value = false
  deleteTarget.value = null
  toast.success('已删除', { description: name })
}
</script>

<template>
  <div>
    <!-- 表格骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-6">
    <div class="flex items-end justify-between">
      <div class="space-y-2">
        <Skeleton class="h-8 w-32" />
        <Skeleton class="h-4 w-64" />
      </div>
      <Skeleton class="h-9 w-28" />
    </div>
    <div class="flex items-center gap-3">
      <Skeleton class="h-9 w-72" />
      <Skeleton class="h-9 w-64" />
    </div>
    <Skeleton class="h-[400px] rounded-xl" />
  </div>

  <div v-else class="flex flex-col gap-6">
    <!-- 页面头部：标题 + 操作按钮 -->
    <div class="flex items-start justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">
          数据集
        </h1>
        <p class="text-sm text-muted-foreground leading-relaxed">
          管理训练数据集、数据标注与预处理
        </p>
      </div>
      <Button class="shrink-0" @click="router.push('/datasets/create')">
        <Plus class="mr-2 size-4" />
        上传数据集
      </Button>
    </div>

    <!-- 工具栏：搜索 + 筛选标签 + 计数 -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <!-- 搜索框 -->
        <div class="relative w-72">
          <Search
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="searchQuery"
            placeholder="搜索数据集名称或格式..."
            class="pl-9"
          />
        </div>

        <Separator orientation="vertical" class="!h-6" />

        <!-- 状态筛选标签 -->
        <Tabs v-model="activeTab" class="w-auto">
          <TabsList class="h-9">
            <TabsTrigger value="all" class="text-xs px-3">
              全部
              <span
                class="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
              >
                {{ datasetCounts.all }}
              </span>
            </TabsTrigger>
            <TabsTrigger value="processed" class="text-xs px-3">
              已处理
              <span
                class="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
              >
                {{ datasetCounts.processed }}
              </span>
            </TabsTrigger>
            <TabsTrigger value="processing" class="text-xs px-3">
              处理中
              <span
                class="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
              >
                {{ datasetCounts.processing }}
              </span>
            </TabsTrigger>
            <TabsTrigger value="pending" class="text-xs px-3">
              待处理
              <span
                class="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
              >
                {{ datasetCounts.pending }}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <!-- 当前筛选结果计数 -->
      <span class="text-sm text-muted-foreground tabular-nums">
        共 {{ filteredDatasets.length }} 个数据集
      </span>
    </div>

    <!-- 数据集表格 -->
    <Card class="border-0 shadow-sm">
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead class="w-[240px]">
                名称
              </TableHead>
              <TableHead class="w-[100px]">
                记录数
              </TableHead>
              <TableHead class="w-[100px]">
                大小
              </TableHead>
              <TableHead class="w-[90px]">
                格式
              </TableHead>
              <TableHead class="w-[110px]">
                状态
              </TableHead>
              <TableHead class="w-[160px]">
                更新时间
              </TableHead>
              <TableHead class="w-[60px] text-right">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="dataset in pagedDatasets"
              :key="dataset.id"
              class="group cursor-pointer"
              @click="handleView(dataset)"
            >
              <!-- 名称 -->
              <TableCell class="font-medium">
                <div class="flex items-center gap-2.5">
                  <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Database class="size-4" />
                  </div>
                  <span>{{ dataset.name }}</span>
                </div>
              </TableCell>

              <!-- 记录数 -->
              <TableCell class="tabular-nums text-muted-foreground">
                {{ formatNumber(dataset.records) }} 条
              </TableCell>

              <!-- 大小 -->
              <TableCell class="tabular-nums text-muted-foreground">
                {{ dataset.size }}
              </TableCell>

              <!-- 格式 -->
              <TableCell>
                <Badge
                  variant="secondary"
                  :class="cn(
                    'border-0 text-[11px] font-medium uppercase',
                    formatBadgeClass[dataset.format] || '',
                  )"
                >
                  {{ dataset.format }}
                </Badge>
              </TableCell>

              <!-- 状态 -->
              <TableCell>
                <Badge
                  variant="secondary"
                  :class="cn(
                    'gap-1.5 border-0 text-[11px] font-medium',
                    statusConfig[dataset.status].badgeClass,
                  )"
                >
                  <span
                    :class="cn(
                      'size-1.5 rounded-full',
                      statusConfig[dataset.status].dotClass,
                    )"
                  />
                  {{ statusConfig[dataset.status].label }}
                </Badge>
              </TableCell>

              <!-- 更新时间 -->
              <TableCell class="text-muted-foreground">
                {{ dataset.updatedAt }}
              </TableCell>

              <!-- 操作 -->
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      class="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreHorizontal class="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-40">
                    <DropdownMenuItem @click="handleView(dataset)">
                      <Eye class="mr-2 size-4" />
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="handleDownload(dataset)">
                      <Download class="mr-2 size-4" />
                      下载数据集
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="handleReprocess(dataset)">
                      <RefreshCw class="mr-2 size-4" />
                      重新处理
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="text-destructive" @click="handleDeleteConfirm(dataset)">
                      <Trash2 class="mr-2 size-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- 分页 -->
    <div class="flex justify-end">
      <SimplePagination
        :total="filteredDatasets.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>

    <!-- 空状态提示 -->
    <div
      v-if="filteredDatasets.length === 0"
      class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16"
    >
      <Search class="size-10 text-muted-foreground/40" />
      <div class="text-center">
        <p class="text-sm font-medium text-muted-foreground">
          未找到匹配的数据集
        </p>
        <p class="mt-1 text-xs text-muted-foreground/60">
          尝试调整搜索关键词或筛选条件
        </p>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除数据集"
      :description="`确定要删除「${deleteTarget?.name}」吗？此操作不可撤销，数据集中的所有记录将被永久删除。`"
      confirm-text="删除"
      @confirm="handleDelete"
    />
  </div>
  </div>
</template>
