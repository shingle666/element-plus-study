# TreeSelect 树形选择

## 概述

TreeSelect 树形选择组件是一个结合了树形结构和选择器功能的复合组件。它允许用户在树形数据结构中进行单选或多选操作，特别适用于具有层级关系的数据选择场景。

### 主要特性

- **树形结构展示**：支持多层级数据的树形展示
- **单选/多选模式**：支持单选和多选两种模式
- **搜索过滤**：内置搜索功能，快速定位目标节点
- **懒加载**：支持异步加载子节点数据
- **自定义渲染**：支持自定义节点内容和样式
- **禁用控制**：可以禁用特定节点或整个组件
- **表单集成**：与 el-form 完美集成

### 适用场景

- 组织架构选择
- 地区/城市选择
- 分类目录选择
- 权限管理
- 文件目录选择
- 菜单配置

## 学习目标

### 基础知识
- 掌握 TreeSelect 组件的基本概念和使用场景
- 学会基础的树形选择功能实现
- 了解树形数据结构的配置方法
- 掌握单选和多选模式的使用

### 进阶技能
- 学会搜索过滤功能的配置
- 掌握懒加载的实现方法
- 了解自定义节点渲染
- 学会禁用状态的控制

### 实战应用
- 能够构建完整的组织架构选择器
- 掌握地区选择功能的实现
- 了解性能优化和用户体验提升
- 学会与其他组件的集成使用

## 基础用法

### 基本树形选择

最简单的树形选择功能：

```vue
<template>
  <div>
    <h4>基础树形选择</h4>
    <el-tree-select
      v-model="value"
      :data="data"
      :render-after-expand="false"
      :show-checkbox="false"
      placeholder="请选择"
      @change="handleChange"
    />
    <p>选择的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

const data = [
  {
    id: 1,
    label: '一级 1',
    children: [
      {
        id: 4,
        label: '二级 1-1',
        children: [
          {
            id: 9,
            label: '三级 1-1-1'
          },
          {
            id: 10,
            label: '三级 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '一级 2',
    children: [
      {
        id: 5,
        label: '二级 2-1'
      },
      {
        id: 6,
        label: '二级 2-2'
      }
    ]
  },
  {
    id: 3,
    label: '一级 3',
    children: [
      {
        id: 7,
        label: '二级 3-1'
      },
      {
        id: 8,
        label: '二级 3-2'
      }
    ]
  }
]

const handleChange = (val) => {
  console.log('选择变化：', val)
}
</script>
```

### 多选模式

启用多选功能：

```vue
<template>
  <div>
    <h4>多选模式</h4>
    <el-tree-select
      v-model="value"
      :data="data"
      multiple
      :show-checkbox="true"
      placeholder="请选择（可多选）"
      @change="handleChange"
    />
    <p>选择的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])

const data = [
  {
    id: 1,
    label: '技术部',
    children: [
      {
        id: 11,
        label: '前端组',
        children: [
          { id: 111, label: 'Vue 开发' },
          { id: 112, label: 'React 开发' }
        ]
      },
      {
        id: 12,
        label: '后端组',
        children: [
          { id: 121, label: 'Java 开发' },
          { id: 122, label: 'Python 开发' }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '产品部',
    children: [
      { id: 21, label: '产品经理' },
      { id: 22, label: 'UI 设计师' }
    ]
  },
  {
    id: 3,
    label: '运营部',
    children: [
      { id: 31, label: '内容运营' },
      { id: 32, label: '用户运营' }
    ]
  }
]

const handleChange = (val) => {
  console.log('多选变化：', val)
}
</script>
```

### 可搜索

添加搜索功能：

```vue
<template>
  <div>
    <h4>可搜索的树形选择</h4>
    
    <div class="search-example">
      <el-tree-select
        v-model="selectedValue"
        :data="searchData"
        filterable
        :filter-node-method="filterNode"
        placeholder="输入关键字搜索"
        @change="handleSearchChange"
        style="width: 300px"
      />
    </div>
    
    <div class="search-info">
      <p>选择的值：{{ selectedValue }}</p>
      <p>选择的标签：{{ getSelectedLabel() }}</p>
    </div>
    
    <div class="search-tips">
      <h5>搜索提示：</h5>
      <ul>
        <li>可以搜索：北京、上海、广州、深圳等城市</li>
        <li>可以搜索：华北、华东、华南等地区</li>
        <li>搜索不区分大小写</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedValue = ref('')

const searchData = [
  {
    id: 'north',
    label: '华北地区',
    children: [
      {
        id: 'beijing',
        label: '北京市',
        children: [
          { id: 'chaoyang', label: '朝阳区' },
          { id: 'haidian', label: '海淀区' },
          { id: 'dongcheng', label: '东城区' },
          { id: 'xicheng', label: '西城区' }
        ]
      },
      {
        id: 'tianjin',
        label: '天津市',
        children: [
          { id: 'heping', label: '和平区' },
          { id: 'hexi', label: '河西区' },
          { id: 'nankai', label: '南开区' }
        ]
      },
      {
        id: 'hebei',
        label: '河北省',
        children: [
          { id: 'shijiazhuang', label: '石家庄市' },
          { id: 'tangshan', label: '唐山市' },
          { id: 'qinhuangdao', label: '秦皇岛市' }
        ]
      }
    ]
  },
  {
    id: 'east',
    label: '华东地区',
    children: [
      {
        id: 'shanghai',
        label: '上海市',
        children: [
          { id: 'huangpu', label: '黄浦区' },
          { id: 'xuhui', label: '徐汇区' },
          { id: 'changning', label: '长宁区' },
          { id: 'jingan', label: '静安区' }
        ]
      },
      {
        id: 'jiangsu',
        label: '江苏省',
        children: [
          { id: 'nanjing', label: '南京市' },
          { id: 'suzhou', label: '苏州市' },
          { id: 'wuxi', label: '无锡市' }
        ]
      },
      {
        id: 'zhejiang',
        label: '浙江省',
        children: [
          { id: 'hangzhou', label: '杭州市' },
          { id: 'ningbo', label: '宁波市' },
          { id: 'wenzhou', label: '温州市' }
        ]
      }
    ]
  },
  {
    id: 'south',
    label: '华南地区',
    children: [
      {
        id: 'guangdong',
        label: '广东省',
        children: [
          { id: 'guangzhou', label: '广州市' },
          { id: 'shenzhen', label: '深圳市' },
          { id: 'dongguan', label: '东莞市' },
          { id: 'foshan', label: '佛山市' }
        ]
      },
      {
        id: 'fujian',
        label: '福建省',
        children: [
          { id: 'fuzhou', label: '福州市' },
          { id: 'xiamen', label: '厦门市' },
          { id: 'quanzhou', label: '泉州市' }
        ]
      }
    ]
  }
]

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

const handleSearchChange = (val) => {
  console.log('搜索选择变化：', val)
}

const getSelectedLabel = () => {
  if (!selectedValue.value) return '未选择'
  
  const findLabel = (nodes, targetId) => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return node.label
      }
      if (node.children) {
        const result = findLabel(node.children, targetId)
        if (result) return result
      }
    }
    return null
  }
  
  return findLabel(searchData, selectedValue.value) || '未找到'
}
</script>

<style scoped>
.search-example {
  margin-bottom: 16px;
}

.search-info {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 16px;
}

.search-info p {
  margin: 4px 0;
  color: #606266;
}

.search-tips {
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.search-tips h5 {
  margin: 0 0 8px 0;
  color: #303133;
}

.search-tips ul {
  margin: 0;
  padding-left: 20px;
}

.search-tips li {
  margin: 4px 0;
  color: #606266;
}
</style>
```

### 懒加载

异步加载子节点数据：

