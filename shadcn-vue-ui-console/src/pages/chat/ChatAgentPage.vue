<script setup lang="ts">
/**
 * @description ChatAgent 对话页 — 类 Dify 对话界面
 * @author Timon
 */
import { ref } from 'vue'
import { Send, Bot, User, Sparkles, RotateCcw, Settings2 } from 'lucide-vue-next'
import { renderMarkdown } from '@/composables/useMarkdown'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar'
import { Badge } from '@ui/components/ui/badge'
import {
  Card,
  CardContent,
} from '@ui/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select'
import { Separator } from '@ui/components/ui/separator'
import { ScrollArea } from '@ui/components/ui/scroll-area'
import { cn } from '@ui/lib/utils'

// 当前选择的 Agent
const selectedAgent = ref('customer-service')

// 对话消息
const messages = ref([
  {
    role: 'assistant' as const,
    content: '你好！我是客服助手，有什么可以帮你的吗？我可以回答产品使用、订单查询、技术支持等方面的问题。',
    time: '14:20',
  },
  {
    role: 'user' as const,
    content: '帮我查一下最近的 API 调用量统计',
    time: '14:21',
  },
  {
    role: 'assistant' as const,
    content: '好的，以下是近 7 天的 API 调用量统计：\n\n- **GPT-4o**：12,340 次（日均 1,763 次）\n- **Claude 3.5**：8,921 次（日均 1,274 次）\n- **DeepSeek-V3**：5,678 次（日均 811 次）\n\n总调用量较上周增长 12.3%，其中 GPT-4o 的增长最为显著。需要我生成详细报表吗？',
    time: '14:21',
  },
])

const inputMessage = ref('')

const agents = [
  { value: 'customer-service', label: '客服助手' },
  { value: 'doc-summary', label: '文档摘要' },
  { value: 'code-review', label: '代码审查' },
  { value: 'data-analyst', label: '数据分析' },
]

function sendMessage() {
  if (!inputMessage.value.trim()) return

  messages.value.push({
    role: 'user',
    content: inputMessage.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  })

  const userMsg = inputMessage.value
  inputMessage.value = ''

  // 模拟 AI 回复
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: `收到你的消息：「${userMsg}」\n\n这是一个模拟回复。实际使用时，这里会调用选中的 Agent 进行对话处理。`,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    })
  }, 800)
}
</script>

<template>
  <div class="flex h-[calc(100vh-8rem)] flex-col">
    <!-- 顶部工具栏 -->
    <div class="flex items-center justify-between pb-4">
      <div class="flex items-center gap-3">
        <h2 class="text-lg font-semibold tracking-tight">ChatAgent</h2>
        <Separator orientation="vertical" class="!h-5" />
        <Select v-model="selectedAgent">
          <SelectTrigger class="h-8 w-40 text-xs">
            <SelectValue placeholder="选择 Agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="agent in agents" :key="agent.value" :value="agent.value" class="text-xs">
              {{ agent.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary" class="gap-1.5 text-[10px]">
          <span class="size-1.5 rounded-full bg-emerald-500" />
          在线
        </Badge>
      </div>
      <div class="flex items-center gap-1">
        <Button variant="ghost" size="icon" class="size-8">
          <RotateCcw class="size-4" />
        </Button>
        <Button variant="ghost" size="icon" class="size-8">
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
              <AvatarFallback :class="cn(
                'text-xs font-medium',
                msg.role === 'assistant'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground',
              )">
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
              <p class="text-[10px] text-muted-foreground/60 px-1">{{ msg.time }}</p>
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
          <Button size="icon" class="size-10 shrink-0 rounded-xl" @click="sendMessage">
            <Send class="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
