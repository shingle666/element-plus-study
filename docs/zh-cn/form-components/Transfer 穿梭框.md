# Transfer 穿梭框

## 概述

Transfer 穿梭框是一个双栏穿梭选择组件，用于在两个列表之间进行数据的选择和移动。它提供了直观的界面来管理大量选项的选择，支持搜索、自定义渲染、分页等高级功能。

## 学习目标

- 掌握 Transfer 的基本概念和使用场景
- 学会基础穿梭框功能的实现
- 了解数据格式和配置选项
- 掌握搜索和过滤功能
- 学会自定义渲染和样式
- 了解穿梭框在实际项目中的应用
- 掌握 API 的完整使用方法

## 基础用法

### 基本穿梭框

最简单的穿梭框：

```vue
<template>
  <div>
    <h4>基本穿梭框</h4>
    <el-transfer
      v-model="value1"
      :data="data1"
    />
    <p>选中的值：{{ value1 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref([1, 4])

const data1 = ref([
  {
    key: 1,
    label: '选项 1',
    disabled: false
  },
  {
    key: 2,
    label: '选项 2',
    disabled: false
  },
  {
    key: 3,
    label: '选项 3',
    disabled: false
  },
  {
    key: 4,
    label: '选项 4',
    disabled: false
  },
  {
    key: 5,
    label: '选项 5',
    disabled: false
  },
  {
    key: 6,
    label: '选项 6',
    disabled: false
  }
])
</script>
```

### 可搜索

支持搜索功能的穿梭框：

```vue
<template>
  <div>
    <h4>可搜索穿梭框</h4>
    <el-transfer
      v-model="value2"
      :data="data2"
      filterable
      :filter-method="filterMethod"
      filter-placeholder="请输入搜索内容"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value2 = ref([])

const data2 = ref([
  {
    key: 1,
    label: 'JavaScript',
    disabled: false
  },
  {
    key: 2,
    label: 'TypeScript',
    disabled: false
  },
  {
    key: 3,
    label: 'Vue.js',
    disabled: false
  },
  {
    key: 4,
    label: 'React',
    disabled: false
  },
  {
    key: 5,
    label: 'Angular',
    disabled: false
  },
  {
    key: 6,
    label: 'Node.js',
    disabled: false
  },
  {
    key: 7,
    label: 'Python',
    disabled: false
  },
  {
    key: 8,
    label: 'Java',
    disabled: false
  }
])

const filterMethod = (query, item) => {
  return item.label.toLowerCase().includes(query.toLowerCase())
}
</script>
```

### 自定义标题

自定义穿梭框的标题：

```vue
<template>
  <div>
    <h4>自定义标题</h4>
    <el-transfer
      v-model="value3"
      :data="data3"
      :titles="['可选技能', '已选技能']"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value3 = ref([2, 4])

const data3 = ref([
  { key: 1, label: 'HTML/CSS', disabled: false },
  { key: 2, label: 'JavaScript', disabled: false },
  { key: 3, label: 'Vue.js', disabled: false },
  { key: 4, label: 'React', disabled: false },
  { key: 5, label: 'Node.js', disabled: false }
])
</script>
```

### 自定义按钮文案

自定义穿梭按钮的文案：

```vue
<template>
  <div>
    <h4>自定义按钮文案</h4>
    <el-transfer
      v-model="value4"
      :data="data4"
      :button-texts="['移除', '添加']"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value4 = ref([])

const data4 = ref([
  { key: 1, label: '商品 A', disabled: false },
  { key: 2, label: '商品 B', disabled: false },
  { key: 3, label: '商品 C', disabled: false },
  { key: 4, label: '商品 D', disabled: false }
])
</script>
```

## 高级功能

### 自定义数据项

使用插槽自定义数据项的渲染：

