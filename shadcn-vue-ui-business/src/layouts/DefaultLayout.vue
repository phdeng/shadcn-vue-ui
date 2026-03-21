<script setup lang="ts">
import {
  SidebarInset,
  SidebarProvider,
} from '@ui/components/ui/sidebar'
/**
 * @description 业务管理后台默认布局
 * @author Timon
 */
import { RouterView } from 'vue-router'
import CommandPalette from '@/components/common/CommandPalette.vue'
import KeyboardShortcuts from '@/components/common/KeyboardShortcuts.vue'
import { useAppStore } from '@/stores/app'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const appStore = useAppStore()
</script>

<template>
  <SidebarProvider
    :default-open="!appStore.sidebarCollapsed"
    @update:open="(val: boolean) => appStore.sidebarCollapsed = !val"
  >
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

    <CommandPalette />
    <KeyboardShortcuts />
  </SidebarProvider>
</template>

<style>
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
