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
  Activity,
  ArrowLeft,
  Bot,
  Clock,
  LayoutGrid,
  MessageSquare,
  ScrollText,
  Send,
  TrendingUp,
  User,
  Zap,
} from 'lucide-vue-next'
/**
 * @description Agent 详情页 — Dify 风格 Agent 配置与测试面板
 * @author Timon
 */
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// ========== Agent 数据 — 根据路由 id 匹配 ==========

interface AgentData {
  id: string
  name: string
  description: string
  status: 'running' | 'draft' | 'stopped'
  model: string
  tags: string[]
  avatarColor: string
  systemPrompt: string
  temperature: number
  maxTokens: number
  createdAt: string
}

const agentsData: AgentData[] = [
  { id: '1', name: '客服助手', description: '智能客服对话机器人，支持多轮对话与意图识别', status: 'running', model: 'GPT-4o', tags: ['对话', 'NLP'], avatarColor: 'bg-chart-1', systemPrompt: '你是一个专业的客服助手，负责回答用户关于产品功能、使用方法和常见问题的咨询。请保持友好、专业的语气，优先使用中文回答。如果用户的问题超出你的能力范围，请礼貌地引导用户联系人工客服。', temperature: 0.7, maxTokens: 4096, createdAt: '2026-02-10' },
  { id: '2', name: '文档摘要', description: '自动提取长文档核心内容生成结构化摘要', status: 'running', model: 'Claude 3.5 Sonnet', tags: ['摘要', 'RAG'], avatarColor: 'bg-chart-4', systemPrompt: '你是一个文档摘要专家。当用户提供文本内容时，你需要提取关键信息，生成简洁、结构化的摘要，包含核心要点和关键数据。', temperature: 0.3, maxTokens: 8192, createdAt: '2026-02-15' },
  { id: '3', name: '代码审查', description: '基于规范自动审查代码质量与安全性', status: 'draft', model: 'DeepSeek-V3', tags: ['代码', '审查'], avatarColor: 'bg-success', systemPrompt: '你是一个资深代码审查工程师，负责从代码质量、安全性、性能和可维护性四个维度审查用户提交的代码。', temperature: 0.2, maxTokens: 4096, createdAt: '2026-02-20' },
  { id: '4', name: '数据分析', description: '自然语言驱动的数据查询与可视化分析', status: 'running', model: 'GPT-4o', tags: ['数据', 'SQL'], avatarColor: 'bg-chart-5', systemPrompt: '你是一个数据分析师，帮助用户编写 SQL 查询、解读数据趋势、生成可视化方案。', temperature: 0.5, maxTokens: 4096, createdAt: '2026-02-25' },
  { id: '5', name: '翻译助手', description: '多语言实时翻译与本地化适配', status: 'stopped', model: 'Qwen2.5-72B', tags: ['翻译', 'i18n'], avatarColor: 'bg-destructive', systemPrompt: '你是一个专业翻译，支持中英日韩法德等 50+ 语种互译，保持原文语气和格式。', temperature: 0.4, maxTokens: 4096, createdAt: '2026-03-01' },
  { id: '6', name: '知识问答', description: '基于知识库的智能问答系统', status: 'running', model: 'Claude 3.5 Sonnet', tags: ['RAG', '问答'], avatarColor: 'bg-chart-2', systemPrompt: '你是一个知识问答助手，基于检索到的知识库文档内容回答用户问题，确保答案准确可追溯。', temperature: 0.6, maxTokens: 4096, createdAt: '2026-03-05' },
]

const agentId = route.params.id as string
const agent = agentsData.find(a => a.id === agentId) || agentsData[0]

// ========== 状态配置 ==========

const statusConfig = {
  running: { label: '运行中', dotClass: 'bg-success' },
  draft: { label: '草稿', dotClass: 'bg-warning' },
  stopped: { label: '已停止', dotClass: 'bg-muted-foreground/50' },
}

// ========== 指标卡片 — HUD 水印风格 ==========

// 根据 agent id 生成差异化指标
const baseMetrics = [12580, 8420, 3210, 15800, 1560, 9340]
const agentIndex = agentsData.findIndex(a => a.id === agentId)
const baseCalls = baseMetrics[agentIndex >= 0 ? agentIndex : 0]

