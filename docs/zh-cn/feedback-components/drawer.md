# Drawer 抽屉

## 学习目标

通过本章学习，你将掌握：
- **基础抽屉功能**：掌握 Drawer 的基本使用方法和属性配置
- **抽屉方向设置**：学会控制抽屉的打开方向和位置
- **抽屉尺寸控制**：掌握抽屉大小的设置和响应式调整
- **抽屉嵌套使用**：处理复杂的嵌套抽屉场景
- **抽屉事件处理**：掌握各种事件的监听和处理
- **抽屉动画定制**：自定义抽屉的显示和隐藏动画
- **抽屉内容懒加载**：优化抽屉的渲染性能

**预计学习时间：** 90分钟

## 概述

Drawer 抽屉是一个从页面边缘滑出的面板组件，为用户提供额外的操作空间和内容展示区域。它拥有和 Dialog 几乎相同的 API，但在 UI 体验上更适合展示表单、文档等需要更多空间的内容。

### 主要特性

- **多方向支持**：支持从左、右、上、下四个方向滑出
- **懒渲染机制**：内容在首次打开前不会渲染，提升性能
- **灵活尺寸**：支持百分比和像素值设置抽屉大小
- **嵌套支持**：支持多层抽屉嵌套使用
- **丰富插槽**：提供头部、内容、底部等插槽自定义
- **事件完整**：提供完整的打开、关闭事件回调
- **无障碍访问**：支持键盘导航和屏幕阅读器
- **响应式设计**：适配不同屏幕尺寸和设备

### 适用场景

- **表单操作**：长表单、复杂表单的填写和编辑
- **详情展示**：商品详情、用户信息等详细内容查看
- **文档预览**：PDF、图片等文档的预览和查看
- **设置面板**：应用设置、用户偏好等配置界面
- **导航菜单**：移动端侧边导航、快捷操作菜单
- **内容编辑**：富文本编辑、代码编辑等需要大空间的操作
- **数据筛选**：复杂的筛选条件设置和数据过滤
- **工作流程**：多步骤操作、向导式流程引导

## 基础用法

### 基础用法

你必须像 Dialog一样为 Drawer 设置 model-value 属性来控制 Drawer 的显示与隐藏状态，该属性接受一个 boolean 类型。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

Drawer 包含三部分: title & body & footer, 其中 title 是一个具名 slot, 你还可以通过 title 属性来设置标题, 默认情况下它是一个空字符串, 其中 body 部分是 Drawer 组件的主区域, 它包含了用户定义的主要内容。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

```vue
<template>
  <el-button text @click="drawer = true">
    点击打开 Drawer
  </el-button>

  <el-drawer v-model="drawer" title="我是标题">
    <span>Hi, there!</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>
```

### 不添加 Title

通过设置 with-header 属性为 false 来控制是否显示标题。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="3">3</mcreference>

如果你的应用需要具备可访问性，请务必设置好 title。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="3">3</mcreference>

```vue
<template>
  <el-button text @click="drawer = true">
    点击打开 Drawer
  </el-button>

  <el-drawer v-model="drawer" :with-header="false">
    <span>Hi there!</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>
```

### 自定义头部

header 可用于自定义显示标题的区域。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

为了保持可用性，除了使用此插槽外，使用 title 属性，或使用 titleId 插槽属性来指定哪些元素应该读取为抽屉标题。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

```vue
<template>
  <el-button text @click="drawer = true">
    点击打开 Drawer
  </el-button>

  <el-drawer v-model="drawer">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">自定义头部</h4>
    </template>
    <span>Hi there!</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>
```

### 自定义内容

和 Dialog 组件一样，Drawer 同样可以在其内部嵌套各种丰富的操作。

