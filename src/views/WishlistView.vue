<template>
  <main class="container wishlist-page fade-up">
    <div class="header">
      <h1>My Wishlist</h1>
      <p v-if="wishlistItems.length > 0">You have {{ wishlistItems.length }} items saved.</p>
    </div>

    <div v-if="loading" class="wishlist-table-container">
      <div class="skeleton-rows">
        <div v-for="i in 4" :key="i" class="skeleton-row">
          <div class="product-info">
            <Skeleton width="70px" height="70px" borderRadius="16px" />
            <div class="text">
              <Skeleton width="150px" height="18px" borderRadius="6px" style="margin-bottom: 8px" />
              <Skeleton width="80px" height="14px" borderRadius="4px" />
            </div>
          </div>
          <Skeleton width="100px" height="20px" borderRadius="6px" />
          <Skeleton width="80px" height="26px" borderRadius="8px" />
          <Skeleton width="110px" height="38px" borderRadius="10px" />
          <Skeleton width="32px" height="32px" borderRadius="8px" />
        </div>
      </div>
    </div>

    <div v-else-if="wishlistItems.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </div>
      <h2>Your wishlist is empty</h2>
      <p>Save items you like to find them easily later.</p>
      <RouterLink to="/shop" class="btn-shop">Explore Products</RouterLink>
    </div>

    <div v-else class="wishlist-table-container">
      <table class="wishlist-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedWishlist" :key="item.id">
            <td>
              <div class="product-info">
                <img :src="getImageUrl(item.product?.image)" :alt="item.product?.name">
                <div class="text">
                  <RouterLink :to="`/product/${item.product_id}`" class="name">{{ item.product?.name }}</RouterLink>
                  <span class="category">{{ item.product?.category?.name }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="price">{{ ui.formatPrice(item.product?.price) }}</span>
            </td>
            <td>
              <span class="stock-status" :class="{ 'out': item.product?.stock <= 0 }">
                {{ item.product?.stock > 0 ? 'In Stock' : 'Out of Stock' }}
              </span>
            </td>
            <td>
              <button 
                class="btn-add-cart" 
                @click="addToCart(item)"
                :disabled="item.product?.stock <= 0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                Add to Cart
              </button>
            </td>
            <td>
            <button class="btn-remove" @click="removeItem(item.id)" title="Remove item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            </td>
          </tr>
        </tbody>
      </table>

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
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '../services/api'
import { ui } from '../stores/ui'
import { toast } from '../stores/toast'
import Skeleton from '../components/Skeleton.vue'
import { useImageUrl } from '../composables/useImageUrl'
import { useAuth } from '../composables/useAuth'
import { usePagination } from '../composables/usePagination'

const router = useRouter()
const wishlistItems = ref<any[]>([])
const loading = ref(true)

const { getImageUrl } = useImageUrl()
const { requireAuth } = useAuth()
const { currentPage, totalPages, paginatedItems: paginatedWishlist, clampPage } = usePagination(wishlistItems, 5)

const loadWishlist = async () => {
  try {
    const res = await api.get('/wishlist')
    wishlistItems.value = res.data.map((item: any) => ({
      ...item,
      selectedColor: null,
      selectedSize: ''
    }))
    // Reset to page 1 if data changes significantly or if current page becomes empty
    clampPage()
  } catch (e) {
    console.error('Failed to load wishlist')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!requireAuth()) return
  loadWishlist()
})

const removeItem = async (id: number) => {
  try {
    await api.post('/wishlist/toggle', { product_id: wishlistItems.value.find(i => i.id === id).product_id })
    loadWishlist()
    toast.success('Item removed from wishlist')
  } catch (e) {
    toast.error('Failed to remove item')
  }
}

const addToCart = async (item: any) => {
  try {
    await api.post('/cart', {
      product_id: item.product_id,
      quantity: 1,
      color_id: item.selectedColor,
      size_id: item.selectedSize
    })
    toast.success(`${item.product.name} added to cart!`)
    ui.openCart()
  } catch (e) {
    toast.error('Failed to add to cart.')
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 60px 25px;
  min-height: 80vh;
}

.header {
  margin-bottom: 40px;
}

.header h1 {
  font-size: 36px;
  font-weight: 900;
  margin: 0 0 10px;
  color: var(--color-heading);
}

.header p {
  color: #888;
  font-weight: 600;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--color-card-bg);
  border-radius: 30px;
  box-shadow: 0 10px 30px var(--color-card-shadow);
  border: 1px solid var(--color-border);
}

.empty-icon {
  display: flex;
  justify-content: center;
  color: var(--color-border);
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: var(--color-heading);
}

.empty-state p {
  color: #888;
  margin-bottom: 30px;
}

.btn-shop {
  display: inline-block;
  padding: 14px 30px;
  background: var(--primary);
  color: #111;
  text-decoration: none;
  border-radius: 14px;
  font-weight: 800;
  transition: 0.3s;
}

.btn-shop:hover {
  background: var(--primary-dark);
  color: #111;
  transform: translateY(-3px);
}

/* TABLE */
.wishlist-table-container {
  background: var(--color-card-bg);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px var(--color-card-shadow);
  border: 1px solid var(--color-border);
}

.wishlist-table {
  width: 100%;
  border-collapse: collapse;
}

.wishlist-table th {
  text-align: left;
  padding: 20px 24px;
  background: var(--color-background-soft);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  border-bottom: 1px solid var(--color-border);
}

.wishlist-table td {
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.product-info img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 16px;
  background: var(--color-background-soft);
}

.product-info .name {
  display: block;
  font-weight: 800;
  font-size: 16px;
  color: var(--color-heading);
  text-decoration: none;
  margin-bottom: 4px;
}

.product-info .name:hover {
  color: #eab308;
}

.product-info .category {
  font-size: 13px;
  color: #999;
}

.price {
  font-weight: 900;
  color: #eab308;
  font-size: 17px;
}

.stock-status {
  font-size: 13px;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  padding: 4px 10px;
  border-radius: 8px;
}

.stock-status.out {
  color: #dc2626;
  background: #fef2f2;
}

.selection-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 160px;
}

.mini-selectors {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selector-dots {
  display: flex;
  gap: 6px;
}

.mini-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid var(--color-border);
  transition: 0.2s;
}

.mini-dot.active {
  border-color: var(--primary);
  transform: scale(1.2);
}

.mini-size-select {
  width: 100%;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 12px;
  font-weight: 700;
  outline: none;
  cursor: pointer;
}

.btn-add-cart {
  padding: 10px 16px;
  background: var(--primary);
  color: #111;
  border: none;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.btn-add-cart:hover:not(:disabled) {
  background: #eab308;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(234, 179, 8, 0.3);
}

.btn-add-cart:disabled {
  background: var(--color-background-soft);
  color: #888;
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-remove {
  background: var(--color-background-mute);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.btn-remove:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* PAGINATION */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
  padding: 20px;
  border-top: 1px solid var(--color-border);
}

.page-btn {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  width: 36px;
  height: 36px;
  border-radius: 8px;
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

.skeleton-rows {
  padding: 20px 24px;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border);
}

.skeleton-row:last-child {
  border-bottom: none;
}

.fade-up {
  animation: fadeUp 0.8s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@media(max-width: 768px) {
  .wishlist-table th:nth-child(3),
  .wishlist-table td:nth-child(3) {
    display: none;
  }
}
</style>
