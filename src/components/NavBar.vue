<template>
  <header class="navbar">
    <div class="topbar">
      FREE SHIPPING • NEW ARRIVAL • MEMBER DISCOUNT
    </div>

    <div class="nav-main container">
      <RouterLink to="/" class="logo">Z<span>PORTS</span></RouterLink>

      <nav class="menu">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/shop">Shop</RouterLink>
        <RouterLink to="/sale" class="sale">Sale</RouterLink>
      </nav>

      <div class="actions">

        <!-- Search Toggle -->
        <div class="search-container" :class="{ active: isSearchOpen }">
          <button class="search-btn" @click="isSearchOpen = !isSearchOpen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search products..."
            v-model="searchQuery"
            @keyup.enter="performSearch"
            @input="handleSearchInput"
          >
          <!-- SUGGESTIONS -->
          <div class="search-suggestions" v-if="suggestions.length > 0 && isSearchOpen">
            <div 
              v-for="item in suggestions" 
              :key="item.id" 
              class="suggestion-item"
              @click="goToProduct(item.id)"
            >
              <img :src="getImageUrl(item.image)" alt="">
              <div class="s-info">
                <span class="s-name">{{ item.name }}</span>
                <span class="s-price">{{ ui.formatPrice(item.price) }}</span>
              </div>
            </div>
            <div class="view-all" @click="performSearch">View all results</div>
          </div>
        </div>

        <!-- Theme Toggle -->
        <button class="theme-btn" @click="toggleTheme" style="padding: 0 12px; background: transparent; box-shadow: none; color: var(--color-heading);">
          <svg v-if="isDarkMode" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>

        <!-- USER MENU / PROFILE DROPDOWN -->
        <div class="profile-dropdown-container">
          <button class="nav-profile-btn" @click="isProfileDropdownOpen = !isProfileDropdownOpen">
            <template v-if="isLoggedIn">
              <img v-if="userProfilePic" :src="getImageUrl(userProfilePic)" alt="Profile" class="nav-avatar-img">
              <div v-else class="nav-avatar-initial">{{ userName.charAt(0) }}</div>
            </template>
            <template v-else>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </template>
          </button>

          <!-- DROPDOWN CONTENT -->
          <div class="dropdown-menu" v-if="isProfileDropdownOpen">
            <template v-if="isLoggedIn">
              <div class="dropdown-header">
                <span class="label">Profile</span>
                <span class="name">{{ userName }}</span>
              </div>
              <hr>
              <RouterLink to="/profile" class="dropdown-item" @click="isProfileDropdownOpen = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                View Profile
              </RouterLink>
              <RouterLink to="/wishlist" class="dropdown-item" @click="isProfileDropdownOpen = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                My Wishlist
              </RouterLink>
              <button class="dropdown-item logout" @click="logout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
              </button>
            </template>
            <template v-else>
              <div class="dropdown-header">
                <span class="label">Welcome</span>
              </div>
              <hr>
              <RouterLink to="/login" class="dropdown-item" @click="isProfileDropdownOpen = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                Login
              </RouterLink>
              <RouterLink to="/register" class="dropdown-item" @click="isProfileDropdownOpen = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="16" y1="11" x2="22" y2="11"></line></svg>
                Register
              </RouterLink>
            </template>
          </div>
        </div>

        <!-- CURRENCY SWITCHER -->
        <div class="currency-switcher">
          <button class="currency-btn" @click="isCurrencyOpen = !isCurrencyOpen">
            {{ ui.currency }}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div class="currency-dropdown" v-if="isCurrencyOpen">
            <div class="currency-option" :class="{ active: ui.currency === 'IDR' }" @click="selectCurrency('IDR')">IDR</div>
            <div class="currency-option" :class="{ active: ui.currency === 'USD' }" @click="selectCurrency('USD')">USD</div>
          </div>
        </div>

        <template v-if="isLoggedIn">
          <button class="cart-btn" @click="ui.openCart">
            <div class="cart-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span v-if="ui.cartCount > 0" class="cart-badge">{{ ui.cartCount }}</span>
            </div>
            <span>Cart</span>
          </button>
        </template>

      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '../services/api'
import { ui } from '../stores/ui'

const router = useRouter()

const isLoggedIn = ref(false)
const userName = ref('')
const userProfilePic = ref('')
const isSearchOpen = ref(false)
const isProfileDropdownOpen = ref(false)
const searchQuery = ref('')
const suggestions = ref<any[]>([])
let searchTimeout: any = null

const isCurrencyOpen = ref(false)
const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  const theme = isDarkMode.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

const selectCurrency = (code: 'IDR' | 'USD') => {
  ui.setCurrency(code)
  isCurrencyOpen.value = false
}

onMounted(async () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }

  ui.fetchCartCount()
  const token = sessionStorage.getItem('auth_token')
  if (token) {
    isLoggedIn.value = true
    try {
      const res = await api.get('/user')
      userName.value = res.data.name
      userProfilePic.value = res.data.profile_picture
    } catch (e) {
      // Token invalid
      sessionStorage.removeItem('auth_token')
      isLoggedIn.value = false
    }
  }
})

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/shop', query: { search: searchQuery.value } })
    isSearchOpen.value = false
    suggestions.value = []
  }
}

const handleSearchInput = () => {
  clearTimeout(searchTimeout)
  if (!searchQuery.value.trim()) {
    suggestions.value = []
    return
  }
  searchTimeout = setTimeout(fetchSuggestions, 300)
}

