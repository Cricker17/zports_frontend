<template>
  <main class="container detail fade-up" v-if="product">
    <div class="image-box">
      <!-- MAIN IMAGE -->
      <div class="main-image-wrapper">
        <img :src="getImageUrl(activeImage || product.image)" :alt="product.name" class="main-image">
      </div>

      <!-- THUMBNAIL SLIDER -->
      <div class="thumbnail-slider" v-if="product.image">
        <button class="nav-btn prev" @click="scrollSlider('left')" v-if="(product.gallery?.length || 0) > 4">
          ‹
        </button>
        
        <div class="thumbnail-grid" ref="thumbGrid">
          <div 
            class="thumb" 
            :class="{ active: activeImage === product.image || !activeImage }"
            @click="activeImage = product.image"
          >
            <img :src="getImageUrl(product.image)" alt="thumb 1">
          </div>
          
          <!-- REAL GALLERY IMAGES -->
          <div 
            v-for="(img, idx) in product.gallery" 
            :key="idx" 
            class="thumb"
            :class="{ active: activeImage === img }"
            @click="activeImage = img"
          >
            <img :src="getImageUrl(img)" :alt="'thumb ' + (Number(idx) + 2)">
          </div>
        </div>

        <button class="nav-btn next" @click="scrollSlider('right')" v-if="(product.gallery?.length || 0) > 4">
          ›
        </button>
      </div>
    </div>

    <div class="info-box">
      <p class="breadcrumb">
        <RouterLink to="/">Home</RouterLink> /
        <RouterLink to="/shop">Shop</RouterLink> /
        <span>{{ product.name }}</span>
      </p>

      <h1>{{ product.name }}</h1>
      <p class="brand" v-if="product.brand">{{ product.brand.name }}</p>
      <div class="price-container">
        <p class="price" :class="{ 'discounted': Number(product.discount) > 0 }">
          {{ ui.formatPrice(Number(product.discount) > 0 ? (product.price * (1 - Number(product.discount) / 100)) : product.price) }}
        </p>
        <div v-if="Number(product.discount) > 0" class="discount-info">
          <span class="old-price">{{ ui.formatPrice(product.price) }}</span>
          <span class="save-tag">SAVE {{ product.discount }}%</span>
        </div>
      </div>
      <p class="desc">{{ product.description || 'Premium product with modern design and all day comfort.' }}</p>

      <div class="meta">
        <span class="stock" v-if="product.stock > 0">✓ In Stock ({{ product.stock }})</span>
        <span class="stock out" v-else>✗ Out of Stock</span>
        <span class="category" v-if="product.category">{{ product.category.name }}</span>
        
        <!-- MINI COLOR TAGS -->
        <div class="mini-colors" v-if="product.colors && product.colors.length > 0">
          <div 
            v-for="color in product.colors" 
            :key="color.id" 
            class="mini-color-dot" 
            :style="{ backgroundColor: color.hex_code }"
            :title="color.name"
          ></div>
        </div>
      </div>

      <!-- COLORS SECTION -->
      <div class="product-colors" v-if="product.colors && product.colors.length > 0">
        <h4>Available Colors</h4>
        <div class="color-swatches">
          <div 
            v-for="color in product.colors" 
            :key="color.id" 
            class="color-swatch"
            :class="{ active: selectedColor?.id === color.id }"
            :style="{ backgroundColor: color.hex_code }"
            :title="color.name"
            @click="selectedColor = color"
          ></div>
        </div>
      </div>

      <!-- SIZES SECTION -->
      <div class="product-sizes" v-if="product.sizes && product.sizes.length > 0">
        <h4>Select Size</h4>
        <div class="size-chips">
          <div 
            v-for="size in product.sizes" 
            :key="size.id" 
            class="size-chip"
            :class="{ active: selectedSize?.id === size.id }"
            @click="selectedSize = size"
          >
            {{ size.name }}
          </div>
        </div>
      </div>

      <div class="buy-form">
        <div class="quantity-selector">
          <button @click="quantity > 1 && quantity--">-</button>
          <input type="number" v-model="quantity" min="1" :max="product.stock">
          <button @click="quantity < product.stock && quantity++">+</button>
        </div>
        <button class="btn-cart" @click="addToCart" :disabled="product.stock <= 0 || !product.is_active">
          <template v-if="product.is_active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            Add to Cart
          </template>
          <template v-else>Currently Unavailable</template>
        </button>
      </div>

      <!-- REVIEWS SECTION -->
      <div class="reviews-section">
        <div class="reviews-header-row">
          <h3>Customer Reviews</h3>
          <span class="reviews-count">{{ reviews.length }} reviews</span>
        </div>
        
        <div class="reviews-list">
          <div v-for="review in reviews" :key="review.id" class="review-card">
            <div class="user-info">
              <div class="avatar">{{ review.user.name.charAt(0) }}</div>
              <div class="user-meta">
                <strong>{{ review.user.name }}</strong>
                <div class="rating-stars">
                  <span v-for="i in 5" :key="i" :class="{ filled: i <= review.rating }">★</span>
                </div>
              </div>
            </div>
            <p class="review-text">{{ review.comment }}</p>
          </div>
          <div v-if="reviews.length === 0" class="no-reviews-box">
            <p>No reviews yet. Share your experience with this product!</p>
          </div>
        </div>

        <div class="add-review-card" v-if="isLoggedIn">
          <h4>Write a Review</h4>
          <form @submit.prevent="submitReview">
            <div class="rating-input-stars">
              <label>Your Rating:</label>
              <div class="star-selector">
                <span 
                  v-for="star in 5" 
                  :key="star" 
                  @click="newReview.rating = star"
                  @mouseover="hoverRating = star"
                  @mouseleave="hoverRating = 0"
                  :class="{ active: star <= (hoverRating || newReview.rating) }"
                >
                  ★
                </span>
              </div>
            </div>
            <textarea v-model="newReview.comment" placeholder="What did you like or dislike about this product?" rows="4"></textarea>
            <button type="submit" class="btn-review">Post Review</button>
          </form>
        </div>
        <div v-else class="login-prompt-card">
          <p>Want to review this product? <RouterLink to="/login">Sign in</RouterLink> first.</p>
        </div>
      </div>
    </div>
  </main>

  <section class="container related-products fade-up" v-if="product && relatedProducts.length > 0">
    <div class="section-title">
      <h2>You May Also Like</h2>
    </div>
    <div class="related-grid">
      <ProductCard v-for="rp in relatedProducts" :key="rp.id" :product="rp" />
    </div>
  </section>

  <main class="container detail" v-else-if="!product">
    <div class="image-box">
      <Skeleton height="500px" borderRadius="24px" />
      <div style="display: flex; gap: 12px; margin-top: 20px">
        <Skeleton v-for="i in 4" :key="i" width="80px" height="80px" borderRadius="12px" />
      </div>
    </div>
    <div class="info-box">
      <Skeleton width="40%" height="20px" style="margin-bottom: 20px" />
      <Skeleton width="80%" height="50px" style="margin-bottom: 15px" />
      <Skeleton width="30%" height="30px" style="margin-bottom: 30px" />
      <Skeleton v-for="i in 4" :key="i" width="100%" height="20px" style="margin-bottom: 10px" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '../services/api'
