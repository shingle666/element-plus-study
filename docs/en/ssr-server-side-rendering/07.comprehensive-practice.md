# Comprehensive Practice: Element Plus SSR Implementation

## Overview

This comprehensive guide demonstrates a complete Element Plus SSR implementation, covering real-world scenarios, best practices, and advanced techniques through practical examples and case studies.

## Complete SSR Application Architecture

### Project Structure

```
element-plus-ssr-app/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppFooter.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   └── ErrorBoundary.vue
│   │   ├── layout/
│   │   │   ├── DefaultLayout.vue
│   │   │   ├── AdminLayout.vue
│   │   │   └── AuthLayout.vue
│   │   └── features/
│   │       ├── auth/
│   │       ├── dashboard/
│   │       ├── products/
│   │       └── user/
│   ├── pages/
│   │   ├── Home.vue
│   │   ├── About.vue
│   │   ├── Products.vue
│   │   ├── ProductDetail.vue
│   │   ├── Login.vue
│   │   └── Dashboard.vue
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── user.ts
│   │   └── app.ts
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useSEO.ts
│   │   └── useSSR.ts
│   ├── utils/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── seo.ts
│   │   └── ssr.ts
│   ├── plugins/
│   │   ├── element-plus.ts
│   │   ├── router.ts
│   │   ├── pinia.ts
│   │   └── i18n.ts
│   ├── entry-client.ts
│   ├── entry-server.ts
│   ├── main.ts
│   └── App.vue
├── server/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── index.ts
│   └── ssr-handler.ts
├── public/
├── dist/
├── dist-ssr/
└── package.json
```

### Main Application Setup

```typescript
// src/main.ts
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { createRouter } from './plugins/router'
import { setupElementPlus } from './plugins/element-plus'
import { setupI18n } from './plugins/i18n'
import 'element-plus/dist/index.css'
import './styles/main.scss'

export function createApp() {
  const app = createSSRApp(App)
  
  // Setup Pinia store
  const pinia = createPinia()
  app.use(pinia)
  
  // Setup router
  const router = createRouter()
  app.use(router)
  
  // Setup Element Plus
  setupElementPlus(app)
  
  // Setup i18n
  const i18n = setupI18n()
  app.use(i18n)
  
  return { app, router, pinia, i18n }
}
```

### Advanced Router Configuration

```typescript
// src/plugins/router.ts
import { createRouter as _createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSEOStore } from '@/stores/seo'

// Route definitions with SSR considerations
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: 'Home - Element Plus SSR',
      description: 'Welcome to our Element Plus SSR application',
      requiresAuth: false,
      preload: true
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/pages/Products.vue'),
    meta: {
      title: 'Products - Element Plus SSR',
      description: 'Browse our product catalog',
      requiresAuth: false,
      preload: true
    }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('@/pages/ProductDetail.vue'),
    meta: {
      title: 'Product Details - Element Plus SSR',
      description: 'View product details and specifications',
      requiresAuth: false,
      preload: false
    },
    props: true
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: {
      title: 'Dashboard - Element Plus SSR',
      description: 'User dashboard and account management',
      requiresAuth: true,
      preload: false,
      layout: 'admin'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: {
      title: 'Login - Element Plus SSR',
      description: 'Sign in to your account',
      requiresAuth: false,
      layout: 'auth'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/About.vue'),
    meta: {
      title: 'About Us - Element Plus SSR',
      description: 'Learn more about our company and mission',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: {
      title: 'Page Not Found - Element Plus SSR',
      description: 'The page you are looking for does not exist'
    }
  }
]

export function createRouter() {
  const router = _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { top: 0 }
      }
    }
  })
  
  // Global navigation guards
  router.beforeEach(async (to, from, next) => {
    // Authentication check
    if (to.meta.requiresAuth) {
      const authStore = useAuthStore()
      
      if (!authStore.isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
        return
      }
    }
    
    // SEO meta updates
    if (!import.meta.env.SSR) {
      const seoStore = useSEOStore()
      seoStore.updateMeta({
        title: to.meta.title as string,
        description: to.meta.description as string
      })
    }
    
    next()
  })
  
  // Error handling
  router.onError((error) => {
    console.error('Router error:', error)
    
    // Send error to monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: `Router error: ${error.message}`,
        fatal: false
      })
    }
  })
  
  return router
}
```

