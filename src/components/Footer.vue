<template>
  <footer class="footer">
    <div class="container footer-grid">
      <!-- BRAND COLUMN -->
      <div class="footer-col brand-col">
        <h2 class="logo">Z<span>PORTS</span></h2>
        <p class="brand-desc">
          Your destination for premium sneakers and modern lifestyle footwear. We bring style and comfort to every step you take.
        </p>
        <div class="social-links">
          <a href="#" class="social-icon" title="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" class="social-icon wa" title="WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </a>
          <a href="#" class="social-icon" title="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="#" class="social-icon" title="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.48 0 0 0-.08-.83A7.72 7.22 0 0 0 23 3z"></path></svg>
          </a>
        </div>
      </div>

      <!-- QUICK LINKS -->
      <div class="footer-col">
        <h3>Shop</h3>
        <ul class="footer-links">
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/shop">All Products</RouterLink></li>
          <li><RouterLink to="/sale">Flash Sale</RouterLink></li>
          <li><RouterLink to="/shop?category=1">New Arrivals</RouterLink></li>
        </ul>
      </div>

      <!-- SUPPORT -->
      <div class="footer-col">
        <h3>Support</h3>
        <ul class="footer-links">
          <li><a href="#">Shipping Policy</a></li>
          <li><a href="#">Refund & Returns</a></li>
          <li><a href="#">Size Guide</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>

      <!-- CONTACT -->
      <div class="footer-col">
        <h3>Contact Us</h3>
        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>Jakarta, Indonesia</span>
        </div>
        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>+62 812-3456-7890</span>
        </div>
        <div class="contact-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <span>support@zports.com</span>
        </div>
      </div>
    </div>
 
    <!-- BOTTOM BAR -->
    <div class="footer-bottom">
      <div class="container bottom-flex">
        <p>&copy; 2026 ZPORTS Sneaker Store. All rights reserved.</p>
        <div class="payment-methods">
          <img src="https://imgs.search.brave.com/pKHaGYTO06joZhsf5tCg4qi83UmVs_exaNk-9y1DTCk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL2ZyZWUv/cG5nLTI1Ni9mcmVl/LXZpc2EtaWNvbi1z/dmctZG93bmxvYWQt/cG5nLTIyNjQ2MC5w/bmc_Zj13ZWJwJnc9/MTI4" alt="Visa">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard">
          <img src="https://imgs.search.brave.com/zHOIsmit5ca07yTiKD0JC0-_qu7l3cH9OUXkzvSSFZM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL2ZyZWUv/cG5nLTI1Ni9mcmVl/LXBheXBhbC1pY29u/LXN2Zy1kb3dubG9h/ZC1wbmctMjI2NDU2/LnBuZz9mPXdlYnAm/dz0xMjg" alt="PayPal">
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.footer {
  background: #0f0f0f;
  color: #fff;
  padding-top: 80px;
  margin-top: 100px;
  border-top: 1px solid #222;
}



.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 60px;
  padding-bottom: 60px;
}

.logo {
  font-family: var(--font-logo);
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -2px; /* Tighter spacing */
  margin-bottom: 20px;
  color: #fff !important;
  font-style: italic;
}

.logo span {
  color: var(--primary);
}

.brand-desc {
  color: #888;
  line-height: 1.7;
  font-size: 15px;
  margin-bottom: 25px;
  max-width: 350px;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-icon {
  width: 44px;
  height: 44px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
  transition: 0.3s;
  border: 1px solid #222;
}

.social-icon:hover {
  background: #facc15;
  color: #000;
  transform: translateY(-5px);
  border-color: #facc15;
}

.social-icon.wa:hover {
  background: #25d366;
  border-color: #25d366;
  color: #fff;
}

.social-icon svg {
  width: 20px;
  height: 20px;
}

.footer-col h3 {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 30px;
  position: relative;
  color: #fff !important;
}

.footer-col h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 30px;
  height: 2px;
  background: #facc15;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 15px;
}

.footer-links a {
  color: #bbb !important;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: 0.3s;
}

.footer-links a:hover {
  color: #facc15;
  padding-left: 5px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  color: #888;
  font-size: 15px;
}

.contact-item svg {
  flex-shrink: 0;
}

/* BOTTOM BAR */
.footer-bottom {
  background: #000;
  padding: 30px 0;
  border-top: 1px solid #1a1a1a;
}

.bottom-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom-flex p {
  color: #666;
  font-size: 14px;
}

.payment-methods {
  display: flex;
  gap: 20px;
  align-items: center;
}

.payment-methods img {
  height: 20px;
  filter: grayscale(1) brightness(2);
  opacity: 0.5;
  transition: 0.3s;
}

.payment-methods img:hover {
  filter: grayscale(0) brightness(1);
  opacity: 1;
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
}

@media (max-width: 600px) {
  .footer {
    padding-top: 60px;
  }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .bottom-flex {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  .brand-col {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .brand-desc {
    max-width: 100%;
  }
  .footer-col h3::after {
    left: 50%;
    transform: translateX(-50%);
  }
  .footer-col {
    text-align: center;
  }
  .contact-item {
    justify-content: center;
  }
}
</style>