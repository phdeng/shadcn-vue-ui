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
import { Separator } from '@ui/components/ui/separator'
import { cn } from '@ui/lib/utils'
import {
  ArrowLeft,
  Check,
  Download,
  FileText,
  ImageIcon,
  Layers,
  Music,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-vue-next'
/**
 * @description 新增数据集 — 独立创建页面（参考阿里百炼表单设计）
 * 包含：数据集名称、类型、数据格式、描述、文件上传、发布配置
 * @author Timon
 */
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

// ==================== 表单数据 ====================

/** 数据模态类型 */
type DataModality = 'text' | 'image' | 'audio' | 'video' | 'multimodal'

interface FormData {
  /** 数据集名称 */
  name: string
  /** 数据集类型：训练集 / 评测集 */
  type: 'training' | 'evaluation'
  /** 数据模态 */
  modality: DataModality
  /** 训练场景：文本生成 / 图片理解 */
  scene: 'text_generation' | 'image_understanding'
  /** 训练方式：SFT / DPO / CPT */
  method: 'sft' | 'dpo' | 'cpt'
  /** 描述 */
  description: string
  /** 上传文件列表 */
  files: File[]
  /** 发布配置 */
  publishMode: 'publish' | 'draft'
}

const form = reactive<FormData>({
  name: '',
  type: 'training',
  modality: 'text',
  scene: 'text_generation',
  method: 'sft',
  description: '',
  files: [],
  publishMode: 'publish',
})

// ==================== 配置项 ====================

/** 数据集类型选项 */
const typeOptions = [
  {
    value: 'training' as const,
    label: '训练集',
    description: '用于模型微调训练的标注数据，支持 SFT、DPO、CPT 等训练方式',
    icon: FileText,
  },
  {
    value: 'evaluation' as const,
    label: '评测集',
    description: '用于评估模型性能的测试数据，包含标准答案用于自动打分',
    icon: FileText,
  },
]

/** 训练场景选项 */
const sceneOptions = [
  {
    value: 'text_generation' as const,
    label: '文本生成',
    description: '对话、写作、翻译、摘要等文本类任务的训练数据',
    icon: FileText,
  },
  {
    value: 'image_understanding' as const,
    label: '图片理解',
    description: '图片描述、视觉问答、OCR 等多模态任务的训练数据',
    icon: ImageIcon,
  },
]

/** 训练方式选项 */
const methodOptions = [
  {
    value: 'sft' as const,
    label: 'SFT',
    description: '监督微调，使用指令-回答对进行训练',
  },
  {
    value: 'dpo' as const,
    label: 'DPO',
    description: '直接偏好优化，使用偏好对比数据训练',
  },
  {
    value: 'cpt' as const,
    label: 'CPT',
    description: '继续预训练，使用纯文本进行领域适配',
  },
]

/** 模态选项 */
const modalityOptions: { value: DataModality, label: string, icon: typeof FileText }[] = [
  { value: 'text', label: '文本', icon: FileText },
  { value: 'image', label: '图片', icon: ImageIcon },
  { value: 'audio', label: '音频', icon: Music },
  { value: 'video', label: '视频', icon: Video },
  { value: 'multimodal', label: '多模态', icon: Layers },
]

/** 根据模态动态计算支持的文件格式 */
const supportedTypesMap: Record<DataModality, string[]> = {
  text: ['.jsonl', '.json', '.csv', '.xlsx', '.txt'],
  image: ['.jsonl', '.json'],
  audio: ['.jsonl', '.json'],
  video: ['.jsonl', '.json'],
  multimodal: ['.jsonl', '.json'],
}

const supportedTypes = computed(() => supportedTypesMap[form.modality])
const supportedTypesAccept = computed(() => supportedTypesMap[form.modality].join(','))

// ==================== 文件上传 ====================

const isDragOver = ref(false)
const maxFiles = 10
const maxFileSize = 500 * 1024 * 1024 // 500MB

/** 格式化文件大小 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** 拖拽放置 */
function handleDrop(e: DragEvent) {
  isDragOver.value = false
  addFiles(Array.from(e.dataTransfer?.files || []))
}

/** 文件选择 */
function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  addFiles(Array.from(input.files || []))
  input.value = ''
}

