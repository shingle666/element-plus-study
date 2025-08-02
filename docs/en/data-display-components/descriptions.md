# Descriptions

## Overview

The Descriptions component displays multiple fields in a list format, suitable for detail pages, user information display, product specification descriptions, and other scenarios. It provides flexible layout options and rich customization features.

## Learning Objectives

- Master the basic usage of the Descriptions component
- Learn to configure different sizes and layout directions
- Understand the implementation of cell spanning and custom styles
- Master the API and best practices of the Descriptions component
- Understand application scenarios in actual projects

## Basic Usage

### Basic Description List

The simplest usage, displaying basic field information.

```vue
<template>
  <div class="descriptions-demo">
    <h3>Basic Description List</h3>
    <el-descriptions title="User Information" :column="3" border>
      <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
      <el-descriptions-item label="Phone">18100000000</el-descriptions-item>
      <el-descriptions-item label="Residence">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks">School</el-descriptions-item>
      <el-descriptions-item label="Address" :span="2">
        No. 1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
```

### Different Sizes

Configure the size by setting the `size` attribute, with options of `large`, `default`, and `small`.

```vue
<template>
  <div class="size-demo">
    <h3>Different Sizes</h3>
    
    <!-- Large size -->
    <el-descriptions title="Large size" :column="3" size="large" border>
      <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
      <el-descriptions-item label="Phone">18100000000</el-descriptions-item>
      <el-descriptions-item label="Residence">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks">School</el-descriptions-item>
      <el-descriptions-item label="Address" :span="2">
        No. 1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
    
    <!-- Default size -->
    <el-descriptions title="Default size" :column="3" border style="margin-top: 20px">
      <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
      <el-descriptions-item label="Phone">18100000000</el-descriptions-item>
      <el-descriptions-item label="Residence">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks">School</el-descriptions-item>
      <el-descriptions-item label="Address" :span="2">
        No. 1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
    
    <!-- Small size -->
    <el-descriptions title="Small size" :column="3" size="small" border style="margin-top: 20px">
      <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
      <el-descriptions-item label="Phone">18100000000</el-descriptions-item>
      <el-descriptions-item label="Residence">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks">School</el-descriptions-item>
      <el-descriptions-item label="Address" :span="2">
        No. 1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
```

### Vertical List

Set `direction` to `vertical` to arrange the list vertically.

```vue
<template>
  <div class="vertical-demo">
    <h3>Vertical List</h3>
    
    <el-descriptions title="Vertical List" direction="vertical" :column="4" border>
      <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
      <el-descriptions-item label="Phone">18100000000</el-descriptions-item>
      <el-descriptions-item label="Residence">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks">School</el-descriptions-item>
      <el-descriptions-item label="Address">
        No. 1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
```

### Cell Row Spanning

Use the `rowspan` attribute to make cells span multiple rows.

```vue
<template>
  <div class="rowspan-demo">
    <h3>Cell Row Spanning</h3>
    
    <el-descriptions title="User Information" :column="3" border>
      <el-descriptions-item label="Avatar" :rowspan="2">
        <el-avatar :size="60" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      </el-descriptions-item>
      <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
      <el-descriptions-item label="Phone">18100000000</el-descriptions-item>
      <el-descriptions-item label="Residence">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks">School</el-descriptions-item>
      <el-descriptions-item label="Address" :span="2">
        No. 1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
```

### Custom Styles

Customize styles using `class-name` and `label-class-name`.

