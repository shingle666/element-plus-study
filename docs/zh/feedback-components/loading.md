# Loading 加载

## 学习目标

通过本章学习，你将掌握：
- **基础加载功能**：掌握 Loading 的基本使用方法和指令形式
- **区域加载遮罩**：学会在特定区域显示加载状态
- **全屏加载状态**：实现全屏加载遮罩和状态管理
- **自定义加载图标**：定制加载图标和动画效果
- **加载文字提示**：添加合适的加载提示文字
- **加载状态管理**：管理复杂场景下的加载状态
- **加载性能优化**：优化加载组件的性能表现
- **加载无障碍**：实现符合无障碍标准的加载体验
- **加载动画定制**：创建自定义的加载动画效果

**预计学习时间：** 105分钟

## 概述

Loading 加载组件用于在数据加载或异步操作过程中显示加载状态，为用户提供视觉反馈，提升用户体验。Element Plus 提供了两种调用 Loading 的方法：指令和服务。

### 主要特性

- **双重调用方式**：支持指令（v-loading）和服务（ElLoading.service）两种调用方式
- **灵活覆盖范围**：支持区域加载和全屏加载两种模式
- **高度可定制**：支持自定义加载文案、图标、背景色等
- **单例模式**：全屏加载采用单例模式，避免重复创建
- **安全可靠**：提供安全的自定义图标机制
- **上下文继承**：支持应用程序上下文的继承
- **响应式设计**：适配不同屏幕尺寸和设备
- **无障碍访问**：支持屏幕阅读器和键盘导航

### 适用场景

- **数据加载**：表格数据、列表内容的异步加载
- **表单提交**：表单数据提交过程的状态反馈
- **文件操作**：文件上传、下载过程的进度显示
- **页面切换**：路由跳转、页面初始化的加载状态
- **API 请求**：网络请求过程的等待状态显示
- **复杂计算**：前端计算密集型操作的进度反馈
- **资源加载**：图片、视频等媒体资源的加载状态
- **批量操作**：批量数据处理的进度指示

## 基础用法

### 区域加载

在需要的时候展示加载动画，防止页面失去响应提高用户体验（例如表格）。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

对于自定义指令 v-loading，只需要绑定 boolean 值即可。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

默认状况下，Loading 遮罩会插入到绑定元素的子节点。通过添加 body 修饰符，可以使遮罩插入至 Dom 中的 body 上。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

```vue
<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="address" label="地址" />
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const loading = ref(true)

const tableData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
]

setTimeout(() => {
  loading.value = false
}, 2000)
</script>
```

### 自定义加载中组件内容

你可以自定义加载中组件的文字，图标，以及背景颜色。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

在绑定了v-loading指令的元素上添加element-loading-text属性，其值会被渲染为加载文案，并显示在加载图标的下方。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

类似地，element-loading-spinner、element-loading-background 和 element-loading-svg 属性分别用来设定 svg 图标、背景色值、加载图标。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

```vue
<template>
  <el-table
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="address" label="地址" />
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const loading = ref(true)

const tableData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
]
</script>
```

**安全警告**：虽然 element-loading-spinner / element-loading-svg 属性支持传入的 HTML 片段，但是动态在网站上渲染任意的 HTML 是非常危险的，因为很容易导致 XSS 攻击。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

请确保 element-loading-spinner / element-loading-svg的内容是可信的，不要将用户提交的内容赋值给 element-loading-spinner / element-loading-svg 属性。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

### 让加载组件铺满整个屏幕

加载数据时显示全屏动画。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

当使用指令方式时，全屏遮罩需要添加fullscreen修饰符（遮罩会插入至 body 上）此时若需要锁定屏幕的滚动，可以使用lock修饰符。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

当使用服务方式时，遮罩默认即为全屏，无需额外设置。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

```vue
<template>
  <el-button
    type="primary"
    @click="openFullScreen1"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    指令方式
  </el-button>
  <el-button type="primary" @click="openFullScreen2">
    服务方式
  </el-button>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { ElLoading } from 'element-plus'

const fullscreenLoading = ref(false)

const openFullScreen1 = () => {
  fullscreenLoading.value = true
  setTimeout(() => {
    fullscreenLoading.value = false
  }, 2000)
}

const openFullScreen2 = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
  }, 2000)
}
</script>
```

### 以服务的方式来调用

Loading 还可以以服务的方式调用。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

你可以像这样引入 Loading 服务：

```typescript
import { ElLoading } from 'element-plus'
```

在你需要的时候通过下面的方式调用：<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

