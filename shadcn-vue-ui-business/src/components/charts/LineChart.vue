<script setup lang="ts">
/**
 * @description 折线图组件 — 基于 vue-chartjs 的轻量封装
 * 支持面积填充、平滑曲线，适用于趋势类数据可视化
 * @author Timon
 */
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'

// 注册 Chart.js 所需模块
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

// 组件属性定义
defineProps<{
  /** 图表数据（Chart.js 数据格式） */
  data: any
  /** 图表配置项（可选，会与默认配置合并） */
  options?: any
}>()
</script>

<template>
  <Line
    :data="data"
    :options="{ responsive: true, maintainAspectRatio: false, ...options }"
  />
</template>
