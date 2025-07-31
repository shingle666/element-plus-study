# Build Optimization and Deployment Strategies for Element Plus Applications

## Overview

This guide covers comprehensive build optimization techniques and deployment strategies for Element Plus applications, focusing on performance, scalability, and production readiness.

## Build Optimization Strategies

### Bundle Analysis and Optimization

```typescript
// vite.config.ts - Advanced build optimization
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    vue(),
    
    // HTML optimization
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Element Plus App',
          description: 'Modern Vue 3 application with Element Plus'
        }
      }
    }),
    
    // Legacy browser support
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    
    // Gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    
    // Brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    }),
    
    // Bundle analyzer
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          // Vendor chunks
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus'],
          'element-icons': ['@element-plus/icons-vue'],
          
          // Utility chunks
          'utils': ['lodash-es', 'dayjs', 'axios'],
          'charts': ['echarts', 'vue-echarts'],
          
          // Feature chunks
          'auth': [
            './src/stores/auth.ts',
            './src/composables/useAuth.ts',
            './src/api/auth.ts'
          ]
        },
        
        // Asset naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            const fileName = facadeModuleId.split('/').pop()?.replace('.vue', '') || 'chunk'
            return `js/${fileName}-[hash].js`
          }
          return 'js/[name]-[hash].js'
        },
        
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `images/[name]-[hash].${ext}`
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash].${ext}`
          }
          
          if (ext === 'css') {
            return `css/[name]-[hash].${ext}`
          }
          
          return `assets/[name]-[hash].${ext}`
        }
      },
      
      // External dependencies (for CDN)
      external: process.env.NODE_ENV === 'production' ? [
        // 'vue',
        // 'vue-router',
        // 'element-plus'
      ] : []
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    
    // CSS optimization
    cssCodeSplit: true,
    cssMinify: true
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'element-plus/es',
      'element-plus/es/components/*/style/index',
      '@element-plus/icons-vue',
      'lodash-es',
      'dayjs'
    ],
    exclude: [
      'vue-demi'
    ]
  }
})
```

### Tree Shaking Optimization

```typescript
// src/plugins/element-plus.ts - Optimized Element Plus setup
import type { App } from 'vue'

// Import only required components
const elementPlusComponents = {
  // Form components
  ElForm: () => import('element-plus/es/components/form'),
  ElFormItem: () => import('element-plus/es/components/form-item'),
  ElInput: () => import('element-plus/es/components/input'),
  ElSelect: () => import('element-plus/es/components/select'),
  ElOption: () => import('element-plus/es/components/option'),
  ElButton: () => import('element-plus/es/components/button'),
  
  // Data display
  ElTable: () => import('element-plus/es/components/table'),
  ElTableColumn: () => import('element-plus/es/components/table-column'),
  ElPagination: () => import('element-plus/es/components/pagination'),
  ElCard: () => import('element-plus/es/components/card'),
  ElTag: () => import('element-plus/es/components/tag'),
  
  // Navigation
  ElMenu: () => import('element-plus/es/components/menu'),
  ElMenuItem: () => import('element-plus/es/components/menu-item'),
  ElSubmenu: () => import('element-plus/es/components/sub-menu'),
  ElBreadcrumb: () => import('element-plus/es/components/breadcrumb'),
  ElBreadcrumbItem: () => import('element-plus/es/components/breadcrumb-item'),
  
  // Feedback
  ElDialog: () => import('element-plus/es/components/dialog'),
  ElDrawer: () => import('element-plus/es/components/drawer'),
  ElPopover: () => import('element-plus/es/components/popover'),
  ElTooltip: () => import('element-plus/es/components/tooltip')
}

// Import only required icons
const elementPlusIcons = {
  Search: () => import('@element-plus/icons-vue/dist/components/Search'),
  Edit: () => import('@element-plus/icons-vue/dist/components/Edit'),
  Delete: () => import('@element-plus/icons-vue/dist/components/Delete'),
  Plus: () => import('@element-plus/icons-vue/dist/components/Plus'),
  Download: () => import('@element-plus/icons-vue/dist/components/Download'),
  Upload: () => import('@element-plus/icons-vue/dist/components/Upload'),
  User: () => import('@element-plus/icons-vue/dist/components/User'),
  Setting: () => import('@element-plus/icons-vue/dist/components/Setting')
}

