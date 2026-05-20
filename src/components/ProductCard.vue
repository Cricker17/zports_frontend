<!-- src/components/ProductCard.vue -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../services/api'
import { toast } from '../stores/toast'
import { ui } from '../stores/ui'

const props = defineProps<{
  product: any
  isSmall?: boolean
}>()

const isWishlisted = ref(false)

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/src/assets/images/shoe1.jpg'
  if (imagePath.startsWith('http')) return imagePath

  return `http://127.0.0.1:8000/storage/${imagePath}`
}

onMounted(async () => {
  const token = sessionStorage.getItem('auth_token')
  if (token) {
    try {
      const res = await api.get('/wishlist')
      const wishlist = res.data
      if (Array.isArray(wishlist)) {
        isWishlisted.value = wishlist.some((item: any) => item.product_id === props.product.id)
      }
    } catch (e) {
      console.error('Wishlist check failed')
    }
  }
})

const addToCart = async () => {
  const token = sessionStorage.getItem('auth_token')
  if (!token) {
    toast.error('Please login to add items to cart')
    return
  }

  try {
    await api.post('/cart', {
      product_id: props.product.id,
      quantity: 1
    })
    toast.success(`${props.product.name} added to cart!`)
    ui.openCart()
  } catch (e) {
    toast.error('Failed to add item to cart')
  }
}

const toggleWishlist = async () => {
  const token = sessionStorage.getItem('auth_token')
  if (!token) {
    toast.error('Please login to use wishlist')
    return
  }

  try {
    const res = await api.post('/wishlist/toggle', { product_id: props.product.id })
    isWishlisted.value = res.data.is_wishlisted
    toast.success(isWishlisted.value ? 'Added to wishlist' : 'Removed from wishlist')
  } catch (e) {
    toast.error('Failed to update wishlist')
  }
}
</script>

<template>
  <div class="card" :class="{ 'is-inactive': !props.product.is_active, 'card-small': isSmall }">

    <!-- LINK AREA -->
    <RouterLink :to="`/product/${props.product.id}`" class="card-link">
      <!-- IMAGE -->
      <div class="image-wrapper">
        <img :src="getImageUrl(props.product.image)" :alt="props.product.name" />

        <div class="inactive-overlay" v-if="!props.product.is_active">
          <span>OUT OF STOCK</span>
        </div>

        <span class="badge sale" v-if="Number(props.product.discount) > 0">
          -{{ props.product.discount }}%
        </span>

        <span class="badge" v-else-if="props.product.is_new">
          NEW
        </span>

        <button class="wishlist-btn" @click.prevent="toggleWishlist" :class="{ active: isWishlisted }">
          ♥
        </button>

        <div class="brand-badge" v-if="props.product.brand?.image">
          <img :src="props.product.brand.image" :alt="props.product.brand.name">
        </div>
      </div>

      <!-- INFO -->
      <div class="info">
        <h3>{{ props.product.name }}</h3>

        <p class="category">
          {{ props.product.category?.name || 'Sneakers' }}
        </p>

        <div class="price-row">
          <p class="price" :class="{ 'discounted': Number(props.product.discount) > 0 }">
            {{ ui.formatPrice(Number(props.product.discount) > 0 ? (props.product.price * (1 - Number(props.product.discount) / 100)) : props.product.price) }}
          </p>
          <p class="old-price" v-if="Number(props.product.discount) > 0">
            {{ ui.formatPrice(props.product.price) }}
          </p>
        </div>
      </div>
    </RouterLink>

    <!-- BUTTON -->
    <button class="btn" @click="addToCart" :disabled="!props.product.is_active">
      {{ props.product.is_active ? 'Add to Cart' : 'Currently Unavailable' }}
    </button>

  </div>
</template>

<style scoped>
.card {
  background: var(--color-card-bg);
  border-radius: 20px;
  padding: 18px;
  transition: 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 12px var(--color-card-shadow);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card.is-inactive {
  opacity: 0.6;
  pointer-events: none;
  filter: grayscale(0.5);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px var(--color-card-shadow-hover);
  border-color: var(--primary);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

/* IMAGE */
.image-wrapper {
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: 14px;
  position: relative;
  background: var(--color-background-soft);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: .4s ease;
}

.card:hover img {
  transform: scale(1.08);
}

.inactive-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.inactive-overlay span {
  background: #111;
  color: #fff;
  padding: 8px 16px;
  font-weight: 900;
  font-size: 14px;
  border-radius: 8px;
  letter-spacing: 1px;
}

.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--primary);
  color: #111;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 8px;
  z-index: 2;
}

.badge.sale {
  background: #ef4444;
  color: #fff;
}

.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: var(--color-card-bg);
  box-shadow: 0 4px 10px var(--color-card-shadow);
  cursor: pointer;
  font-size: 18px;
  color: var(--color-text);
  transition: .3s;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wishlist-btn.active {
  color: #ef4444;
}

.brand-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: white; /* Always white for visibility */
  padding: 5px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 2;
  border: 1px solid #eee;
}

.brand-badge img {
  height: 20px;
  width: auto;
  object-fit: contain;
}

/* INFO */
.info {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.info h3 {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 6px;
  font-family: var(--font-heading);
}

.category {
  font-size: 13px;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 8px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
}

.price {
  font-size: 19px;
  font-weight: 800;
  color: var(--color-heading);
}

.price.discounted {
  color: #ef4444;
}

.old-price {
  font-size: 14px;
  color: var(--color-text);
  text-decoration: line-through;
  opacity: 0.6;
}

/* BUTTON */
.btn {
  margin-top: 14px;
  width: 100%;
  padding: 12px;
  border: none;
  background: var(--primary);
  color: #111;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: .3s;
}

.btn:hover {
  background: var(--primary-dark);
}

[data-theme="dark"] .btn {
  background: var(--primary);
  color: #111;
}

[data-theme="dark"] .btn:hover {
  background: var(--primary-dark);
}

/* SMALL MODE */
.card-small {
  padding: 12px;
}

.card-small .image-wrapper {
  height: 160px;
}

.card-small .info h3 {
  font-size: 14px;
}

.card-small .category {
  font-size: 11px;
}

.card-small .price {
  font-size: 15px;
}

.card-small .old-price {
  font-size: 11px;
}

.card-small .btn {
  padding: 8px;
  font-size: 12px;
}

.card-small .badge {
  font-size: 9px;
  padding: 3px 8px;
}

.card-small .wishlist-btn {
  width: 28px;
  height: 28px;
  font-size: 14px;
}
</style>