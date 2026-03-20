<script setup lang="ts">
/**
 * @description Agent 管理页面 — 管理智能体、工作流与编排规则
 * @author Timon
 */
import { ref, computed } from 'vue'
import { Plus, Search, MoreHorizontal, Clock } from 'lucide-vue-next'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { Badge } from '@ui/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Separator } from '@ui/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { cn } from '@ui/lib/utils'

// ========== 类型定义 ==========

/** Agent 状态枚举 */
type AgentStatus = 'running' | 'draft' | 'stopped'

/** Agent 数据结构 */
interface Agent {
  id: string
  name: string
  description: string
  status: AgentStatus
  tags: string[]
  updatedAt: string
  /** 头像背景色（Tailwind 类名） */
  avatarColor: string
}

// ========== 状态配置 ==========

/** 各状态的显示配置 */
const statusConfig: Record<AgentStatus, { label: string; dotClass: string }> = {
  running: { label: '运行中', dotClass: 'bg-emerald-500' },
  draft: { label: '草稿', dotClass: 'bg-amber-400' },
  stopped: { label: '已停止', dotClass: 'bg-muted-foreground/50' },
}

/** 筛选标签页配置 */
const filterTabs: { value: string; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'running', label: '运行中' },
  { value: 'draft', label: '草稿' },
  { value: 'stopped', label: '已停止' },
]

// ========== Mock 数据 ==========

const agents = ref<Agent[]>([
  {
    id: '1',
    name: '客服助手',
    description: '智能客服对话机器人，支持多轮对话与意图识别',
    status: 'running',
    tags: ['对话', 'NLP'],
    updatedAt: '2 小时前',
    avatarColor: 'bg-blue-500',
  },
  {
    id: '2',
    name: '文档摘要',
    description: '自动提取长文档核心内容生成结构化摘要',
    status: 'running',
    tags: ['摘要', 'RAG'],
    updatedAt: '5 小时前',
    avatarColor: 'bg-violet-500',
  },
  {
    id: '3',
    name: '代码审查',
    description: '基于规范自动审查代码质量与安全性',
    status: 'draft',
    tags: ['代码', '审查'],
    updatedAt: '1 天前',
    avatarColor: 'bg-emerald-500',
  },
  {
    id: '4',
    name: '数据分析',
    description: '自然语言驱动的数据查询与可视化分析',
    status: 'running',
    tags: ['数据', 'SQL'],
    updatedAt: '30 分钟前',
    avatarColor: 'bg-orange-500',
  },
  {
    id: '5',
    name: '翻译助手',
    description: '多语言实时翻译与本地化适配',
    status: 'stopped',
    tags: ['翻译', 'i18n'],
    updatedAt: '3 天前',
    avatarColor: 'bg-rose-500',
  },
  {
    id: '6',
    name: '知识问答',
    description: '基于知识库的智能问答系统',
    status: 'running',
    tags: ['RAG', '问答'],
    updatedAt: '1 小时前',
    avatarColor: 'bg-cyan-500',
  },
])

// ========== 搜索与筛选 ==========

/** 搜索关键词 */
const searchQuery = ref('')

/** 当前选中的状态标签 */
const activeTab = ref('all')

/** 根据搜索关键词和状态筛选后的 Agent 列表 */
const filteredAgents = computed(() => {
  return agents.value.filter((agent) => {
    // 状态筛选
    const matchStatus = activeTab.value === 'all' || agent.status === activeTab.value
    // 关键词搜索（匹配名称、描述、标签）
    const keyword = searchQuery.value.trim().toLowerCase()
    const matchSearch =
      !keyword ||
      agent.name.toLowerCase().includes(keyword) ||
      agent.description.toLowerCase().includes(keyword) ||
      agent.tags.some((tag) => tag.toLowerCase().includes(keyword))
    return matchStatus && matchSearch
  })
})

// ========== 事件处理 ==========

