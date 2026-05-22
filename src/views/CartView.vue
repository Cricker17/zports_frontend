<template>
  <main class="container page fade-up">
    <h1>Your Cart</h1>

    <div v-if="loading" class="cart-items">
      <div v-for="i in 3" :key="i" class="box skeleton-box">
        <Skeleton width="80px" height="80px" borderRadius="12px" />
        <div class="item-info" style="flex: 1">
          <Skeleton width="60%" height="20px" borderRadius="6px" style="margin-bottom: 10px" />
          <Skeleton width="30%" height="16px" borderRadius="6px" />
        </div>
        <div class="item-actions">
          <Skeleton width="70px" height="30px" borderRadius="8px" />
        </div>
      </div>
    </div>

    <div v-else-if="cartItems.length === 0" class="empty">
      <p>Your cart is empty.</p>
      <RouterLink to="/shop" class="btn">Start Shopping</RouterLink>
    </div>

    <div v-else>
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="box">
          <img :src="getImageUrl(item.product?.image)" :alt="item.product?.name" class="cart-img">

          <div class="item-info">
            <h3>{{ item.product?.name }}</h3>
            
            <!-- VARIANT SELECTION -->
            <div class="item-variants-edit-enchanted">
              <div class="v-group" v-if="item.product.colors?.length">
                <span class="v-label">Color</span>
                <div class="mini-dots">
                  <div 
                    v-for="c in item.product.colors" 
                    :key="c.id" 
                    class="mini-dot-wrapper"
                    :class="{ active: item.color_id === c.id }"
                    @click="updateQty(item, 0, c.id, item.size_id)"
                  >
                    <div class="mini-dot-inner" :style="{ background: c.hex_code }"></div>
                  </div>
                </div>
              </div>
              
              <div class="v-group" v-if="item.product.sizes?.length">
                <span class="v-label">Size</span>
                <div class="v-chips">
                  <div 
                    v-for="s in item.product.sizes" 
                    :key="s.id" 
                    class="v-chip"
                    :class="{ active: item.size_id == s.id }"
                    @click="updateQty(item, 0, item.color_id, s.id)"
                  >
                    {{ s.name }}
                  </div>
                </div>
              </div>
            </div>

            <p class="item-price">{{ ui.formatPrice(item.product?.price) }}</p>
          </div>

          <div class="item-actions">
            <div class="qty-enchanted">
              <button @click="updateQty(item, -1)" :disabled="item.quantity <= 1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <span class="qty-val">{{ item.quantity }}</span>
              <button @click="updateQty(item, 1)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
            
            <p class="total-line">{{ ui.formatPrice(item.product?.price * item.quantity) }}</p>

            <button class="btn-remove" @click="removeItem(item.id)" title="Remove item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="summary">
        <h2>Total: {{ ui.formatPrice(cartTotal) }}</h2>
        <button class="btn-checkout" @click="checkout">
          Proceed to Checkout
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import api from '../services/api'

import { ui } from '../stores/ui'
import { toast } from '../stores/toast'
import Skeleton from '../components/Skeleton.vue'
import { useImageUrl } from '../composables/useImageUrl'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const cartItems = ref<any[]>([])
const loading = ref(true)

const { getImageUrl } = useImageUrl()
const { requireAuth } = useAuth()

const loadCart = async () => {
  try {
    const res = await api.get('/cart')
    cartItems.value = res.data
  } catch (e) {
    console.error('Failed to load cart')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!requireAuth()) return
  loadCart()
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.product?.price * item.quantity)
  }, 0)
})

const removeItem = async (id: number) => {
  try {
    await api.delete(`/cart/${id}`)
    loadCart()
    ui.fetchCartCount()
  } catch (e) {
    toast.error('Failed to remove item')
  }
}

const updateQty = async (item: any, delta: number, color_id?: any, size_id?: any) => {
  const newQty = item.quantity + delta
  if (newQty < 1 && delta !== 0) return
  
  try {
    await api.put(`/cart/${item.id}`, { 
      quantity: newQty,
      color_id: color_id !== undefined ? color_id : item.color_id,
      size_id: size_id !== undefined ? size_id : item.size_id
    })
    loadCart()
    ui.fetchCartCount()
  } catch (e) {
    toast.error('Failed to update cart')
  }
}

const checkout = () => {
  router.push('/checkout')
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 50px 25px;
  min-height: 80vh;
}

h1 {
  font-size: 36px;
  margin-bottom: 30px;
  color: var(--color-heading);
}

.empty {
  text-align: center;
  padding: 60px;
  background: var(--color-background-soft);
  border-radius: 20px;
  border: 1px solid var(--color-border);
}

.empty p {
  margin-bottom: 20px;
  color: var(--color-text);
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  background: var(--primary);
  color: #111;
  text-decoration: none;
  border-radius: 12px;
  font-weight: bold;
}

.box {
  background: var(--color-card-bg);
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px var(--color-card-shadow);
  border: 1px solid var(--color-border);
}

.cart-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  background: var(--color-background-soft);
}

.item-info {
  flex-grow: 1;
}

.item-info h3 {
  margin: 0 0 12px 0;
  color: var(--color-heading);
  font-size: 18px;
  font-weight: 800;
}

.item-variants-edit-enchanted {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.v-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.v-label {
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 1px;
}

.mini-dots {
  display: flex;
  gap: 10px;
}

.mini-dot-wrapper {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mini-dot-wrapper:hover {
  border-color: var(--color-border);
}

.mini-dot-wrapper.active {
  border-color: var(--primary);
  transform: scale(1.1);
}

.mini-dot-inner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
}

.v-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.v-chip {
  padding: 8px 16px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  color: var(--color-text);
  cursor: pointer;
  transition: 0.3s;
}

.v-chip:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

.v-chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #111;
  transform: scale(1.05);
}

.item-price {
  margin: 0;
  color: #eab308;
  font-weight: 900;
  font-size: 16px;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 30px;
}

/* QTY ENCHANTED */
.qty-enchanted {
  display: flex;
  align-items: center;
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 4px;
  border: 1px solid var(--color-border);
}

.qty-enchanted button {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--color-card-bg);
  color: var(--color-heading);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.qty-enchanted button:hover:not(:disabled) {
  background: var(--primary);
  color: #111;
  transform: translateY(-2px);
}

.qty-enchanted button:disabled {
  opacity: 0.3;
}

.qty-val {
  width: 40px;
  text-align: center;
  font-weight: 900;
  font-size: 15px;
  color: var(--color-heading);
}

.total-line {
  font-weight: 900;
  font-size: 18px;
  color: var(--color-heading);
  min-width: 100px;
  text-align: right;
}

.btn-remove {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: 0.3s;
  display: flex;
}

.btn-remove:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  transform: rotate(90deg);
}

.summary {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px dashed var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary h2 {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 28px;
  color: var(--color-heading);
}

.btn-checkout {
  height: 54px;
  padding: 0 36px;
  border: none;
  border-radius: 14px;
  background: var(--primary);
  color: #111;
  font-weight: 800;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
}

.btn-checkout:hover:not(:disabled) {
  background: #eab308;
  color: #111;
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.skeleton-box {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.fade-up {
  animation: fadeUp 0.6s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>