```vue
<template>
  <div>
    <h4>自定义数据项</h4>
    <el-transfer
      v-model="value5"
      :data="data5"
      :titles="['用户列表', '已选用户']"
    >
      <template #default="{ option }">
        <div class="custom-item">
          <img :src="option.avatar" class="avatar" />
          <div class="user-info">
            <div class="name">{{ option.label }}</div>
            <div class="role">{{ option.role }}</div>
          </div>
        </div>
      </template>
    </el-transfer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value5 = ref([1, 3])

const data5 = ref([
  {
    key: 1,
    label: '张三',
    role: '前端开发',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    disabled: false
  },
  {
    key: 2,
    label: '李四',
    role: '后端开发',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    disabled: false
  },
  {
    key: 3,
    label: '王五',
    role: 'UI设计师',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    disabled: false
  },
  {
    key: 4,
    label: '赵六',
    role: '产品经理',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    disabled: false
  }
])
</script>

<style scoped>
.custom-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.role {
  font-size: 12px;
  color: #909399;
}
</style>
```

### 自定义列表底部

使用插槽自定义列表底部内容：

```vue
<template>
  <div>
    <h4>自定义列表底部</h4>
    <el-transfer
      v-model="value6"
      :data="data6"
      :titles="['待办事项', '已完成']"
    >
      <template #left-footer>
        <el-button class="transfer-footer" size="small">
          全部添加
        </el-button>
      </template>
      <template #right-footer>
        <el-button class="transfer-footer" size="small">
          清空列表
        </el-button>
      </template>
    </el-transfer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value6 = ref([2])

const data6 = ref([
  { key: 1, label: '完成项目文档', disabled: false },
  { key: 2, label: '代码审查', disabled: false },
  { key: 3, label: '单元测试', disabled: false },
  { key: 4, label: '部署上线', disabled: false }
])
</script>

<style scoped>
.transfer-footer {
  margin-left: 20px;
  padding: 6px 15px;
}
</style>
```

### 数据项属性别名

自定义数据项的属性名：

```vue
<template>
  <div>
    <h4>数据项属性别名</h4>
    <el-transfer
      v-model="value7"
      :data="data7"
      :props="{
        key: 'id',
        label: 'name',
        disabled: 'isDisabled'
      }"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value7 = ref([1, 3])

const data7 = ref([
  { id: 1, name: '苹果', isDisabled: false },
  { id: 2, name: '香蕉', isDisabled: false },
  { id: 3, name: '橙子', isDisabled: false },
  { id: 4, name: '葡萄', isDisabled: true },
  { id: 5, name: '西瓜', isDisabled: false }
])
</script>
```

## 实际应用示例

### 权限管理系统

创建一个权限分配组件：

