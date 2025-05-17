<template>
  <el-container class="layout-container">
    <el-aside 
      width="300px" 
      class="aside" 
      :class="{ 'is-collapse': isCollapse }"
      >
      <div class="logo-container">
        <img src="../assets/logo.png" alt="Logo" class="logo" />
        <h2 class="company-name" v-show="!isCollapse">智能培训系统</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        @select="handleMenuSelect"
        :collapse="isCollapse"
        :collapse-transition="true"
        :router="true"
        :class="{ 'director-theme': !isManager, 'manager-theme': isManager }">
        <el-sub-menu index="1" style="background: transparent">
          <template #title>
            <el-icon><Monitor /></el-icon>
            <span>智能驻场</span>
          </template>
          <el-menu-item index="user-success" style="background: transparent">
            <el-icon><User /></el-icon>
            <span>客户成功</span>
          </el-menu-item>
          <el-menu-item index="online-customer-service" style="background: transparent">
            <el-icon><Service /></el-icon>
            <span>在线客服</span>
          </el-menu-item>
          <el-menu-item index="operation-engineer" style="background: transparent">
            <el-icon><Tools /></el-icon>
            <span>运维工程师</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2" style="background: transparent">
          <template #title>
            <el-icon><Briefcase /></el-icon>
            <span>我的工作台</span>
          </template>
          <!-- 培训经理菜单 -->
          <template v-if="currentRole === 'manager'">
            <el-menu-item index="user-management" style="background: transparent">
              <el-icon><UserFilled /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="course-management" style="background: transparent">
              <el-icon><Reading /></el-icon>
              <span>课程管理</span>
            </el-menu-item>
            <el-menu-item index="study-record" style="background: transparent">
              <el-icon><Document /></el-icon>
              <span>学习记录</span>
            </el-menu-item>
            <el-menu-item index="data-statistic" style="background: transparent">
              <el-icon><DataLine /></el-icon>
              <span>数据统计</span>
            </el-menu-item>
            <el-menu-item index="system-maintenance" style="background: transparent">
              <el-icon><Setting /></el-icon>
              <span>系统维护</span>
            </el-menu-item>
          </template>
          <!-- 培训总监菜单 -->
          <template v-else>
            <el-menu-item index="training-plan" style="background: transparent">
              <el-icon><Calendar /></el-icon>
              <span>培训计划</span>
            </el-menu-item>
            <el-menu-item index="trainer-management" style="background: transparent">
              <el-icon><Avatar /></el-icon>
              <span>讲师管理</span>
            </el-menu-item>
            <el-menu-item index="data-analysis" style="background: transparent">
              <el-icon><TrendCharts /></el-icon>
              <span>数据分析</span>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </el-menu>
      <div class="role-switch" :class="{ 'is-collapse': isCollapse }">
        <el-switch
          v-model="isManager"
          :active-text="isCollapse ? '' : '培训经理'"
          :inactive-text="isCollapse ? '' : '培训总监'"
          @change="handleRoleChange"
          class="role-switch-component"
        />
      </div>
    </el-aside>

    <el-container>
      <el-header 
        height="70px" 
        class="header"
        >
        <div class="header-left">
          <el-icon 
            class="collapse-btn"
            @click="toggleCollapse"
            :class="{ 'is-collapsed': isCollapse }">
            <Fold v-if="!isCollapse"/>
            <Expand v-else/>
          </el-icon>
          <span class="header-title">{{ currentMenuTitle }}</span>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-profile">
              <el-avatar :size="32" :src="defaultAvatar" />
              <span class="username">{{ currentRole === 'manager' ? '培训经理' : '培训总监' }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main 
        class="main-content"
        :style="{ backgroundImage: `url(${isManager ? slide2 : slide1})` }">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <keep-alive v-if="route.meta.keepAlive">
              <component :is="Component" />
            </keep-alive>
            <component :is="Component" v-else />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Monitor, Briefcase, User, Service, Tools, UserFilled, Reading, Document, DataLine, Setting, Calendar, Avatar, TrendCharts, Fold, Expand } from '@element-plus/icons-vue'

// 导入背景图片
import slide1 from '../assets/slides/3.jpg'
import slide2 from '../assets/slides/2.jpg'

const router = useRouter()
const route = useRoute()

// 路由映射
const routeMap = {
  'user-success': '/user-success',
  'online-customer-service': '/online-customer-service',
  'operation-engineer': '/operation-engineer',
  'user-management': '/user-management',
  'course-management': '/course-management',
  'study-record': '/study-record',
  'data-statistic': '/data-statistic',
  'system-maintenance': '/system-maintenance',
  'training-plan': '/training-plan',
  'trainer-management': '/trainer-management',
  'data-analysis': '/data-analysis'
}

// 使用异步组件加载
const CourseManagement = defineAsyncComponent(() => 
  import('./CourseManagement.vue')
)

const isCollapse = ref(false)
const activeMenu = ref('course-management')
const currentComponent = ref(null)
const currentPage = ref(1)
const isManager = ref(true)
const currentRole = computed(() => isManager.value ? 'manager' : 'director')

