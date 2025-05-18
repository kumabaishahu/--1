<template>
  <div class="data-analysis-container">
    <!-- 时间范围选择 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="filterForm.dataType" placeholder="选择数据类型">
            <el-option label="用户数据" value="user" />
            <el-option label="课程数据" value="course" />
            <el-option label="学习数据" value="study" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">分析</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据概览 -->
    <el-row :gutter="20" class="overview-section">
      <el-col :span="6" v-for="(item, index) in overviewData" :key="index">
        <el-card class="overview-card" :body-style="{ padding: '20px' }">
          <div class="overview-item">
            <div class="overview-icon" :style="{ backgroundColor: item.color }">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="overview-content">
              <div class="overview-label">{{ item.label }}</div>
              <div class="overview-value">{{ item.value }}</div>
              <div class="overview-trend" :class="item.trend">
                {{ item.trend === 'up' ? '↑' : '↓' }} {{ item.rate }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-section">
      <!-- 趋势图 -->
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>数据趋势</span>
              <el-radio-group v-model="trendType" size="small">
                <el-radio-button label="daily">日</el-radio-button>
                <el-radio-button label="weekly">周</el-radio-button>
                <el-radio-button label="monthly">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-content">
            <!-- 这里放置趋势图 -->
            <div class="chart-placeholder">
              数据趋势图表
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 分布图 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>数据分布</span>
            </div>
          </template>
          <div class="chart-content">
            <!-- 这里放置分布图 -->
            <div class="chart-placeholder">
              数据分布图表
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细分析 -->
    <el-row :gutter="20" class="analysis-section">
      <!-- 用户画像 -->
      <el-col :span="12">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>用户画像</span>
            </div>
          </template>
          <div class="analysis-content">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="用户年龄段">
                <el-progress :percentage="80" :format="() => '25-35岁'" />
              </el-descriptions-item>
              <el-descriptions-item label="用户性别">
                <el-progress :percentage="60" :format="() => '男性'" />
              </el-descriptions-item>
              <el-descriptions-item label="用户地域">
                <el-progress :percentage="70" :format="() => '一线城市'" />
              </el-descriptions-item>
              <el-descriptions-item label="用户职业">
                <el-progress :percentage="65" :format="() => 'IT行业'" />
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>

      <!-- 学习行为 -->
      <el-col :span="12">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>学习行为分析</span>
            </div>
          </template>
          <div class="analysis-content">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="平均学习时长">
                <el-progress :percentage="75" :format="() => '2.5小时/天'" />
              </el-descriptions-item>
              <el-descriptions-item label="完成率">
                <el-progress :percentage="85" :format="() => '85%'" />
              </el-descriptions-item>
              <el-descriptions-item label="活跃时段">
                <el-progress :percentage="90" :format="() => '19:00-21:00'" />
              </el-descriptions-item>
              <el-descriptions-item label="互动率">
                <el-progress :percentage="70" :format="() => '70%'" />
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 导出按钮 -->
    <div class="export-section">
      <el-button type="primary" @click="handleExport">
        <el-icon><Download /></el-icon>导出分析报告
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated, onDeactivated } from 'vue'
import { Download, User, Reading, Timer, Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 组件状态
const isActive = ref(false)

// 生命周期钩子
onMounted(() => {
  console.log('DataAnalysis component mounted')
})

onActivated(() => {
  isActive.value = true
  console.log('DataAnalysis component activated')
})

onDeactivated(() => {
  isActive.value = false
  console.log('DataAnalysis component deactivated')
})

// 数据
const filterForm = reactive({
  dateRange: [],
  dataType: 'user'
})

const trendType = ref('daily')

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

// 概览数据
const overviewData = [
  {
    label: '总用户数',
    value: '12,345',
    rate: '12.5',
    trend: 'up',
    icon: 'User',
    color: '#409EFF'
  },
  {
    label: '课程数量',
    value: '256',
    rate: '8.3',
    trend: 'up',
    icon: 'Reading',
    color: '#67C23A'
  },
  {
    label: '学习时长',
    value: '3,456h',
    rate: '5.2',
    trend: 'up',
    icon: 'Timer',
    color: '#E6A23C'
  },
  {
    label: '平均评分',
    value: '4.8',
    rate: '2.1',
    trend: 'down',
    icon: 'Star',
    color: '#F56C6C'
  }
]

// 方法
const handleFilter = () => {
  // 在前端实现数据分析逻辑
  const startDate = filterForm.dateRange[0]
  const endDate = filterForm.dateRange[1]
  const dataType = filterForm.dataType
  
  // 根据数据类型生成模拟数据
  let analysisData = []
  if (dataType === 'user') {
    analysisData = generateUserData(startDate, endDate)
  } else if (dataType === 'course') {
    analysisData = generateCourseData(startDate, endDate)
  } else if (dataType === 'study') {
    analysisData = generateStudyData(startDate, endDate)
  }
  
  // 更新图表数据
  updateCharts(analysisData)
}

const generateUserData = (startDate, endDate) => {
  // 生成用户数据
  return {
    totalUsers: Math.floor(Math.random() * 1000),
    activeUsers: Math.floor(Math.random() * 800),
    newUsers: Math.floor(Math.random() * 200),
    userGrowth: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50))
  }
}

const generateCourseData = (startDate, endDate) => {
  // 生成课程数据
  return {
    totalCourses: Math.floor(Math.random() * 100),
    activeCourses: Math.floor(Math.random() * 80),
    newCourses: Math.floor(Math.random() * 20),
    courseCompletion: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100))
  }
}

const generateStudyData = (startDate, endDate) => {
  // 生成学习数据
  return {
    totalStudyTime: Math.floor(Math.random() * 10000),
    averageStudyTime: Math.floor(Math.random() * 120),
    completionRate: Math.floor(Math.random() * 100),
    studyTrend: Array.from({ length: 30 }, () => Math.floor(Math.random() * 200))
  }
}

const updateCharts = (data) => {
  // 更新图表显示
  ElMessage.success('数据分析完成')
}

const resetFilter = () => {
  filterForm.dateRange = []
  filterForm.dataType = ''
  // 重置图表
  updateCharts(null)
}

const handleExport = () => {
  ElMessage.success('分析报告导出成功')
}
</script>

<style scoped>
.data-analysis-container {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.overview-section {
  margin-bottom: 20px;
}

.overview-card {
  height: 120px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.overview-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.overview-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.overview-content {
  flex: 1;
}

.overview-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 4px;
}

.overview-trend {
  font-size: 12px;
}

.overview-trend.up {
  color: #67C23A;
}

.overview-trend.down {
  color: #F56C6C;
}

.chart-section {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.analysis-section {
  margin-bottom: 20px;
}

.analysis-card {
  margin-bottom: 20px;
}

.analysis-content {
  padding: 20px;
}

.export-section {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-descriptions) {
  margin: 20px 0;
}
</style> 