```vue
<template>
  <div class="permission-manager">
    <h3>权限管理系统</h3>
    
    <div class="user-selector">
      <h4>选择用户</h4>
      <el-select v-model="selectedUser" placeholder="请选择用户" @change="loadUserPermissions">
        <el-option
          v-for="user in users"
          :key="user.id"
          :label="user.name"
          :value="user.id"
        />
      </el-select>
    </div>
    
    <div v-if="selectedUser" class="permission-transfer">
      <h4>权限分配</h4>
      <el-transfer
        v-model="userPermissions"
        :data="allPermissions"
        :titles="['可用权限', '已分配权限']"
        :button-texts="['移除权限', '分配权限']"
        filterable
        :filter-method="filterPermissions"
        filter-placeholder="搜索权限"
        @change="handlePermissionChange"
      >
        <template #default="{ option }">
          <div class="permission-item">
            <i :class="option.icon" class="permission-icon"></i>
            <div class="permission-info">
              <div class="permission-name">{{ option.label }}</div>
              <div class="permission-desc">{{ option.description }}</div>
            </div>
            <el-tag
              :type="option.level === 'high' ? 'danger' : option.level === 'medium' ? 'warning' : 'info'"
              size="small"
            >
              {{ option.levelText }}
            </el-tag>
          </div>
        </template>
        
        <template #left-footer>
          <div class="transfer-footer">
            <el-button size="small" @click="selectAllPermissions">全选</el-button>
            <el-button size="small" @click="selectByLevel('high')">选择高级权限</el-button>
          </div>
        </template>
        
        <template #right-footer>
          <div class="transfer-footer">
            <el-button size="small" @click="clearPermissions">清空</el-button>
            <el-button size="small" type="primary" @click="savePermissions">保存</el-button>
          </div>
        </template>
      </el-transfer>
    </div>
    
    <div v-if="selectedUser" class="permission-summary">
      <h4>权限摘要</h4>
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-label">总权限数：</span>
          <span class="stat-value">{{ userPermissions.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">高级权限：</span>
          <span class="stat-value">{{ getPermissionCountByLevel('high') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">中级权限：</span>
          <span class="stat-value">{{ getPermissionCountByLevel('medium') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">基础权限：</span>
          <span class="stat-value">{{ getPermissionCountByLevel('low') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const selectedUser = ref('')
const userPermissions = ref([])

const users = ref([
  { id: 1, name: '张三 - 管理员' },
  { id: 2, name: '李四 - 编辑者' },
  { id: 3, name: '王五 - 查看者' }
])

const allPermissions = ref([
  {
    key: 1,
    label: '用户管理',
    description: '创建、编辑、删除用户',
    icon: 'el-icon-user',
    level: 'high',
    levelText: '高级',
    disabled: false
  },
  {
    key: 2,
    label: '角色管理',
    description: '管理用户角色和权限',
    icon: 'el-icon-s-custom',
    level: 'high',
    levelText: '高级',
    disabled: false
  },
  {
    key: 3,
    label: '内容管理',
    description: '创建、编辑、发布内容',
    icon: 'el-icon-document',
    level: 'medium',
    levelText: '中级',
    disabled: false
  },
  {
    key: 4,
    label: '数据分析',
    description: '查看和分析数据报表',
    icon: 'el-icon-data-analysis',
    level: 'medium',
    levelText: '中级',
    disabled: false
  },
  {
    key: 5,
    label: '系统设置',
    description: '修改系统配置',
    icon: 'el-icon-setting',
    level: 'high',
    levelText: '高级',
    disabled: false
  },
  {
    key: 6,
    label: '查看内容',
    description: '浏览和查看内容',
    icon: 'el-icon-view',
    level: 'low',
    levelText: '基础',
    disabled: false
  },
  {
    key: 7,
    label: '个人资料',
    description: '编辑个人信息',
    icon: 'el-icon-user-solid',
    level: 'low',
    levelText: '基础',
    disabled: false
  },
  {
    key: 8,
    label: '消息通知',
    description: '接收和管理通知',
    icon: 'el-icon-bell',
    level: 'low',
    levelText: '基础',
    disabled: false
  }
])

const loadUserPermissions = (userId) => {
  // 模拟加载用户权限
  const userPermissionMap = {
    1: [1, 2, 3, 4, 5, 6, 7, 8], // 管理员拥有所有权限
    2: [3, 4, 6, 7, 8], // 编辑者拥有部分权限
    3: [6, 7, 8] // 查看者只有基础权限
  }
  
  userPermissions.value = userPermissionMap[userId] || []
  ElMessage.success('用户权限加载完成')
}

const filterPermissions = (query, item) => {
  return item.label.toLowerCase().includes(query.toLowerCase()) ||
         item.description.toLowerCase().includes(query.toLowerCase())
}

const handlePermissionChange = (value, direction, movedKeys) => {
  console.log('权限变更:', { value, direction, movedKeys })
  ElMessage.info(`${direction === 'right' ? '分配' : '移除'}了 ${movedKeys.length} 个权限`)
}

const selectAllPermissions = () => {
  userPermissions.value = allPermissions.value.map(p => p.key)
  ElMessage.success('已选择所有权限')
}

const selectByLevel = (level) => {
  const levelPermissions = allPermissions.value
    .filter(p => p.level === level)
    .map(p => p.key)
  
  userPermissions.value = [...new Set([...userPermissions.value, ...levelPermissions])]
  ElMessage.success(`已选择所有${level === 'high' ? '高级' : level === 'medium' ? '中级' : '基础'}权限`)
}

const clearPermissions = () => {
  userPermissions.value = []
  ElMessage.warning('已清空所有权限')
}

const savePermissions = () => {
  // 模拟保存权限
  ElMessage.success('权限保存成功')
}

const getPermissionCountByLevel = (level) => {
  return userPermissions.value.filter(permId => {
    const perm = allPermissions.value.find(p => p.key === permId)
    return perm && perm.level === level
  }).length
}
</script>

<style scoped>
.permission-manager {
  max-width: 1000px;
  padding: 20px;
}

.user-selector {
  margin-bottom: 24px;
}

.user-selector h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.permission-transfer {
  margin-bottom: 24px;
}

.permission-transfer h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  width: 100%;
}

.permission-icon {
  font-size: 18px;
  color: #409EFF;
  width: 20px;
  text-align: center;
}

.permission-info {
  flex: 1;
  min-width: 0;
}

.permission-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.permission-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.transfer-footer {
  padding: 12px 20px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #e4e7ed;
}

.permission-summary {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 6px;
}

.permission-summary h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.stat-label {
  color: #606266;
  font-size: 14px;
}

.stat-value {
  font-weight: 500;
  color: #409EFF;
  font-size: 16px;
}
</style>
```