```typescript
ElLoading.service(options)
```

LoadingService 会返回一个 Loading 实例，可通过调用该实例的 close 方法来关闭它：<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

```typescript
const loadingInstance = ElLoading.service(options)
nextTick(() => {
  // Loading should be closed asynchronously
  loadingInstance.close()
})
```

需要注意的是，以服务的方式调用的全屏 Loading 是单例的。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

若在前一个全屏 Loading 关闭前再次调用全屏 Loading，并不会创建一个新的 Loading 实例，而是返回现有全屏 Loading 的实例：<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

```typescript
const loadingInstance1 = ElLoading.service({ fullscreen: true })
const loadingInstance2 = ElLoading.service({ fullscreen: true })
console.log(loadingInstance1 === loadingInstance2) // true
```

如果完整引入了 Element Plus，那么 app.config.globalProperties 上会有一个全局方法$loading，它的调用方式为：this.$loading(options)，同样会返回一个 Loading 实例。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

### 应用程序上下文

现在 Loading 接受一条 context 作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Loading 中，这将允许你继承应用程序的所有属性。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

你可以像这样使用它：

```typescript
import { getCurrentInstance } from 'vue'
import { ElLoading } from 'element-plus'

// in your setup method
const { appContext } = getCurrentInstance()!
ElLoading.service({}, appContext)
```

如果您全局注册了 ELLoading 组件，它将自动继承应用的上下文环境。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

## 实际应用示例

### 数据表格加载管理

一个完整的数据表格加载管理示例，包含搜索、分页等功能：

```vue
<template>
  <div class="table-loading-demo">
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入搜索关键词"
        style="width: 300px; margin-right: 12px"
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" @click="handleSearch" :loading="searchLoading">
        搜索
      </el-button>
      <el-button @click="handleRefresh" :loading="refreshLoading">
        刷新
      </el-button>
    </div>

    <el-table
      v-loading="tableLoading"
      element-loading-text="正在加载数据..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="id" label="ID" width="80" sortable="custom" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="department" label="部门" width="150" />
      <el-table-column prop="position" label="职位" width="150" />
      <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)" :loading="editingIds.includes(row.id)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)" :loading="deletingIds.includes(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; text-align: right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const tableLoading = ref(false)
const searchLoading = ref(false)
const refreshLoading = ref(false)
const editingIds = ref([])
const deletingIds = ref([])

// 模拟数据
const mockData = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `用户${index + 1}`,
  email: `user${index + 1}@example.com`,
  department: ['技术部', '产品部', '运营部', '市场部'][index % 4],
  position: ['工程师', '产品经理', '运营专员', '市场专员'][index % 4],
  createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
}))

const loadTableData = async (showLoading = true) => {
  if (showLoading) {
    tableLoading.value = true
  }
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    // 模拟搜索和分页
    let filteredData = mockData
    if (searchKeyword.value) {
      filteredData = mockData.filter(item => 
        item.name.includes(searchKeyword.value) || 
        item.email.includes(searchKeyword.value)
      )
    }
    
    total.value = filteredData.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filteredData.slice(start, end)
    
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    tableLoading.value = false
    searchLoading.value = false
    refreshLoading.value = false
  }
}

const handleSearch = () => {
  searchLoading.value = true
  currentPage.value = 1
  loadTableData(false)
}

const handleRefresh = () => {
  refreshLoading.value = true
  searchKeyword.value = ''
  currentPage.value = 1
  loadTableData(false)
}

const handleSizeChange = () => {
  currentPage.value = 1
  loadTableData()
}

const handleCurrentChange = () => {
  loadTableData()
}

const handleSortChange = ({ prop, order }) => {
  // 模拟排序
  loadTableData()
}

const handleEdit = async (row) => {
  editingIds.value.push(row.id)
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('编辑成功')
  } catch (error) {
    ElMessage.error('编辑失败')
  } finally {
    editingIds.value = editingIds.value.filter(id => id !== row.id)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    deletingIds.value.push(row.id)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('删除成功')
    loadTableData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  } finally {
    deletingIds.value = deletingIds.value.filter(id => id !== row.id)
  }
}

onMounted(() => {
  loadTableData()
})
</script>

<style scoped>
.table-loading-demo {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
}
</style>
```

### 文件上传进度管理

一个完整的文件上传进度管理示例：

