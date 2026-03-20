<script setup lang="ts">
/**
 * @description 模型管理列表页
 * @author Timon
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, MoreHorizontal, Circle, Zap, Clock, ExternalLink } from 'lucide-vue-next'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { Badge } from '@ui/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@ui/components/ui/card'
import { Separator } from '@ui/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/components/ui/tooltip'
import { cn } from '@ui/lib/utils'

const router = useRouter()
const searchQuery = ref('')

const models = ref([
  {
    id: '1',
    name: 'GPT-4o',
    provider: 'OpenAI',
    type: '大语言模型',
    status: 'running' as const,
    calls: '12,340',
    latency: '320ms',
    description: '多模态旗舰模型，支持文本、图像和音频',
  },
  {
    id: '2',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    type: '大语言模型',
    status: 'running' as const,
    calls: '8,921',
    latency: '280ms',
    description: '高性能对话模型，擅长分析和代码生成',
  },
  {
    id: '3',
    name: 'Qwen2.5-72B',
    provider: 'Alibaba',
    type: '大语言模型',
    status: 'stopped' as const,
    calls: '3,210',
    latency: '—',
    description: '开源大模型，支持中英双语',
  },
  {
    id: '4',
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    type: '大语言模型',
    status: 'running' as const,
    calls: '5,678',
    latency: '410ms',
    description: 'MoE 架构模型，高效推理',
  },
])

const statusConfig = {
  running: { label: '运行中', dotClass: 'bg-emerald-500', badgeVariant: 'secondary' as const },
  stopped: { label: '已停止', dotClass: 'bg-muted-foreground/50', badgeVariant: 'outline' as const },
  error: { label: '异常', dotClass: 'bg-destructive', badgeVariant: 'destructive' as const },
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">模型管理</h2>
        <p class="text-muted-foreground text-sm">管理已注册的大语言模型及推理服务</p>
      </div>
      <Button size="sm">
        <Plus class="mr-2 size-4" />
        注册模型
      </Button>
    </div>

    <!-- 工具栏 -->
    <div class="flex items-center gap-3">
      <div class="relative w-80">
        <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          v-model="searchQuery"
          placeholder="搜索模型名称或提供商..."
          class="pl-9"
        />
      </div>
      <Separator orientation="vertical" class="!h-6" />
      <span class="text-sm text-muted-foreground">共 {{ models.length }} 个模型</span>
    </div>

    <!-- 模型卡片列表 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="model in models"
        :key="model.id"
        class="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/20"
        @click="router.push(`/models/${model.id}`)"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between">
            <div class="space-y-1.5">
              <CardTitle class="text-base leading-none">{{ model.name }}</CardTitle>
              <CardDescription class="text-xs">{{ model.provider }}</CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  @click.stop
                >
                  <MoreHorizontal class="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>查看详情</DropdownMenuItem>
                <DropdownMenuItem>编辑配置</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="text-destructive">停用模型</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent class="pb-3">
          <p class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {{ model.description }}
          </p>
        </CardContent>

        <CardFooter class="flex-col items-stretch gap-3 pt-0">
          <Separator />
          <div class="flex items-center justify-between">
            <Badge :variant="statusConfig[model.status].badgeVariant" class="gap-1.5 text-xs">
              <span :class="cn('size-1.5 rounded-full', statusConfig[model.status].dotClass)" />
              {{ statusConfig[model.status].label }}
            </Badge>
            <div class="flex items-center gap-3 text-xs text-muted-foreground">
              <Tooltip>
                <TooltipTrigger as-child>
                  <span class="flex items-center gap-1 tabular-nums">
                    <Zap class="size-3" />
                    {{ model.calls }}
                  </span>
                </TooltipTrigger>
                <TooltipContent>调用量</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger as-child>
                  <span class="flex items-center gap-1 tabular-nums">
                    <Clock class="size-3" />
                    {{ model.latency }}
                  </span>
                </TooltipTrigger>
                <TooltipContent>平均延迟</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
