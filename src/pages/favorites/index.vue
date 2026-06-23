<!-- 鏀惰棌椤?-->
<template>
  <view class="page">
    <view class="header">
      <view class="status-bar"><text>9:41</text><text>馃摱 馃攱</text></view>
      <view class="nav-bar">
        <text class="nav-back" @click="goBack">鈫?/text>
        <text class="nav-title">鎴戠殑鏀惰棌</text>
        <view class="nav-placeholder" />
      </view>
    </view>

    <scroll-view class="content" scroll-y v-if="favorites.length > 0">
      <text class="count-text">鍏?{{ favorites.length }} 绡囨暀绋?/text>

      <view
        v-for="item in favorites"
        :key="item.tutorial_id"
        class="tutorial-item"
        @click="goDetail(item.tutorial_id)"
      >
        <view class="cover">{{ item.tutorials?.cover_icon || '馃搫' }}</view>
        <view class="info">
          <text class="title">{{ item.tutorials?.title || '鏈煡鏁欑▼' }}</text>
          <view class="meta">
            <text class="tag tag-primary">{{ item.tutorials?.difficulty || '鍏ラ棬' }}</text>
            <text class="meta-text">{{ item.tutorials?.duration_min || 0 }}鍒嗛挓</text>
          </view>
        </view>
        <text class="fav-icon">鈽?/text>
      </view>
    </scroll-view>

    <!-- 绌虹姸鎬?-->
    <view v-else class="empty-state">
      <text class="empty-icon">猸?/text>
      <text class="empty-title">杩樻病鏈夋敹钘?/text>
      <text class="empty-sub">娴忚鏁欑▼鏃剁偣鍑?鈽?鍗冲彲鏀惰棌</text>
      <button class="btn-browse" @click="goBrowse">鍘绘祻瑙堟暀绋?鈫?/button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchFavorites } from '@/utils/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const favorites = ref([])

onMounted(async () => {
  if (userStore.user) {
    try {
      favorites.value = await fetchFavorites(userStore.user.id)
    } catch (e) {
      console.error('鍔犺浇鏀惰棌澶辫触:', e)
    }
  }
})

function goDetail(id) {
  uni.navigateTo({ url: `/pages/tutorial-detail/index?id=${id}` })
}

function goBrowse() {
  uni.switchTab({ url: '/pages/tutorial/index' })
}

function goBack() { uni.navigateBack() }
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #f5f6f8; display: flex; flex-direction: column; }

.header {
  background: #fff;
  .status-bar { display: flex; justify-content: space-between; padding: 24rpx 40rpx 0; font-size: 24rpx; color: #1f2937; }
  .nav-bar { display: flex; align-items: center; padding: 16rpx 32rpx 20rpx; }
  .nav-back { font-size: 40rpx; color: #6b7280; width: 48rpx; }
  .nav-title { flex: 1; font-size: 34rpx; font-weight: 700; color: #1f2937; }
  .nav-placeholder { width: 48rpx; }
}

.content { flex: 1; padding: 24rpx 32rpx; }

.count-text { font-size: 26rpx; color: #6b7280; display: block; margin-bottom: 16rpx; }

.tutorial-item { display: flex; gap: 20rpx; padding: 24rpx; background: #fff; border-radius: 16rpx; margin-bottom: 16rpx; align-items: flex-start; }

.cover {
  width: 120rpx; height: 80rpx; border-radius: 12rpx;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  display: flex; align-items: center; justify-content: center;
  font-size: 44rpx; flex-shrink: 0;
}

.info { flex: 1; }
.title { font-size: 28rpx; font-weight: 600; color: #1f2937; display: block; }
.meta { display: flex; align-items: center; gap: 10rpx; margin-top: 8rpx; }

.tag { padding: 4rpx 12rpx; border-radius: 100rpx; font-size: 20rpx; font-weight: 500; }
.tag-primary { background: #dbeafe; color: #2563eb; }
.meta-text { font-size: 22rpx; color: #9ca3af; }

.fav-icon { font-size: 40rpx; color: #f59e0b; line-height: 80rpx; }

.empty-state {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 200rpx 40rpx; text-align: center;
  .empty-icon { font-size: 100rpx; margin-bottom: 20rpx; }
  .empty-title { font-size: 32rpx; font-weight: 600; color: #6b7280; }
  .empty-sub { font-size: 26rpx; color: #9ca3af; margin-top: 8rpx; }
}

.btn-browse {
  margin-top: 32rpx; padding: 20rpx 48rpx;
  background: #2563eb; color: #fff; border: none;
  border-radius: 100rpx; font-size: 28rpx;
}
</style>
