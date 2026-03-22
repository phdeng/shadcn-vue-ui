<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select'
import { Separator } from '@ui/components/ui/separator'
import { Switch } from '@ui/components/ui/switch'
import { cn } from '@ui/lib/utils'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Rocket,
  Server,
} from 'lucide-vue-next'
/**
 * @description 创建部署 — 两步引导页面
 * 步骤：① 选择模型 → ② 配置部署
 * @author Timon
 */
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

// ==================== 步骤控制 ====================

const currentStep = ref(1)
const steps = [
  { num: 1, label: '选择模型' },
  { num: 2, label: '配置部署' },
]

// ==================== 可部署模型列表 ====================

interface DeployableModel {
  id: string
  name: string
  provider: string
  status: 'running' | 'stopped'
  type: string
}

const models: DeployableModel[] = [
  { id: 'm1', name: 'Qwen2.5-72B-Chat', provider: '阿里云', status: 'running', type: 'LLM' },
  { id: 'm2', name: 'GPT-4o', provider: 'OpenAI', status: 'running', type: 'LLM' },
  { id: 'm3', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'running', type: 'LLM' },
  { id: 'm4', name: 'DeepSeek-V3', provider: 'DeepSeek', status: 'running', type: 'LLM' },
  { id: 'm5', name: 'Qwen2.5-72B-SFT', provider: '阿里云', status: 'running', type: '微调模型' },
  { id: 'm6', name: 'Llama-3.1-70B', provider: 'Meta', status: 'stopped', type: 'LLM' },
]

/** 仅显示可部署（running）的模型 */
const deployableModels = computed(() => models.filter(m => m.status === 'running'))

// ==================== 表单数据 ====================

interface FormData {
  // 步骤 1
  selectedModelId: string
  // 步骤 2
  serviceName: string
  region: string
  replicas: number
  autoScale: boolean
  description: string
}

const form = reactive<FormData>({
  selectedModelId: '',
  serviceName: '',
  region: '',
  replicas: 1,
  autoScale: false,
  description: '',
})

/** 区域选项 */
const regionOptions = [
  { value: 'cn-north-2', label: '华北2（北京）' },
  { value: 'cn-east-1', label: '华东1（杭州）' },
  { value: 'cn-south-1', label: '华南1（深圳）' },
]

/** 当前选中的模型对象 */
const selectedModel = computed(() => models.find(m => m.id === form.selectedModelId))

// ==================== 校验 ====================

const step1Valid = computed(() => form.selectedModelId !== '')
const step2Valid = computed(() =>
  form.serviceName.trim() !== ''
  && form.region !== ''
  && form.replicas >= 1
  && form.replicas <= 10,
)

const canNext = computed(() => {
  if (currentStep.value === 1) return step1Valid.value
  return true
})

// ==================== 导航 ====================

function handleNext() {
  if (!canNext.value) return
  if (currentStep.value < 2) {
    // 自动填充服务名称
    if (!form.serviceName && selectedModel.value) {
      form.serviceName = `${selectedModel.value.name}-推理服务`
    }
    currentStep.value++
  }
}

function handlePrev() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function handleSubmit() {
  if (!step2Valid.value) return
  toast.success('部署创建成功', { description: form.serviceName })
  router.push('/deployments')
}

