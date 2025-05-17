<template>
  <div class="data-statistic-container">
    <!-- 统计卡片 -->
    <div class="stat-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <template #header>
              <div class="card-header">
                <span>总用户数</span>
                <el-tag type="success">实时</el-tag>
              </div>
            </template>
            <div class="card-content">
              <div class="stat-value">1,234</div>
              <div class="stat-trend">
                <span class="trend-up">↑ 12.5%</span>
                <span class="trend-text">较上月</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <template #header>
              <div class="card-header">
                <span>活跃用户</span>
                <el-tag type="warning">今日</el-tag>
              </div>
            </template>
            <div class="card-content">
              <div class="stat-value">256</div>
              <div class="stat-trend">
                <span class="trend-up">↑ 8.3%</span>
                <span class="trend-text">较昨日</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <template #header>
              <div class="card-header">
                <span>课程完成率</span>
                <el-tag type="info">本月</el-tag>
              </div>
            </template>
            <div class="card-content">
              <div class="stat-value">78.5%</div>
              <div class="stat-trend">
                <span class="trend-up">↑ 5.2%</span>
                <span class="trend-text">较上月</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <template #header>
              <div class="card-header">
                <span>平均学习时长</span>
                <el-tag type="primary">本月</el-tag>
              </div>
            </template>
            <div class="card-content">
              <div class="stat-value">2.5h</div>
              <div class="stat-trend">
                <span class="trend-down">↓ 2.1%</span>
                <span class="trend-text">较上月</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="chart-section">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>用户活跃度趋势</span>
                <el-radio-group v-model="timeRange" size="small">
                  <el-radio-button label="week">周</el-radio-button>
                  <el-radio-button label="month">月</el-radio-button>
                  <el-radio-button label="year">年</el-radio-button>
                </el-radio-group>
              </div>
            </template>
            <div class="chart-content">
              <!-- 这里放置折线图 -->
              <div class="chart-placeholder">
                用户活跃度趋势图表
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>课程分布</span>
              </div>
            </template>
            <div class="chart-content">
              <!-- 这里放置饼图 -->
              <div class="chart-placeholder">
                课程分布饼图
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 详细数据表格 -->
    <el-card class="data-table-card">
      <template #header>
        <div class="card-header">
          <span>详细数据</span>
          <el-button type="primary" size="small" @click="handleExport">
            导出数据
          </el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="newUsers" label="新增用户" width="100" />
        <el-table-column prop="activeUsers" label="活跃用户" width="100" />
        <el-table-column prop="courseCompletion" label="课程完成率" width="120">
          <template #default="{ row }">
            {{ row.courseCompletion }}%
          </template>
        </el-table-column>
        <el-table-column prop="avgStudyTime" label="平均学习时长" width="120" />
        <el-table-column prop="totalCourses" label="总课程数" width="100" />
        <el-table-column prop="totalStudyTime" label="总学习时长" width="120" />
        <el-table-column prop="userRetention" label="用户留存率" width="120">
          <template #default="{ row }">
            {{ row.userRetention }}%
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, onDeactivated } from 'vue'
import { ElMessage } from 'element-plus'

// 组件状态
const isActive = ref(false)

// 生命周期钩子
onMounted(() => {
  console.log('DataStatistic component mounted')
})

onActivated(() => {
  isActive.value = true
  console.log('DataStatistic component activated')
})

onDeactivated(() => {
  isActive.value = false
  console.log('DataStatistic component deactivated')
})

// 数据
const timeRange = ref('month')

// 模拟数据
const tableData = ref([
  {
    date: '2024-01-15',
    newUsers: 45,
    activeUsers: 256,
    courseCompletion: 78.5,
    avgStudyTime: '2.5h',
    totalCourses: 12,
    totalStudyTime: '640h',
    userRetention: 85.2
  },
  {
    date: '2024-01-14',
    newUsers: 38,
    activeUsers: 248,
    courseCompletion: 75.8,
    avgStudyTime: '2.3h',
    totalCourses: 12,
    totalStudyTime: '570h',
    userRetention: 84.5
  },
  {
    date: '2024-01-13',
    newUsers: 42,
    activeUsers: 235,
    courseCompletion: 76.2,
    avgStudyTime: '2.4h',
    totalCourses: 12,
    totalStudyTime: '564h',
    userRetention: 83.8
  }
])

// 方法
const handleExport = () => {
  ElMessage.success('数据导出成功')
}
</script>

<style scoped>
.data-statistic-container {
  padding: 20px;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  height: 160px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-size: 16px;
  color: #2c3e50;
}

.card-content {
  text-align: center;
  padding: 20px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.stat-trend {
  font-size: 14px;
  color: #909399;
}

.trend-up {
  color: #67c23a;
  margin-right: 8px;
}

.trend-down {
  color: #f56c6c;
  margin-right: 8px;
}

.chart-section {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-content {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  color: #909399;
  font-size: 16px;
}

.data-table-card {
  margin-bottom: 20px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style> 