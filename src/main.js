import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener(
      'load',
      () => {
        navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
      },
      { once: true }
    )
  }
})
