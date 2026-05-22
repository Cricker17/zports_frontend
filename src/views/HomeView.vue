<template>
  <main>
    <div class="container" style="padding-top: 30px;">
      <Carousel />
    </div>

    <!-- CATEGORY -->
    <section class="section container category-section">
      <div class="title-row">
        <h2>Shop by Category</h2>
      </div>

      <div class="category-grid" v-if="loading">
        <Skeleton v-for="i in 3" :key="i" height="450px" borderRadius="30px" />
      </div>
      <div class="category-grid" v-else>
        <RouterLink v-for="cat in categories" :key="cat.id" :to="`/shop?category=${cat.id}`" class="cat-card">
          <img :src="getCatImage(cat)" :alt="cat.name">
          <div class="cat-overlay">
            <h3>{{ cat.name }}</h3>
            <span>Explore Now</span>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- PRODUCTS -->
    <section class="section container products-section">
      <div class="title-row">
        <h2>Trending Products</h2>

        <RouterLink to="/shop">
          View All
        </RouterLink>
      </div>

      <!-- Loading -->
      <div class="product-grid" v-if="loading">
        <div class="skeleton-card" v-for="i in 4" :key="i">
          <Skeleton height="220px" borderRadius="20px" />
          <div style="padding: 15px 0">
            <Skeleton width="80%" height="20px" borderRadius="4px" style="margin-bottom: 10px" />
            <Skeleton width="40%" height="15px" borderRadius="4px" />
          </div>
        </div>
      </div>

      <!-- Products -->
      <div class="product-grid" v-else-if="trendingProducts.length > 0">
        <div class="product-item" v-for="product in trendingProducts" :key="product.id">
          <ProductCard :product="product" />
        </div>
      </div>

      <!-- Empty -->
      <div class="empty-state" v-else>
        <p>No products available at the moment.</p>
      </div>
    </section>

    <!-- GET MORE DEALS -->
    <section class="get-more-deals" v-if="dealsProducts.length > 0">
      <div class="container">
        <div class="deals-header">
          <h2>Get More Deals!!</h2>
          <div class="deals-timer">
            <span>Ends in 12 hours</span>
            <div class="timer-boxes">
              <div class="time-box">{{ hours }}</div><span class="colon">:</span>
              <div class="time-box">{{ minutes }}</div><span class="colon">:</span>
              <div class="time-box">{{ seconds }}</div>
            </div>
          </div>
          <RouterLink to="/sale" class="view-all-deals">See All Offers</RouterLink>
        </div>

        <div class="deals-content" v-if="dealsBrand && dealsProducts.length > 0">
          <div class="deals-banner-card">
            <h2>{{ dealsBrand.name }}</h2>
          </div>
          <div class="deals-product-grid">
            <div class="deals-item" v-for="product in dealsProducts" :key="product.id">
              <ProductCard :product="product" :isSmall="true" />
            </div>
          </div>
        </div>
        <div class="deals-content" v-else>
          <div class="deals-banner-card">
            <h2>LAST<br>PAIRS</h2>
          </div>
          <div class="deals-product-grid">
            <div class="deals-item" v-for="product in trendingProducts.slice(0, 4)" :key="product.id">
              <ProductCard :product="product" :isSmall="true" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NEW PRODUCTS -->
    <section class="section container products-section">
      <div class="title-row">
        <h2>New Products</h2>

        <RouterLink to="/shop">
          View All
        </RouterLink>
      </div>

      <!-- Loading -->
      <div class="product-grid" v-if="loading">
        <div class="skeleton-card" v-for="i in 4" :key="i">
          <Skeleton height="220px" borderRadius="20px" />
          <div style="padding: 15px 0">
            <Skeleton width="80%" height="20px" borderRadius="4px" style="margin-bottom: 10px" />
            <Skeleton width="40%" height="15px" borderRadius="4px" />
          </div>
        </div>
      </div>

      <!-- Products -->
      <div class="product-grid" v-else-if="newProducts.length > 0">
        <div class="product-item" v-for="product in newProducts" :key="product.id">
          <ProductCard :product="product" />
        </div>
      </div>

      <!-- Empty -->
      <div class="empty-state" v-else>
        <p>No products available at the moment.</p>
      </div>
    </section>

    <!-- SHOP BY BRAND (SLIDER) -->
    <section class="section container brand-slider-section">
      <div class="title-row">
        <h2>Shop by Brand</h2>
        <div class="slider-arrows">
          <button class="arrow-btn" @click="prevBrand" :disabled="brandIndex === 0">‹</button>
          <button class="arrow-btn" @click="nextBrand" :disabled="brandIndex >= brands.length - 5">›</button>
        </div>
      </div>

      <div class="brand-viewport">
        <div class="brand-track" :style="{ transform: `translateX(calc(-${brandIndex} * (100% / 5 + 16px)))` }">
          <RouterLink v-for="brand in brands" :key="brand.id" :to="`/shop?brand=${brand.id}`" class="brand-card">
            <div class="brand-logo-inner">
              <img :src="brand.image" :alt="brand.name" v-if="brand.image">
              <span v-else>{{ brand.name }}</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <Hero />

    <!-- TESTIMONIALS -->
    <section class="section container testimonials-section">
      <div class="title-row center">
        <h2>What Our Fans Say</h2>
      </div>

      <div class="testi-slider-wrapper" v-if="testimonials.length > 0">
        <button class="testi-arrow prev" @click="prevTesti" :disabled="testiIndex === 0">‹</button>

        <div class="testi-viewport">
          <div class="testi-track" :style="{ transform: `translateX(calc(-${testiIndex} * (350px + 30px)))` }">
            <div class="testi-card" v-for="testi in testimonials" :key="testi.id">
              <div class="stars">
                <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24"
                  :fill="i <= testi.rating ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                  </polygon>
                </svg>
              </div>
              <p>"{{ testi.comment }}"</p>
              <div class="user">
                <div class="user-avatar">
                  <img v-if="testi.user?.profile_picture" :src="getImageUrl(testi.user.profile_picture)" alt="">
                  <div v-else class="avatar-placeholder">{{ (testi.user?.name || 'H').charAt(0) }}</div>
                </div>
                <div class="user-info">
                  <strong>{{ testi.user?.name || 'Happy Customer' }}</strong>
                  <span>{{ testi.product?.name || 'Verified Buyer' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="testi-arrow next" @click="nextTesti" :disabled="testiIndex >= testimonials.length - 3">›</button>
      </div>

      <div class="testimonial-grid" v-else>
        <!-- FALLBACK IF DB EMPTY -->
        <div class="testi-card">
          <div class="stars">
            <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              style="margin-right: 2px;">
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
              </polygon>
            </svg>
          </div>
          <p>"The quality of these shoes is insane. Best purchase this year!"</p>
          <div class="user">
            <strong>John Carter</strong>
            <span>Verified Athlete</span>
          </div>
        </div>
        <div class="testi-card">
          <div class="stars">
            <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              style="margin-right: 2px;">
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
              </polygon>
            </svg>
          </div>
          <p>"Unmatched comfort and style. I wear them every single day."</p>
          <div class="user">
            <strong>Sarah Jenkins</strong>
            <span>Lifestyle Blogger</span>
          </div>
        </div>
        <div class="testi-card">
          <div class="stars">
            <svg v-for="i in 5" :key="i" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              style="margin-right: 2px;">
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
              </polygon>
            </svg>
          </div>
          <p>"Fast delivery and great customer service. Will buy again!"</p>
          <div class="user">
            <strong>David Lee</strong>
            <span>Sneaker Enthusiast</span>
          </div>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter-section section">
      <div class="container">
        <div class="newsletter-box">
          <div class="newsletter-text">
            <h2>Join the Club</h2>
            <p>Get 15% off your first order and stay updated with the latest drops.</p>
          </div>
          <form class="newsletter-form" @submit.prevent>
            <input type="email" placeholder="Your email address">
            <button>Subscribe</button>
          </form>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section class="section container faq-section">
      <div class="title-row center">
        <h2>Frequently Asked Questions</h2>
      </div>
      <div class="faq-list">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
          <div class="faq-question" @click="faq.open = !faq.open">
            <h3>{{ faq.q }}</h3>
            <span class="faq-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round" v-if="!faq.open">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                stroke-linecap="round" stroke-linejoin="round" v-else>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
          </div>
          <div class="faq-answer" v-show="faq.open">
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BRANDS MARQUEE -->
    <BrandMarquee />

    <Footer />

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

import Hero from '../components/Hero.vue'
import Carousel from '../components/Carousel.vue'
import ProductCard from '../components/ProductCard.vue'
import Footer from '../components/Footer.vue'
import BrandMarquee from '../components/BrandMarquee.vue'
import Skeleton from '../components/Skeleton.vue'

import api from '../services/api'
import { useImageUrl } from '../composables/useImageUrl'
import { useCountdown } from '../composables/useCountdown'
import { unwrapResponse } from '../services/apiHelpers'

const trendingProducts = ref<any[]>([])
const newProducts = ref<any[]>([])
const categories = ref<any[]>([])
const brands = ref<any[]>([])
const testimonials = ref<any[]>([])
const testiIndex = ref(0)
const loading = ref(true)

const dealsBrand = ref<any>(null)
const dealsProducts = ref<any[]>([])

const { hours, minutes, seconds, start: startCountdown } = useCountdown({ durationSeconds: 12 * 3600 })

const nextTesti = () => {
  if (testiIndex.value < testimonials.value.length - 3) {
    testiIndex.value++
  }
}

const prevTesti = () => {
  if (testiIndex.value > 0) {
    testiIndex.value--
  }
}

const brandIndex = ref(0)
const nextBrand = () => {
  if (brandIndex.value < brands.value.length - 5) {
    brandIndex.value++
  }
}
const prevBrand = () => {
  if (brandIndex.value > 0) {
    brandIndex.value--
  }
}

const { getImageUrl } = useImageUrl()

const faqs = ref([
  { q: 'How long does shipping take?', a: 'Standard shipping usually takes 3-5 business days.', open: false },
  { q: 'Can I return my shoes?', a: 'Yes, we have a 30-day return policy for unworn items.', open: false },
  { q: 'Are the products authentic?', a: '100%. We only sell genuine products from official brands.', open: false }
])

const getCatImage = (cat: any) => {
  if (cat.image) {
    return getImageUrl(cat.image)
  }
  // Fallback for demo - Check woman first because it contains 'man'
  const name = cat.name.toLowerCase()
  if (name.includes('woman')) return '/src/assets/images/women.png'
  if (name.includes('man')) return '/src/assets/images/men.png'
  if (name.includes('kid')) return '/src/assets/images/kids.png'
  return '/src/assets/images/men.png'
}

const loadData = async () => {
  loading.value = true
  try {
    const [prodRes, newProdRes, catRes, testRes, brandRes] = await Promise.all([
      api.get('/products?sort=trending'),
      api.get('/products?sort=latest'),
      api.get('/categories'),
      api.get('/reviews/featured'),
      api.get('/brands')
    ])

    const products = unwrapResponse(prodRes.data)
    trendingProducts.value = products.slice(0, 4)

    const newProductsArr = unwrapResponse(newProdRes.data)
    newProducts.value = newProductsArr.slice(0, 4)

    categories.value = catRes.data ?? []
    testimonials.value = testRes.data ?? []

    const rawBrands = unwrapResponse(brandRes.data)
    brands.value = rawBrands.map((b: any) => ({
      ...b,
      image: b.logo ? getImageUrl(b.logo) : null
    }))

    // Get More Deals: fetch from dedicated backend endpoint
    try {
      const dealsRes = await api.get('/deals')
      if (dealsRes.data.brand) {
        dealsBrand.value = dealsRes.data.brand
        dealsProducts.value = dealsRes.data.products || []
      }
    } catch (e) {
      console.error('Failed to load deals:', e)
    }

  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
  startCountdown()
})
</script>

<style scoped>
.home {
  background: var(--color-background);
  min-height: 100vh;
}

/* TITLE */
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.title-row.center {
  justify-content: center;
  text-align: center;
}

.title-row h2 {
  font-size: 42px;
  font-weight: 900;
  color: var(--color-heading);
}

.title-row a {
  text-decoration: none;
  color: var(--color-heading);
  font-weight: 800;
  border-bottom: 2px solid var(--primary);
  padding-bottom: 4px;
}

.loading-cats,
.loading-products {
  padding: 100px;
  text-align: center;
  color: #999;
  font-weight: 600;
}

/* CATEGORY */

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.cat-card {
  height: 450px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  background: #eee;
}

.cat-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.8s cubic-bezier(0.33, 1, 0.68, 1);
}

.cat-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 40px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  z-index: 2;
}

