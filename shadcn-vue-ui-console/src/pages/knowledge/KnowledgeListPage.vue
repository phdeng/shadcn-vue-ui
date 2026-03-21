<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
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
import { Separator } from '@ui/components/ui/separator'
import { cn } from '@ui/lib/utils'
import {
  Box,
  Clock,
  Database,
  File,
  Layers,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
} from 'lucide-vue-next'
/**
 * @description 知识库管理页 — 参考百炼，丰富卡片信息展示
 * @author Timon
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import PageLoading from '@/components/common/PageLoading.vue'

const router = useRouter()
const searchQuery = ref('')
const loading = ref(true)

// 模拟初始加载
setTimeout(() => { loading.value = false }, 600)
const showDeleteDialog = ref(false)

// ==================== 类型与状态配置 ====================

const typeLabels = {
  unstructured: '非结构化',
  structured: '结构化',
  qa: 'Q&A',
}

const statusConfig = {
  ready: { label: '已就绪', dotClass: 'bg-success', badgeVariant: 'secondary' as const },
  indexing: { label: '索引中', dotClass: 'bg-warning animate-pulse', badgeVariant: 'secondary' as const },
  error: { label: '异常', dotClass: 'bg-destructive', badgeVariant: 'destructive' as const },
}

// ==================== 知识库数据 ====================

const knowledgeBases = ref([
  { id: '1', name: '产品文档', description: '产品使用手册、API 文档、FAQ 等', type: 'unstructured' as const, embeddingModel: 'text-embedding-v3', docCount: 156, segmentCount: 2840, size: '24.3 MB', status: 'ready' as const, updatedAt: '2 小时前', icon: '📄' },
  { id: '2', name: '技术规范', description: '系统架构文档、开发规范、接口协议', type: 'unstructured' as const, embeddingModel: 'bge-large-zh-v1.5', docCount: 89, segmentCount: 1560, size: '15.7 MB', status: 'ready' as const, updatedAt: '1 天前', icon: '🔧' },
  { id: '3', name: '客服话术库', description: '标准回复模板、场景话术、投诉处理流程', type: 'qa' as const, embeddingModel: 'text-embedding-v3', docCount: 342, segmentCount: 4200, size: '8.1 MB', status: 'indexing' as const, updatedAt: '10 分钟前', icon: '💬' },
  { id: '4', name: '行业报告', description: '市场分析、竞品调研、行业白皮书', type: 'unstructured' as const, embeddingModel: 'text-embedding-v2', docCount: 45, segmentCount: 890, size: '67.2 MB', status: 'ready' as const, updatedAt: '3 天前', icon: '📊' },
  { id: '5', name: '法律法规', description: '合规文件、政策法规、审计要求', type: 'structured' as const, embeddingModel: 'bge-m3', docCount: 78, segmentCount: 1230, size: '12.4 MB', status: 'error' as const, updatedAt: '5 天前', icon: '⚖️' },
  { id: '6', name: '运维知识库', description: '故障排查手册、运维 SOP、监控告警规则', type: 'unstructured' as const, embeddingModel: 'text-embedding-v3', docCount: 210, segmentCount: 3680, size: '31.5 MB', status: 'ready' as const, updatedAt: '6 小时前', icon: '🔬' },
])

// ==================== 搜索过滤 ====================

/** 根据搜索关键词过滤知识库列表 */
const filteredKnowledgeBases = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query)
    return knowledgeBases.value
  return knowledgeBases.value.filter(
    kb =>
      kb.name.toLowerCase().includes(query)
      || kb.description.toLowerCase().includes(query),
  )
})

const deleteTarget = ref<typeof knowledgeBases.value[0] | null>(null)

// ==================== 事件处理 ====================

/** 批量导入 */
function handleBulkImport() {
  toast.info('批量导入功能', { description: '请选择要导入的文件夹' })
}

/** 查看文档 */
function handleViewDocs(kb: typeof knowledgeBases.value[0]) {
  router.push(`/knowledge/${kb.id}`)
}

/** 上传文档 */
function handleUploadDocs(kb: typeof knowledgeBases.value[0]) {
  router.push(`/knowledge/${kb.id}/upload`)
}

/** 重建索引 */
function handleRebuildIndex(kb: typeof knowledgeBases.value[0]) {
  kb.status = 'indexing'
  toast.info('索引重建中', { description: kb.name })
}

/** 打开删除确认 */
function handleDeleteConfirm(kb: typeof knowledgeBases.value[0]) {
  deleteTarget.value = kb
  showDeleteDialog.value = true
}

/** 执行删除 */
function handleDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  knowledgeBases.value = knowledgeBases.value.filter(kb => kb.id !== deleteTarget.value!.id)
  showDeleteDialog.value = false
  deleteTarget.value = null
  toast.success('已删除', { description: name })
}
</script>

