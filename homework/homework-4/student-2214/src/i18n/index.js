import { createI18n } from 'vue-i18n'
import zh from './zh.js'
import en from './en.js'

// 语言偏好落到 localStorage，刷新后继续使用用户上一次选择。
const saved = localStorage.getItem('lang') || 'zh'

export const i18n = createI18n({
  legacy: false,
  locale: saved,
  fallbackLocale: 'en',
  messages: { zh, en },
})

export function toggleLang() {
  const locale = i18n.global.locale.value === 'zh' ? 'en' : 'zh'
  i18n.global.locale.value = locale
  localStorage.setItem('lang', locale)
}
