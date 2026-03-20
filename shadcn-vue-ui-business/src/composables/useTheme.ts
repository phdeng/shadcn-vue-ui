import { useColorMode } from '@vueuse/core'

/**
 * 主题切换组合式函数
 * 基于 VueUse useColorMode，支持 light / dark / auto
 * @author Timon
 */
export function useTheme() {
  const mode = useColorMode({
    attribute: 'class',
    modes: {
      light: 'light',
      dark: 'dark',
    },
  })

  function toggleTheme() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  return { mode, toggleTheme }
}