```vue
<template>
  <el-button text @click="drawer = true">
    点击打开 Drawer
  </el-button>

  <el-drawer v-model="drawer" title="我是外层 Drawer">
    <el-button @click="innerDrawer = true">打开里层 Drawer</el-button>
    <el-drawer
      v-model="innerDrawer"
      title="我是里层 Drawer"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <p>_(:зゝ∠)_</p>
    </el-drawer>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const drawer = ref(false)
const innerDrawer = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确认关闭？')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
```

### 不同方向

当 Drawer 打开时，默认设置是从右至左打开 30% 浏览器宽度。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

你可以通过传入对应的 direction 和 size 属性来修改这一默认行为。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

```vue
<template>
  <el-radio-group v-model="direction">
    <el-radio label="ltr">从左往右开</el-radio>
    <el-radio label="rtl">从右往左开</el-radio>
    <el-radio label="ttb">从上往下开</el-radio>
    <el-radio label="btt">从下往上开</el-radio>
  </el-radio-group>

  <el-button style="margin-left: 16px" type="primary" @click="drawer = true">
    打开 Drawer
  </el-button>

  <el-drawer
    v-model="drawer"
    title="我是标题"
    :direction="direction"
    :before-close="handleClose"
  >
    <span>Hi, there!</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const drawer = ref(false)
const direction = ref('rtl')

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确认关闭？')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
```

## 实际应用示例

### 用户设置面板

一个完整的用户设置抽屉，包含多个设置选项：

```vue
<template>
  <div class="settings-demo">
    <el-button type="primary" @click="settingsDrawer = true">
      <el-icon><Setting /></el-icon>
      打开设置
    </el-button>

    <el-drawer
      v-model="settingsDrawer"
      title="用户设置"
      direction="rtl"
      size="400px"
      :before-close="handleSettingsClose"
    >
      <template #header="{ close }">
        <div class="settings-header">
          <h3>个人设置</h3>
          <el-button type="text" @click="close">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </template>

      <div class="settings-content">
        <el-form :model="userSettings" label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="userSettings.username" />
          </el-form-item>
          
          <el-form-item label="邮箱">
            <el-input v-model="userSettings.email" type="email" />
          </el-form-item>
          
          <el-form-item label="主题">
            <el-select v-model="userSettings.theme" placeholder="选择主题">
              <el-option label="浅色" value="light" />
              <el-option label="深色" value="dark" />
              <el-option label="自动" value="auto" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="语言">
            <el-select v-model="userSettings.language" placeholder="选择语言">
              <el-option label="中文" value="zh" />
              <el-option label="English" value="en" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="通知">
            <el-switch v-model="userSettings.notifications" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="settings-footer">
          <el-button @click="settingsDrawer = false">取消</el-button>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Setting, Close } from '@element-plus/icons-vue'

const settingsDrawer = ref(false)

const userSettings = reactive({
  username: 'admin',
  email: 'admin@example.com',
  theme: 'light',
  language: 'zh',
  notifications: true
})

const handleSettingsClose = (done) => {
  ElMessageBox.confirm('设置尚未保存，确认关闭吗？')
    .then(() => {
      done()
    })
    .catch(() => {})
}

const saveSettings = () => {
  // 模拟保存设置
  setTimeout(() => {
    ElMessage.success('设置保存成功')
    settingsDrawer.value = false
  }, 1000)
}
</script>

<style scoped>
.settings-demo {
  padding: 20px;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.settings-content {
  padding: 20px;
}

.settings-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #ebeef5;
}
</style>
```

### 商品详情抽屉

展示商品详细信息的抽屉组件：

