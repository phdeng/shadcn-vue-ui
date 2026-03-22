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
import { Label } from '@ui/components/ui/label'
import { Slider } from '@ui/components/ui/slider'
import { cn } from '@ui/lib/utils'
import { Bot, FileText, Image, Layers, Mic, Music, Play, RotateCcw, Send, Settings2, Sparkles, Upload, User } from 'lucide-vue-next'
/**
 * @description Playground 多模态推理调试环境
 * @author Timon
 */
import { nextTick, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { renderMarkdown } from '@/composables/useMarkdown'

// ==================== 模态配置 ====================

type ModalType = 'text' | 'image' | 'audio' | 'multimodal'

interface ModalMode {
  value: ModalType
  label: string
  icon: typeof FileText
}

const modes: ModalMode[] = [
  { value: 'text', label: '文本', icon: FileText },
  { value: 'image', label: '图片', icon: Image },
  { value: 'audio', label: '音频', icon: Music },
  { value: 'multimodal', label: '多模态', icon: Layers },
]

const activeModal = ref<ModalType>('text')

// ==================== 模型配置 ====================

const showConfig = ref(false)
const selectedModel = ref('gpt-4o')
const temperature = ref([0.7])
const maxTokens = ref([2048])

const modelOptions = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'claude-3.5', label: 'Claude 3.5' },
  { value: 'qwen-2.5', label: 'Qwen2.5' },
]

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
  /** 消息包含的模态类型 */
  modality?: ModalType
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

  const currentModality = activeModal.value

  messages.value.push({
    role: 'user',
    content: inputMessage.value,
    time: now(),
    modality: currentModality,
  })

  const userMsg = inputMessage.value
  const agent = getAgentConfig()
  inputMessage.value = ''
  isTyping.value = true
  scrollToBottom()

  // 模拟 AI 回复（根据当前 Agent 类型和模态生成）
  setTimeout(() => {
    isTyping.value = false
    const replyModality = currentModality === 'image' ? 'image' : currentModality === 'audio' ? 'audio' : 'text'
    messages.value.push({
      role: 'assistant',
      content: `${agent.replyPrefix}收到你的消息：「${userMsg}」\n\n这是一个模拟回复。实际使用时，这里会调用 **${agent.label}** 的后端 API 进行处理。`,
      time: now(),
      modality: replyModality,
    })
    scrollToBottom()
  }, 800)
}
</script>

