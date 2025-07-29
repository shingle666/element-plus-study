# Watermark 水印

## 学习目标

通过本章学习，你将掌握：
- Watermark 水印组件的基本概念和使用场景
- 文本水印和图片水印的实现方法
- 多行水印的配置和使用
- 水印的自定义样式和参数配置
- 水印组件的API使用和最佳实践
- 实际项目中的应用场景和安全考虑

## 基础用法

Watermark 组件可以在页面上添加文本或图片等水印信息，常用于版权保护、内容标识等场景。

```vue
<template>
  <div class="demo-watermark">
    <el-watermark content="Element Plus">
      <div class="content-area">
        <h3>内容区域</h3>
        <p>这里是需要添加水印的内容区域。水印会覆盖在内容之上，起到标识和保护作用。</p>
        <p>水印通常用于：</p>
        <ul>
          <li>版权保护</li>
          <li>内容标识</li>
          <li>防止截图盗用</li>
          <li>品牌宣传</li>
        </ul>
      </div>
    </el-watermark>
  </div>
</template>

<style scoped>
.demo-watermark {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.content-area {
  padding: 40px;
  min-height: 300px;
  background: var(--el-fill-color-extra-light);
}

.content-area h3 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.content-area p {
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.content-area ul {
  margin: 10px 0;
}

.content-area li {
  margin: 5px 0;
  color: var(--el-text-color-regular);
}
</style>
```

## 多行水印

使用 `content` 属性设置一个字符串数组来指定多行文本水印内容。

```vue
<template>
  <div class="demo-container">
    <h4>多行文本水印</h4>
    <el-watermark :content="multiLineContent">
      <div class="content-area">
        <h3>多行水印示例</h3>
        <p>当需要显示多行水印信息时，可以传入字符串数组。每个数组元素会显示为一行。</p>
        <div class="demo-content">
          <el-card>
            <template #header>
              <span>重要文档</span>
            </template>
            <p>这是一份重要的商业文档，包含敏感信息。</p>
            <p>文档编号：DOC-2024-001</p>
            <p>创建时间：2024年1月15日</p>
            <p>机密等级：内部使用</p>
          </el-card>
        </div>
      </div>
    </el-watermark>
  </div>
</template>

<script setup>
const multiLineContent = [
  'Element Plus',
  '机密文档',
  '请勿外传'
]
</script>

<style scoped>
.demo-container {
  margin-bottom: 30px;
}

.content-area {
  padding: 30px;
  min-height: 400px;
  background: var(--el-fill-color-extra-light);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.content-area h3 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.demo-content {
  margin-top: 20px;
}
</style>
```

## 图片水印

通过 `image` 属性指定图像地址。为了确保图像清晰展示而不是被拉伸，请设置宽度和高度，建议使用至少两倍的宽度和高度的图片来保证显示效果。

```vue
<template>
  <div class="demo-container">
    <h4>图片水印</h4>
    <div class="image-watermark-demo">
      <el-watermark
        :image="logoImage"
        :width="120"
        :height="64"
        :rotate="-22"
      >
        <div class="content-area">
          <h3>图片水印示例</h3>
          <p>使用公司Logo或品牌标识作为水印，可以更好地体现品牌形象。</p>
          
          <div class="image-gallery">
            <div class="image-item">
              <img src="https://via.placeholder.com/200x150/409EFF/ffffff?text=Image+1" alt="示例图片1" />
              <p>产品展示图1</p>
            </div>
            <div class="image-item">
              <img src="https://via.placeholder.com/200x150/67C23A/ffffff?text=Image+2" alt="示例图片2" />
              <p>产品展示图2</p>
            </div>
            <div class="image-item">
              <img src="https://via.placeholder.com/200x150/E6A23C/ffffff?text=Image+3" alt="示例图片3" />
              <p>产品展示图3</p>
            </div>
          </div>
        </div>
      </el-watermark>
    </div>
  </div>
</template>

<script setup>
// 这里使用一个示例Logo，实际使用时替换为真实的图片地址
const logoImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgMTIwIDY0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjY0IiBmaWxsPSIjNDA5RUZGIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8dGV4dCB4PSI2MCIgeT0iMzgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzQwOUVGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9nbzwvdGV4dD4KPHN2Zz4K'
</script>

<style scoped>
.demo-container {
  margin-bottom: 30px;
}

.image-watermark-demo {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.content-area {
  padding: 30px;
  min-height: 400px;
  background: var(--el-fill-color-extra-light);
}

.content-area h3 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.image-gallery {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.image-item {
  text-align: center;
}

.image-item img {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
}

.image-item p {
  margin: 10px 0 0 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
}
</style>
```