/** 添加文件（去重 + 校验） */
function addFiles(newFiles: File[]) {
  const existingNames = new Set(form.files.map(f => f.name))
  const validFiles = newFiles.filter((f) => {
    if (existingNames.has(f.name)) return false
    if (f.size > maxFileSize) {
      toast.error('文件过大', { description: `${f.name} 超过 500MB 限制` })
      return false
    }
    return true
  })
  const remaining = maxFiles - form.files.length
  if (validFiles.length > remaining) {
    toast.warning('文件数量超限', { description: `最多上传 ${maxFiles} 个文件` })
  }
  form.files.push(...validFiles.slice(0, remaining))
}

/** 移除单个文件 */
function removeFile(index: number) {
  form.files.splice(index, 1)
}

// ==================== 校验 ====================

const isValid = computed(() => form.name.trim() !== '')

// ==================== 事件处理 ====================

/** 提交创建 */
function handleSubmit() {
  if (!isValid.value) {
    toast.error('请填写数据集名称')
    return
  }
  const action = form.publishMode === 'publish' ? '创建并发布' : '保存为草稿'
  toast.success(`数据集${action}成功`, { description: form.name })
  router.push('/datasets')
}

/** 取消返回 */
function handleCancel() {
  router.push('/datasets')
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 面包屑 + 标题 -->
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" class="shrink-0" @click="handleCancel">
        <ArrowLeft class="size-4" />
      </Button>
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">新增数据集</h2>
        <p class="mt-0.5 text-sm text-muted-foreground">创建一个新的训练或评测数据集</p>
      </div>
    </div>

    <!-- 表单主体 -->
    <div class="mx-auto w-full max-w-3xl">
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">数据集信息</CardTitle>
          <CardDescription>填写数据集的基本信息、数据格式与文件</CardDescription>
        </CardHeader>
        <CardContent class="space-y-7">

          <!-- ==================== 数据集名称 ==================== -->
          <div class="grid gap-2.5">
            <div class="flex items-center justify-between">
              <Label for="ds-name" class="text-[13px] font-medium">
                数据集名称 <span class="text-destructive">*</span>
              </Label>
              <span class="text-xs text-muted-foreground">{{ form.name.length }} / 50</span>
            </div>
            <Input
              id="ds-name"
              v-model="form.name"
              placeholder="请输入数据集名称"
              :maxlength="50"
              class="h-10 rounded-xl"
            />
          </div>

          <Separator class="!bg-border/40" />

          <!-- ==================== 数据集类型 ==================== -->
          <div class="grid gap-3">
            <Label class="text-[13px] font-medium">数据集类型</Label>
            <div class="grid gap-3 sm:grid-cols-2">
              <button
                v-for="opt in typeOptions"
                :key="opt.value"
                type="button"
                :class="cn(
                  'flex items-start gap-3 rounded-xl border p-5 text-left transition-all',
                  form.type === opt.value
                    ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5'
                    : 'border-border/40 hover:border-border/60 hover:bg-muted/20',
                )"
                @click="form.type = opt.value"
              >
                <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 backdrop-blur-sm">
                  <component :is="opt.icon" class="size-4 text-muted-foreground" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">{{ opt.label }}</span>
                    <div
                      v-if="form.type === opt.value"
                      class="flex size-4 items-center justify-center rounded-full bg-primary"
                    >
                      <Check class="size-2.5 text-primary-foreground" />
                    </div>
                  </div>
                  <p class="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {{ opt.description }}
                  </p>
                </div>
              </button>
            </div>
          </div>

          <Separator class="!bg-border/40" />

          <!-- ==================== 数据模态 ==================== -->
          <div class="grid gap-3">
            <Label class="text-[13px] font-medium">数据模态</Label>
            <div class="flex gap-2">
              <button
                v-for="opt in modalityOptions"
                :key="opt.value"
                type="button"
                :class="cn(
                  'flex flex-1 flex-col items-center gap-1.5 rounded-xl border px-3 py-3.5 transition-all',
                  form.modality === opt.value
                    ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5'
                    : 'border-border/40 hover:border-border/60 hover:bg-muted/20',
                )"
                @click="form.modality = opt.value"
              >
                <div class="flex size-8 items-center justify-center rounded-lg bg-muted/50 backdrop-blur-sm">
                  <component :is="opt.icon" class="size-4 text-muted-foreground" />
                </div>
                <span class="text-xs font-medium">{{ opt.label }}</span>
                <div
                  v-if="form.modality === opt.value"
                  class="flex size-4 items-center justify-center rounded-full bg-primary"
                >
                  <Check class="size-2.5 text-primary-foreground" />
                </div>
              </button>
            </div>
          </div>

          <Separator class="!bg-border/40" />

          <!-- ==================== 数据格式 ==================== -->
          <div class="grid gap-5">
            <Label class="text-[13px] font-medium">数据格式</Label>

            <!-- 训练场景 -->
            <div class="grid gap-3">
              <span class="text-xs font-medium text-muted-foreground">训练场景</span>
              <div class="grid gap-3 sm:grid-cols-2">
                <button
                  v-for="opt in sceneOptions"
                  :key="opt.value"
                  type="button"
                  :class="cn(
                    'flex items-start gap-3 rounded-xl border p-5 text-left transition-all',
                    form.scene === opt.value
                      ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5'
                      : 'border-border/40 hover:border-border/60 hover:bg-muted/20',
                  )"
                  @click="form.scene = opt.value"
                >
                  <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 backdrop-blur-sm">
                    <component :is="opt.icon" class="size-4 text-muted-foreground" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium">{{ opt.label }}</span>
                      <div
                        v-if="form.scene === opt.value"
                        class="flex size-4 items-center justify-center rounded-full bg-primary"
                      >
                        <Check class="size-2.5 text-primary-foreground" />
                      </div>
                    </div>
                    <p class="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {{ opt.description }}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <!-- 训练方式 -->
            <div class="grid gap-3">
              <span class="text-xs font-medium text-muted-foreground">训练方式</span>
              <div class="flex gap-1 rounded-xl bg-muted/40 p-1">
                <button
                  v-for="opt in methodOptions"
                  :key="opt.value"
                  type="button"
                  :class="cn(
                    'flex-1 rounded-lg px-4 py-2 text-sm transition-all',
                    form.method === opt.value
                      ? 'bg-background font-medium shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )"
                  @click="form.method = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
              <p class="text-xs text-muted-foreground">
                {{ methodOptions.find(m => m.value === form.method)?.description }}
              </p>
            </div>

            <!-- 样例下载 -->
            <div class="flex items-center gap-3 rounded-xl bg-muted/30 px-5 py-4">
              <span class="text-xs text-muted-foreground">样例数据下载：</span>
              <button
                type="button"
                class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Download class="size-3" />
                JSONL 格式
              </button>
              <Separator orientation="vertical" class="!h-4" />
              <button
                type="button"
                class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Download class="size-3" />
                Excel 格式
              </button>
            </div>
          </div>

          <Separator class="!bg-border/40" />

          <!-- ==================== 描述 ==================== -->
          <div class="grid gap-2.5">
            <div class="flex items-center justify-between">
              <Label for="ds-desc" class="text-[13px] font-medium">描述</Label>
              <span class="text-xs text-muted-foreground">{{ form.description.length }} / 200</span>
            </div>
            <textarea
              id="ds-desc"
              v-model="form.description"
              rows="3"
              :maxlength="200"
              placeholder="请输入数据集描述，介绍数据集的内容、用途和来源等信息（可选）"
              class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
            />
          </div>

          <Separator class="!bg-border/40" />

          <!-- ==================== 文件上传 ==================== -->
          <div class="grid gap-5">
            <div class="flex items-center justify-between">
              <Label class="text-[13px] font-medium">上传文件</Label>
              <Badge variant="secondary" class="text-[10px] tracking-wide">
                {{ form.files.length }} / {{ maxFiles }}
              </Badge>
            </div>

            <!-- 拖拽上传区 -->
            <div
              :class="cn(
                'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 transition-colors',
                isDragOver
                  ? 'border-primary bg-primary/[0.03]'
                  : 'border-border/40 hover:border-border/60',
              )"
              @dragover.prevent="isDragOver = true"
              @dragleave="isDragOver = false"
              @drop.prevent="handleDrop"
            >
              <div class="flex size-14 items-center justify-center rounded-2xl bg-muted/50 backdrop-blur-sm">
                <Upload class="size-6 text-muted-foreground" />
              </div>
              <div class="text-center">
                <p class="text-sm font-medium">
                  拖拽文件到此处，或
                  <label class="cursor-pointer text-primary hover:underline">
                    点击选择文件
                    <input
                      type="file"
                      multiple
                      :accept="supportedTypesAccept"
                      class="hidden"
                      @change="handleFileSelect"
                    >
                  </label>
                </p>
                <p class="mt-2 text-xs text-muted-foreground">
                  支持 {{ supportedTypes.join('、') }} 格式，单文件最大 500MB，最多 {{ maxFiles }} 个文件
                </p>
                <p v-if="form.modality !== 'text'" class="mt-1 text-xs text-muted-foreground/60">
                  {{ form.modality === 'image' ? '文件中需包含图片 URL 字段' : form.modality === 'audio' ? '文件中需包含音频 URL 字段' : form.modality === 'video' ? '文件中需包含视频 URL 字段' : '文件中需包含多模态资源 URL 字段' }}
                </p>
              </div>
            </div>

            <!-- 已选文件列表 -->
            <div v-if="form.files.length > 0" class="grid gap-2.5">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">
                  已选择 {{ form.files.length }} 个文件
                </span>
                <Button variant="ghost" size="sm" class="h-7 px-2 text-xs text-destructive" @click="form.files = []">
                  <Trash2 class="mr-1 size-3" />
                  全部清除
                </Button>
              </div>
              <div class="max-h-[260px] space-y-1.5 overflow-y-auto">
                <div
                  v-for="(file, index) in form.files"
                  :key="file.name"
                  class="flex items-center gap-2 rounded-xl border border-border/40 bg-card/80 px-3 py-2"
                >
                  <FileText class="size-4 shrink-0 text-muted-foreground" />
                  <span class="flex-1 truncate text-sm">{{ file.name }}</span>
                  <span class="shrink-0 text-xs text-muted-foreground">{{ formatSize(file.size) }}</span>
                  <button
                    type="button"
                    class="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-destructive"
                    @click="removeFile(index)"
                  >
                    <X class="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Separator class="!bg-border/40" />

          <!-- ==================== 发布配置 ==================== -->
          <div class="grid gap-3">
            <Label class="text-[13px] font-medium">发布配置</Label>
            <div class="flex gap-1 rounded-xl bg-muted/40 p-1">
              <button
                type="button"
                :class="cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm transition-all',
                  form.publishMode === 'publish'
                    ? 'bg-background font-medium shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )"
                @click="form.publishMode = 'publish'"
              >
                <Check v-if="form.publishMode === 'publish'" class="size-3.5" />
                立即发布
              </button>
              <button
                type="button"
                :class="cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm transition-all',
                  form.publishMode === 'draft'
                    ? 'bg-background font-medium shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )"
                @click="form.publishMode = 'draft'"
              >
                <Check v-if="form.publishMode === 'draft'" class="size-3.5" />
                保存为草稿
              </button>
            </div>
            <p class="text-xs text-muted-foreground">
              {{ form.publishMode === 'publish' ? '数据集创建后将立即可用于训练任务' : '保存为草稿后可在数据集列表中继续编辑' }}
            </p>
          </div>

        </CardContent>
      </Card>

      <!-- 底部操作栏 -->
      <div class="flex items-center justify-between pt-6 pb-2">
        <Button variant="outline" @click="handleCancel">
          取消
        </Button>
        <Button :disabled="!isValid" @click="handleSubmit">
          <Check class="mr-2 size-4" />
          {{ form.publishMode === 'publish' ? '确认创建' : '保存草稿' }}
        </Button>
      </div>
    </div>
  </div>
</template>
