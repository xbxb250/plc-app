/**
 * Supabase 瀹㈡埛绔皝瑁? *
 * 浣跨敤鏂囨。: https://supabase.com/docs/reference/javascript/initializing
 *
 * 浣跨敤鏂规硶:
 *   import { supabase, signInWithWechat, signOut, getCurrentUser } from '@/utils/supabase'
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  console.warn('鈿狅笍 Supabase 灏氭湭閰嶇疆锛岃鍦?.env 鏂囦欢涓缃?VITE_SUPABASE_URL 鍜?VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: {
      getItem: (key) => {
        try { return uni?.getStorageSync?.(key) || localStorage.getItem(key) }
        catch { return localStorage.getItem(key) }
      },
      setItem: (key, value) => {
        try { uni?.setStorageSync?.(key, value); localStorage.setItem(key, value) }
        catch { localStorage.setItem(key, value) }
      },
      removeItem: (key) => {
        try { uni?.removeStorageSync?.(key); localStorage.removeItem(key) }
        catch { localStorage.removeItem(key) }
      }
    },
    detectSessionInUrl: false
  }
})

/**
 * 寰俊灏忕▼搴忎竴閿櫥褰? * 闇€瑕佸厛鍦?Supabase Dashboard 涓厤缃井淇?OAuth
 */
export async function signInWithWechat() {
  // #ifdef MP-WEIXIN
  try {
    // 1. 鑾峰彇寰俊鐧诲綍 code
    const loginRes = await uni.login({ provider: 'weixin' })
    if (!loginRes.code) {
      throw new Error('寰俊鐧诲綍澶辫触锛氭棤娉曡幏鍙?code')
    }

    // 2. 鐢?code 鎹㈠彇 Supabase session
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'wechat',
      token: loginRes.code
    })

    if (error) throw error
    return { success: true, user: data.user }
  } catch (err) {
    console.error('寰俊鐧诲綍澶辫触:', err)
    return { success: false, error: err.message }
  }
  // #endif

  // #ifndef MP-WEIXIN
  console.warn('寰俊鐧诲綍浠呭湪寰俊灏忕▼搴忎腑鍙敤')
  return { success: false, error: '褰撳墠鐜涓嶆敮鎸佸井淇＄櫥褰? }
  // #endif
}

/**
 * 鎵嬫満鍙?+ 楠岃瘉鐮佺櫥褰? * @param {string} phone - 鎵嬫満鍙? */
export async function signInWithPhone(phone) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone
    })
    if (error) throw error
    return { success: true, session: data }
  } catch (err) {
    console.error('鎵嬫満鍙风櫥褰曞け璐?', err)
    return { success: false, error: err.message }
  }
}

/**
 * 楠岃瘉 OTP 楠岃瘉鐮? * @param {string} phone - 鎵嬫満鍙? * @param {string} token - 楠岃瘉鐮? */
export async function verifyOtp(phone, token) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    })
    if (error) throw error
    // 淇濆瓨 token
    uni.setStorageSync('supabase_token', data.session?.access_token)
    return { success: true, user: data.user }
  } catch (err) {
    console.error('楠岃瘉澶辫触:', err)
    return { success: false, error: err.message }
  }
}

/**
 * 閫€鍑虹櫥褰? */
export async function signOut() {
  try {
    await supabase.auth.signOut()
    uni.removeStorageSync('supabase_token')
    return { success: true }
  } catch (err) {
    console.error('閫€鍑虹櫥褰曞け璐?', err)
    return { success: false, error: err.message }
  }
}

/**
 * 鑾峰彇褰撳墠鐧诲綍鐢ㄦ埛
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch {
    return null
  }
}

/**
 * 鑾峰彇褰撳墠浼氳瘽
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch {
    return null
  }
}
