<!-- File: src/components/AspectRating.vue -->
<template>
  <div class="aspect-rating" :aria-labelledby="id + '-label'">
    <div class="header">
      <h3 :id="id + '-label'" class="title">{{ aspect }}</h3>
      <div class="aggregate">
        <span class="avg" :title="avgTitle">{{ average.toFixed(1) }}</span>
        <span class="stars" aria-hidden="true">{{ renderStars(average) }}</span>
        <span class="count">({{ total }} ratings)</span>
      </div>
    </div>

    <!-- Interactive stars -->
    <div class="picker" role="radiogroup" :aria-label="'Rate ' + aspect">
      <button
        v-for="n in 5"
        :key="n"
        class="star-btn"
        :class="{ selected: currentRating >= n }"
        role="radio"
        :aria-checked="currentRating === n"
        :aria-label="n + ' star' + (n > 1 ? 's' : '')"
        @click="setRating(n)"
        @keydown.left.prevent="step(-1)"
        @keydown.right.prevent="step(1)"
        @keydown.enter.prevent="setRating(n)"
        @keydown.space.prevent="setRating(n)"
        type="button"
      >
        ★
      </button>
      <button
        class="clear-btn"
        type="button"
        @click="clearRating"
        :disabled="currentRating === 0"
        aria-label="Clear rating"
      >
        Clear
      </button>
    </div>

    <!-- Submit -->
    <div class="actions">
      <button
        class="submit"
        type="button"
        :disabled="currentRating === 0 || submitting"
        @click="submit"
      >
        {{ submitting ? 'Saving…' : hasSubmitted ? 'Update my rating' : 'Submit rating' }}
      </button>
      <span v-if="feedback" class="feedback" role="status">{{ feedback }}</span>
    </div>

    <!-- Distribution -->
    <div class="histogram" aria-label="Rating distribution" role="group">
      <div v-for="n in [5, 4, 3, 2, 1]" :key="'bar-' + n" class="row">
        <span class="label">{{ n }}★</span>
        <div class="bar-wrap" :aria-label="n + ' star count ' + (distribution[n] || 0)">
          <div class="bar" :style="{ width: barWidth(n) }"></div>
        </div>
        <span class="value">{{ distribution[n] || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

/**
 * Props:
 * - aspect: 评分维度名称，如 "Reviews"
 * - aggregate: { average:number, total:number, distribution:{1..5:number} }
 * - myRating: 当前用户已有评分（可选）
 * - storageKey: 本地存储 key（与父组件一致）
 */
const props = defineProps({
  aspect: { type: String, required: true },
  aggregate: {
    type: Object,
    required: true,
    default: () => ({ average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } })
  },
  myRating: { type: Number, default: 0 },
  storageKey: { type: String, default: 'libraryRatings' }
})

const emit = defineEmits(['rated'])

const id = Math.random().toString(36).slice(2)
const submitting = ref(false)
const feedback = ref('')
const currentRating = ref(0)
const hasSubmitted = ref(false)

watch(
  () => props.myRating,
  (val) => {
    if (!hasSubmitted.value) currentRating.value = val || 0
  },
  { immediate: true }
)

const average = computed(() => Number(props.aggregate?.average || 0))
const total = computed(() => Number(props.aggregate?.total || 0))
const distribution = computed(() => props.aggregate?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

const avgTitle = computed(() => `${average.value.toFixed(2)} average based on ${total.value} ratings`)

function renderStars (val) {
  const full = Math.round(val)
  return '★★★★★'.slice(0, full).padEnd(5, '☆')
}

function setRating (n) {
  currentRating.value = n
}

function step (delta) {
  const next = Math.min(5, Math.max(0, currentRating.value + delta))
  currentRating.value = next
}

function clearRating () {
  currentRating.value = 0
}

function barWidth (n) {
  const dist = distribution.value
  const max = Math.max(...[1, 2, 3, 4, 5].map(k => dist[k] || 0), 1) // 避免除零
  const pct = ((dist[n] || 0) / max) * 100
  return `${pct}%`
}

async function submit () {
  submitting.value = true
  feedback.value = ''
  try {
    // 简单本地持久化（可替换为 API）
    const key = props.storageKey
    const store = JSON.parse(localStorage.getItem(key) || '{}')
    const userId = getOrCreateUserId()
    store[userId] = store[userId] || {}
    store[userId][props.aspect] = currentRating.value
    localStorage.setItem(key, JSON.stringify(store))

    hasSubmitted.value = true
    emit('rated', { aspect: props.aspect, rating: currentRating.value })
    feedback.value = 'Saved.'
  } catch (e) {
    console.error(e)
    feedback.value = 'Failed to save. Please try again.'
  } finally {
    submitting.value = false
    setTimeout(() => (feedback.value = ''), 2000)
  }
}

function getOrCreateUserId () {
  const key = props.storageKey + ':uid'
  let uid = localStorage.getItem(key)
  if (!uid) {
    uid = crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
    localStorage.setItem(key, uid)
  }
  return uid
}
</script>

<style scoped>
.aspect-rating {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin: 12px 0;
  background: #fff;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.title {
  font-size: 1.1rem;
  margin: 0;
}

.aggregate {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avg {
  font-weight: 700;
}

.stars {
  letter-spacing: 2px;
  font-size: 1.1rem;
}

.count {
  color: #6b7280;
  font-size: 0.9rem;
}

.picker {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 10px 0;
}

.star-btn {
  font-size: 24px;
  line-height: 1;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
}

.star-btn:hover,
.star-btn:focus {
  transform: scale(1.06);
}

.star-btn.selected {
  color: #f59e0b;
}

.clear-btn {
  margin-left: 8px;
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.submit {
  background: #111827;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.feedback {
  color: #059669;
  font-size: 0.9rem;
}

.histogram {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row {
  display: grid;
  grid-template-columns: 36px 1fr 40px;
  gap: 8px;
  align-items: center;
}

.label {
  color: #374151;
  font-size: 0.9rem;
  text-align: right;
}

.bar-wrap {
  height: 8px;
  background: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #f59e0b;
}

.value {
  color: #374151;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
</style>
