<template>
  <main class="checkout-page fade-up">
    <div class="container">
      <div class="title-row">
        <h1>Secure <span>Checkout</span></h1>
        <RouterLink to="/cart">Return to Cart</RouterLink>
      </div>

      <div class="checkout-layout">
        <!-- LEFT: FORM -->
        <div class="checkout-form">
          <section class="form-section">
            <h3>Shipping Information</h3>
            <div class="form-grid">
              <div class="input-group">
                <label>Full Name</label>
                <input type="text" v-model="form.name" placeholder="John Doe" required>
              </div>
              <div class="input-group">
                <label>Phone Number</label>
                <input type="text" v-model="form.phone" placeholder="0812..." required>
              </div>
              <div class="input-group full">
                <label>Shipping Address</label>
                <textarea v-model="form.address" placeholder="Street, City, Province, Postal Code" rows="3" required></textarea>
              </div>
            </div>
          </section>

          <section class="form-section">
            <h3>Payment Method</h3>
            <div class="payment-grid">
              <label class="payment-card" :class="{ active: form.payment_method === 'xendit' }">
                <input type="radio" v-model="form.payment_method" value="xendit">
                <div class="p-icon xendit-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="6" fill="#0063FF"/>
                    <path d="M7 7L17 17M17 7L7 17" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="p-text">
                  <strong>Automatic Payment (Xendit)</strong>
                  <span>Credit Card, Virtual Account, QRIS</span>
                </div>
              </label>

              <label class="payment-card" :class="{ active: form.payment_method === 'bank_transfer' }">
                <input type="radio" v-model="form.payment_method" value="bank_transfer">
                <div class="p-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                </div>
                <div class="p-text">
                  <strong>Bank Transfer</strong>
                  <span>Manual Verification</span>
                </div>
              </label>

              <transition name="expand">
                <div v-if="form.payment_method === 'bank_transfer'" class="payment-details bank-details">
                  <div class="bank-info-box">
                    <p>Please transfer the total amount to:</p>
                    <div class="bank-row">
                      <strong>BCA</strong>
                      <span>123-456-7890</span>
                    </div>
                    <div class="bank-row">
                      <strong>Name</strong>
                      <span>ZPORTS OFFICIAL</span>
                    </div>
                  </div>
                </div>
              </transition>

              <label class="payment-card" :class="{ active: form.payment_method === 'cod' }">
                <input type="radio" v-model="form.payment_method" value="cod">
                <div class="p-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
                </div>
                <div class="p-text">
                  <strong>COD</strong>
                  <span>Cash on Delivery</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        <!-- RIGHT: SUMMARY -->
        <aside class="order-summary">
          <h3>Order Summary</h3>
          <div class="summary-list">
            <div v-for="item in cartItems" :key="item.id" class="summary-item-enchanted">
              <div class="s-img">
                <img :src="getImageUrl(item.product.image)" alt="">
                <span class="s-qty">{{ item.quantity }}</span>
              </div>
              <div class="s-info">
                <span class="s-name">{{ item.product.name }}</span>
                <div class="s-meta">
                  <div class="m-item" v-if="item.color">
                    <span class="m-label">Color:</span>
                    <span class="m-dot" :style="{ background: item.color.hex_code }"></span>
                    <span class="m-val">{{ item.color.name }}</span>
                  </div>
                  <div class="m-item" v-if="item.size">
                    <span class="m-label">Size:</span>
                    <span class="m-val">{{ item.size.name }}</span>
                  </div>
                </div>
              </div>
              <div class="s-price">
                {{ ui.formatPrice(item.product.price * item.quantity) }}
              </div>
            </div>
          </div>

          <div class="summary-totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>{{ ui.formatPrice(rawSubtotal) }}</span>
            </div>
            
            <div class="total-row discount-row" v-if="totalDiscount > 0">
              <span>Discount</span>
              <span class="discount-val">-{{ ui.formatPrice(totalDiscount) }}</span>
            </div>

            <div class="total-row">
              <span>Shipping</span>
              <span :class="{ 'free': shippingFee === 0 }">
                {{ shippingFee === 0 ? 'FREE' : ui.formatPrice(shippingFee) }}
              </span>
            </div>

            <div class="total-row grand">
              <span>Grand Total</span>
              <span>{{ ui.formatPrice(grandTotal) }}</span>
            </div>
          </div>

          <button class="btn-order" @click="placeOrder" :disabled="loading">
            {{ loading ? 'Processing...' : 'Place Order Now' }}
          </button>
          <p class="secure-text">🔒 Secure SSL encrypted checkout</p>
        </aside>
      </div>
    </div>

    <!-- PAYMENT PROCESSING OVERLAY -->
    <transition name="fade">
      <div v-if="loading" class="payment-overlay">
        <div class="overlay-content">
          <div class="secure-icon-wrapper">
            <div class="pulse-ring"></div>
            <svg class="secure-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          
          <div class="processing-status">
            <h2 class="status-title">{{ processingStepTitle }}</h2>
            <p class="status-subtitle">Please do not close or refresh this page.</p>
          </div>

          <div class="progress-bar-container">
            <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <div class="secure-badges">
            <div class="badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              PCI-DSS Compliant
            </div>
            <div class="badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Secure Encryption
            </div>
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { ui } from '../stores/ui'
import { toast } from '../stores/toast'

