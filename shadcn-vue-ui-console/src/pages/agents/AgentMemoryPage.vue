<script setup lang="ts">
/**
 * @description Agent 记忆管理页面 — 长期记忆 / 会话历史 / 知识积累
 * @author Timon
 */
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
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
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// ========== Agent 数据 — 复用详情页数据结构 ==========

const agentsData = [
  { id: '1', name: '客服助手' },
  { id: '2', name: '文档摘要' },
  { id: '3', name: '代码审查' },
  { id: '4', name: '数据分析' },
  { id: '5', name: '翻译助手' },
  { id: '6', name: '知识问答' },
]

const agentId = route.params.id as string
const agent = agentsData.find(a => a.id === agentId) || agentsData[0]

// ========== 统计卡片 — HUD 水印风格 ==========

const stats = [
  { label: '记忆条目数', value: '1,247', icon: Brain, iconBase: 'text-chart-1/20 dark:text-chart-1/10', iconHover: 'group-hover:text-chart-1/40 dark:group-hover:text-chart-1/25', glow: 'from-chart-1/30 via-chart-1/8 to-transparent' },
  { label: '会话数', value: '89', icon: MessageSquare, iconBase: 'text-chart-4/20 dark:text-chart-4/10', iconHover: 'group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25', glow: 'from-chart-4/30 via-chart-4/8 to-transparent' },
  { label: '存储占用', value: '12.8 MB', icon: Database, iconBase: 'text-chart-5/20 dark:text-chart-5/10', iconHover: 'group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25', glow: 'from-chart-5/30 via-chart-5/8 to-transparent' },
]

// ========== Tab 1：长期记忆 Mock 数据 ==========

const memorySearch = ref('')

interface MemoryItem {
  id: number
  content: string
  source: string
  createdAt: string
  importance: '高' | '中' | '低'
}

const memories: MemoryItem[] = [
  { id: 1, content: '用户偏好中文回复，技术问题需要详细代码示例', source: '会话 #sess-0042', createdAt: '2026-03-18 14:30', importance: '高' },
  { id: 2, content: '项目使用 Vue 3 + TypeScript + Tailwind CSS', source: '会话 #sess-0038', createdAt: '2026-03-17 10:15', importance: '高' },
  { id: 3, content: '用户是高级开发者，无需解释基础概念', source: '会话 #sess-0035', createdAt: '2026-03-16 09:20', importance: '高' },
  { id: 4, content: '偏好使用 Composition API 而非 Options API', source: '手动添加', createdAt: '2026-03-15 16:45', importance: '中' },
  { id: 5, content: '代码风格要求：单引号、无分号、2 空格缩进', source: '会话 #sess-0031', createdAt: '2026-03-14 11:30', importance: '中' },
  { id: 6, content: '关注性能优化，尤其是首屏加载速度', source: '会话 #sess-0028', createdAt: '2026-03-12 15:20', importance: '中' },
  { id: 7, content: '团队使用 GitHub Actions 进行 CI/CD', source: '会话 #sess-0025', createdAt: '2026-03-10 08:50', importance: '低' },
  { id: 8, content: '数据库使用 PostgreSQL + Prisma ORM', source: '手动添加', createdAt: '2026-03-08 13:10', importance: '低' },
]

const importanceConfig = {
  '高': 'bg-destructive/10 text-destructive border-destructive/20',
  '中': 'bg-warning/10 text-warning border-warning/20',
  '低': 'bg-muted text-muted-foreground border-border',
}

// ========== Tab 2：会话历史 Mock 数据 ==========

interface SessionItem {
  id: string
  startTime: string
  messageCount: number
  tokenUsage: number
  status: '活跃' | '已结束'
  recentMessages: { role: 'user' | 'assistant'; content: string }[]
}

