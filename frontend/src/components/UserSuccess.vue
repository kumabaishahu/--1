<template>
  <div class="user-success">
    <!-- 顶部横幅 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>智能培训解决方案</h1>
        <p class="subtitle">为企业提供全方位的智能培训服务</p>
        <div class="cta-buttons">
          <el-button type="primary" size="large">立即体验</el-button>
          <el-button size="large">了解更多</el-button>
        </div>
      </div>
    </div>

    <!-- 特性展示 -->
    <div class="features-section">
      <el-row :gutter="40">
        <el-col :span="8" v-for="feature in features" :key="feature.title">
          <div class="feature-card">
            <el-icon class="feature-icon" :size="48">
              <component :is="feature.icon" />
            </el-icon>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 数据统计 -->
    <div class="stats-section">
      <el-row :gutter="40">
        <el-col :span="6" v-for="stat in statistics" :key="stat.label">
          <div class="stat-card">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 客户案例 -->
    <div class="cases-section">
      <h2>成功案例</h2>
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="caseItem in cases" :key="caseItem.title">
          <div class="case-card">
            <img :src="caseItem.image" :alt="caseItem.title">
            <h3>{{ caseItem.title }}</h3>
            <p>{{ caseItem.description }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 联系我们 -->
    <div class="contact-section">
      <h2>联系我们</h2>
      <el-form :model="contactForm" label-width="80px" class="contact-form">
        <el-form-item label="姓名">
          <el-input v-model="contactForm.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="contactForm.email" />
        </el-form-item>
        <el-form-item label="留言">
          <el-input type="textarea" v-model="contactForm.message" rows="4" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitContact">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Monitor, 
  DataLine, 
  Setting,
  User,
  Service,
  Tools
} from '@element-plus/icons-vue'

const features = [
  {
    icon: 'Monitor',
    title: '智能培训系统',
    description: '基于AI的个性化学习路径，提供最佳学习体验'
  },
  {
    icon: 'DataLine',
    title: '数据分析',
    description: '实时监控学习进度，提供详细的数据分析报告'
  },
  {
    icon: 'Setting',
    title: '系统集成',
    description: '无缝对接企业现有系统，提供完整的培训解决方案'
  }
]

const statistics = [
  { value: '1000+', label: '服务企业' },
  { value: '50000+', label: '培训学员' },
  { value: '98%', label: '客户满意度' },
  { value: '24/7', label: '技术支持' }
]

const cases = [
  {
    title: '某大型制造企业',
    description: '通过我们的培训系统，员工技能提升率达到85%',
    image: 'https://via.placeholder.com/400x300'
  },
  {
    title: '某科技公司',
    description: '培训效率提升200%，培训成本降低50%',
    image: 'https://via.placeholder.com/400x300'
  },
  {
    title: '某教育机构',
    description: '学员满意度提升至95%，续约率提升40%',
    image: 'https://via.placeholder.com/400x300'
  }
]

const contactForm = ref({
  name: '',
  email: '',
  message: ''
})

const submitContact = () => {
  // 处理表单提交
  console.log('提交表单:', contactForm.value)
}
</script>

<style scoped>
.user-success {
  padding: 0;
  margin: 0;
  width: 100%;
}

.hero-section {
  height: 600px;
  background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
}

.hero-content {
  max-width: 800px;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: 600;
}

.subtitle {
  font-size: 24px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.features-section {
  padding: 80px 40px;
  background: white;
}

.feature-card {
  text-align: center;
  padding: 40px 20px;
  border-radius: 8px;
  transition: transform 0.3s ease;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-10px);
}

.feature-icon {
  color: #1a73e8;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #2c3e50;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.stats-section {
  padding: 60px 40px;
  background: #f8f9fa;
}

.stat-card {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 36px;
  font-weight: 600;
  color: #1a73e8;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
  font-size: 18px;
}

.cases-section {
  padding: 80px 40px;
  background: white;
  text-align: center;
}

.cases-section h2 {
  margin-bottom: 40px;
  font-size: 36px;
  color: #2c3e50;
}

.case-card {
  height: 100%;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.case-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 20px;
}

.case-card h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #2c3e50;
}

.case-card p {
  color: #666;
  line-height: 1.6;
}

.contact-section {
  padding: 80px 40px;
  background: #f8f9fa;
  text-align: center;
}

.contact-section h2 {
  margin-bottom: 40px;
  font-size: 36px;
  color: #2c3e50;
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 36px;
  }

  .subtitle {
    font-size: 20px;
  }

  .features-section,
  .stats-section,
  .cases-section,
  .contact-section {
    padding: 40px 20px;
  }

  .cta-buttons {
    flex-direction: column;
  }
}
</style> 