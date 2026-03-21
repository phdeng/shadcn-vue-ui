<script setup lang="ts">
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar'
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
} from '@ui/components/ui/card'
import { Input } from '@ui/components/ui/input'
import { ScrollArea } from '@ui/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select'
import { Separator } from '@ui/components/ui/separator'
import { cn } from '@ui/lib/utils'
import { Bot, RotateCcw, Send, Settings2, Sparkles, User } from 'lucide-vue-next'
/**
 * @description ChatAgent 对话页 — 类 Dify 对话界面
 * @author Timon
 */
import { nextTick, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { renderMarkdown } from '@/composables/useMarkdown'

// ==================== Agent 配置 ====================

interface AgentConfig {
  value: string
  label: string
  greeting: string
  /** 模拟回复模板 */
  replyPrefix: string
}

const agents: AgentConfig[] = [
  { value: 'customer-service', label: '客服助手', greeting: '你好！我是客服助手，有什么可以帮你的吗？我可以回答产品使用、订单查询、技术支持等方面的问题。', replyPrefix: '作为客服助手，' },
  { value: 'doc-summary', label: '文档摘要', greeting: '你好！我是文档摘要助手。请发送或粘贴需要摘要的文本，我会为你提取核心要点。', replyPrefix: '已为你生成摘要：\n\n' },
  { value: 'code-review', label: '代码审查', greeting: '你好！我是代码审查助手。请发送你的代码片段，我会从**代码质量、安全性、性能**三个维度进行审查。', replyPrefix: '代码审查结果：\n\n' },
  { value: 'data-analyst', label: '数据分析', greeting: '你好！我是数据分析助手。请描述你的数据分析需求，我可以帮你编写 SQL 查询、生成可视化方案或解读数据。', replyPrefix: '分析结果：\n\n' },
]

// ==================== 对话状态 ====================

const selectedAgent = ref('customer-service')
const inputMessage = ref('')
const isTyping = ref(false)

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  time: string
}

function now() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function getAgentConfig() {
  return agents.find(a => a.value === selectedAgent.value) || agents[0]
}

// 初始消息
const messages = ref<ChatMessage[]>([
  { role: 'assistant', content: getAgentConfig().greeting, time: '14:20' },
])

/** 切换 Agent 时重置对话 */
watch(selectedAgent, () => {
  const agent = getAgentConfig()
  messages.value = [{ role: 'assistant', content: agent.greeting, time: now() }]
  isTyping.value = false
  inputMessage.value = ''
  toast.info(`已切换至「${agent.label}」`)
})

/** 清空对话记录 */
function clearMessages() {
  const agent = getAgentConfig()
  messages.value = [{ role: 'assistant', content: agent.greeting, time: now() }]
  isTyping.value = false
}

/** 推荐提问 — 根据当前 Agent 显示 */
const suggestedPrompts: Record<string, string[]> = {
  'customer-service': ['如何重置密码？', '查看 API 调用量', '订单状态查询'],
  'doc-summary': ['总结这篇文章的要点', '生成会议纪要', '提取关键数据'],
  'code-review': ['审查这段 TypeScript 代码', '检查安全漏洞', '优化性能建议'],
  'data-analyst': ['分析近 7 天的用户趋势', '生成月度报表 SQL', '对比两组数据差异'],
}

/** 快速填入推荐提问 */
function useSuggestion(text: string) {
  inputMessage.value = text
}

/** 滚动到底部 */
function scrollToBottom() {
  nextTick(() => {
    const el = document.querySelector('[data-radix-scroll-area-viewport]')
    if (el) el.scrollTop = el.scrollHeight
  })
}

function sendMessage() {
  if (!inputMessage.value.trim() || isTyping.value)
    return

  messages.value.push({
    role: 'user',
    content: inputMessage.value,
    time: now(),
  })

  const userMsg = inputMessage.value
  const agent = getAgentConfig()
  inputMessage.value = ''
  isTyping.value = true
  scrollToBottom()

  // 模拟 AI 回复（根据当前 Agent 类型生成）
  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      role: 'assistant',
      content: `${agent.replyPrefix}收到你的消息：「${userMsg}」\n\n这是一个模拟回复。实际使用时，这里会调用 **${agent.label}** 的后端 API 进行处理。`,
      time: now(),
    })
    scrollToBottom()
  }, 800)
}
</script>

