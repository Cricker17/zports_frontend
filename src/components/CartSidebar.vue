<template>
  <div class="cart-sidebar-wrapper" :class="{ active: ui.isCartSidebarOpen }">
    <!-- BACKDROP -->
    <div class="backdrop" @click="ui.closeCart"></div>

    <!-- PANEL -->
    <aside class="cart-panel">
      <div class="cart-header">
        <h2>Your Bag <span>({{ cartItems.length }})</span></h2>
        <button class="btn-close" @click="ui.closeCart">✕</button>
      </div>

      <div class="cart-content">
        <div v-if="loading" class="cart-loading">
          <Skeleton v-for="i in 3" :key="i" height="100px" borderRadius="16px" style="margin-bottom: 15px" />
        </div>

        <div v-else-if="cartItems.length === 0" class="cart-empty">
          <div class="empty-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
          <p>Your bag is empty</p>
          <button @click="ui.closeCart" class="btn-continue">Continue Shopping</button>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-img-wrapper">
              <img :src="getImageUrl(item.product?.image)" :alt="item.product?.name">
            </div>
            <div class="item-info">
              <div class="item-header">
                <h4>{{ item.product?.name }}</h4>
                <button @click="removeItem(item.id)" class="btn-remove" title="Remove Item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
              <p class="price">{{ ui.formatPrice(item.product?.price) }}</p>
              
              <!-- VARIANT SELECTION -->
              <div class="item-selectors-enchanted">
                <div class="selector-field" v-if="item.product.colors?.length">
                  <span class="selector-label">Color</span>
                  <div class="mini-dots">
                    <div 
                      v-for="c in item.product.colors" 
                      :key="c.id" 
                      class="mini-dot-wrapper"
                      :class="{ active: item.color_id === c.id }"
                      @click="updateItem(item.id, { color_id: c.id })"
                    >
                      <div class="mini-dot-inner" :style="{ background: c.hex_code }"></div>
                    </div>
                  </div>
                </div>
                
                <div class="selector-field" v-if="item.product.sizes?.length">
                  <span class="selector-label">Size</span>
                  <div class="mini-chips">
                    <div 
                      v-for="s in item.product.sizes" 
                      :key="s.id" 
                      class="mini-chip"
                      :class="{ active: item.size_id == s.id }"
                      @click="updateItem(item.id, { size_id: s.id })"
                    >
                      {{ s.name }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="qty-control">
                <div class="qty-enchanted-mini">
                  <button @click="updateItem(item.id, { quantity: item.quantity - 1 })" :disabled="item.quantity <= 1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                  <span class="qty-num">{{ item.quantity }}</span>
                  <button @click="updateItem(item.id, { quantity: item.quantity + 1 })">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
                <p class="item-total">{{ ui.formatPrice(item.product.price * item.quantity) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cart-footer" v-if="cartItems.length > 0">
        <div class="subtotal-row">
          <span>Subtotal</span>
          <span>{{ ui.formatPrice(subtotal) }}</span>
        </div>
        <button class="btn-checkout" @click="goToCheckout">Checkout Now</button>
        <button class="btn-view-cart" @click="goToCart">View Full Bag</button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ui } from '../stores/ui'
import api from '../services/api'
import Skeleton from './Skeleton.vue'
import { toast } from '../stores/toast'
import { useImageUrl } from '../composables/useImageUrl'

const router = useRouter()
const cartItems = ref<any[]>([])
const loading = ref(false)

const { getImageUrl } = useImageUrl()

const subtotal = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
})

const fetchCart = async () => {
  if (!ui.isCartSidebarOpen) return
  loading.value = true
  try {
    const res = await api.get('/cart')
    cartItems.value = res.data
  } catch (e) {
    console.error('Failed to fetch cart')
  } finally {
    loading.value = false
  }
}

const removeItem = async (id: number) => {
  try {
    await api.delete(`/cart/${id}`)
    fetchCart()
  } catch (e) {
    toast.error('Failed to remove')
  }
}

const updateItem = async (id: number, data: any) => {
  try {
    await api.put(`/cart/${id}`, data)
    fetchCart()
  } catch (e) {
    toast.error('Failed to update')
  }
}

const goToCheckout = () => {
  ui.closeCart()
  router.push('/checkout')
}

