# 第57天：Element Plus SSR 部署与运维

## 学习目标

* 掌握 SSR 应用的部署策略和最佳实践
* 学会配置生产环境的服务器和负载均衡
* 了解 SSR 应用的监控和日志管理
* 掌握自动化部署和持续集成流程

## 知识点概览

### 1. 部署架构设计

#### 1.1 生产环境架构

```typescript
// config/deployment.ts
export interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production'
  
  // 服务器配置
  server: {
    host: string
    port: number
    workers: number
    maxMemory: string
    timeout: number
  }
  
  // 负载均衡配置
  loadBalancer: {
    enabled: boolean
    algorithm: 'round-robin' | 'least-connections' | 'ip-hash'
    healthCheck: {
      path: string
      interval: number
      timeout: number
      retries: number
    }
  }
  
  // 缓存配置
  cache: {
    redis: {
      cluster: boolean
      nodes: string[]
      password: string
      maxRetries: number
    }
    cdn: {
      enabled: boolean
      provider: 'cloudflare' | 'aws' | 'aliyun'
      domain: string
      ttl: number
    }
  }
  
  // 监控配置
  monitoring: {
    enabled: boolean
    apm: {
      provider: 'newrelic' | 'datadog' | 'elastic'
      apiKey: string
    }
    logging: {
      level: 'error' | 'warn' | 'info' | 'debug'
      transport: 'file' | 'elasticsearch' | 'cloudwatch'
    }
  }
  
  // 安全配置
  security: {
    https: {
      enabled: boolean
      cert: string
      key: string
      hsts: boolean
    }
    cors: {
      origin: string[]
      credentials: boolean
    }
    rateLimit: {
      windowMs: number
      max: number
    }
  }
}

// 环境配置
export const deploymentConfigs: Record<string, DeploymentConfig> = {
  development: {
    environment: 'development',
    server: {
      host: 'localhost',
      port: 3000,
      workers: 1,
      maxMemory: '512MB',
      timeout: 30000
    },
    loadBalancer: {
      enabled: false,
      algorithm: 'round-robin',
      healthCheck: {
        path: '/health',
        interval: 30000,
        timeout: 5000,
        retries: 3
      }
    },
    cache: {
      redis: {
        cluster: false,
        nodes: ['localhost:6379'],
        password: '',
        maxRetries: 3
      },
      cdn: {
        enabled: false,
        provider: 'cloudflare',
        domain: '',
        ttl: 3600
      }
    },
    monitoring: {
      enabled: true,
      apm: {
        provider: 'elastic',
        apiKey: ''
      },
      logging: {
        level: 'debug',
        transport: 'file'
      }
    },
    security: {
      https: {
        enabled: false,
        cert: '',
        key: '',
        hsts: false
      },
      cors: {
        origin: ['http://localhost:3000'],
        credentials: true
      },
      rateLimit: {
        windowMs: 60000,
        max: 1000
      }
    }
  },
  
  production: {
    environment: 'production',
    server: {
      host: '0.0.0.0',
      port: 3000,
      workers: 4,
      maxMemory: '2GB',
      timeout: 10000
    },
    loadBalancer: {
      enabled: true,
      algorithm: 'least-connections',
      healthCheck: {
        path: '/health',
        interval: 10000,
        timeout: 3000,
        retries: 3
      }
    },
    cache: {
      redis: {
        cluster: true,
        nodes: [
          'redis-1.internal:6379',
          'redis-2.internal:6379',
          'redis-3.internal:6379'
        ],
        password: process.env.REDIS_PASSWORD || '',
        maxRetries: 5
      },
      cdn: {
        enabled: true,
        provider: 'cloudflare',
        domain: 'cdn.example.com',
        ttl: 86400
      }
    },
    monitoring: {
      enabled: true,
      apm: {
        provider: 'newrelic',
        apiKey: process.env.NEW_RELIC_LICENSE_KEY || ''
      },
      logging: {
        level: 'info',
        transport: 'elasticsearch'
      }
    },
    security: {
      https: {
        enabled: true,
        cert: '/etc/ssl/certs/app.crt',
        key: '/etc/ssl/private/app.key',
        hsts: true
      },
      cors: {
        origin: ['https://example.com', 'https://www.example.com'],
        credentials: true
      },
      rateLimit: {
        windowMs: 60000,
        max: 100
      }
    }
  }
}
```

