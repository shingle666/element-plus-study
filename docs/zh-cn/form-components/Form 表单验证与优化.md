# 表单验证与优化

## 概述

Element Plus 的 Form 组件提供了强大的表单验证功能，支持同步和异步验证、自定义验证规则、跨字段验证等高级特性。本文档将深入探讨表单验证的各种应用场景和性能优化策略。

### 主要特性
- **灵活的验证规则**：支持内置和自定义验证规则
- **异步验证支持**：处理需要服务器验证的场景
- **实时验证反馈**：提供即时的用户输入反馈
- **跨字段验证**：支持字段间的关联验证
- **性能优化**：防抖、懒加载等优化策略
- **无障碍支持**：完善的可访问性设计
- **国际化支持**：多语言错误信息

### 适用场景
- **用户注册表单**：复杂的用户信息验证
- **数据录入系统**：大量字段的批量验证
- **配置管理界面**：动态表单验证
- **审核流程表单**：多步骤验证流程
- **金融交易表单**：高安全性要求的验证
- **问卷调查系统**：条件性验证逻辑

## 学习内容
1. 理论学习：高级表单验证
2. 实践：复杂验证规则
3. 理论学习：表单性能优化
4. 实践：大型表单优化
5. 理论学习：表单最佳实践
6. 实践：表单重构优化
7. 表单系统总结

## 详细学习内容

### 1. 高级表单验证

#### 1.1 基础验证规则

Element Plus 基于 [async-validator](https://github.com/yiminghe/async-validator) 提供验证功能：

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model.number="form.age" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const formRef = ref()
const form = reactive({
  username: '',
  email: '',
  age: ''
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', message: '年龄必须为数字值', trigger: 'blur' },
    { min: 18, max: 100, message: '年龄必须在 18 到 100 之间', trigger: 'blur' }
  ]
})

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('表单验证通过！', form)
    } else {
      console.log('表单验证失败！')
    }
  })
}
</script>
```

#### 1.2 自定义验证规则

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="form.confirmPassword" type="password" />
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model="form.phone" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const formRef = ref()
const form = reactive({
  password: '',
  confirmPassword: '',
  phone: ''
})

// 自定义验证函数
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
    callback(new Error('密码必须包含大小写字母和数字'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validatePhone = (rule, value, callback) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else if (!phoneRegex.test(value)) {
    callback(new Error('请输入正确的手机号格式'))
  } else {
    callback()
  }
}

const rules = reactive({
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
  phone: [{ validator: validatePhone, trigger: 'blur' }]
})
</script>
```

#### 1.3 异步验证处理

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="输入用户名检查是否可用" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="输入邮箱检查是否已注册" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const formRef = ref()
const form = reactive({
  username: '',
  email: ''
})

// 模拟异步验证用户名是否可用
const validateUsernameAsync = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
    return
  }
  
  // 模拟API调用
  setTimeout(() => {
    // 模拟服务器验证逻辑
    const existingUsers = ['admin', 'user', 'test']
    if (existingUsers.includes(value)) {
      callback(new Error('用户名已存在'))
    } else {
      callback()
    }
  }, 1000)
}

// 模拟异步验证邮箱是否已注册
const validateEmailAsync = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入邮箱'))
    return
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    callback(new Error('请输入正确的邮箱格式'))
    return
  }
  
  // 模拟API调用检查邮箱是否已注册
  fetch('/api/check-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: value })
  })
  .then(response => response.json())
  .then(data => {
    if (data.exists) {
      callback(new Error('邮箱已被注册'))
    } else {
      callback()
    }
  })
  .catch(() => {
    callback(new Error('验证失败，请重试'))
  })
}

const rules = reactive({
  username: [{ validator: validateUsernameAsync, trigger: 'blur' }],
  email: [{ validator: validateEmailAsync, trigger: 'blur' }]
})
</script>
```

#### 1.4 跨字段验证

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="开始日期" prop="startDate">
      <el-date-picker v-model="form.startDate" type="date" />
    </el-form-item>
    <el-form-item label="结束日期" prop="endDate">
      <el-date-picker v-model="form.endDate" type="date" />
    </el-form-item>
    <el-form-item label="最小值" prop="minValue">
      <el-input-number v-model="form.minValue" />
    </el-form-item>
    <el-form-item label="最大值" prop="maxValue">
      <el-input-number v-model="form.maxValue" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const formRef = ref()
const form = reactive({
  startDate: '',
  endDate: '',
  minValue: 0,
  maxValue: 100
})

// 验证结束日期必须大于开始日期
const validateEndDate = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择结束日期'))
    return
  }
  
  if (form.startDate && new Date(value) <= new Date(form.startDate)) {
    callback(new Error('结束日期必须大于开始日期'))
  } else {
    callback()
  }
}

// 验证最大值必须大于最小值
const validateMaxValue = (rule, value, callback) => {
  if (value === null || value === undefined) {
    callback(new Error('请输入最大值'))
    return
  }
  
  if (value <= form.minValue) {
    callback(new Error('最大值必须大于最小值'))
  } else {
    callback()
  }
}

const rules = reactive({
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  endDate: [
    { validator: validateEndDate, trigger: 'change' }
  ],
  minValue: [
    { required: true, message: '请输入最小值', trigger: 'blur' }
  ],
  maxValue: [
    { validator: validateMaxValue, trigger: 'blur' }
  ]
})

// 监听开始日期变化，重新验证结束日期
watch(() => form.startDate, () => {
  if (form.endDate) {
    formRef.value?.validateField('endDate')
  }
})

// 监听最小值变化，重新验证最大值
watch(() => form.minValue, () => {
  if (form.maxValue !== null && form.maxValue !== undefined) {
    formRef.value?.validateField('maxValue')
  }
})
</script>
```

#### 1.5 条件验证逻辑

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="用户类型" prop="userType">
      <el-select v-model="form.userType" @change="handleUserTypeChange">
        <el-option label="个人用户" value="personal" />
        <el-option label="企业用户" value="enterprise" />
      </el-select>
    </el-form-item>
    
    <el-form-item v-if="form.userType === 'personal'" label="身份证号" prop="idCard">
      <el-input v-model="form.idCard" />
    </el-form-item>
    
    <el-form-item v-if="form.userType === 'enterprise'" label="营业执照号" prop="businessLicense">
      <el-input v-model="form.businessLicense" />
    </el-form-item>
    
    <el-form-item v-if="form.userType === 'enterprise'" label="法人代表" prop="legalRepresentative">
      <el-input v-model="form.legalRepresentative" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const formRef = ref()
const form = reactive({
  userType: '',
  idCard: '',
  businessLicense: '',
  legalRepresentative: ''
})

// 身份证验证
const validateIdCard = (rule, value, callback) => {
  if (form.userType !== 'personal') {
    callback()
    return
  }
  
  if (!value) {
    callback(new Error('请输入身份证号'))
    return
  }
  
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!idCardRegex.test(value)) {
    callback(new Error('请输入正确的身份证号'))
  } else {
    callback()
  }
}

// 营业执照验证
const validateBusinessLicense = (rule, value, callback) => {
  if (form.userType !== 'enterprise') {
    callback()
    return
  }
  
  if (!value) {
    callback(new Error('请输入营业执照号'))
    return
  }
  
  if (value.length !== 18) {
    callback(new Error('营业执照号应为18位'))
  } else {
    callback()
  }
}

const rules = reactive({
  userType: [
    { required: true, message: '请选择用户类型', trigger: 'change' }
  ],
  idCard: [
    { validator: validateIdCard, trigger: 'blur' }
  ],
  businessLicense: [
    { validator: validateBusinessLicense, trigger: 'blur' }
  ],
  legalRepresentative: [
    {
      required: true,
      message: '请输入法人代表',
      trigger: 'blur',
      // 只有企业用户才需要验证
      validator: (rule, value, callback) => {
        if (form.userType === 'enterprise' && !value) {
          callback(new Error('请输入法人代表'))
        } else {
          callback()
        }
      }
    }
  ]
})

