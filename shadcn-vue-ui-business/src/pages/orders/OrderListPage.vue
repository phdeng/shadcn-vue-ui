<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import { Card, CardContent } from '@ui/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Input } from '@ui/components/ui/input'
import { Separator } from '@ui/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { Download, Eye, MoreHorizontal, Search, Settings2, XCircle } from 'lucide-vue-next'
/**
 * @description 订单管理页 — 查看和处理业务订单
 * @author Timon
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

// ==================== 订单模拟数据 ====================
type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

interface Order {
  id: string
  customer: string
  product: string
  amount: number
  status: OrderStatus
  createdAt: string
}

const orders = ref<Order[]>([
  { id: 'ORD-2026-0001', customer: '上海星辰科技有限公司', product: '企业版年度订阅', amount: 128000, status: 'completed', createdAt: '2026-03-18 14:23' },
  { id: 'ORD-2026-0002', customer: '北京云端数据咨询', product: 'API 调用额度包 - 100万次', amount: 45000, status: 'pending', createdAt: '2026-03-19 09:15' },
  { id: 'ORD-2026-0003', customer: '深圳智远信息技术', product: '专业版季度订阅', amount: 32000, status: 'processing', createdAt: '2026-03-19 11:42' },
  { id: 'ORD-2026-0004', customer: '杭州碧海网络', product: '定制化部署服务', amount: 256000, status: 'completed', createdAt: '2026-03-20 08:30' },
  { id: 'ORD-2026-0005', customer: '广州锐思营销集团', product: '基础版月度订阅', amount: 5800, status: 'cancelled', createdAt: '2026-03-20 10:05' },
  { id: 'ORD-2026-0006', customer: '成都天府软件园', product: 'API 调用额度包 - 50万次', amount: 24000, status: 'pending', createdAt: '2026-03-20 15:38' },
  { id: 'ORD-2026-0007', customer: '南京紫金大数据', product: '企业版年度订阅', amount: 128000, status: 'processing', createdAt: '2026-03-21 09:12' },
  { id: 'ORD-2026-0008', customer: '武汉光谷创新科技', product: '专业版年度订阅', amount: 96000, status: 'pending', createdAt: '2026-03-21 10:45' },
])

// ==================== 对话框状态 ====================
const showCancelDialog = ref(false)
const cancelTarget = ref<Order | null>(null)

// ==================== 路由 ====================
const router = useRouter()

// ==================== 搜索与筛选 ====================
const searchQuery = ref('')
const activeTab = ref('all')

const filteredOrders = computed(() => {
  let result = orders.value

  // 按状态筛选
  if (activeTab.value !== 'all') {
    const statusMap: Record<string, OrderStatus> = {
      pending: 'pending',
      completed: 'completed',
      cancelled: 'cancelled',
    }
    result = result.filter(o => o.status === statusMap[activeTab.value])
  }

  // 按关键词搜索
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      o =>
        o.id.toLowerCase().includes(q)
        || o.customer.toLowerCase().includes(q)
        || o.product.toLowerCase().includes(q),
    )
  }

  return result
})

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

// ==================== 金额格式化 ====================
function formatAmount(amount: number): string {
  return amount.toLocaleString('zh-CN')
}

/** 跳转到订单详情页 */
function handleRowClick(orderId: string) {
  router.push(`/orders/${orderId}`)
}

/** 查看详情 */
function handleView(order: Order) {
  router.push(`/orders/${order.id}`)
}

/** 处理订单 */
function handleProcess(order: Order) {
  toast.info('处理订单', { description: `订单 ${order.id} 处理功能即将上线` })
}

/** 打开取消确认 */
function handleCancelConfirm(order: Order) {
  cancelTarget.value = order
  showCancelDialog.value = true
}

/** 执行取消 */
function handleCancel() {
  if (!cancelTarget.value) return
  const id = cancelTarget.value.id
  const target = orders.value.find(o => o.id === id)
  if (target) target.status = 'cancelled'
  showCancelDialog.value = false
  cancelTarget.value = null
  toast.success('已取消', { description: id })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          订单管理
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          查看和处理业务订单
        </p>
      </div>
      <Button variant="outline" size="sm">
        <Download class="size-4" />
        导出
      </Button>
    </div>

    <!-- 工具栏：搜索 + Tabs 筛选 + 计数 -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-64">
        <Search class="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="搜索订单号、客户、商品…"
          class="pl-8"
        />
      </div>

      <div class="flex items-center gap-3">
        <Tabs v-model="activeTab">
          <TabsList>
            <TabsTrigger value="all">
              全部
            </TabsTrigger>
            <TabsTrigger value="pending">
              待处理
            </TabsTrigger>
            <TabsTrigger value="completed">
              已完成
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              已取消
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Separator orientation="vertical" class="h-5" />
        <span class="text-sm text-muted-foreground">共 {{ filteredOrders.length }} 条订单</span>
      </div>
    </div>

    <!-- 表格区域 -->
    <Card class="border-0 shadow-sm">
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[160px]">
                订单号
              </TableHead>
              <TableHead>客户名称</TableHead>
              <TableHead>商品</TableHead>
              <TableHead class="text-right">
                金额
              </TableHead>
              <TableHead>状态</TableHead>
              <TableHead>下单时间</TableHead>
              <TableHead class="w-[60px] text-right">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="order in filteredOrders"
              :key="order.id"
              class="cursor-pointer"
              @click="handleRowClick(order.id)"
            >
              <!-- 订单号 -->
              <TableCell class="font-mono text-sm">
                {{ order.id }}
              </TableCell>

              <!-- 客户名称 -->
              <TableCell class="font-medium">
                {{ order.customer }}
              </TableCell>

              <!-- 商品 -->
              <TableCell class="text-muted-foreground">
                {{ order.product }}
              </TableCell>

              <!-- 金额 -->
              <TableCell class="text-right font-mono tabular-nums">
                ¥{{ formatAmount(order.amount) }}
              </TableCell>

              <!-- 状态 -->
              <TableCell>
                <Badge variant="outline" :class="statusConfig[order.status].class">
                  <span
                    class="mr-1 inline-block size-1.5 rounded-full"
                    :class="statusConfig[order.status].dotClass"
                  />
                  {{ statusConfig[order.status].label }}
                </Badge>
              </TableCell>

              <!-- 下单时间 -->
              <TableCell class="text-muted-foreground">
                {{ order.createdAt }}
              </TableCell>

              <!-- 操作下拉菜单 -->
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal class="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-36">
                    <DropdownMenuItem @click.stop="handleView(order)">
                      <Eye class="size-4" />
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem @click.stop="handleProcess(order)">
                      <Settings2 class="size-4" />
                      处理订单
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="text-destructive focus:text-destructive" @click.stop="handleCancelConfirm(order)">
                      <XCircle class="size-4" />
                      取消订单
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- 取消确认对话框 -->
    <ConfirmDialog
      v-model:open="showCancelDialog"
      title="取消订单"
      :description="`确定要取消订单「${cancelTarget?.id}」吗？取消后将无法恢复。`"
      confirm-text="取消订单"
      @confirm="handleCancel"
    />
  </div>
</template>