function handleCancel() {
  router.push('/deployments')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 面包屑 + 标题 -->
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" class="shrink-0" aria-label="返回" @click="handleCancel">
        <ArrowLeft class="size-4" />
      </Button>
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">创建部署</h2>
        <p class="mt-0.5 text-sm text-muted-foreground">选择模型并配置推理服务部署参数</p>
      </div>
    </div>

    <!-- 步骤条 -->
    <div class="flex items-center justify-center gap-0">
      <template v-for="(step, index) in steps" :key="step.num">
        <div class="flex items-center gap-2.5">
          <div
            :class="cn(
              'flex size-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
              currentStep === step.num
                ? 'bg-primary text-primary-foreground ring-4 ring-primary/10'
                : currentStep > step.num
                  ? 'bg-success/15 text-success'
                  : 'bg-muted text-muted-foreground',
            )"
          >
            <Check v-if="currentStep > step.num" class="size-3.5" />
            <span v-else>{{ step.num }}</span>
          </div>
          <span
            :class="cn(
              'text-sm font-medium',
              currentStep === step.num ? 'text-foreground' : 'text-muted-foreground',
            )"
          >
            {{ step.label }}
          </span>
        </div>
        <div
          v-if="index < steps.length - 1"
          :class="cn(
            'mx-4 h-px w-20 transition-colors',
            currentStep > step.num ? 'bg-success/30' : 'bg-border/60',
          )"
        />
      </template>
    </div>

    <!-- 步骤内容区 -->
    <div class="mx-auto w-full max-w-3xl">

      <!-- ==================== 步骤 1：选择模型 ==================== -->
      <Card v-if="currentStep === 1" class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">选择模型</CardTitle>
          <CardDescription>从可部署的模型中选择一个用于推理服务</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-3 sm:grid-cols-2">
            <button
              v-for="model in deployableModels"
              :key="model.id"
              type="button"
              :class="cn(
                'flex items-start gap-3 rounded-xl border p-5 text-left transition-all',
                form.selectedModelId === model.id
                  ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5'
                  : 'border-border/40 hover:border-border/60 hover:bg-muted/20',
              )"
              @click="form.selectedModelId = model.id"
            >
              <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 backdrop-blur-sm">
                <Server class="size-4 text-muted-foreground" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ model.name }}</span>
                  <div
                    v-if="form.selectedModelId === model.id"
                    class="size-4 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check class="size-2.5 text-primary-foreground" />
                  </div>
                </div>
                <div class="mt-1.5 flex items-center gap-2">
                  <span class="text-xs text-muted-foreground">{{ model.provider }}</span>
                  <Badge variant="secondary" class="text-[10px] tracking-wide">
                    {{ model.type }}
                  </Badge>
                </div>
              </div>
            </button>
          </div>

          <!-- 当前选择汇总 -->
          <div class="flex items-center gap-2 rounded-xl bg-muted/30 px-5 py-4">
            <span class="text-xs text-muted-foreground">已选择：</span>
            <span v-if="selectedModel" class="text-sm font-medium">
              {{ selectedModel.name }}
              <span class="text-xs text-muted-foreground ml-1">— {{ selectedModel.provider }}</span>
            </span>
            <span v-else class="text-xs text-muted-foreground">请选择一个模型</span>
          </div>
        </CardContent>
      </Card>

      <!-- ==================== 步骤 2：配置部署 ==================== -->
      <Card v-if="currentStep === 2" class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">配置部署</CardTitle>
          <CardDescription>设置推理服务的基础参数</CardDescription>
        </CardHeader>
        <CardContent class="space-y-7">
          <!-- 服务名称 -->
          <div class="grid gap-2.5">
            <div class="flex items-center justify-between">
              <Label for="svc-name" class="text-[13px] font-medium">
                服务名称 <span class="text-destructive">*</span>
              </Label>
              <span class="text-xs text-muted-foreground">{{ form.serviceName.length }} / 40</span>
            </div>
            <Input
              id="svc-name"
              v-model="form.serviceName"
              placeholder="请输入服务名称"
              :maxlength="40"
              class="h-10 rounded-xl"
            />
          </div>

          <Separator class="!bg-border/40" />

          <!-- 部署区域 -->
          <div class="grid gap-2.5">
            <Label class="text-[13px] font-medium">
              部署区域 <span class="text-destructive">*</span>
            </Label>
            <Select v-model="form.region">
              <SelectTrigger class="h-10 rounded-xl">
                <SelectValue placeholder="选择部署区域" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="opt in regionOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator class="!bg-border/40" />

          <!-- 初始副本数 -->
          <div class="grid gap-2.5">
            <Label for="replicas" class="text-[13px] font-medium">
              初始副本数 <span class="text-destructive">*</span>
            </Label>
            <Input
              id="replicas"
              v-model.number="form.replicas"
              type="number"
              :min="1"
              :max="10"
              placeholder="1"
              class="h-10 rounded-xl w-32"
            />
            <p class="text-xs text-muted-foreground">范围 1 ~ 10，建议生产环境 >= 2</p>
          </div>

          <Separator class="!bg-border/40" />

          <!-- 自动扩缩容 -->
          <div class="flex items-center justify-between rounded-xl bg-muted/30 px-5 py-4">
            <div>
              <Label class="text-[13px] font-medium">自动扩缩容</Label>
              <p class="mt-1 text-xs text-muted-foreground">根据流量自动调整副本数量</p>
            </div>
            <Switch v-model:checked="form.autoScale" />
          </div>

          <Separator class="!bg-border/40" />

          <!-- 端点描述 -->
          <div class="grid gap-2.5">
            <div class="flex items-center justify-between">
              <Label for="svc-desc" class="text-[13px] font-medium">端点描述</Label>
              <span class="text-xs text-muted-foreground">{{ form.description.length }} / 200</span>
            </div>
            <textarea
              id="svc-desc"
              v-model="form.description"
              rows="3"
              :maxlength="200"
              placeholder="描述该推理服务的用途（可选）"
              class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
            />
          </div>

          <Separator class="!bg-border/40" />

          <!-- 部署预览 -->
          <div class="rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 p-5 space-y-4">
            <h4 class="text-[15px] font-medium">部署预览</h4>
            <div class="grid gap-3 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">模型</span>
                <span class="font-medium">{{ selectedModel?.name || '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">服务名称</span>
                <span class="font-medium">{{ form.serviceName || '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">部署区域</span>
                <span class="font-medium">{{ regionOptions.find(r => r.value === form.region)?.label || '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">初始副本数</span>
                <span class="font-medium tabular-nums">{{ form.replicas }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">自动扩缩容</span>
                <span class="font-medium">{{ form.autoScale ? '已开启' : '未开启' }}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 底部操作栏 -->
      <div class="flex items-center justify-between pt-6 pb-2">
        <Button variant="outline" @click="handleCancel">
          取消
        </Button>
        <div class="flex items-center gap-3">
          <Button v-if="currentStep > 1" variant="outline" @click="handlePrev">
            <ArrowLeft class="mr-2 size-4" />
            上一步
          </Button>
          <Button v-if="currentStep < 2" :disabled="!canNext" @click="handleNext">
            下一步
            <ArrowRight class="ml-2 size-4" />
          </Button>
          <Button v-if="currentStep === 2" :disabled="!step2Valid" @click="handleSubmit">
            <Rocket class="mr-2 size-4" />
            确认部署
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
