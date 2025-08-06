import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './assets/css/base.css'
import './assets/css/main.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)

app.mount('#app')

// removes layout shift from dialogs smh (it still won't get off hakjshakjhda)
const originalOverflow = getComputedStyle(document.body).overflow

const observer = new MutationObserver(() => {
  const current = document.body.style.overflow
  if (current === 'hidden') {
    document.body.style.overflow = originalOverflow || 'auto'
  }
})

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['style'],
})