const asideBackground = computed(() => ({
  background: isManager.value 
    ? `url(${slide1}) center/cover no-repeat` 
    : `url(${slide1}) center/cover no-repeat`,
  backgroundBlendMode: 'overlay',
  backgroundColor: 'rgba(255, 255, 255, 0.85)'
}))

const headerBackground = computed(() => ({
  background: isManager.value
    ? `url(${slide2}) center/cover no-repeat`
    : `url(${slide1}) center/cover no-repeat`,
  backgroundBlendMode: 'overlay',
  backgroundColor: 'rgba(255, 255, 255, 0.85)'
}))

const currentMenuTitle = computed(() => {
  switch (activeMenu.value) {
    // 培训经理菜单
    case 'user-management': return '用户管理'
    case 'course-management': return '课程管理'
    case 'study-record': return '学习记录'
    case 'data-statistic': return '数据统计'
    case 'system-maintenance': return '系统维护'
    // 培训总监菜单
    case 'training-plan': return '培训计划'
    case 'trainer-management': return '讲师管理'
    case 'data-analysis': return '数据分析'
    default: return '我的工作台'
  }
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleMenuSelect = (index) => {
  activeMenu.value = index
  // 使用路由导航
  if (routeMap[index]) {
    router.push(routeMap[index])
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleRoleChange = (value) => {
  // 根据角色切换默认显示的菜单项
  if (value) {
    // 培训经理默认显示课程管理
    router.push('/course-management')
  } else {
    // 培训总监默认显示培训计划
    router.push('/training-plan')
  }
}

onMounted(() => {
  // 根据当前路由设置活动菜单
  const path = route.path
  const menuItem = Object.entries(routeMap).find(([_, routePath]) => routePath === path)
  if (menuItem) {
    activeMenu.value = menuItem[0]
  } else {
    // 默认路由
    router.push('/course-management')
  }
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #2c3e50;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  overflow-x: hidden;
  position: relative;
  width: 100%;
}

.aside {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.5s ease;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  border-right: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.aside.is-collapse {
  width: 80px !important;
}

.logo-container {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #ebeef5;
}

.logo {
  width: 40px;
  height: 40px;
}

.company-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.5s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: fixed;
  top: 0;
  right: 0;
  left: 300px;
  z-index: 999;
  transition: all 0.5s ease;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.is-collapse ~ .el-container .header {
  left: 80px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.5s ease;
}

.collapse-btn:hover {
  color: #666;
}

.collapse-btn.is-collapsed {
  transform: rotate(180deg);
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.5s ease;
}

.user-profile:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.username {
  font-size: 14px;
  color: #2c3e50;
}

.main-content {
  padding: 24px;
  margin-left: 300px;
  margin-top: 70px;
  transition: margin-left 0.5s ease;
  min-height: calc(100vh - 70px);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.is-collapse ~ .el-container .main-content {
  margin-left: 80px;
}

.role-switch {
  padding: 16px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
  transition: all 0.5s ease;
  margin-top: auto;
}

.role-switch.is-collapse {
  padding: 16px 8px;
}

.role-switch-component {
  width: 100%;
}

.el-menu-vertical {
  border-right: none;
  padding: 8px;
  flex: 1;
}

.el-menu {
  background-color: transparent !important;
  border-right: none;
}

.el-menu-item {
  height: 48px;
  line-height: 48px;
  margin: 4px 0;
  border-radius: 6px;
  color: #2c3e50 !important;
  font-size: 18px !important;
  transition: all 0.5s ease !important;
  background-color: transparent !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.el-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.06) !important;
}

.el-menu-item.is-active {
  background-color: rgba(0, 0, 0, 0.1) !important;
  color: #2c3e50 !important;
}

.el-sub-menu__title {
  height: 48px;
  line-height: 48px;
  margin: 4px 0;
  border-radius: 6px;
  color: #2c3e50 !important;
  font-size: 18px !important;
  transition: all 0.5s ease !important;
  background-color: transparent !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.el-sub-menu__title:hover {
  background-color: rgba(0, 0, 0, 0.06) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .aside {
    width: 80px !important;
  }
  
  .company-name,
  .el-menu-item span,
  .el-sub-menu__title span {
    display: none;
  }
  
  .logo-container {
    justify-content: center;
    padding: 12px;
  }

  .main-content {
    margin-left: 80px;
  }

  .header {
    left: 80px;
  }
}

.aside :deep(.el-menu) {
  background-color: transparent !important;
  border-right: none;
}

.aside :deep(.el-menu-item),
.aside :deep(.el-sub-menu__title) {
  background-color: transparent !important;
}

.aside :deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.aside :deep(.el-menu-item:hover),
.aside :deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.aside :deep(.el-sub-menu .el-menu) {
  background-color: transparent !important;
}

.aside :deep(.el-sub-menu .el-menu-item) {
  background-color: transparent !important;
}
</style>
