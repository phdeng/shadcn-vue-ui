<script setup lang="ts">
/**
 * @description 控制台默认布局 — Sidebar + Header + Content
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
    <SidebarInset>
      <AppHeader />
      <main class="flex-1 overflow-auto p-6">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
