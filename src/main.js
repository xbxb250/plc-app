import { createApp as createVueApp } from 'vue'
import { createPinia } from 'pinia'

// UniApp 妗嗘灦鍒濆鍖?import '@dcloudio/uni-app'
import '@dcloudio/uni-h5'
import '@/uni.scss'

window.__UNI_FEATURE_WXS__ = false

export function createApp() {
  const app = createVueApp(App)
  const pinia = createPinia()
  app.use(pinia)
  return { app, pinia }
}

import App from './App.vue'

// 鍏ㄥ眬鏇挎崲 uni 瀵艰埅鏂规硶锛屾ˉ鎺ュ埌鎴戜滑鐨?nav store
import { navigateTo, switchTab, goBack } from '@/stores/nav'

// 纭繚 uni 鍏ㄥ眬瀵硅薄瀛樺湪
window.uni = window.uni || {}

uni.navigateTo = function(opts) {
  const url = typeof opts === 'string' ? opts : opts.url
  if (url.includes('tutorial-detail')) {
    const id = parseInt(url.match(/[?&]id=(\d+)/)?.[1] || '1')
    navigateTo({ type: 'tutorial-detail', id })
  } else if (url.includes('quiz-do')) {
    navigateTo({ type: 'quiz-do' })
  } else if (url.includes('wrong-book')) {
    navigateTo({ type: 'wrong-book' })
  } else if (url.includes('favorites')) {
    navigateTo({ type: 'favorites' })
  }
}

uni.switchTab = function(opts) {
  const url = typeof opts === 'string' ? opts : opts.url
  const tab = {
    '/pages/index/index': 'index',
    '/pages/tutorial/index': 'tutorial',
    '/pages/quiz/index': 'quiz',
    '/pages/mine/index': 'mine'
  }[url]
  if (tab) switchTab(tab)
}

uni.navigateBack = function() { goBack() }

// 琛ュ厖鍏朵粬 uni API 鐨?stub锛岄伩鍏嶆姤閿?uni.showToast = uni.showToast || function(opts) {
  const title = typeof opts === 'string' ? opts : opts?.title || ''
  console.log('[Toast]', title)
}
uni.showModal = uni.showModal || function(opts) {
  console.log('[Modal]', opts?.content || '')
  return Promise.resolve({ confirm: true })
}
uni.getStorageSync = uni.getStorageSync || function(key) {
  return localStorage.getItem(key)
}
uni.setStorageSync = uni.setStorageSync || function(key, value) {
  localStorage.setItem(key, value)
}
uni.removeStorageSync = uni.removeStorageSync || function(key) {
  localStorage.removeItem(key)
}

const { app } = createApp()

// 鍏ㄥ眬娉ㄥ唽 UniApp 缁勪欢涓虹畝鍗曞鍣紙鐢?render 鍑芥暟锛屽洜 Vue 杩愯鏃朵笉鍚紪璇戝櫒锛?app.component('scroll-view', {
  props: ['scrollY', 'scrollX', 'showScrollbar', 'enableBackToTop'],
  render() { return this.$slots.default?.() || null }
})

app.mount('#app')
