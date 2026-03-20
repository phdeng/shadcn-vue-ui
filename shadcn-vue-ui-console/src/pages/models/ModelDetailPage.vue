<script setup lang="ts">
/**
 * @description 模型详情页 — 查看模型配置与运行状态
 * @author Timon
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Circle, Settings, Activity, Clock, Cpu } from 'lucide-vue-next'
import { PageHeader } from '@shared/components/PageHeader'
import { Button } from '@ui/components/ui/button'
import { Badge } from '@ui/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { Separator } from '@ui/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table'
import { cn } from '@ui/lib/utils'

const route = useRoute()
const router = useRouter()
const modelId = computed(() => route.params.id as string)

// 模拟数据 — 后续替换为 API
const model = {
  id: '1',
  name: 'GPT-4o',
  provider: 'OpenAI',
  type: '大语言模型',
  status: 'running' as const,
  endpoint: 'https://api.openai.com/v1/chat/completions',
  maxTokens: 128000,
  temperature: 0.7,
  createdAt: '2026-01-15',
  updatedAt: '2026-03-18',
}

const metrics = [
  { label: '总调用次数', value: '45,230', icon: Activity },
  { label: '平均延迟', value: '320ms', icon: Clock },
  { label: '成功率', value: '99.7%', icon: Cpu },
  { label: '今日调用', value: '1,204', icon: Activity },
]

const configItems = [
  { label: 'API 端点', value: 'https://api.openai.com/v1/chat/completions' },
  { label: '最大 Token', value: '128,000' },
  { label: 'Temperature', value: '0.7' },
  { label: '提供商', value: 'OpenAI' },
  { label: '创建时间', value: '2026-01-15' },
  { label: '最后更新', value: '2026-03-18' },
]

const recentCalls = [
  { time: '14:23:05', tokens: 2340, latency: '312ms', status: '成功' },
  { time: '14:22:51', tokens: 1850, latency: '287ms', status: '成功' },
  { time: '14:22:30', tokens: 4120, latency: '456ms', status: '成功' },
  { time: '14:21:58', tokens: 980, latency: '198ms', status: '成功' },
  { time: '14:21:12', tokens: 3200, latency: '401ms', status: '失败' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 返回 + 头部 -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" @click="router.back()">
        <ArrowLeft class="size-4" />
      </Button>
      <div class="flex-1">
        <div class="flex items-center gap-3">
          <h2 class="text-2xl font-semibold tracking-tight text-foreground">
            {{ model.name }}
          </h2>
          <Badge variant="secondary">{{ model.type }}</Badge>
          <div class="flex items-center gap-1.5">
            <Circle class="size-2 fill-emerald-500 text-emerald-500" />
            <span class="text-xs text-emerald-500">运行中</span>
          </div>
        </div>
        <p class="mt-1 text-sm text-muted-foreground">
          {{ model.provider }} · 创建于 {{ model.createdAt }}
        </p>
      </div>
      <Button variant="outline">
        <Settings class="mr-2 size-4" />
        编辑配置
      </Button>
    </div>

    <!-- 指标卡片 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card v-for="item in metrics" :key="item.label">
        <CardHeader class="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            {{ item.label }}
          </CardTitle>
          <component :is="item.icon" class="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-semibold">{{ item.value }}</div>
        </CardContent>
      </Card>
    </div>

    <!-- Tab 区域 -->
    <Tabs default-value="calls">
      <TabsList>
        <TabsTrigger value="calls">调用记录</TabsTrigger>
        <TabsTrigger value="config">模型配置</TabsTrigger>
      </TabsList>

      <!-- 调用记录 -->
      <TabsContent value="calls">
        <Card>
          <CardHeader>
            <CardTitle>最近调用</CardTitle>
            <CardDescription>最近 5 条推理调用记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>Token 数</TableHead>
                  <TableHead>延迟</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(call, i) in recentCalls" :key="i">
                  <TableCell class="font-mono text-sm">{{ call.time }}</TableCell>
                  <TableCell>{{ call.tokens.toLocaleString() }}</TableCell>
                  <TableCell>{{ call.latency }}</TableCell>
                  <TableCell>
                    <Badge
                      :variant="call.status === '成功' ? 'secondary' : 'destructive'"
                    >
                      {{ call.status }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 模型配置 -->
      <TabsContent value="config">
        <Card>
          <CardHeader>
            <CardTitle>配置详情</CardTitle>
            <CardDescription>当前模型的运行参数</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-4 sm:grid-cols-2">
              <div v-for="item in configItems" :key="item.label" class="space-y-1">
                <p class="text-sm text-muted-foreground">{{ item.label }}</p>
                <p class="text-sm font-medium text-foreground font-mono">{{ item.value }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
