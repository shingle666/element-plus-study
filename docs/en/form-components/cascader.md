# Cascader Component

## Overview

The Cascader component is used for selecting data with hierarchical relationships. It can display multi-level classification data structures, allowing users to select level by level, commonly used in scenarios such as region selection and category selection.

## Learning Objectives

- Master the basic concepts and usage scenarios of Cascader
- Learn how to use the basic cascader selector
- Understand the differences between single and multiple selection modes
- Master the configuration methods for data structures
- Learn to use searchable and lazy loading features
- Understand custom node content and trigger methods
- Master the complete usage of the API

## Basic Usage

### Basic Cascader Selector

The simplest cascader selector usage:

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      placeholder="Please select"
      @change="handleChange"
    />
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Design Principles',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          },
          {
            value: 'efficiency',
            label: 'Efficiency'
          },
          {
            value: 'controllability',
            label: 'Controllability'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side-nav',
            label: 'Side Navigation'
          },
          {
            value: 'top-nav',
            label: 'Top Navigation'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic Components',
        children: [
          {
            value: 'layout',
            label: 'Layout'
          },
          {
            value: 'color',
            label: 'Color'
          },
          {
            value: 'typography',
            label: 'Typography'
          },
          {
            value: 'icon',
            label: 'Icon'
          },
          {
            value: 'button',
            label: 'Button'
          }
        ]
      },
      {
        value: 'form',
        label: 'Form Components',
        children: [
          {
            value: 'radio',
            label: 'Radio'
          },
          {
            value: 'checkbox',
            label: 'Checkbox'
          },
          {
            value: 'input',
            label: 'Input'
          },
          {
            value: 'input-number',
            label: 'InputNumber'
          },
          {
            value: 'select',
            label: 'Select'
          },
          {
            value: 'cascader',
            label: 'Cascader'
          }
        ]
      }
    ]
  }
]

const handleChange = (value) => {
  console.log('Selected value:', value)
}
</script>
```

### Disabled State

Use the `disabled` attribute to disable the cascader selector or specific options:

```vue
<template>
  <div>
    <h4>Disabled Cascader</h4>
    <el-cascader
      v-model="value1"
      :options="options"
      disabled
      placeholder="Please select"
    />
    
    <h4>Disabled Specific Options</h4>
    <el-cascader
      v-model="value2"
      :options="optionsWithDisabled"
      placeholder="Please select"
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
    label: 'Beijing',
    children: [
      {
        value: 'chaoyang',
        label: 'Chaoyang District'
      },
      {
        value: 'haidian',
        label: 'Haidian District'
      }
    ]
  }
]

const optionsWithDisabled = [
  {
    value: 'beijing',
    label: 'Beijing',
    children: [
      {
        value: 'chaoyang',
        label: 'Chaoyang District'
      },
      {
        value: 'haidian',
        label: 'Haidian District',
        disabled: true
      }
    ]
  },
  {
    value: 'shanghai',
    label: 'Shanghai',
    disabled: true,
    children: [
      {
        value: 'huangpu',
        label: 'Huangpu District'
      }
    ]
  }
]
</script>
```

### Clearable

Enable the clear feature with the `clearable` attribute:

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      clearable
      placeholder="Please select"
    />
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(['guide', 'disciplines', 'consistency'])
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Design Principles',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          }
        ]
      }
    ]
  }
]
</script>
```

## Display Only Last Level

Control whether to display the complete path with the `show-all-levels` attribute:

```vue
<template>
  <div>
    <h4>Show Complete Path (Default)</h4>
    <el-cascader
      v-model="value1"
      :options="options"
      placeholder="Please select"
    />
    
    <h4>Show Only Last Level</h4>
    <el-cascader
      v-model="value2"
      :options="options"
      :show-all-levels="false"
      placeholder="Please select"
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
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Design Principles',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          }
        ]
      }
    ]
  }
]
</script>
```

## Multiple Selection Mode

Enable multiple selection mode with `props.multiple`:

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      :props="{ multiple: true }"
      placeholder="Please select"
      clearable
    />
    <p>Selected values: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Design Principles',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          },
          {
            value: 'efficiency',
            label: 'Efficiency'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side-nav',
            label: 'Side Navigation'
          },
          {
            value: 'top-nav',
            label: 'Top Navigation'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic Components',
        children: [
          {
            value: 'button',
            label: 'Button'
          },
          {
            value: 'icon',
            label: 'Icon'
          }
        ]
      }
    ]
  }
]
</script>
```

## Select Any Level Option

Allow selecting options at any level with `props.checkStrictly`:

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      :props="{ checkStrictly: true }"
      placeholder="Please select"
      clearable
    />
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Design Principles',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic Components',
        children: [
          {
            value: 'button',
            label: 'Button'
          }
        ]
      }
    ]
  }
]
</script>
```