// Lazy component registration
export async function setupElementPlus(app: App) {
  // Register components lazily
  for (const [name, importFn] of Object.entries(elementPlusComponents)) {
    app.component(name, defineAsyncComponent(importFn))
  }
  
  // Register icons lazily
  for (const [name, importFn] of Object.entries(elementPlusIcons)) {
    app.component(name, defineAsyncComponent(importFn))
  }
  
  // Import and setup global services
  const [ElMessage, ElMessageBox, ElNotification, ElLoading] = await Promise.all([
    import('element-plus/es/components/message'),
    import('element-plus/es/components/message-box'),
    import('element-plus/es/components/notification'),
    import('element-plus/es/components/loading')
  ])
  
  // Global properties
  app.config.globalProperties.$message = ElMessage.default
  app.config.globalProperties.$msgbox = ElMessageBox.default
  app.config.globalProperties.$notify = ElNotification.default
  app.config.globalProperties.$loading = ElLoading.default.service
}
```

### Code Splitting Strategies

```typescript
// src/router/index.ts - Advanced route-based code splitting
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Lazy loading with error boundaries
const createAsyncComponent = (importFn: () => Promise<any>, chunkName?: string) => {
  return defineAsyncComponent({
    loader: importFn,
    loadingComponent: () => import('@/components/common/Loading.vue'),
    errorComponent: () => import('@/components/common/ErrorBoundary.vue'),
    delay: 200,
    timeout: 10000
  })
}

// Feature-based route grouping
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: createAsyncComponent(
      () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      'home'
    )
  },
  
  // Dashboard module
  {
    path: '/dashboard',
    component: createAsyncComponent(
      () => import(/* webpackChunkName: "dashboard" */ '@/layouts/DashboardLayout.vue'),
      'dashboard'
    ),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: createAsyncComponent(
          () => import(/* webpackChunkName: "dashboard-home" */ '@/views/dashboard/Home.vue')
        )
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: createAsyncComponent(
          () => import(/* webpackChunkName: "dashboard-analytics" */ '@/views/dashboard/Analytics.vue')
        )
      },
      {
        path: 'reports',
        name: 'Reports',
        component: createAsyncComponent(
          () => import(/* webpackChunkName: "dashboard-reports" */ '@/views/dashboard/Reports.vue')
        )
      }
    ]
  },
  
  // Admin module (role-based loading)
  {
    path: '/admin',
    component: createAsyncComponent(
      () => import(/* webpackChunkName: "admin" */ '@/layouts/AdminLayout.vue'),
      'admin'
    ),
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      {
        path: 'users',
        name: 'UserManagement',
        component: createAsyncComponent(
          () => import(/* webpackChunkName: "admin-users" */ '@/views/admin/Users.vue')
        )
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: createAsyncComponent(
          () => import(/* webpackChunkName: "admin-settings" */ '@/views/admin/Settings.vue')
        )
      }
    ]
  }
]

// Dynamic route loading based on user permissions
export const loadUserRoutes = async (userRoles: string[]) => {
  const dynamicRoutes: RouteRecordRaw[] = []
  
  // Load admin routes only for admin users
  if (userRoles.includes('admin')) {
    const adminModule = await import(
      /* webpackChunkName: "admin-routes" */ './modules/admin'
    )
    dynamicRoutes.push(...adminModule.routes)
  }
  
  // Load manager routes for managers
  if (userRoles.includes('manager')) {
    const managerModule = await import(
      /* webpackChunkName: "manager-routes" */ './modules/manager'
    )
    dynamicRoutes.push(...managerModule.routes)
  }
  
  return dynamicRoutes
}

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### Asset Optimization