```vue
<template>
  <div>
    <h4>懒加载树形选择</h4>
    
    <div class="lazy-example">
      <el-tree-select
        v-model="lazyValue"
        :data="lazyData"
        :props="lazyProps"
        lazy
        :load="loadNode"
        placeholder="选择部门（懒加载）"
        @change="handleLazyChange"
        style="width: 300px"
      />
    </div>
    
    <div class="lazy-info">
      <p>选择的值：{{ lazyValue }}</p>
      <p>加载状态：{{ loading ? '加载中...' : '空闲' }}</p>
    </div>
    
    <div class="lazy-log">
      <h5>加载日志：</h5>
      <div class="log-content">
        <div v-for="(log, index) in loadLogs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const lazyValue = ref('')
const loading = ref(false)
const loadLogs = ref([])

const lazyData = [
  {
    id: 1,
    label: '总公司',
    isLeaf: false
  }
]

const lazyProps = {
  value: 'id',
  label: 'label',
  children: 'children',
  isLeaf: 'isLeaf'
}

const addLog = (message) => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  loadLogs.value.unshift({ time, message })
  
  // 只保留最近10条日志
  if (loadLogs.value.length > 10) {
    loadLogs.value = loadLogs.value.slice(0, 10)
  }
}

const loadNode = (node, resolve) => {
  loading.value = true
  addLog(`开始加载节点: ${node.label || '根节点'}`)
  
  // 模拟异步加载
  setTimeout(() => {
    let children = []
    
    if (node.level === 0) {
      // 根节点加载一级部门
      children = [
        { id: 11, label: '技术部', isLeaf: false },
        { id: 12, label: '产品部', isLeaf: false },
        { id: 13, label: '运营部', isLeaf: false },
        { id: 14, label: '财务部', isLeaf: true },
        { id: 15, label: '人事部', isLeaf: true }
      ]
    } else if (node.level === 1) {
      // 一级部门加载二级部门
      if (node.data.id === 11) {
        // 技术部
        children = [
          { id: 111, label: '前端组', isLeaf: false },
          { id: 112, label: '后端组', isLeaf: false },
          { id: 113, label: '测试组', isLeaf: true },
          { id: 114, label: '运维组', isLeaf: true }
        ]
      } else if (node.data.id === 12) {
        // 产品部
        children = [
          { id: 121, label: '产品策划', isLeaf: true },
          { id: 122, label: 'UI设计', isLeaf: true },
          { id: 123, label: '用户研究', isLeaf: true }
        ]
      } else if (node.data.id === 13) {
        // 运营部
        children = [
          { id: 131, label: '内容运营', isLeaf: true },
          { id: 132, label: '用户运营', isLeaf: true },
          { id: 133, label: '活动运营', isLeaf: true }
        ]
      }
    } else if (node.level === 2) {
      // 二级部门加载具体岗位
      if (node.data.id === 111) {
        // 前端组
        children = [
          { id: 1111, label: 'Vue 开发工程师', isLeaf: true },
          { id: 1112, label: 'React 开发工程师', isLeaf: true },
          { id: 1113, label: '前端架构师', isLeaf: true }
        ]
      } else if (node.data.id === 112) {
        // 后端组
        children = [
          { id: 1121, label: 'Java 开发工程师', isLeaf: true },
          { id: 1122, label: 'Python 开发工程师', isLeaf: true },
          { id: 1123, label: '后端架构师', isLeaf: true }
        ]
      }
    }
    
    loading.value = false
    addLog(`加载完成: ${node.label || '根节点'}, 子节点数量: ${children.length}`)
    resolve(children)
  }, 1000 + Math.random() * 1000) // 随机延迟1-2秒
}

const handleLazyChange = (val) => {
  console.log('懒加载选择变化：', val)
  addLog(`选择了节点: ${val}`)
}
</script>

<style scoped>
.lazy-example {
  margin-bottom: 16px;
}

.lazy-info {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 16px;
}

.lazy-info p {
  margin: 4px 0;
  color: #606266;
}

.lazy-log {
  padding: 12px;
  background-color: #fafafa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.lazy-log h5 {
  margin: 0 0 8px 0;
  color: #303133;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  margin: 4px 0;
  font-size: 12px;
}

.log-time {
  color: #909399;
  margin-right: 8px;
  min-width: 60px;
}

.log-message {
  color: #606266;
}
</style>
```

### 禁用状态

设置禁用状态：

```vue
<template>
  <div>
    <h4>禁用状态</h4>
    
    <div class="disabled-example">
      <div class="control-section">
        <el-button @click="toggleDisabled">{{ globalDisabled ? '启用' : '禁用' }}组件</el-button>
        <el-button @click="toggleNodeDisabled">切换节点禁用状态</el-button>
        <el-button @click="resetSelection">重置选择</el-button>
      </div>
      
      <div class="tree-section">
        <div class="tree-item">
          <label>全局禁用：</label>
          <el-tree-select
            v-model="disabledValue1"
            :data="disabledData"
            :disabled="globalDisabled"
            placeholder="全局禁用状态"
            style="width: 250px"
          />
        </div>
        
        <div class="tree-item">
          <label>节点禁用：</label>
          <el-tree-select
            v-model="disabledValue2"
            :data="disabledData"
            placeholder="部分节点禁用"
            style="width: 250px"
          />
        </div>
        
        <div class="tree-item">
          <label>多选禁用：</label>
          <el-tree-select
            v-model="disabledValue3"
            :data="disabledData"
            multiple
            :show-checkbox="true"
            :disabled="globalDisabled"
            placeholder="多选禁用状态"
            style="width: 250px"
          />
        </div>
      </div>
      
      <div class="status-info">
        <h5>选择状态：</h5>
        <p>全局禁用选择：{{ disabledValue1 || '未选择' }}</p>
        <p>节点禁用选择：{{ disabledValue2 || '未选择' }}</p>
        <p>多选禁用选择：{{ Array.isArray(disabledValue3) ? disabledValue3.join(', ') : '未选择' }}</p>
        <p>全局禁用状态：{{ globalDisabled ? '已禁用' : '已启用' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const globalDisabled = ref(false)
const disabledValue1 = ref('')
const disabledValue2 = ref('')
const disabledValue3 = ref([])

const disabledData = ref([
  {
    id: 1,
    label: '可选择的部门',
    children: [
      {
        id: 11,
        label: '技术部',
        children: [
          { id: 111, label: '前端组' },
          { id: 112, label: '后端组（禁用）', disabled: true },
          { id: 113, label: '测试组' }
        ]
      },
      {
        id: 12,
        label: '产品部（禁用）',
        disabled: true,
        children: [
          { id: 121, label: '产品经理' },
          { id: 122, label: 'UI设计师' }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '运营部',
    children: [
      { id: 21, label: '内容运营' },
      { id: 22, label: '用户运营（禁用）', disabled: true },
      { id: 23, label: '活动运营' }
    ]
  },
  {
    id: 3,
    label: '财务部（禁用）',
    disabled: true,
    children: [
      { id: 31, label: '会计' },
      { id: 32, label: '出纳' }
    ]
  }
])

const toggleDisabled = () => {
  globalDisabled.value = !globalDisabled.value
}

const toggleNodeDisabled = () => {
  // 切换某些节点的禁用状态
  const toggleNodeState = (nodes) => {
    nodes.forEach(node => {
      if (node.id === 112 || node.id === 22) {
        node.disabled = !node.disabled
      }
      if (node.children) {
        toggleNodeState(node.children)
      }
    })
  }
  
  toggleNodeState(disabledData.value)
}

const resetSelection = () => {
  disabledValue1.value = ''
  disabledValue2.value = ''
  disabledValue3.value = []
}
</script>

<style scoped>
.disabled-example {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 16px;
}

.control-section {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.tree-section {
  margin-bottom: 16px;
}

.tree-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.tree-item label {
  min-width: 100px;
  margin-right: 12px;
  font-weight: 500;
  color: #303133;
}

.status-info {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.status-info h5 {
  margin: 0 0 8px 0;
  color: #303133;
}

.status-info p {
  margin: 4px 0;
  color: #606266;
}
</style>
```

