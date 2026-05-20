# ⚡ Zports - Premium E-Commerce Frontend

[![Vue 3](https://img.shields.io/badge/Vue%203-3.5%2B-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0%2B-blue.svg)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0%2B-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Zports Frontend adalah aplikasi Single Page Application (SPA) e-commerce modern yang responsif, berkinerja tinggi, dan dirancang khusus untuk toko peralatan olahraga premium. Dibangun menggunakan **Vue 3 (Composition API)**, **TypeScript**, dan **Tailwind CSS v4**.

---

## ✨ Fitur Utama
- 🛍️ **User Experience Premium**: Tampilan visual premium, transisi halus, dan animasi mikro interaktif.
- 📦 **State Management**: Menggunakan **Pinia** untuk manajemen keranjang belanja (*Cart*) dan autentikasi yang reaktif.
- ⚡ **Super Fast Load Time**: Dibundel dengan **Vite** untuk performa loading secepat kilat.
- 🛡️ **Secure Auth**: Integrasi penuh dengan **Laravel Sanctum (Token-based auth)**.
- 📱 **Fully Responsive**: Dioptimalkan untuk perangkat mobile, tablet, dan desktop.

---

## 🛠️ Tech Stack & Dependencies
- **Core:** Vue 3 (Script Setup with TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **State Management:** Pinia
- **Routing:** Vue Router
- **HTTP Client:** Axios

---

## 🚀 Memulai (Local Setup)

### 1. Kloning Repositori
```bash
git clone https://github.com/USERNAME_ANDA/zports_frontend.git
cd zports_frontend
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin `.env.example` menjadi `.env` dan sesuaikan URL API Backend Anda:
```bash
cp .env.example .env
```
Isi di dalam `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### 4. Jalankan Server Dev
```bash
npm run dev
```
Buka [http://localhost:5173](http://localhost:5173) di browser Anda.

---

## 🏗️ Struktur Folder Utama
```text
src/
├── assets/          # Gambar, logo, & style global
├── components/      # Komponen modular & reusable
├── composables/     # Logic reusable (Vue Composables)
├── router/          # Konfigurasi Vue Router
├── services/        # Layer API Service (Axios Client)
├── stores/          # Pinia State Management (Cart, Auth, dll.)
└── views/           # Halaman Utama (Home, Shop, Cart, Checkout)
```