### Comprehensive Store Implementation

```typescript
// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types/auth'
import { authAPI } from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'guest')
  const hasPermission = computed(() => (permission: string) => {
    return user.value?.permissions?.includes(permission) || false
  })
  
  // Actions
  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authAPI.login(credentials)
      
      token.value = response.token
      user.value = response.user
      
      // Store in localStorage for client-side persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user_data', JSON.stringify(response.user))
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const logout = async () => {
    loading.value = true
    
    try {
      if (token.value) {
        await authAPI.logout()
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear state
      user.value = null
      token.value = null
      error.value = null
      loading.value = false
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }
  }
  
  const register = async (data: RegisterData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authAPI.register(data)
      
      token.value = response.token
      user.value = response.user
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user_data', JSON.stringify(response.user))
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const refreshToken = async () => {
    if (!token.value) return
    
    try {
      const response = await authAPI.refreshToken(token.value)
      token.value = response.token
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token)
      }
    } catch (err) {
      console.error('Token refresh failed:', err)
      await logout()
    }
  }
  
  const initializeAuth = () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user_data')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    }
  }
  
  // SSR state hydration
  const $hydrate = (state: any) => {
    if (state.user) user.value = state.user
    if (state.token) token.value = state.token
  }
  
  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    userRole,
    hasPermission,
    
    // Actions
    login,
    logout,
    register,
    refreshToken,
    initializeAuth,
    $hydrate
  }
})
```

### Advanced SSR Data Fetching

```typescript
// src/composables/useSSR.ts
import { ref, onServerPrefetch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface SSRDataOptions {
  key: string
  fetcher: () => Promise<any>
  dependencies?: () => any[]
  cache?: boolean
  ttl?: number
  requiresAuth?: boolean
}

export function useSSRData<T>(options: SSRDataOptions) {
  const { key, fetcher, dependencies = () => [], cache = true, ttl = 300000, requiresAuth = false } = options
  
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const route = useRoute()
  const authStore = useAuthStore()
  
  const cacheKey = `${key}-${route.fullPath}`
  
  const fetchData = async (force = false) => {
    // Check authentication requirement
    if (requiresAuth && !authStore.isAuthenticated) {
      return
    }
    
    // Check cache first
    if (cache && !force && typeof window !== 'undefined') {
      const cached = getCachedData(cacheKey)
      if (cached) {
        data.value = cached
        return cached
      }
    }
    
    loading.value = true
    error.value = null
    
    try {
      const result = await fetcher()
      data.value = result
      
      // Cache the result
      if (cache && typeof window !== 'undefined') {
        setCachedData(cacheKey, result, ttl)
      }
      
      return result
    } catch (err: any) {
      error.value = err
      console.error(`SSR data fetch error for ${key}:`, err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const refresh = () => fetchData(true)
  
  // Server-side prefetch
  onServerPrefetch(async () => {
    await fetchData()
  })
  
  // Client-side fetch if no data
  onMounted(() => {
    if (!data.value) {
      fetchData()
    }
  })
  
  return {
    data,
    loading,
    error,
    refresh,
    fetchData
  }
}

// Cache utilities
function getCachedData(key: string) {
  try {
    const cached = localStorage.getItem(`ssr_cache_${key}`)
    if (!cached) return null
    
    const { data, timestamp, ttl } = JSON.parse(cached)
    
    if (Date.now() - timestamp > ttl) {
      localStorage.removeItem(`ssr_cache_${key}`)
      return null
    }
    
    return data
  } catch {
    return null
  }
}

function setCachedData(key: string, data: any, ttl: number) {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    }
    
    localStorage.setItem(`ssr_cache_${key}`, JSON.stringify(cacheData))
  } catch (err) {
    console.warn('Failed to cache data:', err)
  }
}
```

### Real-World Page Implementation

