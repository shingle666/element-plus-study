# Deployment and Operations for Element Plus SSR

## Overview

This guide covers comprehensive deployment strategies and operational practices for Element Plus server-side rendering applications, including containerization, orchestration, monitoring, and production best practices.

## Docker Containerization

### Multi-Stage Dockerfile

```dockerfile
# Dockerfile
# Build stage
FROM node:18-alpine AS builder

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

# Build the application
RUN pnpm run build
RUN pnpm run build:ssr

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and production dependencies only
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/dist-ssr ./dist-ssr
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy server files
COPY --chown=nextjs:nodejs server ./server
COPY --chown=nextjs:nodejs ecosystem.config.js ./

# Install PM2 globally
RUN npm install -g pm2

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application with dumb-init and PM2
ENTRYPOINT ["dumb-init", "--"]
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
```

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'element-plus-ssr',
      script: './server/index.js',
      instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
        MAX_MEMORY_RESTART: '1G',
        NODE_OPTIONS: '--max-old-space-size=1024'
      },
      // Monitoring and logging
      monitoring: true,
      pmx: true,
      
      // Auto restart configuration
      max_memory_restart: '1G',
      max_restarts: 10,
      min_uptime: '10s',
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 3000,
      
      // Log configuration
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced PM2 features
      merge_logs: true,
      autorestart: true,
      watch: false,
      
      // Environment-specific settings
      node_args: process.env.NODE_ENV === 'production' 
        ? ['--max-old-space-size=1024', '--optimize-for-size']
        : ['--inspect=0.0.0.0:9229'],
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['production-server-1', 'production-server-2'],
      ref: 'origin/main',
      repo: 'git@github.com:your-org/element-plus-ssr.git',
      path: '/var/www/element-plus-ssr',
      'post-deploy': 'pnpm install && pnpm run build && pnpm run build:ssr && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    },
    staging: {
      user: 'deploy',
      host: 'staging-server',
      ref: 'origin/develop',
      repo: 'git@github.com:your-org/element-plus-ssr.git',
      path: '/var/www/element-plus-ssr-staging',
      'post-deploy': 'pnpm install && pnpm run build && pnpm run build:ssr && pm2 reload ecosystem.config.js --env staging'
    }
  }
}
```

### Health Check Implementation

```javascript
// healthcheck.js
const http = require('http')

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  method: 'GET',
  timeout: 3000
}

const request = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0)
  } else {
    console.error(`Health check failed with status: ${res.statusCode}`)
    process.exit(1)
  }
})

request.on('error', (err) => {
  console.error('Health check request failed:', err.message)
  process.exit(1)
})

request.on('timeout', () => {
  console.error('Health check request timed out')
  request.destroy()
  process.exit(1)
})

request.end()
```

## Kubernetes Deployment

### Kubernetes Manifests

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: element-plus-ssr
  labels:
    name: element-plus-ssr
    environment: production

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: element-plus-ssr-config
  namespace: element-plus-ssr
data:
  NODE_ENV: "production"
  PORT: "3000"
  HOST: "0.0.0.0"
  LOG_LEVEL: "info"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  MONGODB_HOST: "mongodb-service"
  MONGODB_PORT: "27017"
  MONITORING_ENABLED: "true"
  CACHE_TTL: "300"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: element-plus-ssr-secrets
  namespace: element-plus-ssr
type: Opaque
data:
  # Base64 encoded values
  JWT_SECRET: <base64-encoded-jwt-secret>
  MONGODB_PASSWORD: <base64-encoded-mongodb-password>
  REDIS_PASSWORD: <base64-encoded-redis-password>
  API_KEY: <base64-encoded-api-key>

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: element-plus-ssr
  namespace: element-plus-ssr
  labels:
    app: element-plus-ssr
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: element-plus-ssr
  template:
    metadata:
      labels:
        app: element-plus-ssr
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: element-plus-ssr
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
      - name: element-plus-ssr
        image: your-registry/element-plus-ssr:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          name: http
          protocol: TCP
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: element-plus-ssr-config
              key: NODE_ENV
        - name: PORT
          valueFrom:
            configMapKeyRef:
              name: element-plus-ssr-config
              key: PORT
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: element-plus-ssr-secrets
              key: JWT_SECRET
        - name: MONGODB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: element-plus-ssr-secrets
              key: MONGODB_PASSWORD
        envFrom:
        - configMapRef:
            name: element-plus-ssr-config
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        startupProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 30
        volumeMounts:
        - name: logs
          mountPath: /app/logs
        - name: tmp
          mountPath: /tmp
      volumes:
      - name: logs
        emptyDir: {}
      - name: tmp
        emptyDir: {}
      nodeSelector:
        kubernetes.io/os: linux
      tolerations:
      - key: "node.kubernetes.io/not-ready"
        operator: "Exists"
        effect: "NoExecute"
        tolerationSeconds: 300
      - key: "node.kubernetes.io/unreachable"
        operator: "Exists"
        effect: "NoExecute"
        tolerationSeconds: 300

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: element-plus-ssr-service
  namespace: element-plus-ssr
  labels:
    app: element-plus-ssr
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  selector:
    app: element-plus-ssr

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: element-plus-ssr-ingress
  namespace: element-plus-ssr
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "60"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "60"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - your-domain.com
    - www.your-domain.com
    secretName: element-plus-ssr-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: element-plus-ssr-service
            port:
              number: 80
  - host: www.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: element-plus-ssr-service
            port:
              number: 80

---
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: element-plus-ssr-hpa
  namespace: element-plus-ssr
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: element-plus-ssr
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
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
      - type: Pods
        value: 2
        periodSeconds: 60
      selectPolicy: Max
```

