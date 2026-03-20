<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table'
import { ArrowLeft, Check, Circle } from 'lucide-vue-next'
/**
 * @description 订单详情页 — Dify 风格订单详情，含订单信息、流程时间线、操作记录
 * @author Timon
 */
import { useRoute, useRouter } from 'vue-router'

// ==================== 路由 ====================
const router = useRouter()
const route = useRoute()

// ==================== 订单模拟数据 ====================
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

interface OrderDetail {
  /** 订单号 */
  id: string
  /** 客户名称 */
  customer: string
  /** 商品名称 */
  product: string
  /** 订单金额 */
  amount: number
  /** 订单状态 */
  status: OrderStatus
  /** 下单时间 */
  createdAt: string
}

const orderData: OrderDetail = {
  id: route.params.id as string || 'ORD-2026-0001',
  customer: '上海星辰科技有限公司',
  product: '企业版年度订阅',
  amount: 128000,
  status: 'processing',
  createdAt: '2026-03-18 14:23',
}

// ==================== 状态配置 ====================
const statusConfig: Record<OrderStatus, { label: string, class: string, dotClass: string }> = {
  pending: {
    label: '待处理',
    class: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    dotClass: 'bg-amber-500',
  },
  processing: {
    label: '处理中',
    class: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
    dotClass: 'bg-blue-500',
  },
  completed: {
    label: '已完成',
    class: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    dotClass: 'bg-emerald-500',
  },
  cancelled: {
    label: '已取消',
    class: 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400',
    dotClass: 'bg-gray-400',
  },
}

// ==================== 订单流程时间线 ====================
interface TimelineStep {
  /** 步骤标题 */
  title: string
  /** 步骤描述 */
  description: string
  /** 完成时间 */
  time: string
  /** 是否已完成 */
  completed: boolean
}

const timelineSteps: TimelineStep[] = [
  { title: '下单', description: '客户提交订单', time: '2026-03-18 14:23', completed: true },
  { title: '付款', description: '客户完成付款', time: '2026-03-18 15:10', completed: true },
  { title: '发货', description: '服务开通 / 商品发出', time: '', completed: false },
  { title: '完成', description: '订单交付完成', time: '', completed: false },
]

// ==================== 操作记录模拟数据 ====================
interface OperationRecord {
  /** 操作时间 */
  time: string
  /** 操作人 */
  operator: string
  /** 操作内容 */
  action: string
  /** 备注 */
  remark: string
}

const operationRecords: OperationRecord[] = [
  { time: '2026-03-18 14:23', operator: '系统', action: '创建订单', remark: '客户通过线上下单' },
  { time: '2026-03-18 15:10', operator: '系统', action: '确认付款', remark: '银行转账到账确认' },
  { time: '2026-03-19 09:30', operator: '李明', action: '分配处理', remark: '已分配至交付团队' },
  { time: '2026-03-19 14:05', operator: '王磊', action: '开始处理', remark: '正在配置企业版服务' },
]

// ==================== 金额格式化 ====================
function formatAmount(amount: number): string {
  return amount.toLocaleString('zh-CN')
}

/** 返回上一页 */
function handleBack() {
  router.back()
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部：返回按钮 + 订单号 + 状态 + 操作按钮 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" @click="handleBack">
          <ArrowLeft class="size-4" />
        </Button>
        <h2 class="text-2xl font-semibold tracking-tight">
          订单 {{ orderData.id }}
        </h2>
        <Badge variant="outline" :class="statusConfig[orderData.status].class">
          <span
            class="mr-1 inline-block size-1.5 rounded-full"
            :class="statusConfig[orderData.status].dotClass"
          />
          {{ statusConfig[orderData.status].label }}
        </Badge>
      </div>
      <Button size="sm">
        处理订单
      </Button>
    </div>

    <!-- 订单信息卡片 -->
    <Card class="border-0 shadow-sm">
      <CardHeader>
        <CardTitle class="text-base">
          订单信息
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-x-12 gap-y-5">
          <div class="flex flex-col gap-1">
            <span class="text-sm text-muted-foreground">订单号</span>
            <span class="text-sm font-medium font-mono">{{ orderData.id }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-muted-foreground">客户名称</span>
            <span class="text-sm font-medium">{{ orderData.customer }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-muted-foreground">商品</span>
            <span class="text-sm font-medium">{{ orderData.product }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-muted-foreground">金额</span>
            <div
              class="inline-flex w-fit items-center gap-1 rounded-md bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 dark:from-emerald-950/40 dark:to-teal-950/40"
            >
              <span class="text-lg font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                ¥{{ formatAmount(orderData.amount) }}
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-muted-foreground">下单时间</span>
            <span class="text-sm font-medium">{{ orderData.createdAt }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-sm text-muted-foreground">状态</span>
            <div>
              <Badge variant="outline" :class="statusConfig[orderData.status].class">
                <span
                  class="mr-1 inline-block size-1.5 rounded-full"
                  :class="statusConfig[orderData.status].dotClass"
                />
                {{ statusConfig[orderData.status].label }}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 订单流程时间线卡片 -->
    <Card class="border-0 shadow-sm">
      <CardHeader>
        <CardTitle class="text-base">
          订单流程
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="relative flex items-start justify-between px-4">
          <!-- 连接线（贯穿所有步骤） -->
          <div class="absolute left-4 right-4 top-4 z-0 h-0.5 bg-muted" />
          <!-- 已完成部分的连接线 -->
          <div
            class="absolute left-4 top-4 z-[1] h-0.5 bg-emerald-500 transition-all"
            :style="{
              width: `${((timelineSteps.filter(s => s.completed).length - 1) / (timelineSteps.length - 1)) * 100}%`,
            }"
          />

          <!-- 时间线步骤 -->
          <div
            v-for="(step, index) in timelineSteps"
            :key="index"
            class="relative z-[2] flex flex-col items-center gap-2"
          >
            <!-- 节点图标 -->
            <div
              class="flex size-8 items-center justify-center rounded-full border-2 transition-colors"
              :class="step.completed
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-muted-foreground/30 bg-background text-muted-foreground/50'"
            >
              <Check v-if="step.completed" class="size-4" />
              <Circle v-else class="size-3" />
            </div>

            <!-- 步骤信息 -->
            <div class="flex flex-col items-center gap-0.5 text-center">
              <span
                class="text-sm font-medium"
                :class="step.completed ? 'text-foreground' : 'text-muted-foreground'"
              >
                {{ step.title }}
              </span>
              <span class="text-xs text-muted-foreground">{{ step.description }}</span>
              <span
                v-if="step.time"
                class="mt-0.5 text-xs text-muted-foreground/70"
              >
                {{ step.time }}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 操作记录卡片 -->
    <Card class="border-0 shadow-sm">
      <CardHeader>
        <CardTitle class="text-base">
          操作记录
        </CardTitle>
      </CardHeader>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>时间</TableHead>
              <TableHead>操作人</TableHead>
              <TableHead>操作</TableHead>
              <TableHead>备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(record, index) in operationRecords" :key="index">
              <TableCell class="text-muted-foreground">
                {{ record.time }}
              </TableCell>
              <TableCell class="font-medium">
                {{ record.operator }}
              </TableCell>
              <TableCell>{{ record.action }}</TableCell>
              <TableCell class="text-muted-foreground">
                {{ record.remark }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
