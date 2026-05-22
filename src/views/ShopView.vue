<template>
  <main class="shop-page">

    <!-- HEADER -->
    <section class="shop-header fade-up">
      <div class="container">
        <div class="shop-banner">
          <img src="@/assets/images/shop-banner.png" alt="Shop Banner" />
          <div class="banner-content">
            <h2>Step Up Your Game</h2>
            <p>Discover the latest drops and elevate your style.</p>
          </div>
        </div>
        <h1>Shop <span>Products</span></h1>
        <p class="subtitle">Browse our curated collection of premium products.</p>
      </div>
    </section>

    <div class="shop-layout container">
      <!-- SIDEBAR -->
      <ShopSideBar 
        :categories="categories" 
        :brands="brands" 
        :colors="colors"
        :sizes="sizes"
        :selectedCategory="category" 
        :selectedBrand="brand"
        :selectedColor="color"
        :selectedSize="size"
        :minPrice="minPrice"
        :maxPrice="maxPrice"
        @update:category="onCategoryChange" 
        @update:brand="onBrandChange" 
        @update:color="onColorChange"
        @update:size="onSizeChange"
        @update:minPrice="val => minPrice = val"
        @update:maxPrice="val => maxPrice = val"
        @applyPrice="onPriceApply"
      />

      <!-- PRODUCT GRID -->
      <section class="shop-main">
        
        <!-- TOOLBAR (Sorting) -->
        <div class="shop-toolbar fade-up">
          <p class="count">{{ products.length }} products found</p>
          <div class="toolbar-right">
            <div class="grid-toggle">
              <button 
                class="grid-btn" 
                :class="{ active: gridCols === 3 }" 
                @click="gridCols = 3"
                title="3 Columns"
              >
                <div class="grid-icon col-3">
                  <span></span><span></span><span></span>
                </div>
              </button>
              <button 
                class="grid-btn" 
                :class="{ active: gridCols === 4 }" 
                @click="gridCols = 4"
                title="4 Columns"
              >
                <div class="grid-icon col-4">
                  <span></span><span></span><span></span><span></span>
                </div>
              </button>
            </div>

            <div class="custom-select" ref="sortDropdown">
              <div class="select-trigger" @click.stop="isSortOpen = !isSortOpen" :class="{ open: isSortOpen }">
                <span>{{ sortLabels[sort] || 'Latest' }}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              <div class="select-options" v-if="isSortOpen">
                <div v-for="(label, key) in sortLabels" :key="key" 
                   class="option" :class="{ active: sort === key }"
                   @click="selectSort(String(key))"
                >
                  {{ label }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Skeletons -->
        <div v-if="loading" class="grid">
          <div v-for="i in 8" :key="i" class="skeleton-card">
            <Skeleton height="220px" borderRadius="20px" />
            <div style="padding: 15px 0">
              <Skeleton width="80%" height="20px" borderRadius="4px" style="margin-bottom: 10px" />
              <Skeleton width="40%" height="15px" borderRadius="4px" />
            </div>
          </div>
        </div>

        <!-- Product Found -->
        <div v-else-if="products.length > 0" class="grid-container">
          <div class="grid" :class="`cols-${gridCols}`">
            <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" :isSmall="gridCols === 4" />
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
        </div>

        <!-- Timeout / No Product -->
        <div v-else-if="timeoutReached || (products.length === 0 && !loading)" class="empty-state fade-up">
          <p>No products available</p>
        </div>

      </section>
    </div>

  </main>
</template>

<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'
import ShopSideBar from '../components/ShopSideBar.vue'
import Skeleton from '../components/Skeleton.vue'

import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { unwrapResponse } from '../services/apiHelpers'
import { usePagination } from '../composables/usePagination'

const route = useRoute()
const router = useRouter()

const products = ref<any[]>([])
const categories = ref<any[]>([])
const brands = ref<any[]>([])
const colors = ref<any[]>([])
const sizes = ref<any[]>([])

const category = ref(String(route.query.category || ''))
const brand = ref(String(route.query.brand || ''))
const color = ref(String(route.query.color || ''))
const size = ref(String(route.query.size || ''))
const search = ref(String(route.query.search || ''))
const minPrice = ref(String(route.query.min_price || ''))
const maxPrice = ref(String(route.query.max_price || ''))
const sort = ref(String(route.query.sort || 'latest'))

const loading = ref(false)
const gridCols = ref(4)
const timeoutReached = ref(false)
const errorMessage = ref('')
const isSortOpen = ref(false)
const sortDropdown = ref<HTMLElement | null>(null)

const sortLabels: Record<string, string> = {
  latest: 'Latest',
  price_low: 'Price: Low to High',
  price_high: 'Price: High to Low',
  oldest: 'Oldest'
}

const selectSort = (val: string) => {
  sort.value = val
  isSortOpen.value = false
  onSortChange()
}

let timeoutId: any = null
let debounceId: any = null

/* LOAD INITIAL DATA */
const loadData = async () => {
  try {
    const [catRes, brandRes, colorRes, sizeRes] = await Promise.all([
      api.get('/categories'),
      api.get('/brands'),
      api.get('/colors'),
      api.get('/sizes')
    ])

    categories.value =
      catRes.data?.data ??
      catRes.data ??
      []

    brands.value =
      brandRes.data?.data ??
      brandRes.data ??
      []

    colors.value =
      colorRes.data ??
      []

    sizes.value =
      sizeRes.data?.data ??
      sizeRes.data ??
      []

    fetchProducts()

  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to load filters.'
  }
}

/* FETCH PRODUCTS */
const fetchProducts = async () => {
  loading.value = true
  timeoutReached.value = false
  errorMessage.value = ''
  products.value = []

  clearTimeout(timeoutId)

  /* timeout 4 detik */
  timeoutId = setTimeout(() => {
    if (loading.value) {
      timeoutReached.value = true
      loading.value = false
    }
  }, 4000)

  try {
    const params: any = {}

    if (category.value) params.category = category.value
    if (brand.value) params.brand = brand.value
    if (color.value) params.color = color.value
    if (size.value) params.size = size.value
    if (search.value) params.search = search.value
    if (minPrice.value) params.min_price = minPrice.value
    if (maxPrice.value) params.max_price = maxPrice.value
    if (sort.value) params.sort = sort.value

    const res = await api.get('/products', { params })

    clearTimeout(timeoutId)

    const raw = unwrapResponse(res.data)

    products.value = raw
    resetPage()

  } catch (error) {
    clearTimeout(timeoutId)
    errorMessage.value = 'Failed to fetch products.'
    console.error(error)

  } finally {
    loading.value = false
  }
}

/* PAGINATION LOGIC */
const { currentPage, totalPages, paginatedItems: paginatedProducts, resetPage } = usePagination(products, 12)

/* FILTER EVENTS */
const onCategoryChange = (val: any) => {
  router.push({ query: { ...route.query, category: val || undefined } })
}

const onBrandChange = (val: any) => {
  router.push({ query: { ...route.query, brand: val || undefined } })
}

const onColorChange = (val: any) => {
  router.push({ query: { ...route.query, color: val || undefined } })
}

const onSizeChange = (val: any) => {
  router.push({ query: { ...route.query, size: val || undefined } })
}

const onSortChange = () => {
  router.push({ query: { ...route.query, sort: sort.value } })
}

const onPriceApply = () => {
  router.push({ 
    query: { 
      ...route.query, 
      min_price: minPrice.value || undefined, 
      max_price: maxPrice.value || undefined 
    } 
  })
}

/* WATCH FOR ROUTE CHANGES (e.g. from Home or Navbar) */
watch(
  () => route.query,
  (query) => {
    category.value = String(query.category || '')
    brand.value = String(query.brand || '')
    color.value = String(query.color || '')
    size.value = String(query.size || '')
    search.value = String(query.search || '')
    minPrice.value = String(query.min_price || '')
    maxPrice.value = String(query.max_price || '')
    sort.value = String(query.sort || 'latest')
    
    clearTimeout(debounceId)
    debounceId = setTimeout(() => {
      fetchProducts()
    }, 100)
  },
  { deep: true }
)

const handleClickOutside = (event: MouseEvent) => {
  if (sortDropdown.value && !sortDropdown.value.contains(event.target as Node)) {
    isSortOpen.value = false
  }
}

onMounted(() => {
  loadData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.shop-page {
  padding-bottom: 60px;
}

/* HEADER */
.shop-header {
  text-align: center;
  padding: 50px 25px 30px;
}

.shop-banner {
  position: relative;
  width: 100%;
  height: 250px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px var(--color-card-shadow);
}
.banner-content {
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
  color: white;
  text-align: left;
  text-shadow: 0 4px 20px rgba(0,0,0,0.8);
}
.banner-content h2 {
  font-size: 42px;
  font-weight: 900;
  margin: 0 0 10px;
  color: #fff;
}
.banner-content p {
  font-size: 18px;
  font-weight: 600;
  opacity: 0.9;
  color: #eee;
}
.shop-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shop-header h1 {
  font-size: 48px;
  font-weight: 900;
  color: var(--color-heading);
  margin: 0 0 10px;
}

.shop-header h1 span {
  color: var(--primary);
}

.subtitle {
  color: var(--color-text);
  font-size: 17px;
}

/* LAYOUT */
.shop-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* MAIN */
.shop-main {
  flex: 1;
}

.shop-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  background: var(--color-card-bg);
  padding: 15px 25px;
  border-radius: 20px;
  box-shadow: 0 2px 12px var(--color-card-shadow);
  border: 1px solid var(--color-border);
}

.count {
  font-weight: 700;
  color: var(--color-text);
  font-size: 14px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.grid-toggle {
  display: flex;
  background: var(--color-background-soft);
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
}

.grid-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--color-text);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.grid-btn.active {
  background: var(--color-card-bg);
  color: var(--primary);
  box-shadow: 0 2px 8px var(--color-card-shadow);
}

.grid-icon {
  display: flex;
  gap: 2px;
}

.grid-icon span {
  display: block;
  background: currentColor;
  border-radius: 1px;
}

.col-3 span { width: 6px; height: 16px; }
.col-4 span { width: 4px; height: 16px; }

.custom-select {
  position: relative;
  min-width: 180px;
  z-index: 100;
}

.select-trigger {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  padding: 10px 18px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: 0.3s;
  color: var(--color-heading);
}

.select-trigger:hover {
  border-color: var(--primary);
}

.select-trigger.open {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.1);
}

.select-trigger svg {
  transition: 0.3s;
  color: var(--color-text);
}

.select-trigger.open svg {
  transform: rotate(180deg);
  color: var(--color-heading);
}

.select-options {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 100%;
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 10px 30px var(--color-card-shadow);
  overflow: hidden;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.option {
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  transition: 0.2s;
}

.option:hover {
  background: var(--color-background-soft);
  color: var(--primary);
}

.option.active {
  background: var(--primary);
  color: #111;
}

/* GRID */
.grid {
  display: grid;
  gap: 25px;
  transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.grid.cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1200px) {
  .grid.cols-4, .grid.cols-3 {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

.skeleton-card {
  background: var(--color-card-bg);
  padding: 18px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
}

/* EMPTY / LOADING */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: var(--color-text);
  font-size: 16px;
  font-weight: 600;
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

/* ANIMATION */
.fade-up {
  animation: fadeUp 0.8s ease;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .shop-layout {
    flex-direction: column;
  }

  .shop-layout :deep(.sidebar) {
    width: 100%;
    border-radius: 16px;
  }
}

@media (max-width: 600px) {
  .shop-header h1 {
    font-size: 34px;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}
</style>