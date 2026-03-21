<script setup lang="ts">
/**
 * @description 服务状态面板 — Dashboard 实时健康检查组件
 * @author Timon
 */
import { Button } from '@ui/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@ui/components/ui/tooltip'
import { cn } from '@ui/lib/utils'
import { RefreshCw } from 'lucide-vue-next'
import { computed, ref } from 'vue'

type ServiceState = 'healthy' | 'degraded' | 'down'

// 服务列表 — 模拟实时状态
const services = ref<{ name: string, status: ServiceState }[]>([
  { name: 'API Gateway', status: 'healthy' },
  { name: 'Model Service', status: 'healthy' },
  { name: 'Agent Runtime', status: 'healthy' },
  { name: 'Knowledge Index', status: 'degraded' },
  { name: 'Vector DB', status: 'healthy' },
  { name: 'Auth Service', status: 'healthy' },
  { name: 'File Storage', status: 'healthy' },
  { name: 'Task Queue', status: 'healthy' },
  { name: 'Monitoring', status: 'healthy' },
  { name: 'Logging', status: 'healthy' },
])

const refreshing = ref(false)

const statusColor: Record<ServiceState, string> = {
  healthy: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  down: 'bg-red-500',
}

const statusLabel: Record<ServiceState, string> = {
  healthy: '正常',
  degraded: '降级',
  down: '停机',
}

const overallStatus = computed(() =>
  services.value.every(s => s.status === 'healthy')
    ? '所有服务正常运行'
    : '部分服务异常',
)

/** 刷新服务状态（模拟） */
function handleRefresh() {
  refreshing.value = true
  setTimeout(() => {
    // 模拟：随机恢复降级服务
    services.value.forEach((s) => {
      if (s.status === 'degraded')
        s.status = 'healthy'
    })
    refreshing.value = false
  }, 800)
}
</script>

<template>
  <Card class="border-0 shadow-sm">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-base">
          服务状态
        </CardTitle>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1.5">
            <span :class="cn('size-2 rounded-full', overallStatus.includes('正常') ? 'bg-emerald-500' : 'bg-amber-500')" />
            <span class="text-[11px] text-muted-foreground">{{ overallStatus }}</span>
          </div>
          <Button variant="ghost" size="icon" class="size-6" aria-label="刷新服务状态" :disabled="refreshing" @click="handleRefresh">
            <RefreshCw :class="cn('size-3', refreshing && 'animate-spin')" />
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-5 gap-2">
        <Tooltip v-for="service in services" :key="service.name">
          <TooltipTrigger as-child>
            <div class="group relative flex flex-col items-center gap-1.5 rounded-lg p-2 hover:bg-muted/50 transition-colors">
              <div :class="cn('size-3 rounded-full transition-all group-hover:scale-125', statusColor[service.status])" />
              <span class="text-[10px] text-muted-foreground text-center leading-tight">
                {{ service.name }}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>{{ service.name }}: {{ statusLabel[service.status] }}</TooltipContent>
        </Tooltip>
      </div>
    </CardContent>
  </Card>
</template>
