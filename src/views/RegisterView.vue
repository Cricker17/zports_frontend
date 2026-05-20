<template>
  <main class="login-wrapper">
    <div class="login-image-side fade-in">
      <div class="image-overlay">
        <h2>ZPORTS</h2>
        <p>Premium Sneakers for the Bold.</p>
      </div>
    </div>
    <div class="login-form-side fade-up">
      <div class="auth-box">
        <!-- TOGGLE -->
        <div class="auth-toggle">
          <button @click="router.push('/login')">Login</button>
          <button class="active">Register</button>
        </div>

        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join us today to start shopping</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="input-group">
            <label>Full Name</label>
            <div class="input-wrapper">
              <input v-model="form.name" placeholder="John Doe" required>
            </div>
          </div>
          <div class="input-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <input v-model="form.email" placeholder="name@example.com" type="email" required>
            </div>
          </div>
          <div class="input-group">
            <label>Password</label>
            <div class="input-wrapper">
              <input v-model="form.password" placeholder="••••••••" type="password" required minlength="8">
            </div>
          </div>
          <div class="input-group">
            <label>Confirm Password</label>
            <div class="input-wrapper">
              <input v-model="form.password_confirmation" placeholder="••••••••" type="password" required minlength="8">
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="!loading">Sign Up</span>
            <div v-else class="loader-spinner"></div>
          </button>
        </form>

        <div class="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <button class="btn-google" @click="toast.info('Google Sign Up coming soon!')">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google">
          Continue with Google
        </button>

        <p class="auth-footer">
          Already have an account? <RouterLink to="/login">Sign in here</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import api from '../services/api'
import { toast } from '../stores/toast'

const router = useRouter()
const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async () => {
  if (form.value.password !== form.value.password_confirmation) {
    toast.error('Passwords do not match')
    return
  }

  loading.value = true
  try {
    const res = await api.post('/auth/register', form.value)
    sessionStorage.setItem('auth_token', res.data.token)
    toast.success('Registration successful! Welcome.')
    setTimeout(() => {
      window.location.href = '/'
    }, 1500)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Registration failed.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Core Layout (Shared with LoginView) */
.login-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: var(--color-background);
}

.login-image-side {
  flex: 1.2;
  background: url('/images/auth-bg.png') center/cover no-repeat;
  position: relative;
  display: none;
}

@media (min-width: 900px) {
  .login-image-side {
    display: block;
  }
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.1));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 80px;
  color: white;
}

.image-overlay h2 {
  font-family: var(--font-logo);
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 10px;
  letter-spacing: -2px;
  color: #facc15;
}

.image-overlay p {
  font-size: 20px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.login-form-side {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 40px 20px;
}

.auth-box {
  width: 100%;
  max-width: 460px;
  background: var(--color-background);
  padding: 50px;
  border-radius: 30px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-border);
}

/* Toggle */
.auth-toggle {
  display: flex;
  background: var(--color-background-soft);
  padding: 6px;
  border-radius: 16px;
  margin-bottom: 40px;
}

.auth-toggle button {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  font-weight: 700;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #6b7280;
  font-size: 14px;
}

.auth-toggle button.active {
  background: var(--color-background);
  color: var(--color-heading);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* Headers */
.auth-header {
  text-align: center;
  margin-bottom: 35px;
}

.auth-header h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 8px;
  color: var(--color-heading);
  letter-spacing: -1px;
}

.auth-header p {
  color: #6b7280;
  font-size: 15px;
}

/* Forms */
.auth-form {
  margin-bottom: 25px;
}

.input-group {
  margin-bottom: 22px;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text);
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  height: 56px;
  padding: 0 20px;
  border-radius: 16px;
  border: 2px solid var(--color-border);
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-heading);
  outline: none;
  transition: all 0.3s ease;
  background: var(--color-background-soft);
}

.input-wrapper input:focus {
  border-color: #facc15;
  background: var(--color-background);
  box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.1);
}

.input-wrapper input::placeholder {
  color: #9ca3af;
  font-weight: 400;
  transition: color 0.3s ease;
}

.input-wrapper input:focus::placeholder {
  color: transparent;
}

/* Buttons */
.btn-submit {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: #111827;
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-submit:hover:not(:disabled) {
  background: #facc15;
  color: #111827;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(250, 204, 21, 0.5);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loader-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.btn-submit:hover .loader-spinner {
  border-top-color: #111;
  border-color: rgba(17,17,17,0.3);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Extras */
.divider {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 30px 0;
  color: #e5e7eb;
}

.divider::before, .divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
}

.btn-google {
  width: 100%;
  height: 56px;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 600;
  font-size: 15px;
  color: var(--color-heading);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-google:hover {
  background: var(--color-background-soft);
  border-color: var(--color-border-hover);
}

.btn-google img {
  width: 20px;
}

.auth-footer {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #6b7280;
}

.auth-footer a {
  color: #111827;
  font-weight: 700;
  text-decoration: none;
  transition: 0.2s;
}

.auth-footer a:hover {
  color: #eab308;
}

/* Animations */
.fade-up {
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-in {
  animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
