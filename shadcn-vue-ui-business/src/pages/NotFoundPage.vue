<script setup lang="ts">
/**
 * @description 404 页面 — 产品风格的友好提示
 * @author Timon
 */
import { useRouter } from 'vue-router'
import { ArrowLeft, Home, Search } from 'lucide-vue-next'
import { Button } from '@ui/components/ui/button'

const router = useRouter()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="flex max-w-md flex-col items-center text-center">
      <!-- 404 数字 -->
      <div class="relative">
        <span class="text-[120px] font-bold leading-none tracking-tighter text-primary/10">
          404
        </span>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="rounded-2xl bg-primary/10 p-4">
            <Search class="size-8 text-primary" />
          </div>
        </div>
      </div>

      <h1 class="mt-6 text-2xl font-semibold tracking-tight">
        页面未找到
      </h1>
      <p class="mt-2 text-sm text-muted-foreground leading-relaxed">
        你访问的页面不存在或已被移除。请检查 URL 是否正确，或返回管理后台首页。
      </p>

      <div class="mt-8 flex items-center gap-3">
        <Button variant="outline" @click="router.back()">
          <ArrowLeft class="mr-2 size-4" />
          返回上一页
        </Button>
        <Button @click="router.push('/')">
          <Home class="mr-2 size-4" />
          回到首页
        </Button>
      </div>
    </div>
  </div>
</template>
