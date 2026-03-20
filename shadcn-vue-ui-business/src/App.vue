<script setup lang="ts">
/**
 * @description 业务管理后台应用根组件
 * @author Timon
 */
import { RouterView } from 'vue-router'
import { TooltipProvider } from '@ui/components/ui/tooltip'
import { Toaster } from '@ui/components/ui/sonner'
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <RouterView />
    <Toaster position="top-right" :duration="3000" rich-colors />
  </TooltipProvider>
</template>