const router = useRouter()
const loading = ref(false)
const cartItems = ref<any[]>([])

// ENCHANTED LOADING STATES
const progressPercent = ref(0)
const processingStepTitle = ref('Verifying Order...')
const steps = ['Verifying Order...', 'Securing Transaction...', 'Finalizing Details...', 'Processing Payment...']

const form = ref({
  name: '',
  phone: '',
  address: '',
  payment_method: 'xendit',
  sub_payment_method: ''
})

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/src/assets/images/shoe1.jpg'
  if (imagePath.startsWith('http')) return imagePath
  return `http://127.0.0.1:8000/storage/${imagePath}`
}

// PRICE CALCULATIONS
const rawSubtotal = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
})

const totalDiscount = computed(() => {
  return cartItems.value.reduce((acc, item) => {
    const discount = Number(item.product.discount) || 0
    if (discount > 0) {
      const discountAmount = (item.product.price * discount) / 100
      return acc + (discountAmount * item.quantity)
    }
    return acc
  }, 0)
})

const shippingFee = computed(() => {
  // If COD, add shipping fee (e.g., Rp 50.000)
  if (form.value.payment_method === 'cod') {
    return 50000
  }
  return 0 // Free for other methods
})

const grandTotal = computed(() => {
  return rawSubtotal.value - totalDiscount.value + shippingFee.value
})

onMounted(async () => {
  try {
    const res = await api.get('/cart')
    cartItems.value = res.data
    if (cartItems.value.length === 0) {
      toast.error('Your cart is empty')
      router.push('/shop')
    }
    
    // Auto fill user data
    const userRes = await api.get('/user')
    form.value.name = userRes.data.name
    form.value.phone = userRes.data.phone || ''
    form.value.address = userRes.data.address || ''
  } catch (e) {
    console.error('Failed to load checkout data')
  }
})

const placeOrder = async () => {
  if (!form.value.address || !form.value.phone) {
    toast.error('Please complete the shipping information')
    return
  }

  loading.value = true
  progressPercent.value = 10
  
  // ANIMATION STEPS SIMULATION
  const animateSteps = () => {
    let current = 0
    const interval = setInterval(() => {
      if (current < steps.length - 1) {
        current++
        processingStepTitle.value = steps[current] || ''
        progressPercent.value += 20
      } else {
        clearInterval(interval)
      }
    }, 800)
  }
  
  animateSteps()

  try {
    const res = await api.post('/checkout', form.value)
    progressPercent.value = 100
    
    if (res.data.invoice_url) {
      processingStepTitle.value = 'Invoice Ready! Redirecting...'
      setTimeout(() => {
        window.location.href = res.data.invoice_url
      }, 1000)
      return
    } else if (form.value.payment_method === 'xendit') {
      toast.error('Xendit Invoice failed to generate. Please check your backend .env or logs.')
      loading.value = false
      return
    }

    const methodLabel = form.value.payment_method === 'cod' ? 'COD Order Placed!' : 'Order Confirmed!'
    processingStepTitle.value = methodLabel
    
    // Jika ada URL Invoice dari Xendit, arahkan ke sana setelah delay singkat
    if (res.data.invoice_url) {
      processingStepTitle.value = 'Redirecting to payment...'
      toast.success('Order created! Opening payment page...')
      setTimeout(() => {
        window.location.href = res.data.invoice_url
      }, 1500)
    } else {
      processingStepTitle.value = 'Order Placed Successfully!'
      toast.success('Order placed successfully!')
      setTimeout(() => {
        router.push(`/order/details/${res.data.order.id}`) 
      }, 2000)
    }
  } catch (e: any) {
    loading.value = false
    const errMsg = e.response?.data?.message || 'Failed to place order. Please try again.'
    toast.error(errMsg)
  }
}
</script>

<style scoped>
.checkout-page {
  padding: 60px 0;
  min-height: 100vh;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.title-row h1 {
  font-size: 42px;
  font-weight: 900;
  color: var(--color-heading);
}

.title-row h1 span {
  color: var(--primary);
}

.title-row a {
  color: #888;
  text-decoration: none;
  font-weight: 700;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: flex-start;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  background: var(--color-card-bg);
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 4px 20px var(--color-card-shadow);
  border: 1px solid var(--color-border);
}

.form-section h3 {
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 800;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group.full {
  grid-column: span 2;
}

.input-group label {
  font-weight: 700;
  font-size: 14px;
  color: var(--color-heading);
}

.input-group input, .input-group textarea {
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-heading);
  outline: none;
  font-family: inherit;
}

.input-group input:focus, .input-group textarea:focus {
  border-color: var(--primary);
}

/* PAYMENT */
.payment-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 2px solid var(--color-border);
  border-radius: 16px;
  cursor: pointer;
  color: var(--color-text);
  transition: 0.3s;
}

