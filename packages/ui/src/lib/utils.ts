import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名，自动处理冲突
 * 使用 clsx 做条件拼接 + tailwind-merge 做冲突合并
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
