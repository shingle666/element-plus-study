# Upload 上传

## 概述

Upload 上传组件是 Element Plus 提供的文件上传控件，支持多种上传方式和文件类型，提供了丰富的配置选项和事件处理机制。它可以处理单文件上传、多文件上传、拖拽上传、图片预览等多种场景。

## 学习目标

通过本章学习，你将掌握：

1. **基础上传功能**：单文件上传、多文件上传的实现
2. **高级特性**：拖拽上传、文件预览、进度显示
3. **文件处理**：文件类型限制、大小限制、格式验证
4. **自定义功能**：自定义上传按钮、自定义文件列表
5. **实际应用**：头像上传、文档管理、图片画廊等场景
6. **错误处理**：上传失败处理、重试机制

## 基础用法

### 1. 基本文件上传

最简单的文件上传功能：

```vue
<template>
  <div class="basic-upload-demo">
    <h3>基本文件上传</h3>
    
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">
          只能上传 jpg/png 文件，且不超过 500kb
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const fileList = ref([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  },
  {
    name: 'food2.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  }
])

const handleRemove = (file, uploadFiles) => {
  console.log('移除文件:', file, uploadFiles)
  ElMessage.success('文件已移除')
}

const handlePreview = (file) => {
  console.log('预览文件:', file)
  ElMessage.info('预览文件: ' + file.name)
}

const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + uploadFiles.length} 个文件`
  )
}

const beforeRemove = (file, uploadFiles) => {
  return ElMessageBox.confirm(
    `确定移除 ${file.name}？`
  ).then(
    () => true,
    () => false
  )
}
</script>

<style scoped>
.basic-upload-demo {
  padding: 20px;
}

.upload-demo {
  margin: 20px 0;
}
</style>
```

### 2. 拖拽上传

支持拖拽文件到指定区域进行上传：

```vue
<template>
  <div class="drag-upload-demo">
    <h3>拖拽上传</h3>
    
    <el-upload
      class="upload-dragger"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          支持 jpg/png/gif 文件，单个文件大小不超过 2MB
        </div>
      </template>
    </el-upload>
    
    <!-- 上传进度显示 -->
    <div v-if="uploadProgress.show" class="upload-progress">
      <h4>上传进度</h4>
      <el-progress 
        :percentage="uploadProgress.percentage" 
        :status="uploadProgress.status"
      />
      <p>{{ uploadProgress.text }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const uploadProgress = ref({
  show: false,
  percentage: 0,
  status: '',
  text: ''
})

const beforeUpload = (file) => {
  const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isValidType) {
    ElMessage.error('只能上传 JPG/PNG/GIF 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  
  // 显示上传进度
  uploadProgress.value = {
    show: true,
    percentage: 0,
    status: '',
    text: '准备上传...'
  }
  
  return true
}

const handleSuccess = (response, file, fileList) => {
  uploadProgress.value = {
    show: true,
    percentage: 100,
    status: 'success',
    text: '上传成功！'
  }
  
  setTimeout(() => {
    uploadProgress.value.show = false
  }, 2000)
  
  ElMessage.success('文件上传成功')
  console.log('上传成功:', response, file, fileList)
}

const handleError = (error, file, fileList) => {
  uploadProgress.value = {
    show: true,
    percentage: 100,
    status: 'exception',
    text: '上传失败！'
  }
  
  setTimeout(() => {
    uploadProgress.value.show = false
  }, 3000)
  
  ElMessage.error('文件上传失败')
  console.error('上传失败:', error, file, fileList)
}
</script>

<style scoped>
.drag-upload-demo {
  padding: 20px;
}

.upload-dragger {
  margin: 20px 0;
}

.upload-progress {
  margin-top: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.upload-progress h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.upload-progress p {
  margin: 8px 0 0 0;
  color: #606266;
  font-size: 14px;
}
</style>
```

### 3. 头像上传

专门用于头像上传的组件，支持图片预览和裁剪：

```vue
<template>
  <div class="avatar-upload-demo">
    <h3>头像上传</h3>
    
    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    
    <div class="avatar-actions">
      <el-button @click="resetAvatar" :disabled="!imageUrl">重置头像</el-button>
      <el-button type="primary" @click="saveAvatar" :disabled="!imageUrl">保存头像</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const imageUrl = ref('')

const handleAvatarSuccess = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  ElMessage.success('头像上传成功')
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过 2MB!')
    return false
  }
  return true
}

const resetAvatar = () => {
  imageUrl.value = ''
  ElMessage.info('头像已重置')
}

const saveAvatar = () => {
  // 这里可以调用 API 保存头像
  ElMessage.success('头像已保存')
}
</script>

<style scoped>
.avatar-upload-demo {
  padding: 20px;
}

.avatar-uploader {
  margin: 20px 0;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.avatar-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}
</style>
```

### 4. 图片列表上传

支持多张图片上传和预览：

```vue
<template>
  <div class="image-list-demo">
    <h3>图片列表上传</h3>
    
    <el-upload
      v-model:file-list="fileList"
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      multiple
      :limit="6"
      :on-exceed="handleExceed"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%" />
    </el-dialog>
    
    <div class="upload-stats">
      <p>已上传 {{ fileList.length }} 张图片，最多可上传 6 张</p>
      <el-button @click="clearAll" :disabled="fileList.length === 0">清空所有</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const fileList = ref([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  }
])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove = (file, uploadFiles) => {
  console.log('移除图片:', file, uploadFiles)
  ElMessage.success('图片已移除')
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `最多只能上传 6 张图片，当前已选择 ${uploadFiles.length} 张，本次选择了 ${files.length} 张`
  )
}

