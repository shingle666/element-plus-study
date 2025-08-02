# Image

## Overview

The Image component is an enhanced image display component provided by Element Plus, supporting lazy loading, custom placeholders, loading failure handling, image preview, and other features. Compared to the native img tag, it offers a better user experience and richer functionality.

## Learning Objectives

- Master the basic usage and configuration of the Image component
- Learn to use lazy loading and placeholder features
- Understand different image fit modes
- Master image preview and loading failure handling
- Understand application scenarios and best practices in real projects

## Basic Usage

### Basic Image Display

The simplest usage, displaying an image.

```vue
<template>
  <div class="basic-image-demo">
    <h3>Basic Image Display</h3>
    
    <el-image
      style="width: 300px; height: 200px"
      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      fit="cover"
    />
  </div>
</template>
```

### Different Fit Modes

The `fit` attribute can be used to set how the image adapts to its container, similar to the native CSS object-fit.

```vue
<template>
  <div class="fit-demo">
    <h3>Different Fit Modes</h3>
    
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

### Placeholders

You can customize placeholder content through slots.

```vue
<template>
  <div class="placeholder-demo">
    <h3>Custom Placeholders</h3>
    
    <div class="demo-image-container">
      <!-- Default placeholder -->
      <div class="demo-image-item">
        <span class="demo-image-text">Default Placeholder</span>
        <el-image
          style="width: 100px; height: 100px"
          src=""
        />
      </div>
      
      <!-- Custom placeholder -->
      <div class="demo-image-item">
        <span class="demo-image-text">Custom Placeholder</span>
        <el-image
          style="width: 100px; height: 100px"
          src=""
        >
          <template #placeholder>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
              <span>Loading...</span>
            </div>
          </template>
        </el-image>
      </div>
      
      <!-- Loading failure placeholder -->
      <div class="demo-image-item">
        <span class="demo-image-text">Loading Failure</span>
        <el-image
          style="width: 100px; height: 100px"
          src="https://invalid-url.jpg"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
              <span>Load Failed</span>
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

### Lazy Loading

Enable lazy loading through the `lazy` attribute, so images will only start loading when they enter the viewport.

```vue
<template>
  <div class="lazy-demo">
    <h3>Lazy Loading</h3>
    
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
            <span>Lazy loading...</span>
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

### Image Preview

Enable image preview functionality through the `preview-src-list` attribute.

```vue
<template>
  <div class="preview-demo">
    <h3>Image Preview</h3>
    
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
      Click on an image to preview, supports zooming, rotation, and other operations
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

## Practical Application Examples

### Product Image Gallery

```vue
<template>
  <div class="product-gallery-demo">
    <h3>Product Image Gallery</h3>
    
    <div class="product-gallery">
      <!-- Main image -->
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
              <span>Loading...</span>
            </div>
          </template>
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
              <span>Load Failed</span>
            </div>
          </template>
        </el-image>
      </div>
      
      <!-- Thumbnails -->
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
    
    <!-- Product information -->
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
  description: 'Featuring aerospace-grade titanium design, powered by the A17 Pro chip, equipped with a professional camera system.',
  images: [
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg'
  ]
})

// Initialize current image
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

### User Avatar Upload

```vue
<template>
  <div class="avatar-upload-demo">
    <h3>User Avatar Upload</h3>
    
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
            <span>Upload Avatar</span>
          </div>
        </template>
        <template #error>
          <div class="avatar-placeholder">
            <el-icon><User /></el-icon>
            <span>Default Avatar</span>
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
          Change Avatar
        </el-button>
        <el-button size="small" type="danger" @click="removeAvatar" v-if="avatarUrl">
          <el-icon><Delete /></el-icon>
          Delete Avatar
        </el-button>
      </div>
    </div>
    
    <div class="upload-tips">
      <p>Supports JPG and PNG formats, file size should not exceed 2MB</p>
      <p>Square images are recommended for the best display effect</p>
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
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    ElMessage.error('Please select an image file')
    return
  }
  
  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('File size cannot exceed 2MB')
    return
  }
  
  // Read file and preview
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarUrl.value = e.target.result
    ElMessage.success('Avatar uploaded successfully')
  }
  reader.readAsDataURL(file)
  
  // Clear input value to allow selecting the same file again
  event.target.value = ''
}