.cat-overlay h3 {
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 5px;
  color: #ffffff !important;
}

.cat-overlay span {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
  color: #ffffff !important;
}

.cat-card:hover img {
  transform: scale(1.1);
}

/* BRAND GRID */

.brand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 25px;
}

.brand-logo-card {
  height: 120px;
  background: var(--color-card-bg);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  box-shadow: 0 4px 15px var(--color-card-shadow);
  transition: 0.3s;
  text-decoration: none;
  border: 1px solid var(--color-border);
}

.brand-logo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px var(--color-card-shadow-hover);
  border-color: var(--primary);
}

.brand-logo-card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(1);
  transition: 0.3s;
  opacity: 0.7;
}

.brand-logo-card:hover img {
  filter: grayscale(0);
  opacity: 1;
}

.brand-logo-card span {
  font-weight: 900;
  color: var(--color-heading);
  font-size: 20px;
}

/* PRODUCT */

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.skeleton-card {
  background: var(--color-card-bg);
  padding: 18px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
}

/* GET MORE DEALS */
.get-more-deals {
  background: var(--primary);
  /* yellow */
  padding: 50px 0;
  margin: 60px 0;
  width: 100%;
}

.deals-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.deals-header h2 {
  font-size: 32px;
  font-weight: 900;
  color: #111;
  margin: 0;
}

