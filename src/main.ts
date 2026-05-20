// src/main.ts

// Import global CSS / Tailwind
import './assets/main.css'

// Import Vue core
import { createApp } from 'vue'

// Import Pinia (state management)
import { createPinia } from 'pinia'

// Import Vue Router
import router from './router'

// Import Root App
import App from './App.vue'

// Buat instance aplikasi
const app = createApp(App)

// Buat instance Pinia
const pinia = createPinia()

// Daftarkan plugin
app.use(pinia)
app.use(router)

// Mount ke #app
app.mount('#app')