## 自定义配置

配置自定义参数来预览水印效果，包括颜色、字体大小、旋转角度、间距等。

```vue
<template>
  <div class="custom-config-demo">
    <div class="config-panel">
      <h4>水印配置</h4>
      <div class="config-grid">
        <div class="config-item">
          <label>内容:</label>
          <el-input v-model="watermarkConfig.content" placeholder="请输入水印内容" />
        </div>
        
        <div class="config-item">
          <label>颜色:</label>
          <el-color-picker v-model="watermarkConfig.font.color" />
        </div>
        
        <div class="config-item">
          <label>字体大小:</label>
          <el-input-number v-model="watermarkConfig.font.fontSize" :min="12" :max="48" />
        </div>
        
        <div class="config-item">
          <label>z-index:</label>
          <el-input-number v-model="watermarkConfig.zIndex" :min="1" :max="9999" />
        </div>
        
        <div class="config-item">
          <label>旋转角度:</label>
          <el-slider v-model="watermarkConfig.rotate" :min="-180" :max="180" show-input />
        </div>
        
        <div class="config-item">
          <label>水平间距:</label>
          <el-input-number v-model="watermarkConfig.gap[0]" :min="50" :max="300" />
        </div>
        
        <div class="config-item">
          <label>垂直间距:</label>
          <el-input-number v-model="watermarkConfig.gap[1]" :min="50" :max="300" />
        </div>
        
        <div class="config-item">
          <label>字体粗细:</label>
          <el-select v-model="watermarkConfig.font.fontWeight">
            <el-option label="Normal" value="normal" />
            <el-option label="Bold" value="bold" />
            <el-option label="Lighter" value="lighter" />
          </el-select>
        </div>
      </div>
      
      <div class="config-actions">
        <el-button @click="resetConfig">重置配置</el-button>
        <el-button type="primary" @click="applyPreset('light')">浅色预设</el-button>
        <el-button type="primary" @click="applyPreset('dark')">深色预设</el-button>
      </div>
    </div>
    
    <div class="preview-area">
      <h4>预览效果</h4>
      <el-watermark
        :content="watermarkConfig.content"
        :font="watermarkConfig.font"
        :rotate="watermarkConfig.rotate"
        :gap="watermarkConfig.gap"
        :offset="watermarkConfig.offset"
        :z-index="watermarkConfig.zIndex"
      >
        <div class="preview-content">
          <h3>预览内容区域</h3>
          <p>这里是预览区域，你可以实时看到水印配置的效果。</p>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>数据统计</span>
                </template>
                <div class="statistic-item">
                  <span class="label">今日访问:</span>
                  <span class="value">1,234</span>
                </div>
                <div class="statistic-item">
                  <span class="label">总用户数:</span>
                  <span class="value">56,789</span>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <span>系统信息</span>
                </template>
                <div class="statistic-item">
                  <span class="label">CPU使用率:</span>
                  <span class="value">45%</span>
                </div>
                <div class="statistic-item">
                  <span class="label">内存使用:</span>
                  <span class="value">2.1GB</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-watermark>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const watermarkConfig = reactive({
  content: 'Element Plus',
  font: {
    color: 'rgba(0,0,0,.15)',
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontStyle: 'normal',
    textAlign: 'center',
    textBaseline: 'hanging'
  },
  rotate: -22,
  gap: [100, 100],
  offset: [50, 50],
  zIndex: 9
})

const resetConfig = () => {
  Object.assign(watermarkConfig, {
    content: 'Element Plus',
    font: {
      color: 'rgba(0,0,0,.15)',
      fontSize: 16,
      fontWeight: 'normal',
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      textAlign: 'center',
      textBaseline: 'hanging'
    },
    rotate: -22,
    gap: [100, 100],
    offset: [50, 50],
    zIndex: 9
  })
}

const applyPreset = (type) => {
  if (type === 'light') {
    Object.assign(watermarkConfig, {
      content: '机密文档',
      font: {
        ...watermarkConfig.font,
        color: 'rgba(64, 158, 255, 0.1)',
        fontSize: 18,
        fontWeight: 'bold'
      },
      rotate: -15,
      gap: [120, 120]
    })
  } else if (type === 'dark') {
    Object.assign(watermarkConfig, {
      content: 'CONFIDENTIAL',
      font: {
        ...watermarkConfig.font,
        color: 'rgba(0, 0, 0, 0.3)',
        fontSize: 14,
        fontWeight: 'normal'
      },
      rotate: -30,
      gap: [80, 80]
    })
  }
}
</script>

<style scoped>
.custom-config-demo {
  display: flex;
  gap: 30px;
  margin: 20px 0;
}

.config-panel {
  flex: 1;
  min-width: 400px;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
}

.config-panel h4 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.config-item label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.config-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preview-area {
  flex: 1;
  min-width: 500px;
}

.preview-area h4 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.preview-content {
  padding: 30px;
  min-height: 400px;
  background: var(--el-fill-color-extra-light);
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.preview-content h3 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.statistic-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 5px 0;
}

.statistic-item .label {
  color: var(--el-text-color-regular);
}

.statistic-item .value {
  font-weight: bold;
  color: var(--el-color-primary);
}

@media (max-width: 1200px) {
  .custom-config-demo {
    flex-direction: column;
  }
  
  .config-panel,
  .preview-area {
    min-width: auto;
  }
}
</style>
```

