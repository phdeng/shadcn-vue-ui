<script setup lang="ts">
/**
 * @description 系统状态面板 — Business Dashboard 服务健康检查
 * @author Timon
 */
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card'
import { cn } from '@ui/lib/utils'

// 业务系统服务列表
const services = [
  { name: '用户服务', status: 'healthy' as const },
  { name: '订单服务', status: 'healthy' as const },
  { name: '支付网关', status: 'healthy' as const },
  { name: '内容服务', status: 'healthy' as const },
  { name: '通知服务', status: 'degraded' as const },
  { name: '文件存储', status: 'healthy' as const },
  { name: '缓存服务', status: 'healthy' as const },
  { name: '搜索引擎', status: 'healthy' as const },
  { name: '日志服务', status: 'healthy' as const },
  { name: '监控告警', status: 'healthy' as const },
]

const statusColor = {
  healthy: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  down: 'bg-red-500',
}

const overallStatus = services.every(s => s.status === 'healthy')
  ? '所有服务正常运行'
  : '部分服务异常'
</script>

<template>
  <Card class="border-0 shadow-sm">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-base">
          服务状态
        </CardTitle>
        <div class="flex items-center gap-1.5">
          <span :class="cn('size-2 rounded-full', overallStatus.includes('正常') ? 'bg-emerald-500' : 'bg-amber-500')" />
          <span class="text-[11px] text-muted-foreground">{{ overallStatus }}</span>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-5 gap-2">
        <div
          v-for="service in services"
          :key="service.name"
          class="group relative flex flex-col items-center gap-1.5 rounded-lg p-2 hover:bg-muted/50 transition-colors"
        >
          <div :class="cn('size-3 rounded-full transition-all group-hover:scale-125', statusColor[service.status])" />
          <span class="text-[10px] text-muted-foreground text-center leading-tight">
            {{ service.name }}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
