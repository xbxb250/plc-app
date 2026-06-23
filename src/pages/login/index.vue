<!-- 鐧诲綍椤?-->
<template>
  <view class="page">
    <!-- 鐘舵€佹爮鍗犱綅 -->
    <view class="status-bar">
      <text class="time">9:41</text>
      <text class="icons">馃摱 馃攱</text>
    </view>

    <view class="login-body">
      <!-- Logo -->
      <view class="logo">鈿?/view>
      <text class="title">娆㈣繋鏉ュ埌 PLC 瀛﹀爞</text>
      <text class="subtitle">姣忓ぉ10鍒嗛挓锛岃交鏉炬帉鎻LC缂栫▼\n宸叉湁 12,380 鍚嶅伐鎺т汉鍦ㄥ</text>

      <!-- 寰俊鐧诲綍 -->
      <button
        class="btn-wechat"
        :loading="loading && loginType === 'wechat'"
        @click="handleWechatLogin"
      >
        <text class="btn-icon">馃挰</text>
        <text>寰俊涓€閿櫥褰?/text>
      </button>

      <!-- 鎵嬫満鍙风櫥褰?-->
      <button
        class="btn-phone"
        :loading="loading && loginType === 'phone'"
        @click="handlePhoneLogin"
      >
        <text class="btn-icon">馃摫</text>
        <text>鎵嬫満鍙风櫥褰?/text>
      </button>

      <!-- 鍗忚 -->
      <text class="agreement">
        鐧诲綍鍗宠〃绀哄悓鎰?<text class="link">銆婄敤鎴峰崗璁€?/text> 鍜?<text class="link">銆婇殣绉佹斂绛栥€?/text>
      </text>
    </view>

    <!-- 鎵嬫満鍙风櫥褰曞脊绐?-->
    <view v-if="showPhoneModal" class="modal-mask" @click="showPhoneModal = false">
      <view class="modal-box" @click.stop>
        <text class="modal-title">鎵嬫満鍙风櫥褰?/text>
        <input
          class="phone-input"
          v-model="phone"
          type="number"
          maxlength="11"
          placeholder="璇疯緭鍏ユ墜鏈哄彿"
        />
        <view v-if="showOtpInput" class="otp-row">
          <input
            class="otp-input"
            v-model="otp"
            type="number"
            maxlength="6"
            placeholder="璇疯緭鍏ラ獙璇佺爜"
          />
        </view>
        <button
          v-if="!showOtpInput"
          class="btn btn-primary"
          :disabled="phone.length !== 11"
          @click="sendOtp"
        >
          鑾峰彇楠岃瘉鐮?        </button>
        <button
          v-else
          class="btn btn-primary"
          :disabled="otp.length !== 6"
          @click="verifyOtpCode"
        >
          鐧诲綍
        </button>
        <text class="modal-close" @click="showPhoneModal = false">鍙栨秷</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const loading = ref(false)
const loginType = ref('')
const showPhoneModal = ref(false)
const showOtpInput = ref(false)
const phone = ref('')
const otp = ref('')

// 寰俊鐧诲綍
async function handleWechatLogin() {
  loginType.value = 'wechat'
  loading.value = true
  const result = await userStore.loginWithWechat()
  loading.value = false

  if (result.success) {
    uni.reLaunch({ url: '/pages/index/index' })
  } else {
    uni.showToast({ title: result.error || '鐧诲綍澶辫触', icon: 'none' })
  }
}

// 鎵嬫満鍙风櫥褰?鈥?鏄剧ず寮圭獥
function handlePhoneLogin() {
  loginType.value = 'phone'
  showPhoneModal.value = true
}

// 鍙戦€侀獙璇佺爜
async function sendOtp() {
  const result = await userStore.loginWithPhone(phone.value)
  if (result.success) {
    showOtpInput.value = true
    uni.showToast({ title: '楠岃瘉鐮佸凡鍙戦€?, icon: 'success' })
  } else {
    uni.showToast({ title: '鍙戦€佸け璐ワ紝璇风◢鍚庡啀璇?, icon: 'none' })
  }
}

// 楠岃瘉 OTP
async function verifyOtpCode() {
  loading.value = true
  const result = await userStore.verifyPhoneOtp(phone.value, otp.value)
  loading.value = false

  if (result.success) {
    showPhoneModal.value = false
    uni.reLaunch({ url: '/pages/index/index' })
  } else {
    uni.showToast({ title: '楠岃瘉鐮侀敊璇?, icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #fff;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 40rpx 0;
  font-size: 24rpx;
  color: #1f2937;
}

.login-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 48rpx 0;
}

.logo {
  font-size: 120rpx;
  margin-bottom: 20rpx;
}

.title {
  font-size: 44rpx;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12rpx;
}

.subtitle {
  font-size: 26rpx;
  color: #6b7280;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 80rpx;
  white-space: pre-line;
}

.btn-wechat {
  width: 100%;
  padding: 28rpx;
  border-radius: 16rpx;
  background: #07c160;
  color: #fff;
  border: none;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 24rpx;

  .btn-icon { font-size: 40rpx; }
}

.btn-phone {
  width: 100%;
  padding: 28rpx;
  border-radius: 16rpx;
  background: #fff;
  color: #374151;
  border: 2rpx solid #d1d5db;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;

  .btn-icon { font-size: 36rpx; }
}

.agreement {
  font-size: 22rpx;
  color: #9ca3af;
  text-align: center;
  margin-top: 40rpx;

  .link { color: #2563eb; }
}

// 寮圭獥
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.modal-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1f2937;
}

.phone-input, .otp-input {
  width: 100%;
  padding: 24rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  font-size: 30rpx;
  text-align: center;
}

.otp-row { width: 100%; }

.modal-close {
  font-size: 28rpx;
  color: #9ca3af;
  margin-top: 8rpx;
}

.btn {
  width: 100%;
  padding: 24rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 30rpx;
  font-weight: 600;
  text-align: center;
  background: #2563eb;
  color: #fff;
}

.btn[disabled] {
  opacity: 0.5;
}
</style>
