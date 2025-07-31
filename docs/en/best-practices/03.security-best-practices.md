# Security Best Practices for Element Plus Applications

## Overview

This guide covers essential security practices for Element Plus applications, including input validation, authentication, authorization, data protection, and secure coding practices.

## Input Validation and Sanitization

### Form Input Validation

```vue
<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="secureRules"
    label-width="120px"
    @submit.prevent="handleSecureSubmit"
  >
    <!-- Secure text input -->
    <el-form-item label="Username" prop="username">
      <el-input
        v-model="form.username"
        :maxlength="50"
        show-word-limit
        clearable
        @input="sanitizeInput('username', $event)"
      >
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    
    <!-- Secure email input -->
    <el-form-item label="Email" prop="email">
      <el-input
        v-model="form.email"
        type="email"
        :maxlength="100"
        clearable
        @blur="validateEmail"
      >
        <template #prefix>
          <el-icon><Message /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    
    <!-- Secure password input -->
    <el-form-item label="Password" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        :maxlength="128"
        show-password
        autocomplete="new-password"
      >
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
      <div class="password-strength">
        <el-progress
          :percentage="passwordStrength.percentage"
          :color="passwordStrength.color"
          :show-text="false"
        />
        <span class="strength-text">{{ passwordStrength.text }}</span>
      </div>
    </el-form-item>
    
    <!-- Secure file upload -->
    <el-form-item label="Avatar" prop="avatar">
      <el-upload
        ref="uploadRef"
        :action="uploadUrl"
        :headers="uploadHeaders"
        :before-upload="secureFileValidation"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :file-list="fileList"
        list-type="picture-card"
        :limit="1"
        accept="image/jpeg,image/png,image/webp"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    
    <!-- CAPTCHA verification -->
    <el-form-item label="Verification" prop="captcha">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-input
            v-model="form.captcha"
            placeholder="Enter CAPTCHA"
            :maxlength="6"
          />
        </el-col>
        <el-col :span="12">
          <div class="captcha-container" @click="refreshCaptcha">
            <img :src="captchaUrl" alt="CAPTCHA" />
            <el-button size="small" text>Refresh</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    
    <el-form-item>
      <el-button
        type="primary"
        :loading="submitting"
        @click="handleSecureSubmit"
      >
        Submit
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DOMPurify from 'dompurify'
import { z } from 'zod'

const formRef = ref()
const uploadRef = ref()
const submitting = ref(false)
const captchaUrl = ref('')
const fileList = ref([])

const form = reactive({
  username: '',
  email: '',
  password: '',
  avatar: '',
  captcha: ''
})

// Secure validation schema using Zod
const validationSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must not exceed 100 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  captcha: z.string()
    .length(6, 'CAPTCHA must be exactly 6 characters')
})

// Element Plus validation rules
const secureRules = {
  username: [
    { required: true, message: 'Username is required', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        try {
          validationSchema.shape.username.parse(value)
          callback()
        } catch (error) {
          callback(new Error(error.errors[0].message))
        }
      }, 
      trigger: 'blur' 
    }
  ],
  
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        try {
          validationSchema.shape.email.parse(value)
          callback()
        } catch (error) {
          callback(new Error(error.errors[0].message))
        }
      }, 
      trigger: 'blur' 
    }
  ],
  
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        try {
          validationSchema.shape.password.parse(value)
          callback()
        } catch (error) {
          callback(new Error(error.errors[0].message))
        }
      }, 
      trigger: 'blur' 
    }
  ],
  
  captcha: [
    { required: true, message: 'CAPTCHA is required', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        try {
          validationSchema.shape.captcha.parse(value)
          callback()
        } catch (error) {
          callback(new Error(error.errors[0].message))
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return { percentage: 0, color: '#909399', text: 'No password' }
  
  let score = 0
  
  // Length check
  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 10
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 20
  if (/[A-Z]/.test(password)) score += 20
  if (/\d/.test(password)) score += 20
  if (/[@$!%*?&]/.test(password)) score += 20
  
  // Bonus for length
  if (password.length >= 16) score += 10
  
  if (score < 40) {
    return { percentage: score, color: '#f56c6c', text: 'Weak' }
  } else if (score < 70) {
    return { percentage: score, color: '#e6a23c', text: 'Medium' }
  } else {
    return { percentage: score, color: '#67c23a', text: 'Strong' }
  }
})

// Input sanitization
const sanitizeInput = (field, value) => {
  // Remove potentially dangerous characters
  const sanitized = DOMPurify.sanitize(value, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
  
  form[field] = sanitized
}

// Email validation
const validateEmail = async () => {
  if (!form.email) return
  
  try {
    // Check if email is already registered
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCSRFToken()
      },
      body: JSON.stringify({ email: form.email })
    })
    
    const result = await response.json()
    
    if (result.exists) {
      ElMessage.warning('Email is already registered')
    }
  } catch (error) {
    console.error('Email validation error:', error)
  }
}

// Secure file validation
const secureFileValidation = (file) => {
  // File type validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('Only JPEG, PNG, and WebP images are allowed')
    return false
  }
  
  // File size validation (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.error('File size cannot exceed 5MB')
    return false
  }
  
  // File name validation
  const fileName = file.name
  if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
    ElMessage.error('File name contains invalid characters')
    return false
  }
  
  // Check file signature (magic numbers)
  return validateFileSignature(file)
}

// Validate file signature to prevent file type spoofing
const validateFileSignature = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target.result).subarray(0, 4)
      let header = ''
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, '0')
      }
      
      // Check magic numbers for image files
      const validSignatures = {
        'ffd8ffe0': 'image/jpeg',
        'ffd8ffe1': 'image/jpeg',
        'ffd8ffe2': 'image/jpeg',
        '89504e47': 'image/png',
        '52494646': 'image/webp'
      }
      
      const isValid = Object.keys(validSignatures).some(signature => 
        header.startsWith(signature)
      )
      
      if (!isValid) {
        ElMessage.error('Invalid file format detected')
        resolve(false)
      } else {
        resolve(true)
      }
    }
    reader.readAsArrayBuffer(file.slice(0, 4))
  })
}

// Upload configuration
const uploadUrl = computed(() => {
  return `${import.meta.env.VITE_API_BASE_URL}/api/upload/avatar`
})

const uploadHeaders = computed(() => {
  return {
    'Authorization': `Bearer ${getAuthToken()}`,
    'X-CSRF-Token': getCSRFToken()
  }
})

// CAPTCHA management
const refreshCaptcha = async () => {
  try {
    const response = await fetch('/api/auth/captcha', {
      method: 'GET',
      headers: {
        'X-CSRF-Token': getCSRFToken()
      }
    })
    
    const result = await response.json()
    captchaUrl.value = result.imageUrl
  } catch (error) {
    ElMessage.error('Failed to load CAPTCHA')
  }
}

// Secure form submission
const handleSecureSubmit = async () => {
  if (!formRef.value) return
  
  try {
    // Validate form
    await formRef.value.validate()
    
    // Additional security validation
    const validationResult = validationSchema.safeParse(form)
    if (!validationResult.success) {
      ElMessage.error('Form validation failed')
      return
    }
    
    submitting.value = true
    
    // Prepare secure payload
    const payload = {
      ...form,
      timestamp: Date.now(),
      nonce: generateNonce()
    }
    
    // Submit with security headers
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCSRFToken(),
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success) {
      ElMessage.success('Registration successful')
      // Redirect or handle success
    } else {
      ElMessage.error(result.message || 'Registration failed')
    }
    
  } catch (error) {
    console.error('Submission error:', error)
    ElMessage.error('An error occurred during submission')
  } finally {
    submitting.value = false
  }
}

// Security utility functions
const getCSRFToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
}

const getAuthToken = () => {
  return localStorage.getItem('auth_token') || ''
}

const generateNonce = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// Upload handlers
const handleUploadSuccess = (response, file) => {
  if (response.success) {
    form.avatar = response.url
    ElMessage.success('Avatar uploaded successfully')
  } else {
    ElMessage.error('Upload failed')
  }
}

const handleUploadError = (error) => {
  console.error('Upload error:', error)
  ElMessage.error('Upload failed')
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped>
.password-strength {
  margin-top: 8px;
}

.strength-text {
  font-size: 12px;
  margin-left: 8px;
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.captcha-container img {
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
```

