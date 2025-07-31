# Image 图片

## 概述

Image 图片组件是 Element Plus 提供的增强型图片展示组件，支持懒加载、自定义占位符、加载失败处理、图片预览等功能。相比原生 img 标签，它提供了更好的用户体验和更丰富的功能。<mcreference link="https://element-plus.org/zh-CN/component/image.html" index="0">0</mcreference>

## 学习目标

- 掌握 Image 组件的基础用法和配置
- 学会使用懒加载和占位符功能
- 理解不同的图片适应模式
- 掌握图片预览和加载失败处理
- 了解在实际项目中的应用场景和最佳实践

## 基础用法

### 基础图片展示

最简单的用法，展示一张图片。<mcreference link="https://element-plus.org/zh-CN/component/image.html" index="0">0</mcreference>

```vue
<template>
  <div class="basic-image-demo">
    <h3>基础图片展示</h3>
    
    <el-image
      style="width: 300px; height: 200px"
      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      fit="cover"
    />
  </div>
</template>
```

### 不同的适应模式

通过 `fit` 属性可以设置图片如何适应容器，类似于原生 CSS 的 object-fit。<mcreference link="https://element-plus.org/zh-CN/component/image.html" index="0">0</mcreference>

```vue
<template>
  <div class="fit-demo">
    <h3>不同的适应模式</h3>
    
    <div class="demo-image-container">
      <div class="demo-image-item" v-for="fit in fits" :key="fit">
        <span class="demo-image-text">{{ fit }}</span>
        <el-image
          style="width: 100px; height: 100px"
          :src="imageUrl"
          :fit="fit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fits = ['fill', 'contain', 'cover', 'none', 'scale-down']
const imageUrl = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
</script>

<style scoped>
.demo-image-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.demo-image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.demo-image-text {
  font-size: 14px;
  color: #8492a6;
  text-align: center;
}
</style>
```

### 占位符

可以通过 `slot` 来自定义占位符内容。<mcreference link="https://element-plus.org/zh-CN/component/image.html" index="0">0</mcreference>

```vue
<template>
  <div class="placeholder-demo">
    <h3>自定义占位符</h3>
    
    <div class="demo-image-container">
      <!-- 默认占位符 -->
      <div class="demo-image-item">
        <span class="demo-image-text">默认占位符</span>
        <el-image
          style="width: 100px; height: 100px"
          src=""
        />
      </div>
      
      <!-- 自定义占位符 -->
      <div class="demo-image-item">
        <span class="demo-image-text">自定义占位符</span>
        <el-image
          style="width: 100px; height: 100px"
          src=""
        >
          <template #placeholder>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
              <span>加载中...</span>
            </div>
          </template>
        </el-image>
      </div>
      
      <!-- 加载失败占位符 -->
      <div class="demo-image-item">
        <span class="demo-image-text">加载失败</span>
        <el-image
          style="width: 100px; height: 100px"
          src="https://invalid-url.jpg"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
              <span>加载失败</span>
            </div>
          </template>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Picture } from '@element-plus/icons-vue'
</script>

<style scoped>
.demo-image-container {
  display: flex;
  gap: 20px;
}

.demo-image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.demo-image-text {
  font-size: 14px;
  color: #8492a6;
  text-align: center;
}

.image-slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 12px;
  gap: 4px;
}
</style>
```

### 懒加载

通过 `lazy` 属性开启懒加载功能，图片将在进入视口时才开始加载。<mcreference link="https://element-plus.org/zh-CN/component/image.html" index="0">0</mcreference>

```vue
<template>
  <div class="lazy-demo">
    <h3>懒加载</h3>
    
    <div class="lazy-container">
      <el-image
        v-for="(url, index) in imageUrls"
        :key="index"
        :src="url"
        lazy
        style="width: 200px; height: 200px; margin: 10px;"
        fit="cover"
      >
        <template #placeholder>
          <div class="image-slot">
            <el-icon><Loading /></el-icon>
            <span>懒加载中...</span>
          </div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const imageUrls = ref([
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
])
</script>

<style scoped>
.lazy-container {
  height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 12px;
  gap: 4px;
}
</style>
```

### 图片预览

通过 `preview-src-list` 属性可以开启图片预览功能。<mcreference link="https://element-plus.org/zh-CN/component/image.html" index="0">0</mcreference>