### Service Account and RBAC

```yaml
# k8s/rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: element-plus-ssr
  namespace: element-plus-ssr

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: element-plus-ssr
  name: element-plus-ssr-role
rules:
- apiGroups: [""]
  resources: ["pods", "services", "endpoints"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: element-plus-ssr-rolebinding
  namespace: element-plus-ssr
subjects:
- kind: ServiceAccount
  name: element-plus-ssr
  namespace: element-plus-ssr
roleRef:
  kind: Role
  name: element-plus-ssr-role
  apiGroup: rbac.authorization.k8s.io
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Element Plus SSR

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'pnpm'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
      
    - name: Run linting
      run: pnpm run lint
      
    - name: Run type checking
      run: pnpm run type-check
      
    - name: Run unit tests
      run: pnpm run test:unit
      
    - name: Run E2E tests
      run: pnpm run test:e2e
      
    - name: Build application
      run: |
        pnpm run build
        pnpm run build:ssr
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v4
      with:
        name: build-artifacts
        path: |
          dist/
          dist-ssr/
        retention-days: 1

  security:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Run security audit
      run: |
        npm audit --audit-level=high
        
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high

  build-and-push:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: build-artifacts
        
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
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
          
    - name: Build and push Docker image
      id: build
      uses: docker/build-push-action@v5
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        
    - name: Generate SBOM
      uses: anchore/sbom-action@v0
      with:
        image: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        format: spdx-json
        output-file: sbom.spdx.json
        
    - name: Upload SBOM
      uses: actions/upload-artifact@v4
      with:
        name: sbom
        path: sbom.spdx.json

  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'v1.28.0'
        
    - name: Configure kubectl
      run: |
        echo "${{ secrets.KUBE_CONFIG_STAGING }}" | base64 -d > kubeconfig
        export KUBECONFIG=kubeconfig
        
    - name: Deploy to staging
      run: |
        export KUBECONFIG=kubeconfig
        
        # Update image in deployment
        kubectl set image deployment/element-plus-ssr \
          element-plus-ssr=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:develop \
          -n element-plus-ssr-staging
          
        # Wait for rollout to complete
        kubectl rollout status deployment/element-plus-ssr \
          -n element-plus-ssr-staging --timeout=300s
          
        # Verify deployment
        kubectl get pods -n element-plus-ssr-staging
        
    - name: Run smoke tests
      run: |
        # Wait for service to be ready
        sleep 30
        
        # Run basic health checks
        curl -f https://staging.your-domain.com/health || exit 1
        curl -f https://staging.your-domain.com/ready || exit 1

  deploy-production:
    needs: [build-and-push, deploy-staging]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'v1.28.0'
        
    - name: Configure kubectl
      run: |
        echo "${{ secrets.KUBE_CONFIG_PRODUCTION }}" | base64 -d > kubeconfig
        export KUBECONFIG=kubeconfig
        
    - name: Deploy to production
      run: |
        export KUBECONFIG=kubeconfig
        
        # Update image in deployment
        kubectl set image deployment/element-plus-ssr \
          element-plus-ssr=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest \
          -n element-plus-ssr
          
        # Wait for rollout to complete
        kubectl rollout status deployment/element-plus-ssr \
          -n element-plus-ssr --timeout=600s
          
        # Verify deployment
        kubectl get pods -n element-plus-ssr
        
    - name: Run production smoke tests
      run: |
        # Wait for service to be ready
        sleep 60
        
        # Run comprehensive health checks
        curl -f https://your-domain.com/health || exit 1
        curl -f https://your-domain.com/ready || exit 1
        
        # Test critical user journeys
        npm run test:smoke-production
        
    - name: Notify deployment success
      uses: 8398a7/action-slack@v3
      with:
        status: success
        text: '🚀 Production deployment successful!'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
      if: success()
      
    - name: Notify deployment failure
      uses: 8398a7/action-slack@v3
      with:
        status: failure
        text: '❌ Production deployment failed!'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
      if: failure()
```

