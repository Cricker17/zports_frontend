import { ref, onUnmounted } from 'vue'

/**
 * Composable for countdown timer logic.
 * Replaces duplicated countdown in HomeView and SaleView.
 */
export function useCountdown(options: { durationSeconds?: number; targetDate?: Date } = {}) {
  const hours = ref('00')
  const minutes = ref('00')
  const seconds = ref('00')

  let intervalId: ReturnType<typeof setInterval> | null = null

  function start() {
    stop() // Clear any existing timer

    if (options.targetDate) {
      // Count down to a specific date/time
      intervalId = setInterval(() => {
        const now = Date.now()
        const distance = options.targetDate!.getTime() - now

        if (distance <= 0) {
          hours.value = '00'
          minutes.value = '00'
          seconds.value = '00'
          stop()
          return
        }

        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const s = Math.floor((distance % (1000 * 60)) / 1000)

        hours.value = h.toString().padStart(2, '0')
        minutes.value = m.toString().padStart(2, '0')
        seconds.value = s.toString().padStart(2, '0')
      }, 1000)
    } else {
      // Count down from a fixed duration
      let totalSeconds = options.durationSeconds ?? 12 * 3600

      const h = Math.floor(totalSeconds / 3600)
      const m = Math.floor((totalSeconds % 3600) / 60)
      const s = totalSeconds % 60
      hours.value = h.toString().padStart(2, '0')
      minutes.value = m.toString().padStart(2, '0')
      seconds.value = s.toString().padStart(2, '0')

      intervalId = setInterval(() => {
        if (totalSeconds > 0) totalSeconds--
        const h = Math.floor(totalSeconds / 3600)
        const m = Math.floor((totalSeconds % 3600) / 60)
        const s = totalSeconds % 60
        hours.value = h.toString().padStart(2, '0')
        minutes.value = m.toString().padStart(2, '0')
        seconds.value = s.toString().padStart(2, '0')

        if (totalSeconds <= 0) stop()
      }, 1000)
    }
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // Auto-cleanup on component unmount
  onUnmounted(stop)

  return { hours, minutes, seconds, start, stop }
}
