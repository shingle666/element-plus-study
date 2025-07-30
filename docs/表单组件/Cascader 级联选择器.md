# Cascader 级联选择器

## 概述

Cascader 级联选择器是一个用于选择具有层级关系数据的组件。它可以展示多级分类的数据结构，用户可以逐级选择，常用于地区选择、分类选择等场景。

## 学习目标

- 掌握 Cascader 的基本概念和使用场景
- 学会基础级联选择器的使用方法
- 了解单选和多选模式的区别
- 掌握数据结构的配置方法
- 学会使用可搜索和懒加载功能
- 了解自定义节点内容和触发方式
- 掌握 API 的完整使用方法

## 基础用法

### 基本级联选择器

最简单的级联选择器用法：

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      placeholder="请选择"
      @change="handleChange"
    />
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: '指南',
    children: [
      {
        value: 'disciplines',
        label: '设计原则',
        children: [
          {
            value: 'consistency',
            label: '一致'
          },
          {
            value: 'feedback',
            label: '反馈'
          },
          {
            value: 'efficiency',
            label: '效率'
          },
          {
            value: 'controllability',
            label: '可控'
          }
        ]
      },
      {
        value: 'navigation',
        label: '导航',
        children: [
          {
            value: 'side-nav',
            label: '侧向导航'
          },
          {
            value: 'top-nav',
            label: '顶部导航'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: '组件',
    children: [
      {
        value: 'basic',
        label: '基础组件',
        children: [
          {
            value: 'layout',
            label: 'Layout 布局'
          },
          {
            value: 'color',
            label: 'Color 色彩'
          },
          {
            value: 'typography',
            label: 'Typography 字体'
          },
          {
            value: 'icon',
            label: 'Icon 图标'
          },
          {
            value: 'button',
            label: 'Button 按钮'
          }
        ]
      },
      {
        value: 'form',
        label: '表单组件',
        children: [
          {
            value: 'radio',
            label: 'Radio 单选框'
          },
          {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          },
          {
            value: 'input',
            label: 'Input 输入框'
          },
          {
            value: 'input-number',
            label: 'InputNumber 计数器'
          },
          {
            value: 'select',
            label: 'Select 选择器'
          },
          {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }
        ]
      }
    ]
  }
]

const handleChange = (value) => {
  console.log('选中的值：', value)
}
</script>
```

### 禁用状态

通过 `disabled` 属性来禁用级联选择器或特定选项：

```vue
<template>
  <div>
    <h4>禁用级联选择器</h4>
    <el-cascader
      v-model="value1"
      :options="options"
      disabled
      placeholder="请选择"
    />
    
    <h4>禁用特定选项</h4>
    <el-cascader
      v-model="value2"
      :options="optionsWithDisabled"
      placeholder="请选择"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref([])
const value2 = ref([])

const options = [
  {
    value: 'beijing',
    label: '北京',
    children: [
      {
        value: 'chaoyang',
        label: '朝阳区'
      },
      {
        value: 'haidian',
        label: '海淀区'
      }
    ]
  }
]

const optionsWithDisabled = [
  {
    value: 'beijing',
    label: '北京',
    children: [
      {
        value: 'chaoyang',
        label: '朝阳区'
      },
      {
        value: 'haidian',
        label: '海淀区',
        disabled: true
      }
    ]
  },
  {
    value: 'shanghai',
    label: '上海',
    disabled: true,
    children: [
      {
        value: 'huangpu',
        label: '黄浦区'
      }
    ]
  }
]
</script>
```

### 可清空

通过 `clearable` 属性来启用清空功能：

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      clearable
      placeholder="请选择"
    />
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(['guide', 'disciplines', 'consistency'])
const options = [
  {
    value: 'guide',
    label: '指南',
    children: [
      {
        value: 'disciplines',
        label: '设计原则',
        children: [
          {
            value: 'consistency',
            label: '一致'
          },
          {
            value: 'feedback',
            label: '反馈'
          }
        ]
      }
    ]
  }
]
</script>
```

## 仅显示最后一级

通过 `show-all-levels` 属性控制是否显示完整路径：

```vue
<template>
  <div>
    <h4>显示完整路径（默认）</h4>
    <el-cascader
      v-model="value1"
      :options="options"
      placeholder="请选择"
    />
    
    <h4>仅显示最后一级</h4>
    <el-cascader
      v-model="value2"
      :options="options"
      :show-all-levels="false"
      placeholder="请选择"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(['guide', 'disciplines', 'consistency'])
const value2 = ref(['guide', 'disciplines', 'feedback'])

const options = [
  {
    value: 'guide',
    label: '指南',
    children: [
      {
        value: 'disciplines',
        label: '设计原则',
        children: [
          {
            value: 'consistency',
            label: '一致'
          },
          {
            value: 'feedback',
            label: '反馈'
          }
        ]
      }
    ]
  }
]
</script>
```

## 多选模式

通过 `props.multiple` 启用多选模式：

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      :props="{ multiple: true }"
      placeholder="请选择"
      clearable
    />
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: '指南',
    children: [
      {
        value: 'disciplines',
        label: '设计原则',
        children: [
          {
            value: 'consistency',
            label: '一致'
          },
          {
            value: 'feedback',
            label: '反馈'
          },
          {
            value: 'efficiency',
            label: '效率'
          }
        ]
      },
      {
        value: 'navigation',
        label: '导航',
        children: [
          {
            value: 'side-nav',
            label: '侧向导航'
          },
          {
            value: 'top-nav',
            label: '顶部导航'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: '组件',
    children: [
      {
        value: 'basic',
        label: '基础组件',
        children: [
          {
            value: 'button',
            label: 'Button 按钮'
          },
          {
            value: 'icon',
            label: 'Icon 图标'
          }
        ]
      }
    ]
  }
]
</script>
```

## 选择任意一级选项

通过 `props.checkStrictly` 允许选择任意一级的选项：

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      :props="{ checkStrictly: true }"
      placeholder="请选择"
      clearable
    />
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: '指南',
    children: [
      {
        value: 'disciplines',
        label: '设计原则',
        children: [
          {
            value: 'consistency',
            label: '一致'
          },
          {
            value: 'feedback',
            label: '反馈'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: '组件',
    children: [
      {
        value: 'basic',
        label: '基础组件',
        children: [
          {
            value: 'button',
            label: 'Button 按钮'
          }
        ]
      }
    ]
  }
]
</script>
```

## 动态加载

通过 `props.lazy` 和 `props.lazyLoad` 实现动态加载：

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :props="props"
      placeholder="请选择"
    />
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])

let id = 0

const props = {
  lazy: true,
  lazyLoad(node, resolve) {
    const { level } = node
    setTimeout(() => {
      const nodes = Array.from({ length: level + 1 })
        .map(() => ({
          value: ++id,
          label: `选项${id}`,
          leaf: level >= 2
        }))
      resolve(nodes)
    }, 1000)
  }
}
</script>
```

## 可搜索

通过 `filterable` 属性启用搜索功能：

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      filterable
      placeholder="请选择或搜索"
    />
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'beijing',
    label: '北京',
    children: [
      {
        value: 'chaoyang',
        label: '朝阳区',
        children: [
          {
            value: 'datunlu',
            label: '大屯路'
          },
          {
            value: 'sanlitun',
            label: '三里屯'
          }
        ]
      },
      {
        value: 'haidian',
        label: '海淀区',
        children: [
          {
            value: 'zhongguancun',
            label: '中关村'
          },
          {
            value: 'wudaokou',
            label: '五道口'
          }
        ]
      }
    ]
  },
  {
    value: 'shanghai',
    label: '上海',
    children: [
      {
        value: 'huangpu',
        label: '黄浦区',
        children: [
          {
            value: 'nanjinglu',
            label: '南京路'
          },
          {
            value: 'waitan',
            label: '外滩'
          }
        ]
      },
      {
        value: 'pudong',
        label: '浦东新区',
        children: [
          {
            value: 'lujiazui',
            label: '陆家嘴'
          },
          {
            value: 'zhangjiang',
            label: '张江'
          }
        ]
      }
    ]
  }
]
</script>
```

## 自定义节点内容

使用作用域插槽自定义节点内容：

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      placeholder="请选择"
    >
      <template #default="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: '指南',
    children: [
      {
        value: 'disciplines',
        label: '设计原则',
        children: [
          {
            value: 'consistency',
            label: '一致'
          },
          {
            value: 'feedback',
            label: '反馈'
          }
        ]
      },
      {
        value: 'navigation',
        label: '导航',
        children: [
          {
            value: 'side-nav',
            label: '侧向导航'
          },
          {
            value: 'top-nav',
            label: '顶部导航'
          }
        ]
      }
    ]
  }
]
</script>
```

## 级联面板

使用 `el-cascader-panel` 组件直接展示级联面板：

```vue
<template>
  <div>
    <el-cascader-panel
      v-model="value"
      :options="options"
      @change="handleChange"
    />
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: '指南',
    children: [
      {
        value: 'disciplines',
        label: '设计原则',
        children: [
          {
            value: 'consistency',
            label: '一致'
          },
          {
            value: 'feedback',
            label: '反馈'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: '组件',
    children: [
      {
        value: 'basic',
        label: '基础组件',
        children: [
          {
            value: 'button',
            label: 'Button 按钮'
          }
        ]
      }
    ]
  }
]

const handleChange = (value) => {
  console.log('选中的值：', value)
}
</script>
```

## 尺寸

使用 `size` 属性来设置级联选择器的尺寸：

```vue
<template>
  <div>
    <h4>大尺寸</h4>
    <el-cascader
      v-model="value1"
      :options="options"
      size="large"
      placeholder="请选择"
    />
    
    <h4>默认尺寸</h4>
    <el-cascader
      v-model="value2"
      :options="options"
      placeholder="请选择"
    />
    
    <h4>小尺寸</h4>
    <el-cascader
      v-model="value3"
      :options="options"
      size="small"
      placeholder="请选择"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref([])
const value2 = ref([])
const value3 = ref([])

const options = [
  {
    value: 'guide',
    label: '指南',
    children: [
      {
        value: 'disciplines',
        label: '设计原则',
        children: [
          {
            value: 'consistency',
            label: '一致'
          }
        ]
      }
    ]
  }
]
</script>
```

## 实际应用示例

### 地区选择器

```vue
<template>
  <div class="region-selector">
    <h3>地区选择器</h3>
    
    <div class="selector-group">
      <div class="selector-item">
        <label>选择地区：</label>
        <el-cascader
          v-model="selectedRegion"
          :options="regionOptions"
          :props="regionProps"
          placeholder="请选择省/市/区"
          filterable
          clearable
          @change="handleRegionChange"
        />
      </div>
      
      <div class="selector-item">
        <label>多选地区：</label>
        <el-cascader
          v-model="selectedMultipleRegions"
          :options="regionOptions"
          :props="multipleRegionProps"
          placeholder="请选择多个地区"
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
        />
      </div>
      
      <div class="selector-item">
        <label>任意级别：</label>
        <el-cascader
          v-model="selectedAnyLevel"
          :options="regionOptions"
          :props="anyLevelProps"
          placeholder="可选择任意级别"
          clearable
        />
      </div>
    </div>
    
    <div class="selection-result">
      <h4>选择结果</h4>
      <p>单选地区：{{ getRegionName(selectedRegion) }}</p>
      <p>多选地区：{{ getMultipleRegionNames(selectedMultipleRegions) }}</p>
      <p>任意级别：{{ getRegionName(selectedAnyLevel) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const selectedRegion = ref([])
const selectedMultipleRegions = ref([])
const selectedAnyLevel = ref([])

const regionOptions = [
  {
    value: 'beijing',
    label: '北京市',
    children: [
      {
        value: 'chaoyang',
        label: '朝阳区',
        children: [
          { value: 'sanlitun', label: '三里屯街道' },
          { value: 'datunlu', label: '大屯路街道' },
          { value: 'wangjing', label: '望京街道' }
        ]
      },
      {
        value: 'haidian',
        label: '海淀区',
        children: [
          { value: 'zhongguancun', label: '中关村街道' },
          { value: 'wudaokou', label: '五道口街道' },
          { value: 'shangdi', label: '上地街道' }
        ]
      },
      {
        value: 'xicheng',
        label: '西城区',
        children: [
          { value: 'xinjiekou', label: '新街口街道' },
          { value: 'deshengmen', label: '德胜门街道' }
        ]
      }
    ]
  },
  {
    value: 'shanghai',
    label: '上海市',
    children: [
      {
        value: 'huangpu',
        label: '黄浦区',
        children: [
          { value: 'nanjinglu', label: '南京东路街道' },
          { value: 'waitan', label: '外滩街道' },
          { value: 'yuyuan', label: '豫园街道' }
        ]
      },
      {
        value: 'pudong',
        label: '浦东新区',
        children: [
          { value: 'lujiazui', label: '陆家嘴街道' },
          { value: 'zhangjiang', label: '张江镇' },
          { value: 'jinqiao', label: '金桥镇' }
        ]
      }
    ]
  },
  {
    value: 'guangdong',
    label: '广东省',
    children: [
      {
        value: 'guangzhou',
        label: '广州市',
        children: [
          { value: 'tianhe', label: '天河区' },
          { value: 'yuexiu', label: '越秀区' },
          { value: 'haizhu', label: '海珠区' }
        ]
      },
      {
        value: 'shenzhen',
        label: '深圳市',
        children: [
          { value: 'futian', label: '福田区' },
          { value: 'nanshan', label: '南山区' },
          { value: 'luohu', label: '罗湖区' }
        ]
      }
    ]
  }
]

const regionProps = {
  expandTrigger: 'hover'
}

const multipleRegionProps = {
  multiple: true,
  expandTrigger: 'hover'
}

const anyLevelProps = {
  checkStrictly: true,
  expandTrigger: 'hover'
}

const handleRegionChange = (value) => {
  ElMessage.success(`选择了地区：${getRegionName(value)}`)
}

const getRegionName = (value) => {
  if (!value || !value.length) return '未选择'
  
  const findLabel = (options, path, index = 0) => {
    if (index >= path.length) return ''
    
    const option = options.find(opt => opt.value === path[index])
    if (!option) return ''
    
    if (index === path.length - 1) {
      return option.label
    }
    
    const childLabel = findLabel(option.children || [], path, index + 1)
    return childLabel ? `${option.label} / ${childLabel}` : option.label
  }
  
  return findLabel(regionOptions, value)
}

const getMultipleRegionNames = (values) => {
  if (!values || !values.length) return '未选择'
  return values.map(value => getRegionName(value)).join('; ')
}
</script>

<style scoped>
.region-selector {
  max-width: 800px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.selector-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selector-item label {
  width: 100px;
  font-weight: 500;
}

.selector-item .el-cascader {
  flex: 1;
  max-width: 400px;
}

.selection-result {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.selection-result h4 {
  margin-bottom: 12px;
  color: #303133;
}

.selection-result p {
  margin: 4px 0;
  color: #606266;
}
</style>
```

### 分类选择器

```vue
<template>
  <div class="category-selector">
    <h3>商品分类选择器</h3>
    
    <div class="selector-container">
      <div class="selector-section">
        <h4>选择商品分类</h4>
        <el-cascader
          v-model="selectedCategory"
          :options="categoryOptions"
          :props="categoryProps"
          placeholder="请选择商品分类"
          filterable
          clearable
          @change="handleCategoryChange"
        />
      </div>
      
      <div class="selector-section">
        <h4>多选分类（用于筛选）</h4>
        <el-cascader
          v-model="selectedMultipleCategories"
          :options="categoryOptions"
          :props="multipleCategoryProps"
          placeholder="请选择多个分类"
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
        />
      </div>
      
      <div class="selector-section">
        <h4>分类管理（可选任意级别）</h4>
        <el-cascader
          v-model="selectedManageCategory"
          :options="categoryOptions"
          :props="manageCategoryProps"
          placeholder="选择要管理的分类"
          clearable
        />
      </div>
    </div>
    
    <div class="category-panel">
      <h4>分类面板展示</h4>
      <el-cascader-panel
        v-model="panelValue"
        :options="categoryOptions"
        :props="panelProps"
        @change="handlePanelChange"
      />
    </div>
    
    <div class="selection-summary">
      <h4>选择结果</h4>
      <p>商品分类：{{ getCategoryName(selectedCategory) }}</p>
      <p>筛选分类：{{ getMultipleCategoryNames(selectedMultipleCategories) }}</p>
      <p>管理分类：{{ getCategoryName(selectedManageCategory) }}</p>
      <p>面板选择：{{ getCategoryName(panelValue) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const selectedCategory = ref([])
const selectedMultipleCategories = ref([])
const selectedManageCategory = ref([])
const panelValue = ref([])

const categoryOptions = [
  {
    value: 'electronics',
    label: '电子产品',
    children: [
      {
        value: 'mobile',
        label: '手机通讯',
        children: [
          { value: 'smartphone', label: '智能手机' },
          { value: 'feature-phone', label: '功能手机' },
          { value: 'accessories', label: '手机配件' }
        ]
      },
      {
        value: 'computer',
        label: '电脑办公',
        children: [
          { value: 'laptop', label: '笔记本电脑' },
          { value: 'desktop', label: '台式电脑' },
          { value: 'tablet', label: '平板电脑' },
          { value: 'peripherals', label: '电脑外设' }
        ]
      },
      {
        value: 'home-appliances',
        label: '家用电器',
        children: [
          { value: 'tv', label: '电视' },
          { value: 'refrigerator', label: '冰箱' },
          { value: 'washing-machine', label: '洗衣机' },
          { value: 'air-conditioner', label: '空调' }
        ]
      }
    ]
  },
  {
    value: 'clothing',
    label: '服装服饰',
    children: [
      {
        value: 'mens-clothing',
        label: '男装',
        children: [
          { value: 'mens-tops', label: '上装' },
          { value: 'mens-bottoms', label: '下装' },
          { value: 'mens-shoes', label: '男鞋' },
          { value: 'mens-accessories', label: '男士配饰' }
        ]
      },
      {
        value: 'womens-clothing',
        label: '女装',
        children: [
          { value: 'womens-tops', label: '上装' },
          { value: 'womens-bottoms', label: '下装' },
          { value: 'dresses', label: '连衣裙' },
          { value: 'womens-shoes', label: '女鞋' },
          { value: 'womens-accessories', label: '女士配饰' }
        ]
      },
      {
        value: 'kids-clothing',
        label: '童装',
        children: [
          { value: 'boys-clothing', label: '男童装' },
          { value: 'girls-clothing', label: '女童装' },
          { value: 'baby-clothing', label: '婴儿装' },
          { value: 'kids-shoes', label: '童鞋' }
        ]
      }
    ]
  },
  {
    value: 'books',
    label: '图书音像',
    children: [
      {
        value: 'books-literature',
        label: '文学小说',
        children: [
          { value: 'fiction', label: '小说' },
          { value: 'poetry', label: '诗歌散文' },
          { value: 'biography', label: '传记' }
        ]
      },
      {
        value: 'books-education',
        label: '教育考试',
        children: [
          { value: 'textbooks', label: '教材教辅' },
          { value: 'exam-prep', label: '考试用书' },
          { value: 'language-learning', label: '外语学习' }
        ]
      },
      {
        value: 'audio-video',
        label: '音像制品',
        children: [
          { value: 'music-cd', label: '音乐CD' },
          { value: 'movie-dvd', label: '电影DVD' },
          { value: 'audiobooks', label: '有声读物' }
        ]
      }
    ]
  }
]

const categoryProps = {
  expandTrigger: 'hover'
}

const multipleCategoryProps = {
  multiple: true,
  expandTrigger: 'hover'
}

const manageCategoryProps = {
  checkStrictly: true,
  expandTrigger: 'hover'
}

const panelProps = {
  expandTrigger: 'hover'
}

const handleCategoryChange = (value) => {
  ElMessage.success(`选择了分类：${getCategoryName(value)}`)
}

const handlePanelChange = (value) => {
  console.log('面板选择变化：', value)
}

const getCategoryName = (value) => {
  if (!value || !value.length) return '未选择'
  
  const findLabel = (options, path, index = 0) => {
    if (index >= path.length) return ''
    
    const option = options.find(opt => opt.value === path[index])
    if (!option) return ''
    
    if (index === path.length - 1) {
      return option.label
    }
    
    const childLabel = findLabel(option.children || [], path, index + 1)
    return childLabel ? `${option.label} > ${childLabel}` : option.label
  }
  
  return findLabel(categoryOptions, value)
}

const getMultipleCategoryNames = (values) => {
  if (!values || !values.length) return '未选择'
  return values.map(value => getCategoryName(value)).join('; ')
}
</script>

<style scoped>
.category-selector {
  max-width: 1000px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.selector-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.selector-section {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background-color: #fafafa;
}

.selector-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.selector-section .el-cascader {
  width: 100%;
  max-width: 400px;
}

.category-panel {
  margin-bottom: 30px;
}

.category-panel h4 {
  margin-bottom: 16px;
  color: #303133;
}

.selection-summary {
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.selection-summary h4 {
  margin-bottom: 12px;
  color: #303133;
}

.selection-summary p {
  margin: 6px 0;
  color: #606266;
  line-height: 1.5;
}
</style>
```

## API 文档

### Cascader Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | array | — |
| options | 可选项数据源，键名可通过 Props 属性配置 | array | — |
| props | 配置选项 | object | — |
| size | 尺寸 | enum | — |
| placeholder | 输入框占位文本 | string | 请选择 |
| disabled | 是否禁用 | boolean | false |
| clearable | 是否支持清空选项 | boolean | false |
| show-all-levels | 输入框中是否显示选中值的完整路径 | boolean | true |
| collapse-tags | 多选模式下是否折叠Tag | boolean | false |
| collapse-tags-tooltip | 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签在 tooltip 中 | boolean | false |
| separator | 选项分隔符 | string | ' / ' |
| filterable | 是否可搜索选项 | boolean | — |
| filter-method | 自定义搜索逻辑，第一个参数是节点node，第二个参数是搜索关键词keyword，通过返回布尔值表示是否命中 | function | — |
| debounce | 搜索关键词输入的去抖延迟，毫秒 | number | 300 |
| before-filter | 筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选 | function | — |
| popper-class | 自定义浮层类名 | string | — |
| teleported | 是否将弹出的内容直接插入到 body 元素 | boolean | true |
| tag-type | 标签类型 | enum | info |
| validate-event | 输入时是否触发表单的校验 | boolean | true |

### Cascader Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 当绑定值变化时触发的事件 | Function |
| expand-change | 当展开节点发生变化时触发 | Function |
| blur | 当失去焦点时触发 | Function |
| focus | 当获得焦点时触发 | Function |
| visible-change | 下拉框出现/隐藏时触发 | Function |
| remove-tag | 在多选模式下，移除Tag时触发 | Function |

### Cascader Slots

| 名称 | 说明 |
|------|------|
| default | 自定义备选项的节点内容，参数为 { node, data }，分别为当前节点的 Node 对象和数据 |
| empty | 无匹配选项时的内容 |

### Cascader Methods

| 名称 | 说明 | 类型 |
|------|------|------|
| getCheckedNodes | 获取选中的节点 | Function |
| focus | 使组件获得焦点 | Function |
| blur | 使组件失去焦点 | Function |

### CascaderPanel Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | array | — |
| options | 可选项数据源 | array | — |
| props | 配置选项 | object | — |

### CascaderPanel Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 当绑定值变化时触发的事件 | Function |
| expand-change | 当展开节点发生变化时触发 | Function |

### Props 配置项

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| expandTrigger | 次级菜单的展开方式 | enum | 'click' |
| multiple | 是否多选 | boolean | false |
| checkStrictly | 是否严格的遵守父子节点不互相关联 | boolean | false |
| emitPath | 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值 | boolean | true |
| lazy | 是否动态加载子节点，需与 lazyLoad 方法结合使用 | boolean | false |
| lazyLoad | 加载动态数据的方法，仅在 lazy 为 true 时有效 | function | — |
| value | 指定选项的值为选项对象的某个属性值 | string | 'value' |
| label | 指定选项标签为选项对象的某个属性值 | string | 'label' |
| children | 指定选项的子选项为选项对象的某个属性值 | string | 'children' |
| disabled | 指定选项的禁用为选项对象的某个属性值 | string | 'disabled' |
| leaf | 指定选项的叶子节点的标志位为选项对象的某个属性值 | string | 'leaf' |

## 实践练习

### 练习1：动态加载级联选择器

创建一个支持动态加载的级联选择器：

```vue
<template>
  <div class="dynamic-cascader">
    <h3>动态加载级联选择器</h3>
    <el-cascader
      v-model="value"
      :props="props"
      placeholder="请选择"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])

// 模拟数据
const mockData = {
  0: [
    { id: 1, name: '北京', hasChildren: true },
    { id: 2, name: '上海', hasChildren: true },
    { id: 3, name: '广东', hasChildren: true }
  ],
  1: [
    { id: 11, name: '朝阳区', hasChildren: true },
    { id: 12, name: '海淀区', hasChildren: true }
  ],
  2: [
    { id: 21, name: '黄浦区', hasChildren: false },
    { id: 22, name: '浦东新区', hasChildren: false }
  ],
  3: [
    { id: 31, name: '广州市', hasChildren: true },
    { id: 32, name: '深圳市', hasChildren: true }
  ],
  11: [
    { id: 111, name: '三里屯', hasChildren: false },
    { id: 112, name: '望京', hasChildren: false }
  ],
  12: [
    { id: 121, name: '中关村', hasChildren: false },
    { id: 122, name: '五道口', hasChildren: false }
  ],
  31: [
    { id: 311, name: '天河区', hasChildren: false },
    { id: 312, name: '越秀区', hasChildren: false }
  ],
  32: [
    { id: 321, name: '南山区', hasChildren: false },
    { id: 322, name: '福田区', hasChildren: false }
  ]
}

const props = {
  lazy: true,
  value: 'id',
  label: 'name',
  leaf: (node) => !node.hasChildren,
  lazyLoad(node, resolve) {
    const { level, value } = node
    const key = level === 0 ? 0 : value
    
    setTimeout(() => {
      const data = mockData[key] || []
      resolve(data)
    }, 1000)
  }
}

const handleChange = (value) => {
  console.log('选中的值：', value)
}
</script>
```

### 练习2：自定义搜索级联选择器

创建一个支持自定义搜索逻辑的级联选择器：

```vue
<template>
  <div class="custom-search-cascader">
    <h3>自定义搜索级联选择器</h3>
    <el-cascader
      v-model="value"
      :options="options"
      :filter-method="filterMethod"
      filterable
      placeholder="请输入关键词搜索"
    >
      <template #default="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="data.code" class="code">({{ data.code }})</span>
      </template>
    </el-cascader>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])

const options = [
  {
    value: 'tech',
    label: '技术部门',
    code: 'TECH',
    children: [
      {
        value: 'frontend',
        label: '前端开发',
        code: 'FE',
        children: [
          { value: 'vue', label: 'Vue.js开发', code: 'VUE' },
          { value: 'react', label: 'React开发', code: 'REACT' },
          { value: 'angular', label: 'Angular开发', code: 'NG' }
        ]
      },
      {
        value: 'backend',
        label: '后端开发',
        code: 'BE',
        children: [
          { value: 'java', label: 'Java开发', code: 'JAVA' },
          { value: 'python', label: 'Python开发', code: 'PY' },
          { value: 'nodejs', label: 'Node.js开发', code: 'NODE' }
        ]
      }
    ]
  },
  {
    value: 'product',
    label: '产品部门',
    code: 'PROD',
    children: [
      {
        value: 'design',
        label: '产品设计',
        code: 'DESIGN',
        children: [
          { value: 'ui', label: 'UI设计', code: 'UI' },
          { value: 'ux', label: 'UX设计', code: 'UX' }
        ]
      },
      {
        value: 'pm',
        label: '产品管理',
        code: 'PM',
        children: [
          { value: 'strategy', label: '产品策略', code: 'STRATEGY' },
          { value: 'operation', label: '产品运营', code: 'OPS' }
        ]
      }
    ]
  }
]

const filterMethod = (node, keyword) => {
  const { data } = node
  const searchText = keyword.toLowerCase()
  
  // 支持按标签、编码搜索
  return (
    data.label.toLowerCase().includes(searchText) ||
    (data.code && data.code.toLowerCase().includes(searchText))
  )
}
</script>

<style scoped>
.code {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}
</style>
```

## 常见问题

### 1. 数据结构配置问题

**问题**：自定义数据结构字段名

**解决方案**：
```javascript
const props = {
  value: 'id',        // 自定义值字段
  label: 'name',      // 自定义标签字段
  children: 'items',  // 自定义子节点字段
  disabled: 'isDisabled', // 自定义禁用字段
  leaf: 'isLeaf'      // 自定义叶子节点字段
}
```

### 2. 动态加载性能问题

**问题**：动态加载时频繁请求

**解决方案**：
```javascript
// 添加缓存机制
const cache = new Map()

const lazyLoad = (node, resolve) => {
  const { value } = node
  const cacheKey = value || 'root'
  
  if (cache.has(cacheKey)) {
    resolve(cache.get(cacheKey))
    return
  }
  
  // 执行异步加载
  fetchData(value).then(data => {
    cache.set(cacheKey, data)
    resolve(data)
  })
}
```

### 3. 多选模式值处理

**问题**：多选模式下值的格式处理

**解决方案**：
```javascript
// 处理多选值
const handleMultipleChange = (values) => {
  // values 是二维数组，每个元素是一个路径数组
  const selectedPaths = values.map(path => {
    return path.join(' > ')
  })
  console.log('选中的路径：', selectedPaths)
}
```

## 最佳实践

1. **数据结构设计**：合理设计层级数据结构，避免层级过深
2. **性能优化**：大数据量时使用懒加载和缓存机制
3. **用户体验**：提供搜索功能和清空选项
4. **可访问性**：支持键盘导航和屏幕阅读器
5. **错误处理**：妥善处理数据加载失败的情况
6. **响应式设计**：在移动端提供合适的交互体验

## 总结

Cascader 级联选择器是一个功能强大的层级数据选择组件，支持：

- 单选和多选模式
- 动态加载和懒加载
- 自定义搜索和过滤
- 灵活的数据结构配置
- 丰富的自定义选项
- 良好的用户体验

掌握 Cascader 组件的使用，能够帮助你构建更加灵活和高效的层级数据选择界面。

## 参考资料

- [Element Plus Cascader 官方文档](https://element-plus.org/zh-CN/component/cascader.html)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [JavaScript 数据结构与算法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)