/** 点击卡片 — 导航至 Agent 详情（暂仅打印日志） */
function handleCardClick(agent: Agent) {
  console.log('[AgentListPage] 点击卡片，导航至详情:', agent.id, agent.name)
}

/** 创建 Agent 按钮点击 */
function handleCreate() {
  console.log('[AgentListPage] 点击创建 Agent')
}

/** 下拉菜单操作 */
function handleMenuAction(action: string, agent: Agent) {
  console.log(`[AgentListPage] ${action}:`, agent.id, agent.name)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Agent 管理</h2>
        <p class="text-sm text-muted-foreground">管理智能体、工作流与编排规则</p>
      </div>
      <Button size="sm" @click="handleCreate">
        <Plus class="mr-2 size-4" />
        创建 Agent
      </Button>
    </div>

    <!-- 工具栏：搜索 + 筛选标签 + 数量统计 -->
    <div class="flex items-center gap-4">
      <!-- 搜索框 -->
      <div class="relative w-72">
        <Search
          class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          placeholder="搜索 Agent 名称或标签..."
          class="pl-9"
        />
      </div>

      <Separator orientation="vertical" class="!h-6" />

      <!-- 状态筛选标签 -->
      <Tabs v-model="activeTab" class="w-auto">
        <TabsList class="h-8">
          <TabsTrigger
            v-for="tab in filterTabs"
            :key="tab.value"
            :value="tab.value"
            class="text-xs px-3"
          >
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <!-- 数量统计 -->
      <span class="text-sm text-muted-foreground">
        共 {{ filteredAgents.length }} 个 Agent
      </span>
    </div>

    <!-- Agent 卡片网格 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="agent in filteredAgents"
        :key="agent.id"
        class="group cursor-pointer border-0 shadow-sm transition-all hover:shadow-md"
        @click="handleCardClick(agent)"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between gap-3">
            <!-- 头像 + 名称 + 描述 -->
            <div class="flex items-start gap-3 min-w-0">
              <!-- Agent 头像：彩色圆形 + 首字母 -->
              <div
                :class="cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white',
                  agent.avatarColor,
                )"
              >
                {{ agent.name.charAt(0) }}
              </div>
              <div class="min-w-0 space-y-1">
                <CardTitle class="text-sm font-semibold leading-tight">
                  {{ agent.name }}
                </CardTitle>
                <p class="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {{ agent.description }}
                </p>
              </div>
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
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click.stop="handleMenuAction('查看详情', agent)">
                  查看详情
                </DropdownMenuItem>
                <DropdownMenuItem @click.stop="handleMenuAction('编辑', agent)">
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem @click.stop="handleMenuAction('复制', agent)">
                  复制
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  class="text-destructive"
                  @click.stop="handleMenuAction('删除', agent)"
                >
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <!-- 能力标签 -->
        <CardContent class="pb-3">
          <div class="flex flex-wrap gap-1.5">
            <Badge
              v-for="tag in agent.tags"
              :key="tag"
              variant="secondary"
              class="text-[11px] px-2 py-0"
            >
              {{ tag }}
            </Badge>
          </div>
        </CardContent>

        <!-- 底栏：状态 + 更新时间 -->
        <CardFooter class="flex-col items-stretch gap-3 pt-0">
          <Separator />
          <div class="flex items-center justify-between">
            <!-- 状态指示器 -->
            <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                :class="cn('size-1.5 rounded-full', statusConfig[agent.status].dotClass)"
              />
              {{ statusConfig[agent.status].label }}
            </div>
            <!-- 最后更新时间 -->
            <div class="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock class="size-3" />
              {{ agent.updatedAt }}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- 空状态提示 -->
    <div
      v-if="filteredAgents.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <p class="text-sm text-muted-foreground">没有找到匹配的 Agent</p>
      <p class="mt-1 text-xs text-muted-foreground/60">
        尝试更换搜索关键词或筛选条件
      </p>
    </div>
  </div>
</template>
