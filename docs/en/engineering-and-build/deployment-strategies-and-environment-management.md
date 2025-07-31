# Deployment Strategies and Environment Management for Element Plus Applications

## Overview

This guide covers comprehensive deployment strategies, environment management, and DevOps practices for Element Plus applications, including CI/CD pipelines, containerization, cloud deployment, and environment-specific configurations.

## Environment Configuration Management

### Environment Variables and Configuration

```typescript
// src/config/environment.ts
export interface EnvironmentConfig {
  app: {
    name: string
    version: string
    environment: 'development' | 'staging' | 'production'
    debug: boolean
  }
  api: {
    baseUrl: string
    timeout: number
    retryAttempts: number
  }
  auth: {
    tokenKey: string
    refreshTokenKey: string
    tokenExpiry: number
  }
  monitoring: {
    enabled: boolean
    sentryDsn?: string
    googleAnalyticsId?: string
    hotjarId?: string
  }
  features: {
    enableBetaFeatures: boolean
    enableAnalytics: boolean
    enableErrorReporting: boolean
    enablePerformanceMonitoring: boolean
  }
  cdn: {
    baseUrl: string
    assetsPath: string
  }
  cache: {
    enabled: boolean
    ttl: number
    version: string
  }
}

class EnvironmentManager {
  private config: EnvironmentConfig
  
  constructor() {
    this.config = this.loadConfiguration()
    this.validateConfiguration()
  }
  
  private loadConfiguration(): EnvironmentConfig {
    const env = import.meta.env
    
    return {
      app: {
        name: env.VITE_APP_NAME || 'Element Plus App',
        version: env.VITE_APP_VERSION || '1.0.0',
        environment: env.VITE_APP_ENV || 'development',
        debug: env.VITE_APP_DEBUG === 'true'
      },
      api: {
        baseUrl: env.VITE_API_BASE_URL || 'http://localhost:3000/api',
        timeout: parseInt(env.VITE_API_TIMEOUT || '10000'),
        retryAttempts: parseInt(env.VITE_API_RETRY_ATTEMPTS || '3')
      },
      auth: {
        tokenKey: env.VITE_AUTH_TOKEN_KEY || 'auth_token',
        refreshTokenKey: env.VITE_AUTH_REFRESH_TOKEN_KEY || 'refresh_token',
        tokenExpiry: parseInt(env.VITE_AUTH_TOKEN_EXPIRY || '3600')
      },
      monitoring: {
        enabled: env.VITE_MONITORING_ENABLED === 'true',
        sentryDsn: env.VITE_SENTRY_DSN,
        googleAnalyticsId: env.VITE_GA_ID,
        hotjarId: env.VITE_HOTJAR_ID
      },
      features: {
        enableBetaFeatures: env.VITE_ENABLE_BETA_FEATURES === 'true',
        enableAnalytics: env.VITE_ENABLE_ANALYTICS === 'true',
        enableErrorReporting: env.VITE_ENABLE_ERROR_REPORTING === 'true',
        enablePerformanceMonitoring: env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true'
      },
      cdn: {
        baseUrl: env.VITE_CDN_BASE_URL || '',
        assetsPath: env.VITE_CDN_ASSETS_PATH || '/assets'
      },
      cache: {
        enabled: env.VITE_CACHE_ENABLED === 'true',
        ttl: parseInt(env.VITE_CACHE_TTL || '3600'),
        version: env.VITE_CACHE_VERSION || '1.0.0'
      }
    }
  }
  
  private validateConfiguration() {
    const requiredVars = [
      'VITE_APP_NAME',
      'VITE_API_BASE_URL'
    ]
    
    const missing = requiredVars.filter(varName => !import.meta.env[varName])
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
    
    // Validate URLs
    try {
      new URL(this.config.api.baseUrl)
      if (this.config.cdn.baseUrl) {
        new URL(this.config.cdn.baseUrl)
      }
    } catch (error) {
      throw new Error('Invalid URL in configuration')
    }
  }
  
  public getConfig(): EnvironmentConfig {
    return { ...this.config }
  }
  
  public get(key: string): any {
    return this.getNestedValue(this.config, key)
  }
  
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }
  
  public isDevelopment(): boolean {
    return this.config.app.environment === 'development'
  }
  
  public isStaging(): boolean {
    return this.config.app.environment === 'staging'
  }
  
  public isProduction(): boolean {
    return this.config.app.environment === 'production'
  }
  
  public isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
    return this.config.features[feature]
  }
}

export const environmentManager = new EnvironmentManager()
export const config = environmentManager.getConfig()
```

