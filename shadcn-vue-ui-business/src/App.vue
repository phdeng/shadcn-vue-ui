<script setup lang="ts">
import { Toaster } from '@ui/components/ui/sonner'
import { TooltipProvider } from '@ui/components/ui/tooltip'
/**
 * @description 业务管理后台应用根组件
 * @author Timon
 */
import { RouterView } from 'vue-router'
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <RouterView />
    <Toaster position="top-right" :duration="3000" rich-colors />
  </TooltipProvider>
</template>