### 商品分类管理

创建一个商品分类管理组件：

```vue
<template>
  <div class="category-manager">
    <h3>商品分类管理</h3>
    
    <div class="category-controls">
      <div class="control-group">
        <label>选择店铺：</label>
        <el-select v-model="selectedStore" placeholder="请选择店铺" @change="loadCategories">
          <el-option
            v-for="store in stores"
            :key="store.id"
            :label="store.name"
            :value="store.id"
          />
        </el-select>
      </div>
      
      <div class="control-group">
        <label>分类类型：</label>
        <el-radio-group v-model="categoryType" @change="filterCategories">
          <el-radio label="all">全部</el-radio>
          <el-radio label="hot">热门</el-radio>
          <el-radio label="new">新品</el-radio>
          <el-radio label="sale">促销</el-radio>
        </el-radio-group>
      </div>
    </div>
    
    <div v-if="selectedStore" class="category-transfer">
      <el-transfer
        v-model="selectedCategories"
        :data="filteredCategories"
        :titles="['可选分类', '已选分类']"
        :button-texts="['移除', '添加']"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="搜索分类"
        @change="handleCategoryChange"
      >
        <template #default="{ option }">
          <div class="category-item">
            <img :src="option.image" class="category-image" />
            <div class="category-info">
              <div class="category-name">{{ option.label }}</div>
              <div class="category-details">
                <span class="product-count">{{ option.productCount }} 个商品</span>
                <el-tag
                  v-if="option.isHot"
                  type="danger"
                  size="small"
                  class="category-tag"
                >
                  热门
                </el-tag>
                <el-tag
                  v-if="option.isNew"
                  type="success"
                  size="small"
                  class="category-tag"
                >
                  新品
                </el-tag>
                <el-tag
                  v-if="option.onSale"
                  type="warning"
                  size="small"
                  class="category-tag"
                >
                  促销
                </el-tag>
              </div>
            </div>
          </div>
        </template>
        
        <template #left-footer>
          <div class="transfer-footer">
            <el-button size="small" @click="selectHotCategories">选择热门</el-button>
            <el-button size="small" @click="selectNewCategories">选择新品</el-button>
          </div>
        </template>
        
        <template #right-footer>
          <div class="transfer-footer">
            <span class="selected-count">已选 {{ selectedCategories.length }} 个分类</span>
            <el-button size="small" type="primary" @click="saveCategories">保存</el-button>
          </div>
        </template>
      </el-transfer>
    </div>
    
    <div v-if="selectedCategories.length > 0" class="category-preview">
      <h4>分类预览</h4>
      <div class="preview-grid">
        <div
          v-for="categoryId in selectedCategories"
          :key="categoryId"
          class="preview-item"
        >
          <img :src="getCategoryById(categoryId)?.image" class="preview-image" />
          <div class="preview-name">{{ getCategoryById(categoryId)?.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const selectedStore = ref('')
const categoryType = ref('all')
const selectedCategories = ref([])

const stores = ref([
  { id: 1, name: '旗舰店' },
  { id: 2, name: '专卖店' },
  { id: 3, name: '折扣店' }
])

const allCategories = ref([
  {
    key: 1,
    label: '手机数码',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    productCount: 156,
    isHot: true,
    isNew: false,
    onSale: true,
    disabled: false
  },
  {
    key: 2,
    label: '服装鞋帽',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    productCount: 289,
    isHot: true,
    isNew: true,
    onSale: false,
    disabled: false
  },
  {
    key: 3,
    label: '家居用品',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    productCount: 78,
    isHot: false,
    isNew: true,
    onSale: true,
    disabled: false
  },
  {
    key: 4,
    label: '美妆护肤',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    productCount: 234,
    isHot: true,
    isNew: false,
    onSale: false,
    disabled: false
  },
  {
    key: 5,
    label: '食品饮料',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    productCount: 167,
    isHot: false,
    isNew: true,
    onSale: true,
    disabled: false
  },
  {
    key: 6,
    label: '运动户外',
    image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    productCount: 92,
    isHot: false,
    isNew: false,
    onSale: false,
    disabled: false
  }
])

const filteredCategories = computed(() => {
  if (categoryType.value === 'all') {
    return allCategories.value
  }
  
  return allCategories.value.filter(category => {
    switch (categoryType.value) {
      case 'hot':
        return category.isHot
      case 'new':
        return category.isNew
      case 'sale':
        return category.onSale
      default:
        return true
    }
  })
})

const loadCategories = (storeId) => {
  // 模拟加载店铺分类
  const storeCategories = {
    1: [1, 2, 4], // 旗舰店
    2: [2, 3, 5], // 专卖店
    3: [1, 3, 6]  // 折扣店
  }
  
  selectedCategories.value = storeCategories[storeId] || []
  ElMessage.success('店铺分类加载完成')
}

const filterCategories = () => {
  // 过滤逻辑已在 computed 中处理
}

const filterMethod = (query, item) => {
  return item.label.toLowerCase().includes(query.toLowerCase())
}

const handleCategoryChange = (value, direction, movedKeys) => {
  console.log('分类变更:', { value, direction, movedKeys })
  ElMessage.info(`${direction === 'right' ? '添加' : '移除'}了 ${movedKeys.length} 个分类`)
}

const selectHotCategories = () => {
  const hotCategories = allCategories.value
    .filter(c => c.isHot)
    .map(c => c.key)
  
  selectedCategories.value = [...new Set([...selectedCategories.value, ...hotCategories])]
  ElMessage.success('已选择所有热门分类')
}

const selectNewCategories = () => {
  const newCategories = allCategories.value
    .filter(c => c.isNew)
    .map(c => c.key)
  
  selectedCategories.value = [...new Set([...selectedCategories.value, ...newCategories])]
  ElMessage.success('已选择所有新品分类')
}

const saveCategories = () => {
  ElMessage.success('分类配置保存成功')
}

const getCategoryById = (id) => {
  return allCategories.value.find(c => c.key === id)
}
</script>

<style scoped>
.category-manager {
  max-width: 1000px;
  padding: 20px;
}

.category-controls {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 6px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-group label {
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
}

.category-transfer {
  margin-bottom: 24px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  width: 100%;
}

.category-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.category-details {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.product-count {
  font-size: 12px;
  color: #909399;
}

.category-tag {
  margin-left: 4px;
}

.transfer-footer {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e4e7ed;
}

.selected-count {
  font-size: 12px;
  color: #909399;
}

.category-preview {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 6px;
}

.category-preview h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.preview-item {
  text-align: center;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.preview-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.preview-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  margin-bottom: 8px;
}

.preview-name {
  font-size: 12px;
  color: #606266;
  line-height: 1.4;
}
</style>
```

