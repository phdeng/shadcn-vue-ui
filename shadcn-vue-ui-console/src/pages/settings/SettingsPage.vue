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
 * @description 系统设置页面 — 基本设置、安全设置、通知设置
 * @author Timon
 */
import { ref } from 'vue'
import { toast } from 'vue-sonner'

// ==================== 基本设置 ====================
const platformName = ref('shadcn-vue-ui')
const platformDescription = ref('面向 AI 基础设施与平台能力管理的控制台，统一管理大语言模型、知识库与智能体。')
const defaultModel = ref('gpt-4o')
const language = ref('zh-CN')

// ==================== 安全设置 ====================
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const twoFactorEnabled = ref(false)
const sessionTimeout = ref('30')

// ==================== 通知设置 ====================
const emailNotification = ref(true)
const smsNotification = ref(false)
const webhookNotification = ref(false)
const webhookUrl = ref('')

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
  if (newPassword.value) {
    if (!currentPassword.value) {
      toast.error('保存失败', { description: '请输入当前密码' })
      return
    }
    if (newPassword.value.length < 8) {
      toast.error('保存失败', { description: '新密码至少需要 8 个字符' })
      return
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword.value)) {
      toast.error('保存失败', { description: '密码需包含大小写字母和数字' })
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      toast.error('保存失败', { description: '两次输入的新密码不一致' })
      return
    }
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
  if (webhookNotification.value) {
    const url = webhookUrl.value.trim()
    if (!url) {
      toast.error('保存失败', { description: '请填写 Webhook URL' })
      return
    }
    if (!/^https?:\/\/.+/.test(url)) {
      toast.error('保存失败', { description: 'Webhook URL 格式不正确，需以 http:// 或 https:// 开头' })
      return
    }
  }

  toast.success('通知设置已保存', {
    description: '通知偏好已更新',
  })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 页面头部 -->
    <div class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">
        系统设置
      </h1>
      <p class="text-sm text-muted-foreground leading-relaxed">
        管理平台配置、安全策略与通知偏好
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
            <CardDescription>配置平台名称、默认模型与界面语言</CardDescription>
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
                显示在控制台标题栏和登录页面的品牌名称
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

            <!-- 默认模型 -->
            <div class="grid gap-2">
              <Label for="default-model">默认模型</Label>
              <Select v-model="defaultModel">
                <SelectTrigger class="max-w-md">
                  <SelectValue placeholder="选择默认模型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">
                    GPT-4o
                  </SelectItem>
                  <SelectItem value="claude-3-5-sonnet">
                    Claude 3.5 Sonnet
                  </SelectItem>
                  <SelectItem value="deepseek-v3">
                    DeepSeek-V3
                  </SelectItem>
                  <SelectItem value="qwen2-5-72b">
                    Qwen2.5-72B
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">
                新建 Agent 和对话时默认使用的大语言模型
              </p>
            </div>

            <!-- 界面语言 -->
            <div class="grid gap-2">
              <Label for="language">界面语言</Label>
              <Select v-model="language">
                <SelectTrigger class="max-w-md">
                  <SelectValue placeholder="选择界面语言" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-CN">
                    中文
                  </SelectItem>
                  <SelectItem value="en-US">
                    English
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-muted-foreground">
                控制台界面显示语言
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
            <CardDescription>管理账户密码、双因素认证与会话策略</CardDescription>
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

            <!-- 双因素认证 -->
            <div class="flex items-center justify-between max-w-md">
              <div class="space-y-1">
                <Label for="two-factor" class="text-sm font-medium">双因素认证（2FA）</Label>
                <p class="text-xs text-muted-foreground">
                  启用后登录时需要输入验证器应用生成的动态验证码
                </p>
              </div>
              <Switch
                id="two-factor"
                :checked="twoFactorEnabled"
                @update:checked="(val: boolean) => { twoFactorEnabled = val; toast.info(val ? '双因素认证已启用' : '双因素认证已关闭', { description: val ? '下次登录时需要输入验证码' : '已关闭双因素认证' }) }"
              />
            </div>

            <Separator />

            <!-- 会话超时 -->
            <div class="grid gap-2">
              <Label for="session-timeout">会话超时时间</Label>
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
            <CardDescription>配置告警通知渠道和偏好</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- 邮件通知 -->
            <div class="flex items-center justify-between max-w-md">
              <div class="space-y-1">
                <Label for="email-notification" class="text-sm font-medium">邮件通知</Label>
                <p class="text-xs text-muted-foreground">
                  通过邮件接收系统告警、服务状态变更等通知
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

            <!-- Webhook 通知 -->
            <div class="space-y-4">
              <div class="flex items-center justify-between max-w-md">
                <div class="space-y-1">
                  <Label for="webhook-notification" class="text-sm font-medium">Webhook 通知</Label>
                  <p class="text-xs text-muted-foreground">
                    通过 Webhook 将通知推送到自定义服务端点
                  </p>
                </div>
                <Switch
                  id="webhook-notification"
                  :checked="webhookNotification"
                  @update:checked="webhookNotification = $event"
                />
              </div>

              <!-- Webhook URL 输入 -->
              <div v-if="webhookNotification" class="grid gap-2">
                <Label for="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  v-model="webhookUrl"
                  placeholder="https://example.com/webhook"
                  class="max-w-md"
                />
                <p class="text-xs text-muted-foreground">
                  系统将以 POST 方式发送 JSON 格式的通知数据
                </p>
              </div>
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