const sessions: SessionItem[] = [
  { id: 'sess-0042', startTime: '2026-03-21 14:00', messageCount: 28, tokenUsage: 15240, status: '活跃', recentMessages: [{ role: 'user', content: '帮我优化这个组件的渲染性能' }, { role: 'assistant', content: '好的，我来分析一下组件的渲染瓶颈。首先建议使用 v-memo 和 computed...' }, { role: 'user', content: '还有虚拟滚动的方案吗？' }] },
  { id: 'sess-0041', startTime: '2026-03-20 16:30', messageCount: 15, tokenUsage: 8920, status: '已结束', recentMessages: [{ role: 'user', content: '如何配置 Tailwind CSS v4？' }, { role: 'assistant', content: 'Tailwind CSS v4 使用 @import 方式引入，无需 tailwind.config.js...' }, { role: 'user', content: '明白了，谢谢！' }] },
  { id: 'sess-0040', startTime: '2026-03-19 09:15', messageCount: 42, tokenUsage: 23100, status: '已结束', recentMessages: [{ role: 'user', content: '帮我设计一个文件上传组件' }, { role: 'assistant', content: '我来设计一个支持拖拽、预览和进度的文件上传组件...' }, { role: 'user', content: '加上断点续传功能' }] },
  { id: 'sess-0039', startTime: '2026-03-18 11:20', messageCount: 8, tokenUsage: 4560, status: '已结束', recentMessages: [{ role: 'user', content: 'Pinia store 最佳实践是什么？' }, { role: 'assistant', content: '建议使用 Setup Store 风格，按功能模块拆分 store...' }, { role: 'user', content: '如何处理 store 间的依赖？' }] },
  { id: 'sess-0038', startTime: '2026-03-17 10:00', messageCount: 22, tokenUsage: 12800, status: '已结束', recentMessages: [{ role: 'user', content: '项目技术栈是 Vue 3 + TS + Tailwind' }, { role: 'assistant', content: '了解，我会按照这个技术栈来协助你开发...' }, { role: 'user', content: '先从路由配置开始' }] },
  { id: 'sess-0037', startTime: '2026-03-16 14:45', messageCount: 18, tokenUsage: 9870, status: '已结束', recentMessages: [{ role: 'user', content: '帮我写一个 useDebounce 组合函数' }, { role: 'assistant', content: '好的，这是一个通用的 useDebounce composable...' }, { role: 'user', content: '加上 immediate 参数支持' }] },
]

const expandedSession = ref<string | null>(null)

function toggleSession(id: string) {
  expandedSession.value = expandedSession.value === id ? null : id
}

// ========== Tab 3：知识积累 Mock 数据 ==========

interface KnowledgeItem {
  id: number
  content: string
  confidence: number
  source: string
  time: string
}

