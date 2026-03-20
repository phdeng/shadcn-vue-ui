<script setup lang="ts">
/**
 * @description 控制台默认布局 — 产品控制台风格
 * @author Timon
 */
import { RouterView } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import {
  SidebarInset,
  SidebarProvider,
} from '@ui/components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="bg-background">
      <AppHeader />
      <main class="flex-1 overflow-auto">
        <div class="mx-auto max-w-[1440px] px-6 py-5">
          <RouterView v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </RouterView>
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<style>
/* 路由过渡动效 — 克制的 fade + 微位移 */
.page-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-leave-active {
  transition: opacity 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
}
</style>