// 用户类型改变时清空相关字段
const handleUserTypeChange = () => {
  form.idCard = ''
  form.businessLicense = ''
  form.legalRepresentative = ''
  
  // 清除验证状态
  formRef.value?.clearValidate(['idCard', 'businessLicense', 'legalRepresentative'])
}
</script>
```

### 2. 表单性能优化

#### 2.1 验证防抖处理

防抖可以避免频繁的验证操作，提升用户体验：

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="用户名" prop="username">
      <el-input 
        v-model="form.username" 
        @input="handleUsernameInput"
        placeholder="输入用户名进行实时验证"
      />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input 
        v-model="form.email" 
        @input="handleEmailInput"
        placeholder="输入邮箱进行实时验证"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { debounce } from 'lodash-es'

const formRef = ref()
const form = reactive({
  username: '',
  email: ''
})

// 防抖验证用户名
const debouncedValidateUsername = debounce(() => {
  formRef.value?.validateField('username')
}, 500)

// 防抖验证邮箱
const debouncedValidateEmail = debounce(() => {
  formRef.value?.validateField('email')
}, 500)

const handleUsernameInput = () => {
  debouncedValidateUsername()
}

const handleEmailInput = () => {
  debouncedValidateEmail()
}

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
})
</script>
```

#### 2.2 大型表单渲染优化

对于包含大量字段的表单，可以使用虚拟滚动和分组渲染：

```vue
<template>
  <div class="large-form-container">
    <el-form :model="form" :rules="rules" ref="formRef">
      <!-- 基础信息组 -->
      <el-collapse v-model="activeGroups">
        <el-collapse-item title="基础信息" name="basic">
          <div class="form-group">
            <el-row :gutter="20">
              <el-col :span="12" v-for="field in basicFields" :key="field.prop">
                <el-form-item :label="field.label" :prop="field.prop">
                  <component 
                    :is="field.component" 
                    v-model="form[field.prop]"
                    v-bind="field.attrs"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        
        <!-- 详细信息组 -->
        <el-collapse-item title="详细信息" name="detail">
          <div class="form-group">
            <el-row :gutter="20">
              <el-col :span="12" v-for="field in detailFields" :key="field.prop">
                <el-form-item :label="field.label" :prop="field.prop">
                  <component 
                    :is="field.component" 
                    v-model="form[field.prop]"
                    v-bind="field.attrs"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        
        <!-- 扩展信息组 -->
        <el-collapse-item title="扩展信息" name="extended">
          <div class="form-group">
            <!-- 使用虚拟滚动处理大量字段 -->
            <el-virtual-list 
              :data="extendedFields" 
              :height="400"
              :item-size="80"
            >
              <template #default="{ item }">
                <el-form-item :label="item.label" :prop="item.prop">
                  <component 
                    :is="item.component" 
                    v-model="form[item.prop]"
                    v-bind="item.attrs"
                  />
                </el-form-item>
              </template>
            </el-virtual-list>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const formRef = ref()
const activeGroups = ref(['basic'])

// 表单数据
const form = reactive({
  // 基础字段
  name: '',
  email: '',
  phone: '',
  // 详细字段
  address: '',
  company: '',
  position: '',
  // 扩展字段（动态生成大量字段）
  ...generateExtendedFields()
})

// 生成扩展字段
function generateExtendedFields() {
  const fields = {}
  for (let i = 1; i <= 100; i++) {
    fields[`field_${i}`] = ''
  }
  return fields
}

// 字段配置
const basicFields = [
  { prop: 'name', label: '姓名', component: 'el-input', attrs: {} },
  { prop: 'email', label: '邮箱', component: 'el-input', attrs: {} },
  { prop: 'phone', label: '电话', component: 'el-input', attrs: {} }
]

const detailFields = [
  { prop: 'address', label: '地址', component: 'el-input', attrs: {} },
  { prop: 'company', label: '公司', component: 'el-input', attrs: {} },
  { prop: 'position', label: '职位', component: 'el-input', attrs: {} }
]

const extendedFields = computed(() => {
  const fields = []
  for (let i = 1; i <= 100; i++) {
    fields.push({
      prop: `field_${i}`,
      label: `扩展字段 ${i}`,
      component: 'el-input',
      attrs: { placeholder: `请输入扩展字段 ${i}` }
    })
  }
  return fields
})

const rules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
})
</script>

<style scoped>
.large-form-container {
  max-width: 1200px;
  margin: 0 auto;
}

.form-group {
  padding: 20px;
}
</style>
```

#### 2.3 表单数据懒加载

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="省份" prop="province">
      <el-select 
        v-model="form.province" 
        @change="handleProvinceChange"
        :loading="provinceLoading"
      >
        <el-option 
          v-for="province in provinces" 
          :key="province.code" 
          :label="province.name" 
          :value="province.code"
        />
      </el-select>
    </el-form-item>
    
    <el-form-item label="城市" prop="city">
      <el-select 
        v-model="form.city" 
        @change="handleCityChange"
        :loading="cityLoading"
        :disabled="!form.province"
      >
        <el-option 
          v-for="city in cities" 
          :key="city.code" 
          :label="city.name" 
          :value="city.code"
        />
      </el-select>
    </el-form-item>
    
    <el-form-item label="区县" prop="district">
      <el-select 
        v-model="form.district" 
        :loading="districtLoading"
        :disabled="!form.city"
      >
        <el-option 
          v-for="district in districts" 
          :key="district.code" 
          :label="district.name" 
          :value="district.code"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

const formRef = ref()
const form = reactive({
  province: '',
  city: '',
  district: ''
})

const provinces = ref([])
const cities = ref([])
const districts = ref([])

const provinceLoading = ref(false)
const cityLoading = ref(false)
const districtLoading = ref(false)

// 加载省份数据
const loadProvinces = async () => {
  provinceLoading.value = true
  try {
    // 模拟API调用
    const response = await fetch('/api/provinces')
    provinces.value = await response.json()
  } catch (error) {
    console.error('加载省份数据失败:', error)
  } finally {
    provinceLoading.value = false
  }
}

// 加载城市数据
const loadCities = async (provinceCode) => {
  cityLoading.value = true
  try {
    const response = await fetch(`/api/cities?province=${provinceCode}`)
    cities.value = await response.json()
  } catch (error) {
    console.error('加载城市数据失败:', error)
  } finally {
    cityLoading.value = false
  }
}

// 加载区县数据
const loadDistricts = async (cityCode) => {
  districtLoading.value = true
  try {
    const response = await fetch(`/api/districts?city=${cityCode}`)
    districts.value = await response.json()
  } catch (error) {
    console.error('加载区县数据失败:', error)
  } finally {
    districtLoading.value = false
  }
}

// 省份变化处理
const handleProvinceChange = (value) => {
  form.city = ''
  form.district = ''
  cities.value = []
  districts.value = []
  
  if (value) {
    loadCities(value)
  }
}

// 城市变化处理
const handleCityChange = (value) => {
  form.district = ''
  districts.value = []
  
  if (value) {
    loadDistricts(value)
  }
}

const rules = reactive({
  province: [{ required: true, message: '请选择省份', trigger: 'change' }],
  city: [{ required: true, message: '请选择城市', trigger: 'change' }],
  district: [{ required: true, message: '请选择区县', trigger: 'change' }]
})

onMounted(() => {
  loadProvinces()
})
</script>
```

#### 2.4 内存泄漏防护

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="搜索关键词" prop="keyword">
      <el-input 
        v-model="form.keyword" 
        @input="handleSearch"
        placeholder="输入关键词搜索"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount } from 'vue'
import { debounce } from 'lodash-es'

const formRef = ref()
const form = reactive({
  keyword: ''
})

// 存储定时器和请求控制器
const timers = new Set()
const controllers = new Set()

// 防抖搜索函数
const debouncedSearch = debounce(async (keyword) => {
  // 创建AbortController用于取消请求
  const controller = new AbortController()
  controllers.add(controller)
  
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword }),
      signal: controller.signal
    })
    
    const data = await response.json()
    console.log('搜索结果:', data)
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('搜索失败:', error)
    }
  } finally {
    controllers.delete(controller)
  }
}, 300)

const handleSearch = (value) => {
  if (value.trim()) {
    debouncedSearch(value)
  }
}

// 清理资源
const cleanup = () => {
  // 取消所有防抖函数
  debouncedSearch.cancel()
  
  // 清除所有定时器
  timers.forEach(timer => clearTimeout(timer))
  timers.clear()
  
  // 取消所有未完成的请求
  controllers.forEach(controller => controller.abort())
  controllers.clear()
}

// 组件卸载时清理资源
onBeforeUnmount(() => {
  cleanup()
})

const rules = reactive({
  keyword: [
    { required: true, message: '请输入搜索关键词', trigger: 'blur' }
  ]
})
</script>
```

