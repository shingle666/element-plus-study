# Descriptions 描述列表

## 概述

Descriptions 描述列表组件以列表形式展示多个字段，适用于详情页面、用户信息展示、产品规格说明等场景。它提供了灵活的布局选项和丰富的自定义功能。<mcreference link="https://element-plus.org/zh-CN/component/descriptions.html" index="0">0</mcreference>

## 学习目标

- 掌握 Descriptions 组件的基础用法
- 学会配置不同尺寸和布局方向
- 理解单元格跨行和自定义样式的实现
- 掌握 Descriptions 组件的 API 和最佳实践
- 了解在实际项目中的应用场景

## 基础用法

### 基础描述列表

最简单的用法，展示基本的字段信息。<mcreference link="https://element-plus.org/zh-CN/component/descriptions.html" index="0">0</mcreference>

```vue
<template>
  <div class="descriptions-demo">
    <h3>基础描述列表</h3>
    <el-descriptions title="用户信息" :column="3" border>
      <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
      <el-descriptions-item label="备注">学校</el-descriptions-item>
      <el-descriptions-item label="联系地址" :span="2">
        江苏省苏州市吴中区吴中大道 1188 号
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
```

### 不同尺寸

通过设置 `size` 属性来配置尺寸，可选值为 `large`、`default`、`small`。<mcreference link="https://element-plus.org/zh-CN/component/descriptions.html" index="0">0</mcreference>

```vue
<template>
  <div class="size-demo">
    <h3>不同尺寸</h3>
    
    <!-- 大尺寸 -->
    <el-descriptions title="Large size" :column="3" size="large" border>
      <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
      <el-descriptions-item label="备注">学校</el-descriptions-item>
      <el-descriptions-item label="联系地址" :span="2">
        江苏省苏州市吴中区吴中大道 1188 号
      </el-descriptions-item>
    </el-descriptions>
    
    <!-- 默认尺寸 -->
    <el-descriptions title="Default size" :column="3" border style="margin-top: 20px">
      <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
      <el-descriptions-item label="备注">学校</el-descriptions-item>
      <el-descriptions-item label="联系地址" :span="2">
        江苏省苏州市吴中区吴中大道 1188 号
      </el-descriptions-item>
    </el-descriptions>
    
    <!-- 小尺寸 -->
    <el-descriptions title="Small size" :column="3" size="small" border style="margin-top: 20px">
      <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
      <el-descriptions-item label="备注">学校</el-descriptions-item>
      <el-descriptions-item label="联系地址" :span="2">
        江苏省苏州市吴中区吴中大道 1188 号
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
```

### 垂直列表

通过设置 `direction` 为 `vertical` 可以让列表垂直排列。<mcreference link="https://element-plus.org/zh-CN/component/descriptions.html" index="0">0</mcreference>

```vue
<template>
  <div class="vertical-demo">
    <h3>垂直列表</h3>
    
    <el-descriptions title="垂直列表" direction="vertical" :column="4" border>
      <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
      <el-descriptions-item label="备注">学校</el-descriptions-item>
      <el-descriptions-item label="联系地址">
        江苏省苏州市吴中区吴中大道 1188 号
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
```

### 单元格跨行

通过设置 `rowspan` 属性可以让单元格跨越多行。<mcreference link="https://element-plus.org/zh-CN/component/descriptions.html" index="0">0</mcreference>

```vue
<template>
  <div class="rowspan-demo">
    <h3>单元格跨行</h3>
    
    <el-descriptions title="用户信息" :column="3" border>
      <el-descriptions-item label="头像" :rowspan="2">
        <el-avatar :size="60" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      </el-descriptions-item>
      <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
      <el-descriptions-item label="备注">学校</el-descriptions-item>
      <el-descriptions-item label="联系地址" :span="2">
        江苏省苏州市吴中区吴中大道 1188 号
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
```

### 自定义样式

可以通过 `class-name` 和 `label-class-name` 自定义样式。<mcreference link="https://element-plus.org/zh-CN/component/descriptions.html" index="0">0</mcreference>

```vue
<template>
  <div class="custom-style-demo">
    <h3>自定义样式</h3>
    
    <el-descriptions title="用户信息" :column="3" border>
      <el-descriptions-item 
        label="用户名" 
        label-class-name="my-label" 
        class-name="my-content"
      >
        kooriookami
      </el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
      <el-descriptions-item label="备注">学校</el-descriptions-item>
      <el-descriptions-item label="联系地址" :span="2">
        江苏省苏州市吴中区吴中大道 1188 号
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>
.my-label {
  background: var(--el-color-success-light-9) !important;
  color: var(--el-color-success) !important;
  font-weight: bold;
}

.my-content {
  background: var(--el-color-warning-light-9) !important;
  color: var(--el-color-warning) !important;
}
</style>
```

