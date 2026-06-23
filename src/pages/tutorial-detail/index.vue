<!-- 鏁欑▼璇︽儏椤?-->
<template>
  <view class="page">
    <!-- 瀵艰埅鏍?-->
    <view class="header">
      <view class="status-bar"><text>9:41</text><text>馃摱 馃攱</text></view>
      <view class="nav-bar">
        <text class="nav-back" @click="goBack">鈫?/text>
        <text class="nav-title text-ellipsis">{{ tutorial?.title || '鍔犺浇涓?..' }}</text>
        <text
          class="nav-fav"
          :class="{ favorited: isFavorited }"
          @click="toggleFavorite"
        >{{ isFavorited ? '鈽? : '鈽? }}</text>
      </view>
    </view>

    <!-- 鏂囩珷鍐呭 -->
    <scroll-view class="content" scroll-y>
      <!-- 鍏冧俊鎭?-->
      <view v-if="tutorial" class="meta-row">
        <text class="tag tag-primary">{{ tutorial.difficulty }}</text>
        <text v-if="tutorial.category" class="tag tag-success">{{ tutorial.category }}</text>
        <text class="meta-text">{{ tutorial.duration_min }}鍒嗛挓 路 {{ formatCount(tutorial.student_count) }}浜哄杩?/text>
      </view>

      <!-- 姝ｆ枃锛堢畝鏄?Markdown 娓叉煋锛?-->
      <view v-if="tutorial" class="article">
        <block v-for="(block, idx) in parsedContent" :key="idx">
          <text v-if="block.type === 'h2'" class="h2">{{ block.text }}</text>
          <text v-if="block.type === 'h3'" class="h3">{{ block.text }}</text>
          <text v-if="block.type === 'p'" class="paragraph">{{ block.text }}</text>
          <view v-if="block.type === 'code'" class="code-block">
            <text class="code-text">{{ block.text }}</text>
          </view>
          <text v-if="block.type === 'bullet'" class="bullet">鈥?{{ block.text }}</text>
          <text v-if="block.type === 'bold'" class="bold-text">{{ block.text }}</text>
        </block>
      </view>

      <view v-else class="loading-box">
        <text>鍔犺浇涓?..</text>
      </view>
    </scroll-view>

    <!-- 搴曢儴鎿嶄綔鏍?-->
    <view v-if="tutorial" class="bottom-bar safe-area-bottom">
      <button class="btn btn-outline" @click="toggleFavorite">
        {{ isFavorited ? '鈽?宸叉敹钘? : '鈽?鍔犲叆鏀惰棌' }}
      </button>
      <button class="btn btn-primary" :disabled="isCompleted" @click="markComplete">
        {{ isCompleted ? '鉁?宸插瀹? : '鏍囪宸插瀹? }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchTutorialDetail, markTutorialComplete, toggleFavorite as toggleFavApi } from '@/utils/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const tutorial = ref(null)
const isFavorited = ref(false)
const isCompleted = ref(false)
const parsedContent = ref([])


const props = defineProps({
  tutorialId: { type: Number, default: 0 }
})

async function loadTutorial(id) {
  if (!id) return
  tutorial.value = null
  try {
    tutorial.value = await fetchTutorialDetail(id)
    parseMarkdown(tutorial.value.content)
  } catch (e) {
    console.error('鍔犺浇鏁欑▼璇︽儏澶辫触:', e)
    uni.showToast({ title: '鍔犺浇澶辫触', icon: 'none' })
  }
}

onMounted(() => loadTutorial(props.tutorialId))
watch(() => props.tutorialId, loadTutorial)

// 绠€鏄?Markdown 瑙ｆ瀽鍣?function parseMarkdown(md) {
  if (!md) return
  const blocks = []
  const lines = md.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3) })
    } else if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4) })
    } else if (trimmed.startsWith('- ')) {
      blocks.push({ type: 'bullet', text: trimmed.slice(2) })
    } else if (trimmed.startsWith('```')) {
      blocks.push({ type: 'code', text: '' })
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      blocks.push({ type: 'bold', text: trimmed.slice(2, -2) })
    } else {
      blocks.push({ type: 'p', text: trimmed })
    }
  }
  parsedContent.value = blocks
}