## 在表单中使用

与 el-form 一起使用：

```vue
<template>
  <div>
    <h4>表单中的树形选择</h4>
    
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="员工姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入员工姓名" />
      </el-form-item>
      
      <el-form-item label="所属部门" prop="department">
        <el-tree-select
          v-model="form.department"
          :data="departmentData"
          placeholder="请选择所属部门"
          style="width: 100%"
          @change="handleDepartmentChange"
        />
      </el-form-item>
      
      <el-form-item label="负责项目" prop="projects">
        <el-tree-select
          v-model="form.projects"
          :data="projectData"
          multiple
          :show-checkbox="true"
          placeholder="请选择负责的项目（可多选）"
          style="width: 100%"
          @change="handleProjectsChange"
        />
      </el-form-item>
      
      <el-form-item label="权限范围" prop="permissions">
        <el-tree-select
          v-model="form.permissions"
          :data="permissionData"
          multiple
          :show-checkbox="true"
          :check-strictly="true"
          placeholder="请选择权限范围"
          style="width: 100%"
          @change="handlePermissionsChange"
        />
      </el-form-item>
      
      <el-form-item label="工作地点" prop="location">
        <el-tree-select
          v-model="form.location"
          :data="locationData"
          filterable
          placeholder="请选择工作地点"
          style="width: 100%"
          @change="handleLocationChange"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="fillTestData">填充测试数据</el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="submittedData" class="submitted-data">
      <h4>提交的数据：</h4>
      <div class="form-result">
        <p><strong>员工姓名：</strong>{{ submittedData.name }}</p>
        <p><strong>所属部门：</strong>{{ getDepartmentName(submittedData.department) }}</p>
        <p><strong>负责项目：</strong>{{ getProjectNames(submittedData.projects) }}</p>
        <p><strong>权限范围：</strong>{{ getPermissionNames(submittedData.permissions) }}</p>
        <p><strong>工作地点：</strong>{{ getLocationName(submittedData.location) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref()
const submittedData = ref(null)

const form = reactive({
  name: '',
  department: '',
  projects: [],
  permissions: [],
  location: ''
})

const rules = {
  name: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ],
  projects: [
    { required: true, message: '请选择负责的项目', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请选择工作地点', trigger: 'change' }
  ]
}

const departmentData = [
  {
    id: 'tech',
    label: '技术部',
    children: [
      { id: 'frontend', label: '前端组' },
      { id: 'backend', label: '后端组' },
      { id: 'mobile', label: '移动端组' },
      { id: 'test', label: '测试组' }
    ]
  },
  {
    id: 'product',
    label: '产品部',
    children: [
      { id: 'pm', label: '产品经理' },
      { id: 'ui', label: 'UI设计师' },
      { id: 'ue', label: 'UE设计师' }
    ]
  },
  {
    id: 'operation',
    label: '运营部',
    children: [
      { id: 'content', label: '内容运营' },
      { id: 'user', label: '用户运营' },
      { id: 'activity', label: '活动运营' }
    ]
  }
]

const projectData = [
  {
    id: 'web',
    label: 'Web项目',
    children: [
      { id: 'admin', label: '管理后台' },
      { id: 'portal', label: '门户网站' },
      { id: 'ecommerce', label: '电商平台' }
    ]
  },
  {
    id: 'mobile',
    label: '移动端项目',
    children: [
      { id: 'ios', label: 'iOS应用' },
      { id: 'android', label: 'Android应用' },
      { id: 'miniprogram', label: '小程序' }
    ]
  },
  {
    id: 'internal',
    label: '内部系统',
    children: [
      { id: 'hr', label: '人事系统' },
      { id: 'finance', label: '财务系统' },
      { id: 'crm', label: 'CRM系统' }
    ]
  }
]

const permissionData = [
  {
    id: 'system',
    label: '系统管理',
    children: [
      { id: 'user_manage', label: '用户管理' },
      { id: 'role_manage', label: '角色管理' },
      { id: 'permission_manage', label: '权限管理' }
    ]
  },
  {
    id: 'business',
    label: '业务管理',
    children: [
      { id: 'order_manage', label: '订单管理' },
      { id: 'product_manage', label: '商品管理' },
      { id: 'customer_manage', label: '客户管理' }
    ]
  },
  {
    id: 'report',
    label: '报表统计',
    children: [
      { id: 'sales_report', label: '销售报表' },
      { id: 'user_report', label: '用户报表' },
      { id: 'finance_report', label: '财务报表' }
    ]
  }
]

const locationData = [
  {
    id: 'beijing',
    label: '北京',
    children: [
      { id: 'chaoyang', label: '朝阳区' },
      { id: 'haidian', label: '海淀区' },
      { id: 'dongcheng', label: '东城区' }
    ]
  },
  {
    id: 'shanghai',
    label: '上海',
    children: [
      { id: 'huangpu', label: '黄浦区' },
      { id: 'xuhui', label: '徐汇区' },
      { id: 'changning', label: '长宁区' }
    ]
  },
  {
    id: 'guangzhou',
    label: '广州',
    children: [
      { id: 'tianhe', label: '天河区' },
      { id: 'yuexiu', label: '越秀区' },
      { id: 'haizhu', label: '海珠区' }
    ]
  }
]

const handleDepartmentChange = (val) => {
  console.log('部门变化：', val)
}

const handleProjectsChange = (val) => {
  console.log('项目变化：', val)
}

const handlePermissionsChange = (val) => {
  console.log('权限变化：', val)
}

const handleLocationChange = (val) => {
  console.log('地点变化：', val)
}

const submitForm = async () => {
  try {
    await formRef.value.validate()
    submittedData.value = { ...form }
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('请检查表单内容')
  }
}

const resetForm = () => {
  formRef.value.resetFields()
  submittedData.value = null
}

const fillTestData = () => {
  form.name = '张三'
  form.department = 'frontend'
  form.projects = ['admin', 'portal']
  form.permissions = ['user_manage', 'order_manage']
  form.location = 'chaoyang'
  ElMessage.success('已填充测试数据')
}

// 辅助函数：获取名称
const findLabelById = (data, id) => {
  for (const item of data) {
    if (item.id === id) {
      return item.label
    }
    if (item.children) {
      const result = findLabelById(item.children, id)
      if (result) return result
    }
  }
  return id
}

const getDepartmentName = (id) => {
  return findLabelById(departmentData, id)
}

const getProjectNames = (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return '未选择'
  return ids.map(id => findLabelById(projectData, id)).join(', ')
}

const getPermissionNames = (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return '未选择'
  return ids.map(id => findLabelById(permissionData, id)).join(', ')
}

const getLocationName = (id) => {
  return findLabelById(locationData, id)
}
</script>

<style scoped>
.submitted-data {
  margin-top: 20px;
  padding: 16px;
  background-color: #f0f9ff;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.form-result p {
  margin: 8px 0;
  color: #606266;
}

.form-result strong {
  color: #303133;
}
</style>
```

## 实际应用示例

### 组织架构选择器

