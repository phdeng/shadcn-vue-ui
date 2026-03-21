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
import { Separator } from '@ui/components/ui/separator'
import { Skeleton } from '@ui/components/ui/skeleton'
import { Switch } from '@ui/components/ui/switch'
import { cn } from '@ui/lib/utils'
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Database,
  FileText,
  Hash,
  Layers,
  Pencil,
  Search,
} from 'lucide-vue-next'
/**
 * @description 文档详情页 — 查看文档分段/Chunk 列表，支持启用/禁用 Chunk
 * @author Timon
 */
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// ==================== 文档数据 ====================

const kbId = route.params.id as string
const docId = route.params.docId as string

const document = {
  id: docId,
  name: 'API 接口文档 v3.2.pdf',
  size: '4.8 MB',
  status: 'indexed' as const,
  segments: 342,
  tokens: 68400,
  uploadedAt: '2026-03-20 14:30',
  indexedAt: '2026-03-20 14:45',
  source: 'upload' as 'upload' | 'url',
}

const docStatusConfig = {
  indexed: { label: '已索引', dotClass: 'bg-emerald-500', badgeVariant: 'secondary' as const },
  indexing: { label: '索引中', dotClass: 'bg-amber-500 animate-pulse', badgeVariant: 'secondary' as const },
  pending: { label: '待处理', dotClass: 'bg-muted-foreground', badgeVariant: 'outline' as const },
  error: { label: '解析失败', dotClass: 'bg-destructive', badgeVariant: 'destructive' as const },
}

// ==================== 统计指标 ====================

const stats = [
  { label: '分段数', value: `${document.segments}`, icon: Layers },
  { label: 'Token 总数', value: document.tokens.toLocaleString(), icon: Hash },
  { label: '文件大小', value: document.size, icon: Database },
  { label: '索引时间', value: document.indexedAt, icon: Clock },
]

// ==================== 分段列表 ====================

const searchQuery = ref('')

interface Segment {
  id: string
  index: number
  content: string
  tokens: number
  chars: number
  enabled: boolean
  collapsed: boolean
  keywords: string[]
}

