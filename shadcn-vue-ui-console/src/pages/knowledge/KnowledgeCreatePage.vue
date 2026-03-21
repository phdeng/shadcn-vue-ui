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
import { cn } from '@ui/lib/utils'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Globe,
  Grid3X3,
  HelpCircle,
  Image,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-vue-next'
/**
 * @description 创建知识库 — 三步引导页面（参考百炼）
 * 步骤：① 基础信息 → ② 选择数据 → ③ 索引设置
 * @author Timon
 */
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()

// ==================== 步骤控制 ====================

const currentStep = ref(1)
const steps = [
  { num: 1, label: '基础信息' },
  { num: 2, label: '选择数据' },
  { num: 3, label: '索引设置' },
]

// ==================== 表单数据 ====================

interface FormData {
  // 步骤 1：基础信息
  name: string
  description: string
  icon: string
  type: 'document' | 'data' | 'image' | 'video'
  scene: 'basic_qa' | 'rich_reply'
  // 步骤 2：数据（文件/URL）
  files: File[]
  urls: string[]
  // 步骤 3：索引设置
  embeddingModel: string
  chunkStrategy: 'auto' | 'custom'
  chunkSize: number
  chunkOverlap: number
}

const form = reactive<FormData>({
  name: '',
  description: '',
  icon: '📄',
  type: 'document',
  scene: 'basic_qa',
  files: [],
  urls: [],
  embeddingModel: 'text-embedding-v3',
  chunkStrategy: 'auto',
  chunkSize: 500,
  chunkOverlap: 50,
})

// ==================== 配置项 ====================

const iconOptions = ['📄', '🔧', '💬', '📊', '⚖️', '🧠', '📚', '🔬']

const typeOptions = [
  { value: 'document' as const, label: '文档搜索', description: '构建文档、文件、Excel 混合型索引知识库，利用切片方案，构建常规混合搜索知识库', icon: FileText },
  { value: 'data' as const, label: '数据查询', description: '构建仅以数据表结构查询的数据索引体系，NL2SQL 思路，实现灵活的数据查询能力', icon: Grid3X3 },
  { value: 'image' as const, label: '图片问答', description: '构建以图片索引为主的知识库，基于多模态 Embedding，支持图片名称和信息搜索', icon: Image },
  { value: 'video' as const, label: '音视频搜索', description: '构建音视频搜索知识库，对音视频内容进行融合理解与智能提炼', icon: Video },
]

const sceneOptions = [
  { value: 'basic_qa' as const, label: '基础文档问答', description: '根据用户请求，搜索并召回文档切片信息，由模型直接生成答案' },
  { value: 'rich_reply' as const, label: '图文并茂回复', description: '在文档搜索的基础上，自动进行排版生成和配图搜索，生成图文回复' },
]

const embeddingModels = [
  { value: 'text-embedding-v3', label: 'text-embedding-v3', provider: '通义千问', dimension: 1024 },
  { value: 'text-embedding-v2', label: 'text-embedding-v2', provider: '通义千问', dimension: 1536 },
  { value: 'bge-large-zh-v1.5', label: 'BGE-Large-ZH', provider: '智源 BAAI', dimension: 1024 },
  { value: 'bge-m3', label: 'BGE-M3', provider: '智源 BAAI', dimension: 1024 },
  { value: 'text-embedding-3-small', label: 'text-embedding-3-small', provider: 'OpenAI', dimension: 1536 },
]

const selectedModel = computed(() =>
  embeddingModels.find(m => m.value === form.embeddingModel),
)

const supportedTypes = ['.pdf', '.docx', '.doc', '.txt', '.md', '.csv', '.xlsx', '.json', '.html']

// ==================== 步骤 2：文件/URL ====================

const uploadTab = ref<'file' | 'url'>('file')
const urlInput = ref('')
const isDragOver = ref(false)

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function handleDrop(e: DragEvent) {
  isDragOver.value = false
  addFiles(Array.from(e.dataTransfer?.files || []))
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  addFiles(Array.from(input.files || []))
  input.value = ''
}

function addFiles(newFiles: File[]) {
  const existingNames = new Set(form.files.map(f => f.name))
  form.files.push(...newFiles.filter(f => !existingNames.has(f.name)))
}

function removeFile(index: number) {
  form.files.splice(index, 1)
}