import { ui } from '../stores/ui'
import { toast } from '../stores/toast'
import Skeleton from '../components/Skeleton.vue'
import ProductCard from '../components/ProductCard.vue'
import { useImageUrl } from '../composables/useImageUrl'
import { useAuth } from '../composables/useAuth'
import { unwrapResponse } from '../services/apiHelpers'

const route = useRoute()
const product = ref<any>(null)
const quantity = ref(1)
const activeImage = ref<string | null>(null)
const thumbGrid = ref<HTMLElement | null>(null)
const selectedColor = ref<any>(null)
const selectedSize = ref<any>(null)

const scrollSlider = (direction: 'left' | 'right') => {
  if (!thumbGrid.value) return
  const scrollAmount = 200
  thumbGrid.value.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  })
}

const reviews = ref<any[]>([])
const { isLoggedIn } = useAuth()
const newReview = ref({ rating: 5, comment: '' })
const hoverRating = ref(0)
const relatedProducts = ref<any[]>([])

const { getImageUrl } = useImageUrl()

const loadReviews = async () => {
  try {
    const res = await api.get(`/products/${route.params.id}/reviews`)
    reviews.value = res.data
  } catch (error) {
    console.error('Failed to load reviews')
  }
}

const loadRelatedProducts = async () => {
  if (!product.value || !product.value.category_id) return
  try {
    const res = await api.get('/products', { params: { category: product.value.category_id, limit: 5 } })
    let rps = unwrapResponse(res.data)
    rps = rps.filter((p: any) => p.id !== product.value.id).slice(0, 4)
    relatedProducts.value = rps
  } catch (error) {
    console.error('Failed to load related products')
  }
}

