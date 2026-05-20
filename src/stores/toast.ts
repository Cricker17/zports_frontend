import { reactive } from 'vue'

export const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
  
  success(msg: string) {
    this.show = true
    this.message = msg
    this.type = 'success'
    setTimeout(() => this.show = false, 3000)
  },
  
  error(msg: string) {
    this.show = true
    this.message = msg
    this.type = 'error'
    setTimeout(() => this.show = false, 3000)
  },

  info(msg: string) {
    this.show = true
    this.message = msg
    this.type = 'info'
    setTimeout(() => this.show = false, 3000)
  }
})