## 高级水印应用

### 动态水印

根据用户信息或时间动态生成水印内容。

```vue
<template>
  <div class="dynamic-watermark-demo">
    <div class="user-info">
      <h4>用户信息</h4>
      <el-form :model="userInfo" label-width="80px">
        <el-form-item label="用户名:">
          <el-input v-model="userInfo.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="部门:">
          <el-select v-model="userInfo.department" placeholder="请选择部门">
            <el-option label="技术部" value="tech" />
            <el-option label="产品部" value="product" />
            <el-option label="设计部" value="design" />
            <el-option label="运营部" value="operation" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限级别:">
          <el-radio-group v-model="userInfo.level">
            <el-radio value="1">普通</el-radio>
            <el-radio value="2">管理员</el-radio>
            <el-radio value="3">超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="watermark-preview">
      <h4>动态水印预览</h4>
      <el-watermark :content="dynamicWatermarkContent">
        <div class="document-area">
          <h3>机密文档查看</h3>
          <div class="document-meta">
            <p><strong>文档标题:</strong> 2024年度战略规划</p>
            <p><strong>创建时间:</strong> {{ currentTime }}</p>
            <p><strong>查看者:</strong> {{ userInfo.username || '未登录' }}</p>
            <p><strong>部门:</strong> {{ getDepartmentName(userInfo.department) }}</p>
          </div>
          
          <div class="document-content">
            <h4>一、市场分析</h4>
            <p>根据市场调研数据显示，我们的产品在目标市场中具有较强的竞争优势...</p>
            
            <h4>二、发展目标</h4>
            <p>2024年我们计划实现以下目标：</p>
            <ul>
              <li>用户增长率达到150%</li>
              <li>营收增长率达到200%</li>
              <li>市场份额提升至15%</li>
            </ul>
            
            <h4>三、实施策略</h4>
            <p>为实现上述目标，我们将采取以下策略...</p>
          </div>
        </div>
      </el-watermark>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const userInfo = ref({
  username: '',
  department: '',
  level: '1'
})

const currentTime = ref('')

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

const getDepartmentName = (dept) => {
  const deptMap = {
    tech: '技术部',
    product: '产品部',
    design: '设计部',
    operation: '运营部'
  }
  return deptMap[dept] || '未选择'
}

const dynamicWatermarkContent = computed(() => {
  const content = []
  
  if (userInfo.value.username) {
    content.push(userInfo.value.username)
  }
  
  if (userInfo.value.department) {
    content.push(getDepartmentName(userInfo.value.department))
  }
  
  content.push(currentTime.value)
  
  const levelMap = {
    '1': '普通用户',
    '2': '管理员',
    '3': '超级管理员'
  }
  content.push(levelMap[userInfo.value.level])
  
  return content.length > 0 ? content : ['请完善用户信息']
})
</script>

<style scoped>
.dynamic-watermark-demo {
  display: flex;
  gap: 30px;
  margin: 20px 0;
}

.user-info {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
}

.user-info h4 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.watermark-preview {
  flex: 2;
  min-width: 500px;
}

.watermark-preview h4 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.document-area {
  padding: 30px;
  min-height: 500px;
  background: white;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.document-area h3 {
  margin-top: 0;
  color: var(--el-text-color-primary);
  text-align: center;
  border-bottom: 2px solid var(--el-color-primary);
  padding-bottom: 10px;
}

.document-meta {
  background: var(--el-fill-color-extra-light);
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
}

.document-meta p {
  margin: 5px 0;
  color: var(--el-text-color-regular);
}

.document-content h4 {
  color: var(--el-color-primary);
  margin-top: 25px;
}

.document-content p {
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.document-content ul {
  margin: 10px 0;
}

.document-content li {
  margin: 5px 0;
  color: var(--el-text-color-regular);
}

@media (max-width: 1000px) {
  .dynamic-watermark-demo {
    flex-direction: column;
  }
  
  .user-info,
  .watermark-preview {
    min-width: auto;
  }
}
</style>
```

