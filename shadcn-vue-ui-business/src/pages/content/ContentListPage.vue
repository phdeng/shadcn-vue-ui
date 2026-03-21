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
import {
  ArrowDownCircle,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-vue-next'
/**
 * @description 内容管理页 — 编辑和发布运营内容（表格布局）
 * @author Timon
 */
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

// 骨架屏加载状态
const loading = ref(true)
onMounted(() => {
  setTimeout(() => { loading.value = false }, 600)
})

// ==================== 类型定义 ====================

/** 内容状态枚举 */
type ContentStatus = 'published' | 'draft' | 'offline'

/** 内容分类枚举 */
type ContentCategory = '公告' | '教程' | '活动' | '帮助'

/** 内容数据结构 */
interface Content {
  id: number
  title: string
  category: ContentCategory
  author: string
  status: ContentStatus
  views: number
  publishedAt: string
}

// ==================== 模拟数据 ====================

const contents = ref<Content[]>([
  {
    id: 1,
    title: '2026 年春季产品更新公告',
    category: '公告',
    author: '张明远',
    status: 'published',
    views: 3842,
    publishedAt: '2026-03-20 10:00',
  },
  {
    id: 2,
    title: '新手入门：5 分钟快速上手平台核心功能',
    category: '教程',
    author: '李思琪',
    status: 'published',
    views: 12750,
    publishedAt: '2026-03-18 14:30',
  },
  {
    id: 3,
    title: '限时活动：邀请好友赢取专业版会员',
    category: '活动',
    author: '王浩然',
    status: 'draft',
    views: 0,
    publishedAt: '-',
  },
  {
    id: 4,
    title: '常见问题：账户安全与密码重置指南',
    category: '帮助',
    author: '赵雪婷',
    status: 'published',
    views: 8620,
    publishedAt: '2026-03-15 09:15',
  },
  {
    id: 5,
    title: 'API 接入指南：RESTful 接口调用最佳实践',
    category: '教程',
    author: '陈嘉伟',
    status: 'offline',
    views: 5310,
    publishedAt: '2026-02-28 16:45',
  },
  {
    id: 6,
    title: '系统维护通知：3 月 25 日凌晨升级公告',
    category: '公告',
    author: '刘晓峰',
    status: 'draft',
    views: 0,
    publishedAt: '-',
  },
])

// ==================== 对话框状态 ====================
const showDeleteDialog = ref(false)
const deleteTarget = ref<Content | null>(null)

// ==================== 搜索与筛选 ====================

const searchQuery = ref('')
const activeTab = ref('all')

const filteredContents = computed(() => {
  let result = contents.value

  // 按状态筛选
  if (activeTab.value !== 'all') {
    const statusMap: Record<string, ContentStatus> = {
      published: 'published',
      draft: 'draft',
      offline: 'offline',
    }
    result = result.filter(c => c.status === statusMap[activeTab.value])
  }

  // 按关键词搜索
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      c =>
        c.title.toLowerCase().includes(q)
        || c.author.toLowerCase().includes(q)
        || c.category.toLowerCase().includes(q),
    )
  }

  return result
})

// ==================== 状态配置 ====================

const statusConfig: Record<ContentStatus, { label: string, class: string, dotClass: string }> = {
  published: {
    label: '已发布',
    class: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    dotClass: 'bg-emerald-500',
  },
  draft: {
    label: '草稿',
    class: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    dotClass: 'bg-amber-500',
  },
  offline: {
    label: '已下线',
    class: 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400',
    dotClass: 'bg-gray-400',
  },
}

// ==================== 分类颜色映射 ====================

const categoryClass: Record<ContentCategory, string> = {
  公告: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  教程: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800',
  活动: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
  帮助: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
}

// ==================== 浏览量格式化 ====================

function formatViews(views: number): string {
  return views.toLocaleString('zh-CN')
}

// ==================== 事件处理 ====================

/** 新建内容 */
function handleCreate() {
  toast.info('新建内容', { description: '内容创建功能即将上线' })
}

/** 编辑内容 */
function handleEdit(content: Content) {
  toast.info('编辑内容', { description: `正在编辑「${content.title}」` })
}

/** 预览内容 */
function handlePreview(content: Content) {
  toast.info('预览内容', { description: `正在预览「${content.title}」` })
}

/** 下线内容 */
function handleOffline(content: Content) {
  const target = contents.value.find(c => c.id === content.id)
  if (target) target.status = 'offline'
  toast.success('已下线', { description: content.title })
}

/** 打开删除确认 */
function handleDeleteConfirm(content: Content) {
  deleteTarget.value = content
  showDeleteDialog.value = true
}

