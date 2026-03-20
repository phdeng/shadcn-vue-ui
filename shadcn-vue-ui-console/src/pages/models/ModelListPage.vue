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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ModelRegisterDialog from '@/components/models/ModelRegisterDialog.vue'

// 路由实例
const router = useRouter()

// 注册对话框开关
const showRegisterDialog = ref(false)

// 搜索关键词
const searchQuery = ref('')

// 当前筛选标签
const activeTab = ref('all')

/** 模型状态类型 */
type ModelStatus = 'running' | 'stopped' | 'error'

/** 模型数据接口 */
interface ModelItem {
  id: string
  name: string
  provider: string
  type: string
  status: ModelStatus
  calls: string
  latency: string
  description: string
  /** 提供商品牌色，用于卡片顶部渐变装饰 */
  brandColor: string
}

// 模拟数据 — 4 个模型
const models = ref<ModelItem[]>([
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    type: '大语言模型',
    status: 'running',
    calls: '12,340',
    latency: '320ms',
    description: '多模态旗舰模型，支持文本、图像和音频理解与生成，适用于复杂推理与创意任务。',
    brandColor: 'from-emerald-500/10 to-teal-500/5',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    type: '大语言模型',
    status: 'running',
    calls: '8,921',
    latency: '280ms',
    description: '高性能对话模型，擅长深度分析、代码生成与长文档处理，具备出色的指令遵循能力。',
    brandColor: 'from-orange-500/10 to-amber-500/5',
  },
  {
    id: 'qwen2-5-72b',
    name: 'Qwen2.5-72B',
    provider: 'Alibaba',
    type: '大语言模型',
    status: 'stopped',
    calls: '3,210',
    latency: '\u2014',
    description: '通义千问开源大模型，支持中英双语，具备强大的中文理解与生成能力。',
    brandColor: 'from-violet-500/10 to-purple-500/5',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    type: '大语言模型',
    status: 'running',
    calls: '5,678',
    latency: '410ms',
    description: '基于 MoE 架构的高效推理模型，兼顾性能与成本，适合大规模生产环境部署。',
    brandColor: 'from-blue-500/10 to-cyan-500/5',
  },
])

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
</script>

<template>
  <div class="flex flex-col gap-8">
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
                <DropdownMenuItem @click.stop>
                  <Eye class="mr-2 size-4" />
                  查看详情
                </DropdownMenuItem>
                <DropdownMenuItem @click.stop>
                  <Settings class="mr-2 size-4" />
                  编辑配置
                </DropdownMenuItem>
                <DropdownMenuItem @click.stop>
                  <Copy class="mr-2 size-4" />
                  复制 ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  v-if="model.status === 'running'"
                  class="text-amber-600 dark:text-amber-400"
                  @click.stop
                >
                  <PauseCircle class="mr-2 size-4" />
                  暂停服务
                </DropdownMenuItem>
                <DropdownMenuItem
                  v-if="model.status === 'stopped'"
                  class="text-emerald-600 dark:text-emerald-400"
                  @click.stop
                >
                  <PlayCircle class="mr-2 size-4" />
                  启动服务
                </DropdownMenuItem>
                <DropdownMenuItem class="text-destructive" @click.stop>
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
  </div>
</template>