<template>
  <div class="flex h-[calc(100vh-8rem)] flex-col">
    <!-- 顶部工具栏 -->
    <div class="flex flex-col gap-3 pb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div>
            <h2 class="text-lg font-semibold tracking-tight">
              Playground
            </h2>
            <p class="text-xs text-muted-foreground">
              统一多模态推理调试环境
            </p>
          </div>
          <Separator orientation="vertical" class="!h-8" />
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
          <Button
            variant="ghost"
            size="icon"
            class="size-8"
            :class="showConfig && 'bg-muted'"
            @click="showConfig = !showConfig"
          >
            <Settings2 class="size-4" />
          </Button>
        </div>
      </div>

      <!-- 模态切换按钮组 -->
      <div class="flex gap-1 rounded-xl bg-muted/40 p-1 w-fit">
        <button
          v-for="mode in modes"
          :key="mode.value"
          :class="cn(
            'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
            activeModal === mode.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )"
          @click="activeModal = mode.value"
        >
          <component :is="mode.icon" class="size-3.5" />
          {{ mode.label }}
        </button>
      </div>
    </div>

    <!-- 对话区域 + 侧边配置 -->
    <div class="flex flex-1 gap-4 overflow-hidden">
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

                <!-- 图片模态内容占位 -->
                <div v-if="msg.modality === 'image'" class="mt-2">
                  <div
                    v-if="msg.role === 'user'"
                    class="flex items-center justify-center rounded-xl border-2 border-dashed border-border/60 h-32 w-32 bg-muted/20"
                  >
                    <Image class="size-8 text-muted-foreground/40" />
                  </div>
                  <div
                    v-else
                    class="flex items-center justify-center rounded-xl bg-muted/30 h-48 w-full"
                  >
                    <div class="text-center">
                      <Image class="size-10 text-muted-foreground/30 mx-auto mb-1" />
                      <span class="text-xs text-muted-foreground/50">AI 生成图片</span>
                    </div>
                  </div>
                </div>

                <!-- 音频模态内容占位 -->
                <div v-if="msg.modality === 'audio'" class="mt-2">
                  <div class="flex items-center gap-2 rounded-xl bg-muted/30 h-10 px-3 w-full">
                    <button class="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground shrink-0">
                      <Play class="size-3" />
                    </button>
                    <div class="flex-1 h-1 rounded-full bg-muted-foreground/20">
                      <div class="h-full w-1/3 rounded-full bg-primary/60" />
                    </div>
                    <span class="text-[10px] text-muted-foreground/50 shrink-0">0:12</span>
                  </div>
                </div>
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
        <div class="mx-auto max-w-3xl space-y-3">
          <!-- 图片上传区域 -->
          <div
            v-if="activeModal === 'image' || activeModal === 'multimodal'"
            class="flex items-center gap-3"
          >
            <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 h-32 w-32 cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/5">
              <Upload class="size-6 text-muted-foreground/40 mb-1" />
              <span class="text-[10px] text-muted-foreground/50">点击上传图片</span>
            </div>
          </div>

          <!-- 音频录制区域 -->
          <div
            v-if="activeModal === 'audio'"
            class="flex items-center gap-3"
          >
            <button class="flex items-center justify-center rounded-full size-12 bg-destructive text-destructive-foreground transition-transform hover:scale-105 shrink-0">
              <Mic class="size-5" />
            </button>
            <span class="text-xs text-muted-foreground">点击录音或上传音频文件</span>
          </div>

          <!-- 文本输入 -->
          <div class="flex items-center gap-2">
            <div class="relative flex-1">
              <Input
                v-model="inputMessage"
                :placeholder="activeModal === 'audio' ? '添加音频描述...' : activeModal === 'image' ? '添加图片描述...' : '输入消息，按 Enter 发送...'"
                class="pr-10 h-10 rounded-xl"
                @keyup.enter="sendMessage"
              />
              <Sparkles class="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
            </div>
            <Button size="icon" class="size-10 shrink-0 rounded-xl" :disabled="isTyping" @click="sendMessage">
              <Send class="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 右侧配置面板 -->
    <Card
      v-if="showConfig"
      class="w-72 shrink-0 border-0 shadow-sm overflow-hidden flex flex-col"
    >
      <CardContent class="p-4 space-y-5">
        <div>
          <h3 class="text-sm font-medium mb-3">模型配置</h3>
          <Separator />
        </div>

        <!-- 模型选择 -->
        <div class="space-y-2">
          <Label class="text-xs text-muted-foreground">模型</Label>
          <Select v-model="selectedModel">
            <SelectTrigger class="h-8 text-xs">
              <SelectValue placeholder="选择模型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="m in modelOptions" :key="m.value" :value="m.value" class="text-xs">
                {{ m.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Temperature -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs text-muted-foreground">Temperature</Label>
            <span class="text-xs font-mono text-muted-foreground">{{ temperature[0].toFixed(1) }}</span>
          </div>
          <Slider v-model="temperature" :min="0" :max="2" :step="0.1" class="w-full" />
        </div>

        <!-- Max Tokens -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label class="text-xs text-muted-foreground">Max Tokens</Label>
            <span class="text-xs font-mono text-muted-foreground">{{ maxTokens[0] }}</span>
          </div>
          <Slider v-model="maxTokens" :min="256" :max="8192" :step="256" class="w-full" />
        </div>

        <Separator />

        <!-- 当前模态信息 -->
        <div class="space-y-2">
          <Label class="text-xs text-muted-foreground">当前模态</Label>
          <Badge variant="outline" class="gap-1.5 text-xs">
            <component :is="modes.find(m => m.value === activeModal)?.icon" class="size-3" />
            {{ modes.find(m => m.value === activeModal)?.label }}
          </Badge>
        </div>
      </CardContent>
    </Card>
    </div>
  </div>
</template>
