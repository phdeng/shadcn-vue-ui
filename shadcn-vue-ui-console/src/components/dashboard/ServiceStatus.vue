<script setup lang="ts">
/**
 * @description 服务状态面板 — Dashboard 实时健康检查组件
 * @author Timon
 */
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card'
import { cn } from '@ui/lib/utils'

// 服务列表 — 模拟实时状态
const services = [
  { name: 'API Gateway', status: 'healthy' as const },
  { name: 'Model Service', status: 'healthy' as const },
  { name: 'Agent Runtime', status: 'healthy' as const },
  { name: 'Knowledge Index', status: 'degraded' as const },
  { name: 'Vector DB', status: 'healthy' as const },
  { name: 'Auth Service', status: 'healthy' as const },
  { name: 'File Storage', status: 'healthy' as const },
  { name: 'Task Queue', status: 'healthy' as const },
  { name: 'Monitoring', status: 'healthy' as const },
  { name: 'Logging', status: 'healthy' as const },
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
