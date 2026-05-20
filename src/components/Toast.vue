<template>
  <Transition name="toast">
    <div v-if="toast.show" class="toast-wrapper" :class="toast.type">
      <div class="icon">
        <span v-if="toast.type === 'success'">✓</span>
        <span v-else-if="toast.type === 'info'">ℹ</span>
        <span v-else>✕</span>
      </div>
      <div class="message">{{ toast.message }}</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { toast } from '../stores/toast'
</script>

<style scoped>
.toast-wrapper {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 16px 24px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  min-width: 300px;
  border-left: 6px solid #eab308;
}

.toast-wrapper.success {
  border-left-color: #22c55e;
}

.toast-wrapper.error {
  border-left-color: #ef4444;
}

.toast-wrapper.info {
  border-left-color: #3b82f6;
}

.icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 14px;
}

.success .icon {
  background: #dcfce7;
  color: #16a34a;
}

.error .icon {
  background: #fee2e2;
  color: #dc2626;
}

.info .icon {
  background: #dbeafe;
  color: #2563eb;
}

.message {
  font-weight: 700;
  color: #111;
  font-size: 14px;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
