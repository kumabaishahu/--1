<template>
  <div class="operation-engineer">
    <!-- 顶部状态概览 -->
    <el-row :gutter="20" class="status-overview">
      <el-col :span="6" v-for="status in statusOverview" :key="status.title">
        <div class="status-card" :class="status.status">
          <div class="status-icon">
            <el-icon :size="32">
              <component :is="status.icon" />
            </el-icon>
          </div>
          <div class="status-info">
            <div class="status-value">{{ status.value }}</div>
            <div class="status-title">{{ status.title }}</div>
          </div>
          <div class="status-trend" :class="status.trend">
            {{ status.trend === 'up' ? '↑' : '↓' }} {{ status.change }}
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 系统监控 -->
    <el-row :gutter="20" class="monitor-section">
      <el-col :span="16">
        <el-card class="monitor-card">
          <template #header>
            <div class="card-header">
              <h3>系统监控</h3>
              <el-radio-group v-model="monitorTimeRange" size="small">
                <el-radio-button label="1h">1小时</el-radio-button>
                <el-radio-button label="6h">6小时</el-radio-button>
                <el-radio-button label="24h">24小时</el-radio-button>
                <el-radio-button label="7d">7天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="monitor-charts">
            <div class="chart-container">
              <h4>CPU 使用率</h4>
              <el-progress 
                :percentage="systemStatus.cpu" 
                :color="getProgressColor(systemStatus.cpu)"
                :format="format"
              />
            </div>
            <div class="chart-container">
              <h4>内存使用率</h4>
              <el-progress 
                :percentage="systemStatus.memory" 
                :color="getProgressColor(systemStatus.memory)"
                :format="format"
              />
            </div>
            <div class="chart-container">
              <h4>磁盘使用率</h4>
              <el-progress 
                :percentage="systemStatus.disk" 
                :color="getProgressColor(systemStatus.disk)"
                :format="format"
              />
            </div>
            <div class="chart-container">
              <h4>网络流量</h4>
              <el-progress 
                :percentage="systemStatus.network" 
                :color="getProgressColor(systemStatus.network)"
                :format="format"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="alert-card">
          <template #header>
            <div class="card-header">
              <h3>告警信息</h3>
              <el-button type="primary" size="small" @click="handleAlert">处理告警</el-button>
            </div>
          </template>
          <div class="alert-list">
            <div v-for="alert in alerts" 
                 :key="alert.id" 
                 class="alert-item"
                 :class="alert.level">
              <el-icon :size="20">
                <component :is="getAlertIcon(alert.level)" />
              </el-icon>
              <div class="alert-info">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-time">{{ alert.time }}</div>
              </div>
              <el-tag size="small" :type="getAlertTagType(alert.level)">
                {{ alert.level }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统日志 -->
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <h3>系统日志</h3>
          <div class="header-actions">
            <el-input
              v-model="logSearch"
              placeholder="搜索日志"
              prefix-icon="Search"
              clearable
              style="width: 200px; margin-right: 16px;"
            />
            <el-button type="primary" size="small" @click="exportLogs">导出日志</el-button>
          </div>
        </div>
      </template>
      <el-table :data="systemLogs" style="width: 100%" height="400">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="level" label="级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getLogTagType(row.level)" size="small">
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="150" />
        <el-table-column prop="message" label="内容" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="text" @click="viewLogDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Monitor, 
  Cpu, 
  Connection, 
  Warning,
  CircleCheck,
  CircleClose,
  InfoFilled
} from '@element-plus/icons-vue'

// 状态概览数据
const statusOverview = ref([
  {
    title: '系统运行状态',
    value: '正常',
    status: 'normal',
    icon: 'Monitor',
    trend: 'up',
    change: '2.5%'
  },
  {
    title: 'CPU 负载',
    value: '65%',
    status: 'warning',
    icon: 'Cpu',
    trend: 'up',
    change: '5.2%'
  },
  {
    title: '内存使用',
    value: '78%',
    status: 'warning',
    icon: 'Connection',
    trend: 'up',
    change: '3.1%'
  },
  {
    title: '磁盘空间',
    value: '45%',
    status: 'normal',
    icon: 'Monitor',
    trend: 'down',
    change: '1.8%'
  }
])

// 系统状态数据
const systemStatus = ref({
  cpu: 65,
  memory: 78,
  disk: 45,
  network: 82
})

// 监控时间范围
const monitorTimeRange = ref('1h')

// 告警信息
const alerts = ref([
  {
    id: 1,
    title: 'CPU 使用率过高',
    time: '10分钟前',
    level: 'warning'
  },
  {
    id: 2,
    title: '内存使用率接近阈值',
    time: '30分钟前',
    level: 'warning'
  },
  {
    id: 3,
    title: '数据库连接异常',
    time: '1小时前',
    level: 'error'
  }
])

// 系统日志
const logSearch = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const systemLogs = ref([
  {
    time: '2024-01-20 10:30:00',
    level: 'INFO',
    module: '系统启动',
    message: '系统正常启动完成'
  },
  {
    time: '2024-01-20 10:29:00',
    level: 'WARNING',
    module: '资源监控',
    message: 'CPU 使用率超过阈值'
  },
  {
    time: '2024-01-20 10:28:00',
    level: 'ERROR',
    module: '数据库',
    message: '数据库连接失败'
  }
])

// 方法
const format = (percentage) => {
  return percentage + '%'
}

const getProgressColor = (percentage) => {
  if (percentage < 60) return '#67C23A'
  if (percentage < 80) return '#E6A23C'
  return '#F56C6C'
}

const getAlertIcon = (level) => {
  switch (level) {
    case 'error':
      return 'CircleClose'
    case 'warning':
      return 'Warning'
    default:
      return 'InfoFilled'
  }
}

const getAlertTagType = (level) => {
  switch (level) {
    case 'error':
      return 'danger'
    case 'warning':
      return 'warning'
    default:
      return 'info'
  }
}

const getLogTagType = (level) => {
  switch (level) {
    case 'ERROR':
      return 'danger'
    case 'WARNING':
      return 'warning'
    case 'INFO':
      return 'info'
    default:
      return ''
  }
}

const handleAlert = () => {
  // 处理告警
  console.log('处理告警')
}

const exportLogs = () => {
  // 导出日志
  console.log('导出日志')
}

const viewLogDetail = (log) => {
  // 查看日志详情
  console.log('查看日志详情:', log)
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}
</script>

<style scoped>
.operation-engineer {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 70px);
}

.status-overview {
  margin-bottom: 20px;
}

.status-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.status-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.status-card.normal::before {
  background-color: #67C23A;
}

.status-card.warning::before {
  background-color: #E6A23C;
}

.status-card.error::before {
  background-color: #F56C6C;
}

.status-icon {
  margin-right: 16px;
  color: #409EFF;
}

.status-info {
  flex: 1;
}

.status-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.status-title {
  font-size: 14px;
  color: #909399;
}

.status-trend {
  font-size: 14px;
  font-weight: 600;
}

.status-trend.up {
  color: #67C23A;
}

.status-trend.down {
  color: #F56C6C;
}

.monitor-section {
  margin-bottom: 20px;
}

.monitor-card,
.alert-card,
.log-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.monitor-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px 0;
}

.chart-container {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
}

.chart-container h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  gap: 12px;
}

.alert-info {
  flex: 1;
}

.alert-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.alert-time {
  font-size: 12px;
  color: #909399;
}

.header-actions {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .monitor-charts {
    grid-template-columns: 1fr;
  }
  
  .status-card {
    margin-bottom: 16px;
  }
}
</style>