const knowledgeItems: KnowledgeItem[] = [
  { id: 1, content: 'Vue 3 的 Suspense 组件用于异步依赖的优雅降级处理', confidence: 95, source: '会话 #sess-0040', time: '2026-03-19' },
  { id: 2, content: 'Tailwind CSS v4 使用 oklch 色彩空间替代 RGB', confidence: 88, source: '会话 #sess-0041', time: '2026-03-20' },
  { id: 3, content: 'Vite 的 HMR 机制基于 ESM 原生模块系统', confidence: 92, source: '会话 #sess-0038', time: '2026-03-17' },
  { id: 4, content: 'Pinia 的 Setup Store 可以直接使用 ref/computed/watch', confidence: 85, source: '会话 #sess-0039', time: '2026-03-18' },
  { id: 5, content: 'TypeScript 的 satisfies 运算符用于类型验证而不改变推断', confidence: 78, source: '会话 #sess-0037', time: '2026-03-16' },
]
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-6">
      <div class="flex items-center gap-3">
        <Skeleton class="size-9 rounded-lg" />
        <div class="space-y-2">
          <Skeleton class="h-7 w-48" />
          <Skeleton class="h-4 w-32" />
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-3">
        <Skeleton v-for="i in 3" :key="i" class="h-[100px] rounded-xl" />
      </div>
      <Skeleton class="h-[400px] rounded-xl" />
    </div>

    <div v-else class="flex flex-col gap-8">
      <!-- 顶部区域：返回按钮 + 标题 -->
      <div class="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          class="shrink-0"
          aria-label="返回"
          @click="router.push({ name: 'AgentDetail', params: { id: agentId } })"
        >
          <ArrowLeft class="size-4" />
        </Button>
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-foreground">
            Agent 记忆管理
          </h2>
          <p class="mt-1 text-[13px] text-muted-foreground">
            {{ agent.name }} — 管理记忆、会话历史与知识积累
          </p>
        </div>
      </div>

      <!-- 统计卡片 — HUD 水印风格 -->
      <div class="grid gap-4 sm:grid-cols-3">
        <div
          v-for="item in stats"
          :key="item.label"
          class="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm px-6 py-6 transition-all duration-500 hover:border-border/50 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
        >
          <component
            :is="item.icon"
            :class="cn('absolute right-4 top-1/2 -translate-y-1/2 size-20 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6', item.iconBase, item.iconHover)"
          />
          <div :class="cn('absolute right-0 top-1/2 -translate-y-1/2 size-40 rounded-full bg-gradient-radial opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl scale-75 group-hover:scale-100', item.glow)" />
          <div class="relative z-10">
            <span class="text-[13px] font-medium text-muted-foreground">{{ item.label }}</span>
            <div class="mt-3 text-[32px] font-bold tracking-tighter tabular-nums leading-none">
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 区域 -->
      <Tabs default-value="memory">
        <TabsList>
          <TabsTrigger value="memory" class="gap-1.5">
            <Brain class="size-3.5" />
            长期记忆
          </TabsTrigger>
          <TabsTrigger value="sessions" class="gap-1.5">
            <Clock class="size-3.5" />
            会话历史
          </TabsTrigger>
          <TabsTrigger value="knowledge" class="gap-1.5">
            <BookOpen class="size-3.5" />
            知识积累
          </TabsTrigger>
        </TabsList>

        <!-- Tab 1：长期记忆 -->
        <TabsContent value="memory">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader>
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="text-[15px] font-semibold">长期记忆</CardTitle>
                  <CardDescription>Agent 积累的用户偏好与上下文信息</CardDescription>
                </div>
                <Button size="sm" class="gap-1.5" @click="toast.success('记忆已添加', { description: '新的记忆条目已保存' })">
                  <Plus class="size-3.5" />
                  添加记忆
                </Button>
              </div>
              <!-- 搜索框 -->
              <div class="relative mt-2">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  v-model="memorySearch"
                  placeholder="搜索记忆内容..."
                  class="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div
                  v-for="mem in memories"
                  :key="mem.id"
                  class="group/item flex items-start justify-between gap-4 rounded-lg border border-border/30 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div class="flex-1 min-w-0">
                    <p class="text-sm leading-relaxed text-foreground">
                      {{ mem.content }}
                    </p>
                    <div class="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>来源：{{ mem.source }}</span>
                      <span>{{ mem.createdAt }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      :class="cn('text-[10px] px-2 py-0.5', importanceConfig[mem.importance])"
                    >
                      {{ mem.importance }}
                    </Badge>
                    <div class="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" class="size-7" aria-label="编辑记忆" @click="toast.info('编辑记忆', { description: mem.content })">
                        <Pencil class="size-3" />
                      </Button>
                      <Button variant="ghost" size="icon" class="size-7 text-destructive hover:text-destructive" aria-label="删除记忆" @click="toast.error('记忆已删除', { description: mem.content })">
                        <Trash2 class="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Tab 2：会话历史 -->
        <TabsContent value="sessions">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px] font-semibold">会话历史</CardTitle>
              <CardDescription>Agent 的对话会话记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground w-8" />
                    <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">会话 ID</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">开始时间</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">消息数</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Token 消耗</TableHead>
                    <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <template v-for="session in sessions" :key="session.id">
                    <TableRow
                      class="cursor-pointer transition-colors hover:bg-muted/40"
                      @click="toggleSession(session.id)"
                    >
                      <TableCell class="w-8">
                        <ChevronDown v-if="expandedSession === session.id" class="size-4 text-muted-foreground" />
                        <ChevronRight v-else class="size-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell class="font-mono text-sm">{{ session.id }}</TableCell>
                      <TableCell class="font-mono text-sm whitespace-nowrap">{{ session.startTime }}</TableCell>
                      <TableCell class="tabular-nums">{{ session.messageCount }}</TableCell>
                      <TableCell class="tabular-nums">{{ session.tokenUsage.toLocaleString() }}</TableCell>
                      <TableCell>
                        <Badge :variant="session.status === '活跃' ? 'default' : 'secondary'">
                          {{ session.status }}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <!-- 展开：最近消息 -->
                    <TableRow v-if="expandedSession === session.id" class="bg-muted/10 hover:bg-muted/10">
                      <TableCell colspan="6" class="p-0">
                        <div class="px-8 py-4 space-y-3">
                          <p class="text-xs font-medium text-muted-foreground mb-2">最近消息</p>
                          <div
                            v-for="(msg, i) in session.recentMessages"
                            :key="i"
                            class="flex items-start gap-2"
                          >
                            <Badge
                              :variant="msg.role === 'user' ? 'outline' : 'secondary'"
                              class="shrink-0 text-[10px] px-1.5 py-0"
                            >
                              {{ msg.role === 'user' ? '用户' : '助手' }}
                            </Badge>
                            <span class="text-sm text-foreground/80">{{ msg.content }}</span>
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

        <!-- Tab 3：知识积累 -->
        <TabsContent value="knowledge">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader>
              <CardTitle class="text-[15px] font-semibold">知识积累</CardTitle>
              <CardDescription>从对话中自动提取的知识点</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-4">
                <div
                  v-for="item in knowledgeItems"
                  :key="item.id"
                  class="rounded-lg border border-border/30 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <p class="text-sm leading-relaxed text-foreground">
                    {{ item.content }}
                  </p>
                  <div class="mt-3 flex items-center gap-4">
                    <div class="flex items-center gap-2 flex-1 max-w-[200px]">
                      <span class="text-xs text-muted-foreground shrink-0">置信度</span>
                      <div class="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${item.confidence}%` }" />
                      </div>
                      <span class="text-xs font-medium tabular-nums text-foreground">{{ item.confidence }}%</span>
                    </div>
                    <span class="text-xs text-muted-foreground">来源：{{ item.source }}</span>
                    <span class="text-xs text-muted-foreground">{{ item.time }}</span>
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
