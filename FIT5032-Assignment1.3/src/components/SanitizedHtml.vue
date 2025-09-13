<template>
  <div v-html="safeHtml"></div>
</template>

<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'
const props = defineProps({ html: String })
const safeHtml = computed(() => DOMPurify.sanitize(props.html || ''))
</script>
