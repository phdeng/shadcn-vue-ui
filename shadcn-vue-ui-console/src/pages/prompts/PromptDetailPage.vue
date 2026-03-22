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
import { Label } from '@ui/components/ui/label'
import { Separator } from '@ui/components/ui/separator'
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
import { Textarea } from '@ui/components/ui/textarea'
import { cn } from '@ui/lib/utils'
import {
  ArrowLeft,
  Check,
  Clock,
  FlaskConical,
  History,
  Loader2,
  Pencil,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  User,
} from 'lucide-vue-next'
/**
 * @description Prompt 详情/版本管理页 — Tab 布局：编辑器 / 版本历史 / A/B 测试
 * @author Timon
 */
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// ==================== Prompt 基础数据 ====================

const promptData = {
  id: route.params.id as string,
  name: '智能客服回复',
  model: 'GPT-4o',
  version: 'v2.1',
  status: 'published' as const,
  creator: '李明',
  createdAt: '2026-02-10 09:00',
  updatedAt: '2026-03-21 14:30',
}

const statusConfig = {
  draft: { label: '草稿', dotClass: 'bg-muted-foreground', badgeVariant: 'outline' as const },
  published: { label: '已发布', dotClass: 'bg-success', badgeVariant: 'secondary' as const },
  testing: { label: '测试中', dotClass: 'bg-warning animate-pulse', badgeVariant: 'secondary' as const },
}

// ==================== Tab 1：编辑器 ====================

const systemPrompt = ref(`你是一个专业的客服助手，请根据以下规则回复用户：

1. 始终保持友好、专业的语气
2. 回复应简洁明了，避免过长的段落
3. 如果遇到无法解决的问题，引导用户联系人工客服
4. 使用 {{user_name}} 称呼用户
5. 根据 {{context}} 中的信息提供精准回复
6. 优先参考 {{knowledge_base}} 中的知识库内容
7. 回复语言应与用户输入语言保持一致`)

const variables = ref([
  { name: '{{user_name}}', description: '用户名称', example: '张先生' },
  { name: '{{context}}', description: '对话上下文', example: '用户询问退款流程' },
  { name: '{{knowledge_base}}', description: '关联知识库内容', example: '退款政策文档片段' },
  { name: '{{tone}}', description: '回复语气', example: '正式' },
])

// 测试面板
const testInput = ref('')
const testOutput = ref('')
const testLoading = ref(false)

function handleRunTest() {
  const q = testInput.value.trim()
  if (!q) return
  testLoading.value = true
  setTimeout(() => {
    testOutput.value = `张先生您好！感谢您的咨询。

关于退款流程，我为您说明如下：

1. 请登录您的账户，进入「订单管理」页面
2. 找到需要退款的订单，点击「申请退款」
3. 填写退款原因并提交申请
4. 我们将在 1-3 个工作日内处理您的退款请求

如果您在操作过程中遇到任何问题，请随时联系我，我很乐意为您提供帮助。`
    testLoading.value = false
  }, 1200)
}

// ==================== Tab 2：版本历史 ====================

const versions = ref([
  {
    version: 'v2.1',
    summary: '优化回复语气，增加知识库引用变量',
    author: '李明',
    date: '2026-03-21 14:30',
    isCurrent: true,
  },
  {
    version: 'v2.0',
    summary: '重构 Prompt 结构，支持多语言回复',
    author: '李明',
    date: '2026-03-15 10:20',
    isCurrent: false,
  },
  {
    version: 'v1.2',
    summary: '增加对话上下文变量，改善上下文理解',
    author: '张华',
    date: '2026-03-08 16:45',
    isCurrent: false,
  },
  {
    version: 'v1.1',
    summary: '修复格式化问题，统一回复风格',
    author: '李明',
    date: '2026-02-28 09:15',
    isCurrent: false,
  },
  {
    version: 'v1.0',
    summary: '初始版本，基础客服回复模板',
    author: '李明',
    date: '2026-02-10 09:00',
    isCurrent: false,
  },
])

function handleRollback(version: typeof versions.value[0]) {
  toast.info('版本回滚', { description: `已回滚至 ${version.version}` })
}

function handleCompare(version: typeof versions.value[0]) {
  toast.info('版本对比', { description: `对比当前版本与 ${version.version}` })
}