const metrics = [
  { label: '总调用次数', value: baseCalls.toLocaleString(), icon: Activity, iconBase: 'text-chart-1/20 dark:text-chart-1/10', iconHover: 'group-hover:text-chart-1/40 dark:group-hover:text-chart-1/25', glow: 'from-chart-1/30 via-chart-1/8 to-transparent' },
  { label: '平均响应时间', value: '1.2s', icon: Clock, iconBase: 'text-chart-5/20 dark:text-chart-5/10', iconHover: 'group-hover:text-chart-5/40 dark:group-hover:text-chart-5/25', glow: 'from-chart-5/30 via-chart-5/8 to-transparent' },
  { label: '成功率', value: '98.5%', icon: TrendingUp, iconBase: 'text-success/20 dark:text-success/10', iconHover: 'group-hover:text-success/40 dark:group-hover:text-success/25', glow: 'from-success/30 via-success/8 to-transparent' },
  { label: '今日调用', value: Math.round(baseCalls * 0.029).toLocaleString(), icon: Zap, iconBase: 'text-chart-4/20 dark:text-chart-4/10', iconHover: 'group-hover:text-chart-4/40 dark:group-hover:text-chart-4/25', glow: 'from-chart-4/30 via-chart-4/8 to-transparent' },
]

// ========== 对话测试 Mock 消息 ==========

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const chatMessages = ref<ChatMessage[]>([
  { role: 'user', content: '你好，请问如何重置我的账户密码？' },
  {
    role: 'assistant',
    content:
      '您好！重置密码非常简单，请按以下步骤操作：\n\n1. 点击登录页面的「忘记密码」链接\n2. 输入您注册时使用的邮箱地址\n3. 查收重置邮件并点击链接\n4. 设置新密码即可\n\n如果您仍有问题，随时联系我。',
  },
])

const chatInput = ref('')
const chatTyping = ref(false)

/** 发送消息（仅前端模拟） */
function handleSendMessage() {
  const text = chatInput.value.trim()
  if (!text || chatTyping.value)
    return
  chatMessages.value.push({ role: 'user', content: text })
  chatInput.value = ''
  chatTyping.value = true
  // 模拟 AI 回复
  setTimeout(() => {
    chatTyping.value = false
    chatMessages.value.push({
      role: 'assistant',
      content: `关于您的问题「${text}」：\n\n感谢您的咨询，我已查询相关信息。这是一个模拟回复，实际使用时会调用 **${agent.name}** 的后端 API 生成真实回答。`,
    })
  }, 800)
}

// ========== 配置信息 ==========

const configItems = [
  { label: '关联模型', value: agent.model },
  { label: 'Temperature', value: String(agent.temperature) },
  { label: 'Max Tokens', value: agent.maxTokens.toLocaleString() },
  { label: '创建时间', value: agent.createdAt },
]

// ========== 调用日志 Mock 数据 ==========

const callLogs = [
  { time: '2026-03-21 14:23:05', user: 'Timon', input: '如何重置密码？', tokens: 1240, latency: '1.1s', status: '成功' },
  { time: '2026-03-21 14:18:32', user: 'Alex', input: '产品支持哪些语言？', tokens: 980, latency: '0.9s', status: '成功' },
  { time: '2026-03-21 13:55:10', user: 'Timon', input: '订单状态查询接口说明', tokens: 2150, latency: '1.8s', status: '成功' },
  { time: '2026-03-21 13:40:22', user: 'Guest', input: '退款流程是怎样的？', tokens: 1680, latency: '1.3s', status: '成功' },
  { time: '2026-03-21 13:12:45', user: 'Alex', input: '系统部署要求', tokens: 3200, latency: '2.5s', status: '失败' },
]
</script>