```vue
<!-- src/pages/ProductDetail.vue -->
<template>
  <div class="product-detail">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <el-result
        icon="error"
        title="Failed to Load Product"
        :sub-title="error.message"
      >
        <template #extra>
          <el-button type="primary" @click="refresh">
            Try Again
          </el-button>
        </template>
      </el-result>
    </div>
    
    <!-- Product Content -->
    <div v-else-if="product" class="product-content">
      <!-- Breadcrumb -->
      <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item :to="{ name: 'Home' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Products' }">Products</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      
      <!-- Product Header -->
      <div class="product-header">
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="product-images">
              <el-carousel
                :interval="0"
                indicator-position="outside"
                height="400px"
              >
                <el-carousel-item
                  v-for="(image, index) in product.images"
                  :key="index"
                >
                  <el-image
                    :src="image.url"
                    :alt="product.name"
                    fit="cover"
                    class="product-image"
                    lazy
                  />
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-col>
          
          <el-col :span="12">
            <div class="product-info">
              <h1 class="product-title">{{ product.name }}</h1>
              
              <div class="product-rating">
                <el-rate
                  v-model="product.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
                <span class="review-count">
                  ({{ product.reviewCount }} reviews)
                </span>
              </div>
              
              <div class="product-price">
                <span class="current-price">${{ product.price }}</span>
                <span v-if="product.originalPrice" class="original-price">
                  ${{ product.originalPrice }}
                </span>
                <el-tag v-if="product.discount" type="danger" class="discount-tag">
                  {{ product.discount }}% OFF
                </el-tag>
              </div>
              
              <div class="product-description">
                <p>{{ product.description }}</p>
              </div>
              
              <!-- Product Options -->
              <div class="product-options">
                <div v-if="product.variants" class="variant-selector">
                  <label>Variant:</label>
                  <el-select v-model="selectedVariant" placeholder="Select variant">
                    <el-option
                      v-for="variant in product.variants"
                      :key="variant.id"
                      :label="variant.name"
                      :value="variant.id"
                    />
                  </el-select>
                </div>
                
                <div class="quantity-selector">
                  <label>Quantity:</label>
                  <el-input-number
                    v-model="quantity"
                    :min="1"
                    :max="product.stock"
                    controls-position="right"
                  />
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="product-actions">
                <el-button
                  type="primary"
                  size="large"
                  :disabled="!product.inStock"
                  :loading="addingToCart"
                  @click="addToCart"
                >
                  <el-icon><ShoppingCart /></el-icon>
                  {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
                </el-button>
                
                <el-button
                  size="large"
                  :icon="isFavorite ? 'StarFilled' : 'Star'"
                  @click="toggleFavorite"
                >
                  {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
                </el-button>
              </div>
              
              <!-- Product Features -->
              <div class="product-features">
                <el-tag
                  v-for="feature in product.features"
                  :key="feature"
                  class="feature-tag"
                >
                  {{ feature }}
                </el-tag>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <!-- Product Details Tabs -->
      <div class="product-details">
        <el-tabs v-model="activeTab" class="details-tabs">
          <el-tab-pane label="Specifications" name="specs">
            <div class="specifications">
              <el-descriptions :column="2" border>
                <el-descriptions-item
                  v-for="(value, key) in product.specifications"
                  :key="key"
                  :label="formatSpecLabel(key)"
                >
                  {{ value }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="Reviews" name="reviews">
            <ProductReviews :product-id="product.id" />
          </el-tab-pane>
          
          <el-tab-pane label="Shipping" name="shipping">
            <ShippingInfo :product="product" />
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- Related Products -->
      <div class="related-products">
        <h3>Related Products</h3>
        <RelatedProducts :product-id="product.id" />
      </div>
    </div>
    
    <!-- Not Found State -->
    <div v-else class="not-found">
      <el-result
        icon="warning"
        title="Product Not Found"
        sub-title="The product you are looking for does not exist."
      >
        <template #extra>
          <el-button type="primary" @click="$router.push({ name: 'Products' })">
            Browse Products
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ElSkeleton,
  ElResult,
  ElButton,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElRow,
  ElCol,
  ElCarousel,
  ElCarouselItem,
  ElImage,
  ElRate,
  ElTag,
  ElSelect,
  ElOption,
  ElInputNumber,
  ElIcon,
  ElTabs,
  ElTabPane,
  ElDescriptions,
  ElDescriptionsItem,
  ElMessage
} from 'element-plus'
import { ShoppingCart, Star, StarFilled } from '@element-plus/icons-vue'
import { useSSRData } from '@/composables/useSSR'
import { useCartStore } from '@/stores/cart'
import { useFavoritesStore } from '@/stores/favorites'
import { useSEO } from '@/composables/useSEO'
import { productAPI } from '@/utils/api'
import ProductReviews from '@/components/features/products/ProductReviews.vue'
import ShippingInfo from '@/components/features/products/ShippingInfo.vue'
import RelatedProducts from '@/components/features/products/RelatedProducts.vue'

interface Props {
  id: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

// Reactive state
const selectedVariant = ref<string | null>(null)
const quantity = ref(1)
const activeTab = ref('specs')
const addingToCart = ref(false)

// SSR data fetching
const {
  data: product,
  loading,
  error,
  refresh
} = useSSRData({
  key: `product-${props.id}`,
  fetcher: () => productAPI.getById(props.id),
  dependencies: () => [props.id]
})

// Computed properties
const isFavorite = computed(() => {
  return product.value ? favoritesStore.isFavorite(product.value.id) : false
})

// SEO setup
const { updateMeta } = useSEO()

watch(product, (newProduct) => {
  if (newProduct) {
    updateMeta({
      title: `${newProduct.name} - Element Plus SSR`,
      description: newProduct.description,
      image: newProduct.images[0]?.url,
      type: 'product',
      price: newProduct.price,
      currency: 'USD',
      availability: newProduct.inStock ? 'in_stock' : 'out_of_stock'
    })
  }
}, { immediate: true })

// Methods
const addToCart = async () => {
  if (!product.value) return
  
  addingToCart.value = true
  
  try {
    await cartStore.addItem({
      productId: product.value.id,
      variantId: selectedVariant.value,
      quantity: quantity.value
    })
    
    ElMessage.success('Product added to cart!')
  } catch (error: any) {
    ElMessage.error(error.message || 'Failed to add product to cart')
  } finally {
    addingToCart.value = false
  }
}

const toggleFavorite = async () => {
  if (!product.value) return
  
  try {
    if (isFavorite.value) {
      await favoritesStore.removeFromFavorites(product.value.id)
      ElMessage.success('Removed from favorites')
    } else {
      await favoritesStore.addToFavorites(product.value.id)
      ElMessage.success('Added to favorites')
    }
  } catch (error: any) {
    ElMessage.error(error.message || 'Failed to update favorites')
  }
}

const formatSpecLabel = (key: string) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

// Watch for route changes
watch(() => props.id, () => {
  refresh()
})
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading-container,
.error-container,
.not-found {
  padding: 40px 20px;
}

.breadcrumb {
  margin-bottom: 24px;
}

.product-header {
  margin-bottom: 40px;
}

.product-images {
  border-radius: 8px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 400px;
}

.product-info {
  padding-left: 24px;
}

.product-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #303133;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.review-count {
  margin-left: 8px;
  color: #909399;
}

.product-price {
  margin-bottom: 16px;
}

.current-price {
  font-size: 24px;
  font-weight: 600;
  color: #e6a23c;
  margin-right: 12px;
}

.original-price {
  font-size: 18px;
  color: #909399;
  text-decoration: line-through;
  margin-right: 8px;
}

.discount-tag {
  font-size: 12px;
}

.product-description {
  margin-bottom: 24px;
  color: #606266;
  line-height: 1.6;
}

.product-options {
  margin-bottom: 24px;
}

.variant-selector,
.quantity-selector {
  margin-bottom: 16px;
}

.variant-selector label,
.quantity-selector label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #303133;
}

.product-actions {
  margin-bottom: 24px;
}

.product-actions .el-button {
  margin-right: 12px;
}

.product-features {
  margin-bottom: 24px;
}

.feature-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.product-details {
  margin-bottom: 40px;
}

.details-tabs {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.specifications {
  padding: 16px 0;
}

.related-products h3 {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

@media (max-width: 768px) {
  .product-info {
    padding-left: 0;
    margin-top: 24px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .current-price {
    font-size: 20px;
  }
}
</style>
```