#### 1.2 Docker 容器化

```dockerfile
# Dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 生产阶段
FROM node:18-alpine AS production

# 安装 dumb-init
RUN apk add --no-cache dumb-init

# 创建应用用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 只安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 从构建阶段复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 复制启动脚本
COPY --chown=nextjs:nodejs scripts/start.sh ./
RUN chmod +x start.sh

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# 启动应用
ENTRYPOINT ["dumb-init", "--"]
CMD ["./start.sh"]
```

```bash
#!/bin/bash
# scripts/start.sh
set -e

# 等待依赖服务
echo "Waiting for dependencies..."

# 等待 Redis
until nc -z ${REDIS_HOST:-localhost} ${REDIS_PORT:-6379}; do
  echo "Waiting for Redis..."
  sleep 2
done

# 等待数据库（如果需要）
if [ -n "$DATABASE_URL" ]; then
  until nc -z ${DB_HOST:-localhost} ${DB_PORT:-5432}; do
    echo "Waiting for database..."
    sleep 2
  done
fi

echo "Dependencies are ready!"

# 启动应用
if [ "$NODE_ENV" = "production" ]; then
  # 生产模式：使用 PM2 集群
  exec pnpm start:cluster
else
  # 开发模式：单进程
  exec pnpm start
fi
```

```javascript
// healthcheck.js
const http = require('http')

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 2000
}

const request = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`)
  if (res.statusCode === 200) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})

request.on('error', (err) => {
  console.error('Health check failed:', err)
  process.exit(1)
})

request.end()
```

#### 1.3 Kubernetes 部署配置

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: element-plus-ssr
  labels:
    name: element-plus-ssr

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: element-plus-ssr
data:
  NODE_ENV: "production"
  PORT: "3000"
  REDIS_HOST: "redis-service"
  REDIS_PORT: "6379"
  LOG_LEVEL: "info"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: element-plus-ssr
type: Opaque
data:
  REDIS_PASSWORD: <base64-encoded-password>
  NEW_RELIC_LICENSE_KEY: <base64-encoded-key>
  DATABASE_URL: <base64-encoded-url>

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: element-plus-ssr
  namespace: element-plus-ssr
  labels:
    app: element-plus-ssr
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
    spec:
      containers:
      - name: app
        image: element-plus-ssr:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
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
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh", "-c", "sleep 15"]
      terminationGracePeriodSeconds: 30

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
  selector:
    app: element-plus-ssr
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
  type: ClusterIP

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
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - example.com
    - www.example.com
    secretName: app-tls
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: element-plus-ssr-service
            port:
              number: 80
  - host: www.example.com
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
```

### 2. 监控和日志系统

#### 2.1 应用性能监控