## API 文档

### Transfer Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | array | — |
| data | Transfer 的数据源 | array | [] |
| filterable | 是否可搜索 | boolean | false |
| filter-placeholder | 搜索框占位符 | string | 请输入搜索内容 |
| filter-method | 自定义搜索方法 | function | — |
| target-order | 右侧列表元素的排序策略 | enum | original |
| titles | 自定义列表标题 | array | ['列表 1', '列表 2'] |
| button-texts | 自定义按钮文案 | array | [] |
| render-content | 自定义数据项渲染函数 | function | — |
| format | 列表顶部勾选状态文案 | object | {} |
| props | 数据源的字段别名 | object | {} |
| left-default-checked | 初始状态下左侧列表的已勾选项的 key 数组 | array | [] |
| right-default-checked | 初始状态下右侧列表的已勾选项的 key 数组 | array | [] |
| validate-event | 是否触发表单验证 | boolean | true |

### Transfer Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 右侧列表元素变化时触发 | Function |
| left-check-change | 左侧列表元素被用户选中 / 取消选中时触发 | Function |
| right-check-change | 右侧列表元素被用户选中 / 取消选中时触发 | Function |

### Transfer Methods

| 名称 | 说明 | 类型 |
|------|------|------|
| clearQuery | 清空某个面板的搜索关键词 | Function |

