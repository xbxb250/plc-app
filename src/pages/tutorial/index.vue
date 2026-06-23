<!-- 鏁欑▼鍒楄〃椤?-->
<template>
  <view class="page">
    <view class="header">
      <view class="status-bar"><text>9:41</text><text>馃摱 馃攱</text></view>
      <view class="nav-bar">
        <view class="nav-left" />
        <text class="nav-title">鏁欑▼涓績</text>
        <view class="nav-right" />
      </view>
    </view>

    <!-- 鎼滅储鏍?-->
    <view class="search-box">
      <text class="search-icon">馃攳</text>
      <input
        v-model="keyword"
        class="search-input"
        placeholder="鎼滅储鏁欑▼..."
        @confirm="onSearch"
      />
      <text v-if="keyword" class="search-clear" @click="keyword = ''; onSearch()">鉁?/text>
    </view>

    <!-- 鍒嗙被 Tab -->
    <scroll-view class="category-tabs" scroll-x :show-scrollbar="false">
      <view
        v-for="cat in categories"
        :key="cat"
        class="cat-tab"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat; loadTutorials()"
      >
        {{ cat }}
      </view>
    </scroll-view>

    <!-- 鏁欑▼鍒楄〃 -->
    <scroll-view class="content" scroll-y @scrolltolower="loadMore">
      <view
        v-for="item in tutorials"
        :key="item.id"
        class="tutorial-item"
        @click="goDetail(item.id)"
      >
        <view class="cover">{{ item.cover_icon || '馃搫' }}</view>
        <view class="info">
          <text class="title">{{ item.title }}</text>
          <view class="meta">
            <text class="tag tag-primary">{{ item.difficulty }}</text>
            <text class="meta-text">{{ item.duration_min }}鍒嗛挓 路 {{ formatCount(item.student_count) }}浜哄杩?/text>
          </view>
        </view>
        <text class="fav-icon" :class="{ favorited: isFav(item.id) }" @click.stop="toggleFav(item)">
          {{ isFav(item.id) ? '鈽? : '鈽? }}
        </text>
      </view>

      <view v-if="loading" class="loading">鍔犺浇涓?..</view>
      <view v-if="!hasMore" class="no-more">鈥?宸叉樉绀哄叏閮ㄦ暀绋?鈥?/view>
      <view v-if="tutorials.length === 0 && !loading" class="empty">
        <text class="empty-icon">馃摥</text>
        <text>鏆傛棤鐩稿叧鏁欑▼</text>
      </view>
    </scroll-view>

  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchTutorials } from '@/utils/api'

const keyword = ref('')
const activeCategory = ref('鍏ㄩ儴')
const tutorials = ref([])
const page = ref(1)
const hasMore = ref(true)
const loading = ref(false)
const favIds = ref(new Set())

const categories = ['鍏ㄩ儴', '瑗块棬瀛?, '涓夎彵', '娆у榫?, '鐢靛伐鍩虹', '姊舰鍥?]

onMounted(() => { loadTutorials() })

async function loadTutorials() {
  page.value = 1
  loading.value = true
  try {
    const category = activeCategory.value === '鍏ㄩ儴' ? null : activeCategory.value
    const { data, total } = await fetchTutorials({
      category,
      keyword: keyword.value || null,
      page: 1
    })
    tutorials.value = data
    hasMore.value = page.value * 20 < total
  } catch (e) {
    console.error('鍔犺浇鏁欑▼澶辫触:', e)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (!hasMore.value || loading.value) return
  loading.value = true
  page.value++
  try {
    const category = activeCategory.value === '鍏ㄩ儴' ? null : activeCategory.value
    const { data, total } = await fetchTutorials({
      category,
      keyword: keyword.value || null,
      page: page.value
    })
    tutorials.value.push(...data)
    hasMore.value = page.value * 20 < total
  } catch (e) {
    console.error('鍔犺浇鏇村澶辫触:', e)
  } finally {
    loading.value = false
  }
}

function onSearch() { loadTutorials() }

function goDetail(id) {
  uni.navigateTo({ url: `/pages/tutorial-detail/index?id=${id}` })
}

function isFav(id) { return favIds.value.has(id) }

function toggleFav(item) {
  if (isFav(item.id)) {
    favIds.value.delete(item.id)
  } else {
    favIds.value.add(item.id)
  }
  // TODO: 鍚屾鍒板悗绔?}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f5f6f8;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  .status-bar { display: flex; justify-content: space-between; padding: 24rpx 40rpx 0; font-size: 24rpx; color: #1f2937; }
  .nav-bar { display: flex; align-items: center; justify-content: space-between; padding: 16rpx 32rpx 20rpx; }
  .nav-left, .nav-right { width: 64rpx; }
  .nav-title { font-size: 36rpx; font-weight: 700; color: #1f2937; }
}

.search-box {
  display: flex; align-items: center; gap: 12rpx;
  margin: 0 32rpx 16rpx; padding: 18rpx 24rpx;
  background: #f3f4f6; border-radius: 16rpx;
  .search-icon { font-size: 32rpx; }
  .search-input { flex: 1; border: none; background: transparent; font-size: 28rpx; outline: none; }
  .search-clear { font-size: 28rpx; color: #9ca3af; padding: 4rpx; }
}

.category-tabs {
  display: flex; gap: 16rpx;
  padding: 0 32rpx 16rpx;
  white-space: nowrap;
}

.cat-tab {
  padding: 12rpx 28rpx;
  border-radius: 100rpx;
  font-size: 26rpx;
  color: #6b7280;
  background: #fff;
  border: 2rpx solid #e5e7eb;
  transition: all .2s;

  &.active { background: #2563eb; color: #fff; border-color: #2563eb; }
}

.content { flex: 1; padding: 0 32rpx 180rpx; }

.tutorial-item {
  display: flex; gap: 20rpx; padding: 24rpx 0;
  border-bottom: 1rpx solid #f3f4f6; align-items: flex-start;

  .cover {
    width: 120rpx; height: 80rpx; border-radius: 12rpx;
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    display: flex; align-items: center; justify-content: center;
    font-size: 44rpx; flex-shrink: 0;
  }

  .info { flex: 1; }
  .title { font-size: 28rpx; font-weight: 600; color: #1f2937; display: block; }
  .meta { display: flex; align-items: center; gap: 10rpx; margin-top: 8rpx; }

  .fav-icon { font-size: 40rpx; color: #d1d5db; line-height: 80rpx; padding: 0 8rpx; }
  .fav-icon.favorited { color: #f59e0b; }
}

.tag { padding: 4rpx 12rpx; border-radius: 100rpx; font-size: 20rpx; font-weight: 500; }
.tag-primary { background: #dbeafe; color: #2563eb; }
.meta-text { font-size: 22rpx; color: #9ca3af; }

.loading, .no-more, .empty { text-align: center; padding: 40rpx; color: #9ca3af; font-size: 26rpx; }
.empty-icon { font-size: 80rpx; display: block; margin-bottom: 16rpx; }
</style>
