<script setup>
import { ref } from 'vue'
import { ElButton, ElCard, ElDivider } from 'element-plus'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <h1>{{ msg }}</h1>
      </div>
    </template>
    <div class="text item">
      <p>Welcome to the Hello World page!</p>
      <el-divider></el-divider>
      <p>This is a simple counter using Element Plus:</p>
      <el-button type="primary" @click="count++">Count is: {{ count }}</el-button>
    </div>
  </el-card>
</template>

<style scoped>
.box-card {
  width: 480px;
  margin: 20px auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
</style>
