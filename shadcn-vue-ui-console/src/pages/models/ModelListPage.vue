<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
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
import { Tabs, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/components/ui/tooltip'
import { cn } from '@ui/lib/utils'
import {
  Clock,
  Copy,
  Eye,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  Settings,
  Trash2,
  Zap,
} from 'lucide-vue-next'
/**
 * @description 模型管理列表页 — Dify/云平台风格
 * @author Timon
 *
 * 设计理念：
 * - 云平台产品质感（参考 Dify、阿里云、Google Cloud）
 * - 卡片采用渐变背景 + 无边框 + 柔和投影
 * - 悬浮时投影加深，营造层次感
 * - 状态指示器使用彩色圆点 + 文字
 * - 整体风格简洁、克制、通透
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import PageError from '@/components/common/PageError.vue'
import PageLoading from '@/components/common/PageLoading.vue'
import ModelRegisterDialog from '@/components/models/ModelRegisterDialog.vue'
import { useModels } from '@/composables/useModels'

// 路由实例
const router = useRouter()

// 通过 composable 获取数据（支持 Mock/API 切换）
const { models: rawModels, loading, error: loadError, fetchModels } = useModels()
onMounted(fetchModels)

// 注册对话框开关
const showRegisterDialog = ref(false)

// 搜索关键词
const searchQuery = ref('')

// 当前筛选标签
const activeTab = ref('all')

/** 模型状态类型 */
type ModelStatus = 'running' | 'stopped' | 'error'

/** 提供商品牌色映射 */
const brandColorMap: Record<string, string> = {
  OpenAI: 'from-emerald-500/10 to-teal-500/5',
  Anthropic: 'from-orange-500/10 to-amber-500/5',
  阿里云: 'from-violet-500/10 to-purple-500/5',
  DeepSeek: 'from-blue-500/10 to-cyan-500/5',
  Google: 'from-red-500/10 to-rose-500/5',
  '智谱 AI': 'from-indigo-500/10 to-blue-500/5',
}

/** 列表视图模型接口 */
interface ModelViewItem {
  id: string
  name: string
  provider: string
  type: string
  status: ModelStatus
  calls: string
  latency: string
  description: string
  brandColor: string
}

// 从 useModels 数据转换为本地可变视图数据
const models = ref<ModelViewItem[]>([])

// 加载完成后转换数据
watch(rawModels, (raw) => {
  models.value = raw.map<ModelViewItem>(m => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    type: m.type === 'chat' ? '大语言模型' : m.type,
    status: m.status,
    calls: m.calls.toLocaleString(),
    latency: m.latency,
    description: m.description,
    brandColor: brandColorMap[m.provider] || 'from-gray-500/10 to-gray-500/5',
  }))
})

/** 状态配置映射 */
const statusConfig: Record<
  ModelStatus,
  { label: string, dotClass: string, badgeClass: string }
> = {
  running: {
    label: '运行中',
    dotClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  },
  stopped: {
    label: '已停止',
    dotClass: 'bg-gray-400',
    badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400',
  },
  error: {
    label: '异常',
    dotClass: 'bg-red-500',
    badgeClass: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  },
}

/**
 * 根据搜索关键词和状态筛选模型列表
 */
const filteredModels = computed(() => {
  let result = models.value

  // 按状态标签筛选
  if (activeTab.value === 'running') {
    result = result.filter(m => m.status === 'running')
  }
  else if (activeTab.value === 'stopped') {
    result = result.filter(m => m.status === 'stopped')
  }

  // 按关键词搜索（模型名称、提供商）
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(
      m =>
        m.name.toLowerCase().includes(query)
        || m.provider.toLowerCase().includes(query),
    )
  }

  return result
})

/** 各状态的模型数量 */
const modelCounts = computed(() => ({
  all: models.value.length,
  running: models.value.filter(m => m.status === 'running').length,
  stopped: models.value.filter(m => m.status === 'stopped').length,
}))

/**
 * 导航到模型详情页
 */
function navigateToDetail(modelId: string) {
  router.push(`/models/${modelId}`)
}

/**
 * 模型注册表单提交回调
 */
function handleModelSubmit(data: { name: string }) {
  toast.success('模型注册成功', { description: data.name })
  showRegisterDialog.value = false
}

// ==================== 删除确认 ====================

const showDeleteDialog = ref(false)
const deleteTarget = ref<ModelItem | null>(null)

/** 复制模型 ID 到剪贴板 */
function handleCopyId(model: ModelItem) {
  navigator.clipboard.writeText(model.id)
  toast.success('已复制', { description: model.id })
}

/** 暂停模型服务 */
function handlePause(model: ModelItem) {
  model.status = 'stopped'
  toast.info('服务已暂停', { description: model.name })
}

/** 启动模型服务 */
function handleStart(model: ModelItem) {
  model.status = 'running'
  toast.success('服务已启动', { description: model.name })
}

/** 打开删除确认 */
function handleDeleteConfirm(model: ModelItem) {
  deleteTarget.value = model
  showDeleteDialog.value = true
}

/** 执行删除 */
function handleDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  models.value = models.value.filter(m => m.id !== deleteTarget.value!.id)
  showDeleteDialog.value = false
  deleteTarget.value = null
  toast.success('已删除', { description: name })
}
</script>

