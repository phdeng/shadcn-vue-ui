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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Input } from '@ui/components/ui/input'
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
  Box,
  Clock,
  Database,
  FileText,
  Layers,
  MoreHorizontal,
  RefreshCw,
  Search,
  Send,
  Settings,
  Upload,
} from 'lucide-vue-next'
/**
 * @description 知识库详情页 — 参考百炼，Tab 布局：文档管理 / 召回测试 / 配置信息
 * @author Timon
 */
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import KnowledgeUploadDialog from '@/components/knowledge/KnowledgeUploadDialog.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// ==================== 知识库数据 ====================

const knowledgeBase = {
  id: route.params.id as string,
  name: '产品文档',
  description: '产品使用手册、API 文档、FAQ、集成指南等核心产品资料，用于 RAG 检索增强生成。',
  icon: '📄',
  status: 'ready' as const,
  type: 'unstructured' as const,
  docCount: 156,
  segmentCount: 2840,
  totalSize: '24.3 MB',
  embeddingModel: 'text-embedding-v3',
  embeddingProvider: '通义千问',
  vectorDimension: 1024,
  chunkStrategy: 'auto' as const,
  chunkSize: 500,
  chunkOverlap: 50,
  lastIndexedAt: '2026-03-21 10:35',
  createdAt: '2026-02-15 14:00',
}

const kbStatusConfig = {
  ready: { label: '已就绪', dotClass: 'bg-emerald-500', badgeVariant: 'secondary' as const },
  indexing: { label: '索引中', dotClass: 'bg-amber-500 animate-pulse', badgeVariant: 'secondary' as const },
  error: { label: '异常', dotClass: 'bg-destructive', badgeVariant: 'destructive' as const },
}

const typeLabels = {
  unstructured: '非结构化文档',
  structured: '结构化数据',
  qa: 'Q&A 问答对',
}

// ==================== 统计指标 ====================