.deals-timer {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #111;
  font-weight: 700;
  margin-left: 10px;
}

.timer-boxes {
  display: flex;
  align-items: center;
  gap: 5px;
}

.time-box {
  background: #ef4444;
  /* red background like picture */
  color: white;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 900;
  font-size: 18px;
  min-width: 40px;
  text-align: center;
}

.colon {
  font-weight: 900;
  font-size: 20px;
  color: #111;
}

.view-all-deals {
  margin-left: auto;
  background: #111;
  color: #facc15;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 800;
  text-decoration: none;
  font-size: 14px;
  transition: 0.3s;
}

.view-all-deals:hover {
  background: white;
  color: #111;
}

.deals-content {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.deals-banner-card {
  background: #111;
  color: #ffffff !important;
  border-radius: 20px;
  padding: 30px 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 180px;
  flex-shrink: 0;
  align-self: stretch;
}

.deals-banner-card h2 {
  font-size: 36px;
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
  font-style: italic;
  text-transform: uppercase;
  color: #ffffff !important;
  word-spacing: 100vw;
  /* Forces each word onto its own line */
}

.deals-product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  flex-grow: 1;
  min-width: 0;
}

.deals-item {
  min-width: 0;
}

@media (max-width: 1100px) {
  .deals-product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .deals-content {
    flex-direction: column;
  }

  .deals-banner-card {
    width: 100%;
    padding: 30px;
  }

  .deals-banner-card h2 {
    word-spacing: normal;
  }

  .deals-product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* TESTIMONIALS */
/* TESTIMONIALS */
.testimonials-section {
  max-width: 1200px;
  margin: auto;
  overflow: visible;
  /* Allow hover scaling to be seen */
}

.testi-slider-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
}

