<script setup lang="ts">
/**
 * @description 用户详情页 — 展示用户基本信息、操作记录等详细内容
 * @author Timon
 */
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Pencil } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/components/ui/card'
import { Button } from '@ui/components/ui/button'
import { Badge } from '@ui/components/ui/badge'
import { Avatar, AvatarFallback } from '@ui/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/components/ui/table'
import { getUserById } from '@/mocks/business'

// ==================== 路由 ====================
const router = useRouter()
const route = useRoute()

// ==================== 用户数据 ====================
const user = computed(() => {
  const id = Number(route.params.id)
  return getUserById(id)
})

// ==================== 角色颜色映射 ====================
const roleClass: Record<string, string> = {
  '管理员': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  '编辑': 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800',
  '审核': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
  '普通用户': 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-700',
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

// ==================== 操作记录模拟数据 ====================
interface OperationRecord {
  /** 操作时间 */
  time: string
  /** 操作描述 */
  action: string
  /** 来源 IP */
  ip: string
  /** 操作状态 */
  status: '成功' | '失败'
}

const operationRecords: OperationRecord[] = [
  { time: '2026-03-20 14:32:10', action: '登录系统', ip: '192.168.1.101', status: '成功' },
  { time: '2026-03-19 09:15:42', action: '修改个人信息', ip: '192.168.1.101', status: '成功' },
  { time: '2026-03-18 16:48:05', action: '重置密码', ip: '10.0.0.55', status: '成功' },
  { time: '2026-03-17 11:22:33', action: '导出数据报表', ip: '192.168.1.101', status: '失败' },
  { time: '2026-03-16 08:05:18', action: '登录系统', ip: '172.16.0.88', status: '成功' },
]

/** 返回上一页 */
function handleBack() {
  router.back()
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" @click="handleBack">
          <ArrowLeft class="size-4" />
        </Button>

        <template v-if="user">
          <h2 class="text-2xl font-semibold tracking-tight">{{ user.name }}</h2>
          <Avatar class="size-9">
            <AvatarFallback
              :class="avatarColors[(user.id - 1) % avatarColors.length]"
              class="text-sm font-medium"
            >
              {{ user.avatar }}
            </AvatarFallback>
          </Avatar>
          <Badge variant="outline" :class="roleClass[user.role]">
            {{ user.role }}
          </Badge>
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
        </template>
        <template v-else>
          <h2 class="text-2xl font-semibold tracking-tight text-muted-foreground">用户不存在</h2>
        </template>
      </div>

      <Button v-if="user" size="sm">
        <Pencil class="size-4" />
        编辑
      </Button>
    </div>

    <!-- 用户信息区域 -->
    <template v-if="user">
      <!-- 基本信息卡片 -->
      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-x-12 gap-y-5">
            <div class="flex flex-col gap-1">
              <span class="text-sm text-muted-foreground">邮箱</span>
              <span class="text-sm font-medium">{{ user.email }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-sm text-muted-foreground">手机</span>
              <span class="text-sm font-medium">{{ user.phone }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-sm text-muted-foreground">部门</span>
              <span class="text-sm font-medium">{{ user.department }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-sm text-muted-foreground">角色</span>
              <span class="text-sm font-medium">{{ user.role }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-sm text-muted-foreground">注册时间</span>
              <span class="text-sm font-medium">{{ user.createdAt }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-sm text-muted-foreground">最后登录</span>
              <span class="text-sm font-medium">2026-03-20 14:32:10</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 操作记录卡片 -->
      <Card class="border-0 shadow-sm">
        <CardHeader>
          <CardTitle class="text-base">操作记录</CardTitle>
        </CardHeader>
        <CardContent class="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>操作</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(record, index) in operationRecords" :key="index">
                <TableCell class="text-muted-foreground">{{ record.time }}</TableCell>
                <TableCell>{{ record.action }}</TableCell>
                <TableCell class="font-mono text-sm text-muted-foreground">{{ record.ip }}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    :class="record.status === '成功'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300'"
                  >
                    {{ record.status }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
