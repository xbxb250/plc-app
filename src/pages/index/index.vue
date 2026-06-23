<!-- 棣栭〉 -->
<template>
  <view class="page">
    <!-- 鐘舵€佹爮 + 瀵艰埅 -->
    <view class="header">
      <view class="status-bar">
        <text>9:41</text>
        <text>馃摱 馃攱</text>
      </view>
      <view class="nav-bar">
        <view class="nav-left" />
        <text class="nav-title">PLC瀛﹀爞</text>
        <text class="nav-notify">馃敂</text>
      </view>
    </view>

    <!-- 鍐呭鍖?-->
    <scroll-view class="content" scroll-y enable-back-to-top>
      <!-- 闂€?-->
      <view class="greeting">
        <text class="greeting-text">{{ greetingText }}锛寋{ userStore.displayName }} 馃憢</text>
        <text class="greeting-sub">浠婂ぉ鏄綘鍦≒LC瀛﹀爞鐨勭 {{ userStore.profile.learnDays || 1 }} 澶╋紝缁х画鍔犳补锛?/text>
      </view>

      <!-- 瀛︿範缁熻鍗＄墖 -->
      <view class="stats-row">
        <view class="stat-card">
          <text class="stat-num">{{ userStore.profile.completedTutorials || 0 }}</text>
          <text class="stat-label">宸插鏁欑▼</text>
        </view>
        <view class="stat-card">
          <text class="stat-num">{{ userStore.profile.totalQuestions || 0 }}</text>
          <text class="stat-label">鍋氶鎬绘暟</text>
        </view>
        <view class="stat-card">
          <text class="stat-num">{{ userStore.profile.correctRate || 0 }}%</text>
          <text class="stat-label">姝ｇ‘鐜?/text>
        </view>
      </view>

      <!-- 缁х画瀛︿範 -->
      <view v-if="continueLearning" class="continue-card" @click="goToTutorial(continueLearning.id)">
        <text class="continue-label">馃摉 缁х画瀛︿範</text>
        <text class="continue-title">{{ continueLearning.title }}</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: continueLearning.progress + '%' }" />
        </view>
        <text class="continue-meta">宸插涔?{{ continueLearning.progress }}% 路 缁х画闃呰 鈫?/text>
      </view>

      <!-- 鎺ㄨ崘鏁欑▼ -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">馃摎 鎺ㄨ崘鏁欑▼</text>
          <text class="section-more" @click="goToTutorialList">鏌ョ湅鍏ㄩ儴 鈫?/text>
        </view>

        <view
          v-for="item in tutorials"
          :key="item.id"
          class="tutorial-item"
          @click="goToTutorial(item.id)"
        >
          <view class="tutorial-cover">{{ item.cover_icon || '馃搫' }}</view>
          <view class="tutorial-info">
            <text class="tutorial-title">{{ item.title }}</text>
            <view class="tutorial-meta">
              <text class="tag tag-primary">{{ item.difficulty }}</text>
              <text class="meta-text">{{ item.duration_min }}鍒嗛挓 路 {{ formatCount(item.student_count) }}浜哄杩?/text>
            </view>
          </view>
        </view>
      </view>

      <!-- 姣忔棩涓€棰?-->
      <view class="daily-question" @click="goToDailyQuestion">
        <text class="dq-label">馃挕 姣忔棩涓€棰?/text>
        <text class="dq-text">{{ dailyQuestion?.question || '鍔犺浇涓?..' }}</text>
        <text class="dq-action">鐐瑰嚮绛旈 鈫?/text>
      </view>
    </scroll-view>

  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { fetchTutorials } from '@/utils/api'
import { navigateTo, switchTab } from '@/stores/nav'

const userStore = useUserStore()
const tutorials = ref([])
const dailyQuestion = ref(null)
const continueLearning = ref(null)

// 闂€欒
const greetingText = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '鏃╀笂濂?
  if (hour < 18) return '涓嬪崍濂?
  return '鏅氫笂濂?
})