## 实际应用示例

### 用户详情页面

```vue
<template>
  <div class="user-profile-demo">
    <h3>用户详情页面</h3>
    
    <el-descriptions title="个人信息" :column="3" border>
      <template #extra>
        <el-button type="primary" size="small" @click="editProfile">
          编辑资料
        </el-button>
      </template>
      
      <el-descriptions-item label="头像" :rowspan="2">
        <el-avatar :size="80" :src="userInfo.avatar" />
      </el-descriptions-item>
      <el-descriptions-item label="用户名">{{ userInfo.username }}</el-descriptions-item>
      <el-descriptions-item label="昵称">{{ userInfo.nickname }}</el-descriptions-item>
      <el-descriptions-item label="性别">
        <el-tag :type="userInfo.gender === '男' ? 'primary' : 'danger'" size="small">
          {{ userInfo.gender }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="年龄">{{ userInfo.age }} 岁</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ userInfo.phone }}</el-descriptions-item>
      <el-descriptions-item label="职业">{{ userInfo.profession }}</el-descriptions-item>
      <el-descriptions-item label="注册时间">{{ userInfo.registerTime }}</el-descriptions-item>
      <el-descriptions-item label="最后登录">{{ userInfo.lastLogin }}</el-descriptions-item>
      <el-descriptions-item label="账户状态">
        <el-tag :type="userInfo.status === '正常' ? 'success' : 'danger'" size="small">
          {{ userInfo.status }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="个人简介" :span="3">
        {{ userInfo.bio || '暂无个人简介' }}
      </el-descriptions-item>
      <el-descriptions-item label="联系地址" :span="3">
        {{ userInfo.address }}
      </el-descriptions-item>
    </el-descriptions>
    
    <!-- 账户设置 -->
    <el-descriptions title="账户设置" :column="2" border style="margin-top: 20px">
      <el-descriptions-item label="两步验证">
        <el-switch v-model="userInfo.twoFactorAuth" disabled />
      </el-descriptions-item>
      <el-descriptions-item label="邮件通知">
        <el-switch v-model="userInfo.emailNotification" disabled />
      </el-descriptions-item>
      <el-descriptions-item label="隐私设置">
        <el-tag size="small">{{ userInfo.privacyLevel }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="会员等级">
        <el-tag type="warning" size="small">{{ userInfo.memberLevel }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const userInfo = ref({
  username: 'kooriookami',
  nickname: '小王',
  gender: '男',
  age: 28,
  email: 'kooriookami@example.com',
  phone: '18100000000',
  profession: '前端工程师',
  registerTime: '2023-01-15 10:30:00',
  lastLogin: '2024-01-20 14:25:30',
  status: '正常',
  bio: '热爱技术，专注于前端开发，喜欢学习新技术和分享经验。',
  address: '江苏省苏州市吴中区吴中大道 1188 号',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  twoFactorAuth: true,
  emailNotification: false,
  privacyLevel: '仅好友可见',
  memberLevel: 'VIP'
})

const editProfile = () => {
  ElMessage.info('跳转到编辑页面')
}
</script>
```

### 产品规格展示

