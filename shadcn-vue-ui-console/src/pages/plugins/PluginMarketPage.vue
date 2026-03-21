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
import { Input } from '@ui/components/ui/input'
import { Separator } from '@ui/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { cn } from '@ui/lib/utils'
import {
  Download,
  ExternalLink,
  MessageSquareText,
  Puzzle,
  Search,
  Server,
  Star,
} from 'lucide-vue-next'
/**
 * @description 插件市场页 — Prompt / MCP / Skill
 * @author Timon
 */
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import PageLoading from '@/components/common/PageLoading.vue'

const searchQuery = ref('')
const activeTab = ref('all')
const loading = ref(true)
setTimeout(() => { loading.value = false }, 600)

type PluginType = 'prompt' | 'mcp' | 'skill'

interface PluginItem {
  id: string
  name: string
  description: string
  type: PluginType
  author: string
  stars: number
  downloads: string
  tags: string[]
}

const plugins = ref<PluginItem[]>([
  { id: '1', name: '通用摘要生成', description: '自动生成长文档的结构化摘要，支持自定义摘要粒度', type: 'prompt', author: 'Timon', stars: 128, downloads: '2.3k', tags: ['摘要', 'RAG'] },
  { id: '2', name: 'PostgreSQL MCP', description: '连接 PostgreSQL 数据库，支持自然语言查询与数据导出', type: 'mcp', author: 'Community', stars: 256, downloads: '5.1k', tags: ['数据库', 'SQL'] },
  { id: '3', name: '代码审查 Skill', description: '基于最佳实践自动审查代码质量、安全漏洞和性能问题', type: 'skill', author: 'Timon', stars: 89, downloads: '1.8k', tags: ['代码', '审查'] },
  { id: '4', name: '多语言翻译', description: '支持 50+ 语种的高质量翻译，保留原文格式与语气', type: 'prompt', author: 'Alex', stars: 312, downloads: '8.7k', tags: ['翻译', 'i18n'] },
  { id: '5', name: 'Slack MCP', description: '连接 Slack 工作区，支持消息发送、频道管理与事件监听', type: 'mcp', author: 'Community', stars: 178, downloads: '3.9k', tags: ['Slack', '通知'] },
  { id: '6', name: '数据可视化 Skill', description: '根据数据自动生成图表配置，支持 ECharts 和 Chart.js', type: 'skill', author: 'Community', stars: 95, downloads: '1.2k', tags: ['图表', '可视化'] },
])

// ==================== 搜索 + 类型筛选 ====================

/** 根据搜索关键词和类型筛选插件列表 */
const filteredPlugins = computed(() => {
  let result = plugins.value

  // 按类型筛选
  if (activeTab.value !== 'all') {
    result = result.filter(p => p.type === activeTab.value)
  }

  // 按关键词搜索
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(query)
        || p.description.toLowerCase().includes(query)
        || p.tags.some(t => t.toLowerCase().includes(query)),
    )
  }

  return result
})

// ==================== 事件处理 ====================

/** 插件卡片点击 — 安装/查看详情 */
function handlePluginClick(plugin: PluginItem) {
  toast.info(plugin.name, { description: plugin.description })
}

/** 发布插件 */
function handlePublish() {
  toast.info('发布插件', { description: '插件发布功能即将上线' })
}

const typeConfig: Record<PluginType, { label: string, icon: typeof MessageSquareText, color: string }> = {
  prompt: { label: 'Prompt', icon: MessageSquareText, color: 'from-blue-500/10 to-indigo-500/5' },
  mcp: { label: 'MCP', icon: Server, color: 'from-emerald-500/10 to-teal-500/5' },
  skill: { label: 'Skill', icon: Puzzle, color: 'from-violet-500/10 to-purple-500/5' },
}
</script>

<template>
  <div>
    <PageLoading v-if="loading" :count="6" :cols="3" />

  <div v-else class="flex flex-col gap-6">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          插件市场
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          浏览和安装 Prompt、MCP Server、Skill 插件
        </p>
      </div>
      <Button variant="outline" size="sm" @click="handlePublish">
        <ExternalLink class="mr-2 size-4" />
        发布插件
      </Button>
    </div>

    <!-- 工具栏 -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="relative w-72">
          <Search class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input v-model="searchQuery" placeholder="搜索插件..." class="pl-8 h-9" />
        </div>
        <Separator orientation="vertical" class="!h-5" />
        <Tabs v-model="activeTab">
          <TabsList class="h-9">
            <TabsTrigger value="all" class="text-xs px-3">
              全部
            </TabsTrigger>
            <TabsTrigger value="prompt" class="text-xs px-3">
              Prompt
            </TabsTrigger>
            <TabsTrigger value="mcp" class="text-xs px-3">
              MCP
            </TabsTrigger>
            <TabsTrigger value="skill" class="text-xs px-3">
              Skill
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <span class="text-sm text-muted-foreground">共 {{ filteredPlugins.length }} 个插件</span>
    </div>

    <!-- 插件卡片 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="plugin in filteredPlugins"
        :key="plugin.id"
        class="group cursor-pointer border-0 shadow-sm transition-all hover:shadow-md"
        @click="handlePluginClick(plugin)"
      >
        <CardHeader class="pb-2">
          <div class="flex items-start gap-3">
            <div :class="cn('flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br', typeConfig[plugin.type].color)">
              <component :is="typeConfig[plugin.type].icon" class="size-5 text-foreground/70" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <CardTitle class="text-sm leading-none">
                  {{ plugin.name }}
                </CardTitle>
                <Badge variant="outline" class="text-[10px] px-1.5 py-0">
                  {{ typeConfig[plugin.type].label }}
                </Badge>
              </div>
              <p class="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {{ plugin.description }}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent class="pb-2">
          <div class="flex flex-wrap gap-1.5">
            <Badge v-for="tag in plugin.tags" :key="tag" variant="secondary" class="text-[10px] px-1.5 py-0 font-normal">
              {{ tag }}
            </Badge>
          </div>
        </CardContent>

        <CardFooter class="flex-col items-stretch gap-3 pt-0">
          <Separator />
          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1">
                <Star class="size-3" />
                {{ plugin.stars }}
              </span>
              <span class="flex items-center gap-1">
                <Download class="size-3" />
                {{ plugin.downloads }}
              </span>
            </div>
            <span>{{ plugin.author }}</span>
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- 空状态提示 -->
    <div
      v-if="filteredPlugins.length === 0"
      class="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16"
    >
      <Search class="size-10 text-muted-foreground/40" />
      <div class="text-center">
        <p class="text-sm font-medium text-muted-foreground">
          未找到匹配的插件
        </p>
        <p class="mt-1 text-xs text-muted-foreground/60">
          尝试调整搜索关键词或筛选条件
        </p>
      </div>
    </div>
  </div>
  </div>
</template>