function addUrl() {
  const url = urlInput.value.trim()
  if (!url || form.urls.includes(url)) return
  form.urls.push(url)
  urlInput.value = ''
}

function removeUrl(index: number) {
  form.urls.splice(index, 1)
}

// ==================== 校验 ====================

const step1Valid = computed(() => form.name.trim() !== '')
const step2Valid = computed(() => form.files.length > 0 || form.urls.length > 0)

const canNext = computed(() => {
  if (currentStep.value === 1) return step1Valid.value
  if (currentStep.value === 2) return step2Valid.value
  return true
})

// ==================== 导航 ====================

function handleNext() {
  if (!canNext.value) return
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

function handlePrev() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function handleSubmit() {
  toast.success('知识库创建成功', { description: form.name })
  router.push('/knowledge')
}

function handleCancel() {
  router.push('/knowledge')
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
        <h2 class="text-2xl font-semibold tracking-tight">创建知识库</h2>
        <p class="mt-0.5 text-sm text-muted-foreground">新建一个知识库用于存储和检索文档数据</p>
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

      <!-- ==================== 步骤 1：基础信息 ==================== -->
      <Card v-if="currentStep === 1" class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">基础信息</CardTitle>
          <CardDescription>设置知识库的名称、描述和类型</CardDescription>
        </CardHeader>
        <CardContent class="space-y-7">
          <!-- 图标 -->
          <div class="grid gap-2.5">
            <Label class="text-[13px] font-medium">图标</Label>
            <div class="flex items-center gap-2">
              <button
                v-for="icon in iconOptions"
                :key="icon"
                type="button"
                class="flex size-9 items-center justify-center rounded-xl border text-lg transition-all"
                :class="form.icon === icon
                  ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5 scale-110'
                  : 'border-border/40 hover:border-border/60 hover:bg-muted/20'"
                @click="form.icon = icon"
              >
                {{ icon }}
              </button>
            </div>
          </div>

          <Separator class="!bg-border/40" />

          <!-- 名称 -->
          <div class="grid gap-2.5">
            <div class="flex items-center justify-between">
              <Label for="kb-name" class="text-[13px] font-medium">
                知识库名称 <span class="text-destructive">*</span>
              </Label>
              <span class="text-xs text-muted-foreground">{{ form.name.length }} / 20</span>
            </div>
            <Input
              id="kb-name"
              v-model="form.name"
              placeholder="请输入知识库名称"
              :maxlength="20"
              class="h-10 rounded-xl"
            />
          </div>

          <!-- 描述 -->
          <div class="grid gap-2.5">
            <div class="flex items-center justify-between">
              <Label for="kb-desc" class="text-[13px] font-medium">知识库描述</Label>
              <span class="text-xs text-muted-foreground">{{ form.description.length }} / 200</span>
            </div>
            <textarea
              id="kb-desc"
              v-model="form.description"
              rows="3"
              :maxlength="200"
              placeholder="请输入知识库描述，介绍知识库中包含的内容，描述会用于指导智能体调用知识库"
              class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
            />
          </div>

          <Separator class="!bg-border/40" />

          <!-- 知识库类型 -->
          <div class="grid gap-3">
            <Label class="text-[13px] font-medium">知识库类型</Label>
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
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">{{ opt.label }}</span>
                    <div
                      v-if="form.type === opt.value"
                      class="size-4 rounded-full bg-primary flex items-center justify-center"
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

          <!-- 使用场景 -->
          <div class="grid gap-3">
            <Label class="text-[13px] font-medium">使用场景</Label>
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
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">{{ opt.label }}</span>
                    <div
                      v-if="form.scene === opt.value"
                      class="size-4 rounded-full bg-primary flex items-center justify-center"
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
        </CardContent>
      </Card>

      <!-- ==================== 步骤 2：选择数据 ==================== -->
      <Card v-if="currentStep === 2" class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">选择数据</CardTitle>
          <CardDescription>上传本地文件或通过 URL 导入数据到知识库</CardDescription>
        </CardHeader>
        <CardContent class="space-y-7">
          <!-- 导入方式切换 -->
          <div class="flex gap-1 rounded-xl bg-muted/40 p-1">
            <button
              type="button"
              :class="cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-all',
                uploadTab === 'file'
                  ? 'bg-background font-medium shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )"
              @click="uploadTab = 'file'"
            >
              <Upload class="size-3.5" />
              本地文件
            </button>
            <button
              type="button"
              :class="cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-all',
                uploadTab === 'url'
                  ? 'bg-background font-medium shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )"
              @click="uploadTab = 'url'"
            >
              <Globe class="size-3.5" />
              URL 导入
            </button>
          </div>

          <!-- 本地文件上传 -->
          <div v-if="uploadTab === 'file'" class="grid gap-5">
            <div
              :class="cn(
                'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-12 transition-colors',
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
                      :accept="supportedTypes.join(',')"
                      class="hidden"
                      @change="handleFileSelect"
                    >
                  </label>
                </p>
                <p class="mt-2 text-xs text-muted-foreground">
                  支持 {{ supportedTypes.join('、') }}，单文件最大 50 MB
                </p>
              </div>
            </div>

            <!-- 已选文件 -->
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
                    class="shrink-0 rounded p-0.5 text-muted-foreground hover:text-destructive transition-colors"
                    @click="removeFile(index)"
                  >
                    <X class="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- URL 导入 -->
          <div v-if="uploadTab === 'url'" class="grid gap-5">
            <div class="grid gap-2.5">
              <Label class="text-[13px] font-medium">网页 URL</Label>
              <div class="flex gap-2">
                <Input
                  v-model="urlInput"
                  placeholder="https://example.com/document"
                  class="flex-1 h-10 rounded-xl"
                  @keyup.enter="addUrl"
                />
                <Button type="button" variant="outline" size="icon" class="h-10 w-10 rounded-xl" :disabled="!urlInput.trim()" @click="addUrl">
                  <Plus class="size-4" />
                </Button>
              </div>
              <p class="text-xs text-muted-foreground">
                输入网页地址后回车添加，系统将自动抓取页面内容
              </p>
            </div>

            <div v-if="form.urls.length > 0" class="grid gap-2.5">
              <span class="text-sm font-medium">
                已添加 {{ form.urls.length }} 个 URL
              </span>
              <div class="max-h-[260px] space-y-1.5 overflow-y-auto">
                <div
                  v-for="(url, index) in form.urls"
                  :key="url"
                  class="flex items-center gap-2 rounded-xl border border-border/40 bg-card/80 px-3 py-2"
                >
                  <Globe class="size-4 shrink-0 text-muted-foreground" />
                  <span class="flex-1 truncate text-sm">{{ url }}</span>
                  <button
                    type="button"
                    class="shrink-0 rounded p-0.5 text-muted-foreground hover:text-destructive transition-colors"
                    @click="removeUrl(index)"
                  >
                    <X class="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 汇总信息 -->
          <div class="flex items-center gap-2 rounded-xl bg-muted/30 px-5 py-4">
            <span class="text-xs text-muted-foreground">待导入：</span>
            <Badge v-if="form.files.length > 0" variant="secondary" class="text-[10px] tracking-wide">
              {{ form.files.length }} 个文件
            </Badge>
            <Badge v-if="form.urls.length > 0" variant="secondary" class="text-[10px] tracking-wide">
              {{ form.urls.length }} 个 URL
            </Badge>
            <span v-if="!step2Valid" class="text-xs text-muted-foreground">暂无内容，可在创建后上传</span>
          </div>
        </CardContent>
      </Card>

      <!-- ==================== 步骤 3：索引设置 ==================== -->
      <Card v-if="currentStep === 3" class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-xl shadow-xs">
        <CardHeader>
          <CardTitle class="text-[15px]">索引设置</CardTitle>
          <CardDescription>配置 Embedding 向量模型与文档分段策略</CardDescription>
        </CardHeader>
        <CardContent class="space-y-7">
          <!-- Embedding 模型 -->
          <div class="grid gap-3">
            <Label class="text-[13px] font-medium">Embedding 模型</Label>
            <Select v-model="form.embeddingModel">
              <SelectTrigger class="h-10 rounded-xl">
                <SelectValue placeholder="选择 Embedding 模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="model in embeddingModels"
                  :key="model.value"
                  :value="model.value"
                >
                  <div class="flex items-center gap-2">
                    <span>{{ model.label }}</span>
                    <span class="text-xs text-muted-foreground">{{ model.provider }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div v-if="selectedModel" class="flex items-center gap-4 rounded-xl bg-muted/30 px-5 py-4">
              <div class="space-y-0.5">
                <p class="text-xs text-muted-foreground">向量维度</p>
                <p class="font-mono text-sm font-medium">{{ selectedModel.dimension }}</p>
              </div>
              <Separator orientation="vertical" class="!h-8" />
              <div class="space-y-0.5">
                <p class="text-xs text-muted-foreground">提供方</p>
                <p class="text-sm font-medium">{{ selectedModel.provider }}</p>
              </div>
            </div>
          </div>

          <Separator class="!bg-border/40" />

          <!-- 分段策略 -->
          <div class="grid gap-3">
            <Label class="text-[13px] font-medium">分段策略</Label>
            <div class="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                :class="cn(
                  'rounded-xl border p-5 text-left transition-all',
                  form.chunkStrategy === 'auto'
                    ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5'
                    : 'border-border/40 hover:border-border/60 hover:bg-muted/20',
                )"
                @click="form.chunkStrategy = 'auto'"
              >
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">智能分段</span>
                  <div
                    v-if="form.chunkStrategy === 'auto'"
                    class="size-4 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check class="size-2.5 text-primary-foreground" />
                  </div>
                </div>
                <p class="mt-1.5 text-xs text-muted-foreground">
                  系统根据文档格式自动选择最优分段方式
                </p>
              </button>
              <button
                type="button"
                :class="cn(
                  'rounded-xl border p-5 text-left transition-all',
                  form.chunkStrategy === 'custom'
                    ? 'border-primary/30 bg-primary/[0.03] shadow-xs shadow-primary/5'
                    : 'border-border/40 hover:border-border/60 hover:bg-muted/20',
                )"
                @click="form.chunkStrategy = 'custom'"
              >
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">自定义</span>
                  <div
                    v-if="form.chunkStrategy === 'custom'"
                    class="size-4 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check class="size-2.5 text-primary-foreground" />
                  </div>
                </div>
                <p class="mt-1.5 text-xs text-muted-foreground">
                  手动指定分段长度与重叠长度
                </p>
              </button>
            </div>

            <!-- 自定义参数 -->
            <div v-if="form.chunkStrategy === 'custom'" class="grid grid-cols-2 gap-4 rounded-xl bg-muted/30 px-5 py-5">
              <div class="grid gap-2.5">
                <Label for="chunk-size" class="text-[13px] font-medium">分段长度 (Token)</Label>
                <Input
                  id="chunk-size"
                  v-model.number="form.chunkSize"
                  type="number"
                  :min="100"
                  :max="2000"
                  placeholder="500"
                  class="h-10 rounded-xl"
                />
              </div>
              <div class="grid gap-2.5">
                <Label for="chunk-overlap" class="text-[13px] font-medium">重叠长度 (Token)</Label>
                <Input
                  id="chunk-overlap"
                  v-model.number="form.chunkOverlap"
                  type="number"
                  :min="0"
                  :max="500"
                  placeholder="50"
                  class="h-10 rounded-xl"
                />
              </div>
              <p class="col-span-2 text-xs text-muted-foreground">
                每段约 {{ form.chunkSize }} Token，相邻段重叠 {{ form.chunkOverlap }} Token
              </p>
            </div>
          </div>

          <Separator class="!bg-border/40" />

          <!-- 创建预览 -->
          <div class="rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 p-5 space-y-4">
            <h4 class="text-[15px] font-medium">创建预览</h4>
            <div class="grid gap-3 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">知识库名称</span>
                <span class="font-medium">{{ form.name || '—' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">知识库类型</span>
                <span class="font-medium">{{ typeOptions.find(t => t.value === form.type)?.label }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Embedding 模型</span>
                <span class="font-mono font-medium">{{ form.embeddingModel }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">分段策略</span>
                <span class="font-medium">{{ form.chunkStrategy === 'auto' ? '智能分段' : `自定义 (${form.chunkSize}/${form.chunkOverlap})` }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">待导入数据</span>
                <span class="font-medium">{{ form.files.length }} 文件 · {{ form.urls.length }} URL</span>
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
          <Button v-if="currentStep < 3" :disabled="!canNext" @click="handleNext">
            下一步
            <ArrowRight class="ml-2 size-4" />
          </Button>
          <Button v-if="currentStep === 3" @click="handleSubmit">
            <Check class="mr-2 size-4" />
            完成创建
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