/** 执行删除 */
function handleDelete() {
  if (!deleteTarget.value) return
  const title = deleteTarget.value.title
  contents.value = contents.value.filter(c => c.id !== deleteTarget.value!.id)
  showDeleteDialog.value = false
  deleteTarget.value = null
  toast.success('已删除', { description: title })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 骨架屏 -->
    <template v-if="loading">
      <div class="flex items-end justify-between">
        <div class="space-y-2">
          <Skeleton class="h-8 w-32" />
          <Skeleton class="h-4 w-40" />
        </div>
        <Skeleton class="h-9 w-24 rounded-md" />
      </div>
      <div class="flex items-center justify-between gap-4">
        <Skeleton class="h-9 w-64 rounded-md" />
        <div class="flex items-center gap-3">
          <Skeleton class="h-9 w-52 rounded-md" />
          <Skeleton class="h-4 w-20" />
        </div>
      </div>
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardContent class="p-4 space-y-4">
          <div v-for="i in 6" :key="i" class="flex items-center gap-4">
            <Skeleton class="h-4 w-56" />
            <Skeleton class="h-4 w-16" />
            <Skeleton class="h-4 w-16" />
            <Skeleton class="h-4 w-16" />
            <Skeleton class="h-4 w-16 ml-auto" />
            <Skeleton class="h-4 w-28" />
          </div>
        </CardContent>
      </Card>
    </template>

    <template v-else>
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          内容管理
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          编辑和发布运营内容
        </p>
      </div>
      <Button size="sm" @click="handleCreate">
        <Plus class="size-4" />
        新建内容
      </Button>
    </div>

    <!-- 工具栏：搜索 + Tabs 筛选 + 计数 -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-64">
        <Search class="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="搜索标题、作者、分类…"
          class="pl-8"
        />
      </div>

      <div class="flex items-center gap-3">
        <Tabs v-model="activeTab">
          <TabsList>
            <TabsTrigger value="all">
              全部
            </TabsTrigger>
            <TabsTrigger value="published">
              已发布
            </TabsTrigger>
            <TabsTrigger value="draft">
              草稿
            </TabsTrigger>
            <TabsTrigger value="offline">
              已下线
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Separator orientation="vertical" class="h-5" />
        <span class="text-sm text-muted-foreground">共 {{ filteredContents.length }} 篇内容</span>
      </div>
    </div>

    <!-- 表格区域 -->
    <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[320px]">
                标题
              </TableHead>
              <TableHead>分类</TableHead>
              <TableHead>作者</TableHead>
              <TableHead>状态</TableHead>
              <TableHead class="text-right">
                浏览量
              </TableHead>
              <TableHead>发布时间</TableHead>
              <TableHead class="w-[60px] text-right">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="content in filteredContents" :key="content.id">
              <!-- 标题 -->
              <TableCell class="font-medium">
                {{ content.title }}
              </TableCell>

              <!-- 分类 -->
              <TableCell>
                <Badge variant="outline" :class="categoryClass[content.category]">
                  {{ content.category }}
                </Badge>
              </TableCell>

              <!-- 作者 -->
              <TableCell class="text-muted-foreground">
                {{ content.author }}
              </TableCell>

              <!-- 状态 -->
              <TableCell>
                <Badge variant="outline" :class="statusConfig[content.status].class">
                  <span
                    class="mr-1 inline-block size-1.5 rounded-full"
                    :class="statusConfig[content.status].dotClass"
                  />
                  {{ statusConfig[content.status].label }}
                </Badge>
              </TableCell>

              <!-- 浏览量 -->
              <TableCell class="text-right tabular-nums text-muted-foreground">
                {{ formatViews(content.views) }}
              </TableCell>

              <!-- 发布时间 -->
              <TableCell class="text-muted-foreground">
                {{ content.publishedAt }}
              </TableCell>

              <!-- 操作下拉菜单 -->
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal class="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-36">
                    <DropdownMenuItem @click.stop="handleEdit(content)">
                      <Pencil class="size-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem @click.stop="handlePreview(content)">
                      <Eye class="size-4" />
                      预览
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click.stop="handleOffline(content)">
                      <ArrowDownCircle class="size-4" />
                      下线
                    </DropdownMenuItem>
                    <DropdownMenuItem class="text-destructive focus:text-destructive" @click.stop="handleDeleteConfirm(content)">
                      <Trash2 class="size-4" />
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

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除内容"
      :description="`确定要删除「${deleteTarget?.title}」吗？该内容将被永久删除。`"
      confirm-text="删除"
      @confirm="handleDelete"
    />
    </template>
  </div>
</template>