const segments = ref<Segment[]>([
  { id: 'seg-001', index: 1, content: '# 用户认证\n\n用户认证接口采用 OAuth 2.0 协议，支持 Authorization Code、Client Credentials 和 Device Code 三种授权模式。每个应用需要先在开发者控制台注册获取 Client ID 和 Client Secret，然后通过对应的授权流程获取 Access Token。', tokens: 186, chars: 204, enabled: true, collapsed: false, keywords: ['OAuth 2.0', '认证', 'Access Token'] },
  { id: 'seg-002', index: 2, content: '## Authorization Code 模式\n\n适用于有服务器端的 Web 应用。流程如下：\n1. 应用引导用户跳转至授权页面\n2. 用户登录并授权\n3. 授权服务器回调应用并携带 authorization_code\n4. 应用使用 code 换取 access_token\n5. 使用 access_token 访问 API 资源', tokens: 215, chars: 231, enabled: true, collapsed: false, keywords: ['Authorization Code', 'Web 应用', '授权'] },
  { id: 'seg-003', index: 3, content: '## Client Credentials 模式\n\n适用于服务端对服务端的通信场景，无需用户参与。应用直接使用 Client ID 和 Client Secret 向授权服务器请求 Access Token。此模式下获取的 Token 代表应用本身的身份，而非具体用户。\n\n请求示例：\nPOST /oauth/token\nContent-Type: application/x-www-form-urlencoded\ngrant_type=client_credentials&client_id=xxx&client_secret=xxx', tokens: 248, chars: 287, enabled: true, collapsed: false, keywords: ['Client Credentials', '服务端', 'Token'] },
  { id: 'seg-004', index: 4, content: '## Device Code 模式\n\n适用于输入受限的设备（如智能电视、IoT 设备）。流程如下：\n1. 设备向授权服务器申请 device_code 和 user_code\n2. 设备展示 user_code 并引导用户在其他设备上访问验证 URL\n3. 用户在浏览器中输入 user_code 完成授权\n4. 设备轮询授权服务器获取 access_token', tokens: 198, chars: 218, enabled: true, collapsed: false, keywords: ['Device Code', 'IoT', '设备授权'] },
  { id: 'seg-005', index: 5, content: '# API 密钥管理\n\n除了 OAuth 2.0，系统还支持 API Key 方式进行身份验证。API Key 适用于简单的服务端集成场景。每个应用最多可创建 5 个 API Key，支持设置独立的权限范围和过期时间。\n\n安全建议：\n- 不要在客户端代码中暴露 API Key\n- 定期轮换密钥（建议每 90 天）\n- 使用环境变量存储密钥', tokens: 224, chars: 245, enabled: true, collapsed: false, keywords: ['API Key', '密钥管理', '安全'] },
  { id: 'seg-006', index: 6, content: '# 速率限制\n\n为保障服务稳定性，所有 API 接口均有速率限制。默认限制如下：\n- 基础版：100 次/分钟\n- 专业版：1000 次/分钟\n- 企业版：自定义\n\n超出限制后将返回 HTTP 429 状态码。建议实现指数退避（Exponential Backoff）重试机制。响应头中的 X-RateLimit-Remaining 字段可用于监控剩余配额。', tokens: 192, chars: 210, enabled: true, collapsed: false, keywords: ['速率限制', 'Rate Limit', '429'] },
  { id: 'seg-007', index: 7, content: '# 错误处理\n\n所有 API 错误均返回统一的 JSON 格式：\n{\n  "error": {\n    "code": "INVALID_TOKEN",\n    "message": "The access token is expired or invalid",\n    "request_id": "req_xxx"\n  }\n}\n\n常见错误码：\n- INVALID_TOKEN：Token 无效或已过期\n- PERMISSION_DENIED：无权限访问\n- RATE_LIMITED：超出速率限制\n- INTERNAL_ERROR：服务器内部错误', tokens: 210, chars: 329, enabled: true, collapsed: false, keywords: ['错误处理', '错误码', 'JSON'] },
  { id: 'seg-008', index: 8, content: '# Webhook 回调\n\n系统支持通过 Webhook 推送事件通知。支持的事件类型：\n- model.completed：模型训练完成\n- data.processed：数据处理完成\n- alert.triggered：告警触发\n\n配置 Webhook 时需提供接收端 URL 和签名密钥。系统将使用 HMAC-SHA256 对 Payload 进行签名，接收端应验证签名以确保请求的真实性。', tokens: 205, chars: 224, enabled: false, collapsed: false, keywords: ['Webhook', '回调', '事件通知'] },
  { id: 'seg-009', index: 9, content: '# 数据导入 API\n\n支持通过 API 批量导入数据到知识库。接口支持以下格式：\n- JSON Lines（.jsonl）\n- CSV（.csv）\n- 纯文本（.txt）\n\n单次导入上限为 100MB 或 10000 条记录。导入为异步操作，可通过返回的 task_id 查询导入进度。大文件建议使用分片上传接口。', tokens: 178, chars: 195, enabled: true, collapsed: false, keywords: ['数据导入', 'API', '批量'] },
  { id: 'seg-010', index: 10, content: '# SDK 使用指南\n\n官方提供 Python、Node.js、Java、Go 四种语言的 SDK。安装方式：\n\nPython: pip install example-sdk\nNode.js: npm install @example/sdk\nJava: Maven 依赖\nGo: go get github.com/example/sdk-go\n\n所有 SDK 支持自动重试、连接池管理、请求签名等特性。建议使用最新稳定版本。', tokens: 195, chars: 213, enabled: true, collapsed: false, keywords: ['SDK', 'Python', 'Node.js'] },
])

/** 根据搜索关键词过滤分段列表 */
const filteredSegments = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return segments.value
  return segments.value.filter(
    seg => seg.content.toLowerCase().includes(q)
      || seg.keywords.some(k => k.toLowerCase().includes(q)),
  )
})

/** 已启用 / 总数 统计 */
const enabledCount = computed(() => segments.value.filter(s => s.enabled).length)

// ==================== 事件处理 ====================

/** 切换分段启用状态 */
function handleToggleSegment(seg: Segment) {
  seg.enabled = !seg.enabled
  toast.info(seg.enabled ? '已启用' : '已禁用', { description: `分段 #${seg.index}` })
}

/** 复制分段内容 */
function handleCopySegment(seg: Segment) {
  navigator.clipboard.writeText(seg.content)
  toast.success('已复制到剪贴板')
}

/** 展开/收起分段 */
function handleToggleCollapse(seg: Segment) {
  seg.collapsed = !seg.collapsed
}