### Environment-Specific Build Configuration

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const isProduction = mode === 'production'
  const isStaging = mode === 'staging'
  const isDevelopment = mode === 'development'
  
  return {
    plugins: [
      vue(),
      
      // HTML template processing
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_APP_NAME || 'Element Plus App',
            description: env.VITE_APP_DESCRIPTION || 'Modern Vue 3 application with Element Plus',
            keywords: env.VITE_APP_KEYWORDS || 'vue,element-plus,typescript',
            author: env.VITE_APP_AUTHOR || 'Your Name',
            gaId: env.VITE_GA_ID || '',
            hotjarId: env.VITE_HOTJAR_ID || '',
            sentryDsn: env.VITE_SENTRY_DSN || ''
          }
        }
      }),
      
      // PWA configuration
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
        },
        manifest: {
          name: env.VITE_APP_NAME || 'Element Plus App',
          short_name: env.VITE_APP_SHORT_NAME || 'EP App',
          description: env.VITE_APP_DESCRIPTION || 'Modern Vue 3 application',
          theme_color: '#409eff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
      
      // Bundle analyzer for production builds
      isProduction && visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ].filter(Boolean),
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '~': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@views': resolve(__dirname, 'src/views'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@stores': resolve(__dirname, 'src/stores')
      }
    },
    
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/styles/variables.scss" as *;
            @use "@/styles/mixins.scss" as *;
          `
        }
      }
    },
    
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info']
        }
      } : undefined,
      
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            vue: ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
            
            // Utility chunks
            utils: ['lodash-es', 'dayjs', 'axios'],
            
            // Feature chunks
            charts: ['echarts', 'vue-echarts'],
            icons: ['@element-plus/icons-vue']
          },
          
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()
              : 'chunk'
            return `assets/js/[name]-[hash].js`
          },
          
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name!.split('.')
            const ext = info[info.length - 1]
            
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name!)) {
              return `assets/images/[name]-[hash].${ext}`
            }
            
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name!)) {
              return `assets/fonts/[name]-[hash].${ext}`
            }
            
            if (/\.css$/i.test(assetInfo.name!)) {
              return `assets/css/[name]-[hash].${ext}`
            }
            
            return `assets/[name]-[hash].${ext}`
          }
        }
      },
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000
    },
    
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_DEV_PORT || '3000'),
      open: env.VITE_DEV_OPEN === 'true',
      cors: true,
      
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    preview: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_PREVIEW_PORT || '4173'),
      cors: true
    },
    
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __COMMIT_HASH__: JSON.stringify(process.env.COMMIT_HASH || 'unknown')
    }
  }
})
```

## Docker Containerization

### Multi-stage Dockerfile

```dockerfile
# Dockerfile
# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments
ARG NODE_ENV=production
ARG VITE_APP_ENV=production
ARG VITE_API_BASE_URL
ARG VITE_APP_NAME
ARG VITE_APP_VERSION

# Set environment variables
ENV NODE_ENV=$NODE_ENV
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Build application
RUN pnpm run build

# Production stage
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache curl

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy environment configuration script
COPY docker/env-config.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/env-config.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
# docker/nginx.conf
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
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';" always;
    
    # Include server configurations
    include /etc/nginx/conf.d/*.conf;
}
```

```nginx
# docker/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    # Security
    server_tokens off;
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # Static assets with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # CORS for fonts
        location ~* \.(woff|woff2|ttf|eot)$ {
            add_header Access-Control-Allow-Origin "*";
        }
    }
    
    # API proxy
    location /api/ {
        proxy_pass $API_BASE_URL;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
        
        # No cache for HTML files
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
        }
    }
    
    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### Environment Configuration Script

```bash
#!/bin/sh
# docker/env-config.sh

# Replace environment variables in nginx config
envsubst '${API_BASE_URL}' < /etc/nginx/conf.d/default.conf > /tmp/default.conf
mv /tmp/default.conf /etc/nginx/conf.d/default.conf

# Generate runtime configuration for the app
cat > /usr/share/nginx/html/config.js << EOF
window.__RUNTIME_CONFIG__ = {
  API_BASE_URL: '${API_BASE_URL:-http://localhost:3000/api}',
  APP_VERSION: '${APP_VERSION:-1.0.0}',
  ENVIRONMENT: '${ENVIRONMENT:-production}',
  SENTRY_DSN: '${SENTRY_DSN:-}',
  GA_ID: '${GA_ID:-}'
};
EOF