## Authentication and Authorization

### Secure Authentication Service

```javascript
// services/auth.js
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import CryptoJS from 'crypto-js'

class AuthService {
  constructor() {
    this.user = ref(null)
    this.token = ref(localStorage.getItem('auth_token'))
    this.refreshToken = ref(localStorage.getItem('refresh_token'))
    this.tokenExpiry = ref(localStorage.getItem('token_expiry'))
    this.loginAttempts = ref(0)
    this.lockoutTime = ref(null)
    
    // Initialize auth state
    this.initializeAuth()
  }
  
  // Computed properties
  get isAuthenticated() {
    return computed(() => {
      return this.token.value && 
             this.tokenExpiry.value && 
             Date.now() < parseInt(this.tokenExpiry.value)
    })
  }
  
  get isLocked() {
    return computed(() => {
      return this.lockoutTime.value && Date.now() < this.lockoutTime.value
    })
  }
  
  // Initialize authentication state
  initializeAuth() {
    if (this.token.value) {
      this.validateToken()
    }
    
    // Set up token refresh timer
    this.setupTokenRefresh()
  }
  
  // Secure login with rate limiting
  async login(credentials) {
    try {
      // Check for account lockout
      if (this.isLocked.value) {
        const remainingTime = Math.ceil((this.lockoutTime.value - Date.now()) / 1000)
        throw new Error(`Account locked. Try again in ${remainingTime} seconds.`)
      }
      
      // Encrypt sensitive data
      const encryptedCredentials = this.encryptCredentials(credentials)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.getCSRFToken(),
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          ...encryptedCredentials,
          timestamp: Date.now(),
          fingerprint: await this.generateFingerprint()
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        this.handleLoginFailure()
        throw new Error(result.message || 'Login failed')
      }
      
      // Successful login
      this.handleLoginSuccess(result)
      return result
      
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
  
  // Handle successful login
  handleLoginSuccess(result) {
    this.user.value = result.user
    this.token.value = result.token
    this.refreshToken.value = result.refreshToken
    this.tokenExpiry.value = result.expiresAt
    
    // Store in secure storage
    this.storeTokens(result)
    
    // Reset login attempts
    this.loginAttempts.value = 0
    this.lockoutTime.value = null
    localStorage.removeItem('lockout_time')
    
    // Set up token refresh
    this.setupTokenRefresh()
    
    ElMessage.success('Login successful')
  }
  
  // Handle login failure with rate limiting
  handleLoginFailure() {
    this.loginAttempts.value++
    
    // Implement exponential backoff
    if (this.loginAttempts.value >= 5) {
      const lockoutDuration = Math.min(300000, Math.pow(2, this.loginAttempts.value - 5) * 60000) // Max 5 minutes
      this.lockoutTime.value = Date.now() + lockoutDuration
      localStorage.setItem('lockout_time', this.lockoutTime.value.toString())
    }
    
    localStorage.setItem('login_attempts', this.loginAttempts.value.toString())
  }
  
  // Encrypt credentials before transmission
  encryptCredentials(credentials) {
    const publicKey = this.getPublicKey()
    
    return {
      username: credentials.username, // Username can be plain text
      password: CryptoJS.AES.encrypt(credentials.password, publicKey).toString(),
      rememberMe: credentials.rememberMe
    }
  }
  
  // Generate device fingerprint
  async generateFingerprint() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Device fingerprint', 2, 2)
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL()
    }
    
    return CryptoJS.SHA256(JSON.stringify(fingerprint)).toString()
  }
  
  // Secure token storage
  storeTokens(result) {
    // Use secure storage for sensitive data
    if (result.rememberMe) {
      localStorage.setItem('auth_token', result.token)
      localStorage.setItem('refresh_token', result.refreshToken)
      localStorage.setItem('token_expiry', result.expiresAt)
    } else {
      sessionStorage.setItem('auth_token', result.token)
      sessionStorage.setItem('refresh_token', result.refreshToken)
      sessionStorage.setItem('token_expiry', result.expiresAt)
    }
  }
  
  // Token refresh mechanism
  setupTokenRefresh() {
    if (!this.token.value || !this.tokenExpiry.value) return
    
    const expiryTime = parseInt(this.tokenExpiry.value)
    const refreshTime = expiryTime - (5 * 60 * 1000) // Refresh 5 minutes before expiry
    const timeUntilRefresh = refreshTime - Date.now()
    
    if (timeUntilRefresh > 0) {
      setTimeout(() => {
        this.refreshAuthToken()
      }, timeUntilRefresh)
    }
  }
  
  // Refresh authentication token
  async refreshAuthToken() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.refreshToken.value}`,
          'X-CSRF-Token': this.getCSRFToken()
        }
      })
      
      if (!response.ok) {
        throw new Error('Token refresh failed')
      }
      
      const result = await response.json()
      
      this.token.value = result.token
      this.tokenExpiry.value = result.expiresAt
      
      // Update storage
      this.updateTokenStorage(result)
      
      // Set up next refresh
      this.setupTokenRefresh()
      
    } catch (error) {
      console.error('Token refresh error:', error)
      this.logout()
    }
  }
  
  // Update token in storage
  updateTokenStorage(result) {
    const storage = localStorage.getItem('auth_token') ? localStorage : sessionStorage
    storage.setItem('auth_token', result.token)
    storage.setItem('token_expiry', result.expiresAt)
  }
  
  // Validate existing token
  async validateToken() {
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token.value}`,
          'X-CSRF-Token': this.getCSRFToken()
        }
      })
      
      if (!response.ok) {
        throw new Error('Token validation failed')
      }
      
      const result = await response.json()
      this.user.value = result.user
      
    } catch (error) {
      console.error('Token validation error:', error)
      this.logout()
    }
  }
  
  // Secure logout
  async logout() {
    try {
      // Notify server of logout
      if (this.token.value) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token.value}`,
            'X-CSRF-Token': this.getCSRFToken()
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state
      this.clearAuthState()
    }
  }
  
  // Clear authentication state
  clearAuthState() {
    this.user.value = null
    this.token.value = null
    this.refreshToken.value = null
    this.tokenExpiry.value = null
    
    // Clear storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('token_expiry')
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('refresh_token')
    sessionStorage.removeItem('token_expiry')
    
    ElMessage.info('Logged out successfully')
  }
  
  // Check user permissions
  hasPermission(permission) {
    if (!this.user.value || !this.user.value.permissions) {
      return false
    }
    
    return this.user.value.permissions.includes(permission)
  }
  
  // Check user role
  hasRole(role) {
    if (!this.user.value || !this.user.value.roles) {
      return false
    }
    
    return this.user.value.roles.includes(role)
  }
  
  // Utility methods
  getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
  }
  
  getPublicKey() {
    return document.querySelector('meta[name="public-key"]')?.getAttribute('content') || 'default-key'
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
```

### Role-Based Access Control

```vue
<template>
  <div class="admin-panel">
    <!-- Role-based navigation -->
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="dashboard">
        Dashboard
      </el-menu-item>
      
      <!-- Admin only -->
      <el-menu-item 
        v-if="hasRole('admin')"
        index="users"
      >
        User Management
      </el-menu-item>
      
      <!-- Manager and above -->
      <el-menu-item 
        v-if="hasAnyRole(['admin', 'manager'])"
        index="reports"
      >
        Reports
      </el-menu-item>
      
      <!-- Permission-based access -->
      <el-menu-item 
        v-if="hasPermission('view_analytics')"
        index="analytics"
      >
        Analytics
      </el-menu-item>
    </el-menu>
    
    <!-- Protected content areas -->
    <div class="content-area">
      <!-- User management (Admin only) -->
      <ProtectedComponent 
        v-if="activeIndex === 'users'"
        :required-role="'admin'"
      >
        <UserManagement />
      </ProtectedComponent>
      
      <!-- Reports (Manager and above) -->
      <ProtectedComponent 
        v-if="activeIndex === 'reports'"
        :required-roles="['admin', 'manager']"
      >
        <ReportsPanel />
      </ProtectedComponent>
      
      <!-- Analytics (Permission-based) -->
      <ProtectedComponent 
        v-if="activeIndex === 'analytics'"
        :required-permission="'view_analytics'"
      >
        <AnalyticsDashboard />
      </ProtectedComponent>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import ProtectedComponent from '@/components/ProtectedComponent.vue'
import UserManagement from '@/components/UserManagement.vue'
import ReportsPanel from '@/components/ReportsPanel.vue'
import AnalyticsDashboard from '@/components/AnalyticsDashboard.vue'

const { user, hasRole, hasPermission, hasAnyRole } = useAuth()
const activeIndex = ref('dashboard')

const handleSelect = (index) => {
  activeIndex.value = index
}
</script>
```

```vue
<!-- ProtectedComponent.vue -->
<template>
  <div v-if="hasAccess" class="protected-content">
    <slot />
  </div>
  <div v-else class="access-denied">
    <el-result
      icon="warning"
      title="Access Denied"
      sub-title="You don't have permission to view this content."
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/dashboard')">
          Back to Dashboard
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  requiredRole: {
    type: String,
    default: null
  },
  requiredRoles: {
    type: Array,
    default: () => []
  },
  requiredPermission: {
    type: String,
    default: null
  },
  requiredPermissions: {
    type: Array,
    default: () => []
  }
})