```vue
<template>
  <div class="custom-style-demo">
    <h3>Custom Styles</h3>
    
    <el-descriptions title="User Information" :column="3" border>
      <el-descriptions-item 
        label="Username" 
        label-class-name="my-label" 
        class-name="my-content"
      >
        kooriookami
      </el-descriptions-item>
      <el-descriptions-item label="Phone">18100000000</el-descriptions-item>
      <el-descriptions-item label="Residence">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks">School</el-descriptions-item>
      <el-descriptions-item label="Address" :span="2">
        No. 1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
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

## Practical Application Examples

### User Profile Page

```vue
<template>
  <div class="user-profile-demo">
    <h3>User Profile Page</h3>
    
    <el-descriptions title="Personal Information" :column="3" border>
      <template #extra>
        <el-button type="primary" size="small" @click="editProfile">
          Edit Profile
        </el-button>
      </template>
      
      <el-descriptions-item label="Avatar" :rowspan="2">
        <el-avatar :size="80" :src="userInfo.avatar" />
      </el-descriptions-item>
      <el-descriptions-item label="Username">{{ userInfo.username }}</el-descriptions-item>
      <el-descriptions-item label="Nickname">{{ userInfo.nickname }}</el-descriptions-item>
      <el-descriptions-item label="Gender">
        <el-tag :type="userInfo.gender === 'Male' ? 'primary' : 'danger'" size="small">
          {{ userInfo.gender }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Age">{{ userInfo.age }} years</el-descriptions-item>
      <el-descriptions-item label="Email">{{ userInfo.email }}</el-descriptions-item>
      <el-descriptions-item label="Phone">{{ userInfo.phone }}</el-descriptions-item>
      <el-descriptions-item label="Profession">{{ userInfo.profession }}</el-descriptions-item>
      <el-descriptions-item label="Registration Time">{{ userInfo.registerTime }}</el-descriptions-item>
      <el-descriptions-item label="Last Login">{{ userInfo.lastLogin }}</el-descriptions-item>
      <el-descriptions-item label="Account Status">
        <el-tag :type="userInfo.status === 'Normal' ? 'success' : 'danger'" size="small">
          {{ userInfo.status }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Bio" :span="3">
        {{ userInfo.bio || 'No bio available' }}
      </el-descriptions-item>
      <el-descriptions-item label="Address" :span="3">
        {{ userInfo.address }}
      </el-descriptions-item>
    </el-descriptions>
    
    <!-- Account Settings -->
    <el-descriptions title="Account Settings" :column="2" border style="margin-top: 20px">
      <el-descriptions-item label="Two-Factor Authentication">
        <el-switch v-model="userInfo.twoFactorAuth" disabled />
      </el-descriptions-item>
      <el-descriptions-item label="Email Notifications">
        <el-switch v-model="userInfo.emailNotification" disabled />
      </el-descriptions-item>
      <el-descriptions-item label="Privacy Settings">
        <el-tag size="small">{{ userInfo.privacyLevel }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Membership Level">
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
  nickname: 'John',
  gender: 'Male',
  age: 28,
  email: 'kooriookami@example.com',
  phone: '18100000000',
  profession: 'Frontend Engineer',
  registerTime: '2023-01-15 10:30:00',
  lastLogin: '2024-01-20 14:25:30',
  status: 'Normal',
  bio: 'Passionate about technology, focused on frontend development, enjoys learning new technologies and sharing experiences.',
  address: 'No. 1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  twoFactorAuth: true,
  emailNotification: false,
  privacyLevel: 'Friends Only',
  memberLevel: 'VIP'
})

const editProfile = () => {
  ElMessage.info('Redirecting to edit page')
}
</script>
```

### Product Specifications Display

```vue
<template>
  <div class="product-specs-demo">
    <h3>Product Specifications Display</h3>
    
    <el-descriptions title="iPhone 15 Pro" :column="2" border>
      <template #extra>
        <el-button type="primary" size="small">
          Buy Now
        </el-button>
        <el-button size="small" style="margin-left: 8px">
          Add to Cart
        </el-button>
      </template>
      
      <!-- Basic Information -->
      <el-descriptions-item label="Product Name" :span="2">
        <strong>{{ productInfo.name }}</strong>
      </el-descriptions-item>
      <el-descriptions-item label="Price">
        <span style="color: #f56c6c; font-size: 18px; font-weight: bold;">
          ${{ productInfo.price }}
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="Stock Status">
        <el-tag :type="productInfo.stock > 0 ? 'success' : 'danger'" size="small">
          {{ productInfo.stock > 0 ? 'In Stock' : 'Out of Stock' }}
        </el-tag>
      </el-descriptions-item>
      
      <!-- Technical Specifications -->
      <el-descriptions-item label="Screen Size">{{ productInfo.specs.screenSize }}</el-descriptions-item>
      <el-descriptions-item label="Resolution">{{ productInfo.specs.resolution }}</el-descriptions-item>
      <el-descriptions-item label="Processor">{{ productInfo.specs.processor }}</el-descriptions-item>
      <el-descriptions-item label="Storage">{{ productInfo.specs.storage }}</el-descriptions-item>
      <el-descriptions-item label="Camera">{{ productInfo.specs.camera }}</el-descriptions-item>
      <el-descriptions-item label="Battery">{{ productInfo.specs.battery }}</el-descriptions-item>
      <el-descriptions-item label="Operating System">{{ productInfo.specs.os }}</el-descriptions-item>
      <el-descriptions-item label="Network Support">{{ productInfo.specs.network }}</el-descriptions-item>
      
      <!-- Other Information -->
      <el-descriptions-item label="Weight">{{ productInfo.specs.weight }}</el-descriptions-item>
      <el-descriptions-item label="Colors">
        <el-tag 
          v-for="color in productInfo.colors" 
          :key="color" 
          size="small" 
          style="margin-right: 4px"
        >
          {{ color }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Warranty">{{ productInfo.warranty }}</el-descriptions-item>
      <el-descriptions-item label="Release Date">{{ productInfo.releaseDate }}</el-descriptions-item>
      
      <!-- Product Description -->
      <el-descriptions-item label="Product Description" :span="2">
        {{ productInfo.description }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const productInfo = ref({
  name: 'iPhone 15 Pro',
  price: '999',
  stock: 50,
  specs: {
    screenSize: '6.1 inches',
    resolution: '2556 x 1179',
    processor: 'A17 Pro chip',
    storage: '128GB/256GB/512GB/1TB',
    camera: '48MP main + 12MP ultra-wide + 12MP telephoto',
    battery: '3274mAh',
    os: 'iOS 17',
    network: '5G',
    weight: '187g'
  },
  colors: ['Deep Black', 'Natural Titanium', 'White Titanium', 'Blue Titanium'],
  warranty: '1 year limited warranty',
  releaseDate: 'September 2023',
  description: 'iPhone 15 Pro features an aerospace-grade titanium design, powered by the A17 Pro chip, equipped with a professional camera system, bringing users an unprecedented mobile experience.'
})
</script>
```

### Order Details Display

```vue
<template>
  <div class="order-details-demo">
    <h3>Order Details Display</h3>
    
    <el-descriptions title="Order Information" :column="3" border>
      <template #extra>
        <el-button type="primary" size="small" @click="trackOrder">
          Track Order
        </el-button>
      </template>
      
      <el-descriptions-item label="Order Number">{{ orderInfo.orderNo }}</el-descriptions-item>
      <el-descriptions-item label="Order Status">
        <el-tag :type="getStatusType(orderInfo.status)" size="small">
          {{ orderInfo.status }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Payment Method">{{ orderInfo.paymentMethod }}</el-descriptions-item>
      
      <el-descriptions-item label="Order Time">{{ orderInfo.createTime }}</el-descriptions-item>
      <el-descriptions-item label="Payment Time">{{ orderInfo.payTime }}</el-descriptions-item>
      <el-descriptions-item label="Shipping Time">{{ orderInfo.shipTime }}</el-descriptions-item>
      
      <el-descriptions-item label="Recipient">{{ orderInfo.receiver.name }}</el-descriptions-item>
      <el-descriptions-item label="Contact Phone">{{ orderInfo.receiver.phone }}</el-descriptions-item>
      <el-descriptions-item label="Shipping Address" :span="1">
        {{ orderInfo.receiver.address }}
      </el-descriptions-item>
      
      <el-descriptions-item label="Goods Total">${{ orderInfo.goodsAmount }}</el-descriptions-item>
      <el-descriptions-item label="Shipping Fee">${{ orderInfo.shippingFee }}</el-descriptions-item>
      <el-descriptions-item label="Discount">-${{ orderInfo.discountAmount }}</el-descriptions-item>
      
      <el-descriptions-item label="Total Payment" :span="3">
        <span style="color: #f56c6c; font-size: 18px; font-weight: bold;">
          ${{ orderInfo.totalAmount }}
        </span>
      </el-descriptions-item>
      
      <el-descriptions-item label="Remarks" :span="3">
        {{ orderInfo.remark || 'No remarks' }}
      </el-descriptions-item>
    </el-descriptions>
    
    <!-- Item List -->
    <el-descriptions title="Item List" :column="1" border style="margin-top: 20px">
      <el-descriptions-item 
        v-for="(item, index) in orderInfo.items" 
        :key="index"
        :label="`Item ${index + 1}`"
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
              ${{ item.price }} × {{ item.quantity }} = ${{ item.totalPrice }}
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
  status: 'Shipped',
  paymentMethod: 'Alipay',
  createTime: '2024-01-20 10:30:00',
  payTime: '2024-01-20 10:32:15',
  shipTime: '2024-01-20 16:45:30',
  receiver: {
    name: 'John Doe',
    phone: '18100000000',
    address: 'No. 1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province'
  },
  goodsAmount: '999.00',
  shippingFee: '0.00',
  discountAmount: '100.00',
  totalAmount: '899.00',
  remark: 'Please deliver on weekdays',
  items: [
    {
      name: 'iPhone 15 Pro',
      spec: 'Deep Black 128GB',
      price: '999.00',
      quantity: 1,
      totalPrice: '999.00',
      image: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
  ]
})

const getStatusType = (status) => {
  const statusMap = {
    'Pending Payment': 'warning',
    'Paid': 'primary',
    'Shipped': 'success',
    'Completed': 'success',
    'Cancelled': 'danger'
  }
  return statusMap[status] || 'info'
}

const trackOrder = () => {
  ElMessage.info('Redirecting to order tracking page')
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

## API Documentation

### Descriptions Attributes

| Attribute | Description | Type | Default |
|--------|------|------|--------|
| border | Whether to have a border | boolean | false |
| column | Number of Descriptions Items in a row | number | 3 |
| direction | Layout direction | enum | horizontal |
| size | Size of the list | enum | — |
| title | Title text, displayed at the top left | string | '' |
| extra | Operation area text, displayed at the top right | string | '' |
| label-width | Width of each column's label | string / number | '' |

### Descriptions Slots

| Slot Name | Description | Sub-tags |
|--------|------|--------|
| default | Custom default content | Descriptions Item |
| title | Custom title, displayed at the top left | — |
| extra | Custom operation area, displayed at the top right | — |

### DescriptionsItem Attributes

| Attribute | Description | Type | Default |
|--------|------|------|--------|
| label | Label text | string | '' |
| span | Number of columns | number | 1 |
| rowspan | Number of rows the cell should span | number | 1 |
| width | Width of the column, the width of the same column in different rows is set to the maximum value | string / number | '' |
| min-width | Minimum width of the column, the difference from width is that width is fixed, min-width will distribute the remaining width proportionally to columns with min-width set | string / number | '' |
| label-width | Width of the column label, if not set, it will be the same as the column width. Higher priority than Descriptions' label-width | string / number | '' |
| align | Alignment of the column content | enum | left |
| label-align | Alignment of the column label, if not set, it will use the content's alignment | enum | — |
| class-name | Custom class name for the column content | string | '' |
| label-class-name | Custom class name for the column label | string | '' |

### DescriptionsItem Slots

| Slot Name | Description |
|--------|------|
| default | Custom default content |
| label | Custom label |

## Best Practices

### Layout Design

1. **Logical Grouping**: Categorize related information into the same description list
2. **Column Control**: Choose appropriate number of columns based on content volume and screen size
3. **Span Usage**: Use the `span` attribute for longer content to span across columns

### Content Display

1. **Concise Labels**: Use short and clear label text
2. **Content Formatting**: Properly format numbers, dates, and other content
3. **Status Indicators**: Use Tag components to indicate status information

### Responsive Design

1. **Mobile Adaptation**: Reduce the number of columns or use vertical layout on mobile devices
2. **Content Truncation**: Truncate or fold long content
3. **Font Adjustment**: Adjust font size based on device

### Accessibility

1. **Semantics**: Use appropriate HTML semantic tags
2. **Contrast**: Ensure sufficient contrast between text and background
3. **Keyboard Navigation**: Support keyboard navigation and screen readers

## Common Issues

### 1. Content Alignment Issues

**Issue**: Labels and content are not aligned consistently

**Solutions**:
- Use `align` and `label-align` attributes to control alignment
- Set appropriate `label-width` to ensure consistent label width
- Use CSS for detailed adjustments

### 2. Responsive Layout Issues

**Issue**: Poor display on small screens

**Solutions**:
- Use media queries to adjust `column` count
- Use `direction="vertical"` for vertical layout on mobile
- Appropriately adjust font size and spacing

### 3. Content Overflow Issues

**Issue**: Long text content overflows the container

**Solutions**:
- Use CSS `word-break` and `overflow-wrap` to handle long text
- Use ellipsis or expand/collapse functionality for very long content
- Use the `span` attribute to allocate space appropriately

### 4. Style Customization Issues

**Issue**: Default styles don't meet design requirements

**Solutions**:
- Use `class-name` and `label-class-name` for custom styles
- Override theme styles with CSS variables
- Use deep selectors to modify internal styles

## Summary

The Descriptions component is a powerful information display component that can clearly present various structured information through proper configuration and usage. In practical applications, attention should be paid to layout design, content organization, and responsive adaptation to provide a good user experience.

## References

- [Element Plus Descriptions Official Documentation](https://element-plus.org/en-US/component/descriptions.html)
- [CSS Grid Layout Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Responsive Design Best Practices](https://web.dev/responsive-web-design-basics/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)