```vue
<template>
  <div class="product-demo">
    <el-row :gutter="20">
      <el-col :span="6" v-for="product in products" :key="product.id">
        <el-card class="product-card" @click="showProductDetail(product)">
          <img :src="product.image" :alt="product.name" class="product-image" />
          <div class="product-info">
            <h4>{{ product.name }}</h4>
            <p class="price">¥{{ product.price }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-drawer
      v-model="productDrawer"
      :title="selectedProduct?.name"
      direction="rtl"
      size="500px"
    >
      <div v-if="selectedProduct" class="product-detail">
        <div class="product-images">
          <el-carousel height="300px">
            <el-carousel-item v-for="img in selectedProduct.images" :key="img">
              <img :src="img" :alt="selectedProduct.name" class="detail-image" />
            </el-carousel-item>
          </el-carousel>
        </div>
        
        <div class="product-info-detail">
          <h2>{{ selectedProduct.name }}</h2>
          <p class="price-detail">¥{{ selectedProduct.price }}</p>
          <p class="description">{{ selectedProduct.description }}</p>
          
          <div class="product-specs">
            <h4>商品规格</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="品牌">{{ selectedProduct.brand }}</el-descriptions-item>
              <el-descriptions-item label="型号">{{ selectedProduct.model }}</el-descriptions-item>
              <el-descriptions-item label="颜色">{{ selectedProduct.color }}</el-descriptions-item>
              <el-descriptions-item label="尺寸">{{ selectedProduct.size }}</el-descriptions-item>
            </el-descriptions>
          </div>
          
          <div class="product-actions">
            <el-button type="primary" size="large" @click="addToCart">
              加入购物车
            </el-button>
            <el-button size="large" @click="buyNow">
              立即购买
            </el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const productDrawer = ref(false)
const selectedProduct = ref(null)

const products = [
  {
    id: 1,
    name: '无线蓝牙耳机',
    price: 299,
    image: '/api/placeholder/200/200',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    description: '高品质无线蓝牙耳机，支持主动降噪，续航时间长达24小时。',
    brand: 'TechBrand',
    model: 'TB-WH100',
    color: '黑色',
    size: '标准'
  },
  {
    id: 2,
    name: '智能手表',
    price: 1299,
    image: '/api/placeholder/200/200',
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    description: '多功能智能手表，支持健康监测、运动追踪等功能。',
    brand: 'SmartTech',
    model: 'ST-W200',
    color: '银色',
    size: '42mm'
  }
]

const showProductDetail = (product) => {
  selectedProduct.value = product
  productDrawer.value = true
}

const addToCart = () => {
  ElMessage.success('已加入购物车')
}

const buyNow = () => {
  ElMessage.success('跳转到支付页面')
  productDrawer.value = false
}
</script>

<style scoped>
.product-demo {
  padding: 20px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.product-info {
  padding: 10px 0;
}

.price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 18px;
}

.product-detail {
  padding: 20px;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info-detail {
  margin-top: 20px;
}

.price-detail {
  color: #f56c6c;
  font-weight: bold;
  font-size: 24px;
  margin: 10px 0;
}

.description {
  color: #666;
  line-height: 1.6;
  margin: 15px 0;
}

.product-specs {
  margin: 20px 0;
}

.product-actions {
  margin-top: 30px;
  display: flex;
  gap: 12px;
}

.product-actions .el-button {
  flex: 1;
}
</style>
```

## API

### Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| model-value / v-model | 是否显示 Drawer | boolean | — | — |
| append-to-body | Drawer 自身是否插入至 body 元素上 | boolean | — | false |
| before-close | 关闭前的回调，会暂停 Drawer 的关闭 | function(done)，done 用于关闭 Drawer | — | — |
| close-on-click-modal | 是否可以通过点击 modal 关闭 Drawer | boolean | — | true |
| close-on-press-escape | 是否可以通过按下 ESC 关闭 Drawer | boolean | — | true |
| custom-class | Drawer 的自定义类名 | string | — | — |
| destroy-on-close | 控制是否在关闭 Drawer 之后将子元素全部销毁 | boolean | — | false |
| modal | 是否需要遮罩层 | boolean | — | true |
| direction | Drawer 打开的方向 | string | rtl / ltr / ttb / btt | rtl |
| show-close | 是否显示关闭按钮 | boolean | — | true |
| size | Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释 | number / string | — | 30% |
| title | Drawer 的标题，也可通过具名 slot 传入 | string | — | — |
| with-header | 控制是否显示 header 栏, 默认为 true, 当此项为 false 时, title attribute 和 title slot 均不生效 | boolean | — | true |
| modal-class | 遮罩层的自定义类名 | string | — | — |
| z-index | 设置 z-index | number | — | — |
| header-height | Header 区域的高度 | string / number | — | — |

