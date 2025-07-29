<template>
  <div class="examples">
    <div class="page-header">
      <h1>实例演示</h1>
      <p>Element Plus 实际应用场景演示</p>
    </div>

    <el-tabs v-model="activeTab" class="example-tabs">
      <!-- 用户管理示例 -->
      <el-tab-pane label="用户管理" name="user">
        <el-card class="example-card">
          <template #header>
            <div class="card-header">
              <span>用户列表</span>
              <el-button type="primary" @click="showAddUserDialog">
                <el-icon><Plus /></el-icon>
                添加用户
              </el-button>
            </div>
          </template>

          <!-- 搜索栏 -->
          <div class="search-bar">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入用户名搜索"
              style="width: 300px;"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="searchUsers">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </div>

          <!-- 用户表格 -->
          <el-table :data="filteredUsers" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="email" label="邮箱" width="200" />
            <el-table-column prop="role" label="角色" width="100">
              <template #default="{ row }">
                <el-tag :type="getRoleTagType(row.role)">{{ row.role }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-switch
                  v-model="row.status"
                  active-text="启用"
                  inactive-text="禁用"
                  @change="toggleUserStatus(row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button size="small" @click="editUser(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteUser(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="totalUsers"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>

        <!-- 添加/编辑用户对话框 -->
        <el-dialog
          v-model="userDialogVisible"
          :title="isEditMode ? '编辑用户' : '添加用户'"
          width="500px"
        >
          <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="80px">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userForm.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-select v-model="userForm.role" placeholder="请选择角色">
                <el-option label="管理员" value="admin" />
                <el-option label="用户" value="user" />
                <el-option label="访客" value="guest" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-switch v-model="userForm.status" active-text="启用" inactive-text="禁用" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="userDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="saveUser">确定</el-button>
            </span>
          </template>
        </el-dialog>
      </el-tab-pane>

      <!-- 数据统计示例 -->
      <el-tab-pane label="数据统计" name="stats">
        <el-row :gutter="24">
          <el-col :xs="24" :sm="12" :md="6" v-for="stat in statsData" :key="stat.title">
            <el-card class="stat-card" shadow="hover">
              <el-statistic
                :value="stat.value"
                :title="stat.title"
                :suffix="stat.suffix"
                :precision="stat.precision"
              >
                <template #prefix>
                  <el-icon :color="stat.color" :size="20">
                    <component :is="stat.icon" />
                  </el-icon>
                </template>
              </el-statistic>
              <div class="stat-trend">
                <el-icon :color="stat.trendColor">
                  <component :is="stat.trendIcon" />
                </el-icon>
                <span :style="{ color: stat.trendColor }">{{ stat.trend }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 图表区域 -->
        <el-row :gutter="24" style="margin-top: 24px;">
          <el-col :span="12">
            <el-card>
              <template #header>
                <span>用户增长趋势</span>
              </template>
              <div class="chart-placeholder">
                <el-empty description="图表组件演示区域" />
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <template #header>
                <span>访问来源分布</span>
              </template>
              <div class="chart-placeholder">
                <el-empty description="图表组件演示区域" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 表单示例 -->
      <el-tab-pane label="复杂表单" name="form">
        <el-card>
          <template #header>
            <span>用户信息表单</span>
          </template>
          <el-form :model="complexForm" :rules="complexRules" ref="complexFormRef" label-width="120px">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="基本信息" style="margin-bottom: 0;">
                  <el-divider />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="complexForm.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="complexForm.gender">
                    <el-radio value="male">男</el-radio>
                    <el-radio value="female">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                  <el-date-picker
                    v-model="complexForm.birthday"
                    type="date"
                    placeholder="选择日期"
                    style="width: 100%;"
                  />
                </el-form-item>
                <el-form-item label="兴趣爱好" prop="hobbies">
                  <el-checkbox-group v-model="complexForm.hobbies">
                    <el-checkbox label="reading">阅读</el-checkbox>
                    <el-checkbox label="music">音乐</el-checkbox>
                    <el-checkbox label="sports">运动</el-checkbox>
                    <el-checkbox label="travel">旅行</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系信息" style="margin-bottom: 0;">
                  <el-divider />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="complexForm.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="complexForm.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                  <el-cascader
                    v-model="complexForm.address"
                    :options="addressOptions"
                    placeholder="请选择地址"
                    style="width: 100%;"
                  />
                </el-form-item>
                <el-form-item label="个人简介" prop="description">
                  <el-input
                    v-model="complexForm.description"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入个人简介"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="submitComplexForm">提交</el-button>
              <el-button @click="resetComplexForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Edit,
  Delete,
  User,
  TrendCharts,
  DataAnalysis,
  Money,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'

export default {
  name: 'Examples',
  components: {
    Plus,
    Search,
    Edit,
    Delete,
    User,
    TrendCharts,
    DataAnalysis,
    Money,
    ArrowUp,
    ArrowDown
  },
  setup() {
    const activeTab = ref('user')
    const loading = ref(false)
    const searchKeyword = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalUsers = ref(100)
    const userDialogVisible = ref(false)
    const isEditMode = ref(false)
    const userFormRef = ref()
    const complexFormRef = ref()

    // 用户数据
    const users = ref([
      {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        role: 'admin',
        status: true,
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: 2,
        name: '李四',
        email: 'lisi@example.com',
        role: 'user',
        status: true,
        createTime: '2024-01-02 11:00:00'
      },
      {
        id: 3,
        name: '王五',
        email: 'wangwu@example.com',
        role: 'guest',
        status: false,
        createTime: '2024-01-03 12:00:00'
      }
    ])

    // 过滤后的用户
    const filteredUsers = computed(() => {
      if (!searchKeyword.value) return users.value
      return users.value.filter(user => 
        user.name.includes(searchKeyword.value) || 
        user.email.includes(searchKeyword.value)
      )
    })

    // 用户表单
    const userForm = reactive({
      id: null,
      name: '',
      email: '',
      role: '',
      status: true
    })

    // 用户表单验证规则
    const userRules = {
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      role: [{ required: true, message: '请选择角色', trigger: 'change' }]
    }

    // 复杂表单
    const complexForm = reactive({
      name: '',
      gender: '',
      birthday: '',
      hobbies: [],
      email: '',
      phone: '',
      address: [],
      description: ''
    })

    // 复杂表单验证规则
    const complexRules = {
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
      ]
    }

    // 地址选项
    const addressOptions = ref([
      {
        value: 'beijing',
        label: '北京',
        children: [
          { value: 'chaoyang', label: '朝阳区' },
          { value: 'haidian', label: '海淀区' }
        ]
      },
      {
        value: 'shanghai',
        label: '上海',
        children: [
          { value: 'huangpu', label: '黄浦区' },
          { value: 'pudong', label: '浦东新区' }
        ]
      }
    ])

    // 统计数据
    const statsData = ref([
      {
        title: '总用户数',
        value: 1234,
        suffix: '',
        precision: 0,
        icon: 'User',
        color: '#409eff',
        trend: '+12.5%',
        trendIcon: 'ArrowUp',
        trendColor: '#67c23a'
      },
      {
        title: '今日访问',
        value: 567,
        suffix: '',
        precision: 0,
        icon: 'TrendCharts',
        color: '#67c23a',
        trend: '+8.2%',
        trendIcon: 'ArrowUp',
        trendColor: '#67c23a'
      },
      {
        title: '转化率',
        value: 23.45,
        suffix: '%',
        precision: 2,
        icon: 'DataAnalysis',
        color: '#e6a23c',
        trend: '-2.1%',
        trendIcon: 'ArrowDown',
        trendColor: '#f56c6c'
      },
      {
        title: '总收入',
        value: 12345.67,
        suffix: '元',
        precision: 2,
        icon: 'Money',
        color: '#f56c6c',
        trend: '+15.3%',
        trendIcon: 'ArrowUp',
        trendColor: '#67c23a'
      }
    ])

    // 方法
    const getRoleTagType = (role) => {
      const types = {
        admin: 'danger',
        user: 'primary',
        guest: 'info'
      }
      return types[role] || 'info'
    }

    const searchUsers = () => {
      ElMessage.success('搜索完成')
    }

    const showAddUserDialog = () => {
      isEditMode.value = false
      Object.assign(userForm, {
        id: null,
        name: '',
        email: '',
        role: '',
        status: true
      })
      userDialogVisible.value = true
    }

    const editUser = (user) => {
      isEditMode.value = true
      Object.assign(userForm, { ...user })
      userDialogVisible.value = true
    }

    const deleteUser = async (user) => {
      try {
        await ElMessageBox.confirm(
          `确定要删除用户 "${user.name}" 吗？`,
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        const index = users.value.findIndex(u => u.id === user.id)
        if (index > -1) {
          users.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      } catch {
        ElMessage.info('已取消删除')
      }
    }

    const toggleUserStatus = (user) => {
      ElMessage.success(`用户状态已${user.status ? '启用' : '禁用'}`)
    }

    const saveUser = async () => {
      try {
        await userFormRef.value.validate()
        if (isEditMode.value) {
          const index = users.value.findIndex(u => u.id === userForm.id)
          if (index > -1) {
            Object.assign(users.value[index], userForm)
          }
          ElMessage.success('更新成功')
        } else {
          const newUser = {
            ...userForm,
            id: Date.now(),
            createTime: new Date().toLocaleString()
          }
          users.value.unshift(newUser)
          ElMessage.success('添加成功')
        }
        userDialogVisible.value = false
      } catch {
        ElMessage.error('请检查表单输入')
      }
    }

    const handleSizeChange = (size) => {
      pageSize.value = size
    }

    const handleCurrentChange = (page) => {
      currentPage.value = page
    }

    const submitComplexForm = async () => {
      try {
        await complexFormRef.value.validate()
        ElMessage.success('表单提交成功')
      } catch {
        ElMessage.error('请检查表单输入')
      }
    }

    const resetComplexForm = () => {
      complexFormRef.value.resetFields()
    }

    return {
      activeTab,
      loading,
      searchKeyword,
      currentPage,
      pageSize,
      totalUsers,
      userDialogVisible,
      isEditMode,
      userFormRef,
      complexFormRef,
      users,
      filteredUsers,
      userForm,
      userRules,
      complexForm,
      complexRules,
      addressOptions,
      statsData,
      getRoleTagType,
      searchUsers,
      showAddUserDialog,
      editUser,
      deleteUser,
      toggleUserStatus,
      saveUser,
      handleSizeChange,
      handleCurrentChange,
      submitComplexForm,
      resetComplexForm
    }
  }
}
</script>

<style scoped>
.examples {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #303133;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 1.1rem;
  color: #606266;
}

.example-tabs {
  margin-bottom: 32px;
}

.example-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.stat-card {
  text-align: center;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 14px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar .el-input {
    width: 100% !important;
  }
  
  .card-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
}
</style>