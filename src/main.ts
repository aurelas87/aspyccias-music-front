import './assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import App from '@/App.vue'
import Maintenance from '@/Maintenance.vue'

const app = (import.meta.env.MODE === 'maintenance')
  ? createApp(Maintenance)
  : createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
