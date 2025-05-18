<template>
  <div class="user-management-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <h2>用户管理</h2>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>添加用户
          </el-button>
        </div>
      </template>
      
      <div class="card-content">
        <!-- 搜索栏 -->
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户"
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>

        <!-- 数据表格 -->
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                {{ row.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" link @click="handleEdit(row)">
                  编辑
                </el-button>
                <el-button type="primary" link @click="handleReset(row)">
                  重置密码
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

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
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
import { ref, reactive, onMounted, onActivated, onDeactivated } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 组件状态
const isActive = ref(false)

// 生命周期钩子
onMounted(() => {
  console.log('UserManagement component mounted')
})

onActivated(() => {
  isActive.value = true
  console.log('UserManagement component activated')
})

onDeactivated(() => {
  isActive.value = false
  console.log('UserManagement component deactivated')
})

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
  email: '',
  role: '',
  status: 'active'
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 模拟数据
const tableData = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: 'active',
    createTime: '2024-01-01 12:00:00'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: '普通用户',
    status: 'active',
    createTime: '2024-01-02 12:00:00'
  }
])

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  // 重置表单
  Object.assign(form, {
    name: '',
    email: '',
    role: '',
    status: 'active'
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
    '确定要删除该用户吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  })
}

const handleReset = (row) => {
  ElMessageBox.confirm(
    '确定要重置该用户的密码吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('密码重置成功')
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 添加新用户
        const newUser = {
          id: Date.now(),
          name: form.name,
          email: form.email,
          role: form.role,
          status: form.status,
          createTime: new Date().toLocaleString()
        }
        tableData.value.unshift(newUser)
      } else {
        // 编辑现有用户
        const index = tableData.value.findIndex(item => item.id === form.id)
        if (index !== -1) {
          tableData.value[index] = { ...tableData.value[index], ...form }
        }
      }
      
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
      dialogVisible.value = false
    }
  })
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.user-management-container {
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
  