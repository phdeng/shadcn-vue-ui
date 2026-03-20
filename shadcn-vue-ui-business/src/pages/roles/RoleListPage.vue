<script setup lang="ts">
/**
 * @description 角色管理页 — 卡片式布局，配置角色权限与访问控制
 * @author Timon
 */
import { ref } from 'vue'
import {
  Plus,
  MoreHorizontal,
  Shield,
  Users,
  Clock,
  Pencil,
  Copy,
  Trash2,
} from 'lucide-vue-next'
import { Button } from '@ui/components/ui/button'
import { Badge } from '@ui/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@ui/components/ui/card'
import { Separator } from '@ui/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'

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

const typeConfig: Record<RoleType, { label: string; class: string }> = {
  system: {
    label: '系统角色',
    class: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
  },
  custom: {
    label: '自定义角色',
    class: '',
  },
}

// ==================== 事件处理 ====================

/** 下拉菜单操作 */
function handleMenuAction(action: string, role: Role) {
  console.log(`[RoleListPage] ${action}:`, role.id, role.name)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">角色管理</h2>
        <p class="mt-1 text-sm text-muted-foreground">配置角色权限与访问控制</p>
      </div>
      <Button size="sm">
        <Plus class="size-4" />
        新增角色
      </Button>
    </div>

    <!-- 角色卡片网格 -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="role in roles"
        :key="role.id"
        class="group border-0 shadow-sm transition-all hover:shadow-md"
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
                <DropdownMenuItem @click="handleMenuAction('编辑', role)">
                  <Pencil class="size-4" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleMenuAction('复制', role)">
                  <Copy class="size-4" />
                  复制
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  class="text-destructive focus:text-destructive"
                  @click="handleMenuAction('删除', role)"
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
  </div>
</template>
