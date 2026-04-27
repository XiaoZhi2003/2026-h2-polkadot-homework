import { ref } from 'vue'

const toasts = ref([])
let uid = 0

// Toast 做成模块级状态，所有页面调用 useToast 时都写入同一个队列。
export const useToast = () => {
  const add = (msg, type = 'info', ms = 5000) => {
    const id = ++uid
    toasts.value.push({ id, msg, type })
    // 自动移除只按 id 精确过滤，避免后续 toast 插入后被误删。
    setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, ms)
  }
  return {
    toasts,
    success: (m, ms) => add(m, 'success', ms),
    error:   (m, ms) => add(m, 'error',   ms ?? 8000),
    info:    (m, ms) => add(m, 'info',    ms),
    warn:    (m, ms) => add(m, 'warn',    ms),
  }
}
