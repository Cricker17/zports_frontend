import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ShopView from '../views/ShopView.vue'
import DetailView from '../views/DetailView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Premium Sneakers & Modern Lifestyle Footwear', description: 'Discover our curated collection of premium sneakers. Style and comfort in every step.' }
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView,
      meta: { title: 'Shop All Products', description: 'Browse our full catalog of the latest sneaker releases and classics.' }
    },
    {
      path: '/product/:id',
      name: 'detail',
      component: DetailView,
      meta: { title: 'Product Details' }
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      meta: { title: 'Your Shopping Bag', description: 'Review your items and proceed to checkout.' }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
      meta: { title: 'Secure Checkout', description: 'Complete your purchase securely at ZPORTS.' }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login to Your Account' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { title: 'Create a New Account' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { title: 'Your Profile & Orders', requiresAuth: true }
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('../views/ProfileEditView.vue'),
      meta: { title: 'Edit Your Profile', requiresAuth: true }
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('../views/WishlistView.vue'),
      meta: { title: 'Your Wishlist' }
    },
    {
      path: '/sale',
      name: 'sale',
      component: () => import('../views/SaleView.vue'),
      meta: { title: 'Flash Sale - Limited Time Offers', description: 'Grab your favorite sneakers at discounted prices.' }
    },
    {
      path: '/order/track/:id',
      name: 'track-order',
      component: () => import('../views/TrackView.vue'),
      meta: { title: 'Track Your Package', requiresAuth: true }
    },
    {
      path: '/order/details/:id',
      name: 'order-details',
      component: () => import('../views/OrderDetailView.vue'),
      meta: { title: 'Order Details', requiresAuth: true }
    }
  ],

  scrollBehavior() {
    return { top: 0 }
  }
})

// GLOBAL SEO GUARD
router.afterEach((to) => {
  const baseTitle = 'ZPORTS Sneaker Store'
  const pageTitle = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle
  document.title = pageTitle

  // Meta Description
  const description = to.meta.description as string || 'Your destination for premium sneakers and modern lifestyle footwear.'
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', description)
})

export default router