### Advanced Server Implementation

```typescript
// server/ssr-handler.ts
import { Request, Response } from 'express'
import { renderToString } from 'vue/server-renderer'
import { createApp } from '../src/main'
import { renderPreloadLinks } from './utils/preload'
import { generateSEOTags } from './utils/seo'
import { performanceMonitor } from './middleware/performance'
import { cacheManager } from './utils/cache'
import fs from 'fs/promises'
import path from 'path'

interface SSRContext {
  url: string
  userAgent: string
  acceptLanguage: string
  cookies: Record<string, string>
  headers: Record<string, string>
}

class SSRHandler {
  private template: string = ''
  private manifest: any = {}
  
  async initialize() {
    // Load HTML template
    this.template = await fs.readFile(
      path.resolve('dist/index.html'),
      'utf-8'
    )
    
    // Load Vite manifest for production
    if (process.env.NODE_ENV === 'production') {
      this.manifest = JSON.parse(
        await fs.readFile(
          path.resolve('dist/manifest.json'),
          'utf-8'
        )
      )
    }
  }
  
  async render(req: Request, res: Response) {
    const requestId = req.requestId || 'unknown'
    const startTime = Date.now()
    
    try {
      const context: SSRContext = {
        url: req.originalUrl,
        userAgent: req.get('User-Agent') || '',
        acceptLanguage: req.get('Accept-Language') || 'en',
        cookies: req.cookies || {},
        headers: req.headers as Record<string, string>
      }
      
      // Check cache first
      const cacheKey = this.generateCacheKey(context)
      const cached = await cacheManager.get(cacheKey)
      
      if (cached) {
        console.log(`📦 Cache hit for ${context.url}`);
        res.setHeader('X-Cache', 'HIT')
        res.setHeader('Content-Type', 'text/html')
        return res.send(cached)
      }
      
      // Create app instance
      const { app, router, pinia } = createApp()
      
      // Set server-side context
      app.provide('ssrContext', context)
      
      // Navigate to the requested route
      await router.push(context.url)
      await router.isReady()
      
      // Check if route exists
      const matchedRoute = router.currentRoute.value.matched[0]
      if (!matchedRoute) {
        return this.render404(res)
      }
      
      // Prefetch data for matched components
      await this.prefetchData(matchedRoute, context)
      
      // Render app to string
      const appHtml = await renderToString(app)
      
      // Generate preload links
      const preloadLinks = renderPreloadLinks(this.manifest, router.currentRoute.value)
      
      // Generate SEO tags
      const seoTags = generateSEOTags(router.currentRoute.value, context)
      
      // Get serialized state
      const state = JSON.stringify(pinia.state.value)
      
      // Inject into template
      const html = this.template
        .replace('<!--preload-links-->', preloadLinks)
        .replace('<!--seo-tags-->', seoTags)
        .replace('<!--app-html-->', appHtml)
        .replace('<!--pinia-state-->', `<script>window.__PINIA_STATE__=${state}</script>`)
        .replace('<!--ssr-context-->', `<script>window.__SSR_CONTEXT__=${JSON.stringify(context)}</script>`)
      
      // Cache the result
      const shouldCache = this.shouldCacheRoute(router.currentRoute.value)
      if (shouldCache) {
        await cacheManager.set(cacheKey, html, 300) // 5 minutes
      }
      
      // Set response headers
      res.setHeader('Content-Type', 'text/html')
      res.setHeader('X-Cache', 'MISS')
      res.setHeader('X-Render-Time', `${Date.now() - startTime}ms`)
      
      // Track performance
      performanceMonitor.trackSSRRender(context.url, Date.now() - startTime)
      
      res.send(html)
      
    } catch (error: any) {
      console.error('SSR Error:', error)
      
      // Track error
      performanceMonitor.trackSSRError(context?.url || req.originalUrl, error)
      
      // Fallback to client-side rendering
      return this.renderFallback(res, error)
    }
  }
  
  private async prefetchData(route: any, context: SSRContext) {
    const components = route.components || { default: route.component }
    
    for (const component of Object.values(components)) {
      if (component && typeof component === 'object' && component.serverPrefetch) {
        await component.serverPrefetch(context)
      }
    }
  }
  
  private generateCacheKey(context: SSRContext): string {
    const { url, acceptLanguage } = context
    return `ssr:${url}:${acceptLanguage}`
  }
  
  private shouldCacheRoute(route: any): boolean {
    // Don't cache authenticated routes
    if (route.meta?.requiresAuth) return false
    
    // Don't cache dynamic routes with parameters
    if (route.params && Object.keys(route.params).length > 0) return false
    
    // Cache static pages
    return route.meta?.cache !== false
  }
  
  private render404(res: Response) {
    const html404 = this.template
      .replace('<!--app-html-->', '<div id="app"><h1>404 - Page Not Found</h1></div>')
      .replace('<!--preload-links-->', '')
      .replace('<!--seo-tags-->', '<title>404 - Page Not Found</title>')
      .replace('<!--pinia-state-->', '')
      .replace('<!--ssr-context-->', '')
    
    res.status(404).send(html404)
  }
  
  private renderFallback(res: Response, error: Error) {
    const fallbackHtml = this.template
      .replace('<!--app-html-->', '<div id="app"></div>')
      .replace('<!--preload-links-->', '')
      .replace('<!--seo-tags-->', '<title>Loading...</title>')
      .replace('<!--pinia-state-->', '')
      .replace('<!--ssr-context-->', `<script>window.__SSR_ERROR__=${JSON.stringify(error.message)}</script>`)
    
    res.status(500).send(fallbackHtml)
  }
}

export const ssrHandler = new SSRHandler()
```