```typescript
// utils/monitoring.ts
import { Request, Response, NextFunction } from 'express'
import { performance } from 'perf_hooks'

export class ApplicationMonitor {
  private metrics: Map<string, MetricData> = new Map()
  private alerts: AlertRule[] = []
  
  constructor(private config: MonitoringConfig) {
    this.setupMetricsCollection()
    this.setupAlerts()
  }
  
  // 设置指标收集
  private setupMetricsCollection() {
    // 收集系统指标
    setInterval(() => {
      this.collectSystemMetrics()
    }, this.config.metricsInterval)
    
    // 收集应用指标
    setInterval(() => {
      this.collectApplicationMetrics()
    }, this.config.metricsInterval)
  }
  
  // 收集系统指标
  private collectSystemMetrics() {
    const memUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()
    
    this.recordMetric('system.memory.used', memUsage.heapUsed / 1024 / 1024)
    this.recordMetric('system.memory.total', memUsage.heapTotal / 1024 / 1024)
    this.recordMetric('system.cpu.user', cpuUsage.user / 1000)
    this.recordMetric('system.cpu.system', cpuUsage.system / 1000)
    
    // 检查告警
    this.checkAlerts()
  }
  
  // 收集应用指标
  private collectApplicationMetrics() {
    // 这里可以收集应用特定的指标
    const activeConnections = this.getActiveConnections()
    const cacheHitRate = this.getCacheHitRate()
    
    this.recordMetric('app.connections.active', activeConnections)
    this.recordMetric('app.cache.hit_rate', cacheHitRate)
  }
  
  // 记录指标
  private recordMetric(name: string, value: number) {
    const now = Date.now()
    const existing = this.metrics.get(name)
    
    if (existing) {
      existing.values.push({ timestamp: now, value })
      // 保持最近 1000 个数据点
      if (existing.values.length > 1000) {
        existing.values.shift()
      }
      existing.lastUpdated = now
    } else {
      this.metrics.set(name, {
        name,
        values: [{ timestamp: now, value }],
        lastUpdated: now
      })
    }
  }
  
  // 请求监控中间件
  requestMonitor() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = performance.now()
      const startMemory = process.memoryUsage().heapUsed
      
      // 记录请求开始
      this.recordMetric('http.requests.total', 1)
      
      // 监听响应完成
      res.on('finish', () => {
        const duration = performance.now() - startTime
        const memoryDelta = process.memoryUsage().heapUsed - startMemory
        
        // 记录响应时间
        this.recordMetric('http.response_time', duration)
        
        // 记录内存使用变化
        this.recordMetric('http.memory_delta', memoryDelta / 1024 / 1024)
        
        // 记录状态码
        this.recordMetric(`http.status.${res.statusCode}`, 1)
        
        // 记录路由指标
        const route = req.route?.path || req.path
        this.recordMetric(`http.routes.${route}.requests`, 1)
        this.recordMetric(`http.routes.${route}.response_time`, duration)
        
        // 检查慢请求
        if (duration > this.config.slowRequestThreshold) {
          this.recordSlowRequest(req, res, duration)
        }
      })
      
      next()
    }
  }
  
  // 记录慢请求
  private recordSlowRequest(req: Request, res: Response, duration: number) {
    const slowRequest = {
      url: req.url,
      method: req.method,
      duration,
      statusCode: res.statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date().toISOString()
    }
    
    console.warn('Slow request detected:', slowRequest)
    
    // 发送到监控服务
    this.sendToMonitoringService('slow_request', slowRequest)
  }
  
  // 设置告警规则
  private setupAlerts() {
    this.alerts = [
      {
        name: 'High Memory Usage',
        metric: 'system.memory.used',
        condition: 'greater_than',
        threshold: 1500, // MB
        duration: 300000, // 5 minutes
        severity: 'warning'
      },
      {
        name: 'Critical Memory Usage',
        metric: 'system.memory.used',
        condition: 'greater_than',
        threshold: 1800, // MB
        duration: 60000, // 1 minute
        severity: 'critical'
      },
      {
        name: 'High Response Time',
        metric: 'http.response_time',
        condition: 'average_greater_than',
        threshold: 1000, // ms
        duration: 300000, // 5 minutes
        severity: 'warning'
      },
      {
        name: 'Low Cache Hit Rate',
        metric: 'app.cache.hit_rate',
        condition: 'less_than',
        threshold: 0.8, // 80%
        duration: 600000, // 10 minutes
        severity: 'warning'
      }
    ]
  }
  
  // 检查告警
  private checkAlerts() {
    this.alerts.forEach(alert => {
      const metric = this.metrics.get(alert.metric)
      if (!metric) return
      
      const recentValues = this.getRecentValues(metric, alert.duration)
      if (recentValues.length === 0) return
      
      let triggered = false
      
      switch (alert.condition) {
        case 'greater_than':
          triggered = recentValues.every(v => v.value > alert.threshold)
          break
        case 'less_than':
          triggered = recentValues.every(v => v.value < alert.threshold)
          break
        case 'average_greater_than':
          const avg = recentValues.reduce((sum, v) => sum + v.value, 0) / recentValues.length
          triggered = avg > alert.threshold
          break
      }
      
      if (triggered) {
        this.triggerAlert(alert, recentValues)
      }
    })
  }
  
  // 获取最近的值
  private getRecentValues(metric: MetricData, duration: number): MetricValue[] {
    const cutoff = Date.now() - duration
    return metric.values.filter(v => v.timestamp > cutoff)
  }
  
  // 触发告警
  private triggerAlert(alert: AlertRule, values: MetricValue[]) {
    const alertData = {
      alert: alert.name,
      metric: alert.metric,
      severity: alert.severity,
      threshold: alert.threshold,
      currentValue: values[values.length - 1]?.value,
      timestamp: new Date().toISOString()
    }
    
    console.error('Alert triggered:', alertData)
    
    // 发送告警通知
    this.sendAlert(alertData)
  }
  
  // 发送告警
  private async sendAlert(alertData: any) {
    // 发送到 Slack
    if (this.config.slack?.webhook) {
      await this.sendSlackAlert(alertData)
    }
    
    // 发送邮件
    if (this.config.email?.enabled) {
      await this.sendEmailAlert(alertData)
    }
    
    // 发送到监控服务
    this.sendToMonitoringService('alert', alertData)
  }
  
  // 发送 Slack 告警
  private async sendSlackAlert(alertData: any) {
    try {
      const response = await fetch(this.config.slack!.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 Alert: ${alertData.alert}`,
          attachments: [{
            color: alertData.severity === 'critical' ? 'danger' : 'warning',
            fields: [
              { title: 'Metric', value: alertData.metric, short: true },
              { title: 'Current Value', value: alertData.currentValue, short: true },
              { title: 'Threshold', value: alertData.threshold, short: true },
              { title: 'Severity', value: alertData.severity, short: true }
            ],
            timestamp: Math.floor(Date.now() / 1000)
          }]
        })
      })
      
      if (!response.ok) {
        console.error('Failed to send Slack alert:', response.statusText)
      }
    } catch (error) {
      console.error('Error sending Slack alert:', error)
    }
  }
  
  // 发送到监控服务
  private sendToMonitoringService(type: string, data: any) {
    // 这里可以集成 New Relic、DataDog 等监控服务
    if (typeof window !== 'undefined' && window.newrelic) {
      window.newrelic.addPageAction(type, data)
    }
  }
  
  // 获取指标数据
  getMetrics(): MetricData[] {
    return Array.from(this.metrics.values())
  }
  
  // 获取特定指标
  getMetric(name: string): MetricData | undefined {
    return this.metrics.get(name)
  }
  
  // 获取活跃连接数（示例）
  private getActiveConnections(): number {
    // 这里应该实现实际的连接计数逻辑
    return Math.floor(Math.random() * 100)
  }
  
  // 获取缓存命中率（示例）
  private getCacheHitRate(): number {
    // 这里应该实现实际的缓存命中率计算
    return 0.85 + Math.random() * 0.1
  }
}