<template>
  <div>
    <div v-if="loading" class="flex flex-col gap-6">
      <div class="flex items-center gap-3">
        <Skeleton class="size-9 rounded-lg" />
        <Skeleton class="size-10 rounded-xl" />
      <div class="space-y-2">
        <Skeleton class="h-7 w-32" />
        <Skeleton class="h-4 w-64" />
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Skeleton v-for="i in 4" :key="i" class="h-[100px] rounded-xl" />
    </div>
    <Skeleton class="h-[400px] rounded-xl" />
  </div>

  <div v-else class="flex flex-col gap-6">
    <!-- 顶部区域：返回按钮 + Agent 名称 + 头像 + 状态 + 编辑按钮 -->
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
        <!-- Agent 头像 -->
        <div
          :class="cn(
            'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold text-white',
            agent.avatarColor,
          )"
        >
          {{ agent.name.charAt(0) }}
        </div>
        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">
              {{ agent.name }}
            </h2>
            <div class="flex items-center gap-1.5">
              <span :class="cn('size-2 rounded-full', statusConfig[agent.status].dotClass)" />
              <span class="text-xs font-medium text-success">
                {{ statusConfig[agent.status].label }}
              </span>
            </div>
          </div>
          <p class="mt-1.5 text-sm text-muted-foreground">
            {{ agent.description }} · 创建于 {{ agent.createdAt }}
          </p>
        </div>
      </div>
      <Button variant="outline" class="shrink-0" @click="toast.info('编辑 Agent', { description: `${agent.name} — 修改配置后将立即生效` })">
        编辑
      </Button>
    </div>

    <!-- 指标卡片 — HUD 水印风格 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="item in metrics"
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

    <!-- Tab 区域：对话测试 / 配置信息 / 调用日志 -->
    <Tabs default-value="chat">
      <TabsList>
        <TabsTrigger value="chat" class="gap-1.5">
          <MessageSquare class="size-3.5" />
          对话测试
        </TabsTrigger>
        <TabsTrigger value="config" class="gap-1.5">
          <LayoutGrid class="size-3.5" />
          配置信息
        </TabsTrigger>
        <TabsTrigger value="logs" class="gap-1.5">
          <ScrollText class="size-3.5" />
          调用日志
        </TabsTrigger>
      </TabsList>

      <!-- 对话测试 -->
      <TabsContent value="chat">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <CardTitle class="text-base">
              对话测试
            </CardTitle>
            <CardDescription>在此处测试 Agent 的对话能力</CardDescription>
          </CardHeader>
          <CardContent>
            <!-- 消息列表 -->
            <div class="space-y-4 rounded-lg border bg-muted/20 p-4" style="min-height: 240px;">
              <div
                v-for="(msg, i) in chatMessages"
                :key="i"
                :class="cn(
                  'flex gap-3',
                  msg.role === 'user' ? 'justify-end' : 'justify-start',
                )"
              >
                <!-- Assistant 头像 -->
                <div
                  v-if="msg.role === 'assistant'"
                  class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                >
                  <Bot class="size-4 text-primary" />
                </div>

                <!-- 消息气泡 -->
                <div
                  :class="cn(
                    'max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border shadow-sm',
                  )"
                >
                  {{ msg.content }}
                </div>

                <!-- User 头像 -->
                <div
                  v-if="msg.role === 'user'"
                  class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted"
                >
                  <User class="size-4 text-muted-foreground" />
                </div>
              </div>

              <!-- 打字指示器 -->
              <div v-if="chatTyping" class="flex gap-3 justify-start">
                <div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Bot class="size-4 text-primary" />
                </div>
                <div class="inline-flex items-center gap-1 rounded-xl bg-card border shadow-sm px-4 py-3">
                  <span class="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                  <span class="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                  <span class="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>

            <!-- 输入框 + 发送按钮 -->
            <div class="mt-4 flex gap-2">
              <Input
                v-model="chatInput"
                placeholder="输入消息进行测试..."
                class="flex-1"
                :disabled="chatTyping"
                @keyup.enter="handleSendMessage"
              />
              <Button size="icon" :disabled="chatTyping" @click="handleSendMessage">
                <Send class="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 配置信息 -->
      <TabsContent value="config">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <CardTitle class="text-base">
              配置详情
            </CardTitle>
            <CardDescription>Agent 的运行参数与关联信息</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 配置网格 -->
            <div class="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div
                v-for="item in configItems"
                :key="item.label"
                class="space-y-1 rounded-lg bg-muted/40 px-4 py-3"
              >
                <p class="text-xs font-medium text-muted-foreground">
                  {{ item.label }}
                </p>
                <p class="break-all font-mono text-sm font-medium text-foreground">
                  {{ item.value }}
                </p>
              </div>
            </div>

            <!-- 系统提示词（多行展示） -->
            <div class="space-y-1 rounded-lg bg-muted/40 px-4 py-3">
              <p class="text-xs font-medium text-muted-foreground">
                系统提示词
              </p>
              <p class="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {{ agent.systemPrompt }}
              </p>
            </div>

            <!-- 能力标签 -->
            <div class="space-y-2 rounded-lg bg-muted/40 px-4 py-3">
              <p class="text-xs font-medium text-muted-foreground">
                能力标签
              </p>
              <div class="flex flex-wrap gap-1.5">
                <Badge
                  v-for="tag in agent.tags"
                  :key="tag"
                  variant="secondary"
                  class="text-[11px] px-2.5 py-0.5"
                >
                  {{ tag }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 调用日志 -->
      <TabsContent value="logs">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <CardTitle class="text-base">
              调用日志
            </CardTitle>
            <CardDescription>最近 5 条 Agent 调用记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>用户</TableHead>
                  <TableHead>输入摘要</TableHead>
                  <TableHead>Token 数</TableHead>
                  <TableHead>延迟</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(log, i) in callLogs" :key="i">
                  <TableCell class="font-mono text-sm whitespace-nowrap">
                    {{ log.time }}
                  </TableCell>
                  <TableCell>{{ log.user }}</TableCell>
                  <TableCell class="max-w-[200px] truncate">
                    {{ log.input }}
                  </TableCell>
                  <TableCell class="tabular-nums">
                    {{ log.tokens.toLocaleString() }}
                  </TableCell>
                  <TableCell class="tabular-nums">
                    {{ log.latency }}
                  </TableCell>
                  <TableCell>
                    <Badge
                      :variant="log.status === '成功' ? 'secondary' : 'destructive'"
                    >
                      {{ log.status }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
  </div>
</template>
