<template>
  <div id="app">
    <Navbar />
    <RouterView />
    <CartSidebar />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/NavBar.vue'
import Toast from './components/Toast.vue'
import CartSidebar from './components/CartSidebar.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
#app{
  min-height:100vh;
}
</style>