const { hasRole, hasPermission, hasAnyRole, hasAllPermissions } = useAuth()

const hasAccess = computed(() => {
  // Check single role
  if (props.requiredRole && !hasRole(props.requiredRole)) {
    return false
  }
  
  // Check multiple roles (any)
  if (props.requiredRoles.length > 0 && !hasAnyRole(props.requiredRoles)) {
    return false
  }
  
  // Check single permission
  if (props.requiredPermission && !hasPermission(props.requiredPermission)) {
    return false
  }
  
  // Check multiple permissions (all)
  if (props.requiredPermissions.length > 0 && !hasAllPermissions(props.requiredPermissions)) {
    return false
  }
  
  return true
})
</script>
```

## Data Protection and Privacy

### Secure Data Handling

```javascript
// utils/data-protection.js
import CryptoJS from 'crypto-js'

class DataProtection {
  constructor() {
    this.encryptionKey = this.getEncryptionKey()
  }
  
  // Get encryption key from secure source
  getEncryptionKey() {
    // In production, this should come from a secure key management service
    return process.env.VUE_APP_ENCRYPTION_KEY || 'default-key'
  }
  
  // Encrypt sensitive data
  encrypt(data) {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString()
      return encrypted
    } catch (error) {
      console.error('Encryption error:', error)
      throw new Error('Failed to encrypt data')
    }
  }
  
  // Decrypt sensitive data
  decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey)
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted)
    } catch (error) {
      console.error('Decryption error:', error)
      throw new Error('Failed to decrypt data')
    }
  }
  
  // Hash sensitive data (one-way)
  hash(data) {
    return CryptoJS.SHA256(data).toString()
  }
  
  // Mask sensitive data for display
  maskData(data, type = 'default') {
    if (!data) return ''
    
    switch (type) {
      case 'email':
        const [username, domain] = data.split('@')
        return `${username.substring(0, 2)}***@${domain}`
      
      case 'phone':
        return data.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3')
      
      case 'creditCard':
        return data.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '**** **** **** $4')
      
      case 'ssn':
        return data.replace(/(\d{3})(\d{2})(\d{4})/, '***-**-$3')
      
      default:
        return '*'.repeat(data.length)
    }
  }
  
  // Sanitize data for safe display
  sanitize(data) {
    if (typeof data !== 'string') return data
    
    return data
      .replace(/[<>"'&]/g, (match) => {
        const entities = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        }
        return entities[match]
      })
  }
  
  // Generate secure random token
  generateSecureToken(length = 32) {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  
  // Validate data integrity
  validateIntegrity(data, expectedHash) {
    const actualHash = this.hash(JSON.stringify(data))
    return actualHash === expectedHash
  }
}

