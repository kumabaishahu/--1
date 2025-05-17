<template>
  <div class="system-maintenance-container">
    <el-row :gutter="20">
      <!-- 系统状态 -->
      <el-col :span="16">
        <el-card class="status-card">
          <template #header>
            <div class="card-header">
              <span>系统状态</span>
              <el-button type="primary" size="small" @click="refreshStatus">
                刷新状态
              </el-button>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="运行时间">30天</el-descriptions-item>
            <el-descriptions-item label="CPU使用率">
              <el-progress :percentage="systemStatus.cpu" :status="getStatusType(systemStatus.cpu)" />
            </el-descriptions-item>
            <el-descriptions-item label="内存使用率">
              <el-progress :percentage="systemStatus.memory" :status="getStatusType(systemStatus.memory)" />
            </el-descriptions-item>
            <el-descriptions-item label="磁盘使用率">
              <el-progress :percentage="systemStatus.disk" :status="getStatusType(systemStatus.disk)" />
            </el-descriptions-item>
            <el-descriptions-item label="网络状态">
              <el-tag :type="systemStatus.network ? 'success' : 'danger'">
                {{ systemStatus.network ? '正常' : '异常' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 系统日志 -->
        <el-card class="log-card">
          <template #header>
            <div class="card-header">
              <span>系统日志</span>
              <div class="header-actions">
                <el-button type="primary" size="small" @click="handleExportLog">
                  导出日志
                </el-button>
                <el-button type="danger" size="small" @click="handleClearLog">
                  清空日志
                </el-button>
              </div>
            </div>
          </template>
          <el-table :data="logData" style="width: 100%" height="400">
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="level" label="级别" width="100">
              <template #default="{ row }">
                <el-tag :type="getLogLevelType(row.level)">
                  {{ row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="module" label="模块" width="120" />
            <el-table-column prop="message" label="内容" />
          </el-table>
        </el-card>
      </el-col>

      <!-- 系统设置 -->
      <el-col :span="8">
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>系统设置</span>
            </div>
          </template>
          <el-form :model="settings" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="settings.systemName" />
            </el-form-item>
            <el-form-item label="维护模式">
              <el-switch v-model="settings.maintenanceMode" />
            </el-form-item>
            <el-form-item label="日志级别">
              <el-select v-model="settings.logLevel" style="width: 100%">
                <el-option label="DEBUG" value="debug" />
                <el-option label="INFO" value="info" />
                <el-option label="WARNING" value="warning" />
                <el-option label="ERROR" value="error" />
              </el-select>
            </el-form-item>
            <el-form-item label="数据备份">
              <el-button type="primary" @click="handleBackup">
                立即备份
              </el-button>
            </el-form-item>
            <el-form-item label="系统更新">
              <el-button type="primary" @click="handleUpdate">
                检查更新
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 快捷操作 -->
        <el-card class="actions-card">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="action-buttons">
            <el-button type="primary" @click="handleRestart">
              重启系统
            </el-button>
            <el-button type="warning" @click="handleClearCache">
              清除缓存
            </el-button>
            <el-button type="danger" @click="handleReset">
              重置系统
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated, onDeactivated } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 组件状态
const isActive = ref(false)

// 生命周期钩子
onMounted(() => {
  console.log('SystemMaintenance component mounted')
})

onActivated(() => {
  isActive.value = true
  console.log('SystemMaintenance component activated')
})

onDeactivated(() => {
  isActive.value = false
  console.log('SystemMaintenance component deactivated')
})

// 系统状态数据
const systemStatus = reactive({
  cpu: 45,
  memory: 60,
  disk: 75,
  network: true
})

// 系统设置
const settings = reactive({
  systemName: '智能培训系统',
  maintenanceMode: false,
  logLevel: 'info'
})

// 日志数据
const logData = ref([
  {
    time: '2024-01-15 14:30:00',
    level: 'INFO',
    module: '系统',
    message: '系统启动成功'
  },
  {
    time: '2024-01-15 14:29:55',
    level: 'WARNING',
    module: '数据库',
    message: '数据库连接池接近上限'
  },
  {
    time: '2024-01-15 14:29:50',
    level: 'ERROR',
    module: '文件系统',
    message: '文件上传失败'
  }
])

// 方法
const getStatusType = (value) => {
  if (value >= 90) return 'exception'
  if (value >= 70) return 'warning'
  return 'success'
}

const getLogLevelType = (level) => {
  const types = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'danger',
    DEBUG: ''
  }
  return types[level] || ''
}

const refreshStatus = () => {
  // 模拟刷新状态
  systemStatus.cpu = Math.floor(Math.random() * 100)
  systemStatus.memory = Math.floor(Math.random() * 100)
  systemStatus.disk = Math.floor(Math.random() * 100)
  ElMessage.success('状态已更新')
}

const handleExportLog = () => {
  ElMessage.success('日志导出成功')
}

const handleClearLog = () => {
  ElMessageBox.confirm(
    '确定要清空所有日志吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    logData.value = []
    ElMessage.success('日志已清空')
  })
}

const handleBackup = () => {
  ElMessage.success('数据备份成功')
}

const handleUpdate = () => {
  ElMessage.info('当前已是最新版本')
}

const handleRestart = () => {
  ElMessageBox.confirm(
    '确定要重启系统吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('系统重启中...')
  })
}

const handleClearCache = () => {
  ElMessageBox.confirm(
    '确定要清除系统缓存吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('缓存已清除')
  })
}

const handleReset = () => {
  ElMessageBox.confirm(
    '确定要重置系统吗？此操作将清除所有数据！',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'danger',
    }
  ).then(() => {
    ElMessage.success('系统重置中...')
  })
}
</script>

<style scoped>
.system-maintenance-container {
  padding: 20px;
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

.header-actions {
  display: flex;
  gap: 10px;
}

.status-card {
  margin-bottom: 20px;
}

.log-card {
  margin-bottom: 20px;
}

.settings-card {
  margin-bottom: 20px;
}

.actions-card {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
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