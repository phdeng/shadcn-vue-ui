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
import { Skeleton } from '@ui/components/ui/skeleton'
import { cn } from '@ui/lib/utils'
import {
  FlaskConical,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Sparkles,
  FileText,
} from 'lucide-vue-next'
/**
 * @description Prompt 工程台列表页 — 管理 Prompt 模板、版本与 A/B 测试
 * @author Timon
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

// ==================== 状态 ====================

const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

const router = useRouter()
const searchQuery = ref('')
const activeTab = ref('all')

// ==================== 类型定义 ====================

/** Prompt 状态 */
type PromptStatus = 'draft' | 'published' | 'testing'

/** Prompt 项接口 */
interface PromptItem {
  id: string
  name: string
  model: string
  version: string
  status: PromptStatus
  creator: string
  updatedAt: string
}

// ==================== 状态配置 ====================

const statusConfig: Record<
  PromptStatus,
  { label: string, dotClass: string, badgeVariant: 'secondary' | 'outline' | 'destructive' }
> = {
  draft: {
    label: '草稿',
    dotClass: 'bg-muted-foreground',
    badgeVariant: 'outline',
  },
  published: {
    label: '已发布',
    dotClass: 'bg-success',
    badgeVariant: 'secondary',
  },
  testing: {
    label: '测试中',
    dotClass: 'bg-warning animate-pulse',
    badgeVariant: 'secondary',
  },
}

// ==================== 统计指标 ====================

const stats = [
  {
    label: 'Prompt 总数',
    value: '8',
    icon: Sparkles,
    iconBase: 'text-chart-1/20 dark:text-chart-1/10',
    iconHover: 'group-hover:text-chart-1/40 dark:group-hover:text-chart-1/25',
    glow: 'from-chart-1/30 via-chart-1/8 to-transparent',
  },
  {
    label: '已发布',
    value: '4',
    icon: Send,
    iconBase: 'text-success/20 dark:text-success/10',
    iconHover: 'group-hover:text-success/40 dark:group-hover:text-success/25',
    glow: 'from-success/30 via-success/8 to-transparent',
  },
  {
    label: 'A/B 测试中',
    value: '2',
    icon: FlaskConical,
    iconBase: 'text-chart-4/20 dark:text-chart-4/10',
    iconHover: 'group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25',
    glow: 'from-chart-4/30 via-chart-4/8 to-transparent',
  },
]

// ==================== 模拟数据 ====================

const prompts = ref<PromptItem[]>([
  {
    id: 'p-001',
    name: '智能客服回复',
    model: 'GPT-4o',
    version: 'v2.1',
    status: 'published',
    creator: '李明',
    updatedAt: '2026-03-21 14:30',
  },
  {
    id: 'p-002',
    name: '文档摘要生成',
    model: 'Claude 3.5',
    version: 'v1.3',
    status: 'testing',
    creator: '张华',
    updatedAt: '2026-03-20 16:45',
  },
  {
    id: 'p-003',
    name: '代码审查助手',
    model: 'GPT-4o',
    version: 'v3.0',
    status: 'published',
    creator: '王强',
    updatedAt: '2026-03-20 09:15',
  },
  {
    id: 'p-004',
    name: '多语言翻译',
    model: 'Gemini Pro',
    version: 'v1.0',
    status: 'draft',
    creator: '陈雪',
    updatedAt: '2026-03-19 18:20',
  },
  {
    id: 'p-005',
    name: 'SQL 查询生成',
    model: 'Claude 3.5',
    version: 'v2.0',
    status: 'published',
    creator: '赵磊',
    updatedAt: '2026-03-18 11:40',
  },
  {
    id: 'p-006',
    name: '情感分析',
    model: 'Qwen-72B',
    version: 'v1.2',
    status: 'testing',
    creator: '孙丽',
    updatedAt: '2026-03-17 20:05',
  },
  {
    id: 'p-007',
    name: '数据标注指令',
    model: 'GPT-4o',
    version: 'v1.1',
    status: 'published',
    creator: '周伟',
    updatedAt: '2026-03-16 15:30',
  },
  {
    id: 'p-008',
    name: '创意文案生成',
    model: 'Gemini Pro',
    version: 'v0.9',
    status: 'draft',
    creator: '吴芳',
    updatedAt: '2026-03-15 10:00',
  },
])

// ==================== 计算属性 ====================

const filteredPrompts = computed(() => {
  let result = prompts.value

  // 按状态筛选
  if (activeTab.value !== 'all') {
    result = result.filter(p => p.status === activeTab.value)
  }

  // 按关键词搜索
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(query)
        || p.model.toLowerCase().includes(query)
        || p.creator.toLowerCase().includes(query),
    )
  }

  return result
})

const promptCounts = computed(() => ({
  all: prompts.value.length,
  published: prompts.value.filter(p => p.status === 'published').length,
  testing: prompts.value.filter(p => p.status === 'testing').length,
  draft: prompts.value.filter(p => p.status === 'draft').length,
}))

// ==================== 对话框状态 ====================

const showDeleteDialog = ref(false)
const deleteTarget = ref<PromptItem | null>(null)

// ==================== 事件处理 ====================

function handleView(prompt: PromptItem) {
  router.push(`/prompts/${prompt.id}`)
}

function handleDeleteConfirm(prompt: PromptItem) {
  deleteTarget.value = prompt
  showDeleteDialog.value = true
}

function handleDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  prompts.value = prompts.value.filter(p => p.id !== deleteTarget.value!.id)
  showDeleteDialog.value = false
  deleteTarget.value = null
  toast.success('已删除', { description: name })
}
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-6">
      <div class="flex items-end justify-between">
        <div class="space-y-2">
          <Skeleton class="h-8 w-40" />
          <Skeleton class="h-4 w-72" />
        </div>
        <Skeleton class="h-9 w-32" />
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <Skeleton v-for="i in 3" :key="i" class="h-[100px] rounded-2xl" />
      </div>
      <Skeleton class="h-[400px] rounded-xl" />
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- 页面头部：标题 + 操作按钮 -->
      <div class="flex items-start justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold tracking-tight">
            Prompt 工程台
          </h1>
          <p class="text-sm text-muted-foreground leading-relaxed">
            管理 Prompt 模板、版本控制与 A/B 测试
          </p>
        </div>
        <Button class="shrink-0" @click="router.push('/prompts/create')">
          <Plus class="mr-2 size-4" />
          创建 Prompt
        </Button>
      </div>

      <!-- 统计指标 — HUD 水印风格 -->
      <div class="grid gap-4 sm:grid-cols-3">
        <div
          v-for="item in stats"
          :key="item.label"
          class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
        >
          <!-- 大图标水印 — 右侧居中 -->
          <component
            :is="item.icon"
            :class="cn(
              'absolute right-4 top-1/2 -translate-y-1/2 size-20 transition-all duration-700 ease-out',
              'group-hover:scale-125 group-hover:rotate-6',
              item.iconBase, item.iconHover,
            )"
          />
          <!-- 径向光晕衍射 -->
          <div :class="cn('absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100', item.glow)" />

          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">{{ item.label }}</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>

      <!-- 工具栏：搜索 + 筛选标签 -->
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <!-- 搜索框 -->
          <div class="relative w-72">
            <Search
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              placeholder="搜索 Prompt 名称、模型..."
              class="pl-9"
            />
          </div>

          <Separator orientation="vertical" class="!h-6" />

          <!-- 状态筛选标签 -->
          <Tabs v-model="activeTab" class="w-auto">
            <TabsList class="h-9">
              <TabsTrigger value="all" class="text-xs px-3">
                全部
                <span class="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                  {{ promptCounts.all }}
                </span>
              </TabsTrigger>
              <TabsTrigger value="published" class="text-xs px-3">
                已发布
                <span class="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                  {{ promptCounts.published }}
                </span>
              </TabsTrigger>
              <TabsTrigger value="testing" class="text-xs px-3">
                测试中
                <span class="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                  {{ promptCounts.testing }}
                </span>
              </TabsTrigger>
              <TabsTrigger value="draft" class="text-xs px-3">
                草稿
                <span class="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                  {{ promptCounts.draft }}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <!-- 表格 -->
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardContent class="p-0">
          <Table>
            <TableHeader>
              <TableRow class="border-border/50">
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Prompt 名称</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">关联模型</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">版本号</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">状态</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">创建者</TableHead>
                <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">最后编辑</TableHead>
                <TableHead class="w-[60px] text-xs font-medium uppercase tracking-wider text-muted-foreground">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="prompt in filteredPrompts"
                :key="prompt.id"
                class="cursor-pointer border-border/50 transition-colors duration-200 hover:bg-muted/30"
                @click="handleView(prompt)"
              >
                <TableCell class="py-3.5">
                  <div class="flex items-center gap-2.5">
                    <FileText class="size-4 shrink-0 text-muted-foreground/60" />
                    <span class="font-medium">{{ prompt.name }}</span>
                  </div>
                </TableCell>
                <TableCell class="py-3.5">
                  <Badge variant="outline" class="text-[10px] tracking-wide">
                    {{ prompt.model }}
                  </Badge>
                </TableCell>
                <TableCell class="py-3.5 tabular-nums text-muted-foreground font-mono text-sm">
                  {{ prompt.version }}
                </TableCell>
                <TableCell class="py-3.5">
                  <Badge
                    :variant="statusConfig[prompt.status].badgeVariant"
                    class="gap-1.5 text-[11px]"
                  >
                    <span :class="cn('size-1.5 rounded-full', statusConfig[prompt.status].dotClass)" />
                    {{ statusConfig[prompt.status].label }}
                  </Badge>
                </TableCell>
                <TableCell class="py-3.5 text-muted-foreground">
                  {{ prompt.creator }}
                </TableCell>
                <TableCell class="py-3.5 text-muted-foreground whitespace-nowrap">
                  {{ prompt.updatedAt }}
                </TableCell>
                <TableCell class="py-3.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="size-7" @click.stop>
                        <MoreHorizontal class="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem @click.stop="handleView(prompt)">
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem @click.stop="toast.info('复制成功', { description: prompt.name })">
                        复制 Prompt
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive" @click.stop="handleDeleteConfirm(prompt)">
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
            v-if="filteredPrompts.length === 0"
            class="flex flex-col items-center justify-center gap-4 py-16"
          >
            <Sparkles class="size-16 text-muted-foreground/20" />
            <p class="text-sm text-muted-foreground">暂无 Prompt</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除 Prompt"
      :description="`确定要删除「${deleteTarget?.name}」吗？此操作不可撤销。`"
      confirm-text="删除"
      variant="destructive"
      @confirm="handleDelete"
    />
  </div>
</template>
