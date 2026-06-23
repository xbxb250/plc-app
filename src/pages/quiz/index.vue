<!-- 棰樺簱棣栭〉 -->
<template>
  <view class="page">
    <view class="header">
      <view class="status-bar"><text>9:41</text><text>馃摱 馃攱</text></view>
      <view class="nav-bar">
        <view class="nav-left" />
        <text class="nav-title">缁冧範涓績</text>
        <view class="nav-right" />
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <!-- 蹇嵎鍏ュ彛 -->
      <view class="quick-row">
        <view class="quick-card wrong" @click="goWrongBook">
          <text class="qc-icon">馃摑</text>
          <text class="qc-title">閿欓鏈?/text>
          <text class="qc-badge" v-if="wrongCount > 0">{{ wrongCount }} 棰樺緟澶嶄範</text>
        </view>
        <view class="quick-card daily" @click="startDaily">
          <text class="qc-icon">馃幆</text>
          <text class="qc-title">姣忔棩涓€棰?/text>
          <text class="qc-sub">浠婃棩鏈瓟</text>
        </view>
      </view>

      <!-- 鍒嗙被閫夋嫨 -->
      <text class="section-label">閫夋嫨鍒嗙被</text>
      <scroll-view class="cat-row" scroll-x :show-scrollbar="false">
        <view
          v-for="cat in categories"
          :key="cat"
          class="cat-chip"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >{{ cat }}</view>
      </scroll-view>

      <!-- 闅惧害閫夋嫨 -->
      <text class="section-label">閫夋嫨闅惧害</text>
      <view class="difficulty-row">
        <view
          v-for="d in difficulties"
          :key="d.key"
          class="diff-card"
          :class="[d.key, { selected: selectedDifficulty === d.key }]"
          @click="selectedDifficulty = d.key"
        >
          <text class="diff-icon">{{ d.icon }}</text>
          <text class="diff-label">{{ d.label }}</text>
          <text class="diff-count">{{ d.count }} 棰?/text>
        </view>
      </view>

      <!-- 寮€濮嬫寜閽?-->
      <button class="btn-start" @click="startQuiz">
        馃殌 寮€濮嬬粌涔?({{ questionCount }}棰?
      </button>
    </scroll-view>

  </view>
</template>

<script setup>
import { ref } from 'vue'

const categories = ['鍏ㄩ儴', '瑗块棬瀛?, '涓夎彵', '鐢靛伐鍩虹', '姊舰鍥?]
const selectedCategory = ref('鍏ㄩ儴')
const selectedDifficulty = ref('鍏ラ棬')
const wrongCount = ref(12)

const difficulties = [
  { key: '鍏ラ棬', icon: '馃尡', label: '鍏ラ棬', count: 86 },
  { key: '杩涢樁', icon: '馃尶', label: '杩涢樁', count: 52 },
  { key: '楂樼骇', icon: '馃尦', label: '楂樼骇', count: 24 }
]

const questionCount = ref(86)

function startQuiz() {
  uni.navigateTo({
    url: `/pages/quiz-do/index?category=${selectedCategory.value}&difficulty=${selectedDifficulty.value}`
  })
}

function startDaily() {
  uni.navigateTo({ url: '/pages/quiz-do/index?mode=daily' })
}

function goWrongBook() {
  uni.navigateTo({ url: '/pages/wrong-book/index' })
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #f5f6f8; display: flex; flex-direction: column; }

.header {
  background: #fff;
  .status-bar { display: flex; justify-content: space-between; padding: 24rpx 40rpx 0; font-size: 24rpx; color: #1f2937; }
  .nav-bar { display: flex; align-items: center; justify-content: space-between; padding: 16rpx 32rpx 20rpx; }
  .nav-left, .nav-right { width: 64rpx; }
  .nav-title { font-size: 36rpx; font-weight: 700; color: #1f2937; }
}

.content { flex: 1; padding: 0 32rpx 180rpx; }

// 蹇嵎鍏ュ彛
.quick-row { display: flex; gap: 16rpx; margin-top: 24rpx; }

.quick-card {
  flex: 1; border-radius: 16rpx; padding: 28rpx; text-align: center;
  &.wrong { background: #fef2f2; }
  &.daily { background: #eff6ff; }

  .qc-icon { font-size: 56rpx; display: block; }
  .qc-title { font-size: 28rpx; font-weight: 600; color: #374151; display: block; margin-top: 8rpx; }
  .qc-badge { font-size: 22rpx; color: #dc2626; margin-top: 4rpx; display: block; }
  .qc-sub { font-size: 22rpx; color: #2563eb; margin-top: 4rpx; display: block; }
}

.section-label { font-size: 30rpx; font-weight: 600; color: #1f2937; display: block; margin: 32rpx 0 16rpx; }

// 鍒嗙被
.cat-row { display: flex; gap: 16rpx; white-space: nowrap; }
.cat-chip {
  padding: 12rpx 28rpx; border-radius: 100rpx;
  font-size: 26rpx; color: #6b7280; background: #fff;
  border: 2rpx solid #e5e7eb; transition: all .2s;
  &.active { background: #2563eb; color: #fff; border-color: #2563eb; }
}

// 闅惧害
.difficulty-row { display: flex; gap: 16rpx; }

.diff-card {
  flex: 1; padding: 28rpx 16rpx; border-radius: 16rpx;
  text-align: center; border: 3rpx solid transparent; transition: all .2s;
  .diff-icon { font-size: 52rpx; display: block; }
  .diff-label { font-size: 28rpx; font-weight: 600; display: block; margin-top: 8rpx; }
  .diff-count { font-size: 22rpx; color: #6b7280; margin-top: 4rpx; display: block; }

  &.鍏ラ棬 { background: #dcfce7; }
  &.杩涢樁 { background: #fef3c7; }
  &.楂樼骇 { background: #fee2e2; }
  &.selected { border-color: #2563eb; transform: scale(1.02); }
}

.btn-start {
  width: 100%; margin-top: 48rpx; padding: 28rpx;
  background: #2563eb; color: #fff; border: none;
  border-radius: 16rpx; font-size: 32rpx; font-weight: 600;
}
</style>
