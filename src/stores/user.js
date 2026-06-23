/**
 * 鐢ㄦ埛鐘舵€佺鐞?(Pinia)
 *
 * 绠＄悊鐢ㄦ埛鐧诲綍鐘舵€併€佷釜浜轰俊鎭€佸涔犵粺璁? */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCurrentUser, signOut, signInWithWechat, signInWithPhone, verifyOtp } from '@/utils/supabase'

export const useUserStore = defineStore('user', () => {
  // ========== 鐘舵€?==========
  const user = ref(null)           // Supabase 鐢ㄦ埛瀵硅薄
  const profile = ref({            // 鐢ㄦ埛璧勬枡锛堟湰鍦版墿灞曞瓧娈碉級
    nickname: '',
    avatar: '',
    company: '',
    learnDays: 0,
    completedTutorials: 0,
    totalQuestions: 0,
    correctRate: 0
  })
  const isLoggedIn = ref(false)
  const loading = ref(false)

  // ========== 璁＄畻灞炴€?==========
  const displayName = computed(() => {
    if (profile.value.nickname) return profile.value.nickname
    if (user.value?.phone) {
      return user.value.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
    }
    return '瀛﹀憳'
  })

  // ========== 鏂规硶 ==========

  /** 鍒濆鍖栵細妫€鏌ョ櫥褰曠姸鎬?*/
  async function init() {
    loading.value = true
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        user.value = currentUser
        isLoggedIn.value = true
        await loadProfile()
      }
    } catch (err) {
      console.error('鍒濆鍖栫敤鎴风姸鎬佸け璐?', err)
    } finally {
      loading.value = false
    }
  }

  /** 鍔犺浇鐢ㄦ埛璧勬枡 */
  async function loadProfile() {
    // TODO: 浠?Supabase profiles 琛ㄥ姞杞?    const cached = uni.getStorageSync('user_profile')
    if (cached) {
      profile.value = { ...profile.value, ...JSON.parse(cached) }
    }
  }

  /** 寰俊鐧诲綍 */
  async function loginWithWechat() {
    loading.value = true
    try {
      const result = await signInWithWechat()
      if (result.success) {
        user.value = result.user
        isLoggedIn.value = true
        await loadProfile()
      }
      return result
    } finally {
      loading.value = false
    }
  }

  /** 鎵嬫満鍙风櫥褰?*/
  async function loginWithPhone(phone) {
    loading.value = true
    try {
      return await signInWithPhone(phone)
    } finally {
      loading.value = false
    }
  }

  /** 楠岃瘉 OTP */
  async function verifyPhoneOtp(phone, token) {
    loading.value = true
    try {
      const result = await verifyOtp(phone, token)
      if (result.success) {
        user.value = result.user
        isLoggedIn.value = true
        await loadProfile()
      }
      return result
    } finally {
      loading.value = false
    }
  }

  /** 閫€鍑虹櫥褰?*/
  async function logout() {
    loading.value = true
    try {
      const result = await signOut()
      if (result.success) {
        user.value = null
        isLoggedIn.value = false
        profile.value = {}
      }
      return result
    } finally {
      loading.value = false
    }
  }

  /** 鏇存柊鐢ㄦ埛璧勬枡 */
  function updateProfile(data) {
    profile.value = { ...profile.value, ...data }
    uni.setStorageSync('user_profile', JSON.stringify(profile.value))
  }

  /** 鏇存柊瀛︿範缁熻 */
  function updateStats(stats) {
    profile.value = { ...profile.value, ...stats }
    uni.setStorageSync('user_profile', JSON.stringify(profile.value))
  }

  return {
    user,
    profile,
    isLoggedIn,
    loading,
    displayName,
    init,
    loginWithWechat,
    loginWithPhone,
    verifyPhoneOtp,
    logout,
    updateProfile,
    updateStats
  }
})