// 类型定义
interface MonitoringConfig {
  metricsInterval: number
  slowRequestThreshold: number
  slack?: {
    webhook: string
  }
  email?: {
    enabled: boolean
    smtp: {
      host: string
      port: number
      user: string
      pass: string
    }
  }
}

interface MetricData {
  name: string
  values: MetricValue[]
  lastUpdated: number
}

interface MetricValue {
  timestamp: number
  value: number
}

interface AlertRule {
  name: string
  metric: string
  condition: 'greater_than' | 'less_than' | 'average_greater_than'
  threshold: number
  duration: number
  severity: 'warning' | 'critical'
}
```

#### 2.2 结构化日志系统

```typescript
// utils/logger.ts
import winston from 'winston'
import { ElasticsearchTransport } from 'winston-elasticsearch'

export class StructuredLogger {
  private logger: winston.Logger
  private requestId: string = ''
  
  constructor(private config: LoggerConfig) {
    this.logger = this.createLogger()
  }
  
  // 创建日志器
  private createLogger(): winston.Logger {
    const transports: winston.transport[] = []
    
    // 控制台输出
    if (this.config.console.enabled) {
      transports.push(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`
          })
        )
      }))
    }
    
    // 文件输出
    if (this.config.file.enabled) {
      transports.push(new winston.transports.File({
        filename: this.config.file.path,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        maxsize: this.config.file.maxSize,
        maxFiles: this.config.file.maxFiles
      }))
    }
    
    // Elasticsearch 输出
    if (this.config.elasticsearch.enabled) {
      transports.push(new ElasticsearchTransport({
        level: this.config.level,
        clientOpts: {
          node: this.config.elasticsearch.node,
          auth: this.config.elasticsearch.auth
        },
        index: this.config.elasticsearch.index,
        transformer: (logData) => {
          return {
            '@timestamp': new Date().toISOString(),
            level: logData.level,
            message: logData.message,
            meta: logData.meta,
            service: 'element-plus-ssr',
            environment: process.env.NODE_ENV,
            requestId: this.requestId
          }
        }
      }))
    }
    
    return winston.createLogger({
      level: this.config.level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports,
      exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
      ],
      rejectionHandlers: [
        new winston.transports.File({ filename: 'rejections.log' })
      ]
    })
  }
  
  // 设置请求 ID
  setRequestId(requestId: string) {
    this.requestId = requestId
  }
  
  // 日志方法
  error(message: string, meta?: any) {
    this.logger.error(message, { ...meta, requestId: this.requestId })
  }
  
  warn(message: string, meta?: any) {
    this.logger.warn(message, { ...meta, requestId: this.requestId })
  }
  
  info(message: string, meta?: any) {
    this.logger.info(message, { ...meta, requestId: this.requestId })
  }
  
  debug(message: string, meta?: any) {
    this.logger.debug(message, { ...meta, requestId: this.requestId })
  }
  
  // 性能日志
  performance(operation: string, duration: number, meta?: any) {
    this.logger.info('Performance metric', {
      type: 'performance',
      operation,
      duration,
      ...meta,
      requestId: this.requestId
    })
  }
  
  // 业务日志
  business(event: string, data?: any) {
    this.logger.info('Business event', {
      type: 'business',
      event,
      data,
      requestId: this.requestId
    })
  }
  
  // 安全日志
  security(event: string, details?: any) {
    this.logger.warn('Security event', {
      type: 'security',
      event,
      details,
      requestId: this.requestId
    })
  }
  
  // 请求日志中间件
  requestLogger() {
    return (req: any, res: any, next: any) => {
      const requestId = req.headers['x-request-id'] || this.generateRequestId()
      req.requestId = requestId
      this.setRequestId(requestId)
      
      const startTime = Date.now()
      
      // 记录请求开始
      this.info('Request started', {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        headers: this.sanitizeHeaders(req.headers)
      })
      
      // 监听响应完成
      res.on('finish', () => {
        const duration = Date.now() - startTime
        
        this.info('Request completed', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
          contentLength: res.get('Content-Length')
        })
        
        // 记录性能指标
        this.performance('http_request', duration, {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode
        })
      })
      
      next()
    }
  }
  
  // 生成请求 ID
  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }
  
  // 清理敏感头信息
  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers }
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key']
    
    sensitiveHeaders.forEach(header => {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]'
      }
    })
    
    return sanitized
  }
}

// 类型定义
interface LoggerConfig {
  level: string
  console: {
    enabled: boolean
  }
  file: {
    enabled: boolean
    path: string
    maxSize: number
    maxFiles: number
  }
  elasticsearch: {
    enabled: boolean
    node: string
    auth?: {
      username: string
      password: string
    }
    index: string
  }
}
```

### 3. 自动化部署流程

#### 3.1 CI/CD 管道

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
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
        node-version: '18'
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
    
    - name: Run integration tests
      run: pnpm run test:integration
    
    - name: Run E2E tests
      run: pnpm run test:e2e
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Run security audit
      run: npm audit --audit-level high
    
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
    
    - name: Run SAST scan
      uses: github/codeql-action/init@v2
      with:
        languages: javascript
    
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2

  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
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
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push Docker image
      id: build
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
        platforms: linux/amd64,linux/arm64

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    environment: staging
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment"
        # 这里添加部署到 staging 环境的脚本
    
    - name: Run smoke tests
      run: |
        echo "Running smoke tests on staging"
        # 这里添加冒烟测试脚本

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure kubectl
      uses: azure/k8s-set-context@v1
      with:
        method: kubeconfig
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
    
    - name: Deploy to production
      run: |
        # 更新 Kubernetes 部署
        kubectl set image deployment/element-plus-ssr \
          app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
          -n element-plus-ssr
        
        # 等待部署完成
        kubectl rollout status deployment/element-plus-ssr -n element-plus-ssr
    
    - name: Verify deployment
      run: |
        # 验证部署是否成功
        kubectl get pods -n element-plus-ssr
        
        # 运行健康检查
        curl -f https://example.com/health || exit 1
    
    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      if: always()
```

#### 3.2 部署脚本

```bash
#!/bin/bash
# scripts/deploy.sh
set -e

# 配置
ENVIRONMENT=${1:-staging}
IMAGE_TAG=${2:-latest}
NAMESPACE="element-plus-ssr"
DEPLOYMENT_NAME="element-plus-ssr"

echo "Deploying to $ENVIRONMENT environment..."

# 验证环境
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
  echo "Error: Environment must be 'staging' or 'production'"
  exit 1
fi

# 检查 kubectl 连接
if ! kubectl cluster-info &> /dev/null; then
  echo "Error: Cannot connect to Kubernetes cluster"
  exit 1
fi

# 检查命名空间
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
  echo "Creating namespace $NAMESPACE..."
  kubectl create namespace $NAMESPACE
fi

# 应用配置
echo "Applying Kubernetes configurations..."
kubectl apply -f k8s/ -n $NAMESPACE

# 更新镜像
echo "Updating deployment image to $IMAGE_TAG..."
kubectl set image deployment/$DEPLOYMENT_NAME \
  app=ghcr.io/your-org/element-plus-ssr:$IMAGE_TAG \
  -n $NAMESPACE

# 等待部署完成
echo "Waiting for deployment to complete..."
kubectl rollout status deployment/$DEPLOYMENT_NAME -n $NAMESPACE --timeout=600s

# 验证部署
echo "Verifying deployment..."
kubectl get pods -n $NAMESPACE

# 运行健康检查
echo "Running health checks..."
SERVICE_URL=$(kubectl get ingress -n $NAMESPACE -o jsonpath='{.items[0].spec.rules[0].host}')
if [[ -n "$SERVICE_URL" ]]; then
  for i in {1..5}; do
    if curl -f "https://$SERVICE_URL/health" &> /dev/null; then
      echo "Health check passed"
      break
    else
      echo "Health check failed, retrying in 10 seconds..."
      sleep 10
    fi
    
    if [[ $i -eq 5 ]]; then
      echo "Health check failed after 5 attempts"
      exit 1
    fi
  done
fi

echo "Deployment completed successfully!"

# 发送通知
if [[ -n "$SLACK_WEBHOOK" ]]; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"🚀 Deployment to $ENVIRONMENT completed successfully!\"}" \
    $SLACK_WEBHOOK
fi
```

## 4. 实践练习

1. **容器化部署实践**：
   - 创建 Docker 镜像
   - 配置 Kubernetes 部署
   - 设置负载均衡和自动扩缩容

2. **监控系统实践**：
   - 集成 APM 监控
   - 配置告警规则
   - 设置日志聚合

3. **CI/CD 流程实践**：
   - 配置自动化测试
   - 实现自动部署
   - 设置部署回滚机制

## 5. 学习资源

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Prometheus Monitoring](https://prometheus.io/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)

## 6. 作业

- 设计完整的生产环境部署架构
- 实现自动化监控和告警系统
- 配置 CI/CD 管道和部署流程
- 创建运维手册和故障排除指南

## 总结

通过第57天的学习，我们全面掌握了：

1. **部署架构**：设计了完整的生产环境部署方案
2. **容器化**：实现了 Docker 容器化和 Kubernetes 编排
3. **监控系统**：建立了全面的应用监控和日志系统
4. **自动化部署**：配置了 CI/CD 管道和自动化部署流程

这些技能将帮助我们构建可靠、可扩展的生产环境。