<template>
  <div>
    <PageLoading v-if="loading" :count="4" :cols="4" />
    <PageError v-else-if="loadError" :message="loadError" @retry="fetchModels()" />

  <div v-else class="flex flex-col gap-6">
    <!-- 页面头部：标题 + 操作按钮 -->
    <div class="flex items-start justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">
          模型管理
        </h1>
        <p class="text-sm text-muted-foreground leading-relaxed">
          管理已注册的大语言模型及推理服务，监控运行状态与调用指标
        </p>
      </div>
      <Button class="shrink-0" @click="showRegisterDialog = true">
        <Plus class="mr-2 size-4" />
        注册模型
      </Button>
    </div>

    <!-- 工具栏：搜索 + 筛选标签 + 模型计数 -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <!-- 搜索框 -->
        <div class="relative w-72">
          <Search
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="searchQuery"
            placeholder="搜索模型名称或提供商..."
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
                {{ modelCounts.all }}
              </span>
            </TabsTrigger>
            <TabsTrigger value="running" class="text-xs px-3">
              运行中
              <span
                class="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
              >
                {{ modelCounts.running }}
              </span>
            </TabsTrigger>
            <TabsTrigger value="stopped" class="text-xs px-3">
              已停止
              <span
                class="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium"
              >
                {{ modelCounts.stopped }}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <!-- 当前筛选结果计数 -->
      <span class="text-sm text-muted-foreground tabular-nums">
        共 {{ filteredModels.length }} 个模型
      </span>
    </div>

    <!-- 模型卡片网格 -->
    <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        v-for="model in filteredModels"
        :key="model.id"
        class="group relative cursor-pointer border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        @click="navigateToDetail(model.id)"
      >
        <!-- 卡片顶部渐变装饰条 -->
        <div
          :class="cn(
            'absolute inset-x-0 top-0 h-24 rounded-t-xl bg-gradient-to-br opacity-80 transition-opacity group-hover:opacity-100',
            model.brandColor,
          )"
        />

        <CardHeader class="relative z-10 pb-3">
          <div class="flex items-start justify-between">
            <div class="space-y-1.5">
              <!-- 模型名称 -->
              <CardTitle class="text-base font-semibold leading-none tracking-tight">
                {{ model.name }}
              </CardTitle>
              <!-- 提供商 -->
              <CardDescription class="text-xs">
                {{ model.provider }} &middot; {{ model.type }}
              </CardDescription>
            </div>

            <!-- 更多操作下拉菜单 -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  @click.stop
                >
                  <MoreHorizontal class="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-40">
                <DropdownMenuItem @click.stop="navigateToDetail(model.id)">
                  <Eye class="mr-2 size-4" />
                  查看详情
                </DropdownMenuItem>
                <DropdownMenuItem @click.stop="navigateToDetail(model.id)">
                  <Settings class="mr-2 size-4" />
                  编辑配置
                </DropdownMenuItem>
                <DropdownMenuItem @click.stop="handleCopyId(model)">
                  <Copy class="mr-2 size-4" />
                  复制 ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  v-if="model.status === 'running'"
                  class="text-amber-600 dark:text-amber-400"
                  @click.stop="handlePause(model)"
                >
                  <PauseCircle class="mr-2 size-4" />
                  暂停服务
                </DropdownMenuItem>
                <DropdownMenuItem
                  v-if="model.status === 'stopped'"
                  class="text-emerald-600 dark:text-emerald-400"
                  @click.stop="handleStart(model)"
                >
                  <PlayCircle class="mr-2 size-4" />
                  启动服务
                </DropdownMenuItem>
                <DropdownMenuItem class="text-destructive" @click.stop="handleDeleteConfirm(model)">
                  <Trash2 class="mr-2 size-4" />
                  删除模型
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent class="relative z-10 pb-4">
          <!-- 模型描述 -->
          <p class="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {{ model.description }}
          </p>
        </CardContent>

        <CardFooter class="relative z-10 flex-col items-stretch gap-3 pt-0">
          <Separator class="opacity-50" />

          <div class="flex items-center justify-between">
            <!-- 状态徽标 -->
            <Badge
              variant="secondary"
              :class="cn(
                'gap-1.5 border-0 text-[11px] font-medium',
                statusConfig[model.status].badgeClass,
              )"
            >
              <span
                :class="cn(
                  'size-1.5 rounded-full',
                  statusConfig[model.status].dotClass,
                  model.status === 'running' && 'animate-pulse',
                )"
              />
              {{ statusConfig[model.status].label }}
            </Badge>

            <!-- 调用量 & 延迟指标 -->
            <div class="flex items-center gap-3 text-xs text-muted-foreground">
              <Tooltip>
                <TooltipTrigger as-child>
                  <span class="flex items-center gap-1 tabular-nums">
                    <Zap class="size-3 text-amber-500" />
                    {{ model.calls }}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>累计调用量</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger as-child>
                  <span class="flex items-center gap-1 tabular-nums">
                    <Clock class="size-3 text-blue-500" />
                    {{ model.latency }}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>平均响应延迟</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- 空状态提示 -->
    <div
      v-if="filteredModels.length === 0"
      class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16"
    >
      <Search class="size-10 text-muted-foreground/40" />
      <div class="text-center">
        <p class="text-sm font-medium text-muted-foreground">
          未找到匹配的模型
        </p>
        <p class="mt-1 text-xs text-muted-foreground/60">
          尝试调整搜索关键词或筛选条件
        </p>
      </div>
    </div>

    <!-- 模型注册对话框 -->
    <ModelRegisterDialog
      v-model:open="showRegisterDialog"
      @submit="handleModelSubmit"
    />

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除模型"
      :description="`确定要删除「${deleteTarget?.name}」吗？相关的 API 配置和调用记录将被永久删除。`"
      confirm-text="删除"
      @confirm="handleDelete"
    />
  </div>
  </div>
</template>