export const dataProtection = new DataProtection()
export default dataProtection
```

### Privacy-Compliant Data Collection

```vue
<template>
  <div class="privacy-settings">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Privacy Settings</span>
          <el-tag type="info">GDPR Compliant</el-tag>
        </div>
      </template>
      
      <!-- Consent management -->
      <el-form :model="privacySettings" label-width="200px">
        <el-form-item label="Essential Cookies">
          <el-switch 
            v-model="privacySettings.essential" 
            disabled
          />
          <div class="setting-description">
            Required for basic website functionality. Cannot be disabled.
          </div>
        </el-form-item>
        
        <el-form-item label="Analytics Cookies">
          <el-switch 
            v-model="privacySettings.analytics"
            @change="updateConsent('analytics', $event)"
          />
          <div class="setting-description">
            Help us understand how you use our website to improve user experience.
          </div>
        </el-form-item>
        
        <el-form-item label="Marketing Cookies">
          <el-switch 
            v-model="privacySettings.marketing"
            @change="updateConsent('marketing', $event)"
          />
          <div class="setting-description">
            Used to show you relevant advertisements based on your interests.
          </div>
        </el-form-item>
        
        <el-form-item label="Personalization">
          <el-switch 
            v-model="privacySettings.personalization"
            @change="updateConsent('personalization', $event)"
          />
          <div class="setting-description">
            Customize content and features based on your preferences.
          </div>
        </el-form-item>
      </el-form>
      
      <el-divider />
      
      <!-- Data management -->
      <h3>Data Management</h3>
      
      <el-space direction="vertical" style="width: 100%">
        <el-button 
          type="primary" 
          @click="downloadData"
          :loading="downloading"
        >
          <el-icon><Download /></el-icon>
          Download My Data
        </el-button>
        
        <el-button 
          type="warning" 
          @click="requestDataDeletion"
          :loading="deleting"
        >
          <el-icon><Delete /></el-icon>
          Request Data Deletion
        </el-button>
        
        <el-button 
          type="info" 
          @click="viewDataUsage"
        >
          <el-icon><View /></el-icon>
          View Data Usage
        </el-button>
      </el-space>
    </el-card>
    
    <!-- Data usage modal -->
    <el-dialog
      v-model="dataUsageVisible"
      title="Data Usage Information"
      width="600px"
    >
      <el-table :data="dataUsageInfo" style="width: 100%">
        <el-table-column prop="category" label="Data Category" />
        <el-table-column prop="purpose" label="Purpose" />
        <el-table-column prop="retention" label="Retention Period" />
        <el-table-column prop="sharing" label="Third-party Sharing" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePrivacy } from '@/composables/usePrivacy'

