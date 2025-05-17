<template>
  <div class="study-record-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <h2>学习记录</h2>
          <div class="header-actions">
            <el-button type="primary" @click="handleExport">
              <el-icon><Download /></el-icon>导出记录
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="card-content">
        <!-- 筛选条件 -->
        <div class="filter-section">
          <el-form :inline="true" :model="filterForm" class="filter-form">
            <el-form-item label="用户">
              <el-input v-model="filterForm.user" placeholder="用户名/邮箱" clearable />
            </el-form-item>
            <el-form-item label="课程">
              <el-select v-model="filterForm.course" placeholder="选择课程" clearable>
                <el-option label="Vue.js 高级教程" value="vue" />
                <el-option label="项目管理实战" value="project" />
              </el-select>
            </el-form-item>
            <el-form-item label="学习状态">
              <el-select v-model="filterForm.status" placeholder="选择状态" clearable>
                <el-option label="进行中" value="in_progress" />
                <el-option label="已完成" value="completed" />
                <el-option label="未开始" value="not_started" />
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilter">筛选</el-button>
              <el-button @click="resetFilter">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 数据表格 -->
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="userName" label="用户名" width="120" />
          <el-table-column prop="courseName" label="课程名称" />
          <el-table-column prop="progress" label="学习进度" width="120">
            <template #default="{ row }">
              <el-progress :percentage="row.progress" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastStudyTime" label="最后学习时间" width="180" />
          <el-table-column prop="totalTime" label="总学习时长" width="120" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" link @click="handleView(row)">
                  查看详情
                </el-button>
                <el-button type="primary" link @click="handleReset(row)">
                  重置进度
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="学习详情"
      width="800px"
    >
      <div v-if="currentRecord" class="study-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">{{ currentRecord.userName }}</el-descriptions-item>
          <el-descriptions-item label="课程名称">{{ currentRecord.courseName }}</el-descriptions-item>
          <el-descriptions-item label="学习进度">
            <el-progress :percentage="currentRecord.progress" />
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentRecord.status)">
              {{ getStatusText(currentRecord.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ currentRecord.startTime }}</el-descriptions-item>
          <el-descriptions-item label="最后学习时间">{{ currentRecord.lastStudyTime }}</el-descriptions-item>
          <el-descriptions-item label="总学习时长">{{ currentRecord.totalTime }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ currentRecord.completeTime || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div class="study-timeline">
          <h3>学习记录</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in currentRecord.activities"
              :key="index"
              :timestamp="activity.time"
              :type="activity.type"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onActivated, onDeactivated } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 组件状态
const isActive = ref(false)

// 生命周期钩子
onMounted(() => {
  console.log('StudyRecord component mounted')
})

onActivated(() => {
  isActive.value = true
  console.log('StudyRecord component activated')
})

onDeactivated(() => {
  isActive.value = false
  console.log('StudyRecord component deactivated')
})

// 数据
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDialogVisible = ref(false)
const currentRecord = ref(null)

// 筛选表单
const filterForm = reactive({
  user: '',
  course: '',
  status: '',
  dateRange: []
})

// 模拟数据
const tableData = ref([
  {
    id: 1,
    userName: '张三',
    courseName: 'Vue.js 高级教程',
    progress: 75,
    status: 'in_progress',
    lastStudyTime: '2024-01-15 14:30:00',
    totalTime: '12小时',
    startTime: '2024-01-01 09:00:00',
    completeTime: null,
    activities: [
      {
        time: '2024-01-15 14:30:00',
        type: 'primary',
        content: '完成第3章学习'
      },
      {
        time: '2024-01-14 16:20:00',
        type: 'success',
        content: '完成第2章测验'
      },
      {
        time: '2024-01-01 09:00:00',
        type: 'info',
        content: '开始学习课程'
      }
    ]
  },
  {
    id: 2,
    userName: '李四',
    courseName: '项目管理实战',
    progress: 100,
    status: 'completed',
    lastStudyTime: '2024-01-10 16:45:00',
    totalTime: '20小时',
    startTime: '2024-01-01 09:00:00',
    completeTime: '2024-01-10 16:45:00',
    activities: [
      {
        time: '2024-01-10 16:45:00',
        type: 'success',
        content: '完成课程学习'
      },
      {
        time: '2024-01-09 15:30:00',
        type: 'primary',
        content: '完成最终项目'
      },
      {
        time: '2024-01-01 09:00:00',
        type: 'info',
        content: '开始学习课程'
      }
    ]
  }
])

// 方法
const getStatusType = (status) => {
  const types = {
    in_progress: 'warning',
    completed: 'success',
    not_started: 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    in_progress: '进行中',
    completed: '已完成',
    not_started: '未开始'
  }
  return texts[status] || '未知'
}

const handleFilter = () => {
  // 实现筛选逻辑
  console.log('筛选条件:', filterForm)
}

const resetFilter = () => {
  Object.assign(filterForm, {
    user: '',
    course: '',
    status: '',
    dateRange: []
  })
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleView = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

const handleReset = (row) => {
  ElMessageBox.confirm(
    '确定要重置该用户的学习进度吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现重置逻辑
    ElMessage.success('重置成功')
  })
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
.study-record-container {
  padding: 20px;
}

.page-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.card-content {
  min-height: 400px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.study-detail {
  padding: 20px;
}

.study-timeline {
  margin-top: 30px;
}

.study-timeline h3 {
  margin-bottom: 20px;
  color: #2c3e50;
}
</style>
