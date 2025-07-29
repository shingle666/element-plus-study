# 第57天：Element Plus 综合项目实战（二）

## 学习目标

继续我们的智能企业管理平台开发，今天重点实现主布局组件、用户管理模块和数据表格功能。

- 设计并实现响应式主布局
- 开发用户管理完整功能
- 构建高性能数据表格组件
- 实现表单验证和数据处理
- 集成搜索和筛选功能

## 1. 主布局组件设计

### 1.1 布局架构

```vue
<!-- src/components/layout/index.vue -->
<template>
  <div class="app-wrapper" :class="classObj">
    <!-- 移动端遮罩 -->
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    
    <!-- 侧边栏 -->
    <Sidebar class="sidebar-container" />
    
    <!-- 主内容区域 -->
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div :class="{ 'fixed-header': fixedHeader }">
        <Navbar />
        <TagsView v-if="needTagsView" />
      </div>
      
      <!-- 页面内容 -->
      <AppMain />
      
      <!-- 右侧设置面板 -->
      <RightPanel v-if="showSettings">
        <Settings />
      </RightPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useSettingsStore } from '@/store/modules/settings'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'
import TagsView from './components/TagsView/index.vue'
import RightPanel from './components/RightPanel/index.vue'
import Settings from './components/Settings/index.vue'

const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()

// 计算属性
const sidebar = computed(() => appStore.sidebar)
const device = computed(() => appStore.device)
const showSettings = computed(() => settingsStore.showSettings)
const needTagsView = computed(() => settingsStore.tagsView)
const fixedHeader = computed(() => settingsStore.fixedHeader)

// 布局样式类
const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

// 处理移动端点击外部关闭侧边栏
function handleClickOutside() {
  appStore.closeSideBar({ withoutAnimation: false })
}

// 监听路由变化，移动端自动关闭侧边栏
watchEffect(() => {
  if (device.value === 'mobile' && sidebar.value.opened) {
    appStore.closeSideBar({ withoutAnimation: false })
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/mixin.scss';
@import '@/assets/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
```

### 1.2 侧边栏组件

```vue
<!-- src/components/layout/components/Sidebar/index.vue -->
<template>
  <div class="sidebar-wrapper">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- Logo -->
      <div class="sidebar-logo-container" :class="{ collapse: isCollapse }">
        <transition name="sidebarLogoFade">
          <router-link
            v-if="isCollapse"
            key="collapse"
            class="sidebar-logo-link"
            to="/"
          >
            <img src="@/assets/images/logo.png" class="sidebar-logo" />
          </router-link>
          <router-link
            v-else
            key="expand"
            class="sidebar-logo-link"
            to="/"
          >
            <img src="@/assets/images/logo.png" class="sidebar-logo" />
            <h1 class="sidebar-title">Smart Platform</h1>
          </router-link>
        </transition>
      </div>
      
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <SidebarItem
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import SidebarItem from './SidebarItem.vue'
import variables from '@/assets/styles/variables.scss'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

// 计算属性
const sidebar = computed(() => appStore.sidebar)
const routes = computed(() => permissionStore.routes)
const isCollapse = computed(() => !sidebar.value.opened)

// 当前激活的菜单
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.sidebar-wrapper {
  background-color: $menuBg;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }
  
  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }
  
  .el-scrollbar__bar.is-vertical {
    right: 0px;
  }
  
  .el-scrollbar {
    height: 100%;
  }
  
  &.has-logo {
    .el-scrollbar {
      height: calc(100% - 50px);
    }
  }
  
  .is-horizontal {
    display: none;
  }
  
  a {
    display: inline-block;
    width: 100%;
    overflow: hidden;
  }
  
  .svg-icon {
    margin-right: 16px;
  }
  
  .sub-el-icon {
    margin-right: 12px;
    margin-left: -2px;
  }
  
  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }
  
  // menu hover
  .submenu-title-noDropdown,
  .el-submenu__title {
    &:hover {
      background-color: $menuHover !important;
    }
  }
  
  .is-active > .el-submenu__title {
    color: $subMenuActiveText !important;
  }
  
  & .nest-menu .el-submenu > .el-submenu__title,
  & .el-submenu .el-menu-item {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg !important;
    
    &:hover {
      background-color: $subMenuHover !important;
    }
  }
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;
  
  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    
    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }
    
    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
  
  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
```

### 1.3 顶部导航栏

