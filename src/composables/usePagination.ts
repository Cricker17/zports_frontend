import { ref, computed, type Ref } from 'vue'

/**
 * Composable for client-side pagination.
 * Replaces duplicated pagination logic across 4+ files.
 */
export function usePagination<T>(items: Ref<T[]>, perPage: number = 12) {
  const currentPage = ref(1)

  const totalPages = computed(() =>
    Math.ceil(items.value.length / perPage)
  )

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage
    return items.value.slice(start, start + perPage)
  })

  function resetPage() {
    currentPage.value = 1
  }

  /** Ensure current page is within bounds (useful after data changes) */
  function clampPage() {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  }

  return {
    currentPage,
    totalPages,
    paginatedItems,
    resetPage,
    clampPage
  }
}
