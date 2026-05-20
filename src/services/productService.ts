import api from "./api"
import type { Product } from "@/types/product"

export const getProducts = async (): Promise<Product[]> => {
  const res = await api.get("/products")

  // Debug: lihat struktur response dari API
  console.log('API Response:', res.data)

  // Handle berbagai kemungkinan struktur response
  const responseData = res.data

  // Jika response punya wrapper 'data' dari ResourceCollection
  // Response bisa: { data: { success, data: [...] } } atau { success, data: [...] }
  let products: Product[]

  if (Array.isArray(responseData)) {
    // Response langsung array
    products = responseData
  } else if (responseData?.data && Array.isArray(responseData.data)) {
    // Response: { success, data: [...] }
    products = responseData.data
  } else if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
    // Response: { data: { success, data: [...] } } (double wrapped)
    products = responseData.data.data
  } else {
    console.error('Unexpected API response structure:', responseData)
    products = []
  }

  return products
}
