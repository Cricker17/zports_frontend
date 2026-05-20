<script setup lang="ts">
import { ref } from 'vue'
import { ui } from '../stores/ui'

const expanded = ref({
  categories: true,
  brands: true,
  colors: true,
  sizes: true,
  price: true
})

const sizeSearch = ref('')

const toggleSection = (section: keyof typeof expanded.value) => {
  expanded.value[section] = !expanded.value[section]
}

import { computed } from 'vue'

const props = defineProps<{
  categories: any[]
  brands: any[]
  colors: any[]
  sizes: any[]
  selectedCategory: string
  selectedBrand: string
  selectedColor: string
  selectedSize: string
  minPrice: string
  maxPrice: string
}>();

const filteredSizes = computed(() => {
  if (!sizeSearch.value) return props.sizes
  return props.sizes.filter(s => s.name.toLowerCase().includes(sizeSearch.value.toLowerCase()))
})

const selectSize = (id: string) => {
  emit('update:size', id)
}

const emit = defineEmits(['update:category', 'update:brand', 'update:color', 'update:size', 'update:minPrice', 'update:maxPrice', 'applyPrice'])

const onPriceSliderChange = (e: any) => {
  emit('update:maxPrice', e.target.value)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        Filters
      </h2>
      <button class="reset-btn" @click="() => {
        emit('update:category', '');
        emit('update:brand', '');
        emit('update:color', '');
        emit('update:size', '');
      }">Reset</button>
    </div>

    <!-- CATEGORIES -->
    <div class="filter-group" :class="{ collapsed: !expanded.categories }">
      <h4 @click="toggleSection('categories')">
        Category
        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </h4>
      <div class="filter-content">
        <ul>
          <li :class="{ active: selectedCategory === '' }" @click="emit('update:category', '')">All Categories</li>
          <li v-for="cat in categories" :key="cat.id" :class="{ active: selectedCategory == cat.id }"
            @click="emit('update:category', cat.id)">{{ cat.name }}</li>
        </ul>
      </div>
    </div>

    <!-- BRANDS -->
    <div class="filter-group" :class="{ collapsed: !expanded.brands }">
      <h4 @click="toggleSection('brands')">
        Brand
        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </h4>
      <div class="filter-content">
        <ul>
          <li :class="{ active: selectedBrand === '' }" @click="emit('update:brand', '')">All Brands</li>
          <li v-for="b in brands" :key="b.id" :class="{ active: selectedBrand == b.id }"
            @click="emit('update:brand', b.id)">{{ b.name }}</li>
        </ul>
      </div>
    </div>

    <!-- COLORS -->
    <div class="filter-group" :class="{ collapsed: !expanded.colors }">
      <h4 @click="toggleSection('colors')">
        Color
        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </h4>
      <div class="filter-content">
        <div class="color-options">
          <div 
            class="color-dot all" 
            :class="{ active: selectedColor === '' }" 
            @click="emit('update:color', '')"
            title="All Colors"
          ></div>
          <div 
            v-for="c in colors" 
            :key="c.id" 
            class="color-dot"
            :class="{ active: selectedColor == c.id }"
            :style="{ backgroundColor: c.hex_code }"
            @click="emit('update:color', c.id)"
            :title="c.name"
          ></div>
        </div>
      </div>
    </div>

    <!-- SIZES -->
    <div class="filter-group" :class="{ collapsed: !expanded.sizes }">
      <h4 @click="toggleSection('sizes')">
        Size
        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </h4>
      <div class="filter-content">
        <div class="inline-size-filter">
          <div class="size-search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              v-model="sizeSearch" 
              placeholder="Search size..." 
            >
          </div>
          
          <div class="size-scroll-container">
            <div class="size-grid-inner">
              <div 
                class="size-pill-opt" 
                :class="{ active: selectedSize === '' }"
                @click="selectSize('')"
              >
                All
              </div>
              <div 
                v-for="s in filteredSizes" 
                :key="s.id" 
                class="size-pill-opt"
                :class="{ active: selectedSize == s.id }"
                @click="selectSize(s.id)"
              >
                {{ s.name }}
              </div>
            </div>
            <div class="no-results" v-if="filteredSizes.length === 0">
              No matching size
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PRICE RANGE -->
    <div class="filter-group" :class="{ collapsed: !expanded.price }">
      <h4 @click="toggleSection('price')">
        Price Range
        <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </h4>
      
      <div class="filter-content">
        <div class="slider-container">
          <input 
            type="range" 
            class="price-slider" 
            min="0" 
            max="20000000" 
            step="100000"
            :value="maxPrice || 20000000"
            @input="onPriceSliderChange"
            @change="emit('applyPrice')"
          >
          <div class="price-labels">
            <span>Min: {{ minPrice || '0' }}</span>
            <span>Max: {{ maxPrice || '20M' }}</span>
          </div>
        </div>

        <div class="price-inputs">
          <input 
            type="number" 
            placeholder="Min" 
            :value="minPrice"
            @input="(e: any) => emit('update:minPrice', e.target.value)"
          >
          <input 
            type="number" 
            placeholder="Max" 
            :value="maxPrice"
            @input="(e: any) => emit('update:maxPrice', e.target.value)"
          >
        </div>
        <button class="btn-apply" @click="emit('applyPrice')">Apply Price</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  background: var(--color-card-bg);
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 4px 20px var(--color-card-shadow);
  border: 1px solid var(--color-border);
  position: sticky;
  top: 100px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 900;
  color: var(--color-heading);
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-title svg {
  color: var(--primary);
}

