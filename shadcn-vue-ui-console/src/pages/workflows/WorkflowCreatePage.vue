<script setup lang="ts">
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import { Textarea } from '@ui/components/ui/textarea'
import { cn } from '@ui/lib/utils'
import {
  ArrowLeft,
  Check,
  Clock,
  Globe,
  MousePointerClick,
} from 'lucide-vue-next'
/**
 * @description 创建工作流 — 单步表单：名称、描述、触发方式
 * @author Timon
 */
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

// ==================== 表单数据 ====================

type TriggerType = 'manual' | 'api' | 'cron'

interface FormData {
  name: string
  description: string
  trigger: TriggerType
}

const form = reactive<FormData>({
  name: '',
  description: '',
  trigger: 'manual',
})

const triggerOptions = [
  { value: 'manual' as const, label: '手动触发', description: '在控制台手动执行工作流', icon: MousePointerClick },
  { value: 'api' as const, label: 'API 调用', description: '通过 REST API 远程触发执行', icon: Globe },
  { value: 'cron' as const, label: '定时任务', description: '按 Cron 表达式定时自动运行', icon: Clock },
]

// ==================== 校验 ====================

const canSubmit = computed(() => form.name.trim() !== '')

// ==================== 事件处理 ====================

function handleSubmit() {
  if (!canSubmit.value) return
  toast.success('工作流已创建', { description: form.name })
  router.push('/workflows')
}

function handleCancel() {
  router.push('/workflows')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 头部 -->
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" class="shrink-0" @click="handleCancel">
        <ArrowLeft class="size-4" />
      </Button>
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">创建工作流</h2>
        <p class="mt-0.5 text-sm text-muted-foreground">定义工作流名称与触发方式</p>
      </div>
    </div>

    <!-- 表单 -->
    <div class="mx-auto w-full max-w-2xl">
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">基本信息</CardTitle>
          <CardDescription>填写工作流的名称、描述和触发方式</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- 工作流名称 -->
          <div class="grid gap-2.5">
            <div class="flex items-center justify-between">
              <Label for="wf-name" class="text-[13px] font-medium">
                工作流名称 <span class="text-destructive">*</span>
              </Label>
              <span class="text-xs text-muted-foreground">{{ form.name.length }} / 40</span>
            </div>
            <Input
              id="wf-name"
              v-model="form.name"
              placeholder="请输入工作流名称"
              :maxlength="40"
              class="h-10 rounded-xl"
            />
          </div>

          <!-- 描述 -->
          <div class="grid gap-2.5">
            <Label for="wf-desc" class="text-[13px] font-medium">描述</Label>
            <Textarea
              id="wf-desc"
              v-model="form.description"
              placeholder="简要描述工作流的用途与功能"
              rows="3"
              class="rounded-xl resize-none"
            />
          </div>

          <!-- 触发方式 -->
          <div class="grid gap-3">
            <Label class="text-[13px] font-medium">触发方式</Label>
            <div class="grid gap-3 sm:grid-cols-3">
              <button
                v-for="opt in triggerOptions"
                :key="opt.value"
                type="button"
                :class="cn(
                  'rounded-xl border p-4 text-left transition-all',
                  form.trigger === opt.value
                    ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5'
                    : 'border-border/40 hover:border-border/60 hover:bg-muted/20',
                )"
                @click="form.trigger = opt.value"
              >
                <div class="flex items-center gap-2">
                  <component :is="opt.icon" class="size-4 text-muted-foreground" />
                  <span class="text-sm font-medium">{{ opt.label }}</span>
                  <div
                    v-if="form.trigger === opt.value"
                    class="size-4 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check class="size-2.5 text-primary-foreground" />
                  </div>
                </div>
                <p class="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                  {{ opt.description }}
                </p>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 底部操作栏 -->
      <div class="flex items-center justify-end gap-3 pt-6 pb-2">
        <Button variant="outline" @click="handleCancel">取消</Button>
        <Button :disabled="!canSubmit" @click="handleSubmit">
          <Check class="mr-2 size-4" />
          创建
        </Button>
      </div>
    </div>
  </div>
</template>
