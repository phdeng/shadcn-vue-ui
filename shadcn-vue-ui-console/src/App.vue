<script setup lang="ts">
/**
 * @description 控制台应用根组件
 * @author Timon
 */
import { RouterView } from 'vue-router'
import { TooltipProvider } from '@ui/components/ui/tooltip'
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <RouterView />
  </TooltipProvider>
</template>