onMounted(async () => {
  try {
    const { data } = await fetchTutorials({ pageSize: 5 })
    tutorials.value = data
    // 姣忔棩涓€棰樺彇绗竴涓綔涓烘紨绀?    dailyQuestion.value = data[0]
  } catch (e) {
    console.error('鍔犺浇棣栭〉鏁版嵁澶辫触:', e)
  }

  // 妯℃嫙缁х画瀛︿範
  continueLearning.value = {
    id: 1,
    title: 'PLC鍩虹鐭ヨ瘑 鈥?绗?鑺傦細杈撳叆杈撳嚭妯″潡',
    progress: 60
  }
})

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n
}

function goToTutorial(id) {
  navigateTo({ type: 'tutorial-detail', id })
}

function goToTutorialList() {
  switchTab('tutorial')
}

function goToDailyQuestion() {
  switchTab('quiz')
}
</script>

<style lang="scss" scoped>
@import '@/uni.scss';

.page {
  min-height: 100vh;
  background: #f5f6f8;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;

  .status-bar {
    display: flex;
    justify-content: space-between;
    padding: 24rpx 40rpx 0;
    font-size: 24rpx;
    color: #1f2937;
  }

  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 32rpx 20rpx;

    .nav-left { width: 64rpx; }
    .nav-title { font-size: 36rpx; font-weight: 700; color: #1f2937; }
    .nav-notify { font-size: 40rpx; }
  }
}

.content {
  flex: 1;
  padding: 0 32rpx 180rpx;
}

.greeting {
  padding: 24rpx 0;

  .greeting-text { font-size: 40rpx; font-weight: 700; color: #1f2937; display: block; }
  .greeting-sub { font-size: 26rpx; color: #6b7280; margin-top: 6rpx; display: block; }
}

// 缁熻鍗＄墖
.stats-row { display: flex; gap: 16rpx; margin: 20rpx 0; }

.stat-card {
  flex: 1;
  background: #dbeafe;
  border-radius: 16rpx;
  padding: 24rpx;
  text-align: center;

  .stat-num { font-size: 44rpx; font-weight: 700; color: #2563eb; display: block; }
  .stat-label { font-size: 22rpx; color: #6b7280; margin-top: 4rpx; }
}

// 缁х画瀛︿範
.continue-card {
  background: #eff6ff;
  border: 2rpx solid #bfdbfe;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 10rpx;

  .continue-label { font-size: 22rpx; color: #2563eb; font-weight: 600; display: block; margin-bottom: 4rpx; }
  .continue-title { font-size: 28rpx; font-weight: 600; color: #1e3a5f; display: block; }
  .continue-meta { font-size: 22rpx; color: #6b7280; margin-top: 6rpx; }

  .progress-bar {
    height: 8rpx;
    background: #d1d5db;
    border-radius: 4rpx;
    margin-top: 12rpx;
    overflow: hidden;
  }
  .progress-fill { height: 100%; background: #2563eb; border-radius: 4rpx; transition: width .3s; }
}

// 鏁欑▼鎺ㄨ崘
.section { margin-top: 32rpx; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;

  .section-title { font-size: 32rpx; font-weight: 700; color: #1f2937; }
  .section-more { font-size: 26rpx; color: #2563eb; }
}

.tutorial-item {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f3f4f6;
  align-items: flex-start;

  .tutorial-cover {
    width: 120rpx;
    height: 80rpx;
    border-radius: 12rpx;
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44rpx;
    flex-shrink: 0;
  }

  .tutorial-info { flex: 1; }

  .tutorial-title { font-size: 28rpx; font-weight: 600; color: #1f2937; display: block; }

  .tutorial-meta { display: flex; align-items: center; gap: 10rpx; margin-top: 6rpx; }
}

.tag {
  padding: 4rpx 12rpx;
  border-radius: 100rpx;
  font-size: 20rpx;
  font-weight: 500;
}

.tag-primary { background: #dbeafe; color: #2563eb; }

.meta-text { font-size: 22rpx; color: #9ca3af; }

// 姣忔棩涓€棰?.daily-question {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 16rpx;
  padding: 28rpx;
  margin: 32rpx 0;

  .dq-label { font-size: 22rpx; color: #92400e; display: block; margin-bottom: 6rpx; }
  .dq-text { font-size: 28rpx; font-weight: 600; color: #78350f; display: block; line-height: 1.6; }
  .dq-action { font-size: 24rpx; color: #92400e; margin-top: 10rpx; display: block; }
}
</style>
