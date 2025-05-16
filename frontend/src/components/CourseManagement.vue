<template>
  <div class="course-management">
    <el-steps :active="activeStep" finish-status="success" class="mb-4">
      <el-step title="上传课程"></el-step>
      <el-step title="编辑内容"></el-step>
      <el-step title="发布设置"></el-step>
      <el-step title="课程列表"></el-step>
    </el-steps>

    <!-- 上传课程 -->
    <div v-if="activeStep === 0" class="step-content">
      <el-upload
        class="upload-demo"
        drag
        action="/api/course/upload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">支持上传PPT、PDF、Word等格式文件</div>
        </template>
      </el-upload>
    </div>

    <!-- 编辑内容 -->
    <div v-if="activeStep === 1" class="step-content">
      <el-form :model="courseForm" label-width="120px">
        <el-form-item label="课程名称">
          <el-input v-model="courseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input type="textarea" v-model="courseForm.description"></el-input>
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="courseForm.category">
            <el-option label="技术培训" value="tech"></el-option>
            <el-option label="管理培训" value="management"></el-option>
            <el-option label="通用技能" value="general"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 发布设置 -->
    <div v-if="activeStep === 2" class="step-content">
      <el-form :model="publishForm" label-width="120px">
        <el-form-item label="发布时间">
          <el-date-picker v-model="publishForm.publishDate" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="学习时限">
          <el-input-number v-model="publishForm.duration" :min="1"></el-input-number>
          <span class="ml-2">天</span>
        </el-form-item>
        <el-form-item label="可见范围">
          <el-radio-group v-model="publishForm.visibility">
            <el-radio label="all">所有人可见</el-radio>
            <el-radio label="department">指定部门</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <!-- 课程列表 -->
    <div v-if="activeStep === 3" class="step-content">
      <el-table :data="courseList" style="width: 100%">
        <el-table-column prop="name" label="课程名称"></el-table-column>
        <el-table-column prop="category" label="分类"></el-table-column>
        <el-table-column prop="publishDate" label="发布时间"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="step-actions">
      <el-button v-if="activeStep > 0" @click="previousStep">上一步</el-button>
      <el-button v-if="activeStep < 3" type="primary" @click="nextStep">下一步</el-button>
      <el-button v-if="activeStep === 3" type="success" @click="finishProcess">完成</el-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

export default {
  name: 'CourseManagement',
  components: {
    UploadFilled
  },
  setup() {
    const activeStep = ref(0)
    const courseForm = reactive({
      name: '',
      description: '',
      category: ''
    })
    const publishForm = reactive({
      publishDate: '',
      duration: 7,
      visibility: 'all'
    })
    const courseList = ref([])

    const nextStep = () => {
      if (activeStep.value < 3) activeStep.value++
    }

    const previousStep = () => {
      if (activeStep.value > 0) activeStep.value--
    }

    const handleUploadSuccess = (response) => {
      // 处理上传成功
      nextStep()
    }

    const handleUploadError = (error) => {
      // 处理上传失败
      console.error('Upload failed:', error)
    }

    const handleEdit = (row) => {
      // 处理编辑操作
    }

    const handleDelete = (row) => {
      // 处理删除操作
    }

    const finishProcess = () => {
      // 完成整个流程
    }

    return {
      activeStep,
      courseForm,
      publishForm,
      courseList,
      nextStep,
      previousStep,
      handleUploadSuccess,
      handleUploadError,
      handleEdit,
      handleDelete,
      finishProcess
    }
  }
}
</script>

<style scoped>
.course-management {
  padding: 20px;
}

.step-content {
  margin: 20px 0;
  min-height: 300px;
}

.step-actions {
  margin-top: 20px;
  text-align: right;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.upload-demo {
  width: 360px;
  margin: 0 auto;
}
</style>