const goToCart = () => {
  ui.closeCart()
  router.push('/cart')
}

// Fetch cart whenever sidebar opens
watch(() => ui.isCartSidebarOpen, (isOpen) => {
  if (isOpen) fetchCart()
})
</script>

<style scoped>
.cart-sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  visibility: hidden;
  transition: 0.3s;
}

.cart-sidebar-wrapper.active {
  visibility: visible;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: 0.4s;
}

.active .backdrop {
  opacity: 1;
}

.cart-panel {
  position: absolute;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100%;
  background: var(--color-card-bg);
  box-shadow: -10px 0 40px var(--color-card-shadow);
  transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
}

.active .cart-panel {
  right: 0;
}

.cart-header {
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.cart-header h2 {
  font-size: 22px;
  font-weight: 900;
  margin: 0;
}

.cart-header h2 span {
  color: var(--color-heading);
  font-size: 16px;
}

.btn-close {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  color: var(--color-heading);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
}

.btn-close:hover {
  background: #eee;
  transform: rotate(90deg);
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

.cart-empty {
  text-align: center;
  padding-top: 100px;
}

.empty-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  opacity: 0.2;
}

.btn-continue {
  margin-top: 20px;
  background: var(--primary);
  color: #111;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.cart-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: var(--color-background-soft);
  border-radius: 20px;
  border: 1px solid var(--color-border);
  transition: 0.3s ease;
}

.cart-item:hover {
  border-color: var(--primary);
  transform: translateX(-4px);
}

.item-img-wrapper {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
}

.item-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  background: var(--color-card-bg);
}

.item-info {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.item-header h4 {
  font-size: 15px;
  font-weight: 800;
  margin: 0;
  color: var(--color-heading);
}

.price {
  font-weight: 700;
  color: #eab308;
  font-size: 14px;
  margin-bottom: 12px;
}

/* ENCHANTED SELECTORS */
.item-selectors-enchanted {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}

.selector-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.selector-label {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 1px;
}

.mini-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mini-dot-wrapper {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mini-dot-wrapper.active {
  border-color: var(--primary);
  transform: scale(1.1);
}

.mini-dot-inner {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
}

.mini-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mini-chip {
  padding: 4px 10px;
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  color: var(--color-text);
  cursor: pointer;
  transition: 0.3s;
}

.mini-chip:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.mini-chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #111;
  transform: scale(1.05);
}

/* QTY */
.qty-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qty-enchanted-mini {
  display: flex;
  align-items: center;
  background: var(--color-background-soft);
  border-radius: 10px;
  padding: 2px;
  border: 1px solid var(--color-border);
}

.qty-enchanted-mini button {
  width: 26px;
  height: 26px;
  border: none;
  background: var(--color-card-bg);
  color: var(--color-heading);
  border-radius: 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.qty-enchanted-mini button:hover:not(:disabled) {
  background: var(--primary);
  color: #111;
}

.qty-enchanted-mini button:disabled {
  opacity: 0.3;
}

.qty-num {
  width: 28px;
  text-align: center;
  font-size: 13px;
  font-weight: 900;
}

.item-total {
  font-weight: 900;
  font-size: 15px;
  color: var(--color-heading);
}

.btn-remove {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: 0.2s;
  display: flex;
}

.btn-remove:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.cart-footer {
  padding: 30px;
  background: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
}

.subtotal-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-weight: 900;
  font-size: 18px;
}

.btn-checkout {
  width: 100%;
  padding: 20px;
  background: var(--primary);
  color: #111;
  border: none;
  border-radius: 20px;
  font-weight: 900;
  font-size: 17px;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 25px rgba(250, 204, 21, 0.2);
}

.btn-checkout:hover {
  background: #eab308;
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 15px 30px rgba(234, 179, 8, 0.4);
}

.btn-view-cart {
  width: 100%;
  background: transparent;
  border: none;
  font-weight: 800;
  color: var(--color-text);
  opacity: 0.6;
  cursor: pointer;
  padding: 12px;
  font-size: 14px;
  transition: 0.3s;
}

.btn-view-cart:hover {
  opacity: 1;
  letter-spacing: 1px;
}

@media (max-width: 450px) {
  .cart-panel {
    width: 100%;
    right: -100%;
  }
}
</style>
