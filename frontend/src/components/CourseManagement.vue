<template>
  <div class="course-management-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <h2>课程管理</h2>
          <el-button type="primary" @click="handleUpload">
            <el-icon><Upload /></el-icon>上传课程
          </el-button>
        </div>
      </template>
      
      <div class="card-content">
        <!-- 标签页切换 -->
        <el-tabs v-model="activeTab">
          <el-tab-pane label="我的课程" name="myCourses">
            <!-- 搜索栏 -->
            <div class="search-bar">
              <el-input
                v-model="searchQuery"
                placeholder="搜索课程名称"
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
              :data="filteredTableData"
              style="width: 100%"
              border
              v-loading="loading"
            >
              <el-table-column prop="name" label="课程名称" />
              <el-table-column prop="fileSize" label="文件大小" width="120" />
              <el-table-column prop="duration" label="时长" width="120" />
              <el-table-column prop="uploadTime" label="上传时间" width="180" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="250" fixed="right">
                <template #default="{ row }">
                  <el-button-group>
                    <el-button 
                      type="primary" 
                      link 
                      :disabled="row.status === 'published'"
                      @click="handleEdit(row)"
                    >
                      编辑
                    </el-button>
                    <el-button 
                      type="success" 
                      link
                      :disabled="row.status === 'published'"
                      @click="handlePublish(row)"
                    >
                      发布
                    </el-button>
                    <el-button type="primary" link @click="handlePreview(row)">
                      预览
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
          </el-tab-pane>
          
          <el-tab-pane label="历史记录" name="history">
            <!-- 历史记录列表，结构类似但显示已发布的课程 -->
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 上传/编辑课程对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'upload' ? '上传课程' : '编辑课程'"
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
        <el-form-item label="课程文件" prop="file">
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="false"
            :accept="'.mp4'"
            :limit="1"
            :before-upload="beforeUpload"
            :on-change="handleFileChange"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 mp4 文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程简介" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            rows="3"
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

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="课程预览"
      width="800px"
      class="preview-dialog"
    >
      <video 
        v-if="selectedCourse"
        :src="selectedCourse.url" 
        controls 
        style="width: 100%"
      ></video>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Search, Upload, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 数据
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const previewVisible = ref(false)
const dialogType = ref('upload')
const activeTab = ref('myCourses')
const formRef = ref(null)
const selectedCourse = ref(null)

// 表单数据
const form = reactive({
  name: '',
  file: null,
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  file: [
    { required: true, message: '请上传课程文件', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入课程简介', trigger: 'blur' }
  ]
}

// 模拟数据
const tableData = ref([
  {
    id: 1,
    name: 'Vue基础教程.mp4',
    fileSize: '256MB',
    duration: '45分钟',
    uploadTime: '2023-12-01 10:00:00',
    status: 'draft',
    url: 'https://example.com/video1.mp4'
  },
  {
    id: 2,
    name: 'React入门实战.mp4',
    fileSize: '320MB',
    duration: '60分钟',
    uploadTime: '2023-12-02 14:30:00',
    status: 'published',
    url: 'https://example.com/video2.mp4'
  }
])

// 过滤后的表格数据
const filteredTableData = computed(() => {
  if (!searchQuery.value) return tableData.value
  return tableData.value.filter(item => 
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 计算总数
const total = computed(() => filteredTableData.value.length)

const getStatusType = (status) => {
  const types = {
    draft: 'info',
    published: 'success',
    reviewing: 'warning'
  }
  return types[status]
}

const getStatusText = (status) => {
  const texts = {
    draft: '草稿',
    published: '已发布',
    reviewing: '审核中'
  }
  return texts[status]
}

const beforeUpload = (file) => {
  const isMP4 = file.type === 'video/mp4'
  if (!isMP4) {
    ElMessage.error('只能上传 MP4 格式的视频文件!')
    return false
  }
  return true
}

const handleFileChange = (file) => {
  form.file = file.raw
}

const handleUpload = () => {
  dialogType.value = 'upload'
  dialogVisible.value = true
  Object.assign(form, {
    name: '',
    file: null,
    description: ''
  })
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(form, row)
}

const handlePreview = (row) => {
  selectedCourse.value = row
  previewVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'upload') {
        // 添加新课程
        const newCourse = {
          id: Date.now(),
          name: form.name,
          fileSize: '0MB', // 这里可以计算实际文件大小
          duration: '0分钟', // 这里可以计算实际视频时长
          uploadTime: new Date().toLocaleString(),
          status: 'draft',
          url: URL.createObjectURL(form.file),
          description: form.description
        }
        tableData.value.unshift(newCourse)
      } else {
        // 编辑现有课程
        const index = tableData.value.findIndex(item => item.id === form.id)
        if (index !== -1) {
          tableData.value[index] = { ...tableData.value[index], ...form }
        }
      }
      
      ElMessage.success(dialogType.value === 'upload' ? '上传成功' : '修改成功')
      dialogVisible.value = false
    }
  })
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
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  })
}

const handlePublish = (row) => {
  ElMessageBox.confirm(
    '确定要发布该课程吗？发布后将不能修改',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      tableData.value[index] = { ...row, status: 'published' }
    }
    ElMessage.success('课程发布成功')
  })
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
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

.preview-dialog :deep(.el-dialog__body) {
  padding: 0;
  background: #000;
}
</style>