async function toggleFavorite() {
  if (!userStore.user) return
  try {
    const result = await toggleFavApi(userStore.user.id, tutorial.value.id, isFavorited.value)
    isFavorited.value = result
    uni.showToast({ title: result ? '宸叉敹钘? : '宸插彇娑堟敹钘?, icon: 'none' })
  } catch (e) {
    console.error('鏀惰棌鎿嶄綔澶辫触:', e)
  }
}

async function markComplete() {
  if (!userStore.user) return
  try {
    await markTutorialComplete(userStore.user.id, tutorial.value.id)
    isCompleted.value = true
    userStore.updateStats({
      completedTutorials: (userStore.profile.completedTutorials || 0) + 1
    })
    uni.showToast({ title: '宸叉爣璁颁负瀛﹀畬 馃帀', icon: 'success' })
  } catch (e) {
    console.error('鏍囪瀹屾垚澶辫触:', e)
  }
}

function goBack() { uni.navigateBack() }

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1rpx solid #f3f4f6;

  .status-bar { display: flex; justify-content: space-between; padding: 24rpx 40rpx 0; font-size: 24rpx; color: #1f2937; }
  .nav-bar { display: flex; align-items: center; padding: 16rpx 32rpx 20rpx; gap: 16rpx; }
  .nav-back { font-size: 40rpx; color: #6b7280; width: 48rpx; }
  .nav-title { flex: 1; font-size: 30rpx; font-weight: 600; color: #1f2937; }
  .nav-fav { font-size: 40rpx; color: #d1d5db; }
  .nav-fav.favorited { color: #f59e0b; }
}

.content { flex: 1; padding: 0 32rpx 200rpx; }

.meta-row { display: flex; gap: 12rpx; align-items: center; padding: 24rpx 0; flex-wrap: wrap; }

.tag { padding: 4rpx 12rpx; border-radius: 100rpx; font-size: 20rpx; font-weight: 500; }
.tag-primary { background: #dbeafe; color: #2563eb; }
.tag-success { background: #dcfce7; color: #16a34a; }
.meta-text { font-size: 22rpx; color: #9ca3af; }

.article {
  padding-bottom: 40rpx;

  .h2 { font-size: 36rpx; font-weight: 700; color: #1f2937; display: block; margin: 40rpx 0 20rpx; }
  .h3 { font-size: 30rpx; font-weight: 600; color: #374151; display: block; margin: 28rpx 0 14rpx; }
  .paragraph { font-size: 30rpx; line-height: 1.8; color: #4b5563; display: block; margin-bottom: 20rpx; }
  .bullet { font-size: 30rpx; line-height: 1.8; color: #4b5563; display: block; padding-left: 20rpx; margin-bottom: 8rpx; }
  .bold-text { font-size: 30rpx; line-height: 1.8; color: #1f2937; font-weight: 600; display: block; margin-bottom: 20rpx; }
}

.code-block {
  background: #1e293b;
  padding: 24rpx;
  border-radius: 12rpx;
  margin: 16rpx 0;
  overflow-x: auto;

  .code-text {
    font-family: 'Courier New', monospace;
    font-size: 24rpx;
    color: #e2e8f0;
    line-height: 1.8;
    white-space: pre;
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1rpx solid #e5e7eb;
  padding: 20rpx 32rpx;
  display: flex;
  gap: 16rpx;
}

.btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 600;
}

.btn-outline { background: #fff; color: #2563eb; border: 2rpx solid #2563eb; }
.btn-primary { background: #2563eb; color: #fff; }
.btn-primary[disabled] { background: #d1d5db; }

.loading-box { text-align: center; padding: 200rpx 0; color: #9ca3af; }
</style>