<template>
  <div class="flex h-[calc(100vh-8rem)] flex-col">
    <!-- 顶部工具栏 -->
    <div class="flex items-center justify-between pb-4">
      <div class="flex items-center gap-3">
        <h2 class="text-lg font-semibold tracking-tight">
          ChatAgent
        </h2>
        <Separator orientation="vertical" class="!h-5" />
        <Select v-model="selectedAgent">
          <SelectTrigger class="h-8 w-40 text-xs">
            <SelectValue placeholder="选择 Agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="a in agents" :key="a.value" :value="a.value" class="text-xs">
              {{ a.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary" class="gap-1.5 text-[10px]">
          <span class="size-1.5 rounded-full bg-emerald-500" />
          在线
        </Badge>
      </div>
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="icon" class="size-8" @click="clearMessages">
          <RotateCcw class="size-4" />
        </Button>
        <Button variant="ghost" size="icon" class="size-8" @click="toast.info('Agent 设置', { description: '可调整 Temperature、Max Tokens 等参数' })">
          <Settings2 class="size-4" />
        </Button>
      </div>
    </div>

    <!-- 对话区域 -->
    <Card class="flex flex-1 flex-col border-0 shadow-sm overflow-hidden">
      <ScrollArea class="flex-1 px-6 py-4">
        <div class="mx-auto max-w-3xl space-y-5">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')"
          >
            <Avatar class="size-8 shrink-0">
              <AvatarFallback
                :class="cn(
                  'text-xs font-medium',
                  msg.role === 'assistant'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground',
                )"
              >
                <Bot v-if="msg.role === 'assistant'" class="size-4" />
                <User v-else class="size-4" />
              </AvatarFallback>
            </Avatar>
            <div :class="cn('max-w-[75%] space-y-1', msg.role === 'user' && 'text-right')">
              <div
                :class="cn(
                  'inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                  msg.role === 'assistant'
                    ? 'rounded-tl-sm bg-muted/70 text-foreground'
                    : 'rounded-tr-sm bg-primary text-primary-foreground',
                )"
              >
                <span v-if="msg.role === 'user'">{{ msg.content }}</span>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-else class="prose prose-sm dark:prose-invert max-w-none" v-html="renderMarkdown(msg.content)" />
              </div>
              <p class="text-[10px] text-muted-foreground/60 px-1">
                {{ msg.time }}
              </p>
            </div>
          </div>

          <!-- 推荐提问 — 仅在初始欢迎消息后显示 -->
          <div
            v-if="messages.length === 1 && !isTyping"
            class="flex flex-wrap gap-2 pl-11"
          >
            <button
              v-for="prompt in (suggestedPrompts[selectedAgent] || [])"
              :key="prompt"
              class="rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground hover:bg-primary/5"
              @click="useSuggestion(prompt)"
            >
              {{ prompt }}
            </button>
          </div>

          <!-- 打字指示器 -->
          <div v-if="isTyping" class="flex gap-3">
            <Avatar class="size-8 shrink-0">
              <AvatarFallback class="bg-primary/10 text-primary text-xs font-medium">
                <Bot class="size-4" />
              </AvatarFallback>
            </Avatar>
            <div class="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted/70 px-4 py-3">
              <span class="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
              <span class="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
              <span class="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      </ScrollArea>

      <!-- 输入区域 -->
      <CardContent class="border-t border-border/50 p-4">
        <div class="mx-auto flex max-w-3xl items-center gap-2">
          <div class="relative flex-1">
            <Input
              v-model="inputMessage"
              placeholder="输入消息，按 Enter 发送..."
              class="pr-10 h-10 rounded-xl"
              @keyup.enter="sendMessage"
            />
            <Sparkles class="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
          </div>
          <Button size="icon" class="size-10 shrink-0 rounded-xl" :disabled="isTyping" @click="sendMessage">
            <Send class="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
