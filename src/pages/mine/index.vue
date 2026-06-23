<!-- 鎴戠殑 -->
<template>
  <view class="page">
    <view class="header">
      <view class="status-bar"><text>9:41</text><text>馃摱 馃攱</text></view>
      <view class="nav-bar">
        <view class="nav-left" />
        <text class="nav-title">鎴戠殑</text>
        <text class="nav-settings" @click="goSettings">鈿欙笍</text>
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <!-- 鐢ㄦ埛淇℃伅鍗＄墖 -->
      <view class="profile-card">
        <view class="avatar">{{ userStore.displayName.charAt(0) }}</view>
        <view class="profile-info">
          <text class="profile-name">{{ userStore.displayName }}</text>
          <text class="profile-phone" v-if="userStore.user?.phone">
            {{ userStore.user.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') }}
          </text>
          <text class="profile-phone" v-else>鏈粦瀹氭墜鏈哄彿</text>
        </view>
        <text class="edit-link" @click="editProfile">缂栬緫璧勬枡 鈫?/text>
      </view>

      <!-- 瀛︿範缁熻 -->
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-num">{{ userStore.profile.learnDays || 7 }}</text>
          <text class="stat-label">瀛︿範澶╂暟</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ userStore.profile.completedTutorials || 0 }}</text>
          <text class="stat-label">宸插鏁欑▼</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ userStore.profile.totalQuestions || 0 }}</text>
          <text class="stat-label">鍋氶鎬绘暟</text>
        </view>
      </view>

      <!-- 鍔熻兘鑿滃崟 -->
      <view class="menu-section">
        <view class="menu-item" @click="goWrongBook">
          <view class="menu-left">
            <text class="menu-icon">馃摑</text>
            <text class="menu-label">閿欓鏈?/text>
          </view>
          <view class="menu-right">
            <text class="badge" v-if="wrongCount > 0">{{ wrongCount }}</text>
            <text class="arrow">鈥?/text>
          </view>
        </view>

        <view class="menu-item" @click="goFavorites">
          <view class="menu-left">
            <text class="menu-icon">猸?/text>
            <text class="menu-label">鎴戠殑鏀惰棌</text>
          </view>
          <text class="arrow">鈥?/text>
        </view>

        <view class="menu-item" @click="goHistory">
          <view class="menu-left">
            <text class="menu-icon">馃搳</text>
            <text class="menu-label">瀛︿範璁板綍</text>
          </view>
          <text class="arrow">鈥?/text>
        </view>

        <view class="menu-item" @click="goTarget">
          <view class="menu-left">
            <text class="menu-icon">馃幆</text>
            <text class="menu-label">瀛︿範鐩爣</text>
          </view>
          <text class="arrow">鈥?/text>
        </view>
      </view>

      <view class="menu-section">
        <view class="menu-item" @click="goFeedback">
          <view class="menu-left">
            <text class="menu-icon">馃挰</text>
            <text class="menu-label">鎰忚鍙嶉</text>
          </view>
          <text class="arrow">鈥?/text>
        </view>

        <view class="menu-item" @click="goAbout">
          <view class="menu-left">
            <text class="menu-icon">鈩癸笍</text>
            <text class="menu-label">鍏充簬鎴戜滑</text>
          </view>
          <text class="arrow">鈥?/text>
        </view>
      </view>

      <!-- 閫€鍑虹櫥褰?-->
      <button class="btn-logout" @click="handleLogout">閫€鍑虹櫥褰?/button>
    </scroll-view>

  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const wrongCount = ref(12)

function goWrongBook() {
  uni.navigateTo({ url: '/pages/wrong-book/index' })
}

function goFavorites() {
  uni.navigateTo({ url: '/pages/favorites/index' })
}

function goHistory() {
  uni.showToast({ title: '鍔熻兘寮€鍙戜腑', icon: 'none' })
}

function goTarget() {
  uni.showToast({ title: '鍔熻兘寮€鍙戜腑', icon: 'none' })
}

