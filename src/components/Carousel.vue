<template>
  <div class="carousel-container">
    <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <div v-for="(slide, index) in slides" :key="index" class="carousel-slide">
        <div class="slide-content">
          <span class="slide-tag">{{ slide.tag }}</span>
          <h2 class="slide-title">{{ slide.title }}</h2>
          <p class="slide-desc">{{ slide.desc }}</p>
          <RouterLink :to="slide.link">
            <button class="slide-btn">Check Collection</button>
          </RouterLink>
        </div>
        <div class="slide-overlay"></div>
        <img :src="slide.image" :alt="slide.title" class="slide-image">
      </div>
    </div>

    <!-- Navigation Dots -->
    <div class="carousel-dots">
      <span 
        v-for="(_, index) in slides" 
        :key="index" 
        class="dot" 
        :class="{ active: currentSlide === index }"
        @click="currentSlide = index"
      ></span>
    </div>

    <!-- Arrow Controls -->
    <button class="arrow prev" @click="prevSlide">‹</button>
    <button class="arrow next" @click="nextSlide">›</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const slides = [
  {
    tag: 'LIMITED EDITION',
    title: 'AIR JORDAN 1 RETRO',
    desc: 'The iconic silhouette that changed the game forever.',
    image: '/src/assets/images/promo1.png',
    link: '/shop'
  },
  {
    tag: 'NEW ARRIVAL',
    title: 'YEEZY BOOST 350',
    desc: 'Unmatched comfort with a futuristic design aesthetic.',
    image: '/src/assets/images/promo2.png',
    link: '/shop'
  },
  {
    tag: 'BEST SELLER',
    title: 'NIKE DUNK LOW',
    desc: 'From the courts to the streets, a timeless classic.',
    image: '/src/assets/images/promo3.png',
    link: '/shop'
  }
]

const currentSlide = ref(0)
let timer: any = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

onMounted(() => {
  timer = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: 480px;
  overflow: hidden;
  border-radius: 30px;
  margin-bottom: 40px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 80px;
  color: white;
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
  z-index: 2;
}

.slide-content {
  position: relative;
  z-index: 3;
  max-width: 600px;
  animation: slideIn 1s ease;
}

.slide-tag {
  display: inline-block;
  background: #eab308;
  color: #000 !important;
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.slide-title {
  font-size: 56px;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 15px;
  color: #fff !important;
}

.slide-desc {
  font-size: 18px;
  color: #fff !important;
  opacity: 0.9;
  margin-bottom: 30px;
}

.slide-btn {
  padding: 16px 32px;
  background: white;
  color: black;
  border: none;
  border-radius: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
}

.slide-btn:hover {
  background: #eab308;
  transform: scale(1.05);
}

/* DOTS */
.carousel-dots {
  position: absolute;
  bottom: 30px;
  left: 80px;
  z-index: 4;
  display: flex;
  gap: 12px;
}

.dot {
  width: 12px;
  height: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: 10px;
  cursor: pointer;
  transition: 0.4s;
}

.dot.active {
  width: 40px;
  background: #eab308;
}

/* ARROWS */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 4;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow:hover {
  background: #eab308;
  color: black;
}

.arrow.prev { left: 20px; }
.arrow.next { right: 20px; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 768px) {
  .carousel-container { height: 400px; }
  .carousel-slide { padding: 0 40px; }
  .slide-title { font-size: 36px; }
  .carousel-dots { left: 40px; }
}
</style>
