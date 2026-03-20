<script setup lang="ts">
import { Button } from '@ui/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { Bell, Save, Settings, Shield } from 'lucide-vue-next'
/**
 * @description 系统设置页 — 平台配置与参数管理
 * @author Timon
 */
import { ref } from 'vue'
import { toast } from 'vue-sonner'

// ==================== 基本设置 ====================
const platformName = ref('shadcn-vue-ui 业务管理后台')
const platformDescription = ref('面向通用业务管理与运营后台，提供用户、订单、内容、数据报表等全方位管理能力。')
const defaultLanguage = ref('zh-CN')
const timezone = ref('Asia/Shanghai')

// ==================== 安全设置 ====================
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const sessionTimeout = ref('30')
const enforcePasswordPolicy = ref(true)

// ==================== 通知设置 ====================
const emailNotification = ref(true)
const smsNotification = ref(false)
const systemAnnouncement = ref(true)

/**
 * 保存基本设置
 */
function saveBasicSettings() {
  toast.success('基本设置已保存', {
    description: '平台配置已更新',
  })
}

/**
 * 保存安全设置
 */
function saveSecuritySettings() {
  // 密码校验
  if (newPassword.value && newPassword.value !== confirmPassword.value) {
    toast.error('保存失败', {
      description: '两次输入的新密码不一致',
    })
    return
  }

  if (newPassword.value && !currentPassword.value) {
    toast.error('保存失败', {
      description: '请输入当前密码',
    })
    return
  }

  // 重置密码字段
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''

  toast.success('安全设置已保存', {
    description: '安全配置已更新',
  })
}

/**
 * 保存通知设置
 */