```vue
<template>
  <div class="preview-demo">
    <h3>图片预览</h3>
    
    <div class="preview-container">
      <el-image
        v-for="(url, index) in imageUrls"
        :key="index"
        :src="url"
        :preview-src-list="imageUrls"
        :initial-index="index"
        style="width: 100px; height: 100px; margin: 5px;"
        fit="cover"
        preview-teleported
      />
    </div>
    
    <p style="margin-top: 16px; color: #606266; font-size: 14px;">
      点击图片可以预览，支持缩放、旋转等操作
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const imageUrls = ref([
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg'
])
</script>

<style scoped>
.preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
```

## 实际应用示例

### 商品图片展示

```vue
<template>
  <div class="product-gallery-demo">
    <h3>商品图片展示</h3>
    
    <div class="product-gallery">
      <!-- 主图 -->
      <div class="main-image">
        <el-image
          :src="currentImage"
          :preview-src-list="product.images"
          :initial-index="currentIndex"
          style="width: 400px; height: 400px;"
          fit="cover"
          preview-teleported
        >
          <template #placeholder>
            <div class="image-slot">
              <el-icon><Loading /></el-icon>
              <span>加载中...</span>
            </div>
          </template>
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
              <span>加载失败</span>
            </div>
          </template>
        </el-image>
      </div>
      
      <!-- 缩略图 -->
      <div class="thumbnail-list">
        <div
          v-for="(image, index) in product.images"
          :key="index"
          class="thumbnail-item"
          :class="{ active: index === currentIndex }"
          @click="selectImage(index)"
        >
          <el-image
            :src="image"
            style="width: 80px; height: 80px;"
            fit="cover"
          >
            <template #placeholder>
              <div class="thumbnail-placeholder">
                <el-icon><Loading /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
      </div>
    </div>
    
    <!-- 产品信息 -->
    <div class="product-info">
      <h4>{{ product.name }}</h4>
      <p class="product-price">¥{{ product.price }}</p>
      <p class="product-description">{{ product.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Loading, Picture } from '@element-plus/icons-vue'

const currentIndex = ref(0)
const currentImage = ref('')

const product = ref({
  name: 'iPhone 15 Pro',
  price: '7999',
  description: '采用航空级钛金属设计，搭载强大的 A17 Pro 芯片，配备专业级摄像头系统。',
  images: [
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg'
  ]
})

// 初始化当前图片
currentImage.value = product.value.images[0]

const selectImage = (index) => {
  currentIndex.value = index
  currentImage.value = product.value.images[index]
}
</script>

<style scoped>
.product-gallery {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.main-image {
  flex-shrink: 0;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thumbnail-item {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.thumbnail-item:hover {
  border-color: #409eff;
}

.thumbnail-item.active {
  border-color: #409eff;
}

.thumbnail-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.image-slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 12px;
  gap: 4px;
}

.product-info h4 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #303133;
}

.product-price {
  font-size: 28px;
  color: #f56c6c;
  font-weight: bold;
  margin: 0 0 15px 0;
}

.product-description {
  color: #606266;
  line-height: 1.6;
  margin: 0;
}
</style>
```

### 用户头像上传

```vue
<template>
  <div class="avatar-upload-demo">
    <h3>用户头像上传</h3>
    
    <div class="avatar-upload">
      <el-image
        :src="avatarUrl"
        style="width: 120px; height: 120px; border-radius: 50%;"
        fit="cover"
        @click="handleAvatarClick"
      >
        <template #placeholder>
          <div class="avatar-placeholder">
            <el-icon><Plus /></el-icon>
            <span>上传头像</span>
          </div>
        </template>
        <template #error>
          <div class="avatar-placeholder">
            <el-icon><User /></el-icon>
            <span>默认头像</span>
          </div>
        </template>
      </el-image>
      
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display: none;"
        @change="handleFileChange"
      />
      
      <div class="avatar-actions">
        <el-button size="small" @click="handleAvatarClick">
          <el-icon><Upload /></el-icon>
          更换头像
        </el-button>
        <el-button size="small" type="danger" @click="removeAvatar" v-if="avatarUrl">
          <el-icon><Delete /></el-icon>
          删除头像
        </el-button>
      </div>
    </div>
    
    <div class="upload-tips">
      <p>支持 JPG、PNG 格式，文件大小不超过 2MB</p>
      <p>建议上传正方形图片，获得最佳显示效果</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, User, Upload, Delete } from '@element-plus/icons-vue'

const avatarUrl = ref('')
const fileInput = ref(null)

const handleAvatarClick = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }
  
  // 验证文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过 2MB')
    return
  }
  
  // 读取文件并预览
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarUrl.value = e.target.result
    ElMessage.success('头像上传成功')
  }
  reader.readAsDataURL(file)
  
  // 清空 input 值，允许重复选择同一文件
  event.target.value = ''
}

const removeAvatar = () => {
  avatarUrl.value = ''
  ElMessage.success('头像已删除')
}
</script>

<style scoped>
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 12px;
  gap: 4px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.avatar-placeholder:hover {
  background: #e6f7ff;
  color: #409eff;
}

.avatar-actions {
  display: flex;
  gap: 8px;
}

.upload-tips {
  background: #f0f9ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  padding: 12px;
  color: #606266;
  font-size: 12px;
}

.upload-tips p {
  margin: 0;
  line-height: 1.5;
}

.upload-tips p + p {
  margin-top: 4px;
}
</style>
```

