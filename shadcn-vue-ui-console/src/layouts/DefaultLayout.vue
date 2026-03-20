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
          <RouterView />
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