/** 编辑分段（模拟） */
function handleEditSegment(seg: Segment) {
  toast.info('编辑分段', { description: `切片 ${String(seg.index - 1).padStart(2, '0')}` })
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex flex-col gap-6">
      <div class="flex items-center gap-3">
        <Skeleton class="size-9 rounded-lg" />
        <div class="space-y-2">
          <Skeleton class="h-7 w-48" />
        <Skeleton class="h-4 w-80" />
      </div>
    </div>
    <div class="grid gap-4 sm:grid-cols-4">
      <Skeleton v-for="i in 4" :key="i" class="h-[72px] rounded-lg" />
    </div>
    <Skeleton class="h-[500px] rounded-xl" />
  </div>

  <div v-else class="flex flex-col gap-6">
    <!-- 顶部：返回 + 文档名称 + 状态 -->
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          class="mt-0.5 shrink-0"
          @click="router.push(`/knowledge/${kbId}`)"
        >
          <ArrowLeft class="size-4" />
        </Button>
        <div>
          <div class="flex items-center gap-3">
            <FileText class="size-5 text-muted-foreground" />
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">
              {{ document.name }}
            </h2>
            <Badge
              :variant="docStatusConfig[document.status].badgeVariant"
              class="gap-1.5 text-[11px]"
            >
              <span :class="cn('size-1.5 rounded-full', docStatusConfig[document.status].dotClass)" />
              {{ docStatusConfig[document.status].label }}
            </Badge>
          </div>
          <p class="mt-1.5 text-sm text-muted-foreground">
            上传于 {{ document.uploadedAt }} · 来源：{{ document.source === 'url' ? 'URL 导入' : '本地上传' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 统计指标 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
      >
        <div class="flex size-9 items-center justify-center rounded-lg bg-muted">
          <component :is="stat.icon" class="size-4 text-muted-foreground" />
        </div>
        <div>
          <p class="text-xs text-muted-foreground">{{ stat.label }}</p>
          <p class="text-sm font-semibold tabular-nums">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- 分段列表 -->
    <Card class="border-0 shadow-sm">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-base">文档分段</CardTitle>
            <CardDescription>
              共 {{ segments.length }} 个分段，已启用 {{ enabledCount }} 个
            </CardDescription>
          </div>
          <div class="relative w-64">
            <Search class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input v-model="searchQuery" placeholder="搜索分段内容..." class="pl-8 h-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="seg in filteredSegments"
            :key="seg.id"
            :class="cn(
              'group rounded-lg border transition-all',
              seg.enabled
                ? 'bg-card hover:shadow-sm'
                : 'bg-muted/30 opacity-60',
            )"
          >
            <!-- 分段头部：切片编号 + 字符数 + 操作按钮 -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium text-foreground">
                  切片 {{ String(seg.index - 1).padStart(2, '0') }}
                </span>
                <Separator orientation="vertical" class="!h-3.5" />
                <span class="text-xs text-muted-foreground">{{ seg.chars }} 字符</span>
                <Separator orientation="vertical" class="!h-3.5" />
                <span class="text-xs text-muted-foreground">{{ seg.tokens }} Token</span>
              </div>
              <div class="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-7 gap-1 px-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="handleEditSegment(seg)"
                >
                  <Pencil class="size-3" />
                  编辑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-7 gap-1 px-2 text-xs text-muted-foreground"
                  @click="handleToggleCollapse(seg)"
                >
                  <component :is="seg.collapsed ? ChevronDown : ChevronUp" class="size-3" />
                  {{ seg.collapsed ? '展开' : '收起' }}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="handleCopySegment(seg)"
                >
                  <Copy class="size-3.5" />
                </Button>
                <Switch
                  :checked="seg.enabled"
                  class="scale-75"
                  @update:checked="handleToggleSegment(seg)"
                />
              </div>
            </div>

            <!-- 分段内容 -->
            <div v-if="!seg.collapsed" class="px-4 py-3">
              <p class="whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                {{ seg.content }}
              </p>

              <!-- 关键词标签 -->
              <div v-if="seg.keywords.length > 0" class="mt-3 flex flex-wrap gap-1.5">
                <Badge
                  v-for="kw in seg.keywords"
                  :key="kw"
                  variant="secondary"
                  class="text-[10px] px-2 py-0"
                >
                  {{ kw }}
                </Badge>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div
            v-if="filteredSegments.length === 0"
            class="flex flex-col items-center justify-center gap-3 py-12"
          >
            <Search class="size-10 text-muted-foreground/40" />
            <p class="text-sm text-muted-foreground">未找到匹配的分段</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
  </div>
</template>