// ==================== Tab 3：A/B 测试 ====================

const abConfig = {
  versionA: { label: 'v1.1', description: '修复格式化问题版本' },
  versionB: { label: 'v2.1', description: '优化回复语气版本（当前）' },
  trafficSplit: '50 / 50',
  metrics: ['回复质量', '响应延迟', '用户满意度', 'Token 成本'],
  startDate: '2026-03-18',
  status: '进行中',
  totalSamples: 1240,
}

const abResults = ref([
  {
    metric: '回复质量评分',
    valueA: '7.2 / 10',
    valueB: '8.6 / 10',
    winner: 'B',
  },
  {
    metric: '平均响应延迟',
    valueA: '1.8s',
    valueB: '2.1s',
    winner: 'A',
  },
  {
    metric: '用户满意度',
    valueA: '72%',
    valueB: '89%',
    winner: 'B',
  },
  {
    metric: '平均 Token 成本',
    valueA: '$0.012',
    valueB: '$0.018',
    winner: 'A',
  },
])

// ==================== 事件处理 ====================

function handlePublish() {
  toast.success('发布成功', { description: `${promptData.name} ${promptData.version}` })
}
</script>

<template>
  <div>
    <!-- 骨架屏 -->
    <div v-if="loading" class="flex flex-col gap-8">
      <div class="flex items-center gap-3">
        <Skeleton class="size-9 rounded-xl" />
        <div class="space-y-2">
          <Skeleton class="h-7 w-48" />
          <Skeleton class="h-4 w-80" />
        </div>
      </div>
      <Skeleton class="h-[500px] rounded-xl" />
    </div>

    <div v-else class="flex flex-col gap-8">
      <!-- 顶部区域：返回 + 名称 + 版本 + 状态 + 操作 -->
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
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-2xl font-bold tracking-tight text-foreground">
                {{ promptData.name }}
              </h2>
              <Badge variant="outline" class="font-mono text-[11px]">
                {{ promptData.version }}
              </Badge>
              <Badge
                :variant="statusConfig[promptData.status].badgeVariant"
                class="gap-1.5 text-[11px]"
              >
                <span :class="cn('size-1.5 rounded-full', statusConfig[promptData.status].dotClass)" />
                {{ statusConfig[promptData.status].label }}
              </Badge>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">
              关联模型：{{ promptData.model }} · 创建者：{{ promptData.creator }} · 最后编辑：{{ promptData.updatedAt }}
            </p>
          </div>
        </div>
        <Button size="sm" class="shrink-0" @click="handlePublish">
          <Send class="mr-2 size-4" />
          发布
        </Button>
      </div>

      <!-- Tab 区域 -->
      <Tabs default-value="editor">
        <TabsList class="rounded-xl p-1">
          <TabsTrigger value="editor" class="gap-1.5 rounded-lg">
            <Pencil class="size-3.5" />
            编辑器
          </TabsTrigger>
          <TabsTrigger value="versions" class="gap-1.5 rounded-lg">
            <History class="size-3.5" />
            版本历史
          </TabsTrigger>
          <TabsTrigger value="ab-test" class="gap-1.5 rounded-lg">
            <FlaskConical class="size-3.5" />
            A/B 测试
          </TabsTrigger>
        </TabsList>

        <!-- ==================== Tab 1: 编辑器 ==================== -->
        <TabsContent value="editor">
          <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
            <!-- 左侧：Prompt 编辑 -->
            <div class="space-y-6">
              <!-- 系统提示词编辑 -->
              <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
                <CardHeader class="pb-4">
                  <CardTitle class="text-[15px] font-semibold">系统提示词</CardTitle>
                  <CardDescription>编辑 Prompt 模板内容，使用双花括号插入动态变量</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    v-model="systemPrompt"
                    :rows="12"
                    class="font-mono text-sm leading-relaxed resize-none"
                    placeholder="输入系统提示词..."
                  />
                </CardContent>
              </Card>

              <!-- 变量列表 -->
              <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
                <CardHeader class="pb-4">
                  <CardTitle class="text-[15px] font-semibold">变量定义</CardTitle>
                  <CardDescription>在提示词中使用的动态变量</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow class="border-border/50">
                        <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">变量名</TableHead>
                        <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">描述</TableHead>
                        <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">示例值</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow
                        v-for="v in variables"
                        :key="v.name"
                        class="border-border/50"
                      >
                        <TableCell class="py-3 font-mono text-sm text-primary">
                          {{ v.name }}
                        </TableCell>
                        <TableCell class="py-3 text-muted-foreground">
                          {{ v.description }}
                        </TableCell>
                        <TableCell class="py-3 text-muted-foreground">
                          {{ v.example }}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <!-- 右侧：测试面板 -->
            <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs self-start">
              <CardHeader class="pb-4">
                <CardTitle class="text-[15px] font-semibold">测试面板</CardTitle>
                <CardDescription>输入测试数据验证 Prompt 效果</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <!-- 测试输入 -->
                <div class="space-y-2">
                  <Label class="text-xs font-medium">用户输入</Label>
                  <Textarea
                    v-model="testInput"
                    :rows="4"
                    class="text-sm resize-none"
                    placeholder="输入测试文本，例如：我想了解退款流程"
                  />
                </div>

                <Button
                  class="w-full"
                  size="sm"
                  :disabled="testLoading || !testInput.trim()"
                  @click="handleRunTest"
                >
                  <Loader2 v-if="testLoading" class="mr-2 size-4 animate-spin" />
                  <Play v-else class="mr-2 size-4" />
                  {{ testLoading ? '生成中...' : '运行测试' }}
                </Button>

                <Separator />

                <!-- 测试输出 -->
                <div class="space-y-2">
                  <Label class="text-xs font-medium">输出结果</Label>
                  <div
                    v-if="testOutput"
                    class="rounded-xl border border-border/40 bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap"
                  >
                    {{ testOutput }}
                  </div>
                  <div
                    v-else
                    class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/40 py-12"
                  >
                    <Sparkles class="size-8 text-muted-foreground/30" />
                    <p class="text-xs text-muted-foreground">运行测试查看输出结果</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- ==================== Tab 2: 版本历史 ==================== -->
        <TabsContent value="versions">
          <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
            <CardHeader class="pb-4">
              <CardTitle class="text-[15px] font-semibold">版本历史</CardTitle>
              <CardDescription>查看和管理 Prompt 的历史版本</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="relative space-y-0">
                <div
                  v-for="(ver, idx) in versions"
                  :key="ver.version"
                  class="relative flex gap-6 pb-8 last:pb-0"
                >
                  <!-- 时间线竖线 -->
                  <div class="flex flex-col items-center">
                    <!-- 圆点 -->
                    <div
                      :class="cn(
                        'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2',
                        ver.isCurrent
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-muted-foreground',
                      )"
                    >
                      <Check v-if="ver.isCurrent" class="size-3.5" />
                      <Clock v-else class="size-3.5" />
                    </div>
                    <!-- 竖线 -->
                    <div
                      v-if="idx < versions.length - 1"
                      class="w-px flex-1 bg-border/60"
                    />
                  </div>

                  <!-- 版本内容 -->
                  <div class="flex-1 pb-2">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="font-mono text-sm font-semibold">{{ ver.version }}</span>
                        <Badge v-if="ver.isCurrent" variant="secondary" class="text-[10px]">
                          当前版本
                        </Badge>
                      </div>
                      <div v-if="!ver.isCurrent" class="flex items-center gap-2">
                        <Button variant="ghost" size="sm" class="h-7 text-xs" @click="handleCompare(ver)">
                          对比
                        </Button>
                        <Button variant="ghost" size="sm" class="h-7 text-xs" @click="handleRollback(ver)">
                          <RotateCcw class="mr-1 size-3" />
                          回滚
                        </Button>
                      </div>
                    </div>
                    <p class="mt-1 text-sm text-muted-foreground">{{ ver.summary }}</p>
                    <div class="mt-2 flex items-center gap-3 text-xs text-muted-foreground/70">
                      <span class="flex items-center gap-1">
                        <User class="size-3" />
                        {{ ver.author }}
                      </span>
                      <span class="flex items-center gap-1">
                        <Clock class="size-3" />
                        {{ ver.date }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- ==================== Tab 3: A/B 测试 ==================== -->
        <TabsContent value="ab-test">
          <div class="space-y-6">
            <!-- 测试配置 -->
            <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
              <CardHeader class="pb-4">
                <CardTitle class="text-[15px] font-semibold">A/B 测试配置</CardTitle>
                <CardDescription>对比不同版本 Prompt 的效果</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <!-- 版本 A -->
                  <div class="space-y-2 rounded-xl border border-border/40 bg-muted/20 p-4">
                    <div class="flex items-center gap-2">
                      <div class="flex size-6 items-center justify-center rounded-full bg-chart-1/15 text-xs font-bold text-chart-1">A</div>
                      <span class="text-sm font-medium">版本 A</span>
                    </div>
                    <p class="font-mono text-lg font-bold">{{ abConfig.versionA.label }}</p>
                    <p class="text-xs text-muted-foreground">{{ abConfig.versionA.description }}</p>
                  </div>

                  <!-- 版本 B -->
                  <div class="space-y-2 rounded-xl border border-border/40 bg-muted/20 p-4">
                    <div class="flex items-center gap-2">
                      <div class="flex size-6 items-center justify-center rounded-full bg-chart-4/15 text-xs font-bold text-chart-4">B</div>
                      <span class="text-sm font-medium">版本 B</span>
                    </div>
                    <p class="font-mono text-lg font-bold">{{ abConfig.versionB.label }}</p>
                    <p class="text-xs text-muted-foreground">{{ abConfig.versionB.description }}</p>
                  </div>

                  <!-- 流量分配 -->
                  <div class="space-y-2 rounded-xl border border-border/40 bg-muted/20 p-4">
                    <span class="text-xs font-medium text-muted-foreground">流量分配</span>
                    <p class="font-mono text-lg font-bold">{{ abConfig.trafficSplit }}</p>
                    <p class="text-xs text-muted-foreground">已采样 {{ abConfig.totalSamples.toLocaleString() }} 次</p>
                  </div>

                  <!-- 测试状态 -->
                  <div class="space-y-2 rounded-xl border border-border/40 bg-muted/20 p-4">
                    <span class="text-xs font-medium text-muted-foreground">测试状态</span>
                    <div class="flex items-center gap-2">
                      <span class="size-2 rounded-full bg-warning animate-pulse" />
                      <p class="font-medium">{{ abConfig.status }}</p>
                    </div>
                    <p class="text-xs text-muted-foreground">开始于 {{ abConfig.startDate }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- 测试结果 -->
            <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
              <CardHeader class="pb-4">
                <CardTitle class="text-[15px] font-semibold">测试结果</CardTitle>
                <CardDescription>各项指标的对比数据</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow class="border-border/50">
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">评估指标</TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <span class="flex items-center gap-1.5">
                          <span class="flex size-4 items-center justify-center rounded-full bg-chart-1/15 text-[10px] font-bold text-chart-1">A</span>
                          版本 A ({{ abConfig.versionA.label }})
                        </span>
                      </TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <span class="flex items-center gap-1.5">
                          <span class="flex size-4 items-center justify-center rounded-full bg-chart-4/15 text-[10px] font-bold text-chart-4">B</span>
                          版本 B ({{ abConfig.versionB.label }})
                        </span>
                      </TableHead>
                      <TableHead class="text-xs font-medium uppercase tracking-wider text-muted-foreground">胜出方</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow
                      v-for="result in abResults"
                      :key="result.metric"
                      class="border-border/50"
                    >
                      <TableCell class="py-3.5 font-medium">
                        {{ result.metric }}
                      </TableCell>
                      <TableCell
                        :class="cn(
                          'py-3.5 tabular-nums',
                          result.winner === 'A' ? 'text-chart-1 font-semibold' : 'text-muted-foreground',
                        )"
                      >
                        {{ result.valueA }}
                      </TableCell>
                      <TableCell
                        :class="cn(
                          'py-3.5 tabular-nums',
                          result.winner === 'B' ? 'text-chart-4 font-semibold' : 'text-muted-foreground',
                        )"
                      >
                        {{ result.valueB }}
                      </TableCell>
                      <TableCell class="py-3.5">
                        <Badge
                          :class="cn(
                            'text-[10px] font-bold',
                            result.winner === 'A'
                              ? 'bg-chart-1/10 text-chart-1 border-chart-1/20'
                              : 'bg-chart-4/10 text-chart-4 border-chart-4/20',
                          )"
                          variant="outline"
                        >
                          版本 {{ result.winner }}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
