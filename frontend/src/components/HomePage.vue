<template>
  <el-container class="layout-container">
    <el-aside width="250px" class="aside">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        @select="handleMenuSelect"
        :router="true">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>智能驻场</span>
          </template>
          <el-menu-item index="1-1">客户成功</el-menu-item>
          <el-menu-item index="1-2">在线客服</el-menu-item>
          <el-menu-item index="1-3">运维工程师</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Briefcase /></el-icon>
            <span>我的工作台</span>
          </template>
          <el-menu-item-group v-if="currentRole === 'manager'">
            <el-menu-item index="usermanagement">用户管理</el-menu-item>
            <el-menu-item index="2-2">课程管理</el-menu-item>
            <el-menu-item index="2-3">学习记录</el-menu-item>
            <el-menu-item index="2-4">数据统计</el-menu-item>
            <el-menu-item index="2-5">系统维护</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group v-else>
            <el-menu-item index="2-6">培训计划</el-menu-item>
            <el-menu-item index="2-7">讲师管理</el-menu-item>
            <el-menu-item index="2-8">数据分析</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
      <el-select v-model="currentRole" class="role-select" size="small" @change="handleRoleChange" style="width: 80%">
        <el-option label="培训经理" value="manager"></el-option>
        <el-option label="培训总监" value="director"></el-option>
      </el-select>
    </el-aside>

    <el-container>
      <el-header height="60px" class="header">
        <span class="header-title">{{ currentMenuTitle }}</span>
      </el-header>

      <el-main class="main">
        <transition name="fade" mode="out-in">
          <component :is="currentComponent"></component>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Monitor, Briefcase } from '@element-plus/icons-vue'
import CourseManagement from './CourseManagement.vue'

const currentRole = ref('manager')
const activeMenu = ref('2-2')
const currentComponent = ref(null)

const currentMenuTitle = computed(() => {
  switch (activeMenu.value) {
    case '2-2': return '课程管理'
    // Add other menu titles here
    default: return '我的工作台'
  }
})

const handleMenuSelect = (index) => {
  activeMenu.value = index
  if (index === '2-2') {
    currentComponent.value = CourseManagement
  } else {
    currentComponent.value = null
  }
}

const handleRoleChange = () => {
  if (activeMenu.value.startsWith('2-')) {
    activeMenu.value = currentRole.value === 'manager' ? '2-1' : '2-6'
    handleMenuSelect(activeMenu.value)
  }
}

onMounted(() => {
  handleMenuSelect('2-2')
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: #ffffff;
  color: #000000;
}

.aside {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #000000;
}

.main {
  background-color: #ffffff;
  padding: 20px;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu {
  background-color: #ffffff;
}

.el-menu-item, .el-sub-menu__title {
  color: #000000;
}

.el-menu-item.is-active {
  background-color: #f0f0f0;
}

.role-select {
  margin: 20px;
  background-color: #ffffff;
  color: #000000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
