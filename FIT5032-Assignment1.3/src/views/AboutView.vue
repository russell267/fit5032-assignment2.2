<!-- File: src/views/AboutView.vue -->
<template>
  <div class="about">
    <h1>About Our Men's health</h1>
    <p>Welcome to our men's health activity!</p>

    <!-- Added: XSS protection demo (rich text is only rendered through SanitizedHtml).-->
    <section class="rating-card" aria-labelledby="safe-html-demo">
      <h2 id="safe-html-demo">Safe Rich Text Demo</h2>
      <SanitizedHtml :html="richDescription" />
    </section>

    <!-- ==== Section 1: Men's BMI ==== -->
    <section class="rating-card" aria-labelledby="bmi-label">
      <div class="rating-head">
        <h2 id="bmi-label">{{ bmi.aspect }}</h2>
        <div class="agg">
          <span class="avg"
                :title="`${fmt(bmi.displayAvg.value,2)} average based on ${bmi.displayTotal.value} ratings`">
            {{ fmt(bmi.displayAvg.value,1) }}
          </span>
          <span class="stars" aria-hidden="true">{{ bmi.renderStars(bmi.displayAvg.value) }}</span>
          <span class="count">({{ bmi.displayTotal.value }} ratings)</span>
        </div>
      </div>

      <div class="picker" role="radiogroup" aria-label="Give a rating from 1 to 5 stars">
        <button v-for="n in 5" :key="n" class="star-btn"
                :class="{ selected: bmi.isSelected(n) }"
                role="radio" :aria-checked="bmi.isChecked(n)"
                :aria-label="`${n} ${n>1?'stars':'star'}`"
                @click="bmi.setRating(n)" type="button">★</button>
        <button class="clear-btn" type="button" @click="bmi.clear()"
                :disabled="bmi.isZero">Clear</button>
      </div>

      <div class="actions">
        <button class="submit" type="button"
                :disabled="bmi.canSubmit"
                @click="bmi.submit()">
          {{ bmi.submitting ? 'Save' : bmi.hasSubmitted ? 'Update my rating' : 'Submit rating' }}
        </button>
        <span v-if="bmi.feedback" class="feedback" role="status">{{ bmi.feedback }}</span>
      </div>
    </section>

    <!-- ==== Section 2: Men's Blood Pressure ==== -->
    <section class="rating-card" aria-labelledby="bp-label">
      <div class="rating-head">
        <h2 id="bp-label">{{ bp.aspect }}</h2>
        <div class="agg">
          <span class="avg"
                :title="`${fmt(bp.displayAvg.value,2)} average based on ${bp.displayTotal.value} ratings`">
            {{ fmt(bp.displayAvg.value,1) }}
          </span>
          <span class="stars" aria-hidden="true">{{ bp.renderStars(bp.displayAvg.value) }}</span>
          <span class="count">({{ bp.displayTotal.value }} ratings)</span>
        </div>
      </div>

      <div class="picker" role="radiogroup" aria-label="Give a rating from 1 to 5 stars">
        <button v-for="n in 5" :key="n" class="star-btn"
                :class="{ selected: bp.isSelected(n) }"
                role="radio" :aria-checked="bp.isChecked(n)"
                :aria-label="`${n} ${n>1?'stars':'star'}`"
                @click="bp.setRating(n)" type="button">★</button>
        <button class="clear-btn" type="button" @click="bp.clear()"
                :disabled="bp.isZero">Clear</button>
      </div>

      <div class="actions">
        <button class="submit" type="button"
                :disabled="bp.canSubmit"
                @click="bp.submit()">
          {{ bp.submitting ? 'Save' : bp.hasSubmitted ? 'Update my rating' : 'Submit rating' }}
        </button>
        <span v-if="bp.feedback" class="feedback" role="status">{{ bp.feedback }}</span>
      </div>
    </section>

    <!-- ==== Section 3: Men's Sleep Quality ==== -->
    <section class="rating-card" aria-labelledby="sleep-label">
      <div class="rating-head">
        <h2 id="sleep-label">{{ sleep.aspect }}</h2>
        <div class="agg">
          <span class="avg"
                :title="`${fmt(sleep.displayAvg.value,2)} average based on ${sleep.displayTotal.value} ratings`">
            {{ fmt(sleep.displayAvg.value,1) }}
          </span>
          <span class="stars" aria-hidden="true">{{ sleep.renderStars(sleep.displayAvg.value) }}</span>
          <span class="count">({{ sleep.displayTotal.value }} ratings)</span>
        </div>
      </div>

      <div class="picker" role="radiogroup" aria-label="Give a rating from 1 to 5 stars">
        <button v-for="n in 5" :key="n" class="star-btn"
                :class="{ selected: sleep.isSelected(n) }"
                role="radio" :aria-checked="sleep.isChecked(n)"
                :aria-label="`${n} ${n>1?'stars':'star'}`"
                @click="sleep.setRating(n)" type="button">★</button>
        <button class="clear-btn" type="button" @click="sleep.clear()"
                :disabled="sleep.isZero">Clear</button>
      </div>

      <div class="actions">
        <button class="submit" type="button"
                :disabled="sleep.canSubmit"
                @click="sleep.submit()">
          {{ sleep.submitting ? 'Save' : sleep.hasSubmitted ? 'Update my rating' : 'Submit rating' }}
        </button>
        <span v-if="sleep.feedback" class="feedback" role="status">{{ sleep.feedback }}</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SanitizedHtml from '@/components/SanitizedHtml.vue'   //import the XSS component