### 安全水印

为敏感内容添加防截图和防复制的安全水印。

```vue
<template>
  <div class="security-watermark-demo">
    <div class="security-controls">
      <h4>安全设置</h4>
      <el-form :model="securityConfig" label-width="120px">
        <el-form-item label="安全级别:">
          <el-radio-group v-model="securityConfig.level">
            <el-radio value="low">低</el-radio>
            <el-radio value="medium">中</el-radio>
            <el-radio value="high">高</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="防截图:">
          <el-switch v-model="securityConfig.antiScreenshot" />
        </el-form-item>
        
        <el-form-item label="用户追踪:">
          <el-switch v-model="securityConfig.userTracking" />
        </el-form-item>
        
        <el-form-item label="时间戳:">
          <el-switch v-model="securityConfig.timestamp" />
        </el-form-item>
      </el-form>
      
      <div class="security-info">
        <el-alert
          title="安全提示"
          type="warning"
          :description="securityTip"
          show-icon
          :closable="false"
        />
      </div>
    </div>
    
    <div class="secure-content">
      <h4>安全内容区域</h4>
      <el-watermark
        :content="securityWatermarkContent"
        :font="securityWatermarkFont"
        :gap="securityWatermarkGap"
        :rotate="securityWatermarkRotate"
        :z-index="9999"
      >
        <div 
          class="sensitive-document"
          :class="{ 'anti-screenshot': securityConfig.antiScreenshot }"
          @contextmenu.prevent
          @selectstart.prevent
          @dragstart.prevent
        >
          <div class="document-header">
            <h3>🔒 机密文档</h3>
            <div class="security-badge">
              <el-tag :type="securityBadgeType" size="small">
                {{ securityLevelText }}
              </el-tag>
            </div>
          </div>
          
          <div class="document-body">
            <div class="warning-notice">
              <el-alert
                title="重要提醒"
                type="error"
                description="本文档包含机密信息，请勿截图、复制或传播。所有访问行为将被记录。"
                show-icon
                :closable="false"
              />
            </div>
            
            <div class="content-section">
              <h4>项目代号：Phoenix</h4>
              <p>本项目为公司下一代产品的核心技术方案，涉及以下关键信息：</p>
              
              <div class="classified-info">
                <div class="info-item">
                  <span class="label">技术架构：</span>
                  <span class="value">微服务 + 云原生</span>
                </div>
                <div class="info-item">
                  <span class="label">预算投入：</span>
                  <span class="value">500万人民币</span>
                </div>
                <div class="info-item">
                  <span class="label">上线时间：</span>
                  <span class="value">2024年Q3</span>
                </div>
                <div class="info-item">
                  <span class="label">核心团队：</span>
                  <span class="value">15人</span>
                </div>
              </div>
              
              <h4>技术细节</h4>
              <p>核心算法采用自研的AI引擎，性能较现有方案提升300%...</p>
              <p>数据安全方面采用端到端加密，确保用户隐私...</p>
            </div>
          </div>
        </div>
      </el-watermark>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const securityConfig = ref({
  level: 'medium',
  antiScreenshot: true,
  userTracking: true,
  timestamp: true
})

const currentUser = ref('张三')
const currentTime = ref('')
const sessionId = ref('')

onMounted(() => {
  // 生成会话ID
  sessionId.value = 'SID-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  
  // 更新时间
  const updateTime = () => {
    currentTime.value = new Date().toLocaleString('zh-CN')
  }
  updateTime()
  setInterval(updateTime, 1000)
})

const securityLevelText = computed(() => {
  const levelMap = {
    low: '低安全级别',
    medium: '中安全级别',
    high: '高安全级别'
  }
  return levelMap[securityConfig.value.level]
})

const securityBadgeType = computed(() => {
  const typeMap = {
    low: 'info',
    medium: 'warning',
    high: 'danger'
  }
  return typeMap[securityConfig.value.level]
})

const securityTip = computed(() => {
  const tips = {
    low: '基础安全保护，适用于一般内部文档',
    medium: '中等安全保护，适用于重要商业文档',
    high: '高级安全保护，适用于机密文档'
  }
  return tips[securityConfig.value.level]
})

const securityWatermarkContent = computed(() => {
  const content = []
  
  if (securityConfig.value.userTracking) {
    content.push(currentUser.value)
    content.push(sessionId.value)
  }
  
  if (securityConfig.value.timestamp) {
    content.push(currentTime.value)
  }
  
  content.push('机密文档')
  content.push('禁止传播')
  
  return content
})

const securityWatermarkFont = computed(() => {
  const fontConfig = {
    low: {
      color: 'rgba(0,0,0,0.1)',
      fontSize: 14,
      fontWeight: 'normal'
    },
    medium: {
      color: 'rgba(255,0,0,0.15)',
      fontSize: 16,
      fontWeight: 'bold'
    },
    high: {
      color: 'rgba(255,0,0,0.25)',
      fontSize: 18,
      fontWeight: 'bold'
    }
  }
  return fontConfig[securityConfig.value.level]
})

const securityWatermarkGap = computed(() => {
  const gapConfig = {
    low: [150, 150],
    medium: [100, 100],
    high: [80, 80]
  }
  return gapConfig[securityConfig.value.level]
})

const securityWatermarkRotate = computed(() => {
  const rotateConfig = {
    low: -15,
    medium: -22,
    high: -30
  }
  return rotateConfig[securityConfig.value.level]
})
</script>

<style scoped>
.security-watermark-demo {
  display: flex;
  gap: 30px;
  margin: 20px 0;
}

.security-controls {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
}

.security-controls h4 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.security-info {
  margin-top: 20px;
}

.secure-content {
  flex: 2;
  min-width: 500px;
}

.secure-content h4 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.sensitive-document {
  background: white;
  border: 2px solid var(--el-color-danger);
  border-radius: 4px;
  overflow: hidden;
}

.sensitive-document.anti-screenshot {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: var(--el-color-danger-light-9);
  border-bottom: 1px solid var(--el-color-danger-light-7);
}

.document-header h3 {
  margin: 0;
  color: var(--el-color-danger);
}

.document-body {
  padding: 30px;
}

.warning-notice {
  margin-bottom: 25px;
}

.content-section h4 {
  color: var(--el-text-color-primary);
  margin-top: 25px;
  margin-bottom: 15px;
}

.content-section p {
  line-height: 1.6;
  color: var(--el-text-color-regular);
  margin-bottom: 15px;
}

.classified-info {
  background: var(--el-fill-color-extra-light);
  padding: 20px;
  border-radius: 4px;
  margin: 20px 0;
  border-left: 4px solid var(--el-color-warning);
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 5px 0;
}

.info-item .label {
  font-weight: bold;
  color: var(--el-text-color-regular);
}

.info-item .value {
  color: var(--el-color-danger);
  font-weight: bold;
}

@media (max-width: 1000px) {
  .security-watermark-demo {
    flex-direction: column;
  }
  
  .security-controls,
  .secure-content {
    min-width: auto;
  }
}
</style>
```

