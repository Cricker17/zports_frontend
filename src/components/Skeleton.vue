<template>
  <div class="skeleton" :style="{ width, height, borderRadius }">
    <div class="shimmer"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  width?: string
  height?: string
  borderRadius?: string
}>()
</script>

<style scoped>
.skeleton {
  background: #f0f0f0;
  position: relative;
  overflow: hidden;
}

.shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
