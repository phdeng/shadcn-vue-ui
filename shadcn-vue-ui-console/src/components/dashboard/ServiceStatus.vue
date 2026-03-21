<script setup lang="ts">
/**
 * @description 服务状态面板 — Dashboard 实时健康检查组件
 * 紧凑列表样式，每行一个服务，左侧服务名 + 右侧状态指示器
 * @author Timon
 */
import { Button } from '@ui/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card'
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
  healthy: 'bg-success',
  degraded: 'bg-warning',
  down: 'bg-destructive',
}

const statusLabel: Record<ServiceState, string> = {
  healthy: '正常',
  degraded: '降级',
  down: '停机',
}

const statusTextColor: Record<ServiceState, string> = {
  healthy: 'text-success',
  degraded: 'text-warning',
  down: 'text-destructive',
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
  <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-[15px] font-semibold">
          服务状态
        </CardTitle>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1.5">
            <span :class="cn('size-2 rounded-full', overallStatus.includes('正常') ? 'bg-success' : 'bg-warning')" />
            <span class="text-[11px] text-muted-foreground">{{ overallStatus }}</span>
          </div>
          <Button variant="ghost" size="icon" class="size-6" aria-label="刷新服务状态" :disabled="refreshing" @click="handleRefresh">
            <RefreshCw :class="cn('size-3', refreshing && 'animate-spin')" />
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 gap-x-8 gap-y-3">
        <div
          v-for="service in services"
          :key="service.name"
          class="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
        >
          <span class="text-[13px] text-foreground/80">{{ service.name }}</span>
          <div class="flex items-center gap-1.5">
            <span :class="cn('size-2 rounded-full', statusColor[service.status])" />
            <span :class="cn('text-[11px] font-medium', statusTextColor[service.status])">
              {{ statusLabel[service.status] }}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