### Transfer Slots

| 名称 | 说明 |
|------|------|
| default | 自定义数据项的内容 |
| left-footer | 左侧列表底部的内容 |
| right-footer | 右侧列表底部的内容 |

## 实践练习

### 练习1：多语言配置器

创建一个多语言配置管理系统：

```vue
<template>
  <div class="language-configurator">
    <h3>多语言配置器</h3>
    
    <div class="language-selector">
      <el-select v-model="currentLanguage" placeholder="选择语言">
        <el-option
          v-for="lang in languages"
          :key="lang.code"
          :label="lang.name"
          :value="lang.code"
        />
      </el-select>
    </div>
    
    <el-transfer
      v-model="selectedKeys"
      :data="translationKeys"
      :titles="['可用翻译键', '已配置翻译']"
      filterable
      :filter-method="filterKeys"
    >
      <template #default="{ option }">
        <div class="key-item">
          <div class="key-name">{{ option.label }}</div>
          <div class="key-path">{{ option.path }}</div>
        </div>
      </template>
    </el-transfer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentLanguage = ref('zh-CN')
const selectedKeys = ref([1, 3, 5])

const languages = ref([
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en-US', name: 'English' },
  { code: 'ja-JP', name: '日本語' }
])

const translationKeys = ref([
  { key: 1, label: '登录', path: 'auth.login', disabled: false },
  { key: 2, label: '注册', path: 'auth.register', disabled: false },
  { key: 3, label: '首页', path: 'nav.home', disabled: false },
  { key: 4, label: '设置', path: 'nav.settings', disabled: false },
  { key: 5, label: '保存', path: 'action.save', disabled: false }
])

const filterKeys = (query, item) => {
  return item.label.includes(query) || item.path.includes(query)
}
</script>

<style scoped>
.language-configurator {
  max-width: 800px;
  padding: 20px;
}

.language-selector {
  margin-bottom: 20px;
}

.key-item {
  width: 100%;
}

.key-name {
  font-weight: 500;
  color: #303133;
}

.key-path {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
</style>
```

### 练习2：API 接口管理

创建一个 API 接口权限管理组件：