```typescript
// scripts/optimize-assets.ts
import { readdir, readFile, writeFile, stat } from 'fs/promises'
import { join, extname } from 'path'
import sharp from 'sharp'
import { optimize } from 'svgo'

interface OptimizationOptions {
  inputDir: string
  outputDir: string
  quality: number
  formats: string[]
}

class AssetOptimizer {
  constructor(private options: OptimizationOptions) {}
  
  async optimizeImages() {
    const { inputDir, outputDir, quality, formats } = this.options
    
    const files = await this.getImageFiles(inputDir)
    
    for (const file of files) {
      const inputPath = join(inputDir, file)
      const ext = extname(file).toLowerCase()
      const baseName = file.replace(ext, '')
      
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        // Generate multiple formats
        for (const format of formats) {
          const outputPath = join(outputDir, `${baseName}.${format}`)
          
          await sharp(inputPath)
            .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
            .toFormat(format as any, { quality })
            .toFile(outputPath)
          
          console.log(`✅ Optimized: ${file} -> ${baseName}.${format}`)
        }
        
        // Generate responsive images
        const sizes = [480, 768, 1024, 1920]
        for (const size of sizes) {
          const outputPath = join(outputDir, `${baseName}-${size}w.webp`)
          
          await sharp(inputPath)
            .resize(size, null, { withoutEnlargement: true })
            .webp({ quality })
            .toFile(outputPath)
        }
      } else if (ext === '.svg') {
        await this.optimizeSvg(inputPath, join(outputDir, file))
      }
    }
  }
  
  private async optimizeSvg(inputPath: string, outputPath: string) {
    const svgContent = await readFile(inputPath, 'utf-8')
    
    const result = optimize(svgContent, {
      plugins: [
        'preset-default',
        'removeDimensions',
        'removeViewBox',
        'cleanupIDs'
      ]
    })
    
    await writeFile(outputPath, result.data)
    console.log(`✅ Optimized SVG: ${inputPath}`)
  }
  
  private async getImageFiles(dir: string): Promise<string[]> {
    const files = await readdir(dir)
    const imageFiles: string[] = []
    
    for (const file of files) {
      const filePath = join(dir, file)
      const stats = await stat(filePath)
      
      if (stats.isFile()) {
        const ext = extname(file).toLowerCase()
        if (['.jpg', '.jpeg', '.png', '.svg', '.webp'].includes(ext)) {
          imageFiles.push(file)
        }
      }
    }
    
    return imageFiles
  }
}

// Usage
const optimizer = new AssetOptimizer({
  inputDir: 'src/assets/images',
  outputDir: 'dist/assets/images',
  quality: 80,
  formats: ['webp', 'avif']
})

optimizer.optimizeImages().catch(console.error)
```

## Deployment Strategies

### Multi-Environment Configuration

```typescript
// config/environments.ts
export interface EnvironmentConfig {
  apiBaseUrl: string
  cdnUrl: string
  enableAnalytics: boolean
  enableErrorReporting: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  features: {
    enablePWA: boolean
    enableOfflineMode: boolean
    enablePushNotifications: boolean
  }
}

const environments: Record<string, EnvironmentConfig> = {
  development: {
    apiBaseUrl: 'http://localhost:8080/api',
    cdnUrl: '',
    enableAnalytics: false,
    enableErrorReporting: false,
    logLevel: 'debug',
    features: {
      enablePWA: false,
      enableOfflineMode: false,
      enablePushNotifications: false
    }
  },
  
  staging: {
    apiBaseUrl: 'https://staging-api.example.com/api',
    cdnUrl: 'https://staging-cdn.example.com',
    enableAnalytics: true,
    enableErrorReporting: true,
    logLevel: 'info',
    features: {
      enablePWA: true,
      enableOfflineMode: true,
      enablePushNotifications: false
    }
  },
  
  production: {
    apiBaseUrl: 'https://api.example.com/api',
    cdnUrl: 'https://cdn.example.com',
    enableAnalytics: true,
    enableErrorReporting: true,
    logLevel: 'error',
    features: {
      enablePWA: true,
      enableOfflineMode: true,
      enablePushNotifications: true
    }
  }
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = import.meta.env.MODE || 'development'
  return environments[env] || environments.development
}
```

### Docker Deployment