```vue
<template>
  <div class="upload-demo">
    <div class="upload-area">
      <el-upload
        ref="uploadRef"
        class="upload-dragger"
        drag
        :action="uploadUrl"
        :multiple="true"
        :auto-upload="false"
        :on-change="handleFileChange"
        :before-upload="beforeUpload"
        :http-request="customUpload"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 jpg/png/pdf 文件，且不超过 10MB
          </div>
        </template>
      </el-upload>
    </div>

    <div class="upload-list" v-if="fileList.length > 0">
      <h3>上传列表</h3>
      <div class="file-item" v-for="file in fileList" :key="file.uid">
        <div class="file-info">
          <el-icon><document /></el-icon>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">({{ formatFileSize(file.size) }})</span>
        </div>
        
        <div class="file-progress" v-if="file.status === 'uploading'">
          <el-progress 
            :percentage="file.progress" 
            :status="file.progress === 100 ? 'success' : undefined"
          />
        </div>
        
        <div class="file-status">
          <el-tag v-if="file.status === 'ready'" type="info">待上传</el-tag>
          <el-tag v-else-if="file.status === 'uploading'" type="warning">
            <el-icon class="is-loading"><loading /></el-icon>
            上传中
          </el-tag>
          <el-tag v-else-if="file.status === 'success'" type="success">上传成功</el-tag>
          <el-tag v-else-if="file.status === 'error'" type="danger">上传失败</el-tag>
        </div>
        
        <div class="file-actions">
          <el-button 
            v-if="file.status === 'ready' || file.status === 'error'"
            size="small" 
            type="primary" 
            @click="uploadSingleFile(file)"
            :loading="file.status === 'uploading'"
          >
            上传
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="removeFile(file)"
            :disabled="file.status === 'uploading'"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>

    <div class="upload-actions" v-if="fileList.length > 0">
      <el-button 
        type="primary" 
        @click="uploadAllFiles"
        :loading="isUploading"
        :disabled="!hasReadyFiles"
      >
        全部上传
      </el-button>
      <el-button @click="clearAllFiles" :disabled="isUploading">
        清空列表
      </el-button>
    </div>

    <!-- 全屏上传进度 -->
    <div v-loading.fullscreen.lock="showGlobalLoading" 
         element-loading-text="正在批量上传文件..."
         element-loading-background="rgba(0, 0, 0, 0.8)">
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Document, Loading } from '@element-plus/icons-vue'

const uploadRef = ref()
const fileList = ref([])
const isUploading = ref(false)
const showGlobalLoading = ref(false)
const uploadUrl = 'https://jsonplaceholder.typicode.com/posts/'

const hasReadyFiles = computed(() => {
  return fileList.value.some(file => file.status === 'ready' || file.status === 'error')
})

const handleFileChange = (file, files) => {
  const newFile = {
    uid: file.uid,
    name: file.name,
    size: file.size,
    raw: file.raw,
    status: 'ready',
    progress: 0
  }
  
  const existingIndex = fileList.value.findIndex(f => f.uid === file.uid)
  if (existingIndex > -1) {
    fileList.value[existingIndex] = newFile
  } else {
    fileList.value.push(newFile)
  }
}

const beforeUpload = (file) => {
  const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
  const isValidSize = file.size / 1024 / 1024 < 10
  
  if (!isValidType) {
    ElMessage.error('只支持 JPG、PNG、PDF 格式的文件')
    return false
  }
  
  if (!isValidSize) {
    ElMessage.error('文件大小不能超过 10MB')
    return false
  }
  
  return true
}

const customUpload = async (options) => {
  const { file } = options
  const fileItem = fileList.value.find(f => f.uid === file.uid)
  
  if (!fileItem) return
  
  fileItem.status = 'uploading'
  fileItem.progress = 0
  
  try {
    // 模拟文件上传进度
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      fileItem.progress = i
    }
    
    // 模拟上传完成
    await new Promise(resolve => setTimeout(resolve, 500))
    
    fileItem.status = 'success'
    fileItem.progress = 100
    ElMessage.success(`${file.name} 上传成功`)
    
  } catch (error) {
    fileItem.status = 'error'
    fileItem.progress = 0
    ElMessage.error(`${file.name} 上传失败`)
  }
}

const uploadSingleFile = async (file) => {
  await customUpload({ file: file.raw })
}

const uploadAllFiles = async () => {
  const readyFiles = fileList.value.filter(file => file.status === 'ready' || file.status === 'error')
  
  if (readyFiles.length === 0) {
    ElMessage.warning('没有待上传的文件')
    return
  }
  
  isUploading.value = true
  showGlobalLoading.value = true
  
  try {
    // 并发上传文件
    const uploadPromises = readyFiles.map(file => uploadSingleFile(file))
    await Promise.all(uploadPromises)
    
    ElMessage.success('所有文件上传完成')
  } catch (error) {
    ElMessage.error('批量上传过程中出现错误')
  } finally {
    isUploading.value = false
    showGlobalLoading.value = false
  }
}

const removeFile = (file) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
}

const clearAllFiles = () => {
  fileList.value = []
  uploadRef.value?.clearFiles()
}

const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + ' KB'
  } else {
    return (size / 1024 / 1024).toFixed(1) + ' MB'
  }
}
</script>

<style scoped>
.upload-demo {
  padding: 20px;
  max-width: 800px;
}

.upload-area {
  margin-bottom: 20px;
}

.upload-list {
  margin-bottom: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: #fafafa;
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.file-name {
  margin: 0 8px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #909399;
  font-size: 12px;
}

.file-progress {
  width: 200px;
  margin: 0 16px;
}

.file-status {
  margin: 0 16px;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.upload-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>
```

