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
import { useRouter } from 'vue-router'

const router = useRouter()

// ========== Mock 数据 — Agent「客服助手」 ==========

const agent = {
  id: '1',
  name: '客服助手',
  description: '智能客服对话机器人，支持多轮对话与意图识别',
  status: 'running' as const,
  model: 'GPT-4o',
  tags: ['对话', 'NLP'],
  avatarColor: 'bg-blue-500',
  systemPrompt:
    '你是一个专业的客服助手，负责回答用户关于产品功能、使用方法和常见问题的咨询。请保持友好、专业的语气，优先使用中文回答。如果用户的问题超出你的能力范围，请礼貌地引导用户联系人工客服。',
  temperature: 0.7,
  maxTokens: 4096,
  createdAt: '2026-02-10',
}

// ========== 状态配置 ==========

const statusConfig = {
  running: { label: '运行中', dotClass: 'bg-emerald-500' },
  draft: { label: '草稿', dotClass: 'bg-amber-400' },
  stopped: { label: '已停止', dotClass: 'bg-muted-foreground/50' },
}

// ========== 指标卡片 — 渐变背景风格 ==========

const metrics = [
  {
    label: '总调用次数',
    value: '12,580',
    icon: Activity,
    color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: '平均响应时间',
    value: '1.2s',
    icon: Clock,
    color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    label: '成功率',
    value: '98.5%',
    icon: TrendingUp,
    color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label: '今日调用',
    value: '368',
    icon: Zap,
    color: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
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

/** 发送消息（仅前端模拟） */
function handleSendMessage() {
  const text = chatInput.value.trim()
  if (!text)
    return
  chatMessages.value.push({ role: 'user', content: text })
  chatInput.value = ''
  // 模拟 AI 回复
  setTimeout(() => {
    chatMessages.value.push({
      role: 'assistant',
      content: '感谢您的提问，我正在查询相关信息，请稍候...',
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
  <div class="flex flex-col gap-6">
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
              <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {{ statusConfig[agent.status].label }}
              </span>
            </div>
          </div>
          <p class="mt-1.5 text-sm text-muted-foreground">
            {{ agent.description }} · 创建于 {{ agent.createdAt }}
          </p>
        </div>
      </div>
      <Button variant="outline" class="shrink-0">
        编辑
      </Button>
    </div>

    <!-- 指标卡片 — 渐变背景 + 毛玻璃图标容器 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        v-for="item in metrics"
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
            </div>

            <!-- 输入框 + 发送按钮 -->
            <div class="mt-4 flex gap-2">
              <Input
                v-model="chatInput"
                placeholder="输入消息进行测试..."
                class="flex-1"
                @keyup.enter="handleSendMessage"
              />
              <Button size="icon" @click="handleSendMessage">
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
</template>