```vue
<template>
  <div class="org-selector">
    <h3>组织架构管理系统</h3>
    
    <div class="selector-container">
      <div class="selector-section">
        <h4>员工分配</h4>
        <el-form :model="orgForm" :rules="orgRules" ref="orgFormRef" label-width="120px">
          <el-form-item label="员工姓名" prop="employeeName">
            <el-input v-model="orgForm.employeeName" placeholder="请输入员工姓名" />
          </el-form-item>
          
          <el-form-item label="目标部门" prop="targetDepartment">
            <el-tree-select
              v-model="orgForm.targetDepartment"
              :data="organizationData"
              :props="orgProps"
              filterable
              placeholder="请选择目标部门"
              style="width: 100%"
              @change="handleDepartmentSelect"
            />
          </el-form-item>
          
          <el-form-item label="职位级别" prop="level">
            <el-select v-model="orgForm.level" placeholder="请选择职位级别">
              <el-option label="实习生" value="intern" />
              <el-option label="初级" value="junior" />
              <el-option label="中级" value="middle" />
              <el-option label="高级" value="senior" />
              <el-option label="专家" value="expert" />
              <el-option label="管理者" value="manager" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="汇报对象" prop="reportTo">
            <el-tree-select
              v-model="orgForm.reportTo"
              :data="managerData"
              :props="orgProps"
              filterable
              placeholder="请选择汇报对象"
              style="width: 100%"
              :disabled="!orgForm.targetDepartment"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="assignEmployee">分配员工</el-button>
            <el-button @click="resetOrgForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="org-chart">
        <h4>组织架构图</h4>
        <div class="chart-container">
          <el-tree
            :data="organizationData"
            :props="orgProps"
            :expand-on-click-node="false"
            default-expand-all
            class="org-tree"
          >
            <template #default="{ node, data }">
              <div class="org-node">
                <div class="node-info">
                  <span class="node-name">{{ data.name }}</span>
                  <span class="node-type">{{ getNodeTypeText(data.type) }}</span>
                </div>
                <div class="node-stats">
                  <span class="employee-count">{{ data.employeeCount || 0 }}人</span>
                  <span class="manager" v-if="data.manager">负责人: {{ data.manager }}</span>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
    </div>
    
    <div v-if="selectedDepartmentInfo" class="department-info">
      <h4>部门详情</h4>
      <div class="info-content">
        <div class="info-item">
          <label>部门名称：</label>
          <span>{{ selectedDepartmentInfo.name }}</span>
        </div>
        <div class="info-item">
          <label>部门类型：</label>
          <span>{{ getNodeTypeText(selectedDepartmentInfo.type) }}</span>
        </div>
        <div class="info-item">
          <label>员工数量：</label>
          <span>{{ selectedDepartmentInfo.employeeCount || 0 }}人</span>
        </div>
        <div class="info-item">
          <label>部门负责人：</label>
          <span>{{ selectedDepartmentInfo.manager || '未设置' }}</span>
        </div>
        <div class="info-item">
          <label>部门描述：</label>
          <span>{{ selectedDepartmentInfo.description || '暂无描述' }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="assignmentHistory.length > 0" class="assignment-history">
      <h4>分配历史</h4>
      <el-table :data="assignmentHistory" style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="employeeName" label="员工姓名" width="120" />
        <el-table-column prop="departmentName" label="目标部门" width="150" />
        <el-table-column prop="level" label="职位级别" width="100" />
        <el-table-column prop="reportTo" label="汇报对象" width="120" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" @click="viewAssignment(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const orgFormRef = ref()
const assignmentHistory = ref([])

const orgForm = reactive({
  employeeName: '',
  targetDepartment: '',
  level: '',
  reportTo: ''
})

const orgRules = {
  employeeName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  targetDepartment: [{ required: true, message: '请选择目标部门', trigger: 'change' }],
  level: [{ required: true, message: '请选择职位级别', trigger: 'change' }]
}

const orgProps = {
  children: 'children',
  label: 'name',
  value: 'id'
}

const organizationData = ref([
  {
    id: 'company',
    name: '科技有限公司',
    type: 'company',
    employeeCount: 150,
    manager: '张总',
    description: '一家专注于互联网技术的创新公司',
    children: [
      {
        id: 'tech',
        name: '技术部',
        type: 'department',
        employeeCount: 60,
        manager: '李技术总监',
        description: '负责公司所有技术产品的研发',
        children: [
          {
            id: 'frontend',
            name: '前端组',
            type: 'team',
            employeeCount: 15,
            manager: '王前端组长',
            description: '负责Web和移动端前端开发'
          },
          {
            id: 'backend',
            name: '后端组',
            type: 'team',
            employeeCount: 20,
            manager: '赵后端组长',
            description: '负责服务端和API开发'
          },
          {
            id: 'mobile',
            name: '移动端组',
            type: 'team',
            employeeCount: 12,
            manager: '钱移动端组长',
            description: '负责iOS和Android应用开发'
          },
          {
            id: 'test',
            name: '测试组',
            type: 'team',
            employeeCount: 8,
            manager: '孙测试组长',
            description: '负责产品质量保证和测试'
          },
          {
            id: 'devops',
            name: '运维组',
            type: 'team',
            employeeCount: 5,
            manager: '周运维组长',
            description: '负责系统运维和部署'
          }
        ]
      },
      {
        id: 'product',
        name: '产品部',
        type: 'department',
        employeeCount: 25,
        manager: '吴产品总监',
        description: '负责产品规划和设计',
        children: [
          {
            id: 'pm',
            name: '产品经理组',
            type: 'team',
            employeeCount: 8,
            manager: '郑产品经理',
            description: '负责产品需求分析和规划'
          },
          {
            id: 'ui',
            name: 'UI设计组',
            type: 'team',
            employeeCount: 10,
            manager: '冯UI组长',
            description: '负责用户界面设计'
          },
          {
            id: 'ue',
            name: 'UE设计组',
            type: 'team',
            employeeCount: 7,
            manager: '陈UE组长',
            description: '负责用户体验设计'
          }
        ]
      },
      {
        id: 'operation',
        name: '运营部',
        type: 'department',
        employeeCount: 30,
        manager: '褚运营总监',
        description: '负责产品运营和市场推广',
        children: [
          {
            id: 'content',
            name: '内容运营组',
            type: 'team',
            employeeCount: 12,
            manager: '卫内容组长',
            description: '负责内容策划和制作'
          },
          {
            id: 'user',
            name: '用户运营组',
            type: 'team',
            employeeCount: 10,
            manager: '蒋用户组长',
            description: '负责用户增长和留存'
          },
          {
            id: 'activity',
            name: '活动运营组',
            type: 'team',
            employeeCount: 8,
            manager: '沈活动组长',
            description: '负责活动策划和执行'
          }
        ]
      },
      {
        id: 'hr',
        name: '人事部',
        type: 'department',
        employeeCount: 15,
        manager: '韩人事总监',
        description: '负责人力资源管理',
        children: [
          {
            id: 'recruit',
            name: '招聘组',
            type: 'team',
            employeeCount: 6,
            manager: '杨招聘组长',
            description: '负责人才招聘'
          },
          {
            id: 'training',
            name: '培训组',
            type: 'team',
            employeeCount: 5,
            manager: '朱培训组长',
            description: '负责员工培训和发展'
          },
          {
            id: 'admin',
            name: '行政组',
            type: 'team',
            employeeCount: 4,
            manager: '秦行政组长',
            description: '负责行政事务管理'
          }
        ]
      },
      {
        id: 'finance',
        name: '财务部',
        type: 'department',
        employeeCount: 20,
        manager: '尤财务总监',
        description: '负责财务管理和会计',
        children: [
          {
            id: 'accounting',
            name: '会计组',
            type: 'team',
            employeeCount: 12,
            manager: '许会计组长',
            description: '负责日常会计工作'
          },
          {
            id: 'audit',
            name: '审计组',
            type: 'team',
            employeeCount: 8,
            manager: '何审计组长',
            description: '负责内部审计工作'
          }
        ]
      }
    ]
  }
])

const managerData = computed(() => {
  // 根据选择的部门动态生成管理者列表
  if (!orgForm.targetDepartment) return []
  
  const findDepartment = (data, targetId) => {
    for (const item of data) {
      if (item.id === targetId) {
        return item
      }
      if (item.children) {
        const result = findDepartment(item.children, targetId)
        if (result) return result
      }
    }
    return null
  }
  
  const department = findDepartment(organizationData.value, orgForm.targetDepartment)
  if (!department) return []
  
  // 生成该部门的管理者选项
  const managers = []
  if (department.manager) {
    managers.push({
      id: department.id + '_manager',
      name: department.manager
    })
  }
  
  // 添加上级部门的管理者
  const findParent = (data, targetId, parent = null) => {
    for (const item of data) {
      if (item.id === targetId) {
        return parent
      }
      if (item.children) {
        const result = findParent(item.children, targetId, item)
        if (result) return result
      }
    }
    return null
  }
  
  const parentDepartment = findParent(organizationData.value, orgForm.targetDepartment)
  if (parentDepartment && parentDepartment.manager) {
    managers.push({
      id: parentDepartment.id + '_manager',
      name: parentDepartment.manager
    })
  }
  
  return managers
})

const selectedDepartmentInfo = computed(() => {
  if (!orgForm.targetDepartment) return null
  
  const findDepartment = (data, targetId) => {
    for (const item of data) {
      if (item.id === targetId) {
        return item
      }
      if (item.children) {
        const result = findDepartment(item.children, targetId)
        if (result) return result
      }
    }
    return null
  }
  
  return findDepartment(organizationData.value, orgForm.targetDepartment)
})

const getNodeTypeText = (type) => {
  const typeMap = {
    company: '公司',
    department: '部门',
    team: '小组'
  }
  return typeMap[type] || type
}

const handleDepartmentSelect = (val) => {
  console.log('选择部门：', val)
  // 清空汇报对象选择
  orgForm.reportTo = ''
}

const assignEmployee = async () => {
  try {
    await orgFormRef.value.validate()
    
    // 添加到分配历史
    const assignment = {
      time: new Date().toLocaleString(),
      employeeName: orgForm.employeeName,
      departmentName: selectedDepartmentInfo.value?.name || '',
      level: orgForm.level,
      reportTo: managerData.value.find(m => m.id === orgForm.reportTo)?.name || ''
    }
    
    assignmentHistory.value.unshift(assignment)
    
    ElMessage.success('员工分配成功')
    resetOrgForm()
  } catch (error) {
    ElMessage.error('请检查表单内容')
  }
}

const resetOrgForm = () => {
  orgFormRef.value.resetFields()
}

const viewAssignment = (assignment) => {
  ElMessage.info(`查看分配记录：${assignment.employeeName}`)
}
</script>

<style scoped>
.org-selector {
  max-width: 1200px;
  padding: 20px;
}

.selector-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.selector-section {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 16px;
}

.org-chart {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 16px;
}

.chart-container {
  max-height: 400px;
  overflow-y: auto;
}

.org-tree {
  background: transparent;
}

.org-node {
  display: flex;
  flex-direction: column;
  padding: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fafafa;
  margin: 2px 0;
}

.node-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.node-name {
  font-weight: 500;
  color: #303133;
}

.node-type {
  font-size: 12px;
  color: #909399;
  background-color: #e4e7ed;
  padding: 2px 6px;
  border-radius: 2px;
}

.node-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #606266;
}

.employee-count {
  color: #409eff;
  font-weight: 500;
}

.department-info {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
  background-color: #f5f7fa;
}

.info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  min-width: 100px;
  font-weight: 500;
  color: #303133;
  margin-right: 8px;
}

.info-item span {
  color: #606266;
}

.assignment-history {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 16px;
}
</style>
```