## API

### 配置项（服务方式）

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| target | Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串；若传入字符串，则会将其作为参数传入 document.querySelector以获取到对应 DOM 节点 | string / HTMLElement | document.body |
| body | 同 v-loading 指令中的 body 修饰符 | boolean | false |
| fullscreen | 同 v-loading 指令中的 fullscreen 修饰符 | boolean | true |
| lock | 同 v-loading 指令中的 lock 修饰符 | boolean | false |
| text | 显示在加载图标下方的加载文案 | string | — |
| spinner | 自定义加载图标类名 | string | — |
| background | 遮罩背景色 | string | — |
| customClass | Loading 的自定义类名 | string | — |
| svg | 自定义 SVG 元素覆盖默认加载器 | string | — |
| svgViewBox | 设置用于加载 svg 元素的 viewBox 属性 | string | — |
| beforeClose | Loading 关闭之前执行的函数。如果此函数返回 false，关闭过程将被中止。反之，loading 将被关闭。 | Function | — |
| closed | Loading 完全关闭后触发的函数 | Function | — |

<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

### 指令

| 名称 | 说明 | 类型 |
|------|------|------|
| v-loading | 是否显示动画 | boolean / LoadingOptions |
| element-loading-text | 显示在加载图标下方的加载文案 | string |
| element-loading-spinner | 自定义加载图标 | string |
| element-loading-svg | 自定义加载图标 (与 element-loading-spinner 相同) | string |
| element-loading-background | 设置遮罩层背景色 | string |

<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

## 最佳实践

1. **合理选择加载方式**：区域加载适合表格、列表等局部内容，全屏加载适合页面级操作
2. **自定义加载内容**：根据业务场景自定义加载文案和图标，提升用户体验
3. **安全使用自定义图标**：确保 element-loading-spinner / element-loading-svg 的内容是可信的
4. **服务方式的单例特性**：了解全屏 Loading 的单例特性，避免重复创建
5. **异步关闭**：使用服务方式时，在 nextTick 中关闭 Loading 实例
6. **锁定滚动**：全屏加载时使用 lock 修饰符锁定页面滚动

## 常见问题

### Q: 指令方式和服务方式有什么区别？
A: 指令方式（v-loading）适合模板中直接绑定，服务方式（ElLoading.service）适合在 JavaScript 代码中动态调用。服务方式提供了更多的配置选项和控制能力。

### Q: 全屏 Loading 的单例特性是什么？
A: 以服务的方式调用的全屏 Loading 是单例的。若在前一个全屏 Loading 关闭前再次调用全屏 Loading，并不会创建一个新的 Loading 实例，而是返回现有全屏 Loading 的实例。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

### Q: 如何安全地使用自定义加载图标？
A: 虽然 element-loading-spinner / element-loading-svg 属性支持传入的 HTML 片段，但是动态在网站上渲染任意的 HTML 是非常危险的，因为很容易导致 XSS 攻击。请确保内容是可信的，不要将用户提交的内容赋值给这些属性。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

### Q: 如何在应用中继承上下文？
A: 现在 Loading 接受一条 context 作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Loading 中。如果您全局注册了 ELLoading 组件，它将自动继承应用的上下文环境。<mcreference link="https://element-plus.org/zh-CN/component/loading.html" index="1">1</mcreference>

## 实践项目

### 智能加载管理系统
创建一个完整的智能加载管理系统，包含以下功能：

1. **多场景加载状态**
   - 实现表格数据加载状态
   - 支持表单提交加载反馈
   - 处理文件上传进度显示
   - 管理页面切换加载状态