```vue
<template>
  <div class="product-specs-demo">
    <h3>产品规格展示</h3>
    
    <el-descriptions title="iPhone 15 Pro" :column="2" border>
      <template #extra>
        <el-button type="primary" size="small">
          立即购买
        </el-button>
        <el-button size="small" style="margin-left: 8px">
          加入购物车
        </el-button>
      </template>
      
      <!-- 基本信息 -->
      <el-descriptions-item label="产品名称" :span="2">
        <strong>{{ productInfo.name }}</strong>
      </el-descriptions-item>
      <el-descriptions-item label="价格">
        <span style="color: #f56c6c; font-size: 18px; font-weight: bold;">
          ¥{{ productInfo.price }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="库存状态">
        <el-tag :type="productInfo.stock > 0 ? 'success' : 'danger'" size="small">
          {{ productInfo.stock > 0 ? '有库存' : '缺货' }}
        </el-tag>
      </el-descriptions-item>
      
      <!-- 技术规格 -->
      <el-descriptions-item label="屏幕尺寸">{{ productInfo.specs.screenSize }}</el-descriptions-item>
      <el-descriptions-item label="分辨率">{{ productInfo.specs.resolution }}</el-descriptions-item>
      <el-descriptions-item label="处理器">{{ productInfo.specs.processor }}</el-descriptions-item>
      <el-descriptions-item label="存储容量">{{ productInfo.specs.storage }}</el-descriptions-item>
      <el-descriptions-item label="摄像头">{{ productInfo.specs.camera }}</el-descriptions-item>
      <el-descriptions-item label="电池容量">{{ productInfo.specs.battery }}</el-descriptions-item>
      <el-descriptions-item label="操作系统">{{ productInfo.specs.os }}</el-descriptions-item>
      <el-descriptions-item label="网络支持">{{ productInfo.specs.network }}</el-descriptions-item>
      
      <!-- 其他信息 -->
      <el-descriptions-item label="重量">{{ productInfo.specs.weight }}</el-descriptions-item>
      <el-descriptions-item label="颜色">
        <el-tag 
          v-for="color in productInfo.colors" 
          :key="color" 
          size="small" 
          style="margin-right: 4px"
        >
          {{ color }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="保修期">{{ productInfo.warranty }}</el-descriptions-item>
      <el-descriptions-item label="发布日期">{{ productInfo.releaseDate }}</el-descriptions-item>
      
      <!-- 产品描述 -->
      <el-descriptions-item label="产品描述" :span="2">
        {{ productInfo.description }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const productInfo = ref({
  name: 'iPhone 15 Pro',
  price: '7999',
  stock: 50,
  specs: {
    screenSize: '6.1英寸',
    resolution: '2556 x 1179',
    processor: 'A17 Pro 芯片',
    storage: '128GB/256GB/512GB/1TB',
    camera: '48MP 主摄 + 12MP 超广角 + 12MP 长焦',
    battery: '3274mAh',
    os: 'iOS 17',
    network: '5G',
    weight: '187g'
  },
  colors: ['深空黑色', '原色钛金属', '白色钛金属', '蓝色钛金属'],
  warranty: '1年有限保修',
  releaseDate: '2023年9月',
  description: 'iPhone 15 Pro 采用航空级钛金属设计，搭载强大的 A17 Pro 芯片，配备专业级摄像头系统，为用户带来前所未有的移动体验。'
})
</script>
```

### 订单详情展示

```vue
<template>
  <div class="order-details-demo">
    <h3>订单详情展示</h3>
    
    <el-descriptions title="订单信息" :column="3" border>
      <template #extra>
        <el-button type="primary" size="small" @click="trackOrder">
          物流跟踪
        </el-button>
      </template>
      
      <el-descriptions-item label="订单号">{{ orderInfo.orderNo }}</el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <el-tag :type="getStatusType(orderInfo.status)" size="small">
          {{ orderInfo.status }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="支付方式">{{ orderInfo.paymentMethod }}</el-descriptions-item>
      
      <el-descriptions-item label="下单时间">{{ orderInfo.createTime }}</el-descriptions-item>
      <el-descriptions-item label="支付时间">{{ orderInfo.payTime }}</el-descriptions-item>
      <el-descriptions-item label="发货时间">{{ orderInfo.shipTime }}</el-descriptions-item>
      
      <el-descriptions-item label="收货人">{{ orderInfo.receiver.name }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ orderInfo.receiver.phone }}</el-descriptions-item>
      <el-descriptions-item label="收货地址" :span="1">
        {{ orderInfo.receiver.address }}
      </el-descriptions-item>
      
      <el-descriptions-item label="商品总额">¥{{ orderInfo.goodsAmount }}</el-descriptions-item>
      <el-descriptions-item label="运费">¥{{ orderInfo.shippingFee }}</el-descriptions-item>
      <el-descriptions-item label="优惠金额">-¥{{ orderInfo.discountAmount }}</el-descriptions-item>
      
      <el-descriptions-item label="实付金额" :span="3">
        <span style="color: #f56c6c; font-size: 18px; font-weight: bold;">
          ¥{{ orderInfo.totalAmount }}
        </span>
      </el-descriptions-item>
      
      <el-descriptions-item label="备注" :span="3">
        {{ orderInfo.remark || '无备注' }}
      </el-descriptions-item>
    </el-descriptions>
    
    <!-- 商品列表 -->
    <el-descriptions title="商品清单" :column="1" border style="margin-top: 20px">
      <el-descriptions-item 
        v-for="(item, index) in orderInfo.items" 
        :key="index"
        :label="`商品${index + 1}`"
      >
        <div class="order-item">
          <el-image 
            :src="item.image" 
            :alt="item.name"
            style="width: 60px; height: 60px; margin-right: 12px;"
            fit="cover"
          />
          <div class="item-info">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-spec">{{ item.spec }}</div>
            <div class="item-price">
              ¥{{ item.price }} × {{ item.quantity }} = ¥{{ item.totalPrice }}
            </div>
          </div>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const orderInfo = ref({
  orderNo: 'ORD202401200001',
  status: '已发货',
  paymentMethod: '支付宝',
  createTime: '2024-01-20 10:30:00',
  payTime: '2024-01-20 10:32:15',
  shipTime: '2024-01-20 16:45:30',
  receiver: {
    name: '张三',
    phone: '18100000000',
    address: '江苏省苏州市吴中区吴中大道 1188 号'
  },
  goodsAmount: '7999.00',
  shippingFee: '0.00',
  discountAmount: '100.00',
  totalAmount: '7899.00',
  remark: '请在工作日送货',
  items: [
    {
      name: 'iPhone 15 Pro',
      spec: '深空黑色 128GB',
      price: '7999.00',
      quantity: 1,
      totalPrice: '7999.00',
      image: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
  ]
})

const getStatusType = (status) => {
  const statusMap = {
    '待支付': 'warning',
    '已支付': 'primary',
    '已发货': 'success',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}

const trackOrder = () => {
  ElMessage.info('跳转到物流跟踪页面')
}
</script>

<style scoped>
.order-item {
  display: flex;
  align-items: center;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.item-spec {
  color: #909399;
  font-size: 12px;
  margin-bottom: 4px;
}

.item-price {
  color: #f56c6c;
  font-weight: 500;
}
</style>
```