## 实践练习

1. **基础练习**：为一个简单的文档页面添加文本水印

2. **进阶练习**：创建一个图片展示页面，使用Logo作为水印保护图片版权

3. **高级练习**：实现一个动态水印系统，根据用户权限显示不同的水印内容

4. **综合练习**：开发一个安全文档查看器，包含防截图、用户追踪等安全功能

## 设计原则

1. **适度可见**：水印应该可见但不影响内容阅读
2. **安全有效**：确保水印难以被轻易去除
3. **性能优化**：避免水印影响页面性能
4. **用户体验**：在安全性和用户体验之间找到平衡
5. **法律合规**：确保水印使用符合相关法律法规

## API 参考

### Watermark Attributes

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| width | 水印的宽度，content 的默认值是它自己的宽度 | `number` | `120` |
| height | 水印的高度，content 的默认值是它自己的高度 | `number` | `64` |
| rotate | 水印的旋转角度，单位 ° | `number` | `-22` |
| zIndex | 水印元素的z-index值 | `number` | `9` |
| image | 水印图片，建议使用 2x 或 3x 图像 | `string` | — |
| content | 水印文本内容 | `string \| string[]` | — |
| font | 文字样式 | `Font` | — |
| gap | 水印之间的间距 | `[number, number]` | `[100, 100]` |
| offset | 水印从容器左上角的偏移，默认值为 gap/2 | `[number, number]` | `[gap[0]/2, gap[1]/2]` |