## API

### TreeSelect Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model-value / v-model | 绑定值 | string / number / array | — |
| data | 展示数据 | array | — |
| multiple | 是否多选 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| size | 输入框尺寸 | string | — |
| clearable | 是否可以清空选项 | boolean | false |
| collapse-tags | 多选时是否将选中值按文字的形式展示 | boolean | false |
| collapse-tags-tooltip | 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签 | boolean | false |
| multiple-limit | 多选时用户最多可以选择的项目数，为 0 则不限制 | number | 0 |
| name | select input 的 name 属性 | string | — |
| effect | Tooltip 主题，内置了 dark / light 两种主题 | string | light |
| autocomplete | select input 的 autocomplete 属性 | string | off |
| placeholder | 占位符 | string | 请选择 |
| filterable | 是否可搜索 | boolean | false |
| allow-create | 是否允许用户创建新条目 | boolean | false |
| filter-node-method | 对树节点进行筛选时执行的方法 | function | — |
| remote | 是否为远程搜索 | boolean | false |
| remote-method | 远程搜索方法 | function | — |
| loading | 是否正在从远程获取数据 | boolean | false |
| loading-text | 远程加载时显示的文字 | string | 加载中 |
| no-match-text | 搜索条件无匹配时显示的文字 | string | 无匹配数据 |
| no-data-text | 选项为空时显示的文字 | string | 无数据 |
| props | 配置选项 | object | — |
| node-key | 每个树节点用来作为唯一标识的属性 | string | — |
| default-expand-all | 是否默认展开所有节点 | boolean | false |
| expand-on-click-node | 是否在点击节点的时候展开或者收缩节点 | boolean | true |
| check-on-click-node | 是否在点击节点的时候选中节点 | boolean | false |
| auto-expand-parent | 展开子节点的时候是否自动展开父节点 | boolean | true |
| default-expanded-keys | 默认展开的节点的 key 的数组 | array | — |
| show-checkbox | 节点是否可被选择 | boolean | false |
| check-strictly | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法 | boolean | false |
| default-checked-keys | 默认勾选的节点的 key 的数组 | array | — |
| current-node-key | 当前选中的节点 | string / number | — |
| filter-method | 对数据进行筛选时使用的方法 | function | — |
| accordion | 是否每次只打开一个同级树节点展开 | boolean | false |
| indent | 相邻级节点间的水平缩进，单位为像素 | number | 18 |
| icon | 自定义树节点的图标 | string / Component | — |
| lazy | 是否懒加载子节点，需与 load 方法结合使用 | boolean | false |
| load | 加载子树数据的方法，仅当 lazy 属性为true 时生效 | function | — |
| render-after-expand | 是否在第一次展开某个树节点后才渲染其子节点 | boolean | true |
| default-expand-all | 是否默认展开所有节点 | boolean | false |
| highlight-current | 是否高亮当前选中节点 | boolean | false |

### TreeSelect Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 选中值发生变化时触发 | 目前的选中值 |
| visible-change | 下拉框出现/隐藏时触发 | 出现则为 true，隐藏则为 false |
| remove-tag | 多选模式下移除tag时触发 | 移除的tag值 |
| clear | 可清空的单选模式下用户点击清空按钮时触发 | — |
| blur | 当 input 失去焦点时触发 | (event: Event) |
| focus | 当 input 获得焦点时触发 | (event: Event) |
| node-click | 节点被点击时的回调 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
| node-contextmenu | 当某一节点被鼠标右键点击时会触发该事件 | 共四个参数，依次为：event、传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
| node-expand | 节点被展开时触发的事件 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
| node-collapse | 节点被关闭时触发的事件 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
| check-change | 节点选中状态发生变化时的回调 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点 |
| check | 当复选框被点击的时候触发 | 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象 |
| current-change | 当前选中节点变化时触发的事件 | 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象 |

### TreeSelect Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| default | 自定义树节点的内容 | { node, data } |
| prefix | Select 组件头部内容 | — |
| empty | 无选项时的列表 | — |

