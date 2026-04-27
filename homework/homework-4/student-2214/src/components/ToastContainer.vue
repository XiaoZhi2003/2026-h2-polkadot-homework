<template>
  <Teleport to="body">
    <div class="toast-wrap">
      <TransitionGroup name="toast-anim" tag="div" class="toast-inner">
        <div v-for="t in toasts" :key="t.id" :class="['toast', t.type]">
          <span class="t-icon">{{ icons[t.type] }}</span>
          <span class="t-msg">{{ t.msg }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast.js'
const { toasts } = useToast()
// 图标只在容器里集中维护，业务侧只需要传 toast 类型。
const icons = { success: '✓', error: '✕', warn: '⚠', info: 'ℹ' }
</script>

<style scoped>
.toast-wrap { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999; }
.toast-inner { display: flex; flex-direction: column; gap: .5rem; align-items: flex-end; }

.toast-anim-enter-active { transition: all .25s ease; }
.toast-anim-leave-active { transition: all .2s ease; }
.toast-anim-enter-from   { opacity: 0; transform: translateX(20px); }
.toast-anim-leave-to     { opacity: 0; transform: translateX(20px); }
.toast-anim-move         { transition: transform .3s ease; }
</style>