/* It will be cleaned*/
const richDescription = ref(`
  <p>Welcome to <strong>our men's health</strong> portal.</p>
  <p>See more at <a href="https://example.com">official site</a>.</p>
  <img src=x onerror="alert('XSS!')" /> <!-- This will be sanitized and blocked from executing.-->
`)

const STORAGE_KEY = 'libraryRatings'
const hasWindow = typeof window !== 'undefined'
function safeParse (raw, fallback = {}) { try { return JSON.parse(raw) ?? fallback } catch { return fallback } }
function safeGet (key, fallback = null) { if (!hasWindow) return fallback; try { return window.localStorage.getItem(key) } catch { return fallback } }
function safeSet (key, val) { if (!hasWindow) return; try { window.localStorage.setItem(key, val) } catch {} }
function getOrCreateUserId () {
  const key = STORAGE_KEY + ':uid'
  let uid = safeGet(key)
  if (!uid) {
    try { uid = crypto?.randomUUID?.() } catch { uid = null }
    uid = uid || Math.random().toString(36).slice(2)
    safeSet(key, uid)
  }
  return uid
}
function getStore () { return safeParse(safeGet(STORAGE_KEY, '{}'), {}) }
function setStore (obj) { safeSet(STORAGE_KEY, JSON.stringify(obj || {})) }
function fmt (num, digits = 1) { const n = Number(num); return Number.isFinite(n) ? n.toFixed(digits) : (0).toFixed(digits) }

function renderStars (val) {
  const r = Math.round(Number(val) || 0)
  return '★★★★★'.slice(0, Math.min(5, Math.max(0, r))).padEnd(5, '☆')
}

function makeRating (aspect) {
  const currentRating = ref(0)
  const submitting = ref(false)
  const feedback = ref('')
  const hasSubmitted = ref(false)

  async function submit () {
    submitting.value = true
    feedback.value = ''
    try {
      const store = getStore()
      const uid = getOrCreateUserId()
      store[uid] = store[uid] || {}
      store[uid][aspect] = currentRating.value
      setStore(store)
      hasSubmitted.value = true
      feedback.value = 'Saved.'
    } catch (e) {
      console.error(e)
      feedback.value = 'Failed to save. Please try again.'
    } finally {
      submitting.value = false
      setTimeout(() => { feedback.value = '' }, 1200)
    }
  }

  const displayAvg = computed(() => Number(currentRating.value || 0))
  const displayTotal = computed(() => (currentRating.value > 0 ? 1 : 0))

  const isZero = computed(() => currentRating.value === 0)
  const canSubmit = computed(() => isZero.value || submitting.value)
  function setRating (n) { currentRating.value = n }
  function clear () { currentRating.value = 0 }
  function isSelected (n) { return currentRating.value >= n }
  function isChecked (n) { return currentRating.value === n }

  onMounted(() => {
    const uid = safeGet(STORAGE_KEY + ':uid')
    if (!uid) return
    const store = getStore()
    const mine = Number(store[uid]?.[aspect])
    if (Number.isFinite(mine) && mine > 0) {
      currentRating.value = mine
      hasSubmitted.value = true
    }
  })

  return {
    aspect,
    currentRating, submitting, feedback, hasSubmitted,
    displayAvg, displayTotal,
    isZero, canSubmit, setRating, clear, isSelected, isChecked, submit,
    renderStars
  }
}

const bmi   = makeRating("Men's BMI")
const bp    = makeRating("Men's Blood Pressure")
const sleep = makeRating("Men's Sleep Quality")
</script>

<style scoped>
.about { max-width: 920px; margin: 0 auto; padding: 24px; }

.rating-card {
  margin-top: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  background: #fff;
}
.rating-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.agg { display: flex; align-items: center; gap: 10px; }
.avg { font-weight: 800; font-size: 1.25rem; }
.stars { letter-spacing: 2px; }
.count { color: #6b7280; font-size: 0.9rem; }

.picker { display: flex; align-items: center; gap: 6px; margin: 10px 0; }
.star-btn { font-size: 24px; line-height: 1; background: transparent; border: none; cursor: pointer; padding: 2px 4px; }
.star-btn:hover, .star-btn:focus { transform: scale(1.06); }
.star-btn.selected { color: #f59e0b; }
.clear-btn { margin-left: 8px; border: 1px solid #e5e7eb; padding: 6px 10px; border-radius: 8px; background: #f9fafb; cursor: pointer; }
.clear-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.actions { display: flex; align-items: center; gap: 10px; margin-top: 2px; }
.submit { background: #111827; color: #fff; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
.submit:disabled { opacity: 0.6; cursor: not-allowed; }
.feedback { color: #059669; font-size: 0.9rem; }
</style>