.testi-viewport {
  overflow: hidden;
  flex-grow: 1;
  padding: 30px 10px;
  margin: -30px -10px;
  max-width: 1110px;
  /* 3 cards (350px) + 2 gaps (30px) */
  margin-left: auto;
  margin-right: auto;
}

.testi-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  gap: 30px;
}

.testi-track .testi-card {
  width: 350px;
  min-width: 350px;
  flex-shrink: 0;
  height: 320px;
  /* Reduced height for more compact look */
  display: flex;
  flex-direction: column;
  padding: 30px;
  box-sizing: border-box;
}

.testi-arrow {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #eee;
  background: #fff;
  font-size: 24px;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  flex-shrink: 0;
}

.testi-arrow:hover:not(:disabled) {
  background: #eab308;
  color: #fff;
  border-color: #eab308;
  transform: scale(1.1);
}

.testi-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
}

.testi-card {
  position: relative;
  background: var(--color-card-bg);
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 10px 30px var(--color-card-shadow);
  overflow: hidden;
  transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  border: 1px solid var(--color-border);
}

/* Glow Border */
.testi-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 30px;
  padding: 1px;
  background: linear-gradient(135deg, #eab308, transparent, #facc15);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: 0.4s ease;
}

/* Floating Light */
.testi-card::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: rgba(234, 179, 8, 0.08);
  border-radius: 50%;
  top: -60px;
  right: -60px;
  transform: scale(0.6);
  opacity: 0;
  transition: 0.45s ease;
}