const clearAll = () => {
  ElMessageBox.confirm(
    '确定要清空所有图片吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    fileList.value = []
    ElMessage.success('已清空所有图片')
  })
}
</script>

<style scoped>
.image-list-demo {
  padding: 20px;
}

.upload-stats {
  margin-top: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-stats p {
  margin: 0;
  color: #606266;
}
</style>
```

## 高级功能

### 1. 自定义上传请求

使用自定义的上传逻辑：

```vue
<template>
  <div class="custom-upload-demo">
    <h3>自定义上传请求</h3>
    
    <el-upload
      class="upload-demo"
      :http-request="customUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      multiple
      :show-file-list="false"
    >
      <el-button type="primary" :loading="uploading">自定义上传</el-button>
    </el-upload>
    
    <!-- 文件列表 -->
    <div class="file-list">
      <div 
        v-for="file in uploadedFiles" 
        :key="file.id" 
        class="file-item"
      >
        <div class="file-info">
          <el-icon><Document /></el-icon>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
        </div>
        <div class="file-actions">
          <el-button 
            size="small" 
            @click="downloadFile(file)"
            :disabled="file.status !== 'success'"
          >
            下载
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="removeFile(file.id)"
          >
            删除
          </el-button>
        </div>
        <el-progress 
          v-if="file.status === 'uploading'"
          :percentage="file.progress" 
          :status="file.progress === 100 ? 'success' : ''"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'

const uploading = ref(false)
const uploadedFiles = ref([])

const customUpload = (options) => {
  const { file, onProgress, onSuccess, onError } = options
  
  // 创建文件记录
  const fileRecord = {
    id: Date.now() + Math.random(),
    name: file.name,
    size: file.size,
    status: 'uploading',
    progress: 0,
    url: ''
  }
  
  uploadedFiles.value.push(fileRecord)
  uploading.value = true
  
  // 模拟上传过程
  const formData = new FormData()
  formData.append('file', file)
  
  // 这里使用模拟的上传过程
  simulateUpload(fileRecord, onProgress, onSuccess, onError)
}

const simulateUpload = (fileRecord, onProgress, onSuccess, onError) => {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 30
    if (progress > 100) {
      progress = 100
      clearInterval(interval)
      
      // 模拟上传成功
      setTimeout(() => {
        fileRecord.status = 'success'
        fileRecord.progress = 100
        fileRecord.url = URL.createObjectURL(new Blob())
        
        onSuccess({ url: fileRecord.url })
        uploading.value = false
        ElMessage.success('文件上传成功')
      }, 500)
    } else {
      fileRecord.progress = Math.floor(progress)
      onProgress({ percent: progress })
    }
  }, 200)
}