### Production Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting Element Plus SSR deployment..."

# Environment variables
ENVIRONMENT=${1:-production}
IMAGE_TAG=${2:-latest}
REGISTRY=${REGISTRY:-ghcr.io/your-org}
IMAGE_NAME=${IMAGE_NAME:-element-plus-ssr}

echo "📋 Deployment Configuration:"
echo "  Environment: $ENVIRONMENT"
echo "  Image: $REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
echo "  Registry: $REGISTRY"

# Build and push Docker image
echo "🔨 Building Docker image..."
docker build -t $REGISTRY/$IMAGE_NAME:$IMAGE_TAG .

echo "📤 Pushing Docker image..."
docker push $REGISTRY/$IMAGE_NAME:$IMAGE_TAG

# Deploy to Kubernetes
echo "☸️ Deploying to Kubernetes..."
kubectl set image deployment/element-plus-ssr \
  element-plus-ssr=$REGISTRY/$IMAGE_NAME:$IMAGE_TAG \
  -n element-plus-ssr-$ENVIRONMENT

# Wait for rollout to complete
echo "⏳ Waiting for deployment to complete..."
kubectl rollout status deployment/element-plus-ssr \
  -n element-plus-ssr-$ENVIRONMENT \
  --timeout=600s

# Verify deployment
echo "✅ Verifying deployment..."
kubectl get pods -n element-plus-ssr-$ENVIRONMENT

# Run health checks
echo "🏥 Running health checks..."
if [ "$ENVIRONMENT" = "production" ]; then
  HEALTH_URL="https://your-domain.com/health"
else
  HEALTH_URL="https://staging.your-domain.com/health"
fi

# Wait for service to be ready
sleep 30

# Check health endpoint
if curl -f $HEALTH_URL; then
  echo "✅ Health check passed!"
else
  echo "❌ Health check failed!"
  exit 1
fi

# Run smoke tests
echo "🧪 Running smoke tests..."
npm run test:smoke:$ENVIRONMENT

echo "🎉 Deployment completed successfully!"

# Send notification
if [ -n "$SLACK_WEBHOOK_URL" ]; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"🚀 Element Plus SSR deployed to $ENVIRONMENT successfully!\"}" \
    $SLACK_WEBHOOK_URL
fi
```

This comprehensive practice guide demonstrates a complete Element Plus SSR implementation with real-world patterns, advanced features, and production-ready deployment strategies.