/**
 * 鍏ㄥ眬瀵艰埅鐘舵€?鈥?鏇夸唬 uni.navigateTo / uni.switchTab
 */
import { reactive } from 'vue'

export const navState = reactive({
  currentTab: 'index',
  currentPage: null,   // { type, id, ... }
  pageStack: []
})

export function switchTab(key) {
  navState.currentTab = key
  navState.currentPage = null
  navState.pageStack = []
}

export function navigateTo(page) {
  navState.pageStack.push(page)
  navState.currentPage = page
}

export function goBack() {
  navState.pageStack.pop()
  navState.currentPage = navState.pageStack.length > 0
    ? navState.pageStack[navState.pageStack.length - 1]
    : null
}
