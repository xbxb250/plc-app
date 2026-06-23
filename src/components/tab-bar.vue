<!-- 搴曢儴瀵艰埅鏍忕粍浠?-->
<template>
  <view class="tab-bar safe-area-bottom">
    <view
      v-for="item in tabs"
      :key="item.key"
      class="tab-item"
      :class="{ active: current === item.key }"
      @click="switchTab(item.key)"
    >
      <text class="tab-icon">{{ item.icon }}</text>
      <text class="tab-label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  current: {
    type: String,
    default: 'index'
  }
})

const tabs = [
  { key: 'index', icon: '馃彔', label: '棣栭〉', path: '/pages/index/index' },
  { key: 'tutorial', icon: '馃摎', label: '鏁欑▼', path: '/pages/tutorial/index' },
  { key: 'quiz', icon: '馃摑', label: '缁冧範', path: '/pages/quiz/index' },
  { key: 'mine', icon: '馃懁', label: '鎴戠殑', path: '/pages/mine/index' }
]

function switchTab(key) {
  const tab = tabs.find(t => t.key === key)
  if (tab) {
    uni.switchTab({ url: tab.path })
  }
}
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #fff;
  border-top: 1rpx solid #e5e7eb;
  padding: 12rpx 0;
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  padding: 6rpx 0;
  color: #9ca3af;
  transition: color 0.2s;

  &.active { color: #2563eb; }

  .tab-icon { font-size: 44rpx; }
  .tab-label { font-size: 20rpx; }
}
</style>