.reset-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: 0.2s;
}

.reset-btn:hover {
  background: rgba(250, 204, 21, 0.1);
}

.filter-group {
  margin-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
}

.filter-group:last-child {
  border-bottom: none;
}

.filter-group h4 {
  font-size: 14px;
  font-weight: 800;
  color: var(--color-heading);
  margin: 0;
  padding: 10px 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;
}

.filter-group h4:hover {
  color: var(--primary);
}

.chevron {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.5;
}

.filter-group.collapsed .chevron {
  transform: rotate(-90deg);
}

.filter-content {
  max-height: 500px;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s, padding 0.3s;
  opacity: 1;
  padding-top: 10px;
}

.filter-group.collapsed .filter-content {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  pointer-events: none;
}

/* LISTS */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 5px;
}

/* Custom Scrollbar */
ul::-webkit-scrollbar {
  width: 4px;
}
ul::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}

li {
  padding: 8px 12px;
  margin-bottom: 2px;
  color: var(--color-text);
  font-weight: 600;
  font-size: 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

li:hover {
  background: var(--color-background-soft);
  color: var(--primary);
  transform: translateX(4px);
}

li.active {
  background: var(--primary);
  color: #111;
  font-weight: 800;
}

/* COLORS */
.color-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
  gap: 10px;
  padding: 5px 2px;
}

.color-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.color-dot.all {
  background: linear-gradient(135deg, #ff4d4d, #4dff4d, #4d4dff);
}

.color-dot:hover {
  transform: scale(1.15);
  border-color: var(--primary);
  z-index: 2;
}

.color-dot.active {
  border-color: var(--color-heading);
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.color-dot.active::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

/* SIZES */
.inline-size-filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 5px 0;
}

.size-search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 8px 12px;
  transition: 0.3s;
}

.size-search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
}

.size-search-box svg {
  opacity: 0.5;
  color: var(--color-heading);
}

.size-search-box input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-heading);
  width: 100%;
}

.size-scroll-container {
  max-height: 160px;
  overflow-y: auto;
  padding-right: 6px;
}

.size-scroll-container::-webkit-scrollbar {
  width: 4px;
}
.size-scroll-container::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 10px;
}

.size-grid-inner {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.size-pill-opt {
  height: 38px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: var(--color-text);
  cursor: pointer;
  transition: 0.2s;
  user-select: none;
}

.size-pill-opt:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

.size-pill-opt.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #111;
  box-shadow: 0 4px 10px rgba(250, 204, 21, 0.2);
}

.no-results {
  text-align: center;
  padding: 15px;
  font-size: 13px;
  color: var(--color-text);
  font-style: italic;
  opacity: 0.7;
}

/* PRICE RANGE */
.slider-container {
  padding: 10px 5px 20px;
}

.price-slider {
  width: 100%;
  -webkit-appearance: none;
  height: 6px;
  background: var(--color-background-mute);
  border-radius: 10px;
  outline: none;
}

.price-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: var(--primary);
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid var(--color-card-bg);
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: 0.2s;
}

.price-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 800;
  color: var(--color-text);
}

.price-inputs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.price-inputs input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-heading);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  outline: none;
  transition: 0.3s;
}

.price-inputs input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
}

.btn-apply {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: #111;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 4px 12px rgba(250, 204, 21, 0.2);
}

.btn-apply:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(250, 204, 21, 0.3);
}

.btn-apply:active {
  transform: translateY(0);
}

@media (max-width: 900px) {
  .sidebar {
    width: 100%;
    position: static;
    margin-bottom: 30px;
  }
  
  .filter-group {
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