.payment-card input {
  display: none;
}

.payment-card.active {
  border-color: var(--primary);
  background: var(--color-background-soft);
}

.p-icon {
  font-size: 28px;
}

.p-text {
  display: flex;
  flex-direction: column;
}

.p-text strong {
  font-size: 16px;
  color: var(--color-heading);
}

.p-text span {
  font-size: 13px;
  color: var(--color-text);
}

.xendit-icon svg {
  display: block;
}

.xendit-logo-img {
  height: 24px;
  width: auto;
}

/* SUMMARY ENCHANTED */
.summary-item-enchanted {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-border);
}

.s-img {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.s-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  background: var(--color-background-soft);
}

.s-qty {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #111;
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-card-bg);
}

.s-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.s-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-heading);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.s-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.m-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.m-label {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: #666;
  letter-spacing: 0.5px;
}

.m-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
}

.m-val {
  font-size: 11px;
  font-weight: 700;
  color: #888;
}

.s-price {
  font-weight: 900;
  font-size: 15px;
  color: var(--color-heading);
}

/* SUMMARY */
.order-summary {
  background: var(--color-card-bg);
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 4px 20px var(--color-card-shadow);
  border: 1px solid var(--color-border);
  position: sticky;
  top: 100px;
}

.order-summary h3 {
  margin-bottom: 20px;
  color: var(--color-heading);
}

.summary-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-heading);
}

.item-info {
  display: flex;
  flex-direction: column;
}

.item-info span {
  font-size: 13px;
  color: var(--color-text);
}

.summary-totals {
  border-top: 2px dashed var(--color-border);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
}

.total-row.grand {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 700;
  margin-top: 10px;
}

.discount-val {
  color: #ef4444;
}

.free {
  color: #22c55e;
}

.btn-order {
  width: 100%;
  padding: 18px;
  background: var(--primary);
  color: #111;
  border-radius: 16px;
  border: none;
  font-size: 16px;
  font-weight: 900;
  margin-top: 30px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-order:hover:not(:disabled) {
  background: #eab308;
  color: #111;
  transform: translateY(-4px);
}

.btn-order:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secure-text {
  text-align: center;
  font-size: 12px;
  color: #aaa;
  margin-top: 15px;
}

/* DYNAMIC PAYMENT SECTIONS */
.payment-details {
  background: var(--color-background-soft);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--color-border);
  margin-top: -10px;
  margin-bottom: 5px;
}

.bank-info-box p {
  font-size: 13px;
  color: var(--color-text);
  margin-bottom: 12px;
}

.bank-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}

.bank-row:last-child {
  border-bottom: none;
}

.bank-row strong {
  color: var(--color-text);
  font-size: 13px;
}

.bank-row span {
  font-weight: 800;
  color: var(--color-heading);
}

.hint {
  font-size: 12px !important;
  color: var(--primary) !important;
  font-style: italic;
  margin-top: 15px;
}

.sub-methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.sub-card {
  padding: 15px 10px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  background: var(--color-card-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--color-text);
}

.sub-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 14px;
  color: white;
}

.sub-icon.gopay { background: #00aade; }
.sub-icon.ovo { background: #4d2a86; }
.sub-icon.dana { background: #118ee9; }

.sub-card span {
  font-size: 13px;
  font-weight: 700;
}

.sub-card input {
  display: none;
}

.sub-card.active {
  border-color: var(--primary);
  background: var(--color-background-soft);
  color: var(--primary);
}

.sub-card:hover:not(.active) {
  border-color: var(--color-border);
}

/* PAYMENT OVERLAY ENCHANTED */
.payment-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 15, 0.85); /* Deep dark glass */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-content {
  text-align: center;
  max-width: 420px;
  width: 90%;
  animation: scaleIn 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  background: rgba(255, 255, 255, 0.03);
  padding: 50px 30px;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 25px 50px rgba(0,0,0,0.3);
}

.secure-icon-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  inset: 0;
  border: 4px solid var(--primary);
  border-radius: 50%;
  animation: pulsePing 2s infinite;
}

.secure-svg {
  width: 44px;
  height: 44px;
  color: var(--primary);
  z-index: 2;
  filter: drop-shadow(0 0 10px rgba(250, 204, 21, 0.5));
}

.processing-status {
  margin-bottom: 35px;
}

.status-title {
  font-size: 26px;
  font-weight: 900;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.status-subtitle {
  color: #888;
  font-size: 14px;
  font-weight: 600;
}

.progress-bar-container {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 45px;
  border: 1px solid rgba(255,255,255,0.1);
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #facc15, #fde047);
  box-shadow: 0 0 25px rgba(250, 204, 21, 0.4);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.secure-badges {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.badge svg {
  color: #22c55e;
}

/* TRANSITIONS */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 200px;
  overflow: hidden;
}

.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.8) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes pulsePing {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 1000px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
</style>