echo "Environment configuration completed"
```

### Docker Compose for Different Environments

```yaml
# docker-compose.yml (Development)
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_API_BASE_URL=http://localhost:8080/api
    depends_on:
      - api
    networks:
      - app-network
  
  api:
    image: your-api:latest
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
    depends_on:
      - db
    networks:
      - app-network
  
  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

```yaml
# docker-compose.prod.yml (Production)
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NODE_ENV=production
        - VITE_APP_ENV=production
        - VITE_API_BASE_URL=${API_BASE_URL}
        - VITE_APP_NAME=${APP_NAME}
        - VITE_APP_VERSION=${APP_VERSION}
    ports:
      - "80:80"
    environment:
      - API_BASE_URL=${API_BASE_URL}
      - APP_VERSION=${APP_VERSION}
      - ENVIRONMENT=production
      - SENTRY_DSN=${SENTRY_DSN}
      - GA_ID=${GA_ID}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - app-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.app.tls=true"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"

networks:
  app-network:
    external: true
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop]
  release:
    types: [published]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Code Quality and Testing
  quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint code
        run: pnpm run lint
      
      - name: Type check
        run: pnpm run type-check
      
      - name: Run tests
        run: pnpm run test:unit
      
      - name: Run E2E tests
        run: pnpm run test:e2e
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
  
  # Security Scanning
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
  
  # Build and Test Docker Image
  build:
    needs: [quality, security]
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha,prefix={{branch}}-
      
      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          build-args: |
            NODE_ENV=production
            VITE_APP_ENV=${{ github.ref_name == 'main' && 'production' || 'staging' }}
            VITE_APP_VERSION=${{ github.ref_name }}
            COMMIT_HASH=${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
  
  # Deploy to Staging
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add your staging deployment commands here
  
  # Deploy to Production
  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add your production deployment commands here
  
  # Performance Testing
  performance:
    if: github.ref == 'refs/heads/main'
    needs: deploy-production
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### Kubernetes Deployment

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: element-plus-app
  labels:
    name: element-plus-app
---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: element-plus-app
data:
  API_BASE_URL: "https://api.yourdomain.com"
  APP_VERSION: "1.0.0"
  ENVIRONMENT: "production"
---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: element-plus-app
type: Opaque
data:
  SENTRY_DSN: <base64-encoded-sentry-dsn>
  GA_ID: <base64-encoded-ga-id>
---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: element-plus-app
  namespace: element-plus-app
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
      - name: app
        image: ghcr.io/your-org/element-plus-app:latest
        ports:
        - containerPort: 80
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
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
        securityContext:
          allowPrivilegeEscalation: false
          runAsNonRoot: true
          runAsUser: 1000
          capabilities:
            drop:
            - ALL
      securityContext:
        fsGroup: 1000
---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: element-plus-app-service
  namespace: element-plus-app
spec:
  selector:
    app: element-plus-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: element-plus-app-ingress
  namespace: element-plus-app
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - yourdomain.com
    secretName: app-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: element-plus-app-service
            port:
              number: 80
---
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: element-plus-app-hpa
  namespace: element-plus-app
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: element-plus-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Cloud Deployment Strategies

### AWS Deployment with CDK

```typescript
// infrastructure/aws-stack.ts
import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import { Construct } from 'constructs'

