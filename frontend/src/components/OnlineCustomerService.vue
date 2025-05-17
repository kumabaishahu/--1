<template>
  <div class="customer-service">
    <!-- 左侧联系人列表 -->
    <div class="contact-list">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索联系人"
          prefix-icon="Search"
          clearable
        />
      </div>
      
      <div class="contact-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="最近联系" name="recent">
            <div class="contact-item" 
                 v-for="contact in recentContacts" 
                 :key="contact.id"
                 :class="{ active: currentContact?.id === contact.id }"
                 @click="selectContact(contact)">
              <el-avatar :size="40" :src="contact.avatar" />
              <div class="contact-info">
                <div class="contact-name">{{ contact.name }}</div>
                <div class="contact-message">{{ contact.lastMessage }}</div>
              </div>
              <div class="contact-meta">
                <span class="time">{{ contact.lastTime }}</span>
                <el-badge v-if="contact.unread" :value="contact.unread" class="unread" />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="在线客服" name="online">
            <div class="contact-item" 
                 v-for="contact in onlineContacts" 
                 :key="contact.id"
                 :class="{ active: currentContact?.id === contact.id }"
                 @click="selectContact(contact)">
              <el-avatar :size="40" :src="contact.avatar" />
              <div class="contact-info">
                <div class="contact-name">{{ contact.name }}</div>
                <div class="contact-status" :class="contact.status">
                  {{ contact.status === 'online' ? '在线' : '离线' }}
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-area">
      <template v-if="currentContact">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <div class="contact-info">
            <el-avatar :size="40" :src="currentContact.avatar" />
            <div class="contact-details">
              <div class="contact-name">{{ currentContact.name }}</div>
              <div class="contact-status" :class="currentContact.status">
                {{ currentContact.status === 'online' ? '在线' : '离线' }}
              </div>
            </div>
          </div>
          <div class="header-actions">
            <el-button type="text" icon="Phone">语音通话</el-button>
            <el-button type="text" icon="VideoCamera">视频通话</el-button>
            <el-button type="text" icon="More">更多</el-button>
          </div>
        </div>

        <!-- 聊天内容 -->
        <div class="chat-messages" ref="messageContainer">
          <div v-for="message in messages" 
               :key="message.id" 
               class="message"
               :class="{ 'message-self': message.isSelf }">
            <el-avatar :size="36" :src="message.isSelf ? userAvatar : currentContact.avatar" />
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input">
          <div class="input-toolbar">
            <el-button-group>
              <el-button type="text" icon="Picture">图片</el-button>
              <el-button type="text" icon="Folder">文件</el-button>
              <el-button type="text" icon="ChatDotRound">表情</el-button>
            </el-button-group>
          </div>
          <div class="input-area">
            <el-input
              v-model="messageInput"
              type="textarea"
              :rows="3"
              placeholder="请输入消息"
              resize="none"
              @keyup.enter.ctrl="sendMessage"
            />
          </div>
          <div class="input-actions">
            <el-button type="primary" @click="sendMessage">发送</el-button>
          </div>
        </div>
      </template>
      <div v-else class="no-chat">
        <el-empty description="选择一个联系人开始聊天" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Search, Phone, VideoCamera, More, Picture, Folder, ChatDotRound } from '@element-plus/icons-vue'

const searchQuery = ref('')
const activeTab = ref('recent')
const currentContact = ref(null)
const messageInput = ref('')
const messageContainer = ref(null)
const userAvatar = 'https://via.placeholder.com/40'

// 模拟数据
const recentContacts = ref([
  {
    id: 1,
    name: '客服小美',
    avatar: 'https://via.placeholder.com/40',
    lastMessage: '您好，有什么可以帮您？',
    lastTime: '10:30',
    unread: 2,
    status: 'online'
  },
  {
    id: 2,
    name: '技术支持',
    avatar: 'https://via.placeholder.com/40',
    lastMessage: '问题已经解决了吗？',
    lastTime: '昨天',
    unread: 0,
    status: 'offline'
  }
])

const onlineContacts = ref([
  {
    id: 1,
    name: '客服小美',
    avatar: 'https://via.placeholder.com/40',
    status: 'online'
  },
  {
    id: 2,
    name: '技术支持',
    avatar: 'https://via.placeholder.com/40',
    status: 'offline'
  }
])

const messages = ref([
  {
    id: 1,
    content: '您好，欢迎使用智能培训系统，我是客服小美，很高兴为您服务！',
    time: '10:30',
    isSelf: false
  },
  {
    id: 2,
    content: '你好，我想了解一下系统的使用方法',
    time: '10:31',
    isSelf: true
  }
])

const selectContact = (contact) => {
  currentContact.value = contact
  // 模拟加载历史消息
  messages.value = [
    {
      id: 1,
      content: `您好，我是${contact.name}，很高兴为您服务！`,
      time: '10:30',
      isSelf: false
    }
  ]
  nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = () => {
  if (!messageInput.value.trim()) return
  
  messages.value.push({
    id: Date.now(),
    content: messageInput.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isSelf: true
  })
  
  messageInput.value = ''
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

onMounted(() => {
  // 初始化时滚动到底部
  scrollToBottom()
})
</script>

<style scoped>
.customer-service {
  display: flex;
  height: calc(100vh - 70px);
  overflow: hidden;
}

.contact-list {
  width: 300px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-box {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.contact-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.contact-tabs :deep(.el-tabs) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.contact-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

.contact-tabs :deep(.el-tab-pane) {
  height: 100%;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex-shrink: 0;
}

.contact-item:hover {
  background-color: #f5f7fa;
}

.contact-item.active {
  background-color: #ecf5ff;
}

.contact-info {
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
}

.contact-name {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.contact-message {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 12px;
}

.time {
  font-size: 12px;
  color: #909399;
}

.contact-status {
  font-size: 12px;
}

.contact-status.online {
  color: #67c23a;
}

.contact-status.offline {
  color: #909399;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-details {
  margin-left: 12px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f5f7fa;
}

.message {
  display: flex;
  margin-bottom: 20px;
}

.message-self {
  flex-direction: row-reverse;
}

.message-content {
  margin: 0 12px;
  max-width: 60%;
}

.message-text {
  padding: 12px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-break: break-word;
}

.message-self .message-text {
  background: #ecf5ff;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  text-align: right;
}

.chat-input {
  border-top: 1px solid #e4e7ed;
  padding: 16px;
}

.input-toolbar {
  margin-bottom: 8px;
}

.input-area {
  margin-bottom: 8px;
}

.input-actions {
  text-align: right;
}

.no-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}
</style>