## Dynamic Loading

Implement dynamic loading with `props.lazy` and `props.lazyLoad`:

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :props="props"
      placeholder="Please select"
    />
    <p>Selected value: {{ value }}</p>
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
          label: `Option ${id}`,
          leaf: level >= 2
        }))
      resolve(nodes)
    }, 1000)
  }
}
</script>
```

## Searchable

Enable search functionality with the `filterable` attribute:

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      filterable
      placeholder="Please select or search"
    />
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'beijing',
    label: 'Beijing',
    children: [
      {
        value: 'chaoyang',
        label: 'Chaoyang District',
        children: [
          {
            value: 'datunlu',
            label: 'Datun Road'
          },
          {
            value: 'sanlitun',
            label: 'Sanlitun'
          }
        ]
      },
      {
        value: 'haidian',
        label: 'Haidian District',
        children: [
          {
            value: 'zhongguancun',
            label: 'Zhongguancun'
          },
          {
            value: 'wudaokou',
            label: 'Wudaokou'
          }
        ]
      }
    ]
  },
  {
    value: 'shanghai',
    label: 'Shanghai',
    children: [
      {
        value: 'huangpu',
        label: 'Huangpu District',
        children: [
          {
            value: 'nanjinglu',
            label: 'Nanjing Road'
          },
          {
            value: 'waitan',
            label: 'The Bund'
          }
        ]
      },
      {
        value: 'pudong',
        label: 'Pudong New District',
        children: [
          {
            value: 'lujiazui',
            label: 'Lujiazui'
          },
          {
            value: 'zhangjiang',
            label: 'Zhangjiang'
          }
        ]
      }
    ]
  }
]
</script>
```

## Custom Node Content

Use scoped slots to customize node content:

```vue
<template>
  <div>
    <el-cascader
      v-model="value"
      :options="options"
      placeholder="Please select"
    >
      <template #default="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Design Principles',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          }
        ]
      },
      {
        value: 'navigation',
        label: 'Navigation',
        children: [
          {
            value: 'side-nav',
            label: 'Side Navigation'
          },
          {
            value: 'top-nav',
            label: 'Top Navigation'
          }
        ]
      }
    ]
  }
]
</script>
```

## Cascader Panel

Use the `el-cascader-panel` component to directly display the cascader panel:

```vue
<template>
  <div>
    <el-cascader-panel
      v-model="value"
      :options="options"
      @change="handleChange"
    />
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Design Principles',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          },
          {
            value: 'feedback',
            label: 'Feedback'
          }
        ]
      }
    ]
  },
  {
    value: 'component',
    label: 'Component',
    children: [
      {
        value: 'basic',
        label: 'Basic Components',
        children: [
          {
            value: 'button',
            label: 'Button'
          }
        ]
      }
    ]
  }
]

const handleChange = (value) => {
  console.log('Selected value:', value)
}
</script>
```

## Size

Use the `size` attribute to set the size of the cascader selector:

```vue
<template>
  <div>
    <h4>Large Size</h4>
    <el-cascader
      v-model="value1"
      :options="options"
      size="large"
      placeholder="Please select"
    />
    
    <h4>Default Size</h4>
    <el-cascader
      v-model="value2"
      :options="options"
      placeholder="Please select"
    />
    
    <h4>Small Size</h4>
    <el-cascader
      v-model="value3"
      :options="options"
      size="small"
      placeholder="Please select"
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
    label: 'Guide',
    children: [
      {
        value: 'disciplines',
        label: 'Design Principles',
        children: [
          {
            value: 'consistency',
            label: 'Consistency'
          }
        ]
      }
    ]
  }
]
</script>
```

## Practical Application Examples

### Region Selector