```vue
<!-- src/components/layout/components/Navbar.vue -->
<template>
  <div class="navbar">
    <!-- 左侧 -->
    <div class="navbar-left">
      <!-- 折叠按钮 -->
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      
      <!-- 面包屑 -->
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>
    
    <!-- 右侧 -->
    <div class="navbar-right">
      <!-- 搜索 -->
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />
        
        <!-- 错误日志 -->
        <error-log class="errLog-container right-menu-item hover-effect" />
        
        <!-- 全屏 -->
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        
        <!-- 国际化 -->
        <lang-select class="right-menu-item hover-effect" />
        
        <!-- 主题切换 -->
        <theme-picker class="right-menu-item hover-effect" />
      </template>
      
      <!-- 用户下拉菜单 -->
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/profile/index">
              <el-dropdown-item>{{ $t('navbar.profile') }}</el-dropdown-item>
            </router-link>
            <router-link to="/">
              <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/element-plus/element-plus">
              <el-dropdown-item>{{ $t('navbar.github') }}</el-dropdown-item>
            </a>
            <a target="_blank" href="https://element-plus.org/">
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              <span style="display: block;">{{ $t('navbar.logOut') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { useAuthStore } from '@/store/modules/auth'
import { useUserStore } from '@/store/modules/user'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import ErrorLog from '@/components/ErrorLog/index.vue'
import Screenfull from '@/components/Screenfull/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import ThemePicker from '@/components/ThemePicker/index.vue'
import Search from '@/components/HeaderSearch/index.vue'

const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()
const userStore = useUserStore()

// 计算属性
const sidebar = computed(() => appStore.sidebar)
const device = computed(() => appStore.device)
const avatar = computed(() => userStore.avatar || require('@/assets/images/avatar.png'))

// 切换侧边栏
function toggleSideBar() {
  appStore.toggleSideBar()
}

// 登出
async function logout() {
  try {
    await ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await authStore.logoutAction()
    await router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
    ElMessage.success('退出成功')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  
  .navbar-left {
    display: flex;
    align-items: center;
    
    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;
      
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
    
    .breadcrumb-container {
      margin-left: 16px;
    }
  }
  
  .navbar-right {
    display: flex;
    align-items: center;
    
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    
    .avatar-container {
      margin-right: 30px;
      
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
```

## 2. 用户管理模块

### 2.1 用户列表页面

