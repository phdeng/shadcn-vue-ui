<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
} from '@ui/components/ui/card'
import { Skeleton } from '@ui/components/ui/skeleton'
import { cn } from '@ui/lib/utils'
import {
  ArrowLeft,
  Braces,
  CircleDot,
  GitBranch,
  Globe,
  Pencil,
  Plus,
  Send,
  Sparkles,
  Zap,
} from 'lucide-vue-next'
/**
 * @description 工作流详情/编辑页 — 竖向节点链式编排 MVP
 * @author Timon
 */
import { ref } from 'vue'
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

// ==================== 节点数据 ====================

interface WorkflowNode {
  id: string
  type: 'trigger' | 'model' | 'condition' | 'output'
  name: string
  description: string
  config: string
  icon: typeof Zap
  iconBg: string
}

const nodes = ref<WorkflowNode[]>([
  {
    id: 'n1',
    type: 'trigger',
    name: '触发器',
    description: 'API 调用触发',
    config: 'POST /api/workflow/run',
    icon: Zap,
    iconBg: 'bg-amber-500/10 text-amber-500',
  },
  {
    id: 'n2',
    type: 'model',
    name: '模型调用',
    description: 'GPT-4o',
    config: '提示词："根据用户输入生成回答"',
    icon: Sparkles,
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    id: 'n3',
    type: 'condition',
    name: '条件分支',
    description: '置信度判断',
    config: '> 0.8 → 直接输出，否则 → 人工审核',
    icon: GitBranch,
    iconBg: 'bg-violet-500/10 text-violet-500',
  },
  {
    id: 'n4',
    type: 'output',
    name: '输出',
    description: 'JSON 返回',
    config: '结构化 JSON 响应体',
    icon: Braces,
    iconBg: 'bg-success/10 text-success',
  },
])

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

function handleEditNode(node: WorkflowNode) {
  toast.info('节点编辑', { description: `编辑「${node.name}」— 功能开发中` })
}

function handleAddNode() {
  toast.info('添加节点', { description: '功能开发中' })
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
      <div class="max-w-2xl mx-auto w-full space-y-4">
        <Skeleton v-for="i in 4" :key="i" class="h-24 rounded-xl" />
      </div>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- 头部 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Button variant="ghost" size="icon" class="shrink-0" @click="handleBack">
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

      <!-- 节点链 -->
      <div class="mx-auto w-full max-w-2xl">
        <div class="relative">
          <!-- 竖向连接线 -->
          <div class="absolute left-[27px] top-0 bottom-0 w-px border-l-2 border-dashed border-border/60" />

          <!-- 节点列表 -->
          <div class="space-y-0">
            <div v-for="(node, index) in nodes" :key="node.id" class="relative flex gap-4">
              <!-- 左侧圆点标记 -->
              <div class="relative z-10 flex flex-col items-center">
                <div
                  :class="cn(
                    'flex size-[22px] items-center justify-center rounded-full border-2 border-background bg-background',
                    index === 0 ? 'mt-5' : 'mt-5',
                  )"
                >
                  <CircleDot class="size-3.5 text-primary" />
                </div>
              </div>

              <!-- 节点卡片 -->
              <Card
                class="mb-4 flex-1 border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs transition-all hover:border-border/60 hover:shadow-md hover:shadow-black/5"
              >
                <CardContent class="flex items-center gap-4 p-5">
                  <!-- 节点图标 -->
                  <div :class="cn('flex size-10 shrink-0 items-center justify-center rounded-xl', node.iconBg)">
                    <component :is="node.icon" class="size-5" />
                  </div>
                  <!-- 节点信息 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium">{{ node.name }}</span>
                      <span class="text-xs text-muted-foreground">{{ node.description }}</span>
                    </div>
                    <p class="mt-1 text-xs text-muted-foreground/80 font-mono truncate">
                      {{ node.config }}
                    </p>
                  </div>
                  <!-- 编辑按钮 -->
                  <Button
                    variant="ghost"
                    size="icon"
                    class="size-8 shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                    @click.stop="handleEditNode(node)"
                  >
                    <Pencil class="size-3.5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <!-- 添加节点按钮 -->
          <div class="relative flex gap-4">
            <div class="relative z-10 flex flex-col items-center">
              <div class="flex size-[22px] items-center justify-center rounded-full border-2 border-dashed border-border/60 bg-background mt-2.5">
                <Plus class="size-3 text-muted-foreground" />
              </div>
            </div>
            <Button
              variant="outline"
              class="mb-4 flex-1 h-12 rounded-2xl border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
              @click="handleAddNode"
            >
              <Plus class="mr-2 size-4" />
              添加节点
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
