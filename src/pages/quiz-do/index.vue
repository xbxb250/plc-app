<!-- 绛旈椤?-->
<template>
  <view class="page">
    <!-- 瀵艰埅鏍?-->
    <view class="header">
      <view class="status-bar"><text>9:41</text><text>馃摱 馃攱</text></view>
      <view class="nav-bar">
        <text class="nav-back" @click="confirmExit">鈫?/text>
        <text class="nav-title">PLC鍩虹缁冧範</text>
        <view class="nav-placeholder" />
      </view>
    </view>

    <view class="content">
      <!-- 杩涘害淇℃伅 -->
      <view class="quiz-info">
        <text class="progress-text">绗?{{ currentIndex + 1 }} / {{ questions.length }} 棰?/text>
        <text class="timer">鈴?涓嶉檺鏃?/text>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }" />
      </view>

      <!-- 棰樼洰 -->
      <view class="question-card" v-if="currentQuestion">
        <text class="question-text">{{ currentQuestion.question }}</text>

        <view
          v-for="(opt, idx) in currentQuestion.options"
          :key="idx"
          class="option-item"
          :class="{
            selected: selectedOption === idx,
            correct: showResult && idx === currentQuestion.answer,
            wrong: showResult && selectedOption === idx && idx !== currentQuestion.answer
          }"
          @click="selectOption(idx)"
        >
          <view class="option-letter" :class="{ active: selectedOption === idx }">
            {{ optionLetters[idx] }}
          </view>
          <text class="option-text">{{ opt }}</text>
          <text v-if="showResult && idx === currentQuestion.answer" class="option-mark correct-mark">鉁?/text>
          <text v-if="showResult && selectedOption === idx && idx !== currentQuestion.answer" class="option-mark wrong-mark">鉁?/text>
        </view>
      </view>

      <!-- 瑙ｆ瀽鍖哄煙锛堟彁浜ゅ悗鏄剧ず锛?-->
      <view v-if="showResult" class="explanation-box">
        <text class="exp-title">{{ isCorrect ? '鉁?鍥炵瓟姝ｇ‘锛? : '鉂?鍥炵瓟閿欒' }}</text>
        <text class="exp-text">{{ currentQuestion.explanation }}</text>
      </view>
    </view>

    <!-- 搴曢儴鎸夐挳 -->
    <view class="bottom-bar safe-area-bottom">
      <button v-if="!showResult" class="btn btn-ghost" @click="skipQuestion">璺宠繃</button>
      <button v-if="!showResult" class="btn btn-primary" :disabled="selectedOption === null" @click="submitAnswer">
        鎻愪氦绛旀
      </button>

      <template v-else>
        <button class="btn btn-ghost" @click="addToWrongBook" v-if="!isCorrect">
          馃摑 鍔犲叆閿欓鏈?        </button>
        <button class="btn btn-primary" @click="nextQuestion">
          {{ currentIndex < questions.length - 1 ? '涓嬩竴棰?鈫? : '瀹屾垚缁冧範 馃帀' }}
        </button>
      </template>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchQuestions, submitAnswer as submitAnswerApi } from '@/utils/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const questions = ref([])
const currentIndex = ref(0)
const selectedOption = ref(null)
const showResult = ref(false)
const isCorrect = ref(false)
const wrongQuestions = ref([])

const optionLetters = ['A', 'B', 'C', 'D']

const currentQuestion = computed(() => questions.value[currentIndex.value] || null)

onMounted(async () => {
  try {
    const { data } = await fetchQuestions({ pageSize: 10 })
    if (data && data.length > 0) {
      questions.value = data
    } else {
      questions.value = getSeedQuestions()
    }
  } catch (e) {
    console.error('鍔犺浇棰樼洰澶辫触:', e)
    questions.value = getSeedQuestions()
  }
})

function getSeedQuestions() {
  return [
    { id: 1, question: 'PLC鐨勬壂鎻忓懆鏈熶笉鍖呮嫭浠ヤ笅鍝釜闃舵锛?, options: ['杈撳叆閲囨牱闃舵', '绋嬪簭鎵ц闃舵', '杈撳嚭鍒锋柊闃舵', '鏁版嵁澶囦唤闃舵'], answer: 3, explanation: 'PLC鐨勬壂鎻忓懆鏈熷寘鍚笁涓樁娈碉細杈撳叆閲囨牱 鈫?绋嬪簭鎵ц 鈫?杈撳嚭鍒锋柊銆?鏁版嵁澶囦唤"涓嶅睘浜庢壂鎻忓懆鏈熺殑涓€閮ㄥ垎銆? },
    { id: 2, question: '浠ヤ笅鍝釜涓嶆槸PLC鐨勮緭鍏ヨ澶囷紵', options: ['鎸夐挳寮€鍏?, '琛岀▼寮€鍏?, '鎺ヨЕ鍣?, '鍏夌數浼犳劅鍣?], answer: 2, explanation: '鎺ヨЕ鍣ㄦ槸杈撳嚭璁惧锛堟墽琛屽櫒锛夛紝瀹冩帴鏀禤LC鐨勮緭鍑轰俊鍙锋潵鎺у埗澶у姛鐜囪礋杞姐€? },
    { id: 3, question: '瑗块棬瀛怱7-1200鐨勭紪绋嬭蒋浠舵槸浠€涔堬紵', options: ['GX Works3', 'CX-Programmer', 'TIA Portal', 'RSLogix 5000'], answer: 2, explanation: 'TIA Portal锛堝崥閫旓級鏄タ闂ㄥ瓙鏂颁竴浠ｅ伐绋嬫鏋讹紝鐢ㄤ簬S7-1200/1500绛塒LC鐨勭紪绋嬬粍鎬併€? },
    { id: 4, question: '姊舰鍥句腑锛屽父寮€瑙︾偣鐨勭鍙锋槸浠€涔堬紵', options: ['-| |-', '-|/|-', '-( )-', '-|P|-'], answer: 0, explanation: '-| |- 鏄父寮€瑙︾偣锛圢O锛夛紝姝ｅ父鎯呭喌涓嬫柇寮€锛屽緱鐢靛悗闂悎銆? }
  ]
}

function selectOption(idx) {
  if (showResult.value) return
  selectedOption.value = idx
}

function submitAnswer() {
  if (selectedOption.value === null) return
  const q = currentQuestion.value
  isCorrect.value = selectedOption.value === q.answer
  showResult.value = true

  // 璁板綍绛旈敊鐨勯
  if (!isCorrect.value && !wrongQuestions.value.find(w => w.id === q.id)) {
    wrongQuestions.value.push(q)
  }

  // 鍚屾鍒板悗绔?  if (userStore.user) {
    submitAnswerApi(userStore.user.id, q.id, selectedOption.value, isCorrect.value)
      .catch(err => console.error('鎻愪氦绛旈缁撴灉澶辫触:', err))
  }

  // 鏇存柊缁熻
  userStore.updateStats({
    totalQuestions: (userStore.profile.totalQuestions || 0) + 1,
    correctRate: calcCorrectRate()
  })
}

function calcCorrectRate() {
  const total = (userStore.profile.totalQuestions || 0) + 1
  const prevCorrect = Math.round((userStore.profile.correctRate || 0) * (total - 1) / 100)
  const newCorrect = prevCorrect + (isCorrect.value ? 1 : 0)
  return Math.round(newCorrect / total * 100)
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selectedOption.value = null
    showResult.value = false
    isCorrect.value = false
  } else {
    // 瀹屾垚缁冧範
    uni.showToast({ title: '缁冧範瀹屾垚锛?, icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  }
}

function skipQuestion() {
  nextQuestion()
}

function addToWrongBook() {
  uni.showToast({ title: '宸插姞鍏ラ敊棰樻湰', icon: 'none' })
}

function confirmExit() {
  uni.showModal({
    title: '鎻愮ず',
    content: '纭畾瑕侀€€鍑虹瓟棰樺悧锛熷綋鍓嶈繘搴﹀皢涓嶄細淇濆瓨銆?,
    success: (res) => {
      if (res.confirm) uni.navigateBack()
    }
  })
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: #fff; display: flex; flex-direction: column; }

.header {
  background: #fff;
  border-bottom: 1rpx solid #f3f4f6;
  .status-bar { display: flex; justify-content: space-between; padding: 24rpx 40rpx 0; font-size: 24rpx; color: #1f2937; }
  .nav-bar { display: flex; align-items: center; padding: 16rpx 32rpx 20rpx; }
  .nav-back { font-size: 40rpx; color: #6b7280; width: 48rpx; }
  .nav-title { flex: 1; font-size: 30rpx; font-weight: 600; color: #1f2937; text-align: center; }
  .nav-placeholder { width: 48rpx; }
}

.content { flex: 1; padding: 24rpx 32rpx; overflow-y: auto; }

.quiz-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12rpx; }
.progress-text { font-size: 26rpx; color: #6b7280; }
.timer { font-size: 26rpx; color: #f59e0b; font-weight: 600; }

.progress-bar { height: 8rpx; background: #e5e7eb; border-radius: 4rpx; margin-bottom: 32rpx; overflow: hidden; }
.progress-fill { height: 100%; background: #2563eb; border-radius: 4rpx; transition: width .3s; }

.question-card { margin-bottom: 24rpx; }

.question-text {
  font-size: 32rpx; font-weight: 600; color: #1f2937;
  line-height: 1.7; display: block; margin-bottom: 28rpx;
}

.option-item {
  display: flex; align-items: center; gap: 16rpx;
  padding: 24rpx; border-radius: 12rpx;
  border: 2rpx solid #e5e7eb; margin-bottom: 16rpx;
  transition: all .2s;

  &.selected { border-color: #2563eb; background: #dbeafe; }
  &.correct { border-color: #16a34a; background: #dcfce7; }
  &.wrong { border-color: #dc2626; background: #fee2e2; }
}

.option-letter {
  width: 56rpx; height: 56rpx; border-radius: 50%;
  background: #f3f4f6; display: flex;
  align-items: center; justify-content: center;
  font-weight: 700; font-size: 28rpx; color: #6b7280; flex-shrink: 0;

  &.active { background: #2563eb; color: #fff; }
  .correct & { background: #16a34a; color: #fff; }
  .wrong & { background: #dc2626; color: #fff; }
}

.option-text { flex: 1; font-size: 28rpx; color: #374151; }
.option-mark { font-size: 28rpx; width: 40rpx; text-align: center; }
.correct-mark { color: #16a34a; }
.wrong-mark { color: #dc2626; }

// 瑙ｆ瀽
.explanation-box {
  background: #f9fafb; border-radius: 12rpx; padding: 24rpx; margin-top: 16rpx;
  .exp-title { font-size: 28rpx; font-weight: 600; color: #1f2937; display: block; margin-bottom: 10rpx; }
  .exp-text { font-size: 26rpx; color: #6b7280; line-height: 1.7; }
}

.bottom-bar {
  display: flex; gap: 16rpx;
  padding: 20rpx 32rpx;
  border-top: 1rpx solid #e5e7eb;
  background: #fff;
}

.btn {
  flex: 1; padding: 24rpx; border-radius: 12rpx;
  border: none; font-size: 28rpx; font-weight: 600;
}
.btn-primary { background: #2563eb; color: #fff; }
.btn-primary[disabled] { opacity: .5; }
.btn-ghost { background: #f3f4f6; color: #374151; }
</style>
