<script setup lang="ts">
import { Button } from '@ui/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/components/ui/card'
import { Input } from '@ui/components/ui/input'
import { Label } from '@ui/components/ui/label'
import { Switch } from '@ui/components/ui/switch'
import { Brain, Loader2, Shield, Sparkles, Zap } from 'lucide-vue-next'
/**
 * @description 登录页 — Dify 风格，全屏双栏布局
 * @author Timon
 */
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 表单状态
const email = ref('timon@example.com')
const password = ref('123456')
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')

// 产品特性列表
const features = [
  { icon: Brain, title: '智能模型管理', desc: '统一接入与调度多种大语言模型' },
  { icon: Shield, title: '企业级安全', desc: '多层权限体系与数据加密保障' },
  { icon: Zap, title: '极速部署', desc: '一键发布 Agent 与知识库应用' },
]

/**
 * 处理登录提交
 */
async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = '请输入邮箱和密码'
    return
  }

  loading.value = true
  try {
    const success = await authStore.login(email.value, password.value)
    if (success) {
      toast.success('登录成功', { description: '欢迎回来' })
      // 跳转到之前访问的页面或首页
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    }
    else {
      toast.error('登录失败', { description: '请检查邮箱和密码' })
      errorMessage.value = '登录失败，请检查邮箱和密码'
    }
  }
  catch {
    errorMessage.value = '网络异常，请稍后重试'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen w-full">
    <!-- 左侧品牌区 — 渐变背景 + 产品信息 -->
    <div
      class="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-10 text-primary-foreground lg:flex lg:w-[520px] xl:w-[580px]"
    >
      <!-- 装饰性背景 -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -left-20 -top-20 size-80 rounded-full bg-white/5 blur-3xl" />
        <div class="absolute -bottom-32 -right-32 size-96 rounded-full bg-white/5 blur-3xl" />
        <div class="absolute left-1/2 top-1/3 size-60 -translate-x-1/2 rounded-full bg-white/3 blur-2xl" />
      </div>

      <!-- Logo 区域 -->
      <div class="relative z-10">
        <div class="flex items-center gap-3">
          <div class="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Sparkles class="size-5" />
          </div>
          <span class="text-xl font-semibold tracking-tight">shadcn-vue-ui</span>
        </div>
      </div>

      <!-- 中部：标语 + 特性 -->
      <div class="relative z-10 space-y-8">
        <div class="space-y-3">
          <h1 class="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            构建下一代
            <br>
            AI 应用平台
          </h1>
          <p class="max-w-sm text-base leading-relaxed text-primary-foreground/80">
            统一管理大语言模型、知识库与智能体，<br>
            让 AI 能力触手可及。
          </p>
        </div>

        <!-- 特性列表 -->
        <div class="space-y-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="flex items-start gap-3.5 rounded-xl bg-white/8 p-3.5 backdrop-blur-sm transition-colors hover:bg-white/12"
          >
            <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <component :is="feature.icon" class="size-4.5" />
            </div>
            <div>
              <p class="text-sm font-medium">
                {{ feature.title }}
              </p>
              <p class="mt-0.5 text-xs text-primary-foreground/70">
                {{ feature.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="relative z-10">
        <p class="text-xs text-primary-foreground/50">
          &copy; 2026 shadcn-vue-ui. All rights reserved.
        </p>
      </div>
    </div>

    <!-- 右侧登录区 -->
    <div class="flex flex-1 items-center justify-center bg-background px-6 py-10">
      <div class="w-full max-w-[400px]">
        <!-- 移动端 Logo -->
        <div class="mb-8 flex items-center gap-3 lg:hidden">
          <div class="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles class="size-4.5" />
          </div>
          <span class="text-lg font-semibold tracking-tight">shadcn-vue-ui</span>
        </div>

        <Card class="border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader class="space-y-1.5 px-0 lg:px-6">
            <CardTitle class="text-2xl font-semibold tracking-tight">
              登录
            </CardTitle>
            <CardDescription>
              使用你的账户登录控制台
            </CardDescription>
          </CardHeader>
          <CardContent class="px-0 lg:px-6">
            <form class="space-y-5" @submit.prevent="handleLogin">
              <!-- 错误提示 -->
              <div
                v-if="errorMessage"
                class="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {{ errorMessage }}
              </div>

              <!-- 邮箱 -->
              <div class="space-y-2">
                <Label for="email">邮箱</Label>
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="name@example.com"
                  autocomplete="email"
                  :disabled="loading"
                />
              </div>

              <!-- 密码 -->
              <div class="space-y-2">
                <Label for="password">密码</Label>
                <Input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="请输入密码"
                  autocomplete="current-password"
                  :disabled="loading"
                />
              </div>

              <!-- 记住登录 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Switch
                    id="remember"
                    :checked="rememberMe"
                    :disabled="loading"
                    @update:checked="rememberMe = $event"
                  />
                  <Label for="remember" class="cursor-pointer text-sm font-normal text-muted-foreground">
                    记住登录
                  </Label>
                </div>
              </div>

              <!-- 登录按钮 -->
              <Button
                type="submit"
                class="w-full"
                size="lg"
                :disabled="loading"
              >
                <Loader2 v-if="loading" class="animate-spin" />
                {{ loading ? '登录中...' : '登录' }}
              </Button>
            </form>

            <!-- 底部提示 -->
            <p class="mt-6 text-center text-xs text-muted-foreground">
              登录即表示你同意我们的服务条款与隐私政策
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
