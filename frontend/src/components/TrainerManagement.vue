<template>
  <div class="trainer-management-container">
    <el-row :gutter="20">
      <!-- 讲师列表 -->
      <el-col :span="16">
        <el-card class="trainer-list-card">
          <template #header>
            <div class="card-header">
              <span>讲师列表</span>
              <div class="header-actions">
                <el-input
                  v-model="searchQuery"
                  placeholder="搜索讲师"
                  style="width: 200px"
                  clearable
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-button type="primary" @click="handleAdd">
                  添加讲师
                </el-button>
              </div>
            </div>
          </template>

          <el-table :data="filteredTrainers" style="width: 100%" border>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="specialty" label="专长领域" />
            <el-table-column prop="rating" label="评分" width="120">
              <template #default="{ row }">
                <el-rate
                  v-model="row.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                  {{ row.status === 'active' ? '在职' : '离职' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button type="primary" link @click="handleEdit(row)">
                    编辑
                  </el-button>
                  <el-button type="primary" link @click="handleSchedule(row)">
                    排课
                  </el-button>
                  <el-button type="primary" link @click="handleEvaluation(row)">
                    评价
                  </el-button>
                  <el-button type="danger" link @click="handleDelete(row)">
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 讲师统计 -->
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>讲师统计</span>
            </div>
          </template>
          <div class="stat-content">
            <div class="stat-item">
              <div class="stat-label">总讲师数</div>
              <div class="stat-value">{{ totalTrainers }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">在职讲师</div>
              <div class="stat-value">{{ activeTrainers }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">平均评分</div>
              <div class="stat-value">{{ averageRating }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">本月课程数</div>
              <div class="stat-value">{{ monthlyCourses }}</div>
            </div>
          </div>
        </el-card>

        <!-- 专长分布 -->
        <el-card class="specialty-card">
          <template #header>
            <div class="card-header">
              <span>专长分布</span>
            </div>
          </template>
          <div class="specialty-content">
            <!-- 这里放置饼图 -->
            <div class="chart-placeholder">
              专长分布饼图
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 讲师表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加讲师' : '编辑讲师'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="专长领域" prop="specialty">
          <el-select v-model="form.specialty" placeholder="请选择专长领域">
            <el-option label="前端开发" value="frontend" />
            <el-option label="后端开发" value="backend" />
            <el-option label="数据库" value="database" />
            <el-option label="项目管理" value="project" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 评价对话框 -->
    <el-dialog
      v-model="evaluationDialogVisible"
      title="讲师评价"
      width="600px"
    >
      <div v-if="currentTrainer" class="evaluation-content">
        <el-form :model="evaluationForm" label-width="100px">
          <el-form-item label="课程评分">
            <el-rate v-model="evaluationForm.rating" />
          </el-form-item>
          <el-form-item label="评价内容">
            <el-input
              v-model="evaluationForm.content"
              type="textarea"
              :rows="4"
              placeholder="请输入评价内容"
            />
          </el-form-item>
          <el-form-item label="评价标签">
            <el-select
              v-model="evaluationForm.tags"
              multiple
              placeholder="请选择标签"
            >
              <el-option label="专业水平高" value="professional" />
              <el-option label="讲解清晰" value="clear" />
              <el-option label="互动性好" value="interactive" />
              <el-option label="课程准备充分" value="prepared" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="evaluationDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEvaluation">
            提交评价
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onActivated, onDeactivated } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 组件状态
const isActive = ref(false)

// 生命周期钩子
onMounted(() => {
  console.log('TrainerManagement component mounted')
})

onActivated(() => {
  isActive.value = true
  console.log('TrainerManagement component activated')
})

onDeactivated(() => {
  isActive.value = false
  console.log('TrainerManagement component deactivated')
})

// 数据
const searchQuery = ref('')
const dialogVisible = ref(false)
const dialogType = ref('add')
const evaluationDialogVisible = ref(false)
const currentTrainer = ref(null)
const formRef = ref(null)

// 表单数据
const form = reactive({
  name: '',
  specialty: '',
  contact: '',
  status: 'active',
  description: ''
})

// 评价表单
const evaluationForm = reactive({
  rating: 0,
  content: '',
  tags: []
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入讲师姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  specialty: [
    { required: true, message: '请选择专长领域', trigger: 'change' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 模拟数据
const trainers = ref([
  {
    id: 1,
    name: '张老师',
    specialty: '前端开发',
    rating: 4.5,
    status: 'active',
    contact: '13800138000',
    description: '资深前端开发工程师，擅长Vue.js和React'
  },
  {
    id: 2,
    name: '李老师',
    specialty: '后端开发',
    rating: 4.8,
    status: 'active',
    contact: '13900139000',
    description: '全栈开发工程师，擅长Java和Python'
  }
])

// 计算属性
const filteredTrainers = computed(() => {
  if (!searchQuery.value) return trainers.value
  return trainers.value.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    trainer.specialty.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalTrainers = computed(() => trainers.value.length)
const activeTrainers = computed(() => 
  trainers.value.filter(t => t.status === 'active').length
)
const averageRating = computed(() => {
  const sum = trainers.value.reduce((acc, curr) => acc + curr.rating, 0)
  return (sum / trainers.value.length).toFixed(1)
})
const monthlyCourses = computed(() => 15) // 模拟数据

// 方法
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  // 重置表单
  Object.assign(form, {
    name: '',
    specialty: '',
    contact: '',
    status: 'active',
    description: ''
  })
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  // 填充表单数据
  Object.assign(form, row)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该讲师吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 实现删除逻辑
    ElMessage.success('删除成功')
  })
}

const handleSchedule = (row) => {
  // 实现排课逻辑
  ElMessage.info('排课功能开发中')
}

const handleEvaluation = (row) => {
  currentTrainer.value = row
  evaluationDialogVisible.value = true
  // 重置评价表单
  Object.assign(evaluationForm, {
    rating: 0,
    content: '',
    tags: []
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      // 实现提交逻辑
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
      dialogVisible.value = false
    }
  })
}

const submitEvaluation = () => {
  // 实现评价提交逻辑
  ElMessage.success('评价提交成功')
  evaluationDialogVisible.value = false
}
</script>

<style scoped>
.trainer-management-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.trainer-list-card {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 10px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.specialty-card {
  margin-bottom: 20px;
}

.specialty-content {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  color: #909399;
  font-size: 16px;
}

.evaluation-content {
  padding: 20px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style> 