function saveNotificationSettings() {
  toast.success('通知设置已保存', {
    description: '通知偏好已更新',
  })
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 页面头部 -->
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">
        系统设置
      </h1>
      <p class="text-sm text-muted-foreground leading-relaxed">
        平台配置与参数管理
      </p>
    </div>

    <!-- 设置标签页 -->
    <Tabs default-value="basic" class="w-full">
      <TabsList class="h-10">
        <TabsTrigger value="basic" class="gap-1.5 px-4 text-sm">
          <Settings class="size-4" />
          基本设置
        </TabsTrigger>
        <TabsTrigger value="security" class="gap-1.5 px-4 text-sm">
          <Shield class="size-4" />
          安全设置
        </TabsTrigger>
        <TabsTrigger value="notification" class="gap-1.5 px-4 text-sm">
          <Bell class="size-4" />
          通知设置
        </TabsTrigger>
      </TabsList>

      <!-- Tab 1: 基本设置 -->
      <TabsContent value="basic" class="mt-6">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <CardTitle class="text-base">
              基本设置
            </CardTitle>
            <CardDescription>配置平台名称、描述、语言与时区</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 平台名称 -->
            <div class="grid gap-2">
              <Label for="platform-name">平台名称</Label>
              <Input
                id="platform-name"
                v-model="platformName"
                placeholder="请输入平台名称"
                class="max-w-md"
              />
              <p class="text-xs text-muted-foreground">
                显示在管理后台标题栏和登录页面的品牌名称
              </p>
            </div>

            <!-- 平台描述 -->
            <div class="grid gap-2">
              <Label for="platform-desc">平台描述</Label>
              <textarea
                id="platform-desc"
                v-model="platformDescription"
                rows="3"
                placeholder="请输入平台描述"
                class="border-input bg-transparent placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full max-w-md rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <p class="text-xs text-muted-foreground">
                用于描述平台用途，展示在概览页和外部集成中
              </p>
            </div>

            <Separator />

            <!-- 默认语言 -->
            <div class="grid gap-2">
              <Label for="default-language">默认语言</Label>
              <Select v-model="defaultLanguage">
                <SelectTrigger class="max-w-md">
                  <SelectValue placeholder="选择默认语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-CN">
                    中文（简体）
                  </SelectItem>
                  <SelectItem value="zh-TW">
                    中文（繁体）
                  </SelectItem>
                  <SelectItem value="en-US">
                    English
                  </SelectItem>
                  <SelectItem value="ja-JP">
                    日本語
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">
                管理后台界面的默认显示语言
              </p>
            </div>

            <!-- 时区 -->
            <div class="grid gap-2">
              <Label for="timezone">时区</Label>
              <Select v-model="timezone">
                <SelectTrigger class="max-w-md">
                  <SelectValue placeholder="选择时区" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Shanghai">
                    Asia/Shanghai（UTC+8）
                  </SelectItem>
                  <SelectItem value="Asia/Tokyo">
                    Asia/Tokyo（UTC+9）
                  </SelectItem>
                  <SelectItem value="America/New_York">
                    America/New_York（UTC-5）
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    America/Los_Angeles（UTC-8）
                  </SelectItem>
                  <SelectItem value="Europe/London">
                    Europe/London（UTC+0）
                  </SelectItem>
                  <SelectItem value="Europe/Berlin">
                    Europe/Berlin（UTC+1）
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">
                影响报表统计、订单时间等业务数据的时间基准
              </p>
            </div>

            <Separator />

            <!-- 保存按钮 -->
            <div class="flex justify-end">
              <Button @click="saveBasicSettings">
                <Save class="mr-2 size-4" />
                保存
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Tab 2: 安全设置 -->
      <TabsContent value="security" class="mt-6">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <CardTitle class="text-base">
              安全设置
            </CardTitle>
            <CardDescription>管理账户密码、登录超时与密码策略</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 修改密码区域 -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium">
                修改密码
              </h3>

              <!-- 当前密码 -->
              <div class="grid gap-2">
                <Label for="current-password">当前密码</Label>
                <Input
                  id="current-password"
                  v-model="currentPassword"
                  type="password"
                  placeholder="请输入当前密码"
                  autocomplete="current-password"
                  class="max-w-md"
                />
              </div>

              <!-- 新密码 -->
              <div class="grid gap-2">
                <Label for="new-password">新密码</Label>
                <Input
                  id="new-password"
                  v-model="newPassword"
                  type="password"
                  placeholder="请输入新密码"
                  autocomplete="new-password"
                  class="max-w-md"
                />
                <p class="text-xs text-muted-foreground">
                  至少 8 个字符，包含大小写字母和数字
                </p>
              </div>

              <!-- 确认密码 -->
              <div class="grid gap-2">
                <Label for="confirm-password">确认新密码</Label>
                <Input
                  id="confirm-password"
                  v-model="confirmPassword"
                  type="password"
                  placeholder="请再次输入新密码"
                  autocomplete="new-password"
                  class="max-w-md"
                />
              </div>
            </div>

            <Separator />

            <!-- 登录超时 -->
            <div class="grid gap-2">
              <Label for="session-timeout">登录超时时间</Label>
              <Select v-model="sessionTimeout">
                <SelectTrigger class="max-w-md">
                  <SelectValue placeholder="选择超时时间" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">
                    15 分钟
                  </SelectItem>
                  <SelectItem value="30">
                    30 分钟
                  </SelectItem>
                  <SelectItem value="60">
                    1 小时
                  </SelectItem>
                  <SelectItem value="120">
                    2 小时
                  </SelectItem>
                  <SelectItem value="480">
                    8 小时
                  </SelectItem>
                  <SelectItem value="1440">
                    24 小时
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">
                无操作超过该时间后自动退出登录
              </p>
            </div>

            <Separator />

            <!-- 强制密码策略 -->
            <div class="flex items-center justify-between max-w-md">
              <div class="space-y-1">
                <Label for="password-policy" class="text-sm font-medium">强制密码策略</Label>
                <p class="text-xs text-muted-foreground">
                  启用后所有用户密码必须满足复杂度要求（大小写字母 + 数字 + 特殊字符）
                </p>
              </div>
              <Switch
                id="password-policy"
                :checked="enforcePasswordPolicy"
                @update:checked="enforcePasswordPolicy = $event"
              />
            </div>

            <Separator />

            <!-- 保存按钮 -->
            <div class="flex justify-end">
              <Button @click="saveSecuritySettings">
                <Save class="mr-2 size-4" />
                保存
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Tab 3: 通知设置 -->
      <TabsContent value="notification" class="mt-6">
        <Card class="border-0 shadow-sm">
          <CardHeader>
            <CardTitle class="text-base">
              通知设置
            </CardTitle>
            <CardDescription>配置通知渠道和消息偏好</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 邮件通知 -->
            <div class="flex items-center justify-between max-w-md">
              <div class="space-y-1">
                <Label for="email-notification" class="text-sm font-medium">邮件通知</Label>
                <p class="text-xs text-muted-foreground">
                  通过邮件接收订单变更、用户注册、系统告警等通知
                </p>
              </div>
              <Switch
                id="email-notification"
                :checked="emailNotification"
                @update:checked="emailNotification = $event"
              />
            </div>

            <Separator />

            <!-- 短信通知 -->
            <div class="flex items-center justify-between max-w-md">
              <div class="space-y-1">
                <Label for="sms-notification" class="text-sm font-medium">短信通知</Label>
                <p class="text-xs text-muted-foreground">
                  通过短信接收紧急告警和安全事件通知
                </p>
              </div>
              <Switch
                id="sms-notification"
                :checked="smsNotification"
                @update:checked="smsNotification = $event"
              />
            </div>

            <Separator />

            <!-- 系统公告 -->
            <div class="flex items-center justify-between max-w-md">
              <div class="space-y-1">
                <Label for="system-announcement" class="text-sm font-medium">系统公告</Label>
                <p class="text-xs text-muted-foreground">
                  在管理后台顶部展示系统公告和维护通知
                </p>
              </div>
              <Switch
                id="system-announcement"
                :checked="systemAnnouncement"
                @update:checked="systemAnnouncement = $event"
              />
            </div>

            <Separator />

            <!-- 保存按钮 -->
            <div class="flex justify-end">
              <Button @click="saveNotificationSettings">
                <Save class="mr-2 size-4" />
                保存
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