const removeAvatar = () => {
  avatarUrl.value = ''
  ElMessage.success('Avatar has been deleted')
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

### Image Waterfall Layout

```vue
<template>
  <div class="waterfall-demo">
    <h3>Image Waterfall Layout</h3>
    
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
        {{ loading ? 'Loading...' : 'Load More' }}
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
    title: 'Beautiful Scenery 1',
    width: 300,
    height: 200
  },
  {
    url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    title: 'Beautiful Scenery 2',
    width: 300,
    height: 300
  },
  {
    url: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    title: 'Beautiful Scenery 3',
    width: 300,
    height: 250
  },
  {
    url: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    title: 'Beautiful Scenery 4',
    width: 300,
    height: 180
  },
  {
    url: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    title: 'Beautiful Scenery 5',
    width: 300,
    height: 220
  },
  {
    url: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    title: 'Beautiful Scenery 6',
    width: 300,
    height: 280
  }
])

const imageUrls = computed(() => imageList.value.map(item => item.url))

const loadMore = () => {
  loading.value = true
  
  // Simulate loading more data
  setTimeout(() => {
    const newImages = [
      {
        url: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
        title: `Beautiful Scenery ${imageList.value.length + 1}`,
        width: 300,
        height: Math.floor(Math.random() * 200) + 150
      },
      {
        url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        title: `Beautiful Scenery ${imageList.value.length + 2}`,
        width: 300,
        height: Math.floor(Math.random() * 200) + 150
      }
    ]
    
    imageList.value.push(...newImages)
    loading.value = false
    
    // Simulate no more data
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

## API Documentation

### Image Attributes

| Attribute | Description | Type | Default |
|--------|------|------|--------|
| src | Image source, same as native attribute | string | — |
| fit | How the image fits in the container, same as native object-fit | enum | — |
| hide-on-click-modal | When preview is enabled, whether to close preview by clicking modal mask | boolean | false |
| loading | Browser's native lazy loading, same as native loading | enum | — |
| lazy | Whether to use lazy loading | boolean | false |
| scroll-container | Container to add scroll listener when using lazy loading | string / HTMLElement | The first parent element with overflow auto or scroll |
| alt | Native alt | string | — |
| referrer-policy | Native referrerPolicy | string | — |
| crossorigin | Native crossorigin | enum | — |
| preview-src-list | Enable image preview functionality | Array | — |
| initial-index | Initial preview image index, less than or equal to the length of url-list | number | 0 |
| close-on-press-escape | Whether to close Image Viewer when pressing ESC | boolean | true |
| preview-teleported | Whether to append image-viewer to body | boolean | false |
| zoom-rate | Zoom rate of image-viewer zoom event | number | 1.2 |
| min-scale | Minimum scale of image-viewer | number | 0.2 |
| max-scale | Maximum scale of image-viewer | number | 7 |

### Image Events

| Event Name | Description | Parameters |
|--------|------|----------|
| load | Triggered when image is loaded | (e: Event) |
| error | Triggered when image loading fails | (e: Error) |
| switch | Triggered when switching images | (val: number) |
| close | Triggered when image viewer is closed | — |
| show | Triggered when image viewer is shown | — |

### Image Slots

| Slot Name | Description |
|--------|------|
| placeholder | Content when image hasn't loaded yet |
| error | Content when image loading fails |
| viewer | Content of image viewer |

### Image Exposes

| Method Name | Description | Type |
|--------|------|------|
| clickHandler | Manually trigger image preview | () => void |

## Best Practices

### Performance Optimization

1. **Use Lazy Loading**: For long lists or waterfall layouts, enable lazy loading to reduce initial loading time
2. **Image Compression**: Use appropriate image formats and compression ratios
3. **Responsive Images**: Provide different sized images based on device
4. **Preload Critical Images**: Preload important images

### User Experience

1. **Placeholder Design**: Provide meaningful placeholder content
2. **Loading State**: Display clear loading state indicators
3. **Error Handling**: Gracefully handle image loading failures
4. **Preview Functionality**: Provide preview functionality for image collections

### Accessibility

1. **Alt Text**: Provide descriptive alt text for images
2. **Keyboard Navigation**: Ensure preview functionality supports keyboard operations
3. **Screen Readers**: Provide appropriate ARIA labels

### Responsive Design

1. **Container Adaptation**: Use appropriate fit modes to adapt to different containers
2. **Breakpoint Design**: Adjust image layout at different screen sizes
3. **Touch Optimization**: Optimize touch interactions on mobile devices

## Common Issues

### 1. Blurry Images

**Issue**: Images appear blurry on high-resolution screens

**Solution**:
- Provide 2x, 3x resolution images
- Use srcset attribute to adapt to different pixel densities
- Ensure original image size is large enough

### 2. Lazy Loading Not Working

**Issue**: Set the lazy attribute but lazy loading doesn't work

**Solution**:
- Check if the container has a scrollbar
- Confirm scroll-container is set correctly
- Verify if the image container is within the viewport

### 3. Preview Functionality Issues

**Issue**: Image preview cannot open or operate normally

**Solution**:
- Ensure preview-src-list array is not empty
- Check preview-teleported setting
- Verify image URL validity

### 4. Memory Leak Issues

**Issue**: Large number of images causing high memory usage

**Solution**:
- Use virtual scrolling techniques
- Clean up invisible images promptly
- Limit the number of images loaded simultaneously
- Use appropriate image formats and compression

## Summary

The Image component provides rich functionality to handle various image display needs. By properly using lazy loading, placeholders, previews, and other features, you can significantly enhance the user experience. In practical applications, attention should be paid to performance optimization, error handling, and accessibility to ensure application stability and usability.

## References

- [Element Plus Image Official Documentation](https://element-plus.org/en-US/component/image.html)
- [MDN - HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
- [Web Image Optimization Guide](https://web.dev/fast/#optimize-your-images)
- [Responsive Images Best Practices](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)