<template>
  <div>
    <PageLoading v-if="loading" :count="6" :cols="3" />

    <div v-else class="flex flex-col gap-8">
      <!-- 页面标题区 -->
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">
            知识库
          </h2>
          <p class="mt-1.5 text-sm text-muted-foreground">
            管理文档、数据集与向量索引，支持 RAG 检索增强生成
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" @click="handleBulkImport">
            <Upload class="mr-2 size-4" />
            批量导入
          </Button>
          <Button size="sm" @click="router.push('/knowledge/create')">
            <Plus class="mr-2 size-4" />
            创建知识库
          </Button>
        </div>
      </div>

      <!-- 搜索栏 -->
      <div class="flex items-center gap-3">
        <div class="relative w-80">
          <Search class="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input v-model="searchQuery" placeholder="搜索知识库..." class="pl-9 h-10 rounded-xl" />
        </div>
        <Separator orientation="vertical" class="!h-5" />
        <span class="text-sm text-muted-foreground">共 {{ filteredKnowledgeBases.length }} 个知识库</span>
      </div>

      <!-- 知识库卡片网格 -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card
          v-for="kb in filteredKnowledgeBases"
          :key="kb.id"
          class="group cursor-pointer border border-border/40 bg-card/80 backdrop-blur-sm shadow-xs transition-all duration-300 hover:border-primary/15 hover:shadow-sm"
          @click="router.push(`/knowledge/${kb.id}`)"
        >
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/8 to-primary/3 text-lg">
                  {{ kb.icon }}
                </div>
                <div>
                  <CardTitle class="text-base leading-none">
                    {{ kb.name }}
                  </CardTitle>
                  <p class="mt-2 text-xs text-muted-foreground line-clamp-1">
                    {{ kb.description }}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" class="size-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" @click.stop>
                    <MoreHorizontal class="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem @click.stop="handleViewDocs(kb)">
                    查看文档
                  </DropdownMenuItem>
                  <DropdownMenuItem @click.stop="handleUploadDocs(kb)">
                    上传文档
                  </DropdownMenuItem>
                  <DropdownMenuItem @click.stop="handleRebuildIndex(kb)">
                    重建索引
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem class="text-destructive" @click.stop="handleDeleteConfirm(kb)">
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent class="pb-3">
            <!-- 类型标签 + Embedding 模型 -->
            <div class="mb-3.5 flex items-center gap-2">
              <Badge variant="outline" class="text-[10px] tracking-wide px-1.5 py-0">
                {{ typeLabels[kb.type] }}
              </Badge>
              <span class="text-[10px] font-mono text-muted-foreground/70">
                {{ kb.embeddingModel }}
              </span>
            </div>
            <!-- 数据指标 -->
            <div class="flex items-center gap-4 text-xs text-muted-foreground">
              <span class="flex items-center gap-1">
                <File class="size-3 opacity-60" />
                {{ kb.docCount }} 篇
              </span>
              <span class="flex items-center gap-1">
                <Layers class="size-3 opacity-60" />
                {{ kb.segmentCount.toLocaleString() }} 段
              </span>
              <span class="flex items-center gap-1">
                <Database class="size-3 opacity-60" />
                {{ kb.size }}
              </span>
            </div>
          </CardContent>

          <CardFooter class="flex-col items-stretch gap-3 pt-0">
            <Separator class="border-border/50" />
            <div class="flex items-center justify-between">
              <Badge :variant="statusConfig[kb.status].badgeVariant" class="gap-1.5 text-[11px]">
                <span :class="cn('size-1.5 rounded-full', statusConfig[kb.status].dotClass)" />
                {{ statusConfig[kb.status].label }}
              </Badge>
              <span class="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                <Clock class="size-3 opacity-50" />
                {{ kb.updatedAt }}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <!-- 空状态提示 -->
      <div
        v-if="filteredKnowledgeBases.length === 0"
        class="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/50 py-20"
      >
        <Search class="size-16 text-muted-foreground/20" />
        <div class="text-center">
          <p class="text-sm font-medium text-muted-foreground">
            未找到匹配的知识库
          </p>
          <p class="mt-1.5 text-xs text-muted-foreground/60">
            尝试调整搜索关键词
          </p>
        </div>
      </div>

      <!-- 删除确认对话框 -->
      <ConfirmDialog
        v-model:open="showDeleteDialog"
        title="删除知识库"
        :description="`确定要删除「${deleteTarget?.name}」吗？知识库中的所有文档和索引将被永久删除。`"
        confirm-text="删除"
        @confirm="handleDelete"
      />
    </div>
  </div>
</template>