<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| open | Drawer 打开的回调 | Function |
| opened | Drawer 打开动画结束时的回调 | Function |
| close | Drawer 关闭的回调 | Function |
| closed | Drawer 关闭动画结束时的回调 | Function |
| open-auto-focus | 输入焦点聚焦在 Drawer 内容时的回调 | Function |
| close-auto-focus | 输入焦点从 Drawer 内容失焦时的回调 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

### Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | Drawer 的内容 | — |
| header | Drawer 标题区的内容；会替换标题部分，但不会移除关闭按钮。 | { close: Function, titleId: string, titleClass: string } |
| title | 与 header 作用相同 请使用 header | { close: Function, titleId: string, titleClass: string } |
| footer | Drawer 页脚区的内容 | — |

<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

## 最佳实践

1. **合理使用懒渲染**：Drawer 的内容是懒渲染的，如果需要执行 DOM 操作，请在 open 事件回调中进行
2. **嵌套 Drawer 使用 append-to-body**：在嵌套 Drawer 时，内层 Drawer 需要设置 append-to-body 为 true
3. **选择合适的方向**：根据页面布局和用户习惯选择合适的 direction
4. **合理设置大小**：根据内容量设置合适的 size，避免内容过于拥挤或空旷
5. **关闭前确认**：对于重要操作，使用 before-close 回调进行确认
6. **可访问性**：当不显示头部时，请务必设置好 title 属性以保持可访问性

## 常见问题

### Q: Drawer 的内容什么时候渲染？
A: Drawer 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。因此，如果需要执行 DOM 操作，或通过 ref 获取相应组件，请在 open 事件回调中进行。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

### Q: 如何自定义 Drawer 的头部？
A: 可以使用 header 插槽来自定义显示标题的区域。为了保持可用性，除了使用此插槽外，建议使用 title 属性，或使用 titleId 插槽属性来指定哪些元素应该读取为抽屉标题。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

### Q: Drawer 和 Dialog 有什么区别？
A: Drawer 拥有和 Dialog 几乎相同的 API，主要区别在于 UI 体验上。Drawer 从页面边缘滑出，适合展示表单、文档等需要更多空间的内容。

### Q: 如何控制 Drawer 不显示头部？
A: 通过设置 with-header 属性为 false 来控制是否显示标题。如果你的应用需要具备可访问性，请务必设置好 title。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="3">3</mcreference>

## 实践项目

### 侧边抽屉导航系统
创建一个完整的侧边抽屉导航系统，包含以下功能：

1. **多方向抽屉**
   - 实现左侧、右侧、顶部、底部四个方向的抽屉
   - 根据内容类型选择合适的抽屉方向
   - 处理不同方向抽屉的尺寸设置

2. **抽屉内容管理**
   - 实现抽屉内容的动态加载
   - 支持表单、列表、详情等不同类型内容
   - 处理抽屉内容的滚动和布局

3. **抽屉状态同步**
   - 使用 Pinia 管理抽屉的全局状态
   - 实现多个抽屉之间的状态同步
   - 处理抽屉的持久化存储

4. **响应式抽屉**
   - 根据屏幕尺寸调整抽屉大小
   - 在移动端自动切换为全屏模式
   - 处理横竖屏切换的适配

### 实践要点
- 合理选择抽屉的打开方向和尺寸
- 实现抽屉内容的懒加载和性能优化
- 处理抽屉的嵌套和层级管理
- 确保抽屉的无障碍访问支持
- 优化移动端的交互体验

