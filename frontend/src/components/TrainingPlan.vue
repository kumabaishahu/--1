<template>
  <div class="training-plan-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <h2>培训计划</h2>
          <el-button type="primary" @click="handleAddPlan">新增计划</el-button>
        </div>
      </template>
      <div class="card-content">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="进行中" name="ongoing">
            <el-timeline>
              <el-timeline-item
                v-for="plan in ongoingPlans"
                :key="plan.id"
                :timestamp="plan.startTime"
                :type="plan.type">
                <el-card>
                  <h4>{{ plan.title }}</h4>
                  <p>{{ plan.description }}</p>
                  <div class="plan-actions">
                    <el-button type="primary" link @click="handleEditPlan(plan)">编辑</el-button>
                    <el-button type="danger" link @click="handleDeletePlan(plan)">删除</el-button>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
          <el-tab-pane label="已完成" name="completed">
            <el-timeline>
              <el-timeline-item
                v-for="plan in completedPlans"
                :key="plan.id"
                :timestamp="plan.endTime"
                type="success">
                <el-card>
                  <h4>{{ plan.title }}</h4>
                  <p>{{ plan.description }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 计划表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增计划' : '编辑计划'"
      width="500px">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px">
        <el-form-item label="计划标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入计划标题" />
        </el-form-item>
        <el-form-item label="计划类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择计划类型">
            <el-option label="内部培训" value="internal" />
            <el-option label="外部培训" value="external" />
            <el-option label="在线培训" value="online" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间" />
        </el-form-item>
        <el-form-item label="培训讲师" prop="trainer">
          <el-input v-model="form.trainer" placeholder="请输入培训讲师" />
        </el-form-item>
        <el-form-item label="培训地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入培训地点" />
        </el-form-item>
        <el-form-item label="计划描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            rows="3"
            placeholder="请输入计划描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, onDeactivated } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 组件状态
const activeTab = ref('ongoing')
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

// 表单数据
const form = ref({
  title: '',
  type: '',
  startTime: '',
  endTime: '',
  trainer: '',
  location: '',
  description: ''
})

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入计划标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择计划类型', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  trainer: [{ required: true, message: '请输入培训讲师', trigger: 'blur' }],
  location: [{ required: true, message: '请输入培训地点', trigger: 'blur' }]
}

// 模拟数据
const ongoingPlans = ref([
  {
    id: 1,
    title: '新员工入职培训',
    type: 'primary',
    description: '针对新入职员工的系统使用培训',
    startTime: '2024-03-20 09:00',
    endTime: '2024-03-20 17:00',
    trainer: '张讲师',
    location: '培训室A'
  }
])

const completedPlans = ref([
  {
    id: 2,
    title: '系统升级培训',
    type: 'success',
    description: '系统新功能使用培训',
    startTime: '2024-03-15 09:00',
    endTime: '2024-03-15 17:00',
    trainer: '李讲师',
    location: '培训室B'
  }
])

// 生命周期钩子
onMounted(() => {
  console.log('TrainingPlan component mounted')
})

onActivated(() => {
  console.log('TrainingPlan component activated')
})

onDeactivated(() => {
  console.log('TrainingPlan component deactivated')
})

// 方法
const handleAddPlan = () => {
  dialogType.value = 'add'
  form.value = {
    title: '',
    type: '',
    startTime: '',
    endTime: '',
    trainer: '',
    location: '',
    description: ''
  }
  dialogVisible.value = true
}

const handleEditPlan = (plan) => {
  dialogType.value = 'edit'
  form.value = { ...plan }
  dialogVisible.value = true
}

const handleDeletePlan = (plan) => {
  ElMessageBox.confirm(
    '确定要删除该培训计划吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟删除操作
    const index = ongoingPlans.value.findIndex(p => p.id === plan.id)
    if (index !== -1) {
      ongoingPlans.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 模拟添加操作
        ongoingPlans.value.push({
          id: Date.now(),
          ...form.value
        })
        ElMessage.success('添加成功')
      } else {
        // 模拟编辑操作
        const index = ongoingPlans.value.findIndex(p => p.id === form.value.id)
        if (index !== -1) {
          ongoingPlans.value[index] = { ...form.value }
        }
        ElMessage.success('编辑成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.training-plan-container {
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

.plan-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

:deep(.el-timeline-item__content) {
  width: 100%;
}

:deep(.el-timeline-item__node) {
  background-color: var(--el-color-primary);
}

:deep(.el-timeline-item__tail) {
  border-left: 2px solid var(--el-border-color-light);
}
</style> 