const { 
  getConsentSettings, 
  updateConsentSettings, 
  downloadUserData, 
  requestDataDeletion 
} = usePrivacy()

const downloading = ref(false)
const deleting = ref(false)
const dataUsageVisible = ref(false)

const privacySettings = reactive({
  essential: true,
  analytics: false,
  marketing: false,
  personalization: false
})

const dataUsageInfo = ref([
  {
    category: 'Account Information',
    purpose: 'User authentication and account management',
    retention: '5 years after account deletion',
    sharing: 'No'
  },
  {
    category: 'Usage Analytics',
    purpose: 'Improve website performance and user experience',
    retention: '2 years',
    sharing: 'Anonymized data only'
  },
  {
    category: 'Marketing Data',
    purpose: 'Personalized advertisements and communications',
    retention: '1 year or until consent withdrawn',
    sharing: 'Trusted partners only'
  }
])

// Update consent settings
const updateConsent = async (type, value) => {
  try {
    await updateConsentSettings({ [type]: value })
    ElMessage.success('Privacy settings updated')
    
    // Update tracking scripts based on consent
    updateTrackingScripts(type, value)
    
  } catch (error) {
    console.error('Failed to update consent:', error)
    ElMessage.error('Failed to update privacy settings')
    
    // Revert the change
    privacySettings[type] = !value
  }
}