### 图片瀑布流

```vue
<template>
  <div class="waterfall-demo">
    <h3>图片瀑布流</h3>
    
    <div class="waterfall-container" ref="containerRef">
      <div
        v-for="(item, index) in imageList"
        :key="index"
        class="waterfall-item"
        :style="{ height: item.height + 'px' }"
      >
        <el-image
          :src="item.url"
          :preview-src-list="imageUrls"
          :initial-index="index"
          style="width: 100%; height: 100%;"
          fit="cover"
          lazy
          preview-teleported
        >
          <template #placeholder>
            <div class="image-placeholder">
              <el-icon><Loading /></el-icon>
            </div>
          </template>
          <template #error>
            <div class="image-placeholder">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
        
        <div class="image-overlay">
          <div class="image-info">
            <span class="image-title">{{ item.title }}</span>
            <span class="image-size">{{ item.width }} × {{ item.height }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="load-more" v-if="hasMore">
      <el-button @click="loadMore" :loading="loading">
        {{ loading ? '加载中...' : '加载更多' }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Loading, Picture } from '@element-plus/icons-vue'

const containerRef = ref(null)
const loading = ref(false)
const hasMore = ref(true)

const imageList = ref([
  {
    url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    title: '美丽风景 1',
    width: 300,
    height: 200
  },
  {
    url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    title: '美丽风景 2',
    width: 300,
    height: 300
  },
  {
    url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    title: '美丽风景 3',
    width: 300,
    height: 250
  },
  {
    url: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    title: '美丽风景 4',
    width: 300,
    height: 180
  },
  {
    url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    title: '美丽风景 5',
    width: 300,
    height: 220
  },
  {
    url: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    title: '美丽风景 6',
    width: 300,
    height: 280
  }
])

const imageUrls = computed(() => imageList.value.map(item => item.url))

const loadMore = () => {
  loading.value = true
  
  // 模拟加载更多数据
  setTimeout(() => {
    const newImages = [
      {
        url: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
        title: `美丽风景 ${imageList.value.length + 1}`,
        width: 300,
        height: Math.floor(Math.random() * 200) + 150
      },
      {
        url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        title: `美丽风景 ${imageList.value.length + 2}`,
        width: 300,
        height: Math.floor(Math.random() * 200) + 150
      }
    ]
    
    imageList.value.push(...newImages)
    loading.value = false
    
    // 模拟没有更多数据
    if (imageList.value.length >= 20) {
      hasMore.value = false
    }
  }, 1000)
}
</script>

<style scoped>
.waterfall-container {
  columns: 3;
  column-gap: 16px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .waterfall-container {
    columns: 2;
  }
}

@media (max-width: 480px) {
  .waterfall-container {
    columns: 1;
  }
}

.waterfall-item {
  position: relative;
  break-inside: avoid;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.waterfall-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 20px 12px 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.waterfall-item:hover .image-overlay {
  opacity: 1;
}

.image-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.image-title {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.image-size {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.load-more {
  text-align: center;
  padding: 20px;
}
</style>
```

## API 文档

