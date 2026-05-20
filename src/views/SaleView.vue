<template>
  <main class="sale-page fade-up">
    <!-- FLASH SALE HEADER -->
    <section class="sale-header">
      <div class="container">
        <div class="sale-info">
          <span class="sale-tag">FLASH SALE</span>
          <h1>Grab Your Favorite Sneakers</h1>
          <p>Limited time offer. Don't miss out on these exclusive deals.</p>
          
          <div class="countdown">
            <div class="time-box">
              <span>{{ countdown.hours }}</span>
              <p>Hours</p>
            </div>
            <div class="time-box">
              <span>{{ countdown.minutes }}</span>
              <p>Mins</p>
            </div>
            <div class="time-box">
              <span>{{ countdown.seconds }}</span>
              <p>Secs</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SALE PRODUCTS -->
    <section class="container products-section">
      <div class="filter-bar">
        <h2>Discounted Products</h2>
        <p>{{ discountedProducts.length }} items found</p>
      </div>

      <div v-if="loading" class="product-grid">
        <div v-for="i in 8" :key="i" class="skeleton-card">
          <Skeleton height="220px" borderRadius="20px" />
          <div style="padding: 15px 0">
            <Skeleton width="80%" height="20px" borderRadius="4px" style="margin-bottom: 10px" />
            <Skeleton width="40%" height="15px" borderRadius="4px" />
          </div>
        </div>
      </div>

      <div v-else-if="discountedProducts.length === 0" class="empty">
        <h3>No active sales right now.</h3>
        <p>Check back later for more amazing deals!</p>
      </div>

      <div v-else class="product-grid">
        <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
      </div>

      <!-- PAGINATION -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="currentPage = page"
          :class="{ active: currentPage === page }"
          class="page-btn"
        >
          {{ page }}
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import Skeleton from '../components/Skeleton.vue'
import api from '../services/api'

const discountedProducts = ref<any[]>([])
const loading = ref(true)

const countdown = ref({
  hours: '00',
  minutes: '00',
  seconds: '00'
})

let timerInterval: any = null

const startCountdown = () => {
  // Set end time to end of today for demonstration
  const endTime = new Date()
  endTime.setHours(23, 59, 59)

  timerInterval = setInterval(() => {
    const now = new Date().getTime()
    const distance = endTime.getTime() - now

    if (distance < 0) {
      clearInterval(timerInterval)
      return
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    countdown.value = {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    }
  }, 1000)
}

const loadSaleProducts = async () => {
  loading.value = true
  try {
    const res = await api.get('/products', { params: { on_sale: 1 } })
    const all = res.data?.data?.data ?? res.data?.data ?? res.data ?? []
    discountedProducts.value = Array.isArray(all) ? all : []
    currentPage.value = 1 // Reset on new data
  } catch (e) {
    console.error('Failed to load sale products')
  } finally {
    loading.value = false
  }
}

/* PAGINATION LOGIC */
const currentPage = ref(1)
const itemsPerPage = 12

const totalPages = computed(() => Math.ceil(discountedProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return discountedProducts.value.slice(start, start + itemsPerPage)
})

onMounted(() => {
  loadSaleProducts()
  startCountdown()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.sale-page {
  min-height: 100vh;
  background: var(--color-background-soft);
  padding-bottom: 80px;
}



/* HEADER */
.sale-header {
  background: linear-gradient(135deg, #111, #222);
  color: white;
  padding: 100px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 60px;
}

.sale-header::after {
  content: 'SALE';
  position: absolute;
  font-size: 200px;
  font-weight: 900;
  color: rgba(255,255,255,0.03);
  bottom: -40px;
  right: -20px;
  z-index: 1;
}

.sale-info {
  position: relative;
  z-index: 2;
}

.sale-tag {
  background: #ef4444;
  padding: 6px 16px;
  border-radius: 10px;
  font-weight: 900;
  letter-spacing: 2px;
  font-size: 14px;
}

.sale-header h1 {
  font-size: 56px;
  font-weight: 900;
  margin: 24px 0 10px;
}

.sale-header p {
  color: #aaa;
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto 40px;
}

/* COUNTDOWN */
.countdown {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.time-box {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 20px;
  min-width: 100px;
  border: 1px solid rgba(255,255,255,0.1);
}

.time-box span {
  font-size: 36px;
  font-weight: 900;
  display: block;
  color: #facc15;
}

.time-box p {
  font-size: 12px;
  margin: 5px 0 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  color: #fff;
}

/* PRODUCTS */
.products-section {
  margin-top: 40px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.filter-bar h2 {
  font-size: 28px;
  font-weight: 900;
}

.filter-bar p {
  color: #888;
  font-weight: 700;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.empty {
  text-align: center;
  padding: 100px 0;
  color: #999;
}

.skeleton-card {
  background: white;
  padding: 18px;
  border-radius: 20px;
}

/* PAGINATION */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
  padding-bottom: 20px;
}

.page-btn {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.page-btn:hover {
  border-color: var(--primary);
  color: var(--color-heading);
}

.page-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #111;
}

.fade-up {
  animation: fadeUp 0.8s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .sale-header h1 { font-size: 36px; }
  .countdown { gap: 10px; }
  .time-box { min-width: 80px; padding: 15px; }
  .time-box span { font-size: 24px; }
}

@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
