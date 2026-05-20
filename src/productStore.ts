import { defineStore } from "pinia"
import { getProducts } from "@/services/productService"
import type { Product } from "@/types/product"

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
    loading: false
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        this.products = await getProducts()
      } catch (error) {
        console.error('Failed to fetch products:', error)
        this.products = []
      } finally {
        this.loading = false
      }
    }
  }
})
