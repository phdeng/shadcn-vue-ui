<script setup lang="ts">
/**
 * @description 知识库详情页 — 展示知识库信息与文档列表
 * @author Timon
 */
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft,
  Upload,
  FileText,
  Database,
  Layers,
  Clock,
  MoreHorizontal,
} from 'lucide-vue-next'
import { Button } from '@ui/components/ui/button'
import { Badge } from '@ui/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { cn } from '@ui/lib/utils'

const router = useRouter()
const route = useRoute()

// 知识库模拟数据 — 后续替换为 API 请求
const knowledgeBase = {
  id: route.params.id as string,
  name: '产品文档',
  description: '产品使用手册、API 文档、FAQ、集成指南等核心产品资料，用于 RAG 检索增强生成。',
  status: 'ready' as const,
  docCount: 156,
  totalSize: '24.3 MB',
  vectorDimension: 1536,
  lastIndexedAt: '2026-03-21 10:35',
}

// 知识库状态配置
const kbStatusConfig = {
  ready: { label: '已就绪', dotClass: 'bg-emerald-500', badgeVariant: 'secondary' as const },
  indexing: { label: '索引中', dotClass: 'bg-amber-500 animate-pulse', badgeVariant: 'secondary' as const },
  error: { label: '异常', dotClass: 'bg-destructive', badgeVariant: 'destructive' as const },
}

// 统计指标
const stats = [
  { label: '文档数', value: `${knowledgeBase.docCount} 篇`, icon: FileText },
  { label: '总大小', value: knowledgeBase.totalSize, icon: Database },
  { label: '向量维度', value: `${knowledgeBase.vectorDimension}`, icon: Layers },
  { label: '最后索引时间', value: knowledgeBase.lastIndexedAt, icon: Clock },
]

// 文档状态配置
const docStatusConfig = {
  indexed: { label: '已索引', dotClass: 'bg-emerald-500', badgeVariant: 'secondary' as const },
  indexing: { label: '索引中', dotClass: 'bg-amber-500 animate-pulse', badgeVariant: 'secondary' as const },
  pending: { label: '待索引', dotClass: 'bg-muted-foreground', badgeVariant: 'outline' as const },
}

// 文档列表模拟数据
const documents = [
  { id: '1', name: 'API 接口文档 v3.2.pdf', size: '4.8 MB', segments: 342, status: 'indexed' as const, uploadedAt: '2026-03-20 14:30' },
  { id: '2', name: '产品使用手册.docx', size: '2.1 MB', segments: 186, status: 'indexed' as const, uploadedAt: '2026-03-19 09:15' },
  { id: '3', name: 'FAQ 常见问题集.md', size: '856 KB', segments: 124, status: 'indexed' as const, uploadedAt: '2026-03-18 16:42' },
  { id: '4', name: '集成指南 - 企业版.pdf', size: '6.3 MB', segments: 478, status: 'indexing' as const, uploadedAt: '2026-03-21 08:20' },
  { id: '5', name: '数据安全白皮书.pdf', size: '3.2 MB', segments: 215, status: 'indexed' as const, uploadedAt: '2026-03-17 11:05' },
  { id: '6', name: '变更日志 2026Q1.md', size: '128 KB', segments: 56, status: 'pending' as const, uploadedAt: '2026-03-21 09:50' },
  { id: '7', name: 'SDK 快速入门.md', size: '420 KB', segments: 89, status: 'indexed' as const, uploadedAt: '2026-03-15 13:28' },
  { id: '8', name: '权限与角色说明.pdf', size: '1.7 MB', segments: 143, status: 'pending' as const, uploadedAt: '2026-03-21 10:12' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 顶部区域：返回按钮 + 知识库名称 + 状态 + 操作按钮 -->
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
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">
              {{ knowledgeBase.name }}
            </h2>
            <Badge
              :variant="kbStatusConfig[knowledgeBase.status].badgeVariant"
              class="gap-1.5 text-[11px]"
            >
              <span :class="cn('size-1.5 rounded-full', kbStatusConfig[knowledgeBase.status].dotClass)" />
              {{ kbStatusConfig[knowledgeBase.status].label }}
            </Badge>
          </div>
          <p class="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            {{ knowledgeBase.description }}
          </p>
        </div>
      </div>
      <Button size="sm" class="shrink-0">
        <Upload class="mr-2 size-4" />
        上传文档
      </Button>
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

    <!-- 文档列表 -->
    <Card class="border-0 shadow-sm">
      <CardHeader>
        <CardTitle class="text-base">文档列表</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>文档名称</TableHead>
              <TableHead>大小</TableHead>
              <TableHead>段落数</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>上传时间</TableHead>
              <TableHead class="w-[60px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="doc in documents" :key="doc.id">
              <TableCell>
                <div class="flex items-center gap-2">
                  <FileText class="size-4 shrink-0 text-muted-foreground" />
                  <span class="font-medium">{{ doc.name }}</span>
                </div>
              </TableCell>
              <TableCell class="tabular-nums text-muted-foreground">{{ doc.size }}</TableCell>
              <TableCell class="tabular-nums text-muted-foreground">{{ doc.segments }}</TableCell>
              <TableCell>
                <Badge
                  :variant="docStatusConfig[doc.status].badgeVariant"
                  class="gap-1.5 text-[11px]"
                >
                  <span :class="cn('size-1.5 rounded-full', docStatusConfig[doc.status].dotClass)" />
                  {{ docStatusConfig[doc.status].label }}
                </Badge>
              </TableCell>
              <TableCell class="text-muted-foreground">{{ doc.uploadedAt }}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="size-7">
                      <MoreHorizontal class="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>查看详情</DropdownMenuItem>
                    <DropdownMenuItem>重新索引</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="text-destructive">删除</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