// Download user data (GDPR Article 20)
const downloadData = async () => {
  try {
    downloading.value = true
    
    const data = await downloadUserData()
    
    // Create and download file
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `user-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    
    ElMessage.success('Data download started')
    
  } catch (error) {
    console.error('Data download error:', error)
    ElMessage.error('Failed to download data')
  } finally {
    downloading.value = false
  }
}

// Request data deletion (GDPR Article 17)
const requestDataDeletion = async () => {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete all your data. This action cannot be undone. Are you sure?',
      'Confirm Data Deletion',
      {
        confirmButtonText: 'Delete My Data',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    deleting.value = true
    
    await requestDataDeletion()
    
    ElMessage.success('Data deletion request submitted. You will receive a confirmation email.')
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Data deletion error:', error)
      ElMessage.error('Failed to submit deletion request')
    }
  } finally {
    deleting.value = false
  }
}

// View data usage information
const viewDataUsage = () => {
  dataUsageVisible.value = true
}

// Update tracking scripts based on consent
const updateTrackingScripts = (type, enabled) => {
  switch (type) {
    case 'analytics':
      if (enabled) {
        // Load analytics script
        loadScript('https://www.google-analytics.com/analytics.js')
      } else {
        // Disable analytics
        if (window.gtag) {
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied'
          })
        }
      }
      break
      
    case 'marketing':
      if (enabled) {
        // Load marketing scripts
        loadScript('https://connect.facebook.net/en_US/fbevents.js')
      } else {
        // Disable marketing tracking
        if (window.gtag) {
          window.gtag('consent', 'update', {
            'ad_storage': 'denied'
          })
        }
      }
      break
  }
}

// Utility function to load scripts
const loadScript = (src) => {
  const script = document.createElement('script')
  script.src = src
  script.async = true
  document.head.appendChild(script)
}

// Load current settings on mount
onMounted(async () => {
  try {
    const settings = await getConsentSettings()
    Object.assign(privacySettings, settings)
  } catch (error) {
    console.error('Failed to load privacy settings:', error)
  }
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-description {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
```

## Security Headers and CSP

### Content Security Policy Configuration

```javascript
// vite.config.js - Security headers configuration
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'security-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Content Security Policy
          res.setHeader('Content-Security-Policy', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://api.example.com",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'"
          ].join('; '))
          
          // Other security headers
          res.setHeader('X-Content-Type-Options', 'nosniff')
          res.setHeader('X-Frame-Options', 'DENY')
          res.setHeader('X-XSS-Protection', '1; mode=block')
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
          res.setHeader('Permissions-Policy', [
            'camera=()',
            'microphone=()',
            'geolocation=()',
            'payment=()'
          ].join(', '))
          
          // HSTS (only in production)
          if (process.env.NODE_ENV === 'production') {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
          }
          
          next()
        })
      }
    }
  ]
})
```

### Security Monitoring

```javascript
// utils/security-monitor.js
class SecurityMonitor {
  constructor() {
    this.violations = []
    this.setupCSPReporting()
    this.setupSecurityEventListeners()
  }
  
  // Set up CSP violation reporting
  setupCSPReporting() {
    document.addEventListener('securitypolicyviolation', (event) => {
      const violation = {
        type: 'csp_violation',
        directive: event.violatedDirective,
        blockedURI: event.blockedURI,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        timestamp: Date.now()
      }
      
      this.reportViolation(violation)
    })
  }
  
  // Set up security event listeners
  setupSecurityEventListeners() {
    // Detect potential XSS attempts
    this.monitorDOMChanges()
    
    // Monitor for suspicious network requests
    this.monitorNetworkRequests()
    
    // Detect potential clickjacking
    this.monitorFrameAccess()
  }
  
  // Monitor DOM changes for potential XSS
  monitorDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.checkForSuspiciousContent(node)
            }
          })
        }
      })
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
  
  // Check for suspicious content
  checkForSuspiciousContent(element) {
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi
    ]
    
    const content = element.innerHTML
    
    suspiciousPatterns.forEach((pattern) => {
      if (pattern.test(content)) {
        this.reportViolation({
          type: 'potential_xss',
          element: element.tagName,
          content: content.substring(0, 100),
          timestamp: Date.now()
        })
      }
    })
  }
  
  // Monitor network requests
  monitorNetworkRequests() {
    const originalFetch = window.fetch
    
    window.fetch = async (...args) => {
      const [url, options] = args
      
      // Check for suspicious requests
      if (this.isSuspiciousRequest(url, options)) {
        this.reportViolation({
          type: 'suspicious_request',
          url: url.toString(),
          method: options?.method || 'GET',
          timestamp: Date.now()
        })
      }
      
      return originalFetch.apply(this, args)
    }
  }
  
  // Check if request is suspicious
  isSuspiciousRequest(url, options) {
    const urlString = url.toString()
    
    // Check for external domains not in whitelist
    const allowedDomains = [
      window.location.hostname,
      'api.example.com',
      'cdn.jsdelivr.net'
    ]
    
    try {
      const requestUrl = new URL(urlString)
      if (!allowedDomains.includes(requestUrl.hostname)) {
        return true
      }
    } catch (error) {
      return true // Invalid URL
    }
    
    return false
  }
  
  // Monitor frame access attempts
  monitorFrameAccess() {
    try {
      if (window.top !== window.self) {
        this.reportViolation({
          type: 'frame_access',
          message: 'Page loaded in frame',
          timestamp: Date.now()
        })
      }
    } catch (error) {
      // Cross-origin frame access blocked (good)
    }
  }
  
  // Report security violation
  reportViolation(violation) {
    this.violations.push(violation)
    
    // Send to security monitoring service
    this.sendToSecurityService(violation)
    
    // Log locally for debugging
    console.warn('Security violation detected:', violation)
  }
  
  // Send violation to security service
  async sendToSecurityService(violation) {
    try {
      await fetch('/api/security/violations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.getCSRFToken()
        },
        body: JSON.stringify({
          violation,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: Date.now()
        })
      })
    } catch (error) {
      console.error('Failed to report security violation:', error)
    }
  }
  
  // Get CSRF token
  getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
  }
  
  // Get violation summary
  getViolationSummary() {
    const summary = {}
    
    this.violations.forEach((violation) => {
      summary[violation.type] = (summary[violation.type] || 0) + 1
    })
    
    return summary
  }
}

// Initialize security monitoring
export const securityMonitor = new SecurityMonitor()
export default securityMonitor
```

## Best Practices Summary

### 1. Input Validation
- Validate all user inputs on both client and server side
- Use schema validation libraries like Zod
- Sanitize data before display using DOMPurify
- Implement proper file upload validation

### 2. Authentication & Authorization
- Implement secure login with rate limiting
- Use strong password policies
- Implement proper session management
- Use role-based access control (RBAC)

### 3. Data Protection
- Encrypt sensitive data in transit and at rest
- Implement proper key management
- Mask sensitive data in UI
- Comply with privacy regulations (GDPR, CCPA)

### 4. Security Headers
- Implement Content Security Policy (CSP)
- Use security headers (HSTS, X-Frame-Options, etc.)
- Monitor and report security violations
- Regular security audits and updates

### 5. Secure Development
- Follow secure coding practices
- Regular dependency updates
- Implement security monitoring
- Conduct security testing

By following these security best practices, you can build robust and secure Element Plus applications that protect user data and prevent common security vulnerabilities.