export class ElementPlusAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    
    const domainName = 'yourdomain.com'
    const subdomain = 'app'
    const fullDomainName = `${subdomain}.${domainName}`
    
    // S3 bucket for static hosting
    const bucket = new s3.Bucket(this, 'AppBucket', {
      bucketName: `${subdomain}-${domainName}-${this.account}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    })
    
    // SSL Certificate
    const certificate = new acm.Certificate(this, 'AppCertificate', {
      domainName: fullDomainName,
      validation: acm.CertificateValidation.fromDns()
    })
    
    // CloudFront Origin Access Identity
    const oai = new cloudfront.OriginAccessIdentity(this, 'AppOAI')
    bucket.grantRead(oai)
    
    // CloudFront Distribution
    const distribution = new cloudfront.Distribution(this, 'AppDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket, { originAccessIdentity: oai }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true
      },
      
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin('api.yourdomain.com'),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN
        },
        
        '/assets/*': {
          origin: new origins.S3Origin(bucket, { originAccessIdentity: oai }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: new cloudfront.CachePolicy(this, 'AssetsCachePolicy', {
            cachePolicyName: 'AssetsCache',
            defaultTtl: cdk.Duration.days(365),
            maxTtl: cdk.Duration.days(365),
            minTtl: cdk.Duration.days(365)
          })
        }
      },
      
      domainNames: [fullDomainName],
      certificate,
      
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5)
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5)
        }
      ],
      
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enabled: true,
      comment: 'Element Plus App Distribution'
    })
    
    // Route 53 DNS
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName
    })
    
    new route53.ARecord(this, 'AppARecord', {
      zone: hostedZone,
      recordName: subdomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      )
    })
    
    // Deploy static assets
    new s3deploy.BucketDeployment(this, 'AppDeployment', {
      sources: [s3deploy.Source.asset('./dist')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*']
    })
    
    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
      description: 'S3 Bucket Name'
    })
    
    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront Distribution ID'
    })
    
    new cdk.CfnOutput(this, 'DomainName', {
      value: fullDomainName,
      description: 'Application Domain Name'
    })
  }
}
```

### Vercel Deployment Configuration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api.yourdomain.com/$1"
    },
    {
      "src": "/(.*\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))$",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "env": {
    "VITE_APP_ENV": "production",
    "VITE_API_BASE_URL": "https://api.yourdomain.com"
  },
  "build": {
    "env": {
      "VITE_APP_ENV": "production"
    }
  }
}
```

## Monitoring and Alerting in Production

```typescript
// src/utils/production-monitoring.ts
export class ProductionMonitoring {
  private alertThresholds = {
    errorRate: 0.05, // 5%
    responseTime: 2000, // 2 seconds
    memoryUsage: 0.8, // 80%
    cpuUsage: 0.7 // 70%
  }
  
  constructor() {
    this.setupHealthChecks()
    this.setupPerformanceMonitoring()
    this.setupErrorTracking()
  }
  
  private setupHealthChecks() {
    // Expose health check endpoint
    if (typeof window !== 'undefined') {
      (window as any).__HEALTH_CHECK__ = () => {
        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: import.meta.env.VITE_APP_VERSION,
          environment: import.meta.env.VITE_APP_ENV,
          uptime: performance.now(),
          memory: this.getMemoryUsage(),
          features: this.getFeatureStatus()
        }
      }
    }
  }
  
  private setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    this.monitorWebVitals()
    
    // Monitor resource loading
    this.monitorResourceLoading()
    
    // Monitor API performance
    this.monitorApiPerformance()
  }
  
  private setupErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      })
    })
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        type: 'unhandled_promise_rejection',
        reason: event.reason
      })
    })
  }
  
  private monitorWebVitals() {
    // Implementation for Web Vitals monitoring
    // This would integrate with your monitoring service
  }
  
  private monitorResourceLoading() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming
        
        if (resource.duration > this.alertThresholds.responseTime) {
          this.sendAlert({
            type: 'slow_resource',
            resource: resource.name,
            duration: resource.duration,
            threshold: this.alertThresholds.responseTime
          })
        }
      })
    })
    
    observer.observe({ entryTypes: ['resource'] })
  }
  
  private monitorApiPerformance() {
    // Monitor API call performance and error rates
    // This would be integrated with your API client
  }
  
  private getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
      }
    }
    return null
  }
  
  private getFeatureStatus() {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      webAssembly: 'WebAssembly' in window,
      intersectionObserver: 'IntersectionObserver' in window,
      performanceObserver: 'PerformanceObserver' in window
    }
  }
  
  private reportError(error: any) {
    // Send error to monitoring service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...error,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }).catch(console.error)
  }
  
  private sendAlert(alert: any) {
    // Send alert to monitoring service
    fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...alert,
        timestamp: new Date().toISOString(),
        severity: this.calculateSeverity(alert)
      })
    }).catch(console.error)
  }
  
  private calculateSeverity(alert: any): 'low' | 'medium' | 'high' | 'critical' {
    // Calculate alert severity based on type and thresholds
    switch (alert.type) {
      case 'slow_resource':
        return alert.duration > this.alertThresholds.responseTime * 2 ? 'high' : 'medium'
      case 'javascript_error':
        return 'high'
      case 'unhandled_promise_rejection':
        return 'critical'
      default:
        return 'low'
    }
  }
}

// Initialize production monitoring
if (import.meta.env.PROD) {
  new ProductionMonitoring()
}
```

This comprehensive deployment guide covers all aspects of deploying Element Plus applications to production, from environment management to monitoring and alerting.