```vue
<template>
  <div class="api-manager">
    <h3>API 接口管理</h3>
    
    <div class="api-controls">
      <el-select v-model="selectedModule" placeholder="选择模块">
        <el-option
          v-for="module in modules"
          :key="module.id"
          :label="module.name"
          :value="module.id"
        />
      </el-select>
      
      <el-select v-model="selectedMethod" placeholder="请求方法">
        <el-option label="全部" value="" />
        <el-option label="GET" value="GET" />
        <el-option label="POST" value="POST" />
        <el-option label="PUT" value="PUT" />
        <el-option label="DELETE" value="DELETE" />
      </el-select>
    </div>
    
    <el-transfer
      v-model="selectedApis"
      :data="filteredApis"
      :titles="['可用接口', '已授权接口']"
      filterable
    >
      <template #default="{ option }">
        <div class="api-item">
          <el-tag
            :type="getMethodType(option.method)"
            size="small"
            class="method-tag"
          >
            {{ option.method }}
          </el-tag>
          <div class="api-info">
            <div class="api-path">{{ option.label }}</div>
            <div class="api-desc">{{ option.description }}</div>
          </div>
        </div>
      </template>
    </el-transfer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedModule = ref('')
const selectedMethod = ref('')
const selectedApis = ref([1, 3])

const modules = ref([
  { id: 1, name: '用户模块' },
  { id: 2, name: '订单模块' },
  { id: 3, name: '商品模块' }
])

const allApis = ref([
  {
    key: 1,
    label: '/api/users',
    method: 'GET',
    description: '获取用户列表',
    module: 1,
    disabled: false
  },
  {
    key: 2,
    label: '/api/users',
    method: 'POST',
    description: '创建用户',
    module: 1,
    disabled: false
  },
  {
    key: 3,
    label: '/api/orders',
    method: 'GET',
    description: '获取订单列表',
    module: 2,
    disabled: false
  },
  {
    key: 4,
    label: '/api/products',
    method: 'GET',
    description: '获取商品列表',
    module: 3,
    disabled: false
  }
])

const filteredApis = computed(() => {
  return allApis.value.filter(api => {
    const moduleMatch = !selectedModule.value || api.module === selectedModule.value
    const methodMatch = !selectedMethod.value || api.method === selectedMethod.value
    return moduleMatch && methodMatch
  })
})

const getMethodType = (method) => {
  const types = {
    GET: 'info',
    POST: 'success',
    PUT: 'warning',
    DELETE: 'danger'
  }
  return types[method] || 'info'
}
</script>

<style scoped>
.api-manager {
  max-width: 800px;
  padding: 20px;
}

.api-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.method-tag {
  min-width: 60px;
  text-align: center;
}

.api-info {
  flex: 1;
}

.api-path {
  font-weight: 500;
  color: #303133;
  font-family: monospace;
}

.api-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
</style>
```

## 常见问题

### 1. 数据格式问题

**问题**：Transfer 组件要求特定的数据格式

**解决方案**：
```javascript
// 标准数据格式
const data = [
  {
    key: 1,        // 必需，唯一标识
    label: '选项1', // 必需，显示文本
    disabled: false // 可选，是否禁用
  }
]

// 自定义字段名
const customData = [
  { id: 1, name: '选项1', isDisabled: false }
]

// 使用 props 配置
const props = {
  key: 'id',
  label: 'name',
  disabled: 'isDisabled'
}
```

### 2. 性能优化

**问题**：大量数据时性能问题

**解决方案**：
```javascript
// 虚拟滚动（需要自定义实现）
const virtualScrollConfig = {
  itemHeight: 40,
  visibleCount: 10,
  bufferCount: 5
}

// 分页加载
const loadData = async (page = 1, size = 100) => {
  const response = await api.getData({ page, size })
  return response.data
}

// 防抖搜索
const debounceSearch = debounce((query) => {
  // 搜索逻辑
}, 300)
```

### 3. 自定义样式

**问题**：需要自定义 Transfer 的样式

**解决方案**：
```css
/* 自定义 Transfer 样式 */
.el-transfer {
  --el-transfer-border-color: #dcdfe6;
  --el-transfer-border-radius: 8px;
}

.el-transfer-panel {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-transfer-panel__header {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.el-transfer-panel__item {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
}

.el-transfer-panel__item:hover {
  background-color: #f5f7fa;
}
```

## 最佳实践

1. **数据结构规范**：确保数据格式符合组件要求
2. **性能考虑**：大量数据时考虑分页或虚拟滚动
3. **用户体验**：提供搜索、分类等功能提升易用性
4. **状态管理**：合理管理选中状态和数据变更
5. **错误处理**：处理数据加载失败等异常情况
6. **无障碍支持**：确保键盘导航和屏幕阅读器支持

## 总结

Transfer 穿梭框是一个功能强大的数据选择组件，支持：

- 双栏数据选择和移动
- 搜索和过滤功能
- 自定义渲染和样式
- 批量操作和状态管理
- 丰富的事件和方法

掌握 Transfer 组件的使用，能够为用户提供高效、直观的数据选择体验，广泛应用于权限管理、分类配置、数据筛选等场景。

## 参考资料

- [Element Plus Transfer 官方文档](https://element-plus.org/zh-CN/component/transfer.html)
- [Vue 3 组件开发指南](https://vuejs.org/guide/components/)
- [JavaScript 数组操作方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [CSS 自定义属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/--*)