```vue
<!-- src/views/user/list.vue -->
<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="请输入用户名或邮箱"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option label="启用" value="1" />
        <el-option label="禁用" value="0" />
      </el-select>
      <el-select
        v-model="listQuery.role"
        placeholder="角色"
        clearable
        style="width: 120px"
        class="filter-item"
      >
        <el-option
          v-for="role in roleOptions"
          :key="role.value"
          :label="role.label"
          :value="role.value"
        />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="Search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="Plus"
        @click="handleCreate"
        v-permission="['user:create']"
      >
        添加用户
      </el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="Download"
        @click="handleDownload"
        v-permission="['user:export']"
      >
        导出
      </el-button>
    </div>
    
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      >
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="头像" width="80" align="center">
        <template #default="{ row }">
          <el-avatar :size="40" :src="row.avatar">
            <img src="@/assets/images/avatar.png" />
          </el-avatar>
        </template>
      </el-table-column>
      
      <el-table-column label="用户名" min-width="120">
        <template #default="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.username }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="姓名" min-width="100">
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="邮箱" min-width="150">
        <template #default="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="角色" min-width="120">
        <template #default="{ row }">
          <el-tag
            v-for="role in row.roles"
            :key="role"
            type="info"
            size="small"
            style="margin-right: 5px"
          >
            {{ getRoleLabel(role) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="部门" min-width="120">
        <template #default="{ row }">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" class-name="status-col" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="创建时间" width="150" align="center">
        <template #default="{ row }">
          <span>{{ formatDate(row.created_at) }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template #default="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            @click="handleUpdate(row)"
            v-permission="['user:update']"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.status === 1"
            size="small"
            type="warning"
            @click="handleModifyStatus(row, 0)"
            v-permission="['user:update']"
          >
            禁用
          </el-button>
          <el-button
            v-else
            size="small"
            type="success"
            @click="handleModifyStatus(row, 1)"
            v-permission="['user:update']"
          >
            启用
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row, $index)"
            v-permission="['user:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    
    <!-- 用户表单对话框 -->
    <el-dialog
      :title="dialogStatus === 'create' ? '创建用户' : '编辑用户'"
      v-model="dialogFormVisible"
      width="600px"
    >
      <UserForm
        ref="userFormRef"
        :user-data="temp"
        :dialog-status="dialogStatus"
        @submit="handleSubmit"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitForm"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, createUser, updateUser, deleteUser, updateUserStatus } from '@/api/user'
import { getRoleList } from '@/api/role'
import UserForm from './components/UserForm.vue'
import Pagination from '@/components/Pagination/index.vue'
import { formatDate } from '@/utils/date'
import { exportExcel } from '@/utils/excel'
import type { User, UserQuery } from '@/types/user'

// 响应式数据
const tableKey = ref(0)
const list = ref<User[]>([])
const total = ref(0)
const listLoading = ref(true)
const downloadLoading = ref(false)
const dialogFormVisible = ref(false)
const dialogStatus = ref<'create' | 'update'>('create')
const userFormRef = ref()
const roleOptions = ref<Array<{ label: string; value: string }>>([])

// 查询参数
const listQuery = reactive<UserQuery>({
  page: 1,
  limit: 20,
  keyword: '',
  status: undefined,
  role: undefined,
  sort: '+id'
})

// 临时用户数据
const temp = ref<Partial<User>>({
  id: undefined,
  username: '',
  name: '',
  email: '',
  password: '',
  avatar: '',
  roles: [],
  department: '',
  position: '',
  status: 1
})

// 生命周期
onMounted(() => {
  getList()
  getRoles()
})

// 获取用户列表
async function getList() {
  listLoading.value = true
  try {
    const response = await getUserList(listQuery)
    list.value = response.data.items
    total.value = response.data.total
  } catch (error) {
    console.error('Get user list failed:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    listLoading.value = false
  }
}

// 获取角色列表
async function getRoles() {
  try {
    const response = await getRoleList({ page: 1, limit: 100 })
    roleOptions.value = response.data.items.map((role: any) => ({
      label: role.name,
      value: role.code
    }))
  } catch (error) {
    console.error('Get role list failed:', error)
  }
}

// 搜索
function handleFilter() {
  listQuery.page = 1
  getList()
}

// 排序
function sortChange(data: any) {
  const { prop, order } = data
  if (prop === 'id') {
    sortByID(order)
  }
}

function sortByID(order: string) {
  if (order === 'ascending') {
    listQuery.sort = '+id'
  } else {
    listQuery.sort = '-id'
  }
  handleFilter()
}

// 重置临时数据
function resetTemp() {
  temp.value = {
    id: undefined,
    username: '',
    name: '',
    email: '',
    password: '',
    avatar: '',
    roles: [],
    department: '',
    position: '',
    status: 1
  }
}

// 创建用户
function handleCreate() {
  resetTemp()
  dialogStatus.value = 'create'
  dialogFormVisible.value = true
  nextTick(() => {
    userFormRef.value?.clearValidate()
  })
}

// 编辑用户
function handleUpdate(row: User) {
  temp.value = Object.assign({}, row)
  dialogStatus.value = 'update'
  dialogFormVisible.value = true
  nextTick(() => {
    userFormRef.value?.clearValidate()
  })
}

// 提交表单
function submitForm() {
  userFormRef.value?.submitForm()
}

// 处理表单提交
async function handleSubmit(formData: User) {
  try {
    if (dialogStatus.value === 'create') {
      await createUser(formData)
      ElMessage.success('创建成功')
    } else {
      await updateUser(formData.id!, formData)
      ElMessage.success('更新成功')
    }
    
    dialogFormVisible.value = false
    getList()
  } catch (error) {
    console.error('Submit failed:', error)
    ElMessage.error(dialogStatus.value === 'create' ? '创建失败' : '更新失败')
  }
}

// 修改状态
async function handleModifyStatus(row: User, status: number) {
  try {
    await updateUserStatus(row.id, status)
    row.status = status
    ElMessage.success('状态修改成功')
  } catch (error) {
    console.error('Update status failed:', error)
    ElMessage.error('状态修改失败')
  }
}

// 删除用户
async function handleDelete(row: User, index: number) {
  try {
    await ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteUser(row.id)
    list.value.splice(index, 1)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete failed:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 导出
async function handleDownload() {
  downloadLoading.value = true
  try {
    const response = await getUserList({ ...listQuery, limit: 10000 })
    const data = response.data.items.map((item: User) => ({
      ID: item.id,
      用户名: item.username,
      姓名: item.name,
      邮箱: item.email,
      角色: item.roles.join(','),
      部门: item.department,
      职位: item.position,
      状态: item.status === 1 ? '启用' : '禁用',
      创建时间: formatDate(item.created_at)
    }))
    
    exportExcel(data, '用户列表')
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('Export failed:', error)
    ElMessage.error('导出失败')
  } finally {
    downloadLoading.value = false
  }
}

// 获取角色标签
function getRoleLabel(roleCode: string): string {
  const role = roleOptions.value.find(r => r.value === roleCode)
  return role ? role.label : roleCode
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  padding-bottom: 10px;
  
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}

.link-type {
  color: #409eff;
  cursor: pointer;
  
  &:hover {
    color: #66b1ff;
  }
}

.dialog-footer {
  text-align: right;
}
</style>
```

### 2.2 用户表单组件

