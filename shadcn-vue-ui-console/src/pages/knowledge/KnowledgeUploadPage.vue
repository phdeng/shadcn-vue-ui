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
  FileText,
  Globe,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-vue-next'
/**
 * @description 上传文档页面 — 向知识库添加文档数据
 * @author Timon
 */
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const kbId = route.params.id as string

// 模拟知识库名称
const kbName = '产品文档'

// ==================== 状态 ====================

const activeTab = ref<'file' | 'url'>('file')
const files = ref<File[]>([])
const urls = ref<string[]>([])
const urlInput = ref('')
const isDragOver = ref(false)

const supportedTypes = ['.pdf', '.docx', '.doc', '.txt', '.md', '.csv', '.xlsx', '.json', '.html']

const isValid = computed(() => files.value.length > 0 || urls.value.length > 0)

// ==================== 文件处理 ====================

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
  const existingNames = new Set(files.value.map(f => f.name))
  files.value.push(...newFiles.filter(f => !existingNames.has(f.name)))
}

function removeFile(index: number) {
  files.value.splice(index, 1)
}

function addUrl() {
  const url = urlInput.value.trim()
  if (!url || urls.value.includes(url)) return
  urls.value.push(url)
  urlInput.value = ''
}

function removeUrl(index: number) {
  urls.value.splice(index, 1)
}

// ==================== 提交 ====================

function handleSubmit() {
  if (!isValid.value) return
  const total = files.value.length + urls.value.length
  toast.success(`已提交 ${total} 项导入任务`, { description: '文档将在后台进行解析和索引' })
  router.push(`/knowledge/${kbId}`)
}

function handleCancel() {
  router.push(`/knowledge/${kbId}`)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 头部 -->
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" class="shrink-0 rounded-xl hover:bg-muted/40 transition-all duration-300" @click="handleCancel">
        <ArrowLeft class="size-4" />
      </Button>
      <div>
        <h2 class="text-2xl font-bold tracking-tight">上传文档</h2>
        <p class="mt-1 text-[13px] text-muted-foreground">
          向知识库「{{ kbName }}」添加文档数据
        </p>
      </div>
    </div>

    <div class="mx-auto w-full max-w-3xl">
      <Card class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-xl shadow-xs">
        <CardHeader class="space-y-1.5">
          <CardTitle class="text-base font-semibold">选择数据来源</CardTitle>
          <CardDescription class="text-[13px]">支持本地文件上传或 URL 导入</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- 导入方式切换 -->
          <div class="flex gap-1 rounded-xl bg-muted/40 p-1">
            <button
              type="button"
              :class="cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-300',
                activeTab === 'file'
                  ? 'bg-background font-medium shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )"
              @click="activeTab = 'file'"
            >
              <Upload class="size-3.5" />
              本地文件
            </button>
            <button
              type="button"
              :class="cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-300',
                activeTab === 'url'
                  ? 'bg-background font-medium shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )"
              @click="activeTab = 'url'"
            >
              <Globe class="size-3.5" />
              URL 导入
            </button>
          </div>

          <!-- 本地文件上传 -->
          <div v-if="activeTab === 'file'" class="grid gap-5">
            <div
              :class="cn(
                'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 transition-all duration-300',
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border/40 hover:border-primary/30 hover:bg-muted/10',
              )"
              @dragover.prevent="isDragOver = true"
              @dragleave="isDragOver = false"
              @drop.prevent="handleDrop"
            >
              <div class="flex size-16 items-center justify-center rounded-2xl bg-muted/40">
                <Upload class="size-7 text-muted-foreground/60" />
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
                <p class="mt-2 text-[13px] text-muted-foreground/60">
                  支持 {{ supportedTypes.join('、') }}，单文件最大 50 MB
                </p>
              </div>
            </div>

            <!-- 已选文件列表 -->
            <div v-if="files.length > 0" class="grid gap-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">
                  已选择 {{ files.length }} 个文件
                </span>
                <Button variant="ghost" size="sm" class="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 transition-all duration-300" @click="files = []">
                  <Trash2 class="mr-1 size-3" />
                  全部清除
                </Button>
              </div>
              <div class="max-h-[320px] space-y-2 overflow-y-auto">
                <div
                  v-for="(file, index) in files"
                  :key="file.name"
                  class="flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 px-4 py-3 transition-all duration-300 hover:border-border/60"
                >
                  <FileText class="size-4 shrink-0 text-muted-foreground/60" />
                  <span class="flex-1 truncate text-sm">{{ file.name }}</span>
                  <span class="shrink-0 text-[13px] text-muted-foreground">{{ formatSize(file.size) }}</span>
                  <button
                    type="button"
                    class="shrink-0 rounded-lg p-1 text-muted-foreground hover:text-destructive hover:bg-muted/40 transition-all duration-300"
                    @click="removeFile(index)"
                  >
                    <X class="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- URL 导入 -->
          <div v-if="activeTab === 'url'" class="grid gap-5">
            <div class="grid gap-3">
              <Label class="text-[13px]">网页 URL</Label>
              <div class="flex gap-2.5">
                <Input
                  v-model="urlInput"
                  placeholder="https://example.com/document"
                  class="flex-1 h-9 rounded-xl"
                  @keyup.enter="addUrl"
                />
                <Button type="button" variant="outline" size="icon" class="shrink-0 rounded-xl h-9 w-9 transition-all duration-300" :disabled="!urlInput.trim()" @click="addUrl">
                  <Plus class="size-4" />
                </Button>
              </div>
              <p class="text-[13px] text-muted-foreground/60">
                输入网页地址后回车添加，系统将自动抓取页面内容
              </p>
            </div>

            <div v-if="urls.length > 0" class="grid gap-3">
              <span class="text-sm font-medium">
                已添加 {{ urls.length }} 个 URL
              </span>
              <div class="max-h-[320px] space-y-2 overflow-y-auto">
                <div
                  v-for="(url, index) in urls"
                  :key="url"
                  class="flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 px-4 py-3 transition-all duration-300 hover:border-border/60"
                >
                  <Globe class="size-4 shrink-0 text-muted-foreground/60" />
                  <span class="flex-1 truncate text-sm">{{ url }}</span>
                  <button
                    type="button"
                    class="shrink-0 rounded-lg p-1 text-muted-foreground hover:text-destructive hover:bg-muted/40 transition-all duration-300"
                    @click="removeUrl(index)"
                  >
                    <X class="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Separator class="border-border/40" />

          <!-- 汇总信息 -->
          <div class="flex items-center gap-2.5 rounded-xl bg-muted/20 px-5 py-4">
            <span class="text-[13px] text-muted-foreground">待导入：</span>
            <Badge v-if="files.length > 0" variant="secondary" class="bg-muted/40 border-0 text-[10px] tracking-wide">
              {{ files.length }} 个文件
            </Badge>
            <Badge v-if="urls.length > 0" variant="secondary" class="bg-muted/40 border-0 text-[10px] tracking-wide">
              {{ urls.length }} 个 URL
            </Badge>
            <span v-if="!isValid" class="text-[13px] text-muted-foreground/60">暂无内容</span>
          </div>
        </CardContent>
      </Card>

      <!-- 底部操作栏 -->
      <div class="flex items-center justify-between pt-6">
        <Button variant="outline" class="rounded-xl transition-all duration-300" @click="handleCancel">
          取消
        </Button>
        <Button class="rounded-xl transition-all duration-300" :disabled="!isValid" @click="handleSubmit">
          <Upload class="mr-2 size-4" />
          开始导入
        </Button>
      </div>
    </div>
  </div>
</template>