## Monitoring and Observability

### Prometheus Metrics

```typescript
// src/server/monitoring/metrics.ts
import { register, Counter, Histogram, Gauge } from 'prom-client'
import { Request, Response, NextFunction } from 'express'

// Create metrics
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
})

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
})

const ssrRenderDuration = new Histogram({
  name: 'ssr_render_duration_seconds',
  help: 'Duration of SSR rendering in seconds',
  labelNames: ['route'],
  buckets: [0.1, 0.2, 0.5, 1, 2, 5]
})

const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
})

const memoryUsage = new Gauge({
  name: 'nodejs_memory_usage_bytes',
  help: 'Node.js memory usage in bytes',
  labelNames: ['type']
})

const cacheHitRate = new Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_type']
})

const cacheMissRate = new Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  labelNames: ['cache_type']
})

// Register metrics
register.registerMetric(httpRequestsTotal)
register.registerMetric(httpRequestDuration)
register.registerMetric(ssrRenderDuration)
register.registerMetric(activeConnections)
register.registerMetric(memoryUsage)
register.registerMetric(cacheHitRate)
register.registerMetric(cacheMissRate)

// Middleware for HTTP metrics
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  // Increment active connections
  activeConnections.inc()
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    const route = req.route?.path || req.path
    
    // Record metrics
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode
    })
    
    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode
      },
      duration
    )
    
    // Decrement active connections
    activeConnections.dec()
  })
  
  next()
}

// Memory usage collector
setInterval(() => {
  const usage = process.memoryUsage()
  
  memoryUsage.set({ type: 'heap_used' }, usage.heapUsed)
  memoryUsage.set({ type: 'heap_total' }, usage.heapTotal)
  memoryUsage.set({ type: 'external' }, usage.external)
  memoryUsage.set({ type: 'rss' }, usage.rss)
}, 10000)

// SSR render time tracking
export const trackSSRRender = (route: string, duration: number) => {
  ssrRenderDuration.observe({ route }, duration / 1000)
}

// Cache metrics tracking
export const trackCacheHit = (cacheType: string) => {
  cacheHitRate.inc({ cache_type: cacheType })
}

export const trackCacheMiss = (cacheType: string) => {
  cacheMissRate.inc({ cache_type: cacheType })
}

// Metrics endpoint
export const metricsHandler = async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType)
    res.end(await register.metrics())
  } catch (error) {
    res.status(500).end(error)
  }
}
```

### Logging Configuration

```typescript
// src/server/logging/logger.ts
import winston from 'winston'
import 'winston-daily-rotate-file'

const { combine, timestamp, errors, json, printf, colorize } = winston.format

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`
})

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: {
    service: 'element-plus-ssr',
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss' }),
        consoleFormat
      ),
      silent: process.env.NODE_ENV === 'test'
    }),
    
    // File transport for all logs
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: combine(
        timestamp(),
        json()
      )
    }),
    
    // Separate file for errors
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      format: combine(
        timestamp(),
        json()
      )
    })
  ],
  
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
})

// Add structured logging methods
export const structuredLogger = {
  info: (message: string, meta?: any) => {
    logger.info(message, meta)
  },
  
  error: (message: string, error?: Error, meta?: any) => {
    logger.error(message, {
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : undefined,
      ...meta
    })
  },
  
  warn: (message: string, meta?: any) => {
    logger.warn(message, meta)
  },
  
  debug: (message: string, meta?: any) => {
    logger.debug(message, meta)
  },
  
  // Request logging
  request: (req: any, res: any, duration: number) => {
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      requestId: req.requestId
    })
  },
  
  // SSR logging
  ssr: (route: string, duration: number, cacheHit: boolean) => {
    logger.info('SSR Render', {
      route,
      duration: `${duration}ms`,
      cacheHit,
      type: 'ssr_render'
    })
  },
  
  // Performance logging
  performance: (metric: string, value: number, unit: string, meta?: any) => {
    logger.info('Performance Metric', {
      metric,
      value,
      unit,
      type: 'performance',
      ...meta
    })
  }
}

export default logger
```

This comprehensive guide covers deployment and operations for Element Plus SSR applications, including containerization, Kubernetes orchestration, CI/CD pipelines, and monitoring strategies.