const fetchSuggestions = async () => {
  try {
    const res = await api.get('/products', { params: { search: searchQuery.value } })
    const data = res.data?.data?.data || res.data?.data || res.data || []
    suggestions.value = data.slice(0, 5)
  } catch (e) {
    console.error(e)
  }
}

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/src/assets/images/shoe1.jpg'
  if (imagePath.startsWith('http')) return imagePath
  return `http://127.0.0.1:8000/storage/${imagePath}`
}

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
  isSearchOpen.value = false
  suggestions.value = []
  searchQuery.value = ''
}

const logout = async () => {
  try {
    await api.post('/auth/logout')
  } catch (e) {}
  sessionStorage.removeItem('auth_token')
  isLoggedIn.value = false
  userName.value = ''
  userProfilePic.value = ''
  isProfileDropdownOpen.value = false
  router.push('/')
}

// Close suggestions when search closes
watch(isSearchOpen, (val) => {
  if (!val) suggestions.value = []
})
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 999;
  background: var(--color-background-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.topbar {
  background: linear-gradient(90deg, #facc15, #fde047, #facc15);
  padding: 10px;
  text-align: center;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 3px;
  color: #111 !important;
  text-transform: uppercase;
}



.nav-main {
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  font-family: var(--font-logo);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -2px; /* Tighter spacing */
  color: var(--color-heading);
  text-decoration: none;
  font-style: italic;
  display: flex;
  align-items: center;
}

.logo span {
  color: var(--primary);
}

.menu {
  display: flex;
  gap: 28px;
}

.menu a {
  text-decoration: none;
  color: var(--color-heading);
  font-weight: 700;
  position: relative;
}

.menu a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 0;
  height: 2px;
  background: #facc15;
  transition: .3s;
}

.menu a:hover::after {
  width: 100%;
}

.sale {
  color: #ef4444 !important;
}

.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* SEARCH ANIMATION */
.search-container {
  display: flex;
  align-items: center;
  position: relative;
}

.search-btn {
  background: transparent !important;
  box-shadow: none !important;
  font-size: 18px;
  padding: 0 8px !important;
  z-index: 2;
  color: var(--color-heading);
}

.search-input {
  font-family: 'Outfit', sans-serif;
  width: 0;
  opacity: 0;
  height: 44px;
  padding: 0;
  border-radius: 14px;
  border: 1px solid transparent;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  right: 0;
  background: var(--color-background);
}

.search-container.active .search-input {
  width: 260px;
  opacity: 1;
  padding: 0 16px 0 40px;
  border-color: var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
}

.search-suggestions {
  position: absolute;
  top: 55px;
  right: 0;
  width: 320px;
  background: var(--color-background);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 1px solid var(--color-border);
  z-index: 1000;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: 0.2s;
}

.suggestion-item:hover {
  background: var(--color-background-soft);
}

.suggestion-item img {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  background: var(--color-background-mute);
}

.s-info {
  display: flex;
  flex-direction: column;
}

.s-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-heading);
}

.s-price {
  font-size: 12px;
  color: #eab308;
  font-weight: 800;
}

.view-all {
  padding: 12px;
  text-align: center;
  background: var(--color-background-mute);
  font-size: 13px;
  font-weight: 700;
  color: #888;
  border-top: 1px solid var(--color-border);
  cursor: pointer;
}

.view-all:hover {
  color: var(--color-heading);
  background: var(--color-background-soft);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-profile-btn {
  padding: 0 !important;
  width: 44px;
  height: 44px;
  border-radius: 50% !important;
  overflow: hidden;
}

.nav-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-avatar-initial {
  width: 100%;
  height: 100%;
  background: #facc15;
  color: var(--color-heading);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 18px;
}

.actions button {
  height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 14px;
  background: var(--color-background-mute);
  color: var(--color-heading);
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(0,0,0,.05);
  transition: .3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.actions button:hover {
  transform: translateY(-3px);
}

.cart-btn {
  background: #111 !important;
  color: #fff !important;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 900;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-background);
}

.login-btn {
  background: #111 !important;
  color: #fff !important;
}

/* CURRENCY SWITCHER */
.currency-switcher {
  position: relative;
}

.currency-btn {
  height: 44px;
  padding: 0 16px;
  background: var(--color-background-mute);
  color: var(--color-heading);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  font-weight: 800;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.currency-btn:hover {
  border-color: #facc15;
}

.currency-dropdown {
  position: absolute;
  top: 55px;
  right: 0;
  background: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid var(--color-border);
  overflow: hidden;
  z-index: 1000;
  min-width: 80px;
}

.currency-option {
  padding: 10px 15px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
  color: var(--color-text);
}

.currency-option:hover {
  background: var(--color-background-soft);
}

.currency-option.active {
  background: #facc15;
  color: var(--color-heading);
}

[data-theme="dark"] .currency-option.active {
  color: #111;
}

/* PROFILE DROPDOWN */
.profile-dropdown-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 55px;
  right: 0;
  width: 240px;
  background: var(--color-background);
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.15);
  padding: 10px;
  border: 1px solid var(--color-border);
  z-index: 1001;
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-header {
  padding: 15px 15px 10px;
  display: flex;
  flex-direction: column;
}

.dropdown-header .label {
  font-size: 12px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.dropdown-header .name {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-heading);
  margin-top: 4px;
}

hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 700;
  font-size: 14px;
  border-radius: 12px;
  transition: 0.2s;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--color-background-soft);
  color: var(--color-heading);
}

.dropdown-item svg {
  color: #888;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: rgba(239, 68, 68, 0.05);
  color: #ef4444;
}

.dropdown-item.logout svg {
  color: #ef4444;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>