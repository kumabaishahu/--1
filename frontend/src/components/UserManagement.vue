<template>
    <div class="user-management">
      <h2>用户管理</h2>
      
      <!-- 用户列表 -->
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加/编辑用户对话框 -->
      <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="userForm.password"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="userForm.role">
              <el-option label="管理员" value="admin"></el-option>
              <el-option label="普通用户" value="user"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveUser">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserManagement',
    data() {
      return {
        users: [],
        dialogVisible: false,
        dialogTitle: '添加用户',
        userForm: {
          username: '',
          email: '',
          password: '',
          role: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          role: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      // 获取用户列表
      async fetchUsers() {
        try {
          const response = await this.$http.get('/api/users')
          this.users = response.data
        } catch (error) {
          this.$message.error('获取用户列表失败')
        }
      },
      
      // 编辑用户
      editUser(user) {
        this.dialogTitle = '编辑用户'
        this.userForm = { ...user }
        this.dialogVisible = true
      },
      
      // 删除用户
      async deleteUser(user) {
        try {
          await this.$confirm('确认删除该用户?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          
          await this.$http.delete(`/api/users/${user.id}`)
          this.$message.success('删除成功')
          this.fetchUsers()
        } catch (error) {
          if (error !== 'cancel') {
            this.$message.error('删除失败')
          }
        }
      },
      
      // 保存用户
      async saveUser() {
        try {
          await this.$refs.userForm.validate()
          
          if (this.userForm.id) {
            // 更新用户
            await this.$http.put(`/api/users/${this.userForm.id}`, this.userForm)
            this.$message.success('更新成功')
          } else {
            // 添加用户
            await this.$http.post('/api/users', this.userForm)
            this.$message.success('添加成功')
          }
          
          this.dialogVisible = false
          this.fetchUsers()
        } catch (error) {
          this.$message.error('保存失败')
        }
      }
    },
    mounted() {
      this.fetchUsers()
    }
  }
  </script>
  
  <style scoped>
  .user-management {
    padding: 20px;
  }
  
  .dialog-footer {
    text-align: right;
  }
  </style>
  