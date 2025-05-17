<template>
  <div class="course-management-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <h2>课程管理</h2>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>添加课程
          </el-button>
        </div>
      </template>
      
      <div class="card-content">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索课程"
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>

        <!-- 课程列表 -->
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="课程名称" />
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="instructor" label="讲师" width="120" />
          <el-table-column prop="duration" label="时长" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'">
                {{ row.status === 'active' ? '进行中' : '已结束' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" link @click="handleEdit(row)">
                  编辑
                </el-button>
                <el-button type="primary" link @click="handleView(row)">
                  查看
                </el-button>
                <el-button 
                  type="danger" 
                  link 
                  @click="handleDelete(row)"
                >
                  删除
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

    <!-- 课程表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加课程' : '编辑课程'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="技术课程" value="tech" />
            <el-option label="管理课程" value="management" />
            <el-option label="通用课程" value="general" />
          </el-select>
        </el-form-item>
        <el-form-item label="讲师" prop="instructor">
          <el-input v-model="form.instructor" />
        </el-form-item>
        <el-form-item label="时长" prop="duration">
          <el-input-number v-model="form.duration" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="'active'"
            :inactive-value="'inactive'"
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 数据
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)

// 表单数据
const form = reactive({
  name: '',
  category: '',
  instructor: '',
  duration: 1,
  status: 'active'
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  instructor: [
    { required: true, message: '请输入讲师姓名', trigger: 'blur' }
  ],
  duration: [
    { required: true, message: '请输入课程时长', trigger: 'change' }
  ]
}

// 模拟数据
const tableData = ref([
  {
    id: 1,
    name: 'Vue.js 高级教程',
    category: '技术课程',
    instructor: '张老师',
    duration: 40,
    status: 'active'
  },
  {
    id: 2,
    name: '项目管理实战',
    category: '管理课程',
    instructor: '李老师',
    duration: 30,
    status: 'active'
  }
])

// 方法
const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索:', searchQuery.value)
}

const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  // 重置表单
  Object.assign(form, {
    name: '',
    category: '',
    instructor: '',
    duration: 1,
    status: 'active'
  })
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  // 填充表单数据
  Object.assign(form, row)
}

const handleView = (row) => {
  // 实现查看课程详情逻辑
  console.log('查看课程:', row)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该课程吗？',
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

const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}

onMounted(() => {
  // 初始化加载数据
})
</script>

<style scoped>
.course-management-container {
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

.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.search-input {
  width: 300px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
