<template>
  <view class="app-root">
    <!-- 璇︽儏椤碉紙鏍堥《瑕嗙洊锛?-->
    <view v-if="nav.currentPage" class="page-layer">
      <TutorialDetail
        v-if="nav.currentPage.type === 'tutorial-detail'"
        :tutorialId="nav.currentPage.id"
        @back="nav.goBack()"
      />
      <QuizDo
        v-else-if="nav.currentPage.type === 'quiz-do'"
        @back="nav.goBack()"
      />
      <WrongBook
        v-else-if="nav.currentPage.type === 'wrong-book'"
        @back="nav.goBack()"
      />
      <Favorites
        v-else-if="nav.currentPage.type === 'favorites'"
        @back="nav.goBack()"
      />
    </view>

    <!-- 涓籘ab椤甸潰 -->
    <template v-else>
      <IndexPage v-show="nav.currentTab === 'index'" />
      <TutorialPage v-show="nav.currentTab === 'tutorial'" />
      <QuizPage v-show="nav.currentTab === 'quiz'" />
      <MinePage v-show="nav.currentTab === 'mine'" />
    </template>

    <!-- 搴曢儴瀵艰埅 -->
    <view v-if="!nav.currentPage" class="tab-bar safe-area-bottom">
      <view
        v-for="t in tabs"
        :key="t.key"
        class="tab-item"
        :class="{ active: nav.currentTab === t.key }"
        @click="nav.switchTab(t.key)"
      >
        <text class="tab-icon">{{ t.icon }}</text>
        <text class="tab-label">{{ t.label }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import IndexPage from '@/pages/index/index.vue'
import TutorialPage from '@/pages/tutorial/index.vue'
import QuizPage from '@/pages/quiz/index.vue'
import MinePage from '@/pages/mine/index.vue'
import TutorialDetail from '@/pages/tutorial-detail/index.vue'
import QuizDo from '@/pages/quiz-do/index.vue'
import WrongBook from '@/pages/wrong-book/index.vue'
import Favorites from '@/pages/favorites/index.vue'
import { navState, switchTab, goBack as navGoBack } from '@/stores/nav'
const nav = navState
nav.switchTab = switchTab
nav.goBack = navGoBack

const tabs = [
  { key: 'index', icon: '馃彔', label: '棣栭〉' },
  { key: 'tutorial', icon: '馃摎', label: '鏁欑▼' },
  { key: 'quiz', icon: '馃摑', label: '缁冧範' },
  { key: 'mine', icon: '馃懁', label: '鎴戠殑' }
]

export default {
  components: { IndexPage, TutorialPage, QuizPage, MinePage, TutorialDetail, QuizDo, WrongBook, Favorites },
  data() {
    return { nav, tabs }
  }
}
</script>

<style lang="scss">
@import '@/uni.scss';

page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  color: #1f2937;
  background-color: #f5f6f8;
  -webkit-font-smoothing: antialiased;
}

.app-root { min-height: 100vh; display: flex; flex-direction: column; }

.page-layer {
  position: fixed; inset: 0; z-index: 50;
  background: #f5f6f8; overflow-y: auto;
}

.tab-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; background: #fff;
  border-top: 1px solid #e5e7eb; z-index: 100;
}

.tab-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; padding: 12rpx 0; color: #9ca3af; cursor: pointer;
}

.tab-item.active { color: #2563eb; }
.tab-icon { font-size: 44rpx; }
.tab-label { font-size: 20rpx; margin-top: 4rpx; }

.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