#### 2.5 表单缓存策略

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="个人简介" prop="bio">
      <el-input v-model="form.bio" type="textarea" :rows="4" />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="saveAsDraft">保存草稿</el-button>
      <el-button @click="loadDraft">加载草稿</el-button>
      <el-button @click="clearDraft">清除草稿</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'

const formRef = ref()
const form = reactive({
  username: '',
  email: '',
  bio: ''
})

const CACHE_KEY = 'form_draft_cache'
const AUTO_SAVE_INTERVAL = 30000 // 30秒自动保存

// 保存表单数据到本地存储
const saveToCache = (data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    console.log('表单数据已保存到缓存')
  } catch (error) {
    console.error('保存缓存失败:', error)
  }
}

// 从本地存储加载表单数据
const loadFromCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      
      // 检查缓存是否过期（24小时）
      const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000
      if (!isExpired) {
        Object.assign(form, data)
        console.log('已从缓存加载表单数据')
        return true
      } else {
        localStorage.removeItem(CACHE_KEY)
        console.log('缓存已过期，已清除')
      }
    }
  } catch (error) {
    console.error('加载缓存失败:', error)
  }
  return false
}

// 清除缓存
const clearCache = () => {
  localStorage.removeItem(CACHE_KEY)
  console.log('缓存已清除')
}

// 手动保存草稿
const saveAsDraft = () => {
  saveToCache(form)
  ElMessage.success('草稿已保存')
}

// 加载草稿
const loadDraft = () => {
  const loaded = loadFromCache()
  if (loaded) {
    ElMessage.success('草稿已加载')
  } else {
    ElMessage.info('没有找到草稿数据')
  }
}

// 清除草稿
const clearDraft = () => {
  clearCache()
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  ElMessage.success('草稿已清除')
}

// 提交表单
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 提交成功后清除缓存
      clearCache()
      console.log('表单提交成功，缓存已清除')
    }
  })
}

// 监听表单变化，自动保存
let autoSaveTimer = null
watch(
  () => ({ ...form }),
  (newForm) => {
    // 防抖自动保存
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }
    
    autoSaveTimer = setTimeout(() => {
      saveToCache(newForm)
    }, AUTO_SAVE_INTERVAL)
  },
  { deep: true }
)

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
})

// 组件挂载时尝试加载缓存
onMounted(() => {
  loadFromCache()
})
</script>
```

### 3. 表单最佳实践

#### 3.1 表单设计原则

**清晰性原则**：表单结构清晰，字段分组合理

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
    <!-- 基本信息组 -->
    <el-divider content-position="left">
      <el-icon><User /></el-icon>
      基本信息
    </el-divider>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="姓名" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入真实姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别" prop="gender" required>
          <el-radio-group v-model="form.gender">
            <el-radio value="male">男</el-radio>
            <el-radio value="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    
    <!-- 联系信息组 -->
    <el-divider content-position="left">
      <el-icon><Phone /></el-icon>
      联系信息
    </el-divider>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="手机号" prop="phone" required>
          <el-input v-model="form.phone" placeholder="请输入11位手机号" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱地址" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { User, Phone } from '@element-plus/icons-vue'

const formRef = ref()
const form = reactive({
  name: '',
  gender: '',
  phone: '',
  email: ''
})

const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
})
</script>
```

#### 3.2 用户体验优化

**渐进式验证**：提供实时反馈，减少用户等待

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="用户名" prop="username">
      <el-input 
        v-model="form.username" 
        placeholder="请输入用户名"
        :prefix-icon="getUsernameIcon()"
        :class="getUsernameClass()"
      >
        <template #suffix>
          <el-icon v-if="usernameValidating" class="is-loading">
            <Loading />
          </el-icon>
          <el-icon v-else-if="usernameValid === true" class="is-success">
            <Check />
          </el-icon>
          <el-icon v-else-if="usernameValid === false" class="is-error">
            <Close />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    
    <el-form-item label="密码" prop="password">
      <el-input 
        v-model="form.password" 
        type="password" 
        placeholder="请输入密码"
        show-password
      >
        <template #suffix>
          <div class="password-strength">
            <div 
              class="strength-bar" 
              :class="`strength-${getPasswordStrength()}`"
            ></div>
            <span class="strength-text">{{ getPasswordStrengthText() }}</span>
          </div>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { Loading, Check, Close, User } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

const formRef = ref()
const form = reactive({
  username: '',
  password: ''
})

const usernameValidating = ref(false)
const usernameValid = ref(null)

// 用户名验证
const validateUsername = debounce(async (username) => {
  if (!username) {
    usernameValid.value = null
    return
  }
  
  usernameValidating.value = true
  
  try {
    // 模拟API验证
    await new Promise(resolve => setTimeout(resolve, 1000))
    const existingUsers = ['admin', 'user', 'test']
    usernameValid.value = !existingUsers.includes(username)
  } catch (error) {
    usernameValid.value = false
  } finally {
    usernameValidating.value = false
  }
}, 500)

// 监听用户名变化
watch(() => form.username, (newValue) => {
  validateUsername(newValue)
})

// 获取用户名图标
const getUsernameIcon = () => {
  return User
}

// 获取用户名样式类
const getUsernameClass = () => {
  if (usernameValid.value === true) return 'input-success'
  if (usernameValid.value === false) return 'input-error'
  return ''
}

// 计算密码强度
const getPasswordStrength = () => {
  const password = form.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 6) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^\w\s]/.test(password)) strength++
  
  return Math.min(strength, 4)
}

// 获取密码强度文本
const getPasswordStrengthText = () => {
  const strength = getPasswordStrength()
  const texts = ['', '弱', '一般', '强', '很强']
  return texts[strength]
}

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (usernameValid.value === false) {
          callback(new Error('用户名已存在'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
})
</script>

<style scoped>
.input-success :deep(.el-input__inner) {
  border-color: #67c23a;
}

.input-error :deep(.el-input__inner) {
  border-color: #f56c6c;
}

.is-loading {
  animation: rotating 2s linear infinite;
}

.is-success {
  color: #67c23a;
}

.is-error {
  color: #f56c6c;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 8px;
}

.strength-bar {
  width: 60px;
  height: 4px;
  background-color: #e4e7ed;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.strength-bar::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s;
}

.strength-1::after {
  width: 25%;
  background-color: #f56c6c;
}

.strength-2::after {
  width: 50%;
  background-color: #e6a23c;
}

.strength-3::after {
  width: 75%;
  background-color: #409eff;
}

.strength-4::after {
  width: 100%;
  background-color: #67c23a;
}

.strength-text {
  font-size: 12px;
  color: #909399;
}

@keyframes rotating {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
```

#### 3.3 错误提示设计

**友好的错误信息**：提供具体、可操作的错误提示

```vue
<template>
  <el-form 
    :model="form" 
    :rules="rules" 
    ref="formRef"
    :show-message="true"
    :inline-message="false"
    status-icon
  >
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱地址" />
      <div class="form-help-text">
        <el-icon><InfoFilled /></el-icon>
        我们将向此邮箱发送验证码
      </div>
    </el-form-item>
    
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" show-password />
      <div class="form-help-text">
        <el-icon><InfoFilled /></el-icon>
        密码需包含大小写字母、数字，长度6-20位
      </div>
    </el-form-item>
    
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="form.confirmPassword" type="password" show-password />
    </el-form-item>
    
    <!-- 全局错误提示 -->
    <el-alert 
      v-if="globalError" 
      :title="globalError" 
      type="error" 
      :closable="false"
      show-icon
      class="form-global-error"
    />
    
    <el-form-item>
      <el-button type="primary" @click="submitForm" :loading="submitting">
        {{ submitting ? '提交中...' : '提交' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

const formRef = ref()
const submitting = ref(false)
const globalError = ref('')

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

// 自定义验证器
const validateEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error('邮箱地址不能为空'))
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    callback(new Error('请输入正确的邮箱格式，例如：user@example.com'))
    return
  }
  
  // 检查邮箱域名
  const domain = value.split('@')[1]
  const allowedDomains = ['gmail.com', 'qq.com', '163.com', 'sina.com']
  if (!allowedDomains.some(d => domain.endsWith(d))) {
    callback(new Error('请使用常见邮箱服务商，如Gmail、QQ邮箱等'))
    return
  }
  
  callback()
}

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('密码不能为空'))
    return
  }
  
  if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'))
    return
  }
  
  if (value.length > 20) {
    callback(new Error('密码长度不能超过20位'))
    return
  }
  
  if (!/(?=.*[a-z])/.test(value)) {
    callback(new Error('密码必须包含至少一个小写字母'))
    return
  }
  
  if (!/(?=.*[A-Z])/.test(value)) {
    callback(new Error('密码必须包含至少一个大写字母'))
    return
  }
  
  if (!/(?=.*\d)/.test(value)) {
    callback(new Error('密码必须包含至少一个数字'))
    return
  }
  
  callback()
}

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
    return
  }
  
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致，请重新输入'))
    return
  }
  
  callback()
}