## 学习检查清单

### 基础功能
- [ ] 掌握 Drawer 的基本使用方法
- [ ] 理解 `model-value` 的双向绑定机制
- [ ] 熟练使用 `direction`、`size` 等基础属性
- [ ] 掌握 `before-close` 回调的使用

### 高级功能
- [ ] 实现不同方向的抽屉
- [ ] 处理嵌套抽屉的场景
- [ ] 自定义抽屉的头部和底部
- [ ] 控制抽屉头部的显示和隐藏

### 性能优化
- [ ] 理解抽屉的懒渲染机制
- [ ] 合理使用 `destroy-on-close` 属性
- [ ] 优化抽屉的动画效果
- [ ] 处理大量数据的显示

### 用户体验
- [ ] 实现抽屉的响应式设计
- [ ] 处理键盘导航和焦点管理
- [ ] 提供清晰的操作反馈
- [ ] 确保抽屉的无障碍访问

## 注意事项

### 弹出层的层级管理
- 合理设置抽屉的层级关系
- 使用 `append-to-body` 处理定位问题
- 注意嵌套抽屉的层级冲突
- 避免过多的抽屉同时显示

### 用户操作的连贯性
- 保持抽屉操作的逻辑性
- 提供明确的打开和关闭反馈
- 避免突然的界面变化
- 确保用户能够轻松导航

### 移动端的交互体验
- 在小屏幕设备上优化抽屉尺寸
- 支持手势操作和触摸交互
- 考虑虚拟键盘对抽屉的影响
- 提供合适的关闭方式

### 弹出层的性能影响
- 避免在抽屉中渲染过多内容
- 使用懒加载减少初始渲染时间
- 及时销毁不需要的抽屉实例
- 监控抽屉对页面性能的影响

---

## 学习记录

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**



**实践项目完成情况：**
- [ ] 侧边抽屉导航系统
- [ ] 多方向抽屉实现
- [ ] 抽屉内容管理
- [ ] 状态同步机制
- [ ] 响应式适配

## 总结

Drawer 抽屉组件是一个功能强大且灵活的面板组件，具有以下核心特点：

### 核心特点

- **多方向支持**：支持从四个方向滑出，适应不同的界面布局需求
- **懒渲染优化**：内容懒加载机制，提升应用性能
- **灵活配置**：丰富的属性和插槽，支持高度自定义
- **嵌套能力**：支持多层抽屉嵌套，处理复杂交互场景
- **事件完整**：提供完整的生命周期事件，便于状态管理
- **无障碍友好**：良好的键盘导航和屏幕阅读器支持

### 适用场景

- **表单操作**：适合长表单、复杂表单的展示和编辑
- **详情查看**：商品详情、用户信息等内容的详细展示
- **设置面板**：应用配置、用户偏好等设置界面
- **导航菜单**：移动端侧边导航、快捷操作面板
- **内容编辑**：需要大空间的编辑操作界面

### 最佳实践建议

1. **合理选择方向**：根据内容类型和页面布局选择合适的滑出方向
2. **优化性能**：利用懒渲染特性，避免不必要的DOM渲染
3. **响应式设计**：根据设备屏幕大小调整抽屉尺寸
4. **用户体验**：提供清晰的操作反馈和关闭确认
5. **无障碍访问**：确保键盘导航和屏幕阅读器的良好支持

掌握 Drawer 组件的使用，能够为用户提供更好的空间利用和交互体验，特别适合需要额外操作空间的复杂界面场景。

## 参考资料

- [Element Plus Drawer 官方文档](https://element-plus.org/zh-CN/component/drawer.html)
- [Vue 3 Teleport 组件](https://cn.vuejs.org/guide/built-ins/teleport.html)
- [Web 可访问性抽屉设计](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [移动端抽屉交互设计](https://material.io/components/navigation-drawer)