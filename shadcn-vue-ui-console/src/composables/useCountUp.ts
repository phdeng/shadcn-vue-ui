import { ref, onMounted } from 'vue'

/**
 * 数字递增动画 composable — 统计卡片 count-up 效果
 * @author Timon
 */
export function useCountUp(target: number, duration = 1200) {
  const current = ref(0)

  function animate() {
    const start = performance.now()
    const startVal = 0

    function step(timestamp: number) {
      const progress = Math.min((timestamp - start) / duration, 1)
      // easeOutExpo 缓动函数
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      current.value = Math.round(startVal + (target - startVal) * eased)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  onMounted(animate)

  return current
}