const rules = reactive({
  email: [{ validator: validateEmail, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
})

const submitForm = () => {
  globalError.value = ''
  
  formRef.value.validate(async (valid) => {
    if (!valid) {
      globalError.value = '请检查并修正表单中的错误信息'
      return
    }
    
    submitting.value = true
    
    try {
      // 模拟提交
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟服务器错误
          if (Math.random() > 0.7) {
            reject(new Error('服务器繁忙，请稍后重试'))
          } else {
            resolve()
          }
        }, 2000)
      })
      
      ElMessage.success('注册成功！')
    } catch (error) {
      globalError.value = error.message
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped>
.form-help-text {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.form-global-error {
  margin-bottom: 20px;
}
</style>
```

#### 3.4 无障碍访问支持

```vue
<template>
  <el-form 
    :model="form" 
    :rules="rules" 
    ref="formRef"
    role="form"
    aria-label="用户注册表单"
  >
    <el-form-item label="用户名" prop="username">
      <el-input 
        v-model="form.username" 
        placeholder="请输入用户名"
        aria-describedby="username-help"
        aria-required="true"
      />
      <div id="username-help" class="sr-only">
        用户名用于登录，长度3-15个字符
      </div>
    </el-form-item>
    
    <el-form-item label="密码" prop="password">
      <el-input 
        v-model="form.password" 
        type="password" 
        show-password
        aria-describedby="password-help"
        aria-required="true"
      />
      <div id="password-help" class="sr-only">
        密码需包含大小写字母和数字，长度6-20位
      </div>
    </el-form-item>
    
    <el-form-item label="性别" prop="gender">
      <el-radio-group 
        v-model="form.gender" 
        role="radiogroup" 
        aria-label="选择性别"
      >
        <el-radio value="male" aria-label="男性">男</el-radio>
        <el-radio value="female" aria-label="女性">女</el-radio>
        <el-radio value="other" aria-label="其他">其他</el-radio>
      </el-radio-group>
    </el-form-item>
    
    <el-form-item label="兴趣爱好" prop="interests">
      <el-checkbox-group 
        v-model="form.interests" 
        role="group" 
        aria-label="选择兴趣爱好"
      >
        <el-checkbox value="reading" aria-label="阅读">阅读</el-checkbox>
        <el-checkbox value="music" aria-label="音乐">音乐</el-checkbox>
        <el-checkbox value="sports" aria-label="运动">运动</el-checkbox>
        <el-checkbox value="travel" aria-label="旅行">旅行</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    
    <el-form-item>
      <el-button 
        type="primary" 
        @click="submitForm"
        :loading="submitting"
        aria-describedby="submit-help"
      >
        {{ submitting ? '提交中...' : '提交注册' }}
      </el-button>
      <div id="submit-help" class="sr-only">
        点击提交注册信息，或按回车键提交
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const formRef = ref()
const submitting = ref(false)

const form = reactive({
  username: '',
  password: '',
  gender: '',
  interests: []
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
})

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitting.value = true
      // 提交逻辑
      setTimeout(() => {
        submitting.value = false
        ElMessage.success('注册成功！')
      }, 2000)
    } else {
      // 聚焦到第一个错误字段
      const firstErrorField = document.querySelector('.el-form-item.is-error .el-input__inner')
      if (firstErrorField) {
        firstErrorField.focus()
      }
    }
  })
}
</script>

