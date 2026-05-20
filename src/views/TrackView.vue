<template>
  <main class="track-page fade-up">
    <div class="container">
      <div class="track-header">
        <div class="header-left">
          <button @click="router.back()" class="btn-back-integrated">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back
          </button>
          <h1>Live <span>Tracking</span></h1>
          <p class="order-ref">Order #ZP-ORD-{{ order?.id }}</p>
        </div>
        <div class="header-right">
          <div class="live-status-pill">
            <span class="status-dot"></span>
            {{ order?.status?.toUpperCase() || 'SEARCHING...' }}
          </div>
        </div>
      </div>

      <div v-if="loading" class="track-loading">
        <div class="radar">
          <div class="radar-circle"></div>
          <div class="radar-circle"></div>
          <div class="radar-circle"></div>
        </div>
        <p>Connecting to Logistics Hub...</p>
      </div>

      <div v-else-if="order" class="track-grid">
        <!-- REALISTIC MAP SIMULATION -->
        <div class="map-viewport">
          <div class="city-map">
            <!-- City Background & Grid -->
            <div class="map-grid"></div>
            
            <!-- City Blocks / Buildings -->
            <div class="city-blocks">
              <div v-for="i in 12" :key="i" class="block" :style="getRandomBlockStyle(i)"></div>
            </div>

            <!-- Roads -->
            <svg class="roads-svg" viewBox="0 0 800 500" preserveAspectRatio="none">
              <path class="main-road-bg" d="M100 400 L100 250 L400 250 L400 100 L700 100" />
              <path id="packagePath" class="main-road" d="M100 400 L100 250 L400 250 L400 100 L700 100" />
              <!-- Side roads -->
              <path class="side-road" d="M0 250 L800 250" />
              <path class="side-road" d="M400 0 L400 500" />
            </svg>

            <!-- Landmarks -->
            <div class="landmark origin">
              <div class="landmark-pin">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div class="landmark-info">
                <strong>Warehouse</strong>
                <span>Jakarta Hub</span>
              </div>
            </div>

            <div class="landmark destination">
              <div class="landmark-pin dest">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <div class="landmark-info">
                <strong>Delivery Point</strong>
                <span>Your Home</span>
              </div>
            </div>

            <!-- Moving Package / Courier -->
            <div class="courier-vehicle" :style="courierStyle">
              <div class="vehicle-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM19 17h-1.15c-.45-.9-1.39-1.5-2.47-1.5s-2.02.6-2.47 1.5H8.62c-.45-.9-1.39-1.5-2.47-1.5s-2.02.6-2.47 1.5H3V6h12v4h4v7z"/>
                </svg>
                <div class="vehicle-signal"></div>
              </div>
              <div class="vehicle-label">Z-Courier Express</div>
            </div>
          </div>
        </div>

        <!-- TIMELINE & DETAILS -->
        <div class="track-details">
          <div class="details-card">
            <h3>Shipment Details</h3>
            <div class="shipment-status-line">
              <div class="status-icon" :class="order.status"></div>
              <div class="status-text">
                <p>Status: <strong>{{ order.status }}</strong></p>
                <span>Estimated arrival: Today, 5:00 PM</span>
              </div>
            </div>

            <div class="shipment-timeline">
              <div v-for="(step, index) in timelineSteps" :key="index" 
                   class="timeline-node" 
                   :class="{ active: isStepActive(step.status), completed: isStepCompleted(step.status) }"
                   :style="{ animationDelay: (index * 0.8) + 's' }">
                <div class="node-marker">
                  <div class="inner-node"></div>
                </div>
                <div class="node-content">
                  <div class="node-time" v-if="isStepCompleted(step.status)">{{ getStatusTime(step.status) }}</div>
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { ui } from '../stores/ui'
import { toast } from '../stores/toast'

const route = useRoute()
const router = useRouter()
const order = ref<any>(null)
const loading = ref(true)
const carProgress = ref(0)

const timelineSteps = [
  { status: 'pending', title: 'Order Created', desc: 'System is processing your transaction.' },
  { status: 'paid', title: 'Payment Verified', desc: 'Payment received by ZPORTS.' },
  { status: 'sorting', title: 'Processing Order', desc: 'Picking your items from the warehouse.' },
  { status: 'shipped', title: 'On the Way', desc: 'Courier is currently delivering your package.' },
  { status: 'completed', title: 'Completed', desc: 'Package has been delivered successfully.' }
]