onMounted(async () => {

  try {
    const res = await api.get(`/products/${route.params.id}`)
    product.value = res.data?.data ?? res.data
    
    // SEO Dynamic Title
    if (product.value) {
      document.title = `${product.value.name} | ZPORTS Sneaker Store`
    }
    
    // Select first color by default
    if (product.value.colors && product.value.colors.length > 0) {
      selectedColor.value = product.value.colors[0]
    }
    
    // Select first size by default
    if (product.value.sizes && product.value.sizes.length > 0) {
      selectedSize.value = product.value.sizes[0]
    }
    
    loadReviews()
    loadRelatedProducts()
  } catch (error) {
    console.error('Failed to load product:', error)
  }
})

const addToCart = async () => {
  if (!isLoggedIn.value) {
    toast.error('Please log in to add items to your cart.')
    return
  }
  try {
    const payload: any = {
      product_id: product.value.id,
      quantity: quantity.value
    }
    if (selectedColor.value) {
      payload.color_id = selectedColor.value.id
    }
    if (selectedSize.value) {
      payload.size_id = selectedSize.value.id
    }
    
    await api.post('/cart', payload)
    toast.success(`${quantity.value}x ${product.value.name} added to cart!`)
    ui.openCart()
  } catch (e) {
    toast.error('Failed to add item to cart.')
  }
}

const submitReview = async () => {
  try {
    await api.post(`/products/${product.value.id}/reviews`, newReview.value)
    newReview.value = { rating: 5, comment: '' }
    loadReviews()
    toast.success('Review posted successfully!')
  } catch (e) {
    toast.error('Failed to post review.')
  }
}
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: auto;
  padding: 60px 25px;
}

.detail {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr; /* Left column narrower, right column wider */
  gap: 60px;
  align-items: start;
}

/* IMAGE GALLERY */
.image-box {
  position: sticky;
  top: 100px;
  width: 100%;
}

.main-image-wrapper {
  width: 100%;
  aspect-ratio: 1/1;
  background: var(--color-background-soft);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px var(--color-card-shadow);
  margin-bottom: 20px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.4s ease;
}