/* Hover Effect */
.testi-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.08);
  border-color: rgba(234, 179, 8, 0.2);
}

.testi-card:hover::before {
  opacity: 1;
}

.testi-card:hover::after {
  opacity: 1;
  transform: scale(1);
}

/* Stars */
.stars {
  display: flex;
  color: #eab308;
  margin-bottom: 20px;
  transition: 0.3s ease;
}

.testi-card:hover .stars {
  transform: scale(1.08);
  letter-spacing: 1px;
}

/* Text */
.testi-card p {
  font-size: 16px;
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: 25px;
  font-style: italic;
  transition: 0.3s ease;

  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 20px;
  /* Reduced margin */
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}


/* User */
.user {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
  /* Tight gap as requested */
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background: #facc15;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #111;
  font-size: 18px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info strong {
  display: block;
  font-size: 16px;
  font-weight: 800;
  transition: 0.3s ease;
  color: #111;
}

.user-info span {
  font-size: 13px;
  color: #888;
  transition: 0.3s ease;
}

.testi-card:hover .user-info strong {
  color: #eab308;
}

.testi-card:hover .user-info span {
  color: #555;
}

/* FAQ */
.faq-section {
  padding: 100px 0;
  max-width: 800px;
  margin: auto;
}

.faq-list {
  margin-top: 50px;
}

.faq-item {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  cursor: pointer;
}

.faq-question h3 {
  font-size: 18px;
  font-weight: 800;
}

.faq-icon {
  font-size: 24px;
  color: #eab308;
}

.faq-answer {
  padding-bottom: 25px;
  color: #666;
  line-height: 1.6;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* BRAND SLIDER */
.brand-slider-section {
  overflow: hidden;
}

.brand-viewport {
  overflow: hidden;
  padding: 10px 0;
}

.brand-track {
  display: flex;
  gap: 20px;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.brand-card {
  min-width: calc((100% - 80px) / 5);
  /* 5 items visible, 4 gaps of 20px */
  flex-shrink: 0;
  height: 120px;
  background: #fff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-decoration: none;
  border: 1px solid #eee;
  transition: all 0.4s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
}

.brand-card:hover {
  transform: translateY(-5px);
  border-color: #eab308;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.brand-logo-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo-inner img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.6;
  transition: 0.4s;
}

.brand-card:hover .brand-logo-inner img {
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1.1);
}

.brand-logo-inner span {
  font-weight: 900;
  color: var(--color-heading);
  font-size: 20px;
}

.slider-arrows {
  display: flex;
  gap: 10px;
}

.arrow-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: 0.3s;
}

.arrow-btn:hover:not(:disabled) {
  background: #eab308;
  border-color: #eab308;
  color: #fff;
}

.arrow-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* NEWSLETTER */
.newsletter-section {
  padding: 100px 0;
}

.newsletter-box {
  background: #111;
  border-radius: 40px;
  padding: 60px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.newsletter-box::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(234, 179, 8, 0.1);
  border-radius: 50%;
  top: -100px;
  right: -100px;
}

.newsletter-text h2 {
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 10px;
  color: #fff !important;
}

.newsletter-text p {
  color: #fff !important;
  opacity: 0.8;
  font-size: 18px;
}

.newsletter-form {
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.newsletter-form input {
  background: transparent;
  border: none;
  padding: 0 25px;
  color: #fff;
  outline: none;
  min-width: 350px;
  font-size: 16px;
}

.newsletter-form button {
  height: 60px;
  padding: 0 40px;
  border: none;
  border-radius: 18px;
  background: #eab308;
  color: #111 !important;
  font-weight: 900;
  cursor: pointer;
  transition: 0.3s;
}

.newsletter-form button:hover {
  background: #fff;
}

@media(max-width: 1200px) {
  .promo-img {
    width: 300px;
  }

  .newsletter-form input {
    min-width: 200px;
  }
}

@media(max-width: 1000px) {

  .category-grid,
  .testimonial-grid,
  .product-grid {
    grid-template-columns: 1fr;
  }

  .promo {
    flex-direction: column;
    text-align: center;
    padding: 60px 40px;
  }

  .newsletter-box {
    flex-direction: column;
    text-align: center;
    padding: 60px 40px;
  }

  .newsletter-form {
    width: 100%;
    flex-direction: column;
  }

  .newsletter-form input {
    height: 50px;
    text-align: center;
  }
}
</style>