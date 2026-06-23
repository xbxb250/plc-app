<!-- 閿欓鏈?-->
<template>
  <view class="page">
    <view class="header">
      <view class="status-bar"><text>9:41</text><text>馃摱 馃攱</text></view>
      <view class="nav-bar">
        <text class="nav-back" @click="goBack">鈫?/text>
        <text class="nav-title">閿欓鏈?/text>
        <text v-if="wrongList.length > 0" class="nav-action" @click="redoAll">閲嶅仛鍏ㄩ儴</text>
      </view>
    </view>

    <scroll-view class="content" scroll-y v-if="wrongList.length > 0">
      <text class="count-text">鍏?{{ wrongList.length }} 閬撻敊棰?/text>

      <view
        v-for="item in wrongList"
        :key="item.id"
        class="wrong-item"
        @click="redoOne(item)"
      >
        <text class="q-title">{{ item.question || item.questions?.question }}</text>
        <view class="q-meta">
          <text class="meta-badge wrong-badge">鉁?绛旈敊</text>
          <text class="meta-date">馃搮 {{ formatDate(item.answered_at) }}</text>
          <text class="redo-link">鍐嶅仛涓€娆?鈫?/text>
        </view>
      </view>
    </scroll-view>

    <!-- 绌虹姸鎬?-->
    <view v-else class="empty-state">
      <text class="empty-icon">馃帀</text>
      <text class="empty-title">杩樻病鏈夐敊棰?/text>
      <text class="empty-sub">缁х画淇濇寔锛屼綘鏄渶妫掔殑锛?/text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchWrongQuestions } from '@/utils/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const wrongList = ref([])

onMounted(async () => {
  if (userStore.user) {
    try {
      wrongList.value = await fetchWrongQuestions(userStore.user.id)
    } catch (e) {
      console.error('鍔犺浇閿欓澶辫触:', e)
      // 闄嶇骇锛氭ā鎷熸暟鎹?      wrongList.value = [
        { id: 1, question: 'PLC鐨勬壂鎻忓懆鏈熶笉鍖呮嫭浠ヤ笅鍝釜闃舵锛?, answered_at: '2025-06-10T08:00:00Z' },
        { id: 2, question: '浠ヤ笅鍝釜涓嶆槸PLC鐨勮緭鍏ヨ澶囷紵', answered_at: '2025-06-09T14:30:00Z' },
        { id: 3, question: '瑗块棬瀛怱7-1200鐨勭紪绋嬭蒋浠舵槸浠€涔堬紵', answered_at: '2025-06-08T10:15:00Z' }
      ]
    }
  } else {
    // 鏈櫥褰曟椂妯℃嫙
    wrongList.value = [
      { id: 1, question: 'PLC鐨勬壂鎻忓懆鏈熶笉鍖呮嫭浠ヤ笅鍝釜闃舵锛?, answered_at: '2025-06-10T08:00:00Z' },
      { id: 2, question: '浠ヤ笅鍝釜涓嶆槸PLC鐨勮緭鍏ヨ澶囷紵', answered_at: '2025-06-09T14:30:00Z' }
    ]
  }
})

function redoOne(item) {
  uni.navigateTo({ url: `/pages/quiz-do/index?mode=redo&qid=${item.id}` })
}

function redoAll() {
  uni.navigateTo({ url: '/pages/quiz-do/index?mode=redoAll' })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}鏈?{d.getDate()}鏃
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
  .nav-action { font-size: 26rpx; color: #2563eb; }
}

.content { flex: 1; padding: 24rpx 32rpx; }

.count-text { font-size: 26rpx; color: #6b7280; display: block; margin-bottom: 16rpx; }

.wrong-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border: 1rpx solid #fed7aa;

  .q-title { font-size: 28rpx; font-weight: 600; color: #1f2937; display: block; margin-bottom: 12rpx; line-height: 1.6; }
  .q-meta { display: flex; align-items: center; gap: 16rpx; }
}

.meta-badge { font-size: 22rpx; padding: 4rpx 12rpx; border-radius: 100rpx; }
.wrong-badge { background: #fee2e2; color: #dc2626; }
.meta-date { font-size: 22rpx; color: #9ca3af; }
.redo-link { font-size: 24rpx; color: #2563eb; margin-left: auto; }

.empty-state {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 200rpx 40rpx; text-align: center;
  .empty-icon { font-size: 100rpx; margin-bottom: 20rpx; }
  .empty-title { font-size: 32rpx; font-weight: 600; color: #6b7280; }
  .empty-sub { font-size: 26rpx; color: #9ca3af; margin-top: 8rpx; }
}
</style>