### Font 对象

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| color | 字体颜色 | `string` | `rgba(0,0,0,.15)` |
| fontSize | 字体大小 | `number` | `16` |
| fontWeight | 字重 | `'normal' \| 'bold' \| 'lighter'` | `'normal'` |
| fontFamily | 字体 | `string` | `'sans-serif'` |
| fontStyle | 字体样式 | `'normal' \| 'italic'` | `'normal'` |
| textAlign | 文本对齐 | `'center' \| 'left' \| 'right'` | `'center'` |
| textBaseline | 文本基线 | `'hanging' \| 'top' \| 'middle'` | `'hanging'` |

### Watermark Slots

| 插槽名 | 说明 |
|--------|------|
| default | 添加水印的容器 |

## 学习资源

- [Element Plus Watermark 官方文档](https://element-plus.org/zh-CN/component/watermark.html)
- [Canvas API 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [Web安全最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/Security)

## 作业

1. 创建一个在线文档系统，为不同用户角色显示不同的水印
2. 实现一个图片版权保护系统，自动为上传的图片添加水印
3. 开发一个安全报告查看器，包含完整的水印安全功能

## 总结

Watermark 水印组件是保护内容版权和标识信息的重要工具。通过合理配置水印参数，可以在不影响用户体验的前提下，有效保护内容安全。在实际应用中，需要根据具体场景选择合适的水印策略，平衡安全性和可用性。