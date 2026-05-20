<template>
  <main class="order-details-page fade-up">
    <div class="container">
      <div class="header-row">
        <button @click="router.back()" class="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Orders
        </button>
        <div class="order-id-badge">
          <span>Order ID</span>
          <strong>ZP-ORD-{{ order?.id }}</strong>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loader"></div>
        <p>Fetching your order details...</p>
      </div>

      <div v-else-if="order" class="details-grid">
        <!-- LEFT COL: ITEMS & SHIPPING -->
        <div class="main-info">
          <section class="info-card items-section">
            <div class="card-header">
              <h3>Purchased Items</h3>
              <span class="item-count">{{ order.items?.length }} Items</span>
            </div>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.id" class="item-row">
                <div class="item-img">
                  <img :src="getImageUrl(item.product?.image)" :alt="item.product?.name">
                </div>
                <div class="item-info">
                  <span class="item-category" v-if="item.product?.category">{{ item.product.category.name }}</span>
                  <h4>{{ item.product?.name }}</h4>
                  <div class="item-variants">
                    <span v-if="item.color" class="variant">
                      Color: <span class="color-dot" :style="{ background: item.color.hex_code }"></span> {{ item.color.name }}
                    </span>
                    <span v-if="item.size" class="variant">Size: {{ item.size.name }}</span>
                  </div>
                </div>
                <div class="item-price-qty">
                  <span class="price">{{ ui.formatPrice(item.price) }}</span>
                  <span class="qty">Qty: {{ item.quantity }}</span>
                </div>
              </div>
            </div>
          </section>

          <section class="info-card shipping-section">
            <div class="card-header">
              <h3>Shipping Information</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div class="shipping-details">
              <div class="detail-item">
                <label>Receiver Name</label>
                <p>{{ order.name }}</p>
              </div>
              <div class="detail-item">
                <label>Phone Number</label>
                <p>{{ order.phone }}</p>
              </div>
              <div class="detail-item full">
                <label>Delivery Address</label>
                <p>{{ order.address }}</p>
              </div>
            </div>
          </section>
        </div>

        <!-- RIGHT COL: SUMMARY & STATUS -->
        <aside class="sidebar-info">
          <section class="info-card status-card">
            <div class="card-header">
              <h3>Order Status</h3>
              <span class="status-badge" :class="order.status">{{ order.status }}</span>
            </div>
            <p class="status-desc" v-if="order.status === 'pending'">Waiting for package to reach destination.</p>
            <p class="status-desc" v-if="order.status === 'paid'">Payment received. Preparing your package.</p>
            <p class="status-desc" v-if="order.status === 'shipped'">Package is on its way to you!</p>
            <p class="status-desc" v-if="order.status === 'completed'">Order finished. Thank you for shopping!</p>

            <div class="actions" v-if="order.status === 'shipped'">
              <RouterLink :to="'/order/track/' + order.id" target="_blank" class="btn-track">
                Track Package
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </RouterLink>
            </div>
          </section>

          <section class="info-card summary-card">
            <div class="card-header">
              <h3>Payment Summary</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            </div>
            <div class="summary-rows">
              <div class="s-row">
                <span>Payment Method</span>
                <strong class="capitalize">{{ order.payment_method }}</strong>
              </div>
              <div class="s-row">
                <span>Date Ordered</span>
                <span>{{ formatDate(order.created_at) }}</span>
              </div>
              <hr class="divider">
              <div class="s-row grand-total">
                <span>Total Amount</span>
                <strong>{{ ui.formatPrice(order.total_price) }}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import api from '../services/api'
import { ui } from '../stores/ui'
import { toast } from '../stores/toast'

const route = useRoute()
const router = useRouter()
const order = ref<any>(null)
const loading = ref(true)

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/src/assets/images/shoe1.jpg'
  if (imagePath.startsWith('http')) return imagePath
  return `http://127.0.0.1:8000/storage/${imagePath}`
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchOrderDetails = async () => {
  loading.value = true
  try {
    const res = await api.get(`/orders/${route.params.id}`)
    order.value = res.data
  } catch (e: any) {
    toast.error('Failed to load order details')
    router.push('/profile')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrderDetails()
})
</script>

<style scoped>
.order-details-page {
  padding: 60px 0;
  min-height: 100vh;
  background: var(--color-background);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 25px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.btn-back {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text);
  font-weight: 700;
  cursor: pointer;
  padding: 10px 0;
  transition: 0.3s;
}

.btn-back:hover {
  color: var(--primary);
  transform: translateX(-5px);
}

.order-id-badge {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.order-id-badge span {
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 800;
  color: var(--color-text);
  opacity: 0.7;
  letter-spacing: 1px;
}

.order-id-badge strong {
  font-size: 24px;
  font-weight: 900;
  color: var(--color-heading);
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
}

.info-card {
  background: var(--color-card-bg);
  border-radius: 24px;
  padding: 30px;
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 30px var(--color-card-shadow);
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  color: var(--color-heading);
}

.card-header h3 {
  font-size: 20px;
  font-weight: 900;
  margin: 0;
}

.item-count {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
  opacity: 0.6;
}

/* ITEMS */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.item-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-img {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  background: var(--color-background-soft);
  border-radius: 16px;
  overflow: hidden;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-category {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--primary);
  display: block;
  margin-bottom: 4px;
}

.item-info h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 800;
  color: var(--color-heading);
}

.item-variants {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: var(--color-text);
  opacity: 0.7;
  font-weight: 600;
}

.color-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #ddd;
  margin: 0 2px;
}

.item-price-qty {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-price-qty .price {
  font-weight: 900;
  font-size: 16px;
  color: var(--color-heading);
}

.item-price-qty .qty {
  font-size: 13px;
  color: var(--color-text);
  opacity: 0.7;
  font-weight: 700;
}

/* SHIPPING */
.shipping-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.detail-item.full {
  grid-column: span 2;
}

.detail-item label {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 5px;
  display: block;
}

.detail-item p {
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

/* STATUS & SIDEBAR */
.status-badge {
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pending { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }
.status-badge.paid { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
.status-badge.shipped { background: #f0f9ff; color: #0284c7; border: 1px solid #e0f2fe; }
.status-badge.completed { background: #ecfdf5; color: #059669; border: 1px solid #d1fae5; }
.status-badge.failed { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }

.status-desc {
  font-size: 14px;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 25px;
  line-height: 1.5;
}

.btn-track {
  width: 100%;
  padding: 16px;
  background: var(--primary);
  color: #111;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  font-weight: 900;
  transition: 0.3s;
}

.btn-track:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(250, 204, 21, 0.2);
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.s-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text);
  font-weight: 600;
}

.s-row strong {
  color: var(--color-heading);
}

.capitalize {
  text-transform: capitalize;
}

.divider {
  border: none;
  border-top: 1px dashed var(--color-border);
  margin: 10px 0;
}

.grand-total {
  font-size: 20px;
  color: var(--color-heading) !important;
}

.grand-total strong {
  font-size: 24px;
  color: var(--primary) !important;
}

.btn-pay {
  width: 100%;
  margin-top: 25px;
  padding: 16px;
  background: #111;
  color: white;
  border-radius: 16px;
  text-align: center;
  display: block;
  text-decoration: none;
  font-weight: 800;
  transition: 0.3s;
}

.btn-pay:hover {
  background: #333;
}

.loading-container {
  text-align: center;
  padding: 100px 0;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  .sidebar-info {
    order: -1;
  }
}
</style>
