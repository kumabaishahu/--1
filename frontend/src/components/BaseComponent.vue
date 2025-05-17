<template>
  <div class="base-component">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, onActivated, onDeactivated } from 'vue'

// 基础生命周期钩子
onMounted(() => {
  console.log('Base component mounted')
})

onActivated(() => {
  console.log('Base component activated')
})

onDeactivated(() => {
  console.log('Base component deactivated')
})
</script>

<style scoped>
.base-component {
  width: 100%;
  height: 100%;
}
</style> 