```vue
<!-- src/views/user/components/UserForm.vue -->
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
    class="user-form"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            :disabled="dialogStatus === 'update'"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="部门" prop="department">
          <el-select
            v-model="formData.department"
            placeholder="请选择部门"
            style="width: 100%"
          >
            <el-option
              v-for="dept in departmentOptions"
              :key="dept.value"
              :label="dept.label"
              :value="dept.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职位" prop="position">
          <el-input v-model="formData.position" placeholder="请输入职位" />
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-form-item label="角色" prop="roles">
      <el-select
        v-model="formData.roles"
        multiple
        placeholder="请选择角色"
        style="width: 100%"
      >
        <el-option
          v-for="role in roleOptions"
          :key="role.value"
          :label="role.label"
          :value="role.value"
        />
      </el-select>
    </el-form-item>
    
    <el-form-item label="头像">
      <el-upload
        class="avatar-uploader"
        action="/api/upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    
    <el-form-item label="状态">
      <el-radio-group v-model="formData.status">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getRoleList } from '@/api/role'
import { getDepartmentList } from '@/api/department'
import type { User } from '@/types/user'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'

// Props
interface Props {
  userData: Partial<User>
  dialogStatus: 'create' | 'update'
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  submit: [data: User]
}>()

// 响应式数据
const formRef = ref<FormInstance>()
const roleOptions = ref<Array<{ label: string; value: string }>>([])
const departmentOptions = ref<Array<{ label: string; value: string }>>([])

// 表单数据
const formData = reactive<Partial<User>>({
  id: undefined,
  username: '',
  name: '',
  email: '',
  password: '',
  avatar: '',
  roles: [],
  department: '',
  position: '',
  status: 1
})

// 表单验证规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '用户名只能包含字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (props.dialogStatus === 'update' && !value) {
          callback() // 更新时密码可以为空
        } else if (!value) {
          callback(new Error('请输入密码'))
        } else if (value.length < 6) {
          callback(new Error('密码长度不能少于6位'))
        } else {
          callback()
        }
      }
    }
  ],
  roles: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  department: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ]
})

// 生命周期
onMounted(() => {
  getRoles()
  getDepartments()
})

// 监听 props 变化
watch(
  () => props.userData,
  (newVal) => {
    Object.assign(formData, newVal)
  },
  { immediate: true, deep: true }
)

// 获取角色列表
async function getRoles() {
  try {
    const response = await getRoleList({ page: 1, limit: 100 })
    roleOptions.value = response.data.items.map((role: any) => ({
      label: role.name,
      value: role.code
    }))
  } catch (error) {
    console.error('Get role list failed:', error)
  }
}

// 获取部门列表
async function getDepartments() {
  try {
    const response = await getDepartmentList({ page: 1, limit: 100 })
    departmentOptions.value = response.data.items.map((dept: any) => ({
      label: dept.name,
      value: dept.code
    }))
  } catch (error) {
    console.error('Get department list failed:', error)
  }
}

// 头像上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200) {
    formData.avatar = response.data.url
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error('头像上传失败')
  }
}

// 头像上传前验证
const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isJPG) {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 提交表单
function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit('submit', formData as User)
    } else {
      ElMessage.error('请检查表单填写是否正确')
    }
  })
}

// 清除验证
function clearValidate() {
  formRef.value?.clearValidate()
}

// 暴露方法
defineExpose({
  submitForm,
  clearValidate
})
</script>

<style lang="scss" scoped>
.user-form {
  padding: 20px;
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.avatar {
  width: 78px;
  height: 78px;
  display: block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  line-height: 78px;
}
</style>
```

## 3. 实践练习

### 练习 1：完善布局组件

1. 实现响应式侧边栏
2. 添加面包屑导航
3. 实现标签页功能
4. 添加全屏功能

### 练习 2：用户管理功能

1. 完善用户列表页面
2. 实现用户表单验证
3. 添加批量操作功能
4. 实现数据导入导出

### 练习 3：权限控制

1. 实现按钮级权限控制
2. 添加数据权限过滤
3. 实现角色权限管理
4. 添加操作日志记录

## 学习资源

* [Element Plus Table 组件](https://element-plus.org/zh-CN/component/table.html)
* [Element Plus Form 组件](https://element-plus.org/zh-CN/component/form.html)
* [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
* [Pinia 状态管理](https://pinia.vuejs.org/zh/)

## 作业

1. 完成主布局组件的所有功能
2. 实现完整的用户管理模块
3. 添加数据表格的高级功能
4. 实现表单的复杂验证逻辑

## 总结

今天我们继续了综合项目实战，主要完成了：

1. **主布局组件**：实现了响应式布局、侧边栏、导航栏等核心组件
2. **用户管理模块**：完成了用户列表、表单、搜索、分页等功能
3. **数据表格组件**：实现了高性能的数据展示和操作
4. **表单验证系统**：建立了完整的表单验证机制

## 下一步学习计划

明天我们将继续项目实战，重点实现：
- 数据可视化模块
- 系统监控功能
- 性能优化实践
- 部署和发布流程