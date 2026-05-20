<template>
  <section class="hero container">

    <div class="left fade-up">
      <p class="tag">NEW COLLECTION 2026</p>

      <h1>
        STEP INTO <span>STYLE</span>
      </h1>

      <p class="desc">
        Premium sneakers for modern lifestyle.
        Lightweight comfort with bold streetwear design.
      </p>

      <div class="buttons">
        <RouterLink to="/shop">
          <button class="primary">Shop Now</button>
        </RouterLink>

        <button class="secondary">Explore</button>
      </div>

      <div class="stats">
        <div>
          <h3>{{ stats.customers }}</h3>
          <p>Customers</p>
        </div>

        <div>
          <h3>{{ stats.products }}</h3>
          <p>Products</p>
        </div>

        <div>
          <h3>{{ stats.rating }}</h3>
          <p>Rating</p>
        </div>
      </div>
    </div>


    <div class="right float">
      <div class="circle"></div>

      <img
        src="/src/assets/images/hero-shoe.png"
        alt="premium sneaker"
        @error="(e: any) => e.target.src = '/src/assets/images/shoe1.jpg'"
      >
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../services/api'

const stats = ref({
  customers: '10K+',
  products: '500+',
  rating: '4.9★'
})

onMounted(async () => {
  try {
    const res = await api.get('/stats')
    stats.value = res.data
  } catch (e) {
    console.error('Failed to load hero stats')
  }
})
</script>

<style scoped>


.hero{
min-height:88vh;
display:grid;
grid-template-columns:1fr 1fr;
align-items:center;
gap:40px;
}

.tag{
color:#eab308;
font-weight:700;
letter-spacing:2px;
margin-bottom:10px;
}

h1{
font-size:78px;
line-height:1;
font-weight:900;
margin-bottom:20px;
}

h1 span{
color:#facc15;
}

.desc{
font-size:18px;
color:var(--color-text);
max-width:520px;
line-height:1.6;
}

.buttons{
display:flex;
gap:15px;
margin-top:30px;
}

button{
height:52px;
padding:0 26px;
border:none;
border-radius:16px;
cursor:pointer;
font-weight:700;
transition:.3s;
}

.primary{
background:var(--primary);
color:#111;
}

.secondary{
background:var(--color-background-soft);
border:1px solid var(--color-border);
color:var(--color-heading);
}

button:hover{
transform:translateY(-4px);
}

.stats {
  display: flex;
  gap: 40px;
  margin-top: 40px;
  border-top: 1px solid var(--color-border);
  padding-top: 30px;
}

.stats h3 {
  font-size: 32px;
  font-weight: 900;
  color: var(--color-heading);
  margin: 0;
}

.stats p {
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
  margin: 5px 0 0;
}

.right{
position:relative;
display:flex;
justify-content:center;
align-items:center;
}

.circle{
width:440px;
height:440px;
border-radius:50%;
background:linear-gradient(135deg,#fde047,#facc15);
position:absolute;
}

.right img{
width:540px;
position:relative;
z-index:2;
filter:drop-shadow(0 30px 30px rgba(0,0,0,.18));
}

.fade-up{
animation:fadeUp 1s ease;
}

.float{
animation:float 4s ease-in-out infinite;
}

@keyframes fadeUp{
from{
opacity:0;
transform:translateY(40px);
}
to{
opacity:1;
transform:translateY(0);
}
}

@keyframes float{
0%,100%{
transform:translateY(0);
}
50%{
transform:translateY(-18px);
}
}

@media(max-width:1000px){
.hero{
grid-template-columns:1fr;
text-align:center;
padding-top:40px;
}

.desc{
margin:auto;
}

.stats{
justify-content:center;
}

h1{
font-size:52px;
}
}
</style>