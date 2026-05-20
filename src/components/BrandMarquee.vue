<template>
  <section class="brand-marquee-section">
    <div class="container marquee-header">
      <span class="tag">OUR PARTNERS</span>
      <h2 class="title">World's Best Brands</h2>
    </div>

    <div class="marquee-container">
      <div class="marquee-content">
        <!-- FIRST SET -->
        <div v-for="brand in displayBrands" :key="brand.id + '-1'" class="brand-item">
          <span class="brand-name">{{ brand.name }}</span>
        </div>
        <!-- DUPLICATE FOR INFINITE LOOP -->
        <div v-for="brand in displayBrands" :key="brand.id + '-2'" class="brand-item">
          <span class="brand-name">{{ brand.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'

const brands = ref<any[]>([])

const fallbackBrands = [
  { id: 1, name: 'NIKE' },
  { id: 2, name: 'ADIDAS' },
  { id: 3, name: 'JORDAN' },
  { id: 4, name: 'PUMA' },
  { id: 5, name: 'NEW BALANCE' },
  { id: 6, name: 'REEBOK' }
]

const displayBrands = computed(() => {
  return brands.value.length > 0 ? brands.value : fallbackBrands
})

onMounted(async () => {
  try {
    const res = await api.get('/categories') // Using categories if brands API is not ready or similar
    // For now we use fallback to ensure it looks good immediately
    // If you have api.get('/brands'), uncomment below:
    // const res = await api.get('/brands')
    // brands.value = res.data?.data ?? res.data ?? []
  } catch (e) {
    console.error('Failed to load brands')
  }
})
</script>

<style scoped>
.brand-marquee-section {
  padding: 80px 0;
  background: var(--color-background);
  overflow: hidden;
}

.marquee-header {
  text-align: center;
  margin-bottom: 50px;
}

.tag {
  color: #eab308;
  font-weight: 800;
  letter-spacing: 2px;
  font-size: 12px;
  display: block;
  margin-bottom: 10px;
}

.title {
  font-size: 36px;
  font-weight: 900;
  color: var(--color-heading);
}

.marquee-container {
  display: flex;
  overflow: hidden;
  user-select: none;
  position: relative;
}

.marquee-container::before,
.marquee-container::after {
  content: '';
  position: absolute;
  top: 0;
  width: 200px;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.marquee-container::before {
  left: 0;
  background: linear-gradient(to right, var(--color-background), transparent);
}

.marquee-container::after {
  right: 0;
  background: linear-gradient(to left, var(--color-background), transparent);
}

.marquee-content {
  display: flex;
  gap: 80px;
  animation: scroll 30s linear infinite;
  padding: 20px 0;
}

.brand-item {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.brand-name {
  font-size: 50px;
  font-weight: 900;
  color: var(--color-background-mute);
  letter-spacing: 2px;
  transition: 0.4s;
  cursor: default;
}

.brand-item:hover .brand-name {
  color: #eab308;
  transform: scale(1.1);
}

@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (max-width: 768px) {
  .brand-name {
    font-size: 32px;
  }
  .marquee-content {
    gap: 40px;
  }
  .marquee-container::before,
  .marquee-container::after {
    width: 100px;
  }
}
</style>