```vue
<template>
  <div class="region-selector">
    <h3>Region Selector</h3>
    
    <div class="selector-group">
      <div class="selector-item">
        <label>Select Region:</label>
        <el-cascader
          v-model="selectedRegion"
          :options="regionOptions"
          :props="regionProps"
          placeholder="Please select province/city/district"
          filterable
          clearable
          @change="handleRegionChange"
        />
      </div>
      
      <div class="selector-item">
        <label>Multiple Regions:</label>
        <el-cascader
          v-model="selectedMultipleRegions"
          :options="regionOptions"
          :props="multipleRegionProps"
          placeholder="Please select multiple regions"
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
        />
      </div>
      
      <div class="selector-item">
        <label>Any Level:</label>
        <el-cascader
          v-model="selectedAnyLevel"
          :options="regionOptions"
          :props="anyLevelProps"
          placeholder="Select any level"
          clearable
        />
      </div>
    </div>
    
    <div class="selection-result">
      <h4>Selection Results</h4>
      <p>Single Region: {{ getRegionName(selectedRegion) }}</p>
      <p>Multiple Regions: {{ getMultipleRegionNames(selectedMultipleRegions) }}</p>
      <p>Any Level: {{ getRegionName(selectedAnyLevel) }}</p>
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
    label: 'Beijing',
    children: [
      {
        value: 'chaoyang',
        label: 'Chaoyang District',
        children: [
          { value: 'sanlitun', label: 'Sanlitun Street' },
          { value: 'datunlu', label: 'Datun Road Street' },
          { value: 'wangjing', label: 'Wangjing Street' }
        ]
      },
      {
        value: 'haidian',
        label: 'Haidian District',
        children: [
          { value: 'zhongguancun', label: 'Zhongguancun Street' },
          { value: 'wudaokou', label: 'Wudaokou Street' },
          { value: 'shangdi', label: 'Shangdi Street' }
        ]
      },
      {
        value: 'xicheng',
        label: 'Xicheng District',
        children: [
          { value: 'xinjiekou', label: 'Xinjiekou Street' },
          { value: 'deshengmen', label: 'Deshengmen Street' }
        ]
      }
    ]
  },
  {
    value: 'shanghai',
    label: 'Shanghai',
    children: [
      {
        value: 'huangpu',
        label: 'Huangpu District',
        children: [
          { value: 'nanjinglu', label: 'Nanjing East Road Street' },
          { value: 'waitan', label: 'The Bund Street' },
          { value: 'yuyuan', label: 'Yuyuan Street' }
        ]
      },
      {
        value: 'pudong',
        label: 'Pudong New District',
        children: [
          { value: 'lujiazui', label: 'Lujiazui Street' },
          { value: 'zhangjiang', label: 'Zhangjiang Town' },
          { value: 'jinqiao', label: 'Jinqiao Town' }
        ]
      }
    ]
  },
  {
    value: 'guangdong',
    label: 'Guangdong Province',
    children: [
      {
        value: 'guangzhou',
        label: 'Guangzhou City',
        children: [
          { value: 'tianhe', label: 'Tianhe District' },
          { value: 'yuexiu', label: 'Yuexiu District' },
          { value: 'haizhu', label: 'Haizhu District' }
        ]
      },
      {
        value: 'shenzhen',
        label: 'Shenzhen City',
        children: [
          { value: 'futian', label: 'Futian District' },
          { value: 'nanshan', label: 'Nanshan District' },
          { value: 'luohu', label: 'Luohu District' }
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
  ElMessage.success(`Selected region: ${getRegionName(value)}`)
}

const getRegionName = (value) => {
  if (!value || !value.length) return 'Not selected'
  
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
  if (!values || !values.length) return 'Not selected'
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

### Category Selector

```vue
<template>
  <div class="category-selector">
    <h3>Product Category Selector</h3>
    
    <div class="selector-container">
      <div class="selector-section">
        <h4>Select Product Category</h4>
        <el-cascader
          v-model="selectedCategory"
          :options="categoryOptions"
          :props="categoryProps"
          placeholder="Please select product category"
          filterable
          clearable
          @change="handleCategoryChange"
        />
      </div>
      
      <div class="selector-section">
        <h4>Multiple Categories (for filtering)</h4>
        <el-cascader
          v-model="selectedMultipleCategories"
          :options="categoryOptions"
          :props="multipleCategoryProps"
          placeholder="Please select multiple categories"
          filterable
          clearable
          collapse-tags
          collapse-tags-tooltip
        />
      </div>
      
      <div class="selector-section">
        <h4>Category Management (any level selectable)</h4>
        <el-cascader
          v-model="selectedManageCategory"
          :options="categoryOptions"
          :props="manageCategoryProps"
          placeholder="Select category to manage"
          clearable
        />
      </div>
    </div>
    
    <div class="category-panel">
      <h4>Category Panel Display</h4>
      <el-cascader-panel
        v-model="panelValue"
        :options="categoryOptions"
        :props="panelProps"
        @change="handlePanelChange"
      />
    </div>
    
    <div class="selection-summary">
      <h4>Selection Results</h4>
      <p>Product Category: {{ getCategoryName(selectedCategory) }}</p>
      <p>Filter Categories: {{ getMultipleCategoryNames(selectedMultipleCategories) }}</p>
      <p>Management Category: {{ getCategoryName(selectedManageCategory) }}</p>
      <p>Panel Selection: {{ getCategoryName(panelValue) }}</p>
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
    label: 'Electronics',
    children: [
      {
        value: 'mobile',
        label: 'Mobile Phones',
        children: [
          { value: 'smartphone', label: 'Smartphones' },
          { value: 'feature-phone', label: 'Feature Phones' },
          { value: 'accessories', label: 'Phone Accessories' }
        ]
      },
      {
        value: 'computer',
        label: 'Computers',
        children: [
          { value: 'laptop', label: 'Laptops' },
          { value: 'desktop', label: 'Desktops' },
          { value: 'tablet', label: 'Tablets' },
          { value: 'peripherals', label: 'Computer Peripherals' }
        ]
      },
      {
        value: 'home-appliances',
        label: 'Home Appliances',
        children: [
          { value: 'tv', label: 'TVs' },
          { value: 'refrigerator', label: 'Refrigerators' },
          { value: 'washing-machine', label: 'Washing Machines' },
          { value: 'air-conditioner', label: 'Air Conditioners' }
        ]
      }
    ]
  },
  {
    value: 'clothing',
    label: 'Clothing',
    children: [
      {
        value: 'mens-clothing',
        label: 'Men\'s Clothing',
        children: [
          { value: 'mens-tops', label: 'Tops' },
          { value: 'mens-bottoms', label: 'Bottoms' },
          { value: 'mens-shoes', label: 'Men\'s Shoes' },
          { value: 'mens-accessories', label: 'Men\'s Accessories' }
        ]
      },
      {
        value: 'womens-clothing',
        label: 'Women\'s Clothing',
        children: [
          { value: 'womens-tops', label: 'Tops' },
          { value: 'womens-bottoms', label: 'Bottoms' },
          { value: 'dresses', label: 'Dresses' },
          { value: 'womens-shoes', label: 'Women\'s Shoes' },
          { value: 'womens-accessories', label: 'Women\'s Accessories' }
        ]
      },
      {
        value: 'kids-clothing',
        label: 'Kids\' Clothing',
        children: [
          { value: 'boys-clothing', label: 'Boys\' Clothing' },
          { value: 'girls-clothing', label: 'Girls\' Clothing' },
          { value: 'baby-clothing', label: 'Baby Clothing' },
          { value: 'kids-shoes', label: 'Kids\' Shoes' }
        ]
      }
    ]
  },
  {
    value: 'books',
    label: 'Books & Media',
    children: [
      {
        value: 'books-literature',
        label: 'Literature',
        children: [
          { value: 'fiction', label: 'Fiction' },
          { value: 'poetry', label: 'Poetry & Essays' },
          { value: 'biography', label: 'Biography' }
        ]
      },
      {
        value: 'books-education',
        label: 'Education',
        children: [
          { value: 'textbooks', label: 'Textbooks' },
          { value: 'exam-prep', label: 'Exam Preparation' },
          { value: 'language-learning', label: 'Language Learning' }
        ]
      },
      {
        value: 'audio-video',
        label: 'Audio & Video',
        children: [
          { value: 'music-cd', label: 'Music CDs' },
          { value: 'movie-dvd', label: 'Movie DVDs' },
          { value: 'audiobooks', label: 'Audiobooks' }
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
  ElMessage.success(`Selected category: ${getCategoryName(value)}`)
}

const handlePanelChange = (value) => {
  console.log('Panel selection change:', value)
}

const getCategoryName = (value) => {
  if (!value || !value.length) return 'Not selected'
  
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
  if (!values || !values.length) return 'Not selected'
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

## API Documentation

### Cascader Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | array | — |
| options | data source | array | — |
| props | configuration options | object | — |
| size | size | enum | — |
| placeholder | placeholder | string | Select |
| disabled | whether to disable | boolean | false |
| clearable | whether to support clearing | boolean | false |
| show-all-levels | whether to display all levels of the selected value in the input | boolean | true |
| collapse-tags | whether to collapse tags in multiple selection mode | boolean | false |
| collapse-tags-tooltip | whether to show all selected tags when mouse hover collapse-tags | boolean | false |
| separator | option separator | string | ' / ' |
| filterable | whether to enable filtering | boolean | — |
| filter-method | custom filtering method | function | — |
| debounce | debounce delay when typing filter keyword, in milliseconds | number | 300 |
| before-filter | hook function before filtering | function | — |
| popper-class | custom class name for the dropdown menu | string | — |
| teleported | whether the dropdown is teleported to the body | boolean | true |
| tag-type | tag type | enum | info |
| validate-event | whether to trigger form validation | boolean | true |

### Cascader Events

| Name | Description | Type |
|------|-------------|------|
| change | triggers when the binding value changes | Function |
| expand-change | triggers when expanding options change | Function |
| blur | triggers when the component loses focus | Function |
| focus | triggers when the component obtains focus | Function |
| visible-change | triggers when the dropdown appears/disappears | Function |
| remove-tag | triggers when a tag is removed in multiple selection mode | Function |

### Cascader Slots

| Name | Description |
|------|-------------|
| default | custom content for cascader node. The parameter is { node, data } | 
| empty | content when there is no matched options | 

### Cascader Methods

| Name | Description | Type |
|------|-------------|------|
| getCheckedNodes | get the currently selected node | Function |
| focus | focus the component | Function |
| blur | blur the component | Function |

### CascaderPanel Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | array | — |
| options | data source | array | — |
| props | configuration options | object | — |

### CascaderPanel Events

| Name | Description | Type |
|------|-------------|------|
| change | triggers when the binding value changes | Function |
| expand-change | triggers when expanding options change | Function |

### Props Configuration

| Name | Description | Type | Default |
|------|-------------|------|---------|
| expandTrigger | trigger mode for expanding options | enum | 'click' |
| multiple | whether to select multiple values | boolean | false |
| checkStrictly | whether to check nodes strictly. If false, parent and child nodes are linked | boolean | false |
| emitPath | when a node is selected, whether to return an array of all parent node values | boolean | true |
| lazy | whether to load child nodes dynamically | boolean | false |
| lazyLoad | method for loading child nodes, only works when lazy is true | function | — |
| value | specify which key value of node object is used as the node's value | string | 'value' |
| label | specify which key value of node object is used as the node's label | string | 'label' |
| children | specify which key value of node object is used as the node's children | string | 'children' |
| disabled | specify which key value of node object is used as the node's disabled | string | 'disabled' |
| leaf | specify which key value of node object is used as the node's leaf field | string | 'leaf' |

## Practical Exercises

### Exercise 1: Dynamic Loading Cascader

Create a cascader with dynamic loading support:

```vue
<template>
  <div class="dynamic-cascader">
    <h3>Dynamic Loading Cascader</h3>
    <el-cascader
      v-model="value"
      :props="props"
      placeholder="Please select"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])

// Mock data
const mockData = {
  0: [
    { id: 1, name: 'Beijing', hasChildren: true },
    { id: 2, name: 'Shanghai', hasChildren: true },
    { id: 3, name: 'Guangdong', hasChildren: true }
  ],
  1: [
    { id: 11, name: 'Chaoyang District', hasChildren: true },
    { id: 12, name: 'Haidian District', hasChildren: true }
  ],
  2: [
    { id: 21, name: 'Huangpu District', hasChildren: false },
    { id: 22, name: 'Pudong New District', hasChildren: false }
  ],
  3: [
    { id: 31, name: 'Guangzhou City', hasChildren: true },
    { id: 32, name: 'Shenzhen City', hasChildren: true }
  ],
  11: [
    { id: 111, name: 'Sanlitun', hasChildren: false },
    { id: 112, name: 'Wangjing', hasChildren: false }
  ],
  12: [
    { id: 121, name: 'Zhongguancun', hasChildren: false },
    { id: 122, name: 'Wudaokou', hasChildren: false }
  ],
  31: [
    { id: 311, name: 'Tianhe District', hasChildren: false },
    { id: 312, name: 'Yuexiu District', hasChildren: false }
  ],
  32: [
    { id: 321, name: 'Nanshan District', hasChildren: false },
    { id: 322, name: 'Futian District', hasChildren: false }
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
  console.log('Selected value:', value)
}
</script>
```

### Exercise 2: Custom Search Cascader

Create a cascader with custom search logic:

```vue
<template>
  <div class="custom-search-cascader">
    <h3>Custom Search Cascader</h3>
    <el-cascader
      v-model="value"
      :options="options"
      :filter-method="filterMethod"
      filterable
      placeholder="Enter keywords to search"
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
    label: 'Technology Department',
    code: 'TECH',
    children: [
      {
        value: 'frontend',
        label: 'Frontend Development',
        code: 'FE',
        children: [
          { value: 'vue', label: 'Vue.js Development', code: 'VUE' },
          { value: 'react', label: 'React Development', code: 'REACT' },
          { value: 'angular', label: 'Angular Development', code: 'NG' }
        ]
      },
      {
        value: 'backend',
        label: 'Backend Development',
        code: 'BE',
        children: [
          { value: 'java', label: 'Java Development', code: 'JAVA' },
          { value: 'python', label: 'Python Development', code: 'PY' },
          { value: 'nodejs', label: 'Node.js Development', code: 'NODE' }
        ]
      }
    ]
  },
  {
    value: 'product',
    label: 'Product Department',
    code: 'PROD',
    children: [
      {
        value: 'design',
        label: 'Product Design',
        code: 'DESIGN',
        children: [
          { value: 'ui', label: 'UI Design', code: 'UI' },
          { value: 'ux', label: 'UX Design', code: 'UX' }
        ]
      },
      {
        value: 'pm',
        label: 'Product Management',
        code: 'PM',
        children: [
          { value: 'strategy', label: 'Product Strategy', code: 'STRATEGY' },
          { value: 'operation', label: 'Product Operations', code: 'OPS' }
        ]
      }
    ]
  }
]

const filterMethod = (node, keyword) => {
  const { data } = node
  const searchText = keyword.toLowerCase()
  
  // Support searching by label or code
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

## Common Issues

### 1. Data Structure Configuration Issues

**Problem**: Customizing data structure field names

**Solution**:
```javascript
const props = {
  value: 'id',        // Custom value field
  label: 'name',      // Custom label field
  children: 'items',  // Custom children field
  disabled: 'isDisabled', // Custom disabled field
  leaf: 'isLeaf'      // Custom leaf node field
}
```

### 2. Dynamic Loading Performance Issues

**Problem**: Frequent requests during dynamic loading

**Solution**:
```javascript
// Add caching mechanism
const cache = new Map()

const lazyLoad = (node, resolve) => {
  const { value } = node
  const cacheKey = value || 'root'
  
  if (cache.has(cacheKey)) {
    resolve(cache.get(cacheKey))
    return
  }
  
  // Execute asynchronous loading
  fetchData(value).then(data => {
    cache.set(cacheKey, data)
    resolve(data)
  })
}
```

### 3. Multiple Selection Value Handling

**Problem**: Handling values in multiple selection mode

**Solution**:
```javascript
// Process multiple selection values
const handleMultipleChange = (values) => {
  // values is a two-dimensional array, each element is a path array
  const selectedPaths = values.map(path => {
    return path.join(' > ')
  })
  console.log('Selected paths:', selectedPaths)
}
```

## Best Practices

1. **Data Structure Design**: Design hierarchical data structures reasonably, avoid excessive depth
2. **Performance Optimization**: Use lazy loading and caching mechanisms for large data volumes
3. **User Experience**: Provide search functionality and clear options
4. **Accessibility**: Support keyboard navigation and screen readers
5. **Error Handling**: Properly handle data loading failures
6. **Responsive Design**: Provide appropriate interaction experience on mobile devices

## Summary

The Cascader component is a powerful hierarchical data selection component that supports:

- Single and multiple selection modes
- Dynamic loading and lazy loading
- Custom search and filtering
- Flexible data structure configuration
- Rich customization options
- Good user experience

Mastering the use of the Cascader component can help you build more flexible and efficient hierarchical data selection interfaces.

## References

- [Element Plus Cascader Official Documentation](https://element-plus.org/en-US/component/cascader.html)
- [Vue 3 Reactivity API](https://vuejs.org/api/reactivity-core.html)
- [JavaScript Data Structures and Algorithms](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