## API 文档

### Descriptions Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| border | 是否带有边框 | boolean | false |
| column | 一行 Descriptions Item 的数量 | number | 3 |
| direction | 排列的方向 | enum | horizontal |
| size | 列表的尺寸 | enum | — |
| title | 标题文本，显示在左上方 | string | '' |
| extra | 操作区文本，显示在右上方 | string | '' |
| label-width | 每一列的标签宽度 | string / number | '' |

### Descriptions Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 自定义默认内容 | Descriptions Item |
| title | 自定义标题，显示在左上方 | — |
| extra | 自定义操作区，显示在右上方 | — |

### DescriptionsItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| label | 标签文本 | string | '' |
| span | 列的数量 | number | 1 |
| rowspan | 单元格应该跨越的行数 | number | 1 |
| width | 列的宽度，不同行相同列的宽度按最大值设定 | string / number | '' |
| min-width | 列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列 | string / number | '' |
| label-width | 列标签宽，如果未设置，它将与列宽度相同。比 Descriptions 的 label-width 优先级高 | string / number | '' |
| align | 列的内容对齐方式 | enum | left |
| label-align | 列的标签对齐方式，若不设置该项，则使用内容的对齐方式 | enum | — |
| class-name | 列的内容自定义类名 | string | '' |
| label-class-name | 列标签自定义类名 | string | '' |

### DescriptionsItem Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义默认内容 |
| label | 自定义标签 |

## 最佳实践

### 布局设计

1. **合理分组**：将相关信息归类到同一个描述列表中
2. **列数控制**：根据内容量和屏幕尺寸选择合适的列数
3. **跨列使用**：对于较长的内容使用 `span` 属性跨列显示

### 内容展示

1. **标签简洁**：使用简短明了的标签文本
2. **内容格式化**：对数字、日期等内容进行适当格式化
3. **状态标识**：使用 Tag 组件标识状态信息

### 响应式设计

1. **移动适配**：在移动设备上减少列数或使用垂直布局
2. **内容截断**：对过长内容进行截断或折叠处理
3. **字体调整**：根据设备调整字体大小

### 可访问性

1. **语义化**：使用合适的 HTML 语义标签
2. **对比度**：确保文本与背景有足够的对比度
3. **键盘导航**：支持键盘导航和屏幕阅读器

## 常见问题

### 1. 内容对齐问题

**问题**：标签和内容对齐不一致

**解决方案**：
- 使用 `align` 和 `label-align` 属性控制对齐方式
- 设置合适的 `label-width` 确保标签宽度一致
- 使用 CSS 进行细节调整

### 2. 响应式布局问题

**问题**：在小屏幕上显示效果不佳

**解决方案**：
- 使用媒体查询调整 `column` 数量
- 在移动端使用 `direction="vertical"` 垂直布局
- 适当调整字体大小和间距

### 3. 内容溢出问题

**问题**：长文本内容溢出容器

**解决方案**：
- 使用 CSS `word-break` 和 `overflow-wrap` 处理长文本
- 对超长内容使用省略号或展开/收起功能
- 合理使用 `span` 属性分配空间

### 4. 样式定制问题

**问题**：默认样式不符合设计要求

**解决方案**：
- 使用 `class-name` 和 `label-class-name` 自定义样式
- 通过 CSS 变量覆盖主题样式
- 使用深度选择器修改内部样式

## 总结

Descriptions 描述列表组件是一个功能强大的信息展示组件，通过合理的配置和使用，可以清晰地展示各种结构化信息。在实际应用中，需要注意布局设计、内容组织和响应式适配，以提供良好的用户体验。

## 参考资料

- [Element Plus Descriptions 官方文档](https://element-plus.org/zh-CN/component/descriptions.html)
- [CSS Grid 布局指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout)
- [响应式设计最佳实践](https://web.dev/responsive-web-design-basics/)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)