.thumbnail-slider {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.thumbnail-grid {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 5px 0;
  margin: 0 5px;
  scrollbar-width: none;
  flex-grow: 1;
}

.thumbnail-grid::-webkit-scrollbar {
  display: none;
}

.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: 0.3s;
  font-size: 18px;
  backdrop-filter: blur(4px);
  flex-shrink: 0;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.thumb {
  flex: 0 0 calc((100% - 36px) / 4); /* Exactly 4 items visible */
  min-width: 50px;
  aspect-ratio: 1/1;
  background: var(--color-card-bg);
  border: 2px solid transparent;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s;
  padding: 4px;
}

.thumb:hover {
  border-color: var(--color-border);
}

.thumb.active {
  border-color: var(--primary);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* BREADCRUMB */
.breadcrumb {
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
}

.breadcrumb a {
  color: #999;
  text-decoration: none;
}

.breadcrumb a:hover {
  color: #eab308;
}

.breadcrumb span {
  color: var(--color-heading);
  font-weight: 700;
}

/* INFO */
h1 {
  font-size: 42px;
  font-weight: 900;
  color: var(--color-heading);
  margin: 0 0 8px;
}

.brand {
  font-size: 15px;
  color: #999;
  font-weight: 600;
  margin: 0 0 16px;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.price {
  font-size: 32px;
  font-weight: 900;
  color: var(--color-heading);
  margin: 0;
}

.price.discounted {
  color: #ef4444;
}

.discount-info {
  display: flex;
  flex-direction: column;
}

.old-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
  font-weight: 600;
}

.save-tag {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-size: 11px;
  font-weight: 900;
  padding: 2px 8px;
  border-radius: 6px;
  margin-top: 4px;
  width: fit-content;
}

.desc {
  color: var(--color-text);
  line-height: 1.8;
  font-size: 16px;
  margin-bottom: 24px;
}

/* META */
.meta {
  display: flex;
  gap: 14px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.stock {
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stock.out {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.category {
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.mini-colors {
  display: flex;
  gap: 6px;
  align-items: center;
}

.mini-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* COLORS */
.product-colors {
  margin-bottom: 30px;
}

.product-colors h4 {
  font-size: 14px;
  color: var(--color-heading);
  margin: 0 0 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.color-swatches {
  display: flex;
  gap: 12px;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #eee;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.active {
  border-color: var(--primary);
  transform: scale(1.1);
  box-shadow: 0 4px 10px var(--color-card-shadow-hover);
}

/* SIZES */
.product-sizes {
  margin-bottom: 30px;
}

.product-sizes h4 {
  font-size: 14px;
  color: var(--color-heading);
  margin: 0 0 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.size-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.size-chip {
  min-width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  border: 2px solid var(--color-border);
  background: var(--color-card-bg);
  color: var(--color-text);
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 0 15px;
  position: relative;
  overflow: hidden;
}

.size-chip::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--primary);
  opacity: 0;
  transition: 0.3s;
  z-index: -1;
}

.size-chip:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 20px var(--color-card-shadow);
}

.size-chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #111;
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 12px 24px rgba(250, 204, 21, 0.3);
  z-index: 2;
}

.size-chip.active:hover {
  transform: translateY(-6px) scale(1.15);
}

/* BUY FORM */
.buy-form {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  padding: 24px;
  background: var(--color-background-soft);
  border-radius: 20px;
  border: 1px solid var(--color-border);
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.quantity-selector button {
  width: 44px;
  height: 54px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  transition: 0.2s;
}

.quantity-selector button:hover {
  background: #f1f1f1;
}

.quantity-selector input {
  width: 50px;
  height: 54px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  outline: none;
}

.btn-cart {
  height: 54px;
  flex-grow: 1;
  border: none;
  border-radius: 12px;
  background: var(--primary);
  color: #111;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-cart:hover:not(:disabled) {
  background: #eab308;
  color: #111;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(234, 179, 8, 0.3);
}

.btn-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* REVIEWS SECTION PERFECTED */
.reviews-section {
  margin-top: 50px;
  padding-top: 40px;
  border-top: 2px solid var(--color-border);
}

.reviews-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.reviews-header-row h3 {
  font-size: 26px;
  font-weight: 900;
  margin: 0;
}

.reviews-count {
  background: var(--primary);
  color: #111;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.review-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px var(--color-card-shadow);
  transition: 0.3s;
}

.review-card:hover {
  transform: translateX(5px);
  border-color: var(--primary);
  background: var(--color-background-soft);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.avatar {
  width: 44px;
  height: 44px;
  background: var(--primary);
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 900;
  font-size: 18px;
}

.user-meta strong {
  display: block;
  font-size: 16px;
  margin-bottom: 2px;
  color: var(--color-heading);
}

.rating-stars span {
  color: #ddd;
  font-size: 14px;
}

.rating-stars span.filled {
  color: #eab308;
}

.review-text {
  color: var(--color-text);
  line-height: 1.6;
  font-size: 15px;
}

.no-reviews-box {
  text-align: center;
  padding: 40px;
  background: var(--color-background-soft);
  border-radius: 20px;
  color: var(--color-text);
}

.add-review-card {
  margin-top: 40px;
  padding: 30px;
  background: var(--color-card-bg);
  border: 2px solid var(--color-border);
  border-radius: 24px;
}

.add-review-card h4 {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 20px;
}

.rating-input-stars {
  margin-bottom: 20px;
}

.rating-input-stars label {
  display: block;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 10px;
}

.star-selector {
  display: flex;
  gap: 8px;
}

.star-selector span {
  font-size: 32px;
  color: #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
}

.star-selector span.active {
  color: #eab308;
  text-shadow: 0 0 10px rgba(234, 179, 8, 0.3);
}

.star-selector span:hover {
  transform: scale(1.15);
}

.add-review-card select,
.add-review-card textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-heading);
  border-radius: 14px;
  margin-bottom: 15px;
  font-family: inherit;
  outline: none;
  font-size: 15px;
}

.add-review-card textarea::placeholder {
  color: var(--color-text);
  opacity: 0.6;
}

.add-review-card textarea:focus {
  border-color: #eab308;
}

.btn-review {
  background: var(--primary);
  color: #111;
  border: none;
  padding: 14px 30px;
  border-radius: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
}

.btn-review:hover {
  background: #eab308;
  color: #111;
}

.login-prompt-card {
  margin-top: 30px;
  padding: 20px;
  background: rgba(234, 179, 8, 0.1);
  border-radius: 16px;
  text-align: center;
  color: var(--primary);
}

.login-prompt-card a {
  font-weight: 900;
  color: #b45309;
}

/* LOADING */
.loading {
  grid-column: 1/-1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #bbb;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #eee;
  border-top-color: #eab308;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 14px;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* RESPONSIVE */
@media(max-width:800px) {
  .detail {
    grid-template-columns: 1fr;
  }

  .image-box {
    position: static;
  }

  h1 {
    font-size: 32px;
  }
}

.related-products {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid var(--color-border);
}

.section-title {
  margin-bottom: 30px;
  text-align: center;
}

.section-title h2 {
  font-size: 32px;
  font-weight: 900;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

@media (max-width: 1200px) {
  .related-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 600px) {
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}
</style>