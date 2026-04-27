<template>
  <!-- 根布局保持导航、路由页面和 Toast 容器常驻，避免页面切换时状态丢失。 -->
  <div class="page-root">
    <NavBar />
    <div class="page-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
    <ToastContainer />
  </div>
</template>

<script setup>
import NavBar         from '@/components/NavBar.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { RouterView } from 'vue-router'
</script>

<style>
/* 页面切换只做轻量淡入淡出，避免影响钱包弹窗和交易状态展示。 */
.page-fade-enter-active,
.page-fade-leave-active { transition: opacity .18s ease, transform .18s ease; }
.page-fade-enter-from   { opacity: 0; transform: translateY(8px); }
.page-fade-leave-to     { opacity: 0; transform: translateY(-6px); }

@media (max-width: 768px) {
  .page-content { padding-bottom: 70px; }
}
</style>