const getRandomBlockStyle = (i: number) => {
  const seeds = [
    { w: 80, h: 60, l: 150, t: 100 },
    { w: 100, h: 80, l: 300, t: 50 },
    { w: 60, h: 120, l: 500, t: 150 },
    { w: 120, h: 60, l: 650, t: 250 },
    { w: 70, h: 70, l: 50, t: 300 },
    { w: 150, h: 80, l: 200, t: 350 },
    { w: 80, h: 100, l: 550, t: 400 },
    { w: 110, h: 110, l: 450, t: 300 },
    { w: 90, h: 60, l: 700, t: 30 },
    { w: 130, h: 70, l: 20, t: 50 },
    { w: 60, h: 60, l: 720, t: 380 },
    { w: 100, h: 40, l: 380, t: 420 },
  ]
  const s = seeds[i-1] || { w: 50, h: 50, l: 0, t: 0 }
  return {
    width: s.w + 'px',
    height: s.h + 'px',
    left: s.l + 'px',
    top: s.t + 'px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px'
  }
}

const courierStyle = computed(() => {
  let progress = carProgress.value
  if (order.value) {
    if (order.value.status === 'completed') progress = 100
    // If pending, we rely on the animated carProgress value
  }

  // Path: M100 400 L100 250 L400 250 L400 100 L700 100
  // Segments: 
  // 1: (100,400) to (100,250) - length 150
  // 2: (100,250) to (400,250) - length 300
  // 3: (400,250) to (400,100) - length 150
  // 4: (400,100) to (700,100) - length 300
  // Total length: 900
  
  const total = 900
  const d = (progress / 100) * total
  let x = 100, y = 400, angle = -90

  if (d <= 150) {
    x = 100
    y = 400 - d
    angle = -90
  } else if (d <= 450) {
    x = 100 + (d - 150)
    y = 250
    angle = 0
  } else if (d <= 600) {
    x = 400
    y = 250 - (d - 450)
    angle = -90
  } else {
    x = 400 + (d - 600)
    y = 100
    angle = 0
  }

  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
    transition: 'all 0.5s linear'
  }
})

const isStepCompleted = (status: string) => {
  const statusOrder: Record<string, number> = { 'pending': 1, 'paid': 2, 'sorting': 3, 'shipped': 4, 'completed': 5 }
  let current = 1
  
  if (order.value?.status === 'pending') {
    current = 4 // Map pending to 'On the Way'
  } else if (order.value?.status === 'completed') {
    current = 5
  }
  
  return (statusOrder[status] || 0) <= current
}

const isStepActive = (status: string) => {
  if (!order.value) return false
  return order.value.status === status
}