<style scoped>
/* 屏幕阅读器专用文本 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .el-form-item__label {
    font-weight: bold;
  }
  
  .el-input__inner {
    border-width: 2px;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
```

### 4. 表单架构设计

#### 4.1 表单组件封装

**可复用的表单组件**：提高开发效率和一致性

```vue
<!-- BaseForm.vue -->
<template>
  <el-form
    ref="formRef"
    :model="modelValue"
    :rules="rules"
    v-bind="formProps"
    @validate="handleValidate"
  >
    <template v-for="field in fields" :key="field.prop">
      <el-form-item
        :label="field.label"
        :prop="field.prop"
        :required="field.required"
        v-bind="field.formItemProps"
      >
        <!-- 动态组件渲染 -->
        <component
          :is="getFieldComponent(field.type)"
          v-model="modelValue[field.prop]"
          v-bind="field.props"
          @change="handleFieldChange(field.prop, $event)"
        >
          <!-- 处理选项类组件 -->
          <template v-if="field.options">
            <component
              :is="getOptionComponent(field.type)"
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            >
              {{ option.label }}
            </component>
          </template>
        </component>
      </el-form-item>
    </template>
    
    <!-- 操作按钮 -->
    <el-form-item v-if="showActions">
      <slot name="actions" :validate="validate" :reset="reset">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="validate" :loading="loading">
          {{ submitText }}
        </el-button>
      </slot>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  fields: {
    type: Array,
    required: true
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  submitText: {
    type: String,
    default: '提交'
  },
  formProps: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'validate', 'field-change', 'submit'])

const formRef = ref()

// 字段组件映射
const componentMap = {
  input: 'el-input',
  textarea: 'el-input',
  select: 'el-select',
  radio: 'el-radio-group',
  checkbox: 'el-checkbox-group',
  date: 'el-date-picker',
  time: 'el-time-picker',
  datetime: 'el-date-picker',
  number: 'el-input-number',
  switch: 'el-switch',
  slider: 'el-slider',
  rate: 'el-rate',
  upload: 'el-upload'
}

// 选项组件映射
const optionComponentMap = {
  select: 'el-option',
  radio: 'el-radio',
  checkbox: 'el-checkbox'
}

// 获取字段组件
const getFieldComponent = (type) => {
  return componentMap[type] || 'el-input'
}

// 获取选项组件
const getOptionComponent = (type) => {
  return optionComponentMap[type]
}

// 字段变化处理
const handleFieldChange = (prop, value) => {
  emit('field-change', { prop, value })
}

// 验证处理
const handleValidate = (prop, isValid, message) => {
  emit('validate', { prop, isValid, message })
}

// 表单验证
const validate = () => {
  return formRef.value.validate((valid) => {
    if (valid) {
      emit('submit', props.modelValue)
    }
    return valid
  })
}

// 重置表单
const reset = () => {
  formRef.value.resetFields()
}

// 暴露方法
defineExpose({
  validate,
  reset,
  validateField: (prop) => formRef.value.validateField(prop),
  clearValidate: (prop) => formRef.value.clearValidate(prop)
})
</script>
```

#### 4.2 表单状态管理

**使用 Pinia 管理复杂表单状态**：

```javascript
// stores/formStore.js
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export const useFormStore = defineStore('form', () => {
  // 表单数据
  const formData = reactive({})
  
  // 表单验证状态
  const validationState = reactive({})
  
  // 表单提交状态
  const submitting = ref(false)
  
  // 表单错误信息
  const errors = reactive({})
  
  // 表单变更历史
  const history = ref([])
  
  // 当前历史索引
  const historyIndex = ref(-1)
  
  // 是否有未保存的更改
  const hasUnsavedChanges = computed(() => {
    return history.value.length > 0 && historyIndex.value < history.value.length - 1
  })
  
  // 初始化表单
  const initForm = (formId, initialData = {}) => {
    formData[formId] = { ...initialData }
    validationState[formId] = {}
    errors[formId] = {}
    history.value = [{ ...initialData }]
    historyIndex.value = 0
  }
  
  // 更新字段值
  const updateField = (formId, field, value) => {
    if (!formData[formId]) return
    
    const oldValue = formData[formId][field]
    formData[formId][field] = value
    
    // 记录历史
    if (oldValue !== value) {
      const newState = { ...formData[formId] }
      history.value = history.value.slice(0, historyIndex.value + 1)
      history.value.push(newState)
      historyIndex.value = history.value.length - 1
      
      // 限制历史记录数量
      if (history.value.length > 50) {
        history.value = history.value.slice(-50)
        historyIndex.value = history.value.length - 1
      }
    }
  }
  
  // 批量更新
  const updateForm = (formId, data) => {
    if (!formData[formId]) return
    
    Object.assign(formData[formId], data)
    
    // 记录历史
    const newState = { ...formData[formId] }
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(newState)
    historyIndex.value = history.value.length - 1
  }
  
  // 撤销操作
  const undo = (formId) => {
    if (historyIndex.value > 0) {
      historyIndex.value--
      formData[formId] = { ...history.value[historyIndex.value] }
    }
  }
  
  // 重做操作
  const redo = (formId) => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      formData[formId] = { ...history.value[historyIndex.value] }
    }
  }
  
  // 设置验证状态
  const setValidationState = (formId, field, isValid, message = '') => {
    if (!validationState[formId]) {
      validationState[formId] = {}
    }
    
    validationState[formId][field] = {
      isValid,
      message,
      timestamp: Date.now()
    }
    
    // 更新错误信息
    if (!errors[formId]) {
      errors[formId] = {}
    }
    
    if (isValid) {
      delete errors[formId][field]
    } else {
      errors[formId][field] = message
    }
  }
  
  // 获取表单验证状态
  const getFormValidation = (formId) => {
    const state = validationState[formId] || {}
    const isValid = Object.values(state).every(field => field.isValid)
    const errorCount = Object.keys(errors[formId] || {}).length
    
    return {
      isValid,
      errorCount,
      errors: errors[formId] || {},
      fields: state
    }
  }
  
  // 重置表单
  const resetForm = (formId) => {
    if (history.value.length > 0) {
      formData[formId] = { ...history.value[0] }
      historyIndex.value = 0
    }
    
    validationState[formId] = {}
    errors[formId] = {}
  }
  
  // 清空表单
  const clearForm = (formId) => {
    delete formData[formId]
    delete validationState[formId]
    delete errors[formId]
    history.value = []
    historyIndex.value = -1
  }
  
  return {
    formData,
    validationState,
    submitting,
    errors,
    hasUnsavedChanges,
    initForm,
    updateField,
    updateForm,
    undo,
    redo,
    setValidationState,
    getFormValidation,
    resetForm,
    clearForm
  }
})
```

#### 4.3 表单数据流设计

**响应式表单数据流**：

```vue
<template>
  <div class="form-container">
    <!-- 表单操作栏 -->
    <div class="form-toolbar">
      <el-button 
        @click="undo" 
        :disabled="!canUndo"
        size="small"
      >
        <el-icon><ArrowLeft /></el-icon>
        撤销
      </el-button>
      
      <el-button 
        @click="redo" 
        :disabled="!canRedo"
        size="small"
      >
        <el-icon><ArrowRight /></el-icon>
        重做
      </el-button>
      
      <el-button 
        @click="autoSave" 
        :loading="autoSaving"
        size="small"
        type="success"
      >
        <el-icon><DocumentCopy /></el-icon>
        {{ autoSaving ? '保存中...' : '自动保存' }}
      </el-button>
      
      <div class="form-status">
        <el-tag v-if="hasUnsavedChanges" type="warning" size="small">
          有未保存的更改
        </el-tag>
        <el-tag v-else type="success" size="small">
          已保存
        </el-tag>
      </div>
    </div>
    
    <!-- 表单内容 -->
    <BaseForm
      v-model="formData"
      :fields="formFields"
      :rules="formRules"
      :loading="submitting"
      @field-change="handleFieldChange"
      @validate="handleValidate"
      @submit="handleSubmit"
    />
    
    <!-- 表单调试面板 -->
    <el-collapse v-if="showDebug" class="debug-panel">
      <el-collapse-item title="表单数据" name="data">
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </el-collapse-item>
      
      <el-collapse-item title="验证状态" name="validation">
        <pre>{{ JSON.stringify(formValidation, null, 2) }}</pre>
      </el-collapse-item>
      
      <el-collapse-item title="变更历史" name="history">
        <div v-for="(item, index) in formHistory" :key="index">
          <el-tag 
            :type="index === currentHistoryIndex ? 'primary' : 'info'"
            size="small"
          >
            版本 {{ index + 1 }}
          </el-tag>
          <pre>{{ JSON.stringify(item, null, 2) }}</pre>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useFormStore } from '@/stores/formStore'
import { ArrowLeft, ArrowRight, DocumentCopy } from '@element-plus/icons-vue'
import BaseForm from './BaseForm.vue'

const props = defineProps({
  formId: {
    type: String,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  autoSaveInterval: {
    type: Number,
    default: 30000 // 30秒
  },
  showDebug: {
    type: Boolean,
    default: false
  }
})

const formStore = useFormStore()
const autoSaving = ref(false)
let autoSaveTimer = null

// 表单数据
const formData = computed({
  get: () => formStore.formData[props.formId] || {},
  set: (value) => formStore.updateForm(props.formId, value)
})

// 表单验证状态
const formValidation = computed(() => 
  formStore.getFormValidation(props.formId)
)

// 提交状态
const submitting = computed(() => formStore.submitting)

// 历史记录
const formHistory = computed(() => formStore.history)
const currentHistoryIndex = computed(() => formStore.historyIndex)

// 撤销/重做状态
const canUndo = computed(() => currentHistoryIndex.value > 0)
const canRedo = computed(() => 
  currentHistoryIndex.value < formHistory.value.length - 1
)

// 未保存更改
const hasUnsavedChanges = computed(() => formStore.hasUnsavedChanges)

// 表单字段配置
const formFields = [
  {
    prop: 'name',
    label: '姓名',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入姓名'
    }
  },
  {
    prop: 'email',
    label: '邮箱',
    type: 'input',
    required: true,
    props: {
      placeholder: '请输入邮箱',
      type: 'email'
    }
  }
  // ... 更多字段
]

// 验证规则
const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 初始化表单
onMounted(() => {
  formStore.initForm(props.formId, props.initialData)
  
  // 启动自动保存
  if (props.autoSaveInterval > 0) {
    autoSaveTimer = setInterval(autoSave, props.autoSaveInterval)
  }
  
  // 监听页面关闭
  window.addEventListener('beforeunload', handleBeforeUnload)
})

// 清理
onUnmounted(() => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
  }
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 字段变化处理
const handleFieldChange = ({ prop, value }) => {
  formStore.updateField(props.formId, prop, value)
}

// 验证处理
const handleValidate = ({ prop, isValid, message }) => {
  formStore.setValidationState(props.formId, prop, isValid, message)
}

// 表单提交
const handleSubmit = async (data) => {
  formStore.submitting = true
  
  try {
    // 提交逻辑
    await submitForm(data)
    ElMessage.success('提交成功！')
    
    // 清除未保存状态
    formStore.history = [{ ...data }]
    formStore.historyIndex = 0
  } catch (error) {
    ElMessage.error('提交失败！')
  } finally {
    formStore.submitting = false
  }
}

// 撤销
const undo = () => {
  formStore.undo(props.formId)
}

// 重做
const redo = () => {
  formStore.redo(props.formId)
}

// 自动保存
const autoSave = async () => {
  if (!hasUnsavedChanges.value) return
  
  autoSaving.value = true
  
  try {
    await saveFormDraft(props.formId, formData.value)
    console.log('自动保存成功')
  } catch (error) {
    console.error('自动保存失败:', error)
  } finally {
    autoSaving.value = false
  }
}

// 页面关闭前提醒
const handleBeforeUnload = (event) => {
  if (hasUnsavedChanges.value) {
    event.preventDefault()
    event.returnValue = '您有未保存的更改，确定要离开吗？'
    return event.returnValue
  }
}

// API 方法
const submitForm = async (data) => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(resolve, 2000)
  })
}

const saveFormDraft = async (formId, data) => {
  // 模拟保存草稿
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.form-status {
  margin-left: auto;
}

.debug-panel {
  margin-top: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
}

.debug-panel pre {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 300px;
  overflow: auto;
}
</style>
```

#### 4.4 表单复用策略

**表单配置化管理**：

```javascript
// formConfigs.js
export const formConfigs = {
  // 用户注册表单
  userRegister: {
    title: '用户注册',
    fields: [
      {
        prop: 'username',
        label: '用户名',
        type: 'input',
        required: true,
        props: {
          placeholder: '请输入用户名',
          maxlength: 20
        },
        rules: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      {
        prop: 'email',
        label: '邮箱',
        type: 'input',
        required: true,
        props: {
          placeholder: '请输入邮箱地址',
          type: 'email'
        },
        rules: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ]
      },
      {
        prop: 'password',
        label: '密码',
        type: 'input',
        required: true,
        props: {
          placeholder: '请输入密码',
          type: 'password',
          showPassword: true
        },
        rules: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ]
      }
    ],
    layout: {
      labelWidth: '100px',
      size: 'default'
    },
    actions: {
      submit: {
        text: '注册',
        type: 'primary'
      },
      reset: {
        text: '重置',
        type: 'default'
      }
    }
  },
  
  // 用户资料表单
  userProfile: {
    title: '个人资料',
    fields: [
      {
        prop: 'avatar',
        label: '头像',
        type: 'upload',
        props: {
          action: '/api/upload',
          listType: 'picture-card',
          limit: 1
        }
      },
      {
        prop: 'nickname',
        label: '昵称',
        type: 'input',
        required: true,
        props: {
          placeholder: '请输入昵称'
        }
      },
      {
        prop: 'gender',
        label: '性别',
        type: 'radio',
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
          { label: '保密', value: 'secret' }
        ]
      },
      {
        prop: 'birthDate',
        label: '出生日期',
        type: 'date',
        props: {
          placeholder: '选择日期',
          style: 'width: 100%'
        }
      },
      {
        prop: 'interests',
        label: '兴趣爱好',
        type: 'checkbox',
        options: [
          { label: '阅读', value: 'reading' },
          { label: '音乐', value: 'music' },
          { label: '运动', value: 'sports' },
          { label: '旅行', value: 'travel' },
          { label: '摄影', value: 'photography' }
        ]
      },
      {
        prop: 'bio',
        label: '个人简介',
        type: 'textarea',
        props: {
          placeholder: '请输入个人简介',
          rows: 4,
          maxlength: 200,
          showWordLimit: true
        }
      }
    ],
    layout: {
      labelWidth: '120px',
      size: 'default'
    }
  }
}

// 表单配置工厂
export class FormConfigFactory {
  static create(configName, overrides = {}) {
    const baseConfig = formConfigs[configName]
    if (!baseConfig) {
      throw new Error(`表单配置 '${configName}' 不存在`)
    }
    
    return this.mergeConfig(baseConfig, overrides)
  }
  
  static mergeConfig(base, overrides) {
    const merged = JSON.parse(JSON.stringify(base))
    
    // 合并字段配置
    if (overrides.fields) {
      overrides.fields.forEach(override => {
        const index = merged.fields.findIndex(f => f.prop === override.prop)
        if (index >= 0) {
          merged.fields[index] = { ...merged.fields[index], ...override }
        } else {
          merged.fields.push(override)
        }
      })
    }
    
    // 合并其他配置
    Object.keys(overrides).forEach(key => {
      if (key !== 'fields') {
        merged[key] = { ...merged[key], ...overrides[key] }
      }
    })
    
    return merged
  }
  
  static addField(config, field, position = -1) {
    const newConfig = { ...config }
    if (position >= 0) {
      newConfig.fields.splice(position, 0, field)
    } else {
      newConfig.fields.push(field)
    }
    return newConfig
  }
  
  static removeField(config, prop) {
    const newConfig = { ...config }
    newConfig.fields = newConfig.fields.filter(f => f.prop !== prop)
    return newConfig
  }
  
  static updateField(config, prop, updates) {
    const newConfig = { ...config }
    const index = newConfig.fields.findIndex(f => f.prop === prop)
    if (index >= 0) {
      newConfig.fields[index] = { ...newConfig.fields[index], ...updates }
    }
    return newConfig
  }
}
```

**使用示例**：

```vue
<template>
  <ConfigurableForm
    :config="formConfig"
    v-model="formData"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { FormConfigFactory } from '@/utils/formConfigs'
import ConfigurableForm from '@/components/ConfigurableForm.vue'

const formData = ref({})

// 基于配置创建表单
const formConfig = computed(() => {
  return FormConfigFactory.create('userProfile', {
    // 自定义覆盖
    fields: [
      {
        prop: 'company',
        label: '公司',
        type: 'input',
        props: {
          placeholder: '请输入公司名称'
        }
      }
    ],
    layout: {
      labelWidth: '140px'
    }
  })
})

const handleSubmit = (data) => {
  console.log('提交数据:', data)
}
</script>
```

## 实际应用示例

### 示例一：企业级用户管理系统

**完整的用户管理表单实现**：

```vue
<template>
  <div class="user-management-form">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑用户' : '新增用户' }}</span>
          <el-button 
            v-if="isEdit" 
            type="danger" 
            size="small" 
            @click="deleteUser"
          >
            删除用户
          </el-button>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="userForm"
        :rules="userRules"
        label-width="120px"
        status-icon
      >
        <!-- 基本信息 -->
        <el-divider content-position="left">
          <el-icon><User /></el-icon>
          基本信息
        </el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="userForm.username" 
                placeholder="请输入用户名"
                :disabled="isEdit"
              >
                <template #suffix>
                  <el-icon v-if="usernameChecking" class="is-loading">
                    <Loading />
                  </el-icon>
                  <el-icon v-else-if="usernameValid === true" class="is-success">
                    <Check />
                  </el-icon>
                  <el-icon v-else-if="usernameValid === false" class="is-error">
                    <Close />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input 
                v-model="userForm.email" 
                placeholder="请输入邮箱地址"
                type="email"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input 
                v-model="userForm.realName" 
                placeholder="请输入真实姓名"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input 
                v-model="userForm.phone" 
                placeholder="请输入手机号"
                type="tel"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 权限设置 -->
        <el-divider content-position="left">
          <el-icon><Lock /></el-icon>
          权限设置
        </el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户角色" prop="role">
              <el-select 
                v-model="userForm.role" 
                placeholder="请选择用户角色"
                style="width: 100%"
                @change="handleRoleChange"
              >
                <el-option 
                  v-for="role in roleOptions" 
                  :key="role.value" 
                  :label="role.label" 
                  :value="role.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-cascader
                v-model="userForm.department"
                :options="departmentOptions"
                placeholder="请选择部门"
                style="width: 100%"
                :props="{ checkStrictly: true }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="权限" prop="permissions">
          <el-checkbox-group v-model="userForm.permissions">
            <el-row>
              <el-col 
                v-for="permission in availablePermissions" 
                :key="permission.value" 
                :span="8"
              >
                <el-checkbox 
                  :value="permission.value" 
                  :disabled="!permission.available"
                >
                  {{ permission.label }}
                </el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        
        <!-- 账户设置 -->
        <el-divider content-position="left">
          <el-icon><Setting /></el-icon>
          账户设置
        </el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账户状态" prop="status">
              <el-radio-group v-model="userForm.status">
                <el-radio value="active">激活</el-radio>
                <el-radio value="inactive">禁用</el-radio>
                <el-radio value="pending">待审核</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="过期时间" prop="expireDate">
              <el-date-picker
                v-model="userForm.expireDate"
                type="datetime"
                placeholder="选择过期时间"
                style="width: 100%"
                :disabled-date="disabledDate"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="备注" prop="remark">
          <el-input 
            v-model="userForm.remark" 
            type="textarea" 
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="saveDraft" :loading="draftSaving">
            保存草稿
          </el-button>
          <el-button 
            type="primary" 
            @click="submitForm" 
            :loading="submitting"
          >
            {{ isEdit ? '更新用户' : '创建用户' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { 
  User, Lock, Setting, Loading, Check, Close 
} from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

const props = defineProps({
  userId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['success', 'cancel'])

const formRef = ref()
const submitting = ref(false)
const draftSaving = ref(false)
const usernameChecking = ref(false)
const usernameValid = ref(null)

// 是否为编辑模式
const isEdit = computed(() => !!props.userId)

// 表单数据
const userForm = reactive({
  username: '',
  email: '',
  realName: '',
  phone: '',
  role: '',
  department: [],
  permissions: [],
  status: 'active',
  expireDate: '',
  remark: ''
})

// 角色选项
const roleOptions = [
  { label: '超级管理员', value: 'super_admin' },
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
  { label: '访客', value: 'guest' }
]

// 部门选项
const departmentOptions = [
  {
    value: 'tech',
    label: '技术部',
    children: [
      { value: 'frontend', label: '前端组' },
      { value: 'backend', label: '后端组' },
      { value: 'mobile', label: '移动端组' }
    ]
  },
  {
    value: 'product',
    label: '产品部',
    children: [
      { value: 'design', label: '设计组' },
      { value: 'pm', label: '产品组' }
    ]
  }
]

// 可用权限
const availablePermissions = computed(() => {
  const basePermissions = [
    { label: '用户管理', value: 'user_manage', available: true },
    { label: '角色管理', value: 'role_manage', available: true },
    { label: '系统设置', value: 'system_setting', available: true },
    { label: '数据导出', value: 'data_export', available: true },
    { label: '日志查看', value: 'log_view', available: true },
    { label: '财务管理', value: 'finance_manage', available: true }
  ]
  
  // 根据角色限制权限
  if (userForm.role === 'guest') {
    return basePermissions.map(p => ({
      ...p,
      available: ['log_view'].includes(p.value)
    }))
  }
  
  if (userForm.role === 'user') {
    return basePermissions.map(p => ({
      ...p,
      available: !['system_setting', 'finance_manage'].includes(p.value)
    }))
  }
  
  return basePermissions
})

// 用户名验证
const validateUsername = debounce(async (username) => {
  if (!username || isEdit.value) {
    usernameValid.value = null
    return
  }
  
  usernameChecking.value = true
  
  try {
    const response = await fetch(`/api/users/check-username?username=${username}`)
    const data = await response.json()
    usernameValid.value = data.available
  } catch (error) {
    usernameValid.value = false
  } finally {
    usernameChecking.value = false
  }
}, 500)

// 监听用户名变化
watch(() => userForm.username, validateUsername)

// 角色变化处理
const handleRoleChange = (role) => {
  // 清空不可用的权限
  const availableValues = availablePermissions.value
    .filter(p => p.available)
    .map(p => p.value)
  
  userForm.permissions = userForm.permissions.filter(p => 
    availableValues.includes(p)
  )
}

// 禁用日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 不能选择过去的日期
}

// 验证规则
const userRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (isEdit.value) {
          callback()
          return
        }
        
        if (usernameValid.value === false) {
          callback(new Error('用户名已存在'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ],
  department: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ]
})

// 初始化
onMounted(async () => {
  if (isEdit.value) {
    await loadUserData()
  }
})

// 加载用户数据
const loadUserData = async () => {
  try {
    const response = await fetch(`/api/users/${props.userId}`)
    const userData = await response.json()
    Object.assign(userForm, userData)
  } catch (error) {
    ElMessage.error('加载用户数据失败')
  }
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
  usernameValid.value = null
}

// 保存草稿
const saveDraft = async () => {
  draftSaving.value = true
  
  try {
    await fetch('/api/users/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm)
    })
    
    ElMessage.success('草稿保存成功')
  } catch (error) {
    ElMessage.error('草稿保存失败')
  } finally {
    draftSaving.value = false
  }
}

// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      const url = isEdit.value ? `/api/users/${props.userId}` : '/api/users'
      const method = isEdit.value ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      })
      
      if (response.ok) {
        ElMessage.success(isEdit.value ? '用户更新成功' : '用户创建成功')
        emit('success')
      } else {
        throw new Error('操作失败')
      }
    } catch (error) {
      ElMessage.error(error.message)
    } finally {
      submitting.value = false
    }
  })
}

// 删除用户
const deleteUser = () => {
  ElMessageBox.confirm(
    '确定要删除这个用户吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await fetch(`/api/users/${props.userId}`, { method: 'DELETE' })
      ElMessage.success('用户删除成功')
      emit('success')
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}
</script>

<style scoped>
.user-management-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.is-loading {
  animation: rotating 2s linear infinite;
}

.is-success {
  color: #67c23a;
}

.is-error {
  color: #f56c6c;
}

@keyframes rotating {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
```

### 示例二：动态表单生成器

**基于配置的动态表单系统**：

```vue
<template>
  <div class="dynamic-form-generator">
    <el-row :gutter="20">
      <!-- 表单配置面板 -->
      <el-col :span="8">
        <el-card title="表单配置">
          <el-form label-width="100px">
            <el-form-item label="表单标题">
              <el-input v-model="formConfig.title" />
            </el-form-item>
            
            <el-form-item label="标签宽度">
              <el-input v-model="formConfig.labelWidth" />
            </el-form-item>
            
            <el-form-item label="表单大小">
              <el-select v-model="formConfig.size">
                <el-option label="大" value="large" />
                <el-option label="默认" value="default" />
                <el-option label="小" value="small" />
              </el-select>
            </el-form-item>
          </el-form>
          
          <el-divider>字段管理</el-divider>
          
          <!-- 字段列表 -->
          <div class="field-list">
            <div 
              v-for="(field, index) in formConfig.fields" 
              :key="field.id"
              class="field-item"
              :class="{ active: selectedFieldIndex === index }"
              @click="selectField(index)"
            >
              <span>{{ field.label || field.prop }}</span>
              <el-button 
                type="danger" 
                size="small" 
                @click.stop="removeField(index)"
              >
                删除
              </el-button>
            </div>
          </div>
          
          <!-- 添加字段 -->
          <el-button 
            type="primary" 
            @click="addField" 
            style="width: 100%; margin-top: 10px;"
          >
            添加字段
          </el-button>
        </el-card>
        
        <!-- 字段属性编辑 -->
        <el-card v-if="selectedField" title="字段属性" style="margin-top: 20px;">
          <FieldEditor 
            v-model="selectedField" 
            @update="updateField"
          />
        </el-card>
      </el-col>
      
      <!-- 表单预览 -->
      <el-col :span="16">
        <el-card :title="formConfig.title || '表单预览'">
          <DynamicForm 
            :config="formConfig" 
            v-model="formData"
            @submit="handleSubmit"
          />
          
          <!-- 表单数据预览 -->
          <el-divider>表单数据</el-divider>
          <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
          
          <!-- 配置导出 -->
          <el-divider>配置导出</el-divider>
          <el-button @click="exportConfig">导出配置</el-button>
          <el-button @click="importConfig">导入配置</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import DynamicForm from './DynamicForm.vue'
import FieldEditor from './FieldEditor.vue'

// 表单配置
const formConfig = reactive({
  title: '动态表单',
  labelWidth: '120px',
  size: 'default',
  fields: []
})

// 表单数据
const formData = ref({})

// 选中的字段
const selectedFieldIndex = ref(-1)
const selectedField = computed(() => {
  return selectedFieldIndex.value >= 0 
    ? formConfig.fields[selectedFieldIndex.value] 
    : null
})

// 字段ID计数器
let fieldIdCounter = 0

// 选择字段
const selectField = (index) => {
  selectedFieldIndex.value = index
}

// 添加字段
const addField = () => {
  const newField = {
    id: ++fieldIdCounter,
    prop: `field_${fieldIdCounter}`,
    label: `字段 ${fieldIdCounter}`,
    type: 'input',
    required: false,
    props: {},
    rules: []
  }
  
  formConfig.fields.push(newField)
  selectedFieldIndex.value = formConfig.fields.length - 1
}

// 移除字段
const removeField = (index) => {
  formConfig.fields.splice(index, 1)
  if (selectedFieldIndex.value >= index) {
    selectedFieldIndex.value = Math.max(0, selectedFieldIndex.value - 1)
  }
  if (formConfig.fields.length === 0) {
    selectedFieldIndex.value = -1
  }
}

// 更新字段
const updateField = (field) => {
  if (selectedFieldIndex.value >= 0) {
    Object.assign(formConfig.fields[selectedFieldIndex.value], field)
  }
}

// 表单提交
const handleSubmit = (data) => {
  console.log('表单提交:', data)
  ElMessage.success('表单提交成功！')
}

// 导出配置
const exportConfig = () => {
  const configStr = JSON.stringify(formConfig, null, 2)
  const blob = new Blob([configStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = 'form-config.json'
  a.click()
  
  URL.revokeObjectURL(url)
}

// 导入配置
const importConfig = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result)
        Object.assign(formConfig, config)
        selectedFieldIndex.value = -1
        ElMessage.success('配置导入成功！')
      } catch (error) {
        ElMessage.error('配置文件格式错误！')
      }
    }
    reader.readAsText(file)
  }
  
  input.click()
}
</script>

<style scoped>
.dynamic-form-generator {
  padding: 20px;
}

.field-list {
  max-height: 300px;
  overflow-y: auto;
}

.field-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.field-item:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.field-item.active {
  border-color: #409eff;
  background-color: #e1f3ff;
}

pre {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 200px;
  overflow: auto;
}
</style>
```

## 常见问题

### 问题一：表单验证不生效或验证时机不正确

**问题描述**：表单验证规则设置了但不生效，或者验证时机不符合预期。

**解决方案**：

```vue
<template>
  <el-form ref="formRef" :model="form" :rules="rules">
    <!-- 确保 prop 属性与 rules 中的键名一致 -->
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    
    <!-- 嵌套对象的验证 -->
    <el-form-item label="地址" prop="address.city">
      <el-input v-model="form.address.city" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const formRef = ref()

// 确保表单数据结构完整
const form = reactive({
  username: '',
  address: {
    city: ''
  }
})

// 验证规则键名必须与 prop 一致
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  'address.city': [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ]
})

// 手动触发验证
const validateField = (prop) => {
  formRef.value.validateField(prop)
}

// 清除验证
const clearValidate = (prop) => {
  formRef.value.clearValidate(prop)
}
</script>
```

### 问题二：动态表单字段验证问题

**问题描述**：动态添加或删除表单字段时，验证规则不更新或出现错误。

**解决方案**：

```vue
<template>
  <el-form ref="formRef" :model="form" :rules="dynamicRules">
    <div v-for="(item, index) in form.items" :key="item.id">
      <el-form-item 
        :label="`项目 ${index + 1}`" 
        :prop="`items.${index}.name`"
      >
        <el-input v-model="item.name" />
        <el-button @click="removeItem(index)">删除</el-button>
      </el-form-item>
    </div>
    
    <el-button @click="addItem">添加项目</el-button>
  </el-form>
</template>

<script setup>
import { reactive, ref, computed, nextTick } from 'vue'

const formRef = ref()
let itemIdCounter = 0

const form = reactive({
  items: []
})

// 动态生成验证规则
const dynamicRules = computed(() => {
  const rules = {}
  
  form.items.forEach((item, index) => {
    rules[`items.${index}.name`] = [
      { required: true, message: '请输入项目名称', trigger: 'blur' }
    ]
  })
  
  return rules
})

// 添加项目
const addItem = () => {
  form.items.push({
    id: ++itemIdCounter,
    name: ''
  })
}

// 删除项目
const removeItem = async (index) => {
  form.items.splice(index, 1)
  
  // 等待 DOM 更新后清除验证
  await nextTick()
  
  // 清除可能残留的验证信息
  const fieldsToRemove = Object.keys(formRef.value.fields || {})
    .filter(key => key.startsWith(`items.${form.items.length}.`))
  
  fieldsToRemove.forEach(field => {
    formRef.value.clearValidate(field)
  })
}
</script>
```

### 问题三：表单性能问题

**问题描述**：大型表单或频繁验证导致性能问题。

**解决方案**：

```vue
<template>
  <el-form 
    ref="formRef" 
    :model="form" 
    :rules="rules"
    @validate="handleValidate"
  >
    <!-- 使用 v-show 而不是 v-if 来避免频繁的 DOM 操作 -->
    <div v-for="section in formSections" :key="section.id">
      <el-divider>{{ section.title }}</el-divider>
      
      <template v-for="field in section.fields" :key="field.prop">
        <el-form-item 
          v-show="shouldShowField(field)"
          :label="field.label" 
          :prop="field.prop"
        >
          <component 
            :is="field.component" 
            v-model="form[field.prop]"
            v-bind="field.props"
            @input="debouncedValidate(field.prop)"
          />
        </el-form-item>
      </template>
    </div>
  </el-form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { debounce } from 'lodash-es'

const formRef = ref()
const validationResults = reactive({})

const form = reactive({
  // 大量表单字段...
})

// 防抖验证
const debouncedValidate = debounce((prop) => {
  formRef.value.validateField(prop)
}, 300)

// 批量验证处理
const handleValidate = (prop, isValid, message) => {
  validationResults[prop] = { isValid, message }
}

// 条件显示字段
const shouldShowField = (field) => {
  if (!field.condition) return true
  return field.condition(form)
}

// 分组表单字段以提高渲染性能
const formSections = computed(() => {
  // 将字段分组，避免一次性渲染过多字段
  return [
    {
      id: 'basic',
      title: '基本信息',
      fields: basicFields
    },
    {
      id: 'advanced',
      title: '高级设置',
      fields: advancedFields
    }
  ]
})
</script>
```

## 最佳实践

### 1. 表单设计原则

- **简洁性**：避免在单个表单中包含过多字段
- **逻辑性**：相关字段分组，使用分隔符或步骤向导
- **一致性**：保持标签位置、字段大小、按钮样式的一致性
- **反馈性**：提供及时的验证反馈和操作结果提示

### 2. 验证策略

- **渐进式验证**：在用户输入过程中提供实时反馈
- **服务端验证**：关键数据必须进行服务端二次验证
- **友好提示**：错误信息要具体、可操作
- **防抖处理**：避免频繁的验证请求

### 3. 性能优化

- **懒加载**：大型表单采用分步加载
- **虚拟滚动**：处理大量动态字段
- **防抖节流**：控制验证和提交频率
- **缓存策略**：合理使用表单数据缓存

### 4. 用户体验

- **自动保存**：定期保存用户输入的草稿
- **键盘导航**：支持 Tab 键切换和回车提交
- **移动端适配**：响应式布局和触摸优化
- **无障碍支持**：添加适当的 ARIA 标签

### 5. 安全考虑

- **输入过滤**：防止 XSS 攻击
- **CSRF 保护**：添加 CSRF 令牌
- **数据加密**：敏感数据传输加密
- **权限验证**：服务端验证用户权限

## 总结

Element Plus 的 Form 组件提供了强大而灵活的表单解决方案。通过本文档的学习，你应该掌握了：

1. **高级验证技术**：自定义验证规则、异步验证、跨字段验证
2. **性能优化策略**：防抖处理、虚拟滚动、懒加载
3. **最佳实践方法**：用户体验优化、安全防护、无障碍支持
4. **架构设计模式**：组件封装、状态管理、配置化开发

在实际项目中，建议根据具体需求选择合适的技术方案，平衡功能完整性、性能表现和开发效率。记住，好的表单不仅要功能完善，更要注重用户体验和安全性。

## 参考资料

- [Element Plus Form 官方文档](https://element-plus.org/zh-CN/component/form.html)
- [Vue 3 表单处理指南](https://cn.vuejs.org/guide/essentials/forms.html)
- [Web 无障碍指南 WCAG](https://www.w3.org/WAI/WCAG21/quickref/)
- [表单验证最佳实践](https://web.dev/sign-in-form-best-practices/)
- [前端安全防护指南](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

**学习日期：** ___________
**完成状态：** ___________
**学习笔记：**



**遇到的问题：**



**解决方案：**