2. **加载状态管理**
   - 实现全局加载状态管理
   - 支持多个加载实例的协调
   - 处理加载状态的优先级
   - 管理加载的生命周期

3. **自定义加载组件**
   - 创建品牌化的加载动画
   - 实现进度条加载效果
   - 支持骨架屏加载模式
   - 定制加载文案和图标

4. **加载性能优化**
   - 实现加载状态的防抖处理
   - 优化加载动画的性能
   - 处理大量数据的分批加载
   - 监控加载时间和用户体验

### 实践要点
- 合理选择指令方式和服务方式
- 实现加载状态的统一管理
- 优化加载动画的视觉效果
- 确保加载组件的无障碍访问
- 处理异步操作的加载反馈

## 学习检查清单

### 基础功能
- [ ] 掌握 v-loading 指令的基本使用
- [ ] 理解 ElLoading.service 服务方式
- [ ] 熟练使用区域加载和全屏加载
- [ ] 掌握加载文案和图标的自定义

### 高级功能
- [ ] 实现自定义加载动画
- [ ] 处理加载状态的嵌套管理
- [ ] 掌握加载实例的生命周期控制
- [ ] 实现加载状态的全局管理

### 性能优化
- [ ] 理解全屏加载的单例特性
- [ ] 优化加载动画的性能表现
- [ ] 合理使用加载状态的防抖
- [ ] 处理大量数据的加载策略

### 用户体验
- [ ] 实现加载状态的响应式设计
- [ ] 处理加载过程的用户反馈
- [ ] 提供清晰的加载进度指示
- [ ] 确保加载组件的无障碍访问

## 注意事项

### 加载状态的用户感知
- 合理设置加载文案，让用户了解当前状态
- 避免过长的加载时间影响用户体验
- 提供加载进度指示，增强用户信心
- 在必要时提供取消加载的选项

### 加载组件的性能影响
- 避免在加载动画中使用复杂的计算
- 合理控制加载实例的数量
- 及时清理不需要的加载状态
- 监控加载组件对页面性能的影响

### 加载安全性考虑
- 确保自定义加载图标内容的安全性
- 避免在加载文案中显示敏感信息
- 防止加载状态被恶意利用
- 处理加载过程中的错误情况

### 移动端的加载体验
- 在小屏幕设备上优化加载动画
- 考虑触摸操作对加载的影响
- 提供合适的加载反馈时机
- 优化移动端的加载性能

---

## 总结

Loading 加载组件是 Element Plus 中用于显示加载状态的重要反馈组件，具有以下核心特点：

### 核心特点

1. **双重调用方式**：支持指令和服务两种调用方式，满足不同场景需求
2. **灵活覆盖范围**：可以应用于元素、区域或全屏，覆盖范围可控
3. **高度可定制**：支持自定义文本、图标、背景色等视觉元素
4. **单例模式**：全屏加载采用单例模式，避免重复显示
5. **安全可靠**：提供完善的错误处理和状态管理机制

### 适用场景

- **数据加载**：表格、列表、图表等数据获取时的加载提示
- **表单提交**：用户提交表单时的处理状态显示
- **文件操作**：文件上传、下载、处理时的进度提示
- **页面切换**：路由跳转、页面初始化时的加载状态
- **API 请求**：异步请求处理过程中的用户反馈

### 最佳实践建议

1. **合理选择调用方式**：简单场景使用指令，复杂场景使用服务方式
2. **适当的加载时机**：在真正需要等待的操作时才显示加载状态
3. **提供有意义的提示文本**：让用户了解当前正在进行的操作
4. **控制加载时长**：避免长时间显示加载状态，提供超时处理
5. **保持一致性**：在同一应用中保持加载样式和交互的一致性
6. **考虑用户体验**：在必要时提供取消操作的能力

通过合理使用 Loading 组件，可以有效提升应用的用户体验，让用户清楚了解系统状态，减少等待时的焦虑感。

## 参考资料

- [Element Plus Loading 官方文档](https://element-plus.org/zh-CN/component/loading.html)
- [Vue 3 指令文档](https://cn.vuejs.org/guide/reusability/custom-directives.html)
- [Web 无障碍访问指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [用户体验设计原则](https://www.nngroup.com/articles/response-times-3-important-limits/)

## 学习记录

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**



**实践项目完成情况：**
- [ ] 智能加载管理系统
- [ ] 多场景加载状态实现
- [ ] 加载状态管理功能
- [ ] 自定义加载组件
- [ ] 加载性能优化