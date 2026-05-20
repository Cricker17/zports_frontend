import { reactive } from 'vue'
import api from '../services/api'

export const ui = reactive({
  isCartSidebarOpen: false,
  cartCount: 0,
  currency: 'IDR',
  exchangeRate: 15500, // 1 USD = 15500 IDR
  
  openCart() {
    this.isCartSidebarOpen = true
  },
  
  closeCart() {
    this.isCartSidebarOpen = false
  },
  
  toggleCart() {
    this.isCartSidebarOpen = !this.isCartSidebarOpen
  },

  setCurrency(code: 'IDR' | 'USD') {
    this.currency = code
  },

  formatPrice(price: number | string) {
    const numPrice = Number(price)
    if (this.currency === 'USD') {
      const usd = numPrice / this.exchangeRate
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(usd)
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice)
  },

  async fetchCartCount() {
    const token = sessionStorage.getItem('auth_token')
    if (!token) {
      this.cartCount = 0
      return
    }
    try {
      const res = await api.get('/cart')
      this.cartCount = res.data?.length || 0
    } catch (e) {
      console.error('Failed to fetch cart count')
    }
  }
})
