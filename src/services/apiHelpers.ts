/**
 * Unwraps nested API response data.
 * Handles Laravel's various response structures:
 * - Direct array: [...]
 * - ResourceCollection: { data: [...] }
 * - Paginated: { data: { data: [...] } }
 */
export function unwrapResponse<T = any>(responseData: any): T[] {
  if (Array.isArray(responseData)) {
    return responseData
  }
  if (responseData?.data?.data && Array.isArray(responseData.data.data)) {
    return responseData.data.data
  }
  if (responseData?.data && Array.isArray(responseData.data)) {
    return responseData.data
  }
  return []
}