### TreeSelect Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| filter | 对树节点进行筛选操作 | 接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数 |
| updateKeyChildren | 通过 keys 设置节点子元素，使用此方法必须设置 node-key 属性 | (key, data) 接收两个参数，1. 节点 key 2. 节点数据的数组 |
| getCheckedNodes | 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组 | (leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false |
| setCheckedNodes | 设置目前勾选的节点，使用此方法必须设置 node-key 属性 | (nodes) 接收勾选节点数据的数组 |
| getCheckedKeys | 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组 | (leafOnly) 接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点的 keys，默认值为 false |
| setCheckedKeys | 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性 | (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型，若为 true 则仅设置叶子节点的选中状态，默认值为 false |
| setChecked | 通过 key / data 设置某个节点的勾选状态，使用此方法必须设置 node-key 属性 | (key/data, checked, deep) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false |
| getHalfCheckedNodes | 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组 | — |
| getHalfCheckedKeys | 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组 | — |
| getCurrentKey | 获取当前被焦点选中的节点的 key，使用此方法必须设置 node-key 属性 | — |
| getCurrentNode | 获取当前被焦点选中的节点的 data，若没有节点被选中则返回 null | — |
| setCurrentKey | 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性 | (key) 待被选节点的 key，若为 null 则取消当前高亮的节点 |
| setCurrentNode | 通过 node 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性 | (node) 待被选节点的 node |
| getNode | 根据 data 或者 key 拿到 Tree 组件中的 node | (data) 要获得 node 的 key 或者 data |
| remove | 删除 Tree 中的一个节点，使用此方法必须设置 node-key 属性 | (data) 要删除的节点的 data 或者 node |
| append | 为 Tree 中的一个节点追加一个子节点，使用此方法必须设置 node-key 属性 | (data, parentNode) 接收两个参数，1. 要追加的子节点的 data 2. 子节点的 parent 的 data、key 或者 node |
| insertBefore | 为 Tree 的一个节点的前面增加一个节点，使用此方法必须设置 node-key 属性 | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的位置参考节点的 data、key 或者 node |
| insertAfter | 为 Tree 的一个节点的后面增加一个节点，使用此方法必须设置 node-key 属性 | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的位置参考节点的 data、key 或者 node |

### Props 配置

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 指定节点标签为节点对象的某个属性值 | string, function(data, node) | — |
| label | 指定节点标签为节点对象的某个属性值 | string, function(data, node) | — |
| children | 指定子树为节点对象的某个属性值 | string | — |
| disabled | 指定节点选择框是否禁用为节点对象的某个属性值 | string, function(data, node) | — |
| isLeaf | 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 | string, function(data, node) | — |
| class | 自定义节点类名 | string, function(data, node) | — |

## 最佳实践

### 数据结构设计

1. **统一的数据格式**
   - 保持数据结构的一致性
   - 使用标准的 id、label、children 字段
   - 为每个节点提供唯一标识

2. **合理的层级深度**
   - 避免过深的层级结构（建议不超过5层）
   - 考虑用户的认知负担
   - 必要时使用懒加载减少初始数据量

3. **性能优化**
   - 大数据量时使用懒加载
   - 合理使用 render-after-expand
   - 避免在数据中包含不必要的字段

### 用户体验优化

1. **搜索功能**
   - 为大数据量场景提供搜索功能
   - 实现智能的搜索匹配算法
   - 提供搜索结果的高亮显示

2. **加载状态**
   - 为懒加载提供明确的加载提示
   - 处理加载失败的情况
   - 提供重试机制

3. **错误处理**
   - 优雅处理数据加载错误
   - 提供有意义的错误提示
   - 实现降级方案

### 表单集成

1. **验证规则**
   - 设置合适的必填验证
   - 提供清晰的错误提示
   - 考虑多选时的数量限制

2. **数据绑定**
   - 正确处理单选和多选的数据格式
   - 实现数据的双向绑定
   - 处理默认值的设置

3. **联动效果**
   - 实现级联选择的联动
   - 处理依赖关系的更新
   - 保持数据的一致性

## 常见问题

### 数据相关问题

**Q: 如何处理动态数据更新？**

A: 可以通过响应式数据更新来实现：

```javascript
// 更新整个数据
data.value = newData

// 更新特定节点
const updateNode = (nodes, targetId, newData) => {
  for (let node of nodes) {
    if (node.id === targetId) {
      Object.assign(node, newData)
      return true
    }
    if (node.children && updateNode(node.children, targetId, newData)) {
      return true
    }
  }
  return false
}
```

**Q: 如何实现节点的动态添加和删除？**

A: 使用组件提供的方法：

```javascript
// 添加节点
treeSelectRef.value.append(newNodeData, parentNode)

// 删除节点
treeSelectRef.value.remove(nodeData)

// 插入节点
treeSelectRef.value.insertBefore(newNodeData, referenceNode)
```

### 选择相关问题

**Q: 如何实现父子节点的关联选择？**

A: 通过 `check-strictly` 属性控制：

```vue
<!-- 父子关联 -->
<el-tree-select
  v-model="value"
  :data="data"
  multiple
  :show-checkbox="true"
  :check-strictly="false"
/>

<!-- 父子不关联 -->
<el-tree-select
  v-model="value"
  :data="data"
  multiple
  :show-checkbox="true"
  :check-strictly="true"
/>
```

**Q: 如何获取选中节点的完整路径？**

A: 可以通过递归查找实现：

```javascript
const getNodePath = (nodes, targetId, path = []) => {
  for (let node of nodes) {
    const currentPath = [...path, node]
    if (node.id === targetId) {
      return currentPath
    }
    if (node.children) {
      const result = getNodePath(node.children, targetId, currentPath)
      if (result) return result
    }
  }
  return null
}
```

### 性能相关问题

**Q: 大数据量时如何优化性能？**

A: 采用以下策略：

1. 使用懒加载
2. 启用虚拟滚动（如果支持）
3. 减少不必要的数据字段
4. 使用 `render-after-expand`
5. 合理设置 `default-expand-all`

**Q: 如何处理搜索性能问题？**

A: 实现防抖搜索：

```javascript
import { debounce } from 'lodash-es'

const debouncedFilter = debounce((value) => {
  treeSelectRef.value.filter(value)
}, 300)
```

### 样式相关问题

**Q: 如何自定义节点样式？**

A: 使用插槽和 CSS：

```vue
<el-tree-select v-model="value" :data="data">
  <template #default="{ node, data }">
    <span class="custom-tree-node">
      <span class="node-label">{{ data.label }}</span>
      <span class="node-count" v-if="data.count">({{ data.count }})</span>
    </span>
  </template>
</el-tree-select>

<style>
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.node-count {
  color: #999;
  font-size: 12px;
}
</style>
```

## 实际应用示例

### 组织架构选择器

这个示例展示了如何创建一个完整的组织架构选择器，支持搜索、懒加载和权限控制。

```vue
<template>
  <div class="org-selector">
    <h4>组织架构选择器</h4>
    
    <div class="selector-controls">
      <el-button @click="expandAll">展开全部</el-button>
      <el-button @click="collapseAll">收起全部</el-button>
      <el-button @click="getSelectedInfo">获取选择信息</el-button>
      <el-button @click="clearSelection">清空选择</el-button>
    </div>
    
    <div class="selector-container">
      <el-tree-select
        ref="orgTreeRef"
        v-model="selectedOrg"
        :data="orgData"
        :props="orgProps"
        multiple
        :show-checkbox="true"
        filterable
        :filter-node-method="filterOrgNode"
        lazy
        :load="loadOrgNode"
        placeholder="请选择组织架构"
        style="width: 100%"
        @change="handleOrgChange"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <div class="org-node">
            <el-icon v-if="data.type === 'company'" class="node-icon company">
              <OfficeBuilding />
            </el-icon>
            <el-icon v-else-if="data.type === 'department'" class="node-icon department">
              <Folder />
            </el-icon>
            <el-icon v-else class="node-icon person">
              <User />
            </el-icon>
            <span class="node-label">{{ data.label }}</span>
            <span v-if="data.count" class="node-count">({{ data.count }})</span>
            <el-tag v-if="data.disabled" size="small" type="info">禁用</el-tag>
          </div>
        </template>
      </el-tree-select>
    </div>
    
    <div v-if="selectedInfo" class="selection-info">
      <h5>选择信息：</h5>
      <div class="info-content">
        <p><strong>选中数量：</strong>{{ selectedInfo.count }}</p>
        <p><strong>公司数量：</strong>{{ selectedInfo.companies }}</p>
        <p><strong>部门数量：</strong>{{ selectedInfo.departments }}</p>
        <p><strong>人员数量：</strong>{{ selectedInfo.persons }}</p>
        <div class="selected-list">
          <h6>选中项目：</h6>
          <el-tag
            v-for="item in selectedInfo.items"
            :key="item.id"
            :type="getTagType(item.type)"
            class="selected-tag"
          >
            {{ item.label }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { OfficeBuilding, Folder, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const orgTreeRef = ref()
const selectedOrg = ref([])
const selectedInfo = ref(null)

const orgData = ref([
  {
    id: 'company-1',
    label: '总公司',
    type: 'company',
    isLeaf: false,
    count: 1250
  }
])

const orgProps = {
  value: 'id',
  label: 'label',
  children: 'children',
  isLeaf: 'isLeaf',
  disabled: 'disabled'
}

const loadOrgNode = (node, resolve) => {
  setTimeout(() => {
    let children = []
    
    if (node.level === 0) {
      // 加载一级部门
      children = [
        { id: 'dept-tech', label: '技术部', type: 'department', isLeaf: false, count: 45 },
        { id: 'dept-product', label: '产品部', type: 'department', isLeaf: false, count: 23 },
        { id: 'dept-sales', label: '销售部', type: 'department', isLeaf: false, count: 67 },
        { id: 'dept-hr', label: '人事部', type: 'department', isLeaf: false, count: 12 },
        { id: 'dept-finance', label: '财务部', type: 'department', isLeaf: true, count: 8, disabled: true }
      ]
    } else if (node.level === 1) {
      // 加载二级部门或人员
      if (node.data.id === 'dept-tech') {
        children = [
          { id: 'team-frontend', label: '前端组', type: 'department', isLeaf: false, count: 15 },
          { id: 'team-backend', label: '后端组', type: 'department', isLeaf: false, count: 18 },
          { id: 'team-mobile', label: '移动端组', type: 'department', isLeaf: false, count: 8 },
          { id: 'team-test', label: '测试组', type: 'department', isLeaf: false, count: 4 }
        ]
      } else if (node.data.id === 'dept-product') {
        children = [
          { id: 'person-pm1', label: '张三 - 产品经理', type: 'person', isLeaf: true },
          { id: 'person-pm2', label: '李四 - 产品经理', type: 'person', isLeaf: true },
          { id: 'person-ui1', label: '王五 - UI设计师', type: 'person', isLeaf: true },
          { id: 'person-ui2', label: '赵六 - UI设计师', type: 'person', isLeaf: true }
        ]
      }
    } else if (node.level === 2) {
      // 加载具体人员
      if (node.data.id === 'team-frontend') {
        children = [
          { id: 'person-fe1', label: '前端工程师 - 小明', type: 'person', isLeaf: true },
          { id: 'person-fe2', label: '前端工程师 - 小红', type: 'person', isLeaf: true },
          { id: 'person-fe3', label: '前端架构师 - 老王', type: 'person', isLeaf: true }
        ]
      }
    }
    
    resolve(children)
  }, 800)
}

const filterOrgNode = (value, data) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

const handleOrgChange = (value) => {
  console.log('组织选择变化：', value)
  getSelectedInfo()
}

const handleNodeClick = (data, node) => {
  console.log('节点点击：', data, node)
}

const expandAll = () => {
  // 展开所有节点的实现
  ElMessage.success('已展开全部节点')
}

const collapseAll = () => {
  // 收起所有节点的实现
  ElMessage.success('已收起全部节点')
}

const getSelectedInfo = () => {
  if (!selectedOrg.value.length) {
    selectedInfo.value = null
    return
  }
  
  // 获取选中节点的详细信息
  const checkedNodes = orgTreeRef.value?.getCheckedNodes() || []
  
  const info = {
    count: checkedNodes.length,
    companies: checkedNodes.filter(node => node.type === 'company').length,
    departments: checkedNodes.filter(node => node.type === 'department').length,
    persons: checkedNodes.filter(node => node.type === 'person').length,
    items: checkedNodes.map(node => ({
      id: node.id,
      label: node.label,
      type: node.type
    }))
  }
  
  selectedInfo.value = info
}

const clearSelection = () => {
  selectedOrg.value = []
  selectedInfo.value = null
  ElMessage.success('已清空选择')
}

const getTagType = (type) => {
  switch (type) {
    case 'company': return 'danger'
    case 'department': return 'warning'
    case 'person': return 'success'
    default: return ''
  }
}
</script>

<style scoped>
.org-selector {
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
}

.selector-controls {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.selector-container {
  margin-bottom: 16px;
}

.org-node {
  display: flex;
  align-items: center;
  width: 100%;
}

.node-icon {
  margin-right: 6px;
  font-size: 14px;
}

.node-icon.company {
  color: #e6a23c;
}

.node-icon.department {
  color: #409eff;
}

.node-icon.person {
  color: #67c23a;
}

.node-label {
  flex: 1;
  margin-right: 8px;
}

.node-count {
  color: #909399;
  font-size: 12px;
  margin-right: 8px;
}

.selection-info {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.selection-info h5 {
  margin: 0 0 12px 0;
  color: #303133;
}

.info-content p {
  margin: 6px 0;
  color: #606266;
}

.selected-list {
  margin-top: 12px;
}

.selected-list h6 {
  margin: 0 0 8px 0;
  color: #303133;
}

.selected-tag {
  margin: 2px 4px 2px 0;
}
</style>
```

### 地区选择器

这个示例展示了如何创建一个地区选择器，支持省市区三级联动。

```vue
<template>
  <div class="region-selector">
    <h4>地区选择器</h4>
    
    <div class="selector-modes">
      <el-radio-group v-model="selectorMode" @change="handleModeChange">
        <el-radio-button label="single">单选模式</el-radio-button>
        <el-radio-button label="multiple">多选模式</el-radio-button>
      </el-radio-group>
    </div>
    
    <div class="region-container">
      <el-tree-select
        v-model="selectedRegion"
        :data="regionData"
        :props="regionProps"
        :multiple="selectorMode === 'multiple'"
        :show-checkbox="selectorMode === 'multiple'"
        filterable
        :filter-node-method="filterRegionNode"
        placeholder="请选择地区"
        style="width: 100%"
        @change="handleRegionChange"
      >
        <template #default="{ node, data }">
          <div class="region-node">
            <el-icon v-if="data.level === 'province'" class="region-icon province">
              <Location />
            </el-icon>
            <el-icon v-else-if="data.level === 'city'" class="region-icon city">
              <OfficeBuilding />
            </el-icon>
            <el-icon v-else class="region-icon district">
              <MapLocation />
            </el-icon>
            <span class="region-label">{{ data.label }}</span>
            <span v-if="data.code" class="region-code">[{{ data.code }}]</span>
          </div>
        </template>
      </el-tree-select>
    </div>
    
    <div v-if="regionInfo" class="region-info">
      <h5>选择信息：</h5>
      <div class="info-grid">
        <div class="info-item">
          <label>选择模式：</label>
          <span>{{ selectorMode === 'single' ? '单选' : '多选' }}</span>
        </div>
        <div class="info-item">
          <label>选中值：</label>
          <span>{{ formatSelectedValue() }}</span>
        </div>
        <div class="info-item">
          <label>完整路径：</label>
          <span>{{ regionInfo.fullPath }}</span>
        </div>
        <div class="info-item">
          <label>行政级别：</label>
          <span>{{ regionInfo.level }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Location, OfficeBuilding, MapLocation } from '@element-plus/icons-vue'

const selectorMode = ref('single')
const selectedRegion = ref('')
const regionInfo = ref(null)

const regionProps = {
  value: 'code',
  label: 'label',
  children: 'children'
}

const regionData = ref([
  {
    code: '110000',
    label: '北京市',
    level: 'province',
    children: [
      {
        code: '110100',
        label: '北京市',
        level: 'city',
        children: [
          { code: '110101', label: '东城区', level: 'district' },
          { code: '110102', label: '西城区', level: 'district' },
          { code: '110105', label: '朝阳区', level: 'district' },
          { code: '110106', label: '丰台区', level: 'district' },
          { code: '110107', label: '石景山区', level: 'district' },
          { code: '110108', label: '海淀区', level: 'district' },
          { code: '110109', label: '门头沟区', level: 'district' },
          { code: '110111', label: '房山区', level: 'district' },
          { code: '110112', label: '通州区', level: 'district' },
          { code: '110113', label: '顺义区', level: 'district' },
          { code: '110114', label: '昌平区', level: 'district' },
          { code: '110115', label: '大兴区', level: 'district' },
          { code: '110116', label: '怀柔区', level: 'district' },
          { code: '110117', label: '平谷区', level: 'district' },
          { code: '110118', label: '密云区', level: 'district' },
          { code: '110119', label: '延庆区', level: 'district' }
        ]
      }
    ]
  },
  {
    code: '310000',
    label: '上海市',
    level: 'province',
    children: [
      {
        code: '310100',
        label: '上海市',
        level: 'city',
        children: [
          { code: '310101', label: '黄浦区', level: 'district' },
          { code: '310104', label: '徐汇区', level: 'district' },
          { code: '310105', label: '长宁区', level: 'district' },
          { code: '310106', label: '静安区', level: 'district' },
          { code: '310107', label: '普陀区', level: 'district' },
          { code: '310109', label: '虹口区', level: 'district' },
          { code: '310110', label: '杨浦区', level: 'district' },
          { code: '310112', label: '闵行区', level: 'district' },
          { code: '310113', label: '宝山区', level: 'district' },
          { code: '310114', label: '嘉定区', level: 'district' },
          { code: '310115', label: '浦东新区', level: 'district' },
          { code: '310116', label: '金山区', level: 'district' },
          { code: '310117', label: '松江区', level: 'district' },
          { code: '310118', label: '青浦区', level: 'district' },
          { code: '310120', label: '奉贤区', level: 'district' },
          { code: '310151', label: '崇明区', level: 'district' }
        ]
      }
    ]
  },
  {
    code: '440000',
    label: '广东省',
    level: 'province',
    children: [
      {
        code: '440100',
        label: '广州市',
        level: 'city',
        children: [
          { code: '440103', label: '荔湾区', level: 'district' },
          { code: '440104', label: '越秀区', level: 'district' },
          { code: '440105', label: '海珠区', level: 'district' },
          { code: '440106', label: '天河区', level: 'district' },
          { code: '440111', label: '白云区', level: 'district' },
          { code: '440112', label: '黄埔区', level: 'district' },
          { code: '440113', label: '番禺区', level: 'district' },
          { code: '440114', label: '花都区', level: 'district' },
          { code: '440115', label: '南沙区', level: 'district' },
          { code: '440117', label: '从化区', level: 'district' },
          { code: '440118', label: '增城区', level: 'district' }
        ]
      },
      {
        code: '440300',
        label: '深圳市',
        level: 'city',
        children: [
          { code: '440303', label: '罗湖区', level: 'district' },
          { code: '440304', label: '福田区', level: 'district' },
          { code: '440305', label: '南山区', level: 'district' },
          { code: '440306', label: '宝安区', level: 'district' },
          { code: '440307', label: '龙岗区', level: 'district' },
          { code: '440308', label: '盐田区', level: 'district' },
          { code: '440309', label: '龙华区', level: 'district' },
          { code: '440310', label: '坪山区', level: 'district' },
          { code: '440311', label: '光明区', level: 'district' }
        ]
      }
    ]
  }
])

const filterRegionNode = (value, data) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase()) ||
         (data.code && data.code.includes(value))
}

const handleModeChange = (mode) => {
  selectedRegion.value = mode === 'multiple' ? [] : ''
  regionInfo.value = null
}

const handleRegionChange = (value) => {
  console.log('地区选择变化：', value)
  updateRegionInfo(value)
}

const updateRegionInfo = (value) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    regionInfo.value = null
    return
  }
  
  const targetCode = Array.isArray(value) ? value[0] : value
  const nodeInfo = findNodeByCode(regionData.value, targetCode)
  
  if (nodeInfo) {
    regionInfo.value = {
      fullPath: nodeInfo.path.map(node => node.label).join(' / '),
      level: getLevelText(nodeInfo.node.level)
    }
  }
}

const findNodeByCode = (nodes, targetCode, path = []) => {
  for (const node of nodes) {
    const currentPath = [...path, node]
    if (node.code === targetCode) {
      return { node, path: currentPath }
    }
    if (node.children) {
      const result = findNodeByCode(node.children, targetCode, currentPath)
      if (result) return result
    }
  }
  return null
}

const getLevelText = (level) => {
  const levelMap = {
    province: '省/直辖市',
    city: '市',
    district: '区/县'
  }
  return levelMap[level] || level
}

const formatSelectedValue = () => {
  if (!selectedRegion.value) return '未选择'
  if (Array.isArray(selectedRegion.value)) {
    return selectedRegion.value.length > 0 ? selectedRegion.value.join(', ') : '未选择'
  }
  return selectedRegion.value
}
</script>

<style scoped>
.region-selector {
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
}

.selector-modes {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.region-container {
  margin-bottom: 16px;
}

.region-node {
  display: flex;
  align-items: center;
  width: 100%;
}

.region-icon {
  margin-right: 6px;
  font-size: 14px;
}

.region-icon.province {
  color: #e6a23c;
}

.region-icon.city {
  color: #409eff;
}

.region-icon.district {
  color: #67c23a;
}

.region-label {
  flex: 1;
  margin-right: 8px;
}

.region-code {
  color: #909399;
  font-size: 12px;
}

.region-info {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.region-info h5 {
  margin: 0 0 12px 0;
  color: #303133;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.info-item {
  display: flex;
}

.info-item label {
  min-width: 80px;
  font-weight: 500;
  color: #303133;
  margin-right: 8px;
}

.info-item span {
  color: #606266;
}
</style>
```

## 总结

TreeSelect 树形选择组件是 Element Plus 中功能强大的表单组件之一，具有以下特点：

- **功能丰富**：支持单选、多选、搜索、懒加载等多种功能
- **数据灵活**：支持树形数据结构，适用于层级关系的数据选择
- **性能优化**：提供懒加载、渲染优化等性能优化方案
- **用户体验**：内置搜索、过滤、禁用等用户体验优化
- **高度定制**：支持自定义节点内容、样式和行为
- **表单集成**：与 el-form 完美集成，支持验证和数据绑定

TreeSelect 特别适用于组织架构选择、地区选择、分类目录选择等具有层级关系的数据选择场景。合理使用 TreeSelect 可以大大提升用户在处理层级数据时的操作效率和体验。

## 参考资料

- [Element Plus TreeSelect 官方文档](https://element-plus.org/zh-CN/component/tree-select)
- [Element Plus Tree 组件文档](https://element-plus.org/zh-CN/component/tree)
- [Vue 3 响应式数据](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [JavaScript 树形数据结构处理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)