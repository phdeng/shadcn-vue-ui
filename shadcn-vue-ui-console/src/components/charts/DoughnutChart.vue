<script setup lang="ts">
import {
  ArcElement,
  Chart as ChartJS,
  DoughnutController,
  Legend,
  Tooltip,
} from 'chart.js'
/**
 * @description 环形图组件 — 基于 vue-chartjs 的轻量封装
 * 适用于占比分布类数据可视化
 * @author Timon
 */
import { Doughnut } from 'vue-chartjs'

// 组件属性定义
defineProps<{
  /** 图表数据（Chart.js 数据格式） */
  data: any
  /** 图表配置项（可选，会与默认配置合并） */
  options?: any
}>()

// 注册 Chart.js 所需模块
ChartJS.register(ArcElement, DoughnutController, Tooltip, Legend)
</script>

<template>
  <Doughnut
    :data="data"
    :options="{ responsive: true, maintainAspectRatio: false, ...options }"
  />
</template>