const stats = [
  { label: '文档数', value: `${knowledgeBase.docCount} 篇`, icon: FileText, color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20', iconColor: 'text-blue-600 dark:text-blue-400' },
  { label: '分段数', value: `${knowledgeBase.segmentCount.toLocaleString()}`, icon: Layers, color: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20', iconColor: 'text-violet-600 dark:text-violet-400' },
  { label: '总大小', value: knowledgeBase.totalSize, icon: Database, color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: '最后索引', value: knowledgeBase.lastIndexedAt.split(' ')[0], icon: Clock, color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20', iconColor: 'text-amber-600 dark:text-amber-400' },
]

// ==================== 文档管理 ====================

const docSearch = ref('')
const showUploadDialog = ref(false)
const showDeleteDialog = ref(false)
const deleteTarget = ref<typeof documents.value[0] | null>(null)

const docStatusConfig = {
  indexed: { label: '已索引', dotClass: 'bg-emerald-500', badgeVariant: 'secondary' as const },
  indexing: { label: '索引中', dotClass: 'bg-amber-500 animate-pulse', badgeVariant: 'secondary' as const },
  pending: { label: '待处理', dotClass: 'bg-muted-foreground', badgeVariant: 'outline' as const },
  error: { label: '解析失败', dotClass: 'bg-destructive', badgeVariant: 'destructive' as const },
}

const documents = ref([
  { id: '1', name: 'API 接口文档 v3.2.pdf', size: '4.8 MB', segments: 342, tokens: 68400, status: 'indexed' as const, source: 'upload' as const, uploadedAt: '2026-03-20 14:30' },
  { id: '2', name: '产品使用手册.docx', size: '2.1 MB', segments: 186, tokens: 37200, status: 'indexed' as const, source: 'upload' as const, uploadedAt: '2026-03-19 09:15' },
  { id: '3', name: 'FAQ 常见问题集.md', size: '856 KB', segments: 124, tokens: 24800, status: 'indexed' as const, source: 'upload' as const, uploadedAt: '2026-03-18 16:42' },
  { id: '4', name: '集成指南 - 企业版.pdf', size: '6.3 MB', segments: 478, tokens: 95600, status: 'indexing' as const, source: 'upload' as const, uploadedAt: '2026-03-21 08:20' },
  { id: '5', name: '数据安全白皮书.pdf', size: '3.2 MB', segments: 215, tokens: 43000, status: 'indexed' as const, source: 'upload' as const, uploadedAt: '2026-03-17 11:05' },
  { id: '6', name: '变更日志 2026Q1.md', size: '128 KB', segments: 56, tokens: 11200, status: 'pending' as const, source: 'upload' as const, uploadedAt: '2026-03-21 09:50' },
  { id: '7', name: 'SDK 快速入门.md', size: '420 KB', segments: 89, tokens: 17800, status: 'indexed' as const, source: 'upload' as const, uploadedAt: '2026-03-15 13:28' },
  { id: '8', name: 'https://docs.example.com/guide', size: '1.2 MB', segments: 143, tokens: 28600, status: 'indexed' as const, source: 'url' as const, uploadedAt: '2026-03-16 10:00' },
])

const filteredDocuments = computed(() => {
  const q = docSearch.value.trim().toLowerCase()
  if (!q) return documents.value
  return documents.value.filter(d => d.name.toLowerCase().includes(q))
})

// ==================== 召回测试 ====================

interface RecallResult {
  docName: string
  segment: string
  score: number
  segmentId: string
}

const recallQuery = ref('')
const recallLoading = ref(false)
const recallResults = ref<RecallResult[]>([])
const recallTopK = ref(5)

/** 执行召回测试 */
function handleRecallTest() {
  const q = recallQuery.value.trim()
  if (!q) return
  recallLoading.value = true
  // 模拟 API 调用
  setTimeout(() => {
    recallResults.value = [
      { docName: 'API 接口文档 v3.2.pdf', segment: '用户认证接口采用 OAuth 2.0 协议，支持 Authorization Code、Client Credentials 和 Device Code 三种授权模式。每个应用需要先在开发者控制台注册获取 Client ID 和 Client Secret...', score: 0.956, segmentId: 'seg-1-042' },
      { docName: '产品使用手册.docx', segment: '登录认证流程：1. 用户访问登录页面 2. 输入账号密码或选择第三方登录 3. 系统校验凭证有效性 4. 生成 JWT Token 并返回给客户端 5. 客户端在后续请求中携带 Token...', score: 0.912, segmentId: 'seg-2-018' },
      { docName: 'FAQ 常见问题集.md', segment: 'Q: 如何重置 API 密钥？\nA: 进入「设置 → API 管理」页面，找到对应的 API 密钥，点击「重新生成」按钮。注意：重新生成后旧密钥将立即失效，请及时更新您的应用配置。', score: 0.887, segmentId: 'seg-3-067' },
      { docName: '数据安全白皮书.pdf', segment: 'API 密钥采用 AES-256 加密存储，传输过程中使用 TLS 1.3 协议保护。密钥轮转策略建议每 90 天更换一次，系统支持同时激活两个密钥以实现无缝轮换...', score: 0.845, segmentId: 'seg-5-103' },
      { docName: 'SDK 快速入门.md', segment: '初始化 SDK 时需要传入 API Key 和 Endpoint 地址。建议将 API Key 存放在环境变量中，避免硬编码在代码中导致安全风险。示例代码：const client = new Client({ apiKey: process.env.API_KEY })...', score: 0.821, segmentId: 'seg-7-012' },
    ]
    recallLoading.value = false
  }, 800)
}

// ==================== 事件处理 ====================

function handleUploadSubmit(data: { files: File[], urls: string[] }) {
  const total = data.files.length + data.urls.length
  toast.success(`已提交 ${total} 项导入任务`, { description: '文档将在后台进行解析和索引' })
}

function handleViewDoc(doc: typeof documents.value[0]) {
  router.push(`/knowledge/${knowledgeBase.id}/documents/${doc.id}`)
}

function handleReindex(doc: typeof documents.value[0]) {
  doc.status = 'indexing'
  toast.info('重新索引中', { description: doc.name })
}

function handleDeleteConfirm(doc: typeof documents.value[0]) {
  deleteTarget.value = doc
  showDeleteDialog.value = true
}

function handleDeleteDoc() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  documents.value = documents.value.filter(d => d.id !== deleteTarget.value!.id)
  showDeleteDialog.value = false
  deleteTarget.value = null
  toast.success('已删除', { description: name })
}

function handleRebuildAll() {
  toast.info('全量重建索引', { description: '预计需要 3-5 分钟' })
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex flex-col gap-6">
      <div class="flex items-center gap-3">
        <Skeleton class="size-9 rounded-lg" />
        <Skeleton class="size-10 rounded-xl" />
        <div class="space-y-2">
          <Skeleton class="h-7 w-32" />
          <Skeleton class="h-4 w-80" />
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Skeleton v-for="i in 4" :key="i" class="h-[100px] rounded-xl" />
    </div>
    <Skeleton class="h-[400px] rounded-xl" />
  </div>

  <div v-else class="flex flex-col gap-6">
    <!-- 顶部区域：返回 + 知识库名称 + 状态 + 操作按钮 -->
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
        <div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-lg mt-0.5">
          {{ knowledgeBase.icon }}
        </div>
        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">
              {{ knowledgeBase.name }}
            </h2>
            <Badge
              :variant="kbStatusConfig[knowledgeBase.status].badgeVariant"
              class="gap-1.5 text-[11px]"
            >
              <span :class="cn('size-1.5 rounded-full', kbStatusConfig[knowledgeBase.status].dotClass)" />
              {{ kbStatusConfig[knowledgeBase.status].label }}
            </Badge>
            <Badge variant="outline" class="text-[11px]">
              {{ typeLabels[knowledgeBase.type] }}
            </Badge>
          </div>
          <p class="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            {{ knowledgeBase.description }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" @click="handleRebuildAll">
          <RefreshCw class="mr-2 size-4" />
          重建索引
        </Button>
        <Button size="sm" @click="showUploadDialog = true">
          <Upload class="mr-2 size-4" />
          上传文档
        </Button>
      </div>
    </div>

    <!-- 统计指标 — 渐变背景风格 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        v-for="item in stats"
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

    <!-- Tab 区域：文档管理 / 召回测试 / 配置信息 -->
    <Tabs default-value="documents">
      <TabsList>
        <TabsTrigger value="documents" class="gap-1.5">
          <FileText class="size-3.5" />
          文档管理
        </TabsTrigger>
        <TabsTrigger value="recall" class="gap-1.5">
          <Search class="size-3.5" />
          召回测试
        </TabsTrigger>
        <TabsTrigger value="config" class="gap-1.5">
          <Settings class="size-3.5" />
          配置信息
        </TabsTrigger>
      </TabsList>

      <!-- ==================== Tab 1: 文档管理 ==================== -->
      <TabsContent value="documents">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="text-base">文档列表</CardTitle>
                <CardDescription>管理知识库中的文档，支持查看分段详情</CardDescription>
              </div>
              <div class="relative w-64">
                <Search class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input v-model="docSearch" placeholder="搜索文档..." class="pl-8 h-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>文档名称</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>大小</TableHead>
                  <TableHead>分段数</TableHead>
                  <TableHead>Token 数</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>上传时间</TableHead>
                  <TableHead class="w-[60px]">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="doc in filteredDocuments"
                  :key="doc.id"
                  class="cursor-pointer"
                  @click="handleViewDoc(doc)"
                >
                  <TableCell>
                    <div class="flex items-center gap-2">
                      <FileText class="size-4 shrink-0 text-muted-foreground" />
                      <span class="font-medium max-w-[240px] truncate">{{ doc.name }}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" class="text-[10px]">
                      {{ doc.source === 'url' ? 'URL' : '上传' }}
                    </Badge>
                  </TableCell>
                  <TableCell class="tabular-nums text-muted-foreground">
                    {{ doc.size }}
                  </TableCell>
                  <TableCell class="tabular-nums text-muted-foreground">
                    {{ doc.segments }}
                  </TableCell>
                  <TableCell class="tabular-nums text-muted-foreground">
                    {{ doc.tokens.toLocaleString() }}
                  </TableCell>
                  <TableCell>
                    <Badge
                      :variant="docStatusConfig[doc.status].badgeVariant"
                      class="gap-1.5 text-[11px]"
                    >
                      <span :class="cn('size-1.5 rounded-full', docStatusConfig[doc.status].dotClass)" />
                      {{ docStatusConfig[doc.status].label }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-muted-foreground whitespace-nowrap">
                    {{ doc.uploadedAt }}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="icon" class="size-7" @click.stop>
                          <MoreHorizontal class="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem @click.stop="handleViewDoc(doc)">
                          查看分段
                        </DropdownMenuItem>
                        <DropdownMenuItem @click.stop="handleReindex(doc)">
                          重新索引
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem class="text-destructive" @click.stop="handleDeleteConfirm(doc)">
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <!-- 空状态 -->
            <div
              v-if="filteredDocuments.length === 0"
              class="flex flex-col items-center justify-center gap-3 py-12"
            >
              <FileText class="size-10 text-muted-foreground/40" />
              <p class="text-sm text-muted-foreground">暂无文档</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ==================== Tab 2: 召回测试 ==================== -->
      <TabsContent value="recall">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <CardTitle class="text-base">召回测试</CardTitle>
            <CardDescription>输入查询语句，测试知识库的向量检索效果和召回质量</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 查询输入 -->
            <div class="flex gap-3">
              <div class="flex-1 space-y-2">
                <textarea
                  v-model="recallQuery"
                  rows="3"
                  placeholder="输入查询内容，例如：如何获取 API 密钥？"
                  class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
                  @keydown.meta.enter="handleRecallTest"
                />
                <div class="flex items-center justify-between">
                  <p class="text-xs text-muted-foreground">⌘ + Enter 发送</p>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-muted-foreground">Top-K：</span>
                    <Input
                      v-model.number="recallTopK"
                      type="number"
                      :min="1"
                      :max="20"
                      class="h-7 w-16 text-xs"
                    />
                  </div>
                </div>
              </div>
              <Button
                class="shrink-0 self-start"
                :disabled="!recallQuery.trim() || recallLoading"
                @click="handleRecallTest"
              >
                <Send class="mr-2 size-4" />
                测试
              </Button>
            </div>

            <!-- 召回结果 -->
            <div v-if="recallLoading" class="space-y-3">
              <Skeleton v-for="i in 3" :key="i" class="h-[120px] rounded-lg" />
            </div>

            <div v-else-if="recallResults.length > 0" class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">
                  召回结果（{{ recallResults.length }} 条）
                </span>
              </div>

              <div
                v-for="(result, index) in recallResults"
                :key="result.segmentId"
                class="rounded-lg border bg-card p-4 transition-all hover:shadow-sm"
              >
                <div class="mb-2 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="flex size-5 items-center justify-center rounded bg-primary/10 text-xs font-semibold text-primary">
                      {{ index + 1 }}
                    </span>
                    <span class="text-sm font-medium">{{ result.docName }}</span>
                    <Badge variant="outline" class="text-[10px]">
                      {{ result.segmentId }}
                    </Badge>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs text-muted-foreground">相似度</span>
                    <Badge
                      :variant="result.score >= 0.9 ? 'default' : 'secondary'"
                      class="font-mono text-[11px]"
                    >
                      {{ (result.score * 100).toFixed(1) }}%
                    </Badge>
                  </div>
                </div>
                <p class="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {{ result.segment }}
                </p>
              </div>
            </div>

            <!-- 空状态 -->
            <div
              v-else
              class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16"
            >
              <Search class="size-10 text-muted-foreground/40" />
              <div class="text-center">
                <p class="text-sm font-medium text-muted-foreground">输入查询内容开始测试</p>
                <p class="mt-1 text-xs text-muted-foreground/60">
                  测试知识库的向量检索效果，验证 Embedding 模型与分段策略
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ==================== Tab 3: 配置信息 ==================== -->
      <TabsContent value="config">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <CardTitle class="text-base">知识库配置</CardTitle>
            <CardDescription>Embedding 模型、分段策略与索引参数</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 基本信息 -->
            <div class="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                <p class="text-xs font-medium text-muted-foreground">知识库类型</p>
                <p class="text-sm font-medium text-foreground">{{ typeLabels[knowledgeBase.type] }}</p>
              </div>
              <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                <p class="text-xs font-medium text-muted-foreground">创建时间</p>
                <p class="text-sm font-medium text-foreground">{{ knowledgeBase.createdAt }}</p>
              </div>
            </div>

            <!-- Embedding 模型 -->
            <div class="space-y-3">
              <h4 class="text-sm font-medium flex items-center gap-2">
                <Box class="size-4 text-muted-foreground" />
                Embedding 模型
              </h4>
              <div class="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                  <p class="text-xs font-medium text-muted-foreground">模型名称</p>
                  <p class="break-all font-mono text-sm font-medium text-foreground">{{ knowledgeBase.embeddingModel }}</p>
                </div>
                <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                  <p class="text-xs font-medium text-muted-foreground">提供方</p>
                  <p class="text-sm font-medium text-foreground">{{ knowledgeBase.embeddingProvider }}</p>
                </div>
                <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                  <p class="text-xs font-medium text-muted-foreground">向量维度</p>
                  <p class="font-mono text-sm font-medium text-foreground">{{ knowledgeBase.vectorDimension }}</p>
                </div>
                <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                  <p class="text-xs font-medium text-muted-foreground">最后索引时间</p>
                  <p class="text-sm font-medium text-foreground">{{ knowledgeBase.lastIndexedAt }}</p>
                </div>
              </div>
            </div>

            <!-- 分段策略 -->
            <div class="space-y-3">
              <h4 class="text-sm font-medium flex items-center gap-2">
                <Layers class="size-4 text-muted-foreground" />
                分段策略
              </h4>
              <div class="grid gap-x-8 gap-y-5 sm:grid-cols-3">
                <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                  <p class="text-xs font-medium text-muted-foreground">策略模式</p>
                  <p class="text-sm font-medium text-foreground">
                    {{ knowledgeBase.chunkStrategy === 'auto' ? '智能分段' : '自定义' }}
                  </p>
                </div>
                <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                  <p class="text-xs font-medium text-muted-foreground">分段长度</p>
                  <p class="font-mono text-sm font-medium text-foreground">
                    {{ knowledgeBase.chunkStrategy === 'auto' ? '自适应' : `${knowledgeBase.chunkSize} Token` }}
                  </p>
                </div>
                <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                  <p class="text-xs font-medium text-muted-foreground">重叠长度</p>
                  <p class="font-mono text-sm font-medium text-foreground">
                    {{ knowledgeBase.chunkStrategy === 'auto' ? '自适应' : `${knowledgeBase.chunkOverlap} Token` }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 索引统计 -->
            <div class="space-y-3">
              <h4 class="text-sm font-medium flex items-center gap-2">
                <Database class="size-4 text-muted-foreground" />
                索引统计
              </h4>
              <div class="grid gap-x-8 gap-y-5 sm:grid-cols-3">
                <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                  <p class="text-xs font-medium text-muted-foreground">总文档数</p>
                  <p class="font-mono text-sm font-medium text-foreground">{{ knowledgeBase.docCount }}</p>
                </div>
                <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                  <p class="text-xs font-medium text-muted-foreground">总分段数</p>
                  <p class="font-mono text-sm font-medium text-foreground">{{ knowledgeBase.segmentCount.toLocaleString() }}</p>
                </div>
                <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
                  <p class="text-xs font-medium text-muted-foreground">存储占用</p>
                  <p class="text-sm font-medium text-foreground">{{ knowledgeBase.totalSize }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <!-- 上传文档对话框 -->
    <KnowledgeUploadDialog
      v-model:open="showUploadDialog"
      @submit="handleUploadSubmit"
    />

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除文档"
      :description="`确定要删除「${deleteTarget?.name}」吗？文档及其索引数据将被永久删除。`"
      confirm-text="删除"
      @confirm="handleDeleteDoc"
    />
  </div>
  </div>
</template>