```dockerfile
# Dockerfile.production
# Multi-stage build for production
FROM node:18-alpine as build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
ARG BUILD_ENV=production
ENV NODE_ENV=production
RUN pnpm run build:${BUILD_ENV}

# Production stage
FROM nginx:alpine as production-stage

# Install security updates
RUN apk update && apk upgrade

# Copy built assets
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Create non-root user
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Set ownership
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chown -R nginx:nginx /var/cache/nginx

# Switch to non-root user
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Brotli compression (if module available)
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self'; object-src 'none'; child-src 'self'; frame-ancestors 'self'; form-action 'self'; base-uri 'self';" always;
    
    include /etc/nginx/conf.d/*.conf;
}
```

```nginx
# nginx/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # Enable HTTP/2 Server Push
    location = /index.html {
        add_header Link "</css/app.css>; rel=preload; as=style";
        add_header Link "</js/app.js>; rel=preload; as=script";
    }
    
    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache control for HTML files
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
    
    # Static assets with long-term caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Enable CORS for fonts
        location ~* \.(woff|woff2|ttf|eot)$ {
            add_header Access-Control-Allow-Origin "*";
        }
    }
    
    # API proxy (if needed)
    location /api/ {
        proxy_pass http://backend:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # Security
    location ~ /\. {
        deny all;
    }
    
    location ~ ~$ {
        deny all;
    }
}
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: element-plus-app
  labels:
    app: element-plus-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: element-plus-app
  template:
    metadata:
      labels:
        app: element-plus-app
    spec:
      containers:
      - name: element-plus-app
        image: your-registry/element-plus-app:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        env:
        - name: NODE_ENV
          value: "production"
---
apiVersion: v1
kind: Service
metadata:
  name: element-plus-app-service
spec:
  selector:
    app: element-plus-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: element-plus-app-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: element-plus-app-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: element-plus-app-service
            port:
              number: 80
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'pnpm'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Run linting
      run: pnpm run lint
    
    - name: Run type checking
      run: pnpm run type-check
    
    - name: Run unit tests
      run: pnpm run test:unit
    
    - name: Run e2e tests
      run: pnpm run test:e2e
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    outputs:
      image: ${{ steps.image.outputs.image }}
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'pnpm'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Build application
      run: |
        if [[ ${{ github.ref }} == 'refs/heads/main' ]]; then
          pnpm run build:production
        else
          pnpm run build:staging
        fi
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        file: ./Dockerfile.production
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
    
    - name: Output image
      id: image
      run: echo "image=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}" >> $GITHUB_OUTPUT

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Deploy to staging
      run: |
        echo "Deploying ${{ needs.build.outputs.image }} to staging"
        # Add your staging deployment commands here

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Deploy to production
      run: |
        echo "Deploying ${{ needs.build.outputs.image }} to production"
        # Add your production deployment commands here
```

### Performance Monitoring

```typescript
// src/utils/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  // Measure Core Web Vitals
  measureCoreWebVitals() {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric('LCP', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })
    
    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.recordMetric('FID', entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })
    
    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let clsValue = 0
      const entries = list.getEntries()
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      
      this.recordMetric('CLS', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })
  }
  
  // Measure custom metrics
  measureRouteChange(routeName: string) {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      this.recordMetric(`route-${routeName}`, duration)
    }
  }
  
  measureComponentRender(componentName: string) {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      this.recordMetric(`component-${componentName}`, duration)
    }
  }
  
  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)!
    values.push(value)
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
    
    // Send to analytics service
    this.sendToAnalytics(name, value)
  }
  
  private sendToAnalytics(metric: string, value: number) {
    // Send to your analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_metric', {
        metric_name: metric,
        metric_value: Math.round(value),
        custom_parameter: 'element_plus_app'
      })
    }
  }
  
  getMetrics() {
    const summary = new Map()
    
    for (const [name, values] of this.metrics) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      const min = Math.min(...values)
      const max = Math.max(...values)
      
      summary.set(name, { avg, min, max, count: values.length })
    }
    
    return summary
  }
}

// Usage in main.ts
const monitor = PerformanceMonitor.getInstance()
monitor.measureCoreWebVitals()
```

This comprehensive guide provides advanced build optimization techniques and deployment strategies for Element Plus applications, ensuring optimal performance and scalable deployment across different environments.