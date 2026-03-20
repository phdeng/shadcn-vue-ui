<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Input } from '@ui/components/ui/input'
import { Separator } from '@ui/components/ui/separator'
import { cn } from '@ui/lib/utils'
import {
  Clock,
  Database,
  File,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
} from 'lucide-vue-next'
/**
 * @description 知识库管理页 — 产品控制台风格
 * @author Timon
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const knowledgeBases = ref([
  { id: '1', name: '产品文档', description: '产品使用手册、API 文档、FAQ 等', docCount: 156, size: '24.3 MB', status: 'ready' as const, updatedAt: '2 小时前', icon: '📄' },
  { id: '2', name: '技术规范', description: '系统架构文档、开发规范、接口协议', docCount: 89, size: '15.7 MB', status: 'ready' as const, updatedAt: '1 天前', icon: '🔧' },
  { id: '3', name: '客服话术库', description: '标准回复模板、场景话术、投诉处理流程', docCount: 342, size: '8.1 MB', status: 'indexing' as const, updatedAt: '10 分钟前', icon: '💬' },
  { id: '4', name: '行业报告', description: '市场分析、竞品调研、行业白皮书', docCount: 45, size: '67.2 MB', status: 'ready' as const, updatedAt: '3 天前', icon: '📊' },
  { id: '5', name: '法律法规', description: '合规文件、政策法规、审计要求', docCount: 78, size: '12.4 MB', status: 'error' as const, updatedAt: '5 天前', icon: '⚖️' },
])

const statusConfig = {
  ready: { label: '已就绪', dotClass: 'bg-emerald-500', badgeVariant: 'secondary' as const },
  indexing: { label: '索引中', dotClass: 'bg-amber-500 animate-pulse', badgeVariant: 'secondary' as const },
  error: { label: '异常', dotClass: 'bg-destructive', badgeVariant: 'destructive' as const },
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          知识库
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          管理文档、数据集与向量索引
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Upload class="mr-2 size-4" />
          批量导入
        </Button>
        <Button size="sm">
          <Plus class="mr-2 size-4" />
          创建知识库
        </Button>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="relative w-80">
        <Search class="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input v-model="searchQuery" placeholder="搜索知识库..." class="pl-8 h-9" />
      </div>
      <Separator orientation="vertical" class="!h-5" />
      <span class="text-sm text-muted-foreground">共 {{ knowledgeBases.length }} 个知识库</span>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="kb in knowledgeBases"
        :key="kb.id"
        class="group cursor-pointer border-0 shadow-sm transition-all hover:shadow-md"
        @click="router.push(`/knowledge/${kb.id}`)"
      >
        <CardHeader class="pb-2">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-lg">
                {{ kb.icon }}
              </div>
              <div>
                <CardTitle class="text-base leading-none">
                  {{ kb.name }}
                </CardTitle>
                <p class="mt-1.5 text-xs text-muted-foreground line-clamp-1">
                  {{ kb.description }}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="size-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
                  <MoreHorizontal class="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>查看文档</DropdownMenuItem>
                <DropdownMenuItem>上传文档</DropdownMenuItem>
                <DropdownMenuItem>重建索引</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="text-destructive">
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent class="pb-3">
          <div class="flex items-center gap-4 text-xs text-muted-foreground">
            <span class="flex items-center gap-1">
              <File class="size-3" />
              {{ kb.docCount }} 篇文档
            </span>
            <span class="flex items-center gap-1">
              <Database class="size-3" />
              {{ kb.size }}
            </span>
          </div>
        </CardContent>

        <CardFooter class="flex-col items-stretch gap-3 pt-0">
          <Separator />
          <div class="flex items-center justify-between">
            <Badge :variant="statusConfig[kb.status].badgeVariant" class="gap-1.5 text-[11px]">
              <span :class="cn('size-1.5 rounded-full', statusConfig[kb.status].dotClass)" />
              {{ statusConfig[kb.status].label }}
            </Badge>
            <span class="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock class="size-3" />
              {{ kb.updatedAt }}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
