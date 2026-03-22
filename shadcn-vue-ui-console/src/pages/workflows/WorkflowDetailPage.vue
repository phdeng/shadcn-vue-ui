<script setup lang="ts">
/**
 * @description 工作流详情/编辑页 — 可视化画布式编排
 * @author Timon
 */
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
} from '@ui/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Input } from '@ui/components/ui/input'
import { Separator } from '@ui/components/ui/separator'
import { Skeleton } from '@ui/components/ui/skeleton'
import { cn } from '@ui/lib/utils'
import {
  ArrowLeft,
  Braces,
  GitBranch,
  Maximize,
  MoreHorizontal,
  Plus,
  Send,
  Sparkles,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
setTimeout(() => { loading.value = false }, 500)

// ==================== 工作流数据 ====================

const workflow = ref({
  id: route.params.id as string,
  name: '智能客服问答流',
  status: 'published' as 'draft' | 'published' | 'disabled',
  trigger: 'api' as const,
  updatedAt: '10 分钟前',
})

const statusConfig: Record<string, { label: string, dotClass: string, badgeClass: string }> = {
  published: { label: '已发布', dotClass: 'bg-success', badgeClass: 'bg-success/10 text-success' },
  draft: { label: '草稿', dotClass: 'bg-muted-foreground', badgeClass: 'bg-muted text-muted-foreground' },
  disabled: { label: '已停用', dotClass: 'bg-destructive', badgeClass: 'bg-destructive/10 text-destructive' },
}

// ==================== 节点类型配置 ====================

const nodeTypeConfig: Record<string, { label: string, icon: typeof Zap, borderColor: string }> = {
  trigger: { label: '触发器', icon: Zap, borderColor: 'border-l-primary' },
  model: { label: '模型调用', icon: Sparkles, borderColor: 'border-l-chart-1' },
  condition: { label: '条件分支', icon: GitBranch, borderColor: 'border-l-chart-5' },
  output: { label: '输出', icon: Braces, borderColor: 'border-l-success' },
}

// ==================== 节点数据 ====================

interface WorkflowNode {
  id: string
  type: 'trigger' | 'model' | 'condition' | 'output'
  name: string
  config: string
  x: number
  y: number
}

interface WorkflowEdge {
  from: string
  to: string
}

const nodes = ref<WorkflowNode[]>([
  { id: 'n1', type: 'trigger', name: 'API 触发器', config: 'POST /api/workflow/run', x: 80, y: 80 },
  { id: 'n2', type: 'model', name: '模型调用', config: 'GPT-4o · Temperature 0.7', x: 380, y: 60 },
  { id: 'n3', type: 'condition', name: '条件分支', config: '置信度 > 0.8', x: 680, y: 40 },
  { id: 'n4', type: 'output', name: 'JSON 输出', config: '返回结构化结果', x: 680, y: 250 },
])

const edges = ref<WorkflowEdge[]>([
  { from: 'n1', to: 'n2' },
  { from: 'n2', to: 'n3' },
  { from: 'n3', to: 'n4' },
])

// ==================== 画布状态 ====================

const zoom = ref(1)
const selectedNodeId = ref<string | null>(null)

const selectedNode = computed(() =>
  nodes.value.find(n => n.id === selectedNodeId.value) ?? null,
)

// 节点尺寸常量（用于连线计算）
const NODE_W = 220
const NODE_H = 90

// ==================== 连线路径计算 ====================

function getEdgePath(edge: WorkflowEdge): string {
  const from = nodes.value.find(n => n.id === edge.from)
  const to = nodes.value.find(n => n.id === edge.to)
  if (!from || !to) return ''

  // 起点：源节点右侧中点
  const x1 = from.x + NODE_W
  const y1 = from.y + NODE_H / 2
  // 终点：目标节点左侧中点
  const x2 = to.x
  const y2 = to.y + NODE_H / 2

  // 贝塞尔曲线控制点
  const dx = Math.abs(x2 - x1) * 0.5
  return `M ${x1},${y1} C ${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`
}

// ==================== 事件处理 ====================

function handleBack() {
  router.push('/workflows')
}

function handlePublish() {
  if (workflow.value.status === 'published') {
    workflow.value.status = 'draft'
    toast.info('已取消发布')
  } else {
    workflow.value.status = 'published'
    toast.success('工作流已发布')
  }
}

function handleZoomIn() {
  zoom.value = Math.min(zoom.value + 0.1, 2)
}

function handleZoomOut() {
  zoom.value = Math.max(zoom.value - 0.1, 0.5)
}

function handleFitCanvas() {
  zoom.value = 1
}

function handleSelectNode(nodeId: string) {
  selectedNodeId.value = selectedNodeId.value === nodeId ? null : nodeId
}

function handleClosePanel() {
  selectedNodeId.value = null
}

function handleAddNode(type: WorkflowNode['type']) {
  const id = `n${Date.now()}`
  const config = nodeTypeConfig[type]
  nodes.value.push({
    id,
    type,
    name: config.label,
    config: '',
    x: 200 + Math.random() * 300,
    y: 100 + Math.random() * 200,
  })
  selectedNodeId.value = id
  toast.success(`已添加「${config.label}」节点`)
}

function handleDeleteNode(nodeId: string) {
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  edges.value = edges.value.filter(e => e.from !== nodeId && e.to !== nodeId)
  if (selectedNodeId.value === nodeId) {
    selectedNodeId.value = null
  }
  toast.info('节点已删除')
}
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
      <Skeleton class="h-[600px] rounded-2xl" />
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- 头部 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Button variant="ghost" size="icon" class="shrink-0" aria-label="返回" @click="handleBack">
            <ArrowLeft class="size-4" />
          </Button>
          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-2xl font-semibold tracking-tight">{{ workflow.name }}</h2>
              <Badge
                variant="secondary"
                :class="cn('gap-1.5 border-0 text-[11px] font-medium', statusConfig[workflow.status].badgeClass)"
              >
                <span :class="cn('size-1.5 rounded-full', statusConfig[workflow.status].dotClass)" />
                {{ statusConfig[workflow.status].label }}
              </Badge>
            </div>
            <p class="mt-0.5 text-sm text-muted-foreground">
              最后编辑：{{ workflow.updatedAt }}
            </p>
          </div>
        </div>
        <Button size="sm" @click="handlePublish">
          <Send class="mr-2 size-4" />
          {{ workflow.status === 'published' ? '取消发布' : '发布' }}
        </Button>
      </div>

      <!-- 工具栏 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <Button variant="outline" size="icon" class="size-8" aria-label="缩小" @click="handleZoomOut">
            <ZoomOut class="size-3.5" />
          </Button>
          <span class="w-12 text-center text-xs text-muted-foreground tabular-nums">
            {{ Math.round(zoom * 100) }}%
          </span>
          <Button variant="outline" size="icon" class="size-8" aria-label="放大" @click="handleZoomIn">
            <ZoomIn class="size-3.5" />
          </Button>
          <Button variant="outline" size="icon" class="size-8 ml-1" aria-label="适应画布" @click="handleFitCanvas">
            <Maximize class="size-3.5" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm">
              <Plus class="mr-2 size-4" />
              添加节点
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuItem @click="handleAddNode('trigger')">
              <Zap class="mr-2 size-4 text-primary" />
              触发器
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleAddNode('model')">
              <Sparkles class="mr-2 size-4 text-chart-1" />
              模型调用
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleAddNode('condition')">
              <GitBranch class="mr-2 size-4 text-chart-5" />
              条件分支
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleAddNode('output')">
              <Braces class="mr-2 size-4 text-success" />
              输出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- 画布 + 属性面板 -->
      <div class="grid lg:grid-cols-[1fr_300px] gap-4">
        <!-- 画布区域 -->
        <div
          class="relative min-h-[600px] rounded-2xl border border-border/40 bg-muted/10 overflow-auto"
          style="background-image: radial-gradient(circle, oklch(var(--border)) 1px, transparent 1px); background-size: 20px 20px;"
        >
          <!-- 缩放容器 -->
          <div
            class="relative origin-top-left transition-transform duration-200"
            :style="{ transform: `scale(${zoom})`, minWidth: '1000px', minHeight: '500px' }"
          >
            <!-- SVG 连接线层 -->
            <svg class="absolute inset-0 w-full h-full pointer-events-none">
              <path
                v-for="edge in edges"
                :key="`${edge.from}-${edge.to}`"
                :d="getEdgePath(edge)"
                stroke="oklch(var(--border))"
                stroke-width="2"
                fill="none"
                stroke-dasharray="6,4"
              />
            </svg>

            <!-- 节点层 -->
            <div
              v-for="node in nodes"
              :key="node.id"
              :class="cn(
                'absolute w-[220px] rounded-xl border border-border/50 bg-card shadow-sm cursor-pointer transition-all border-l-[3px]',
                nodeTypeConfig[node.type].borderColor,
                selectedNodeId === node.id
                  ? 'border-primary shadow-md ring-2 ring-primary/20 border-l-primary'
                  : 'hover:shadow-md',
              )"
              :style="{ left: `${node.x}px`, top: `${node.y}px` }"
              @click="handleSelectNode(node.id)"
            >
              <!-- 节点头部 -->
              <div class="flex items-center justify-between px-3 pt-3 pb-1">
                <div class="flex items-center gap-2">
                  <component
                    :is="nodeTypeConfig[node.type].icon"
                    class="size-3.5 text-muted-foreground"
                  />
                  <span class="text-sm font-medium truncate">{{ node.name }}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button
                      class="flex size-6 items-center justify-center rounded-md opacity-0 hover:bg-muted transition-opacity group-hover:opacity-100"
                      :class="{ 'opacity-100': selectedNodeId === node.id }"
                      aria-label="更多操作"
                      @click.stop
                    >
                      <MoreHorizontal class="size-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-36">
                    <DropdownMenuItem class="text-destructive" @click.stop="handleDeleteNode(node.id)">
                      删除节点
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <!-- 节点配置摘要 -->
              <div class="px-3 pb-2">
                <p class="text-xs text-muted-foreground/80 font-mono truncate">
                  {{ node.config || '未配置' }}
                </p>
              </div>
              <!-- 输出端口 -->
              <div class="flex items-center gap-1.5 px-3 pb-2.5">
                <span class="size-2 rounded-full bg-border" />
                <span class="text-[10px] text-muted-foreground/60">output</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧属性面板 -->
        <div
          class="hidden lg:block rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm shadow-xs"
        >
          <!-- 有选中节点 -->
          <template v-if="selectedNode">
            <div class="flex items-center justify-between p-4">
              <h3 class="text-sm font-semibold">节点属性</h3>
              <Button variant="ghost" size="icon" class="size-7" aria-label="关闭面板" @click="handleClosePanel">
                <X class="size-3.5" />
              </Button>
            </div>
            <Separator />
            <div class="p-4 space-y-4">
              <!-- 节点名称 -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-muted-foreground">名称</label>
                <Input v-model="selectedNode.name" class="h-8 text-sm" />
              </div>
              <!-- 节点类型 -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-muted-foreground">类型</label>
                <div class="flex items-center gap-2 h-8 px-3 rounded-md bg-muted/50 text-sm text-muted-foreground">
                  <component :is="nodeTypeConfig[selectedNode.type].icon" class="size-3.5" />
                  {{ nodeTypeConfig[selectedNode.type].label }}
                </div>
              </div>
              <!-- 节点配置 -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-muted-foreground">配置</label>
                <Input v-model="selectedNode.config" class="h-8 text-sm font-mono" />
              </div>
              <!-- 位置 -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-muted-foreground">位置</label>
                <div class="grid grid-cols-2 gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[10px] text-muted-foreground/60 w-3">X</span>
                    <Input v-model.number="selectedNode.x" type="number" class="h-8 text-sm font-mono" />
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-[10px] text-muted-foreground/60 w-3">Y</span>
                    <Input v-model.number="selectedNode.y" type="number" class="h-8 text-sm font-mono" />
                  </div>
                </div>
              </div>
              <Separator />
              <!-- 删除按钮 -->
              <Button
                variant="outline"
                size="sm"
                class="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                @click="handleDeleteNode(selectedNode.id)"
              >
                删除节点
              </Button>
            </div>
          </template>

          <!-- 无选中节点 -->
          <div v-else class="flex flex-col items-center justify-center h-full min-h-[300px] p-6 text-center">
            <div class="size-10 rounded-xl bg-muted/50 flex items-center justify-center mb-3">
              <Sparkles class="size-5 text-muted-foreground/50" />
            </div>
            <p class="text-sm text-muted-foreground">点击节点查看属性</p>
            <p class="text-xs text-muted-foreground/60 mt-1">选中画布中的节点以编辑配置</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