### Image Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| src | 图片源地址，同原生属性一致 | string | — |
| fit | 确定图片如何适应容器框，同原生 object-fit | enum | — |
| hide-on-click-modal | 当开启 preview 功能时，是否可以通过点击遮罩层关闭 preview | boolean | false |
| loading | 浏览器是否开启懒加载，同原生 loading | enum | — |
| lazy | 是否开启懒加载 | boolean | false |
| scroll-container | 开启懒加载后，监听 scroll 事件的容器 | string / HTMLElement | 最近一个 overflow 值为 auto 或 scroll 的父元素 |
| alt | 原生 alt | string | — |
| referrer-policy | 原生 referrerPolicy | string | — |
| crossorigin | 原生 crossorigin | enum | — |
| preview-src-list | 开启图片预览功能 | Array | — |
| initial-index | 初始预览图片索引，小于等于 url-list 的长度 | number | 0 |
| close-on-press-escape | 是否可以通过按下 ESC 关闭 Image Viewer | boolean | true |
| preview-teleported | image-viewer 是否插入至 body 元素上 | boolean | false |
| zoom-rate | image-viewer 缩放事件的缩放率 | number | 1.2 |
| min-scale | image-viewer 最小缩放比 | number | 0.2 |
| max-scale | image-viewer 最大缩放比 | number | 7 |

### Image Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| load | 图片加载成功触发 | (e: Event) |
| error | 图片加载失败触发 | (e: Error) |
| switch | 切换图像时触发 | (val: number) |
| close | 关闭图片查看器时触发 | — |
| show | 展示图片查看器时触发 | — |

### Image Slots

| 插槽名 | 说明 |
|--------|------|
| placeholder | 图片未加载的占位内容 |
| error | 图片加载失败的内容 |
| viewer | 图片预览的内容 |

### Image Exposes

| 方法名 | 说明 | 类型 |
|--------|------|------|
| clickHandler | 手动触发图片预览 | () => void |

## 最佳实践

### 性能优化

1. **懒加载使用**：对于长列表或瀑布流，启用懒加载减少初始加载时间
2. **图片压缩**：使用适当的图片格式和压缩比例
3. **响应式图片**：根据设备提供不同尺寸的图片
4. **预加载关键图片**：对重要图片进行预加载

### 用户体验

1. **占位符设计**：提供有意义的占位符内容
2. **加载状态**：显示清晰的加载状态指示
3. **错误处理**：优雅处理图片加载失败的情况
4. **预览功能**：为图片集合提供预览功能

### 可访问性

1. **Alt 文本**：为图片提供描述性的 alt 文本
2. **键盘导航**：确保预览功能支持键盘操作
3. **屏幕阅读器**：提供适当的 ARIA 标签

### 响应式设计

1. **容器适配**：使用合适的 fit 模式适应不同容器
2. **断点设计**：在不同屏幕尺寸下调整图片布局
3. **触摸优化**：在移动设备上优化触摸交互

## 常见问题

### 1. 图片显示模糊

**问题**：图片在高分辨率屏幕上显示模糊

**解决方案**：
- 提供 2x、3x 分辨率的图片
- 使用 srcset 属性适配不同像素密度
- 确保图片原始尺寸足够大

### 2. 懒加载不生效

**问题**：设置了 lazy 属性但懒加载不工作

**解决方案**：
- 检查容器是否有滚动条
- 确认 scroll-container 设置正确
- 验证图片容器是否在视口内

### 3. 预览功能异常

**问题**：图片预览无法正常打开或操作

**解决方案**：
- 确保 preview-src-list 数组不为空
- 检查 preview-teleported 设置
- 验证图片 URL 的有效性

### 4. 内存泄漏问题

**问题**：大量图片导致内存占用过高

**解决方案**：
- 使用虚拟滚动技术
- 及时清理不可见的图片
- 限制同时加载的图片数量
- 使用适当的图片格式和压缩

## 总结

Image 图片组件提供了丰富的功能来处理各种图片展示需求。通过合理使用懒加载、占位符、预览等功能，可以显著提升用户体验。在实际应用中，需要注意性能优化、错误处理和可访问性，以确保应用的稳定性和易用性。

## 参考资料

- [Element Plus Image 官方文档](https://element-plus.org/zh-CN/component/image.html)
- [MDN - HTMLImageElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLImageElement)
- [Web 图片优化指南](https://web.dev/fast/#optimize-your-images)
- [响应式图片最佳实践](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)