const beforeUpload = (file) => {
  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return true
}

const handleProgress = (event, file, fileList) => {
  console.log('上传进度:', event.percent)
}

const handleSuccess = (response, file, fileList) => {
  console.log('上传成功:', response)
}

const handleError = (error, file, fileList) => {
  console.error('上传失败:', error)
  uploading.value = false
  
  // 更新文件状态
  const fileRecord = uploadedFiles.value.find(f => f.name === file.name)
  if (fileRecord) {
    fileRecord.status = 'error'
  }
  
  ElMessage.error('文件上传失败')
}

const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(1) + ' MB'
  }
}

const downloadFile = (file) => {
  if (file.url) {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.click()
    ElMessage.success('开始下载文件')
  }
}

const removeFile = (fileId) => {
  const index = uploadedFiles.value.findIndex(f => f.id === fileId)
  if (index > -1) {
    uploadedFiles.value.splice(index, 1)
    ElMessage.success('文件已删除')
  }
}
</script>

<style scoped>
.custom-upload-demo {
  padding: 20px;
}

.upload-demo {
  margin: 20px 0;
}

.file-list {
  margin-top: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  margin-bottom: 8px;
  background: #fafafa;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: #303133;
}

.file-size {
  color: #909399;
  font-size: 12px;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.file-item .el-progress {
  margin-top: 8px;
}
</style>
```

## 实际应用示例

### 1. 文档管理系统

创建一个完整的文档管理上传界面：

```vue
<template>
  <div class="document-manager-demo">
    <h3>文档管理系统</h3>
    
    <div class="manager-container">
      <!-- 上传区域 -->
      <div class="upload-section">
        <h4>上传文档</h4>
        
        <el-upload
          class="upload-dragger"
          drag
          :http-request="uploadDocument"
          :before-upload="beforeUpload"
          multiple
          :accept="acceptedTypes"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文档拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 PDF、Word、Excel、PPT 文件，单个文件不超过 50MB
            </div>
          </template>
        </el-upload>
        
        <!-- 分类选择 -->
        <div class="category-section">
          <label>文档分类：</label>
          <el-select v-model="selectedCategory" placeholder="选择分类">
            <el-option 
              v-for="category in categories" 
              :key="category.value" 
              :label="category.label" 
              :value="category.value"
            />
          </el-select>
        </div>
      </div>
      
      <!-- 文档列表 -->
      <div class="document-list">
        <h4>文档列表</h4>
        
        <div class="list-header">
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索文档" 
            prefix-icon="Search"
            style="width: 200px;"
          />
          <el-select v-model="filterCategory" placeholder="筛选分类" style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option 
              v-for="category in categories" 
              :key="category.value" 
              :label="category.label" 
              :value="category.value"
            />
          </el-select>
        </div>
        
        <el-table :data="filteredDocuments" style="width: 100%">
          <el-table-column prop="name" label="文档名称" min-width="200">
            <template #default="{ row }">
              <div class="document-name">
                <el-icon>{{ getFileIcon(row.type) }}</el-icon>
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="size" label="大小" width="100">
            <template #default="{ row }">
              {{ formatFileSize(row.size) }}
            </template>
          </el-table-column>
          <el-table-column prop="uploadTime" label="上传时间" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="previewDocument(row)">预览</el-button>
              <el-button size="small" @click="downloadDocument(row)">下载</el-button>
              <el-button size="small" type="danger" @click="deleteDocument(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled, Document, Picture, VideoPlay } from '@element-plus/icons-vue'

const selectedCategory = ref('')
const searchKeyword = ref('')
const filterCategory = ref('')

const categories = ref([
  { label: '合同文档', value: 'contract' },
  { label: '技术文档', value: 'technical' },
  { label: '财务报表', value: 'financial' },
  { label: '项目资料', value: 'project' },
  { label: '其他', value: 'other' }
])

const acceptedTypes = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'

const documents = ref([
  {
    id: 1,
    name: '项目需求文档.docx',
    type: 'docx',
    category: '技术文档',
    size: 2048576,
    uploadTime: '2024-01-15 10:30:00',
    status: '已上传',
    url: '#'
  },
  {
    id: 2,
    name: '财务报表Q1.xlsx',
    type: 'xlsx',
    category: '财务报表',
    size: 1024000,
    uploadTime: '2024-01-14 14:20:00',
    status: '已上传',
    url: '#'
  }
])

const filteredDocuments = computed(() => {
  let result = documents.value
  
  if (searchKeyword.value) {
    result = result.filter(doc => 
      doc.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  if (filterCategory.value) {
    result = result.filter(doc => doc.category === filterCategory.value)
  }
  
  return result
})

const uploadDocument = (options) => {
  const { file } = options
  
  if (!selectedCategory.value) {
    ElMessage.warning('请先选择文档分类')
    return
  }
  
  // 模拟上传
  const newDocument = {
    id: Date.now(),
    name: file.name,
    type: file.name.split('.').pop(),
    category: categories.value.find(c => c.value === selectedCategory.value)?.label || '其他',
    size: file.size,
    uploadTime: new Date().toLocaleString(),
    status: '已上传',
    url: URL.createObjectURL(file)
  }
  
  documents.value.unshift(newDocument)
  ElMessage.success('文档上传成功')
}

const beforeUpload = (file) => {
  const isValidType = acceptedTypes.split(',').some(type => 
    file.name.toLowerCase().endsWith(type.replace('.', ''))
  )
  const isLt50M = file.size / 1024 / 1024 < 50
  
  if (!isValidType) {
    ElMessage.error('不支持的文件类型')
    return false
  }
  if (!isLt50M) {
    ElMessage.error('文件大小不能超过 50MB')
    return false
  }
  return true
}

const getFileIcon = (type) => {
  const iconMap = {
    pdf: Document,
    doc: Document,
    docx: Document,
    xls: Document,
    xlsx: Document,
    ppt: Document,
    pptx: Document
  }
  return iconMap[type] || Document
}

const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(1) + ' MB'
  }
}

const getStatusType = (status) => {
  const typeMap = {
    '已上传': 'success',
    '上传中': 'warning',
    '上传失败': 'danger'
  }
  return typeMap[status] || 'info'
}

const previewDocument = (document) => {
  ElMessage.info(`预览文档: ${document.name}`)
  // 这里可以实现文档预览功能
}

const downloadDocument = (document) => {
  ElMessage.success(`开始下载: ${document.name}`)
  // 这里可以实现文档下载功能
}

const deleteDocument = (document) => {
  ElMessageBox.confirm(
    `确定要删除文档 "${document.name}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = documents.value.findIndex(d => d.id === document.id)
    if (index > -1) {
      documents.value.splice(index, 1)
      ElMessage.success('文档已删除')
    }
  })
}
</script>

<style scoped>
.document-manager-demo {
  padding: 20px;
}

.manager-container {
  display: flex;
  gap: 24px;
}

.upload-section {
  width: 400px;
}

.upload-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.upload-dragger {
  margin-bottom: 20px;
}

.category-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.category-section label {
  font-weight: 500;
  color: #303133;
}

.document-list {
  flex: 1;
}

.document-list h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.list-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.document-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.document-name span {
  color: #303133;
}
</style>
```

### 2. 图片画廊上传

创建一个图片画廊的上传和管理界面：

```vue
<template>
  <div class="gallery-upload-demo">
    <h3>图片画廊上传</h3>
    
    <div class="gallery-container">
      <!-- 上传区域 -->
      <div class="upload-section">
        <el-upload
          class="gallery-uploader"
          drag
          :http-request="uploadImage"
          :before-upload="beforeImageUpload"
          multiple
          accept="image/*"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽图片到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 JPG、PNG、GIF 格式，单张图片不超过 5MB
            </div>
          </template>
        </el-upload>
        
        <!-- 批量操作 -->
        <div class="batch-actions">
          <el-button @click="selectAll" :disabled="images.length === 0">全选</el-button>
          <el-button @click="clearSelection" :disabled="selectedImages.length === 0">取消选择</el-button>
          <el-button type="danger" @click="deleteSelected" :disabled="selectedImages.length === 0">
            删除选中 ({{ selectedImages.length }})
          </el-button>
        </div>
      </div>
      
      <!-- 图片网格 -->
      <div class="image-grid">
        <div 
          v-for="image in images" 
          :key="image.id" 
          class="image-item"
          :class="{ selected: selectedImages.includes(image.id) }"
          @click="toggleSelection(image.id)"
        >
          <div class="image-wrapper">
            <img :src="image.thumbnail" :alt="image.name" />
            <div class="image-overlay">
              <div class="image-actions">
                <el-button size="small" circle @click.stop="previewImage(image)">
                  <el-icon><ZoomIn /></el-icon>
                </el-button>
                <el-button size="small" circle @click.stop="downloadImage(image)">
                  <el-icon><Download /></el-icon>
                </el-button>
                <el-button size="small" circle type="danger" @click.stop="deleteImage(image.id)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="image-info">
              <p class="image-name">{{ image.name }}</p>
              <p class="image-size">{{ formatFileSize(image.size) }}</p>
            </div>
          </div>
          <el-checkbox 
            :model-value="selectedImages.includes(image.id)"
            @change="toggleSelection(image.id)"
            class="image-checkbox"
            @click.stop
          />
        </div>
      </div>
    </div>
    
    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewVisible" width="80%" center>
      <template #header>
        <span>{{ currentPreviewImage?.name }}</span>
      </template>
      <div class="preview-container">
        <img :src="currentPreviewImage?.url" :alt="currentPreviewImage?.name" />
      </div>
      <template #footer>
        <div class="preview-actions">
          <el-button @click="previousImage" :disabled="currentImageIndex === 0">
            上一张
          </el-button>
          <span>{{ currentImageIndex + 1 }} / {{ images.length }}</span>
          <el-button @click="nextImage" :disabled="currentImageIndex === images.length - 1">
            下一张
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled, ZoomIn, Download, Delete } from '@element-plus/icons-vue'

const images = ref([
  {
    id: 1,
    name: 'landscape1.jpg',
    size: 2048576,
    url: 'https://picsum.photos/800/600?random=1',
    thumbnail: 'https://picsum.photos/300/200?random=1'
  },
  {
    id: 2,
    name: 'landscape2.jpg',
    size: 1536000,
    url: 'https://picsum.photos/800/600?random=2',
    thumbnail: 'https://picsum.photos/300/200?random=2'
  }
])

const selectedImages = ref([])
const previewVisible = ref(false)
const currentPreviewImage = ref(null)
const currentImageIndex = ref(0)

const uploadImage = (options) => {
  const { file } = options
  
  // 模拟上传
  const newImage = {
    id: Date.now() + Math.random(),
    name: file.name,
    size: file.size,
    url: URL.createObjectURL(file),
    thumbnail: URL.createObjectURL(file)
  }
  
  images.value.unshift(newImage)
  ElMessage.success('图片上传成功')
}

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const toggleSelection = (imageId) => {
  const index = selectedImages.value.indexOf(imageId)
  if (index > -1) {
    selectedImages.value.splice(index, 1)
  } else {
    selectedImages.value.push(imageId)
  }
}

const selectAll = () => {
  selectedImages.value = images.value.map(img => img.id)
}

const clearSelection = () => {
  selectedImages.value = []
}

const deleteSelected = () => {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedImages.value.length} 张图片吗？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    images.value = images.value.filter(img => !selectedImages.value.includes(img.id))
    selectedImages.value = []
    ElMessage.success('已删除选中的图片')
  })
}

const previewImage = (image) => {
  currentPreviewImage.value = image
  currentImageIndex.value = images.value.findIndex(img => img.id === image.id)
  previewVisible.value = true
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
    currentPreviewImage.value = images.value[currentImageIndex.value]
  }
}

const nextImage = () => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++
    currentPreviewImage.value = images.value[currentImageIndex.value]
  }
}

const downloadImage = (image) => {
  const link = document.createElement('a')
  link.href = image.url
  link.download = image.name
  link.click()
  ElMessage.success('开始下载图片')
}

const deleteImage = (imageId) => {
  ElMessageBox.confirm(
    '确定要删除这张图片吗？',
    '删除图片',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = images.value.findIndex(img => img.id === imageId)
    if (index > -1) {
      images.value.splice(index, 1)
      // 从选中列表中移除
      const selectedIndex = selectedImages.value.indexOf(imageId)
      if (selectedIndex > -1) {
        selectedImages.value.splice(selectedIndex, 1)
      }
      ElMessage.success('图片已删除')
    }
  })
}

const formatFileSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(1) + ' MB'
  }
}
</script>

<style scoped>
.gallery-upload-demo {
  padding: 20px;
}

.gallery-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gallery-uploader {
  width: 100%;
}

.batch-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.image-item {
  position: relative;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-item:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.image-item.selected {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.5);
}

.image-wrapper {
  position: relative;
  background: #f5f7fa;
}

.image-wrapper img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-actions {
  display: flex;
  gap: 8px;
}

.image-info {
  padding: 12px;
  background: white;
}

.image-name {
  margin: 0 0 4px 0;
  font-weight: 500;
  color: #303133;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-size {
  margin: 0;
  color: #909399;
  font-size: 12px;
}

.image-checkbox {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 4px;
}

.preview-container {
  text-align: center;
  max-height: 70vh;
  overflow: auto;
}

.preview-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
</style>
```

## API 文档

### Upload Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| action | 上传的地址 | string | — | — |
| headers | 设置上传的请求头部 | object | — | — |
| method | 设置上传请求方法 | string | post/put/patch | post |
| multiple | 是否支持多选文件 | boolean | — | false |
| data | 上传时附带的额外参数 | object | — | — |
| name | 上传的文件字段名 | string | — | file |
| with-credentials | 支持发送 cookie 凭证信息 | boolean | — | false |
| show-file-list | 是否显示已上传文件列表 | boolean | — | true |
| drag | 是否启用拖拽上传 | boolean | — | false |
| accept | 接受上传的文件类型 | string | — | — |
| on-preview | 点击文件列表中已上传的文件时的钩子 | function(file) | — | — |
| on-remove | 文件列表移除文件时的钩子 | function(file, fileList) | — | — |
| on-success | 文件上传成功时的钩子 | function(response, file, fileList) | — | — |
| on-error | 文件上传失败时的钩子 | function(err, file, fileList) | — | — |
| on-progress | 文件上传时的钩子 | function(event, file, fileList) | — | — |
| on-change | 文件状态改变时的钩子 | function(file, fileList) | — | — |
| before-upload | 上传文件之前的钩子 | function(file) | — | — |
| before-remove | 删除文件之前的钩子 | function(file, fileList) | — | — |
| list-type | 文件列表的类型 | string | text/picture/picture-card | text |
| auto-upload | 是否在选取文件后立即进行上传 | boolean | — | true |
| file-list | 上传的文件列表 | array | — | [] |
| http-request | 覆盖默认的上传行为 | function | — | — |
| disabled | 是否禁用 | boolean | — | false |
| limit | 最大允许上传个数 | number | — | — |
| on-exceed | 文件超出个数限制时的钩子 | function(files, fileList) | — | — |

### Upload Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearFiles | 清空已上传的文件列表 | — |
| abort | 取消上传请求 | file |
| submit | 手动上传文件列表 | — |

### Upload Slots

| 插槽名 | 说明 |
|--------|------|
| default | 触发文件选择框的内容 |
| trigger | 触发文件选择框的内容 |
| tip | 提示说明文字 |
| file | 文件列表的内容 |

## 实践练习

### 练习1：个人资料上传

创建一个个人资料页面，包含头像上传和文档上传功能：

```vue
<template>
  <div class="profile-upload-demo">
    <h3>个人资料上传</h3>
    
    <el-form :model="profile" label-width="120px">
      <!-- 头像上传 -->
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadAvatar"
        >
          <img v-if="profile.avatar" :src="profile.avatar" class="avatar" />
          <div v-else class="avatar-placeholder">
            <el-icon><Plus /></el-icon>
            <p>上传头像</p>
          </div>
        </el-upload>
      </el-form-item>
      
      <!-- 基本信息 -->
      <el-form-item label="姓名">
        <el-input v-model="profile.name" placeholder="请输入姓名" />
      </el-form-item>
      
      <el-form-item label="邮箱">
        <el-input v-model="profile.email" placeholder="请输入邮箱" />
      </el-form-item>
      
      <!-- 简历上传 -->
      <el-form-item label="简历">
        <el-upload
          class="resume-uploader"
          action="#"
          :on-success="handleResumeSuccess"
          :before-upload="beforeResumeUpload"
          :http-request="uploadResume"
          accept=".pdf,.doc,.docx"
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon>
            上传简历
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              支持 PDF、Word 格式，文件大小不超过 10MB
            </div>
          </template>
        </el-upload>
        
        <div v-if="profile.resume" class="resume-info">
          <el-icon><Document /></el-icon>
          <span>{{ profile.resume.name }}</span>
          <el-button size="small" @click="downloadResume">下载</el-button>
          <el-button size="small" type="danger" @click="removeResume">删除</el-button>
        </div>
      </el-form-item>
      
      <!-- 证书上传 -->
      <el-form-item label="证书">
        <el-upload
          class="certificate-uploader"
          action="#"
          :http-request="uploadCertificate"
          :before-upload="beforeCertificateUpload"
          list-type="picture-card"
          :file-list="profile.certificates"
          :on-remove="removeCertificate"
          multiple
          :limit="5"
          :on-exceed="handleCertificateExceed"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="saveProfile">保存资料</el-button>
        <el-button @click="resetProfile">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Upload, Document } from '@element-plus/icons-vue'

const profile = ref({
  name: '',
  email: '',
  avatar: '',
  resume: null,
  certificates: []
})

const uploadAvatar = (options) => {
  const { file } = options
  // 模拟上传
  setTimeout(() => {
    profile.value.avatar = URL.createObjectURL(file)
    ElMessage.success('头像上传成功')
  }, 1000)
}

const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('头像必须是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarSuccess = () => {
  // 头像上传成功后的处理
}

const uploadResume = (options) => {
  const { file } = options
  // 模拟上传
  setTimeout(() => {
    profile.value.resume = {
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }
    ElMessage.success('简历上传成功')
  }, 1000)
}

const beforeResumeUpload = (file) => {
  const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
  const isLt10M = file.size / 1024 / 1024 < 10
  
  if (!isValidType) {
    ElMessage.error('简历必须是 PDF 或 Word 格式!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('简历大小不能超过 10MB!')
    return false
  }
  return true
}

const handleResumeSuccess = () => {
  // 简历上传成功后的处理
}

const downloadResume = () => {
  if (profile.value.resume) {
    const link = document.createElement('a')
    link.href = profile.value.resume.url
    link.download = profile.value.resume.name
    link.click()
    ElMessage.success('开始下载简历')
  }
}

const removeResume = () => {
  profile.value.resume = null
  ElMessage.success('简历已删除')
}

const uploadCertificate = (options) => {
  const { file } = options
  // 模拟上传
  setTimeout(() => {
    const certificate = {
      name: file.name,
      url: URL.createObjectURL(file),
      uid: Date.now() + Math.random()
    }
    profile.value.certificates.push(certificate)
    ElMessage.success('证书上传成功')
  }, 1000)
}

const beforeCertificateUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  
  if (!isImage) {
    ElMessage.error('证书必须是图片格式!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('证书图片大小不能超过 5MB!')
    return false
  }
  return true
}

const removeCertificate = (file) => {
  const index = profile.value.certificates.findIndex(cert => cert.uid === file.uid)
  if (index > -1) {
    profile.value.certificates.splice(index, 1)
    ElMessage.success('证书已删除')
  }
}

const handleCertificateExceed = () => {
  ElMessage.warning('最多只能上传 5 张证书图片')
}

const saveProfile = () => {
  // 保存个人资料
  ElMessage.success('个人资料保存成功')
}

const resetProfile = () => {
  profile.value = {
    name: '',
    email: '',
    avatar: '',
    resume: null,
    certificates: []
  }
  ElMessage.info('资料已重置')
}
</script>

<style scoped>
.profile-upload-demo {
  max-width: 600px;
  padding: 20px;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c939d;
  background: #fafafa;
}

.avatar-placeholder .el-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.avatar-placeholder p {
  margin: 0;
  font-size: 14px;
}

.resume-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.resume-info span {
  flex: 1;
  color: #303133;
}
</style>
```

## 常见问题

### 1. 文件上传失败

**问题**：文件上传时出现网络错误或服务器错误

**解决方案**：
- 检查上传地址是否正确
- 验证服务器是否支持对应的文件类型
- 实现重试机制
- 添加错误处理和用户提示

```javascript
const handleUploadError = (error, file, fileList) => {
  console.error('上传失败:', error)
  
  // 根据错误类型给出不同提示
  if (error.status === 413) {
    ElMessage.error('文件过大，请选择较小的文件')
  } else if (error.status === 415) {
    ElMessage.error('不支持的文件类型')
  } else {
    ElMessage.error('上传失败，请重试')
  }
}
```

### 2. 文件大小和类型限制

**问题**：如何有效地限制文件大小和类型

**解决方案**：
- 使用 `before-upload` 钩子进行验证
- 设置 `accept` 属性限制文件类型
- 提供清晰的错误提示

```javascript
const beforeUpload = (file) => {
  // 文件类型检查
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('只支持 JPG、PNG、PDF 格式的文件')
    return false
  }
  
  // 文件大小检查
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过 10MB')
    return false
  }
  
  return true
}
```

### 3. 上传进度显示

**问题**：如何显示文件上传进度

**解决方案**：
- 使用 `on-progress` 事件监听上传进度
- 结合 Progress 组件显示进度条
- 提供取消上传功能

```javascript
const uploadProgress = ref({})

const handleProgress = (event, file, fileList) => {
  uploadProgress.value[file.uid] = {
    percentage: Math.round(event.percent),
    status: event.percent === 100 ? 'success' : ''
  }
}
```

### 4. 自定义上传逻辑

**问题**：需要实现自定义的上传逻辑

**解决方案**：
- 使用 `http-request` 属性覆盖默认上传行为
- 实现自定义的文件上传函数
- 处理上传状态和错误

```javascript
const customUpload = async (options) => {
  const { file, onProgress, onSuccess, onError } = options
  
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress({ percent: percentCompleted })
      }
    })
    
    const result = await response.json()
    onSuccess(result)
  } catch (error) {
    onError(error)
  }
}
```

## 最佳实践

### 1. 用户体验优化

- **清晰的提示**：提供明确的文件要求和限制说明
- **拖拽支持**：启用拖拽上传提升用户体验
- **进度反馈**：显示上传进度和状态
- **错误处理**：提供友好的错误提示和重试机制

### 2. 性能优化

- **文件压缩**：在上传前对图片进行压缩
- **分片上传**：对大文件实现分片上传
- **并发控制**：限制同时上传的文件数量
- **缓存机制**：避免重复上传相同文件

### 3. 安全考虑

- **文件类型验证**：在前端和后端都进行文件类型检查
- **文件大小限制**：设置合理的文件大小限制
- **病毒扫描**：在服务器端进行病毒扫描
- **访问控制**：实现适当的文件访问权限控制

### 4. 可访问性

- **键盘导航**：确保可以通过键盘操作
- **屏幕阅读器**：提供适当的标签和描述
- **高对比度**：支持高对比度模式
- **焦点管理**：合理管理焦点状态

## 总结

Upload 上传组件是一个功能丰富且灵活的文件上传解决方案。通过本章的学习，你应该掌握了：

1. **基础功能**：单文件上传、多文件上传、拖拽上传的实现
2. **高级特性**：自定义上传逻辑、进度显示、文件预览
3. **实际应用**：头像上传、文档管理、图片画廊等场景
4. **错误处理**：文件验证、上传失败处理、重试机制
5. **最佳实践**：用户体验、性能优化、安全考虑

在实际开发中，要根据具体需求选择合适的上传方式和配置，注意文件安全和用户体验，确保组件在各种场景下都能稳定工作。

## 参考资料

- [Element Plus Upload 官方文档](https://element-plus.org/zh-CN/component/upload.html)
- [MDN - File API](https://developer.mozilla.org/zh-CN/docs/Web/API/File)
- [MDN - FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)
- [Web Security Guidelines](https://owasp.org/www-project-web-security-testing-guide/)
- [Vue 3 Composition API](https://cn.vuejs.org/api/composition-api-setup.html)