const getStatusTime = (status: string) => {
  if (!order.value) return ''
  const date = new Date(order.value.created_at)
  if (status === 'pending') return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (status === 'paid') return new Date(date.getTime() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return '08:45 AM'
}

const autoCompleteOrder = async () => {
  if (!order.value || order.value.status === 'completed') return
  
  try {
    await api.post(`/orders/${order.value.id}/complete`)
    order.value.status = 'completed'
    
    // Custom notification for the user
    toast.success('Package is ready to be received, please prepare the payment!')
    
    // Redirect to order history after a short delay
    setTimeout(() => {
      router.push('/profile')
    }, 3500)
  } catch (e) {
    console.error('Auto-completion failed', e)
  }
}

const startTracking = () => {
  if (!order.value) return

  if (order.value.status === 'pending') {
    carProgress.value = 0
    const interval = setInterval(() => {
      if (order.value?.status !== 'pending') {
        clearInterval(interval)
        return
      }
      
      if (carProgress.value < 100) {
        // Move faster to 100% (2% every 1 second = 50 seconds total)
        carProgress.value += 2
        
        if (carProgress.value >= 100) {
          carProgress.value = 100
          autoCompleteOrder()
          clearInterval(interval)
        }
      }
    }, 1000)
  } else if (order.value.status === 'completed') {
    carProgress.value = 100
  }
}

onMounted(async () => {
  try {
    const res = await api.get(`/orders/${route.params.id}`)
    order.value = res.data
    startTracking()
  } catch (e) {
    toast.error('Unable to fetch tracking data')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.track-page {
  padding: 40px 0;
  min-height: 100vh;
  background: #0a0a0c !important;
  color: #fff !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.track-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.btn-back-integrated {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 700;
  margin-bottom: 15px;
}

.track-header h1 {
  font-size: 32px;
  font-weight: 900;
  margin: 0;
  color: #fff !important;
}

.track-header h1 span {
  color: var(--primary);
}

.order-ref {
  color: #fff !important;
  opacity: 0.8;
  font-weight: 700;
  font-size: 14px;
}

.live-status-pill {
  background: rgba(250, 204, 21, 0.1);
  color: var(--primary);
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(250, 204, 21, 0.2);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--primary);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

.track-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

/* CITY MAP */
.map-viewport {
  background: #111115;
  border-radius: 30px;
  height: 600px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
}

.city-map {
  width: 800px;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.map-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}

.block {
  position: absolute;
  transition: 0.3s;
}

.block:hover {
  background: rgba(250, 204, 21, 0.05) !important;
  border-color: rgba(250, 204, 21, 0.1) !important;
}

.roads-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.main-road-bg {
  stroke: rgba(255, 255, 255, 0.03);
  stroke-width: 24;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.main-road {
  stroke: rgba(250, 204, 21, 0.1);
  stroke-width: 12;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  stroke-dasharray: 5 15;
}

.side-road {
  stroke: rgba(255, 255, 255, 0.02);
  stroke-width: 8;
  fill: none;
}

.landmark {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 15px;
  transform: translate(-20px, -50%);
  z-index: 5;
}

.landmark.origin { left: 100px; top: 400px; }
.landmark.destination { left: 700px; top: 100px; }

.landmark-pin {
  width: 44px;
  height: 44px;
  background: white;
  color: #111;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}

.landmark-pin.dest {
  background: var(--primary);
}

.landmark-info {
  display: flex;
  flex-direction: column;
}

.landmark-info strong {
  font-size: 14px;
  font-weight: 800;
}

.landmark-info span {
  font-size: 11px;
  color: #fff;
  opacity: 0.7;
}

.courier-vehicle {
  position: absolute;
  z-index: 10;
  text-align: center;
}

.vehicle-icon {
  width: 48px;
  height: 48px;
  background: #111;
  color: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--primary);
  position: relative;
  box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);
}

.vehicle-signal {
  position: absolute;
  inset: -5px;
  border: 2px solid var(--primary);
  border-radius: 50%;
  animation: signal 1.5s infinite;
  opacity: 0;
}

@keyframes signal {
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}

.vehicle-label {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) rotate(0deg);
  background: #111;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 900;
  white-space: nowrap;
  margin-top: 8px;
  border: 1px solid rgba(250, 204, 21, 0.3);
}

/* TIMELINE */
.details-card {
  background: #111115;
  border-radius: 30px;
  padding: 35px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.details-card h3 {
  margin: 0 0 25px;
  font-size: 20px;
  font-weight: 900;
  color: #fff !important;
}

.shipment-status-line {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  margin-bottom: 30px;
}

.status-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #444;
}

.status-icon.shipped { background: var(--primary); box-shadow: 0 0 10px var(--primary); }
.status-icon.completed { background: #10b981; box-shadow: 0 0 10px #10b981; }

.status-text p {
  margin: 0;
  font-size: 14px;
  color: #fff !important;
}

.status-text span {
  font-size: 12px;
  color: #fff !important;
  opacity: 0.7;
}

.shipment-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-node {
  display: flex;
  gap: 20px;
  padding-bottom: 35px;
  position: relative;
  animation: slideIn 1s ease-out both;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.timeline-node::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 20px;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.05);
}

.timeline-node:last-child::before { display: none; }

.node-marker {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #1a1a1e;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.timeline-node.completed .node-marker {
  border-color: var(--primary);
}

.timeline-node.completed .inner-node {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
}

.timeline-node.active .node-marker {
  border-color: var(--primary);
  box-shadow: 0 0 15px rgba(250, 204, 21, 0.3);
}

.node-content {
  flex: 1;
}

.node-time {
  font-size: 11px;
  color: #fff;
  opacity: 0.7;
  margin-bottom: 4px;
}

.node-content h4 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 800;
  color: #fff !important;
  opacity: 0.9;
}

.timeline-node.active h4, .timeline-node.completed h4 {
  color: white;
}

.node-content p {
  margin: 0;
  font-size: 13px;
  color: #fff !important;
  opacity: 0.7;
}

.timeline-node.active p, .timeline-node.completed p {
  color: #fff !important;
  opacity: 0.9;
}

/* LOADING */
.track-loading {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  color: #fff;
}

.radar {
  position: relative;
  width: 80px;
  height: 80px;
}

.radar-circle {
  position: absolute;
  inset: 0;
  border: 2px solid var(--primary);
  border-radius: 50%;
  animation: radar-ping 2s infinite;
  opacity: 0;
}

.radar-circle:nth-child(2) { animation-delay: 0.5s; }
.radar-circle:nth-child(3) { animation-delay: 1s; }

@keyframes radar-ping {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

@media (max-width: 1000px) {
  .track-grid {
    grid-template-columns: 1fr;
  }
}
</style>