function goFeedback() {
  uni.showToast({ title: '鎰熻阿鍙嶉锛?, icon: 'none' })
}

function goAbout() {
  uni.showModal({
    title: '鍏充簬 PLC瀛﹀爞',
    content: '鐗堟湰 1.0.0\n\n浠庨浂寮€濮嬪PLC缂栫▼\n瑗块棬瀛?路 涓夎彵 路 娆у榫?路 缃楀厠闊﹀皵',
    showCancel: false
  })
}

function goSettings() {
  uni.showToast({ title: '璁剧疆椤甸潰寮€鍙戜腑', icon: 'none' })
}

function editProfile() {
  uni.showToast({ title: '缂栬緫璧勬枡寮€鍙戜腑', icon: 'none' })
}

async function handleLogout() {
  const res = await uni.showModal({
    title: '鎻愮ず',
    content: '纭畾瑕侀€€鍑虹櫥褰曞悧锛?
  })
  if (res.confirm) {
    await userStore.logout()
    uni.reLaunch({ url: '/pages/login/index' })
  }
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #f5f6f8; display: flex; flex-direction: column; }

.header {
  background: #fff;
  .status-bar { display: flex; justify-content: space-between; padding: 24rpx 40rpx 0; font-size: 24rpx; color: #1f2937; }
  .nav-bar { display: flex; align-items: center; justify-content: space-between; padding: 16rpx 32rpx 20rpx; }
  .nav-left { width: 64rpx; }
  .nav-title { font-size: 36rpx; font-weight: 700; color: #1f2937; }
  .nav-settings { font-size: 40rpx; }
}

.content { flex: 1; padding: 0 32rpx 180rpx; }

// 鐢ㄦ埛鍗＄墖
.profile-card {
  display: flex; align-items: center; gap: 20rpx;
  background: #fff; border-radius: 16rpx;
  padding: 32rpx; margin-top: 24rpx;
}

.avatar {
  width: 100rpx; height: 100rpx; border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 44rpx; font-weight: 700; flex-shrink: 0;
}

.profile-info { flex: 1; }
.profile-name { font-size: 34rpx; font-weight: 700; color: #1f2937; display: block; }
.profile-phone { font-size: 24rpx; color: #6b7280; margin-top: 4rpx; display: block; }
.edit-link { font-size: 24rpx; color: #2563eb; }

// 缁熻
.stats-card {
  display: flex; background: #fff; border-radius: 16rpx;
  margin-top: 16rpx; padding: 28rpx 0;
}

.stat-item {
  flex: 1; text-align: center;
  border-right: 1rpx solid #f3f4f6;
  &:last-child { border-right: none; }

  .stat-num { font-size: 40rpx; font-weight: 700; color: #1f2937; display: block; }
  .stat-label { font-size: 22rpx; color: #6b7280; margin-top: 4rpx; }
}

// 鑿滃崟
.menu-section {
  background: #fff; border-radius: 16rpx;
  margin-top: 20rpx; overflow: hidden;
}

.menu-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f3f4f6;
  &:last-child { border-bottom: none; }
}

.menu-left { display: flex; align-items: center; gap: 16rpx; }
.menu-icon { font-size: 36rpx; width: 48rpx; text-align: center; }
.menu-label { font-size: 30rpx; color: #374151; }
.menu-right { display: flex; align-items: center; gap: 12rpx; }

.badge {
  background: #dc2626; color: #fff;
  min-width: 36rpx; height: 36rpx; border-radius: 18rpx;
  font-size: 20rpx; display: flex; align-items: center; justify-content: center;
  padding: 0 8rpx;
}

.arrow { font-size: 36rpx; color: #d1d5db; }

// 閫€鍑虹櫥褰?.btn-logout {
  width: 100%; margin-top: 40rpx;
  padding: 24rpx; border: none; border-radius: 12rpx;
  background: #fff; color: #dc2626; font-size: 30rpx;
}
</style>
