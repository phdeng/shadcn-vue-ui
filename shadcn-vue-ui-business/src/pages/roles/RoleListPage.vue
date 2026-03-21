<script setup lang="ts">
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Separator } from '@ui/components/ui/separator'
import { Skeleton } from '@ui/components/ui/skeleton'
import {
  Clock,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
  Users,
} from 'lucide-vue-next'
/**
 * @description 角色管理页 — 卡片式布局，配置角色权限与访问控制
 * @author Timon
 */
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

// 骨架屏加载状态
const loading = ref(true)
onMounted(() => {
  setTimeout(() => { loading.value = false }, 600)
})

// ==================== 类型定义 ====================

/** 角色类型：系统内置 / 自定义 */
type RoleType = 'system' | 'custom'

/** 角色数据结构 */
interface Role {
  id: number
  name: string
  description: string
  type: RoleType
  permissionCount: number
  userCount: number
  updatedAt: string
}

// ==================== 模拟数据 ====================

const roles = ref<Role[]>([
  {
    id: 1,
    name: '超级管理员',
    description: '拥有系统所有功能的完整访问权限，可管理用户、角色、系统配置等',
    type: 'system',
    permissionCount: 18,
    userCount: 2,
    updatedAt: '2026-03-20 14:30',
  },
  {
    id: 2,
    name: '编辑',
    description: '负责内容编辑与发布，可管理文章、素材库与内容审核流程',
    type: 'custom',
    permissionCount: 12,
    userCount: 5,
    updatedAt: '2026-03-19 10:15',
  },
  {
    id: 3,
    name: '审核员',
    description: '负责审核用户提交的内容与订单，拥有审批与驳回权限',
    type: 'custom',
    permissionCount: 8,
    userCount: 3,
    updatedAt: '2026-03-18 16:42',
  },
  {
    id: 4,
    name: '运营',
    description: '负责日常运营工作，可查看数据报表、管理活动与推送通知',
    type: 'custom',
    permissionCount: 10,
    userCount: 4,
    updatedAt: '2026-03-17 09:20',
  },
  {
    id: 5,
    name: '访客',
    description: '仅拥有只读权限，可浏览公开内容与基础数据看板',
    type: 'system',
    permissionCount: 3,
    userCount: 0,
    updatedAt: '2026-03-15 11:00',
  },
])

// ==================== 角色类型配置 ====================

const typeConfig: Record<RoleType, { label: string, class: string }> = {
  system: {
    label: '系统角色',
    class: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
  },
  custom: {
    label: '自定义角色',
    class: '',
  },
}

// ==================== 对话框状态 ====================
const showDeleteDialog = ref(false)
const deleteTarget = ref<Role | null>(null)

// ==================== 事件处理 ====================

/** 新增角色 */
function handleCreateRole() {
  toast.info('新增角色', { description: '角色创建功能即将上线' })
}

/** 编辑角色 */
function handleEdit(role: Role) {
  toast.info('编辑角色', { description: `正在编辑角色「${role.name}」` })
}

/** 管理权限 */
function handleManagePermissions(role: Role) {
  toast.info('管理权限', { description: `角色「${role.name}」权限配置功能即将上线` })
}

/** 打开删除确认 */
function handleDeleteConfirm(role: Role) {
  deleteTarget.value = role
  showDeleteDialog.value = true
}

/** 执行删除 */
function handleDelete() {
  if (!deleteTarget.value) return
  const name = deleteTarget.value.name
  roles.value = roles.value.filter(r => r.id !== deleteTarget.value!.id)
  showDeleteDialog.value = false
  deleteTarget.value = null
  toast.success('已删除', { description: name })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 骨架屏 -->
    <template v-if="loading">
      <div class="flex items-end justify-between">
        <div class="space-y-2">
          <Skeleton class="h-8 w-32" />
          <Skeleton class="h-4 w-48" />
        </div>
        <Skeleton class="h-9 w-24 rounded-md" />
      </div>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card v-for="i in 5" :key="i" class="border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs">
          <CardHeader class="pb-3">
            <Skeleton class="h-5 w-24" />
            <Skeleton class="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent class="pb-3">
            <div class="flex items-center gap-3">
              <Skeleton class="h-5 w-20 rounded-full" />
              <Skeleton class="h-5 w-20 rounded-full" />
              <Skeleton class="h-5 w-20 rounded-full ml-auto" />
            </div>
          </CardContent>
          <CardFooter class="pt-0">
            <Skeleton class="h-4 w-40" />
          </CardFooter>
        </Card>
      </div>
    </template>

    <template v-else>
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          角色管理
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          配置角色权限与访问控制
        </p>
      </div>
      <Button size="sm" @click="handleCreateRole">
        <Plus class="size-4" />
        新增角色
      </Button>
    </div>

    <!-- 角色卡片网格 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="role in roles"
        :key="role.id"
        class="group border border-border/40 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xs transition-all hover:shadow-md"
      >
        <CardHeader class="pb-3">
          <div class="flex items-start justify-between gap-3">
            <!-- 名称 + 描述 -->
            <div class="min-w-0 space-y-1">
              <CardTitle class="text-sm font-semibold leading-tight">
                {{ role.name }}
              </CardTitle>
              <p class="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {{ role.description }}
              </p>
            </div>

            <!-- 更多操作下拉菜单 -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontal class="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-36">
                <DropdownMenuItem @click="handleEdit(role)">
                  <Pencil class="size-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleManagePermissions(role)">
                  <Shield class="size-4" />
                  管理权限
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  class="text-destructive focus:text-destructive"
                  @click="handleDeleteConfirm(role)"
                >
                  <Trash2 class="size-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <!-- 权限数 + 用户数 + 类型标签 -->
        <CardContent class="pb-3">
          <div class="flex items-center gap-3">
            <!-- 权限数量 -->
            <Badge variant="secondary" class="text-[11px] gap-1 px-2 py-0">
              <Shield class="size-3" />
              {{ role.permissionCount }} 项权限
            </Badge>
            <!-- 用户数量 -->
            <Badge variant="secondary" class="text-[11px] gap-1 px-2 py-0">
              <Users class="size-3" />
              {{ role.userCount }} 名用户
            </Badge>
            <!-- 角色类型 -->
            <Badge
              variant="outline"
              :class="typeConfig[role.type].class"
              class="ml-auto text-[11px] px-2 py-0"
            >
              {{ typeConfig[role.type].label }}
            </Badge>
          </div>
        </CardContent>

        <!-- 底栏：最后更新时间 -->
        <CardFooter class="flex-col items-stretch gap-3 pt-0">
          <Separator />
          <div class="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock class="size-3" />
            最后更新 {{ role.updatedAt }}
          </div>
        </CardFooter>
      </Card>
    </div>

    <!-- 空状态 -->
    <div v-if="roles.length === 0" class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/50 py-16">
      <Search class="size-10 text-muted-foreground/30" />
      <div class="text-center">
        <p class="text-sm font-medium text-muted-foreground">未找到匹配的角色</p>
        <p class="mt-1 text-xs text-muted-foreground/60">尝试调整搜索关键词或筛选条件</p>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除角色"
      :description="`确定要删除角色「${deleteTarget?.name}」吗？该角色下的用户将失去对应权限。`"
      confirm-text="删除"
      @confirm="handleDelete"
    />
    </template>
  </div>
</template>
