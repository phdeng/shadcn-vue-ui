<script setup lang="ts">
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar'
import { Badge } from '@ui/components/ui/badge'
import { Button } from '@ui/components/ui/button'
import { Card, CardContent } from '@ui/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { Input } from '@ui/components/ui/input'
import { Separator } from '@ui/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { Ban, KeyRound, MoreHorizontal, Pencil, Plus, Search, Trash2 } from 'lucide-vue-next'
/**
 * @description 用户管理页 — 管理系统用户、角色权限与组织架构
 * @author Timon
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

// ==================== 用户模拟数据 ====================
interface User {
  id: number
  name: string
  avatar: string
  email: string
  role: '管理员' | '编辑' | '审核' | '普通用户'
  department: string
  status: 'active' | 'disabled'
  createdAt: string
}

const users: User[] = [
  { id: 1, name: '张明远', avatar: '张', email: 'zhangmy@example.com', role: '管理员', department: '技术部', status: 'active', createdAt: '2025-03-12' },
  { id: 2, name: '李思琪', avatar: '李', email: 'lisq@example.com', role: '编辑', department: '产品部', status: 'active', createdAt: '2025-05-08' },
  { id: 3, name: '王浩然', avatar: '王', email: 'wanghr@example.com', role: '审核', department: '运营部', status: 'active', createdAt: '2025-06-21' },
  { id: 4, name: '赵雪婷', avatar: '赵', email: 'zhaoxt@example.com', role: '普通用户', department: '市场部', status: 'disabled', createdAt: '2025-07-14' },
  { id: 5, name: '陈嘉伟', avatar: '陈', email: 'chenjw@example.com', role: '编辑', department: '技术部', status: 'active', createdAt: '2025-08-03' },
  { id: 6, name: '刘晓峰', avatar: '刘', email: 'liuxf@example.com', role: '管理员', department: '产品部', status: 'active', createdAt: '2025-09-19' },
  { id: 7, name: '周美玲', avatar: '周', email: 'zhouml@example.com', role: '审核', department: '运营部', status: 'disabled', createdAt: '2025-10-27' },
  { id: 8, name: '吴俊杰', avatar: '吴', email: 'wujj@example.com', role: '普通用户', department: '市场部', status: 'active', createdAt: '2026-01-05' },
]

// ==================== 路由 ====================
const router = useRouter()

// ==================== 搜索与筛选 ====================
const searchQuery = ref('')
const activeTab = ref('all')

const filteredUsers = computed(() => {
  let result = users

  // 按状态筛选
  if (activeTab.value === 'active') {
    result = result.filter(u => u.status === 'active')
  }
  else if (activeTab.value === 'disabled') {
    result = result.filter(u => u.status === 'disabled')
  }

  // 按关键词搜索
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      u =>
        u.name.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q)
        || u.department.toLowerCase().includes(q),
    )
  }

  return result
})

// ==================== 角色颜色映射 ====================
const roleClass: Record<string, string> = {
  管理员: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  编辑: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800',
  审核: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  普通用户: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-700',
}

// ==================== 头像背景色映射 ====================
const avatarColors = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300',
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">
          用户管理
        </h2>
        <p class="mt-1 text-sm text-muted-foreground">
          管理系统用户、角色权限与组织架构
        </p>
      </div>
      <Button size="sm">
        <Plus class="size-4" />
        新增用户
      </Button>
    </div>

    <!-- 工具栏：搜索 + Tabs 筛选 + 计数 -->
    <div class="flex items-center justify-between gap-4">
      <div class="relative w-64">
        <Search class="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="搜索用户名、邮箱、部门…"
          class="pl-8"
        />
      </div>

      <div class="flex items-center gap-3">
        <Tabs v-model="activeTab">
          <TabsList>
            <TabsTrigger value="all">
              全部
            </TabsTrigger>
            <TabsTrigger value="active">
              活跃
            </TabsTrigger>
            <TabsTrigger value="disabled">
              禁用
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Separator orientation="vertical" class="h-5" />
        <span class="text-sm text-muted-foreground">共 {{ filteredUsers.length }} 位用户</span>
      </div>
    </div>

    <!-- 表格区域 -->
    <Card class="border-0 shadow-sm">
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[200px]">
                用户名
              </TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>部门</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>注册时间</TableHead>
              <TableHead class="w-[60px] text-right">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in filteredUsers" :key="user.id" class="cursor-pointer" @click="router.push(`/users/${user.id}`)">
              <!-- 用户名 + 头像 -->
              <TableCell>
                <div class="flex items-center gap-3">
                  <Avatar class="size-8">
                    <AvatarFallback :class="avatarColors[(user.id - 1) % avatarColors.length]" class="text-xs font-medium">
                      {{ user.avatar }}
                    </AvatarFallback>
                  </Avatar>
                  <span class="font-medium">{{ user.name }}</span>
                </div>
              </TableCell>

              <!-- 邮箱 -->
              <TableCell class="text-muted-foreground">
                {{ user.email }}
              </TableCell>

              <!-- 角色 -->
              <TableCell>
                <Badge variant="outline" :class="roleClass[user.role]">
                  {{ user.role }}
                </Badge>
              </TableCell>

              <!-- 部门 -->
              <TableCell>{{ user.department }}</TableCell>

              <!-- 状态 -->
              <TableCell>
                <Badge
                  variant="outline"
                  :class="user.status === 'active'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400'"
                >
                  <span
                    class="mr-1 inline-block size-1.5 rounded-full"
                    :class="user.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'"
                  />
                  {{ user.status === 'active' ? '活跃' : '禁用' }}
                </Badge>
              </TableCell>

              <!-- 注册时间 -->
              <TableCell class="text-muted-foreground">
                {{ user.createdAt }}
              </TableCell>

              <!-- 操作下拉菜单 -->
              <TableCell class="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal class="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" class="w-36">
                    <DropdownMenuItem>
                      <Pencil class="size-4" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <KeyRound class="size-4" />
                      重置密码
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Ban class="size-4" />
                      禁用
                    </DropdownMenuItem>
                    <DropdownMenuItem class="text-destructive focus:text-destructive">
                      <Trash2 class="size-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
