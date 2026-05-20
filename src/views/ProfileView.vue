<template>
  <main class="container profile-page fade-up">
    <div class="dashboard-grid">
      <!-- SIDEBAR / USER INFO -->
      <aside class="profile-sidebar">
        <div class="user-card">
          <div class="avatar-large">
            <img v-if="user?.profile_picture" :src="getImageUrl(user.profile_picture)" alt="Profile" class="avatar-img">
            <span v-else>{{ user?.name?.charAt(0) }}</span>
          </div>
          <div class="user-details">
            <h2>{{ user?.name }}</h2>
            <div class="info-list">
              <p><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> {{ user?.email }}</p>
              <p v-if="user?.phone"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> {{ user.phone }}</p>
              <p v-if="user?.address"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {{ user.address }}</p>
            </div>
            <RouterLink to="/profile/edit" class="btn-edit-profile" style="display: inline-block; text-align: center; text-decoration: none;">Edit Profile</RouterLink>
          </div>
        </div>

        <nav class="profile-nav">
          <button :class="{ active: view === 'overview' }" @click="view = 'overview'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Overview
          </button>
          <button :class="{ active: view === 'orders' }" @click="view = 'orders'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
            My Orders
          </button>
          <button @click="logout" class="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </nav>
      </aside>

      <!-- MAIN CONTENT -->
      <section class="profile-main">
        <!-- OVERVIEW -->
        <div v-if="view === 'overview'" class="overview-view">
          <h3>Account Statistics</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="#eab308"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </span>
              <div class="stat-info">
                <strong>{{ orders.length }}</strong>
                <span>Total Orders</span>
              </div>
            </div>
            <div class="stat-card">
              <span class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="#ef4444"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </span>
              <div class="stat-info">
                <strong>{{ wishlistCount }}</strong>
                <span>Wishlist Items</span>
              </div>
            </div>
            <div class="stat-card">
              <span class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="#3b82f6"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </span>
              <div class="stat-info">
                <strong>{{ cartCount }}</strong>
                <span>Items in Cart</span>
              </div>
            </div>
          </div>

          <div class="recent-orders" v-if="orders.length > 0">
            <div class="section-header">
              <h3>Recent Orders</h3>
              <button @click="view = 'orders'">View All</button>
            </div>
            <div class="mini-order-list">
              <div v-for="order in orders.slice(0, 5)" :key="order.id" class="mini-order-card">
                <span>ZP-ORD-{{ order.id }}</span>
                <span class="m-status" :class="order.status">{{ order.status }}</span>
                <span class="m-price">{{ ui.formatPrice(order.total_price) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ORDERS LIST -->
        <div v-if="view === 'orders'" class="orders-view">
          <div class="section-header">
            <h3>Order History</h3>
            <div class="order-header-actions">
              <input type="text" v-model="orderSearch" placeholder="Search Order ID or Product..." class="order-search-input">
              <button @click="view = 'overview'">← Back</button>
            </div>
          </div>

          <div v-if="loading" class="loading-state">
            <Skeleton v-for="i in 3" :key="i" height="120px" borderRadius="20px" style="margin-bottom: 20px" />
          </div>

          <div v-else-if="orders.length === 0" class="empty-orders">
            <p>No orders found.</p>
            <RouterLink to="/shop" class="btn-shop-now">Start Shopping</RouterLink>
          </div>

          <div v-else class="orders-list">
            <div v-for="order in paginatedOrders" :key="order.id" class="order-card">
              <div class="order-header">
                <div>
                  <h4>ZP-ORD-{{ order.id }}</h4>
                  <div class="order-subtitle">
                    <span class="item-count">{{ order.items?.length || 0 }} Items</span>
                    <span class="dot">•</span>
                    <span class="date">{{ new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
                  </div>
                </div>
                <div class="order-meta">
                  <span class="status-badge" :class="order.status">{{ order.status }}</span>
                  <span class="total">{{ ui.formatPrice(order.total_price) }}</span>
                  
                  <!-- ACTIONS -->
                  <div class="order-actions">
                    <div class="main-actions">
                      <RouterLink :to="'/order/details/' + order.id" class="btn-view-details">
                        View Details
                      </RouterLink>
                      <RouterLink :to="'/order/track/' + order.id" class="btn-track-package">
                        Track Package
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
              <div class="order-items-list">
                <div v-for="item in order.items" :key="item.id" class="order-item-row" @click="openReviewModal(item.product)">
                  <img :src="getImageUrl(item.product?.image)" :alt="item.product?.name">
                  <div class="oi-details">
                    <span class="oi-name">{{ item.product?.name }}</span>
                    <span class="oi-qty">Qty: {{ item.quantity }}</span>
                  </div>
                  <button class="btn-review" @click.stop="openReviewModal(item.product)">Review</button>
                </div>
              </div>
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
        </div>
      </section>
    </div>

    <!-- REVIEW MODAL -->
    <div v-if="showReviewModal" class="modal-overlay" @click.self="closeReviewModal">
      <div class="modal-content review-modal">
        <button class="close-btn" @click="closeReviewModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h3>Review Product</h3>
        <div v-if="productToReview" class="review-product-info">
          <img :src="getImageUrl(productToReview.image)" :alt="productToReview.name">
          <div class="rp-details">
            <h4>{{ productToReview.name }}</h4>
            <span class="rp-price">{{ ui.formatPrice(productToReview.price) }}</span>
          </div>
        </div>
        <div class="review-form">
          <div class="rating-select">
            <span>Rating:</span>
            <div class="stars">
              <svg v-for="star in 5" :key="star" @click="reviewRating = star" :class="{ active: star <= reviewRating }" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
          </div>
          <textarea v-model="reviewComment" placeholder="Write your review here..."></textarea>
          <button class="btn-submit-review" @click="submitReview" :disabled="isSubmittingReview">
            {{ isSubmittingReview ? 'Submitting...' : 'Submit Review' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import api from '../services/api'
import { ui } from '../stores/ui'
import { toast } from '../stores/toast'
import Skeleton from '../components/Skeleton.vue'

const router = useRouter()
const user = ref<any>(null)
const orders = ref<any[]>([])
const wishlistCount = ref(0)
const cartCount = ref(0)
const loading = ref(true)
const view = ref<'overview' | 'orders'>('overview')

const orderSearch = ref('')
const filteredOrders = computed(() => {
  if (!orderSearch.value) return orders.value
  const q = orderSearch.value.toLowerCase()
  return orders.value.filter(order => {
    if (String(`ZP-ORD-${order.id}`).toLowerCase().includes(q)) return true
    if (order.status.toLowerCase().includes(q)) return true
    if (order.items && order.items.some((item: any) => item.product?.name?.toLowerCase().includes(q))) return true
    return false
  })
})

const currentPage = ref(1)
const itemsPerPage = 5
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredOrders.value.slice(start, start + itemsPerPage)
})

// Reset to page 1 when search changes
watch(orderSearch, () => {
  currentPage.value = 1
})

// Removed avatar upload refs

const showReviewModal = ref(false)
const productToReview = ref<any>(null)
const reviewRating = ref(5)
const reviewComment = ref('')
const isSubmittingReview = ref(false)

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/src/assets/images/shoe1.jpg'
  if (imagePath.startsWith('http')) return imagePath
  return `http://127.0.0.1:8000/storage/${imagePath}`
}

const loadProfileData = async () => {
  loading.value = true
  try {
    const [userRes, orderRes, wishlistRes, cartRes] = await Promise.all([
      api.get('/user'),
      api.get('/orders'),
      api.get('/wishlist'),
      api.get('/cart')
    ])
    user.value = userRes.data
    orders.value = orderRes.data
    wishlistCount.value = wishlistRes.data.length
    cartCount.value = cartRes.data.length
  } catch (e) {
    console.error('Failed to load profile data')
    toast.error('Failed to load profile data')
  } finally {
    loading.value = false
  }
}

const openReviewModal = (product: any) => {
  productToReview.value = product
  reviewRating.value = 5
  reviewComment.value = ''
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  productToReview.value = null
}

const submitReview = async () => {
  if (!productToReview.value || !reviewComment.value.trim()) {
    toast.error('Please write a comment')
    return
  }

  isSubmittingReview.value = true
  try {
    await api.post(`/products/${productToReview.value.id}/reviews`, {
      rating: reviewRating.value,
      comment: reviewComment.value
    })
    toast.success('Review submitted successfully!')
    closeReviewModal()
  } catch (e: any) {
    if (e.response?.status === 401) {
      toast.error('Please login to submit a review')
    } else {
      toast.error(e.response?.data?.message || 'Failed to submit review')
    }
  } finally {
    isSubmittingReview.value = false
  }
}

const logout = () => {
  sessionStorage.removeItem('auth_token')
  window.location.href = '/'
}

onMounted(() => {
  if (!sessionStorage.getItem('auth_token')) {
    router.push('/login')
    return
  }
  loadProfileData()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: auto;
  padding: 60px 25px;
  min-height: 80vh;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  align-items: flex-start;
}

/* SIDEBAR */
.profile-sidebar {
  background: var(--color-card-bg);
  border-radius: 30px;
  padding: 40px 30px;
  box-shadow: 0 10px 40px var(--color-card-shadow);
  border: 1px solid var(--color-border);
  position: sticky;
  top: 100px;
}

.user-card {
  text-align: center;
  margin-bottom: 40px;
}

.avatar-large {
  width: 100px;
  height: 100px;
  background: var(--primary);
  color: var(--color-heading);
  font-size: 42px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;
  margin: 0 auto 20px;
  box-shadow: 0 10px 20px rgba(250, 204, 21, 0.2);
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: 0.3s;
}

.avatar-large:hover .upload-overlay {
  opacity: 1;
}

.user-details h2 {
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 5px;
}

.user-details p {
  color: #888;
  font-size: 13px;
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
}

.info-list {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.btn-edit-profile {
  background: var(--color-background-soft);
  color: var(--color-heading);
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.btn-edit-profile:hover {
  background: #eee;
}

/* EDIT MODE */
.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.edit-input {
  padding: 10px;
  border: 2px solid #facc15;
  border-radius: 10px;
  outline: none;
  font-family: inherit;
  font-weight: 700;
  text-align: center;
  width: 100%;
}
textarea.edit-input {
  resize: vertical;
}

.edit-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-save {
  background: var(--primary);
  color: #111;
  border: none;
  padding: 6px 15px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-cancel {
  background: #eee;
  border: none;
  padding: 6px 15px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-nav button {
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 16px;
  background: transparent;
  text-align: left;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  color: #666;
}

.profile-nav button:hover {
  background: var(--color-background-soft);
  color: var(--color-heading);
}

.profile-nav button.active {
  background: var(--primary);
  color: #111;
}

.logout-btn {
  margin-top: 20px;
  color: #ef4444 !important;
}

.logout-btn:hover {
  background: #fef2f2 !important;
}

/* MAIN CONTENT */
.profile-main {
  min-height: 600px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: var(--color-card-bg);
  padding: 25px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px var(--color-card-shadow);
  border: 1px solid var(--color-border);
}

.stat-icon {
  font-size: 30px;
  width: 60px;
  height: 60px;
  background: #fcfcfc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
}

.stat-info strong {
  display: block;
  font-size: 24px;
  font-weight: 900;
}

.stat-info span {
  font-size: 13px;
  color: #999;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 22px;
  font-weight: 900;
  margin: 0;
}

.section-header button {
  background: transparent;
  border: none;
  color: #eab308;
  font-weight: 800;
  cursor: pointer;
}

.order-header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.order-search-input {
  padding: 8px 15px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background);
  color: var(--color-text);
  font-family: inherit;
  outline: none;
  transition: 0.3s;
}

.order-search-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
}

.mini-order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mini-order-card {
  background: var(--color-card-bg);
  padding: 15px 25px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--color-border);
  color: var(--color-heading);
}

.m-status {
  font-size: 11px;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 800;
}

.m-status.pending { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }
.m-status.paid { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
.m-status.shipped { background: #f0f9ff; color: #0284c7; border: 1px solid #e0f2fe; }
.m-status.completed { background: #ecfdf5; color: #059669; border: 1px solid #d1fae5; }
.m-status.failed, .m-status.expired { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
.m-status.canceled, .m-status.cancelled { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }

/* ORDERS VIEW */
.order-card {
  background: var(--color-card-bg);
  border-radius: 24px;
  padding: 25px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 15px var(--color-card-shadow);
  transition: 0.3s;
}

.order-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px var(--color-card-shadow);
  border-color: var(--primary);
  background: var(--color-card-bg) !important; /* Lock to card bg */
}

/* Dark mode specific hover adjustment */
:root.dark .order-card:hover {
  background: var(--color-background-soft) !important;
  box-shadow: 0 0 30px rgba(250, 204, 21, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-border);
}

.order-header h4 {
  margin: 0 0 5px;
  font-size: 18px;
}

.order-subtitle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #888;
}

.item-count {
  font-weight: 700;
  color: var(--color-heading);
}

.dot {
  color: #ddd;
}

.date {
  color: #999;
}

.order-meta {
  text-align: right;
}

.status-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 10px;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.status-badge.pending { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }
.status-badge.paid { background: #eff6ff; color: #2563eb; border: 1px solid #dbeafe; }
.status-badge.shipped { background: #f0f9ff; color: #0284c7; border: 1px solid #e0f2fe; }
.status-badge.completed { background: #ecfdf5; color: #059669; border: 1px solid #d1fae5; }
.status-badge.failed, .status-badge.expired { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
.status-badge.canceled, .status-badge.cancelled { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }

.order-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.main-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-view-details {
  background: var(--color-background-soft);
  color: var(--color-heading);
  padding: 8px 15px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  transition: 0.3s;
}

.btn-view-details:hover {
  background: #eee;
}

.btn-track-package {
  background: var(--primary);
  color: #111;
  padding: 8px 15px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  transition: 0.3s;
}

.btn-track-package:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(250, 204, 21, 0.2);
}

.total {
  display: block;
  font-size: 18px;
  font-weight: 900;
}

.order-items-preview {
  display: flex;
  align-items: center;
  gap: 10px;
}

.order-items-preview img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 10px;
  background: #f5f5f5;
}

.more {
  font-size: 12px;
  font-weight: 700;
  color: #999;
  background: #f5f5f5;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.empty-orders {
  text-align: center;
  padding: 60px;
  background: var(--color-background-soft);
  border-radius: 24px;
}

.btn-shop-now {
  display: inline-block;
  margin-top: 15px;
  padding: 12px 25px;
  background: var(--primary);
  color: #111;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
}

.fade-up {
  animation: fadeUp 0.6s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .profile-sidebar {
    position: static;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* ORDER ITEMS LIST */
.order-items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
}

.order-item-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: var(--color-background-soft);
  border-radius: 12px;
  color: var(--color-heading);
  cursor: pointer;
  transition: 0.2s;
}

.order-item-row:hover {
  background: #f0f0f0;
}

.order-item-row img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  background: white;
}

.oi-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.oi-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-heading);
}

.oi-qty {
  font-size: 12px;
  color: #888;
}

.btn-review {
  padding: 8px 18px;
  background: var(--color-background-soft);
  color: var(--color-heading);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
}

.btn-review:hover {
  background: var(--primary);
  color: #111;
  border-color: var(--primary);
}

.btn-pay-now {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  padding: 10px 20px;
  background: var(--primary);
  color: #111;
  text-decoration: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  transition: 0.3s;
  box-shadow: 0 4px 15px rgba(250, 204, 21, 0.2);
  width: fit-content;
}

.btn-pay-now:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(250, 204, 21, 0.4);
}

.order-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.btn-simulate {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
  text-transform: uppercase;
  transition: 0.3s;
}

.btn-simulate:hover {
  background: #2563eb;
  transform: scale(1.05);
}

/* REVIEW MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 24px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  animation: slideUp 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  transition: 0.2s;
}

.close-btn:hover {
  color: #111;
}

.review-modal h3 {
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 800;
}

.review-product-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 12px;
}

.review-product-info img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
}

.rp-details h4 {
  margin: 0 0 5px;
  font-size: 16px;
}

.rp-price {
  font-size: 14px;
  color: #eab308;
  font-weight: 700;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rating-select {
  display: flex;
  align-items: center;
  gap: 15px;
  font-weight: 700;
}

.stars {
  display: flex;
  gap: 5px;
  cursor: pointer;
}

.stars svg {
  color: #ccc;
  transition: 0.2s;
}

.stars svg.active {
  color: #eab308;
  fill: #eab308;
}

.review-form textarea {
  width: 100%;
  height: 120px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 12px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}

.review-form textarea:focus {
  border-color: #111;
}

.btn-submit-review {
  background: #111;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-submit-review:hover:not(:disabled) {
  background: #333;
}

.btn-submit-review:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* PAGINATION */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
  padding-bottom: 20px;
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
