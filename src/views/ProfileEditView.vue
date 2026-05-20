<template>
  <main class="profile-edit-page fade-up">
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <h1>Edit <span>Profile</span></h1>
          <p>Update your personal information and shipping details.</p>
        </div>
        <RouterLink to="/profile" class="btn-cancel">Cancel</RouterLink>
      </div>

      <div class="edit-grid">
        <!-- LEFT COLUMN: Avatar Upload -->
        <div class="edit-card avatar-section" 
             @dragover.prevent="isDragging = true" 
             @dragleave.prevent="isDragging = false" 
             @drop.prevent="handleDrop">
          <div class="avatar-edit-card" :class="{ 'is-dragging': isDragging }">
            <div class="avatar-large" @click="triggerUpload">
              <img v-if="user?.profile_picture" :src="getImageUrl(user.profile_picture)" alt="Profile" class="avatar-img">
              <span v-else>{{ user?.name?.charAt(0) || form.name.charAt(0) }}</span>
              <div class="upload-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              </div>
            </div>
            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none">
            <h3>Profile Picture</h3>
            <p>Click, drag & drop, or paste an image here to update your profile picture.</p>
            <p v-if="isUploading" class="uploading-text">Uploading...</p>
          </div>
        </div>

        <!-- RIGHT COLUMN: Form -->
        <div class="edit-card form-section">
          <form @submit.prevent="updateProfile" class="edit-form">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="form.name" placeholder="Enter your full name" required>
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <input type="email" v-model="form.email" placeholder="Enter your email" required>
            </div>

            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" v-model="form.phone" placeholder="Enter your phone number">
            </div>

            <div class="form-group full-width">
              <label>Shipping Address</label>
              <textarea v-model="form.address" placeholder="Enter your complete shipping address" rows="4"></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-save" :disabled="loading">
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { toast } from '../stores/toast'

const router = useRouter()
const loading = ref(false)
const user = ref<any>(null)
const isDragging = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/src/assets/images/shoe1.jpg'
  if (imagePath.startsWith('http')) return imagePath
  return `http://127.0.0.1:8000/storage/${imagePath}`
}

onMounted(async () => {
  window.addEventListener('paste', handlePaste)
  try {
    const res = await api.get('/user')
    user.value = res.data
    form.value.name = res.data.name
    form.value.email = res.data.email
    form.value.phone = res.data.phone || ''
    form.value.address = res.data.address || ''
  } catch (e) {
    toast.error('Failed to load profile data')
    router.push('/profile')
  }
})

onUnmounted(() => {
  window.removeEventListener('paste', handlePaste)
})

const uploadFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    toast.error('Please upload an image file')
    return
  }

  const formData = new FormData()
  formData.append('profile_picture', file)
  isUploading.value = true
  try {
    const res = await api.post('/user/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    user.value = res.data.user
    toast.success('Profile picture updated!')
  } catch (e) {
    toast.error('Failed to upload picture')
  } finally {
    isUploading.value = false
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) uploadFile(file)
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) uploadFile(file)
}

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item && item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      if (file) uploadFile(file)
      break
    }
  }
}

const updateProfile = async () => {
  loading.value = true
  try {
    const res = await api.put('/user', form.value)
    user.value = res.data.user
    toast.success('Profile updated successfully')
    router.push('/profile')
  } catch (e: any) {
    const msg = e.response?.data?.message || 'Failed to update profile'
    toast.error(msg)
  } finally {
    loading.value = false
  }
}

const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
</script>

<style scoped>
.profile-edit-page {
  padding: 60px 0;
  min-height: 80vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.header-content h1 {
  font-size: 42px;
  font-weight: 900;
  color: var(--color-heading);
  letter-spacing: -1px;
}

.header-content h1 span {
  color: var(--primary);
}

.header-content p {
  color: var(--color-text);
  font-size: 16px;
  margin-top: 5px;
}

.btn-cancel {
  padding: 12px 24px;
  background: var(--color-background-soft);
  color: var(--color-heading);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  transition: 0.3s;
}

.btn-cancel:hover {
  background: var(--color-border);
}

.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 30px;
}

.edit-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 30px var(--color-card-shadow);
}

.avatar-edit-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: 0.3s;
  padding: 20px;
  border-radius: 20px;
}

.avatar-edit-card.is-dragging {
  background: rgba(250, 204, 21, 0.05);
  border: 2px dashed var(--primary);
}

.avatar-large {
  width: 150px;
  height: 150px;
  background: var(--primary);
  color: var(--color-heading);
  font-size: 50px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 35% 65% 70% 30% / 30% 30% 70% 70%;
  margin: 0 auto 20px;
  box-shadow: 0 10px 20px rgba(250, 204, 21, 0.2);
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: 0.3s;
}

.avatar-large:hover .upload-overlay {
  opacity: 1;
}

.avatar-edit-card h3 {
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: 800;
}

.avatar-edit-card p {
  font-size: 14px;
  color: #888;
  line-height: 1.5;
}

.uploading-text {
  color: var(--primary) !important;
  font-weight: 700;
  margin-top: 10px;
}

.edit-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-heading);
}

.form-group input,
.form-group textarea {
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-heading);
  font-family: inherit;
  font-size: 15px;
  outline: none;
  transition: 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.1);
}

.form-actions {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-save {
  padding: 16px 32px;
  background: var(--primary);
  color: #111;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
}

.btn-save:hover:not(:disabled) {
  background: #eab308;
  transform: translateY(-2px);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .edit-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .edit-form {
    grid-template-columns: 1fr;
  }
  .form-group.full-width {
    grid-column: span 1;
  }
  .edit-card {
    padding: 24px;
  }
}
</style>
